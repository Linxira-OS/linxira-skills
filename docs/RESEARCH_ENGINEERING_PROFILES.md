# Research Engineering Profiles

## Decision

`research-engineering` is the first horizontal package after life sciences. Its
job is to compose already-audited first-party guards and approved reporting
layouts into reusable working sets without duplicating web, cloud, or domain
logic.

## Profile Family

### `research-engineering-core`

Purpose: day-to-day scientific software work with evidence, reproducibility, and
manuscript integrity.

Uses existing first-party skills already in `core`:

- `scientific-software-engineering`
- `scientific-change-verification`
- `research-manuscript-integrity`
- `bioinformatics-reproducibility`

This profile is conceptually identical to the relevant `core` subset today, so
it does not need a separate packaged payload yet.

### `research-reporting`

Purpose: turn validated results into local reports and documentation.

Composition:

- `research-engineering-core`
- `html-reporting-core`

Use when the output is an HTML dashboard, data report, or documentation page
backed by already-verified evidence.

### `life-sciences-reporting`

Purpose: life-science analysis plus reviewed HTML reporting.

Composition:

- `life-sciences-core`
- `html-reporting-core`

Use when the domain reasoning comes from approved bio skills and the output is a
reviewed HTML report surface.

## Non-Overlap Rule

- `research-engineering` owns evidence, change verification, manuscript
  integrity, and report packaging.
- `research-web` owns browser, account, upload, download, and web evidence
  constraints.
- `compute-cloud` owns remote execution and cost control.
- discipline packs own domain methods and source-specific artifacts.

## Packaging Implication

Do not add a new npm payload merely to rename skills that are already present in
`core`. A dedicated `research-engineering` packaged profile only becomes useful
when it selects a materially different subset, introduces reviewed non-core
skills, or needs a distinct installer contract.
