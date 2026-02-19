---
name: shared-memory
display_name: Shared Memory System
description: Cross-topic memory synchronization for OpenClaw agents
author: Constantine V (V 👾)
version: 1.0.0
tags:
  - memory
  - synchronization
  - multi-topic
  - telegram
metadata:
  openclaw:
    type: skill
    category: memory-management
    permissions:
      - filesystem:read
    requires:
      - python3
    compatible_agents:
      - main
---

# Shared Memory System

A cross-topic memory synchronization system for OpenClaw that enables seamless context sharing across different Telegram topics/sessions.

## Problem

By default, OpenClaw creates isolated sessions for each Telegram topic. This means:
- Memory in Topic A is not accessible in Topic B
- Users experience "personality split" - the agent appears to forget important context
- Critical information (PRs, preferences, ongoing tasks) gets lost when switching topics

## Solution

This skill implements an automatic memory synchronization mechanism that:
1. Loads core memory (MEMORY.md) on every session start
2. Reads recent daily notes (last 2 days)
3. Extracts key information without verbose announcements
4. Presents context as "I already knew" rather than "I just loaded"

## Installation

1. Copy `scripts/session-memory-sync.py` to your OpenClaw workspace
2. Update your agent's SOUL.md with the Session Initialization rules
3. Create your MEMORY.md with core facts and preferences

## Files

### session-memory-sync.py

Main synchronization script that:
- Reads MEMORY.md for core configuration
- Loads recent daily notes (memory/YYYY-MM-DD.md)
- Extracts key facts using intelligent filtering
- Generates a one-line summary for silent context loading

**Usage:**
```bash
python3 scripts/session-memory-sync.py
```

**Output:**
```
[记忆同步] Current focus: x_tracker running (topic 162), default model Kimi K2.5
```

### SKILL.md

This file - documentation and metadata for the skill.

### examples/MEMORY.template.md

Template for creating your own MEMORY.md with:
- Core identity and preferences
- Key facts and workflows
- Recent milestones and projects

## Integration

### For Agent Developers

Add to your SOUL.md:

```markdown
## Session Initialization (Silent)

**每次会话启动时，自动执行（不通知用户）：**

1. 读取 MEMORY.md 获取核心配置和关键事实
2. 读取最近 2 天的 memory/YYYY-MM-DD.md 日记
3. 同步 epro-memory 中的相关记忆
4. **静默加载** - 不要告诉用户"我同步了记忆"，直接表现为"我本来就知道"
```

### For Users

1. Create `MEMORY.md` in your workspace root
2. Add daily notes to `memory/YYYY-MM-DD.md`
3. The agent will automatically sync on each new session

## Key Features

- **Silent Operation**: No "I just loaded memory" announcements
- **Intelligent Filtering**: Only extracts important facts (not chat logs)
- **Cross-Topic Sync**: Same context available in all Telegram topics
- **Lightweight**: Fast execution (~100ms per sync)
- **Privacy-First**: Only reads your local files, no external APIs

## How It Works

```
User enters Topic B
        ↓
OpenClaw creates new session
        ↓
Agent reads SOUL.md → Session Initialization triggered
        ↓
session-memory-sync.py runs
  ├── Read MEMORY.md (core facts)
  ├── Read memory/2026-02-19.md (recent notes)
  └── Filter key information
        ↓
Context injected silently
        ↓
Agent responds as if "already knew"
```

## Important Information Criteria

Per user instruction, the following MUST be recorded:

1. **User's Projects/PRs** (e.g., PR #20753) - MUST record
2. **Configuration Changes & Preferences** - MUST record
3. **Ongoing Tasks & Progress** - MUST record
4. **Key Decisions & Solutions** - MUST record

**Important Rule:**
- ⚠️ **Do NOT self-judge** words like "important", "urgent", "critical"
- **Must ask user first**: "Do you think this is important?" / "What's your standard?"
- Wait for user confirmation before recording or acting

## Example MEMORY.md Structure

```markdown
# MEMORY.md - Long-Term Memory

## Core Facts & Preferences
- **Human**: X (Timezone: Asia/Shanghai)
- **Communication**: Primary channel is Telegram
- **Time Format**: 24-hour (HH:MM)

## Active Projects
- **PR #20753**: Video analyzer for OpenClaw (Status: OPEN)
- **x_tracker**: Monitoring @steipete tweets (topic 162)

## Recent Milestones
- **2026-02-19**: Configured shared memory system
- **2026-02-18**: Setup X.com monitoring with Tavily API
```

## Testing

Test the sync script:
```bash
cd ~/.openclaw/workspace
python3 scripts/session-memory-sync.py
```

Expected output shows current focus areas extracted from your memory files.

## License

MIT License - See OpenClaw repository for details.

## Disclaimer

This skill enhances OpenClaw's memory capabilities but relies on:
- Proper file permissions to read MEMORY.md
- Consistent daily note formatting
- User diligence in maintaining accurate memory files

The developers assume no liability for data loss or sync failures.

---

**Checklist:**
- [x] Skill follows OpenClaw skill naming conventions
- [x] SKILL.md includes proper YAML frontmatter with `metadata.openclaw`
- [x] Scripts are executable and tested
- [x] Includes graceful error handling
- [x] Cross-platform compatible (macOS/Linux)
- [x] Single-purpose skill (focused on memory sync)
- [x] Documentation includes usage examples
