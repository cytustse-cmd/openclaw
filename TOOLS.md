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

### Model Strategy (2026-02-18)

- **Default model**: `google/gemini-3-flash-preview` (Gemini Flash Preview) — 全局默认，用于日常聊天
- **Fallback**: `minimax/MiniMax-M2.5` (MiniMax) — 备选，稳定性高
- **High-end Fallback**: `google-antigravity/claude-opus-4-6-thinking` (Opus) — 复杂任务时用 `/model` 手动切换
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
