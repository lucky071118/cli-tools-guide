---
title: "ffmpeg — Command-Line Media Processor"
description: "Learn how to use ffmpeg to convert, stream, and manipulate audio/video from the terminal. Includes installation, common commands, tips, and advanced workflows."
category: media
tags: [ffmpeg, video, audio, transcoding, media, cli]
featured: false
installCommand: "brew install ffmpeg"
officialUrl: "https://ffmpeg.org"
related: [bat, fzf]
pubDate: 2026-07-26
author: "CLI Tools Guide"
lastUpdated: 2026-07-26
---

# ffmpeg — Command-Line Media Processor

## What is ffmpeg?

**ffmpeg** is the Swiss army knife of audio and video processing: a powerful open-source CLI tool for converting, streaming, encoding, decoding, resizing, and filtering media. It supports virtually every codec and container, making it the go-to utility for automated media workflows and quick terminal transformations.

## Why Use ffmpeg?

- 🎬 **Universal media support** — handles audio, video, and streams
- ⚡ **Fast batch processing** — script conversions, resizing, and filters
- 🔄 **Flexible format conversion** — MP4, MKV, WebM, MP3, AAC, and more
- 🎚️ **Advanced filters** — crop, scale, normalize audio, subtitles, overlays
- 📦 **Automation-friendly** — ideal for CI pipelines, build processes, and media automation
- 🧩 **Broad ecosystem** — works with OBS, YouTube, HLS, WebRTC, and other tools

## Installation

```bash
# macOS (Homebrew)
brew install ffmpeg

# Ubuntu / Debian
sudo apt update
sudo apt install ffmpeg

# Fedora
dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg

# Windows (Scoop)
scoop install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg
```

## Basic Usage

```bash
# Show ffmpeg version and supported formats
ffmpeg -version

# Convert video from MKV to MP4
ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4

# Convert WAV audio to MP3
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3

# Extract audio only
ffmpeg -i input.mp4 -vn -acodec copy audio.aac

# Resize video to 1280x720
ffmpeg -i input.mp4 -vf "scale=1280:720" output-720p.mp4
```

## 💡 Tips & Tricks

### Tip 1: Convert Without Re-encoding When Possible

Use stream copy mode (`-c copy`) to avoid quality loss and save time:

```bash
ffmpeg -i input.mkv -c copy output.mp4
```

### Tip 2: Compress Video with Quality Control

Use CRF to balance quality and size:

```bash
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### Tip 3: Extract a Clip

Trim video with start/end times using `-ss` and `-to`:

```bash
ffmpeg -ss 00:01:30 -to 00:02:15 -i input.mp4 -c copy clip.mp4
```

### Tip 4: Add a Text Watermark

Overlay text using the `drawtext` filter:

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='My Brand':fontcolor=white:fontsize=24:x=10:y=H-th-10" -codec:a copy output-watermark.mp4
```

### Tip 5: Normalize Audio Loudness

Apply loudness normalization with the `loudnorm` filter:

```bash
ffmpeg -i input.mp3 -af loudnorm=I=-16:LRA=11:TP=-1.5 output-normalized.mp3
```

### Tip 6: Convert GIF to Video and Back

```bash
ffmpeg -i input.gif -movflags faststart -pix_fmt yuv420p output.mp4
ffmpeg -i input.mp4 -vf "fps=15,scale=640:-1:flags=lanczos" output.gif
```

### Tip 7: Create a Video from Images

```bash
ffmpeg -framerate 30 -pattern_type glob -i 'frames/*.png' -c:v libx264 -pix_fmt yuv420p timelapse.mp4
```

### Tip 8: Burn Subtitles into a Video

```bash
ffmpeg -i input.mp4 -vf "subtitles=subs.srt:force_style='FontName=Arial,FontSize=24'" -c:a copy output-subs.mp4
```

## Advanced Applications

### Convert Multiple Files in a Folder

```bash
mkdir -p converted
for f in *.mov; do
  ffmpeg -i "$f" -c:v libx264 -crf 22 -preset fast -c:a aac -b:a 160k "converted/${f%.*}.mp4"
done
```

### Record Your Screen on macOS

```bash
ffmpeg -f avfoundation -framerate 30 -i "1:0" -c:v libx264 -preset ultrafast screen-record.mp4
```

### Stream to YouTube Live

```bash
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 2500k \
  -maxrate 2500k -bufsize 5000k -c:a aac -b:a 160k \
  -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY"
```
