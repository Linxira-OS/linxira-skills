---
name: scientific-figure-style
description: Use when drawing, restyling, or exporting matplotlib figures for a paper, thesis, or preprint and you must control page geometry, fonts, color discipline, axes and legends, or vector export. Use scientific-figures-and-tables for chart choice, captions, and panel argument structure, and discipline-figure-patterns for field-specific chart conventions; this skill is the generic style layer under both.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Scientific Figure Style

Give every matplotlib figure in a manuscript one coherent publication style: sized
to the journal page, typeset like the text, colored by fixed rules, exported as
submission-ready vectors. This is the style layer — assume chart type and panel
argument are already settled.

## Scope Boundary

- Which chart proves the claim, caption wording, panel merging → `scientific-figures-and-tables`.
- Field-specific chart conventions and venue patterns → `discipline-figure-patterns`.
- Everything measurable about style (mm, pt, hex, spines, DPI) → this skill.

## Style Workflow

1. Fix the target width in millimeters before drawing; design content to it.
2. Apply the style once per project through the helper entry in `references/api.md`.
3. Pick colors only by the rules in section 3; never sample them ad hoc.
4. Strip chart junk: extra spines, framed legends, redundant ticks and digits.
5. Export vector-first, then run the export checklist in `references/api.md`.

## 1. Layout And Size (版式与尺寸)

Design at final print size. Never draw large and scale down, or small and scale
up — both silently break the font-size contract.

| Target | Usable width | Notes |
|---|---|---|
| Single column (单栏) | 89 mm ≈ 3.5 in | Nature, IEEE, Elsevier agree closely |
| Double column (双栏) | 183 mm ≈ 7.2 in | IEEE quotes 7.16 in; Elsevier 190 mm |
| 1.5 column (一点五栏) | 120–140 mm | interpolate; many journals accept it |

- Confirm exact limits against the journal's current author guide; the table lists
  the stable cross-publisher defaults.
- Keep full-page figures within the page height budget (typically ≤ 240 mm).
- For side-by-side metric comparisons, prefer a wide canvas (width:height ≈ 2.5–4:1)
  so panels read left to right like prose.

## 2. Fonts And Sizes (字体与字号)

- Use one sans-serif family across all figures, matching or complementing body
  text (Helvetica/Arial class; matplotlib's DejaVu Sans is an acceptable default).
- Set sizes at final print scale: axis labels 7–8 pt, tick and legend text 6–7 pt,
  panel letters 8–10 pt bold. Hard floor: 5 pt at final size.
- Default to one size (`font.size = 7`) and deviate only per element; at most two
  tiers across the whole paper (full-width vs dense multi-panel).
- Reserve math italics for variables; keep units upright and roman ("ms", not "ms" italic).

## 3. Color Discipline (配色纪律)

- Categorical series (分类数据): draw only from a color-vision-deficiency-safe
  palette — Okabe-Ito (blue `#0072B2`, vermillion `#D55E00`, green `#009E73`,
  orange `#E69F00`, sky `#56B4E9`, purple `#CC79A7`, yellow `#F0E442`) or
  ColorBrewer Dark2.
- Fix semantic roles once per paper and reuse them in every figure: proposed
  method = blue, baselines = gray/black, variants or ablations = orange, single
  emphasis = vermillion. One emphasis color per figure.
- Continuous fields (连续数据): perceptually uniform colormaps only — `viridis`
  (safe default), `magma`/`inferno` (higher contrast), `cividis` (most CVD-safe).
  Never `jet` or rainbow.
- Diverging data with a meaningful midpoint: ColorBrewer diverging (`RdBu_r`,
  `PiYG`) centered on that midpoint.
- More than 8 categories: stop adding hues — group categories, split panels, or
  label bars directly.
- When identity must survive misreading, double-encode with markers, linestyles,
  or hatches (patterns in `references/common-patterns.md`).

## 4. Axes, Spines, Legends (坐标轴与图例)

- Despine by default: remove top and right spines; keep left and bottom at
  0.6–0.8 pt (keep all four on heatmaps and matrices).
- Ticks: outward, 3–6 per axis, rounded to meaningful precision; prefer ×10ⁿ
  offset text over long numbers.
- Legends: frameless, placed in the emptiest region; if nothing is empty, use a
  dedicated axisless legend panel. With ≤ 4 series, label lines directly instead.
- Label every axis with quantity + unit ("Accuracy (%)") and make the data state
  (raw, normalized, log) readable from the figure alone.

## 5. Export (导出)

- Vector first: PDF for LaTeX builds, SVG/EPS where the publisher requests them;
  raster only for genuine images (micrographs, photos).
- Always also write a preview PNG at final print size: 300 DPI for mixed plots,
  600 DPI for pure line art.
- Embed fonts as TrueType (`pdf.fonttype = 42`, `ps.fonttype = 42`), never Type 3;
  fix the SVG text policy (editable text vs outlines) once per project.
- Export in RGB; publishers convert to CMYK in production, so avoid hues that die
  in print (thin yellow lines, pale cyan fills).
- White opaque background; run the layout tightening as the last step before
  writing files — arrange content inside the canvas, never crop the canvas.

## Which Reference To Open When

| Situation | Open |
|---|---|
| Wiring style into code: entry function, palettes, save + validate | `references/api.md` |
| Multi-panel layout, external legends, print-safe bars, CVD double coding | `references/common-patterns.md` |
| Why a rule exists, or judging a trade-off (density, ink, print vs screen) | `references/design-theory.md` |

## Citation

```text
Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
