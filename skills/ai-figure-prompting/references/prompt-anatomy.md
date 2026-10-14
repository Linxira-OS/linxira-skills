# Prompt Anatomy

A generative prompt for a scientific schematic is not a sentence; it is a small
specification. Write it in five ordered blocks. Order matters: models weight
early tokens more heavily, and the blocks above are the ones you cannot afford
to lose to truncation.

## Block 1 — Figure Role

State what the image must let the reader conclude, not what it must depict.

- Name the object: pathway, apparatus, pipeline, taxonomy, state machine,
  comparison grid, timeline.
- Name the reader task: "understand that A gates B", "see that the input
  passes through three stages", "compare two architectures at a glance".
- Declare the input/output boundary: what enters the diagram, what leaves it.
- One metaphor per panel. Two metaphors in one panel means two panels.

## Block 2 — Visual Language

Pin the style instead of hoping for it.

- Medium: flat vector-style illustration, clean line art, isometric technical
  drawing, semi-realistic render — pick exactly one.
- Palette: name the roles, not the vibe ("muted blue for the main process,
  grey for context, one warm accent for the step under discussion").
- Composition: left-to-right, top-down, radial, or framed panel; specify which.
- Constraint tail: "uniform stroke weight, no gradients, no drop shadows, no
  photorealism, no watermark, no signature, no 3D bevel".
- The negative tail is not optional. Unstated style is invented style, and
  invented style is what forces a regeneration later.

## Block 3 — Text And Labels

The model is a bad typesetter and an unreliable speller. Plan around it.

- Generate with placeholder glyphs: ask for "empty rounded label boxes beside
  each node", then typeset the real strings yourself in the vector pass.
- If a word must be legible in the raster itself, keep it under five characters
  and verify every occurrence; extractor-level misspellings are common.
- Fix the label vocabulary before generation (English or Chinese, never mixed
  inside one panel) and keep the count of labels ≤ 12 per panel.
- Spell out acronyms at first use in the caption; the image should not be the
  only place a symbol is defined.
- Never let the model draw axis numbers, units, or scale bars. Those are data
  claims and belong to the data panel or the caption.

## Block 4 — Canvas And Journal Constraints

Decide the physical target before choosing a pixel size.

- Aspect ratio follows the placement: single-column square-ish (≈4:3 or 1:1),
  double-column banner (≈2:1 or wider), slide-background panel (16:9).
- Width targets: 89 mm single / 183 mm double column (Nature-style); 55 / 120 /
  183 mm (Science-style). Height rarely exceeds 247 mm on a journal page.
- Reserve a safe margin (≈3 % of width) so nothing dies in a trim or a crop.
- Solid white background; transparent PNG is a trap for print workflows.
- Generate at ≥ 2048 px on the long edge so the trace in the next stage has
  enough edge detail, and keep that aspect ratio in every refinement pass.

## Block 5 — Iteration Strategy

Treat the first batch as a search, not a deliverable.

- Generate four candidates from the same prompt with different seeds; change
  one block at a time when the batch misses.
- Order of escalation when candidates are wrong: fix the role sentence, then
  the palette, then the composition, then the negative tail. Never tune the
  seed to rescue a wrong role.
- Once a candidate is close, switch to image-to-image with a mask over the
  region to repair, keeping global style untouched.
- Stop when the structure is right. Texture and label polish come from the
  vector pass, which is cheaper than a regeneration and fully controllable.
- Log prompt, seed, model, and the chosen candidate path; that record is what
  makes the figure reproducible.

## Assembly Template

```text
[ROLE] Schematic of <system> that shows <conclusion>, for a <venue> figure.
[LANGUAGE] <medium>; palette: <role: color> …; <composition direction>.
[LABELS] Empty label boxes at <positions>; no rendered words; no numbers,
  no units, no scale bars.
[NO] Photorealism, gradients, shadows, watermark, signature, 3D bevel,
  uneven stroke weights.
[CANVAS] <ratio>, white background, ≥ 2048 px long edge, 3 % safe margin.
```

## Worked Example

> Flat vector-style schematic of a two-stage signal relay in which receptor
> activation gates a downstream transcription factor, for a journal figure.
> Medium: clean line art, uniform 2 px strokes; palette: blue #2B6CB0 for the
> receptor, teal #2C7A7B for the relay, orange #DD6B20 for the gated output,
> light grey #E2E8F0 for background context; left-to-right flow. Place empty
> rounded label boxes above each of the three nodes and one below the output.
> No rendered words, no numbers, no units, no scale bar. Avoid photorealism,
> gradients, drop shadows, watermarks, signatures, 3D bevel. Canvas 4:3, solid
> white background, 2048 px on the long edge, 3 % empty margin.

Everything the figure later needs — color roles, label slots, clearance — is
already decided here, which is why the refinement pass can be short.

## Failure Modes

| Symptom | Root cause | Fix |
|---|---|---|
| Pretty but says nothing | Block 1 missing; prompt described a scene | Rewrite the role sentence as a conclusion |
| Style drifts across panels | No fixed palette or medium | Move both into Block 2 and reuse the same tail |
| Garbled words in the raster | Labels delegated to the model | Block 3 label-box plan, then re-typeset |
| Cannot embed at print size | Pixel target chosen without a width | Pick the column width first, derive pixels |
| Every regeneration is a coin flip | Seed hunting instead of block editing | One block per iteration, four seeds per batch |

## Navigation

- Entry point and boundaries: `../SKILL.md`.
- Discipline-specific prompt masters: `chart-masters.md`.
- What happens after the prompt is accepted: `workflows.md`.

## Citation

```text
Linxira OS. Linxira Skills: ai-figure-prompting. Version 0.1.0.
Skill path: skills/ai-figure-prompting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
