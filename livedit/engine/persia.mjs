// Medieval Persia / Egypt kit for Lived It (Hassan-i Sabbah, Seljuks, Alamut).
import { INK, shade } from './chars.mjs';
import { sky } from './bgs.mjs';
import { mountains } from './japan.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
const NIGHTISH = (m) => m === 'night' || m === 'storm';
const ARCH = (x, y, w, h) => `M${x} ${y} V${y - h + w * 0.55} Q${x} ${y - h} ${x + w / 2} ${y - h - w * 0.18} Q${x + w} ${y - h} ${x + w} ${y - h + w * 0.55} V${y}Z`;

// ---------- pieces ----------
export function dome(x, y, w, c = '#3A8AA6', drum = '#C9B08A') {
  return `<rect x="${x - w * 0.42}" y="${y - w * 0.32}" width="${w * 0.84}" height="${w * 0.32}" fill="${drum}" ${OL(4)}/><path d="M${x - w * 0.46} ${y - w * 0.32} Q${x - w * 0.5} ${y - w * 0.95} ${x} ${y - w * 1.08} Q${x + w * 0.5} ${y - w * 0.95} ${x + w * 0.46} ${y - w * 0.32}Z" fill="${c}" ${OL(4)}/><path d="M${x - w * 0.22} ${y - w * 0.8} Q${x - w * 0.1} ${y - w * 0.95} ${x + w * 0.05} ${y - w * 0.98}" stroke="${shade(c, 0.35)}" stroke-width="${w * 0.04}" fill="none" stroke-linecap="round"/><path d="M${x} ${y - w * 1.08} V${y - w * 1.25}" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="${y - w * 1.27}" r="${w * 0.035}" fill="#E2B43C" ${OL(2)}/>`;
}
export function minaret(x, y, h = 520, c = '#C9A878') {
  return `<rect x="${x - 34}" y="${y - h}" width="68" height="${h}" fill="${c}" ${OL(4)}/><rect x="${x - 50}" y="${y - h * 0.72}" width="100" height="22" fill="${shade(c, -0.2)}" ${OL(4)}/><path d="M${x - 34} ${y - h * 0.4} H${x + 34} M${x - 34} ${y - h * 0.55} H${x + 34}" stroke="#3A8AA6" stroke-width="10"/><path d="M${x - 38} ${y - h} L${x} ${y - h - 90} L${x + 38} ${y - h}Z" fill="#3A8AA6" ${OL(4)}/>`;
}
function house(x, y, w, h, c, mode, r) {
  let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}" ${OL(4)}/><rect x="${x - 6}" y="${y - h - 14}" width="${w + 12}" height="16" fill="${shade(c, -0.15)}" ${OL(3)}/>`;
  const lit = NIGHTISH(mode) || mode === 'dusk';
  for (let k = 0; k < Math.floor(w / 90); k++) { const wx = x + 30 + k * 90; s += `<path d="${ARCH(wx, y - h * 0.35, 40, h * 0.32)}" fill="${lit && r() > 0.4 ? '#FFC266' : '#3A2A22'}" ${OL(3)}/>`; }
  if (r() > 0.5) s += `<path d="${ARCH(x + w / 2 - 32, y, 64, 120)}" fill="#4A3020" ${OL(3)}/>`;
  return s;
}
function ground(y, c) { return `<rect y="${y}" width="1920" height="${1080 - y}" fill="${c}"/>`; }
function landBand(y, c) { return `<path d="M0 ${y + 20} Q480 ${y - 30} 960 ${y + 10} T1920 ${y} V1080 H0Z" fill="${c}"/>`; }

