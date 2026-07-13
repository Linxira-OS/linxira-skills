# Linxira Science Skills

这是 `@linxira-science-skills/cli` 的中文概览页。项目正文文档保持英文，便于
发布、审计和跨运行时复用。

English README: [README.md](README.md)

## 这是什么

Linxira Science Skills 是一个面向科学研究的跨运行时技能库。
当前仓库用于构建首个 npm 交付包，并保存：

- 一方技能
- 已审阅 profile
- 上游来源轨道
- 安装器与验证脚本
- 第三方来源与修改边界文档

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
npm install --save-dev @linxira-science-skills/cli
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
