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
`life-sciences-core` 是第一个领域 profile，但不代表平台的范围边界。

## 当前可安装内容

| Profile | 内容 |
| --- | --- |
| `core` | 21 个一方 contract / guard / workflow / reference 技能 |
| `life-sciences-core` | `core` + 4 个经审阅的 MIT `bioSkills` 正文 |
| `html-reporting-core` | `core` + 3 个经审阅的 Apache-2.0 `html-anything` 正文 |

另外还定义了若干 reviewed connector profile，例如 AlphaFold DB public，
但它们目前不是单独打包 payload。

## 安装

```bash
npm install --save-dev linxira-skills
npx linxira-skills init
```

指定 profile：

```bash
npx linxira-skills init --profile core
npx linxira-skills init --profile life-sciences-core
npx linxira-skills init --profile html-reporting-core
```

## 第三方说明

本仓库不会把第三方技能伪装成原创内容。只有满足以下条件的第三方正文才会被纳入
payload：

- 固定 source revision
- 已核实 license
- 已保存所需 notice
- 已明确 payload 边界

例如：

- `life-sciences-core` 只纳入 4 个经审阅的 `bioSkills` 正文
- `html-reporting-core` 只纳入 3 个经审阅的 `html-anything` 正文
- 带外部示例引用的 `html-anything` 模板仍然只是 source-only
- `awesome-bio-agent-skills` 仍是研究索引源，不进入公开 payload

具体规则见：[docs/THIRD_PARTY.md](docs/THIRD_PARTY.md)

## 验证状态

当前发布草案已经完成：

- 一方技能元数据审计
- profile 生命周期测试
- 打包 tarball 安装烟测
- `npm pack --dry-run` 包内容检查
- GitHub Actions 在 Ubuntu / Windows / macOS 上的矩阵验证

Arch Linux WSL 路径也做过一轮本地 smoke 验证，用于补充 Linux 侧信心。
