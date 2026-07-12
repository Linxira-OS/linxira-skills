# Research Engineering First Batch

## Decision

`scientific-change-verification` is a first-party guard for the change cycle
around scientific software. It was written independently from the migration
requirements in `MIGRATION_LEDGER.md`; no donor wording, examples, helper
scripts, or runtime assumptions were copied.

It complements `scientific-software-engineering` rather than replacing it:

- `scientific-software-engineering` defines domain contracts, data integrity,
  reproducibility, and software-quality expectations.
- `scientific-change-verification` defines how a concrete bug, feature,
  review finding, or completion claim is turned into evidence and verified.

## Scope

The skill is conditional and applies to scientific or research software changes
with a concrete artifact or behavior. It requires a minimal reproducer or
synthetic fixture, a stated invariant, limited scope, proportionate testing,
and an honest completion record. It does not govern remote execution,
credentials, controlled-data disclosure, clinical claims, or destructive
operations; those retain their own action gates.

## Validation

The first-party audit validates its frontmatter class, loading policy, and risk
tags. The generated package payload includes it in `core`, so profile lifecycle
tests cover its materialization through every published profile.

## Deferred Concepts

Planning, code review, review-feedback handling, debugging, test-first
implementation, and simplification are represented here as one coherent
change-verification guard. Separate skills are deferred until a concrete task
needs a distinct tool contract or workflow that this guard cannot express.
