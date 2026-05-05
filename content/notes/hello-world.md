---
title: Hello, world — 一篇示例 note 兼说明书
date: 2026-05-02
tags: [meta, howto, 中文]
mood: 📝
loc: Brighton
public: true
excerpt: 这是一篇写给你自己看的 note。它本身就是一份「如何写新 note」的速查手册——抄一份、改改字段、就能开始写自己的内容了。
---

# Hello, world

这是站点的第一篇示例 note。它的存在有两个目的：

1. 让你 **看到** 一篇 note 在站点上长什么样（标题、日期、tags、正文渲染、代码块、引用……）
2. 让你 **抄走** 它的 front-matter 当模板用

如果你正在 notes 页看到这篇 —— 说明 markdown 加载流程跑通了 ✅。

---

## 1. 文件放在哪里

```
项目根目录/
├── index.html
├── content/
│   ├── manifest.json         ← 必须有，告诉站点哪些文件需要加载
│   └── notes/
│       ├── hello-world.md    ← 就是这个文件
│       └── 你的下一篇.md
```

> 文件名建议用 **kebab-case 英文 + `.md`**（如 `vln-progress-week-1.md`），
> 中文文件名也能用，但 URL 会变得很丑，不推荐。

---

## 2. manifest.json 怎么写

每加一篇新 note，就在 `manifest.json` 的 `notes` 数组里加一行：

```json
{
  "notes": [
    "hello-world.md",
    "vln-progress-week-1.md",
    "brighton-coffee-map.md"
  ],
  "albums": [],
  "projects": []
}
```

> ⚠️ **没列进 manifest 的文件不会被加载** —— 即使它已经在 `content/notes/` 里。

---

## 3. front-matter 字段说明

每篇 note 的开头都是一段 YAML，由两行 `---` 包起来：

```markdown
---
title: 一篇笔记的标题
date: 2026-05-02
tags: [research, ml, thinking]
mood: 🧠
loc: Brighton
public: true
excerpt: （可选）列表预览文字
---

正文从这里开始……
```

| 字段 | 必填 | 类型 | 说明 |
|---|:-:|---|---|
| `title` | ✅ | 字符串 | 笔记标题，**不要加引号** |
| `date` | ✅ | `YYYY-MM-DD` | 排序依据，新→旧 |
| `tags` | ⭕ | 数组 `[a, b, c]` | 标签，**必须单行内联**，元素不要加引号 |
| `mood` | ⭕ | emoji | 一个 emoji，会显示在卡片上 |
| `loc` | ⭕ | 字符串 | 写作地点，如 `Brighton` |
| `public` | ⭕ | `true` / `false` | 默认 `true`；`false` 就是草稿、不显示 |
| `excerpt` | ⭕ | 字符串 | 列表预览。**不写的话**会自动截取正文前 160 字 |

### 几个常见坑

- ❌ `tags: ["a", "b"]` —— **不要加引号**，写成 `tags: [a, b]`
- ❌ tags 跨多行 —— parser 只读一行，别用 YAML 多行数组语法
- ❌ 字符串值加引号 —— `title: "foo"` 会被当成 `"foo"`（带引号）
- ✅ `---` 上下各占一整行，不要漏

---

## 4. 正文支持的语法

正文是标准 Markdown。你可以用：

### 标题

```markdown
# H1（每篇一般只用一个）
## H2
### H3
```

### 列表 / 引用

- 苹果
- 香蕉
- 火龙果

> 一段引用。Sutton 那句被引爆的话总是会出现在这种地方。

### 代码块

行内 `code` 没问题，块状的也可以指定语言：

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
```

```bash
git add content/notes/my-new-note.md
git commit -m "add: my new note"
git push
```

### 强调 & 链接

**粗体**、*斜体*、~~删除线~~、[一个链接](https://example.com)。

### 中英混排

中文段落里穿插 English words 是没问题的。Garamond + Noto Serif SC 的搭配让两种语言看起来不会打架。

---

## 5. 完整工作流

```bash
# 1. 在 content/notes/ 里新建文件
touch content/notes/my-new-note.md

# 2. 写内容（front-matter + 正文）

# 3. 把文件名加进 manifest.json

# 4. 本地预览（项目根目录起一个 http server）
python3 -m http.server 8000
# 打开 http://localhost:8000

# 5. 强刷浏览器（Cmd+Shift+R）—— 新 note 出现在 notes 页

# 6. 满意后推到 GitHub
git add content/
git commit -m "note: my new note"
git push
```

---

## 6. Fallback 行为

如果 `content/manifest.json` 缺失或加载失败，站点会**自动用 `src/data.jsx` 里的示例数据**，控制台会打印一行提示，**不会崩溃**。

所以：
- 想一边写一边调，可以删掉 manifest 临时回到示例数据
- 想清空示例数据只看自己的 note，把 manifest 写好就行（`src/data.jsx` 里的会被覆盖）

---

## 7. 把这篇当模板

最快的开始方式：

1. **复制** 这个文件，重命名为你的新 note
2. 改 front-matter 的 `title` / `date` / `tags`
3. 删掉所有正文，开始写自己的
4. 把新文件名加进 `manifest.json`
5. 刷新浏览器

写起来吧 ☕
