# 内容管理指南

站点支持**从 Markdown 文件加载内容**（用 VS Code / Obsidian 在本地写，push 到 GitHub 即可）。
图片走 NAS Chevereto 图床（见 `GITHUB_PAGES.md`）；文字走 Git。

## 目录结构

```
/content/
  manifest.json          ← 列出所有文件（必须）
  notes/
    diffusion-intuition.md
    xian-ramen.md
    ...
  albums/
    2026-04.md           ← 按月份归档
    ...
  projects/
    sparse-attn-bench.md
    ...
```

## manifest.json 格式

```json
{
  "notes":    ["diffusion-intuition.md", "xian-ramen.md"],
  "albums":   ["2026-04.md", "2026-03.md"],
  "projects": ["sparse-attn-bench.md"]
}
```

## Notes 文件格式

```markdown
---
title: Diffusion 模型的一个小直觉
date: 2026-04-12
tags: [research, ml, thinking]
mood: 🧠
loc: Cambridge
public: true
excerpt: 把去噪过程理解成「雕刻」而不是「生成」...
---

# Diffusion 模型的一个小直觉

正文用标准 Markdown...
```

## Albums (照片) — 推荐用 photo-import.html 工具

照片相册的元信息和帧列表**直接维护在 `src/data.jsx`**，
原因：frames 数组结构嵌套深，YAML front-matter 写起来麻烦。

工作流：
1. 把图传到 NAS Chevereto 图床
2. 打开 `tools/photo-import.html`（双击即可）
3. 填月份/城市信息 + 粘贴 NAS URL 或文件名
4. 复制生成的代码 → 粘贴到 `src/data.jsx` 对应位置
5. `git push` → GitHub Pages 自动部署

详见 `GITHUB_PAGES.md`。

## Projects 文件格式

```markdown
---
idx: "01"
name: sparse-attn-bench
desc: benchmark suite for sparse attention kernels @ scale
tags: [ml, systems, oss]
year: 2026—
status: ongoing
github: github.com/gaojing/sparse-attn-bench
collab: [S. Wu, J. Park]
citations: 0
---

## 长篇介绍（可选）

这里写项目的详细故事...
```

## 部署流程

```bash
git add .
git commit -m "..."
git push
```

GitHub Pages 自动部署，约 30 秒后 `web.mellowing.uk` 上线更新。

## Fallback

如果 `/content/manifest.json` 不存在，站点会自动 fallback 到 `src/data.jsx`
里的示例数据，不会报错。
