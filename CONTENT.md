# 内容管理指南

这个站点现在支持**从 Markdown 文件加载内容**。你可以在本地用 VS Code 或 Obsidian 写 `.md` 文件，push 到 GitHub，VPS 上 `git pull` 就更新。

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
    2026-03.md
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

## Albums 文件格式（按月）

一个月一个文件，包含这个月去的所有城市：

```markdown
---
month: 2026.04
label: April 2026
cities:
  - id: vienna-2026-04
    title: Vienna
    sub: Wien
    country: AT
    countryName: Austria
    lat: 48.21
    lon: 16.37
    frameCount: 12
    coverSeed: 11
    story: "Schönbrunn 下雨，咖啡馆暖得不想走。"
    frames:
      - { cap: "Schönbrunn", date: "04.12", meta: "FUJI X100V" }
      - { cap: "café central", date: "04.13", meta: "PORTRA 400" }
  - id: london-2026-04
    title: London
    sub: 伦敦
    country: GB
    countryName: United Kingdom
    lat: 51.51
    lon: -0.13
    frameCount: 8
    coverSeed: 12
    story: "去看老朋友，Hyde Park 走了很久。"
    frames:
      - { cap: "Hyde Park", date: "04.22", meta: "FUJI" }
---

(可选：这个月的整体感想正文...)
```

> 注：由于简易 front-matter 解析器不支持复杂嵌套 YAML，**推荐把每个月的城市信息放在 data.jsx 里维护**，或者我帮你升级加一个小 YAML 解析库。用 data.jsx 维护的方式和当前一致。

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

1. 在本地写 `.md` → `git commit && git push`
2. 服务器上：`cd /var/www/site && git pull`（或配个 webhook 自动化）
3. Caddy 配置：

```caddyfile
your-domain.com {
  root * /var/www/site
  file_server
  encode gzip
}
```

## 不接 markdown 的情况

如果 `/content/manifest.json` 不存在，站点会自动 fallback 到 `src/data.jsx` 里的示例数据，不会报错。
