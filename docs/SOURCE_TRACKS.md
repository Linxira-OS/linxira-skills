# Source Tracks And Directory Catalog

## Design

The source tree is deliberately hierarchical. A plugin should discover skills
recursively and identify each one by its source-track-relative path, not by a
flattened folder name. This avoids collisions and preserves supporting files,
license notices, tests, examples, and upstream update paths.

```text
sources/
  bioSkills/
    <scientific-category>/<skill>/SKILL.md
  awesome-bio-agent-skills/
    skills/<original-source>/<skill>/SKILL.md
    bioskill_index_v3.csv
  html-anything/
    next/src/lib/templates/skills/<template>/SKILL.md
```

## Track States

| Track | Count | Directory grouping | Plugin state | Release state |
| --- | ---: | --- | --- | --- |
| `bioSkills` | 562 | Scientific category | Enabled recursive discovery | MIT source track; retain copyright and license notices. |
| `awesome-bio-agent-skills` | 1,705 | Original source repository | Indexed recursive discovery | Per-skill provenance gate; root CC0 does not supersede nested licenses. |
| `html-anything` | 81 | Template category | Indexed recursive discovery from `next/src/lib/templates/skills` | Apache-2.0 upstream snapshot; 22 skills cite external examples or inspiration and remain provenance-gated. |

`awesome-bio-agent-skills/bioskill_index_v3.csv` is the authoritative logical
index for its current snapshot. It provides `source_repo`, scientific `category`,
description, file count, and archive path. Its published collection count can
differ from the discovered `SKILL.md` count, so the plugin uses recursive file
discovery as the executable source of truth. Plugins can browse by either
original source or scientific category while leaving the physical tree unchanged.

`html-anything` retains the complete upstream repository because its template
directories can reference sibling examples and assets. Its discovery root is
intentionally nested; the stable identity remains relative to the repository
root, for example
`html-anything:next/src/lib/templates/skills/experiment-readout`.

## Plugin Contract

A future OpenCode plugin should:

1. Scan each declared discovery root recursively for `SKILL.md`.
2. Keep the source track and relative path as the immutable skill identifier.
3. Load a skill directory as a unit, including files referenced by `SKILL.md`.
4. Expose both physical grouping and logical category/index metadata.
5. Check source state before execution: enabled, indexed-with-provenance-gate,
   account-bound, controlled-data, paid, clinical, or disabled.
6. Pin the source revision shown in `docs/life-sciences-core.yaml` and report it
   with any activated skill.
7. Resolve source roots from the installed package location, never from a
   development checkout or current working directory.
8. Build a compact descriptor index first. Load a selected skill's `SKILL.md`
   and complete directory only after routing and risk checks; a category request
   must not inject every skill body into a session.

The plugin must not execute an indexed-but-unreviewed skill merely because a
keyword matches. It should ask for explicit selection when multiple sources
cover the same task or when a risk state requires confirmation.

Complete directory installation is required for a source track because a skill
may refer to sibling scripts, manifests, examples, tests, assets, or shared
files outside its own directory. The installed source revision is immutable for
the active session; index and selection caches must be invalidated when the
track revision changes.

## Updating Source Tracks

`scripts/sync-source-tracks.ps1` compares each local source tree to its original
upstream. Its default mode is read-only apart from `git fetch`; `-Apply` permits
only fast-forward local updates, and `-Push` additionally updates the user's
fork. A source revision changes only after the root repository records the new
submodule pointer or source snapshot.
