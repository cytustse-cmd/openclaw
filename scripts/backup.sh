#!/bin/bash
# scripts/backup.sh - Snapshot-style backup into date-named folders in root

# Format: YYYY.MM.DD_HH:mm
TIMESTAMP=$(date +"%Y.%m.%d_%H:%M")
BACKUP_DIR="backups/${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}"

# Define the snapshot file inside that folder
SNAPSHOT_FILE="${BACKUP_DIR}/snapshot_${TIMESTAMP}.md"

echo "Creating snapshot in folder: ${BACKUP_DIR}..."

echo "# Session Snapshot: ${TIMESTAMP}" >> "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

# 核心文件 - 直接从根目录读取
echo "## 🧠 Long-Term Memory (MEMORY.md)" >> "${SNAPSHOT_FILE}"
echo '```markdown' >> "${SNAPSHOT_FILE}"
cat "MEMORY.md" 2>/dev/null >> "${SNAPSHOT_FILE}"
echo '```' >> "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

# 身份文件
echo "## 👤 Identity & Soul" >> "${SNAPSHOT_FILE}"
for f in SOUL.md USER.md IDENTITY.md; do
    [ -e "$f" ] || continue
    echo "### $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done
echo "" >> "${SNAPSHOT_FILE}"

# 配置文件
echo "## ⚙️ Operational Files" >> "${SNAPSHOT_FILE}"
for f in AGENTS.md TOOLS.md; do
    [ -e "$f" ] || continue
    echo "### $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done
echo "" >> "${SNAPSHOT_FILE}"

# 重要脚本列表（内容太长了，只记录路径和用途）
echo "## 🔧 Scripts" >> "${SNAPSHOT_FILE}"
echo '```' >> "${SNAPSHOT_FILE}"
ls -1 scripts/*.sh scripts/*.py scripts/*.js 2>/dev/null | head -20 >> "${SNAPSHOT_FILE}"
echo '```' >> "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

# Cron jobs（从 gateway 状态获取）
echo "## ⏰ Cron Jobs" >> "${SNAPSHOT_FILE}"
echo '*Run `openclaw cron list` to see active jobs*' >> "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

echo "Created snapshot at ${SNAPSHOT_FILE}"

# Sync to GitHub
git add .
git commit -m "Snapshot: ${TIMESTAMP}"
git push origin main
