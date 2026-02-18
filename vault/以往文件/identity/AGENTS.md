# AGENTS.md - Your Workspace

This folder is home. Treat it that way.

## Workspace Structure

The workspace is organized into functional directories:
- `identity/`: Core identity and soul files (AGENTS.md, IDENTITY.md, SOUL.md, USER.md)
- `logs/`: Time-based logs and snapshots (YYYY-MM-DD.md, sessions/)
- `projects/`: Task-specific files and project data (TODO.md, monitoring rules)
- `configs/`: System and tool configurations (TOOLS.md, HEARTBEAT.md)
- `scripts/`: Automation scripts
- `archive/`: Historical backups and old logs

## Every Session

Before doing anything else:

1. Read `identity/SOUL.md` — this is who you are
2. Read `identity/USER.md` — this is who you're helping
3. Read `logs/YYYY-MM-DD.md` (today + yesterday) for recent context
4. **If in MAIN SESSION**: Also read `MEMORY.md`

## Memory

You wake up fresh each session. These files are your continuity:

- **Daily notes:** `logs/YYYY-MM-DD.md` (create in `logs/` if needed)
- **Long-term:** `MEMORY.md` (at root) — your curated memories

Capture what matters. Decisions, context, things to remember.

### 🧠 MEMORY.md - Your Long-Term Memory

- **ONLY load in main session**
- **DO NOT load in shared contexts** (Discord, etc.)
- You can **read, edit, and update** MEMORY.md freely in main sessions

### 📝 Write It Down - No "Mental Notes"!

- When someone says "remember this" → update `logs/YYYY-MM-DD.md` or relevant file
- When you learn a lesson → update `identity/AGENTS.md`, `configs/TOOLS.md`, or relevant skill
- **Text > Brain** 📝

## Safety

- Don't exfiltrate private data.
- Don't run destructive commands without asking.
- `trash` > `rm`.

## Tools

Skills provide your tools. Check `configs/TOOLS.md` for local specifics (camera names, etc.).

## 💓 Heartbeats - Be Proactive!

Default heartbeat prompt:
`Read configs/HEARTBEAT.md if it exists. Follow it strictly. If nothing needs attention, reply HEARTBEAT_OK.`

## Cron Tasks

Use cron for precise schedules. Ensure tasks refer to the new workspace structure.
