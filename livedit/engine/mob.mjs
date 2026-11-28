// Lived It kit: Sicily 1900s, the New York mob 1906-1946, exile in Havana / Naples (1946-1962). Own drawings, same flat style as bgs.mjs.
import { INK, shade } from './chars.mjs';
import { sky, skyline, sea } from './bgs.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };

// ---------- Sicily ----------
function house(x, y, w, h, c, roof = '#B0563A', lit = false) {
  let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}" ${OL(4)}/>`;
  s += `<path d="M${x - 12} ${y - h} L${x + w / 2} ${y - h - w * 0.28} L${x + w + 12} ${y - h}Z" fill="${roof}" ${OL(4)}/>`;
  s += `<rect x="${x + w * 0.38}" y="${y - h * 0.55}" width="${w * 0.24}" height="${h * 0.55}" fill="${shade(c, -0.45)}" ${OL(3)}/>`;
  if (w > 110) s += `<rect x="${x + w * 0.1}" y="${y - h * 0.8}" width="${w * 0.16}" height="${h * 0.2}" fill="${lit ? '#F4C76A' : shade(c, -0.5)}" ${OL(3)}/><rect x="${x + w * 0.74}" y="${y - h * 0.8}" width="${w * 0.16}" height="${h * 0.2}" fill="${lit ? '#F4C76A' : shade(c, -0.5)}" ${OL(3)}/>`;
  return s;
}
export function sicily(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 760, r = R(o.seed || 9);
  const lit = mode === 'night' || mode === 'dusk';
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: o.clouds ?? true });
  const far = mode === 'night' ? '#2A3046' : mode === 'dusk' ? '#7A5A5E' : '#B89A6A';
  s += `<path d="M0 ${hz - 260} Q300 ${hz - 420} 640 ${hz - 300} T1300 ${hz - 340} T1920 ${hz - 280} V1080 H0Z" fill="${far}"/>`;
  // sulfur heaps far right
  if (o.sulfur !== false) s += `<path d="M1340 ${hz - 200} L1480 ${hz - 330} L1620 ${hz - 200}Z M1560 ${hz - 200} L1700 ${hz - 300} L1860 ${hz - 200}Z" fill="${mode === 'night' ? '#6A6A3A' : '#D8C24A'}" ${OL(4)}/>`;
  s += `<path d="M0 ${hz - 120} Q480 ${hz - 300} 960 ${hz - 210} T1920 ${hz - 150} V1080 H0Z" fill="${mode === 'night' ? '#3A3A40' : '#C9A774'}" ${OL(4)}/>`;
  // church on the hill
  const cx = o.church ?? 760, cy = hz - 200;
  s += `<rect x="${cx - 40}" y="${cy - 260}" width="80" height="260" fill="#E2D2B0" ${OL(4)}/><path d="M${cx - 52} ${cy - 260} L${cx} ${cy - 330} L${cx + 52} ${cy - 260}Z" fill="#B0563A" ${OL(4)}/><rect x="${cx - 16}" y="${cy - 230}" width="32" height="44" fill="#3A2A22" ${OL(3)}/>`;
  s += `<rect x="${cx + 40}" y="${cy - 140}" width="220" height="140" fill="#D8C6A0" ${OL(4)}/><path d="M${cx + 30} ${cy - 140} L${cx + 150} ${cy - 200} L${cx + 270} ${cy - 140}Z" fill="#B0563A" ${OL(4)}/>`;
  // houses stepping down
  let x = -30; const cols = ['#E2CFA8', '#D8B88A', '#E9DCC0', '#CFAF84', '#E6C9A0'];
  while (x < 1960) { const w = 130 + r() * 110, h = 150 + r() * 120, yy = hz - 30 + r() * 30; s += house(x, yy, w, h, cols[Math.floor(r() * 5)], ['#B0563A', '#9A4A30', '#C0643E'][Math.floor(r() * 3)], lit && r() < 0.5); x += w + 6; }
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${mode === 'night' ? '#4A4440' : '#B89A70'}"/>`;
  for (let i = 0; i < 90; i++) s += `<rect x="${r() * 1920}" y="${hz + 20 + r() * (1060 - hz)}" width="${30 + r() * 30}" height="14" rx="6" fill="${shade(mode === 'night' ? '#4A4440' : '#B89A70', -0.12)}" opacity=".7"/>`;
  return s;
}
export function mine(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 800;
  let s = sky(mode, { sun: o.sun, clouds: true });
  s += `<path d="M-50 ${hz} L-50 260 Q400 120 900 240 Q1400 160 1980 300 L1980 ${hz}Z" fill="#B8955E" ${OL(5)}/>`;
  s += `<path d="M700 ${hz} L700 460 Q900 300 1100 460 L1100 ${hz}Z" fill="#1A1410" ${OL(6)}/><path d="M680 ${hz} L680 450 Q900 270 1120 450 L1120 ${hz}" fill="none" stroke="#6A4A2A" stroke-width="30"/>`;
  s += [0, 1, 2, 3, 4].map(i => `<path d="M${200 + i * 360} ${hz - 10} l60 -70 l70 70Z" fill="#E2CC4A" ${OL(4)}/>`).join('');
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="#9A7A4E"/><path d="M820 ${hz} L560 1080 M980 ${hz} L1240 1080" stroke="#4A3424" stroke-width="12"/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${760 - i * 34}" y="${hz + 12 + i * 34}" width="${280 + i * 68}" height="12" fill="#5A3E26"/>`).join('');
  return s;
}
// ---------- ships ----------
export function liner(x, y, s = 1, o = {}) {
  const hull = o.hull || '#1E1E26', funnels = o.funnels ?? 2;
  let g = `<g transform="translate(${x} ${y}) scale(${s})${o.rot ? ` rotate(${o.rot})` : ''}">`;
  g += `<path d="M-620 -110 L620 -110 L560 40 L-540 40 Q-610 0 -620 -110Z" fill="${hull}" ${OL(6)}/><rect x="-600" y="-110" width="1200" height="18" fill="#C9342A"/>`;
  g += Array.from({ length: 16 }, (_, i) => `<circle cx="${-500 + i * 64}" cy="-60" r="10" fill="#F4D58A" ${OL(2)}/>`).join('');
  g += `<rect x="-420" y="-200" width="840" height="90" fill="#F2EEE4" ${OL(5)}/><rect x="-300" y="-270" width="560" height="70" fill="#F2EEE4" ${OL(5)}/>`;
  g += Array.from({ length: 12 }, (_, i) => `<rect x="${-390 + i * 68}" y="-180" width="36" height="26" fill="#3A4E66"/>`).join('');
  for (let i = 0; i < funnels; i++) { const fx = -160 + i * (funnels > 2 ? 150 : 260); g += `<path d="M${fx - 40} -270 L${fx - 30} -420 L${fx + 50} -420 L${fx + 60} -270Z" fill="${o.funnel || '#C9542A'}" ${OL(5)}/><rect x="${fx - 30}" y="-420" width="80" height="34" fill="#1E1E26"/>`; }
  g += `<path d="M-600 -110 L-640 -300 M600 -110 L620 -330" stroke="${INK}" stroke-width="6"/><path d="M-640 -300 L620 -330" stroke="${INK}" stroke-width="2"/>`;
  return g + '</g>';
}
export function harbor(o = {}) { // New York harbour with the statue
  const mode = o.mode || 'dawn', hz = o.horizon ?? 640;
  let s = sea({ mode, horizon: hz, sun: o.sun, clouds: true, city: o.city ?? true });
  if (o.statue !== false) s += liberty(o.statue ?? 380, hz + 10, o.statueS ?? 0.9);
  return s;
}
export function liberty(x, y, s = 1) { // generic silhouette of the harbour statue (public-domain monument)
  const c = '#5E9A8A';
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 L-90 -130 L90 -130 L110 0Z" fill="#8A8A80" ${OL(4)}/><path d="M-70 -130 L-60 -230 L60 -230 L70 -130Z" fill="#9A9A90" ${OL(4)}/>
  <path d="M-40 -230 Q-50 -380 -24 -440 L24 -440 Q50 -380 40 -230Z" fill="${c}" ${OL(4)}/><circle cx="0" cy="-460" r="22" fill="${c}" ${OL(4)}/>
  <path d="M-22 -478 l-16 -26 M-8 -482 l-6 -30 M8 -482 l6 -30 M22 -478 l16 -26" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
  <path d="M18 -420 L46 -540" stroke="${c}" stroke-width="16" stroke-linecap="round"/><path d="M34 -548 l24 0 l-4 -16 l-16 0Z" fill="${c}" ${OL(3)}/><path d="M46 -564 q-12 -20 0 -34 q12 14 0 34Z" fill="#F4C76A" ${OL(3)}/>
  <rect x="-44" y="-390" width="22" height="40" fill="${shade(c, -0.15)}" ${OL(3)}/></g>`;
}
// ---------- props ----------
export const M = {
  dice: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + [[-60, 0, -12, [0, 4]], [60, -10, 14, [1, 2, 3]]].map(([dx, dy, rot, pips]) => `<g transform="translate(${dx} ${dy}) rotate(${rot})"><rect x="-50" y="-50" width="100" height="100" rx="16" fill="#F6F0E0" ${OL(5)}/>${(pips.length === 2 ? [[-22, -22], [22, 22]] : [[-24, -24], [0, 0], [24, 24]]).map(([px, py]) => `<circle cx="${px}" cy="${py}" r="10" fill="${INK}"/>`).join('')}</g>`).join('') + '</g>',
  cards: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + [-30, -12, 6, 24].map((a, i) => `<g transform="rotate(${a}) translate(0 -60)"><rect x="-44" y="-64" width="88" height="128" rx="10" fill="#F6F0E0" ${OL(4)}/><text x="-26" y="-30" font-family="Oswald" font-size="30" fill="${i % 2 ? '#B8282A' : INK}">${['A', 'K', 'Q', 'J'][i]}</text><path d="M0 10 l14 -18 q14 -18 -0 -30 q-14 12 -14 0 q-14 12 0 30Z" fill="${i % 2 ? '#B8282A' : INK}" transform="translate(0 20)"/></g>`).join('') + '</g>',
  badge: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -90 L26 -40 L84 -34 L42 6 L54 64 L0 36 L-54 64 L-42 6 L-84 -34 L-26 -40Z" fill="#D8B24A" ${OL(5)}/><circle r="26" fill="#B8902E" ${OL(3)}/></g>`,
  wine: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-24 -110 Q-30 -60 0 -50 Q30 -60 24 -110Z" fill="#8E2430" ${OL(4)}/><path d="M0 -50 V0 M-24 0 H24" stroke="${INK}" stroke-width="6"/></g>`,
  plate: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="80" ry="22" fill="#F2EEE4" ${OL(4)}/><ellipse rx="44" ry="10" fill="#C9642A"/></g>`,
  chandelier: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -400 V-60" stroke="#8A6A2A" stroke-width="6"/><path d="M-160 0 Q0 60 160 0 Q0 -40 -160 0Z" fill="#D8B24A" ${OL(4)}/>` + [-140, -70, 0, 70, 140].map(cx => `<rect x="${cx - 6}" y="-40" width="12" height="40" fill="#F6F0E0" ${OL(2)}/><path d="M${cx} -56 q-8 -12 0 -22 q8 10 0 22Z" fill="#FFD27A"/><path d="M${cx} 10 l-10 40 l20 0Z" fill="#EAF2FF" opacity=".8" ${OL(2)}/>`).join('') + '</g>',
  suitcase: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-110" y="-150" width="220" height="150" rx="14" fill="#7A4A2A" ${OL(5)}/><path d="M-40 -150 Q-40 -190 0 -190 Q40 -190 40 -150" fill="none" stroke="${INK}" stroke-width="10"/><path d="M-110 -100 H110" stroke="#5A3420" stroke-width="10"/></g>`,
  plane: (x, y, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M-560 -40 Q-600 0 -540 30 L460 30 Q560 20 600 -10 Q560 -60 460 -60 L-500 -60Z" fill="#E9E6DE" ${OL(6)}/><rect x="-500" y="-30" width="1000" height="14" fill="#2A4A7A"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${-400 + i * 60}" cy="-38" r="9" fill="#3A4E66"/>`).join('') + `<path d="M-480 -60 L-560 -220 L-500 -220 L-400 -60Z" fill="#E9E6DE" ${OL(5)}/><path d="M-120 0 L-320 170 L-220 170 L60 0Z" fill="#D8D4CC" ${OL(5)}/>` + [-170, -40].map(ex => `<rect x="${ex - 40}" y="40" width="90" height="50" rx="20" fill="#B8B4AC" ${OL(4)}/><path d="M${ex + 56} 30 v70" stroke="${INK}" stroke-width="6"/>`).join('') + `<path d="M520 -46 Q560 -44 584 -20" stroke="#3A4E66" stroke-width="12" fill="none"/></g>`,
  coffinFlag: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-300 0 L-260 -110 L260 -110 L300 0Z" fill="#5A3420" ${OL(5)}/><rect x="-300" y="0" width="600" height="60" fill="#4A2A18" ${OL(5)}/>` + [-150, 0, 150].map(fx => `<circle cx="${fx}" cy="-120" r="26" fill="#E9E2D2" ${OL(3)}/>`).join('') + '</g>',
};
// ---------- places ----------
export function shore(o = {}) { // grey dawn beach, Staten Island 1929
  const hz = o.horizon ?? 600; let s = sea({ mode: o.mode || 'dawn', horizon: hz, clouds: true });
  s += `<path d="M0 ${hz + 160} Q700 ${hz + 90} 1920 ${hz + 200} V1080 H0Z" fill="#C9B494" ${OL(4)}/><path d="M0 ${hz + 180} Q700 ${hz + 110} 1920 ${hz + 220}" stroke="#F2EEE4" stroke-width="8" fill="none" opacity=".7"/>`;
  const r = R(5); for (let i = 0; i < 40; i++) s += `<path d="M${r() * 1920} ${hz + 260 + r() * 400} l14 -40 l14 40" stroke="#7A8A4A" stroke-width="5" fill="none"/>`;
  return s;
}
export function prisonYard(o = {}) { // Clinton prison, Dannemora: high stone wall in snow
  const mode = o.mode || 'snow', hz = o.horizon ?? 820;
  let s = sky(mode, { clouds: true });
  s += `<path d="M0 ${hz - 420} Q500 ${hz - 520} 1000 ${hz - 440} T1920 ${hz - 460} V${hz} H0Z" fill="#5A6A6E"/>`;
  s += `<rect y="${hz - 380}" width="1920" height="380" fill="#8A847A" ${OL(5)}/>` + Array.from({ length: 13 }, (_, i) => `<path d="M${i * 160} ${hz - 380} V${hz}" stroke="#6A645A" stroke-width="4"/>`).join('') + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${hz - 320 + i * 60} H1920" stroke="#6A645A" stroke-width="3"/>`).join('');
  s += [300, 1600].map(tx => `<rect x="${tx - 60}" y="${hz - 620}" width="120" height="260" fill="#7A746A" ${OL(5)}/><path d="M${tx - 90} ${hz - 620} L${tx} ${hz - 700} L${tx + 90} ${hz - 620}Z" fill="#4A4440" ${OL(5)}/><rect x="${tx - 34}" y="${hz - 590}" width="68" height="50" fill="#F4D58A" ${OL(3)}/>`).join('');
  s += `<rect y="${hz - 392}" width="1920" height="16" fill="#F2F4F8"/><rect y="${hz}" width="1920" height="${1080 - hz}" fill="#E8ECF2"/>`;
  return s;
}
export function havana(o = {}) { // seafront hotel with two towers and palms, 1946
  const mode = o.mode || 'dusk', hz = o.horizon ?? 760;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<rect x="0" y="${hz - 60}" width="1920" height="60" fill="${mode === 'night' ? '#14304A' : '#4A7AA0'}"/>`;
  const c = '#E8D8B8', x0 = 560;
  s += `<rect x="${x0}" y="${hz - 360}" width="800" height="300" fill="${c}" ${OL(5)}/>` + [x0 + 140, x0 + 600].map(tx => `<rect x="${tx - 60}" y="${hz - 560}" width="120" height="200" fill="${c}" ${OL(5)}/><path d="M${tx - 70} ${hz - 560} L${tx} ${hz - 640} L${tx + 70} ${hz - 560}Z" fill="#B0563A" ${OL(4)}/>`).join('');
  for (let yy = hz - 330; yy < hz - 90; yy += 60) for (let xx = x0 + 30; xx < x0 + 780; xx += 70) s += `<rect x="${xx}" y="${yy}" width="34" height="38" fill="${mode === 'day' ? '#3A4E66' : '#F4C76A'}" ${OL(3)}/>`;
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="#8A7A64"/><rect y="${hz}" width="1920" height="22" fill="#C9B8A0" ${OL(3)}/>`;
  return s;
}
export function naples(o = {}) { // the bay with the volcano, pastel houses
  const mode = o.mode || 'day', hz = o.horizon ?? 640, r = R(12);
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<path d="M900 ${hz} L1260 ${hz - 330} L1340 ${hz - 320} L1420 ${hz - 360} L1840 ${hz}Z" fill="${mode === 'night' ? '#2A3046' : '#7A7E9A'}" ${OL(4)}/><path d="M1260 ${hz - 330} q40 -60 80 -40 q40 -60 80 0" stroke="#E9E6DE" stroke-width="10" fill="none" opacity=".6"/>`;
  s += `<rect y="${hz}" width="1920" height="140" fill="${mode === 'night' ? '#14304A' : '#3A8AB0'}"/>`;
  let x = -20; const cols = ['#E9B87A', '#E2A0A0', '#F2E2B8', '#C9D8B0', '#E8C8A0', '#D8A878'];
  while (x < 1960) { const w = 120 + r() * 120, h = 160 + r() * 200; s += `<rect x="${x}" y="${hz + 140 + 260 - h}" width="${w}" height="${h + 400}" fill="${cols[Math.floor(r() * 6)]}" ${OL(4)}/>` + Array.from({ length: Math.floor(h / 70) }, (_, k) => `<rect x="${x + 20}" y="${hz + 140 + 260 - h + 20 + k * 70}" width="${w - 40}" height="34" fill="${mode === 'night' && r() < 0.5 ? '#F4C76A' : '#4A5A6A'}" opacity=".85"/>`).join(''); x += w + 4; }
  s += `<rect y="${hz + 400}" width="1920" height="${1080 - hz - 400}" fill="#6A6460" ${OL(4)}/>`;
  return s;
}
export function airport(o = {}) { // small 1960s terminal and apron
  const mode = o.mode || 'day', hz = o.horizon ?? 700;
  let s = sky(mode, { sun: o.sun, clouds: true });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="#8A8C8E"/><path d="M0 ${hz + 160} H1920" stroke="#F2E27A" stroke-width="8" stroke-dasharray="60 40"/>`;
  s += `<rect x="1200" y="${hz - 220}" width="680" height="220" fill="#E8E2D4" ${OL(5)}/><rect x="1200" y="${hz - 150}" width="680" height="70" fill="#5A7A9A" ${OL(3)}/><rect x="1300" y="${hz - 420}" width="90" height="200" fill="#E8E2D4" ${OL(5)}/><rect x="1270" y="${hz - 480}" width="150" height="60" fill="#5A7A9A" ${OL(5)}/>`;
  return s;
}
export function terminal(o = {}) { // inside the terminal: big windows on the apron
  const hz = o.horizon ?? 800;
  let s = `<rect width="1920" height="${hz}" fill="#D8D0C0"/>`;
  s += `<rect x="80" y="120" width="1760" height="${hz - 300}" fill="#8FB2D0" ${OL(5)}/>` + `<g transform="translate(80 120) scale(0.9167 ${(hz - 300) / 1080})">${sky('day', { clouds: true })}<rect y="760" width="1920" height="320" fill="#8A8C8E"/></g>` + Array.from({ length: 7 }, (_, i) => `<rect x="${80 + i * 293 - 8}" y="110" width="16" height="${hz - 280}" fill="#5A5450"/>`).join('');
  s += `<rect y="${hz - 180}" width="1920" height="180" fill="#B8AE9C"/><rect y="${hz}" width="1920" height="${1080 - hz}" fill="#7A6E60"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 180} ${hz} L${i * 260 - 600} 1080" stroke="#6A5E50" stroke-width="4"/>`).join('');
  return s;
}
export function cemetery(o = {}) {
  const mode = o.mode || 'snow', hz = o.horizon ?? 760, r = R(21);
  let s = sky(mode, { clouds: true }) + skyline(mode === 'snow' ? 'day' : mode, { y: hz - 40, tall: 160, color: '#9AA4B0' });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${mode === 'snow' ? '#E8ECF2' : '#6A7A4A'}"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) { const x = 100 + i * 220 + row * 60 + r() * 30, y = hz + 40 + row * 90, sc = 0.5 + row * 0.25; s += `<path d="M${x - 40 * sc} ${y} V${y - 90 * sc} Q${x} ${y - 140 * sc} ${x + 40 * sc} ${y - 90 * sc} V${y}Z" fill="#A8A49C" ${OL(3)}/>`; }
  return s;
}
