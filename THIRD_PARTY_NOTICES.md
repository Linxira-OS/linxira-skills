# Third-Party Notices

Permissively licensed upstream skills (Apache-2.0, MIT) are vendored into
`skills/` and, through the `research-communication-core` profile, into the
public npm payload. Each vendored skill directory retains its upstream license
text, pins the upstream revision in `VENDORED.md`, and records every local
modification there. Concept-level clean-room skills are first-party work and
are not listed here.

## Vendored Upstreams

| Upstream | Revision | License | Included skills |
| --- | --- | --- | --- |
| `hang-jin/editaplot` | `01721038afd212103d96225319b22d1bbfe32270` | Apache-2.0 | `editaplot` (skill only; the `runtime/` rendering engine and launcher are not vendored and are not part of the npm payload) |
| `yejy53/Editable-Design` | `c87b16f6d7c198e2b6967f13f1b1baa939d6f31f` | Apache-2.0 | `paper-fig`, `editable-design`, `html-to-pptx` |
| `huangwb8/ChineseResearchLaTeX` | `f1c7206faafde597c65f9eb9fa6b2abaa5518c6e` | MIT | 27 skills: `complete-example`, `make-latex-model`, `transfer-old-latex-to-new`, eleven `nsfc-*`, four `paper-*`, nine `research-*` |
| `jing1312/nature-figure-skill` | `af778027c866e2e6b3432b946e44a4a2b4434d82` | MIT | `figureforge` (the original FigureForge browser editor subtree only; the repository's derived `nature-*` skill texts and its CC BY-NC assets are not included) |
| `hugohe3/ppt-master` | `b6843645766c9ab63a7f1486cfd330d6ad337e99` | MIT | `ppt-master` (full skill subtree, 13k files). Legal notes: PyMuPDF (AGPL-3.0) appears only as an optional requirement and is not redistributed; `templates/brands/` brand identities are reference-only and MIT grants no trademark rights; optional paid image-generation backends and edge-tts narration |
| `AIScientists-Dev/academic-humanizer` | `94b88b23703bed7df507acae7d6d5876209a0cdf` | MIT | `academic-humanizer` (English academic and NSF/NIH proposal de-tone pass; pattern layer credits blader/humanizer per its own LICENSE) |
| `blader/humanizer` | `0ef9fe5bc3572734fd3ae6c448fe00a30cd5dcf0` | MIT | `humanizer` (English general de-AI-tone pattern catalog; criteria derive from Wikipedia "Signs of AI writing" at the idea level, expression is upstream MIT text) |
| `Nanako0129/sepia` | `fb06be76abeae7dd606960a32f2b10c1d1798e0d` | MIT | `sepia` (narrative/discourse/venue passes plus Chinese calibration; only the canonical skill subtree, plugin manifests and evals not vendored) |
| `LifelongLazyLearner/qu-ai-wei` | `1d32e803f091ec90808a69683ebf49e8a970a5e7` | MIT | `qu-ai-wei` (Simplified Chinese de-AI-tone, v0.9.1 pinned; embedded final-draft mode is the local default) |

Apache-2.0 requires retaining license and notice files and stating changes:
each vendored directory keeps its upstream `LICENSE`/`NOTICE` files and a
`VENDORED.md` that names the upstream repository, revision, license, copied
files, and modifications (currently: added frontmatter metadata fields required
by the first-party audit; unchanged bodies unless noted in that file).

MIT requires retaining the copyright and license notice: every vendored
directory carries a copy of its upstream license text (for
ChineseResearchLaTeX-derived skills this is `license.txt`).

Source tracks pinned under `sources/` and concept references remain outside the
npm payload. Skills whose upstream terms are non-commercial or mixed
(creative-commons NC or combined licenses) were not vendored; where their ideas
informed first-party work, the resulting skills are original expressions
authored in this repository.
