#!/usr/bin/env node
/**
 * 将现有记忆文件导入 LanceDB (epro-memory 底层数据库)
 * 绕过插件系统，直接操作数据库
 */

const fs = require('fs');
const path = require('path');

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
const WORKSPACE_DIR = path.join(process.env.HOME, '.openclaw/workspace');
const DB_PATH = path.join(MEMORY_DIR, 'epro-lancedb');

async function main() {
  console.log('🧠 开始导入现有记忆到 LanceDB...\n');
  console.log('📁 数据库路径:', DB_PATH);
  
  try {
    // 确保目录存在
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DB_PATH, { recursive: true });
      console.log('✅ 创建数据库目录');
    }
    
    // 连接到数据库
    const db = await LanceDB.connect(DB_PATH);
    console.log('✅ 连接到 LanceDB\n');
    
    // 要导入的文件
    const filesToImport = [
      { path: path.join(WORKSPACE_DIR, 'MEMORY.md'), category: 'events', type: 'core' },
      { path: path.join(WORKSPACE_DIR, 'USER.md'), category: 'profile', type: 'user' },
      { path: path.join(WORKSPACE_DIR, 'SOUL.md'), category: 'profile', type: 'agent' },
      { path: path.join(WORKSPACE_DIR, 'TOOLS.md'), category: 'patterns', type: 'tools' },
      { path: path.join(WORKSPACE_DIR, 'AGENTS.md'), category: 'patterns', type: 'workflow' }
    ];
    
    // 扫描 memory/*.md
    const dailyFiles = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md') && f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .map(f => ({
        path: path.join(MEMORY_DIR, f),
        category: 'events',
        type: 'daily',
        date: f.replace('.md', '')
      }));
    
    filesToImport.push(...dailyFiles);
    
    console.log(`📚 发现 ${filesToImport.length} 个记忆文件\n`);
    
    // 准备数据
    const memories = [];
    for (const file of filesToImport) {
      if (!fs.existsSync(file.path)) continue;
      
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const filename = path.basename(file.path);
        
        // 提取标题
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename;
        
        memories.push({
          id: `imported-${filename.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`,
          category: file.category,
          type: file.type,
          l0: title.substring(0, 100),
          l1: content.substring(0, 500).replace(/\n/g, ' '),
          l2: content,
          source: filename,
          date: file.date || new Date().toISOString().split('T')[0],
          imported_at: new Date().toISOString()
        });
        
        console.log(`📄 ${filename} (${file.category})`);
        
      } catch (err) {
        console.log(`❌ ${path.basename(file.path)}: ${err.message}`);
      }
    }
    
    if (memories.length === 0) {
      console.log('\n⚠️  没有可导入的记忆');
      return;
    }
    
    // 创建或获取表
    const tableName = 'memories';
    let table;
    
    try {
      table = await db.openTable(tableName);
      console.log(`\n📂 打开现有表: ${tableName}`);
    } catch {
      // 表不存在，创建新表
      console.log(`\n📂 创建新表: ${tableName}`);
      table = await db.createTable(tableName, memories);
      console.log(`✅ 成功导入 ${memories.length} 条记忆`);
      return;
    }
    
    // 追加到现有表
    await table.add(memories);
    console.log(`✅ 成功追加 ${memories.length} 条记忆`);
    
    // 显示统计
    const count = await table.countRows();
    console.log(`📊 当前记忆总数: ${count}`);
    
  } catch (err) {
    console.error('\n❌ 导入失败:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
