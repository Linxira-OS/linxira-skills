"""Scatter with uncertainty: two cohorts, both axes imperfect, one shaded band.

Predicted versus measured agreement, with the uncertainty of each point shown
on both axes and the cohort spread drawn as a band. Identity is double-encoded
(hue plus marker), so the two cohorts stay distinguishable in grayscale and
under color-vision deficiency.

Run:  python examples/05_uncertainty_scatter.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import pubstyle  # noqa: E402

OUTPUT = Path(__file__).resolve().parent / "output"
BASE_PT = 7.0

pubstyle.apply_publication_style(base_pt=BASE_PT)

#: Agreement band drawn under the points, in the emphasis-neutral gray.
_IDENTITY_COLOR = pubstyle.SEMANTIC["neutral"]


def synthetic_agreement(n: int = 14, seed: int = 53) -> dict[str, dict[str, np.ndarray]]:
    """Two cohorts of (predicted, measured) pairs with per-point uncertainty."""
    rng = np.random.default_rng(seed)
    truth = np.linspace(0.15, 0.9, n)
    cohorts = {
        "in-house": {"bias": 0.02, "scale": 1.00, "spread": 0.035},
        "external": {"bias": -0.05, "scale": 0.94, "spread": 0.06},
    }
    out: dict[str, dict[str, np.ndarray]] = {}
    for name, spec in cohorts.items():
        predicted = np.clip(spec["scale"] * truth + spec["bias"] + rng.normal(0.0, spec["spread"], n), 0.0, 1.0)
        measured = np.clip(truth + rng.normal(0.0, spec["spread"], n), 0.0, 1.0)
        out[name] = {
            "predicted": predicted,
            "measured": measured,
            "x_err": np.full(n, 0.03) + rng.random(n) * 0.02,
            "y_err": np.full(n, 0.04) + rng.random(n) * 0.03,
        }
    return out


def main() -> None:
    data = synthetic_agreement()
    colors = pubstyle.categorical(2)  # two cohorts, two colors from the fixed palette
    markers = {"in-house": "o", "external": "s"}
    cohorts = {"in-house": colors[0], "external": colors[1]}

    fig, (ax,) = pubstyle.new_figure(height_mm=62.0, columns=1)

    # Identity reference first, so the data always sits on top of it.
    ax.plot([0, 1], [0, 1], color=_IDENTITY_COLOR, lw=0.6, ls=(0, (4, 2)), zorder=1)
    ax.fill_between([0, 1], [0, 1], [0.08, 1.08], color=_IDENTITY_COLOR, alpha=0.18, lw=0, zorder=0)

    for name, color in cohorts.items():
        block = data[name]
        ax.errorbar(
            block["predicted"],
            block["measured"],
            xerr=block["x_err"],
            yerr=block["y_err"],
            fmt=markers[name],
            color=color,
            ecolor=color,
            ms=3.2,
            mew=0.4,
            mec="black",
            lw=0.8,
            elinewidth=0.6,
            capsize=1.6,
            label=name,
            zorder=3,
        )

    ax.set_xlabel("Predicted score (unitless)")
    ax.set_ylabel("Measured score (unitless)")
    ax.set_xlim(0.05, 1.0)
    ax.set_ylim(0.05, 1.0)
    ax.set_xticks([0.2, 0.4, 0.6, 0.8, 1.0])
    ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
    ax.legend(loc="upper left", frameon=False)

    written = pubstyle.save_figure(fig, OUTPUT / "05_uncertainty_scatter")
    print("wrote " + ", ".join(p.name for p in written))


if __name__ == "__main__":
    main()
