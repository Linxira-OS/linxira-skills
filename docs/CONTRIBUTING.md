# Contributing Skills

Each curated skill must live at `skills/<name>/SKILL.md` and include valid
Agent Skills frontmatter:

```yaml
---
name: lowercase-hyphenated-name
description: Use when ... Include concrete trigger terms and the skill scope.
---
```

## Acceptance Checklist

- Define inputs, outputs, assumptions, and explicit non-goals.
- Prefer decision rules over long lists of commands.
- Pin references, environments, containers, and databases where practical.
- Include checkpoints that detect silent scientific or operational failure.
- Separate destructive, privileged, expensive, and clinical actions.
- Provide rollback or recovery steps for system changes.
- Keep examples portable and avoid embedding credentials or private data.
- Cite the upstream source and preserve its license when adapting material.
- Test commands, parsers, and scripts against representative fixtures.

Do not copy an upstream skill into the curated layer solely to increase the
skill count. The curated layer is a reliable routing and execution surface; the
submodules are the comprehensive archive.
