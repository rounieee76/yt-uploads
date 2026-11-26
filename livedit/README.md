# Lived It production kit
Project folder used: /home/claude/gk (copy livedit/tools to <proj>/tools, symlink node_modules/venv/fonts from the Money Encode setup:
pipeline/setup.sh builds /home/claude/ce with them; then `sed -i 's#/home/claude/gk#<proj>#g'` the tools).
Steps: script/narration.json (+ pron.json) → tools/venv/bin/python tools/voice.py → write tools/scenes.mjs using tools/lib.mjs
(flat 2D kit: bgSteppe, ger, horse, rider, person, baby, props, tag, caption, chapter, card, mapPanel) → node tools/build.mjs →
node tools/stills.mjs 0.8 (read every sheet, fix) → node tools/capture.mjs a b (3 jobs in parallel) → MUSIC_A/MUSIC_B music2.py →
sfx.py → mix.sh → finish.sh <Name> → re-encode crf 22 if > 95 MB → stage → upload private → PUT status.publishAt (2 PM ET).
Example: examples/2026-11-26-genghis-khan.
