"""
Lightweight sentiment analysis using keyword/rule-based scoring.

This avoids the heavy torch + transformers dependency (~2 GB).
For production, upgrade to FinBERT by installing transformers + torch
and swapping in the HuggingFace pipeline.
"""

import re

# Positive and negative keyword lists (finance-tuned)
POSITIVE_WORDS = {
    "surge", "surges", "surging", "rally", "rallies", "gain", "gains",
    "growth", "growing", "profit", "profits", "record", "high", "highs",
    "boost", "boosts", "upgrade", "upgrades", "bullish", "bull",
    "outperform", "beat", "beats", "earnings", "revenue", "rise",
    "rises", "rising", "strong", "recovery", "recover", "rebound",
    "optimistic", "positive", "upbeat", "soar", "soars", "all-time",
    "dividend", "expansion", "expand", "innovation", "breakout",
    "opportunity", "success", "exceed", "exceeds", "momentum",
}

NEGATIVE_WORDS = {
    "drop", "drops", "fall", "falls", "decline", "declines", "loss",
    "losses", "crash", "crashes", "plunge", "plunges", "bearish",
    "bear", "recession", "downturn", "downgrade", "downgrades",
    "sell-off", "selloff", "slump", "slumps", "crisis", "risk",
    "warning", "warn", "warns", "inflation", "debt", "default",
    "layoff", "layoffs", "cut", "cuts", "weak", "weakness",
    "volatile", "volatility", "uncertainty", "fear", "panic",
    "bubble", "overvalued", "deficit", "bankruptcy", "bankrupt",
    "regulation", "fine", "penalty", "lawsuit", "fraud",
}


def _score_headline(text: str) -> dict:
    """Score a single headline."""
    words = set(re.findall(r'\b\w+\b', text.lower()))
    pos = len(words & POSITIVE_WORDS)
    neg = len(words & NEGATIVE_WORDS)
    total = pos + neg

    if total == 0:
        return {"positive": 0.0, "neutral": 1.0, "negative": 0.0, "label": "neutral"}

    p_score = pos / total
    n_score = neg / total
    neu_score = max(0, 1.0 - p_score - n_score)

    if p_score > n_score:
        label = "positive"
    elif n_score > p_score:
        label = "negative"
    else:
        label = "neutral"

    return {
        "positive": round(p_score, 3),
        "neutral": round(neu_score, 3),
        "negative": round(n_score, 3),
        "label": label,
    }


def analyse_sentiment(headlines: list[str]) -> dict:
    """
    Analyse sentiment of a list of financial headlines.

    Returns aggregate scores and per-headline breakdown.
    """
    if not headlines:
        return {
            "positive": 0.0,
            "neutral": 1.0,
            "negative": 0.0,
            "label": "neutral",
            "count": 0,
            "details": [],
        }

    details = []
    total_pos = 0.0
    total_neu = 0.0
    total_neg = 0.0

    for headline in headlines:
        result = _score_headline(headline)
        details.append({"headline": headline, **result})
        total_pos += result["positive"]
        total_neu += result["neutral"]
        total_neg += result["negative"]

    n = len(headlines)
    avg_pos = total_pos / n
    avg_neu = total_neu / n
    avg_neg = total_neg / n

    scores = {"positive": avg_pos, "neutral": avg_neu, "negative": avg_neg}
    label = max(scores, key=scores.get)

    return {
        "positive": round(avg_pos, 3),
        "neutral": round(avg_neu, 3),
        "negative": round(avg_neg, 3),
        "label": label,
        "count": n,
        "details": details,
    }
