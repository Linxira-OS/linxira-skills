---
name: scientific-ai
description: Use before training, fine-tuning, evaluating, benchmarking, serving, or comparing AI models for scientific work. Defines dataset, compute, metric, reproducibility, and model-governance requirements.
skill_class: contract
load_policy: required
risk_tags: [controlled-data, expensive, remote-compute]
---

# Scientific AI Contract

Scientific AI work changes expensive state and can produce misleading claims if
datasets, metrics, compute, or model versions are underspecified. Use this
contract before model training, fine-tuning, inference benchmarking, evaluation,
or deployment for research.

## Preflight

Before any run, establish:

1. Task type: inference, fine-tuning, pretraining, evaluation, embedding,
   retrieval, agent benchmarking, or serving.
2. Inputs: dataset version, split policy, labels, preprocessing, exclusions,
   and any controlled, unpublished, or personal data boundary.
3. Model identity: provider, checkpoint, revision, tokenizer, adapter, prompt
   template, quantization, and frozen versus trainable components.
4. Compute boundary: hardware class, runtime, expected duration, budget, and
   failure or stop condition.
5. Evaluation contract: metrics, baseline, confidence method, seed policy, and
   artifact destination.

Do not call a model “better”, “accurate”, or “state of the art” without naming
the benchmark, baseline, and comparison conditions.

## Dataset Rules

- Keep train, validation, and test boundaries explicit.
- Record sampling, filtering, augmentation, and exclusion logic.
- Do not mix held-out evaluation data into tuning, prompt iteration, or error
  analysis without marking the breach.
- Confirm data movement, retention, and encryption before sending any dataset to
  a remote provider or managed API.

## Compute And Cost

- Use `compute-cloud` for remote provisioning and `linux-gpu-compute` or HPC
  contracts for host-level execution details.
- Estimate hardware, time, storage, and checkpoint frequency before launch.
- Stop idle runs, abandoned notebooks, and stale serving processes promptly.
- Track the job or run identifier and preserve logs, configs, and resolved
  environment details.

## Reproducibility

- Pin model revision, package versions, container or environment, and seeds.
- Record prompt templates, system instructions, decoding parameters, and tool
  configuration for non-deterministic or agentic evaluations.
- Preserve raw evaluation outputs, metric scripts, and post-processing logic.
- Separate exploratory runs from reportable runs; only the latter may support a
  final claim.

## Evaluation And Reporting

- Compare against an explicit baseline or prior model.
- Use task-appropriate metrics and explain their limitations.
- State whether results come from one run, repeated seeds, cross-validation, or
  confidence intervals.
- Keep model capability claims within the tested task, domain, and data regime.
- Report failures, hallucinations, unsafe behaviors, and boundary cases, not
  only wins.

## Completion

A scientific AI task is complete only when the model version, dataset, metric,
runtime, outputs, and cost boundary are all known, and any remote jobs or
services are either intentionally retained or shut down.
