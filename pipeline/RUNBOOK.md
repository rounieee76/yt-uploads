# Money Encode daily video — production runbook

This is what the daily scheduled run does, start to finish. It produces one faceless explainer for the
**Money Encode** channel ("Money Encodee", channel ID `UC_4MlW0Gh4XhvooLjLZCigA`), uploads it **private**, and
records it in `state/latest.json`. A separate scheduled task flips it to **public at ~2 PM ET** (see the end).
Worked example of every file: `pipeline/examples/car-washes-2026-11-24/` (published as `UPrz3aBKHPk`).

Budget: ~2.5–3 h of work (render alone ~25 min). Work unattended: never stop to ask; if a step cannot be done to
the quality bar, do not upload, and tell the owner why (step 16).

## 0. Setup (fresh workspace)
1. `add_repo` owner `rounieee76`, repo `yt-uploads`, access `push`; clone to `/home/claude/yt-uploads`.
2. `bash /home/claude/yt-uploads/pipeline/setup.sh` → must end with `SETUP OK`. Everything then lives in `/home/claude/ce`.
3. YouTube via Zapier: app `YouTubeV4CLIAPI`, connection `02f3e4e1-fd66-8f15-b388-4166d847b302`. GET calls use tool
   `youtube_make_api_get_request` (`execute_zapier_read_action`), writes use `youtube_make_api_mutating_request` or
   `youtube_upload_video` (`execute_zapier_write_action`). The workspace itself cannot reach YouTube, Wikimedia, SEC or
   news sites; use WebSearch/WebFetch for research and Zapier for YouTube.

## 1. Pick today's topic (data first)
- **Our channel:** list uploads (`playlistItems`, playlist `UU_4MlW0Gh4XhvooLjLZCigA`), then `youtubeAnalytics.googleapis.com/v2/reports`
  with `ids=channel==MINE`, `dimensions=video`, metrics `views,averageViewDuration,averageViewPercentage,subscribersGained`
  since the channel start; and `insightTrafficSourceType` for the top video. Rank formats/categories by views and
  average view %. As of Nov 24, 2026 the only breakout was car washes (6.1K views, 91% from Browse); Planet Fitness
  and the "5 boring businesses" list flopped.
- **Other channels:** YouTube Data API `search` (via Zapier GET) ordered by `viewCount`, `publishedAfter` = 45 days ago,
  `regionCode=US`, queries such as `"Getting What They Deserve"`, `"what happened to"` + business, and the playbook
  topics; then `videos?part=statistics,snippet,contentDetails` for counts. Reference channels: Mr. Company
  (`UCOwywQzlbTTWdZA0Oxwhf9w`), Bagholder Association, Logically Answered, Hustler's Math, Food Meter, MERCER.
- **Choose:** ~70% of days exploit what works (same category or format as our best performer, e.g. car-related and
  everyday-roadside US businesses: car washes, oil change chains, gas stations, car dealerships, tire shops, parking);
  ~30% test a topic the genre has already proven (another channel's video on it > 100K views in the last year) in the
  same comeuppance format (fast food chains, dollar stores, subscriptions, big consumer brands with a public fall).
- **Never repeat** a company/subject from `state/videos.json` in the last 30 days. US subject, US audience only.
- A comeuppance title needs a **real, dated, verifiable fall** (bankruptcy, closures, traffic/sales drop, lawsuit,
  regulator action, stock collapse, price backlash). No verified fall → use a price or curiosity title and the playbook spine.
- Write the decision and the numbers behind it to `research/topic.md`.

## 2. Research and fact-check
WebSearch + WebFetch; prefer primary sources (SEC filings, company releases, court dockets, regulator releases).
Write `research/claims.md` like the example: every claim, status (V verified / E our estimate), source. Drop anything
you cannot verify. Lawsuits are **allegations** and must be said so. Estimates are labelled on screen and in the
description. Copyright: never reproduce more than a short exact quote from any source.

## 3. Script → `script/narration.json`
Same structure as the example (sections → paragraphs → sentences; section `id` + `chapter`). 1,800–2,600 words.
Comeuppance spine (when the title is "[X] Is/Are (Finally) Getting What They Deserve…"): dated cold open (3-4 facts,
each worse) → paradox line → promise → [sting] → glory days → how the money works (our identity segment: who pays,
what one dollar becomes) → fall #1/#2/#3 → the other side → it happened before → verdict that answers the title →
"Next on Money Encode: …". Rules: median sentence 10-13 words; ≤ 1 viewer question per 2 min; numbers tied to a
picture; ≥ 1 honest admission; US English and units; write money as words the voice reads well ("654 million dollars",
"22 dollars and 40 cents"); avoid symbols in narration. The first section's last sentence is followed by the logo sting.

## 4. Voice
`cd /home/claude/ce && nohup tools/venv/bin/python tools/voice.py > work/voice.log 2>&1 &` then poll the log
(~1 min per minute of audio). Output `work/voice.wav`, `work/timeline.json`. Voice: Kokoro `am_michael`, speed 1.12 (~158 wpm).

## 5. Scenes → `/home/claude/ce/tools/scenes.mjs`
Copy the example's structure and components from `tools/lib.mjs` (text, count, doc, headline, person, usmap, kiosk,
car, tunnel, bars, cardStack, stamp, chip, chapter cards). Each scene starts on a phrase (`Q('…')`) and every beat is
cued to a phrase. Per-video palette from the subject; lime for money; red for losses.
- `doc()` and `headline()` show **exact** short quotes / real headlines only, with issuer/outlet and date; never fake a
  headline in a real outlet's look. Paraphrase = say "(paraphrased)". Every factual scene has a `src:` line.
