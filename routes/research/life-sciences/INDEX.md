# Life Sciences

- Broad analysis planning and method routing: `bio-analysis-orchestrator/SKILL.md`
- Reproducible bioinformatics environments and artifacts: `bioinformatics-reproducibility/SKILL.md`
- Full or multi-stage bulk RNA-seq workflow: `bulk-rnaseq-analysis/SKILL.md`
- FASTQ quality control and evidence-based remediation: `fastq-quality-control/SKILL.md`
- Salmon quantification and tximport handoff: `salmon-quantification/SKILL.md`
- Count-matrix and sample-level quality control: `count-matrix-quality-control/SKILL.md`
- DESeq2 model fitting and contrasts: `differential-expression-deseq2/SKILL.md`
- Differential-expression interpretation and export: `differential-expression-results/SKILL.md`
- Ranked gene-set enrichment and pathway interpretation: `gene-set-enrichment-analysis/SKILL.md`
- Sequence file reading: `bio-read-sequences/SKILL.md`
- Sequence statistics: `bio-sequence-statistics/SKILL.md`
- Structure navigation: `bio-structural-biology-structure-navigation/SKILL.md`
- AlphaFold predictions and public records: `bio-structural-biology-alphafold-predictions/SKILL.md`

When the request starts from an existing stage artifact such as `quant.sf`, a
tximport object, a fitted DESeq2 object, or a ranked vector, select that stage's
leaf directly. Do not load overlapping stage alternatives.
