# Previous Repository Migration Ledger

## Scope And Evidence

This ledger inventories only the direct donor paths under
`src/skills/` in `extendai-lab-v1`. It is an audit record, not a manifest for
copying skill bodies.

- Donor repository: `openagent-labforge-bio` at
  `254ec96361cc9d21b5bf9f8c471def93e377382c`.
- Donor root: `https://github.com/BOHUYESHAN-APB/openagent-labforge-bio`.
- Donor root license: Apache-2.0.
- The donor worktree contained user-owned untracked files during this audit;
  no donor files were modified.
- A donor root license is not proof that a skill's expression originated with
  the donor. A skill without a per-skill source notice remains provenance
  unresolved and cannot be copied into a public Linxira payload.

The candidate's first addition to the donor history is recorded below. It
identifies the importer and review anchor, not necessarily the original author.
`rewrite` means a future first-party skill may independently implement the
useful capability after its requirements are extracted. It must not copy donor
wording or examples.

## Direct Skill Inventory

| Donor candidate | Donor addition and provenance | License and runtime dependencies | Overlap | Disposition |
| --- | --- | --- | --- | --- |
| `academic-writing/SKILL.md` | `0a01261` (2026-05-20, Tao Han); original source unresolved. | Donor Apache-2.0 only; requires unreviewed academic resource skills, Pandoc, Python packages, LaTeX, Office tooling, and CNKI-related workflows. | Research writing and document pipeline candidates. | Reference only. Split requirements into separately audited research-engineering skills. |
| `agent-browser/SKILL.md` | `67d1493` (2026-05-02, Tao Han); identifies the `vercel-labs/agent-browser` CLI as a dependency, not as the prose source. | Donor Apache-2.0 only; requires the external CLI and contains legacy MCP/PTTY instructions. | Existing runtime `agent-browser` skill; `WEB-001` and `WEB-002`. | Do not migrate. Select one browser contract under `WEB-002`. |
| `ai-slop-remover/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; no external binary declared. | Code-quality guidance and future `research-engineering`. | Rewrite candidate after a specific quality contract is defined. |
| `brainstorming/SKILL.md` | `81e0e99` (2026-06-06, Tao Han); original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | Planning and requirements discovery. | Rewrite candidate; do not copy its Socratic prompt wording. |
| `cnki-citation/scripts/cnki_parser.py` | `6e51e5e` (2026-05-21, Tao Han); no `SKILL.md` or source notice. | Donor Apache-2.0 only; Python and CNKI export assumptions. | Academic citation tooling. | Reject from generic payload. Reconsider only as a separately reviewed regional connector. |
| `code-philosophy/SKILL.md` | `d2b0a75` (2026-04-30, Tao Han); original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | Software-design guidance. | Rewrite candidate only. |
| `code-review/SKILL.md` | `d2b0a75`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | `scientific-software-engineering`; runtime review behavior. | Rewrite candidate with scientific evidence and test expectations. |
| `codemap.md` | `67d1493`; donor package-layout note, not a runtime skill. | Donor Apache-2.0 only; tied to the donor's plugin layout. | None. | Reject. It documents the retired architecture. |
| `codemap/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; optional Node helper scripts. | Existing runtime `codemap` skill. | Do not migrate. Keep the runtime-provided skill separate from package payload policy. |
| `dev-browser/SKILL.md` | `67d1493`; names `SawyerHood/dev-browser` as a binary dependency, not as prose provenance. | Donor Apache-2.0 only; Node server, extension, persistent browser state. | `WEB-001`, `WEB-002`, and browser skills. | Reject. Legacy server and account-state assumptions are not cross-runtime safe. |
| `document-formatting/SKILL.md` | `ca49f0a` (2026-05-17, Tao Han); original source unresolved. | Donor Apache-2.0 only; local Python scripts, python-docx, and a Chinese thesis template. | Research-writing and document skills. | Reference only. Do not generalize a local template into a public standard. |
| `frontend-philosophy/SKILL.md` | `d2b0a75`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | UI guidance and future HTML profile. | Rewrite candidate only after `html-anything` review. |
| `frontend-ui-ux/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | UI guidance and future HTML profile. | Rewrite candidate only after `html-anything` review. |
| `git-master/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; Git CLI and legacy task API. | Repository workflow guidance. | Reject. Its mandatory multi-commit and history-rewrite policy conflicts with this repository's explicit Git rules. |
| `karpathy-guidelines/SKILL.md` | `86ae037` (2026-05-04, Tao Han); declares `https://github.com/vtroisWhite/andrej-karpathy-skills`. | The donor frontmatter says MIT, but the cited upstream GitHub API currently reports no repository license. | Installed runtime skill of the same name. | Blocked. Do not copy until an upstream license is verified or write a new first-party equivalent. |
| `plan-protocol/SKILL.md` | `d2b0a75`; original source unresolved. | Donor Apache-2.0 only; relies on donor-specific `ref:delegation-id` references. | Persistent plans and work queue. | Rewrite candidate with repository-neutral evidence references. |
| `plan-review/SKILL.md` | `d2b0a75`; original source unresolved. | Donor Apache-2.0 only; relies on donor-specific citation conventions. | Plan review process. | Rewrite candidate with repository-neutral evidence references. |
| `playwright-cli/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; external `playwright-cli` binary. | Browser skills and `WEB-002`. | Defer to `WEB-002`; do not package before dependency and isolation review. |
| `playwright/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; requires the donor's `browser_puppeteer` MCP server. | Browser skills and `WEB-002`. | Reject. The MCP contract is runtime-specific and absent here. |
| `receiving-code-review/SKILL.md` | `81e0e99`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | Code-review workflow. | Rewrite candidate with explicit verification rather than compliance language. |
| `review-work/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; requires five named background agents and GitHub/Slack/Notion context. | Review workflow. | Reject. Incompatible orchestration and external-context assumptions. |
| `simplify/SKILL.md` | `67d1493`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | Existing runtime `simplify` skill. | Do not migrate. Keep the runtime-provided skill separate from the payload. |
| `systematic-debugging/SKILL.md` | `81e0e99`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | `scientific-software-engineering`. | Rewrite candidate with reproducibility and evidence requirements. |
| `team-mode/SKILL.md` | `697c59c` (2026-05-30, Tao Han); original source unresolved. | Donor Apache-2.0 only; requires donor `team_mode` configuration and parallel-agent runtime. | Coordination behavior. | Reject. It is a donor-specific runtime feature. |
| `test-driven-development/SKILL.md` | `81e0e99`; original source unresolved. | Donor Apache-2.0 only; no external dependency declared. | `scientific-software-engineering`. | Rewrite candidate with language- and domain-aware fixture expectations. |

## Outcome

No donor skill body is approved for inclusion in a Linxira npm payload. The
useful engineering concepts are tracked by `MIG-002` as independent
first-party rewrite candidates: requirements discovery, plan review, code
review, review-feedback handling, evidence-first debugging, test-first
implementation, and simplification. Browser capability selection remains
under `WEB-002`; academic and document capabilities remain under `MIG-003` and
`ENG-001`.

## Validation

The inventory was generated from the donor's direct directory listing,
frontmatter-only reads, source-reference searches, and Git first-add history at
the donor revision above. `git -C <donor> status --short` confirmed that this
audit did not alter the donor; its two pre-existing untracked files remained.
