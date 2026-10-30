# VENDORED — sepia

- Upstream: https://github.com/Nanako0129/sepia (skills/sepia)
- Upstream commit: fb06be76abeae7dd606960a32f2b10c1d1798e0d（短号 fb06be7）
- Upstream version: 0.12.4（SKILL.md frontmatter `metadata.version`）
- Author: Nanako Tsai
- License: MIT（见本目录 `LICENSE`，自上游仓库根目录复制；上游未在 `skills/sepia/` 内附独立许可文件）

## 复制的文件

- `SKILL.md`（上游 canonical 技能正文）
- `LICENSE`
- `agents/openai.yaml`（上游展示元数据，按整子树移植要求保留，不参与本仓运行时加载）
- `references/discourse-pass.md`
- `references/model-fingerprints.md`
- `references/narrative-pass.md`
- `references/professional-pass.md`
- `references/rubric.md`
- `references/style-pass.md`
- `references/voice-skills.md`
- `references/domains/dev-replies.md`
- `references/domains/journalism.md`
- `references/domains/postmortems.md`
- `references/domains/release-notes.md`
- `references/domains/tech-articles.md`
- `references/domains/tickets.md`
- `references/languages/zh.md`
- `references/voices/PERSONA-TEMPLATE.md`
- `references/voices/hemingway.md`
- `references/voices/registry.md`
- `references/voices/tw-journalism.md`
- `references/voices/personas/nyaneko.md`

## 所做修改

- 仅改动 `SKILL.md` frontmatter：在 `metadata.version` 之后补 `skill_class: workflow`、`load_policy: conditional`、`risk_tags: []`。原 `name`、`description`、`license`、`metadata` 保持上游原样。
- 正文与全部 `references/` 文件逐字未改。

## 未随迁内容（上游存在，本仓不收）

- 四套插件清单：`.claude-plugin/`、`.codex-plugin/`、`.qwenpaw-plugin/`、`.agents/plugins/`，以及仓库根 `plugin.json`（上游 de-AI 写作包的多运行时插件入口）。
- 包装技能：`skills/sepia-write/`、`skills/sepia-review/`、`skills/sepia-refactor/`、`skills/sepia-recreate/`、`skills/sepia-hemingway/`（只取 canonical `skills/sepia/`，四操作由 canonical 技能内部路由覆盖）。
- 评测与 CI：`evals/`、`.github/workflows/behavioral-eval.yml`、`.github/workflows/version-consistency.yml`。
- 校验脚本：`scripts/check_persona.py`、`scripts/check_versions.py`。注意 `references/voice-skills.md` 仍以 `scripts/check_persona.py` 指代 persona 正文格式检查器；该脚本未随迁，引用仅作上游约定说明。
- 研究底稿：`research/`（citations、detectors、storyscope 等检索材料）。
- 仓库运维文件：`README.md`、`README.zh-CN.md`、`README.zh-TW.md`、`CONTRIBUTING.md`、`.coderabbit.yaml`、`.gitignore`、`.agents/workflows/sepia.md`。

## 说明

- 上游在 StoryScope（arXiv:2604.03136）与 `SLOPSHAPE-2026` 预印本处引用的是检测实验结果，并把由此推广出的写作处方自标为 "Sepia inferences"（作者推断），而非经干预实验验证的结论。移植后保留该自标限定，不改写、不加强其证据强度。
