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

Apache-2.0 requires retaining license and notice files and stating changes:
each vendored directory keeps its upstream `LICENSE`/`NOTICE` files and a
`VENDORED.md` that names the upstream repository, revision, license, copied
files, and modifications (currently: added frontmatter metadata fields required
by the first-party audit; unchanged bodies unless noted in that file).

MIT requires retaining the copyright and license notice: every
ChineseResearchLaTeX-derived directory carries a copy of the upstream
`license.txt`.

## Not Distributed

Source tracks pinned under `sources/` and concept references remain outside the
npm payload. Skills whose upstream terms are non-commercial or mixed
(creative-commons NC or combined licenses) were not vendored; where their ideas
informed first-party work, the resulting skills are original expressions
authored in this repository.
