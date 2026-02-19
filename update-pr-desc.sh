#!/bin/bash
# 更新 PR 描述 - 修改示例链接

FORK_REPO="cytustse-cmd/openclaw"
BRANCH_NAME="add-video-analyzer-skill"
PR_NUMBER="20753"

echo "📝 更新 PR 描述..."
echo "=================="
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

# 配置 git
git config user.email "cytustse@gmail.com"
git config user.name "Clyder V"

# 更新 README 或文档中的示例链接（如果有的话）
# PR 描述需要用 gh CLI 直接编辑

echo ""
echo "🔗 更新 PR 描述中的示例链接..."

# 使用 gh CLI 编辑 PR 描述
gh pr edit "$PR_NUMBER" --repo "openclaw/openclaw" --body-file "/Users/xfurious/.openclaw/workspace/skills/PR_DESCRIPTION.md"

echo ""
echo "✅ PR 描述已更新！"
echo ""
echo "📎 查看 PR:"
echo "   https://github.com/openclaw/openclaw/pull/$PR_NUMBER"

# 清理
cd /
rm -rf "$WORK_DIR"
