# VENDORED — academic-humanizer

- **Upstream repository:** https://github.com/AIScientists-Dev/academic-humanizer
- **Upstream commit:** `94b88b23703bed7df507acae7d6d5876209a0cdf` (Fri Jul 3 15:58:31 2026 +0800, "Clarify description and voice framing; add disclosure and personalization notes")
- **License:** MIT (© 2026 AIScientists-Dev; see `LICENSE`, copied verbatim from upstream and unchanged)
- **收录方式:** MIT 直收（原样复制，仅补 frontmatter 元数据）

## 复制的文件清单

```
SKILL.md
LICENSE
examples/before-after.md
```

- `SKILL.md`、`LICENSE` 与上游提交逐字节一致（仅 `SKILL.md` frontmatter 有下述增补）。
- `examples/before-after.md` 是上游该提交中跟踪的文件，但上游本地为 `blob:none` 部分克隆且 sparse-checkout 为 `/*` + `!/*/`（只检出根目录文件），故按提交对象取回（`git show HEAD:examples/before-after.md`），内容与该提交一致，未作任何修改。

## 修改说明

仅修改 `SKILL.md` 的 YAML frontmatter：在 `name` 之后插入三个仓库规范字段。

```yaml
skill_class: workflow
load_policy: conditional
risk_tags: []
```

原有 `name`、`version`、`description`、`license`、`compatibility`、`allowed-tools` 全部保留，未改动一字；正文（含全部 6 层编辑流程与示例）与上游逐字节一致。

`description` 保留上游原文，全文如下（供审计比对）：

> Improve the clarity and voice of AI-assisted academic writing (papers, theses, rebuttals) and funding proposals (NSF Project Summary/Description, NIH Specific Aims): preserve scholarly conventions, match claims to evidence (and, for proposals, claims to feasibility), and match the author's own voice. It never changes a number, result, or citation, and it is not for evading AI-use disclosure. Use when editing AI-assisted academic prose or grant proposals.

## 未随迁内容

- 上游 `README.md`（项目说明、安装与贡献指南）——技能正文之外一律不收。
- 上游 `assets/`（`banner.svg`、`x-en.svg`、`rednote-zh.svg` 及其 PNG 导出）——宣传素材，非技能内容。
- 上游 `.gitignore`。
- 上游仓库未包含插件清单（`.claude-plugin/`、`.cursor-plugin/`）、`agents/` 展示元数据、CI 脚本或 eval/打包脚本，因此无此类内容可排除。

## 上游依赖与致谢（非本仓库内容）

上游 `SKILL.md` 的模式层（Layer 1）建立在下述两个项目之上；本仓库仅原样转载上游文本，不复制、不重新分发这两个项目的代码：

- **blader/humanizer** — MIT。上游 `LICENSE` 的版权声明中已显式致谢（"This work builds on 'humanizer' by blader …, MIT"）。本技能沿用其通用 AI 写作痕迹目录（Layer 1），再扩展到学术语域。
- **koaeraser/ARMS** — 上游 `README.md` 的 Acknowledgments 记其为一个范围更广的自主研究流水线项目，影响了本技能对"论断—证据"对应与数值精度的强调；本仓库未复制其任何文件，使用时请以该项目自身的许可条款为准。

## 事实性声明说明

上游 `SKILL.md` 第 180 行附近的语域示例中提及 `Nature/PNAS` 的写作风格（简洁、结果前置等）。这属于编辑风格层面的举例说明，**并非**对任何期刊官方要求的引证，也不构成"Nature 报道/研究证实"之类的事实主张；本技能不对该示例作任何事实背书的引用。涉及投稿要求时，一律以目标期刊的官方作者指南为准。
