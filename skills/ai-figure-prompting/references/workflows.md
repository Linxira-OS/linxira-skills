# Generation And Vectorization Workflow

Four stages, in order. Skipping stage 3 is the classic mistake: a beautiful
raster schematic that cannot be re-typeset, recolored, or embedded at print
size is not a figure.

## Stage 0 — Inputs

Collect before any model call:

- the claim the schematic must support, and the reader task
- the target placement (single or double column, slide, poster) and therefore
  the canvas ratio and width
- the paper's palette, so the generated panel matches the data panels
- the exact label strings, decided now and frozen
- confirmation that external generation is allowed for this material
  (`academic-visual-evidence` owns that decision and the labeling rule)

## Stage 1 — Text-To-Image Draft

1. Fill the assembly template from `prompt-anatomy.md`, choosing a master from
   `chart-masters.md`.
2. Generate four candidates at the same ratio, one seed each.
3. Judge by structure only: is the flow readable, is the metaphor right, are
   the label slots where the strings will fit? Ignore texture and color noise.
4. If all four fail on structure, edit Block 1 or Block 2 and regenerate. Do
   not seed-hunt a wrong concept.
5. Save the chosen candidate as `draft-<panel>.png` and write a sidecar
   `draft-<panel>.prompt.txt` holding the exact prompt, model, seed, and date.

## Stage 2 — Image-To-Image Refinement

Use this stage to repair one region, not to re-roll the whole image.

- Mask only the defective area; keep the mask boundary inside the artwork, so
  the repair blends with real neighboring texture.
- Ask for the missing element in the same words the original used for that
  element's twins; reusing the vocabulary is what keeps style consistent.
- Keep the ratio and the long-edge pixel count fixed across iterations;
  changing either invalidates the earlier trace work.
- Refine in this order: geometry → spacing → palette → background cleanliness.
  Text is never refined here; it is typeset in stage 3.
- Promote the accepted image to `plate-<panel>.png` and record the iteration
  count in the sidecar.

## Stage 3 — Vectorization

Goal: one SVG where paths carry the artwork and every word is live text.

1. Trace the raster: `vtracer --input plate-a.png --output plate-a.svg
   --colormode color --mode polygon` (Inkscape's *Trace Bitmap* and
   Illustrator's *Image Trace* are equivalent interactive routes; `potrace`
   is the two-tone fallback for pure line art).
2. Delete every traced glyph. Tracing produces outlines that cannot be
   spell-checked, restyled, or searched, and it is the most common source of
   a misspelled label surviving into print.
3. Rebuild labels as text objects positioned in the reserved slots, using the
   same family and size as the data panels.
4. Redraw structural primitives (arrows, boxes, scale-free axes) as true
   shapes so they stay crisp and editable.
5. Verify editability on the export, not in the editor:
   `pdftotext -layout plate-a.pdf -` must echo every label string. Empty output
   or scrambled characters means the text is still paths.
6. Archive `plate-a.svg` plus the sidecar. The SVG is the deliverable; the PNG
   is disposable.

## Stage 4 — Compose With Real Data Panels

- Data panels keep their original export path; never paste them into the
  trace raster and never re-export them through the schematic pipeline.
- Assemble in the vector editor or the document tool: place the traced SVG and
  import the data panels as vector PDF or high-DPI raster, one placement each.
- Match the schematic's palette to the data panels, not the reverse. If the
  data panel uses a colorblind-safe categorical set, sample from it.
- Equalize stroke weights and the minimum font size across both kinds of
  panel; a schematic at 8 pt beside a data panel at 5 pt reads as decoration.
- Keep panel letters, caption placement, and background consistent; the reader
  must be able to tell, from the caption, which panels are schematics.
- If a reviewer-facing PDF is produced, confirm with `pdffonts` that fonts are
  embedded and with `pdftotext` that labels remain extractable.

## Stage 5 — Compliance Check

- [ ] caption or on-figure note labels the panel `schematic` / `AI-generated
      illustration` and never implies observation
- [ ] the claim in the caption is the one the schematic actually shows
- [ ] trace of the generated panel contains no real data panel's decoration
- [ ] prompt sidecar, SVG, and chosen candidate are archived together
- [ ] no external-generation request carried controlled or patient material

## Tool Quick Reference

| Step | Open-source route | Notes |
|---|---|---|
| Generate | any text-to-image or image-to-image service | confirm the data boundary first |
| Trace | `vtracer`, Inkscape *Trace Bitmap*, `potrace` | `potrace` for two-tone line art only |
| Re-typeset | Inkscape, or any SVG editor | replace all traced glyphs |
| Verify text | `pdftotext -layout`, `pdffonts` | run on the export, not the source |
| Compose | Inkscape, Illustrator, the document tool | data panels placed, not edited |

## Navigation

- Prompt layers: `prompt-anatomy.md`.
- Field-specific masters: `chart-masters.md`.
- Entry point and boundaries: `../SKILL.md`.

## Citation

```text
Linxira OS. Linxira Skills: ai-figure-prompting. Version 0.1.0.
Skill path: skills/ai-figure-prompting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
