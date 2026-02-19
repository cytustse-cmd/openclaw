#!/bin/bash
#
# Daily Briefing Runner
# Called by cron at 7:00 AM
# Sends briefing to Telegram

set -e

WORKSPACE="/Users/xfurious/.openclaw/workspace"
cd "$WORKSPACE"

# Generate the briefing content
BRIEFING=$(node scripts/daily-briefing.js 2>/dev/null || echo "Error generating briefing")

# Get weather for Shanghai (X's timezone)
WEATHER=$(curl -s "wttr.in/Shanghai?format=%l:+%c+%t+%h" 2>/dev/null || echo "Weather unavailable")

# Replace weather placeholder
BRIEFING=$(echo "$BRIEFING" | sed "s|🌤️ Weather: (fetched separately)|🌤️ Weather: $WEATHER|")

# Send via OpenClaw gateway API or echo for testing
echo "$BRIEFING"
