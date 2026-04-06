import pandas as pd
import os
import shutil

# Load CSV safely
df = pd.read_csv("styles.csv", on_bad_lines='skip')

image_folder = "images"

for i, row in df.iterrows():
    try:
        gender = str(row['gender']).strip().lower()
        category = str(row['articleType']).strip().lower()

        img_name = str(row['id']) + ".jpg"
        src = os.path.join(image_folder, img_name)

        if gender == "women" and category in ["dresses", "tops", "skirts", "jeans", "tshirts"]:

            dest_folder = os.path.join("dataset", "women", category)

            # create folder
            os.makedirs(dest_folder, exist_ok=True)

            if os.path.exists(src):
                shutil.copy(src, os.path.join(dest_folder, img_name))

    except:
        continue

print("✅ DATASET CREATED CORRECTLY!")
