---
name: scientific-change-verification
description: Use when planning, debugging, testing, reviewing, or accepting a change to scientific or research software. Establishes evidence, scope, verification, and completion criteria before claiming a result is ready.
skill_class: guard
load_policy: conditional
risk_tags: [controlled-data]
---

# Scientific Change Verification

Treat a code change as an evidence problem: identify the behavior to preserve or
correct, make the smallest justified change, and verify the resulting artifact
at the right level. Load this skill for bugs, feature changes, review feedback,
or a request to state that scientific software is ready.

## Boundaries

Use `scientific-software-engineering` for domain contracts, data formats,
coordinate systems, statistical assumptions, and release quality. This skill
governs the change cycle around those rules. It does not authorize a destructive
operation, remote job, clinical claim, or controlled-data disclosure; load the
matching contract or guard before such an action.

## Start With Evidence

Before editing, state these facts in the working record:

1. The observed behavior, with the smallest reproducible input, failing test,
   review finding, or user-visible symptom.
2. The expected behavior and the scientific invariant it protects, such as a
   coordinate convention, unit, identifier, ordering rule, tolerance, or data
   preservation rule.
3. The affected public surface: input, output, API, CLI, file artifact, or
   workflow result.
4. The verification that would distinguish a real fix from a plausible-looking
   change.

Do not turn a vague report into an unbounded refactor. If evidence is missing,
inspect the narrowest relevant code path and artifact before proposing a fix.

## Choose The Change Path

### Defect Or Regression

1. Reproduce the defect with a focused test or fixture before editing.
2. Separate the observed failure from possible causes.
3. Trace the value or artifact through the smallest relevant path.
4. Change the cause, not only the final symptom.
5. Keep the reproducer as a regression test.

When reproduction is impossible because the original data is unavailable or
controlled, write a minimized synthetic fixture that preserves the relevant
shape, units, identifiers, and failure boundary. State the remaining
uncertainty instead of claiming exact reproduction.

### New Behavior

1. Define the accepted input, output, errors, defaults, and backward-compatibility
   expectation.
2. Add a focused test or fixture for the requested behavior before relying on
   implementation details.
3. Implement only the path needed to satisfy that contract.
4. Cover an invalid or boundary input when it could alter scientific output,
   silently drop data, or change an interpretation.

### Review Feedback

1. Restate the technical claim behind the feedback.
2. Inspect the relevant code, test, artifact, and caller rather than accepting
   the suggestion by default.
3. Apply it only when evidence supports the claim and it fits the current
   contract.
4. Explain a rejected suggestion with the observed constraint or test result.

## Keep The Scope Small

- Preserve unrelated behavior, names, formatting, defaults, and public output.
- Prefer an existing library or local helper when it already owns the domain
  contract.
- Avoid speculative abstractions, broad style rewrites, and unrelated cleanup.
- Add a comment only when it records a non-obvious invariant or a reason a
  tempting alternative is unsafe.
- When a required change exposes a separate defect, record it as follow-up work
  unless it blocks correctness of the change in hand.

## Verify At The Right Level

Use the narrowest evidence that exercises the changed contract, then broaden
only for a meaningful integration boundary:

| Change surface | Minimum evidence |
| --- | --- |
| Pure transformation | Unit test with representative and boundary values. |
| Scientific parser or serializer | Golden fixture, malformed input, and round-trip or invariant check. |
| CLI or API | Exit/status behavior plus structured output or response assertion. |
| Workflow component | Dry-run or small fixture execution with expected provenance or artifact. |
| Corrected defect | The original reproducer now passes and adjacent regression coverage remains green. |

Run the relevant formatter, type checker, linter, and focused tests when the
repository provides them. Run the broader suite when a shared contract,
packaging path, or public behavior changed. Do not report an unrun command as
passing.

## Completion Record

Before claiming completion, record:

- What changed and the behavior it now guarantees.
- The tests or checks actually run and their result.
- Any unchanged uncertainty, unavailable environment, or deferred follow-up.
- Any migration note required for users whose data, defaults, or reproducibility
  assumptions could change.

A change is ready when the stated contract is demonstrated, not when the code
looks plausible.
