# CS/ML Figure Patterns

Reference for machine-learning paper figures: quantitative result plots and
schematic diagrams (示意图). Follows the shared conventions in
[../SKILL.md](../SKILL.md).

## Figure Type Index (图型清单)

| Type | Use for |
|---|---|
| Training/validation curves (训练/验证曲线) | optimization behavior, convergence, overfitting |
| Ablation bars (消融柱状图) | contribution of each component to a headline metric |
| Confusion matrix (混淆矩阵/热图) | per-class error structure |
| Embedding scatter (嵌入散点：t-SNE/UMAP 类) | qualitative cluster/separation structure |
| Scaling law plot (缩放律) | trend vs. model/data/compute on log-log axes |
| Schematic diagrams (示意图): conceptual (概念), framework (框架), pipeline (流程), architecture (架构), taxonomy (分类全景), teaser (主视觉) | Figure 1 visual argument |

## Schematic Taxonomy

Labels describe the visual function of the figure, not the research field:

- **Conceptual**: one visual metaphor explains one core idea; minimal text.
- **Framework**: modules and their collaboration in a system or multi-agent
  setting; boxes = components, arrows = information flow.
- **Pipeline**: end-to-end staged data flow, left-to-right; each stage gets an
  input/output annotation.
- **Architecture**: internal layers and tensor connections of one model;
  shapes/channels annotated on edges.
- **Taxonomy**: landscape of tasks, capabilities, or benchmark datasets;
  grouping by containment or grid, not arrows.
- **Teaser**: designed main visual mixing image + text + one result curve;
  use only when the contribution is hard to state in words alone.

Choose the label first; it dictates layout density and how much text belongs
inside the figure.

## Data Preparation

- Curves: log the raw per-step values; decide window/smoothing (e.g. EMA) and
  state it in the caption; keep validation on the un-smoothed series.
- Ablations: full model minus exactly one component per bar; report the same
  metric and split for every bar; ≥3 seeds per configuration.
- Confusion matrix: row-normalize if classes are imbalanced; state the
  normalization in the axis label.
- Embeddings: fix random seed, perplexity/n_neighbors, and input features;
  state that global distances are not meaningful; color by ground-truth label,
  never by cluster ID from the embedding itself.
- Scaling: plot the raw (log x, log y) points with the fitted line and its
  exponent in the legend; never show only the fit.

## Visual Encoding

- Training curves: x = steps/epochs, y = metric; validation as markers on top
  of the training line, not a second axis. Baseline methods get muted colors,
  your method the single saturated accent; keep the same role-color mapping in
  every figure of the paper.
- Ablation bars: one hue, varying shade or hatch from full model (darkest) to
  most-removed (lightest); horizontal baseline line for the full model; tighten
  the y-axis to the data range.
- Embedding scatter: small marker size, reduced opacity for density; if >3
  classes, pair color with marker shape.
- Schematics: low-saturation fills, saturated arrows for the emphasized path;
  sans-serif labels ≥ caption size; export as vector with editable text.

## Uncertainty & Statistical Annotation

- Curves: shaded band = range or ±SD across seeds; state n seeds.
- Ablations: error bars (state SD vs SEM); mark significance only with an
  explicit test, else omit.
- Scaling: report fit residuals or CI on the exponent.
- For all: the metric definition (accuracy vs F1, micro vs macro, split name)
  must appear on the axis or legend.

## Common Reviewer Objections

- "Only one seed / no variance shown" → always plot multi-seed bands.
- "Baselines under-tuned" → caption the tuning budget for every method.
- "t-SNE clusters look separated but accuracy is low" → t-SNE is qualitative;
  pair it with a quantitative panel.
- "Cherry-picked training window" → show full training or state the cutoff.
- "Ablation conflates two changes" → one component per bar, nothing else moves.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[biology.md](biology.md) · [chemistry.md](chemistry.md) ·
[physics.md](physics.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (cs-ml reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/cs-ml.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
