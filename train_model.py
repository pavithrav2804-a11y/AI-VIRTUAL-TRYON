import tensorflow as tf

# Load dataset
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    r"D:\virtual tryon\dataset\women\train",
    image_size=(224,224),
    batch_size=32
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    r"D:\virtual tryon\dataset\women\val",
    image_size=(224,224),
    batch_size=32
)

# Class names
class_names = train_ds.class_names
print("Classes:", class_names)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Rescaling(1./255, input_shape=(224,224,3)),

    tf.keras.layers.Conv2D(32, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(64, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(128, 3, activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),

    tf.keras.layers.Dense(len(class_names), activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
model.fit(train_ds, validation_data=val_ds, epochs=5)

# Save model
model.save("women_model.h5")

print("✅ Model training completed!")