// ---------- backgrounds ----------
export function persianTown(o = {}) { // Qom / Rey / Isfahan: mud-brick houses, blue domes, a minaret
  const mode = o.mode || 'day', hz = o.horizon ?? 820, r = R(o.seed || 4);
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: mode !== 'night' }) + mountains(mode === 'dusk' ? 'dusk' : mode, hz - 220, { snowcaps: true });
  const wall = NIGHTISH(mode) ? '#6A5A52' : mode === 'dusk' ? '#B88A62' : '#D2B286';
  for (let i = 0; i < 9; i++) { const x = i * 230 - 60 + r() * 30, w = 190 + r() * 60, h = 120 + r() * 70; s += house(x, hz - 110, w, h, shade(wall, -0.08 - r() * 0.08), mode, r); }
  s += dome(o.domeX ?? 1320, hz - 150, 300) + minaret(o.minX ?? 1580, hz - 120, 520) + dome(420, hz - 140, 180, '#4A9AB0');
  for (let i = 0; i < 7; i++) { const x = i * 290 - 40 + r() * 40, w = 250, h = 160 + r() * 60; s += house(x, hz + 20, w, h, wall, mode, r); }
  s += ground(hz + 20, o.ground || (NIGHTISH(mode) ? '#5A4A3E' : '#B8986A'));
  return s;
}
export function bazaar(o = {}) { // covered market: brick arches, hanging lamps, stalls
  const hz = o.horizon ?? 760, r = R(5);
  let s = `<rect width="1920" height="${hz}" fill="#A87A52"/>`;
  for (let x = -60; x < 1920; x += 360) { s += `<path d="${ARCH(x + 40, hz, 280, hz - 120)}" fill="#5A3A26" ${OL(4)}/><path d="${ARCH(x + 70, hz, 220, hz - 180)}" fill="${o.mode === 'night' ? '#2A1E2A' : '#E9C88A'}" opacity=".9"/>`; s += `<rect x="${x + 50}" y="${hz - 190}" width="260" height="30" fill="${['#A8282A', '#2E6A8A', '#C9A24A', '#4A7A3A'][Math.floor(r() * 4)]}" ${OL(3)}/>`; for (let k = 0; k < 4; k++) s += `<circle cx="${x + 90 + k * 60}" cy="${hz - 120}" r="22" fill="${['#E2B43C', '#C9582A', '#8AA04A', '#A8282A'][k]}" ${OL(3)}/>`; s += `<path d="M${x + 180} 0 V80" stroke="${INK}" stroke-width="4"/><path d="M${x + 160} 80 h40 l-8 40 h-24z" fill="#E2B43C" ${OL(3)}/>`; }
  s += `<rect width="1920" height="60" fill="#7A5236" ${OL(4)}/>`;
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#9A7A56"/>`;
  return s;
}
export function iwanRoom(o = {}) { // madrasa / house interior: plaster, pointed niches, tile frieze, carpet
  const hz = o.horizon ?? 760, wall = o.wall || '#E2D2B0', mode = o.mode || 'day';
  let s = `<rect width="1920" height="${hz}" fill="${wall}"/>`;
  s += `<rect y="${hz - 150}" width="1920" height="150" fill="#2E6A8A"/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${i * 80 + 40} ${hz - 140} l30 65 l-30 65 l-30 -65z" fill="#E9DCC0" opacity=".85"/><circle cx="${i * 80 + 40}" cy="${hz - 75}" r="10" fill="#C9302A"/>`).join('') + `<path d="M0 ${hz - 150} H1920" ${OL(4)}/>`;
  for (let x = 100; x < 1920; x += 440) {
    if (o.window === x) { s += `<path d="${ARCH(x, hz - 170, 300, 420)}" fill="${mode === 'night' ? '#1E2A4A' : '#9FC8E0'}" ${OL(5)}/>`; if (mode === 'night') s += `<circle cx="${x + 200}" cy="${hz - 480}" r="30" fill="#F2EEDC"/>`; s += `<path d="M${x + 150} ${hz - 170} V${hz - 560} M${x} ${hz - 380} H${x + 300}" stroke="#5A3A26" stroke-width="10"/>`; continue; }
    s += `<path d="${ARCH(x, hz - 170, 300, 420)}" fill="${shade(wall, -0.16)}" ${OL(5)}/>`;
    if (o.books) for (let k = 0; k < 3; k++) { const yy = hz - 230 - k * 110; s += `<rect x="${x + 10}" y="${yy}" width="280" height="12" fill="#6A4A2E" ${OL(3)}/>`; for (let b = 0; b < 9; b++) s += `<rect x="${x + 20 + b * 30}" y="${yy - 70 + (b % 3) * 8}" width="24" height="${70 - (b % 3) * 8}" fill="${['#8E2A24', '#2E4A6A', '#4A6A3A', '#8A6A3A', '#5A3A5A'][(b + k) % 5]}" ${OL(2.5)}/>`; }
  }
  s += `<rect width="1920" height="50" fill="${shade(wall, -0.3)}" ${OL(4)}/>`;
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="${o.floor || '#8A6A4A'}"/>`;
  if (o.carpet !== false) s += `<path d="M520 ${hz + 40} L1400 ${hz + 40} L1580 1080 L340 1080Z" fill="#8E2A24" ${OL(4)}/><path d="M580 ${hz + 70} L1340 ${hz + 70} L1490 1050 L430 1050Z" fill="none" stroke="#E2B43C" stroke-width="8"/><path d="M960 ${hz + 120} l90 120 l-90 120 l-90 -120z" fill="#2E4A6A" ${OL(3)}/>`;
  return s;
}
export function alamut(o = {}) { // the rock and castle in the Alborz; o.near for a closer view, o.ruin after 1256
  const mode = o.mode || 'day', hz = o.horizon ?? 720, near = !!o.near;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true }) + mountains(mode, hz - 120, { snowcaps: true });
  const rock = NIGHTISH(mode) ? '#4A4044' : mode === 'dusk' ? '#8A5A4A' : '#A8806A';
  const k = near ? 1.5 : 1, cx = o.x ?? 960, top = hz - (near ? 330 : 420);
  s += `<path d="M${cx - 760 * k} ${hz + 140} Q${cx - 430 * k} ${hz + 20} ${cx - 360 * k} ${top + 120} L${cx - 330 * k} ${top + 10} L${cx + 290 * k} ${top - 6} L${cx + 330 * k} ${top + 90} Q${cx + 420 * k} ${hz + 10} ${cx + 760 * k} ${hz + 140}Z" fill="${rock}" ${OL(5)}/>`;
  s += `<path d="M${cx + 120 * k} ${top} L${cx + 290 * k} ${top - 6} L${cx + 330 * k} ${top + 90} Q${cx + 420 * k} ${hz + 10} ${cx + 760 * k} ${hz + 140} L${cx + 200 * k} ${hz + 140} Q${cx + 230 * k} ${hz - 100} ${cx + 120 * k} ${top}Z" fill="${shade(rock, -0.18)}"/>`;
  for (let i = 0; i < 6; i++) { const y = top + 50 + i * (hz - top) / 6; s += `<path d="M${cx - 350 * k + i * 6} ${y} Q${cx} ${y - 14} ${cx + 330 * k + i * 12} ${y + 6}" stroke="${shade(rock, -0.3)}" stroke-width="${5 * k}" fill="none" opacity=".55"/>`; }
  for (let i = 0; i < 8; i++) s += `<path d="M${cx - 300 * k + i * 80 * k} ${top + 30} L${cx - 320 * k + i * 86 * k} ${top + 160 + (i % 3) * 60}" stroke="${shade(rock, -0.28)}" stroke-width="${5 * k}" opacity=".5"/>`;
  const sc = near ? 1.5 : 1, wy = top + 6;
  if (o.ruin) {
    s += `<path d="M${cx - 280 * k} ${wy} l60 -50 l40 30 l50 -70 l60 60 l80 -30 l50 40 l90 -60 l60 70 L${cx + 250 * k} ${wy}Z" fill="#6A5E56" ${OL(4)}/>`;
  } else {
    const stone = NIGHTISH(mode) ? '#5A5250' : '#C9B08A';
    s += `<path d="M${cx - 300 * k} ${wy} V${wy - 70 * sc} H${cx + 260 * k} V${wy}Z" fill="${stone}" ${OL(4)}/>`;
    for (let x = cx - 300 * k; x < cx + 260 * k; x += 34 * sc) s += `<rect x="${x}" y="${wy - 92 * sc}" width="${20 * sc}" height="${22 * sc}" fill="${stone}" ${OL(3)}/>`;
    for (const tx of [-300, -120, 80, 240]) { const x = cx + tx * k; s += `<rect x="${x - 34 * sc}" y="${wy - 150 * sc}" width="${68 * sc}" height="${150 * sc}" fill="${shade(stone, -0.08)}" ${OL(4)}/><path d="M${x - 40 * sc} ${wy - 150 * sc} L${x} ${wy - 200 * sc} L${x + 40 * sc} ${wy - 150 * sc}Z" fill="#8E3A2A" ${OL(3)}/><rect x="${x - 8 * sc}" y="${wy - 120 * sc}" width="${16 * sc}" height="${30 * sc}" fill="${NIGHTISH(mode) || mode === 'dusk' ? '#FFC266' : '#2A1E1A'}"/>`; }
  }
  if (o.terraces !== false) s += `<path d="M0 ${hz + 160} Q480 ${hz + 80} 960 ${hz + 150} T1920 ${hz + 120} V1080 H0Z" fill="${NIGHTISH(mode) ? '#2E3A2E' : '#6A8A4A'}" ${OL(4)}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${hz + 210 + i * 50} Q480 ${hz + 150 + i * 50} 960 ${hz + 200 + i * 52} T1920 ${hz + 170 + i * 50}" stroke="${NIGHTISH(mode) ? '#24301E' : '#4E6E36'}" stroke-width="6" fill="none"/>`).join('');
  return s;
}
export function battlement(o = {}) { // on the castle wall: crenellated parapet, valley far below
  const mode = o.mode || 'day', hz = o.horizon ?? 820;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true }) + mountains(mode, hz - 160, { snowcaps: true });
  s += `<path d="M0 ${hz - 120} Q600 ${hz - 180} 1100 ${hz - 130} T1920 ${hz - 140} V${hz} H0Z" fill="${NIGHTISH(mode) ? '#2A3424' : '#7A9A5A'}" opacity=".85"/>`;
  const st = NIGHTISH(mode) ? '#5A5250' : '#B89A72';
  s += `<rect y="${hz - 100}" width="1920" height="100" fill="${st}" ${OL(4)}/>`;
  for (let x = -20; x < 1940; x += 160) s += `<rect x="${x}" y="${hz - 170}" width="100" height="80" fill="${st}" ${OL(4)}/>`;
  for (let x = 0; x < 1920; x += 120) s += `<path d="M${x} ${hz - 100} V${hz}" stroke="${shade(st, -0.2)}" stroke-width="4"/>`;
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${shade(st, -0.18)}"/><path d="M0 ${hz} H1920" ${OL(5)}/>`;
  return s;
}
export function study(o = {}) { // Hasan's room at Alamut: bare stone, arched window over the valley, books, one lamp
  const hz = o.horizon ?? 760, mode = o.mode || 'night';
  let s = `<rect width="1920" height="${hz}" fill="#6A5A4E"/>`;
  for (let y = 40; y < hz; y += 90) for (let x = (y / 90) % 2 ? 0 : -80; x < 1920; x += 160) s += `<rect x="${x}" y="${y}" width="156" height="86" rx="6" fill="#74645A" stroke="#4A3E36" stroke-width="3"/>`;
  const wx = o.winX ?? 1300;
  s += `<path d="${ARCH(wx, hz - 140, 340, 470)}" fill="${mode === 'night' ? '#1A2440' : mode === 'dusk' ? '#E08A5A' : '#9FC8E0'}" ${OL(6)}/>`;
  s += `<path d="M${wx} ${hz - 240} L${wx + 90} ${hz - 330} L${wx + 180} ${hz - 280} L${wx + 340} ${hz - 360} V${hz - 140} H${wx}Z" fill="${mode === 'night' ? '#2A3048' : '#8A7A8A'}"/>`;
  if (mode === 'night') s += Array.from({ length: 6 }, (_, i) => `<circle cx="${wx + 40 + i * 50}" cy="${hz - 520 + (i % 3) * 40}" r="3" fill="#F2EEDC"/>`).join('');
  s += `<rect x="${wx - 20}" y="${hz - 150}" width="380" height="24" fill="#5A4A3E" ${OL(4)}/>`;
  for (let k = 0; k < 3; k++) { const yy = hz - 260 - k * 120, x = 160; s += `<rect x="${x}" y="${yy}" width="520" height="14" fill="#5A3A22" ${OL(3)}/>`; for (let b = 0; b < 15; b++) s += `<rect x="${x + 14 + b * 33}" y="${yy - 80 + (b % 4) * 7}" width="27" height="${80 - (b % 4) * 7}" fill="${['#8E2A24', '#2E4A6A', '#4A6A3A', '#8A6A3A', '#5A3A5A', '#C9A24A'][(b + k * 2) % 6]}" ${OL(2.5)}/>`; }
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#4E4038"/><path d="M560 ${hz + 60} L1360 ${hz + 60} L1500 1080 L420 1080Z" fill="#6A2A24" ${OL(4)}/><path d="M610 ${hz + 90} L1310 ${hz + 90} L1430 1050 L490 1050Z" fill="none" stroke="#C9A24A" stroke-width="6"/>`;
  return s;
}
export function cairo(o = {}) { // Fatimid Cairo on the Nile: domes, minarets, palms, pyramids far off
  const mode = o.mode || 'day', hz = o.horizon ?? 760, r = R(7);
  let s = sky(mode, { sun: o.sun ?? (mode === 'dusk' ? [1500, 520] : undefined), moon: o.moon, clouds: false });
  const sand = NIGHTISH(mode) ? '#5A5040' : mode === 'dusk' ? '#C98A5A' : '#E0C08A';
  s += `<path d="M0 ${hz - 60} H1920 V${hz} H0Z" fill="${shade(sand, -0.1)}"/>`;
  for (const [x, w] of [[220, 300], [470, 200], [640, 130]]) s += `<path d="M${x - w / 2} ${hz - 60} L${x} ${hz - 60 - w * 0.62} L${x + w / 2} ${hz - 60}Z" fill="${shade(sand, -0.05)}" ${OL(4)}/><path d="M${x} ${hz - 60 - w * 0.62} L${x + w / 2} ${hz - 60} L${x + w * 0.1} ${hz - 60}Z" fill="${shade(sand, -0.22)}"/>`;
  for (let i = 0; i < 8; i++) { const x = 820 + i * 140 + r() * 30, h = 90 + r() * 80; s += house(x, hz, 130, h, shade('#D9BC8C', -r() * 0.15), mode, r); }
  s += dome(1180, hz - 90, 220, '#3A8A6A') + minaret(1460, hz - 60, 460) + minaret(980, hz - 60, 380) + dome(1700, hz - 80, 160, '#3A8A6A');
  s += `<rect y="${hz}" width="1920" height="140" fill="${NIGHTISH(mode) ? '#1E3048' : mode === 'dusk' ? '#C9785A' : '#4A8AAA'}"/>` + Array.from({ length: 20 }, () => `<path d="M${r() * 1920} ${hz + 20 + r() * 110} q20 -8 40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".35"/>`).join('');
  s += ground(hz + 140, sand);
  if (o.boat !== false) s += `<g transform="translate(560 ${hz + 90})"><path d="M-150 0 Q0 40 150 0 L120 30 L-120 30Z" fill="#7A4A26" ${OL(4)}/><path d="M0 0 V-220" stroke="#4A2E1A" stroke-width="8"/><path d="M0 -215 L110 -40 L0 -30Z" fill="#F2EADA" ${OL(3)}/></g>`;
  return s;
}
export function desertRoad(o = {}) { // dry hills and a road across the plateau
  const mode = o.mode || 'day', hz = o.horizon ?? 700;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: mode !== 'night' }) + mountains(mode, hz, { snowcaps: o.snow ?? false });
  const sand = NIGHTISH(mode) ? '#4A4038' : mode === 'dusk' ? '#B87A52' : '#C9A270';
  s += landBand(hz + 30, shade(sand, -0.1)) + landBand(hz + 140, sand);
  s += `<path d="M860 ${hz + 120} L1060 ${hz + 120} L1500 1080 L420 1080Z" fill="${shade(sand, 0.14)}"/><path d="M960 ${hz + 140} L960 1080" stroke="${shade(sand, -0.1)}" stroke-width="10" stroke-dasharray="40 50"/>`;
  const r = R(11); for (let i = 0; i < 18; i++) { const x = r() * 1920, y = hz + 200 + r() * 300; if (x > 500 && x < 1420) continue; s += `<ellipse cx="${x}" cy="${y}" rx="${30 + r() * 40}" ry="${14 + r() * 10}" fill="${shade(sand, -0.22)}" ${OL(3)}/>`; }
  return s;
}
export function court(o = {}) { // Seljuk court: tiled arches, banners, throne dais
  const hz = o.horizon ?? 760;
  let s = `<rect width="1920" height="${hz}" fill="#2E4A5A"/>`;
  for (let x = 40; x < 1920; x += 380) { s += `<path d="${ARCH(x, hz - 60, 300, hz - 160)}" fill="#C9A878" ${OL(5)}/><path d="${ARCH(x + 30, hz - 60, 240, hz - 230)}" fill="#1E3A4A"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M${x + 150} ${200 + i * 90} l26 30 l-26 30 l-26 -30z" fill="#E2B43C" opacity=".7"/>`).join(''); }
  s += `<rect width="1920" height="70" fill="#8E2A24" ${OL(4)}/>` + Array.from({ length: 24 }, (_, i) => `<circle cx="${i * 84 + 40}" cy="35" r="14" fill="#E2B43C"/>`).join('');
  if (o.banners !== false) for (const x of [300, 1620]) s += `<path d="M${x} 90 V520 L${x + 80} 470 L${x + 160} 520 V90Z" fill="#2E5A4A" ${OL(4)}/><circle cx="${x + 80}" cy="260" r="40" fill="#E2B43C" ${OL(3)}/>`;
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#8A6A4A"/><path d="M700 ${hz} L1220 ${hz} L1440 1080 L480 1080Z" fill="#8E2A24"/><path d="M760 ${hz + 20} L1160 ${hz + 20} L1350 1060 L570 1060Z" fill="none" stroke="#E2B43C" stroke-width="6"/>`;
  return s;
}
export function camp(o = {}) { // an army camped in the valley; Alamut far off on its rock
  const mode = o.mode || 'dusk', hz = o.horizon ?? 700;
  let s = alamut({ mode, horizon: hz, terraces: false, x: o.rockX ?? 1500 });
  s += `<path d="M0 ${hz + 60} Q600 ${hz + 20} 1100 ${hz + 70} T1920 ${hz + 50} V1080 H0Z" fill="${NIGHTISH(mode) ? '#3A3428' : '#9A8458'}" ${OL(4)}/>`;
  const r = R(o.seed || 9);
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9 - row * 2; i++) { const x = 60 + i * 200 + row * 90 + r() * 40, y = hz + 160 + row * 120, w = 150 + row * 40; s += `<path d="M${x - w / 2} ${y} L${x} ${y - w * 0.7} L${x + w / 2} ${y}Z" fill="${['#E9DCC0', '#C9B48A', '#B8584A'][(i + row) % 3]}" ${OL(4)}/><path d="M${x} ${y} L${x} ${y - w * 0.7}" stroke="${INK}" stroke-width="3"/><path d="M${x - w * 0.12} ${y} L${x} ${y - w * 0.3} L${x + w * 0.12} ${y}Z" fill="#2A1E1A"/>`; if (NIGHTISH(mode) || mode === 'dusk') s += `<circle cx="${x + w * 0.6}" cy="${y - 6}" r="10" fill="#FFB45A"/>`; }
  return s;
}
export function garden(o = {}) { // the legendary 'paradise' garden (Marco Polo's story)
  const mode = o.mode || 'day', hz = o.horizon ?? 760;
  let s = sky(mode, { sun: o.sun, clouds: true });
  s += `<rect y="${hz - 160}" width="1920" height="160" fill="#C9B08A" ${OL(4)}/>` + Array.from({ length: 12 }, (_, i) => `<path d="${ARCH(i * 170 + 20, hz, 110, 130)}" fill="#8A6A4A" ${OL(3)}/>`).join('');
  for (const x of [120, 400, 1520, 1800]) s += `<path d="M${x} ${hz + 20} Q${x - 70} ${hz - 260} ${x} ${hz - 470} Q${x + 70} ${hz - 260} ${x} ${hz + 20}Z" fill="#2E5A3A" ${OL(4)}/>`;
  s += ground(hz, '#6A9A4A');
  s += `<path d="M560 ${hz + 60} L1360 ${hz + 60} L1460 ${hz + 220} L460 ${hz + 220}Z" fill="#4AA8C8" ${OL(4)}/><rect x="920" y="${hz - 40}" width="80" height="120" fill="#E9E2D2" ${OL(4)}/><path d="M960 ${hz - 40} q-60 -80 -120 40 M960 ${hz - 40} q60 -80 120 40" stroke="#BFEFFF" stroke-width="10" fill="none"/>`;
  const r = R(12); for (let i = 0; i < 40; i++) { const x = r() * 1920, y = hz + 240 + r() * 300; s += `<circle cx="${x}" cy="${y}" r="${10 + r() * 10}" fill="${['#E2506A', '#F2C94A', '#F2F0EA', '#C94AA8'][i % 4]}" ${OL(2.5)}/>`; }
  return s;
}

