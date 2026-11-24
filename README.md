# yt-uploads

Pipeline and state for the Money Encode daily video schedule.
- `pipeline/RUNBOOK.md` — what each daily run does (research → video → private upload → public at ~2 PM ET)
- `pipeline/setup.sh` — builds the toolchain in a fresh workspace
- `pipeline/examples/` — every finished video's script, scenes, sound cues and fact-check
- `state/latest.json` — the video waiting to be published; `state/videos.json` — history
Staged uploads go to a temporary `stage` branch that is deleted after each upload.
