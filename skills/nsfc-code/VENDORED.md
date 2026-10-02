# VENDORED — nsfc-code

- Upstream: https://github.com/huangwb8/ChineseResearchLaTeX (skills/nsfc-code)
- Upstream commit: f1c7206
- Author: Bensz/Weibin Huang
- License: MIT（见本目录 license.txt，随迁副本）

## 复制的文件
- SKILL.md
- config.yaml
- CHANGELOG.md、README.md
- references/、scripts/（整目录）
- license.txt（自 .tmp-upstream/ChineseResearchLaTeX/license.txt 复制）

## 所做修改
- SKILL.md frontmatter 补齐 skill_class: workflow、load_policy: conditional、risk_tags: []；正文未改动。

## 未随迁依赖
- `.bensz-api/task-{yyyymmdd-hhmm}-…/nsfc-code/` 隐藏工作区约定（含 `input/`、`output/`、`log/`，及 legacy `.nsfc-code/` 兼容读取）：未随迁，运行时按需创建。
- 上游"申请代码推荐库"（NSFC 申请代码数据源）：随 references/ 提供，若上游另行托管的外部数据源未包含，以 references/ 内随迁副本为准。
- `bensz-collect-bugs` skill 及 `~/.bensz-skills/bugs/`、`huangwb8/bensz-bugs` 仓库：上游 bug 记录/上报基础设施，未随迁。
