# VENDORED — qu-ai-wei

- Upstream: https://github.com/LifelongLazyLearner/qu-ai-wei
- Upstream commit: 1d32e803f091ec90808a69683ebf49e8a970a5e7（短号 1d32e80）
- Upstream version: 0.9.1（pin，见本目录 `VERSION`）
- Author: @LifelongLazyLearner
- License: MIT（见本目录 `LICENSE`，自上游仓库根目录复制）

## 复制的文件

- `SKILL.md`
- `VERSION`
- `LICENSE`
- `references/brand-voice.md`
- `references/editing-boundaries.md`
- `references/examples.md`
- `references/pattern-catalog.md`
- `references/platform-patterns.md`
- `references/whitelists.md`

## 所做修改

- 仅改动 `SKILL.md` frontmatter：在 `description` 之后补 `skill_class: workflow`、`load_policy: conditional`、`risk_tags: []`。原 `name`、`description` 保持上游原样。
- 正文与全部 `references/` 文件逐字未改。

## 未随迁内容（上游存在，本仓不收）

- `tests/`（trigger/eval manifest、validate.sh、blind-review、14 组 fixtures）及其 `.github/workflows/`。
- `agents/openai.yaml`（上游展示元数据）。
- `assets/`、`readmes/`（多语 README）、`README.md`、`.gitignore`。
- 上游 `SKILL.md` 正文中引用 `tests/` fixtures 的表述保留原样，仅作上游语料说明。

## 使用约定（本仓）

- **输出模式：** 上游默认「普通模式」，强制输出三段 `【门检】` / `终稿` / `【打磨报告】`（必要时加 `【需作者确认】`）。本仓使用时默认 embedded（内嵌 / 只交终稿）模式，即只交付终稿正文；需要完整门检与打磨报告时在请求中显式要求普通模式。内嵌模式不降低正文与 `references/` 的约束，也不增加写文件、发布或发送权限。
- **语言：** 仅简体中文。繁体中文、翻译、从零新写不适用（与上游 `description` 一致）。
