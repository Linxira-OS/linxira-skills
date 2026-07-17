# Biology Research Core Review

> Status: approved first-party profile for biological research from question
> formation through evidence synthesis, experimental design, analysis, and
> manuscript preparation.

## Decision

`biology-research-core` extends `bioinformatics-core`. It preserves the existing
computational biology path and adds first-party capabilities for research ideas,
literature evidence, experimental design, statistics, wet-lab planning, citation
handling, figures, and manuscript structure.

| Stage | Exact leaf | Boundary |
| --- | --- | --- |
| Question formation | `biological-research-ideation` | Separates observations, gaps, assumptions, and speculation; requires competing falsifiable hypotheses. |
| Search | `life-science-literature-search` | Produces reproducible source strategies and query logs; external actions require `research-web`. |
| Collection | `literature-screening-and-extraction` | Deduplicates, freezes eligibility criteria, preserves disagreements, and extracts study data. |
| Synthesis | `biological-evidence-synthesis` | Assesses validity, bias, heterogeneity, certainty, and conflicting evidence before any pooling. |
| Study design | `biological-experimental-design` | Defines units, biological replication, controls, allocation, blinding, blocking, and batch structure. |
| Statistics | `biological-study-statistics` | Defines estimands, endpoints, power assumptions, models, missingness, multiplicity, diagnostics, and sensitivities. |
| Wet-lab planning | `wet-lab-experiment-planning` | Organizes authorized current SOPs, approvals, hazards, provenance, checkpoints, deviations, and closeout. |

The profile also installs `research-web` and the complete 11-skill academic
delivery set for manuscript structure, citations, figures, evidence-bound
images, DOCX, LaTeX, PPTX, and rendered-artifact validation. It does not
duplicate those contracts inside biology-specific leaves.

## Routing

The profile uses the standard three-level tree:

```text
research router
  -> discovery or life-sciences index
    -> one exact biological research leaf
```

The discovery index owns ideation, search, screening, and synthesis. The
life-sciences index owns study design, statistical planning, wet-lab planning,
and bioinformatics analysis. Delivery and web actions remain under their shared
top-level routers.

## Safety Boundary

`wet-lab-experiment-planning` has `load_policy: required` and the `biosafety`
risk tag. It is planning-only: it cannot create a missing SOP, authorize work,
replace institutional review, or optimize pathogens, toxins, regulated agents,
or dangerous procedures. Work stops when approvals, training, containment,
waste handling, or an authoritative current SOP cannot be verified.

Human-subject, clinical, animal-welfare, environmental-release, and other
regulated studies still require the responsible institution and qualified
reviewers. The profile provides decision support and records, not approval.

## Evidence Boundary

Search rank is not evidence strength. Records remain separate from screening
decisions; screening remains separate from synthesis; and synthesis may pool
results only when estimands, units, designs, and effect measures are coherent.
Claims must retain source and uncertainty through manuscript preparation.

All eligible papers receive equal baseline treatment. Language, nationality,
institution, country, and study location are coverage or applicability fields,
not automatic credibility weights. `BIOLOGICAL_EVIDENCE_ACCEPTANCE_POLICY.md`
defines claim-level citation checks and the versioned evidence required for any
future paper-, author-, or institution-specific source action.

## Validation

Release requires:

- all first-party metadata and `biosafety` policy validation;
- profile materialization with complete discovery and life-sciences routes;
- no dangling route references;
- install, status, update, and uninstall lifecycle checks;
- packed payload verification with no third-party body or development source.
