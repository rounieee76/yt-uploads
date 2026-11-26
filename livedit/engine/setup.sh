#!/usr/bin/env bash
# Fresh-workspace setup for the Lived It engine (~5 min). Creates /home/claude/lived/{kit,fonts,models} and /home/claude/dl assets.
set -euo pipefail
REPO=/home/claude/yt-uploads; L=/home/claude/lived; DL=/home/claude/dl
mkdir -p $L/kit $L/fonts $L/models $DL
cp $REPO/livedit/engine/*.mjs $REPO/livedit/engine/comp.py $L/kit/
cd $L/kit && (npm init -y >/dev/null 2>&1 || true) && npm i -s puppeteer-core >/dev/null 2>&1
python3 -m venv $L/venv && $L/venv/bin/pip install -q kokoro-onnx soundfile num2words scipy numpy
pip install -q --break-system-packages opencv-python-headless pillow numpy 2>/dev/null || true
cd $L/fonts
for f in "ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf" "ofl/oswald/Oswald%5Bwght%5D.ttf" "ofl/anton/Anton-Regular.ttf"; do
  n=$(basename "$f" | sed 's/%5Bwght%5D//; s/-Regular//'); [ -s "$n" ] || curl -sSL -o "$n" "https://raw.githubusercontent.com/google/fonts/main/$f"; done
cd $L/models
for f in kokoro-v1.0.onnx voices-v1.0.bin; do [ -s $f ] || curl -sSL -o $f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
cd $DL
[ -d sfx-kit ] || git clone -q --depth 1 https://github.com/wyzowl/sfx-kit
[ -d free-music ] || (git clone -q --depth 1 --filter=blob:none --sparse https://github.com/tannerhelland/free-music && cd free-music && git sparse-checkout set mp3)
which google-chrome ffmpeg >/dev/null && echo "SETUP OK"
