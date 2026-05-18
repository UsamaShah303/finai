"""
Monte Carlo portfolio simulation.

Runs N stochastic paths to forecast future portfolio value,
returning percentile bands for risk visualisation.
"""

import numpy as np


def monte_carlo(
    initial_amount: float,
    monthly_deposit: float = 0.0,
    annual_return: float = 0.10,
    volatility: float = 0.15,
    years: int = 10,
    n_paths: int = 10000,
) -> dict:
    """
    Run Monte Carlo simulation on a portfolio.

    Args:
        initial_amount: starting investment value.
        monthly_deposit: amount added each month.
        annual_return: expected annual return (e.g., 0.10 = 10%).
        volatility: annual volatility / standard deviation (e.g., 0.15 = 15%).
        years: simulation horizon in years.
        n_paths: number of simulation paths.

    Returns:
        dict with p10, p50, p90 final values and 100 sample paths.
    """
    months = years * 12
    monthly_return = annual_return / 12
    monthly_vol = volatility / (12 ** 0.5)

    # Generate all random shocks at once (vectorised for speed)
    shocks = np.random.normal(monthly_return, monthly_vol, size=(n_paths, months))

    # Simulate paths
    paths = np.zeros((n_paths, months + 1))
    paths[:, 0] = initial_amount

    for m in range(months):
        paths[:, m + 1] = paths[:, m] * (1 + shocks[:, m]) + monthly_deposit

    # Final values
    final_values = paths[:, -1]

    # Percentiles
    p10 = float(np.percentile(final_values, 10))
    p50 = float(np.percentile(final_values, 50))
    p90 = float(np.percentile(final_values, 90))

    # Send only 100 sample paths to frontend (bandwidth)
    sample_indices = np.random.choice(n_paths, size=min(100, n_paths), replace=False)
    sample_paths = paths[sample_indices].tolist()

    # Round for JSON
    sample_paths = [
        [round(v, 2) for v in path]
        for path in sample_paths
    ]

    return {
        "p10": round(p10, 2),
        "p50": round(p50, 2),
        "p90": round(p90, 2),
        "mean": round(float(np.mean(final_values)), 2),
        "std": round(float(np.std(final_values)), 2),
        "years": years,
        "months": months,
        "n_paths": n_paths,
        "paths": sample_paths,
    }
