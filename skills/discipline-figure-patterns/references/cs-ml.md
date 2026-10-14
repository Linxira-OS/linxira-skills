# CS/ML Figure Patterns

Reference for machine-learning paper figures: quantitative result plots, curve
families, and schematic diagrams (示意图). Follows the shared conventions in
[../SKILL.md](../SKILL.md).

Guiding rule: the x-axis must be the variable your claim is about. If the claim
is "component X helps", the x-axis is the presence of X and nothing else. If the
claim is "we scale better", the x-axis is budget (log scale) and the y-axis is
the loss or metric, never a normalized-within-run score.

## Figure Type Index (图型清单)

| Type | Use for | x-axis / layout driver |
|---|---|---|
| Training/validation curves (训练/验证曲线) | convergence speed, overfitting onset, run stability | optimization step or epoch |
| Ablation bars or dot plot (消融柱状/点图) | marginal contribution of each component | one component removed per bar |
| Confusion matrix (混淆矩阵) | per-class error structure and confusions | predicted × true class |
| Calibration / reliability diagram (置信度校准图) | whether confidence matches accuracy | predicted-probability bin |
| ROC / PR curves (ROC/PR 曲线) | threshold-free ranking quality; PR for imbalance | FPR / recall |
| Embedding scatter (嵌入降维散点：PCA/t-SNE/UMAP) | qualitative cluster and manifold structure | 2-D projection |
| Scaling law plot (缩放律) | trend vs. model, data, or compute budget | log budget, log metric |
| Efficiency frontier (效率前沿：quality vs cost) | best quality at fixed latency/FLOPs/memory | cost budget |
| Hyperparameter sensitivity (超参敏感性) | robustness to one hyperparameter | hyperparameter value |
| Attention / saliency map (注意力/显著性图) | where the model attends, not why it is correct | input grid overlay |
| Error taxonomy (错误分类学) | failure modes grouped by cause, not class | category grid |
| Schematic diagrams (示意图): conceptual (概念), framework (框架), pipeline (流程), architecture (架构), taxonomy (分类全景), teaser (主视觉) | the Figure 1 visual argument | none — layout only |

## Figure Selection Quick Table (图型选择速查表)

| Data shape you have | Recommended | Forbidden / misleading |
|---|---|---|
| Metric vs. step, ≥ 3 seeds | training curve + spread band; validation marked | single-seed line, spread hidden in caption |
| K configurations, one component each | ablation bar/dot, full model as reference line | stacked-to-100% bars when parts overlap |
| C × C counts per class | confusion matrix | raw-count heatmap on imbalanced classes without row-normalization |
| High-dim features + labels, small n | t-SNE/UMAP scatter, qualitative only | numeric cluster-distance or "separability" claims |
| Budget (params/data/FLOPs) vs. loss over decades | log-log points + fitted slope in legend | linear axes hiding the exponent; fit-only curve |
| Score + latency/FLOPs per model | efficiency frontier with Pareto front | two separate axes not sharing the cost unit |
| Predicted probability + correctness | reliability diagram + ECE | a single accuracy number claiming calibration |
| Ranking scores across classes | PR curve when positives are rare | ROC alone under heavy imbalance |
| Raw inputs + implied focus | saliency/attention overlay labelled "illustrative" | presenting saliency as causal explanation |
| Free-form failures you bucketed | error taxonomy grid with counts | hand-picked cherry-picked example panels |
| A system, not a number | schematic (pick one of the six kinds) | a schematic padded with result plots it does not need |

## Schematic Taxonomy (六类构思图)

Pick the label first; the label fixes layout density and how much text belongs
inside the figure. Labels describe visual function, not research field.

- **Conceptual (概念)**: one visual metaphor carries one core idea, few words.
  Use when the contribution is a reframing, not a component; keep it re-drawable
  in black and white.
- **Framework (框架)**: boxes = components, arrows = information flow, for
  systems and multi-agent settings. Arrow direction must match the text's
  description of control and data flow; label loops explicitly.
- **Pipeline (流程)**: staged end-to-end data flow, left to right, with an
  input/output annotation on every stage. Split at the boundaries where a
  reviewer would ask "what is the unit here?".
