# VENDORED — make-latex-model

- Upstream: https://github.com/huangwb8/ChineseResearchLaTeX (skills/make-latex-model)
- Upstream commit: f1c7206
- Author: Bensz/Weibin Huang
- License: MIT（见本目录 license.txt，随迁副本）

## 复制的文件
- SKILL.md
- config.yaml
- CHANGELOG.md、README.md
- docs/、output/、prompts/、references/、scripts/、workspace/（整目录）
- license.txt（自 .tmp-upstream/ChineseResearchLaTeX/license.txt 复制）

## 所做修改
- SKILL.md frontmatter 补齐 skill_class: workflow、load_policy: conditional、risk_tags: []；正文未改动。

## 未随迁依赖
- ChineseResearchLaTeX 模板仓库本体：正文中的 `packages/bensz-*` 公共包、`projects/*` 模板分层、`packages/bensz-nsfc|paper|thesis|cv` 构建入口脚本均属上游模板仓库，未随迁；使用本 skill 需用户环境已具备对应模板仓库。
- `python3 skills/make-latex-model/scripts/plan_package_regression.py` 等按上游仓库相对路径调用，在本仓库内路径不同，属明显失效的仓库内相对路径引用（保留原文，未修改）。
- `./.bensz-api/task-{yyyymmdd-hhmm}-{简短描述}/`：上游宿主 AI 隐藏任务工作区约定，未随迁，运行时按需创建。
- `bensz-collect-bugs` skill 及 `~/.bensz-skills/bugs/`、`huangwb8/bensz-bugs` 仓库：上游 bug 记录/上报基础设施，未随迁。
