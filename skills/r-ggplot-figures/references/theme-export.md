# Theme And Export Template

Reusable R objects for the style layer of `../SKILL.md`: one theme function, one
role palette, one save wrapper. Copy them into the analysis project once and
source them from every figure script.

## Geometry And Type

Pick the slot from the venue's author guide, not from habit.

| Slot | Width (mm) | Typical use |
|---|---|---|
| Single column | 80–90 | one panel, one comparison |
| 1.5 column | 110–140 | two panels or a wide heatmap |
| Double column | 170–183 | full-width multi-panel |
| Maximum height | 225–240 | check the guide; tall figures shrink type |

| Element | Target |
|---|---|
| Base text | 7–9 pt |
| Panel letter | 8–10 pt bold |
| Axis title | same as base, never smaller |
| Stroke / axis line | 0.25–0.5 mm (`linewidth` 0.3–0.5) |
| Point marker | 1.5–2.5 mm diameter |
| Legend key | 3–4 mm square |

Design at the final width. Scaling a finished figure up or down changes the
effective font size and stroke weight and desynchronises it from the text.

## `theme_pub()`

```r
theme_pub <- function(base_size = 8, base_family = "Arial",
                      legend_position = "top", grid = FALSE) {
  ggplot2::theme_classic(base_size = base_size, base_family = base_family) +
    ggplot2::theme(
      axis.line         = ggplot2::element_line(linewidth = 0.35, colour = "black"),
      axis.ticks        = ggplot2::element_line(linewidth = 0.35, colour = "black"),
      axis.ticks.length = grid::unit(1.2, "mm"),
      axis.text         = ggplot2::element_text(colour = "black"),
      axis.title        = ggplot2::element_text(colour = "black"),
      axis.title.x      = ggplot2::element_text(margin = ggplot2::margin(t = 1.5)),
      axis.title.y      = ggplot2::element_text(margin = ggplot2::margin(r = 1.5)),
      legend.background = ggplot2::element_blank(),
      legend.key        = ggplot2::element_blank(),
      legend.key.size   = grid::unit(3, "mm"),
      legend.text       = ggplot2::element_text(size = base_size - 1),
      legend.title      = ggplot2::element_text(size = base_size),
      legend.position   = legend_position,
      legend.margin     = ggplot2::margin(0, 0, 0, 0),
      panel.background  = ggplot2::element_blank(),
      panel.grid.major  = if (grid) {
        ggplot2::element_line(linewidth = 0.2, colour = "grey85")
      } else {
        ggplot2::element_blank()
      },
      panel.grid.minor  = ggplot2::element_blank(),
      plot.background   = ggplot2::element_blank(),
      plot.title        = ggplot2::element_text(size = base_size + 1,
                                                face = "bold", hjust = 0),
      plot.tag          = ggplot2::element_text(size = base_size + 1, face = "bold"),
      plot.margin       = ggplot2::margin(2, 2, 2, 2, unit = "mm"),
      strip.background  = ggplot2::element_blank(),
      strip.text        = ggplot2::element_text(size = base_size, face = "bold",
                                                hjust = 0)
    )
}
```

Rules that keep the theme honest:

- No `panel.border` on classic plots; a border is a box around data that adds no
  information.
- `legend.key = element_blank()` matters only when legends use points or lines;
  filled keys need a visible key, so override `legend.key` for bar and tile plots.
- `strip.text` left-aligned matches table-style facet headers; centred is
  acceptable, mixed alignment is not.
- Do not set `plot.background` to white inside the theme if you also export with
  `bg = "white"`; one white background is enough.

## Role Palette

Store colours by scientific role, then map roles to a fixed vector. Consumers
must never read hex codes out of a plot call.

```r
pal_role <- c(
  control   = "#000000",
  treated   = "#D55E00",
  rescue    = "#0072B2",
  vehicle   = "#56B4E9",
  inhibitor = "#009E73"
)
```

The eight-colour Okabe–Ito set, if roles are unnamed:

```r
pal_okabe_ito <- c("#000000", "#E69F00", "#56B4E9", "#009E73",
                   "#F0E442", "#0072B2", "#D55E00", "#CC79A7")
```

