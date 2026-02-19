#!/usr/bin/env python3
"""
从所有会话记录中提取关键信息并写入 MEMORY.md
"""

import json
import os
from datetime import datetime

def extract_from_jsonl(filepath):
    """从 jsonl 文件中提取关键用户指令和决策"""
    key_facts = []
    
    try:
        with open(filepath, 'r') as f:
            for line in f:
                try:
                    data = json.loads(line.strip())
                    
                    # 只处理 message 类型
                    if data.get('type') != 'message':
                        continue
                    
                    msg = data.get('message', {})
                    if msg.get('role') != 'user':
                        continue
                    
                    # 提取文本内容
                    content_parts = msg.get('content', [])
                    if not content_parts:
                        continue
                    
                    # 获取纯文本内容
                    full_text = ""
                    for part in content_parts:
                        if isinstance(part, dict) and part.get('type') == 'text':
                            full_text += part.get('text', '')
                        elif isinstance(part, str):
                            full_text += part
                    
                    # 跳过系统消息和简短消息
                    if len(full_text) < 10 or 'HEARTBEAT_OK' in full_text:
                        continue
                    
                    # 识别关键信息类型
                    is_important = False
                    
                    # 配置变更指令
                    if any(keyword in full_text for keyword in ['默认模型', '改成', '改为', '设置', '配置为', '修复', '创建一个', '添加', '同步']):
                        is_important = True
                    
                    # 偏好设置
                    if any(keyword in full_text for keyword in ['我喜欢', '我要', '我需要', '记得', '不要忘记', '我不喜欢']):
                        is_important = True
                    
                    # 重要问题
                    if any(keyword in full_text for keyword in ['问题', '为什么', '怎么', '故障', '错误', 'bug']):
                        is_important = True
                    
                    if is_important and len(full_text) < 300:
                        # 清理内容
                        clean_text = full_text.replace('\n', ' ').strip()[:200]
                        key_facts.append(clean_text)
                        
                except:
                    continue
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    
    return key_facts

def main():
    sessions_dir = "/Users/xfurious/.openclaw/agents/main/sessions"
    today = datetime.now().strftime('%Y-%m-%d')
    
    all_facts = []
    topic_mapping = {}
    
    # 遍历今天的所有会话文件
    for filename in os.listdir(sessions_dir):
        if not filename.endswith('.jsonl'):
            continue
            
        filepath = os.path.join(sessions_dir, filename)
        
        # 检查文件修改时间是否是今天
        try:
            mtime = os.path.getmtime(filepath)
            file_date = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
            
            if file_date != today:
                continue
            
            # 识别 topic
            topic = "私聊"
            if 'topic-' in filename:
                topic_id = filename.split('topic-')[1].split('.')[0]
                topic = f"topic-{topic_id}"
                
                # 映射已知 topics
                topic_names = {
                    '1': 'System/General',
                    '75': 'Daily Briefing',
                    '125': 'Daily Briefing',
                    '162': 'Tracking_X',
                    '238': 'Auto Cleanup'
                }
                if topic_id in topic_names:
                    topic = f"{topic} ({topic_names[topic_id]})"
            
            facts = extract_from_jsonl(filepath)
            
            for fact in facts:
                all_facts.append({
                    'topic': topic,
                    'content': fact
                })
                
        except Exception as e:
            continue
    
    # 去重
    seen = set()
    unique_facts = []
    for fact in all_facts:
        key = fact['content']
        if key not in seen:
            seen.add(key)
            unique_facts.append(fact)
    
    # 输出摘要
    topics = set(f['topic'] for f in unique_facts)
    print(f"✅ 从 {len(topics)} 个会话中提取了 {len(unique_facts)} 条关键信息\n")
    
    for fact in unique_facts[:15]:
        print(f"[{fact['topic']}] {fact['content'][:100]}...")
    
    if len(unique_facts) > 15:
        print(f"\n... 还有 {len(unique_facts)-15} 条")
    
    return unique_facts

if __name__ == "__main__":
    facts = main()
