// Render each scene's layers to PNG (2304x1296, transparent) + write plan.json for comp.py
// usage: node build.mjs PROJECT [ids,...]
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { open, snap, close } from './snap.mjs';
import { char, put } from './chars.mjs';

const P = path.resolve(process.argv[2]);
const only = process.argv[3] ? new Set(process.argv[3].split(',')) : null;
const scenes = (await import(`${P}/scenes.mjs?${Date.now()}`)).default;
fs.mkdirSync(`${P}/layers`, { recursive: true });
await open(1.2);
const plan = [];
const H = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 10);
for (const sc of scenes) {
  const L = {};
  const parts = {
    bg: typeof sc.bg === 'function' ? sc.bg() : (sc.bg || ''),
    mid: typeof sc.mid === 'function' ? sc.mid() : (sc.mid || ''),
    fg: typeof sc.fg === 'function' ? sc.fg() : (sc.fg || ''),
  };
  const chars = (sc.chars || []).map(c => put(char({ ...c.c }), c.x, c.y, (c.s || 1) * (sc.cscale || 1.15), c.flip)).join('');
  const charsB = (sc.chars || []).map(c => put(char({ ...c.c, blink: true }), c.x, c.y, (c.s || 1) * (sc.cscale || 1.15), c.flip)).join('');
  parts.chars = chars; if (chars) parts.blink = charsB;
  for (const [k, svg] of Object.entries(parts)) {
    if (!svg) continue;
    const h = H(svg), f = `${P}/layers/${sc.id}_${k}_${h}.png`;
    if (!fs.existsSync(f) && (!only || only.has(sc.id))) await snap(svg, f, k === 'bg' ? '#000' : false);
    L[k] = f;
  }
  plan.push({ id: sc.id, cue: sc.cue, layers: L, light: sc.light || {}, fx: sc.fx || [], cam: sc.cam || 'in', tag: sc.tag, big: sc.big, depth: sc.depth || {}, shake: sc.shake || 0, flash: sc.flash || 0, hold: sc.hold });
  process.stdout.write(`\r${plan.length}/${scenes.length}`);
}
await close();
fs.writeFileSync(`${P}/work/plan.json`, JSON.stringify(plan, null, 1));
console.log('\nplan written', plan.length);
