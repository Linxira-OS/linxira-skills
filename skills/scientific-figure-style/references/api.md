# API Conventions: Publication Style Helpers

Implement one small module per project (canonical copy: `scripts/pubstyle.py`) that
owns every style constant. Figure scripts import it and touch `matplotlib.rcParams`
only through it, so a paper's style lives in exactly one place — the wired demos under
`examples/` (`python examples/01_trend_lines.py`, output in `examples/output/`)
exercise every call below.

## Module Surface

```python
apply_publication_style(...)          # rcParams entry point
new_figure(...)                       # print-sized figure + axes
PALETTES / SEMANTIC                   # fixed palettes and role colors
categorical(n, palette)               # n colors of a named palette
sequential(name)                      # perceptually-uniform colormap
save_figure(...)                      # layout tightening + multi-format export
validate_figure(fig)                  # the export checklist, as code
despine(ax)                           # per-axes cleanup
```

Expose nothing else. If a script needs a style knob the module lacks, extend the
module, not the script.

## Entry Function

```python
def apply_publication_style(
    base_pt: float = 7.0,          # font.size; hard floor 5.0, below it ValueError
    font: str = "sans",            # "sans" | "serif" | an exact family name
    use_tex: bool = False,         # True only when math labels require it
    svg_text: str = "none",        # "none" keeps editable text | "path" outlines
) -> dict[str, object]:
    """Configure rcParams for the project; return the applied settings."""
```

- Sizes: `font.size = base_pt`; axis labels `+1`; tick labels, legend `-1`; titles `+2`.
- Strokes: `axes.linewidth = 0.6`, `lines.linewidth = 1.2`, tick width `0.6`, length
  `2.5`, direction `out`; top and right spines off by default.
- Fonts: `"sans"` maps to a Helvetica-class fallback list ending in `DejaVu Sans`; an
  exact family name keeps its place and still ends with a shipped fallback.
- Embedding and export: `pdf.fonttype = 42`, `ps.fonttype = 42`,
  `svg.fonttype = svg_text`, `savefig.dpi = 300`, white face colors, `savefig.bbox`
  pinned to unset — the canvas is the journal page, not a crop target.
- `use_tex=True` looks for `latex`/`pdflatex`/`xelatex`/`lualatex` on `PATH` and raises
  `RuntimeError` when none is reachable; it never falls back silently.
- Returns the settings written plus the resolved `tex_binary`, so a build log can
  record what the figures were drawn with.

## Figure Construction

```python
def new_figure(
    height_mm: float,
    columns: int = 1,              # 1 or 2 → journal width
    width_mm: float | None = None, # overrides columns
    nrows: int = 1,
    ncols: int = 1,
    **gridspec_kw,                 # sharex, sharey, height_ratios, ...
) -> tuple[Figure, list[Axes]]:
    """Create a figure at final print size; return fig and flattened axes."""
```

- Width comes from `width_mm` or the journal table (89 mm single, 183 mm double);
  `inches = mm / 25.4` happens inside, so callers never pass inches — columns other
  than 1 or 2 need an explicit `width_mm`.
- The requested width is recorded on the figure; check 7 below proves the delivered
  canvas still matches it. The module sets a non-interactive backend at import
  (`PUBSTYLE_BACKEND` overrides it), so scripts behave identically in CI and on laptops.

## Palette Management

```python
PALETTES = {
    "okabe_ito": ("#0072B2", "#D55E00", "#009E73", "#E69F00", "#56B4E9", "#CC79A7", "#F0E442", "#000000"),
    "dark2":     ("#1B9E77", "#D95F02", "#7570B3", "#E7298A", "#66A61E", "#E6AB02", "#A6761D", "#666666"),
}
SEMANTIC = {
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
- Overflowing a palette is an error, not a wrap-around: group categories, split panels,
  or label bars directly. `sequential` rejects jet, rainbow, hsv, nipy_spectral, the
  gist-rainbow family, and unknown names.
- For gradual sequences within one family, take lightness steps of one hue.

## Saving

```python
def save_figure(
    fig: Figure,
    stem: str | Path,              # output path without extension
    formats: tuple[str, ...] = ("pdf", "png"),
    dpi: int = 300,                # 600 for pure line art
    validate: bool = True,
) -> list[Path]:
    """Tighten layout, then write every format; return written paths."""
```

- Create parent directories on demand; write all formats from the same figure at
  final size and never rescale.
- Layout tightening runs last, before writing: `fig.tight_layout(pad=0.35)` for dense
  figures (four or more axes), `pad=0.8` otherwise; a figure already using
  constrained layout is left to its engine. This arranges content inside the canvas
  — never crop it with `bbox_inches="tight"`, or the delivered width stops matching
  the journal target and every font-size promise breaks.
- `validate=True` runs `validate_figure` first; a non-empty result raises `ValueError`
  listing the violations, so an invalid figure is never written.

## Export Validation Checklist

`validate_figure(fig) -> list[str]` walks every axis and returns human-readable
violations; an empty list means the figure may ship. It checks:

1. Every text is at least 5 pt at final size: rendered, glyph box measured, resolved
   font property read — not `rcParams` — so overrides count and unrenderable text reports.
2. Top and right spines are gone, except on box-worthy panels (heatmaps, image panels,
   colorbars, whose outline is the design) and on axes switched off.
3. No legend is framed; a legend sits in empty space or in a legend panel.
4. Both axes carry quantity + unit labels, or inherit them from a shared-axis sibling.
5. Categorical colors resolve to `PALETTES` or `SEMANTIC` entries (white and black are
   always allowed); colormap-driven collections are exempt, since check 6 governs them.
6. No `jet`, `rainbow`, `hsv` or look-alike colormap appears anywhere, colorbars included.
7. Figure width matches the recorded journal target within 1 mm; a figure not built by
   `new_figure` must land on a journal column width within 1 mm.

Treat a failed validation like a failing test: a figure is done when the list is empty.
Where next: rules in `../SKILL.md`, patterns in `common-patterns.md`, rationale in
`design-theory.md`.

## Citation

```text
Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
