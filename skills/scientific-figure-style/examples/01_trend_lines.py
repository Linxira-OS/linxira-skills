"""Trend lines: one claim, three series, no legend.

Shows the default case — a single-column time series where the series names are
short enough to sit at the line ends. Direct labels beat a legend: the reader
never has to match a swatch to a curve, and the plot keeps the ink.

Run:  python examples/01_trend_lines.py   (writes examples/output/*.pdf|png)
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


def synthetic_curves(n_epochs: int = 40, seed: int = 11) -> dict[str, np.ndarray]:
    """Three accuracy curves: a slow baseline, a variant, and our method."""
    rng = np.random.default_rng(seed)
    epochs = np.arange(1, n_epochs + 1, dtype=float)

    def saturating(ceiling: float, rate: float) -> np.ndarray:
        curve = ceiling * (1.0 - np.exp(-rate * epochs))
        return curve + rng.normal(0.0, 0.35, size=epochs.size)

    return {
        "baseline": saturating(72.0, 0.06),
        "method": saturating(88.0, 0.09),
        "variant": saturating(80.0, 0.11),
    }


def main() -> None:
    curves = synthetic_curves()
    epochs = np.arange(1, len(curves["method"]) + 1)

    fig, (ax,) = pubstyle.new_figure(height_mm=54.0, columns=1)

    # Role colors, not hex values: recoloring the whole paper is one edit.
    roles = {"baseline": "baseline", "variant": "variant", "method": "method"}
    label_dy = {"baseline": 0.0, "variant": -1.2, "method": 0.0}
    for name, key in roles.items():
        color = pubstyle.SEMANTIC[key]
        ax.plot(epochs, curves[name], color=color, lw=1.2, solid_capstyle="round")
        ax.text(
            epochs[-1] + 0.35,
            curves[name][-1] + label_dy[name],
            name,
            color=color,
            fontsize=BASE_PT,
            ha="left",
            va="center",
        )

    # The published baseline stays visible as a reference band, not a curve.
    ax.axhline(70.0, color=pubstyle.SEMANTIC["neutral"], lw=0.6, ls=(0, (4, 2)))

    ax.set_xlabel("Epoch")
    ax.set_ylabel("Validation accuracy (%)")
    ax.set_xlim(0, epochs[-1] + 9)
    # Truncated y-axis, justified on the figure: the first labelled tick is the
    # limit (55), so the cut is visible, and the claim is about final ordering,
    # not about the area under the curves.
    ax.set_ylim(55, 95)
    ax.set_xticks([1, 10, 20, 30, 40])
    ax.tick_params(which="both", top=False, right=False)

    written = pubstyle.save_figure(fig, OUTPUT / "01_trend_lines")
    print("wrote " + ", ".join(p.name for p in written))


if __name__ == "__main__":
    main()
