#!/bin/bash
# scripts/backup.sh - Backup organized workspace files to local and GitHub

BACKUP_DIR="archive/backup-$(date +%Y%m%d-%H%M)"
mkdir -p "$BACKUP_DIR"

echo "Creating local backup in $BACKUP_DIR..."
# Backup all key directories and the root MEMORY.md
cp MEMORY.md "$BACKUP_DIR/"
cp -r identity/ logs/ projects/ configs/ scripts/ "$BACKUP_DIR/"

echo "Pushing to GitHub..."
git add .
git commit -m "Auto-backup (Organized): $(date +%Y-%m-%d\ %H:%M:%S)"
git push origin main

echo "Backup complete."
