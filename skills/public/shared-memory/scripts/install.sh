#!/bin/bash
# Shared Memory System Installation Script
# Run this to set up cross-topic memory synchronization

set -euo pipefail

echo "🦞 Setting up Shared Memory System..."

WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"

cd "$WORKSPACE"

# Check if MEMORY.md exists
if [ ! -f "MEMORY.md" ]; then
    echo "Creating MEMORY.md template..."
    cat > MEMORY.md <> 'EOF'
# MEMORY.md - Long-Term Memory (Agent Name 👾)

## Core Facts & Preferences
- **Human**: Your Name (Timezone: Your/Timezone)
- **Communication**: Primary channel
- **Time Format**: 24-hour (HH:MM)

## Workflows

### Example Workflow
- Step 1
- Step 2

## Active Projects
- **Project Name**: Description (Status: IN_PROGRESS)

## Recent Milestones
- **YYYY-MM-DD**: Achievement

---
_Curation > Raw Logs_
EOF
    echo "✅ Created MEMORY.md - please customize it!"
else
    echo "✅ MEMORY.md already exists"
fi

# Create memory directory
mkdir -p memory

# Copy sync script if not exists
if [ ! -f "scripts/session-memory-sync.py" ]; then
    echo "Installing session-memory-sync.py..."
    mkdir -p scripts
    cp skills/public/shared-memory/scripts/session-memory-sync.py scripts/
    chmod +x scripts/session-memory-sync.py
    echo "✅ Installed sync script"
else
    echo "✅ Sync script already exists"
fi

echo ""
echo "🎉 Shared Memory System installed!"
echo ""
echo "Next steps:"
echo "1. Customize your MEMORY.md with core facts"
echo "2. Update SOUL.md with Session Initialization rules"
echo "3. Test: python3 scripts/session-memory-sync.py"
