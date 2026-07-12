# Persistent Work Queue

## Purpose

This file is the durable task ledger for work that spans agent sessions and
context compaction. Update it when starting, completing, blocking, cancelling,
or materially redefining a task. Do not infer completion from discussion alone.

Status values:

- `active`: the one task currently being worked on.
- `planned`: accepted work that has not started.
- `blocked`: work with a concrete unresolved dependency.
- `done`: verified work with its outcome recorded here or in the linked file.
- `cancelled`: no longer part of the plan.

## Current Focus

| ID | Status | Task | Completion evidence |
| --- | --- | --- | --- |
| `MIG-001` | done | Inventory useful skills from the previous `extendai-lab-v1` repository without modifying that repository. | `MIGRATION_LEDGER.md` inventories all 25 direct candidates at donor revision `254ec96361cc9d21b5bf9f8c471def93e377382c`; no donor body is approved for copying. |
| `PKG-001` | blocked | Implement the npm CLI initializer described in `INSTALLATION_ARCHITECTURE.md`. | Local Node 24 fixtures pass `init`, `status`, `update`, and `uninstall`; `.github/workflows/cli-validation.yml` defines the required Windows, Linux, and macOS matrix. A pushed workflow run must pass before completion. |
| `PKG-002` | done | Define the first redistributable `core` payload and npm release manifest. | `payload/` is generated from the 14 audited first-party skills; `npm pack --dry-run` reports only approved payload files, template, README, license, and CLI. |

Only one item may be `active`. Move the next item to `active` before beginning
work and update its row before ending a session.

## Skill Migration

### Previous Repository Donor

The previous repository at
`D:\-Users-\Documents\GitHub\chat-model\openagent-labforge\Future\extendai-lab-v1`
is a donor for useful skill content only. Do not modify it and do not reuse its
plugin architecture, tool wiring, package layout, or runtime assumptions as a
dependency of this project.

| ID | Status | Candidate group | Required review | Next action |
| --- | --- | --- | --- | --- |
| `MIG-002` | planned | First-party rewrites for useful direct engineering concepts: requirements discovery, plan review, code review, review-feedback handling, debugging, test-first implementation, and simplification. | Independent expression, token cost, overlap with `scientific-software-engineering`, and cross-runtime assumptions are reviewed. | Extract a small requirements-only first batch from `MIGRATION_LEDGER.md`; do not copy donor bodies. |
| `MIG-003` | planned | Paper and research-writing candidates: `academic-writing`, `document-formatting`, and academic resource skills. | Original source, license, document tool dependencies, citation/integrity contract, and overlap with Nature/Open Science candidates. | Identify original repositories before copying any body. |
| `MIG-004` | planned | Browser candidates: `agent-browser`, `playwright`, `playwright-cli`, and `dev-browser`. | Original repository, binary/MCP dependency, browser profile isolation, account and upload policy, and overlap with `research-web`. | Select one isolated automation path and one opt-in logged-in browser path. |
| `MIG-005` | planned | UI and presentation skills: `frontend-ui-ux`, `frontend-philosophy`, `ai-slop-remover`, and slide/document helpers. | License, design-system scope, runtime assets, and overlap with `html-anything`. | Keep only skills with distinct reusable value. |
| `MIG-006` | blocked | `karpathy-guidelines` migration. | Donor frontmatter claims MIT, but its cited upstream currently reports no repository license. | Obtain an explicit reusable license or write a new first-party equivalent without copied expression. |

## Source Tracks And Profiles

| ID | Status | Task | Completion evidence |
| --- | --- | --- | --- |
| `SRC-001` | done | Preserve `bioSkills`, `awesome-bio-agent-skills`, and `html-anything` as Git submodules with source revisions and sync reporting. | `scripts/sync-source-tracks.ps1` reports all three tracks and source worktrees are clean. |
| `SRC-002` | done | Build a generated descriptor catalog for all source tracks. | `catalog/source-skills.json` has 2,348 unique records across all three pinned revisions, with frontmatter summaries, license evidence, risk arrays, and SHA-256 body hashes. |
| `SRC-003` | done | Review the first `life-sciences-core` profile. | `profiles/life-sciences-core.json` pins four MIT `bioSkills` bodies and hashes; `LIFE_SCIENCES_CORE_REVIEW.md` records scientific limits and safe smoke tests. |
| `SRC-004` | planned | Define the `html-anything` materialization profile. | Review its 81 skills and 22 externally cited entries; publish only entries with acceptable provenance and license state. |
| `SRC-005` | planned | Establish discipline-pack expansion order after life sciences. | Each future discipline has a scope, source registry, capability matrix, and non-overlap boundary with horizontal packages. |

