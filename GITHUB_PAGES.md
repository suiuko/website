# 部署到 GitHub Pages + 自定义域名 + NAS 图床

## 整体架构

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  GitHub Pages            │  ──图──▶│  NAS · Chevereto         │
│  HTML/CSS/JS             │         │  zgjnas.top:8111         │
│  web.mellowing.uk        │         │  (HTTP)                  │
└──────────────────────────┘         └──────────────────────────┘
       ▲                                      ▲
       │ git push                             │ 手动上传到图床
       │                                      │ 复制 URL → 工具录入
   你的电脑 ───────────────────────────────────┘
```

代码 (轻量、文本) 走 Git；图片 (大文件、二进制) 走 NAS。两边互不污染。

---

## ⚠️ 关键问题：HTTPS 混合内容

GitHub Pages **默认会启用 HTTPS**，但 NAS 是 HTTP。如果网站走 HTTPS，
浏览器会**拒绝加载** HTTP 图片（"Mixed Content" 拦截）。

### 解决方法（二选一）

**方案 A · 简单：让网站也走 HTTP（短期可行）**
- DNS 走 Cloudflare → CNAME 指向 `<user>.github.io`
- Cloudflare SSL 模式设为 **Off**（不强制 HTTPS）
- GitHub Pages 设置里**不要勾** "Enforce HTTPS"
- 优点：5 分钟搞定
- 缺点：现代浏览器会标 "不安全"

**方案 B · 推荐长期：用 Cloudflare 给 NAS 套 HTTPS**
- 在 Cloudflare 加一条 A 记录：`img.mellowing.uk` → 你 NAS 的公网 IP
- 开启橙云（proxied）
- Cloudflare SSL/TLS 设为 **Flexible**（CF→NAS 走 HTTP，访客→CF 走 HTTPS）
- 图片 URL 从 `http://www.zgjnas.top:8111/images/...`
  改成 `https://img.mellowing.uk/images/...`
- 网站和图床都走 HTTPS，没问题
- 缺点：要改 Chevereto 的 site URL 配置；NAS 端口 8111 需要 Cloudflare 能访问到

---

## 第一步：创建 GitHub 仓库 & push 代码

```bash
cd /path/to/this/project

git init
git add .
git commit -m "initial site"

# 在 GitHub 创建空仓库 my-website (建议 public，private 也能用 Pages 但要 Pro)
git branch -M main
git remote add origin https://github.com/<your-username>/my-website.git
git push -u origin main
```

## 第二步：开启 GitHub Pages

1. 仓库 → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/ (root)`
4. **Save**

几分钟后会拿到 `https://<username>.github.io/my-website/` 的临时地址。

## 第三步：绑定 web.mellowing.uk

项目里已经放了 `CNAME` 文件，内容是 `web.mellowing.uk`，GitHub Pages 会
自动识别。

### DNS 设置（在 Cloudflare 上）

加一条 **CNAME** 记录：
```
Type:    CNAME
Name:    web
Target:  <username>.github.io
Proxy:   ☁️ (橙云)  ← 重要，下面解释
```

### Cloudflare SSL 模式（按你选的方案）

**方案 A**: SSL/TLS → Overview → **Off**
**方案 B**: SSL/TLS → Overview → **Flexible**（推荐）或 **Full**

### GitHub Pages 自定义域名

回到仓库 → Settings → Pages：
- **Custom domain**: `web.mellowing.uk` → Save
- **Enforce HTTPS**:
  - 方案 A: ❌ **不要勾**
  - 方案 B: ✅ **勾上**

## 第四步：图片工作流

每次想加一批新照片：

1. 把照片传到 Chevereto 图床（NAS 上的 `zgjnas.top:8111`）
2. 在 Chevereto 里点开图片 → 复制直链 URL
3. 本地打开 `tools/photo-import.html`（双击就行）
4. 填月份/城市信息 → 粘贴一组 URL/文件名 → 录入 caption
5. 工具会**逐张验证 URL 可访问** （✓ 绿勾 / 红 404）
6. 点 "复制代码" → 粘贴到 `src/data.jsx` 对应位置
7. `git push` → GitHub Pages 自动部署 → 30 秒后线上更新

## 第五步：验证

部署完成后访问 `http://web.mellowing.uk/` (或 https，按方案)：
- 进入 `/darkroom`
- 点开有真图的相册
- 应该能看到从 NAS 加载出来的照片
- 如果 NAS 挂了或 URL 写错，会自动降级为彩色占位条纹（不会白屏）

---

## 故障排查

| 现象 | 排查 |
|---|---|
| GitHub Pages 一直 building | 等 1-3 分钟；Settings → Pages 看状态 |
| 域名访问 404 | 检查 CNAME 文件和 GitHub Pages 的 Custom domain 是否一致 |
| 图片全是占位条纹 | 浏览器 DevTools → Network 看图片请求是 200 还是 mixed-content blocked |
| 部分图片显示 部分占位 | 那几张的 URL 写错了或 NAS 上没传；检查 Chevereto 后台 |
| Mixed Content 警告 | 你处于 HTTPS 网站 + HTTP 图床的不兼容状态 → 切到方案 B |

## 删掉旧的 Azure 部署（可选）

如果决定彻底搬到 GitHub Pages：
- Azure VM 可以保留备份，或停机省钱
- 旧 `DEPLOY.md` / `PHOTOS.md` 里的 rsync 流程不再需要
- `scripts/sync-photos.sh` 相关的脚本可以删掉（图片走 Chevereto 了）
