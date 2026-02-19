# OpenClaw 恢复指南

> 重装后如何恢复所有机制？跟着这篇走～

---

## 📁 脚本文件恢复

以下文件都在 `~/.openclaw/workspace/scripts/` 目录下，需要手动创建：

### 1. cleanup.sh
```bash
# 复制脚本内容或从 GitHub 历史恢复
# 位置: scripts/cleanup.sh
# 用途: 自动清理巨型日记和 Session，防止 context overflow
```

### 2. 其他脚本
- `x_tracker.py` - X.com 追踪
- `x_tracker_state.json` - 追踪状态
- `daily-briefing.js` - 每日简报
- `daily-memory-extractor.js` - 记忆提取
- `x-video-analyzer.sh` - X 视频分析

---

## ⏰ Cron Jobs 恢复

> ⚠️ Cron jobs 存储在 Gateway 配置中，重装后需要手动重建

### Job 1: Auto Cleanup - 日记与Session清理
```json
{
  "name": "Auto Cleanup - 日记与Session清理",
  "schedule": { "kind": "cron", "expr": "0 4 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { "kind": "agentTurn", "message": "运行清理脚本：bash /Users/xfurious/.openclaw/workspace/scripts/cleanup.sh" },
  "delivery": { "mode": "none" }
}
```

### Job 2: Auto Cleanup - MEMORY.md智能精简
```json
{
  "name": "Auto Cleanup - MEMORY.md智能精简",
  "schedule": { "kind": "cron", "expr": "30 4 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": { 
    "kind": "agentTurn", 
    "message": "检查以下 MEMORY.md 文件大小：\n1. /Users/xfurious/.openclaw/workspace/MEMORY.md\n\n对每个文件：如果超过 10KB，读取内容，保留核心信息（身份、规则、配置、教训），删除冗余详细日志和重复内容，压缩到 8KB 以内并写回。不超过 10KB 的跳过。" 
  },
  "delivery": { "mode": "announce", "to": "-1003729762918:topic:238", "channel": "telegram" }
}
```

### 其他现有 Jobs（参考）
- **Context Watcher**: 每 15 分钟检查，>80% 时备份
- **x_tracker_steipete**: 每 28 分钟追踪 X
- **Memory Maintenance**: 每天 20:55 提炼 MEMORY
- **Daily Backup**: 每天 21:00 备份到 GitHub
- **Daily Memory Extractor**: 每天 00:00 提取记忆到数据库
- **Daily Briefing**: 每天 08:45 发送早间简报

---

## 🔧 快速恢复命令

```bash
# 1. 克隆仓库
git clone <your-repo> ~/.openclaw/workspace

# 2. 添加脚本到 Git
cd ~/.openclaw/workspace
git add scripts/cleanup.sh
git commit -m "Add cleanup.sh"

# 3. 使用 cron tool 重建 jobs（手动）
# 复制上方 JSON 用 cron add 命令
```

---

## 🧪 验证

```bash
# 检查 cron jobs
openclaw cron list

# 手动运行 cleanup
bash ~/.openclaw/workspace/scripts/cleanup.sh
```

---

_Last updated: 2026-02-19 by V 👾_
