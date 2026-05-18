"""
Risk classification from quiz answers.

Currently uses threshold-based scoring. When enough user data accumulates,
swap in K-Means clustering for data-driven risk segmentation.
"""


def classify_risk(quiz_answers: list[int]) -> dict:
    """
    Classify a user's risk profile based on 10 quiz answers.

    Args:
        quiz_answers: list of 10 integers (each 1–5 scale).

    Returns:
        dict with risk_score (0–100) and risk_level.
    """
    if not quiz_answers or len(quiz_answers) < 1:
        return {"risk_score": 50, "risk_level": "Moderate"}

    # Quiz scores: each question is 1–5, so 10 questions → range 10–50
    raw_score = sum(quiz_answers)
    min_possible = len(quiz_answers) * 1
    max_possible = len(quiz_answers) * 5
    span = max_possible - min_possible

    # Normalise to 0–100
    if span > 0:
        normalized = (raw_score - min_possible) / span
    else:
        normalized = 0.5

    risk_score = int(normalized * 100)
    risk_score = max(0, min(100, risk_score))  # clamp

    if risk_score < 35:
        level = "Conservative"
    elif risk_score < 65:
        level = "Moderate"
    else:
        level = "Aggressive"

    return {
        "risk_score": risk_score,
        "risk_level": level,
    }
