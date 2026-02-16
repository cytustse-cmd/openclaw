#!/bin/bash
# scripts/backup.sh - Backup workspace files to local and GitHub

BACKUP_DIR="memory/backup-$(date +%Y%m%d-%H%M)"
mkdir -p "$BACKUP_DIR"

echo "Creating local backup in $BACKUP_DIR..."
cp *.md "$BACKUP_DIR/"
cp -r memory/*.md "$BACKUP_DIR/" 2>/dev/null || true

echo "Pushing to GitHub..."
git add .
git commit -m "Auto-backup: $(date +%Y-%m-%d\ %H:%M:%S)"
git push origin main

echo "Backup complete."
