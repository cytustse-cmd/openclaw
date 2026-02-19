# OpenClaw 恢复指南

> 重装后如何恢复所有机制？跟着这篇走～

---

## 📁 脚本文件恢复

所有脚本都在 `~/.openclaw/workspace/scripts/` 目录下。

### 核心脚本
| 文件 | 用途 |
|------|------|
| `cleanup.sh` | 自动清理巨型日记和 Session（阈值：2MB） |
| `backup.sh` | 每日备份到 GitHub |
| `x_tracker.py` | X.com 追踪 |
| `daily-briefing.js` | 每日简报生成 |
| `daily-memory-extractor.js` | 记忆提取到向量数据库 |
| `x-video-analyzer.sh` | X 视频分析（语音转文字） |

---

## ⏰ Cron Jobs 恢复

> ⚠️ Cron jobs 存储在 Gateway 配置中，重装后需要手动重建

### Job 1: Context Watcher
```json
{
  "name": "Context Watcher",
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "Check the session status. If context usage is > 80% of the limit, run ./scripts/backup.sh and notify the user that context is high and a backup has been made. Then suggest they clear the context.", "model": "minimax/MiniMax-M2.5" },
  "delivery": { "mode": "none" }
}
```

### Job 2: x_tracker_steipete
```json
{
  "name": "x_tracker_steipete",
  "schedule": { "kind": "every", "everyMs": 1680000 },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "Run /Users/xfurious/.openclaw/workspace/scripts/x_tracker.py. If there are new tweets in the JSON output, provide a concise summary for each one in CHINESE (简体中文), followed by its URL, and post it to the current chat. If there are no new tweets, reply with exactly HEARTBEAT_OK (and nothing else)." },
  "delivery": { "mode": "announce", "channel": "telegram", "to": "-1003729762918:topic:238" }
}
```

### Job 3: Memory Maintenance
```json
{
  "name": "Memory Maintenance",
  "schedule": { "kind": "cron", "expr": "55 20 * * *" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "请执行以下任务：\n1. 读取 MEMORY.md 检查是否有需要更新的内容\n2. 检查 memory/ 目录下的今日日记，提取重要事项\n3. 如果有值得写入 MEMORY.md 的新信息，用 edit 工具更新它\n4. 完成后简单汇报：是否有更新", "model": "minimax/MiniMax-M2.5" },
  "delivery": { "mode": "none" }
}
```

### Job 4: Daily Backup
```json
{
  "name": "Daily Backup",
  "schedule": { "kind": "cron", "expr": "0 21 * * *" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "Please run ./scripts/backup.sh to backup the workspace and memory files to GitHub." },
  "delivery": { "mode": "none" }
}
```

### Job 5: Daily Memory Extractor
```json
{
  "name": "Daily Memory Extractor",
  "schedule": { "kind": "cron", "expr": "0 0 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "请执行每日记忆提取任务（仅写入 epro-memory 数据库）：\n\n1. **获取今日会话历史**：\n   - 使用 `sessions_list` 查看今天的活跃会话\n   - 使用 `sessions_history` 获取每个会话的消息记录\n\n2. **提取关键信息**：\n   - 识别重要决策、配置变更、新工具部署\n   - 提取技术方案、错误修复、重要链接\n   - 总结今日完成的主要任务\n\n3. **仅存储到 epro-memory**：\n   - 运行 `node ~/.openclaw/workspace/scripts/daily-memory-extractor.js --store-only`\n   - ⚠️ **不要写入 memory/YYYY-MM-DD.md**（这是 Memory Maintenance 的任务）\n\n4. **汇报结果**：\n   - 提取了多少条关键信息\n   - 当前 epro-memory 总数\n\n如果没有重要信息需要记录，回复 HEARTBEAT_OK 即可。", "model": "minimax/MiniMax-M2.5" },
  "delivery": { "mode": "none" }
}
```

### Job 6: Auto Cleanup - 日记与Session清理
```json
{
  "name": "Auto Cleanup - 日记与Session清理",
  "schedule": { "kind": "cron", "expr": "0 4 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "运行清理脚本：bash /Users/xfurious/.openclaw/workspace/scripts/cleanup.sh" },
  "delivery": { "mode": "none" }
}
```

### Job 7: Auto Cleanup - MEMORY.md智能精简
```json
{
  "name": "Auto Cleanup - MEMORY.md智能精简",
  "schedule": { "kind": "cron", "expr": "30 4 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "检查以下 MEMORY.md 文件大小：\n1. /Users/xfurious/.openclaw/workspace/MEMORY.md\n\n对每个文件：如果超过 10KB，读取内容，保留核心信息（身份、规则、配置、教训），删除冗余详细日志和重复内容，压缩到 8KB 以内并写回。不超过 10KB 的跳过。" },
  "delivery": { "mode": "announce", "channel": "telegram", "to": "-1003729762918:topic:238" }
}
```

### Job 8: Daily Briefing
```json
{
  "name": "Daily Briefing",
  "schedule": { "kind": "cron", "expr": "45 8 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "Generate and send the daily morning briefing for X in CHINESE. Run: node /Users/xfurious/.openclaw/workspace/scripts/daily-briefing.js to get the briefing structure, then fetch weather from wttr.in/Shanghai (format: curl -s \"wttr.in/Shanghai?format=%l:+%c+%t+%h\"), combine them, and send a nice formatted message to Telegram. Include: greeting with current time, date, weather in Shanghai, any todos from today's memory file, pending items from recent memory, and system status. MUST use Simplified Chinese (简体中文) for all text. Keep it concise but informative." },
  "delivery": { "mode": "announce", "channel": "telegram", "to": "-1003729762918:topic:238" }
}
```

---

## 🔧 快速恢复命令

```bash
# 1. 克隆仓库
git clone <your-repo> ~/.openclaw/workspace

# 2. 检查脚本权限
chmod +x ~/.openclaw/workspace/scripts/*.sh
chmod +x ~/.openclaw/workspace/scripts/*.py

# 3. 使用 cron add 重建 jobs（复制上方 JSON）
# 参考命令: openclaw cron add -j '<json>'
```

---

## ⚙️ 关键配置

- **Session 清理阈值**: 1MB
- **MEMORY.md 精简阈值**: 10KB
- **Context 报警线**: 80%

---

_Last updated: 2026-02-19 by V 👾_
