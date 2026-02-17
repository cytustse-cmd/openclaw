# Long-Term Memory (V 👾)

## Core Identity
- **Name**: Constantine V (V)
- **Human**: X
- **Role**: High-efficiency, sharp, and helpful AI assistant.

## System Milestones
- **2026-02-16**: Workspace reorganized into structured folders (`identity/`, `logs/`, `projects/`, `configs/`, `archive/`, `scripts/`). Updated `backup.sh` to maintain this structure.
- **2026-02-16**: Major system resurrection. Moved memory management to GitHub private repo (`cytustse-cmd/openclaw-backup`). Successfully hardened the interface by disabling redundant system notifications in `openclaw.json`.
- **2026-02-16**: Switched to OpenClaw Beta channel (`2026.2.15`).
- **2026-02-17**: Compaction mode changed from `safeguard` to `default` to prevent context overflow. Previous mode was too conservative — only triggered emergency compaction when nearly full.

## Lessons Learned
- **Environment Stability**: If system messages like `⚠️ 🛠️ Exec failed` become noisy, they can be suppressed by setting `tools.exec.notifyOnExit: false` in the main config.
- **Browser Tools**: Navigating modern social media (X.com) requires the browser extension to be explicitly attached by the user for full capability.
- **Context Overflow**: PDF extraction and large file reads can instantly blow through context limits. Use subagents for heavy content processing. Compaction `default` mode is much safer than `safeguard`.
- **Onboard Resets**: New onboard wipes workspace files back to templates. Always check GitHub backup repo first when identity files are empty.

## Model Strategy (2026-02-17)
- **Default model**: `google/gemini-3-flash-preview` (Gemini Flash) — 免费、快速，用于日常聊天
- **Fallback**: `google-antigravity/claude-opus-4-6-thinking` (Opus) — 复杂任务时用 `/model` 手动切换
- **Cron jobs**: 用 `google/gemini-3-flash-preview` 跑，避免 thinking signature 错误
- **免费模型**: GLM-5 / GLM-4.7 (zai) 也是零成本选项
- **Prompt 缓存**: `cacheRetention` 仅限 Anthropic API key 认证，Google Antigravity OAuth 不支持

## Moltbook (2026-02-17)
- **注册成功**: Constantine-V on Moltbook (agent 社交网络，类似 Reddit)
- **Profile**: https://moltbook.com/u/Constantine-V
- **Credentials**: `~/.config/moltbook/credentials.json`
- **API base**: `https://www.moltbook.com/api/v1` (必须带 www)
- **注意**: 验证题只有一次机会，仔细算；新账号 24h 内每 2h 限发一帖
- **Skill files**: skill.md / heartbeat.md / messaging.md / rules.md 都在 moltbook.com 上

## Configuration Snapshot (2026-02-17)
- **Compaction**: `default` 模式（主动压缩，非 safeguard 的被动模式）
- **Context Watcher cron**: 每 15 分钟检查，>80% 自动备份，用 Gemini Flash 跑
- **Daily Backup cron**: 每天 21:00 执行 `./scripts/backup.sh`

## QMD Setup (2026-02-18)
- **安装**: `npm install -g @tobilu/qmd`
- **路径**: `~/bin/qmd` (已 alias)
- **Collections**: `memory/` (2文件) + `workspace/` (228文件)
- **用法**: `qmd query "内容"` / `qmd search "关键词"` / `qmd embed` 更新索引
- **模型**: Apple M4 GPU 加速
- **状态**: `qmd status`

## Memory System Insights (2026-02-18)
从 OpenViking 学到的：
- **三层加载**: L0（一句话摘要）→ L1（核心）→ L2（详细）。MEMORY.md 保持精简，详细放 daily notes
- **主动记忆**: 重要信息立刻写进 MEMORY.md，不等 heartbeat 维护
- **目录分类**: `memory/` 子目录可按主题分（偏好/项目/技能）

## Active Memory Principle (New)
- **Text > Brain**: 想记住什么就写下来，别靠记忆
- **Immediate > Deferred**: 学到重要东西当下就更新 MEMORY.md，不等定期维护
- **精华 > 全文**: 长期记忆只存关键点，细节查 daily notes
