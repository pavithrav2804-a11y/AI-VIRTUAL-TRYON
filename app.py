from flask import Flask, render_template, request, url_for, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import logging
import os
import random
import uuid
import numpy as np
import csv
from collections import Counter

try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing import image
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False

try:
    from flask_sqlalchemy import SQLAlchemy
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False

try:
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

BASE_DIR      = app.root_path
UPLOAD_SUBDIR = 'uploads'
app.config['UPLOAD_FOLDER']                  = os.path.join(BASE_DIR, 'static', UPLOAD_SUBDIR)
app.config['MAX_CONTENT_LENGTH']             = 16 * 1024 * 1024
app.config['SQLALCHEMY_DATABASE_URI']        = 'sqlite:///wardrobe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Build Image Mapping
VALID_IMAGES = set()
try:
    for f in os.listdir('images'):
        if f.endswith('.jpg'):
            VALID_IMAGES.add(f.split('.')[0])
except Exception as e:
    print("Warning: images folder could not be read.", e)

IMAGE_DB = {}
try:
    with open('styles.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            if len(row) < 10: continue
            id_val, gender_val, cat, sub, art, col, sea, year, usa, name = row[:10]
            if id_val not in VALID_IMAGES: continue
            
            t_genders = ['men'] if gender_val in ['Men', 'Boys'] else ['women'] if gender_val in ['Women', 'Girls'] else ['men', 'women']
            for g in t_genders:
                gk, ak, ck, uk = g, art.lower(), col.lower(), usa.lower()
                IMAGE_DB.setdefault((gk, ak, ck, uk), []).append((id_val, name))
                IMAGE_DB.setdefault((gk, ak, 'any', uk), []).append((id_val, name))
                IMAGE_DB.setdefault((gk, ak, ck, 'any'), []).append((id_val, name))
                IMAGE_DB.setdefault((gk, ak, 'any', 'any'), []).append((id_val, name))
except Exception as e:
    print("Warning: styles.csv could not be loaded.", e)

def get_product_image(gender, article_type, base_color, occasion="casual"):
    g = gender.lower()
    art = article_type.lower()
    col = base_color.lower()
    occ = occasion.lower()
    
    # Strict
    key = (g, art, col, occ)
    if key in IMAGE_DB:
        id_val, name = random.choice(IMAGE_DB[key])
        return f"/images/{id_val}.jpg", name
        
    # Tone loss
    fb_occ = (g, art, 'any', occ)
    if fb_occ in IMAGE_DB:
        id_val, name = random.choice(IMAGE_DB[fb_occ])
        return f"/images/{id_val}.jpg", name
        
    # Occasion loss
    fb_col = (g, art, col, 'any')
    if fb_col in IMAGE_DB:
        id_val, name = random.choice(IMAGE_DB[fb_col])
        return f"/images/{id_val}.jpg", name

    fb_key = (g, art, 'any', 'any')
    if fb_key in IMAGE_DB:
        id_val, name = random.choice(IMAGE_DB[fb_key])
        return f"/images/{id_val}.jpg", name
        
    return ("https://via.placeholder.com/300x400.png?text=Not+Found", f"{base_color.title()} {article_type.title()}")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
class_names        = ['dresses', 'jeans', 'skirts', 'tops', 'tshirts']


# DATABASE
if DB_AVAILABLE:
    db = SQLAlchemy(app)
    class Wardrobe(db.Model):
        id        = db.Column(db.Integer, primary_key=True)
        image     = db.Column(db.String(200), nullable=False)
        category  = db.Column(db.String(50),  nullable=False)
        skin_tone = db.Column(db.String(50),  nullable=False)
        style     = db.Column(db.String(50),  nullable=False)
    with app.app_context():
        db.create_all()
else:
    db = None


#  MODEL LOADING
model = yolo_model = None

if TF_AVAILABLE:
    try:
        print("Loading image classification model...")
        model = tf.keras.models.load_model('women_model.h5')
        print("Keras model loaded successfully")
    except Exception as e:
        print(f"Model load failed: {e}")
        model = None

if YOLO_AVAILABLE:
    try:
        yolo_model = YOLO("yolov8n.pt")
        print("YOLO loaded")
    except Exception as e:
        print(f"YOLO not loaded: {e}")


#SKIN TONE → OUTFIT DATABASE
SKIN_OUTFITS = {
    "Fair": {
        "fitzpatrick":  "Type I-II",
        "undertone":    "Cool",
        "best_colors": ["Navy Blue", "Green", "Maroon", "Purple", "Red"],
        "avoid_colors": ["Yellow", "Orange"],
        "accessories": ["Black", "Silver", "Blue"],
        "tip": "Darker, rich colors make fair skin glow."
    },
    "Medium": {
        "fitzpatrick":  "Type III-IV",
        "undertone":    "Warm / Neutral",
        "best_colors": ["Mustard", "Olive", "Rust", "Brown", "Teal"],
        "avoid_colors": ["Beige", "Grey"],
        "accessories": ["Gold", "Brown", "Bronze"],
        "tip": "Warm, earthy tones are incredibly flattering."
    },
    "Dusky": {
        "fitzpatrick":  "Type IV-V",
        "undertone":    "Warm / Deep",
        "best_colors": ["Maroon", "Olive", "Mustard", "Bronze", "Teal"],
        "avoid_colors": ["Yellow", "Orange"],
        "accessories": ["Gold", "Bronze", "Copper"],
        "tip": "Deep warm tones illuminate your complexion beautifully."
    },
    "Dark": {
        "fitzpatrick":  "Type V-VI",
        "undertone":    "Warm / Deep",
        "best_colors": ["White", "Yellow", "Pink", "Orange", "Silver"],
        "avoid_colors": ["Navy Blue", "Black"],
        "accessories": ["White", "Silver", "Gold"],
        "tip": "Bright, vibrant colors create a stunning contrast."
    }
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file_storage):
    filename  = str(uuid.uuid4()) + "_" + secure_filename(file_storage.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_storage.save(full_path)
    return full_path, f"{UPLOAD_SUBDIR}/{filename}"


# SKIN TONE DETECTION (OpenCV + KMeans)
def get_skin_tone(img_path):
    """
    Person photo → YCrCb+HSV dual mask → KMeans dominant color → Fair/Medium/Dark
    """
    if not CV2_AVAILABLE:
        return "Medium", "low"

    img = cv2.imread(img_path)
    if img is None:
        return "Medium", "low"

    # Try face detection first
    gray  = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    ).detectMultiScale(gray, 1.3, 5)

    if len(faces) > 0:
        x, y, w, h = faces[0]
        roi = img[y:y+h, x:x+w]
    else:
        roi = img  # no face — use full image

    roi = cv2.resize(roi, (200, 200))

    # YCrCb skin mask
    ycrcb      = cv2.cvtColor(roi, cv2.COLOR_BGR2YCrCb)
    mask_yc    = cv2.inRange(ycrcb,
                    np.array([0,   133, 77],  dtype=np.uint8),
                    np.array([255, 173, 127], dtype=np.uint8))

    # HSV skin mask
    hsv        = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    mask_hsv   = cv2.inRange(hsv,
                    np.array([0,  20,  70],  dtype=np.uint8),
                    np.array([20, 255, 255], dtype=np.uint8))

    # Combine + clean
    mask   = cv2.bitwise_and(mask_yc, mask_hsv)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask   = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask   = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel)

    skin_pixels = roi[mask > 0]

    # Get dominant color
    if len(skin_pixels) < 50:
        b, g, r = roi.mean(axis=0).mean(axis=0)
    elif SKLEARN_AVAILABLE:
        pf = skin_pixels.reshape(-1, 3).astype(np.float32)
        if len(pf) > 3000:
            pf = pf[np.random.choice(len(pf), 3000, replace=False)]
        km = KMeans(n_clusters=min(3, len(pf)), random_state=42, n_init=10)
        km.fit(pf)
        labels, counts = np.unique(km.labels_, return_counts=True)
        b, g, r = km.cluster_centers_[labels[np.argmax(counts)]]
    else:
        b, g, r = skin_pixels.mean(axis=0)

    luminance = 0.299*r + 0.587*g + 0.114*b

    confidence = "low"
    if len(faces) > 0 and len(skin_pixels) > 200:
        confidence = "high"
    elif len(skin_pixels) > 5000:
        confidence = "high"

    if luminance > 165:
        return "Fair", confidence
    elif luminance >= 120:
        return "Medium", confidence
    elif luminance >= 85:
        return "Dusky", confidence
    else:
        return "Dark", confidence

