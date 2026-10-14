"""Annotated heatmap: a block-sorted score matrix with every cell labelled.

Heatmaps and image panels are the documented exception to despining — the four
spines are part of the grid the reader decodes, so they stay. Cells carry their
value while the color map carries the pattern; annotation color flips on cell
luminance so text never sinks into its background.

Run:  python examples/03_annotated_heatmap.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from matplotlib.colors import to_hex, to_rgb

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import pubstyle  # noqa: E402

OUTPUT = Path(__file__).resolve().parent / "output"
BASE_PT = 7.0

pubstyle.apply_publication_style(base_pt=BASE_PT)

#: Long x labels rotate instead of shrinking the type.
ROTATION_DEG = 45.0

#: Cell ink luminance above which black text is used instead of white.
_LUMINANCE_SPLIT = 0.55


def synthetic_matrix(seed: int = 37) -> tuple[np.ndarray, list[str]]:
    """A symmetric agreement matrix with three visible blocks."""
    rng = np.random.default_rng(seed)
    labels = [f"P{i:02d}" for i in range(1, 9)]
    blocks = np.array([0, 0, 0, 1, 1, 1, 2, 2])
    base = 1.0 - 0.28 * (blocks[:, None] != blocks[None, :])
    base = (base + base.T) / 2.0
    noise = rng.normal(0.0, 0.05, base.shape)
    noise = (noise + noise.T) / 2.0
    matrix = np.clip(base + noise, 0.0, 1.0)
    np.fill_diagonal(matrix, 1.0)
    return matrix, labels


def _cell_ink(cmap, value: float) -> str:
    """Black or white ink for a cell, chosen by the fill's perceived lightness."""
    red, green, blue = to_rgb(to_hex(cmap(value)))[:3]
    luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    return "black" if luminance > _LUMINANCE_SPLIT else "white"


def main() -> None:
    matrix, labels = synthetic_matrix()
    cmap = pubstyle.sequential("viridis")

    fig, (ax,) = pubstyle.new_figure(height_mm=72.0, columns=1)

    image = ax.imshow(matrix, cmap=cmap, vmin=0.0, vmax=1.0, interpolation="nearest")
    ax.set_xticks(range(len(labels)), labels, rotation=ROTATION_DEG, ha="right", rotation_mode="anchor")
    ax.set_yticks(range(len(labels)), labels)
    ax.set_xlabel("Partner region")
    ax.set_ylabel("Reference region")

    for row in range(matrix.shape[0]):
        for col in range(matrix.shape[1]):
            ax.text(
                col,
                row,
                f"{matrix[row, col]:.2f}",
                ha="center",
                va="center",
                fontsize=BASE_PT - 1,
                color=_cell_ink(cmap, float(matrix[row, col])),
            )

    # A labelled colorbar is the scale; without units the numbers mean nothing.
    bar = fig.colorbar(image, ax=ax, fraction=0.046, pad=0.03)
    bar.set_label("Agreement (unitless)")
    bar.outline.set_linewidth(0.6)

    written = pubstyle.save_figure(fig, OUTPUT / "03_annotated_heatmap")
    print("wrote " + ", ".join(p.name for p in written))


if __name__ == "__main__":
    main()
