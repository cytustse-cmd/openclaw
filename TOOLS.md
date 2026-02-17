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

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
