---
name: biological-experimental-design
description: Use to design biological studies with explicit units, replication, controls, allocation, blocking, and confounding checks; not for bench protocols or statistical test selection.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, clinical, controlled-data]
---

# Biological Experimental Design

Design the study so the comparison, unit of inference, and sources of variation
are explicit before data collection begins.

## Intake

Establish:

- The biological question, competing hypotheses, and decision to be informed.
- Target population or system and the scope of generalization.
- Manipulations, exposures, comparators, outcomes, and measurement times.
- Available organisms, samples, instruments, plates, batches, sites, and operators.
- Ethical, biosafety, cost, throughput, and scheduling constraints.
- Feasibility evidence and major expected sources of variation.

Route hypothesis development to `biological-research-ideation`, analysis planning
to `biological-study-statistics`, and bench logistics to
`wet-lab-experiment-planning`.

## Define Units And Replication

Name each unit explicitly:

- **Experimental unit**: the smallest unit independently assigned to a condition.
- **Observational unit**: the unit on which a measurement is recorded.
- **Analysis unit**: the unit represented as independent in the model.
- **Biological replicate**: an independent biological unit supporting inference.
- **Technical replicate**: repeated processing or measurement of the same unit.

State the number at every level. Technical replicates estimate measurement
variation and do not increase biological sample size. Aggregate or model nested
measurements appropriately; never relabel wells or cells as independent organisms.

## Specify Conditions And Controls

Use controls that address the actual inferential threats:

- Negative, untreated, vehicle, sham, or baseline controls as appropriate.
- Positive controls to establish system and assay responsiveness.
- Process controls for extraction, handling, contamination, and measurement.
- Reference or calibration materials for cross-run comparability.
- Manipulation-specific controls for delivery, specificity, and off-target effects.

Define what each control diagnoses and how its failure affects interpretation.

## Allocate Units

- Randomize eligible experimental units using a reproducible allocation method.
- Conceal upcoming allocation where selection or enrollment could be influenced.
- Blind operators, assessors, and analysts when feasible; document exceptions.
- Block on strong nuisance variables such as litter, donor, site, day, or instrument.
- Balance treatment positions across plates, rows, columns, batches, and run order.
- Separate biological condition from operator, day, batch, plate, and instrument.
- Preserve the allocation seed, constraints, and final assignment table.

Do not call deterministic alternation randomization. Do not make treatment perfectly
coincide with a batch or plate region.

## Match Design To Constraints

For factorial designs, identify factors, levels, interactions, and combinations
that are scientifically interpretable. Do not omit interactions needed to answer
the question.

For split-plot or multistage assignment, identify the hard-to-change whole-plot
factor, whole-plot unit, subplot factor, and correct error strata. For repeated
measures, identify subject, time structure, carryover, and within-unit dependence.

Use crossover, matched, nested, cluster, or incomplete-block designs only when
their assumptions and analysis consequences are documented.

## Confounding And Pseudoreplication Audit

Build a table crossing condition with donor, sex where relevant, age or stage,
site, operator, day, batch, plate, instrument, position, and run order.

Check for:

- A factor level appearing in only one condition.
- One biological source contributing all replicates for a condition.
- Shared controls reused as though independent across experiments.
- Repeated measurements counted as independent replication.
- Plate, cage, litter, field, or culture effects ignored in the analysis unit.
- Factor combinations that cannot estimate main effects or interactions separately.

Redesign before collection when a key effect is aliased with a nuisance factor.

## Design Artifacts

Deliver:

- A design synopsis connecting question, hypothesis, contrast, and outcome.
- A unit hierarchy and replication table.
- Condition and control matrix with control-failure interpretation.
- Randomization, blinding, blocking, batch, and plate-allocation plan.
- Factorial or split-plot structure where applicable.
- Confounding and pseudoreplication audit.
- Data-layout template and handoff assumptions for statistical planning.

## Non-Goals And Safety

- Do not provide an executable wet-lab protocol or optimize dangerous procedures.
- Do not choose a statistical test solely from the outcome's data type.
- Do not increase apparent sample size by treating dependent observations as independent.
- Do not ignore institutional approvals, welfare constraints, or biosafety requirements.

## Completion Criteria

Complete only when the experimental, observational, and analysis units agree with
the intended inference; biological and technical replication are distinct;
controls have diagnostic purposes; allocation, blinding, blocking, batch, and
plate handling are specified; and confounding and pseudoreplication checks pass.

## Design Influence

This is a clean-room first-party implementation informed by the planning review
of `Light0305/Light-skills` at revision
`6b44f57d1274eb38a6c79dc29c2d21e5e0a225a9` and by the repository's pinned
life-science source audits. No upstream body, script, template, or fixed scoring
rule is copied. The implementation adds biological unit hierarchies, controls,
allocation, plate and batch structure, pseudoreplication checks, and biosafety
handoff as Linxira-owned behavior.
