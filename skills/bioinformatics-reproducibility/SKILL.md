---
name: bioinformatics-reproducibility
description: Use when making bioinformatics, omics, statistical, or scientific analyses reproducible, auditable, portable, or publication-ready. Covers project layout, metadata, environments, containers, workflow engines, provenance, data integrity, validation, and reporting.
skill_class: guard
load_policy: required
risk_tags: [controlled-data]
---

# Bioinformatics Reproducibility

Build the analysis so another researcher can reconstruct both the computation
and the scientific decisions.

## Project Contract

Use a clear layout such as:

```text
project/
  README.md
  config/
  metadata/
  workflow/
  scripts/
  envs/
  containers/
  tests/
  results/
  reports/
  logs/
```

Keep immutable raw data outside version control. Store checksums, accessions,
download commands, consent restrictions, and a data dictionary in `metadata/`.

## Pin The Computational Context

- Record OS, architecture, CPU/GPU requirements, tool versions, and database
  releases.
- Use `conda-lock`, `uv.lock`, `renv.lock`, container digests, or equivalent
  lock artifacts instead of unbounded version specifications.
- Prefer Apptainer/Singularity on HPC and Docker/Podman where daemons are
  allowed.
- Never embed credentials, tokens, patient identifiers, or controlled data in
  images, repositories, logs, or reports.

## Workflow Engines

Choose based on the environment:

| Need | Suitable choice |
| --- | --- |
| Pythonic file DAG and local/HPC execution | Snakemake |
| Portable channels, nf-core ecosystem, cloud/HPC | Nextflow |
| Regulated or cloud execution with explicit task contracts | WDL/Cromwell or CWL |
| Small analysis with few stable steps | Make or a strict shell script may suffice |

The workflow must declare inputs, outputs, resources, retries, logs, software,
and failure behavior. Do not use file existence alone as proof of success when a
tool can leave partial outputs.

## Run Provenance

Capture:

- Git commit and dirty-state marker.
- Full command line and resolved configuration.
- Input and important output checksums.
- Tool, reference, annotation, and database versions.
- Start/end time, hostname, scheduler job ID, resources, and exit code.
- Random seeds and thread counts for nondeterministic tools.

## Validation Layers

1. Schema checks for sample sheets and configuration.
2. Small fixture tests for scripts and parsers.
3. Workflow dry run or DAG validation.
4. Tool smoke tests using tiny public data.
5. Biological sanity checks and positive/negative controls.
6. End-to-end regeneration of a representative result.

Use synthetic data for edge cases, but retain a small realistic fixture because
biological formats frequently contain irregular metadata and optional fields.

## Reporting

Generate Quarto, R Markdown, Jupyter, or equivalent reports from code. Include
methods, sample attrition, QC decisions, software/reference versions, model
specification, effect sizes, uncertainty, limitations, and links to machine-
readable outputs.

## Release Checklist

- Workflow succeeds from a clean environment.
- Paths and secrets are not machine-specific.
- Raw data cannot be overwritten by default.
- References and remote inputs are checksummed.
- Failed or partial runs are distinguishable from completed runs.
- Results have a manifest and documented schema.
- License and citation requirements are present.
