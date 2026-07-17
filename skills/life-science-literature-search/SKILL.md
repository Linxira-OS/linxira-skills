---
name: life-science-literature-search
description: Use to design and document reproducible life-science literature searches across databases and APIs; not for screening decisions or evidence synthesis.
skill_class: workflow
load_policy: conditional
risk_tags: [controlled-data]
---

# Life Science Literature Search

Build a reproducible search that can be rerun, audited, and updated. Separate
search design from screening and interpretation.

## Intake

Define:

- The research question and intended use of the search.
- Population, organism, system, exposure or intervention, comparator, outcome,
  and study design where applicable.
- Date range, languages, publication types, and geographic constraints.
- Whether preprints, conference records, theses, registries, datasets, patents,
  or grey literature are in scope.
- Known sentinel papers, terminology variants, and likely indexing delays.
- Required recall, acceptable precision, deadline, and update horizon.

Record unresolved scope choices before constructing queries.

## Source Plan

Choose sources based on disciplinary coverage rather than convenience. Consider
biomedical, multidisciplinary, organism-specific, sequence, trial, preprint, and
grey-literature sources as the question requires.

For each source record:

- Database or service name and platform.
- Coverage relevant to the question.
- Controlled vocabulary and indexing behavior.
- API, export, or browser access method.
- Access date and database update date when shown.
- Subscription, result-limit, rate-limit, or reproducibility constraints.

Do not claim comprehensive coverage from a single database without justification.

## Neutral Source Treatment

Start every eligible record with the same prior weight. Do not adjust credibility
because of publication language, author nationality, institution, country, or
study location. Record those fields for coverage, applicability, and heterogeneity
analysis, not as automatic quality scores.

Evaluate each paper later from its own publication status, design, experimental
unit, controls, sample support, bias, reporting completeness, data and code
availability, preregistration, conflicts, and independent replication. Search rank,
journal prestige, citation count, and database membership are not acceptance votes.

## Concept And Vocabulary Map

Create concept blocks before writing database syntax:

1. Core biological entities or populations.
2. Intervention, exposure, mechanism, or phenomenon.
3. Outcomes or measurements only when they improve retrieval appropriately.
4. Study-design terms only when the scope requires them.

For each block include synonyms, former names, gene and protein symbols, spelling
variants, abbreviations, taxonomic terms, and controlled-vocabulary headings.
Check ambiguous symbols for high-volume unrelated meanings.

## Query Development

- Combine synonyms within a concept using `OR`.
- Combine distinct required concepts using `AND`.
- Use controlled vocabulary and free text together.
- Apply field tags, phrase searching, proximity, truncation, and filters only
  after checking platform-specific behavior.
- Test whether sentinel papers are retrieved and diagnose failures.
- Sample irrelevant records to identify avoidable ambiguity.
- Preserve exact executable syntax for every platform; do not silently translate.

Peer-review important strategies when resources permit. Explain any validated
search filter and cite its source rather than reconstructing it from memory.

## Network And Browser Gate

Before any network request, database API call, browser navigation, download, or
web extraction, load and follow `research-web`. This skill defines search logic;
`research-web` governs external access, accounts, downloads, and provenance.

Prefer documented APIs or official exports. Respect terms, credentials, quotas,
robots guidance, and database licensing. Never embed API keys in the query log.

## Query Log

Maintain one row per executed search:

| Field | Required value |
| --- | --- |
| Source and platform | Exact database endpoint |
| Search date | ISO date and timezone if material |
| Coverage date | Database coverage or last update if available |
| Query | Exact submitted syntax |
| Limits | All filters and defaults |
| Results | Returned count before deduplication |
| Method | UI, API endpoint, package, or export format |
| Version | API, package, vocabulary, or strategy version |

Preserve returned identifiers and export checksums where practical.

## Coverage And Update Strategy

- Compare source overlap and unique yield after deduplication.
- Document unsearched sources, inaccessible content, language limits, and index lag.
- Use citation chasing or related-record searches only as labeled supplements.
- Define the rerun cadence, alert mechanism, end date, and merge procedure.
- Store the last search date so updates can distinguish new from changed records.

## Artifacts

Deliver the scoped question, source rationale, vocabulary map, exact strategies,
query log, export manifest, coverage limitations, and update plan. Pass records
to `literature-screening-and-extraction` without making eligibility decisions.

## Non-Goals And Safety

- Do not fabricate records, identifiers, result counts, access dates, or coverage.
- Do not bypass paywalls, access controls, API limits, or account restrictions.
- Do not treat search rank as study quality or evidence strength.
- Do not exclude or down-weight a record solely by language, nationality,
  institution, country, or study location.
- Do not expose controlled, personal, or unpublished query content externally.

## Completion Criteria

Complete only when the question and scope are explicit, source coverage is
justified, controlled vocabulary and free text are represented, every executed
query has a date and reproducible log, API or browser actions followed
`research-web`, limitations are stated, and an update strategy exists.

## Design Influence

This is a clean-room first-party implementation informed by the source review
of `Light0305/Light-skills` at revision
`6b44f57d1274eb38a6c79dc29c2d21e5e0a225a9`. No upstream body, script,
template, or borrowed query code is copied. The implementation keeps only
general reproducibility concepts and supplies Linxira-native source, privacy,
screening-handoff, and external-action contracts.
