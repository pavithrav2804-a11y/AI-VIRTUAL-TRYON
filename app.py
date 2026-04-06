from flask import Flask, render_template, request
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import cv2
import random

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model("women_model.h5")

# Class names
class_names = ['dresses', 'jeans', 'skirts', 'tops', 'tshirts']


# SKIN TONE
def get_skin_tone(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (100, 100))

    avg_color = img.mean(axis=0).mean(axis=0)
    r, g, b = avg_color

    if r > 180 and g > 160:
        return "Fair"
    elif r > 140:
        return "Medium"
    else:
        return "Dark"


# COLOR SUGGESTION
def suggest_colors(skin_tone):
    if skin_tone == "Fair":
        return ["Black", "Blue", "Red"]
    elif skin_tone == "Medium":
        return ["Green", "Yellow", "Orange"]
    else:
        return ["White", "Pink", "Light Blue"]


# ACCESSORIES (IMPORTANT FIX ✅)
def suggest_accessories(category):
    if category == "tshirts":
        return ["shoes.jpg", "watch.jpg"]
    elif category == "dresses":
        return ["heels.jpg", "bag.jpg"]
    elif category == "jeans":
        return ["shoes.jpg", "bag.jpg"]
    elif category == "tops":
        return ["sandals.jpg", "bag.jpg"]
    elif category == "skirts":
        return ["heels.jpg", "clutch.jpg"]
    else:
        return ["watch.jpg"]


# OUTFIT IMAGES (FIXED PATH ✅)
def get_outfit_images(predicted_class):
    folder = os.path.join("static", predicted_class)

    if os.path.exists(folder):
        images = os.listdir(folder)

        if len(images) > 0:
            selected = random.sample(images, min(3, len(images)))
            return [f"{predicted_class}/{img}" for img in selected]

    return []


# HOME
@app.route('/')
def home():
    return render_template("index.html")


# PREDICT
@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']

    if file:
        # Save upload
        upload_folder = os.path.join("static", "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        filepath = os.path.join(upload_folder, file.filename)
        file.save(filepath)

        # Image processing
        img = image.load_img(filepath, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Prediction
        prediction = model.predict(img_array)
        predicted_class = class_names[np.argmax(prediction)]

        # Skin tone
        skin_tone = get_skin_tone(filepath)

        # Suggestions
        colors = suggest_colors(skin_tone)
        accessories = suggest_accessories(predicted_class)
        outfit_images = get_outfit_images(predicted_class)

        return render_template("result.html",
                               prediction=predicted_class,
                               img_path=filepath,
                               skin_tone=skin_tone,
                               colors=colors,
                               accessories=accessories,
                               outfit_images=outfit_images)

    return "No file uploaded"


# RUN
if __name__ == '__main__':
    app.run(debug=True)
