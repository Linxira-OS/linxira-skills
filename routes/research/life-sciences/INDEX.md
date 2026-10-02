# Life Sciences

- Biological experimental units, controls, allocation, blocking, and batches: `biological-experimental-design/SKILL.md`
- Estimands, endpoints, power, models, missingness, and multiplicity: `biological-study-statistics/SKILL.md`
- Authorized wet-lab SOP, approval, hazard, provenance, and checkpoint planning: `wet-lab-experiment-planning/SKILL.md`
- Molecular mechanisms, kinetics, binding, constructs, and biochemical assays: `biochemistry-molecular-experimental-design/SKILL.md`
- Agronomic crop, field, greenhouse, management, and genotype-environment studies: `crop-plant-experimental-design/SKILL.md`
- Mechanistic plant water, carbon, development, source-sink, and stress physiology: `plant-physiology-experimental-design/SKILL.md`
- Ecology, field sampling, occupancy, abundance, and spatial-temporal designs: `ecology-field-experimental-design/SKILL.md`
- Marine and freshwater stations, depths, water masses, and hydrological dependence: `aquatic-biology-field-study-design/SKILL.md`
- Conservation monitoring, management comparisons, BACI, and demographic decisions: `conservation-biology-study-design/SKILL.md`
- Soil horizons, cores, rhizosphere, compositing, and field-to-lab studies: `soil-biology-experimental-design/SKILL.md`
- Animal physiology, welfare, repeated measures, and humane endpoints: `animal-physiology-experimental-design/SKILL.md`
- Microbial isolates, communities, contamination controls, and strain provenance: `microbiology-experimental-design/SKILL.md`
- Cell, donor, clone, organoid, well, plate, and perturbation design: `cell-biology-experimental-design/SKILL.md`
- Inheritance, pedigrees, populations, association, and genotype-phenotype studies: `genetics-genomics-study-design/SKILL.md`
- Developmental staging, lineage, timing, and maternal-litter-clutch effects: `developmental-biology-experimental-design/SKILL.md`
- Immune compartments, stimulation, repertoire, and longitudinal responses: `immunology-experimental-design/SKILL.md`
- Neural, behavioral, electrophysiology, and neuroimaging study design: `neuroscience-experimental-design/SKILL.md`
- Microscopy and flow-cytometry acquisition, controls, gating, and segmentation: `cellular-imaging-cytometry-study-design/SKILL.md`
- Matched specimens, aliquots, modalities, batch alignment, and omics integration: `multi-omics-study-design/SKILL.md`
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

Select one canonical domain workflow for the primary design problem. Use the
plant-physiology leaf instead of the crop leaf for mechanistic organ or whole-plant
physiology; use aquatic, conservation, or soil instead of generic ecology when that
specialized system defines the units and validity threats. Use cell biology for
cell-state, localization, donor-clone-plate, or organoid design; use biochemistry
and molecular biology for molecular assays, kinetics, binding, or constructs; use
multi-omics when cross-modality integration is the primary estimand. References to
shared design or statistics skills are handoffs, not permission to concatenate
overlapping workflow bodies.

When the request starts from an existing stage artifact such as `quant.sf`, a
tximport object, a fitted DESeq2 object, or a ranked vector, select that stage's
leaf directly. Do not load overlapping stage alternatives.
