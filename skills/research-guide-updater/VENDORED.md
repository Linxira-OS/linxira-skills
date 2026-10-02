# Vendored Skill: research-guide-updater

- **Upstream repo**: https://github.com/Bensz-Conan/ChineseResearchLaTeX
- **Upstream commit**: f1c7206
- **License**: MIT (see `license.txt` in this directory; upstream author Bensz/Weibin Huang)
- **Copied files**: entire upstream `skills/research-guide-updater/` directory (SKILL.md, config.yaml, scripts/, references/ 等，随上游目录内容而定)

## Modifications

- SKILL.md frontmatter 补齐了 `skill_class`、`load_policy`、`risk_tags` 三个字段，以符合本仓库审计要求；正文未做任何改动。
- 新增本 `VENDORED.md` 与 `license.txt` 副本。

## Notes

- 上游 SKILL.md 中引用的兄弟 skill（如 research-literature-search、research-literature-review 等）随本次迁移一并移植；未随迁的上游仓库级文件（如安装器、CI 配置）不属于运行时依赖。
- **Overlap**: 无直接同类技能。
