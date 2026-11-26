// Feudal Japan backgrounds & props for Lived It.
import { INK, shade } from './chars.mjs';
import { sky, MOOD } from './bgs.mjs';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const R = (seed) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
export function mountains(mode = 'day', y = 640, o = {}) {
  const far = { day: '#8FA6B8', dusk: '#7A5A7A', night: '#1E2A44', dawn: '#9A8AA6', storm: '#4A5260', snow: '#A8B4C4' }[mode];
  const near = shade(far, -0.22);
  let s = `<path d="M0 ${y} L180 ${y - 260} L360 ${y - 140} L620 ${y - 380} L820 ${y - 200} L1040 ${y - 330} L1300 ${y - 160} L1560 ${y - 360} L1760 ${y - 210} L1920 ${y - 290} L1920 1080 L0 1080Z" fill="${far}"/>`;
  s += `<path d="M560 ${y - 330} L620 ${y - 380} L680 ${y - 330} L650 ${y - 320} L620 ${y - 340} L590 ${y - 318}Z M1500 ${y - 310} L1560 ${y - 360} L1620 ${y - 310} L1590 ${y - 302} L1560 ${y - 322}Z" fill="#F2F0EA" opacity="${o.snowcaps === false ? 0 : 0.85}"/>`;
  s += `<path d="M0 ${y + 40} Q300 ${y - 120} 600 ${y + 10} T1200 ${y - 20} T1920 ${y + 20} V1080 H0Z" fill="${near}"/>`;
  return s;
}
export function mist(y, c = '#E9ECF0', op = 0.35) { return `<rect y="${y - 60}" width="1920" height="140" fill="${c}" opacity="${op}"/><rect y="${y - 20}" width="1920" height="60" fill="${c}" opacity="${op}"/>`; }
export function pine(x, y, s = 1, c = '#2E4A32') {
  let p = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 0 Q-30 -200 10 -320 Q40 -420 -20 -520" stroke="${INK}" stroke-width="54" fill="none" stroke-linecap="round"/><path d="M-22 0 Q-30 -200 10 -320 Q40 -420 -20 -520" stroke="#5A3A26" stroke-width="40" fill="none" stroke-linecap="round"/>`;
  for (const [px, py, w] of [[-160, -520, 300], [140, -420, 320], [-200, -330, 260], [180, -260, 240], [-40, -620, 260]]) p += `<path d="M${px - w / 2} ${py} Q${px} ${py - 80} ${px + w / 2} ${py} Q${px + w / 3} ${py + 30} ${px} ${py + 20} Q${px - w / 3} ${py + 30} ${px - w / 2} ${py}Z" fill="${c}" ${OL(4)}/><path d="M${px - w / 3} ${py - 10} Q${px} ${py - 55} ${px + w / 3} ${py - 10}" fill="none" stroke="${shade(c, 0.2)}" stroke-width="8" stroke-linecap="round"/>`;
  return p + '</g>';
}
export function templeIn(o = {}) {
  const hz = o.horizon ?? 760, wood = o.wood || '#6A4A30';
  let s = `<rect width="1920" height="${hz}" fill="${o.wall || '#D9C9A4'}"/>`;
  for (let x = 0; x < 1920; x += 320) { s += `<rect x="${x + 20}" y="80" width="280" height="${hz - 140}" fill="#F2EADA" ${OL(4)}/>`; for (let yy = 100; yy < hz - 70; yy += 70) s += `<path d="M${x + 20} ${yy} H${x + 300}" stroke="${wood}" stroke-width="5"/>`; for (let xx = x + 90; xx < x + 300; xx += 70) s += `<path d="M${xx} 80 V${hz - 60}" stroke="${wood}" stroke-width="5"/>`; }
  if (o.open) { const x = o.open; s += `<rect x="${x}" y="80" width="560" height="${hz - 140}" fill="#000"/><g transform="translate(${x} 80)"><svg width="560" height="${hz - 140}" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">${sky(o.mode || 'day', { sun: o.mode === 'dusk' ? [1300, 600] : null })}${mountains(o.mode || 'day', 760)}${pine(400, 1080, 1.3)}</svg></g>`; }
  for (let x = 0; x <= 1920; x += 320) s += `<rect x="${x - 14}" y="0" width="36" height="${hz}" fill="${wood}" ${OL(4)}/>`;
  s += `<rect y="0" width="1920" height="70" fill="${shade(wood, -0.15)}" ${OL(4)}/><rect y="${hz - 60}" width="1920" height="60" fill="${shade(wood, -0.1)}" ${OL(4)}/>`;
  s += `<path d="M-200 ${hz} L2120 ${hz} L2400 1080 L-480 1080Z" fill="${o.floor || '#C9B47A'}"/>`;
  for (let i = -6; i < 12; i++) s += `<path d="M${960 + i * 140} ${hz} L${960 + i * 260} 1080" stroke="#9A8452" stroke-width="5"/>`;
  s += `<path d="M0 ${hz + 120} H1920 M0 ${hz + 260} H1920" stroke="#9A8452" stroke-width="5"/>`;
  return s;
}
export function village(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 800;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true }) + mountains(mode, hz - 120) + (o.mist ? mist(hz - 140) : '');
  const r = R(o.seed || 3);
  for (let i = 0; i < 6; i++) { const x = i * 340 - 40 + r() * 60, w = 300, h = 160 + r() * 40, y = hz - 20; s += `<rect x="${x + 20}" y="${y - h}" width="${w - 40}" height="${h}" fill="#B89A6A" ${OL()}/><rect x="${x + 60}" y="${y - h + 40}" width="70" height="70" fill="${mode === 'night' || mode === 'dusk' ? '#F2C46A' : '#5A4632'}" ${OL(4)}/><path d="M${x - 30} ${y - h + 10} L${x + w / 2} ${y - h - 150} L${x + w + 30} ${y - h + 10}Z" fill="#9A8448" ${OL()}/><path d="M${x + 10} ${y - h - 10} L${x + w / 2} ${y - h - 140}" stroke="#7A6634" stroke-width="5"/>`; }
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${o.ground || '#8A7A52'}"/>`;
  return s;
}
export function kyoto(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 800;
  let s = sky(mode, { sun: o.sun, moon: o.moon, clouds: true }) + mountains(mode, hz - 260, { snowcaps: false });
  for (let i = 0; i < 6; i++) { const x = i * 330 - 20, h = 330; s += `<rect x="${x}" y="${hz - h}" width="320" height="${h}" fill="#5A3E2A" ${OL()}/>`; for (let k = 0; k < 9; k++) s += `<path d="M${x + 20 + k * 32} ${hz - h + 120} V${hz - 20}" stroke="#3A2618" stroke-width="6"/>`; s += `<path d="M${x - 30} ${hz - h + 20} L${x + 160} ${hz - h - 60} L${x + 350} ${hz - h + 20}Z" fill="#3A3E48" ${OL()}/><path d="M${x - 10} ${hz - h + 120} L${x + 330} ${hz - h + 120} L${x + 350} ${hz - h + 90} L${x - 30} ${hz - h + 90}Z" fill="#3A3E48" ${OL(4)}/>`; if (i % 2) s += `<rect x="${x + 120}" y="${hz - h + 140}" width="80" height="120" fill="${['#C9302A', '#2E4A6A'][i % 2]}" opacity=".9"/><circle cx="${x + 60}" cy="${hz - h + 150}" r="30" fill="${mode === 'night' || mode === 'dusk' ? '#FFB45A' : '#E9D2A8'}" ${OL(3)}/>`; }
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="#A8946A"/>`;
  return s;
}
export function beach(o = {}) {
  const mode = o.mode || 'day', hz = o.horizon ?? 600;
  const deep = { day: '#2E7DA6', dawn: '#6A86A6', dusk: '#5A4A6E', night: '#10243C', storm: '#2A3A48' }[mode];
  let s = sky(mode, { sun: o.sun, clouds: true });
  if (o.far) s += `<path d="M0 ${hz} Q300 ${hz - 70} 700 ${hz - 30} Q1100 ${hz - 90} 1500 ${hz - 20} T1920 ${hz}Z" fill="${shade(deep, -0.2)}"/>`;
  s += `<rect y="${hz}" width="1920" height="${1080 - hz}" fill="${deep}"/>`;
  const r = R(6); for (let i = 0; i < 50; i++) { const y = hz + 20 + r() * (1080 - hz), x = r() * 1920; s += `<path d="M${x} ${y} q20 -8 40 0 q20 8 40 0" stroke="#fff" stroke-width="3" fill="none" opacity="${0.15 + r() * 0.25}"/>`; }
  if (o.sand !== false) s += `<path d="M0 ${o.sandY ?? 860} Q600 ${(o.sandY ?? 860) - 50} 1200 ${(o.sandY ?? 860) - 10} T1920 ${(o.sandY ?? 860) - 30} V1080 H0Z" fill="#D9C08A" ${OL(4)}/><path d="M0 ${(o.sandY ?? 860) + 4} Q600 ${(o.sandY ?? 860) - 46} 1200 ${(o.sandY ?? 860) - 6} T1920 ${(o.sandY ?? 860) - 26}" stroke="#F4F1EA" stroke-width="10" fill="none" opacity=".7"/>`;
  return s;
}
export function castle(o = {}) {
  const mode = o.mode || 'day'; let s = sky(mode, { clouds: true });
  const id = 'cs' + (o.seed || 1);
  s += `<defs><pattern id="${id}" width="140" height="70" patternUnits="userSpaceOnUse"><rect width="140" height="70" fill="#5A5650"/><rect x="3" y="3" width="80" height="30" rx="8" fill="#8A847A"/><rect x="87" y="3" width="50" height="30" rx="8" fill="#7A746A"/><rect x="3" y="37" width="50" height="30" rx="8" fill="#7A746A"/><rect x="57" y="37" width="80" height="30" rx="8" fill="#948E84"/></pattern></defs>`;
  s += `<path d="M-40 1080 L200 ${o.top ?? 260} L1720 ${o.top ?? 260} L1960 1080Z" fill="url(#${id})" ${OL()}/><rect x="180" y="${(o.top ?? 260) - 40}" width="1560" height="50" fill="#E9E2D2" ${OL(4)}/><path d="M160 ${(o.top ?? 260) - 40} L1760 ${(o.top ?? 260) - 40} L1700 ${(o.top ?? 260) - 100} L220 ${(o.top ?? 260) - 100}Z" fill="#3A3E48" ${OL(4)}/>`;
  return s;
}
export function cave(o = {}) {
  const mouth = 'M300 1080 Q240 500 600 300 Q960 160 1320 300 Q1700 480 1620 1080Z';
  let s = `<defs><clipPath id="cvm"><path d="${mouth}"/></clipPath><clipPath id="cvw"><path d="M0 0 H1920 V1080 H0Z ${mouth}" clip-rule="evenodd"/></clipPath></defs>`;
  s += `<g clip-path="url(#cvm)">${o.view ? sky(o.mode || 'dawn', { clouds: true }) + mountains(o.mode || 'dawn', 820) : `<rect width="1920" height="1080" fill="${o.mouth || '#4A3A2E'}"/>`}</g>`;
  s += `<g clip-path="url(#cvw)"><rect width="1920" height="1080" fill="#3A3028"/>`;
  const r = R(9); for (let i = 0; i < 40; i++) { const x = r() * 1920, y = r() * 1080; s += `<ellipse cx="${x}" cy="${y}" rx="${60 + r() * 140}" ry="${30 + r() * 70}" fill="${['#4A4038', '#2E2824', '#544A40'][i % 3]}"/>`; }
  s += `</g><path d="${mouth}" fill="none" ${OL(8)}/><path d="M0 1000 H1920 V1080 H0Z" fill="#2A221C"/>`;
  return s;
}
export const J = {
  banner: (x, y, c = '#C9302A', s = 1, mon = '#F4F1EA') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-420" width="12" height="420" fill="#3A2A1E"/><rect x="6" y="-400" width="90" height="300" fill="${c}" ${OL(4)}/><circle cx="51" cy="-300" r="26" fill="none" stroke="${mon}" stroke-width="8"/></g>`,
  boat: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-320 -60 L320 -60 L260 30 L-260 30Z" fill="#8A6A44" ${OL()}/><path d="M-320 -60 L320 -60" stroke="#5A3E26" stroke-width="14"/><path d="M-200 -50 L-420 140" stroke="#6A4A2E" stroke-width="14" stroke-linecap="round"/></g>`,
  oar: (len = 260) => `<g><rect x="-7" y="${-len}" width="14" height="${len}" rx="6" fill="#C9A26A" stroke="#24170F" stroke-width="4"/><path d="M-7 ${-len * 0.15} q7 -18 14 0" stroke="#8A6A3A" stroke-width="3" fill="none"/></g>`,
  stick: (len = 200) => `<rect x="-6" y="${-len}" width="12" height="${len}" rx="5" fill="#8A6A3A" stroke="#24170F" stroke-width="4"/>`,
  katana: (len = 230) => `<g><rect x="-7" y="-10" width="14" height="60" rx="4" fill="#2A1A14" stroke="#24170F" stroke-width="3"/><rect x="-14" y="-14" width="28" height="8" rx="3" fill="#C9A24A"/><path d="M-5 -14 Q-10 ${-len * 0.6} 6 ${-len} L5 -14Z" fill="#E4EAF0" stroke="#24170F" stroke-width="3"/></g>`,
  twoSwords: () => `<g transform="rotate(-35)"><rect x="-6" y="-10" width="12" height="50" rx="4" fill="#2A1A14"/><path d="M-4 -12 Q-8 -140 5 -230 L4 -12Z" fill="#E4EAF0" stroke="#24170F" stroke-width="3"/></g>`,
  signboard: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-300" width="16" height="300" fill="#5A3E26" ${OL(3)}/><rect x="-150" y="-300" width="300" height="200" fill="#E9DCB8" ${OL(5)}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${110 - i * 44} -280 v${120 + (i % 2) * 30}" stroke="#2A1A14" stroke-width="8" stroke-linecap="round"/>`).join('') + `</g>`,
  scroll: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-260" y="-340" width="520" height="680" fill="#EDE4CC" ${OL(5)}/><rect x="-280" y="-360" width="560" height="26" rx="10" fill="#6A4A2E" ${OL(4)}/><rect x="-280" y="334" width="560" height="26" rx="10" fill="#6A4A2E" ${OL(4)}/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${200 - i * 56} -290 v${400 + (i % 3) * 120}" stroke="#1E1410" stroke-width="12" stroke-linecap="round" stroke-dasharray="40 18"/>`).join('') + `</g>`,
  ink: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-300" y="-200" width="600" height="400" fill="#EDE4CC" ${OL(5)}/><path d="M-200 160 Q-80 -40 60 -60 Q140 -70 220 -160" stroke="#2A2420" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M60 -60 L120 40" stroke="#2A2420" stroke-width="10" stroke-linecap="round"/><ellipse cx="-30" cy="-6" rx="34" ry="22" fill="#2A2420"/><circle cx="-50" cy="-14" r="5" fill="#EDE4CC"/><path d="M-4 0 L40 12 L-4 16Z" fill="#2A2420"/></g>`,
  rock: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q-70 -60 -20 -70 Q40 -80 60 -30 Q70 10 30 14 Q-30 20 -60 0Z" fill="#7A746A" ${OL(5)}/></g>`,
  lantern: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -140 V-110" stroke="#2A1A14" stroke-width="4"/><ellipse cx="0" cy="-60" rx="42" ry="56" fill="#F2B45A" ${OL(4)}/><path d="M-40 -60 H40 M-36 -84 H36 M-36 -36 H36" stroke="#C9783A" stroke-width="3"/></g>`,
  armorStand: (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-400" width="20" height="400" fill="#3A2A1E"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="-110" y="${-330 + i * 40}" width="220" height="34" fill="#7A2A24" ${OL(3)}/>`).join('') + `<path d="M-90 -380 Q0 -470 90 -380 L110 -350 L-110 -350Z" fill="#2A2A2E" ${OL(4)}/><path d="M-60 -440 L-100 -520 M60 -440 L100 -520" stroke="#C9A24A" stroke-width="10"/></g>`,
};
