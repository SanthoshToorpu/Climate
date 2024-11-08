from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
import pickle
import pandas as pd
import numpy as np
import json

# Initialize FastAPI app
app = FastAPI()

# Helper function to load model files with error handling
def load_model_files():
    try:
        with open('crop_suggestion_model.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        with open('scaler.pkl', 'rb') as scaler_file:
            scaler = pickle.load(scaler_file)
        with open('label_encoder.pkl', 'rb') as label_encoder_file:
            label_encoder = pickle.load(label_encoder_file)
        return model, scaler, label_encoder
    except FileNotFoundError as e:
        raise RuntimeError(f"Model file not found: {e.filename}")
    except Exception as e:
        raise RuntimeError(f"Failed to load model files: {e}")

# Load the model, scaler, and label encoder with error handling
try:
    model, scaler, label_encoder = load_model_files()
except RuntimeError as e:
    print(e)

# Define request model with basic validation
class CropInput(BaseModel):
    N: float = Field(..., ge=0, le=500)
    P: float = Field(..., ge=0, le=500)
    K: float = Field(..., ge=0, le=500)
    temperature: float = Field(..., ge=-10, le=50)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    durationmonths: float = Field(..., ge=0, le=12)
    rainfall: float = Field(..., ge=0, le=1000)

# Function to get the top 3 crops
def suggest_top_3_crops(input_data):
    # Convert input data to DataFrame
    input_df = pd.DataFrame([input_data.dict()])
    # Scale the input features
    input_scaled = scaler.transform(input_df)
    # Get prediction probabilities
    probabilities = model.predict_proba(input_scaled)
    # Get top 3 indices with highest probabilities
    top_3_indices = np.argsort(probabilities[0])[-3:][::-1]
    # Decode crop labels for the top 3 predictions
    top_3_crops = label_encoder.inverse_transform(top_3_indices)
    return top_3_crops

# Define the prediction endpoint
@app.post("/suggest_crops")
async def suggest_crops(request: Request):
    try:
        # Read the request body as a JSON string or escaped JSON
        request_body = await request.body()
        
        # Attempt to parse as JSON
        try:
            parsed_data = json.loads(request_body.decode("utf-8"))
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format")
        
        # Validate the parsed data using CropInput model
        input_data = CropInput(**parsed_data)

        # Get top 3 crop suggestions
        top_3_crops = suggest_top_3_crops(input_data)
        return {"top_3_crops": top_3_crops.tolist()}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Data input error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
