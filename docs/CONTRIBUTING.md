# Contributing Skills

Each curated skill must live at `skills/<name>/SKILL.md` and include valid
Agent Skills frontmatter:

```yaml
---
name: lowercase-hyphenated-name
description: Use when ... Include concrete trigger terms and the skill scope.
skill_class: workflow
load_policy: conditional
risk_tags: [destructive]
---
```

`skill_class` is one of `reference`, `workflow`, `guard`, or `contract`.
`load_policy` is one of `on-demand`, `conditional`, or `required`. Use
`required` only when a matching task would otherwise violate an external tool,
safety, provenance, or execution contract. `risk_tags` is a compact YAML list
drawn from the approved risk vocabulary. See
[`SKILL_LOADING_POLICY.md`](SKILL_LOADING_POLICY.md) for model-profile behavior.

## Acceptance Checklist

- Define inputs, outputs, assumptions, and explicit non-goals.
- Prefer decision rules over long lists of commands.
- Pin references, environments, containers, and databases where practical.
- Include checkpoints that detect silent scientific or operational failure.
- Declare the least forceful loading policy that still protects the task.
- Separate destructive, privileged, expensive, and clinical actions.
- Provide rollback or recovery steps for system changes.
- Keep examples portable and avoid embedding credentials or private data.
- Cite the upstream source and preserve its license when adapting material.
- Test commands, parsers, and scripts against representative fixtures.

Do not copy an upstream skill into the curated layer solely to increase the
skill count. The curated layer is a reliable routing and execution surface; the
submodules are the comprehensive archive.