- **Architecture (架构)**: internal layers and tensor linkages of one model;
  annotate shapes/channels on edges, share weight-tied blocks visibly.
- **Taxonomy (分类全景)**: landscape of tasks, capabilities, or datasets;
  grouping by containment or grid, never arrows. Show the axis by which entries
  are grouped.
- **Teaser (主视觉)**: designed main visual mixing an illustrative image, a
  short claim, and one real result curve. Reserve for contributions that cannot
  be stated in a sentence; never let the illustrative part imply measured data.
  Export schematics as vector with editable text and label any generated or
  borrowed imagery as illustrative, never as evidence.

## Data Preparation

- Curves: store raw per-step values; if you smooth (EMA, moving average), say
  the window and keep the validation series unsmoothed. Never tune the
  smoothing window to make your curve look smoother than a baseline's.
- Ablations: full model minus exactly one component per bar; identical metric,
  split, and budget (steps, tuning trials) for every bar; ≥ 3 seeds each.
- Confusion matrix: row-normalize when class support is unequal and print
  "row-normalized" on the axis; keep the raw counts in the supplement.
- Calibration: compute bin counts; a bin with few samples is noise — annotate
  the counts or wider bins are needed.
- Embeddings: fix random seed, perplexity/n_neighbors, and input features;
  fit the reducer on train only when leakage would change the picture.
- Scaling: keep the raw (log x, log y) points, the fitted line, its exponent,
  and the fit window; never plot only the fit.
- Frontiers: one cost unit per axis (ms, FLOPs, params — not a mix); measure on stated hardware and batch size.

## Visual Encoding

- Training curves: x = steps or epochs (say which, and the effective batch
  size); validation as markers over the training line, not a second y-axis.
  Baselines in muted color, your method one saturated accent, and the same
  role-color mapping in every figure of the paper.
- Ablation bars: one hue, shade or hatch from full model (darkest) to most
  removed (lightest); horizontal reference line at the full model; y-range
  covers the data, not forced to zero when the claim is a difference.
- Confusion matrix: annotate the diagonal and the largest off-diagonal cells;
  a sequential colormap, or diverging only for signed residual-style matrices.
- Curves (ROC/PR): label the operating point used in the headline metric;
  PR curves must state prevalence.
- Embedding scatter: small markers, reduced opacity for density; pair color
  with marker shape beyond three classes; gray-outliers if you exclude any.
- Scaling: annotate the exponent (± CI) in the legend, not just "O(N^-α)".
- Schematics: low-saturation fills, saturated arrows for the emphasized path;
  sans-serif labels at least caption size; export vector with live text.

## Uncertainty & Statistical Annotation

- Curves: shaded band = range or ±SD across seeds; state n seeds. If you show
  min/max, say so — a range and a CI read differently.
- Ablations: error bars (state SD vs SEM); significance only with an explicit
  test named in the caption, otherwise omit stars entirely.
- Rows/columns of a confusion matrix: report the metric with its averaging
  (micro/macro/weighted) on the axis or in the legend.
- Scaling: report fit residuals or the confidence interval on the exponent; a
  single lucky run is not a law.
- Everywhere: the metric definition (accuracy vs F1, micro vs macro), the split
  name (val/test, in-distribution vs OOD), and the seed count appear on the
  figure or in the caption, not left implicit.

## Common Reviewer Objections

- "Only one seed / no variance" → plot multi-seed bands with n stated.
- "Baselines under-tuned" → caption the tuning budget (trials, search space) for
  every method, including yours.
- "t-SNE clusters separated but accuracy is low" → t-SNE is qualitative; pair it
  with a quantitative panel (confusion matrix, per-class F1).
- "Cherry-picked training window" → show full training or state the cutoff and
  why; never truncate at the last good epoch.
- "Ablation conflates changes" → one component per bar; note any unavoidable
  coupled change in the caption.
- "Calibration claimed from accuracy" → show the reliability diagram.
- "Scaling fit has floating exponent per dataset" → fix the fit window and
  report the interval; show sensitivity.
- "Cost frontier measured on different hardware" → state hardware, batch size,
  precision; keep one measurement protocol.

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
