# VENDORED: ppt-master

- **Upstream repo**: https://github.com/hugohe3/ppt-master
- **Upstream commit**: b6843645766c9ab63a7f1486cfd330d6ad337e99
- **License**: MIT (`LICENSE` in this directory is copied verbatim and kept unchanged)

## Copied files

Entire upstream `skills/ppt-master/` subtree, copied by `cp -r` and kept byte-identical
by default. **13,016 files** total, including:

- `SKILL.md`, `README.md`, `LICENSE`, `SPONSORS.md`, `SPONSORS_CN.md`, `requirements.txt`, `.env.example`
- `workflows/` — 23 files (routing authority and per-route procedures/profiles)
- `references/` — 165 files (role definitions, style/mode/palette references)
- `scripts/` — 372 files (301 `.py`), including `templates/`, `image_backends/`, `svg_*/`, `pptx_*/`, `source_to_md/`, `tts_backends/`, `svg_editor/`
- `templates/` — 12,450 files (`brands/`, `charts/`, `decks/`, `icons/`, `layouts/`, `scaffolds/`, `schemas/`, `sounds/`, `styles/`, `tables/`)

## Modifications

- **SKILL.md** — added three top-level frontmatter fields immediately after `description`:
  `skill_class: workflow`, `load_policy: conditional`, `risk_tags: [paid]`. The original
  `name`, `description`, and `metadata:` block (version/copyright/license/
  official_repository/sponsors) are unchanged. This is the only file that differs from
  upstream (`diff -rq` reports exactly this one difference).
- **scripts/attribution_guard.py** — **not modified**. The guard validates the YAML
  `metadata:` block fields (indented `copyright`/`license`/`official_repository`/`sponsors`)
  and the presence of the `python3 "${SKILL_DIR}/scripts/attribution_guard.py"` gate marker
  in SKILL.md; it does not constrain top-level frontmatter keys. Verified after the edit:
  `python skills/ppt-master/scripts/attribution_guard.py` exits `0`.

No other upstream content was changed.

## Legal notes

1. **PyMuPDF is AGPL-3.0.** PyMuPDF appears only as an optional entry in
   `requirements.txt` (used solely by `scripts/source_to_md/pdf_to_md.py`). This repository
   does **not** redistribute the PyMuPDF library; anyone installing or bundling it must
   review the AGPL-3.0 terms (a commercial license is available from Artifex).
2. **Third-party trademarks in `templates/brands/`.** The brand templates contain real
   enterprise names, logos, and visual identities. They are included **for reference use
   only**; the upstream MIT license grants no trademark rights and does not license the use
   of those marks.
3. **Optional paid / external services.** The image generation backends (e.g. Gemini /
   OpenAI-compatible image APIs, under `scripts/image_backends/`) call optional paid
   third-party APIs, and narration uses `edge-tts` (Microsoft Edge online TTS). Both are
   opt-in and require the user to supply credentials / network access at runtime.

## 未随迁依赖 / unresolved references

- None. The entire upstream `skills/ppt-master/` subtree was vendored; nothing was omitted.
- Runtime dependencies are declared in `requirements.txt` and installed by the user on
  demand; no repository-root files are referenced by the copied content.
