# Scientific AI Policy

## Decision

`scientific-ai` is the first-party contract for model-centric scientific work.
It does not choose one framework or vendor. Instead, it defines the conditions
that every training, evaluation, inference, or serving workflow must satisfy.

## Scope

The contract covers:

- dataset versioning and split boundaries
- checkpoint and tokenizer identity
- prompt, decoding, and adapter configuration
- compute cost and runtime boundaries
- reproducible evaluation and baseline comparison
- artifact retention for reports and claims

It complements existing contracts rather than replacing them:

- `compute-cloud` gates remote compute creation and teardown
- `linux-gpu-compute` and HPC skills govern host execution details
- `research-manuscript-integrity` governs final research prose and claims

## Non-Goals

- no vendor-specific launcher commands
- no framework-specific code templates
- no benchmark whitelist presented as universal truth
- no permission to send controlled data to remote APIs by default

## Follow-On Work

Future provider or workflow profiles may specialize this contract for local GPU
training, managed inference APIs, distributed jobs, or agent evaluation, but
they must keep the same dataset, baseline, metric, and artifact boundaries.
