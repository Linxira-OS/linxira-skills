"""Shared legend across four panels: one legend, four panels, zero duplicates.

Four datasets compare the same three series, so the series set is declared once
in a reserved legend strip under the grid. Repeating the legend inside each
panel would drift out of sync and steal ink; the panel letters ("a"-"d") are
what the caption uses to address panels individually.

Run:  python examples/04_shared_legend_panels.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import pubstyle  # noqa: E402

OUTPUT = Path(__file__).resolve().parent / "output"
BASE_PT = 6.0  # dense multi-panel tier: one notch below the single-panel tier
LEGEND_ROW = 0.20  # share of the canvas height given to the legend strip

pubstyle.apply_publication_style(base_pt=BASE_PT)


def synthetic_panels(n_points: int = 12, seed: int = 41) -> tuple[list[str], np.ndarray, np.ndarray]:
    """(dataset names, thresholds, recall[dataset, method, threshold])."""
    rng = np.random.default_rng(seed)
    datasets = ["Cohort A", "Cohort B", "Cohort C", "Cohort D"]
    thresholds = np.linspace(0.05, 0.95, n_points)
    ceilings = np.array([88.0, 76.0, 93.0, 81.0])
    recall = np.empty((len(datasets), 3, n_points))
    for d, ceiling in enumerate(ceilings):
        for m, sharpness in enumerate((4.0, 6.0, 8.0)):
            base = ceiling * (1.0 - np.exp(-sharpness * thresholds))
            recall[d, m] = np.clip(base + rng.normal(0.0, 0.8, n_points), 0.0, 100.0)
    return datasets, thresholds, recall


def main() -> None:
    datasets, thresholds, recall = synthetic_panels()
    methods = [("baseline", "baseline"), ("variant", "variant"), ("method", "method")]

    fig, axes = pubstyle.new_figure(
        height_mm=118.0,
        columns=2,
        nrows=3,
        ncols=2,
        height_ratios=[1.0, 1.0, LEGEND_ROW],
        sharex="col",
        sharey=True,
    )
    panels = axes[:4]
    for spare in axes[4:]:  # the legend needs the full width, not two cells
        spare.remove()
    grid = panels[0].get_subplotspec().get_gridspec()
    ax_legend = fig.add_subplot(grid[2, :])
    ax_legend.axis("off")

    handles = []
    for row, ax in enumerate(panels):
        for i, (label, role) in enumerate(methods):
            (line,) = ax.plot(
                thresholds,
                recall[row, i],
                color=pubstyle.SEMANTIC[role],
                lw=1.2,
                label=label,
            )
            if row == 0:
                handles.append(line)
        ax.set_title(datasets[row], loc="left", pad=10.0)
        # Wayfinding, not content: small, bold, outside the data region.
        ax.text(0.0, 1.005, "abcd"[row], transform=ax.transAxes, fontsize=BASE_PT + 2,
                fontweight="bold", va="bottom", ha="left")
        ax.set_xticks([0.0, 0.25, 0.5, 0.75, 1.0])
        ax.set_ylim(0, 100)
        ax.set_yticks([0, 25, 50, 75, 100])

    # Each column shares its own x-axis, so both bottom panels carry the label;
    # the top row inherits it through the shared axis rather than repeating it.
    for ax in panels[2:]:
        ax.set_xlabel("Decision threshold (unitless)")
    panels[2].set_ylabel("Recall (%)")
    ax_legend.legend(handles, [label for label, _ in methods], loc="center", ncol=3, frameon=False)

    written = pubstyle.save_figure(fig, OUTPUT / "04_shared_legend_panels")
    print("wrote " + ", ".join(p.name for p in written))


if __name__ == "__main__":
    main()