- No real photos are reachable here: people get a name-and-title card (`person()`).
- Pacing: something new every 2–4 s (1–2 s in the first minute); no scene > ~14 s without new beats; **no empty
  start** — the first element must appear at the scene's own cue phrase.
- `cd tools && node build.mjs` → must print `missing cues 0`. Then `node stills.mjs 0.97` and **Read every**
  `work/stills/sheet_*.jpg`; fix text off the edge, overlaps (stamps over dates, labels over bars), the corner mark.

## 6. Render
`node capture.mjs 0 K` and `node capture.mjs K+1 N-1` in two background processes (`nohup … &`), K = N/2; ~15 fps
each; poll `ls scenes/*.mp4 | wc -l`. Re-runs skip unchanged scenes (hash).

## 7. Audio
- `script/sfx_cues.json`: list of `[phrase, sound_id, offset_s]` (see example; `"__STING__"` = logo sting). Sounds from
  `/home/claude/dl/sfx-kit/catalogue.md` (SFX Kit by Wyzowl, CC0). One signature sound per scene, chapter cards get
  `whoosh-medium-medium` + `boom-hit-soft` (+0.3 s), counts get `data-countup-*`, documents `foley-paper-slide` +
  `writing-highlighter`, money `money-register`/`money-coin-drop`, stamps `impact-heavy-firm`.
  `tools/venv/bin/python tools/sfx.py` (every effect peaks at −11 dBFS).
- `MUSIC_SWITCH_SECTION=<third section id> tools/venv/bin/python tools/music2.py` (Tanner Helland, CC BY 4.0:
  "Surreptitious" then "Syntheticity"; you may pick other tracks from `/home/claude/dl/free-music/mp3` with MUSIC_A/MUSIC_B,
  preferring piano/marimba/bass/soft strings, no distorted guitar).
- `tools/mix.sh` → about −14 LUFS; music ~20 dB under the voice and ducked.

## 8. Finish and check
`tools/finish.sh "<Title_With_Underscores>"` → `out/<name>.mp4`, black/freeze check, `work/final_check/time_*.jpg`.
Read **all** time sheets; fix and re-render only changed scenes, then `tools/finish.sh` again. The file must be
**< 95 MB** (GitHub limit); if bigger, re-encode video with `-crf 22`.