`awesome-bio-agent-skills` and unreviewed `html-anything` entries remain local
research/index sources. They must not enter a public npm payload merely because
they are present in this repository.

## Runtime And Packaging

| ID | Status | Task | Completion evidence |
| --- | --- | --- | --- |
| `PKG-003` | done | Define cross-runtime materialization under `.agents/skills/`. | `INSTALLATION_ARCHITECTURE.md` records OpenCode/Codex discovery, marker updates, ownership manifest, profiles, and safe update behavior. |
| `PKG-004` | done | Create the CLI skeleton and marker-block updater. | Node fixture tests prove marker upsert/remove preserve user text outside Linxira markers and malformed markers are rejected. |
| `PKG-005` | done | Implement profile materialization and ownership manifest. | The initializer generates `core` from 14 audited first-party skills, records directory hashes in `.linxira/manifest.json`, and rejects same-named user directories. |
| `PKG-006` | done | Implement status, update, uninstall, and dry-run behavior. | Fixture tests prove divergence is reported, `--force` is required to replace it, and uninstall preserves unrelated `AGENTS.md` and `.agents` content. |
| `PKG-007` | planned | Build and publish the first npm package. | Package-content check, clean install/update/uninstall smoke tests, versioned changelog, and npm provenance records pass. |
| `PKG-008` | planned | Materialize the reviewed `life-sciences-core` profile. | Payload copies only the four hash-pinned MIT `bioSkills` bodies, includes the required notice, and fixture tests prove profile selection and ownership behavior. |

## Horizontal Capability Packages

| ID | Status | Task | Completion evidence |
| --- | --- | --- | --- |
| `LIN-001` | done | Draft first-party Linux, WSL, SSH, transfer, GPU, storage/networking, and troubleshooting skills. | 14 first-party skills have audited loading metadata; Linux scope is documented in `LINUX_PACKAGE.md`. |
| `LIN-002` | planned | Add executable Linux verification fixtures and distribution adapters. | Debian/Ubuntu and Arch-family fixtures verify dispatch, safe commands, and expected failure handling. |
| `WEB-001` | planned | Define `research-web` browser modes. | Isolated automation, opted-in logged-in browser, cloud browser, and prohibited anti-bot/account behaviors each have explicit contracts. |
| `WEB-002` | planned | Review and select browser runtime dependencies. | One browser automation implementation passes security, profile isolation, file upload, download, and human-handoff checks. |
| `CLOUD-001` | planned | Define `compute-cloud` provider, SSH, HPC, and cost-control contracts. | Remote creation, billing, credential, data transfer, and teardown gates are specified and testable. |
| `AI-001` | planned | Define `scientific-ai` model training and evaluation capability boundaries. | GPU/vendor skill selection and evaluation artifact/provenance requirements are recorded. |
| `ENG-001` | planned | Build `research-engineering` profiles for reproducibility, software quality, paper writing, figures, and reports. | Reviewed skill set has clear inputs, outputs, evidence checks, and package dependencies. |

## Platform And Service Connectors

| ID | Status | Task | Completion evidence |
| --- | --- | --- | --- |
| `CON-001` | planned | Add a public AlphaFold DB retrieval profile. | UniProt accession to AFDB metadata, mmCIF/PAE artifact manifest, pLDDT/PAE interpretation, rate-limit behavior, and provenance are tested. |
| `CON-002` | blocked | Add AlphaFold Server or AlphaFold 3 execution support. | Use an official documented programmatic interface or a user-approved interactive workflow; do not automate unsupported account or browser flows. |
| `CON-003` | planned | Define Google Drive, Docs, and Slides OAuth connector contract. | Minimum scopes, consent flow, target identity, write/readback verification, export/download disclosure, and token storage are specified. |
| `CON-004` | planned | Define Google Cloud or Vertex compute connector contract. | Project, region, billing, quota, cost estimate, data destination, launch confirmation, and cleanup/termination gates are specified. |
| `CON-005` | planned | Add public life-science database connector profiles. | UniProt, PDB, and related API skills use documented APIs, cache/provenance records, and rate-limit/error handling. |

Google Docs and Slides examples in `openai/plugins` are Codex-runtime references,
not drop-in OpenCode or generic agent integrations. AlphaFold DB retrieval is
already available as an upstream source skill; it is not yet a packaged runtime
connector. Browser automation is not a substitute for a documented API or OAuth
connector.

## Session Close Checklist

Before ending substantial work:

1. Update the row for the task that was `active`.
2. Add newly discovered work as `planned` or `blocked` with a concrete reason.
3. Record validation commands and resulting revisions in the relevant document.
4. Commit a coherent verified change set; do not let unrelated work accumulate.
5. Leave the next task marked `active` only when work is truly continuing in the
   same session. Otherwise set it to `planned`.
