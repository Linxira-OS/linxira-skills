# VENDORED — humanizer

- **Upstream repository:** https://github.com/blader/humanizer
- **Upstream commit:** `0ef9fe5bc3572734fd3ae6c448fe00a30cd5dcf0` (Wed Oct 28 00:17:33 2026 -0700, "Merge pull request #307 from devilliersdutoit/fix/plugin-manifest-schema-key")
- **License:** MIT (© 2025 Siqi Chen; see `LICENSE`, copied verbatim from upstream and unchanged)
- **收录方式:** MIT 直收（原样复制，仅补 frontmatter 元数据）

## 复制的文件清单

```
SKILL.md
LICENSE
```

两文件与上游提交逐字节一致（仅 `SKILL.md` frontmatter 有下述增补）。

## 修改说明

仅修改 `SKILL.md` 的 YAML frontmatter：在 `name` 之后插入三个仓库规范字段。

```yaml
skill_class: workflow
load_policy: conditional
risk_tags: []
```

原有 `name`、`description`、`license`、`metadata.version`（`3.1.0`）全部保留，未改动一字；正文（§1 至 §5 的模式目录、改写流程与判据）与上游逐字节一致。

## 未随迁内容

按本仓库"只收技能正文"的规则，以下上游文件/目录**未**复制：

- `.claude-plugin/`（`plugin.json`、`marketplace.json`）——插件清单
- `.cursor-plugin/`（`plugin.json`）——插件清单
- `agents/`（`openai.yaml`）——展示元数据
- `scripts/`（`validate-package.py`）——打包/校验脚本
- `AGENTS.md`——面向代理的开发说明
- `README.md`、`CHANGELOG.md`——项目说明与变更日志
- `.github/`——Issue 模板与 CI（`workflows/validate.yml`）

## 判据来源与版权说明

本技能的模式判据源自维基百科条目 **《Signs of AI writing》**（`https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing`，由 WikiProject AI Cleanup 维护），该文本以 **CC BY-SA 4.0** 授权。

本技能对维基百科内容的借用**仅限思想与事实层面**（即"哪些写作特征属于 AI 生成痕迹"这一分类认知），**不包含受版权保护的表达**：正文的措辞、结构编排、示例与解释均为上游原作者原创，`SKILL.md` 正文仅以链接形式署名来源，未复制该条目原文。因此本目录以 MIT 分发上游原创文本，不构成对 CC BY-SA 4.0 文本的再分发。

若后续有人把该维基百科条目的原文段落并入本技能，则该部分须按 CC BY-SA 4.0 处理并保留署名与同源共享要求。
