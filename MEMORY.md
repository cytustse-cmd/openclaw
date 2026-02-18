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
- **2026-02-18**: Unified default model to Gemini 2.0 Flash (Previously MiniMax, then Google Gemini; currently leveraging Gemini 2.0 Flash's prompt caching for large context efficiency).
- **2026-02-18**: Configured Telegram group "Time Illusion" (`-1003729762918`) to allow responding without direct mentions (`requireMention: false`).
- **2026-02-18**: Successfully established X.com (Twitter) monitoring workflow using Tavily Search (`mcporter`) instead of browser scraping to bypass anti-scraping measures. Created `scripts/x_tracker.py` for this purpose.
- **2026-02-18**: Published `hugo-blog-starter` template to GitHub (`cytustse-cmd/hugo-blog-starter`) with CC BY-NC 4.0 license.

## Lessons Learned
- **Environment Stability**: If system messages like `⚠️ 🛠️ Exec failed` become noisy, they can be suppressed by setting `tools.exec.notifyOnExit: false` in the main config.
- **Browser Tools**: Navigating modern social media (X.com) requires the browser extension to be explicitly attached by the user for full capability.
- **Context Overflow**: PDF extraction and large file reads can instantly blow through context limits. Use subagents for heavy content processing. Compaction `default` mode is much safer than `safeguard`.
- **Onboard Resets**: New onboard wipes workspace files back to templates. Always check GitHub backup repo first when identity files are empty.
- **Model Rate Limits**: Google Gemini frequently hits rate limits; MiniMax is a stable chat backup. Gemini 2.0 Flash is preferred for efficiency and prompt caching in long sessions.
- **Social Media Tracking**: Avoid browser scraping for X.com/Twitter; use Tavily Search (`mcporter`) as a robust alternative.
- **GitHub Auth**: Workspace operations rely on GitHub tokens found in local `.git/config` for the repository.

## Active Memory Principle (New)
- **Text > Brain**: 想记住什么就写下来，别靠记忆
- **Immediate > Deferred**: 学到重要东西当下就更新 MEMORY.md，不等定期维护
- **精华 > 全文**: 长期记忆只存关键点，细节查 daily notes
