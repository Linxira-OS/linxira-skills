# Discipline Expansion Order

## Decision

After `life-sciences-core`, expansion proceeds by capability dependency rather
than by copying more subject trees first. Horizontal packages must mature before
new discipline packs depend on them.

## Order

1. **`research-engineering`**
   Scope: change verification, manuscript integrity, reproducibility, software
   quality, figures, and reporting contracts that cut across all sciences.
   Why first: every later discipline needs the same evidence, testing,
   provenance, and manuscript rules.

2. **`research-web`**
   Scope: browser evidence capture, logged-in handoff rules, search boundaries,
   downloads, uploads, and account protections.
   Why second: later disciplines need databases, portals, and literature access,
   but those actions must inherit one shared web policy instead of duplicating
   browser guidance per discipline.

3. **`compute-cloud`**
   Scope: remote compute, SSH, transfers, schedulers, cost control, and cloud or
   HPC launch contracts.
   Why third: domain packs that rely on GPU training, remote jobs, or HPC
   clusters should depend on one compute package, not vendor-specific or
   discipline-specific remote logic.

4. **`scientific-ai`**
   Scope: model training, evaluation, inference, experiment tracking, and AI
   artifact governance.
   Why fourth: AI workflows build on engineering, web, and compute boundaries,
   and then become reusable by multiple domains.

5. **Next domain packs**
   Candidate order after life sciences:
   - chemistry and materials
   - earth and environmental sciences
   - physics and photonics
   - clinical and translational extensions only after stronger policy gates

## Non-Overlap Rule

Each discipline pack owns domain reasoning, method selection, source-specific
artifacts, and field terminology. It must not duplicate:

- web account and browser rules from `research-web`
- remote execution and cloud rules from `compute-cloud`
- generic software and manuscript rules from `research-engineering`
- model-training and evaluation rules from `scientific-ai`

When a discipline needs those abilities, it declares them as optional companion
packages or profile dependencies instead of re-bundling their skills.

## Source Intake Rule

New discipline sources enter in this sequence:

1. Register the source and revision in the source catalog.
2. Review license and provenance before reading broadly.
3. Build a small reviewed profile with explicit hashes and notices.
4. Add executable or fixture-based validation where the skill claims a tool or
   external action contract.

No new discipline becomes a public package merely because its source tree is
present locally.
