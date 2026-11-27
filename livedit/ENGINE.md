# Lived It — how one video is made (in-house engine, no paid image credits)

Free pipeline. ElevenLabs/Higgsfield credits are NOT used. Video visuals = in-house engine.
THUMBNAILS = ChatGPT (owner's choice, Nov 27 2026) in the owner's "Rounit Main" Chrome profile — see step 8.
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
Film grain defeats CRF (a CRF file came out 398 MB), so use a capped bitrate, in the background:
`nohup ffmpeg -y -i work/video_silent.mp4 -i work/mix2.wav -map 0:v -map 1:a -vf hqdn3d=3:3:8:8 -c:v libx264 -preset veryfast -b:v 1300k -maxrate 1900k -bufsize 3800k -c:a aac -b:a 128k -shortest -movflags +faststart out/final.tmp.mp4 && mv out/final.tmp.mp4 out/final.mp4 &`
(lower -b:v if > 95 MB). Check: duration = voice, frames at 10/30/50/70/90%, loudness −14.

## 8. Thumbnail — made with ChatGPT (owner's request, Nov 27 2026)
Browser: Claude in Chrome, deviceId **ea97dc27-10ac-40c3-a84d-cdf229087593** (owner's "Rounit Main" profile; was listed as
"Browser 1"). `list_connected_browsers` → `select_browser` with that id. Do NOT use f12d6f9c-… (other profile, its free
image quota is usually used up). Never type a password; if ChatGPT is logged out or says "not enough usage … after <time>",
fall back to the in-house thumbnail (`engine/thumb_*.mjs`) and set `"thumb":"inhouse"` in schedule.json so it gets
replaced later.
1. New chat at chatgpt.com, prompt (fill the brackets; the claim is 1–3 true words):
   `Create an image: a wide 16:9 landscape YouTube thumbnail in bold cartoon illustration style with thick black outlines,
   saturated colors and high contrast (style of a "What if you were born as" history channel). Split vertically into two
   halves with a dark slightly diagonal divider. LEFT half: a cute grumpy chubby baby wrapped in [cloth] inside [birthplace
   and era] with warm light; top-left a parchment sign with heavy black letters "AGE 0". RIGHT half: adult [name, look,
   clothes, weapon/prop, expression], background of [most dramatic moment/place]; at the top, huge bold red letters with a
   thick black outline: "[CLAIM]". No other text.`
2. Wait ~50 s. Get it out at full size: run JS that overlays the newest large `main img` full-height
   (`position:fixed;inset:0;z-index:2147483647;background:#000` + `<img style="height:100vh;width:auto">`), then two
   `computer` **zoom** actions (no `scale`) on the left and right halves of the image area (x 0→W/2 and W/2→W, where
   W = viewport height × 16/9 in the screenshot coordinate frame). Each zoom is saved as a PNG under
   /tmp/claude-tool-results/…; stitch: `python3 engine/gpt_stitch.py left.png right.png out/thumbnail.jpg` (→ 1280×720).
3. Look at it: every word spelled right, faces fine, nothing cut off. One retry with a corrected prompt if not.

## 9. Title / description
Title: `What If You Were Born as <Name>? | <World>` (A/B later with `Live <Name>'s Entire Life in <N> Minutes`).
Description: 2-line hook, chapter timestamps (from timeline), "Who should be next? Comment below.", sources, music credit.

## 10. Stage, upload, schedule
Staging branch: use **`stage-<slug>`** (one per video, never the shared `stage`) so two runs can't overwrite each other:
`git checkout -q --orphan stage-<slug> && git rm -rqf . && mkdir v && cp <final.mp4> v/video.mp4 && cp <thumbnail.jpg> v/thumbnail.jpg && git add v && git commit -qm stage && git push -qf origin stage-<slug> && git checkout -q -f main`
URLs: `https://raw.githubusercontent.com/rounieee76/yt-uploads/stage-<slug>/v/video.mp4` (and thumbnail.jpg).
After upload, clear it (deletes are blocked): orphan branch with only STAGE.md, `git push -qf origin <tmp>:stage-<slug>`.
Upload with `youtube_upload_video` (private), then PUT `videos?part=status` with `privacyStatus: private` and
`publishAt` = next free slot. **Slots: 8:00 AM ET and 7:00 PM ET every day** (13:00Z / 00:00Z in winter, EST).
Schedule call that works (body as JSON string, part in querystring):
`youtube_make_api_mutating_request` params `{"method":"PUT","url":"https://www.googleapis.com/youtube/v3/videos","querystring":{"part":"status"},"headers":{"Content-Type":"application/json"},"body":"{\"id\":\"<ID>\",\"status\":{\"privacyStatus\":\"private\",\"publishAt\":\"<UTC>\",\"selfDeclaredMadeForKids\":false,\"embeddable\":true,\"license\":\"youtube\",\"publicStatsViewable\":true}}","fail_on_errors":"false"}`
Final file must be < 95 MB: our film grain defeats CRF, so encode with `-vf hqdn3d=3:3:8:8 -b:v 1200k -maxrate 1800k -bufsize 3600k` (≈ 90 MB for 9.5 min; scale bitrate to length).
Record in `state/latest.json` + `livedit/schedule.json`.
