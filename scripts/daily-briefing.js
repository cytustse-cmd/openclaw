#!/usr/bin/env node
/**
 * Daily Briefing Generator
 * Generates a morning briefing for X
 * Run at 8:45 AM daily via cron
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/xfurious/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const DIGEST_DIR = path.join(WORKSPACE, 'ai-daily-digest');

// Date formatting helpers
function formatDate(date) {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  
  return `${monthName}${dayNum} ${dayName}`;
}

function getGreeting(hour) {
  if (hour < 12) return '☀️ 早安';
  if (hour < 18) return '🌤️ 下午好';
  return '🌙 晚上好';
}

// Get yesterday's date string
function getYesterdayStr() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Get yesterday's memory file content for "昨日回顾"
function getYesterdayReview() {
  const yesterdayStr = getYesterdayStr();
  const yesterdayFile = path.join(MEMORY_DIR, `${yesterdayStr}.md`);
  
  if (!fs.existsSync(yesterdayFile)) {
    return null;
  }
  
  const content = fs.readFileSync(yesterdayFile, 'utf-8');
  const lines = content.split('\n');
  
  // Extract key entries - lines with timestamps (## HH:MM) or bullet points
  const entries = [];
  let currentSection = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and headers
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Check for timestamp headers
    if (trimmed.match(/^## \d{2}:\d{2}/)) {
      currentSection = trimmed.replace('## ', '');
      continue;
    }
    
    // Extract bullet points with meaningful content
    if (trimmed.match(/^[-*]\s+/)) {
      const item = trimmed.replace(/^[-*]\s+/, '');
      // Skip very short items
      if (item.length > 10) {
        entries.push({
          time: currentSection || yesterdayStr,
          content: item
        });
      }
    }
  }
  
  return entries.length > 0 ? entries.slice(0, 8) : null; // Limit to 8 items
}

// Check today's memory file for notes/todos
function getTodayNotes() {
  const today = new Date().toISOString().split('T')[0];
  const todayFile = path.join(MEMORY_DIR, `${today}.md`);
  
  if (!fs.existsSync(todayFile)) {
    return null;
  }
  
  const content = fs.readFileSync(todayFile, 'utf-8');
  
  // Extract TODO items (lines starting with - [ ] or containing "TODO")
  const todos = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^- \[ \]/) || trimmed.match(/TODO|todo|待办/i)) {
      todos.push(trimmed.replace(/^- \[ \]\s*/, '').replace(/TODO[:：]?\s*/i, ''));
    }
  }
  
  return todos.length > 0 ? todos : null;
}

// Get pending items from recent memory files
function getPendingItems() {
  const pending = [];
  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort()
    .slice(-7); // Last 7 days
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for pending/unfinished items
      if (trimmed.match(/pending|waiting|blocked|待处理|等待/i) && 
          !trimmed.match(/completed|done|finished|完成/)) {
        pending.push({
          date: file.replace('.md', ''),
          item: trimmed.replace(/^[-*]\s*/, '')
        });
      }
    }
  }
  
  return pending.slice(0, 5); // Limit to 5 items
}

// Check system status
function getSystemStatus() {
  const status = {
    cronJobs: 'unknown',
    lastBackup: 'unknown',
    gitStatus: 'unknown'
  };
  
  try {
    // Check if backup exists
    const backupDir = path.join(WORKSPACE, 'backups');
    if (fs.existsSync(backupDir)) {
      const backups = fs.readdirSync(backupDir)
        .filter(f => f.endsWith('.tar.gz'))
        .sort();
      if (backups.length > 0) {
        status.lastBackup = backups[backups.length - 1].replace('.tar.gz', '');
      }
    }
    
    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { 
        cwd: WORKSPACE,
        encoding: 'utf-8',
        timeout: 5000
      });
      status.gitStatus = gitStatus.trim() ? 'uncommitted changes' : 'clean';
    } catch (e) {
      status.gitStatus = 'not tracked';
    }
    
  } catch (e) {
    // Ignore errors
  }
  
  return status;
}

