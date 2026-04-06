import os
import shutil
import random

def split_data(source, train, val, split_size=0.8):

    files = os.listdir(source)
    files = [f for f in files if f.endswith(".jpg")]

    random.shuffle(files)

    split_index = int(len(files) * split_size)

    train_files = files[:split_index]
    val_files = files[split_index:]

    os.makedirs(train, exist_ok=True)
    os.makedirs(val, exist_ok=True)

    for file in train_files:
        shutil.copy(os.path.join(source, file),
                    os.path.join(train, file))

    for file in val_files:
        shutil.copy(os.path.join(source, file),
                    os.path.join(val, file))


base_path = "dataset/women"

# ✅ IGNORE THESE FOLDERS
ignore_folders = ["train", "val"]

for category in os.listdir(base_path):

    if category in ignore_folders:
        continue

    category_path = os.path.join(base_path, category)

    if os.path.isdir(category_path):

        train_path = os.path.join(base_path, "train", category)
        val_path = os.path.join(base_path, "val", category)

        split_data(category_path, train_path, val_path)

print("✅ DATASET SPLIT COMPLETED!")