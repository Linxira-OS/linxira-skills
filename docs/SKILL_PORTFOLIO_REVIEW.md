# Skill Portfolio Review

## Packaged Profiles

`core` contains 10 broadly reusable and actionable first-party skills. Domain,
vendor, browser, GPU, and WSL-specific content is not forced into every project.

`bioinformatics-core` adds 10 domain skills for analysis routing,
reproducibility, bulk RNA-seq, and HPC handoff.

`research-communication-core` adds four delivery skills for manuscript
structure, reference formatting, scientific figures/tables, and academic slide
decks.

## Consolidated Skills

| Removed skill | Disposition |
| --- | --- |
| `scientific-change-verification` | Unique regression-fixture and completion-record guidance merged into `scientific-software-engineering`. |
| `linux-session-persistence` | Useful tmux/disconnect guidance merged into `linux-remote-access`; scheduler boundaries remain in `hpc-bioinformatics-operations`. |

## Retained But Not Packaged

| Skill | Reason |
| --- | --- |
| `scientific-ai` | Needs narrower action gates and a validated execution profile. |
| `linux-gpu-compute` | Requires vendor and hardware-specific validation. |
| `linux-wsl` | Useful only for Windows/WSL projects; retained after text repair for a future optional profile. |
| `google-cloud-vertex` | Contract exists, but no concrete connector implementation is packaged. |
| `google-workspace-oauth` | Requires an implemented consent/token/export lifecycle. |
| `research-web` | Public evidence and logged-in browser behavior need separate runtime-validated profiles. |

The previous `life-sciences-core` and `html-reporting-core` upstream-body
profiles are also retained as review records but excluded from payload
generation. Re-entry requires corrected or adapted bodies and executable tests.

## Rule

A skill enters an approved profile only when it owns a distinct task contract,
has a concrete trigger and non-goal, produces verifiable artifacts, and is more
useful than routing to an existing skill. Repository presence or upstream skill
count is not an inclusion reason.
