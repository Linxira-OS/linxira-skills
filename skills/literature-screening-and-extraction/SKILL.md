---
name: literature-screening-and-extraction
description: Use to deduplicate records, apply frozen eligibility criteria with dual review, log exclusions, and extract structured study data; not for searching or synthesis.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Literature Screening And Extraction

Create an auditable path from retrieved records to a structured evidence set.
Do not change eligibility rules in response to desired findings.

## Intake

Require:

- Search exports with source, search date, and stable record identifiers.
- A protocol or review question with intended evidence scope.
- Draft inclusion and exclusion criteria.
- Reviewer roles, independence expectations, and conflict-of-interest notes.
- Full-text access constraints and allowed data locations.
- Planned synthesis outputs and the variables they require.

Keep source files immutable and work from versioned copies or derived tables.

## Deduplicate

1. Normalize identifiers without overwriting raw values.
2. Match exact DOI, PMID, registry ID, or other stable identifiers first.
3. Match normalized title, authors, year, journal, and pagination second.
4. Flag uncertain pairs for human review rather than merging automatically.
5. Link companion reports, protocols, corrections, preprints, and final articles.
6. Preserve a canonical record plus source membership and duplicate links.

Report counts before and after deduplication and retain a deduplication decision
log with rule or reviewer provenance.

## Freeze Eligibility Criteria

Translate scope into operational rules before screening begins. Define eligible
populations or organisms, contexts, interventions or exposures, comparators,
outcomes, study designs, publication forms, languages, and dates.

- Include examples for known boundary cases.
- Order exclusion reasons so one primary reason is applied consistently.
- Pilot the rules on a mixed sample of records.
- Resolve ambiguities, then freeze and version the criteria.
- Record later amendments with date, rationale, affected stage, and rescreen plan.

Do not silently reinterpret criteria after seeing study results.

## Dual-Review Screening

Use two independent reviewers for title/abstract and full-text screening when the
review standard requires it. Keep decisions blinded between reviewers until both
have submitted.

For each stage:

- Record `include`, `exclude`, or `unclear` plus reviewer and timestamp.
- Advance conflicts and unclear records conservatively.
- Measure agreement descriptively; do not use agreement alone as quality proof.
- Resolve disagreement by discussion against frozen criteria.
- Use a named adjudicator when consensus is not reached.
- Preserve original decisions and the resolution; never overwrite history.

If single screening is unavoidable, label it and document verification sampling
or another mitigation.

## Exclusion Ledger

At full text, retain one primary exclusion reason per excluded report plus notes
needed to audit the decision. Include citation or identifier, stage, reviewer
decisions, final decision, reason-code version, adjudication, and date.

Track unavailable reports separately from ineligible reports. Record retrieval
attempts without implying that missing full text was scientifically ineligible.

## Extraction Schema

Define a data dictionary before full extraction. Include as applicable:

- Study and report identifiers, sites, funding, and conflicts.
- Design, setting, dates, recruitment, eligibility, and attrition.
- Population or organism, sample provenance, baseline characteristics, and context.
- Intervention, exposure, comparator, timing, dose category, and co-interventions.
- Experimental unit, group sizes, analysis populations, and follow-up.
- Outcome definitions, measurement methods, time points, and units.
- Effect estimates, uncertainty, denominators, adjusted covariates, and model details.
- Risk-of-bias facts, protocol deviations, missingness, and author clarifications.

Store verbatim source text or page/table locator beside interpreted values. Define
allowed values, missing-value codes, unit conversions, and derived-field formulas.

## Extraction Workflow

- Pilot the schema on diverse studies and revise before freezing it.
- Extract independently in duplicate or verify a prespecified sample and all key fields.
- Reconcile discrepancies against the source, preserving both entries and resolution.
- Never infer zero from blank, merge time points, or calculate values without flags.
- Link multiple reports from one study to one study identifier.
- Validate ranges, units, denominators, internal consistency, and duplicate outcomes.

## Artifacts

Deliver a deduplicated record set, duplicate map, frozen criteria with amendment
history, reviewer decision table, exclusion ledger, study-report linkage table,
extraction schema, extracted dataset, and reconciliation log.

## Non-Goals And Safety

- Do not conduct new searches or synthesize effect direction in this workflow.
- Do not fabricate inaccessible fields or resolve ambiguity from assumptions.
- Do not expose licensed full text, personal data, or controlled study data.
- Do not let funding source, author identity, or desired conclusion alter eligibility.

## Completion Criteria

Complete only when records are traceably deduplicated, criteria were frozen and
versioned, independent decisions and disagreements remain auditable, every full-
text exclusion has a ledger entry, extracted fields follow a documented schema,
and the final counts reconcile across stages.
