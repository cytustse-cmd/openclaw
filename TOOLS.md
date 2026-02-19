# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

### QMD (Local Search Engine)

- **安装**: `npm install -g @tobilu/qmd`
- **路径**: `~/bin/qmd` (已 alias)
- **Collections**:
  - `memory`: ~/.openclaw/workspace/memory/
  - `workspace`: ~/.openclaw/workspace/
- **用法**:
  - `qmd query "搜索内容"` - 混合搜索（BM25 + 向量 + LLM重排）
  - `qmd search "关键词"` - 快速关键词
  - `qmd vsearch "语义搜索"` - 向量语义搜索
  - `qmd get qmd://memory/xxx.md` - 获取文档
  - `qmd embed` - 重新生成向量（文件变更后需要）
- **模型**: Apple M4 GPU 加速
- **状态**: `qmd status`

### epro-memory (Tiered LLM Memory)

- **安装**: `pnpm add @tobybridges/epro-memory` (已安装)
- **路径**: `~/.openclaw/node_modules/@tobybridges/epro-memory`
- **配置**: `epro-memory.json` + `.env.epro-memory`
- **初始化**: `./scripts/epro-memory-init.sh`
- **每日提取**: `scripts/daily-memory-extractor.js` (由 cron 00:00 调用，仅写入数据库)
- **后端**: Kimi 2.5 (LLM + Embedding via OpenAI-compatible API)
- **数据库**: LanceDB (`~/.openclaw/workspace/memory/epro-lancedb`)
- **功能**:
  - **6 类分类**: profile, preferences, entities, events, cases, patterns
  - **L0/L1/L2 三层**: 一句话摘要 → 结构化总结 → 完整叙述
  - **自动提取**: 从对话自动提取记忆
  - **智能去重**: 向量相似度 + LLM 决策
  - **自动召回**: 相关记忆自动注入上下文
- **任务分工**:
  - Daily Memory Extractor (00:00): 自动提取 → epro-memory 数据库
  - Memory Maintenance (20:55): 人工提炼 → MEMORY.md 长期档案
- **状态**: ✅ 已配置并导入历史记忆，停用 Ollama，完全使用 Kimi API
- **注意**: Ollama 本地 embedding 已停用 (2026-02-19)

### X Video Analysis

- **脚本**: `scripts/x-video-analyzer.sh`
- **功能**: 下载 X 视频 → 提取音频 → Whisper 识别 → 文字总结
- **依赖**: yt-dlp + ffmpeg + Whisper
- **限制**: 10 分钟以内视频
- **状态**: ✅ Whisper 已安装 (2026-02-19)

### Model Strategy (2026-02-19)

- **Default model**: `google/gemini-flash-latest` (Gemini Flash) — 全局默认，响应极快
- **Fallback**: `minimax/MiniMax-M2.5` (MiniMax) — 备选，稳定性高
- **High-end Fallback**: `google-antigravity/claude-opus-4-5-thinking` (Opus 4.5) — 复杂任务时用 `/model` 手动切换
- **Cron jobs**: 建议保持 Gemini Flash 或 MiniMax
- **免费模型**: GLM-5 / GLM-4.7 (zai) 零成本选项

### Configuration Notes

- **Compaction**: `default` 模式（主动压缩，非 safeguard 的被动模式）
- **Context Watcher cron**: 每 15 分钟检查，>80% 自动备份
- **Daily Backup cron**: 每天 21:00 执行 `./scripts/backup.sh`
- **exec 通知**: `tools.exec.notifyOnExit: false` 关闭命令退出噪音

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