## 9. Thumbnail (Mr. Company style)
Style (checked on his channel Nov 24, 2026): light-gray seamless studio background; ONE hyper-real hero object in the
middle (his: the brand's burger/fries/drink); 2–3 casual words at the top in plain bold black sans-serif, mixed case,
ONE word underlined in red ("it's Finally over", "they're too Greedy", "it Sucks now", "Nobody Eats"). No arrows,
no dark backgrounds, no clutter.
1. **Preferred — ChatGPT in the owner's Chrome** (only if `mcp__claude-in-chrome__*` tools are present and respond):
   load the chrome-browser skill; if several browsers are connected, use "Browser 1 (macOS)" deviceId
   `f12d6f9c-d4c0-43a7-9562-90df22077005` (`select_browser`); new tab → `https://chatgpt.com/`; send:
   > Create an image: a 16:9 YouTube thumbnail (landscape). Clean light-gray seamless studio background with a soft
   > vignette, like a product photo. At the top, centered, very large bold black sans-serif text (Helvetica / Arial Bold
   > style, mixed case) that reads exactly: <PHRASE> — with only the word "<WORD>" underlined by a thin straight red line.
   > Center and bottom: a hyper-realistic commercial studio product shot of <HERO OBJECT>. Crisp, high detail, bright
   > even lighting, minimal and uncluttered. No other text, no brand logos, no people.
   Wait ~60–90 s, check the text is spelled right (regenerate once if not), click the image to open the viewer,
   `zoom` the image region with `save_to_disk: true`, crop the image area with PIL (bright-pixel bounds) and resize to
   1280×720 → `out/thumbnail.jpg`. Close the tab.
2. **Fallback:** `tools/venv/bin/python tools/thumb_mc.py --text "<PHRASE>" --underline "<WORD>" --out out/thumbnail.jpg`.
Read the thumbnail at 320×180 before using it.

## 10. Title and description
Title: the comeuppance formula exactly — `<Brand> Is (Finally) Getting What They Deserve…` (industry: `<Businesses>
Are (Finally) Getting What They Deserve…`) — only when the facts support it. Description (≤ 4,800 bytes, no `<` `>`):
cold-open facts as prose; "So what really happened?" line; chapters (from `work/timeline.json` section starts, first
at 0:00); sources with links; `Music: "Surreptitious" and "Syntheticity" by Tanner Helland, licensed under CC BY 4.0 -
https://github.com/tannerhelland/free-music` (adjust track names); `Sound effects: SFX Kit by Wyzowl (CC0) -
https://github.com/wyzowl/sfx-kit`; allegations/estimates/not-advice line; a comment question; 3 hashtags.

## 11. Stage files on GitHub (orphan branch, deleted after upload)
```
cd /home/claude/yt-uploads && git checkout -q --orphan stage && git rm -rqf . && mkdir v
cp /home/claude/ce/out/<name>.mp4 v/video.mp4 && cp /home/claude/ce/out/thumbnail.jpg v/thumbnail.jpg
git add v && git commit -qm "stage" && git push -qf origin stage && git checkout -q main
```
URLs: `https://raw.githubusercontent.com/rounieee76/yt-uploads/stage/v/video.mp4` and `…/v/thumbnail.jpg`
(check both return 200 with curl -I).

## 12. Upload (private)
`youtube_upload_video` with: title, description, `video` and `thumbnail` = the raw URLs, `privacy_status: private`,
`category_id: "27"`, 8–12 tags, `made_for_kids: "false"`, `notify_subscribers: "false"`, `default_language: "en"`,
`default_audio_language: "en"`, `license: "youtube"`. Keep the returned video `id`.

## 13. Clean up
`git push -q origin --delete stage` (the files leave the repo).

## 14. Record state (main branch)
Write `state/latest.json` = `{"date","video_id","title","topic","category","status":"private_awaiting_publish"}` and
append the same object (plus views later) to `state/videos.json`. Copy `script/narration.json`, `script/sfx_cues.json`,
`research/claims.md`, `research/topic.md`, `tools/scenes.mjs` into `pipeline/examples/<date>-<slug>/` so the next run
can learn from it. Commit and push main.

## 15. Quality bar (do not upload if any fails)
missing cues 0 · all stills and time sheets read and clean · no claim without a source · allegations labelled ·
estimates labelled · no other people's clips, no logos as images, no fake headlines · −14 LUFS ±1, no black/freeze ·
file < 95 MB · thumbnail text spelled correctly.

## 16. Tell the owner
Send one short message (SendUserMessage; PushNotification if available): the video link, title, why this topic
(one line with the data), and "It goes public at about 2 PM ET (12:30 AM IST). To stop it, set it to Unlisted in
YouTube Studio before then." If you did not upload, say exactly what failed.

---
## Publish task (separate schedule, ~1:53 PM ET daily)
Read `https://raw.githubusercontent.com/rounieee76/yt-uploads/main/state/latest.json` (or clone the repo). GET
`videos?part=status,processingDetails&id=<id>`. Only if `privacyStatus` is `private` and `uploadStatus` is
`processed`: PUT `https://www.googleapis.com/youtube/v3/videos?part=status` with body
`{"id":"<id>","status":{"privacyStatus":"public","selfDeclaredMadeForKids":false,"embeddable":true,"publicStatsViewable":true,"license":"youtube"}}`
and header `Content-Type: application/json`. If it is `unlisted` (owner vetoed) or already `public`, do nothing.
Then message the owner with the result.