def detect_objects(img_path):
    if yolo_model is None:
        return []
    try:
        results = yolo_model(img_path)
        return list({yolo_model.names[int(b.cls[0])] for r in results for b in r.boxes})
    except:
        return []


def predict_clothing(img_path):
    if not TF_AVAILABLE or model is None:
        return "tops"
    try:
        img = tf.keras.preprocessing.image.load_img(img_path, target_size=(224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        preds = model.predict(img_array)
        class_idx = np.argmax(preds[0])
        return class_names[class_idx]
    except Exception as e:
        print(f"Clothing prediction error: {e}")
        return "tops"


def generate_recommendations(gender, clothing_type, skin_tone, occasion="casual"):
    skin_data = SKIN_OUTFITS.get(skin_tone, SKIN_OUTFITS["Medium"])
    colors = skin_data["best_colors"]
    
    matching_wear = []
    
    occ = occasion.lower()
    g = gender.lower()
    
    # Base clothing pools mapping
    if g in ['women', 'girls']:
        if occ in ['traditional', 'ethnic']:
            tops_pool = ["Kurtas", "Kurtis", "Tops"]
            bottoms_pool = ["Leggings", "Salwar", "Churidar", "Palazzos"]
        elif occ == 'party':
            tops_pool = ["Tops", "Dresses", "Shirts"]
            bottoms_pool = ["Skirts", "Trousers", "Jeans"]
        elif occ == 'formal':
            tops_pool = ["Shirts", "Tops", "Blazers"]
            bottoms_pool = ["Trousers", "Skirts"]
        else: # casual
            tops_pool = ["Tshirts", "Tops", "Shirts"]
            bottoms_pool = ["Jeans", "Shorts", "Skirts", "Track Pants"]
    else: # men / boys
        if occ in ['traditional', 'ethnic']:
            tops_pool = ["Kurtas", "Nehru Jackets", "Sherwanis"]
            bottoms_pool = ["Churidar", "Trousers", "Jeans"]
        elif occ == 'party':
            tops_pool = ["Shirts", "Jackets", "Tshirts"]
            bottoms_pool = ["Trousers", "Jeans"]
        elif occ == 'formal':
            tops_pool = ["Shirts", "Suits", "Blazers"]
            bottoms_pool = ["Trousers"]
        else: # casual
            tops_pool = ["Tshirts", "Shirts", "Jackets"]
            bottoms_pool = ["Jeans", "Shorts", "Track Pants"]

    # Incorporate uploaded clothing type
    c_type = clothing_type.title()
    if c_type in ["Tops", "Tshirts", "Dresses"]:
        tops_pool.append(c_type)
        tops_pool.append(c_type)
    elif c_type in ["Jeans", "Skirts"]:
        bottoms_pool.append(c_type)
        bottoms_pool.append(c_type)

    # Generate Pairs
    for i in range(3):
        top_item = random.choice(tops_pool)
        top_col = random.choice(colors)
        top_img, top_title = get_product_image(gender, top_item, top_col, occasion)
        
        bot_item = random.choice(bottoms_pool)
        bot_col = random.choice(colors)
        bot_img, bot_title = get_product_image(gender, bot_item, bot_col, occasion)
        
        matching_wear.append({
            "title": f"{top_col} {top_title.title()}", 
            "image": top_img, 
            "note": "Matching Top Wear"
        })
        matching_wear.append({
            "title": f"{bot_col} {bot_title.title()}", 
            "image": bot_img, 
            "note": "Matching Bottom Wear"
        })

    # Accessories Pool
    if occ in ['traditional', 'ethnic']:
        acc_pool = ["Jewellery", "Bangle", "Earrings", "Handbags", "Sandals"]
    elif occ == 'party':
        acc_pool = ["Watches", "Heels", "Clutches", "Earrings"]
    elif occ == 'formal':
        acc_pool = ["Belts", "Watches", "Blazers", "Formal Shoes"]
    else: # casual
        acc_pool = ["Sports Shoes", "Casual Shoes", "Caps", "Sunglasses"]
        
    skin_acc_colors = skin_data["accessories"]
    suggested_accessories = []
    
    # Ensure variety
    safe_acc_pool = acc_pool * 2 
    selected_accs = random.sample(safe_acc_pool, min(4, len(safe_acc_pool)))
    
    for acc_item in selected_accs:
        col = random.choice(skin_acc_colors)
        img_url, title = get_product_image(gender, acc_item, col, occasion)
        suggested_accessories.append({
            "title": title.title(), 
            "image": img_url, 
            "note": f"Perfect for {occasion.title()}"
        })
    
    return {
        "matching_wear": matching_wear,
        "suggested_accessories": suggested_accessories,
        "best_color_combinations": colors,
        "styling_tips": skin_data["tip"]
    }

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file. Use JPG or PNG."}), 400

    person_path, person_rel = save_upload(file)
    gender = request.form.get('gender', 'Women')

    skin_mode = request.form.get('skin_mode', 'auto')
    if skin_mode == 'manual':
        skin_tone = request.form.get('manual_tone', 'Medium')
        confidence = "high"
    else:
        skin_tone, confidence = get_skin_tone(person_path)

    occasion = request.form.get('occasion', 'Casual')

    clothing_type = predict_clothing(person_path)
    recs = generate_recommendations(gender, clothing_type, skin_tone, occasion)

    return jsonify({
        "detected_clothing":       clothing_type,
        "gender":                  gender,
        "skin_mode":               skin_mode,
        "skin_tone":               skin_tone,
        "confidence":              confidence,
        "occasion":                occasion,
        "matching_wear":           recs["matching_wear"],
        "suggested_accessories":   recs["suggested_accessories"],
        "best_color_combinations": recs["best_color_combinations"],
        "styling_tips":            recs["styling_tips"],
        "fitzpatrick":             SKIN_OUTFITS.get(skin_tone, SKIN_OUTFITS["Medium"])["fitzpatrick"],
        "undertone":               SKIN_OUTFITS.get(skin_tone, SKIN_OUTFITS["Medium"])["undertone"]
    })

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

if __name__ == "__main__":
    app.run(debug=True)
