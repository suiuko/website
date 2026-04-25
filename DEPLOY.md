# 部署指南 · Ubuntu + Azure + Cloudflare

## 前置条件

- ✅ Azure Ubuntu VM
- ✅ 域名 DNS 已经在 Cloudflare 指向服务器 IP
- ✅ 本地 VSCode 写 `.md`

---

## 第 1 步：服务器初始化（5 分钟）

SSH 登录你的 Azure VM 后执行：

```bash
# 基础工具
sudo apt update && sudo apt upgrade -y
sudo apt install -y git rsync ufw imagemagick

# 开放 80/443 端口
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

**Azure 网络安全组（重要）**：
在 Azure Portal → 你的 VM → Networking → Network security group → 入站规则，确保放开 **80 和 443** 端口（Azure 默认只开 22）。

---

## 第 2 步：安装 Caddy（自动 HTTPS）

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

---

## 第 3 步：Cloudflare SSL 模式配置（关键！）

登录 Cloudflare → 你的域名 → SSL/TLS → Overview：

- **推荐：设为 "Full (strict)"**
- 这样 Caddy 会向 Let's Encrypt 申请证书，全链路加密

**如果你暂时设为 "Flexible"**，访客 → Cloudflare 是 https，但 Cloudflare → 你服务器是 http，Caddy 需要额外配置。先用 Full (strict) 最简单。

⚠️ **代理状态（橙色云 vs 灰色云）**：
- 如果是**橙色云（proxied）**：Let's Encrypt 挑战会被 Cloudflare 拦，Caddy 拿不到证书。**第一次申请证书前，先把 DNS 切成灰色云（DNS only），拿到证书后再切回橙色云**。
- 或者用 Cloudflare 的 Origin Certificate（它自己签的 15 年证书），不走 Let's Encrypt。

---

## 第 4 步：部署代码

```bash
# 建目录
sudo mkdir -p /var/www/site
sudo chown -R $USER:$USER /var/www/site

# 克隆你的仓库（把 URL 换成你的）
cd /var/www
git clone https://github.com/YOU/your-site-repo.git site

# 照片目录（不在 git 里，单独的）
mkdir -p /var/www/site/content/photos
```

---

## 第 5 步：Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

内容（把 `yourdomain.com` 改成你的域名）：

```caddyfile
yourdomain.com, www.yourdomain.com {
  root * /var/www/site
  file_server
  encode gzip zstd

  # 缓存策略
  @static {
    path *.jpg *.jpeg *.png *.webp *.woff2 *.woff *.ttf
  }
  header @static Cache-Control "public, max-age=31536000, immutable"

  @html {
    path *.html *.css *.js
  }
  header @html Cache-Control "public, max-age=300"

  # 安全头
  header {
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    Referrer-Policy strict-origin-when-cross-origin
  }

  # content/photos 路径特殊处理 —— 长缓存
  @photos path /content/photos/*
  header @photos Cache-Control "public, max-age=31536000, immutable"
}
```

启动：

```bash
sudo systemctl enable --now caddy
sudo systemctl reload caddy
sudo journalctl -u caddy -f  # 查看日志，确认证书申请成功
```

---

## 第 6 步：照片同步（本地操作）

本地建一个脚本 `scripts/upload-photos.sh`：

```bash
#!/bin/bash
# 用法：./scripts/upload-photos.sh 2026-04/vienna
# 前提：本地照片放在 ~/Photos/2026-04/vienna/

TARGET=$1
if [ -z "$TARGET" ]; then
  echo "usage: ./upload-photos.sh <month>/<city>  (e.g. 2026-04/vienna)"
  exit 1
fi

LOCAL=~/Photos/$TARGET/
REMOTE=user@yourserver:/var/www/site/content/photos/$TARGET/

rsync -avz --progress --ignore-existing \
  --include="*.jpg" --include="*.jpeg" --include="*.png" \
  --exclude="*" \
  "$LOCAL" "$REMOTE"

# 远程生成缩略图
ssh user@yourserver "cd /var/www/site/content/photos/$TARGET && \
  mkdir -p thumbs && \
  for f in *.jpg *.jpeg *.png; do \
    [ -f \"\$f\" ] && [ ! -f \"thumbs/\$f\" ] && \
    convert \"\$f\" -resize '800x800>' -quality 82 \"thumbs/\$f\"; \
  done"
```

用法：
```bash
chmod +x scripts/upload-photos.sh
./scripts/upload-photos.sh 2026-04/vienna
```

---

## 第 7 步：本地 VSCode 工作流

本地仓库结构：

```
your-site-repo/
  index.html
  src/
  content/
    notes/
      *.md         ← 这里写笔记
    albums/
      2026-04.md   ← 月份元数据
    projects/
      *.md
  scripts/
    upload-photos.sh
    deploy.sh
  .gitignore       ← 忽略 content/photos/
```

写完后三步：
```bash
git add .
git commit -m "add vienna trip notes"
git push
```

---

## 第 8 步：服务器一键部署脚本

服务器上 `~/deploy.sh`：

```bash
#!/bin/bash
set -e
cd /var/www/site
git pull --rebase
echo "✓ deployed at $(date)"
```

```bash
chmod +x ~/deploy.sh
```

每次 push 后 SSH 到服务器跑 `~/deploy.sh` 即可。

---

## 第 9 步（可选）：GitHub Actions 自动部署

在仓库 `.github/workflows/deploy.yml`：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: /home/${{ secrets.SERVER_USER }}/deploy.sh
```

在 GitHub 仓库 Settings → Secrets 添加：
- `SERVER_HOST` = 服务器 IP
- `SERVER_USER` = SSH 用户名
- `SSH_KEY` = 你的 SSH 私钥内容

push 后自动部署，无需手动 SSH。

---

## 常见问题

**Q: 访问 yourdomain.com 白屏？**
- `sudo journalctl -u caddy -n 50` 看日志
- 检查 Azure NSG 入站规则是否开 80/443
- `curl -I http://yourdomain.com` 看有没有响应

**Q: 证书申请失败？**
- 大概率是 Cloudflare 是橙色云。先切灰色云，拿到证书再切橙色云。
- 或者用 Cloudflare Origin Cert + Caddy 的 `tls` 指令指定证书文件。

**Q: 照片上传后前端看不到？**
- 检查 `content/manifest.json` 是否引用了照片路径
- 检查文件权限 `chmod -R 755 /var/www/site/content/photos`

**Q: GitHub Actions 部署失败？**
- SSH key 格式要完整（包括 BEGIN/END 行）
- 服务器上 `~/.ssh/authorized_keys` 要包含 CI 用的公钥

---

## 维护日常

| 场景 | 操作 |
|---|---|
| 写新笔记 | VSCode → 编辑 `.md` → `git push` |
| 加新月份相册 | 编辑 `src/data.jsx` 或 `content/albums/2026-XX.md` → push |
| 传一批照片 | `./scripts/upload-photos.sh 2026-XX/city` |
| 手动部署 | SSH → `~/deploy.sh` |
| 查日志 | `sudo journalctl -u caddy -n 100` |

**无后台，无数据库，无登录，全部是文件。想迁移？tar 一下 `/var/www/site/` 搬到任何机器就能跑。**
