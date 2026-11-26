#!/usr/bin/env bash
# Join rendered scenes, mux mix2.wav, write out/final.mp4 and QC sheets. Usage: tools/finish.sh "<Output_Name>"
set -euo pipefail; cd /home/claude/gk; NAME=${1:-final}
python3 -c "
import json;idx=json.load(open('scenes/index.json'))
open('work/concat.txt','w').write(''.join(f\"file '/home/claude/gk/scenes/{s['id']}.mp4'\n\" for s in idx))"
ffmpeg -loglevel error -y -f concat -safe 0 -i work/concat.txt -c copy work/video_only.mp4
ffmpeg -loglevel error -y -i work/video_only.mp4 -i work/mix2.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "out/$NAME.mp4"
ffprobe -v error -show_entries format=duration,size -of compact "out/$NAME.mp4"
ffmpeg -hide_banner -i "out/$NAME.mp4" -vf "blackdetect=d=0.5:pix_th=0.05,freezedetect=n=0.003:d=6" -af ebur128 -f null - 2>&1 | grep -E "black_start|freeze_start|^\s+I:" | tail -5
mkdir -p work/final_check && rm -f work/final_check/*
ffmpeg -loglevel error -i "out/$NAME.mp4" -vf "fps=1/5,scale=480:-1,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=5x5" -q:v 4 work/final_check/time_%02d.jpg
ls work/final_check
