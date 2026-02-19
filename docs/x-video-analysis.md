# X 视频推文解读方案

## 方案概述

针对 X 上含有视频的推文，提供完整的视频内容解读能力。

**工作流程：**
```
X 链接 → 下载视频 → 提取音频 → 语音识别 → 文字总结
```

---

## 方案一：本地处理 (推荐，隐私好)

### 依赖工具
- **yt-dlp**: 下载 X 视频
- **ffmpeg**: 提取音频
- **OpenAI Whisper**: 语音识别

### 安装命令
```bash
# yt-dlp 和 ffmpeg 应该已安装
brew install yt-dlp ffmpeg

# 安装 Whisper
pip install openai-whisper
```

### 使用方法
```bash
# 分析 X 视频推文
~/.openclaw/workspace/scripts/x-video-analyzer.sh https://x.com/username/status/1234567890
```

### 输出结果
1. 推文文字内容
2. 视频转录文字
3. 音频文件 (保留)

---

## 方案二：API 方案 (快速，但付费)

如果不想本地安装 Whisper，可以使用：

### 选项 A: OpenAI Whisper API
- 成本: ~$0.006/分钟
- 质量: 很高
- 速度: 快

### 选项 B: Google Speech-to-Text
- 成本: ~$0.024/分钟
- 质量: 高
- 速度: 快
- 支持: 中文很好

### 使用方法
1. 先用脚本下载视频提取音频
2. 将音频上传到 API 转录
3. 返回文字给我总结

---

## 方案三：YouTube 桥接 (如果可用)

如果 X 视频同时发在 YouTube：
1. 提供 YouTube 链接
2. 我可以直接提取字幕
3. 无需下载处理

---

## 当前状态

| 组件 | 状态 | 说明 |
|------|------|------|
| yt-dlp | ✅ 已安装 | 视频下载 |
| ffmpeg | ✅ 已安装 | 音频提取 |
| Whisper | ✅ 已安装 | 语音识别 (2026-02-19) |
| 分析脚本 | ✅ 已创建 | `scripts/x-video-analyzer.sh` |

**Whisper 路径**: `/Library/Frameworks/Python.framework/Versions/3.13/bin/whisper`

---

## 使用建议

**完整方案 (现在就能用):**
1. ✅ 所有组件已安装
2. 发 X 视频链接给我
3. 我自动下载 → 转录 → 总结

**简单方案 (备用):**
1. 你发 X 视频链接
2. 我尝试用 Jina Reader 抓文字
3. 如果视频很重要，你告诉我大致内容，我给你深入分析

**YouTube 方案 (最省事):**
1. 如果 X 视频有 YouTube 版本，直接发 YouTube 链接
2. 我可以提取字幕/转录

---

## 限制说明

- 视频时长: 默认最多处理 10 分钟
- X 保护: 部分视频可能无法下载 (需要登录)
- 语言: Whisper 对中文支持良好，但专业术语可能不准确
- 成本: 本地方案免费，API 方案按量付费

---

## 待办

- [x] 安装 Whisper (2026-02-19)
- [ ] 测试 X 视频下载
- [ ] 验证语音识别质量
- [ ] 整合到自动工作流
