#!/bin/bash
# scripts/backup.sh - Backup to granular date-based structure

YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)
TIME=$(date +%H%M)

BACKUP_ROOT="archive/$YEAR/$MONTH/$DAY/$TIME"
mkdir -p "$BACKUP_ROOT"

echo "Creating granular backup in $BACKUP_ROOT..."
cp MEMORY.md "$BACKUP_ROOT/"
cp -r identity/ logs/ projects/ configs/ scripts/ "$BACKUP_ROOT/" 2>/dev/null || true

echo "Pushing to GitHub..."
git add .
git commit -m "Granular Backup: $YEAR-$MONTH-$DAY $TIME"
git push origin main

echo "Backup complete."
