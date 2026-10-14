"""Publication styling for matplotlib figures, in one import.

Every paper gets exactly one copy of this module (or one project module built
from it). Figure scripts import it and never touch ``matplotlib.rcParams`` or
hard-code hex values themselves, so the style of a whole manuscript is defined
in a single file.

Surface (nothing else is public)::

    apply_publication_style  configure rcParams, return what was applied
    new_figure               canvas at final print size, in millimeters
    PALETTES                 colorblind-safe categorical palettes
    SEMANTIC                 fixed role -> color map for a paper
    categorical              first n colors of a palette
    sequential               perceptually-uniform colormap accessor
    save_figure              layout tightening + multi-format export
    validate_figure          the export checklist, as code
    despine                  per-axes cleanup

Design rule that the rest of the module enforces: the canvas is the journal
page. Figures are drawn once, at final size, and are never rescaled or cropped.

The module forces a non-interactive backend at import so a script behaves the
same on a laptop and in CI. Set ``PUBSTYLE_BACKEND`` before importing to use a
different backend interactively.

Citation:
    Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
    Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
    https://github.com/Linxira-OS/linxira-skills
"""

from __future__ import annotations

import os
import shutil
from pathlib import Path
from typing import Iterator, Sequence

import matplotlib

matplotlib.use(os.environ.get("PUBSTYLE_BACKEND", "Agg"))

import numpy as np  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402  (backend must be set first)
from matplotlib.axes import Axes  # noqa: E402
from matplotlib.collections import QuadMesh  # noqa: E402
from matplotlib.colors import Colormap, to_hex, to_rgba  # noqa: E402
from matplotlib.figure import Figure  # noqa: E402
from matplotlib.layout_engine import ConstrainedLayoutEngine  # noqa: E402
from matplotlib.text import Text  # noqa: E402

__all__ = [
    "apply_publication_style",
    "new_figure",
    "PALETTES",
    "SEMANTIC",
    "categorical",
    "sequential",
    "save_figure",
    "validate_figure",
    "despine",
]

# --------------------------------------------------------------------------- #
# Constants
# --------------------------------------------------------------------------- #

MM_PER_INCH = 25.4

#: Usable column widths shared by the common publishers (in mm).
_JOURNAL_WIDTH_MM: dict[int, float] = {1: 89.0, 2: 183.0}

#: How far a delivered canvas may drift from its recorded target, in mm.
_JOURNAL_TOLERANCE_MM = 1.0

#: Text below this size is destroyed by stroke rendering and print halftoning.
_MIN_TEXT_PT = 5.0

#: Color-vision-deficiency-safe categorical palettes (published public data).
PALETTES: dict[str, tuple[str, ...]] = {
    "okabe_ito": (
        "#0072B2",  # blue
        "#D55E00",  # vermillion
        "#009E73",  # bluish green
        "#E69F00",  # orange
        "#56B4E9",  # sky blue
        "#CC79A7",  # reddish purple
        "#F0E442",  # yellow
        "#000000",  # black
    ),
    "dark2": (
        "#1B9E77",
        "#D95F02",
        "#7570B3",
        "#E7298A",
        "#66A61E",
        "#E6AB02",
        "#A6761D",
        "#666666",
    ),
}

#: One decoded meaning per paper; reuse these roles in every figure.
SEMANTIC: dict[str, str] = {
    "method": "#0072B2",
    "baseline": "#666666",
    "variant": "#E69F00",
    "emphasis": "#D55E00",
    "neutral": "#BBBBBB",
}

#: Colormaps that must never appear in a publication figure.
_BANNED_COLORMAPS = frozenset({"jet", "rainbow", "hsv", "nipy_spectral", "gist_rainbow", "gist_ncar"})

#: Font stacks whose last entry always exists in matplotlib's own data.
_FONT_STACKS: dict[str, tuple[str, ...]] = {
    "sans": ("Helvetica", "Arial", "Liberation Sans", "Nimbus Sans", "DejaVu Sans"),
    "serif": ("Times New Roman", "Times", "Liberation Serif", "Nimbus Roman", "DejaVu Serif"),
}

