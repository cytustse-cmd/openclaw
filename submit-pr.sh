#!/bin/bash
# OpenClaw video-analyzer skill PR 提交脚本
# 运行前确保：1. 已安装 gh CLI (brew install gh)  2. 已登录 (gh auth login)

set -e

SKILL_SOURCE="/Users/xfurious/.openclaw/workspace/skills/video-analyzer"
PR_DESC_FILE="/Users/xfurious/.openclaw/workspace/skills/PR_DESCRIPTION.md"
UPSTREAM_REPO="openclaw/openclaw"
FORK_REPO="cytustse-cmd/openclaw"
BRANCH_NAME="add-video-analyzer-skill"

echo "🎬 OpenClaw video-analyzer skill PR 提交脚本"
echo "=========================================="
echo ""

# 检查 gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 需要安装 GitHub CLI: brew install gh"
    echo "   然后运行: gh auth login"
    exit 1
fi

# 检查是否登录
if ! gh auth status &> /dev/null; then
    echo "❌ 请先登录 GitHub CLI: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI 已就绪"
echo ""

# 创建临时目录
WORK_DIR=$(mktemp -d)
cd "$WORK_DIR"
echo "📁 工作目录: $WORK_DIR"

# Fork 官方仓库（如果没 fork 过）
echo ""
echo "🔱 检查 fork..."
if ! gh repo view "$FORK_REPO" &> /dev/null; then
    echo "   创建 fork..."
    gh repo fork "$UPSTREAM_REPO" --clone=false --remote=false
    sleep 3
else
    echo "   已存在 fork"
fi

# Clone 你的 fork
echo ""
echo "📥 Clone fork..."
gh repo clone "$FORK_REPO" openclaw-fork
cd openclaw-fork

# 配置 git
git config user.email "$(git config --global user.email || echo 'you@example.com')"
git config user.name "$(git config --global user.name || echo 'Your Name')"

# 创建新分支
echo ""
echo "🌿 创建分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# 复制技能文件
echo ""
echo "📋 复制技能文件..."
mkdir -p skills/public/video-analyzer/scripts
cp "$SKILL_SOURCE/SKILL.md" skills/public/video-analyzer/
cp "$SKILL_SOURCE/scripts/analyze-x-video.sh" skills/public/video-analyzer/scripts/
chmod +x skills/public/video-analyzer/scripts/analyze-x-video.sh

# 提交
echo ""
echo "💾 提交更改..."
git add skills/public/video-analyzer/
git commit -m "feat: add video-analyzer skill for X/Twitter video analysis

Add skill to download X videos, extract audio with ffmpeg,
transcribe with Whisper, and provide comprehensive analysis.

Features:
- Download X/Twitter videos via yt-dlp
- Audio extraction and speech-to-text
- Combine tweet text + transcription
- 10 minute video limit for performance

Tested on macOS with yt-dlp, ffmpeg, and openai-whisper."

# Push
echo ""
echo "🚀 Push 到 GitHub..."
git push -u origin "$BRANCH_NAME"

# 创建 PR
echo ""
echo "📤 创建 Pull Request..."
gh pr create \
    --repo "$UPSTREAM_REPO" \
    --title "feat: add video-analyzer skill for X/Twitter video analysis" \
    --body-file "$PR_DESC_FILE" \
    --head "cytustse-cmd:$BRANCH_NAME" \
    --base main

echo ""
echo "✨ 完成！PR 已创建"
echo ""
echo "📎 查看 PR:"
echo "   https://github.com/$UPSTREAM_REPO/pulls"

# 清理
cd /
rm -rf "$WORK_DIR"
