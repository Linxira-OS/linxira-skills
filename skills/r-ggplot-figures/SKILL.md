---
name: r-ggplot-figures
description: Use when building, revising, or exporting an R/ggplot2 figure for a paper, thesis, preprint, poster, or slide. Covers layer grammar, a reusable publication theme, exact ggsave geometry/DPI/font handling, facets and patchwork assembly, colorblind-safe and continuous scales, uncertainty geometries, and direct labelling.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# R ggplot2 Figures

Draw the figure as code, measure it in millimetres, and judge the result from the exported file rather than the interactive viewer.

## Scope Boundary

- Chart choice, captions, panel argument → `scientific-figures-and-tables`.
- Generic style theory and a matplotlib implementation → `scientific-figure-style`.
- Field-specific chart conventions → `discipline-figure-patterns`.
- Everything R-specific (layers, themes, ggsave, patchwork) → here.

## Working Files

| Path | Role |
|---|---|
| `references/theme-export.md` | `theme_pub()`, role palettes, `save_pub()`, journal geometry, font embedding |
| `references/patterns.md` | recipes and pitfalls for curves, bars, heatmaps, scatter, boxplots, forest plots |

## Workflow

1. Fix final width and height in millimetres from the venue specification; never draw first and rescale later.
2. Prepare one long, tidy table: one row per observation, explicit unit and group columns.
3. Map every aesthetic to a column; set fixed cosmetic values outside `aes()`.
4. Apply `theme_pub()`, add stated uncertainty, then assign colour by role.
5. Export with `save_pub()`; inspect at 100% and at print size.
6. Archive the script, package versions, and random seed with the figure.

## Layer Grammar

Map, do not set. A value inside `aes()` comes from data and earns a legend entry; a value outside it is a constant and must not.

```r
ggplot(d, aes(x = time_h, y = signal, colour = genotype)) +
  geom_ribbon(aes(ymin = lwr, ymax = upr, fill = genotype),
              colour = NA, alpha = 0.2) +
  geom_line(linewidth = 0.5) +
  theme_pub()
```

- One geom per layer; draw fills and ribbons before the lines on top.
- `linewidth` for strokes, `size` for points; `size` on a line is deprecated.
- `stat_summary(fun.data = mean_se)` for in-plot summaries; use a precomputed summary when the numbers also appear in the text.
- `inherit.aes = FALSE` on annotation layers with their own data; fix factor order with `scale_x_discrete(limits = ...)`.

## Publication Theme

`theme_pub()` sets `theme_classic()`, 7–9 pt base text, the venue's family, hairline axes (0.3–0.4), no grid, no panel border, and a top-aligned legend.

- Type size at final size, not viewer size; panel letters 8–10 pt bold.
- Strokes 0.25–0.5 mm; heavy strokes read as emphasis, so reserve them for data.
- Drop gridlines behind bars and boxes; keep them where readers must read values.
- Legends inside the panel only when they cover no data; let patchwork collect shared legends.

## Export

```r
ggsave("fig2.pdf", p, width = 180, height = 110, units = "mm",
       device = cairo_pdf, bg = "white")
ggsave("fig2.tif", p, width = 180, height = 110, units = "mm",
       dpi = 300, device = "tiff", compression = "lzw", bg = "white")
```

- `units = "mm"` always; `dpi` matters only for raster devices.
- `device = cairo_pdf` embeds fonts; plain `pdf()` can emit Type 3 fonts that fail preflight.
- `bg = "white"` prevents transparent or grey backgrounds after conversion.
- Vector first; raster only when demanded, at the stated DPI and final size. Never upscale afterwards.

## Facets And Patchwork

- `facet_wrap(~ condition, nrow = 1)` for one variable; `facet_grid(rows = vars(dose), cols = vars(treatment))` for two.
- `scales = "free_y"` changes what between-panel comparison means; use it only when shape, not level, is the message, and say so.
- `space = "free"` only with `scales = "free"`, or panels misstate their extent.
- `(p1 | p2) / p3 + plot_layout(heights = c(1, 1.3), guides = "collect") + plot_annotation(tag_levels = "A")`.
- `&` applies a theme to every subplot; `+` applies to the composition only. Panel letters: one bold capital each, same size, never scaling with the panel.

## Colour

- Qualitative roles: one fixed colourblind-safe vector (e.g. Okabe–Ito), stored by name, never inline hex per plot call.
- Magnitude: `scale_fill_viridis_c()` or another perceptually uniform map; never rainbow/jet.
- Signed data with a meaningful midpoint: `scale_fill_gradient2(midpoint = 0, mid = "grey95")`.
- Fix `limits` across panels sharing a scale; `oob = scales::squish` handles outliers instead of dropping rows.
- Verify by desaturation: colour must not be the only carrier of a distinction.

## Uncertainty

- `geom_errorbar(width = 0.15)` or `geom_pointrange()`; `width` is in x data units, not millimetres.
- `stat_summary(fun.data = mean_se, geom = "errorbar")` or `mean_sd`; one convention per figure, stated in the caption.
- `geom_ribbon(aes(ymin = lwr, ymax = upr), alpha = 0.2, colour = NA)` under the line, with the confidence level in the caption.
- Dodge geoms must reuse the bars' `position_dodge(width = ...)` or error bars drift off centre; no error bar for n = 1 or a single deterministic run.

## Labels

- `geom_text(size = 2.8)` is roughly 8 pt; `size` is not points.
- Direct labels beat legends for 2–4 series: label the last point with `hjust = -0.1` and widen the x expansion.
- `ggrepel::geom_text_repel()` for crowded scatter; `min.segment.length = 0` when every label must attach.
- `annotate("text", ...)` for fixed notes; `coord_cartesian(clip = "off")` when a label sits outside the panel.
- Axis titles carry quantity and unit; state transformations on the axis, not only in the caption.

## Completion Criteria

- Geometry matches the venue specification in millimetres; the font exists on the target machine.
- Every aesthetic is mapped from a declared variable; constants are constants.
- Uncertainty type, n, and colour roles are stated and consistent across panels.
- The export opens at final size with embedded fonts and no clipped labels; greyscale and colourblind checks pass.

## Citation

```text
Linxira OS. Linxira Skills: r-ggplot-figures. Version 0.1.0.
Skill path: skills/r-ggplot-figures/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
