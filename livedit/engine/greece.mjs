// Ancient Greece / Persia kit for Lived It.
import { INK, shade } from './chars.mjs';
import { sky } from './bgs.mjs';
import { mountains } from './japan.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
export function sparta(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 800;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true }) + mountains(mode, hz - 80, { snowcaps: true });
  const r = R(o.seed || 5);
  for (let i = 0; i < 7; i++) { const x = i * 290 - 30 + r() * 40, w = 240, h = 150 + r() * 50, y = hz; s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="#C9B08A" ${OL()}/><path d="M${x - 20} ${y - h} L${x + w / 2} ${y - h - 70} L${x + w + 20} ${y - h}Z" fill="#A8503A" ${OL()}/><rect x="${x + 90}" y="${y - 90}" width="60" height="90" fill="#5A3E26" ${OL(4)}/>`; }
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${o.ground || '#A89A62'}"/>`;
  return s;
}
export function river(o = {}) {
  const mode = o.mode || 'dawn', hz = o.horizon ?? 640;
  let s = sky(mode, { sun: o.sun, clouds: true }) + mountains(mode, hz);
  s += `<rect y="${hz + 60}" width="1920" height="${1080 - hz}" fill="#6A7A42"/><path d="M0 ${hz + 200} Q600 ${hz + 140} 1100 ${hz + 230} T1920 ${hz + 190} V${hz + 360} Q1300 ${hz + 420} 800 ${hz + 340} T0 ${hz + 380}Z" fill="${mode === 'night' ? '#1E3048' : '#4A8AAA'}" ${OL(4)}/>`;
  const r = R(3); for (let i = 0; i < 90; i++) { const x = r() * 1920, y = hz + 300 + r() * 400; s += `<path d="M${x} ${y} q${-6 + r() * 12} -90 ${-10 + r() * 20} -${140 + r() * 80}" stroke="${['#7A8A42', '#5A6A32', '#9AA04A'][i % 3]}" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
  return s;
}
export function hall(o = {}) {
  const hz = o.horizon ?? 700;
  let s = `<rect width="1920" height="${hz}" fill="#6A4A34"/>`;
  for (let x = 0; x < 1920; x += 240) s += `<rect x="${x}" y="0" width="60" height="${hz}" fill="#5A3A26" ${OL(4)}/>`;
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#5A4632"/>`;
  return s;
}
export function palace(o = {}) {
  const hz = o.horizon ?? 760;
  let s = `<rect width="1920" height="${hz}" fill="#3A2A4A"/>`;
  for (let x = 80; x < 1920; x += 300) s += `<rect x="${x}" y="80" width="90" height="${hz - 80}" fill="#C9B48A" ${OL(4)}/><path d="M${x - 30} 80 h150 v40 h-150z" fill="#E2B43C" ${OL(4)}/><path d="M${x - 10} 140 q55 -40 110 0" stroke="#8A6A3A" stroke-width="8" fill="none"/>`;
  s += `<rect y="0" width="1920" height="80" fill="#5A2A6A" ${OL(4)}/>` + Array.from({ length: 20 }, (_, i) => `<path d="M${i * 100} 40 l20 -20 l20 20 l-20 20z" fill="#E2B43C"/>`).join('');
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="#8A6A4A"/><path d="M760 ${hz} L1160 ${hz} L1360 1080 L560 1080Z" fill="#8E2A24"/>`;
  return s;
}
export function pass(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 640;
  const deep = { day: '#2E7DA6', dawn: '#6A86A6', dusk: '#5A4A6E', night: '#10243C', storm: '#2A3A48' }[mode];
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${deep}"/>`;
  s += `<path d="M0 0 L620 0 L760 260 L700 520 L820 780 L760 1080 L0 1080Z" fill="#7A6A5A" ${OL()}/><path d="M0 0 L420 0 L520 300 L460 620 L560 1080 L0 1080Z" fill="#5A4E44"/>`;
  s += `<path d="M640 1080 L860 ${hz + 120} L1920 ${hz + 160} L1920 1080Z" fill="#B89A6A" ${OL(4)}/>`;
  if (o.wall) s += `<path d="M700 ${hz + 260} L1500 ${hz + 300} L1500 ${hz + 360} L690 ${hz + 330}Z" fill="#9A8A72" ${OL(4)}/>`;
  return s;
}
export function army(y, n = 60, seed = 3, c = '#2E4A6A', tall = 1) {
  const r = R(seed); let s = '';
  for (let row = 0; row < 4; row++) for (let i = 0; i < n / 4; i++) { const x = (i / (n / 4)) * 2000 - 40 + r() * 30 + row * 20, yy = y - row * 40, h = (150 + r() * 30) * tall * (1 - row * 0.12); s += `<path d="M${x + 4} ${yy - h - 90} V${yy}" stroke="#4A3A2A" stroke-width="5"/><path d="M${x - 2} ${yy - h - 100} l6 -24 l6 24z" fill="#C9C4BC"/><ellipse cx="${x}" cy="${yy - h}" rx="${22 * tall}" ry="${26 * tall}" fill="${shade(c, -0.3 - row * 0.1)}"/><path d="M${x - 34 * tall} ${yy} Q${x - 34 * tall} ${yy - h + 30} ${x} ${yy - h + 20} Q${x + 34 * tall} ${yy - h + 30} ${x + 34 * tall} ${yy}Z" fill="${shade(c, -0.3 - row * 0.1)}"/>`; }
  return s;
}
export const G = {
  shield: (r = 110, c = '#C99A3A', mark = 'lambda') => `<g><circle r="${r}" fill="${c}" ${OL(6)}/><circle r="${r * 0.84}" fill="${shade(c, -0.1)}"/>${mark === 'lambda' ? `<path d="M${-r * 0.45} ${r * 0.45} L0 ${-r * 0.5} L${r * 0.45} ${r * 0.45}" stroke="#A8282A" stroke-width="${r * 0.16}" fill="none" stroke-linejoin="miter"/>` : ''}</g>`,
  spear: (len = 420) => `<g><rect x="-5" y="${-len}" width="10" height="${len * 1.3}" fill="#7A5A3A" ${OL(3)}/><path d="M-12 ${-len} L0 ${-len - 60} L12 ${-len}Z" fill="#C9C4BC" ${OL(3)}/></g>`,
  wicker: (r = 90) => `<g><rect x="${-r * 0.6}" y="${-r}" width="${r * 1.2}" height="${r * 2}" rx="${r * 0.4}" fill="#C9A86A" ${OL(4)}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${-r * 0.6} ${-r + i * r * 0.36} H${r * 0.6}" stroke="#8A6A3A" stroke-width="4"/>`).join('') + `</g>`,
  throne: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-200" y="-520" width="400" height="520" rx="20" fill="#E2B43C" ${OL()}/><rect x="-160" y="-480" width="320" height="300" rx="14" fill="#5A2A6A" ${OL(4)}/><rect x="-240" y="-200" width="480" height="60" fill="#C99A3A" ${OL(4)}/></g>`,
  well: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-120" rx="200" ry="50" fill="#1A1410" ${OL()}/><path d="M-200 -120 L-200 0 Q0 50 200 0 L200 -120 Q0 -70 -200 -120Z" fill="#8A7A6A" ${OL()}/></g>`,
  stone: (x, y, s = 1, lines = []) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-220 0 L-200 -420 L200 -420 L220 0Z" fill="#C9C2B4" ${OL()}/>` + lines.map((l, i) => `<text x="0" y="${-320 + i * 56}" text-anchor="middle" font-family="Playfair" font-weight="700" font-size="36" fill="#3A3630">${l}</text>`).join('') + `</g>`,
  table: (y = 860) => `<rect x="-20" y="${y}" width="1960" height="40" fill="#7A5A3A" ${OL()}/><rect x="-20" y="${y + 40}" width="1960" height="200" fill="#4A3424"/>`,
  bowl: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q0 60 60 0Z" fill="#8A5A3A" ${OL(4)}/><ellipse cx="0" cy="0" rx="60" ry="14" fill="#2A1410" ${OL(3)}/></g>`,
  torch: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="0" width="16" height="120" fill="#5A3A26" ${OL(3)}/><path d="M-26 0 Q-30 -60 0 -100 Q30 -60 26 0Z" fill="#F08A2A" ${OL(3)}/><path d="M-12 0 Q-12 -36 0 -58 Q12 -36 12 0Z" fill="#FFD24A"/></g>`,
  arrows: (n = 120, seed = 4) => { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * 2200 - 140, y = r() * 700; s += `<path d="M${x} ${y} l70 46" stroke="#1A1410" stroke-width="4"/><path d="M${x + 70} ${y + 46} l-14 -2 l6 -10z" fill="#1A1410"/>`; } return s; },
};
