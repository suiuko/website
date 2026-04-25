# 照片工作流 · 本地主导

## 一句话说明

**本地是老大**：所有照片在本地电脑用你最舒服的方式整理（拖拽、重命名、删除、分文件夹），服务器只是镜像。一条命令把本地整个照片目录推到服务器。

---

## 本地目录结构（你自己定）

推荐参考（但不强制）：

```
~/Photos/site/                ← 这是同步的根目录
├── 2026-04/
│   ├── vienna/
│   │   ├── 001-schoenbrunn.jpg
│   │   ├── 002-cafe-central.jpg
│   │   └── 003-belvedere.jpg
│   └── london/
│       ├── 001-hyde-park.jpg
│       └── 002-borough-market.jpg
├── 2026-03/
│   └── xian/
│       ├── 001.jpg
│       └── ...
└── 2025-10/
    └── lisbon/
        └── ...
```

**想改结构随便改**。你在本地重命名、移动、删除，下次同步服务器上也会跟着变。

---

## 第一次配置（5 分钟）

### 1. 改脚本顶部的服务器信息

打开 `scripts/sync-photos.sh`，改最上面四行：

```bash
REMOTE_USER="azureuser"                       # 你 SSH 登录用的用户名
REMOTE_HOST="20.xxx.xxx.xxx"                  # Azure VM 的公网 IP（或你的域名）
REMOTE_ROOT="/var/www/site/content/photos"    # 服务器上照片存放位置
LOCAL_ROOT="$HOME/Photos/site"                # 本地照片根目录
```

### 2. 配 SSH 免密登录（只需一次）

```bash
# 本地
ssh-copy-id azureuser@20.xxx.xxx.xxx
```

之后 rsync / ssh 都不用再输密码。

### 3. 加执行权限

```bash
chmod +x scripts/sync-photos.sh
```

---

## 日常使用

### 推全部

```bash
./scripts/sync-photos.sh
```

把 `~/Photos/site/` 整个目录镜像到服务器。几千张图也 OK，rsync 只传**变动过的文件**，秒级增量。

### 预演（不真的改东西）

```bash
./scripts/sync-photos.sh --dry-run
```

会告诉你会上传什么、删除什么，但不真执行。**强烈建议第一次先跑这个看一眼**。

### 只推某个子目录

```bash
./scripts/sync-photos.sh 2026-04              # 只推 4 月
./scripts/sync-photos.sh 2026-04/vienna       # 只推维也纳
```

---

## 镜像 = 本地删掉 → 服务器也删掉

脚本用了 `--delete`，所以：

- 本地重命名一张照片 → 服务器旧名字删掉、新名字加上
- 本地整个文件夹删掉 → 服务器对应文件夹也删掉
- 本地把照片从 A 文件夹移到 B 文件夹 → 服务器跟着动

**好处**：本地所见即服务器所得，不会有"遗留的旧照片"。
**注意**：如果不小心本地删了东西又同步了，服务器那份也没了。所以第一次用务必先 `--dry-run` 看一眼。

---

## 缩略图自动生成

脚本在同步完照片后，会 SSH 到服务器：
- 扫描每个照片目录
- 对每张图生成一个 ≤1600px 的缩略图，放进该目录的 `thumbs/` 子文件夹
- **只生成还没有的**（增量）

前端加载相册用 `thumbs/xxx.jpg`，点开 lightbox 再用原图 `xxx.jpg`。省流量 + 快。

---

## 在 `.md` 里引用照片

比如 `content/albums/2026-04.md` 里可以写：

```yaml
---
month: 2026.04
cities:
  - title: Vienna
    photos_dir: 2026-04/vienna     # ← 对应服务器 /content/photos/2026-04/vienna/
    frames:
      - { file: 001-schoenbrunn.jpg, cap: "Schönbrunn", meta: "FUJI X100V" }
      - { file: 002-cafe-central.jpg, cap: "café central", meta: "PORTRA 400" }
---
```

前端就会去 `https://yourdomain.com/content/photos/2026-04/vienna/thumbs/001-schoenbrunn.jpg` 拉图。

---

## 典型一次更新流程

```bash
# 1. 从相机/手机导入照片到本地
# （拖到 ~/Photos/site/2026-04/paris/）

# 2. 本地整理、删掉糟糕的照片、改名

# 3. 先预演
./scripts/sync-photos.sh --dry-run

# 4. 真推
./scripts/sync-photos.sh

# 5. 写一下这个月的相册元数据（VSCode 里编辑 content/albums/2026-04.md）

# 6. push 代码改动
git add content/
git commit -m "april: paris"
git push
# GitHub Actions 会自动让服务器 git pull

# 完事。
```

照片和代码完全解耦：
- **照片**走 rsync（大文件，不进 Git）
- **文字**走 Git（小文件，有版本历史）

---

## 常见问题

**Q: 我想换电脑怎么办？**
A: 因为服务器有你所有照片，新电脑 `rsync -avz azureuser@host:/var/www/site/content/photos/ ~/Photos/site/` 把服务器的拉回本地就行。

**Q: 照片误删了？**
A: 服务器上 `/var/www/site/content/photos/` 加一个 cron 每周做 tar 快照，或者用 Azure 的磁盘快照。脚本本身没有回收站。

**Q: HEIC (iPhone 原生格式) 能直接上传吗？**
A: 脚本支持上传 .heic，但浏览器不认。服务器端可以加 `heif-convert` 转成 jpg。如果你用 iPhone，建议设置"兼容模式"直接出 jpg。

**Q: 可以只用脚本传，不配 GitHub Actions 吗？**
A: 完全可以。照片永远用这个脚本。代码每次改完在服务器 `~/deploy.sh` 手动拉一下也行。
