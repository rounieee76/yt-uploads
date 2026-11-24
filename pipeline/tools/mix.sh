#!/usr/bin/env bash
# Mix voice (-16 LUFS) + music bed (-36 LUFS, ducked) -> loudnorm -14 -> add SFX (already -11 dBFS peaks) -> limiter.
set -euo pipefail; cd /home/claude/ce
mI=$(ffmpeg -hide_banner -i audio/music_bed.wav -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
vI=$(ffmpeg -hide_banner -i work/voice.wav -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
mg=$(python3 -c "print(-36-($mI))"); vg=$(python3 -c "print(-16-($vI))")
ffmpeg -loglevel error -y -i work/voice.wav -i audio/music_bed.wav -filter_complex \
"[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,volume=${vg}dB,asplit=2[v][sc];[1:a]volume=${mg}dB[m];[m][sc]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600[md];[v][md]amix=inputs=2:duration=first:normalize=0[mix]" \
-map "[mix]" -c:a pcm_f32le work/vm_raw.wav
J=$(ffmpeg -hide_banner -i work/vm_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
ii=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -loglevel error -y -i work/vm_raw.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:$ii" -ar 48000 -c:a pcm_f32le work/vm.wav
ffmpeg -loglevel error -y -i work/vm.wav -i work/sfx.wav -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=false[o]" -map "[o]" -ar 48000 -c:a pcm_s16le work/mix2.wav
ffmpeg -hide_banner -i work/mix2.wav -af ebur128=peak=true -f null - 2>&1 | grep -E '^\s+(I:|Peak:)'
