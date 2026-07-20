"""Train a transaction -> category classifier.

Usage:
    python train.py

Reads data/train_transactions.csv and data/test_transactions.csv, fits a
TF-IDF + Logistic Regression pipeline, prints evaluation metrics on the held-out
test set, and writes the fitted pipeline to model.joblib.
"""


from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline

from preprocessing import clean_text

DATA_DIR = Path(__file__).parent / "data"
MODEL_PATH = Path(__file__).parent / "model.joblib"


def load_split(name: str) -> tuple[pd.Series, pd.Series]:
    df = pd.read_csv(DATA_DIR / name)
    return df["transaction_text"], df["category"]


#We get numbers through tf-idf which gives words an "importance" value compared to the rest of words
# We will use multimodal logister regression to get 9 different categories
def build_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    preprocessor=clean_text,
                    ngram_range=(1, 2),
                    min_df=1,
                ),
            ),
            ("clf", LogisticRegression(max_iter=1000)),
        ]
    )


def main() -> None:
    X_train, y_train = load_split("train_transactions.csv")
    X_test, y_test = load_split("test_transactions.csv")

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    #Shows accuracy
    print(f"Test accuracy: {accuracy_score(y_test, y_pred):.4f}\n")
    
    print("Classification report:")
    print(classification_report(y_test, y_pred))

    #Confusion matrix is True positive, TN, FP, FN
    print("Confusion matrix (rows=true, cols=pred):")
    labels = sorted(y_test.unique())
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    print(pd.DataFrame(cm, index=labels, columns=labels))

    joblib.dump(pipeline, MODEL_PATH)
    print(f"\nSaved trained pipeline to {MODEL_PATH}")


if __name__ == "__main__":
    main()
