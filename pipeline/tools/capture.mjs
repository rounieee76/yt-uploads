// Render scenes/NNN.html -> scenes/NNN.mp4 by seeking every frame (deterministic) and piping JPEGs to ffmpeg.
// usage: node capture.mjs [first] [last]   (indexes into scenes/index.json)
import fs from 'fs';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
const ROOT = '/home/claude/ce';
const FPS = 30;
const idx = JSON.parse(fs.readFileSync(`${ROOT}/scenes/index.json`));
const a = +(process.argv[2] ?? 0), b = +(process.argv[3] ?? idx.length - 1);
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none', '--force-color-profile=srgb'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
for (const s of idx.slice(a, b + 1)) {
  const out = `${ROOT}/scenes/${s.id}.mp4`, hashf = `${ROOT}/scenes/${s.id}.hash`;
  if (fs.existsSync(out) && fs.existsSync(hashf) && fs.readFileSync(hashf, 'utf8') === s.hash) continue;
  const frames = s.frames;
  await page.goto(`file://${ROOT}/scenes/${s.id}.html`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const tmp = `${ROOT}/scenes/${s.id}.tmp.mp4`;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', `${FPS}`, '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', `${FPS}`, tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.__seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 90, optimizeForSpeed: true });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  if (code === 0) { fs.renameSync(tmp, out); fs.writeFileSync(hashf, s.hash); }
  console.log(`${s.id} ${frames}f ${(frames / ((Date.now() - t0) / 1000)).toFixed(1)}fps ${code === 0 ? 'ok' : 'FAIL'}`);
}
await browser.close();
