#!/usr/bin/env python3
"""
会话启动记忆同步脚本
自动读取核心记忆和近期重要事项
"""

import os
import sys
from datetime import datetime, timedelta

def read_memory_md():
    """读取核心长期记忆"""
    memory_path = "/Users/xfurious/.openclaw/workspace/MEMORY.md"
    try:
        with open(memory_path, 'r') as f:
            content = f.read()
            # 提取关键配置和事实
            key_facts = []
            for line in content.split('\n'):
                if any(keyword in line for keyword in ['默认模型', '配置', '任务', '问题', '解决方案']):
                    if line.strip() and not line.startswith('#'):
                        key_facts.append(line.strip())
            return key_facts[:5]  # 最多5条关键事实
    except Exception as e:
        return []

def read_recent_daily_notes():
    """读取最近2天的日记"""
    memory_dir = "/Users/xfurious/.openclaw/workspace/memory"
    recent_facts = []
    
    for i in range(2):  # 最近2天
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        note_path = f"{memory_dir}/{date}.md"
        
        if os.path.exists(note_path):
            try:
                with open(note_path, 'r') as f:
                    content = f.read()
                    # 提取重要事项（带 - 或 ## 的行）
                    for line in content.split('\n'):
                        if line.strip().startswith('- ') or line.strip().startswith('## '):
                            clean_line = line.strip().lstrip('- #')
                            if len(clean_line) > 10 and not clean_line.startswith('Memory'):
                                recent_facts.append(clean_line)
                                if len(recent_facts) >= 3:  # 每天最多3条
                                    break
            except:
                pass
    
    return recent_facts[:5]  # 总共最多5条

def generate_memory_summary():
    """生成记忆摘要"""
    core_facts = read_memory_md()
    recent_facts = read_recent_daily_notes()
    
    # 去重
    all_facts = list(dict.fromkeys(core_facts + recent_facts))
    
    if not all_facts:
        return None
    
    # 生成一句话摘要
    if len(all_facts) <= 3:
        summary = " | ".join(all_facts[:3])
    else:
        summary = f"当前关注: {all_facts[0]}, 另有 {len(all_facts)-1} 项进行中的配置"
    
    return summary[:150] + "..." if len(summary) > 150 else summary

if __name__ == "__main__":
    summary = generate_memory_summary()
    if summary:
        print(f"[记忆同步] {summary}")
    else:
        print("[记忆同步] 无重要待办事项")
