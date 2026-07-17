---
name: salmon-quantification
description: Use when quantifying bulk RNA-seq FASTQ files with Salmon and handing transcript estimates to gene-level differential expression through tximport. Requires a versioned decoy-aware reference, sample manifest, library-type verification, and durable quantification artifacts.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Salmon Quantification

The contract is FASTQ to versioned transcript estimates to a serialized
`tximport` object. Do not treat a hand-built matrix of transcript counts as a
gene-level DESeq2 input.

## Inputs

Require:

- unique sample IDs and authoritative FASTQ paths
- biological analysis-unit, library, and sequencing-run IDs, with a declared
  technical-run collapse policy
- paired/single-end layout and expected strandedness
- post-remediation minimum read length
- transcriptome and genome sequences from the same release
- a matching annotation and a validated transcript-to-gene map
- checksums and source URLs/accessions for reference files

Build the index once in a temporary directory, validate it, then move it into a
versioned final path. A decoy-aware index should use a gentrome and matching
decoy list rather than transcript sequences alone.

```bash
salmon index --transcripts gentrome.fa.gz --decoys decoys.txt \
  --index refs/salmon-release
```

## Quantification

For paired reads:

```bash
salmon quant --index refs/salmon-release --libType A \
  --mates1 sample_R1.fastq.gz --mates2 sample_R2.fastq.gz \
  --seqBias --gcBias --posBias \
  --threads 8 --output quant/sample
```

For single-end reads, supply the experimentally justified fragment-length mean
and standard deviation. Do not copy paired-end defaults into single-end work.

Inspect `lib_format_counts.json`, mapping rate, fragment metrics, warnings, and
sample-to-sample anomalies. `--libType A` is detection, not proof; reconcile the
detected type with the library protocol and strandedness expectation.

The default index k-mer is appropriate for ordinary modern read lengths. Set a
smaller odd `--kmerLen` only when the minimum retained read length requires it,
and record that choice with the index provenance.

## tximport Handoff

Construct `tx2gene` with a maintained GTF/GFF parser or release-provided mapping.
Validate that transcript IDs match `quant.sf`, gene IDs are nonempty, and the
mapping is not many-gene ambiguous.

```r
library(tximport)

files <- setNames(file.path(samples$quant_dir, "quant.sf"), samples$sample_id)
stopifnot(all(file.exists(files)))

txi <- tximport(
  files,
  type = "salmon",
  tx2gene = tx2gene,
  countsFromAbundance = "no"
)
saveRDS(txi, "artifacts/tximport.rds")
```

Pass this object to `DESeqDataSetFromTximport`. Preserve the abundance, counts,
length, mapping, and sample order together. If another
`countsFromAbundance` strategy is selected, record why and use a downstream
construction method compatible with that choice.

For QuantSeq or another 3'-tag protocol, transcript length is not the sampling
bias modeled by full-length RNA-seq. Do not pass `avgTxLength` offsets into
DESeq2. Preserve the original tximport object, use `round(txi$counts)` to
construct a count-matrix DDS without length offsets, and record the
protocol-specific decision.

## Validation

- Every sample has a complete `quant.sf`, log, and auxiliary directory.
- Sample names in the manifest, file map, and tximport matrices are identical
  and in the same order.
- Reference transcript IDs and `tx2gene` IDs use the same namespace/version rule.
- Mapping-rate or library-type anomalies are investigated before DE.
- Partial output directories are never accepted as completed samples.

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, paths
`rna-quantification/alignment-free-quant` and
`rna-quantification/tximport-workflow`. This version makes the tximport bridge
mandatory and removes plain transcript-matrix handoffs.

## Citation

```text
Linxira OS. Linxira Skills: salmon-quantification. Version 0.1.0.
Skill path: skills/salmon-quantification/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite the Salmon quantification method and tximport if the workflow uses
their outputs in a report or manuscript.
