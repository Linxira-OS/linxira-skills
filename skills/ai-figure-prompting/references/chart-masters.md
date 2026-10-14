# Discipline Prompt Masters

Reusable prompt masters for schematic generation, split by field. Each master
fills Blocks 1–4 of the anatomy in `prompt-anatomy.md`; you supply the subject
and the conclusion. `适用` = use when, `禁用` = never request, `迭代要点` =
what to vary across the candidate batch. Each master is complete and
self-contained: `[ROLE]`/`[LANGUAGE]`/`[LABELS]`/`[CANVAS]` are its Blocks 1–4.
Do not blend two masters in one image; produce two panels instead.

## CS / Machine Learning

```text
[ROLE] Method schematic of a <pipeline|architecture|taxonomy> that shows how
  <input> becomes <output> through <stages>, for a conference paper figure.
[LANGUAGE] flat vector, orthographic boxes and rounded arrows, uniform stroke;
  left-to-right flow, modules grouped in two bands (main path, auxiliary);
  palette: blue #2B6CB0 main path, grey #718096 auxiliary, orange #DD6B20 the
  contribution; no photorealism, no 3D perspective, no gradients.
[LABELS] empty boxes above each module and one caption box under the group.
[CANVAS] 2:1 band for double-column placement, white, ≥ 2048 px long edge.
```

- 适用: framework and architecture diagrams (架构图), data/processing pipelines
  (流程图), method taxonomies (分类图), graphical abstracts, t-SNE/UMAP
  landscape metaphors, ablation-setup schematics.
- 禁用: fabricated training or validation curves, invented benchmark bars,
  plausible-looking leaderboard tables, fake UI screenshots, rendered code,
  vendor logos, "SOTA" badges, any shape the caption would have to call a
  result.
- 迭代要点: number of modules, band split, arrow topology (skip connections
  present or absent), where the accent color lands, and panel count. Keep the
  input/output boxes in the same position across all candidates so the batch
  is comparable.

## Biology

```text
[ROLE] Mechanism schematic of <process> showing that <conclusion>, for a
  biology figure; reader identifies <nodes> and the direction of regulation.
[LANGUAGE] flat vector cell/compartment line art, thin uniform strokes, soft
  palette: green #2F855A activation, red #C53030 inhibition, blue #2B6CB0
  neutral components, light grey #EDF2F7 membrane backgrounds; membrane as a
  double line; direction of flow top-down or left-to-right.
[LABELS] empty boxes beside each node plus compartment labels in a corner.
[CANVAS] 4:3 for single-column placement, white, ≥ 2048 px long edge.
```

- 适用: signaling and metabolic pathway maps (通路示意), regulatory cascades,
  experimental workflow schematics, anatomy of a model organism, comparative
  condition diagrams, study-design overviews.
- 禁用: photorealistic micrographs, Petri dishes with growth, blots, gels,
  staining, histology, patient or clinical imagery, recognizable faces,
  fluorescent-microscopy texture presented as an observation, realistic
  molecular structures that imply measured geometry.
- 迭代要点: node count and grouping, activation/inhibition arrow style, which
  compartment fills the frame, membrane and organelle detail level, and
  whether a summary band at the bottom is included. Keep actor roles
  (activating vs inhibiting) consistent with the caption in every candidate.

## Chemistry

```text
[ROLE] Scheme showing <transformation|cycle|material architecture> that
  establishes <conclusion>, for a chemistry figure.
[LANGUAGE] clean vector chemical drawing style, uniform bond lines, flat
  shading, no gradients; palette: dark slate #2D3748 bonds and text frames,
  teal #319795 reactants, orange #C05621 products, grey #A0AEC0 conditions
  band; horizontal reaction scheme, cycle drawn clockwise if cyclic.
[LABELS] empty boxes: one under each structure, one conditions band under the
  full arrow, one cycle-exit box if applicable.
[CANVAS] 3:2 for single-column or slide placement, white, ≥ 2048 px long edge.
```

- 适用: reaction-scheme layouts (反应式版式), catalytic cycles, material or
  morphology architecture diagrams, instrument or apparatus schematics,
  structure-activity overviews, graphical abstracts of a synthesis.
- 禁用: fabricated spectra or chromatograms, invented diffraction patterns,
  precise lattice constants or bond angles that a reader would quote as data,
  realistic glassware carrying readable numbers, NMR peak annotations.
- 迭代要点: scheme orientation (linear vs cycle), ring depiction and where
  substituents point, arrow and conditions-band lengths, shading depth, and
  whether a catalyst inset is present. Chemical plausibility beats visual
  polish: reject any candidate whose connectivity a chemist would call wrong.

## Physics

```text
[ROLE] Apparatus schematic of <setup|measurement chain> showing how <quantity>
  is measured, for a physics figure.
[LANGUAGE] precise vector line art, isometric or orthographic, thin uniform
  strokes, no shading gradients; palette: slate #2D3748 frame and optics,
  blue #2B6CB0 signal path, red #C53030 reference or control path, grey
  #A0AEC0 mounts; signal direction left-to-right.
[LABELS] empty boxes at each stage and at the two ends of the signal path.
[CANVAS] 2:1 for double-column placement, white, ≥ 2048 px long edge.
```

- 适用: optical benches and apparatus layouts, measurement-chain diagrams,
  conceptual energy-level and band diagrams, state-preparation schematics,
  detector-arrangement overviews, conceptual field-geometry illustrations.
- 禁用: fabricated oscilloscope traces, invented detector spectra, invented
  error bars, numeric axis values on a schematic, photographs of a real
  facility presented as the user's setup, unit-bearing readouts.
- 迭代要点: stage count along the chain, isometric vs orthographic view,
  labeling of reference vs signal paths, level-diagram convention (spacing
  relative, never quoted as numbers), and drawing density. Keep component
  order physically meaningful in every candidate.

## Selecting A Master

| Situation | Master |
|---|---|
| Algorithm/architecture or study design panel | CS/ML or Biology |
| Molecular, material, or reaction content | Chemistry |
| Instrument, signal path, or conceptual energy landscape | Physics |
| Mixed disciplinary audience | Biology master, field-neutral palette |

## Navigation

- Prompt layers and canvas rules: `prompt-anatomy.md`.
- Post-generation pipeline and labeling: `workflows.md`.

## Citation

```text
Linxira OS. Linxira Skills: ai-figure-prompting. Version 0.1.0.
Skill path: skills/ai-figure-prompting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