// ---------- props ----------
export const Q = {
  book: (c = '#8E2A24', open = false) => open ? `<g><path d="M-80 0 Q-40 -16 0 0 Q40 -16 80 0 L80 -100 Q40 -116 0 -100 Q-40 -116 -80 -100Z" fill="#F2EADA" ${OL(4)}/><path d="M0 0 V-100" ${OL(3)}/>` + [0, 1, 2, 3].map(i => `<path d="M-66 ${-80 + i * 18} H-14 M14 ${-80 + i * 18} H66" stroke="#8A7A6A" stroke-width="3"/>`).join('') + `</g>` : `<g><rect x="-50" y="-70" width="100" height="70" rx="6" fill="${c}" ${OL(4)}/><rect x="-42" y="-62" width="84" height="8" fill="#E2B43C"/></g>`,
  books: (x, y, s = 1, n = 5) => `<g transform="translate(${x} ${y}) scale(${s})">` + Array.from({ length: n }, (_, i) => `<rect x="${-90 + (i % 2) * 14}" y="${-i * 34 - 34}" width="180" height="32" rx="5" fill="${['#8E2A24', '#2E4A6A', '#4A6A3A', '#8A6A3A', '#5A3A5A'][i % 5]}" ${OL(3.5)}/>`).join('') + `</g>`,
  dagger: (rot = -30) => `<g transform="rotate(${rot})"><rect x="-9" y="-6" width="18" height="52" rx="6" fill="#3A2418" ${OL(3)}/><rect x="-30" y="-14" width="60" height="12" rx="4" fill="#C9A24A" ${OL(3)}/><path d="M-10 -14 Q-12 -80 0 -120 Q12 -80 10 -14Z" fill="#DDE4EA" ${OL(3)}/></g>`,
  daggerFloor: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="70" ry="12" fill="#000" opacity=".25"/><g transform="rotate(8)"><path d="M-10 0 Q-12 -60 -8 -90 L8 -90 Q12 -60 10 0Z" fill="#DDE4EA" ${OL(3)}/><rect x="-34" y="-104" width="68" height="14" rx="4" fill="#C9A24A" ${OL(3)}/><rect x="-10" y="-170" width="20" height="66" rx="6" fill="#3A2418" ${OL(3)}/></g><g transform="translate(60 -40) rotate(-12)"><rect x="-50" y="-34" width="100" height="68" fill="#F2EADA" ${OL(3)}/><path d="M-36 -16 H36 M-36 0 H30 M-36 16 H20" stroke="#5A4A3A" stroke-width="4"/></g></g>`,
  petition: () => `<g transform="rotate(-10)"><rect x="-40" y="-56" width="80" height="100" fill="#F2EADA" ${OL(3)}/><path d="M-28 -36 H28 M-28 -18 H24 M-28 0 H28 M-28 18 H16" stroke="#7A6A5A" stroke-width="3"/></g>`,
  litter: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-420" y="-260" width="840" height="20" rx="8" fill="#5A3A22" ${OL(4)}/><rect x="-200" y="-460" width="400" height="230" rx="16" fill="#8E2A24" ${OL(5)}/><path d="M-220 -460 Q0 -560 220 -460Z" fill="#E2B43C" ${OL(4)}/><rect x="-140" y="-420" width="280" height="150" rx="10" fill="#3A1E1A"/></g>`,
  astrolabe: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="90" fill="#C9A24A" ${OL(5)}/><circle r="70" fill="none" stroke="#8A6A2A" stroke-width="5"/><path d="M-70 0 H70 M0 -70 V70" stroke="#8A6A2A" stroke-width="4"/><path d="M-50 -40 L60 30" stroke="${INK}" stroke-width="6"/><circle r="10" fill="#8A6A2A"/><rect x="-14" y="-118" width="28" height="30" rx="8" fill="#C9A24A" ${OL(4)}/></g>`,
  spindle: () => `<g><path d="M0 -90 V60" stroke="#7A5A3A" stroke-width="8"/><ellipse cx="0" cy="40" rx="26" ry="10" fill="#8A6A3A" ${OL(3)}/><ellipse cx="0" cy="-30" rx="22" ry="30" fill="#E9E2D2" ${OL(3)}/></g>`,
  cup: () => `<g><path d="M-26 -50 L26 -50 L18 0 L-18 0Z" fill="#C9A24A" ${OL(3)}/><rect x="-6" y="0" width="12" height="20" fill="#C9A24A" ${OL(3)}/><ellipse cx="0" cy="22" rx="22" ry="6" fill="#C9A24A" ${OL(3)}/></g>`,
  cistern: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-20" rx="240" ry="50" fill="#3A6A8A" ${OL(5)}/><path d="M-240 -20 V60 Q0 120 240 60 V-20" fill="#8A7A6A" ${OL(5)}/><ellipse cx="0" cy="-20" rx="200" ry="36" fill="#4A8AAA"/></g>`,
  grain: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + [[-90, 0], [0, -10], [90, 0], [-45, -90], [45, -95]].map(([a, b]) => `<path d="M${a - 50} ${b} Q${a - 60} ${b - 90} ${a} ${b - 100} Q${a + 60} ${b - 90} ${a + 50} ${b}Z" fill="#C9A86A" ${OL(4)}/><path d="M${a - 20} ${b - 92} Q${a} ${b - 80} ${a + 20} ${b - 92}" stroke="#8A6A3A" stroke-width="5" fill="none"/>`).join('') + `</g>`,
  fire: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0 Q-150 -120 -60 -200 Q-50 -120 0 -110 Q-20 -220 60 -300 Q70 -170 120 -140 Q160 -70 120 0Z" fill="#F08A2A" ${OL(4)}/><path d="M-60 0 Q-70 -70 -20 -110 Q0 -60 30 -60 Q40 -130 80 -160 Q90 -70 70 0Z" fill="#FFD24A"/></g>`,
  oath: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-240" y="-300" width="480" height="600" fill="#F2E8D0" ${OL(5)}/><path d="M-180 -200 H180 M-180 -140 H160 M-180 -80 H180 M-180 -20 H120 M-180 40 H170 M-180 100 H140" stroke="#6A5A4A" stroke-width="6"/><circle cx="130" cy="210" r="46" fill="#2E6A4A" ${OL(4)}/><path d="M110 210 h40 M130 190 v40" stroke="#E2B43C" stroke-width="6"/></g>`,
  draft: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-5)"><rect x="-330" y="-170" width="660" height="340" rx="8" fill="#F2E8D0" ${OL(5)}/><rect x="-305" y="-145" width="610" height="290" fill="none" stroke="#C9A24A" stroke-width="6"/><text x="0" y="-40" text-anchor="middle" font-family="Playfair" font-weight="700" font-size="74" fill="#3A2A1E">3,000</text><text x="0" y="34" text-anchor="middle" font-family="Playfair" font-weight="700" font-size="46" fill="#3A2A1E">GOLD DINARS</text><path d="M-200 100 Q-140 70 -80 100 T40 96" stroke="#3A2A1E" stroke-width="5" fill="none"/><circle cx="220" cy="90" r="40" fill="#A8282A" ${OL(4)}/></g>`,
  coinsGold: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + [[-60, 0], [0, -10], [60, 4], [-30, -30], [30, -34], [0, -56]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="46" ry="16" fill="#E2B43C" ${OL(3.5)}/>`).join('') + `</g>`,
  crowd: (y, n = 12, c = '#1A1418', seed = 3) => { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * 1920, h = 240 + r() * 120; s += `<ellipse cx="${x}" cy="${y - h}" rx="34" ry="30" fill="${c}"/><path d="M${x - 70} ${y} Q${x - 70} ${y - h + 40} ${x} ${y - h + 30} Q${x + 70} ${y - h + 40} ${x + 70} ${y}Z" fill="${c}"/>`; } return s; },
};
