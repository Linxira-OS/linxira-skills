# Research Web Policy

## Decision

Browser capability is split into two modes and governed by the first-party
`research-web` contract. OpenCode can support browser automation in some
terminal-driven environments, but the current web UI does not reliably carry
the interactive state and follow-up messages this workflow needs. Browser
runtime validation is therefore an external runtime concern here.

| Mode | Intended use | Account state | Current status |
| --- | --- | --- | --- |
| Isolated automation | Public, read-only research checks, explicitly allowed metadata extraction, and screenshots. | Fresh profile with no saved state. | Defined; runtime validation deferred to an external environment. |
| User-approved logged-in browser | A named account and explicitly approved site action. | User authenticates directly in a separate profile. | Defined; requires per-action confirmation for external writes. |
| Cloud browser | Remote disposable browser for an explicitly approved workload. | No default account state or controlled-data transfer. | Not selected; requires separate provider, cost, retention, and data-transfer review. |

## Candidate Review

| Candidate | License | Decision |
| --- | --- | --- |
| `vercel-labs/agent-browser` | Apache-2.0 | Selected future isolated-runtime candidate. Do not validate it from the current OpenCode web UI session. |
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

Before any isolated runtime is advertised as operational, validate it in an
approved external environment using a local `data:` fixture and then a public,
read-only target. Verify fresh-state isolation, target restriction, screenshot
or extraction artifact capture, deterministic shutdown, and that no credentials
or browser state persist. Logged-in mode additionally needs a user-approved
write-action fixture and explicit account/destination confirmation.
