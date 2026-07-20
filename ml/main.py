"""Inference entry point for the transaction category classifier.

Usage:
    python main.py "Uber ride INR 250"
    python main.py "Uber ride INR 250" "Netflix subscription INR 499"
"""

import sys
from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).parent / "model.joblib"


def load_model():
    if not MODEL_PATH.exists() or MODEL_PATH.stat().st_size == 0:
        raise SystemExit(
            f"No trained model found at {MODEL_PATH}. Run `python train.py` first."
        )
    return joblib.load(MODEL_PATH)


def predict(model, texts: list[str]) -> list[tuple[str, float]]:
    probs = model.predict_proba(texts)
    #Gets highest value probability for each transaction but gets index
    top_idx = probs.argmax(axis=1)
    categories = model.classes_[top_idx]
    confidences = probs.max(axis=1)
    return list(zip(categories, confidences))

#Allows for testing inputs on model
#Example: python main.py "Uber ride INR 250" "Netflix subscription INR 499" "Grocery store payment INR 1200"
def main() -> None:
    texts = sys.argv[1:]
    if not texts:
        raise SystemExit("Usage: python main.py \"<transaction text>\" [more text ...]")

    model = load_model()
    for text, (category, confidence) in zip(texts, predict(model, texts)):
        print(f"{category} ({confidence:.2f})\t{text}")


if __name__ == "__main__":
    main()
