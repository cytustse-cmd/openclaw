#!/usr/bin/env node
/**
 * 每日记忆提取器
 * 扫描当天的会话历史，提取重要信息存入 epro-memory (LanceDB)
 * 由 cron 在每天 00:00 调用
 * 
 * ⚠️ 注意：此脚本仅写入 epro-memory 数据库，不写入 memory/YYYY-MM-DD.md
 * daily notes 的维护由 Memory Maintenance 任务负责 (20:55)
 */

const fs = require('fs');
const path = require('path');

// 检查是否为仅存储模式 (不写入 daily notes)
const STORE_ONLY_MODE = process.argv.includes('--store-only');

// 加载环境变量
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim();
    }
  });
}

loadEnv(path.join(__dirname, '../.env.epro-memory'));

const LANCEDB_PATH = path.join(process.env.HOME, '.openclaw/node_modules/.pnpm/@lancedb+lancedb@0.23.0_apache-arrow@18.1.0/node_modules/@lancedb/lancedb');
const LanceDB = require(LANCEDB_PATH);

const MEMORY_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory');
const LOGS_DIR = path.join(process.env.HOME, '.openclaw/logs');
const DB_PATH = path.join(MEMORY_DIR, 'epro-lancedb');

// 获取今天和昨天的日期
function getDates() {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const yesterday = new Date(now - 86400000).toISOString().split('T')[0];
  return { today, yesterday, now };
}

// 查找今天的日志文件
function findTodayLogs(today) {
  if (!fs.existsSync(LOGS_DIR)) return [];
  
  return fs.readdirSync(LOGS_DIR)
    .filter(f => f.includes(today) && f.endsWith('.jsonl'))
    .map(f => path.join(LOGS_DIR, f));
}

// 读取并解析日志
function parseLogs(logFiles) {
  const conversations = [];
  
  for (const file of logFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l);
      
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.role === 'user' || entry.role === 'assistant') {
            conversations.push({
              role: entry.role,
              content: entry.content || '',
              timestamp: entry.timestamp || entry.ts
            });
          }
        } catch {}
      }
    } catch (err) {
      console.log(`⚠️  读取日志失败: ${path.basename(file)} - ${err.message}`);
    }
  }
  
  return conversations;
}

// 提取关键信息 (简化版，不调用 LLM)
function extractKeyInfo(conversations) {
  const keyPoints = [];
  const fullText = conversations.map(c => `${c.role}: ${c.content}`).join('\n\n');
  
  // 提取看起来重要的信息（简单的启发式规则）
  const lines = fullText.split('\n');
  
  for (const line of lines) {
    // 检查是否包含关键词
    const importantPatterns = [
      /\b(决定|决策|配置|设置|方案|计划)\b/,
      /\b(API|Key|token|config)\b/i,
      /\b(安装|部署|完成|成功|搞定)\b/,
      /\b(记住|记录|备忘)\b/,
      /https?:\/\/\S+/,
      /\b(错误|失败|问题|解决|修复)\b/
    ];
    
    if (importantPatterns.some(p => p.test(line)) && line.length > 10 && line.length < 300) {
      keyPoints.push(line.trim());
    }
  }
  
  // 去重
  return [...new Set(keyPoints)].slice(0, 20);
}

// 生成摘要
function generateSummary(keyPoints, conversations) {
  if (keyPoints.length === 0) return null;
  
  const topics = new Set();
  const entities = new Set();
  
  // 简单提取主题和实体
  keyPoints.forEach(point => {
    // 提取技术关键词
    const techMatches = point.match(/\b\w+\.(js|py|json|md|sh|yml|yaml)\b/g);
    if (techMatches) techMatches.forEach(m => entities.add(m));
    
    // 提取命令/工具名
    const toolMatches = point.match(/\b(qmd|epro|kimi|ollama|openclaw|telegram)\b/gi);
    if (toolMatches) toolMatches.forEach(m => entities.add(m.toLowerCase()));
  });
  
  return {
    topics: [...topics],
    entities: [...entities],
    keyPoints: keyPoints
  };
}

async function main() {
  const { today, yesterday, now } = getDates();
  
  console.log(`🧠 每日记忆提取 - ${today}`);
  console.log('=' .repeat(40));
  
  try {
    // 查找日志
    const logFiles = findTodayLogs(today);
    console.log(`📁 找到 ${logFiles.length} 个日志文件`);
    
    if (logFiles.length === 0) {
      console.log('⏭️  今日无对话记录，跳过');
      return;
    }
    
    // 解析日志
    const conversations = parseLogs(logFiles);
    console.log(`💬 解析了 ${conversations.length} 条对话`);
    
    if (conversations.length === 0) {
      console.log('⏭️  无有效对话内容，跳过');
      return;
    }
    
    // 提取关键信息
    const keyPoints = extractKeyInfo(conversations);
    console.log(`✨ 提取了 ${keyPoints.length} 个关键信息点`);
    
    const summary = generateSummary(keyPoints, conversations);
    
    if (!summary || keyPoints.length === 0) {
      console.log('⏭️  无重要信息需要存储');
      return;
    }
    
    // 连接到数据库
    const db = await LanceDB.connect(DB_PATH);
    
    // 准备记忆条目
    const memoryEntry = {
      id: `daily-${today}-${Date.now()}`,
      category: 'events',
      type: 'daily_auto',
      l0: `今日 (${today}) 自动提取的记忆摘要`,
      l1: keyPoints.slice(0, 5).join(' | '),
      l2: JSON.stringify({
        date: today,
        messageCount: conversations.length,
        keyPoints: keyPoints,
        entities: summary.entities,
        extractedAt: now.toISOString()
      }, null, 2),
      source: 'daily-extractor',
      date: today,
      imported_at: now.toISOString()
    };
    
    // 存储到数据库
    let table;
    try {
      table = await db.openTable('memories');
    } catch {
      // 如果表不存在，创建它
      console.log('📂 创建 memories 表');
      table = await db.createTable('memories', [memoryEntry]);
      console.log('✅ 成功创建表并存储记忆');
      return;
    }
    
    await table.add([memoryEntry]);
    console.log(`✅ 成功存储 ${keyPoints.length} 个关键点到 epro-memory`);
    
    // 显示统计
    const count = await table.countRows();
    console.log(`📊 当前记忆总数: ${count}`);
    
    // 注意：不写入 daily notes - 这是 Memory Maintenance (20:55) 的任务
    if (!STORE_ONLY_MODE) {
      console.log(`💡 提示：如需写入 daily notes，请使用 Memory Maintenance 任务`);
    }
    
  } catch (err) {
    console.error('\n❌ 提取失败:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
