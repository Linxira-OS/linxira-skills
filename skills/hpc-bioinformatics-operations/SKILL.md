---
name: hpc-bioinformatics-operations
description: Use when running, scaling, scheduling, monitoring, or troubleshooting bioinformatics and scientific workloads on Linux HPC clusters, Slurm, PBS, LSF, SGE, shared filesystems, modules, Conda, Apptainer/Singularity, GPUs, arrays, or workflow engines.
skill_class: contract
load_policy: required
risk_tags: [expensive, privileged, remote-compute]
---

# HPC Bioinformatics Operations

Convert a scientific workflow into scheduler-aware jobs with explicit resource,
environment, storage, and recovery behavior.

## Discover Cluster Policy

Before submission, inspect scheduler, partitions/queues, limits, fair-share,
account/project, scratch policy, modules, container support, internet access,
GPU types, and filesystem constraints. Site documentation overrides generic
examples.

## Resource Model

Estimate per task:

- Wall time and checkpoint behavior.
- CPU threads and whether the tool actually scales.
- Peak resident memory, not input file size alone.
- Temporary and final storage, inode count, and I/O pattern.
- GPU model, count, memory, driver/runtime, and CPU feeding requirements.

Request modest headroom, then use scheduler accounting to tune later runs.

## Slurm Template

```bash
#!/usr/bin/env bash
#SBATCH --job-name=analysis
#SBATCH --cpus-per-task=8
#SBATCH --mem=32G
#SBATCH --time=08:00:00
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

set -Eeuo pipefail

module purge
module load apptainer

mkdir -p logs results tmp
export TMPDIR="$PWD/tmp/${SLURM_JOB_ID}"
mkdir -p "$TMPDIR"

srun apptainer exec --cleanenv \
  --bind "$PWD:$PWD" \
  image.sif tool --threads "$SLURM_CPUS_PER_TASK" input output.tmp

test -s output.tmp
mv output.tmp results/output
```

Adapt directives to the site. Do not submit computation on login nodes.

## Arrays And Dependencies

Use arrays for independent samples and a manifest with one validated record per
task. Bound concurrency to protect metadata servers and licensed services. Use
scheduler dependencies or a workflow engine for aggregation; do not poll in a
tight shell loop.

## Environments

Prefer immutable containers for portability. On sites without containers, pin
Conda environments or environment modules and record the resolved package list.
Avoid activating large Conda environments repeatedly from networked home
directories in thousands of short jobs.

## Storage And I/O

- Keep code/configuration in backed-up project storage.
- Stage high-I/O temporary data to node-local scratch when supported.
- Copy verified final artifacts back before job exit.
- Batch small files into suitable archives only when downstream access permits.
- Never assume scratch is backed up or retained after job completion.

## Workflow Engines

Configure Snakemake, Nextflow, WDL, or CWL with scheduler profiles/executors,
per-rule resources, retries for transient failures, container binding, and a
bounded submission rate. Validate with a small profile before cohort-scale runs.

## Failure Diagnosis

Use scheduler state and accounting first:

```bash
squeue -j JOBID
sacct -j JOBID --format=JobID,State,ExitCode,Elapsed,AllocCPUS,ReqMem,MaxRSS
scontrol show job JOBID
```

Distinguish out-of-memory, wall-time, preemption, node failure, filesystem,
environment, bad input, and application errors. Increasing all resources is not
a diagnosis.

## Completion Criteria

- All expected tasks reached a terminal success state.
- Outputs pass size, format, checksum, and domain QC checks.
- Failed and retried tasks are documented.
- Resource efficiency is reviewed from accounting data.
- Logs, manifests, environment, configuration, and provenance are retained.