Assignment:

```r
p + scale_colour_manual(values = pal_role, name = NULL) +
  scale_fill_manual(values = pal_role, name = NULL)
```

A qualitative scale with more series than the palette has colours is a signal to
recode, not to interpolate.

## `save_pub()`

```r
save_pub <- function(plot, file, width_mm, height_mm, dpi = 300) {
  ext <- tolower(tools::file_ext(file))
  device <- switch(
    ext,
    pdf  = grDevices::cairo_pdf,
    svg  = svglite::svglite,
    eps  = grDevices::cairo_ps,
    png  = ragg::agg_png,
    tif  = "tiff",
    tiff = "tiff",
    stop("unsupported extension: ", ext)
  )
  args <- list(
    filename = file, plot = plot,
    width = width_mm, height = height_mm, units = "mm",
    dpi = dpi, bg = "white", device = device, limitsize = FALSE
  )
  if (ext %in% c("tif", "tiff")) args$compression <- "lzw"
  do.call(ggplot2::ggsave, args)
}
```

- `dpi` is ignored by vector devices; supply it anyway so the same call site
  works for raster.
- `limitsize = FALSE` only removes a safety rail for figures larger than 50 in;
  use it for deliberate oversized panels, not to silence a units mistake.
- For a TIFF with no alpha channel, `bg = "white"` plus `compression = "lzw"` is
  the usual submission combination; venues that reject LZW accept
  `compression = "none"` at a larger file size.
- For figures embedded in a manuscript at less than 1:1, export at the final
  placed size, not at the design size.

## Font Embedding

| Device | Text handling | Use |
|---|---|---|
| `cairo_pdf` | subset embedded fonts | default PDF submission |
| `cairo_ps` | embedded fonts | EPS when the venue insists |
| `svglite` | text kept as text | editable vector handoff |
| `ragg::agg_png` | rasterized text | PNG previews, slides |
| `pdf()` | may emit Type 3 | avoid for submission |

Notes:

- `cairo_pdf` is the safe default because it embeds subsets and avoids Type 3
  fonts, which some preflight tools reject.
- `svglite` keeps text editable, so the receiving machine needs the same font or
  the layout reflows. If the venue demands outlines, convert text to paths in a
  vector editor after export, and keep the text-bearing original.
- Avoid `showtext` for PDF submission: it can render text as outlines or as a
  raster layer, so the file no longer contains searchable, checkable fonts.
- On Linux, "Arial" is usually substituted by a metric-compatible face; set the
  family explicitly (`"Liberation Sans"`) rather than relying on silent
  substitution.
- Confirm the family exists before rendering:
  `systemfonts::match_font("Arial")` should return a non-empty path.

## Post-Export Checks

1. Open the PDF and list fonts; each text face must appear as an embedded subset,
   and no Type 3 entry may appear.
2. Read the smallest axis label at 100% zoom and at the intended print scale.
3. Confirm the media box matches the requested width × height in millimetres.
4. Check that no label, tick, or panel letter is clipped at the page edge.
5. Desaturate the figure; confirm every distinction survives.
6. For raster, confirm pixel dimensions equal `mm / 25.4 * dpi` at the final
   width, and that the image is not a resampled screenshot.

## Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Enormous text in the export | `geom_text(size = 8)` treated as points | use `size ≈ pt / 2.845` |
| Fonts substituted at the publisher | default `pdf()` or missing family | `cairo_pdf`, explicit family |
| Grey or transparent background | no `bg`, theme background set | `bg = "white"` |
| Legend boxes around keys | `legend.key` not blanked | `element_blank()` or a sized key |
| Error bars off-centre | dodge width differs from bars | share `position_dodge(width = ...)` |
| Panels not comparable | `scales = "free_y"` | fixed scales, or state the exception |
| Blurry raster | upscaled after export | re-render at final size and DPI |
| TIFF rejected by preflight | alpha channel or no compression | white background, LZW |
| PDF too large | photos embedded as vectors | place a 300 dpi raster layer |
