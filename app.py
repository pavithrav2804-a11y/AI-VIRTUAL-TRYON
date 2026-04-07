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

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

BASE_DIR = app.root_path
UPLOAD_SUBDIR = 'uploads'
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static', UPLOAD_SUBDIR)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wardrobe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

class_names = ['dresses', 'jeans', 'skirts', 'tops', 'tshirts']

# Database setup
if DB_AVAILABLE:
    db = SQLAlchemy(app)
else:
    db = None

wardrobe_data = []
Wardrobe = None

if DB_AVAILABLE:
    class Wardrobe(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        image = db.Column(db.String(200), nullable=False)
        category = db.Column(db.String(50), nullable=False)
        skin_tone = db.Column(db.String(50), nullable=False)
        style = db.Column(db.String(50), nullable=False)

    with app.app_context():
        db.create_all()

# Model loading
model = None
yolo_model = None

if TF_AVAILABLE:
    model_path = os.path.join(BASE_DIR, 'women_model.h5')
    try:
        model = tf.keras.models.load_model(model_path)
        app.logger.info('TensorFlow model loaded successfully.')
    except Exception as exc:
        app.logger.warning('Failed to load TensorFlow model: %s', exc)
else:
    app.logger.warning('TensorFlow is not installed.')

if YOLO_AVAILABLE:
    yolo_weights = os.path.join(BASE_DIR, 'yolov8n.pt')
    if os.path.exists(yolo_weights):
        try:
            yolo_model = YOLO(yolo_weights)
            app.logger.info('YOLO model loaded successfully.')
        except Exception as exc:
            app.logger.warning('Failed to load YOLO model: %s', exc)
    else:
        app.logger.warning('YOLO weights not found at %s', yolo_weights)
else:
    app.logger.warning('Ultralytics YOLO is not installed.')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def detect_objects(img_path):
    if yolo_model is None:
        return []
    try:
        results = yolo_model(img_path)
        items = []
        for result in results:
            for box in getattr(result, 'boxes', []):
                cls_id = int(box.cls[0])
                if isinstance(yolo_model.names, dict):
                    label = yolo_model.names.get(cls_id, str(cls_id))
                else:
                    label = yolo_model.names[cls_id] if cls_id < len(yolo_model.names) else str(cls_id)
                items.append(label)
        return list(set(items))
    except Exception as exc:
        app.logger.warning('YOLO detection failed: %s', exc)
        return []


def get_skin_tone(img_path):
    if not CV2_AVAILABLE:
        return 'Unknown'
    try:
        img = cv2.imread(img_path)
        if img is None:
            return 'Unknown'
        img = cv2.resize(img, (100, 100))
        avg = img.mean(axis=0).mean(axis=0)
        r, g, b = avg
        if r > 180 and g > 160:
            return 'Fair'
        elif r > 140:
            return 'Medium'
        return 'Dark'
    except Exception as exc:
        app.logger.warning('Skin tone detection failed: %s', exc)
        return 'Unknown'


def suggest_colors(skin_tone):
    return {
        'Fair': ['Black', 'Blue', 'Red'],
        'Medium': ['Green', 'Yellow', 'Orange'],
        'Dark': ['White', 'Pink', 'Light Blue']
    }.get(skin_tone, ['Black'])


def suggest_accessories(category):
    return {
        'tshirts': ['shoes.jpg', 'watch.jpg'],
        'dresses': ['heels.jpg', 'bag.jpg'],
        'jeans': ['shoes.jpg', 'bag.jpg'],
        'tops': ['sandals.jpg', 'bag.jpg'],
        'skirts': ['heels.jpg', 'clutch.jpg']
    }.get(category, ['watch.jpg'])


def suggest_style(category):
    if category in ['dresses', 'skirts']:
        return 'Party'
    elif category in ['jeans', 'tshirts']:
        return 'Casual'
    return 'Professional'


def get_outfit_images(category):
    folder = os.path.join(BASE_DIR, 'static', category)
    if os.path.exists(folder):
        imgs = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.png', '.jpeg', '.gif'))]
        if imgs:
            return [f'{category}/{i}' for i in random.sample(imgs, min(3, len(imgs)))]
    return []


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return 'No file selected'

    file = request.files['file']
    if file.filename == '':
        return 'No file selected'

    if not allowed_file(file.filename):
        return 'Invalid file type'

    filename = secure_filename(file.filename)
    filename = f'{uuid.uuid4().hex}_{filename}'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    relative_path = os.path.join(UPLOAD_SUBDIR, filename).replace('\\', '/')

    if model is None or not TF_AVAILABLE:
        return 'Model is not available. Please install TensorFlow and ensure women_model.h5 exists.'

    try:
        img = image.load_img(path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        pred = model.predict(img_array, verbose=0)
        category = class_names[np.argmax(pred)]

        detected_items = detect_objects(path)
        skin = get_skin_tone(path)
        colors = suggest_colors(skin)
        accessories = suggest_accessories(category)
        style = suggest_style(category)
        outfits = get_outfit_images(category)

        if DB_AVAILABLE and db:
            try:
                db.session.add(Wardrobe(image=relative_path, category=category, skin_tone=skin, style=style))
                db.session.commit()
            except Exception as exc:
                app.logger.warning('Database save failed: %s', exc)
                wardrobe_data.append({'image': relative_path, 'category': category, 'skin_tone': skin, 'style': style})
        else:
            wardrobe_data.append({'image': relative_path, 'category': category, 'skin_tone': skin, 'style': style})

        return render_template('result.html', prediction=category, detected_items=detected_items, img_path=relative_path, skin_tone=skin, colors=colors, accessories=accessories, style=style, outfit_images=outfits)
    except Exception as exc:
        app.logger.error('Prediction failed: %s', exc)
        return f'Prediction error: {exc}'


@app.route('/history')
def history():
    if DB_AVAILABLE and db:
        try:
            data = Wardrobe.query.all()
        except Exception as exc:
            app.logger.warning('Database query failed: %s', exc)
            data = wardrobe_data
    else:
        data = wardrobe_data
    return render_template('history.html', data=data)


if __name__ == '__main__':
    app.run(debug=True)
