"""Grouped bars that survive grayscale printing.

Three methods on four benchmarks, drawn at single-column width. Every bar keeps
a dark edge stroke and a hatch, so identity survives a photocopy or a
colorblind reader. The y-axis starts at zero because the claim is about
magnitudes, not differences.

Run:  python examples/02_grouped_bars.py
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


def synthetic_scores(seed: int = 23) -> tuple[list[str], list[str], np.ndarray]:
    """(benchmarks, methods, scores[benchmark, method]) for a fake comparison."""
    rng = np.random.default_rng(seed)
    benchmarks = ["Alpha", "Beta", "Gamma", "Delta"]
    methods = ["baseline", "variant", "method"]
    base = np.array([61.0, 74.0, 55.0, 82.0])
    lift = np.array([[0.0, 3.5, 8.0], [0.0, 2.0, 5.5], [0.0, 4.5, 9.5], [0.0, 1.5, 4.0]])
    scores = np.clip(base[:, None] + lift + rng.normal(0.0, 0.7, (4, 3)), 0.0, 100.0)
    return benchmarks, methods, scores


def main() -> None:
    benchmarks, methods, scores = synthetic_scores()
    x = np.arange(len(benchmarks), dtype=float)
    width = 0.26

    fig, (ax,) = pubstyle.new_figure(height_mm=58.0, columns=1)

    # Two redundant channels for group identity: hue role + hatch pattern.
    styles = {
        "baseline": dict(color=pubstyle.SEMANTIC["baseline"], hatch=""),
        "variant": dict(color=pubstyle.SEMANTIC["variant"], hatch="//"),
        "method": dict(color=pubstyle.SEMANTIC["method"], hatch=".."),
    }
    for i, method in enumerate(methods):
        offset = (i - 1) * width
        ax.bar(
            x + offset,
            scores[:, i],
            width=width,
            label=method,
            edgecolor="black",
            linewidth=0.6,
            **styles[method],
        )

    ax.set_xticks(x, benchmarks)
    ax.set_xlabel("Benchmark")
    ax.set_ylabel("Score (%, higher is better)")
    ax.set_ylim(0, 105)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    ax.legend(loc="upper left", ncol=3, columnspacing=1.0, handlelength=1.2)
    ax.margins(x=0.03)

    written = pubstyle.save_figure(fig, OUTPUT / "02_grouped_bars")
    print("wrote " + ", ".join(p.name for p in written))


if __name__ == "__main__":
    main()
