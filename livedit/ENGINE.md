# Lived It — how one video is made (in-house engine, no paid image credits)

Free pipeline. ElevenLabs/Higgsfield/ChatGPT image credits are NOT used (owner's choice, Nov 26 2026).
Worked examples: `livedit/videos/capone`, `musashi`, `jesse`.

## 0. Setup (fresh workspace)
`bash /home/claude/yt-uploads/livedit/engine/setup.sh` → /home/claude/lived/{kit,fonts,models,venv}, /home/claude/dl/{sfx-kit,free-music}.

## 1. Pick the subject
Top of the queue in `livedit/ideas.md` (real people / myths only, never game or film characters, never living people).
Fact-check with web search (2–4 searches). Note what sources disagree on.

## 2. Script → `/home/claude/lived/<slug>/script/narration.json` (+ `pron.json`)
Follow `livedit/SCRIPT_RULES.md` exactly (cold open with 3 facts → "But right now? You're a baby… No X. No Y. Not even Z." →
family → "Remember that" plants paid off later → Prologue + I…IX chapters → "Quick pause" section with id `pause` and
empty chapter near 40% → ending recap + one debate question). 1,200–1,600 words (7.5–10 min). Our own words only.

## 3. Voice
```
P=/home/claude/lived/<slug>; mkdir -p $P/{tools,work,audio,out,research}; ln -sfn /home/claude/lived/models $P/models
cp /home/claude/yt-uploads/livedit/engine/voice.py $P/tools/
for f in music2.py sfx.py mix.sh; do sed "s#/home/claude/lived/capone#$P#g" /home/claude/yt-uploads/livedit/engine/$f > $P/tools/$f; done
/home/claude/lived/venv/bin/python $P/tools/voice.py     # ~10 min, writes work/voice.wav + work/timeline.json
```

## 4. Scenes → `$P/scenes.mjs`
One entry per beat (65–90 entries): `{id, cue, bg, mid, chars, fg, light, fx, cam, tag, big, hold, shake, flash, depth}`.
- `cue` = an exact, unique substring of a narration sentence (first scene `@0`); scenes are sorted by cue time.
- Kits: `bgs.mjs` (rooms, streets, sea, props P.*), `japan.mjs` (temple, village, kyoto, beach, castle, cave, J.*),
  `west.mjs` (prairie, farmhouse, westTown, locomotive, horse, W.*). Add new kits for new eras (Greece, Rome, pirates…).
- Characters: `char({...})` options — age (baby/kid/teen/adult), hair, hairColor, hat, outfit, skin, expr
  (neutral/smile/grin/angry/sad/shock/smirk/shout/sleep/worried), pose (stand/hips/point/wave/hold/cross/cigar/up/shrug/
  reach/hand_face/pockets/fist/sit/hug/mop/run), sit, heavy, scar, mustache, stubble, glasses, headband, bandage, swords,
  holding (svg at hand), tilt. Define the cast once at the top so faces stay consistent.
- `light`: `{amb:[color,k], lights:[[x,y,r,color,k,flicker]], rim:[color,dx,dy,k], rays:[x,y,color,k]}`.
- `fx`: rain, snow, fog, dust, embers. `cam`: in/out/panL/panR/up/crash. `tag` = top-left label (place, year, AGE n).
  `big` = centre slam text (max 3–4 words). Desks/counters that characters stand behind go in `fg` with
  `depth:{fg:1.0, fgdark:0.95}`.
Build + check: `cd /home/claude/lived/kit && node build.mjs $P && python3 comp.py $P plan && python3 comp.py $P frames id1,id2,…`
Look at the frames (contact sheet) and fix composition before rendering.

## 5. Render (~1.5–2 h on 2 CPUs)
```
export OMP_NUM_THREADS=1; cd /home/claude/lived/kit
nohup python3 comp.py $P shots 0 999 2 0 > $P/work/r0.log 2>&1 &
nohup python3 comp.py $P shots 0 999 2 1 > $P/work/r1.log 2>&1 &
# done when every shot has shots/NNN.mp4.key ; then:
python3 comp.py $P concat     # -> work/video_silent.mp4
```
Do not run the voice model while rendering (CPU contention halves speed).

## 6. Audio
`script/sfx_cues.json` ([phrase, sfx-kit id, offset]) → `venv/bin/python tools/sfx.py` →
`MUSIC_A=<track> MUSIC_B=<track> MUSIC_SWITCH_SECTION=<section id> venv/bin/python tools/music2.py` → `bash tools/mix.sh` (−14 LUFS).
Tracks from /home/claude/dl/free-music/mp3 (CC BY 4.0, Tanner Helland) — credit in the description.

## 7. Final file (< 95 MB for staging)
`ffmpeg -i work/video_silent.mp4 -i work/mix2.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest out/final.mp4`
(raise crf by 1 until < 95 MB). Check: duration = voice, frames at 10/30/50/70/90%, loudness −14.

## 8. Thumbnail
Split "AGE 0" (baby, warm) | adult at the most dramatic moment + 1–2 word claim in yellow (see `engine/thumb_*.mjs`).

## 9. Title / description
Title: `What If You Were Born as <Name>? | <World>` (A/B later with `Live <Name>'s Entire Life in <N> Minutes`).
Description: 2-line hook, chapter timestamps (from timeline), "Who should be next? Comment below.", sources, music credit.

## 10. Stage, upload, schedule (see pipeline/RUNBOOK.md steps 11–13 for staging)
Upload with `youtube_upload_video` (private), then PUT `videos?part=status` with `privacyStatus: private` and
`publishAt` = next free slot. **Slots: 8:00 AM ET and 7:00 PM ET every day** (13:00Z / 00:00Z in winter, EST).
Schedule call that works (body as JSON string, part in querystring):
`youtube_make_api_mutating_request` params `{"method":"PUT","url":"https://www.googleapis.com/youtube/v3/videos","querystring":{"part":"status"},"headers":{"Content-Type":"application/json"},"body":"{\"id\":\"<ID>\",\"status\":{\"privacyStatus\":\"private\",\"publishAt\":\"<UTC>\",\"selfDeclaredMadeForKids\":false,\"embeddable\":true,\"license\":\"youtube\",\"publicStatsViewable\":true}}","fail_on_errors":"false"}`
Final file must be < 95 MB: our film grain defeats CRF, so encode with `-vf hqdn3d=3:3:8:8 -b:v 1200k -maxrate 1800k -bufsize 3600k` (≈ 90 MB for 9.5 min; scale bitrate to length).
Record in `state/latest.json` + `livedit/schedule.json`.
