---
name: ai-figure-prompting
description: Use when writing prompts that drive an AI text-to-image or image-to-image model to produce schematic figures (mechanism diagrams, workflow/pipeline graphics, journal illustrations, graphical abstracts) and when turning the result into editable vector art. Covers prompt anatomy, per-discipline prompt masters, and the draft-refine-vectorize-compose pipeline. Do not use for data figures: plots and tables built from measured values belong to the scientific-figure skills. Every generated panel is a labeled schematic and never stands in for experimental evidence.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# AI Figure Prompting

Generate schematics, never evidence. This skill turns a figure requirement into
a controlled prompt, a disciplined refinement pass, and an editable vector
deliverable. Whatever the model returns is an illustration until a human says
otherwise.

## Scope Boundary

| The need | The skill |
|---|---|
| Plot, chart, or table from measured or simulated values | `scientific-figures-and-tables`, `scientific-figure-style`, `discipline-figure-patterns` |
| Decide whether an AI image may appear at all, and how it must be labeled | `academic-visual-evidence` |
| A concept figure (概念图), mechanism schematic (机制示意), workflow graphic (流程图), or graphical abstract | this skill |

An AI-derived panel must never occupy an evidence slot. If a reader could
mistake it for a micrograph, a blot, an instrument readout, or an observed
result, then the prompt and the placement are both wrong.

## Non-Negotiables

- The output class stays `schematic illustration` in every caption and legend.
- Meaning-bearing text is re-typeset as vector text, never shipped as pixels.
- A prompt never targets a specific published figure, a real patient image, or
  identifiable material; it describes a generic structure instead.
- Real data panels keep their own source. Do not regenerate them for looks, and
  do not let a generated panel inherit their labeling.

## Route

| Need | Reference |
|---|---|
| Structure a prompt: figure role, visual language, labels, canvas, iteration | [references/prompt-anatomy.md](references/prompt-anatomy.md) |
| Start from a discipline-specific prompt master (CS/生物/化学/物理) | [references/chart-masters.md](references/chart-masters.md) |
| Draft, refine, vectorize, then compose with real panels | [references/workflows.md](references/workflows.md) |

## The Loop In One Line

Claim → visual metaphor → structured prompt → four candidates → pick one →
refine by mask edit → trace to SVG → re-typeset the labels → stitch with data
panels → declare it a schematic.

## Scaling Effort

- One panel, one metaphor: a short prompt and a single refinement pass suffice.
- A graphical abstract of four or more panels: fix the canvas and the palette
  before the first generation, or the panels will not compose.
- A figure that has to survive peer review: budget time for the vector pass.
  An untraceable raster schematic is a rejection risk, not a shortcut.

## Completion Criteria

- The prompt fixes subject, style, label plan, and canvas before generation.
- Every label in the delivered figure is editable vector text.
- The source prompt and the working SVG are archived alongside the export.
- Captions and on-figure notes classify each AI-derived panel as a schematic,
  and no generated panel is described as an observation or measurement.

## Citation

```text
Linxira OS. Linxira Skills: ai-figure-prompting. Version 0.1.0.
Skill path: skills/ai-figure-prompting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