#: TeX entry points, tried in order when ``use_tex=True``.
_TEX_BINARIES = ("latex", "pdflatex", "xelatex", "lualatex")

#: Layout tightening amounts (multiples of the base font size).
_TIGHT_PAD_LOOSE = 0.8
_TIGHT_PAD_DENSE = 0.35
_DENSE_AXES = 4

_SVG_TEXT_MODES = ("none", "path")

#: Default export DPI; pass 600 for pure line art (hard-edged strokes alias).
_RENDER_DPI = 300

#: Colors that are always legitimate: paper, ink, and "no fill".
_ALWAYS_ALLOWED = frozenset({"#FFFFFF", "#000000"})


# --------------------------------------------------------------------------- #
# Style entry point
# --------------------------------------------------------------------------- #


def _resolve_font(font: str) -> tuple[str, list[str], str]:
    """Map a font request to ``(family key, fallback stack, mathtext fontset)``."""
    key = font.strip().lower()
    if key in _FONT_STACKS:  # "sans" | "serif"
        stack = list(_FONT_STACKS[key])
        return key, stack, "dejavusans" if key == "sans" else "dejavuserif"
    if not key:
        raise ValueError("font must be 'sans', 'serif', or an exact family name")
    # An exact family name: keep it first, and end with a family that ships with
    # matplotlib so the figure renders identically on any machine.
    return "sans", [font, *_FONT_STACKS["sans"][1:]], "dejavusans"


def _find_tex() -> str | None:
    for binary in _TEX_BINARIES:
        found = shutil.which(binary)
        if found:
            return found
    return None


def apply_publication_style(
    base_pt: float = 7.0,
    font: str = "sans",
    use_tex: bool = False,
    svg_text: str = "none",
) -> dict[str, object]:
    """Configure ``rcParams`` for a paper and return the applied settings.

    Parameters
    ----------
    base_pt:
        Base font size in points at final print size. Values below 5 pt are
        rejected: nothing may be smaller than that in print.
    font:
        ``"sans"``, ``"serif"``, or an exact installed family name.
    use_tex:
        Render labels through a real TeX installation. Raises when no TeX
        binary is reachable instead of silently falling back to mathtext.
    svg_text:
        ``"none"`` keeps SVG text editable, ``"path"`` outlines it.

    Returns
    -------
    dict
        The settings that were written, for logging and tests.
    """
    if base_pt < _MIN_TEXT_PT:
        raise ValueError(
            f"base_pt={base_pt} is below the {_MIN_TEXT_PT} pt print floor; "
            "enlarge the canvas instead of shrinking the type"
        )
    if svg_text not in _SVG_TEXT_MODES:
        raise ValueError(f"svg_text must be one of {_SVG_TEXT_MODES}, got {svg_text!r}")

    family_key, stack, mathtext_set = _resolve_font(font)

    tex_binary: str | None = None
    if use_tex:
        tex_binary = _find_tex()
        if tex_binary is None:
            raise RuntimeError(
                "use_tex=True but no TeX binary was found on PATH "
                f"(looked for {', '.join(_TEX_BINARIES)}). Install TeX, or set "
                "use_tex=False and write labels in unicode/mathtext."
            )
        mathtext_set = "cm"

    settings: dict[str, object] = {
        # --- type ---------------------------------------------------------
        "font.family": f"{family_key}-serif" if family_key == "sans" else "serif",
        "font.sans-serif": stack if family_key == "sans" else list(_FONT_STACKS["sans"]),
        "font.serif": stack if family_key == "serif" else list(_FONT_STACKS["serif"]),
        "mathtext.fontset": mathtext_set,
        "text.usetex": bool(use_tex),
        "font.size": float(base_pt),
        "axes.labelsize": float(base_pt + 1),
        "axes.titlesize": float(base_pt + 2),
        "figure.titlesize": float(base_pt + 2),
        "xtick.labelsize": float(base_pt - 1),
        "ytick.labelsize": float(base_pt - 1),
        "legend.fontsize": float(base_pt - 1),
        # --- strokes ------------------------------------------------------
        "axes.linewidth": 0.6,
        "lines.linewidth": 1.2,
        "lines.markersize": 3.0,
        "axes.edgecolor": "black",
        # --- ticks --------------------------------------------------------
        "xtick.direction": "out",
        "ytick.direction": "out",
        "xtick.major.width": 0.6,
        "ytick.major.width": 0.6,
        "xtick.major.size": 2.5,
        "ytick.major.size": 2.5,
        "xtick.minor.width": 0.4,
        "ytick.minor.width": 0.4,
        "xtick.minor.size": 1.4,
        "ytick.minor.size": 1.4,
        "xtick.top": False,
        "ytick.right": False,
        # --- furniture ----------------------------------------------------
        "axes.spines.top": False,
        "axes.spines.right": False,
        "axes.grid": False,
        "legend.frameon": False,
        "legend.handlelength": 1.6,
        "legend.borderaxespad": 0.4,
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        # --- export -------------------------------------------------------
        "pdf.fonttype": 42,
        "ps.fonttype": 42,
        "svg.fonttype": svg_text,
        "savefig.dpi": _RENDER_DPI,
        "savefig.facecolor": "white",
        # The canvas is the journal page: never let a save crop it.
        "savefig.bbox": None,
    }

    for key, value in settings.items():
        matplotlib.rcParams[key] = value

    applied = dict(settings)
    applied["tex_binary"] = tex_binary
    return applied


