---
name: discipline-figure-patterns
description: Use when making or reviewing a domain-specific scientific figure for CS/ML, biology, chemistry, or physics papers. Routes to a per-discipline reference covering canonical figure types (training curves, omics heatmaps, NMR/IR spectra, band structures), data-to-encoding mapping, uncertainty conventions, and common reviewer objections.
skill_class: reference
load_policy: conditional
risk_tags: []
---

# Discipline Figure Patterns

A chart library for the figure types each field's readers already know how to
read. Route by discipline first, then apply the generic rules of
`scientific-figures-and-tables` inside the chosen reference.

A figure earns its place when a reviewer can verify the claim without the
caption. That means: the axis variable is the variable under test, the unit of
replication is visible, and the uncertainty convention is stated.

## When To Use

- Use when the figure is a recognized discipline-native type (training curve,
  volcano plot, NMR spectrum, band structure, …) and you need its conventions.
- Use when a reviewer-style critique of a domain figure is requested.
- Use when choosing between candidate chart types for one dataset.
- Do not use for generic charts (plain bar/line/scatter with no domain
  semantics), tables, posters, or slide design — use
  `scientific-figures-and-tables` alone.

## Router

| Discipline | Reference | Canonical figure types |
|---|---|---|
| CS / ML | [references/cs-ml.md](references/cs-ml.md) | training/validation curves, ablation, confusion matrix, calibration, ROC/PR, embedding scatter (PCA/t-SNE/UMAP), scaling law, efficiency frontier, hyperparameter sensitivity, saliency/attention, error taxonomy, schematics (概念/框架/流程/架构/分类/主视觉) |
| Biology | [references/biology.md](references/biology.md) | omics heatmap (组学热图), volcano/MA (火山图), sample PCA, marker dot plot, single-cell UMAP, microscopy/IHC panels (多 panel 显微), flow gating (流式), pathway schematic (通路示意), Kaplan–Meier (生存曲线), enrichment waterfall/GSEA (富集瀑布), circos (环状图) |
| Chemistry | [references/chemistry.md](references/chemistry.md) | 1D/2D NMR, IR/Raman (谱图呈现), UV-Vis/CD, MS, powder XRD, cyclic voltammetry, reaction coordinate (反应坐标), phase diagram (相图), titration (滴定), kinetics (动力学), reaction schematic (反应示意) |
| Physics | [references/physics.md](references/physics.md) | band structure/DOS/Fermi surface (能带/态密度), ARPES, XRD/XAS/XPS/Raman/PL, transport R(T)/Hall/MR (输运), magnetization (磁化), field/wavefunction maps (场分布), phase diagram (相图), critical behavior (相变/临界行为) |

## Reference Structure (每个 reference 的固定结构)

Every discipline reference follows the same ordered structure, so a reader can
jump to the part they need:

1. **Figure Type Index** — the canonical types, each with its axis driver.
2. **Figure Selection Quick Table (图型选择速查表)** — data shape → recommended
   figure → forbidden/misleading figure.
3. **Data Preparation** — what to compute, store, and declare before plotting.
4. **Visual Encoding** — axis, color, layout conventions for that field.
5. **Uncertainty & Statistical Annotation** — what the error bars or bands mean.
6. **Common Reviewer Objections** — the skepticism each type attracts.

Then **Navigation** to sibling disciplines and a **Citation** block.

## Cross-Cutting Selection (速查：先看数据形态)

| Data shape | Go to | Typical first choice |
|---|---|---|
| Metric vs. optimization step, multiple runs | CS/ML | training curve with seed band |
| Feature × sample matrix | Biology | heatmap (sequential) or volcano, by scale |
| Time-to-event with censoring | Biology | Kaplan–Meier with at-risk table |
| Chemical shift / wavenumber vs. intensity | Chemistry | offset spectrum stack |
| Intensity vs. energy along a k-path | Physics | band structure + DOS panel |
| Two intensive variables with phase regions | Chemistry/Physics | phase diagram (markers vs. lines) |
| Spatial map of a signed physical quantity | Physics | diverging map centered at zero |
| A system, not a number | CS/ML | schematic (pick one of six kinds) |

## Shared Conventions (all disciplines)

- One visual channel per variable: color for category, position for value.
  Never encode a binary claim in color alone — grayscale printing must still
  work; check by desaturation.
- Qualitative palettes: prefer a small, colorblind-safe set (for example the
  Okabe–Ito eight) before inventing colors; a perceptually uniform sequential
  map for magnitude and a diverging map centered on the meaningful midpoint.
- Axes: label quantity + unit; state transforms (log, normalized-to-baseline,
  reciprocal axis, offset stack) on the axis, not only in the caption.
- Uncertainty: pick one convention per figure — error bars = SD or SEM (say
  which), band = CI, shaded region = range across seeds/runs — and keep it
  consistent across panels.
- Sample/run counts: show n on the figure; never leave "n = 3" to the body text.
- Panels: letters only when the panels form one argument; keep color roles
  identical across related panels; one idea per panel.
- Resolution: vector where possible; raster at the minimum dpi the venue
  requires, with fonts embedded; never upscale a screenshot.
- Reviewer instinct: any axis break, cherry-picked window, missing control, or
  unexplained normalization will be asked about — show it or preempt it in the
  caption.

## Completion Criteria

- The figure matches the canonical type its audience expects, or deviates
  deliberately with caption justification.
- The chosen type appears in the relevant reference's selection quick table and
  does not fall under its forbidden column.
- Uncertainty and sample/run counts are visible and consistent across panels.
- Caption and body text make the same claim with the same denominators.
- Any schematic or illustrative image is labelled as such, never as evidence.

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns. Version 0.1.0.
Skill path: skills/discipline-figure-patterns/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