// Get latest AI digest (tech news)
function getLatestDigest() {
  const DIGEST_FILE = '/tmp/digest.md';
  
  if (!fs.existsSync(DIGEST_FILE)) {
    return null;
  }
  
  const content = fs.readFileSync(DIGEST_FILE, 'utf-8');
  
  // Extract key sections
  const result = {
    highlights: [],
    todayView: '',
    articles: []
  };
  
  const lines = content.split('\n');
  
  // Extract "今日看点"
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('今日看点')) {
      const nextLines = [];
      for (let j = i + 1; j < lines.length && j < i + 5; j++) {
        if (lines[j].trim().startsWith('##') || lines[j].trim() === '---') break;
        if (lines[j].trim()) nextLines.push(lines[j].trim().replace(/> /g, ''));
      }
      result.todayView = nextLines.join(' ').substring(0, 200);
      break;
    }
  }
  
  // Extract Top 3 highlights (look for lines with 🥇🥈🥉)
  for (const line of lines) {
    if (line.includes('🥇') || line.includes('🥈') || line.includes('🥉')) {
      const match = line.match(/\*\*(.+?)\*\*/);
      if (match && result.highlights.length < 3) {
        result.highlights.push(match[1]);
      }
    }
  }
  
  // Extract article list (look for numbered items under categories)
  const categoryPattern = /^##\s+[💡⚙️🤖🔒🛠📝📰]/;
  let currentCategory = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for category headers
    if (categoryPattern.test(trimmed)) {
      currentCategory = trimmed.replace(/^##\s+/, '').trim();
      continue;
    }
    
    // Extract article numbers (### 1., ### 2., etc.)
    const articleMatch = trimmed.match(/^###\s+(\d+)\.\s+(.+)$/);
    if (articleMatch && currentCategory) {
      let title = articleMatch[2].trim();
      // Remove markdown links
      title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      // Remove trailing info after —
      title = title.split('—')[0].trim();
      
      if (title.length > 5) {
        result.articles.push({
          category: currentCategory,
          title: title
        });
      }
    }
  }
  
  return result.articles.length > 0 ? result : null;
}

// Generate the briefing
async function generateBriefing() {
  const now = new Date();
  const hour = now.getHours();
  const yesterdayStr = getYesterdayStr();
  
  const greeting = getGreeting(hour);
  const dateStr = formatDate(now);
  
  let briefing = `${greeting}, X! 👾\n\n`;
  briefing += `📅 ${dateStr}\n`;
  briefing += `⏰ ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}\n\n`;
  
  // Weather placeholder - will be filled by actual API call
  briefing += `🌤️ Weather: (fetched separately)\n\n`;
  
  // Yesterday review
  const yesterdayEntries = getYesterdayReview();
  if (yesterdayEntries) {
    briefing += `📡 昨日回顾 (${yesterdayStr}):\n`;
    yesterdayEntries.forEach(entry => {
      const content = entry.content.length > 70 ? entry.content.substring(0, 70) + '...' : entry.content;
      briefing += `  • ${content}\n`;
    });
    briefing += '\n';
  }
  
  // Tech news digest - DISABLED by user preference
  // const digest = getLatestDigest();
  // if (digest && digest.highlights && digest.highlights.length > 0) {
  //   briefing += `📰 今日科技新闻 (Top 5):\n`;
  //   digest.articles.forEach((article, idx) => {
  //     const title = article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title;
  //     briefing += `  ${idx + 1}. ${title}\n`;
  //   });
  //   briefing += '\n';
  // }
  
  // Today's notes
  const todayNotes = getTodayNotes();
  if (todayNotes) {
    briefing += `📝 今日待办:\n`;
    todayNotes.forEach(note => {
      briefing += `  • ${note}\n`;
    });
    briefing += '\n';
  }
  
  // Pending items
  const pending = getPendingItems();
  if (pending.length > 0) {
    briefing += `⏳ 待处理事项:\n`;
    pending.forEach(p => {
      const item = p.item.length > 50 ? p.item.substring(0, 50) + '...' : p.item;
      briefing += `  • [${p.date}] ${item}\n`;
    });
    briefing += '\n';
  }
  
  // System status
  const sysStatus = getSystemStatus();
  briefing += `⚡ 系统状态:\n`;
  briefing += `  • 上次备份: ${sysStatus.lastBackup}\n`;
  briefing += `  • Git 状态: ${sysStatus.gitStatus}\n\n`;
  
  briefing += `祝你今天顺利！✨`;
  
  return briefing;
}

// Main execution
if (require.main === module) {
  generateBriefing().then(briefing => {
    console.log(briefing);
  }).catch(err => {
    console.error('Error generating briefing:', err);
    process.exit(1);
  });
}

module.exports = { generateBriefing };
