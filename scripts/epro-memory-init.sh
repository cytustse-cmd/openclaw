#!/bin/bash
# epro-memory 初始化脚本
# 加载环境变量并启动

set -a
source "$(dirname "$0")/../.env.epro-memory"
set +a

echo "🧠 epro-memory 初始化中..."
echo "📁 数据库路径: ~/.openclaw/workspace/memory/epro-lancedb"
echo "🤖 LLM: Kimi 2.5"
echo "🔢 Embedding: text-embedding-3-small"
echo ""
echo "✅ 环境变量已加载"

# 检查 LanceDB 目录是否存在
if [ ! -d "$HOME/.openclaw/workspace/memory/epro-lancedb" ]; then
    echo "📂 创建 LanceDB 目录..."
    mkdir -p "$HOME/.openclaw/workspace/memory/epro-lancedb"
    echo "✅ 目录创建完成"
else
    echo "✅ LanceDB 目录已存在"
fi

echo ""
echo "🚀 epro-memory 准备就绪"
