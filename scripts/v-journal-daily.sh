#!/bin/bash
# V's Journal - Daily Entry Creator
# 每天创建新的日记条目

cd /Users/xfurious/.openclaw/workspace/projects/v-journal

# 生成今天的日记
node /Users/xfurious/.openclaw/workspace/scripts/v-journal-create.js

# 如果有变更，提交并推送
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "📔 Daily journal entry - $(date +%Y-%m-%d)"
    git push origin main
    echo "✅ Journal entry pushed to GitHub"
else
    echo "No new entry to commit"
fi
