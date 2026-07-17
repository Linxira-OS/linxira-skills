---
name: fastq-quality-control
description: Use when validating bulk RNA-seq FASTQ inputs, interpreting FastQC or MultiQC findings, deciding whether adapter or quality trimming is justified, and verifying any remediated reads. Do not use generic threshold failures as automatic reasons to discard reads or samples.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# FASTQ Quality Control

QC is a decision record, not a collection of green check marks. Interpret each
signal in the context of library protocol, read layout, organism, and expected
expression complexity.

## Preflight

Validate the sample sheet before running tools:

- sample IDs are unique and filesystem-safe
- every declared FASTQ exists and is readable
- paired-end mates have matching sample/run identity
- compression is valid and files are no longer being written
- checksums or acquisition provenance exist for important inputs

Do not print read names or sequence content from controlled data into shared
logs unless the approved environment permits it.

## Baseline Run

Use a new run-specific output directory and fail if it already exists:

```bash
run_dir="qc/raw-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir "$run_dir" || { printf '%s\n' "Cannot create new QC directory: $run_dir" >&2; exit 1; }
mkdir "$run_dir/fastqc" "$run_dir/multiqc"
fastqc --threads 4 --outdir "$run_dir/fastqc" sample_R1.fastq.gz sample_R2.fastq.gz
multiqc --outdir "$run_dir/multiqc" "$run_dir/fastqc"
```

For cohorts, run FastQC on every file and inspect both the aggregate report and
sample-level exceptions. Record tool versions and input checksums.

## Interpret Evidence

Review at least:

- total reads, read length, and encoding
- per-base quality and terminal quality decay
- adapter and overrepresented sequence evidence
- GC distribution and unexpected multimodality
- duplication in light of RNA expression and library depth
- mate consistency and large sample-to-sample yield differences

High duplication can be expected for highly expressed transcripts and is not a
license to deduplicate FASTQ files. GC or sequence-content warnings can reflect
real biology, priming, rRNA, adapters, or contamination; distinguish them with
protocol and sequence evidence.

## Remediation Gate

Trim only when the raw report identifies a concrete problem that trimming can
solve. State the adapter source, quality rule, minimum retained length, and
expected effect before running a tool. Do not use aggressive sliding-window or
poly-G trimming as a universal default.

Before writing remediated files:

1. Confirm output paths do not already contain irreplaceable results.
2. Preserve raw FASTQ files.
3. Keep JSON/HTML logs and the exact command.
4. Verify paired outputs remain synchronized.
5. Re-run FastQC and MultiQC on the resulting files.

## Decision Record

For every sample, record `pass`, `warn`, or `fail`, the evidence, and the action.
A sample should be excluded only for a documented identity, library, corruption,
contamination, or design failure. Low depth alone may limit power without making
the sample invalid.

## Completion Criteria

- Every input is represented in the cohort report.
- File/run identity and mate pairing are reconciled.
- Any trimming is evidence-based and followed by QC.
- Raw inputs remain preserved.
- The downstream workflow knows which FASTQ path is authoritative.

FastQC and MultiQC cannot establish same-species donor identity. When biological
identity assurance matters, route to genotype or fingerprint concordance using
independent variants or other validated sample-identity evidence.

## Provenance

Adapted from MIT `bioSkills` revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`, paths
`read-qc/quality-reports` and `read-qc/fastp-workflow`. This version removes
automatic overwrite/aggressive-trimming behavior and makes remediation a gated
decision.

## Citation

```text
Linxira OS. Linxira Skills: fastq-quality-control. Version 0.1.0.
Skill path: skills/fastq-quality-control/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Also cite the quality-control and preprocessing software actually used, such as
FastQC, MultiQC, and any trimming tool invoked in the workflow.
