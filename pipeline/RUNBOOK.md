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

## 1. Pick today's topic (playbook slate first, then outliers)
The owner's instruction (Nov 26, 2026): make the top videos selected in the Storytelling Playbook PDF (section 10,
"The US topic slate"), keep researching outlier videos that are working on YouTube, and keep making that type of
video. It is **not** limited to car businesses; do not default to car topics.

**a. Measure what we already posted (5 min).** For every video in `state/videos.json` from the last 30 days, GET
`videos?part=statistics` and record `views_<date>` in its entry; for videos ≥ 7 days old also record
`views_day7` once. Compare title formats (`title_format`: "price-question", "comeuppance", "curiosity") by day-7
views; note the result in `research/topic.md`. Nov 26 snapshot: comeuppance car videos had 26–32 views after 1–2 days;
the price title "Car Washes Want You on $29.99/Month." is still the best performer (6.2K).

**b. Outlier hunt (every run, ~15 min).** Find videos that beat their own channel by a wide margin:
1. YouTube Data API `search` (Zapier GET) with `type=video`, `order=viewCount`, `publishedAfter` = 60 days ago,
   `regionCode=US`, `relevanceLanguage=en`, `videoDuration=medium` or `long`, for 6–8 of these queries (rotate daily):
   "how * makes money", "why * is everywhere", "the economics of", "is * worth it", "how much does * make",
   "Getting What They Deserve", "what happened to", "the dark side of", "business model explained", "where does the money go",
   plus 2 queries built from the next slate topics (e.g. "dollar general", "costco hot dog", "self storage").
2. For the top 15 results: `videos?part=statistics,snippet,contentDetails` and `channels?part=statistics`.
3. **Outlier** = views ≥ 100K AND views ≥ 3 × the channel's subscriber count (or ≥ 3 × the channel's median of its last
   15 uploads when you have it). Prefer ≥ 10 min, US consumer-business / money-mechanics subjects we can tell with
   filings and public data (no true crime, no politics, no personality-led formats).
4. Append every outlier to `state/outliers.json` as `{date_found, video_id, channel, title, views, subs, ratio,
   published, topic, format, title_pattern}`. If its subject fits our niche and is not already in the queue or in
   `state/videos.json` (last 90 days), add it to `state/topic_queue.json` with `origin:"outlier"`,
   `status:"candidate"`, a working title in our style, the twist, and the evidence (video id, views, ratio).
5. Also note **title and thumbnail patterns** that recur among outliers (write them in `research/topic.md`; if a
   pattern holds across 3+ outliers, use it).

