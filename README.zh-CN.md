# Linxira Skills

这是 `linxira-skills` 的中文概览页。项目正文文档保持英文，便于
发布、审计和跨运行时复用。

English README: [README.md](README.md)

## 这是什么

Linxira Skills 是一个面向研究、工程和执行工作流的跨运行时技能平台。它不限定
在单一学科、工具链或 Agent 运行时内。
当前仓库用于构建首个 npm 交付包，并保存：

- 一方技能
- 已审阅 profile
- 上游来源轨道
- 安装器与验证脚本
- 第三方来源与修改边界文档

## 渐进式路由

安装器不会把所有 leaf skill 平铺到 `.agents/skills/` 根目录，而是生成三级树：

```text
.agents/skills/
  engineering/                 顶层 router
    native-performance/        二级 index
      <exact-skill>/SKILL.md    三级 leaf
```

生成的 `AGENTS.md` 只列出当前 profile 使用的顶层 router。Agent 先读取一个
router，再读取一个匹配的二级 index，最后才读取当前任务所需的具体 leaf。
当前顶层分支为 `research`、`engineering`、`systems`、`integrations` 和
`delivery`。

## 内容结构

- **平台基础能力**：软件验证、Linux、SSH、远程计算、浏览器、云和 AI 工作流
- **领域 profile**：生命科学等领域的方法、术语和分析工作流
- **报告 profile**：文档、图表、网页和演示交付能力
- **连接器**：数据库、云服务和需要认证的外部系统契约

Linux 是所有 profile 可复用的执行基础层，不是一个学科包。
`bioinformatics-core` 是第一个领域 profile，但不代表平台的范围边界。

## 当前可安装内容

| Profile | 内容 |
| --- | --- |
| `core` | 10 个一方软件、完整性、Linux、传输和计算技能 |
| `bioinformatics-core` | `core` + 10 个一方生物信息学和 bulk RNA-seq 闭环技能 |
| `research-communication-core` | `core` + 11 个一方论文写作、引用、正文排版、图像边界、文档、LaTeX、学术 PPT 和渲染验收技能 |

另外还定义了若干 reviewed connector profile，例如 AlphaFold DB public，
但它们目前不是单独打包 payload。

学术文档与 PPT 交付将 Arch Linux（包括基于 Arch 的 Linxira、CachyOS）和
Ubuntu 都作为一等运行环境。CI 会分别使用原生 `pacman` 与 `apt` 工具链运行
同一套 DOCX、PPTX、XeLaTeX/BibTeX、XeLaTeX/Biber、LibreOffice 和 Poppler
端到端 fixture。

## 安装

```bash
npm install --save-dev linxira-skills
npx linxira-skills init
```

指定 profile：

```bash
npx linxira-skills init --profile core
npx linxira-skills init --profile bioinformatics-core
npx linxira-skills init --profile research-communication-core
```

## 第三方说明

本仓库不会把第三方技能伪装成原创内容。只有满足以下条件的第三方正文才会被纳入
payload：

- 固定 source revision
- 已核实 license
- 已保存所需 notice
- 已明确 payload 边界

当前公开 payload 不包含第三方技能正文：

- `bioinformatics-core` 使用基于固定 MIT `bioSkills` revision 的一方适配技能，
  每个技能都记录来源路径和具体修正
- 原 `life-sciences-core` 与 `html-reporting-core` 保留为审阅记录，但暂停打包
- 带外部示例引用的 `html-anything` 模板仍然只是 source-only
- `awesome-bio-agent-skills` 仍是研究索引源，不进入公开 payload

具体规则见：[docs/THIRD_PARTY.md](docs/THIRD_PARTY.md)

## 验证状态

当前发布草案已完成本地验证：

- 一方技能元数据审计
- profile 生命周期测试
- Profile 路由链接完整性测试
- 打包 tarball 安装烟测
- 拒绝开发树和上游来源进入 tarball 的包内容检查

## 引用

如果别人使用本仓库或其中某个适配后的科学技能来撰写论文、流程说明、基准或
二次技能库，应该引用仓库版本和具体技能路径。统一格式见
[docs/SKILL_CITATION_POLICY.md](docs/SKILL_CITATION_POLICY.md) 以及根目录
的 [CITATION.cff](CITATION.cff)。
- GitHub Actions 已配置 Ubuntu / Windows / macOS 与 Node 20 / 22 / 24 矩阵
- Debian 12 / Fedora 42 / Arch Linux 容器任务保留为发布门禁

Arch Linux WSL 路径也做过一轮本地 smoke 验证，用于补充 Linux 侧信心。
CachyOS 的用户态兼容性由 Arch job 覆盖；内核、调度器、DKMS、NVIDIA 驱动和
具体硬件行为仍需要真实 CachyOS 主机或 self-hosted runner，不能由容器代替。
