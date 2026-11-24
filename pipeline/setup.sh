#!/usr/bin/env bash
# One-time setup in a fresh workspace (~5-8 min). Builds /home/claude/ce from this repo and downloads models/assets.
set -euo pipefail
REPO=/home/claude/yt-uploads
CE=/home/claude/ce; DL=/home/claude/dl
mkdir -p $CE/{tools,models,work,audio,frames,scenes,research,out,script} $DL
cp -r $REPO/pipeline/tools/* $CE/tools/
cd $CE/tools
npm init -y >/dev/null 2>&1 || true
npm i -s puppeteer-core @fontsource/montserrat us-atlas topojson-client d3-geo >/dev/null 2>&1
python3 -m venv venv
venv/bin/pip install -q kokoro-onnx soundfile num2words scipy pillow mido fonttools brotli
cd $CE/models
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s $f ] || curl -sSL -o $f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f
done
cd $DL
[ -d sfx-kit ] || git clone -q --depth 1 https://github.com/wyzowl/sfx-kit
if [ ! -d free-music ]; then
  # only the two mp3s we use (repo is 1.4 GB)
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/tannerhelland/free-music
  cd free-music && git sparse-checkout set mp3 >/dev/null 2>&1 || true; cd ..
fi
cd $CE/tools && [ -s usmap.json ] || node mkmap.mjs
which google-chrome ffmpeg >/dev/null
echo "SETUP OK"
