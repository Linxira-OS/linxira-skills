# Biology Figure Patterns

Reference for biology/biomedicine paper figures: omics, imaging, cytometry,
pathway schematics, and survival analysis. Follows the shared conventions in
[../SKILL.md](../SKILL.md).

## Figure Type Index (图型清单)

| Type | Use for |
|---|---|
| Omics heatmap (组学热图) | gene/protein abundance patterns across conditions |
| Volcano plot (火山图) | differential expression: effect size vs significance |
| Multi-panel microscopy/flow cytometry (多 panel 显微/流式) | imaging evidence, gating strategy, population quantification |
| Pathway schematic (通路示意) | signaling/metabolic relationships, up/down regulation |
| Survival curve (生存曲线/Kaplan–Meier) | time-to-event differences between groups |

## Data Preparation

- Heatmap: cluster rows/columns only if the clustering is itself a claim;
  otherwise use a biologically meaningful order (pathway position, chromosome).
  Z-score per gene if scales differ, and say so on the colorbar.
- Volcano: predefine thresholds (e.g. |log2FC| ≥ 1, FDR < 0.05) before
  coloring; compute FDR, not raw p, for genome-scale data.
- Microscopy: export max projections or single z-planes consistently across
  panels; identical acquisition/exposure settings within a comparison.
- Flow: record the full gating path; report % of parent at each gate.
- Survival: start time, censoring rule, and grouping defined before plotting;
  do not cut the x-axis.

## Visual Encoding

- Heatmap: sequential colormap for magnitude, diverging (blue–white–red) for
  up/down log-fold change centered at zero; annotate values only if ≤ ~20×20
  cells; always draw the colorbar with units or transformation.
- Volcano: gray for non-significant, one accent color for hits, a second only
  if two directions matter; dashed threshold lines; label a handful of genes,
  never all.
- Microscopy panels: scale bar on every image (with µm value); channel name
  and stain on each panel; merge panels labeled "Merge". Same brightness/
  contrast for images being compared; never adjust beyond linear.
- Flow: percent-of-parent labels next to gates; use the same gate colors as
  the summary bar/dot plot that follows.
- Survival: censoring as tick marks on the curve; table of numbers-at-risk
  below the x-axis when n is small.

## Uncertainty & Statistical Annotation

- Volcano/omics: state the multiple-testing method (Benjamini–Hochberg etc.)
  on the axis or caption; show n per condition.
- Quantification panels accompanying micrographs: plot per-image or per-animal
  values as dots over mean ± SD; n = biological replicates, not fields of view.
- Survival: log-rank test p-value with the comparison it covers; report hazard
  ratio + CI for adjusted analyses.
- Show excluded samples and why, in the caption or a CONSORT-style flow.

## Common Reviewer Objections

- "Where is the replicate structure?" → biological vs technical n must be
  distinguishable from the plot.
- "Heatmap looks clustered because you clustered it" → declare ordering method.
- "Contrast/brightness adjusted" → state identical linear scaling for compared
  images.
- "Gating changed between groups" → show the same gates applied to all groups,
  including an FMO/isotype control.
- "Censoring ignored / curves cut early" → plot full follow-up with censor
  marks; report events/total per group.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [chemistry.md](chemistry.md) · [physics.md](physics.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (biology reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/biology.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
