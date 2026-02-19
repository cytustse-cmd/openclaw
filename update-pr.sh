#!/bin/bash
# 更新 PR 脚本 - 修复代码审查发现的问题

set -e

SKILL_SOURCE="/Users/xfurious/.openclaw/workspace/skills/video-analyzer"
FORK_REPO="cytustse-cmd/openclaw"
BRANCH_NAME="add-video-analyzer-skill"

echo "🔧 更新 PR 脚本"
echo "==============="
echo ""

# 创建临时目录
WORK_DIR=$(mktemp -d)
cd "$WORK_DIR"

echo "📥 Clone fork..."
gh repo clone "$FORK_REPO" openclaw-fork
cd openclaw-fork

# 切换到分支
git fetch origin
git checkout "$BRANCH_NAME"

# 配置 git（修复身份问题）
git config user.email "cytustse@gmail.com"
git config user.name "Clyder V"

# 复制修复后的文件
echo ""
echo "📋 复制修复后的文件..."
cp "$SKILL_SOURCE/SKILL.md" skills/public/video-analyzer/
cp "$SKILL_SOURCE/scripts/analyze-x-video.sh" skills/public/video-analyzer/scripts/
chmod +x skills/public/video-analyzer/scripts/analyze-x-video.sh

# 提交修复
echo ""
echo "💾 提交修复..."
git add skills/public/video-analyzer/
git commit -m "fix: address code review feedback

- Remove hardcoded macOS Python path for cross-platform compatibility
- Fix Whisper output capture to read from file instead of pipe
- Add dependency metadata to SKILL.md
- Add better error messages for missing dependencies"

# Push
echo ""
echo "🚀 Push 更新..."
git push origin "$BRANCH_NAME"

echo ""
echo "✅ PR 已更新！"
echo ""
echo "📎 查看 PR:"
echo "   https://github.com/openclaw/openclaw/pull/20753"

# 清理
cd /
rm -rf "$WORK_DIR"
