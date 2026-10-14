---
name: figureforge
description: 需要在浏览器里手工精修矢量科研配图、搭建示意图/流程图，或把外部导入的 SVG 拆解成可逐元素拖动编辑的形状时使用。FigureForge 是纯前端 SVG 配图编辑器，零安装、无后端——本地打开 app/index.html 或用静态服务托管即可运行；内置 22 个出版级模板、16 套配色卡与 SVG/PNG/TIFF/PDF/PPTX/JSON 多格式导出。常与 ai-figure-prompting 配合：AI 出草稿 → FigureForge 精修 → 导出。
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# FigureForge

纯前端的可视化 SVG 科研配图编辑器：先选模板骨架，再填数据、逐元素手工精修，
最后导出投稿级图形。它把"移动图例、换色、放大某个 panel"这类改动从重画变成所见即所得的直接操作。

## 何时使用

| 需求 | 去向 |
|---|---|
| 手工精修一张矢量配图（移动/换色/改字/对齐） | 本技能 |
| 搭建示意图、流程图、版式骨架 | 本技能 |
| 把一个外部 SVG 拆成可逐个编辑的元素 | 本技能 |
| 从实测数值绘制数据图（散点/柱/箱线等） | `scientific-figures-and-tables`、`scientific-figure-style` |
| 用 AI 生成机制示意图的提示词与矢量化流程 | `ai-figure-prompting`（与本技能配合） |

## 使用方式

### 打开与验证步骤

1. **打开编辑器**（零安装，无构建、无依赖、无后端）：
   - 直接双击 `app/index.html` 在任意现代浏览器打开；或
   - 用静态服务托管（推荐，图标库需通过 HTTP 加载）：
     ```bash
     cd app && python3 -m http.server 8000
     # 打开 http://localhost:8000
     ```
2. **确认已就绪**：应看到顶部工具栏、左侧「图表」模板库、以及默认的无限画布。
   顶部可在 🪟 画布 / ✏️ 编辑器 两种模式间切换：画布用于拼版与一句话生成，编辑器用于单图逐元素精修。
3. **用模板起图**：左侧「图表」里选一个模板，或双击画布上的图形卡片进入编辑器；
   拖动、缩放、改色、双击改字，全部即时生效，`Ctrl+Z` 撤销。
4. **导入 / 拆解 SVG**：把 `.svg` 拖到画布（或点 📥 导入）。导入的图形会被**自动打散**：
   每个形状与文本叶子节点都被标记为可编辑，即便原文件带嵌套的 `<g transform>`，
   也能立刻逐元素选中、拖动、改属性。
5. **编辑位图（无需矢量源）**：导入 PNG/JPG/WebP/GIF（或 `Ctrl+V` 粘贴截图）后，
   双击图片可进入位图编辑——✂ 裁剪、旋转 90°/水平垂直翻转、亮度/对比度/饱和度、灰度/反相，
   以及"替换图片"；TIFF 在浏览器内经 UTIF 解码后同样可插入。
6. **导出**：`Ctrl+E`（或"导出…"）选择格式与分辨率。

### 能力清单

- **22 个出版级模板** —— 13 个图表模板（bar / grouped-bar / line / multi-line / scatter / pie /
  area / box / heatmap / forest / violin / km / volcano）+ 9 个版式模板
  （single / two-h / two-v / four-grid / title-caption / schematic / comp-ab / comp-abc / comp-hero），
  遵循 Nature 视觉语言：NPG 系低饱和配色、仅左+下轴、外向刻度、带帽误差棒、显著性括号、
  无框图例、可编辑文本（不转曲）。
- **16 套配色卡** —— 含 Tableau 10、Tol Muted、Seaborn Deep、Morandi 莫兰迪、Economist、
  Macaron 马卡龙、Candy 粉蓝绿黄紫、Berry 蓝紫粉同族，以及 Classic Nature / NMI Pastel /
  Nature Clinical / Material / Genomics / Imaging / Publication Soft / Blue Rose 等；
  一键换色会按 `data-series` 全图协同改色。
- **多格式导出** —— SVG（剥除编辑器私有属性）、PNG（可透明背景）、TIFF（手写 baseline 编码，
  内嵌 dpi 元数据，可直接投稿）、矢量 PDF、PPTX（单页幻灯片，尺寸与图形一致）、项目 JSON；
  分辨率预设 1× / 2× / 4× / 300 dpi / 600 dpi（按 mm 图幅换算像素）。
- **无限画布工作区** —— 节点卡片、参考连线、素材广场、一句话生成、`Ctrl+V` 粘贴截图，
  节点/连线/相机自动存入 localStorage 并在重开时恢复。
- **直接操作** —— 多选、成组、对齐分布、格式刷、智能吸附参考线、右键菜单、缩放适配、
  上下文属性面板（文本/矩形/圆/线/路径）。
- **AI 生图（可选）** —— 内嵌出版级设计规则作为系统提示，用任意 OpenAI 兼容端点生成 SVG；
  未配置 API key 时会明确提示并载入内置演示图形，不会静默失败。

### 与 ai-figure-prompting 配合

推荐流水线：**AI 草稿 → FigureForge 精修 → 导出**。
用 `ai-figure-prompting` 生成示意图/机制图的提示词与初始矢量，得到 SVG 后导入本编辑器，
把标签重新排成可编辑矢量文本、统一配色与版式，再按目标期刊尺寸与 dpi 导出。
AI 生成的 panel 始终按"示意图"标注，不得充当实验证据。

## 边界

- **浏览器运行**：纯前端，无后端、无构建步骤；需要现代浏览器。依赖 localStorage 保存会话，
  导入/导出通过浏览器文件 API，无法在无头/无 GUI 环境直接交互。
- **导出增强依赖 CDN**：PPTX / 矢量 PDF / TIFF 解码在用户触发时从 jsDelivr 按需加载
  pptxgenjs / jsPDF+svg2pdf / UTIF。**断网或 CDN 不可达时这些格式不可用**；
  SVG / PNG / JSON 导出与编辑器其余功能不受影响。
- **素材广场图鉴**：画布「素材广场」通过 `../assets/showcase-*.svg` 拉取 9 个 showcase 图鉴
  （83 面板）。这些 SVG 属于上游仓库根 `assets/`，未随本技能迁入，缺失时图鉴缩略图加载失败并提示
  "请通过本地服务器访问"；模板库与其余功能正常。
- **不是数据绘图工具**：本技能面向矢量配图的编辑与版式搭建，模板是可视化骨架与示意，
  不执行统计分析、不绑定真实数据集；从实测数值绘图请用 `scientific-figures-and-tables` 等技能。
- **AI 生图需自配 key**：AI 生成功能为可选，需用户在 ⚙ 设置中提供 OpenAI 兼容端点（API base / key / model）。

## Completion Criteria

- 编辑器在本机打开，模板库、画布与编辑器可正常切换。
- 目标图形完成逐元素精修：标签为可编辑矢量文本，配色/字号/线宽符合目标期刊风格。
- 导出格式与分辨率满足投稿要求（如 300 dpi 的 TIFF/PDF），且导出前已确认所需 CDN 可达。
- 若其中含 AI 生成的 panel，已在图注中明确标注为示意图。

## Citation

```text
Linxira OS. Linxira Skills: figureforge. Version 0.1.0.
Skill path: skills/figureforge/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
