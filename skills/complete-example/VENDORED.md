# VENDORED — complete-example

- Upstream: https://github.com/huangwb8/ChineseResearchLaTeX (skills/complete-example)
- Upstream commit: f1c7206
- Author: Bensz/Weibin Huang
- License: MIT（见本目录 license.txt，随迁副本）

## 复制的文件
- SKILL.md
- config.yaml
- references/（整目录）
- scripts/（整目录）
- license.txt（自 .tmp-upstream/ChineseResearchLaTeX/license.txt 复制）

## 所做修改
- SKILL.md frontmatter 补齐 skill_class: workflow、load_policy: conditional、risk_tags: []；正文未改动。

## 未随迁依赖
- `./.bensz-api/task-{yyyymmdd-hhmm}-{简短描述}/`（含 `{skill名}/input|output|log/`、`shared/`）：上游宿主 AI 的隐藏任务工作区约定，不在本仓库内，运行时按需在用户工作目录创建。
- `bensz-collect-bugs` skill 及 `~/.bensz-skills/bugs/`、`huangwb8/bensz-bugs` 仓库：上游 bug 记录/上报基础设施，未随迁；缺失时相关上报步骤跳过即可。
