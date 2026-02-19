#!/usr/bin/env node
/**
 * 将现有记忆文件导入 epro-memory
 * 扫描 MEMORY.md 和 memory/*.md，提取内容并写入 LanceDB
 */

const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnv(filePath) {
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

const EPRO_PATH = path.join(process.env.HOME, '.openclaw/node_modules/@tobybridges/epro-memory');
const MEMORY_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory');
const WORKSPACE_DIR = path.join(process.env.HOME, '.openclaw/workspace');

async function main() {
  console.log('🧠 开始导入现有记忆到 epro-memory...\n');
  
  try {
    // 动态加载 epro-memory
    const { EproMemory } = require(EPRO_PATH);
    
    // 初始化配置
    const config = {
      embedding: {
        apiKey: process.env.Epro_MEMORY_EMBEDDING_API_KEY,
        baseUrl: process.env.Epro_MEMORY_EMBEDDING_BASE_URL || 'https://api.moonshot.cn/v1',
        model: process.env.Epro_MEMORY_EMBEDDING_MODEL || 'text-embedding-3-small'
      },
      llm: {
        apiKey: process.env.Epro_MEMORY_LLM_API_KEY,
        baseUrl: process.env.Epro_MEMORY_LLM_BASE_URL || 'https://api.moonshot.cn/v1',
        model: process.env.Epro_MEMORY_LLM_MODEL || 'kimi-k2-5'
      },
      dbPath: path.join(MEMORY_DIR, 'epro-lancedb'),
      autoCapture: false,  // 导入时关闭自动捕获
      autoRecall: false
    };
    
    console.log('📁 数据库路径:', config.dbPath);
    console.log('🤖 LLM 模型:', config.llm.model);
    console.log('');
    
    // 初始化 epro-memory
    const memory = new EproMemory(config);
    await memory.initialize();
    console.log('✅ epro-memory 初始化成功\n');
    
    // 要导入的文件列表
    const filesToImport = [
      { path: path.join(WORKSPACE_DIR, 'MEMORY.md'), category: 'events', type: 'core' },
      { path: path.join(WORKSPACE_DIR, 'USER.md'), category: 'profile', type: 'user' },
      { path: path.join(WORKSPACE_DIR, 'SOUL.md'), category: 'profile', type: 'agent' },
      { path: path.join(WORKSPACE_DIR, 'TOOLS.md'), category: 'patterns', type: 'tools' },
      { path: path.join(WORKSPACE_DIR, 'AGENTS.md'), category: 'patterns', type: 'workflow' }
    ];
    
    // 扫描 memory/*.md 文件
    const dailyFiles = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md') && f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
      .map(f => ({
        path: path.join(MEMORY_DIR, f),
        category: 'events',
        type: 'daily',
        date: f.replace('.md', '')
      }));
    
    filesToImport.push(...dailyFiles);
    
    console.log(`📚 发现 ${filesToImport.length} 个记忆文件:\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // 逐个导入
    for (const file of filesToImport) {
      if (!fs.existsSync(file.path)) {
        console.log(`⏭️  跳过 (不存在): ${path.basename(file.path)}`);
        skipCount++;
        continue;
      }
      
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const filename = path.basename(file.path);
        
        // 提取标题或生成描述
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename;
        
        console.log(`📥 导入: ${filename} (${file.category})`);
        
        // 构造记忆条目
        const memoryEntry = {
          id: `imported-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`,
          category: file.category,
          l0: title.substring(0, 100),  // 一句话摘要
          l1: content.substring(0, 500).replace(/\n/g, ' '),  // 结构化总结
          l2: content,  // 完整内容
          metadata: {
            source: filename,
            importedAt: new Date().toISOString(),
            type: file.type,
            ...(file.date && { date: file.date })
          }
        };
        
        // 写入数据库
        await memory.store(memoryEntry);
        successCount++;
        
      } catch (err) {
        console.log(`❌ 失败: ${path.basename(file.path)} - ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 导入完成:`);
    console.log(`   ✅ 成功: ${successCount}`);
    console.log(`   ⏭️  跳过: ${skipCount}`);
    console.log(`   ❌ 失败: ${errorCount}`);
    
    // 测试召回
    console.log(`\n🔍 测试记忆召回...`);
    const testQuery = await memory.recall('X.com 文章分析', { limit: 3 });
    console.log(`   召回 ${testQuery.length} 条相关记忆`);
    
    await memory.close();
    console.log('\n✨ 所有记忆已导入 epro-memory！');
    
  } catch (err) {
    console.error('\n❌ 导入失败:', err.message);
    if (err.message.includes('Cannot find module')) {
      console.log('💡 提示: 请确保 epro-memory 已安装: pnpm add @tobybridges/epro-memory');
    }
    process.exit(1);
  }
}

main();
