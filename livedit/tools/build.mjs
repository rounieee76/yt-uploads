// Build scenes/NNN.html + scenes/index.json from scenes.mjs and work/timeline.json.
import fs from 'fs';
import crypto from 'crypto';
import { page } from './lib.mjs';
import scenes from './scenes.mjs';
const ROOT = '/home/claude/gk', FPS = 30;
const TL = JSON.parse(fs.readFileSync(`${ROOT}/work/timeline.json`));
const SEN = TL.sentences;
const missing = [];
const norm = (s) => s.replace(/[’']/g, "'");
function find(phrase) {
  const p = norm(phrase);
  for (const s of SEN) { const k = norm(s.text).indexOf(p); if (k >= 0) return { s, k }; }
  missing.push(phrase); return null;
}
// time at the start of a phrase: sentence start + share of characters before it
const Q = (phrase) => { const r = find(phrase); if (!r) return 0; const { s, k } = r; return +(s.start + (s.end - s.start) * (k / s.text.length)).toFixed(3); };
const E = (phrase) => { const r = find(phrase); return r ? r.s.end : 0; };
const list = scenes(Q, E);
const starts = list.map(sc => typeof sc.cue === 'number' ? sc.cue : (sc.cue === 'On February 5th' ? 0 : Q(sc.cue)));
fs.mkdirSync(`${ROOT}/scenes`, { recursive: true });
const idx = [];
let empty = 0;
for (let i = 0; i < list.length; i++) {
  const f0 = Math.round(starts[i] * FPS), f1 = i + 1 < list.length ? Math.round(starts[i + 1] * FPS) : Math.round(TL.duration * FPS);
  const frames = f1 - f0;
  if (frames <= 0) { console.log('ORDER PROBLEM', i, list[i].cue); continue; }
  Q._s = f0 / FPS;
  const html = page({ start: f0 / FPS, dur: frames / FPS, ...list[i] });
  const id = String(i).padStart(3, '0');
  fs.writeFileSync(`${ROOT}/scenes/${id}.html`, html);
  idx.push({ id, cue: String(list[i].cue).slice(0, 40), start: +(f0 / FPS).toFixed(3), frames, hash: crypto.createHash('md5').update(html).digest('hex') });
  if (frames > 30 * 14) console.log(`LONG ${id} ${(frames / FPS).toFixed(1)}s ${list[i].cue}`);
}
fs.writeFileSync(`${ROOT}/scenes/index.json`, JSON.stringify(idx, null, 1));
console.log(`scenes ${idx.length}, total ${(idx.reduce((a, s) => a + s.frames, 0) / FPS / 60).toFixed(2)} min, missing cues ${missing.length}`);
if (missing.length) console.log('MISSING:', [...new Set(missing)].join(' | '));
