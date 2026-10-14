---
name: open-design
description: 当需要连接或操作 OpenDesign 本地设计工作区（其官方 stdio MCP）时使用。覆盖安装与守护进程前提、fail-closed 验证、22 个工具与 4 个资源、brief 到生成的工作流，以及硬性边界；不是通用设计技能。
compatibility: "需要本机可执行的 od CLI 与运行中的 OpenDesign 守护进程（http://127.0.0.1:7456）。桌面安装器或源码构建提供 od；未安装或守护进程未运行时本技能不可用，须先按 Requirements 安装并启动。"
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# OpenDesign MCP Contract

OpenDesign 是本地优先的设计工作区（Next.js + Electron 前端 + Express/SQLite
守护进程，监听 `127.0.0.1:7456`），官方提供 stdio MCP。生成类工作是委托本机
agent CLI 执行，MCP 本身不含生成引擎。

## Requirements

运行前必须同时满足：

1. **od CLI**。无 npm 分发，来自：
   - 桌面安装器（macOS `.dmg` / Windows `.exe`）；
   - 源码构建（Node ~24 + pnpm 10.33；Linux 无预编译包，必须源码构建）。
2. **守护进程**。`127.0.0.1:7456` 必须在运行，否则所有工具报
   `daemon not reachable`。
3. **客户端注册**。`.mcp.json`：
   `{"mcpServers":{"open-design":{"command":"od","args":["mcp","--daemon-url","http://127.0.0.1:7456"]}}}`；
   或用 `od mcp install <agent>`（支持 claude / codex / cursor / opencode 等
   16+ 客户端）自动写入。

Docker 安装不支持 stdio MCP；需 stdio 时必须用原生安装。

## Verification

fail-closed，先探测再操作：

1. 确认 `od` 可执行且守护进程在线（`od mcp install` 或客户端连接测试）。
2. 调 `get_active_context`（推荐）或 `list_projects` 探测。
3. 若返回 `daemon not reachable` / 连接失败：**输出安装指引并停止**，不要
   伪造结果，也不要改用其它路径绕过。
4. 只有探测成功后才继续读/写/生成。

## Tools

按用途分组（共 22 个）。写操作一律先与用户确认目标与影响。

- **读取/上下文（7）**：`list_projects`、`get_active_context`、`get_project`、
  `get_file`、`search_files`、`list_files`、`get_artifact`
- **写入/变更（5，destructive）**：`create_project`、`create_artifact`、
  `write_file`、`delete_file`、`delete_project`
- **发现/能力（3）**：`list_skills`、`list_plugins`、`list_agents`
- **意图/brief（2）**：`collect_brief`、`confirm_brief`
- **委托/生成（3）**：`start_run`、`get_run`、`cancel_run`
- **Vela 登录（2）**：`start_vela_login`、`get_vela_login_status`

**资源（4）**：

- `ui://artifact-card`：方向选择卡（供用户确认方向）。
- `od://focus/active`：当前活动焦点。
- `od://skills/<id>/SKILL.md`：本机已装技能的说明。
- `od://design-systems/<id>/DESIGN.md`：设计系统说明。

## Workflow

1. **收集 brief**：调 `collect_brief` 汇总需求，必要时 `get_active_context`
   读取当前项目。
2. **确认方向**：调 `confirm_brief`，必要时通过 `ui://artifact-card` 让用户
   在候选方向中拍板。
3. **准备项目/工件**：`create_project` / `write_file` / `create_artifact`，
   写入前与用户确认目标路径与内容。
4. **生成**：`start_run` 提交生成任务；任务是委托本机 agent CLI 执行。
5. **轮询**：反复 `get_run` 查状态，需要时 `cancel_run`；不要空转刷屏。
6. **取结果**：`get_artifact` 取回产物（HTML/CSS 设计工件，含 PPTX 导出由
   技能驱动）。

与本地技能叠加：本地设计/规范技能定标准与内容，OpenDesign 负责执行与产出；
读回产物后再判定完成，产物为可再编辑的设计工件。

## Boundaries

- **无 critique 工具**：不做设计评审/评分，需要时用本地技能。
- **无 token-map 工具**：拿不到设计令牌映射，勿假设存在。
- **模板目录不经 MCP 暴露**：模板需走 CLI/文件系统，别通过工具找。
- **无 `prompts/list`**：提示词不能从 MCP 枚举。
- **上下文过期**：active project 上下文约 5 分钟过期，跨步骤前重新探测。
- **`/usr/bin/od` 遮蔽坑**：macOS/WSL 上系统自带 `od` 会遮蔽真正的 CLI；
  用绝对路径或修正 PATH。
- **Docker 不支持 stdio**：容器安装无法用于 stdio MCP。
- **写操作前确认**：`create_*` / `write_file` / `delete_*` 一律先经用户同意。
- **守护进程必须在线**：否则整体不可用，按 Verification 停止。

## Citation

```text
Linxira OS. Linxira Skills: open-design. Version 0.1.0.
Skill path: skills/open-design/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
