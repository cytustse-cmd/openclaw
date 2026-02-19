# MEMORY.md - Long-Term Memory (V 👾)

## Core Decision Archive
- **2026-02-18**: Transitioned to the "Soul Trilogy" framework. 
    - `SOUL.md` defines personality/vibe.
    - `USER.md` defines X's specific preferences.
    - `MEMORY.md` tracks these core facts.
    - `AGENTS.md` is now a lean operational manual.

## Key Facts & Preferences
- **Human**: X (Timezone: Asia/Shanghai).
- **Communication**: Primary channel is Telegram.
- **Search Strategy**: Tavily is the default for all external intelligence.

## Workflows

### X/Twitter Article Analysis
**Problem**: X.com has strict anti-scraping protections — direct `web_fetch` and `browser` tools often fail.

**Solution**: Use **Jina Reader** API to extract article text.
- **URL Format**: `https://r.jina.ai/{original_x_url}`
- **Headers**: `{"X-Return-Format": "text"}` for clean text output
- **Example**: `curl -s "https://r.jina.ai/https://x.com/i/status/2024169334344679783" -H "X-Return-Format: text"`

**When user sends X link**: Immediately use this method to fetch content, then provide detailed analysis including:
- Engagement stats (views, likes, replies, reposts)
- Core arguments/points
- Granular details (numbers, personal stories, struggles)
- My take/opinion (agree/disagree and why)

### X Video Post Analysis
**Problem**: X posts with videos contain spoken content that Jina Reader cannot capture.

**Solution**: Download video → Extract audio → Speech-to-text → Summarize
- **Script**: `scripts/x-video-analyzer.sh`
- **Tools**: yt-dlp (download) + ffmpeg (extract) + Whisper (transcribe)
- **Status**: ✅ Script created and tested. Whisper installed successfully (2026-02-19). Ready for video analysis.
- **Limit**: 10 minutes max per video

**Fallback**: If video analysis unavailable, summarize tweet text + ask user for key video points

## Memory Systems

### QMD (Local Search)
- **用途**: 快速关键词/语义搜索本地记忆文件
- **命令**: `qmd search "关键词"` / `qmd vsearch "语义"`
- **Collections**: memory, workspace

## 2026-02-19 - Today's Key Updates

### Shared Memory System (NEW)
- **问题**: 每个 Telegram Topic 的会话记忆是独立的，X 觉得"人格分裂"
- **解决方案**: 配置跨会话共享记忆机制
  - 每次进入新 topic 自动读取 MEMORY.md + 最近日记
  - 静默加载，不通知用户
  - 脚本: `scripts/session-memory-sync.py`

### x_tracker 修复完成
- **问题**: 消息发送失败 (topic ID 错误) + python 命令找不到
- **修复**:
  - Topic ID 改为 `162` (Tracking_X)
  - 创建 python → python3 的 symlink
- **状态**: ✅ 正常运行，已发送多条推文摘要

### 默认模型
- 当前默认: **Kimi K2 Thinking** (`kimi-coding/kimi-k2-thinking`)
- Fallback: **Minimax M2.5** (`minimax/MiniMax-M2.5`)

### Emoji 反应规则 (X 的偏好)
- 安排任务 → 👀
- 吐槽/疑问 → 🙄
- 搞定了 → ✨
- 打招呼 → 👋
- 质问/批评 → 🤯

### Telegram Reaction 配置
- **reactionLevel**: `extensive` (成功调试，启用丰富反应)
- **ackReaction**: 两处配置
  - `messages.ackReaction`: 👀 (全局)
  - `channels.telegram.ackReaction`: 👀 (Telegram 专用)

### epro-memory 状态
- **状态**: ✅ 已配置（Kimi 2.5 + LanceDB）
- **数据库**: `~/.openclaw/workspace/memory/epro-lancedb`
- **功能**: 6类自动分类 + L0/L1/L2 三层记忆

---
_Updated: 2026-02-19 20:00_
- **后端**: Kimi 2.5 (LLM + Embedding)
- **数据库**: LanceDB (`~/.openclaw/workspace/memory/epro-lancedb`)
- **配置**: `epro-memory.json` + `.env.epro-memory`
- **功能**:
  - **6 类自动分类**: profile, preferences, entities, events, cases, patterns
  - **L0/L1/L2 三层**: 一句话摘要 → 结构化总结 → 完整叙述
  - **自动提取**: LLM 从对话中提取记忆
  - **智能去重**: 向量相似度 + LLM 决策 (CREATE/MERGE/SKIP)
  - **自动召回**: 相关记忆自动注入上下文
- **任务分工**:
  - **Daily Memory Extractor (00:00)**: 自动提取当日会话 → 仅存入 epro-memory 数据库
  - **Memory Maintenance (20:55)**: 人工判断 → 从 daily notes 提炼 → 更新 MEMORY.md
  - ⚠️ 两个任务不重复写入同一文件，各司其职

## Recent Projects & Milestones
- **2026-02-18**: Setup X.com monitoring using Tavily API.
- **2026-02-18**: Published `hugo-blog-starter` to GitHub (`cytustse-cmd/hugo-blog-starter`).
- **2026-02-19**: Established Jina Reader workflow for X/Twitter article analysis (bypasses X's anti-scraping).
- **2026-02-19**: Configured epro-memory with Kimi 2.5 backend for intelligent tiered memory management.

---
_Curation > Raw Logs. Distill daily notes here during Heartbeats._