# --------------------------------------------------------------------------- #
# Canvas
# --------------------------------------------------------------------------- #


def new_figure(
    height_mm: float,
    columns: int = 1,
    width_mm: float | None = None,
    nrows: int = 1,
    ncols: int = 1,
    **gridspec_kw,
) -> tuple[Figure, list[Axes]]:
    """Create a figure at final print size and return ``(fig, axes)``.

    Width comes from ``width_mm`` when given, otherwise from the journal column
    table (89 mm single, 183 mm double). Heights and widths are always in
    millimeters; callers never convert.

    The requested width is recorded on the figure, and :func:`validate_figure`
    later proves the delivered canvas still matches it.
    """
    if height_mm <= 0:
        raise ValueError(f"height_mm must be positive, got {height_mm}")
    if nrows < 1 or ncols < 1:
        raise ValueError(f"nrows and ncols must be >= 1, got {nrows}x{ncols}")
    if width_mm is None:
        if columns not in _JOURNAL_WIDTH_MM:
            raise ValueError(f"columns must be 1 or 2, got {columns!r}; or pass width_mm explicitly")
        target_mm = _JOURNAL_WIDTH_MM[columns]
    else:
        if width_mm <= 0:
            raise ValueError(f"width_mm must be positive, got {width_mm}")
        target_mm = float(width_mm)

    fig = plt.figure(figsize=(target_mm / MM_PER_INCH, height_mm / MM_PER_INCH))
    axes = [
        ax
        for row in fig.subplots(nrows=nrows, ncols=ncols, squeeze=False, **gridspec_kw)
        for ax in row
    ]

    fig._pubstyle_target_mm = target_mm  # type: ignore[attr-defined]
    fig._pubstyle_columns = columns  # type: ignore[attr-defined]
    return fig, axes


def despine(ax: Axes) -> Axes:
    """Remove top and right spines (the module default, made explicit)."""
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    return ax


# --------------------------------------------------------------------------- #
# Color
# --------------------------------------------------------------------------- #


def categorical(n: int, palette: str = "okabe_ito") -> list[str]:
    """Return the first ``n`` colors of a named categorical palette.

    Raises
    ------
    ValueError
        Unknown palette, negative ``n``, or ``n`` larger than the palette.
        Overflow is an error on purpose: adding a ninth hue helps nobody.
    """
    if palette not in PALETTES:
        raise ValueError(f"unknown palette {palette!r}; available: {sorted(PALETTES)}")
    if n < 0:
        raise ValueError(f"n must be >= 0, got {n}")
    colors = PALETTES[palette]
    if n > len(colors):
        raise ValueError(
            f"palette {palette!r} holds {len(colors)} colors but {n} were requested; "
            "group categories, split panels, or label bars directly instead of adding hues"
        )
    return list(colors[:n])


