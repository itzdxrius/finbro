"""HTTP API for the transaction category classifier.

Wraps model.joblib in a FastAPI service so other languages/processes (e.g.
the Node backend in my-app/server) can get predictions over HTTP instead of
calling Python directly.

Run with:
    uvicorn serve:app --reload --port 8001

Then POST to http://localhost:8000/predict with a JSON body like:
    {"texts": ["Uber ride INR 250", "Netflix subscription INR 499"]}
"""

from pathlib import Path

import joblib
from fastapi import FastAPI
from pydantic import BaseModel

MODEL_PATH = Path(__file__).parent / "model.joblib"

if not MODEL_PATH.exists() or MODEL_PATH.stat().st_size == 0:
    raise SystemExit(f"No trained model found at {MODEL_PATH}. Run `python train.py` first.")

model = joblib.load(MODEL_PATH)

app = FastAPI()


class PredictRequest(BaseModel):
    texts: list[str]


class Prediction(BaseModel):
    category: str
    confidence: float


@app.post("/predict", response_model=list[Prediction])
def predict(request: PredictRequest) -> list[Prediction]:
    probs = model.predict_proba(request.texts)
    top_idx = probs.argmax(axis=1)
    categories = model.classes_[top_idx]
    confidences = probs.max(axis=1)
    return [
        Prediction(category=category.capitalize(), confidence=float(confidence))
        for category, confidence in zip(categories, confidences)
    ]
