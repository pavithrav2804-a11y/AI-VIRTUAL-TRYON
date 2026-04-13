from flask import Flask, render_template, request, url_for
from werkzeug.utils import secure_filename
import logging
import os
import random
import uuid
import numpy as np

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

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
class_names        = ['dresses', 'jeans', 'skirts', 'tops', 'tshirts']


# ── DATABASE ──────────────────────────────────────────────────────────────────
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


# ── MODEL LOADING ─────────────────────────────────────────────────────────────
model = yolo_model = None

if TF_AVAILABLE:
    try:
        model = tf.keras.models.load_model("women_model.h5")
        print("✅ Keras model loaded")
    except Exception as e:
        print(f"❌ Model load failed: {e}")

if YOLO_AVAILABLE:
    try:
        yolo_model = YOLO("yolov8n.pt")
        print("✅ YOLO loaded")
    except Exception as e:
        print(f"❌ YOLO not loaded: {e}")


# ── SKIN TONE → OUTFIT DATABASE ───────────────────────────────────────────────
SKIN_OUTFITS = {
    "Fair": {
        "fitzpatrick":  "Type I-II",
        "undertone":    "Cool",
        "best_colors":  ["Navy Blue", "Emerald Green", "Burgundy", "Lavender", "Charcoal"],
        "avoid_colors": ["Bright Orange", "Neon Yellow", "Warm Beige"],
        "accessories":  ["Silver jewelry", "White gold", "Pearl"],
        "tip":          "Jewel tones & cool neutrals suit you best. Silver accessories glow on fair skin.",
        "outfits": {
            "Casual":       "Navy blue jeans + White shirt + Grey sneakers",
            "Party":        "Emerald green wrap dress + Silver heels + Pearl earrings",
            "Professional": "Charcoal blazer + Black trousers + Silver accessories",
            "Traditional":  "Pastel blue silk saree + Silver zari + Silver jhumkas"
        }
    },
    "Medium": {
        "fitzpatrick":  "Type III-IV",
        "undertone":    "Warm / Neutral",
        "best_colors":  ["Terracotta", "Mustard Yellow", "Olive Green", "Rust", "Cream"],
        "avoid_colors": ["Icy Silver tones", "Very cool pastels"],
        "accessories":  ["Gold jewelry", "Bronze", "Copper", "Wooden beads"],
        "tip":          "Warm earth tones are your superpower. Gold accessories always look stunning.",
        "outfits": {
            "Casual":       "Mustard kurta + Dark olive joggers + Brown sandals",
            "Party":        "Burnt orange dress + Gold block heels + Gold hoops",
            "Professional": "Terracotta blazer + Cream shirt + Khaki trousers",
            "Traditional":  "Mustard yellow silk saree + Gold zari + Gold temple jewelry"
        }
    },
    "Dark": {
        "fitzpatrick":  "Type V-VI",
        "undertone":    "Warm / Deep",
        "best_colors":  ["Bright White", "Fuchsia", "Cobalt Blue", "Electric Yellow", "Coral"],
        "avoid_colors": ["Dark Brown (blends in)", "Very dark navy alone"],
        "accessories":  ["Bold gold jewelry", "Colorful statement pieces", "Coral"],
        "tip":          "Vibrant & bright colors were made for you. White creates a stunning contrast.",
        "outfits": {
            "Casual":       "Bright coral top + White jeans + Gold sandals",
            "Party":        "Fuchsia gown + Gold heels + Statement gold jewelry",
            "Professional": "Royal blue blazer + White shirt + Gold accessories",
            "Traditional":  "Bright orange silk saree + Heavy gold jewelry + Bold makeup"
        }
    }
}


# ── HELPERS ───────────────────────────────────────────────────────────────────
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file_storage):
    filename  = str(uuid.uuid4()) + "_" + secure_filename(file_storage.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_storage.save(full_path)
    return full_path, f"{UPLOAD_SUBDIR}/{filename}"


# ── SKIN TONE DETECTION (OpenCV + KMeans) ─────────────────────────────────────
def get_skin_tone(img_path):
    """
    Person photo → YCrCb+HSV dual mask → KMeans dominant color → Fair/Medium/Dark
    """
    if not CV2_AVAILABLE:
        return "Medium"

    img = cv2.imread(img_path)
    if img is None:
        return "Medium"

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

    if luminance > 175:
        return "Fair"
    elif luminance > 100:
        return "Medium"
    else:
        return "Dark"


# ── OUTFIT SUPPORT FUNCTIONS ──────────────────────────────────────────────────
def detect_objects(img_path):
    if yolo_model is None:
        return []
    try:
        results = yolo_model(img_path)
        return list({yolo_model.names[int(b.cls[0])] for r in results for b in r.boxes})
    except:
        return []


def get_outfit_images(skin_tone):
    """
    Return random outfit images from the dataset folder
    that match the skin tone's best color categories.
    Falls back to any available category folder.
    """
    tone_categories = {
        "Fair":   ["dresses", "tops", "skirts"],
        "Medium": ["tops", "jeans", "dresses"],
        "Dark":   ["dresses", "skirts", "tops"]
    }
    preferred = tone_categories.get(skin_tone, ["tops", "dresses"])
    collected = []

    for cat in preferred:
        folder = os.path.join(BASE_DIR, 'static', cat)
        if os.path.exists(folder):
            imgs = [f for f in os.listdir(folder) if f.endswith(('.jpg', '.png'))]
            if imgs:
                picked = random.sample(imgs, min(2, len(imgs)))
                collected += [f"{cat}/{i}" for i in picked]

    return collected[:6]  # max 6 outfit images


# ── ROUTES ────────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():

    # Validate file
    if 'file' not in request.files:
        return render_template("index.html", error="Please upload a photo.")

    file = request.files['file']

    if file.filename == '':
        return render_template("index.html", error="No file selected.")

    if not allowed_file(file.filename):
        return render_template("index.html", error="Invalid file type. Use JPG or PNG.")

    # Save uploaded person photo
    person_path, person_rel = save_upload(file)

    # ── Detect skin tone from person photo ────────────────────────────────────
    skin_tone = get_skin_tone(person_path)
    skin_data = SKIN_OUTFITS.get(skin_tone, SKIN_OUTFITS["Medium"])

    # ── Get outfit recommendations based on skin tone ─────────────────────────
    outfit_images = get_outfit_images(skin_tone)

    return render_template(
        "result.html",
        img_path       = person_rel,
        skin_tone      = skin_tone,
        fitzpatrick    = skin_data["fitzpatrick"],
        undertone      = skin_data["undertone"],
        best_colors    = skin_data["best_colors"],
        avoid_colors   = skin_data["avoid_colors"],
        skin_accessory = skin_data["accessories"],
        tip            = skin_data["tip"],
        outfit_casual       = skin_data["outfits"]["Casual"],
        outfit_party        = skin_data["outfits"]["Party"],
        outfit_professional = skin_data["outfits"]["Professional"],
        outfit_traditional  = skin_data["outfits"]["Traditional"],
        outfit_images  = outfit_images,
    )


if __name__ == "__main__":
    app.run(debug=False)