def sequential(name: str = "viridis") -> Colormap:
    """Return a perceptually-uniform colormap, rejecting rainbow-family ones."""
    if name in _BANNED_COLORMAPS:
        raise ValueError(
            f"colormap {name!r} is banned: rainbow-family maps create false structure "
            "and are not colorblind-safe. Use viridis, magma, inferno, or cividis."
        )
    try:
        return matplotlib.colormaps[name]
    except KeyError as exc:
        raise ValueError(f"unknown colormap {name!r}") from exc


# --------------------------------------------------------------------------- #
# Export
# --------------------------------------------------------------------------- #


def _tighten(fig: Figure) -> None:
    """Arrange content inside the exact-size canvas (never crop the canvas)."""
    if isinstance(fig.get_layout_engine(), ConstrainedLayoutEngine):
        return  # the engine reserves its own space at draw time
    pad = _TIGHT_PAD_DENSE if len(fig.get_axes()) >= _DENSE_AXES else _TIGHT_PAD_LOOSE
    fig.tight_layout(pad=pad)


def save_figure(
    fig: Figure,
    stem: str | Path,
    formats: Sequence[str] = ("pdf", "png"),
    dpi: int = _RENDER_DPI,
    validate: bool = True,
) -> list[Path]:
    """Tighten layout, then write every requested format; return the paths.

    All formats are written from the same figure object at final size — nothing
    is rescaled, and the canvas is never cropped, so the delivered width keeps
    matching the journal target and the font-size contract holds.
    """
    if validate:
        violations = validate_figure(fig)
        if violations:
            raise ValueError(
                "figure failed export validation; fix these before saving:\n  - "
                + "\n  - ".join(violations)
            )

    stem = Path(stem)
    if stem.parent and not stem.parent.exists():
        stem.parent.mkdir(parents=True, exist_ok=True)

    _tighten(fig)

    written: list[Path] = []
    for fmt in formats:
        suffix = fmt if fmt.startswith(".") else f".{fmt}"
        path = stem.with_suffix(suffix)
        fig.savefig(path, dpi=dpi, format=suffix.lstrip("."))
        written.append(path)
    return written


# --------------------------------------------------------------------------- #
# Validation
# --------------------------------------------------------------------------- #


def _iter_texts(fig: Figure) -> Iterator[Text]:
    for ax in fig.get_axes():
        yield from ax.texts
        yield ax.title
        yield ax.xaxis.label
        yield ax.yaxis.label
        yield ax.xaxis.get_offset_text()
        yield ax.yaxis.get_offset_text()
        for tick in (*ax.get_xticklabels(), *ax.get_yticklabels()):
            yield tick
        legend = ax.get_legend()
        if legend is not None:
            yield from legend.get_texts()
    yield from fig.texts
    for legend in fig.legends:
        yield from legend.get_texts()


def _text_pt(text: Text, renderer, dpi: float) -> float:
    """Effective rendered size of ``text`` in points, at final print size.

    Two things are measured on the live renderer instead of being read off
    ``rcParams``: the glyph box proves the text actually renders (a missing
    family falls back or drops out, collapsing the box), and the resolved font
    property gives the size the renderer uses, including any per-artist
    override. Ink height alone would be the wrong measure — a lone ``y`` covers
    about half its point size and a row of digits less still.
    """
    bbox = text.get_window_extent(renderer=renderer)
    if bbox.width <= 0 or bbox.height <= 0:
        return 0.0
    size_pt = float(text.get_fontproperties().get_size_in_points())
    if size_pt <= 0:  # relative sizes ("larger") that never resolved
        return 0.0
    ink_pt = float(bbox.height) * 72.0 / dpi
    if ink_pt > size_pt * 2.0:  # scaled up by a transform: trust the ink
        return ink_pt
    return size_pt


def _is_box_worthy(ax: Axes) -> bool:
    """Heatmaps, image panels, and colorbars keep all four spines."""
    if ax.get_label() == "<colorbar>":
        return True
    if ax.images:
        return True
    return any(isinstance(coll, QuadMesh) for coll in ax.collections)


