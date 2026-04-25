#!/bin/bash
# 一键把整个本地照片目录推到服务器
# 本地目录结构 = 服务器目录结构（完全镜像）
# 本地改了什么、删了什么，服务器同步改、同步删
#
# 用法：
#   ./scripts/sync-photos.sh              # 完整同步
#   ./scripts/sync-photos.sh --dry-run    # 预演不执行
#   ./scripts/sync-photos.sh 2026-04      # 只同步某一个月/子目录

# ==== 配置你的服务器信息（首次使用请修改）====
REMOTE_USER="your-username"
REMOTE_HOST="your-server-ip-or-domain"
REMOTE_ROOT="/var/www/site/content/photos"
LOCAL_ROOT="$HOME/Photos/site"          # 本地照片根目录；想改就改这里
# ==========================================

set -e

SUBPATH=""
DRY=""
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY="--dry-run" ;;
    *)            SUBPATH="$arg" ;;
  esac
done

LOCAL="$LOCAL_ROOT/$SUBPATH"
REMOTE="$REMOTE_USER@$REMOTE_HOST:$REMOTE_ROOT/$SUBPATH"

# trailing slash 让 rsync 同步内容而不是整个目录
[ -d "$LOCAL" ] && LOCAL="${LOCAL%/}/"

if [ ! -d "$LOCAL" ]; then
  echo "✗ local directory not found: $LOCAL"
  echo "  → 请在 $LOCAL_ROOT 下建好照片目录，或修改脚本顶部的 LOCAL_ROOT"
  exit 1
fi

echo "┌─────────────────────────────────────────────"
echo "│ LOCAL  $LOCAL"
echo "│ REMOTE $REMOTE"
[ -n "$DRY" ] && echo "│ MODE   DRY-RUN (nothing will change)"
echo "└─────────────────────────────────────────────"
echo ""

# --delete: 本地删掉的照片，服务器上也删；保证完全镜像
# --include / --exclude: 只推图片格式
rsync -avz --progress --delete $DRY \
  --include="*/" \
  --include="*.jpg"  --include="*.jpeg" \
  --include="*.JPG"  --include="*.JPEG" \
  --include="*.png"  --include="*.PNG" \
  --include="*.webp" --include="*.WEBP" \
  --include="*.heic" --include="*.HEIC" \
  --exclude="thumbs/" \
  --exclude="*" \
  "$LOCAL" "$REMOTE"

if [ -n "$DRY" ]; then
  echo ""
  echo "→ dry-run 完成。去掉 --dry-run 重新跑来真正推。"
  exit 0
fi

echo ""
echo "→ 在服务器上生成缩略图（增量）..."
ssh "$REMOTE_USER@$REMOTE_HOST" bash -s << 'EOF'
set -e
cd /var/www/site/content/photos
find . -type d ! -name thumbs | while read dir; do
  cd "/var/www/site/content/photos/$dir" 2>/dev/null || continue
  shopt -s nullglob nocaseglob
  imgs=(*.jpg *.jpeg *.png *.webp *.heic)
  [ ${#imgs[@]} -eq 0 ] && continue
  mkdir -p thumbs
  for f in "${imgs[@]}"; do
    [ -f "thumbs/$f" ] && continue
    convert "$f" -resize '1600x1600>' -auto-orient -quality 82 "thumbs/$f" 2>/dev/null && \
      echo "  ✓ thumb: $dir/$f"
  done
done
EOF

echo ""
echo "✓ 同步完成。访问 https://yourdomain.com/content/photos/"
