# VENDORED — transfer-old-latex-to-new

- Upstream: https://github.com/huangwb8/ChineseResearchLaTeX (skills/transfer-old-latex-to-new)
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
- ChineseResearchLaTeX 模板仓库本体：正文中的 `packages/bensz-*` 公共包、`projects/*` 模板与构建入口（`packages/bensz-nsfc/scripts/nsfc_project_tool.py` 等 NSFC/SCI/Thesis/CV 四条产品线）均属上游模板仓库，未随迁。
- `./.bensz-api/task-{yyyymmdd-hhmm}-{简短描述}/`：上游宿主 AI 隐藏任务工作区约定，未随迁，运行时按需创建。
- `bensz-collect-bugs` skill 及 `~/.bensz-skills/bugs/`、`huangwb8/bensz-bugs` 仓库：上游 bug 记录/上报基础设施，未随迁。
