#!/bin/bash
# 服务器部署脚本 —— 放在服务器的 ~/deploy.sh
# 用法：~/deploy.sh
# 或 GitHub Actions 自动触发

set -e
SITE_DIR="/var/www/site"

cd "$SITE_DIR"
echo "→ pulling latest..."
git pull --rebase

echo "→ rebuilding manifest..."
if [ -f scripts/build-manifest.sh ]; then
  bash scripts/build-manifest.sh
fi

# 如果以后加了构建步骤（比如 npm run build），放这里
# npm ci --production && npm run build

echo "✓ deployed at $(date)"
