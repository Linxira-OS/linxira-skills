---
name: discipline-figure-patterns
description: Use when making or reviewing a domain-specific scientific figure for CS/ML, biology, chemistry, or physics papers. Routes to a per-discipline reference covering canonical figure types (training curves, omics heatmaps, NMR/IR spectra, band structures), data-to-encoding mapping, uncertainty conventions, and common reviewer objections.
skill_class: reference
load_policy: conditional
risk_tags: []
---

# Discipline Figure Patterns

Route by discipline first, then apply the generic figure rules of
`scientific-figures-and-tables` inside the chosen reference. Each reference
covers the figure types that field's reviewers expect, with field-specific
encoding and statistical conventions.

## When To Use

- Use when the figure is a recognized discipline-native type (training curve,
  volcano plot, NMR spectrum, band structure, …) and you need its conventions.
- Use when a reviewer-style critique of a domain figure is requested.
- Do not use for generic charts (plain bar/line/scatter with no domain
  semantics), tables, posters, or slide design — use
  `scientific-figures-and-tables` alone.

## Router

| Discipline | Reference | Canonical figure types |
|---|---|---|
| CS / ML | [references/cs-ml.md](references/cs-ml.md) | training/validation curves, ablation bars, confusion matrices, embedding scatter (t-SNE/UMAP), scaling laws, schematic diagrams (概念/框架/流程/架构/分类/主视觉 six kinds) |
| Biology | [references/biology.md](references/biology.md) | omics heatmaps (组学热图), volcano plots (火山图), multi-panel microscopy/flow cytometry (多 panel 显微/流式), pathway schematics (通路示意), survival curves (生存曲线) |
| Chemistry | [references/chemistry.md](references/chemistry.md) | NMR/IR/MS spectra (谱图呈现), phase diagrams (相图), titration/kinetics curves (滴定/动力学曲线), reaction schematics (反应示意) |
| Physics | [references/physics.md](references/physics.md) | band structures/dispersion (能带/色散), XRD/XAS/PL spectra, field distributions (场分布), phase-transition/critical behavior (相变/临界行为) |

## Shared Conventions (all disciplines)

- Data-to-encoding: one visual channel per variable; color for category,
  position for value, never color alone for a binary claim (grayscale printing).
- Axes: label quantity + unit; state transforms (log, normalized-to-baseline,
  reciprocal axis) on the axis, not only in the caption.
- Uncertainty: pick one convention per figure — error bars = SD or SEM (say
  which), band = CI, shaded region = range across seeds/runs — and keep it
  consistent across panels.
- Reviewer instinct: any axis break, cherry-picked window, or missing control
  panel will be asked about; show it or preempt it in the caption.

## Completion Criteria

- The figure matches the canonical type its audience expects, or deviates
  deliberately with caption justification.
- Uncertainty and sample/run counts are visible and consistent.
- Caption and body text make the same claim with the same denominators.

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns. Version 0.1.0.
Skill path: skills/discipline-figure-patterns/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
