---
name: figure-polish
description: Use when cleaning, cropping, resizing, colour-balancing, or exporting photographic, microscopy, or scanned figures for publication. Separates legitimate global cosmetic adjustment from image manipulation, requires group-consistent processing and disclosure, and covers upsampling limits, LUT consistency, panel alignment, scale bars, labels, and 300/600 dpi or vector export.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Figure Polish

Polish makes a real image legible; it never changes what the image shows. Judge every operation by three questions: was it global, was it applied equally to every compared panel, and is it disclosed? The smallest global adjustment that makes the image readable is the only defensible default.

## Scope Boundary

- Whether an image may be used as evidence, and how AI-generated visuals are labelled → `academic-visual-evidence`.
- Processing and presentation of an authentic image → here.
- Chart choice, captions, tables → `scientific-figures-and-tables`; R plotting → `r-ggplot-figures`.

## Adjustment Ladder

| Operation | Verdict | Condition |
|---|---|---|
| Global brightness / contrast / gamma | allowed | identical on every compared panel; disclosed |
| Flat-field or shading correction | conditional | one method and parameter set for all groups; correct illumination only, never rescale objects |
| Crop empty border | allowed | cropping data, a lane, or a scale bar is prohibited |
| Rotate / flip | conditional | only when orientation is not a claim; disclose |
| Denoise, systematic artefact removal, deconvolution | conditional | same parameters per group; algorithm, version, iterations reported |
| Local contrast enhancement | conditional | must not manufacture visible structure; disclosed |
| Selective erase, clone, heal, paint | prohibited | never remove an object, cell, process, or band |
| Per-object or per-region adjustment | prohibited | one image, one global operation |
| LUT or display-window change between compared images | prohibited | same lookup table and window across the set |
| Generative fill, object removal, AI restoration | prohibited | barred for evidence images in every venue |
| Upscaling presented as acquired resolution | prohibited | computational upsampling must be labelled |
| Composite panel without boundaries | prohibited | label each field and mark the joins |

An operation not on this table is conditional: run it globally, on the whole set, and disclose it before it reaches a figure.

## Group-Consistent Processing

- Load all panels of one comparison into a single processing pass; apply one parameter set and export every output from it.
- Process in a fixed order: calibration, flat field, denoise, global tone, crop, assembly, export. Reordering across groups makes panels incomparable.
- Fix a dim panel at acquisition, not afterwards; if exposure differed, report it and show the raw panel.
- Keep acquisition files read-only and record every step in a processing register before assembly.

## Disclosure

State for every processed panel: software and version, operation, parameters, scope (whole image or region), order of operations, and any nonlinear step. Put the summary in the methods and any interpretation-relevant step in the caption. "Images were adjusted for brightness and contrast" is insufficient when the adjustment differs between panels or when denoising or deconvolution was used.

## Upsampling And Super-Resolution

- Never present interpolated pixels as acquired resolution; a 2× upscale adds no information and changes the effective magnification claim.
- Name deconvolution or super-resolution as a computational method, state the algorithm and version, and keep the raw image alongside it.
- A restoration model that invents edges, puncta, or bands is fabricating; if the enhancement creates features absent from the raw image, discard it.
- Downsampling is the safe direction: do it once, at the end, from the original.

## Colour And LUT

- One lookup table and one display window per compared set; record both, and prefer perceptually uniform LUTs over rainbow maps that create boundaries absent from the data.
- Multi-channel overlays state channel-to-colour assignment and keep the balance identical across panels.
- Report gamma and nonlinear display transforms; do not let a LUT imply quantitative intensity.
- Convert to sRGB for submission and check the CMYK conversion separately.

## Assembly

- Panels at the same magnification share one scale bar; a panel at a different magnification needs its own.
- Recalibrate scale bars from the acquisition pixel size after every resize; cropping keeps pixel size but the bar must be redrawn on the new canvas.
- Align panel edges on a common grid, keep gutters equal, and keep label and panel-letter font and size constant.
- Label each field in a composite and draw the joins; never let two fields read as one acquisition, and do not rescale a panel to match another's apparent size.

## Export

- Photographs: at least 300 dpi at final print size. Line art and combinations: 600 dpi, or 1200 dpi for pure line art when the venue asks.
- Vector first for plots, schematics, and labels; raster only for photographs and micrographs.
- TIFF with LZW or no compression for raster; never JPEG for line art, text, or blots.
- Embed fonts, keep sRGB, and verify at 100% zoom and at print size.

## Workflow

1. Inventory raw files, acquisition metadata, and pixel size before touching anything.
2. Write the claim, the compared panels, and the operations you expect to need.
3. Process the whole set globally, in one pass, and fill the register.
4. Assemble panels, labels, and scale bars on one grid; export at the venue's format, resolution, and colour space.
5. Check fonts, clipping, scale-bar length, LUT consistency, and greyscale legibility; archive raw, processed, register, and scripts together.

## References

| Path | Covers |
|---|---|
| `references/microscopy.md` | microscopy compliance checklist, processing register, quantitative analysis, scale bars, disclosure template |
| `references/ethics.md` | integrity red lines, grey-zone verdicts, adjudication procedure, disclosure language, boundary with evidence skills |

## Completion Criteria

- Every operation is global, identical across the compared set, and recorded.
- No object, band, lane, or region was removed or adjusted selectively.
- Scale bars are calibrated to the final image, not inherited from a crop; LUT, window, and channel assignment are consistent.
- Export meets the venue's resolution, format, colour, and font rules, and the disclosure matches the register.

## Citation

```text
Linxira OS. Linxira Skills: figure-polish. Version 0.1.0.
Skill path: skills/figure-polish/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
