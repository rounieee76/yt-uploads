// Wild West kit for Lived It.
import { INK, shade } from './chars.mjs';
import { sky } from './bgs.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
export function prairie(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 720;
  const g = { day: '#B8A45A', dusk: '#9A6A4A', night: '#2A3248', dawn: '#A8906A', snow: '#E2E6EC', storm: '#6A6A52' }[mode];
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: o.clouds ?? true });
  s += `<path d="M0 ${hz} Q400 ${hz - 60} 800 ${hz - 20} T1600 ${hz - 40} T1920 ${hz} V1080 H0Z" fill="${shade(g, -0.15)}"/>`;
  s += `<rect y="${hz + 30}" width="1920" height="${1080 - hz}" fill="${g}"/>`;
  const r = R(o.seed || 2); for (let i = 0; i < 40; i++) { const x = r() * 1920, y = hz + 60 + r() * (1000 - hz); s += `<path d="M${x} ${y} l6 -18 l6 18 l6 -12" stroke="${shade(g, -0.3)}" stroke-width="3" fill="none"/>`; }
  if (o.fence) for (let x = 0; x < 1920; x += 160) s += `<rect x="${x}" y="${hz + 20}" width="12" height="90" fill="#6A4A2E" ${OL(3)}/><path d="M${x} ${hz + 40} h160 M${x} ${hz + 75} h160" stroke="#6A4A2E" stroke-width="8"/>`;
  return s;
}
export function farmhouse(x, y, s = 1, lit = false) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-260" y="-260" width="520" height="260" fill="#A8845A" ${OL()}/>` + Array.from({ length: 10 }, (_, i) => `<path d="M-260 ${-240 + i * 26} H260" stroke="#7A5A3A" stroke-width="3"/>`).join('') + `<path d="M-300 -250 L0 -430 L300 -250Z" fill="#5A3A2A" ${OL()}/><rect x="-40" y="-150" width="90" height="150" fill="#5A3A26" ${OL(4)}/><rect x="-200" y="-200" width="100" height="90" fill="${lit ? '#F4C76A' : '#3A4A5E'}" ${OL(4)}/><rect x="110" y="-200" width="100" height="90" fill="${lit ? '#F4C76A' : '#3A4A5E'}" ${OL(4)}/><rect x="150" y="-470" width="50" height="120" fill="#7A5A4A" ${OL(4)}/><rect x="-300" y="-20" width="600" height="20" fill="#6A4A2E" ${OL(3)}/></g>`;
}
export function westTown(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 800;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true });
  const r = R(o.seed || 4); let x = -30; const cols = ['#A8845A', '#8A6A4A', '#B89A6A', '#7A5A44', '#9A7A5A'];
  const names = o.names || [];
  let k = 0;
  while (x < 1950) {
    const w = 300 + r() * 120, h = 330 + r() * 120, c = cols[k % cols.length];
    s += `<rect x="${x}" y="${hz - h}" width="${w}" height="${h}" fill="${c}" ${OL()}/>` + Array.from({ length: Math.floor(h / 28) }, (_, i) => `<path d="M${x} ${hz - h + 14 + i * 28} H${x + w}" stroke="${shade(c, -0.2)}" stroke-width="3"/>`).join('');
    s += `<rect x="${x + 10}" y="${hz - h - 60}" width="${w - 20}" height="70" fill="${shade(c, 0.1)}" ${OL(4)}/>`;
    if (names[k]) s += `<text x="${x + w / 2}" y="${hz - h - 12}" text-anchor="middle" font-family="Playfair" font-weight="900" font-size="40" fill="${INK}">${names[k]}</text>`;
    s += `<rect x="${x + 40}" y="${hz - 170}" width="${w * 0.35}" height="170" fill="#3A2A1E" ${OL(4)}/><rect x="${x + w * 0.5}" y="${hz - 190}" width="${w * 0.4}" height="110" fill="${mode === 'night' || mode === 'dusk' ? '#F4C76A' : '#4A5A6E'}" ${OL(4)}/>`;
    s += `<rect x="${x + 50}" y="${hz - h + 60}" width="80" height="90" fill="${mode === 'night' ? '#F4C76A' : '#4A5A6E'}" ${OL(4)}/><rect x="${x + w - 130}" y="${hz - h + 60}" width="80" height="90" fill="#4A5A6E" ${OL(4)}/>`;
    s += `<path d="M${x} ${hz - 210} L${x + w} ${hz - 210} L${x + w + 20} ${hz - 180} L${x - 20} ${hz - 180}Z" fill="${shade(c, -0.25)}" ${OL(4)}/>` + [0.1, 0.5, 0.9].map(f => `<rect x="${x + w * f - 6}" y="${hz - 182}" width="12" height="182" fill="#5A3A26"/>`).join('');
    x += w; k++;
  }
  s += `<rect y="${hz}" width="1920" height="40" fill="#7A5A3A" ${OL(4)}/><rect y="${hz + 40}" width="1920" height="${1040 - hz}" fill="${o.road || '#B8986A'}"/>`;
  const r2 = R(7); for (let i = 0; i < 30; i++) { const xx = r2() * 1920, yy = hz + 60 + r2() * (1000 - hz); s += `<ellipse cx="${xx}" cy="${yy}" rx="${20 + r2() * 30}" ry="6" fill="#9A7A52" opacity=".6"/>`; }
  return s;
}
export function locomotive(x, y, s = 1, flip = false) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><rect x="-300" y="-260" width="420" height="180" rx="40" fill="#2A2A2E" ${OL()}/><rect x="-300" y="-230" width="420" height="20" fill="#C9A24A"/><path d="M-260 -260 L-280 -400 L-170 -400 L-190 -260Z" fill="#2A2A2E" ${OL()}/><path d="M-300 -400 L-150 -400 L-170 -430 L-280 -430Z" fill="#2A2A2E" ${OL(4)}/><circle cx="-330" cy="-170" r="40" fill="#FFE8A8" ${OL(4)}/><rect x="120" y="-360" width="220" height="280" fill="#8E2A24" ${OL()}/><rect x="160" y="-320" width="140" height="90" fill="#F4C76A" ${OL(4)}/><path d="M100 -370 H360" stroke="${INK}" stroke-width="16"/><path d="M-380 -60 L-300 -120 L-300 -60Z" fill="#C9302A" ${OL(4)}/>` + [-220, -80, 60, 220].map(cx => `<circle cx="${cx}" cy="-60" r="${cx < 100 ? 70 : 50}" fill="#C9302A" ${OL(5)}/><circle cx="${cx}" cy="-60" r="18" fill="#2A2A2E"/>`).join('') + `<rect x="-300" y="-70" width="560" height="14" fill="#5A5A60"/></g>`;
}
export function railcar(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-320" y="-300" width="640" height="220" rx="16" fill="#6A3A2A" ${OL()}/><path d="M-340 -300 H340 L320 -330 H-320Z" fill="#3A2A22" ${OL(4)}/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-290 + i * 120}" y="-270" width="80" height="80" fill="#F4C76A" ${OL(4)}/>`).join('') + [-220, -120, 120, 220].map(cx => `<circle cx="${cx}" cy="-60" r="34" fill="#2A2A2E" ${OL(4)}/>`).join('') + `</g>`;
}
export function rails(y) { let s = `<rect y="${y}" width="1920" height="16" fill="#5A5A60"/><rect y="${y + 40}" width="1920" height="16" fill="#5A5A60"/>`; for (let x = 0; x < 1920; x += 60) s += `<rect x="${x}" y="${y - 6}" width="30" height="70" fill="#5A3A26"/>`; return s; }
export function horse(x, y, s = 1, c = '#7A4A2A', flip = false, o = {}) {
  const d = shade(c, -0.25), mane = o.mane || '#2A1A14';
  const leg = (lx, ang) => `<g transform="translate(${lx} -150) rotate(${ang})"><rect x="-16" y="0" width="32" height="150" rx="12" fill="${c}" ${OL(4)}/><rect x="-18" y="132" width="36" height="22" rx="6" fill="#2A1A14"/></g>`;
  const gal = o.gallop ? [-20, 25, 20, -25] : [0, 0, 0, 0];
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${leg(-130, gal[0])}${leg(110, gal[2])}<ellipse cx="-10" cy="-210" rx="200" ry="95" fill="${c}" ${OL()}/>${leg(-90, gal[1])}${leg(150, gal[3])}<path d="M140 -260 Q190 -330 220 -400 L270 -380 Q250 -310 210 -220Z" fill="${c}" ${OL()}/><path d="M220 -400 Q240 -440 300 -440 Q370 -430 380 -380 Q378 -350 340 -350 L270 -350Z" fill="${c}" ${OL()}/><circle cx="300" cy="-405" r="9" fill="${INK}"/><path d="M240 -430 l10 -40 l20 34Z" fill="${c}" ${OL(4)}/><path d="M150 -280 Q190 -380 230 -420" stroke="${mane}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-200 -240 Q-280 -200 -260 -100" stroke="${mane}" stroke-width="22" fill="none" stroke-linecap="round"/>${o.saddle ? `<path d="M-60 -300 Q0 -320 60 -300 L50 -250 L-50 -250Z" fill="#5A2E1E" ${OL(4)}/>` : ''}<ellipse cx="-20" cy="-170" rx="120" ry="30" fill="${d}" opacity=".35"/></g>`;
}
export const W = {
  grave: (x, y, s = 1, text = '') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-140 0 L-140 -260 Q0 -360 140 -260 L140 0Z" fill="#9A968E" ${OL()}/>${text}<rect x="-200" y="-10" width="400" height="30" fill="#5A6A3A"/></g>`,
  tellerCage: (y = 520) => `<rect x="-20" y="${y}" width="1960" height="${1080 - y}" fill="#6A4028" ${OL()}/>` + Array.from({ length: 40 }, (_, i) => `<rect x="${i * 50}" y="${y - 300}" width="6" height="300" fill="#C9A24A"/>`).join('') + `<rect x="-20" y="${y - 310}" width="1960" height="20" fill="#C9A24A" ${OL(3)}/>`,
  safe: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-140" y="-300" width="280" height="300" rx="14" fill="#3A3E46" ${OL()}/><circle cx="0" cy="-160" r="50" fill="#6A6E76" ${OL(4)}/><path d="M0 -200 V-120 M-40 -160 H40" stroke="${INK}" stroke-width="6"/><rect x="60" y="-200" width="20" height="80" rx="6" fill="#C9A24A"/></g>`,
  fire: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0 Q-140 -140 -40 -220 Q-60 -120 0 -110 Q-20 -220 60 -300 Q60 -170 120 -140 Q150 -60 120 0Z" fill="#F08A2A" ${OL(4)}/><path d="M-60 0 Q-70 -80 -10 -130 Q0 -60 40 -60 Q60 -20 50 0Z" fill="#FFD24A"/></g>`,
  pictureFrame: (x, y, s = 1, tilt = 0) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${tilt})"><rect x="-120" y="-90" width="240" height="180" fill="#C79A4A" ${OL(4)}/><rect x="-100" y="-70" width="200" height="140" fill="#F2EADA"/><path d="M-60 40 Q-20 -40 20 0 Q50 30 70 -20" stroke="#7A3A2A" stroke-width="6" fill="none"/><circle cx="-40" cy="-30" r="14" fill="#C9302A"/></g>`,
  telegraph: (x, y) => `<rect x="${x - 10}" y="${y - 500}" width="20" height="500" fill="#5A3A26" ${OL(3)}/><rect x="${x - 80}" y="${y - 480}" width="160" height="16" fill="#5A3A26"/>`,
  wantedPoster: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-3)"><rect x="-200" y="-280" width="400" height="560" fill="#E9D8A8" ${OL(5)}/><text x="0" y="-200" text-anchor="middle" font-family="Playfair" font-weight="900" font-size="72" fill="${INK}">WANTED</text><rect x="-130" y="-170" width="260" height="220" fill="#B89A6A" ${OL(3)}/><circle cx="0" cy="-80" r="60" fill="#8A6A4A"/><path d="M-110 50 Q0 -40 110 50Z" fill="#5A4030"/><text x="0" y="130" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="44" fill="${INK}">JESSE JAMES</text><text x="0" y="210" text-anchor="middle" font-family="Anton" font-size="70" fill="#8E2A24">$5,000</text></g>`,
};
