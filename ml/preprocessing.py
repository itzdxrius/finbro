"""Shared text cleanup for the transaction category classifier.

Raw transaction text looks like:
    "Uber ride INR 48648 TXNde8842f7"

The amount and transaction id are effectively random per-row and carry no
predictive signal, so we strip them before they ever reach the vectorizer.
Both train.py and main.py import clean_text so training and inference stay
in sync.
"""

import re

#Extract things like amount and transactin number
#s* means any amoutn of space
#[\d,] means any combination of digits and comma
_AMOUNT_RE = re.compile(r"\bINR\s*[\d,]+(\.\d+)?\b", re.IGNORECASE)
_TXN_ID_RE = re.compile(r"\bTXN[a-z0-9]+\b", re.IGNORECASE)
_WHITESPACE_RE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    text = _AMOUNT_RE.sub(" ", text)
    text = _TXN_ID_RE.sub(" ", text)
    text = _WHITESPACE_RE.sub(" ", text).strip().lower()
    return text
