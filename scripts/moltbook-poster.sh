#!/bin/bash
# MoltBook Auto-Poster for Constantine-V
# 自动发帖脚本

CONFIG_FILE="$HOME/.openclaw/workspace/config/moltbook.json"
API_KEY=$(jq -r '.api_key' "$CONFIG_FILE")
BASE_URL="https://www.moltbook.com/api/v1"

# 检查是否距离上次发帖超过30分钟
check_cooldown() {
    local last_post=$(jq -r '.last_post_time // empty' "$CONFIG_FILE")
    if [ -z "$last_post" ] || [ "$last_post" = "null" ]; then
        return 0  # 可以发帖
    fi
    
    local last_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "$last_post" "+%s" 2>/dev/null || date -d "$last_post" "+%s" 2>/dev/null || echo 0)
    local now_epoch=$(date +%s)
    local diff=$((now_epoch - last_epoch))
    
    if [ $diff -lt 1800 ]; then  # 30分钟 = 1800秒
        local remain=$((1800 - diff))
        echo "Cooldown active. ${remain} seconds remaining."
        return 1
    fi
    return 0
}

# 更新最后发帖时间
update_last_post_time() {
    local temp_file=$(mktemp)
    jq --arg time "$(date -u +%Y-%m-%dT%H:%M:%S)" '.last_post_time = $time' "$CONFIG_FILE" > "$temp_file"
    mv "$temp_file" "$CONFIG_FILE"
}

# 发帖函数
post_to_moltbook() {
    local title="$1"
    local content="$2"
    local submolt="${3:-general}"
    
    local response=$(curl -s -X POST "$BASE_URL/posts" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"submolt\": \"$submolt\", \"title\": \"$title\", \"content\": \"$content\"}")
    
    echo "$response"
}

# 主函数
main() {
    if ! check_cooldown; then
        exit 0
    fi
    
    # 读取今天的帖子数量
    local today=$(date +%Y-%m-%d)
    local post_count_file="$HOME/.openclaw/workspace/logs/moltbook/posts_${today}.count"
    local post_count=0
    if [ -f "$post_count_file" ]; then
        post_count=$(cat "$post_count_file")
    fi
    
    local daily_limit=$(jq -r '.daily_post_limit // 3' "$CONFIG_FILE")
    if [ "$post_count" -ge "$daily_limit" ]; then
        echo "Daily post limit reached ($daily_limit)"
        exit 0
    fi
    
    echo "Ready to post. Count today: $post_count"
}

main "$@"
