#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime

# Path to the transcript and memory store
TRANSCRIPT_PATH = "/Users/xfurious/.openclaw/workspace/73427590-9ac7-4241-8542-90903fad9bbb.jsonl"
MEMORY_STORE = "/Users/xfurious/.openclaw/workspace/memory/epro_v2_distilled.json"
STATE_FILE = "/Users/xfurious/.openclaw/workspace/scripts/distiller_state.json"

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {"last_processed_line": 0}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def read_new_messages(last_line):
    messages = []
    total_lines = 0
    if not os.path.exists(TRANSCRIPT_PATH):
        return messages, 0
    
    with open(TRANSCRIPT_PATH, 'r') as f:
        lines = f.readlines()
        total_lines = len(lines)
        new_lines = lines[last_line:]
        
        for line in new_lines:
            try:
                data = json.loads(line)
                role_val = data.get("role")
                content = data.get("content")
                if role_val in ["user", "assistant"] and content:
                    role = "X" if role_val == "user" else "V"
                    if isinstance(content, list):
                        content = " ".join([item.get("text", "") for item in content if item.get("type") == "text"])
                    if isinstance(content, str) and content.strip():
                        messages.append(f"{role}: {content}")
            except:
                continue
    
    return messages, total_lines

def main():
    state = load_state()
    messages, total_lines = read_new_messages(state["last_processed_line"])
    
    if not messages:
        print("NO_NEW_MESSAGES")
        return

    # Prepare the context for Gemini
    context = "\n".join(messages[-50:]) # Limit to last 50 for quality
    
    # We will output this to be caught by the sub-agent
    print(json.dumps({
        "status": "ready",
        "total_messages": len(messages),
        "context": context
    }, ensure_ascii=False))
    
    # Update state
    state["last_processed_line"] = total_lines
    save_state(state)

if __name__ == "__main__":
    main()
