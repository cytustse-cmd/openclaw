#!/usr/bin/env python3
"""
Session Memory Synchronization Script
Automatically reads core memory and recent important items

Part of the Shared Memory System for OpenClaw
"""

import os
import sys
from datetime import datetime, timedelta

def get_workspace_path():
    """Get OpenClaw workspace path from environment or default"""
    return os.environ.get('OPENCLAW_WORKSPACE', 
                          os.path.expanduser('~/.openclaw/workspace'))

def read_memory_md():
    """Read core long-term memory from MEMORY.md"""
    workspace = get_workspace_path()
    memory_path = os.path.join(workspace, "MEMORY.md")
    
    try:
        with open(memory_path, 'r') as f:
            content = f.read()
            # Extract key configuration and facts
            key_facts = []
            for line in content.split('\n'):
                # Look for lines with important keywords
                if any(keyword in line for keyword in 
                       ['默认模型', '配置', '任务', '问题', '解决方案', 
                        'default model', 'config', 'task', 'project', 'PR']):
                    if line.strip() and not line.startswith('#'):
                        key_facts.append(line.strip())
            return key_facts[:5]  # Max 5 key facts
    except Exception as e:
        return []

def read_recent_daily_notes():
    """Read last 2 days of daily notes"""
    workspace = get_workspace_path()
    memory_dir = os.path.join(workspace, "memory")
    recent_facts = []
    
    for i in range(2):  # Last 2 days
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        note_path = os.path.join(memory_dir, f"{date}.md")
        
        if os.path.exists(note_path):
            try:
                with open(note_path, 'r') as f:
                    content = f.read()
                    # Extract important items (lines starting with - or ##)
                    for line in content.split('\n'):
                        if line.strip().startswith('- ') or line.strip().startswith('## '):
                            clean_line = line.strip().lstrip('- #')
                            if len(clean_line) > 10 and not clean_line.startswith('Memory'):
                                recent_facts.append(clean_line)
                                if len(recent_facts) >= 3:  # Max 3 per day
                                    break
            except:
                pass
    
    return recent_facts[:5]  # Max 5 total

def generate_memory_summary():
    """Generate a one-line memory summary"""
    core_facts = read_memory_md()
    recent_facts = read_recent_daily_notes()
    
    # Deduplicate
    all_facts = list(dict.fromkeys(core_facts + recent_facts))
    
    if not all_facts:
        return None
    
    # Generate one-line summary
    if len(all_facts) <= 3:
        summary = " | ".join(all_facts[:3])
    else:
        summary = f"Current focus: {all_facts[0]}, plus {len(all_facts)-1} ongoing items"
    
    return summary[:150] + "..." if len(summary) > 150 else summary

def main():
    """Main entry point"""
    summary = generate_memory_summary()
    if summary:
        print(f"[Memory Sync] {summary}")
    else:
        print("[Memory Sync] No important items pending")
    return 0

if __name__ == "__main__":
    sys.exit(main())