**b2. New-channel breakouts and title study (every run, ~10 min).** The owner's point: many brand-new channels get
big US views and monetize with only 5–10 videos (Mr. Company: started June 2026, 4 videos, 408K views). Find them and
learn from their titles:
1. From the step-b search results (add 3–4 extra searches on today's rotating queries if needed), fetch
   `channels?part=snippet,statistics` for every channel. **New breakout** = channel `publishedAt` ≤ 180 days ago AND
   `videoCount` ≤ 15 AND `viewCount` ≥ 100K (or one video ≥ 100K). US/English business, money or consumer-brand content.
2. For each new breakout, list its uploads (`playlistItems` on its uploads playlist) and get every video's views and
   title. Note which titles hit and which flopped on the same channel (like Mr. Company: "How Krispy Kreme Destroyed
   Itself (Again)" 6.3K vs "Wendy's Is (Finally) Getting What They Deserve…" 235K). Same channel, different title =
   the cleanest evidence there is.
3. If Claude in Chrome tools are available, open the channel's Videos tab (youtube.com/@handle/videos), take one
   screenshot, and describe the thumbnail style (background, subject, text words, colour, underline/arrows).
4. Append each channel to `state/new_channels.json` (`{date_found, channel_id, handle, title, created, videos,
   total_views, subs, best_video:{title,views}, worst_video:{title,views}, title_patterns, thumbnail_style}`); skip ones
   already logged unless their numbers changed a lot.
5. Update `state/title_patterns.md`: one line per pattern with its formula, 2–4 real examples with views and dates, and
   how many channels use it; mark patterns as **rising** (new examples in the last 14 days with high views) or
   **fading** (recent examples flopping). Keep it short (≤ 40 patterns); merge duplicates. Also record our own results
   by pattern from step a.
6. Note: whether a channel is monetized is not visible in the API; do not claim it. Views, subs, dates and titles are.

**c. Choose today's topic.**
- Default (2 of every 3 days): the **first `status:"todo"` item** in `state/topic_queue.json` (the playbook slate,
  in priority order: Dollar General, Costco hot dog, self storage, food truck, laundromat, DoorDash, gas station,
  trucking, then Tier B).
- Every 3rd day (count the last two entries in `state/videos.json`; if neither came from an outlier): the strongest
  outlier candidate. A very strong outlier (≥ 1M views or ratio ≥ 10, published ≤ 30 days ago) may jump the queue any day.
- Never repeat a subject from `state/videos.json` in the last 30 days; at most 2 car-related videos per 7 days.
- Title: read `state/title_patterns.md` first and write 3 title options from the strongest **rising** patterns that
  honestly fit the facts, then pick one and record its pattern name in `title_format`. Without a better-evidenced
  pattern, the playbook title style (price + question, e.g. "A $5 Basket at Dollar General: How Much Does the Store
  Keep?") is the default for slate topics. Use the comeuppance title ("<Brand> Is (Finally) Getting What They
  Deserve…") only when there is a real, dated, verified fall AND it is a household brand. For outlier topics, follow the
  outlier's proven title pattern in our own words.
- Mark the chosen item `status:"in_progress"`; after upload set `status:"done"` and `video_id`. If the run fails, set
  it back to `todo`.
- Record `origin` (playbook / outlier), `title_format` and `slate_no` in the `state/videos.json` entry.
- Write the decision, the data behind it and the outlier list to `research/topic.md`.

## 2. Research and fact-check
WebSearch + WebFetch; prefer primary sources (SEC filings, company releases, court dockets, regulator releases).
Write `research/claims.md` like the example: every claim, status (V verified / E our estimate), source. Drop anything
you cannot verify. Lawsuits are **allegations** and must be said so. Estimates are labelled on screen and in the
description. Copyright: never reproduce more than a short exact quote from any source.

## 3. Script → `script/narration.json`
First read `state/lessons.md` and apply every rule in it (they come from our own retention data).
Same structure as the example (sections → paragraphs → sentences; section `id` + `chapter`). 1,800–2,600 words.
Comeuppance spine (when the title is "[X] Is/Are (Finally) Getting What They Deserve…"): dated cold open (3-4 facts,
each worse) → paradox line → promise → [sting] → glory days → how the money works (our identity segment: who pays,
what one dollar becomes) → fall #1/#2/#3 → the other side → it happened before → verdict that answers the title →
"Next on Money Encode: …".
Playbook spine (default for slate topics with a price-question title; PLAYBOOK.txt section 7): 0:00–0:40 open
inside a specific US scene in present tense (you at the Dollar General register with a $5 basket; a price on a screen),
no logo, no "in this video" → 0:40–1:10 one sentence that makes the ordinary strange + a quick list of what's coming
→ sting → how it got here with one human character (founder/CEO, name card) → re-hook every 60–120 s, each reveal
bigger → ~5:00 return to the opening scene → the math as a scene (what we searched, what is missing, an estimate in
2–3 labelled parts with assumptions out loud, real documents) → the twist (who really wins) → payoff that answers the
title in one number and calls back to the opening scene → "Next on Money Encode: …". Rules: median sentence 10-13 words; ≤ 1 viewer question per 2 min; numbers tied to a
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

## 9. Thumbnail (our winning style — see state/packaging_baseline.md)
Data (Studio, Nov 2026): dark/saturated photo + big question/claim thumbnails got 3.9–4.3% CTR on thousands of
impressions; the light-gray minimal style got 2.2% on dealerships. Default = **photoreal, high-contrast scene that
shows the story + 2–4 huge words** (white, thick black outline, ALL CAPS, one word/number in a red box). Text must
add a hook the title does not say (title = the topic, thumbnail = the twist). No real logos, no faces of real people.
1. **Preferred — ChatGPT in the owner's Chrome** (only if `mcp__claude-in-chrome__*` tools are present and respond):
   load the chrome-browser skill; if several browsers are connected, use "Browser 1 (macOS)" deviceId
   `f12d6f9c-d4c0-43a7-9562-90df22077005` (`select_browser`); new tab → `https://chatgpt.com/`; send:
   > Create an image: a 16:9 YouTube thumbnail, 1280x720, photorealistic, high contrast, saturated, cinematic
   > lighting. Scene: <ONE CONCRETE SCENE THAT SHOWS THE STORY, foreground object + background>. Big bold text across
   > the top-left in white with a thick black outline, all caps: "<2-4 WORDS>". The word <WORD> has a red highlight box
   > behind it. No logos, no brand names, no people's faces, no other text. Keep the text large and readable on a phone.
   Proven examples: "NOT THE CAR" (loan contract with circled APR in a dealer office), "PLEASE STAY HOME" (empty gym +
   purple "$22/mo" card), "523 STORES GONE" (parts store with STORE CLOSING banner), "WHO GETS THE REST?" (car wash).
   Wait ~30–60 s, check spelling (regenerate once if wrong), click the image to open the viewer, move the mouse off it
   (`hover` at the bottom-right corner), `zoom` region [222,52,1248,630] with `save_to_disk: true` and `scale: 1`
   (check the region matches the image in a screenshot first), crop to 16:9 and resize to 1280×720 with PIL →
   `out/thumbnail.jpg`. Close the tab. Free ChatGPT allows a few images a day: one per video.
2. **Fallback:** `tools/venv/bin/python tools/thumb_mc.py --text "<PHRASE>" --underline "<WORD>" --object <png> --out out/thumbnail.jpg`
   (crop the object PNG to its bounding box so it fills the frame).
Read the thumbnail at 320×180 before using it.

## 10. Title and description
Title: pick from `state/title_patterns.md` by measured results, not habit. Our only hit anchored a price the viewer pays
("Car Washes Want You on $29.99/Month."); our three comeuppance titles got 398–834 impressions. Prefer a price/number
anchor the viewer recognises; use the comeuppance formula only for household brands with a verified fall. ≤ 60
characters, honest to the video's facts. Description (≤ 4,800 bytes, no `<` `>`):
cold-open facts as prose; "So what really happened?" line; chapters (from `work/timeline.json` section starts, first
at 0:00); sources with links; `Music: "Surreptitious" and "Syntheticity" by Tanner Helland, licensed under CC BY 4.0 -
https://github.com/tannerhelland/free-music` (adjust track names); `Sound effects: SFX Kit by Wyzowl (CC0) -
https://github.com/wyzowl/sfx-kit`; allegations/estimates/not-advice line; a comment question; 3 hashtags.

## 11. Stage files on GitHub (orphan branch `stage`, force-pushed, cleared after upload)
Branch deletion is blocked by the proxy, so always reuse the branch `stage` (force-push) and clear it in step 13.
```
cd /home/claude/yt-uploads && git branch -D stage 2>/dev/null; git checkout -q --orphan stage && git rm -rqf . && mkdir v
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
Overwrite the branch with a placeholder so the files leave the repo (deleting is blocked):
`git checkout -q --orphan clr && git rm -rqf . ; echo staging > STAGE.md && git add STAGE.md && git commit -qm clear && git push -qf origin clr:stage && git checkout -q -f main && git branch -D clr`

## 14. Record state (main branch)
Write `state/latest.json` = `{"date","video_id","title","topic","category","origin","title_format","status":"private_awaiting_publish"}` and
append the same object to `state/videos.json`; update `state/topic_queue.json` and `state/outliers.json`. Copy `script/narration.json`, `script/sfx_cues.json`,
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

---
## Review & re-package task (separate schedule, ~8:41 PM ET daily)
Goal: raise CTR and reach of videos already out. Clone the repo (or `git pull`).
1. **Measure.** For every public video ≤ 45 days old:
   - Studio (best — has impressions and CTR): if Claude in Chrome responds, open
     `https://studio.youtube.com/channel/UC_4MlW0Gh4XhvooLjLZCigA/analytics/tab-content/period-default/explore?entity_type=CHANNEL&entity_id=UC_4MlW0Gh4XhvooLjLZCigA&time_period=4_weeks&explore_type=TABLE_AND_CHART&metric=VIDEO_THUMBNAIL_IMPRESSIONS&granularity=DAY&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&t_metrics=VIEWS&t_metrics=AVERAGE_WATCH_TIME&dimension=VIDEO&o_column=VIDEO_THUMBNAIL_IMPRESSIONS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC`,
     screenshot the table (page text is empty — read the screenshot) and record impressions, CTR, views, avg duration.
     For a video's last 48 h use its own page `https://studio.youtube.com/video/<id>/analytics/tab-reach_viewers/period-default`.
   - API (always): Data API `videos?part=snippet,statistics,contentDetails` for views/thumbnail; Analytics API
     (`ids=channel==MINE`, lags ~2 days): `views,averageViewPercentage,subscribersGained` by `video`;
     `insightTrafficSourceType` by video (`SUBSCRIBER` = Browse/home feed, `RELATED_VIDEO` = Suggested);
     `audienceWatchRatio,relativeRetentionPerformance` by `elapsedVideoTimeRatio` with `filters=video==<id>;audienceType==ORGANIC`.
     Impressions/CTR are NOT in the API (400) and the Reporting API is disabled (403) — use Studio for those.
2. **Diagnose** each video (write one line per video in the owner message):
   - impressions < 1,000 after 48 h → reach problem: topic/title not getting tested → change TITLE first.
   - impressions ≥ 1,000 and CTR < 4% → packaging problem → change THUMBNAIL (then title on the next round).
   - CTR ≥ 4% but views stalled and avg view % < 35% or >35% lost in first 10% → story problem: leave packaging,
     add a lesson to `state/lessons.md` (what the first 60 s did, what to change in future scripts).
   - Views still rising day over day → change nothing.
3. **Change** (at most 2 videos per day): title via PUT `videos?part=snippet` with the full snippet (title,
   categoryId "27", the same description, tags, defaultLanguage, defaultAudioLanguage) — a missing description is
   wiped, so always send it; thumbnail via step 9 (ChatGPT, else thumb_mc.py), staged per step 11, set with
   `youtube_update_video_thumbnail`, branch cleared per step 13.
   Guardrails: ≥ 48 h after publish; ≥ 72 h since the last change to that video; one variable per change unless the
   video had no custom thumbnail; ≤ 3 changes per video, then stop and log it as a story lesson; titles stay honest to
   the video (no claims it does not prove); never touch a video whose views are rising; never change the hit
   (DjbxaXK8hcw) unless its views are flat for 7 days, and then only the thumbnail.
4. **Log** each change in `state/experiments.json` (id, video_id, changed_at, change, before{title/thumbnail,
   impressions, ctr, views}, after, hypothesis, check_after = +72 h, result null). On each run, fill `result` for
   experiments past `check_after`: CTR and impressions/day after vs before, verdict win/loss/flat. Add wins and losses
   to `state/title_patterns.md` (titles) and the "thumbnail rules" list in `state/packaging_baseline.md`; add story
   lessons to `state/lessons.md`. The production task reads these files in step 1 and step 3.
5. Commit and push main; message the owner: one line per video (impr · CTR · views · diagnosis), changes made,
   experiment results.
