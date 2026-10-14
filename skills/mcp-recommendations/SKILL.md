---
name: mcp-recommendations
description: 当用户需要某类外部能力（开发协作、文档检索、浏览器、数据库、设计、科学数据等）但不知道该装哪个 MCP，或询问“有什么好用的 MCP / MCP 选型 / 怎么接外部系统”时使用。给出按领域的推荐清单、安装命令与验证方法，并说明信任边界；不替代具体 MCP 的连接器契约技能。
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# MCP 选型推荐

推荐覆盖用户任务的最小 MCP，再带用户完成安装与验证。不要静默安装任何东西，
也不要把一次推荐当作安全保证。

## 范围

在范围内：

- 针对用户明确陈述的能力需求，给出候选 MCP 服务器。
- 给出每个候选的官方仓库、单行安装命令与验证方法。
- 安装前标注信任边界与所需风险标签。

不在范围内：

- 充当某个具体 MCP 的连接器契约。一旦选定，交给该服务器自己的契约技能
  （例如设计类交给 `open-design`）。
- 打包安装器或镜像第三方代码。

## 使用步骤

1. 复述用户真正需要的能力（读、写，还是两者）。
2. 匹配到下方领域，再读 `references/landscape.md` 中该领域已核实的候选。
3. 优先顺序：官方一方服务器 > 官方远程端点 > 有维护的社区服务器。
4. 只给一条推荐安装命令加一条备选，以及验证方法。绝不把未核实的命令当作
   已核实。
5. 应用 `references/integrate.md` 中的接入与信任边界规则。

领域入口：

- 开发协作与代码托管 → GitHub MCP Server
- 库/框架文档 → Context7
- 本地文件与长期记忆 → 官方 reference servers
- 浏览器控制与调试 → Playwright MCP、Chrome DevTools MCP
- 设计文件与设计工作区 → Figma MCP、OpenDesign
- 数据库与后端 → Supabase MCP / PostgreSQL
- 内置搜索之外的网络检索 → Brave Search MCP
- 知识库与文档 → Notion MCP
- 可观测性与错误 → Sentry MCP
- 科研数据与模型 → Hugging Face、arXiv、PubMed、AlphaFold

## 选型规则

- 传输方式匹配宿主：本地工具优先 stdio，托管服务在宿主支持时用远程 HTTP。
- 只需查看时，优先只读工具子集。
- 一个能力只接一个服务器。除非用户要求，不叠加重叠服务器（两个搜索、两个
  浏览器）。
- 说明维护信号：官方仓库、远程端点或社区项目，以及核实日期。
- 若无已核实候选，直说，并把命令留为未核实，不要编造。

## 信任与风险

推荐安装前，点明外部依赖：

- 凭证：是否需要 token、API key 或 OAuth 授权？
- 数据出域：哪些内容离开本机，发往哪个第三方？
- 写权限：能否修改远端或本地状态？
- 成本：背后服务是否按量或付费计费？

用审计白名单里的风险标签（`account-bound`、`paid`、`destructive`、
`privileged`、`remote-compute`、`controlled-data` 等）标注，便于调用方门控。
逐服务器标签见 `references/landscape.md`。

## 完成标准

- 能力、选定服务器与被否方案均已陈述。
- 安装命令与验证方法已给出，并附带核实状态。
- 信任边界、所需凭证与风险标签均已点明。
- 存在对应契约技能时，已指明交接目标。

## Citation

```text
Linxira OS. Linxira Skills: mcp-recommendations. Version 0.1.0.
Skill path: skills/mcp-recommendations/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
