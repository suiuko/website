#!/bin/bash
# 扫描 content/ 目录，自动生成 manifest.json
# 用法：./scripts/build-manifest.sh (在仓库根目录执行)

set -e
cd "$(dirname "$0")/.."

MANIFEST=content/manifest.json
mkdir -p content/notes content/albums content/projects

notes=$(ls content/notes/*.md 2>/dev/null | xargs -n1 basename 2>/dev/null | jq -R . | jq -s . || echo '[]')
albums=$(ls content/albums/*.md 2>/dev/null | xargs -n1 basename 2>/dev/null | jq -R . | jq -s . || echo '[]')
projects=$(ls content/projects/*.md 2>/dev/null | xargs -n1 basename 2>/dev/null | jq -R . | jq -s . || echo '[]')

cat > "$MANIFEST" <<EOF
{
  "notes": $notes,
  "albums": $albums,
  "projects": $projects,
  "generated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✓ wrote $MANIFEST"
cat "$MANIFEST"
