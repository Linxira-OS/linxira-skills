# Design Theory: Why Each Style Rule Exists

When two rules conflict or a reviewer pushes back, resolve the conflict with the
principles here, not by taste. Every rule in `../SKILL.md` reduces to one of four
goals: information density, ink economy, accessibility, or medium survival.

## Information Density (信息密度)

- A figure is read for seconds and remembered as one claim; every element must
  either carry data or orient reading. Gridlines, borders, and framed legends
  orient at best — so they get the lightest possible treatment (thin, gray,
  frameless) or removal.
- Fewer than 3 ticks hides structure; more than 6 forces counting. The 3–6 tick
  rule keeps values estimable without a ruler.
- Panel letters exist only so text and captions can address panels; they are
  wayfinding, not content — hence small, bold, outside the data.

## Ink Economy (墨水比)

- Data-ink ratio: maximize ink that changes if the data changes. Spines carry no
  data, so top/right spines go; left/bottom stay only because scales need an
  anchor. A framed legend competes with data for the same photons and loses the
  reader nothing by becoming frameless text.
- One emphasis color per figure follows from ratio arithmetic: emphasis works by
  contrast, and two emphases cancel each other.
- Fixed semantic colors are an economy too — a returning reader decodes "blue =
  our method" once for the whole paper instead of once per figure. That decoded
  consistency is worth more than per-figure optimal palettes.

## Accessibility (可及性)

- Color-vision deficiency affects roughly 1 in 12 men; red-green pairs in
  particular mislead. Okabe-Ito and `cividis` were designed for this; choosing
  them is cheaper than debugging a confused reader.
- Hue is the weakest visual channel (pre-attentive but low precision), which is
  why double encoding pairs hue with marker, linestyle, hatch, or lightness —
  channels that survive grayscale and bad projectors.
- The 5 pt floor is not aesthetic: below it, stroke rendering and print
  halftoning destroy letterforms. Above ~10 pt in a single-column figure, text
  starts shouting louder than the data.

## Print Vs Screen (打印与屏幕差异)

- Screens emit light; paper reflects it. Thin light strokes (yellow, pale cyan)
  that glow on screen vanish under CMYK conversion and halftone screens, so
  export discipline bans relying on them.
- Print is viewed at ~25–40 cm; slide/projector at meters. The same figure
  cannot serve both: for talks, redraw larger (this skill optimizes the paper
  case; see `scientific-figures-and-tables` for the presentation boundary).
- Vector vs raster is a medium question: PDF/SVG stay crisp at any zoom and keep
  text selectable for reviewers; PNG exists only because some pipelines and
  genuine photographic content demand pixels — hence 300 DPI (human reading) vs
  600 DPI (line art with hard edges that alias visibly).
- Font embedding (TrueType, Type 42) exists because publishers' typesetting
  systems rasterize or drop Type 3 fonts; embedded TrueType survives their
  pipeline untouched.
- RGB export is deliberate: modern workflows are RGB-first and the publisher
  performs the single authoritative CMYK conversion. Converting twice (yours,
  then theirs) degrades hue twice.

## Design At Final Size (按最终尺寸设计)

- Rescaling a figure scales text, strokes, and data geometry together, so a
  "12 pt" label that looked right at 2× becomes an unreadable 6 pt in print — or
  the reverse. Designing at final mm makes every pt claim true by construction.
- Wide canvases (2.5–4:1) mirror how text is read: one saccade per metric row,
  no vertical hunting. Tall figures force page-fraction layout fights with the
  journal's two-column flow.
- Layout tightening as the last step arranges content inside an exact-size
  canvas. LaTeX places figures by their bounding box, so a cropped box silently
  changes the printed width — and with it every font-size promise the figure
  made.

## Conflict Resolution Rules (冲突裁决)

When rules collide, decide in this order:

1. Truth first: never distort scales, truncate axes silently, or drop uncertainty
   to gain beauty.
2. Accessibility second: a figure one reader misreads is a wrong figure.
3. Density third: add elements only when they carry data or orientation.
4. Aesthetics last — and only as consistency (same family, same roles, same
   sizes across all figures), never as novelty per figure.

## Reproduction Checklist (复现清单)

Condensed for every new figure: final-size mm width set · fonts ≥ 5 pt, one
family, ≤ 2 tiers · colors from fixed palettes and fixed semantic roles ·
despined, frameless legend, quantity+unit labels · vector export with embedded
fonts plus preview PNG · validation passes. The mechanical version lives in
`api.md`; if you cannot pass it, revisit the decisions above.

## Navigation

- Rules at a glance: `../SKILL.md`. Mechanical contract: `api.md`.
- Ready-made schemas: `common-patterns.md`.

## Citation

```text
Linxira OS. Linxira Skills: scientific-figure-style. Version 0.1.0.
Skill path: skills/scientific-figure-style/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
