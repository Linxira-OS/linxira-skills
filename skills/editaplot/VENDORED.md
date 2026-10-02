# VENDORED — editaplot

- **Upstream repository:** https://github.com/editaplot/editaplot (skill/editaplot subtree)
- **Upstream commit:** 01721038afd212103d96225319b22d1bbfe32270
- **License:** Apache-2.0 (see `LICENSE`, plus `NOTICE`)

## Copied files

Entire `skill/editaplot/` directory, unmodified except as noted:

- `SKILL.md`
- `LICENSE`, `NOTICE`
- `agents/openai.yaml`
- `assets/` (reference figures)
- `references/` (10 docs: chart-selection, data-contracts, figure-contract, origin-safety, palettes, reference-figures, runtime, semantic-understanding, showcase, verification)
- `scripts/` (editaplot.py, editaplot_core.py, bootstrap_editaplot.py, requirements-runtime.lock)

## Modifications

- `SKILL.md` frontmatter: added `skill_class: workflow`, `load_policy: required`, `risk_tags: [paid, privileged]` (original `name`/`description` preserved).

## Not vendored (runtime dependencies)

The upstream `skill/editaplot` subtree is only the instruction layer. The engine it drives lives
outside the skill directory and was **not** migrated:

- Repository-root `editaplot.cmd` launcher — SKILL.md instructs using the repo-root launcher and
  running `editaplot.cmd setup`; it is absent here, so `setup`/`doctor`/`start`/`render` commands
  will not resolve until the full upstream repository is cloned locally.
- `runtime/` directory (Python package source, templates, `runtime-manifest.json`,
  `requirements-runtime.txt` / `.lock`) — required by the launcher and bootstrap script.
- `pyproject.toml`, `tests/`, `examples/`, `tools/`, `release/`, `.github/` — build/CI/verification
  infrastructure, not needed for skill instruction consumption.
- Broken relative references: SKILL.md refers to the repository-root `editaplot.cmd` and full-repo
  setup flow; these paths are invalid within `skills/` and were intentionally left untouched.
