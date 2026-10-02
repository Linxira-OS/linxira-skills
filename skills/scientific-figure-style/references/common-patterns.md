# Common Patterns: Publication Figures

Copy these schemas instead of reinventing layout per figure. Each pattern states
when to use it, the recipe, and the trap to avoid. Chart-type names give
Chinese-English pairs for reference (图式中文名).

## Multi-Panel Figure With Shared Legend (多面板共享图例)

Use when several panels compare the same series set (e.g., two metrics over
training steps, 双面板趋势对照).

1. Lay out panels with `GRIDSPEC`; reserve one full-width bottom or right tile
   for the legend.
2. Create the legend tile with `ax_leg = fig.add_subplot(gs[...])`, call
   `ax_leg.axis("off")`, then `ax_leg.legend(handles, labels, loc="center",
   frameon=False, ncol=...)`.
3. Collect handles from one representative axis; do not repeat labels per panel.
4. Stamp panel letters ("a", "b", ...) bold at 8–10 pt in the top-left of each
   panel, outside the data region.

Trap: legends duplicated inside each panel drift out of sync and steal ink.

## External Legend (图例外置)

Use when the data region is crowded or series names are long (分组柱状图
grouped bars with long model names).

- Preferred: reserve a legend strip in the grid — one extra `GRIDSPEC` row, an
  axisless axes there, `legend(..., loc="center", frameon=False, ncol=3)`. No
  anchor math, nothing can clip.
- Alternative: with constrained layout, `ax.legend(..., loc="outside lower
  center")` (matplotlib ≥ 3.7) reserves the space for you.
- With `bbox_to_anchor` below the axes you must free room yourself
  (`fig.tight_layout(rect=(0, 0.12, 1, 1))`); the canvas is never cropped to fit.
- For ≤ 4 lines, prefer direct labels at line ends over any legend.

Trap: an anchored legend that pokes past the canvas edge is silently clipped in
the export — check the written PDF/PNG, not the interactive window.

## Print-Safe Bars (印刷安全柱状)

Use when a figure must survive grayscale printing or photocopying (堆叠柱状图
stacked bars, ablation bars 消融对比柱状).

1. Give every filled rectangle a dark edge stroke: `edgecolor="black",
   linewidth=0.6`.
2. Distinguish same-family fills with hatches (`"///"`, `"..."`, `"xx"`), not new
   hues; set `hatchcolor`/edge to a darker step of the fill hue.
3. Keep fill lightness steps ≥ 20% apart within one family; verify by converting
   a PNG to grayscale (`cmap`-free check: print screenshot in B/W).
4. In stacked bars, order segments largest-and-most-important at the base and
   never exceed 4–5 segments; put small segments on top with direct callouts.

Trap: hatch density that looks fine on screen turns to mud at 300 DPI — test the
smallest bar width you actually draw.

## Colorblind-Safe Double Encoding (色盲安全双编码)

Use whenever identity must survive any misreading: CVD readers (~8% of men),
grayscale prints, low-quality projectors.

- Pair every hue with a second channel that carries the same information:
  lines → linestyle/marker (`"-o"`, `"--s"`, `"-.^"`); scatter groups → distinct
  markers plus `edgecolor`; bars → hatch plus lightness step.
- Build palettes from CVD-safe sets (Okabe-Ito) so the hue channel is already
  robust; double encoding covers residual confusion (blue vs green under
  deuteranopia).
- Prefer `cividis` when a colormap itself must be CVD-proof.
- Verify by simulating: export PNG, convert through a CVD simulation or
  grayscale, and confirm groups still separate.

Trap: encoding the second channel with something the reader must decode from a
legend twice — direct labels remove that cost.

## Tight Y-Axis For Group Comparison (收紧 y 轴)

Use when comparing groups whose differences are small relative to full range
(森林图 forest-plot-like comparisons, accuracy tables as bars).

- Set limits to the data's actual span plus one label height: `ax.set_ylim(lo,
  hi)` from observed min/max, not 0.
- Justify the truncation on the figure (axis break marker or clear tick start);
  truncated bars exaggerate differences, so say it honestly.
- Never truncate when the claim involves proportions or counts that readers will
  read as areas.

## Wide Narrative Canvas (超宽叙事画布)

Use for multi-metric comparisons read left to right (多指标并排对比).

- Compose a double-column figure with width:height ≈ 2.5–4:1; one metric per
  tile, shared y where tiles are directly comparable.
- Order tiles by the argument (baseline → method → analysis), not by code
  history; the reader scans left to right.
- Keep per-tile ink minimal: no boxes, no backgrounds, one despine pass.

## Heatmap With Cell Annotations (热图单元标注)

Use for correlation or score matrices (相关矩阵/得分矩阵 heatmap).

1. `imshow` (or `pcolor`) with a perceptually-uniform or diverging colormap
   centered on a meaningful midpoint; keep all four spines.
2. Annotate cells when N ≤ ~15 per side (`text` per cell, 6 pt, color switched
   by cell lightness threshold); otherwise drop annotations and trust the colorbar.
3. Always attach a labeled colorbar with units; rotate long x labels (45°,
   right-aligned) instead of shrinking their font.
4. Sort rows/columns by structure (hierarchical or block order), not by input
   accident.

## Small Multiples Over Encoded Charts (小倍数图)

Use when a single chart would need > 8 categories or dual axes (多类别分组).

- Repeat one simple panel per category with identical scales and shared axes;
  put the category name as the panel title.
- Identical scales are the contract — differing scales turn comparison into a
  lie; if space forces a change, flag it in the caption.

## Navigation

- Wire these into code through `api.md`; decisions in `../SKILL.md`.
- Why each pattern works: `design-theory.md`.

## Citation

```text
Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
