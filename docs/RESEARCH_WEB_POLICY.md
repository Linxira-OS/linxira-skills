# Research Web Policy

## Decision

Browser capability is split into two modes and governed by the first-party
`research-web` contract. `agent-browser` remains a valid OpenCode-compatible
candidate, but it is not the preferred path in the current Web UI because the
session does not reliably pass its interactive state and follow-up information
between turns.

| Mode | Intended use | Account state | Current status |
| --- | --- | --- | --- |
| Isolated automation | Public, read-only research checks, explicitly allowed metadata extraction, and screenshots. | Fresh profile with no saved state. | Defined; runtime validation deferred to an external environment. |
| User-approved logged-in browser | A named account and explicitly approved site action. | User authenticates directly in a separate profile. | Defined; requires per-action confirmation for external writes. |
| Cloud browser | Remote disposable browser for an explicitly approved workload. | No default account state or controlled-data transfer. | Not selected; requires separate provider, cost, retention, and data-transfer review. |

## Candidate Review

| Candidate | License | Decision |
| --- | --- | --- |
| `vercel-labs/agent-browser` | Apache-2.0 | Selected isolated-runtime candidate. Supported in principle, but deprioritized in the current Web UI path. |
| `microsoft/playwright-cli` | Apache-2.0 | Retain as an alternative external runner; not selected as the default contract. |
| Donor Playwright MCP skill | Runtime-specific MCP dependency. | Reject. Its `browser_puppeteer` contract is not available cross-runtime. |
| `SawyerHood/dev-browser` | MIT | Reject. Persistent server, extension, and browser-state assumptions are unsuitable as a default. |

## Migration Outcome

No donor browser skill body is migrated. The previous `agent-browser` skill
contains OpenCode PTY and MCP assumptions; the previous Playwright skill is an
MCP stub; and the previous `dev-browser` skill requires a persistent Node
service. `research-web` replaces those runtime assumptions with target, account,
data, confirmation, and evidence boundaries.

## External Validation Gate

Before any isolated runtime is advertised as operational in a given interface,
validate it in an approved environment using a local `data:` fixture and then a
public, read-only target. Verify fresh-state isolation, target restriction,
screenshot or extraction artifact capture, deterministic shutdown, and that no
credentials or browser state persist. Logged-in mode additionally needs a
user-approved write-action fixture and explicit account/destination
confirmation. For the current Web UI, leave `agent-browser` as available but
non-preferred until turn-to-turn state passing is proven reliable.
