#!/bin/bash
# scripts/backup.sh - Granular snapshot-style backup (YYYY/MM/DD/HH/mm/ss)

YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)
HOUR=$(date +%H)
MINUTE=$(date +%M)
SECOND=$(date +%S)

BACKUP_ROOT="archive/$YEAR/$MONTH/$DAY/$HOUR/$MINUTE/$SECOND"
mkdir -p "$BACKUP_ROOT"

SNAPSHOT_FILE="$BACKUP_ROOT/snapshot_${YEAR}${MONTH}${DAY}_${HOUR}${MINUTE}${SECOND}.md"

echo "Creating ultra-granular snapshot in $SNAPSHOT_FILE..."

echo "# Session Snapshot: $YEAR-$MONTH-$DAY $HOUR:$MINUTE:$SECOND" > "$SNAPSHOT_FILE"
echo "" >> "$SNAPSHOT_FILE"

echo "## 🧠 Long-Term Memory (MEMORY.md)" >> "$SNAPSHOT_FILE"
echo '```markdown' >> "$SNAPSHOT_FILE"
cat MEMORY.md >> "$SNAPSHOT_FILE"
echo '```' >> "$SNAPSHOT_FILE"
echo "" >> "$SNAPSHOT_FILE"

echo "## 👤 Identity & Soul" >> "$SNAPSHOT_FILE"
for f in identity/*.md; do
    echo "### File: $f" >> "$SNAPSHOT_FILE"
    echo '```markdown' >> "$SNAPSHOT_FILE"
    cat "$f" >> "$SNAPSHOT_FILE"
    echo '```' >> "$SNAPSHOT_FILE"
done
echo "" >> "$SNAPSHOT_FILE"

echo "## ⚙️ Configs" >> "$SNAPSHOT_FILE"
for f in configs/*.md; do
    echo "### File: $f" >> "$SNAPSHOT_FILE"
    echo '```markdown' >> "$SNAPSHOT_FILE"
    cat "$f" >> "$SNAPSHOT_FILE"
    echo '```' >> "$SNAPSHOT_FILE"
done
echo "" >> "$SNAPSHOT_FILE"

echo "## 📝 Projects & Tasks" >> "$SNAPSHOT_FILE"
for f in projects/*.md; do
    echo "### File: $f" >> "$SNAPSHOT_FILE"
    echo '```markdown' >> "$SNAPSHOT_FILE"
    cat "$f" >> "$SNAPSHOT_FILE"
    echo '```' >> "$SNAPSHOT_FILE"
done
echo "" >> "$SNAPSHOT_FILE"

echo "## 📜 Recent Logs (Today)" >> "$SNAPSHOT_FILE"
TODAY=$(date +%Y-%m-%d)
if [ -f "logs/${TODAY}.md" ]; then
    echo "### File: logs/${TODAY}.md" >> "$SNAPSHOT_FILE"
    echo '```markdown' >> "$SNAPSHOT_FILE"
    cat "logs/${TODAY}.md" >> "$SNAPSHOT_FILE"
    echo '```' >> "$SNAPSHOT_FILE"
fi

echo "Created snapshot at $SNAPSHOT_FILE"

# Sync to GitHub
git add .
git commit -m "Ultra-Granular Backup: $YEAR-$MONTH-$DAY $HOUR:$MINUTE:$SECOND"
git push origin main
