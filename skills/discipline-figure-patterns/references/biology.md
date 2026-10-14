# Biology Figure Patterns

Reference for biology and biomedicine paper figures: omics, single-cell,
imaging, cytometry, pathway schematics, survival analysis, enrichment, and
circular summaries. Follows the shared conventions in [../SKILL.md](../SKILL.md).

Guiding rule: name the unit (gene, cell, animal, patient) before choosing the
chart, and keep that unit on the plot. A heatmap of sample means hides donor
variability; a per-cell scatter can overstate significance if cells from one
animal are not treated as technical replicates.

## Figure Type Index (图型清单)

| Type | Use for | Unit shown |
|---|---|---|
| Omics heatmap (组学热图) | abundance patterns across samples/conditions | feature × sample |
| Volcano plot (火山图) | differential expression: effect size vs significance | tested feature |
| MA plot (MA 图) | intensity-dependent fold change, normalization check | tested feature |
| Sample PCA (样本 PCA) | batch/group structure in the sample space | sample |
| Marker dot plot (标记基因点图) | expression level + fraction of cells per group | gene × cluster |
| Single-cell UMAP (单细胞 UMAP) | cluster identity and manifold structure | cell |
| Microscopy / IHC panels (显微/免疫组化) | spatial evidence for a localization claim | image field |
| Flow cytometry gating (流式圈门与汇总) | population definition and its quantification | event / parent |
| Pathway schematic (通路示意) | signaling/metabolic relationships and direction | node/edge |
| Survival curve KM (生存曲线/Kaplan–Meier) | time-to-event difference between groups | participant |
| Enrichment running score (富集瀑布图/GSEA) | where hits fall along a ranked list | ranked gene |
| Enrichment lollipop/bar (富集棒棒糖/柱图) | top terms with effect size and FDR | term |
| Mutation/oncoplot landscape (突变瀑布/全景图) | co-occurrence of alterations across patients | patient × gene |
| Circos / chord diagram (环状图/弦图) | genome-wide or cross-compartment links | genomic bin / group |

## Figure Selection Quick Table (图型选择速查表)

| Data shape you have | Recommended | Forbidden / misleading |
|---|---|---|
| Feature × sample matrix, one scale | heatmap, sequential colormap | diverging map on all-positive abundance |
| log-fold change + FDR, genome scale | volcano with FDR threshold | raw-p coloring; labeling all genes |
| Counts + size factors, pre-test QC | MA plot | volcano alone when a normalization artifact is the story |
| Many samples, many features | PCA scatter labelled by batch/group | PCA colored by the label you want to predict |
| Per-cell expression + cluster labels | dot plot (dot = fraction, color = level) | heatmap of cluster means as if it were per-cell data |
| Cell embedding + labels | UMAP, qualitative only | UMAP axis units or cluster-distance claims |
| Tissue sections per condition | matched-field microscopy panels + quant panel | a single representative field with no quantification |
| FCS files + gates | gating tree + % of parent summary | gates re-tuned per group |
| Ranked gene list + gene sets | GSEA running score, or lollipop of top terms | bar chart of −log10(p) with no effect size |
| Patients × alteration events | oncoplot sorted by frequency | pie chart of mutation classes only |
| Group survival + censor times | Kaplan–Meier with censor marks and at-risk table | truncated x-axis; p-value without HR/CI |
| Cross-chromosome or cross-compartment links | circos with stated bin size | chords drawn without an arc-length scale |

## Data Preparation

- Heatmap: cluster rows/columns only when the clustering is itself a claim;
  otherwise use a biological order (pathway position, chromosome). Z-score per
  feature when scales differ and say "row z-score" on the colorbar.
- Volcano/MA: predefine thresholds (|log2FC| ≥ 1, FDR < 0.05) before coloring;
  use FDR (Benjamini–Hochberg or stated alternative), never raw p, at genome
  scale. MA keeps the mean-intensity axis so normalization artifacts are visible.
- Single-cell: state the normalization, the number of PCs/neighbors, and whether
  clusters were called on the same cells that were plotted. Report cell counts
  per cluster and donor counts per group.
- Microscopy: export the same projection type (max or single z) across panels;
  identical exposure/gain within a comparison; keep the single-channel files.
- Flow: record the full gating tree and the % of parent at each gate; apply the
  same gates to all groups and include an FMO/isotype control.
- Survival: define start time, censoring rule, and grouping before plotting;
  report the number at risk and the events/total per group.
- Enrichment: state the ranked statistic, gene-set database + version, and the
  multiple-testing correction.
- Circos: fix bin size, chromosome order, and the meaning of each arc; do not
  draw ribbons without an underlying link table.

## Visual Encoding

- Heatmap: sequential colormap for magnitude, diverging (blue–white–red)
  centered at zero for signed log-fold change; annotate cell values only at
  roughly ≤ 20 × 20 cells; always draw the colorbar with its transformation.
- Volcano: gray for non-significant, one accent for hits, a second only if both
  directions matter; dashed threshold lines; label a handful of genes.
- MA: points gray, hits colored as in the volcano, so the pair reads as one story.
- Dot plot: dot size = fraction expressing, dot color = mean level; state both
  encodings in the legend, never reuse color for a third meaning.
- UMAP: small markers, reduced opacity for density; gray non-target cells when
  highlighting a population; never imply the axes are measured.
- Microscopy: scale bar on every image with the µm value; channel name and stain
  on each panel; merge labeled "Merge"; same brightness/contrast for compared
  images and never adjusted beyond linear.
- Flow: percent-of-parent next to each gate, using the same gate colors as the
  summary plot that follows.
- Survival: censoring as tick marks; step functions, not smoothed curves; at-risk
  table under the x-axis when n is small.
- Circos: keep one idea per ring; label track meaning at the track, and use the
  caption for any link-count summary.

## Uncertainty & Statistical Annotation

- Omics/volcano: state the multiple-testing method on the axis or in the
  caption; show n per condition; report the number of features tested.
- Quantification accompanying micrographs: plot per-image or per-animal values
  as dots over mean ± SD; n = biological replicates, not fields of view.
- Flow: report the gate as a percentage of its parent with the denominator
  visible; give event counts.
- Survival: log-rank p-value with the comparison it covers; hazard ratio + CI
  for adjusted analyses; report censoring rate per group.
- Enrichment: report normalized enrichment score or effect size with the FDR of
  each shown term, not significance alone.
- Show excluded samples and why, in the caption or a CONSORT-style flow; never
  let an exclusion that changes interpretation live only in the supplement.

## Common Reviewer Objections

- "Where is the replicate structure?" → biological vs technical n must be
  distinguishable from the plot itself.
- "Heatmap looks clustered because you clustered it" → declare the ordering and
  distance/linkage method.
- "Contrast/brightness adjusted" → state identical linear scaling for compared
  images and provide raw channels.
- "Gating changed between groups" → show the same gates on all groups plus a
  negative control.
- "Censoring ignored / curves cut early" → plot full follow-up with censor marks
  and per-group events/total.
- "Enrichment shown only as −log10(p)" → add effect size and FDR; state the
  gene-set database.
- "Circos is decorative" → justify each track by a question it answers.
- "Single-cell n is inflated" → state donor-level replication and how clustering
  uncertainty was handled.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [chemistry.md](chemistry.md) ·
[physics.md](physics.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (biology reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/biology.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
