# main.py
import os
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image
import numpy as np
import tensorflow as tf

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = tf.keras.models.load_model('potato_classifier_model_updated.h5')
class_names = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']   # Replace with actual class names

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    file_location = f"temp/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    img_array = preprocess_image(file_location)
    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]
    return {"predicted_class": predicted_class}

if __name__ == "__main__":
    if not os.path.exists('temp'):
        os.makedirs('temp')
    uvicorn.run(app, host="0.0.0.0", port=8000)
