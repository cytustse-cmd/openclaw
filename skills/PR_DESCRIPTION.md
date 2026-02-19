# Add video-analyzer skill for X/Twitter video analysis

## Summary

This PR introduces a new `video-analyzer` skill that enables OpenClaw to download and analyze video content from X/Twitter posts. It extracts both the tweet text and spoken audio content using Whisper speech recognition, providing comprehensive analysis of video tweets.

## Key Features

- **Reliable video download** via VxTwitter API (bypasses X's anti-scraping protection)
- **Graceful degradation** - returns tweet text analysis if video is unavailable
- **Extract audio** with ffmpeg and transcribe with OpenAI Whisper
- **Automatic language detection** - Whisper detects language automatically (no hardcoded language)
- **Cross-platform compatibility** - macOS/Linux compatible with proper metadata for dependency management

## How It Works

1. **Fetch tweet data** via VxTwitter API (get tweet text + direct video URL)
2. **Download video** directly from CDN (bypasses X's bot protection)
3. **Extract audio** using ffmpeg
4. **Transcribe speech** using Whisper with automatic language detection
5. **Graceful fallback** - if video download fails, returns tweet text with explanatory note

## Example Usage

```bash
# Direct script usage
scripts/analyze-x-video.sh https://x.com/username/status/1234567890
```

Or via OpenClaw agent:
> "Analyze this X video: https://x.com/i/status/2024084299210019008"

## Real-World Test Results

Tested successfully on the viral OpenClaw interview video:
- ✅ Tweet text extracted: "OpenAI may have just paid $10B+ to acquire OpenClaw"
- ✅ Video downloaded: 12MB MP4 (168 seconds)
- ✅ Audio extracted and transcribed
- ✅ Detected language: English
- ✅ Full transcript generated with timestamps

## Technical Highlights

### Robustness
- **VxTwitter API fallback**: Uses vxtwitter.com API to get direct video URLs, avoiding X's rate limiting and anti-bot measures
- **Graceful degradation**: If video download fails (protected/private posts), returns tweet text with system note explaining the limitation
- **Whisper path detection**: Automatically finds Whisper installation on macOS (Python Framework) or PATH

### Code Quality
- Follows OpenClaw skill conventions with proper `metadata.openclaw` section
- Includes installation instructions for dependencies (brew/pip)
- macOS-compatible (no `grep -P` dependencies)
- Uses `set -euo pipefail` for strict error handling

## Requirements

- `curl` - API requests and video download
- `ffmpeg` - Audio extraction (install via `brew install ffmpeg` or `apt install ffmpeg`)
- `openai-whisper` - Speech recognition (install via `pip3 install openai-whisper`)

## Limitations

- Maximum 10 minutes of video processed per request (performance limit)
- Requires publicly accessible X posts (private accounts won't work)
- Audio quality affects transcription accuracy
- First Whisper run downloads model (~461MB) - may take a few minutes

## Files Changed

- `skills/public/video-analyzer/SKILL.md` - Skill metadata and documentation
- `skills/public/video-analyzer/scripts/analyze-x-video.sh` - Main script (157 lines)

## Related Issues

This addresses the common need to analyze X video content that contains spoken information not captured by text extraction alone (Jina Reader only gets tweet text, not video audio).

The VxTwitter API approach significantly improves reliability compared to direct yt-dlp scraping, which often fails due to X's aggressive anti-bot protection.

---

## Disclaimer

This skill is provided for educational and research purposes. Users are responsible for:

- Complying with X/Twitter's Terms of Service and applicable laws
- Respecting copyright and intellectual property rights when downloading content
- Ensuring their use complies with platform policies and local regulations

The developers assume no liability for misuse or violation of third-party terms. Video analysis should be limited to publicly accessible content that users have permission to process.

---

**Checklist:**
- [x] Skill follows OpenClaw skill naming conventions
- [x] SKILL.md includes proper YAML frontmatter with `metadata.openclaw`
- [x] Scripts are executable and tested on real X posts
- [x] Includes graceful error handling and fallback behavior
- [x] Cross-platform compatible (macOS/Linux)
- [x] Single-purpose skill (not overly broad)
