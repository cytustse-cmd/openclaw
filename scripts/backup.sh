#!/bin/bash
# scripts/backup.sh - Snapshot-style backup of the entire session/workspace

TIMESTAMP=$(date +%Y%m%d_%H%M)
BACKUP_FILE="logs/sessions/snapshot_${TIMESTAMP}.md"

echo "# Session Snapshot: $(date '+%Y-%m-%d %H:%M')" > "$BACKUP_FILE"
echo "" >> "$BACKUP_FILE"

echo "## 🧠 Long-Term Memory (MEMORY.md)" >> "$BACKUP_FILE"
echo '```markdown' >> "$BACKUP_FILE"
cat MEMORY.md >> "$BACKUP_FILE"
echo '```' >> "$BACKUP_FILE"
echo "" >> "$BACKUP_FILE"

echo "## 👤 Identity & Soul" >> "$BACKUP_FILE"
for f in identity/*.md; do
    echo "### File: $f" >> "$BACKUP_FILE"
    echo '```markdown' >> "$BACKUP_FILE"
    cat "$f" >> "$BACKUP_FILE"
    echo '```' >> "$BACKUP_FILE"
done
echo "" >> "$BACKUP_FILE"

echo "## ⚙️ Configs" >> "$BACKUP_FILE"
for f in configs/*.md; do
    echo "### File: $f" >> "$BACKUP_FILE"
    echo '```markdown' >> "$BACKUP_FILE"
    cat "$f" >> "$BACKUP_FILE"
    echo '```' >> "$BACKUP_FILE"
done
echo "" >> "$BACKUP_FILE"

echo "## 📝 Projects & Tasks" >> "$BACKUP_FILE"
for f in projects/*.md; do
    echo "### File: $f" >> "$BACKUP_FILE"
    echo '```markdown' >> "$BACKUP_FILE"
    cat "$f" >> "$BACKUP_FILE"
    echo '```' >> "$BACKUP_FILE"
done
echo "" >> "$BACKUP_FILE"

echo "## 📜 Recent Logs (Today)" >> "$BACKUP_FILE"
TODAY=$(date +%Y-%m-%d)
if [ -f "logs/${TODAY}.md" ]; then
    echo "### File: logs/${TODAY}.md" >> "$BACKUP_FILE"
    echo '```markdown' >> "$BACKUP_FILE"
    cat "logs/${TODAY}.md" >> "$BACKUP_FILE"
    echo '```' >> "$BACKUP_FILE"
fi

echo "Created monolithic snapshot at $BACKUP_FILE"

# Sync to GitHub
git add .
git commit -m "Snapshot Backup: $TIMESTAMP"
git push origin main
