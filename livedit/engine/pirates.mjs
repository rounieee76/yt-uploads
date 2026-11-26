// Golden Age of Piracy kit for Lived It (ships, decks, Caribbean towns, colonial ports). All original drawings.
import { INK, shade } from './chars.mjs';
import { sky } from './bgs.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
const WATER = { day: '#2E8FB0', dusk: '#5A4A6E', night: '#10243C', dawn: '#6A86A6', storm: '#2A3A48', snow: '#5A6A7E' };
const TROP = { day: '#33B5C4', dusk: '#6A5A7A', night: '#12304A', dawn: '#7AA6B6', storm: '#2E4650', snow: '#5A6A7E' };

function waves(hz, seed = 4, n = 60, op = 0.25) {
  const r = R(seed); let s = '';
  for (let i = 0; i < n; i++) { const y = hz + 16 + r() * (1080 - hz), x = r() * 1920, w = 30 + (y - hz) * 0.12; s += `<path d="M${x} ${y} q${w / 2} -8 ${w} 0 q${w / 2} 8 ${w} 0" stroke="#fff" stroke-width="3" fill="none" opacity="${0.1 + r() * op}"/>`; }
  return s;
}

// ---------- ships ----------
// side-view sailing ship, origin = waterline centre. o.masts 1..3, o.flag colour, o.sails 'full'|'furled', o.guns count per side
export function ship(x, y, s = 1, o = {}) {
  const flip = o.flip, hull = o.hull || '#5A3A26', trim = o.trim || '#C9A24A', sail = o.sail || '#EDE3C8';
  const masts = o.masts ?? 3, L = o.len || 900, guns = o.guns ?? 8;
  let g = `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">`;
  // hull
  g += `<path d="M${-L / 2} -150 L${L / 2 - 60} -150 Q${L / 2 + 40} -150 ${L / 2 + 70} -230 L${L / 2 + 20} -40 Q${L / 2} 20 ${L / 2 - 80} 30 L${-L / 2 + 40} 30 Q${-L / 2 - 20} 10 ${-L / 2 - 30} -60 L${-L / 2 - 50} -220 L${-L / 2 + 60} -230Z" fill="${hull}" ${OL()}/>`;
  g += `<path d="M${-L / 2 - 40} -150 L${L / 2 + 40} -150" stroke="${trim}" stroke-width="12"/><path d="M${-L / 2 - 30} -60 L${L / 2 + 10} -60" stroke="${shade(hull, -0.3)}" stroke-width="8"/>`;
  g += `<path d="M${-L / 2 - 50} -220 L${-L / 2 + 120} -220 L${-L / 2 + 120} -150 L${-L / 2 - 44} -150Z" fill="${shade(hull, 0.12)}" ${OL(4)}/>`; // stern castle
  for (let i = 0; i < guns; i++) { const gx = -L / 2 + 120 + i * ((L - 260) / Math.max(1, guns - 1)); g += `<rect x="${gx - 18}" y="-122" width="36" height="32" fill="#1A120C" ${OL(3)}/>${o.firing ? `<circle cx="${gx}" cy="-106" r="10" fill="#FFB45A"/>` : ''}`; }
  // bowsprit
  g += `<path d="M${L / 2 + 50} -210 L${L / 2 + 260} -330" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M${L / 2 + 50} -210 L${L / 2 + 260} -330" stroke="#6A4A2E" stroke-width="13" stroke-linecap="round"/>`;
  if (o.bowsack) g += `<path d="M${L / 2 + 245} -322 L${L / 2 + 245} -280" stroke="${INK}" stroke-width="4"/><ellipse cx="${L / 2 + 245}" cy="-262" rx="22" ry="26" fill="#2A2420" ${OL(3)}/>`;
  // masts + sails
  const mx = masts === 1 ? [0] : masts === 2 ? [-L * 0.18, L * 0.2] : [-L * 0.28, 0, L * 0.26];
  const mh = masts === 1 ? [620] : masts === 2 ? [600, 640] : [560, 680, 600];
  mx.forEach((m, i) => {
    const h = mh[i];
    g += `<rect x="${m - 9}" y="${-150 - h}" width="18" height="${h}" fill="#6A4A2E" ${OL(3)}/>`;
    if (o.sails === 'furled') { g += [0.35, 0.7].map(f => `<rect x="${m - 150}" y="${-150 - h * f - 10}" width="300" height="18" rx="9" fill="${sail}" ${OL(3)}/>`).join(''); }
    else {
      const sw = masts === 1 ? 380 : 300;
      g += `<path d="M${m - sw / 2} ${-150 - h * 0.92} Q${m} ${-150 - h * 0.98} ${m + sw / 2} ${-150 - h * 0.92} Q${m + sw / 2 + 30} ${-150 - h * 0.7} ${m + sw / 2} ${-150 - h * 0.52} Q${m} ${-150 - h * 0.46} ${m - sw / 2} ${-150 - h * 0.52} Q${m - sw / 2 + 30} ${-150 - h * 0.72} ${m - sw / 2} ${-150 - h * 0.92}Z" fill="${sail}" ${OL(4)}/>`;
      g += `<path d="M${m - sw / 2 - 20} ${-150 - h * 0.48} Q${m} ${-150 - h * 0.52} ${m + sw / 2 + 20} ${-150 - h * 0.48} Q${m + sw / 2 + 50} ${-150 - h * 0.24} ${m + sw / 2 + 20} ${-180} Q${m} ${-190} ${m - sw / 2 - 20} ${-180} Q${m - sw / 2 + 20} ${-150 - h * 0.26} ${m - sw / 2 - 20} ${-150 - h * 0.48}Z" fill="${sail}" ${OL(4)}/>`;
      g += `<path d="M${m - sw / 2 + 30} ${-150 - h * 0.75} Q${m} ${-150 - h * 0.7} ${m + sw / 2 - 30} ${-150 - h * 0.75}" stroke="${shade(sail, -0.15)}" stroke-width="4" fill="none"/>`;
      if (o.torn) g += `<path d="M${m - 40} ${-150 - h * 0.4} l30 40 l-20 30 l40 30" stroke="${INK}" stroke-width="4" fill="none"/>`;
    }
    if (i === mx.length - 1 || masts === 1) g += `<path d="M${m} ${-150 - h} L${m + 110} ${-150 - h + 30} L${m} ${-150 - h + 70}Z" fill="${o.flag || '#141214'}" ${OL(3)}/>`;
  });
  // rigging lines
  g += `<path d="M${L / 2 + 250} -326 L${mx[mx.length - 1]} ${-150 - mh[mh.length - 1]} M${-L / 2 - 40} -220 L${mx[0]} ${-150 - mh[0]}" stroke="${INK}" stroke-width="3" opacity=".7"/>`;
  if (o.name) g += `<text x="${-L / 2 + 30}" y="-170" font-family="Playfair" font-weight="900" font-size="30" fill="${trim}" transform="${flip ? `scale(-1 1) translate(${L - 60} 0)` : ''}">${o.name}</text>`;
  g += `<path d="M${-L / 2 - 60} 30 Q0 60 ${L / 2 + 60} 30" stroke="#fff" stroke-width="5" fill="none" opacity=".5"/>`;
  return g + '</g>';
}
// small single-mast sloop (Jane / Ranger / Adventure)
export const sloop = (x, y, s = 1, o = {}) => ship(x, y, s, { masts: 1, len: 520, guns: o.guns ?? 3, ...o });

