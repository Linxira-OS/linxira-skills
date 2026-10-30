# Common Scientific Figure Patterns In ggplot2

Recipes for the six figure types most often requested in manuscripts. Each entry
gives the data shape, the minimal layer stack, and the failures that survive
visual inspection. Style objects (`theme_pub()`, `pal_role`, `save_pub()`) come
from [theme-export.md](theme-export.md).

The shared rule: the plot consumes a tidy table that already contains every
number it draws. Summaries computed inside `stat_summary()` are fine for
exploration, but a submission figure should plot a table that the text can cite.

## 1. Curves And Time Series

Data shape: one row per (time, subject, condition); replicate summaries
precomputed as mean and SD/SE per time point.

```r
ggplot(s, aes(time_h, mean, colour = genotype, fill = genotype)) +
  geom_ribbon(aes(ymin = mean - sd, ymax = mean + sd),
              colour = NA, alpha = 0.18) +
  geom_line(linewidth = 0.5) +
  scale_colour_manual(values = pal_role) +
  scale_fill_manual(values = pal_role) +
  scale_y_continuous(limits = c(0, NA),
                     expand = expansion(mult = c(0, 0.05))) +
  labs(x = "Time (h)", y = "Signal (a.u.)") +
  theme_pub()
```

Pitfalls:

- Connecting discrete conditions with a line implies continuity that the design
  does not have; use points with error bars instead.
- `geom_smooth()` on three points produces a confident curve from nothing; state
  the method, formula, and n, or omit it.
- A log y-axis silently drops zeros; use a pseudo-log or state the exclusion.
- Offsets (baseline subtraction, normalization) belong in the data, not in
  `aes()` arithmetic hidden from the reader.
- Legend keys for ribbon and line duplicate unless both scales share `name` and
  breaks; set `name = NULL` on both.

## 2. Bars With Uncertainty

Data shape: a summary table with `mean`, `sd` (or `se`, `ci_lo`, `ci_hi`), `n`,
and the raw observations for the dot overlay.

```r
ggplot(s, aes(genotype, mean, fill = genotype)) +
  geom_col(width = 0.65, colour = "black", linewidth = 0.3) +
  geom_errorbar(aes(ymin = mean - sd, ymax = mean + sd),
                width = 0.15, linewidth = 0.3) +
  geom_point(data = d, aes(genotype, value), inherit.aes = FALSE,
             position = position_jitter(width = 0.08, height = 0, seed = 1),
             size = 1.1, alpha = 0.6) +
  scale_fill_manual(values = pal_role) +
  scale_y_continuous(expand = expansion(mult = c(0, 0.05))) +
  theme_pub()
```

Pitfalls:

- `geom_bar(stat = "identity")` on raw data draws a sum, not a mean; aggregate
  first.
- A truncated y-axis exaggerates differences; bars start at zero, and deviation
  bars are labelled as such.
- SD, SEM, and CI are not interchangeable; pick one and say which.
- Stacked bars hide the comparison of interest; use dodged bars or a small
  multiple.
- With n = 3, show the points; a bar with an error bar implies more information
  than exists.
- `position_dodge()` on the error bar must match the bar width, or the whiskers
  sit off centre.

## 3. Heatmaps

Data shape: a complete feature × sample grid, one value per cell, with a scale
that has a declared meaning (raw, z-score, log ratio).

```r
ggplot(m, aes(sample, feature, fill = z)) +
  geom_tile(colour = "white", linewidth = 0.3) +
  scale_fill_viridis_c(option = "magma", name = "z-score") +
  scale_x_discrete(expand = c(0, 0)) +
  scale_y_discrete(expand = c(0, 0)) +
  coord_fixed() +
  theme_pub()
```

Pitfalls:

- Missing combinations are not empty cells; complete the grid explicitly or the
  tile sizes lie.
- A diverging map on strictly positive abundance manufactures a false midpoint.
- Row order is clustering, not input order; state the distance and linkage, and
  do not let the clustering algorithm choose which samples look similar without
  supervision.
- The colour bar needs a title with units or transform, plus the range.
- `geom_tile()` interpolates nothing; any smoothing means the reader is seeing a
  derived field, which must be declared.
- Above roughly 10⁴ cells, `geom_raster()` is faster and avoids hairline gaps,
  but it requires a regular grid and `coord_fixed()`.

