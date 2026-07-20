# Skill Loading Policy

## Goal

Skills are procedural context, not a replacement for a capable model's general
reasoning. The runtime must preserve token budget for the task while loading
instructions before an external action, a reproducibility obligation, or a
strict tool contract can be violated.

The policy applies to first-party skills directly. Upstream source tracks remain
unchanged; the plugin derives equivalent descriptors from their frontmatter and
track metadata without rewriting their files.

## Progressive Disclosure

1. Build a descriptor index from frontmatter and source metadata only. Do not
   read every `SKILL.md` body to answer a broad request.
2. Route using stable identity, compact summary, class, loading policy, risk
   tags, source state, and task environment.
3. Read one selected skill body when its policy and trigger require it. Read
   supporting files only when the selected body explicitly needs them.
4. Record the selected identity and source revision. Do not retain unrelated
   skill bodies in session context.

The compact descriptor should cap its summary at 240 characters when exposed to
a model. Long upstream descriptions stay available for an explicit detail view;
they are not part of the default routing prompt.

## Skill Metadata

Every first-party `SKILL.md` declares these fields in addition to `name` and
`description`:

| Field | Values | Purpose |
| --- | --- | --- |
| `skill_class` | `reference`, `workflow`, `guard`, `contract` | Distinguishes background knowledge from procedures that constrain execution. |
| `load_policy` | `on-demand`, `conditional`, `required` | States when the body may enter context. |
| `risk_tags` | Approved compact risk list | Enables approval and tool gates without loading the body. |

Approved `risk_tags` are `account-bound`, `biosafety`, `clinical`,
`controlled-data`, `destructive`, `expensive`, `paid`, `privileged`, and
`remote-compute`.

`biosafety` covers planning or action that depends on institutional containment,
training, approvals, controlled SOPs, hazard response, or waste handling. It does
not authorize laboratory execution and must not be collapsed into `clinical`.

`privileged` also applies to chemistry or physics plans that depend on controlled
facilities, restricted apparatus, hazardous materials, export controls, or
specialist operator authorization. A planning skill never grants that access.

`reference` skills explain broadly useful material. `workflow` skills organize
multi-step work. `guard` skills impose evidence, validation, safety, or
reproducibility checks. `contract` skills describe host, tool, file, or remote
system rules that cannot safely be guessed.

## Loading Policies

| Policy | Load body when | Do not load body when |
| --- | --- | --- |
| `on-demand` | The user explicitly requests it or selects its stable identity. | A broad request merely shares general vocabulary. |
| `conditional` | The router has an exact task, environment, or artifact match. | The model can answer from general reasoning without using a tool or making a consequential change. |
| `required` | A matching task is about to invoke a constrained tool, alter external state, handle a tagged risk, or claim a completion contract. | The request is only explanatory and no governed action is being taken. |

`required` never means "inject this skill into every conversation." It is a
precondition for a matched action. The host must not call a governed tool until
the selected contract or guard has been read and its confirmation requirements
are satisfied.

## Model Profiles

| Profile | Intended use | Automatic body loading |
| --- | --- | --- |
| `lean` | Strong model with reliable general reasoning | Only `required` skills at an action/risk gate; `conditional` skills remain indexed until exact tool or artifact routing. |
| `guided` | General-purpose model | `required` skills at gates and one exact-match `conditional` workflow or guard. |
| `strict` | Smaller, less reliable, or tightly controlled model | Same as `guided`, plus the host attaches the selected skill's completion checks before reporting success. |

All profiles receive the same compact descriptors and risk gates. A profile
changes context expansion, not provenance, approval, or safety requirements.
Strong models are not forced to reread generic reference material; weaker models
receive procedural scaffolding only after routing narrows the task.

## Routing Rules

1. Prefer metadata-only routing for explanation, brainstorming, and familiar
   reasoning tasks.
2. Load a `contract` before a tool call whose syntax, host state, credentials,
   or output format matters.
3. Load a `guard` before publication, reproducibility claims, destructive
   changes, privileged operations, controlled-data handling, or remote compute.
4. For overlapping workflows, select one canonical skill by stable identity and
   precedence. Do not concatenate several similar bodies.
5. Explicit user selection can choose another eligible skill, but cannot bypass
   provenance, license, or risk gates.

## Authoring Constraints

- Put trigger scope and non-goals in the description; keep it concrete and
  short enough for a compact index.
- Put mandatory checks near the start of a `guard` or `contract` body.
- Use `on-demand` for material a capable model can normally reconstruct.
- Use `required` only for enforceable action preconditions. Do not use it to
  force a style preference or to inflate a skill's visibility.
- Do not modify upstream source-track frontmatter for this policy. Store derived
  routing state in the plugin index and preserve upstream files byte-for-byte.

`scripts/audit-first-party-skills.ps1` validates the first-party metadata
contract before release packaging.
