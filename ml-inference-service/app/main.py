from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from app.model.predictor import ETAPredictor

app = FastAPI(
    title="Intelligent Edge ML Inference Service",
    description="Production-grade AI microservice for real-time routing ETA predictions.",
    version="1.0.0",
)

predictor = ETAPredictor()

class IngestionRoutingPayload(BaseModel):
    pickup_lat: float = Field(..., ge=-90, le=90, example=40.7128)
    pickup_lng: float = Field(..., ge=-180, le=180, example=-74.0060)
    dropoff_lat: float = Field(..., ge=-90, le=90, example=40.7306)
    dropoff_lng: float = Field(..., ge=-180, le=180, example=-73.9850)
    weather_condition: str = Field(default="CLEAR", example="RAIN")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ml-inference-cluster"}

@app.post("/predict-eta")
def predict_trip_eta(payload: IngestionRoutingPayload):
    try:
        predicted_seconds = predictor.estimate_duration(
            pickup_lat=payload.pickup_lat,
            pickup_lng=payload.pickup_lng,
            dropoff_lat=payload.dropoff_lat,
            dropoff_lng=payload.dropoff_lng,
            weather=payload.weather_condition
        )

        return {
            "predicted_duration_seconds": predicted_seconds,
            "predicted_minutes": round(predicted_seconds / 60, 1),
            "engine_status": "optimal"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Engine failure: {str(e)}")