## 4. Scatter And Association

Data shape: paired observations with a group column, plus any fitted model
summary kept separately.

```r
ggplot(d, aes(x = expression, y = response, colour = group)) +
  geom_point(size = 1.4, alpha = 0.7, stroke = 0) +
  geom_smooth(method = "lm", formula = y ~ x, se = TRUE, linewidth = 0.5) +
  geom_abline(slope = 1, intercept = 0, linetype = 2, linewidth = 0.3) +
  scale_colour_manual(values = pal_role) +
  theme_pub()
```

Pitfalls:

- Heavy overplotting hides density; use alpha, smaller points, or a hexagonal
  bin, and never report a correlation from visible points alone.
- Fitting one line through mixed groups can invert the within-group association;
  fit per group or stratify.
- A fitted line without its confidence band, n, and model form is decoration.
- Log axes cannot show zero or negative values; a floor substitution changes the
  claim and must be declared.
- Aspect ratio changes the apparent slope; fix `coord_fixed()` only when the
  identity line is the reference, otherwise state the ratio.
- Identical marker shapes with only colour differences fail in greyscale; add
  shape or linetype as a second channel.

## 5. Boxplots With Observations

Data shape: raw observations per group; the box is a summary, the points are the
evidence.

```r
ggplot(d, aes(genotype, value, fill = genotype)) +
  geom_boxplot(width = 0.55, outlier.shape = NA, linewidth = 0.35) +
  geom_point(position = position_jitter(width = 0.08, height = 0, seed = 1),
             size = 1.1, alpha = 0.6) +
  scale_fill_manual(values = pal_role) +
  theme_pub()
```

Pitfalls:

- Hiding outliers without showing points removes the observation the reader most
  needs to judge; `outlier.shape = NA` is acceptable only with a jitter layer.
- A boxplot of n < 5 is not informative; show the individual values.
- Notches are a confidence statement; do not use them decoratively.
- Boxplots do not need a zero baseline, but a bar chart of the same data does;
  do not swap one for the other to change the visual impression.
- Paired designs need connecting lines per subject, not two independent boxes.

## 6. Forest Plots

Data shape: one row per estimate with `term`, `estimate`, `lo`, `hi`, optional
group header, and an effect scale (ratio or difference).

```r
ggplot(f, aes(estimate, forcats::fct_rev(term))) +
  geom_vline(xintercept = 1, linetype = 2, linewidth = 0.3) +
  geom_pointrange(aes(xmin = lo, xmax = hi), size = 0.3, linewidth = 0.5) +
  scale_x_log10() +
  labs(x = "Hazard ratio (95% CI)", y = NULL) +
  theme_pub()
```

Pitfalls:

- Ratios need a log axis and a reference line at 1; differences need a linear
  axis and a line at 0. Mixing them in one panel is unreadable.
- Terms are shown in the order the reader expects (usually reverse factor order
  so the first term is on top), not alphabetically.
- Heterogeneous groups belong in facets:
  `facet_grid(group ~ ., scales = "free_y", space = "free_y")`.
- A forest plot without the numeric column forces the reader to measure pixels;
  align a `patchwork` text table to the right of the panel.
- Confidence intervals that cross the null are not "trends"; the caption should
  not describe them as such.
- Pooled estimates from a random-effects model need the model and heterogeneity
  statistic named in the caption.

## Shared Traps

| Trap | Symptom | Fix |
|---|---|---|
| Factor order | groups appear alphabetically | relevel or `scale_*_discrete(limits = ...)` |
| Dropped levels | empty group disappears | `drop = FALSE` on the discrete scale |
| Dodge mismatch | error bars and bars disagree | one shared `position_dodge(width = ...)` |
| Clipped labels | text cut at panel edge | expand the scale or `coord_cartesian(clip = "off")` |
| Legend duplication | two legends for one variable | identical `name`/breaks on both scales |
| `linewidth` ignored | thin lines despite `size = 1` | use `linewidth` for strokes |
| Smoothing too eager | wiggly line through few points | `method = "lm"` or no smoother |
| Log of zero | missing points and warnings | pseudo-log or declared exclusion |
| Facet free scales | panels imply equal magnitude | fixed scales or an explicit caption note |
| Rasterized vectors | blurry text in PDF | export text as text, raster only photos |
