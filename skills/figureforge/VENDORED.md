# VENDORED — figureforge

- **Upstream repository:** https://github.com/jing1312/nature-figure-skill
- **Upstream commit:** `af778027c866e2e6b3432b946e44a4a2b4434d82` (Wed Sep 9 04:40:43 2026 +0800)
- **License:** MIT (see `LICENSE`, copied verbatim from upstream and unchanged)

## 版权说明（双版权）

上游 `LICENSE` 的 MIT 许可声明包含两个版权主体：

- `Copyright (c) 2026 Yuan Yizhe (nature-* skill content)` —— 上游仓库 `nature-*` 技能内容的版权所有者；
- `Copyright (c) 2026 jing1312 (FigureForge editor, templates, and documentation)` —— FigureForge 编辑器、模板与文档的版权所有者。

本技能 **只收纳 FigureForge 的原创子树**（即 `figureforge/` 目录），对应上述第二个版权主体（© jing1312）。上游 `skills/` 下的 `nature-*` 技能内容一律未复制、未引用，因此本技能不涉及 © Yuan Yizhe 的内容。

`LICENSE` 文件按上游原样完整复制，故其中同时保留了两个版权行；实际适用范围以本节说明为准。

## 复制的文件清单

上游 `figureforge/` 子树整体复制到本技能 `app/`，共 25 个文件，逐字节一致：

```
app/README.md
app/index.html
app/css/style.css
app/css/workspace.css
app/js/ai-generate.js
app/js/app.js
app/js/build-showcase-apex.js
app/js/build-showcase-bio.js
app/js/build-showcase-extra.js
app/js/build-showcase-max.js
app/js/build-showcase-nova.js
app/js/build-showcase-plus.js
app/js/build-showcase-pro.js
app/js/build-showcase-ultra.js
app/js/build-showcase.js
app/js/canvas.js
app/js/daynight.js
app/js/export.js
app/js/history.js
app/js/library.js
app/js/palettes.js
app/js/properties.js
app/js/storage.js
app/js/templates.js
app/js/workspace.js
```

另复制上游根目录 `LICENSE` → `skills/figureforge/LICENSE`（原样）。

## 修改说明

**未修改 `app/` 内任何上游文件**（`diff -rq` 对上游 `figureforge/` 与 `skills/figureforge/app/` 无差异）。所有本技能自有的说明文字都写在包装文件（本 `VENDORED.md` 与同级 `SKILL.md`）中，与上游代码分离。

## 未随迁依赖 / unresolved references

- **导出增强库（CDN 按需加载）** —— `js/export.js` 与 `js/library.js` 在用户触发导出时从 jsDelivr 动态加载第三方库，未随迁到本地：
  - `pptxgenjs@3.12.0`（PPTX 导出）
  - `jspdf@2.5.2` + `svg2pdf.js@2.2.4`（矢量 PDF 导出）
  - `utif@3.1.0`（TIFF 解码）
  这些资源均在 `https://cdn.jsdelivr.net/...` 上按需拉取。**断网或 CDN 不可达时，PPTX / PDF / TIFF 导入导出功能不可用**；SVG / PNG / JSON 导出与编辑器其余功能不受影响。
- **素材广场图鉴（`../assets/*.svg`）** —— `js/workspace.js` 的素材广场通过 `fetch('../assets/showcase-*.svg')` 拉取 9 个 showcase 图鉴（共 83 面板）。这些 SVG 位于上游**仓库根目录 `assets/`**（由 `js/build-showcase-*.js` 脚本生成），不属于 `figureforge/` 子树，因此未随迁。缺失时广场图鉴缩略图加载失败并提示"请通过本地服务器访问"，但模板库与其余功能正常。
- **AI 生图（可选）** —— `js/ai-generate.js` 需要用户自行在 ⚙ 设置中配置任意 OpenAI 兼容端点（API base / key / model，存于 localStorage）。未配置 API key 时 ✨ 生成会明确提示并载入内置演示图形，不静默失败。该功能完全可选。
- 无其他指向仓库根文件的引用；`app/README.md` 中提及的 `nature-figure-skill` 仅作为设计知识来源的叙述，不含对上游其他子树文件的运行时依赖。