// ---------- backgrounds ----------
export function openSea(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 620;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: o.clouds ?? true });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${(o.tropical ? TROP : WATER)[mode]}"/><rect y="${hz}" width="1920" height="8" fill="#fff" opacity=".18"/>`;
  if (o.island) s += `<path d="M${o.island - 300} ${hz} Q${o.island - 120} ${hz - 90} ${o.island + 40} ${hz - 70} Q${o.island + 200} ${hz - 60} ${o.island + 320} ${hz}Z" fill="${mode === 'night' ? '#1E2A2A' : '#4A7A4A'}" ${OL(4)}/>`;
  s += waves(hz, o.seed || 4);
  if (o.sun) s += `<rect x="${o.sun[0] - 60}" y="${hz}" width="120" height="${1080 - hz}" fill="#FFE8B0" opacity=".2"/>`;
  return s;
}
export function harbour(o = {}) { // grey English port: stone quay, warehouses, masts
  const mode = o.mode || 'dawn', hz = o.horizon ?? 640;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  const r = R(o.seed || 8);
  for (let i = 0; i < 8; i++) { const x = i * 250 - 20, w = 230, h = 180 + r() * 120; const c = ['#8A7A6A', '#7A6A5A', '#9A8A72'][i % 3]; s += `<rect x="${x}" y="${hz - h}" width="${w}" height="${h}" fill="${c}" ${OL()}/><path d="M${x - 10} ${hz - h} L${x + w / 2} ${hz - h - 80} L${x + w + 10} ${hz - h}Z" fill="#5A4A44" ${OL()}/>` + [0, 1].map(k => `<rect x="${x + 40 + k * 100}" y="${hz - h + 40}" width="50" height="60" fill="${mode === 'night' || mode === 'dusk' ? '#F4C76A' : '#4A5A6E'}" ${OL(3)}/>`).join(''); }
  s += `<rect y="${hz}" width="1920" height="70" fill="#8A847A" ${OL(4)}/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${i * 82} ${hz} v70" stroke="#6A645A" stroke-width="3"/>`).join('');
  s += `<rect y="${hz + 70}" width="1920" height="${1010 - hz}" fill="${WATER[mode]}"/>` + waves(hz + 70, 6, 40);
  for (const mx of [300, 520, 1500, 1720]) s += `<rect x="${mx - 6}" y="${hz - 420}" width="12" height="440" fill="#4A3424" ${OL(2)}/><path d="M${mx - 90} ${hz - 340} H${mx + 90} M${mx - 70} ${hz - 230} H${mx + 70}" stroke="#4A3424" stroke-width="8"/>`;
  return s;
}
export function nassau(o = {}) { // pirate beach town: palms, shacks, turquoise bay, ships at anchor
  const mode = o.mode || 'day', hz = o.horizon ?? 600;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${TROP[mode]}"/>` + waves(hz, 9, 30, 0.2);
  if (o.ships !== false) s += ship(400, hz + 40, 0.28, { sails: 'furled' }) + ship(1550, hz + 50, 0.32, { sails: 'furled', flip: true });
  s += `<path d="M-20 ${hz + 230} Q600 ${hz + 160} 1100 ${hz + 210} T1940 ${hz + 190} V1080 H-20Z" fill="${mode === 'night' ? '#4A4A52' : '#E8D3A0'}" ${OL(4)}/>`;
  const r = R(o.seed || 5);
  for (let i = 0; i < 5; i++) { const x = 120 + i * 380 + r() * 60, y = hz + 250 + r() * 30, w = 200 + r() * 40, h = 140; const c = ['#A8845A', '#8A6A4A', '#B89A6A'][i % 3]; s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}" ${OL(4)}/><path d="M${x - 30} ${y - h} L${x + w / 2} ${y - h - 90} L${x + w + 30} ${y - h}Z" fill="#C9A85A" ${OL(4)}/>` + Array.from({ length: 6 }, (_, k) => `<path d="M${x - 20 + k * (w + 40) / 6} ${y - h + 4} l${(w + 40) / 12} -${16 + k}" stroke="#9A7A3A" stroke-width="4"/>`).join('') + `<rect x="${x + w * 0.4}" y="${y - 80}" width="50" height="80" fill="#3A2A1E" ${OL(3)}/>`; }
  s += palm(80, hz + 380, 1.0) + palm(1840, hz + 370, 1.1) + palm(980, hz + 300, 0.7);
  return s;
}
export function palm(x, y, s = 1) {
  let p = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q40 -200 -10 -420" stroke="${INK}" stroke-width="46" fill="none" stroke-linecap="round"/><path d="M0 0 Q40 -200 -10 -420" stroke="#7A5A34" stroke-width="34" fill="none" stroke-linecap="round"/>`;
  for (let a = 0; a < 7; a++) { const an = -170 + a * 52, cx = Math.cos(an * Math.PI / 180), sy = Math.sin(an * Math.PI / 180); p += `<path d="M-10 -420 Q${cx * 120} ${-460 + sy * 80} ${cx * 230} ${-400 + sy * 110 + 70}" stroke="${INK}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M-10 -420 Q${cx * 120} ${-460 + sy * 80} ${cx * 230} ${-400 + sy * 110 + 70}" stroke="#3E8A3A" stroke-width="24" fill="none" stroke-linecap="round"/>`; }
  return p + `<circle cx="-20" cy="-410" r="16" fill="#6A4A2A" ${OL(3)}/><circle cx="8" cy="-404" r="16" fill="#6A4A2A" ${OL(3)}/></g>`;
}
export function deck(o = {}) { // on the main deck looking out over the rail
  const mode = o.mode || 'day', hz = o.horizon ?? 520, railY = o.rail ?? 640;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<rect y="${hz}" width="1920" height="${railY - hz}" fill="${(o.tropical ? TROP : WATER)[mode]}"/>` + waves(hz, 3, 25, 0.2).replace(/q/g, 'q');
  if (o.enemy) s += o.enemy;
  // planks in perspective
  const pl = o.planks || '#9A6E44';
  s += `<rect y="${railY}" width="1920" height="${1080 - railY}" fill="${pl}"/>`;
  for (let i = -12; i <= 12; i++) s += `<path d="M${960 + i * 70} ${railY} L${960 + i * 230} 1080" stroke="${shade(pl, -0.3)}" stroke-width="4"/>`;
  for (let k = 0; k < 5; k++) { const y = railY + 40 + k * k * 22; s += `<path d="M0 ${y} H1920" stroke="${shade(pl, -0.18)}" stroke-width="2" opacity=".6"/>`; }
  // bulwark rail
  s += `<rect x="-20" y="${railY - 120}" width="1960" height="120" fill="${shade(pl, -0.25)}" ${OL()}/><rect x="-20" y="${railY - 140}" width="1960" height="26" fill="${shade(pl, 0.05)}" ${OL(4)}/>`;
  for (let x = 60; x < 1920; x += 260) s += `<rect x="${x}" y="${railY - 100}" width="16" height="96" fill="${shade(pl, -0.4)}"/>`;
  if (o.guns !== false) for (const gx of o.gunX || [360, 1560]) s += cannon(gx, railY + 60, 0.9);
  // mast + rigging
  const mx = o.mast ?? 1380;
  if (mx !== null && mx !== false) s += `<path d="M${mx - 600} ${railY - 140} L${mx} -10 M${mx + 500} ${railY - 140} L${mx} -10" stroke="${INK}" stroke-width="4" opacity=".75"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${mx - 600 + i * 100} ${railY - 140 - i * 0} L${mx - 520 + i * 86} ${railY - 300 - i * 50}" stroke="${INK}" stroke-width="2" opacity=".4"/>`).join('') + `<rect x="${mx - 26}" y="-20" width="52" height="${railY + 120}" fill="#6A4A2E" ${OL()}/><rect x="${mx - 34}" y="${railY + 60}" width="68" height="40" fill="#4A3424" ${OL(4)}/>`;
  return s;
}
export function cabin(o = {}) { // captain's cabin in the stern: plank walls, stern windows, beams
  const mode = o.mode || 'night', hz = o.horizon ?? 780;
  const wall = o.wall || '#6A4A30';
  let s = `<rect width="1920" height="${hz}" fill="${wall}"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M0 ${i * 50} H1920" stroke="${shade(wall, -0.25)}" stroke-width="3"/>`).join('');
  const out = { night: '#18284A', dusk: '#C87A5A', day: '#8FC2DE', dawn: '#D8A890', storm: '#3A4450' }[mode];
  for (let i = 0; i < 4; i++) { const x = 560 + i * 210; s += `<rect x="${x}" y="200" width="180" height="250" rx="10" fill="${out}" ${OL()}/><path d="M${x + 90} 200 V450 M${x} 325 H${x + 180}" stroke="#4A3020" stroke-width="10"/>`; if (mode === 'night') s += `<circle cx="${x + 50}" cy="250" r="3" fill="#fff"/><circle cx="${x + 130}" cy="290" r="2" fill="#fff"/>`; }
  s += `<rect x="530" y="180" width="880" height="20" fill="${shade(wall, -0.35)}" ${OL(3)}/><rect x="530" y="450" width="880" height="30" fill="${shade(wall, -0.35)}" ${OL(3)}/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="-20" y="${i * 18 + 20 + i * 140}" width="1960" height="0" />`;
  s += `<rect y="0" width="1920" height="60" fill="${shade(wall, -0.45)}"/>` + [200, 760, 1320].map(x => `<rect x="${x}" y="0" width="70" height="90" fill="${shade(wall, -0.5)}" ${OL(3)}/>`).join('');
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#5A3E26"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${960 + (i - 7) * 160} ${hz} L${960 + (i - 7) * 400} 1080" stroke="#3E2A1A" stroke-width="4"/>`).join('');
  return s;
}
export function colonyTown(o = {}) { // Charleston / Bath: brick and clapboard houses, a steeple, waterfront
  const mode = o.mode || 'day', hz = o.horizon ?? 760;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  const r = R(o.seed || 12); let x = -40, k = 0;
  const cols = ['#B85A44', '#E9DCC0', '#C9B08A', '#9A5A44', '#DCCFB2'];
  while (x < 1960) {
    const w = 200 + r() * 90, h = 220 + r() * 130, c = cols[k % cols.length];
    if (k === 3) { s += `<rect x="${x + 40}" y="${hz - h - 260}" width="110" height="${h + 260}" fill="#E9E2D2" ${OL()}/><path d="M${x + 30} ${hz - h - 260} L${x + 95} ${hz - h - 460} L${x + 160} ${hz - h - 260}Z" fill="#5A6A7A" ${OL()}/><rect x="${x + 75}" y="${hz - h - 200}" width="40" height="70" rx="20" fill="#3A3A44" ${OL(3)}/>`; x += 190; k++; continue; }
    s += `<rect x="${x}" y="${hz - h}" width="${w}" height="${h}" fill="${c}" ${OL()}/><path d="M${x - 14} ${hz - h} L${x + w / 2} ${hz - h - 90} L${x + w + 14} ${hz - h}Z" fill="#4A4044" ${OL()}/><rect x="${x + w * 0.7}" y="${hz - h - 110}" width="34" height="80" fill="#8A4A3A" ${OL(3)}/>`;
    for (let row = 0; row < 2; row++) for (let c2 = 0; c2 < 3; c2++) s += `<rect x="${x + 24 + c2 * (w - 48) / 3}" y="${hz - h + 30 + row * 90}" width="${(w - 48) / 3 - 18}" height="56" fill="${mode === 'night' || mode === 'dusk' ? (r() > 0.4 ? '#F4C76A' : '#2A3448') : '#4A5A6E'}" ${OL(3)}/>`;
    x += w + 10; k++;
  }
  if (o.water) { s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${WATER[mode]}"/>` + waves(hz, 5, 40); s += `<rect y="${hz}" width="1920" height="30" fill="#7A6A5A" ${OL(4)}/>`; }
  else s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${o.ground || '#A89A72'}"/><rect y="${hz}" width="1920" height="20" fill="#7A6A52"/>`;
  return s;
}
export function inlet(o = {}) { // North Carolina sandbars: low dunes, sea oats, shallow channel
  const mode = o.mode || 'dawn', hz = o.horizon ?? 600;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${WATER[mode]}"/>` + waves(hz, 7, 40, 0.2);
  const sand = mode === 'night' ? '#5A5A62' : mode === 'dusk' ? '#B8906A' : '#E2CFA0';
  s += `<path d="M-20 ${hz + 20} Q300 ${hz - 50} 700 ${hz + 10} L700 ${hz + 30} L-20 ${hz + 40}Z" fill="${sand}" ${OL(4)}/><path d="M1250 ${hz + 20} Q1600 ${hz - 60} 1940 ${hz} L1940 ${hz + 40} L1250 ${hz + 36}Z" fill="${sand}" ${OL(4)}/>`;
  if (o.bar) s += `<path d="M-20 1080 L-20 ${o.bar} Q500 ${o.bar - 70} 1000 ${o.bar - 20} Q1400 ${o.bar + 10} 1940 ${o.bar - 40} V1080Z" fill="${sand}" ${OL()}/>` + Array.from({ length: 26 }, (_, i) => { const xx = 40 + i * 74; return `<path d="M${xx} ${o.bar + 10} q-6 -50 4 -80 M${xx + 14} ${o.bar + 12} q8 -40 20 -60" stroke="#8A9A5A" stroke-width="5" fill="none"/>`; }).join('');
  return s;
}

// ---------- props ----------
export function cannon(x, y, s = 1, flip = false) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><rect x="-150" y="-70" width="300" height="70" rx="8" fill="#6A4A2E" ${OL()}/><circle cx="-100" cy="0" r="34" fill="#4A3424" ${OL(4)}/><circle cx="100" cy="0" r="34" fill="#4A3424" ${OL(4)}/><path d="M-170 -110 L180 -130 Q220 -128 220 -105 L220 -80 Q220 -60 180 -62 L-170 -70 Q-200 -90 -170 -110Z" fill="#2A2A2E" ${OL()}/><rect x="200" y="-136" width="26" height="80" rx="6" fill="#2A2A2E" ${OL(4)}/><path d="M-120 -100 L150 -116" stroke="#5A5A62" stroke-width="6"/></g>`;
}
export const X = {
  chest: (x, y, s = 1, open = false) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-150" width="300" height="150" rx="8" fill="#7A4A26" ${OL()}/>${open ? `<path d="M-150 -150 L-140 -270 L140 -270 L150 -150Z" fill="#6A3E20" ${OL()}/><ellipse cx="0" cy="-150" rx="140" ry="30" fill="#E2B43C" ${OL(4)}/>` + [-90, -40, 20, 70].map(cx => `<circle cx="${cx}" cy="-170" r="18" fill="#F2CE5A" ${OL(3)}/>`).join('') : `<path d="M-150 -150 Q0 -240 150 -150Z" fill="#6A3E20" ${OL()}/>`}<path d="M-150 -100 H150 M-80 -150 V0 M80 -150 V0" stroke="#C9A24A" stroke-width="12"/><rect x="-22" y="-130" width="44" height="50" rx="6" fill="#C9A24A" ${OL(3)}/></g>`,
  medChest: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-170" y="-200" width="340" height="200" rx="10" fill="#8A5A34" ${OL()}/><rect x="-170" y="-230" width="340" height="40" rx="8" fill="#6A4026" ${OL()}/><rect x="-30" y="-224" width="60" height="18" rx="6" fill="#C9A24A" ${OL(3)}/>` + [-120, -60, 0, 60, 120].map((bx, i) => `<rect x="${bx - 20}" y="-180" width="40" height="${70 + (i % 2) * 20}" rx="10" fill="${['#4A7A6A', '#8A5A2A', '#5A6A9A', '#7A3A3A', '#4A7A6A'][i]}" ${OL(3)}/><rect x="${bx - 10}" y="-196" width="20" height="18" fill="#C9B89A" ${OL(2)}/>`).join('') + `<path d="M-170 -60 H170" stroke="#6A4026" stroke-width="10"/></g>`,
  bottle: (x, y, s = 1, c = '#3A5A3A') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0 L-30 -90 Q-30 -120 -12 -130 L-12 -170 L12 -170 L12 -130 Q30 -120 30 -90 L30 0Z" fill="${c}" ${OL(4)}/><rect x="-14" y="-186" width="28" height="18" fill="#9A6A3A" ${OL(3)}/><path d="M-18 -90 V-20" stroke="#fff" stroke-width="5" opacity=".35"/></g>`,
  grenade: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="40" fill="#2E3A2E" ${OL(4)}/><rect x="-10" y="-58" width="20" height="22" fill="#3A2A1E" ${OL(3)}/><path d="M0 -58 q20 -30 40 -30" stroke="#C9B89A" stroke-width="4" fill="none"/><circle cx="42" cy="-88" r="9" fill="#FFB45A"/><circle cx="42" cy="-88" r="18" fill="#FFB45A" opacity=".35"/></g>`,
  pistol: (rot = 0, s = 1) => `<g transform="rotate(${rot}) scale(${s})"><path d="M-10 -12 L130 -16 L130 2 L30 8 Q10 40 -20 46 L-34 34 Q-10 20 -10 0Z" fill="#5A3A22" ${OL(3)}/><rect x="20" y="-20" width="114" height="14" rx="4" fill="#3A3A40" ${OL(3)}/><circle cx="-26" cy="40" r="8" fill="#C9A24A"/></g>`,
  cutlass: (rot = -30, s = 1) => `<g transform="rotate(${rot}) scale(${s})"><path d="M-10 -14 Q-30 0 -10 14 L10 14 L10 -14Z" fill="#C9A24A" ${OL(3)}/><rect x="-40" y="-8" width="34" height="16" rx="5" fill="#3A2A1E" ${OL(3)}/><path d="M10 -10 L200 -26 Q240 -20 230 4 Q200 12 10 10Z" fill="#DDE4EA" ${OL(3)}/></g>`,
  brokenCutlass: (rot = -30, s = 1) => `<g transform="rotate(${rot}) scale(${s})"><path d="M-10 -14 Q-30 0 -10 14 L10 14 L10 -14Z" fill="#C9A24A" ${OL(3)}/><rect x="-40" y="-8" width="34" height="16" rx="5" fill="#3A2A1E" ${OL(3)}/><path d="M10 -10 L34 -12 L28 0 L38 8 L10 10Z" fill="#DDE4EA" ${OL(3)}/></g>`,
  lantern: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -150 V-110" stroke="${INK}" stroke-width="5"/><path d="M-40 -110 L40 -110 L30 -96 L-30 -96Z" fill="#3A3A40" ${OL(3)}/><rect x="-32" y="-96" width="64" height="90" rx="8" fill="#FFD27A" ${OL(4)}/><path d="M-32 -50 H32 M0 -96 V-6" stroke="#3A3A40" stroke-width="5"/><rect x="-38" y="-8" width="76" height="16" rx="4" fill="#3A3A40" ${OL(3)}/></g>`,
  helm: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M0 0 L${Math.cos(a) * 170} ${Math.sin(a) * 170}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M0 0 L${Math.cos(a) * 170} ${Math.sin(a) * 170}" stroke="#7A4E30" stroke-width="13" stroke-linecap="round"/>`; }).join('') + `<circle r="120" fill="none" stroke="${INK}" stroke-width="30"/><circle r="120" fill="none" stroke="#9A6A3A" stroke-width="20"/><circle r="30" fill="#C9A24A" ${OL(4)}/></g>`,
  scroll: (x, y, s = 1, text = '', seal = true) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-220" y="-280" width="440" height="560" fill="#EFE2C0" ${OL()}/><rect x="-250" y="-300" width="500" height="40" rx="20" fill="#D9C79A" ${OL(4)}/><rect x="-250" y="260" width="500" height="40" rx="20" fill="#D9C79A" ${OL(4)}/>` + Array.from({ length: 9 }, (_, i) => `<path d="M-170 ${-150 + i * 40} H${150 - (i % 3) * 40}" stroke="#7A6A52" stroke-width="5" opacity=".7"/>`).join('') + (text ? `<text x="0" y="-190" text-anchor="middle" font-family="Playfair" font-weight="900" font-size="58" fill="${INK}">${text}</text>` : '') + (seal ? `<circle cx="120" cy="200" r="44" fill="#A8282A" ${OL(4)}/><circle cx="120" cy="200" r="24" fill="none" stroke="#7A1A1A" stroke-width="5"/>` : '') + `</g>`,
  map: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-4)"><rect x="-300" y="-200" width="600" height="400" fill="#E9D8A8" ${OL()}/><path d="M-220 -80 Q-150 -150 -60 -100 Q0 -60 -40 20 Q-90 90 -190 60 Q-260 20 -220 -80Z" fill="#B8C48A" ${OL(3)}/><path d="M60 40 Q120 -20 200 20 Q240 90 160 120 Q80 130 60 40Z" fill="#B8C48A" ${OL(3)}/><path d="M-120 0 Q0 120 120 70" stroke="#8E2A24" stroke-width="6" stroke-dasharray="16 12" fill="none"/><path d="M110 60 l20 20 M130 60 l-20 20" stroke="#8E2A24" stroke-width="8"/></g>`,
  coins: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + [[-60, 0], [0, -10], [60, 4], [-30, -30], [30, -34], [0, -56]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="34" ry="14" fill="#E2B43C" ${OL(3)}/>`).join('') + `</g>`,
  smoke: (x, y, s = 1, c = '#D8D2C8') => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".75"><circle cx="0" cy="0" r="90" fill="${c}"/><circle cx="80" cy="-40" r="70" fill="${c}"/><circle cx="-80" cy="-20" r="60" fill="${c}"/><circle cx="20" cy="-90" r="60" fill="${c}"/><circle cx="140" cy="10" r="50" fill="${c}"/></g>`,
  flash: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -60 L30 -20 L90 -30 L50 10 L80 60 L20 30 L-10 80 L-20 30 L-80 50 L-40 0 L-90 -40 L-20 -20Z" fill="#FFD24A" ${OL(3)}/><circle r="26" fill="#FFF4C8"/></g>`,
  pole: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-520" width="20" height="520" fill="#5A3A26" ${OL(3)}/><ellipse cx="0" cy="-540" rx="34" ry="38" fill="#2A2420" ${OL(3)}/></g>`,
  rope: (x1, y1, x2, y2) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 60} ${x2} ${y2}" stroke="${INK}" stroke-width="12" fill="none"/><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 60} ${x2} ${y2}" stroke="#B8986A" stroke-width="6" fill="none"/>`,
  wreck: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-400 0 Q-380 -120 -200 -150 L250 -150 Q380 -110 400 0Z" fill="#3A4A44" ${OL()}/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${-320 + i * 80} -140 Q${-330 + i * 80} -260 ${-290 + i * 80} -300" stroke="#2A3430" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('') + `<g transform="translate(-60 -40) rotate(-8)"><path d="M-130 -18 L120 -26 Q150 -24 150 -8 L150 6 Q150 18 120 16 L-130 12Z" fill="#4A5A50" ${OL(4)}/></g><circle cx="200" cy="-30" r="34" fill="#5A6A5A" ${OL(4)}/></g>`,
};
