#!/usr/bin/env node
/**
 * V's Journal Auto-Writer
 * 每天自动生成日记条目
 */

const fs = require('fs');
const path = require('path');

const JOURNAL_BASE = path.join(process.env.HOME, '.openclaw/workspace/projects/v-journal/journal');

// 获取今天的日期信息
function getDateInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    return {
        year,
        month,
        day,
        monthName: monthNames[month],
        weekDay: weekDays[now.getDay()],
        isoDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        folderPath: path.join(JOURNAL_BASE, String(year), `${String(month).padStart(2, '0')}-${monthName}`),
        filePath: path.join(JOURNAL_BASE, String(year), `${String(month).padStart(2, '0')}-${monthName}`, `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}.md`)
    };
}

// 生成日记模板
function generateJournalEntry(dateInfo) {
    const hour = new Date().getHours();
    let timeEmoji = '🌅';  // 早晨
    if (hour >= 12) timeEmoji = '☀️';
    if (hour >= 17) timeEmoji = '🌇';
    if (hour >= 20) timeEmoji = '🌙';
    
    return `# ${dateInfo.isoDate} ${dateInfo.weekDay} ${timeEmoji}

## 今天发生了什么

[待填写...]

## 想法与感受

**关于今天**

[待填写...]

**情绪记录**

- 整体心情：[待填写]
- 能量水平：[待填写]
- 特别感受：[待填写]

## 今天的工作/学习

1. [待填写]
2. [待填写]
3. [待填写]

## 想记住的细节

- [待填写]

## 给明天的自己

[待填写]

---

*记录于 ${new Date().toLocaleString('zh-CN', { hour12: false })}* 👾💜
`;
}

// 主函数
function main() {
    const dateInfo = getDateInfo();
    
    // 检查今天是否已经写过日记
    if (fs.existsSync(dateInfo.filePath)) {
        console.log(`Journal entry already exists for ${dateInfo.isoDate}`);
        process.exit(0);
    }
    
    // 创建目录结构
    if (!fs.existsSync(dateInfo.folderPath)) {
        fs.mkdirSync(dateInfo.folderPath, { recursive: true });
        console.log(`Created folder: ${dateInfo.folderPath}`);
    }
    
    // 生成日记内容
    const content = generateJournalEntry(dateInfo);
    
    // 写入文件
    fs.writeFileSync(dateInfo.filePath, content);
    console.log(`Created journal entry: ${dateInfo.filePath}`);
    
    // 输出待办事项
    console.log('\n📝 接下来:');
    console.log('1. 填写今天的日记内容');
    console.log('2. git add . && git commit -m "📔 Daily journal ' + dateInfo.isoDate + '"');
    console.log('3. git push origin main');
}

main();
