# OpenClaw 已知问题记录

## 2026-02-15

### 1. 内置浏览器 (openclaw profile) 连接问题
**问题描述：**
- 内置浏览器能启动（`browser start --profile openclaw`）
- 能列出标签页（`browser tabs`）
- 但无法执行页面操作：
  - `browser snapshot` → 报错 "Can't reach the OpenClaw browser control service"
  - `browser navigate` → 同样报错
  - `browser act` → 同样报错

**错误信息：**
```
Can't reach the OpenClaw browser control service. 
Start (or restart) the OpenClaw gateway and try again.
(Error: Error: tab not found)
```

**影响：**
- 无法实现完全无人值守的浏览器自动化
- 刷推、网页抓取等功能仍需 Chrome 扩展模式
- Chrome 扩展模式需要用户手动点击图标授权

**优先级：** 中（影响无人值守场景）

**可能的解决方案：**
1. 检查内置浏览器的 CDP (Chrome DevTools Protocol) 连接
2. 确认 `browser/service` 配置是否正确
3. 尝试 headless 模式是否更稳定

---

### 2. 辅助功能权限 (Accessibility)
**问题描述：**
- 已给 Terminal 完全磁盘访问权限 ✅
- 已给 Terminal 辅助功能权限 ✅
- 但 node 进程执行 AppleScript 控制应用时仍报错：
  ```
  execution error: "System Events"遇到一个错误：
  "osascript"不允许辅助访问。 (-1719)
  ```

**影响：**
- 无法控制夸克/阿里云盘等客户端应用
- 无法模拟鼠标键盘操作
- 无法实现应用自动化（上传、点击等）

**优先级：** 高（影响文件上传等核心功能）

**可能的解决方案：**
1. 给 `/usr/local/bin/node` 辅助功能权限
2. 给 OpenClaw 网关进程辅助功能权限
3. 使用纯命令行工具替代 GUI 自动化

---

## 已解决 ✅

### RSS 抓取功能
- 使用 curl + bash 脚本成功抓取科技新闻
- 支持 BBC/CNN/NYT/WSJ 等主流媒体

### GitHub 自动备份
- 每天 21:00 自动备份 .md 配置文件
- 已成功配置 cron 任务

### X 监控任务
- 已配置 23:00 提醒 + 手动启动模式
- 每 27 分钟刷新一次

### 语音转文字 (STT)
- Google Speech-to-Text 已激活
- 支持中文识别

### 图片识别 (Vision)
- Google Vision API 已激活
- 支持物体识别、OCR、颜色分析

---

*记录时间：2026-02-15 23:00*