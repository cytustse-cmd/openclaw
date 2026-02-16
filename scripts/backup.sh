#!/bin/bash
# scripts/backup.sh - Snapshot-style backup into date-named folders in root

# Format: YYYY.MM.DD_HH:mm
TIMESTAMP=$(date +"%Y.%m.%d_%H:%M")
BACKUP_DIR="${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}"

# Define the snapshot file inside that folder
SNAPSHOT_FILE="${BACKUP_DIR}/snapshot_${TIMESTAMP}.md"

echo "Creating legacy-compatible snapshot in folder: ${BACKUP_DIR}..."

echo "# Session Snapshot: ${TIMESTAMP}" > "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

# Use the contents from "以往文件" where they now live to build the snapshot
# Or from the current locations if any remain. 
# Since I moved them to "以往文件", I need to look there.

SOURCE_DIR="以往文件"

echo "## 🧠 Long-Term Memory (MEMORY.md)" >> "${SNAPSHOT_FILE}"
echo '```markdown' >> "${SNAPSHOT_FILE}"
cat "${SOURCE_DIR}/MEMORY.md" 2>/dev/null >> "${SNAPSHOT_FILE}"
echo '```' >> "${SNAPSHOT_FILE}"
echo "" >> "${SNAPSHOT_FILE}"

echo "## 👤 Identity & Soul" >> "${SNAPSHOT_FILE}"
for f in "${SOURCE_DIR}/identity"/*.md; do
    [ -e "$f" ] || continue
    echo "### File: $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done
echo "" >> "${SNAPSHOT_FILE}"

echo "## ⚙️ Configs" >> "${SNAPSHOT_FILE}"
for f in "${SOURCE_DIR}/configs"/*.md; do
    [ -e "$f" ] || continue
    echo "### File: $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done
echo "" >> "${SNAPSHOT_FILE}"

echo "## 📝 Projects & Tasks" >> "${SNAPSHOT_FILE}"
for f in "${SOURCE_DIR}/projects"/*.md; do
    [ -e "$f" ] || continue
    echo "### File: $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done
echo "" >> "${SNAPSHOT_FILE}"

echo "## 📜 Recent Logs" >> "${SNAPSHOT_FILE}"
for f in "${SOURCE_DIR}/logs"/*.md; do
    [ -e "$f" ] || continue
    echo "### File: $f" >> "${SNAPSHOT_FILE}"
    echo '```markdown' >> "${SNAPSHOT_FILE}"
    cat "$f" >> "${SNAPSHOT_FILE}"
    echo '```' >> "${SNAPSHOT_FILE}"
done

echo "Created snapshot at ${SNAPSHOT_FILE}"

# Sync to GitHub
git add .
git commit -m "Snapshot Folder: ${TIMESTAMP}"
git push origin main