def _shared_label(ax: Axes, which: str) -> str:
    """Label of ``ax`` or of a sibling that shares the axis it is hidden with."""
    label = ax.get_xlabel() if which == "x" else ax.get_ylabel()
    if label:
        return label
    grouper = ax.get_shared_x_axes() if which == "x" else ax.get_shared_y_axes()
    for sibling in grouper.get_siblings(ax):
        if sibling is ax:
            continue
        label = sibling.get_xlabel() if which == "x" else sibling.get_ylabel()
        if label:
            return label
    return ""


def _iter_artist_colors(ax: Axes) -> Iterator[tuple[str, object]]:
    """Yield ``(what, color)`` for every color a reader can see in ``ax``.

    Colormap-driven collections are skipped: their colors come from the
    colormap, which the colormap check governs instead.
    """
    for i, line in enumerate(ax.get_lines()):
        yield f"line {i} color", line.get_color()
    for i, patch in enumerate(ax.patches):
        yield f"patch {i} facecolor", patch.get_facecolor()
        yield f"patch {i} edgecolor", patch.get_edgecolor()
    for i, coll in enumerate(ax.collections):
        if getattr(coll, "get_array", lambda: None)() is not None:
            continue
        yield f"collection {i} facecolors", coll.get_facecolor()
        yield f"collection {i} edgecolors", coll.get_edgecolors()


def _color_value(value) -> tuple[float, float, float, float] | None:
    """Normalize one color (name, hex, tuple, or RGBA row) to an RGBA tuple."""
    try:
        return to_rgba(value)
    except (ValueError, TypeError):
        return None


def _colors_of(color) -> list[tuple[float, float, float, float] | None]:
    """Expand a color or an ``(n, 3|4)`` array of colors into RGBA tuples."""
    arr = np.asarray(color, dtype=float) if not isinstance(color, str) else None
    if arr is not None and arr.ndim == 2:
        return [_color_value(tuple(row)) for row in arr]
    return [_color_value(color)]


def _check_colors(fig: Figure) -> list[str]:
    offenders: dict[str, str] = {}
    for ax in fig.get_axes():
        where = ax.get_label() or "axes"
        for what, color in _iter_artist_colors(ax):
            for rgba in _colors_of(color):
                if rgba is None or rgba[3] == 0:
                    continue
                hexed = to_hex(rgba[:3]).upper()
                if hexed in _ALLOWED_COLORS:
                    continue
                offenders.setdefault(hexed, f"ax[{where}] {what}")
    if not offenders:
        return []
    listed = ", ".join(f"{hexed} ({origin})" for hexed, origin in sorted(offenders.items())[:6])
    extra = f" (+{len(offenders) - 6} more)" if len(offenders) > 6 else ""
    return [
        "colors outside PALETTES/SEMANTIC: "
        + listed
        + extra
        + " — use a semantic role or categorical() instead of ad hoc values"
    ]


_ALLOWED_COLORS = frozenset(
    {c.upper() for colors in PALETTES.values() for c in colors} | {c.upper() for c in SEMANTIC.values()}
) | _ALWAYS_ALLOWED


def _check_text_floor(fig: Figure, renderer, dpi: float) -> list[str]:
    problems = []
    for text in _iter_texts(fig):
        if not text.get_visible() or not text.get_text().strip():
            continue
        size_pt = _text_pt(text, renderer, dpi)
        if size_pt == 0.0:
            problems.append(f"text {text.get_text()[:24]!r} produces no renderable glyph box")
        elif size_pt < _MIN_TEXT_PT:
            problems.append(
                f"text {text.get_text()[:24]!r} renders at {size_pt:.2f} pt at final size "
                f"(floor {_MIN_TEXT_PT} pt)"
            )
    return problems


def _check_spines(fig: Figure) -> list[str]:
    problems = []
    for ax in fig.get_axes():
        if not ax.axison or _is_box_worthy(ax):
            continue  # a fully switched-off axes draws no spines at all
        for side in ("top", "right"):
            if ax.spines[side].get_visible():
                problems.append(
                    f"ax[{ax.get_label() or 'axes'}] keeps its {side} spine; "
                    "despine it unless the chart is a box-worthy heatmap/image panel"
                )
    return problems


