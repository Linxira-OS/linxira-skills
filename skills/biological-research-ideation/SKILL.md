---
name: biological-research-ideation
description: Use to turn biological observations and evidence gaps into competing falsifiable hypotheses, predictions, and discriminating studies; not for literature retrieval or protocol execution.
skill_class: workflow
load_policy: conditional
risk_tags: [biosafety, controlled-data]
---

# Biological Research Ideation

Develop testable explanations without presenting plausible stories as evidence.
Keep observations, gaps, assumptions, and speculation visibly separate.

## Intake

Establish before ideating:

- The biological system, scale, context, and phenomenon of interest.
- The observed result, including comparator, measurement, uncertainty, and source.
- What is established directly versus inferred from prior work.
- The unresolved question and why resolving it would matter.
- Practical constraints on models, samples, measurements, time, and expertise.
- Any prohibited directions, ethical boundaries, or controlled-data constraints.

If the prompt contains only a topic, ask for a concrete observation or decision
that the proposed work should explain.

## Evidence Status

Create four separate lists:

1. **Observations**: measurements or documented facts with provenance.
2. **Evidence gaps**: missing comparisons, mechanisms, contexts, or replications.
3. **Assumptions**: premises needed for interpretation but not yet verified.
4. **Speculation**: possible explanations not directly supported by the inputs.

Do not move an item between these lists without stating the evidence that
justifies the change. Mark contradictions and ambiguous measurements explicitly.

## Generate Competing Hypotheses

Produce at least two materially different explanations when the evidence permits.
Include a null, measurement, or context-dependent explanation when credible.

For each hypothesis, record:

- A precise causal or associative claim.
- The biological entities, direction, context, and expected timescale.
- Assumptions required for the claim to hold.
- Existing observations it explains and observations it does not explain.
- A plausible alternative mechanism that could mimic the same pattern.
- A result that would count against or falsify the hypothesis.

Avoid hypotheses that merely rename the observation or can accommodate every
possible outcome.

## Derive Predictions

For every hypothesis, derive predictions before proposing experiments:

| Field | Required content |
| --- | --- |
| Manipulation or contrast | What differs between conditions |
| Observable | What is measured and at what level |
| Direction or pattern | Expected change, ordering, or interaction |
| Boundary condition | Context where the prediction should fail |
| Time relation | Expected temporal order when relevant |
| Falsifier | Outcome inconsistent with the hypothesis |

Label predictions as unique, shared, or weakly distinguishing across hypotheses.

## Select Discriminating Tests

Prefer tests for which competing hypotheses predict different outcomes. For each
candidate test:

- Map every possible major result to its interpretation under each hypothesis.
- Identify positive, negative, vehicle, baseline, and measurement controls.
- Check whether perturbation specificity or model validity limits inference.
- State the experimental unit and major nuisance variables.
- Identify the smallest pilot that tests feasibility without claiming efficacy.
- Rank information gain, feasibility, interpretability, and ethical burden.

Route detailed study construction to `biological-experimental-design`, statistical
planning to `biological-study-statistics`, and bench logistics to
`wet-lab-experiment-planning`.

## Artifacts

Deliver:

- An evidence-status table separating observations, gaps, assumptions, and speculation.
- A hypothesis matrix with mechanisms, falsifiers, and competing explanations.
- A prediction matrix showing shared and discriminating outcomes.
- A ranked test portfolio with rationale and key dependencies.
- A short list of evidence that would most change the ranking.

## Non-Goals And Safety

- Do not invent citations, preliminary data, mechanisms, or effect sizes.
- Do not present a hypothesis as established knowledge.
- Do not optimize pathogen, toxin, regulated-agent, or dangerous procedures.
- Do not make clinical, diagnostic, or treatment recommendations.
- Do not substitute ideation for ethics review, biosafety review, or domain oversight.

## Completion Criteria

Complete only when observations and speculation are distinct, multiple plausible
hypotheses have falsifiers, predictions are explicit, at least one test can
discriminate among hypotheses, assumptions and constraints are visible, and the
remaining evidence gaps are prioritized.

## Design Influence

This is a clean-room first-party implementation informed by the research
workflow review of `Light0305/Light-skills` at revision
`6b44f57d1274eb38a6c79dc29c2d21e5e0a225a9`. No upstream body, script,
template, threshold, or ranking rubric is copied. The implementation replaces
conference-oriented novelty scoring with biological falsifiability, competing
mechanisms, safety boundaries, and explicit evidence status.
