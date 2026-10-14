# MCP 领域清单（已核实）

核实日期：2026-10-14。除标注 `unverified` 外，命令与地址取自上游 README/官方文档。
远程 URL 需客户端支持 HTTP transport；`npx` 需 Node.js，`uvx` 需 uv。安装前先看
各条「风险」，并按 `integrate.md` 做信任边界检查。

## 开发协作

### GitHub MCP Server

- 干什么：官方服务器，PR、issue、代码检索、Actions/CI 等工具集。
- 安装：远程 HTTP `https://api.githubcopilot.com/mcp/`；只读加 `/readonly`，
  按工具集加 `/x/<toolset>`。宿主不支持远程时用 Docker
  `ghcr.io/github/github-mcp-server`。
- 验证：查询任一仓库的只读 PR/issue。
- 风险：account-bound、privileged ｜ https://github.com/github/github-mcp-server

## 文档检索

### Context7

- 干什么：按提示拉取库/框架的最新文档，减少过时 API 幻觉。
- 安装：`npx -y @upstash/context7-mcp`（可选 `--api-key <key>`）。
- 验证：对任一库名查询文档，确认有命中。
- 风险：无 ｜ https://github.com/upstash/context7

## 本地文件与记忆

### 官方 reference servers

- 干什么：`filesystem` 读写授权目录、`memory` 持久记忆、
  `sequential-thinking` 思维链。Postgres 等旧服务器已移入
  `servers-archived`，不再维护。
- 安装：`npx -y @modelcontextprotocol/server-filesystem /path`；
  `npx -y @modelcontextprotocol/server-memory`。
- 验证：列目录或写一条记忆再读回。
- 风险：destructive ｜ https://github.com/modelcontextprotocol/servers

## 浏览器

### Playwright MCP

- 干什么：用真实浏览器导航、点击、填表、截图、断言。
- 安装：`npx @playwright/mcp@latest`（`--port` 可切 HTTP 模式）。
- 验证：打开一个页面并截图/取标题。
- 风险：account-bound ｜ https://github.com/microsoft/playwright-mcp

### Chrome DevTools MCP

- 干什么：控制并检查本机 Chrome，含性能追踪、网络与控制台。
- 安装：`npx -y chrome-devtools-mcp@latest`（可接已在跑的
  `--browser-url=http://127.0.0.1:9222`）。
- 验证：列出页面或抓取一次网络请求。
- 风险：privileged ｜ https://github.com/ChromeDevTools/chrome-devtools-mcp

## 设计

### Figma MCP

- 干什么：读取 Figma 设计上下文、变量、组件与代码连接信息。
- 安装：远程 `https://mcp.figma.com/mcp`（推荐）；Dev Mode 本地服务器
  `http://127.0.0.1:3845/mcp`（须在 Figma 桌面端启用）。
- 验证：选取一个文件返回节点/变量。
- 风险：account-bound ｜ https://developers.figma.com/docs/figma-mcp-server/

### OpenDesign MCP

- 干什么：本地优先设计工作区（守护进程 `127.0.0.1:7456`），支持 brief、
  项目、工件读写与生成委托。
- 安装：先装 `od` CLI 与守护进程，再 `od mcp install <agent>`；契约见
  `../../open-design/SKILL.md`。
- 验证：`list_projects` 或 `get_active_context` 有响应（否则 daemon 未运行）。
- 风险：destructive ｜ https://github.com/nexu-io/open-design

## 数据库

### Supabase MCP

- 干什么：查询/管理 Postgres、Supabase 项目、迁移与类型。
- 安装：远程 `https://mcp.supabase.com/mcp?project_ref=<ref>&read_only=true`；
  本地 `npx -y @supabase/mcp-server-supabase@latest --read-only
  --project-ref=<ref>`。
- 验证：列出表并跑一条只读查询。
- 风险：destructive、account-bound ｜ https://github.com/supabase/mcp

## 网络搜索

### Brave Search MCP

- 干什么：Web/新闻/图片/本地等检索，独立于宿主内置搜索。
- 安装：`npx -y @brave/brave-search-mcp-server --brave-api-key <key>`。
- 验证：一次 web 搜索返回结果。
- 风险：paid（需 Brave Search API key）｜ https://github.com/brave/brave-search-mcp-server

## 知识库

### Notion MCP

- 干什么：语义搜索、读写 Notion 页面与数据库。
- 安装：远程 `https://mcp.notion.com/mcp`（官方主推）；本地
  `npx -y @notionhq/notion-mcp-server`（env `NOTION_TOKEN`）。
- 验证：搜索工作区返回页面。
- 风险：account-bound、destructive ｜ https://github.com/makenotion/notion-mcp-server

## 可观测性

### Sentry MCP

- 干什么：按自然语言查错误、性能、issue 与项目。
- 安装：远程 `https://mcp.sentry.dev/mcp`（OAuth，可加 `/{org}/{project}`）。
- 验证：列出一个组织的 issue。
- 风险：account-bound ｜ https://docs.sentry.io/ai/mcp/

## 科学与科研数据

### Hugging Face MCP

- 干什么：检索 Hub 上的模型、数据集、Spaces、论文与集合。
- 安装：远程 `https://huggingface.co/mcp`（`?login` 可带账号）。
- 验证：检索一个模型返回结果。
- 风险：account-bound ｜ https://github.com/huggingface/hf-mcp-server

### arXiv MCP

- 干什么：检索 arXiv、读取元数据、本地保存与 LaTeX 读取。
- 安装：`uvx arxiv-mcp-server`。
- 验证：搜索一个主题返回论文列表。
- 风险：无 ｜ https://github.com/blazickjp/arxiv-mcp-server

### PubMed MCP

- 干什么：检索、访问并分析 PubMed 文献。
- 安装：`git clone` 后 `pip install -r requirements.txt`，客户端
  `command=python` 指向 `pubmed_server.py`（无单行分发，`unverified`）。
- 验证：关键词检索返回 PMID。
- 风险：无 ｜ https://github.com/JackKuo666/PubMed-MCP-Server

### AlphaFold MCP

- 干什么：访问 AlphaFold Protein Structure Database 的结构与注释。
- 安装：`git clone` → `npm install && npm run build` → 客户端
  `command=node build/index.js`（社区维护，`unverified`）。
- 验证：按 UniProt ID 取结构。
- 风险：无 ｜ https://github.com/Augmented-Nature/AlphaFold-MCP-Server

## 发现入口

- 官方 Registry：https://registry.modelcontextprotocol.io ｜ 仓库：https://github.com/modelcontextprotocol/registry ｜ 参考实现：https://github.com/modelcontextprotocol/servers

未在官方 Registry 或上游仓库确认的服务器一律标 `unverified`，不要直接安装。