def _check_legends(fig: Figure) -> list[str]:
    problems = []
    legends = [leg for ax in fig.get_axes() if (leg := ax.get_legend()) is not None] + list(fig.legends)
    for i, legend in enumerate(legends):
        if legend.get_frame_on():
            problems.append(f"legend {i} is framed; set frameon=False or move it to a legend panel")
    return problems


def _check_axis_labels(fig: Figure) -> list[str]:
    problems = []
    for ax in fig.get_axes():
        if ax.get_label() == "<colorbar>" or not ax.axison:
            continue
        for which in ("x", "y"):
            if not _shared_label(ax, which):
                problems.append(
                    f"ax[{ax.get_label() or 'axes'}] has no {which}-axis label; "
                    "state quantity and unit (or share the axis explicitly)"
                )
    return problems


def _colormap_of(mappable) -> Colormap | None:
    cmap = getattr(mappable, "cmap", None)
    return cmap if isinstance(cmap, Colormap) else None


def _iter_artists(artist) -> Iterator[object]:
    yield artist
    for child in artist.get_children():
        yield from _iter_artists(child)


def _iter_mappables(fig: Figure) -> Iterator[object]:
    """Every object in the figure that carries a colormap."""
    seen: set[int] = set()
    for artist in _iter_artists(fig):
        cmap = getattr(artist, "cmap", None)
        if isinstance(cmap, Colormap) and id(artist) not in seen:
            seen.add(id(artist))
            yield artist
    for ax in fig.get_axes():
        colorbar = getattr(ax, "_colorbar", None)
        mappable = getattr(colorbar, "mappable", None)
        if mappable is not None and id(mappable) not in seen:
            seen.add(id(mappable))
            yield mappable


def _check_colormaps(fig: Figure) -> list[str]:
    banned: set[str] = set()
    for mappable in _iter_mappables(fig):
        cmap = _colormap_of(mappable)
        if cmap is None:
            continue
        name = str(cmap.name).lower()
        if name in _BANNED_COLORMAPS or name.removesuffix("_r") in _BANNED_COLORMAPS:
            banned.add(str(cmap.name))
    return [
        f"colormap {name!r} is banned; use viridis/magma/inferno/cividis" for name in sorted(banned)
    ]


def _check_width(fig: Figure) -> list[str]:
    width_mm = fig.get_size_inches()[0] * MM_PER_INCH
    target_mm = getattr(fig, "_pubstyle_target_mm", None)
    if target_mm is None:
        nearest = min(_JOURNAL_WIDTH_MM.values(), key=lambda t: abs(t - width_mm))
        if abs(nearest - width_mm) > _JOURNAL_TOLERANCE_MM:
            return [
                f"figure width {width_mm:.1f} mm matches no journal column "
                f"(single 89 mm, double 183 mm) within {_JOURNAL_TOLERANCE_MM} mm"
            ]
        return []
    if abs(width_mm - target_mm) > _JOURNAL_TOLERANCE_MM:
        return [
            f"figure width {width_mm:.2f} mm drifted from the target {target_mm:.1f} mm "
            f"by more than {_JOURNAL_TOLERANCE_MM} mm"
        ]
    return []


def validate_figure(fig: Figure) -> list[str]:
    """Run the export checklist and return human-readable violations.

    An empty list means the figure may ship. Checks, in order:

    1. every rendered text measures at least 5 pt at final size;
    2. top and right spines are gone, except on box-worthy panels;
    3. no legend is framed;
    4. every visible axis carries a label (its own or a shared sibling's);
    5. every categorical color resolves to :data:`PALETTES` or :data:`SEMANTIC`;
    6. no rainbow-family colormap appears anywhere;
    7. the canvas still matches the journal width within 1 mm.
    """
    try:
        renderer = fig.canvas.get_renderer()
    except AttributeError:  # non-Agg backends only expose it after a draw
        fig.canvas.draw()
        renderer = fig.canvas.renderer
    dpi = float(fig.dpi)

    violations: list[str] = []
    violations += _check_text_floor(fig, renderer, dpi)
    violations += _check_spines(fig)
    violations += _check_legends(fig)
    violations += _check_axis_labels(fig)
    violations += _check_colors(fig)
    violations += _check_colormaps(fig)
    violations += _check_width(fig)
    return violations
