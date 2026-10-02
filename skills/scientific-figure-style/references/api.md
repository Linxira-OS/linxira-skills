# API Conventions: Publication Style Helpers

Implement one small module per project (suggested name `pubstyle.py`) that owns
every style constant. Figure scripts import it and touch `matplotlib.rcParams`
only through it, so the style of a whole paper is defined in exactly one place.

## Module Surface

```python
# pubstyle.py — single import point for publication styling.
apply_publication_style(...)   # rcParams entry point
new_figure(...)                # print-sized figure + axes
categorical(...) / sequential(...)  # palette access
save_figure(...)               # multi-format export
validate_figure(...)           # export checklist
despine(ax)                    # per-axes cleanup
```

Expose nothing else. If a script needs a style knob the module lacks, extend the
module, not the script.

## Entry Function

```python
def apply_publication_style(
    base_pt: float = 7.0,          # font.size; hard floor 5.0
    font: str = "sans",            # "sans" | "serif" | an exact family name
    use_tex: bool = False,         # True only when math labels require it
    svg_text: str = "none",        # "none" keeps editable text | "path" outlines
) -> dict[str, object]:
    """Configure rcParams for the project; return the applied settings."""
```

Behavior to implement:

- Sizes: `font.size = base_pt`; `axes.labelsize = base_pt + 1`; tick labels,
  legend = `base_pt - 1`; panel titles = `base_pt + 2`.
- Weights: `axes.linewidth = 0.6`, `lines.linewidth = 1.2`, tick width `0.6`,
  tick length `2.5`, ticks pointing out (`xtick.direction = "out"`).
- Fonts: map `"sans"` to a Helvetica-class fallback list ending in `DejaVu Sans`.
- Embedding: `pdf.fonttype = 42`, `ps.fonttype = 42`, `svg.fonttype = svg_text`.
- Export: `savefig.dpi = 300`, `savefig.facecolor = "white"`; leave `savefig.bbox`
  unset — the canvas is the journal page, not a crop target.
- When `use_tex=True`, verify a TeX binary is reachable and raise an actionable
  error otherwise; never let it silently fall back to matplotlib mathtext.

## Figure Construction

```python
def new_figure(
    height_mm: float,
    columns: int = 1,              # 1 or 2 → journal width
    width_mm: float | None = None, # overrides columns
    nrows: int = 1,
    ncols: int = 1,
    **gridspec_kw,
) -> tuple[Figure, list[Axes]]:
    """Create a figure at final print size; return fig and flattened axes."""
```

- Width comes from `width_mm` or the journal table (89 mm single, 183 mm double);
  convert with `inches = mm / 25.4`. Callers never pass inches.
- Import with a non-interactive backend (`matplotlib.use("Agg")` before pyplot)
  so scripts behave identically in CI and on laptops.

## Palette Management

```python
PALETTES: dict[str, tuple[str, ...]] = {
    "okabe_ito": ("#0072B2", "#D55E00", "#009E73", "#E69F00",
                  "#56B4E9", "#CC79A7", "#F0E442", "#000000"),
    "dark2":     ("#1B9E77", "#D95F02", "#7570B3", "#E7298A",
                  "#66A61E", "#E6AB02", "#A6761D", "#666666"),
}
SEMANTIC: dict[str, str] = {
    "method": "#0072B2",      # proposed approach
    "baseline": "#666666",    # prior work / control
    "variant": "#E69F00",     # ablations, incremental changes
    "emphasis": "#D55E00",    # the one thing to notice
    "neutral": "#BBBBBB",     # backgrounds, grids, reference bands
}

def categorical(n: int, palette: str = "okabe_ito") -> list[str]:
    """First n colors of a named palette; ValueError if n exceeds its length."""

def sequential(name: str = "viridis") -> Colormap:
    """Named perceptually-uniform colormap; reject jet/rainbow/hsv explicitly."""
```

- Plot scripts request semantic roles (`SEMANTIC["method"]`), never raw hex, so
  recoloring the paper is a one-line change.
- For gradual sequences within one family (e.g., ablation completeness), take
  lightness steps of one hue instead of adding hues.

## Saving

```python
def save_figure(
    fig: Figure,
    stem: str,                     # output path without extension
    formats: tuple[str, ...] = ("pdf", "png"),
    dpi: int = 300,                # 600 for pure line art
    validate: bool = True,
) -> list[Path]:
    """Tighten layout, then write every format; return written paths."""
```

- Create parent directories on demand.
- Apply the final layout tightening immediately before saving: `fig.tight_layout()`
  with a smaller `pad` for dense multi-panel figures, or constrained layout if
  the project prefers it — pick one per project and keep it. This arranges
  content inside the canvas; do not crop the canvas with
  `bbox_inches="tight"`, or the delivered width stops matching the journal
  target and downstream rescaling breaks the font-size contract.
- Write all formats from the same figure object at final size; never rescale.
- With `validate=True`, run `validate_figure` first and refuse to save on failure.

## Export Validation Checklist

`validate_figure(fig) -> list[str]` walks every axis and returns human-readable
violations; an empty list means the figure may ship. Check at least:

1. Every text element measures ≥ 5 pt at final size (render, then measure — do
   not trust rcParams alone).
2. Top and right spines removed, except box-worthy chart types (heatmaps,
   matrices, image panels) and colorbars, whose outline is the design.
3. No framed legend; legend sits inside empty space or in a legend panel.
4. Both axes carry quantity + unit labels (or a deliberate shared-axis setup).
5. Categorical colors resolve to `PALETTES` or `SEMANTIC` entries — no ad hoc hex.
6. No `jet`, `rainbow`, or `hsv` colormap anywhere in the figure.
7. Figure width matches the journal target within 1 mm.

Treat a failed validation like a failing test: the figure is not done until the
list is empty. A figure that passes is consistent by construction, not by luck.

## Navigation

- Style rules and quick decisions: `../SKILL.md`.
- Reusable layout, legend, and dual-coding patterns: `common-patterns.md`.
- Rationale behind each rule: `design-theory.md`.

## Citation

```text
Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
