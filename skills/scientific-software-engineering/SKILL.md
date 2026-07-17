---
name: scientific-software-engineering
description: Use when designing, implementing, changing, testing, reviewing, packaging, or maintaining scientific and bioinformatics software. Covers data contracts, scientific invariants, focused regression evidence, and honest completion claims; it does not replace domain analysis or remote-system safety contracts.
skill_class: guard
load_policy: conditional
risk_tags: [controlled-data]
---

# Scientific Software Engineering

Treat scientific correctness, data integrity, and reproducibility as product
requirements.

## Start With Contracts

Define inputs, outputs, units, coordinate conventions, identifier systems,
missing-value behavior, numeric tolerance, error semantics, and supported data
sizes before choosing abstractions.

For genomic formats, state explicitly whether coordinates are zero-based or
one-based and half-open or closed. For variants, record genome build and
normalization rules. For statistical code, define the estimand and test.

## Implementation Rules

- Use mature format libraries for FASTA/FASTQ, BAM/CRAM, VCF/BCF, BED/GFF/GTF,
  HDF5, AnnData, and domain formats instead of ad hoc parsing.
- Stream or chunk large data; avoid loading cohort-scale files without a memory
  estimate.
- Separate I/O, domain transformations, statistics, and presentation.
- Make randomness explicit and injectable.
- Preserve precision and units; avoid silent coercion and locale-sensitive I/O.
- Fail with actionable context including sample, file, record, and violated
  invariant, while excluding secrets and patient data.
- Keep CLI output stable and send diagnostics to stderr.

## Testing Strategy

Use focused layers:

- Unit tests for pure transformations and statistical helpers.
- Golden fixtures for file-format round trips and CLI outputs.
- Property tests for invariants such as sort order, normalization, and lossless
  conversion.
- Integration tests against real tools or services behind explicit markers.
- Regression tests for every corrected scientific bug.

Test empty inputs, malformed records, duplicate identifiers, alternate contigs,
missing metadata, compressed streams, interrupted writes, Unicode sample names,
very large values, NaN/Inf, and platform path differences where relevant.

For a corrected defect, preserve the smallest reproducer as a regression test.
When the original data is unavailable or controlled, construct a minimized
synthetic fixture that preserves the relevant shape, units, identifiers, and
failure boundary, and state the remaining uncertainty.

## CLI And API Design

Provide `--help`, `--version`, deterministic exit codes, dry-run behavior for
destructive or expensive actions, configurable threads/memory, and structured
output where automation is expected. Avoid changing defaults that alter
scientific results without a major version or migration note.

## Performance

Profile before optimizing. Benchmark representative data and report throughput,
peak memory, thread scaling, and I/O assumptions. Confirm that parallel
execution does not change record ordering or numeric results beyond documented
tolerance.

## Delivery

- Pin build and test environments.
- Run formatters, linters, type checks, unit tests, and fixture tests in CI.
- Publish checksums and software bills of materials for releases or containers.
- Document supported versions and deprecation policy.
- Keep credentials out of code, test data, package metadata, and CI logs.

## Review Questions

Prioritize incorrect biological assumptions, coordinate errors, identifier
mismatches, data loss, biased statistics, nondeterminism, partial-write hazards,
unbounded resource use, privacy leakage, and missing validation before style.

## Completion Record

Before declaring a change ready, record the behavior changed, the scientific
invariant protected, the checks actually run and their results, unavailable
environments, and any migration or reproducibility impact. Do not report an
unrun command as passing or infer correctness from plausible-looking output.
