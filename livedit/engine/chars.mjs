// Lived It character kit v2: chibi-proportioned, expressive, cel-shaded. Origin = feet centre. All original drawings.
export const INK = '#24170F';
const OL = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

export function shade(hex, f) { // f<0 darker, f>0 lighter
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
let UID = 0;
const SKIN = { light: '#F2C9A4', olive: '#E0AE84', tan: '#C98E62', brown: '#9A6440', dark: '#6E4630', pale: '#F6D8BE' };

// ---------- face ----------
function eyes(r, expr, blink, kid) {
  const ex = r * 0.42, ey = -r * 0.02, ew = r * (kid ? 0.27 : 0.22), eh = r * (kid ? 0.32 : 0.25);
  if (blink || expr === 'sleep') {
    return [-1, 1].map(s => `<path d="M${s * ex - ew} ${ey + 2} Q${s * ex} ${ey + eh * 0.7} ${s * ex + ew} ${ey + 2}" fill="none" ${OL(4.5)}/>`).join('');
  }
  let look = { shock: [0, 0], sad: [0, 3], angry: [0, 2] }[expr] || [r * 0.03, 0];
  let o = '';
  for (const s of [-1, 1]) {
    const cx = s * ex;
    const ehh = expr === 'angry' ? eh * 0.8 : expr === 'shock' ? eh * 1.12 : eh;
    o += `<ellipse cx="${cx}" cy="${ey}" rx="${ew}" ry="${ehh}" fill="#FFFDF8" ${OL(4)}/>`;
    const ir = (expr === 'shock' ? ew * 0.42 : ew * 0.62);
    o += `<circle cx="${cx + look[0]}" cy="${ey + look[1] + ehh * 0.08}" r="${ir}" fill="#3A2417"/>`;
    o += `<circle cx="${cx + look[0]}" cy="${ey + look[1] + ehh * 0.08}" r="${ir * 0.55}" fill="#120A06"/>`;
    o += `<circle cx="${cx + look[0] - ir * 0.35}" cy="${ey + look[1] - ir * 0.35}" r="${ir * 0.32}" fill="#fff"/>`;
    o += `<circle cx="${cx + look[0] + ir * 0.35}" cy="${ey + look[1] + ir * 0.4}" r="${ir * 0.14}" fill="#fff"/>`;
    if (expr === 'angry' || expr === 'smirk') o += `<path d="M${cx - ew * 1.1} ${ey - ehh * 0.55} L${cx + ew * 1.1} ${ey - ehh * 0.55} L${cx + ew * 1.1} ${ey - ehh * 1.3} L${cx - ew * 1.1} ${ey - ehh * 1.3}Z" fill="var(--skin)"/>`;
    if (expr === 'sad') o += `<path d="M${cx - ew * 1.1} ${ey - ehh * 0.5} L${cx + ew * 1.1} ${ey - ehh * 0.5} L${cx + ew * 1.1} ${ey - ehh * 1.3}Z" transform="${s > 0 ? `translate(${2 * cx} 0) scale(-1 1)` : ''}" fill="var(--skin)"/>`;
  }
  return o;
}
function brows(r, expr, col) {
  const ex = r * 0.42, y = -r * 0.36, w = r * 0.24;
  const tilt = { angry: 0.32, sad: -0.28, shock: -0.05, smirk: 0.12, worried: -0.25 }[expr] ?? 0;
  const lift = expr === 'shock' ? -r * 0.12 : 0;
  return [-1, 1].map(s => {
    const inner = s * (ex - w), outer = s * (ex + w);
    const yi = y + lift + tilt * r * 0.35, yo = y + lift - tilt * r * 0.2;
    const sm = expr === 'smirk' && s > 0 ? -r * 0.08 : 0;
    return `<path d="M${inner} ${yi + sm} Q${(inner + outer) / 2} ${Math.min(yi, yo) - r * 0.06 + sm} ${outer} ${yo + sm}" fill="none" stroke="${col}" stroke-width="${r * 0.085}" stroke-linecap="round"/>`;
  }).join('');
}
function mouth(r, expr) {
  const y = r * 0.48, w = r * 0.22;
  switch (expr) {
    case 'smile': return `<path d="M${-w} ${y - 4} Q0 ${y + r * 0.2} ${w} ${y - 4}" fill="none" ${OL(4.5)}/>`;
    case 'grin': return `<path d="M${-w * 1.3} ${y - 6} Q0 ${y + r * 0.34} ${w * 1.3} ${y - 6} Z" fill="#7A2E22" ${OL(4)}/><path d="M${-w * 1.05} ${y - 2} Q0 ${y + r * 0.08} ${w * 1.05} ${y - 2}" fill="#fff"/>`;
    case 'angry': return `<path d="M${-w} ${y + 6} Q0 ${y - r * 0.08} ${w} ${y + 6}" fill="none" ${OL(4.5)}/>`;
    case 'sad': return `<path d="M${-w * 0.8} ${y + 8} Q0 ${y - r * 0.06} ${w * 0.8} ${y + 8}" fill="none" ${OL(4)}/>`;
    case 'shock': return `<ellipse cx="0" cy="${y + 4}" rx="${w * 0.55}" ry="${r * 0.13}" fill="#5A1E16" ${OL(4)}/>`;
    case 'smirk': return `<path d="M${-w * 0.6} ${y + 2} Q${w * 0.3} ${y + r * 0.06} ${w * 1.05} ${y - r * 0.1}" fill="none" ${OL(4.5)}/>`;
    case 'shout': return `<path d="M${-w * 1.1} ${y + r * 0.02} Q0 ${y - r * 0.12} ${w * 1.1} ${y + r * 0.02} Q${w * 0.9} ${y + r * 0.32} 0 ${y + r * 0.34} Q${-w * 0.9} ${y + r * 0.32} ${-w * 1.1} ${y + r * 0.02}Z" fill="#5A1E16" ${OL(4)}/><path d="M${-w * 0.8} ${y + r * 0.0} Q0 ${y - r * 0.08} ${w * 0.8} ${y + r * 0.0} L${w * 0.7} ${y + r * 0.06} L${-w * 0.7} ${y + r * 0.06}Z" fill="#fff"/>`;
    case 'sleep': return `<path d="M${-w * 0.4} ${y + 2} Q0 ${y + 6} ${w * 0.4} ${y + 2}" fill="none" ${OL(3.5)}/>`;
    default: return `<path d="M${-w * 0.7} ${y} Q0 ${y + r * 0.07} ${w * 0.7} ${y}" fill="none" ${OL(4.5)}/>`;
  }
}
function hairBack(o, r) {
  const c = o.hairColor;
  switch (o.hair) {
    case 'bob': return `<path d="M${-r * 1.12} ${-r * 0.1} Q${-r * 1.25} ${r * 0.85} ${-r * 0.6} ${r * 0.8} L${r * 0.6} ${r * 0.8} Q${r * 1.25} ${r * 0.85} ${r * 1.12} ${-r * 0.1} Z" fill="${c}" ${OL()}/>`;
    case 'long': return `<path d="M${-r * 1.08} ${-r * 0.2} Q${-r * 1.3} ${r * 1.6} ${-r * 0.7} ${r * 1.7} L${r * 0.7} ${r * 1.7} Q${r * 1.3} ${r * 1.6} ${r * 1.08} ${-r * 0.2} Z" fill="${c}" ${OL()}/>`;
    case 'bun': return `<circle cx="0" cy="${-r * 1.05}" r="${r * 0.38}" fill="${c}" ${OL()}/>`;
    default: return '';
  }
}
function hairFront(o, r) {
  const c = o.hairColor, hi = shade(c, 0.18);
  switch (o.hair) {
    case 'curly': {
      let s = `<path d="M${-r * 1.02} ${-r * 0.15} Q${-r * 1.1} ${-r * 1.05} 0 ${-r * 1.12} Q${r * 1.1} ${-r * 1.05} ${r * 1.02} ${-r * 0.15} Q${r * 0.7} ${-r * 0.55} ${r * 0.2} ${-r * 0.45} Q0 ${-r * 0.75} ${-r * 0.3} ${-r * 0.45} Q${-r * 0.7} ${-r * 0.6} ${-r * 1.02} ${-r * 0.15}Z" fill="${c}" ${OL()}/>`;
      for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.11); s += `<circle cx="${Math.cos(a) * r * 0.98}" cy="${Math.sin(a) * r * 0.98 - r * 0.08}" r="${r * 0.2}" fill="${c}" ${OL(4)}/>`; }
      s += `<path d="M${-r * 0.5} ${-r * 0.85} q${r * 0.15} ${-r * 0.12} ${r * 0.3} 0" fill="none" stroke="${hi}" stroke-width="${r * 0.06}" stroke-linecap="round"/>`;
      return s;
    }
    case 'slick': return `<path d="M${-r * 1.0} ${-r * 0.2} Q${-r * 1.05} ${-r * 1.08} ${r * 0.05} ${-r * 1.1} Q${r * 1.05} ${-r * 1.05} ${r * 1.0} ${-r * 0.25} Q${r * 0.85} ${-r * 0.68} ${r * 0.1} ${-r * 0.7} Q${-r * 0.6} ${-r * 0.7} ${-r * 1.0} ${-r * 0.2}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.55} ${-r * 0.92} Q0 ${-r * 1.02} ${r * 0.55} ${-r * 0.88}" fill="none" stroke="${hi}" stroke-width="${r * 0.06}" stroke-linecap="round"/>`;
    case 'grey': return `<path d="M${-r * 1.0} ${-r * 0.1} Q${-r * 1.05} ${-r * 1.08} 0 ${-r * 1.1} Q${r * 1.05} ${-r * 1.08} ${r * 1.0} ${-r * 0.1} Q${r * 0.8} ${-r * 0.7} 0 ${-r * 0.72} Q${-r * 0.8} ${-r * 0.7} ${-r * 1.0} ${-r * 0.1}Z" fill="${c}" ${OL()}/><path d="M${-r * 1.0} ${-r * 0.1} Q${-r * 1.0} ${-r * 0.4} ${-r * 0.9} ${-r * 0.55}" fill="none" stroke="#C9C4BC" stroke-width="${r * 0.14}"/><path d="M${r * 1.0} ${-r * 0.1} Q${r * 1.0} ${-r * 0.4} ${r * 0.9} ${-r * 0.55}" fill="none" stroke="#C9C4BC" stroke-width="${r * 0.14}"/>`;
    case 'bob': case 'long': return `<path d="M${-r * 1.05} ${-r * 0.05} Q${-r * 1.15} ${-r * 1.1} 0 ${-r * 1.12} Q${r * 1.15} ${-r * 1.1} ${r * 1.05} ${-r * 0.05} Q${r * 0.9} ${-r * 0.5} ${r * 0.35} ${-r * 0.62} Q${-r * 0.2} ${-r * 0.4} ${-r * 0.55} ${-r * 0.72} Q${-r * 0.9} ${-r * 0.5} ${-r * 1.05} ${-r * 0.05}Z" fill="${c}" ${OL()}/>`;
    case 'bun': return `<path d="M${-r * 1.0} ${-r * 0.1} Q${-r * 1.05} ${-r * 1.08} 0 ${-r * 1.1} Q${r * 1.05} ${-r * 1.08} ${r * 1.0} ${-r * 0.1} Q${r * 0.7} ${-r * 0.75} 0 ${-r * 0.75} Q${-r * 0.7} ${-r * 0.75} ${-r * 1.0} ${-r * 0.1}Z" fill="${c}" ${OL()}/>`;
    case 'topknot': return `<path d="M${-r * 1.0} ${-r * 0.05} Q${-r * 1.02} ${-r * 0.55} ${-r * 0.75} ${-r * 0.7}" fill="none" stroke="${c}" stroke-width="${r * 0.2}"/><path d="M${r * 1.0} ${-r * 0.05} Q${r * 1.02} ${-r * 0.55} ${r * 0.75} ${-r * 0.7}" fill="none" stroke="${c}" stroke-width="${r * 0.2}"/><path d="M${-r * 0.12} ${-r * 1.02} Q${-r * 0.1} ${-r * 1.3} ${r * 0.35} ${-r * 1.4} L${r * 0.4} ${-r * 1.26} Q${r * 0.1} ${-r * 1.2} ${r * 0.12} ${-r * 1.02}Z" fill="${c}" ${OL(3.5)}/>`;
    case 'wild': { let w = ''; for (let i = 0; i < 11; i++) { const a = Math.PI * (1.08 + i * 0.084); const x = Math.cos(a) * r * 1.02, y = Math.sin(a) * r * 1.02 - r * 0.05; w += `<path d="M${x * 0.7} ${y * 0.7} L${x * 1.38} ${y * 1.32 - r * 0.05} L${x * 1.0 + (i % 2 ? 8 : -8)} ${y * 1.0}Z" fill="${c}" ${OL(4)}/>`; } return w + `<path d="M${-r * 1.02} ${-r * 0.1} Q${-r * 1.05} ${-r * 1.08} 0 ${-r * 1.12} Q${r * 1.05} ${-r * 1.08} ${r * 1.02} ${-r * 0.1} Q${r * 0.75} ${-r * 0.5} ${r * 0.35} ${-r * 0.55} L${r * 0.15} ${-r * 0.3} L0 ${-r * 0.6} L${-r * 0.3} ${-r * 0.35} L${-r * 0.45} ${-r * 0.6} Q${-r * 0.8} ${-r * 0.5} ${-r * 1.02} ${-r * 0.1}Z" fill="${c}" ${OL()}/>`; }
    case 'shaved': return `<path d="M${-r * 0.6} ${-r * 0.85} Q0 ${-r * 1.0} ${r * 0.6} ${-r * 0.85}" fill="none" stroke="${shade(o.skinColor, -0.1)}" stroke-width="${r * 0.08}"/>`;
    case 'bald': return `<path d="M${-r * 1.0} ${-r * 0.05} Q${-r * 1.02} ${-r * 0.5} ${-r * 0.8} ${-r * 0.55}" fill="none" stroke="${c}" stroke-width="${r * 0.18}"/><path d="M${r * 1.0} ${-r * 0.05} Q${r * 1.02} ${-r * 0.5} ${r * 0.8} ${-r * 0.55}" fill="none" stroke="${c}" stroke-width="${r * 0.18}"/>`;
    case 'tuft': return `<path d="M${-r * 0.2} ${-r * 0.98} q${r * 0.1} ${-r * 0.4} ${r * 0.35} ${-r * 0.3} q${-r * 0.05} ${r * 0.15} ${-r * 0.05} ${r * 0.3}" fill="${c}" ${OL(4)}/>`;
    default: return `<path d="M${-r * 1.0} ${-r * 0.15} Q${-r * 1.05} ${-r * 1.08} 0 ${-r * 1.1} Q${r * 1.05} ${-r * 1.08} ${r * 1.0} ${-r * 0.15} Q${r * 0.6} ${-r * 0.7} 0 ${-r * 0.68} Q${-r * 0.6} ${-r * 0.7} ${-r * 1.0} ${-r * 0.15}Z" fill="${c}" ${OL()}/>`;
  }
}
function hat(o, r) {
  const c = o.hatColor;
  switch (o.hat) {
    case 'fedora': return `<g transform="translate(0 ${-r * 0.62})"><ellipse cx="0" cy="${r * 0.02}" rx="${r * 1.42}" ry="${r * 0.3}" fill="${c}" ${OL()}/><path d="M${-r * 0.88} 0 Q${-r * 0.95} ${-r * 0.85} ${-r * 0.35} ${-r * 0.88} Q0 ${-r * 0.62} ${r * 0.35} ${-r * 0.88} Q${r * 0.95} ${-r * 0.85} ${r * 0.88} 0 Z" fill="${c}" ${OL()}/><path d="M${-r * 0.9} ${-r * 0.06} Q0 ${r * 0.08} ${r * 0.9} ${-r * 0.06} L${r * 0.88} ${-r * 0.26} Q0 ${-r * 0.12} ${-r * 0.88} ${-r * 0.26}Z" fill="${o.bandColor || INK}"/><path d="M${-r * 0.5} ${-r * 0.7} Q${-r * 0.3} ${-r * 0.8} ${-r * 0.2} ${-r * 0.72}" fill="none" stroke="${shade(c, 0.25)}" stroke-width="${r * 0.06}" stroke-linecap="round"/></g>`;
    case 'cap': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 1.02} ${r * 0.08} Q${-r * 1.1} ${-r * 0.62} 0 ${-r * 0.68} Q${r * 1.15} ${-r * 0.6} ${r * 1.08} ${r * 0.05} Z" fill="${c}" ${OL()}/><path d="M${-r * 0.7} ${r * 0.1} Q0 ${r * 0.42} ${r * 0.9} ${r * 0.12} Q${r * 0.1} ${r * 0.18} ${-r * 0.7} ${r * 0.1}Z" fill="${shade(c, -0.2)}" ${OL(4)}/><circle cx="0" cy="${-r * 0.66}" r="${r * 0.08}" fill="${c}" ${OL(3)}/></g>`;
    case 'bowler': return `<g transform="translate(0 ${-r * 0.62})"><ellipse cx="0" cy="0" rx="${r * 1.22}" ry="${r * 0.24}" fill="${c}" ${OL()}/><path d="M${-r * 0.85} 0 Q${-r * 0.9} ${-r * 0.95} 0 ${-r * 0.95} Q${r * 0.9} ${-r * 0.95} ${r * 0.85} 0Z" fill="${c}" ${OL()}/><path d="M${-r * 0.45} ${-r * 0.7} Q${-r * 0.25} ${-r * 0.85} 0 ${-r * 0.84}" fill="none" stroke="${shade(c, 0.3)}" stroke-width="${r * 0.06}" stroke-linecap="round"/></g>`;
    case 'police': return `<g transform="translate(0 ${-r * 0.64})"><path d="M${-r * 0.95} ${r * 0.1} L${-r * 1.05} ${-r * 0.5} Q0 ${-r * 0.75} ${r * 1.05} ${-r * 0.5} L${r * 0.95} ${r * 0.1}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.9} ${r * 0.08} Q0 ${r * 0.4} ${r * 0.9} ${r * 0.08}" fill="${INK}" ${OL(3)}/><path d="M${-r * 0.12} ${-r * 0.45} l${r * 0.12} ${-r * 0.12} l${r * 0.12} ${r * 0.12} l${-r * 0.12} ${r * 0.14}Z" fill="#E2B43C" ${OL(2.5)}/></g>`;
    case 'cowboy': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 1.7} ${r * 0.05} Q${-r * 1.6} ${-r * 0.35} ${-r * 1.15} ${-r * 0.12} Q0 ${r * 0.12} ${r * 1.15} ${-r * 0.12} Q${r * 1.6} ${-r * 0.35} ${r * 1.7} ${r * 0.05} Q0 ${r * 0.45} ${-r * 1.7} ${r * 0.05}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.85} ${-r * 0.05} Q${-r * 0.95} ${-r * 0.95} ${-r * 0.3} ${-r * 0.95} Q0 ${-r * 0.72} ${r * 0.3} ${-r * 0.95} Q${r * 0.95} ${-r * 0.95} ${r * 0.85} ${-r * 0.05}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.86} ${-r * 0.12} Q0 ${r * 0.0} ${r * 0.86} ${-r * 0.12} L${r * 0.84} ${-r * 0.3} Q0 ${-r * 0.18} ${-r * 0.84} ${-r * 0.3}Z" fill="${o.bandColor || '#3A2418'}"/></g>`;
    case 'kepi': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 0.9} ${r * 0.1} L${-r * 0.8} ${-r * 0.75} L${r * 0.7} ${-r * 0.65} L${r * 0.9} ${r * 0.1}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.9} ${r * 0.1} Q${-r * 0.2} ${r * 0.45} ${r * 0.5} ${r * 0.18} L${r * 0.9} ${r * 0.1}" fill="${INK}" ${OL(3)}/></g>`;
    case 'corinthian': { const cr = o.crest || '#A8282A'; return `<g transform="translate(0 ${-r * 0.05})"><path d="M${-r * 1.08} ${r * 0.55} L${-r * 1.1} ${-r * 0.4} Q${-r * 1.05} ${-r * 1.18} 0 ${-r * 1.2} Q${r * 1.05} ${-r * 1.18} ${r * 1.1} ${-r * 0.4} L${r * 1.08} ${r * 0.55} L${r * 0.55} ${r * 0.6} L${r * 0.6} ${-r * 0.05} L${-r * 0.6} ${-r * 0.05} L${-r * 0.55} ${r * 0.6}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.1} ${-r * 0.05} L${-r * 0.1} ${r * 0.35} L${r * 0.1} ${r * 0.35} L${r * 0.1} ${-r * 0.05}" fill="${c}" ${OL(3)}/><path d="M${-r * 0.95} ${-r * 0.95} Q0 ${-r * 2.3} ${r * 0.95} ${-r * 0.95} Q0 ${-r * 1.25} ${-r * 0.95} ${-r * 0.95}Z" fill="${cr}" ${OL(4)}/><path d="M${-r * 0.7} ${-r * 0.9} Q${-r * 0.4} ${-r * 1.05} ${-r * 0.1} ${-r * 0.98}" stroke="${shade(c, 0.35)}" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/></g>`; }
    case 'tiara': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 0.9} ${r * 0.1} L${-r * 0.75} ${-r * 0.8} L${r * 0.75} ${-r * 0.8} L${r * 0.9} ${r * 0.1}Z" fill="${c}" ${OL()}/><path d="M${-r * 0.82} ${-r * 0.3} H${r * 0.82}" stroke="#E2B43C" stroke-width="${r * 0.1}"/></g>`;
    case 'crown': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 0.85} ${r * 0.1} L${-r * 0.9} ${-r * 0.75} L${-r * 0.45} ${-r * 0.4} L0 ${-r * 0.95} L${r * 0.45} ${-r * 0.4} L${r * 0.9} ${-r * 0.75} L${r * 0.85} ${r * 0.1}Z" fill="#E2B43C" ${OL()}/><circle cx="0" cy="${-r * 0.3}" r="${r * 0.12}" fill="#C9302A"/></g>`;
    case 'straw': return `<g transform="translate(0 ${-r * 0.62})"><ellipse cx="0" cy="0" rx="${r * 1.5}" ry="${r * 0.28}" fill="${c}" ${OL()}/><path d="M${-r * 0.8} 0 L${-r * 0.75} ${-r * 0.6} L${r * 0.75} ${-r * 0.6} L${r * 0.8} 0Z" fill="${c}" ${OL()}/><rect x="${-r * 0.8}" y="${-r * 0.22}" width="${r * 1.6}" height="${r * 0.18}" fill="#7A2E22"/></g>`;
    case 'prisoncap': return `<g transform="translate(0 ${-r * 0.62})"><path d="M${-r * 0.95} ${r * 0.1} Q${-r * 1.0} ${-r * 0.55} 0 ${-r * 0.6} Q${r * 1.0} ${-r * 0.55} ${r * 0.95} ${r * 0.1}Z" fill="${c}" ${OL()}/></g>`;
    default: return '';
  }
}
export function head(o) {
  const r = o.r, skin = o.skinColor, sd = shade(skin, -0.14);
  const id = `hc${++UID}`;
  let s = `<g style="--skin:${skin}">`;
  s += hairBack(o, r);
  s += `<ellipse cx="${-r * 1.0}" cy="${r * 0.05}" rx="${r * 0.18}" ry="${r * 0.24}" fill="${skin}" ${OL(4)}/><ellipse cx="${r * 1.0}" cy="${r * 0.05}" rx="${r * 0.18}" ry="${r * 0.24}" fill="${skin}" ${OL(4)}/>`;
  const jaw = o.heavy ? 1.08 : 1.0;
  s += `<defs><clipPath id="${id}"><path d="M${-r} 0 Q${-r} ${-r * 1.05} 0 ${-r * 1.05} Q${r} ${-r * 1.05} ${r} 0 Q${r * jaw} ${r * 0.95} 0 ${r * 1.02} Q${-r * jaw} ${r * 0.95} ${-r} 0Z"/></clipPath></defs>`;
  s += `<path d="M${-r} 0 Q${-r} ${-r * 1.05} 0 ${-r * 1.05} Q${r} ${-r * 1.05} ${r} 0 Q${r * jaw} ${r * 0.95} 0 ${r * 1.02} Q${-r * jaw} ${r * 0.95} ${-r} 0Z" fill="${skin}"/>`;
  s += `<g clip-path="url(#${id})"><path d="M${r * 0.35} ${-r * 1.2} Q${r * 0.7} 0 ${r * 0.3} ${r * 1.2} L${r * 1.3} ${r * 1.2} L${r * 1.3} ${-r * 1.2}Z" fill="${sd}" opacity=".55"/>`;
  if (o.stubble) s += `<path d="M${-r} ${r * 0.25} Q0 ${r * 0.55} ${r} ${r * 0.25} L${r} ${r * 1.2} L${-r} ${r * 1.2}Z" fill="#3A2A22" opacity=".12"/>`;
  s += `</g>`;
  s += `<path d="M${-r} 0 Q${-r} ${-r * 1.05} 0 ${-r * 1.05} Q${r} ${-r * 1.05} ${r} 0 Q${r * jaw} ${r * 0.95} 0 ${r * 1.02} Q${-r * jaw} ${r * 0.95} ${-r} 0Z" fill="none" ${OL()}/>`;
  if (o.age === 'kid' || o.age === 'baby' || o.blush) s += `<ellipse cx="${-r * 0.55}" cy="${r * 0.32}" rx="${r * 0.17}" ry="${r * 0.1}" fill="#E88A7A" opacity=".55"/><ellipse cx="${r * 0.55}" cy="${r * 0.32}" rx="${r * 0.17}" ry="${r * 0.1}" fill="#E88A7A" opacity=".55"/>`;
  s += eyes(r, o.expr, o.blink, o.age === 'kid' || o.age === 'baby');
  s += brows(r, o.expr, o.browColor || shade(o.hairColor, -0.1));
  s += `<path d="M${-r * 0.06} ${r * 0.16} Q${r * 0.1} ${r * 0.3} ${-r * 0.02} ${r * 0.33}" fill="none" ${OL(3.5)}/>`;
  if (o.mustache) s += `<path d="M${-r * 0.38} ${r * 0.43} Q${-r * 0.2} ${r * 0.3} 0 ${r * 0.38} Q${r * 0.2} ${r * 0.3} ${r * 0.38} ${r * 0.43} Q${r * 0.2} ${r * 0.5} 0 ${r * 0.44} Q${-r * 0.2} ${r * 0.5} ${-r * 0.38} ${r * 0.43}Z" fill="${o.mustacheColor || o.hairColor}" ${OL(3)}/>`;
  s += mouth(r, o.expr);
  if (o.scar) s += [0, 1, 2].map(i => `<path d="M${r * (0.40 + i * 0.11)} ${r * (0.30 + i * 0.03)} l${r * 0.13} ${r * 0.28}" stroke="#A9473A" stroke-width="${r * 0.045}" stroke-linecap="round"/>`).join('');
  if (o.glasses) s += `<circle cx="${-r * 0.42}" cy="0" r="${r * 0.3}" fill="none" ${OL(4)}/><circle cx="${r * 0.42}" cy="0" r="${r * 0.3}" fill="none" ${OL(4)}/><path d="M${-r * 0.12} 0 h${r * 0.24}" ${OL(4)}/>`;
  if (o.beard) s += `<path d="M${-r * 0.92} ${r * 0.1} Q${-r * 0.95} ${r * 1.0} 0 ${r * (o.beardLong ? 1.55 : 1.22)} Q${r * 0.95} ${r * 1.0} ${r * 0.92} ${r * 0.1} Q${r * 0.6} ${r * 0.45} ${r * 0.3} ${r * 0.62} Q0 ${r * 0.5} ${-r * 0.3} ${r * 0.62} Q${-r * 0.6} ${r * 0.45} ${-r * 0.92} ${r * 0.1}Z" fill="${o.beard}" ${OL(4)}/><path d="M${-r * 0.25} ${r * 0.66} Q0 ${r * 0.74} ${r * 0.25} ${r * 0.66}" fill="none" stroke="#5A1E16" stroke-width="${r * 0.06}"/>`;
  s += hairFront(o, r);
  s += hat(o, r);
  if (o.headband) s += `<path d="M${-r * 1.04} ${-r * 0.42} Q0 ${-r * 0.62} ${r * 1.04} ${-r * 0.42} L${r * 1.04} ${-r * 0.24} Q0 ${-r * 0.44} ${-r * 1.04} ${-r * 0.24}Z" fill="${o.headband}" ${OL(3.5)}/><path d="M${r * 1.0} ${-r * 0.33} q${r * 0.3} ${r * 0.1} ${r * 0.5} ${r * 0.45} M${r * 1.0} ${-r * 0.33} q${r * 0.35} ${-r * 0.05} ${r * 0.6} ${r * 0.2}" stroke="${o.headband}" stroke-width="${r * 0.12}" fill="none" stroke-linecap="round"/>`;
  if (o.bandage) s += `<path d="M${-r * 1.05} ${-r * 0.3} Q0 ${-r * 0.55} ${r * 1.05} ${-r * 0.3} L${r * 1.05} ${-r * 0.02} Q0 ${-r * 0.25} ${-r * 1.05} ${-r * 0.02}Z" fill="#F4F1EA" ${OL(4)}/>`;
  return s + '</g>';
}

// ---------- body ----------
const OUTFIT = {
  suit: { top: '#4A4F5A', shirt: '#F3EEE2', tie: '#8E2B23', legs: '#3E434D', shoes: '#1E1612', lapel: true },
  pinstripe: { top: '#4A4C55', shirt: '#F3EEE2', tie: '#8E2B23', legs: '#43454E', shoes: '#1E1612', lapel: true, stripes: '#8A8D96' },
  lightsuit: { top: '#B8B2C8', shirt: '#F7F2E6', tie: '#5B3A8E', legs: '#A9A3B8', shoes: '#3A2A22', lapel: true },
  darksuit: { top: '#2C2B30', shirt: '#F3EEE2', tie: '#2C2B30', legs: '#252429', shoes: '#141010', lapel: true, vest: true },
  shirt: { top: '#EFE6D2', legs: '#5A4A3A', shoes: '#3A2A1E', suspenders: '#6A3E26', rolled: true },
  kid: { top: '#EFE6D2', legs: '#6A5A44', shoes: '#4A3424', suspenders: '#6A3E26', shorts: true, socks: '#8A8478' },
  teen: { top: '#D9CFBA', legs: '#4A4038', shoes: '#3A2A1E', vestOpen: '#5E4A36' },
  dress: { top: '#6E8A6A', legs: '#6E8A6A', shoes: '#3A2418', dress: true, collar: '#F3EDE0' },
  dress2: { top: '#7A3A3A', legs: '#7A3A3A', shoes: '#2A1A14', dress: true },
  apron: { top: '#4A3A44', legs: '#3A2E36', shoes: '#2A1A14', dress: true, apron: '#E9E0CC' },
  whitecoat: { top: '#F4F1EA', shirt: '#F4F1EA', legs: '#4A4038', shoes: '#2A1A14' },
  police: { top: '#2E3B5E', legs: '#283352', shoes: '#141010', buttons: '#E2B43C', belt: '#1E1612' },
  prison: { top: '#9AA0A8', legs: '#8D939B', shoes: '#2A2A2A', number: true },
  pajamas: { top: '#D9DEE8', legs: '#D9DEE8', shoes: '#6A2A2A', stripes: '#7D8FB3', robe: '#6E2430' },
  coat: { top: '#3E3530', legs: '#2E2824', shoes: '#141010', long: true },
  bartender: { top: '#F3EEE2', legs: '#2E2A28', shoes: '#141010', vest: '#2E2A28', apronLong: '#EDE6D6', rolled: true },
  robe: { top: '#2A2A2E', legs: '#2A2A2E', shoes: '#141010', long: true, dress: true },
  worker: { top: '#5E6E84', legs: '#4A4038', shoes: '#2A1A14', rolled: true },
  hoplite: { top: '#C99A3A', legs: '#E0B48A', shoes: '#6A4028', cuirass: true, cloak: '#A8282A', skirt: '#8E2A24', bareLegs: true },
  chiton: { top: '#E9E2D2', legs: '#E0B48A', shoes: '#8A6A44', skirt: '#E9E2D2', bareLegs: true, belt: '#8A6A44' },
  boyRag: { top: '#B8A88A', legs: '#E0B48A', shoes: '#E0B48A', skirt: '#B8A88A', bareLegs: true },
  peplos: { top: '#E9DCC0', legs: '#E9DCC0', shoes: '#8A6A44', dress: true, belt2: '#A8282A' },
  persian: { top: '#5A2A6A', legs: '#3A2A5A', shoes: '#C9A24A', long: true, dress: true, trim: '#E2B43C' },
  immortal: { top: '#2E4A6A', legs: '#6A5A3A', shoes: '#C9A24A', scales: '#C9A24A', skirt: '#2E4A6A', trim: '#E2B43C' },
  duster: { top: '#8A6A44', legs: '#4A4038', shoes: '#3A2418', long: true, vestOpen: '#5A3E26' },
  cowboy: { top: '#C9B89A', legs: '#4A5A7A', shoes: '#5A3418', vestOpen: '#4A2E1E' },
  union: { top: '#2E3E6E', legs: '#4A5A8A', shoes: '#141010', buttons: '#E2B43C', belt: '#1E1612' },
  confed: { top: '#8A7A5A', legs: '#7A6A4E', shoes: '#2A1A14', buttons: '#E2B43C', belt: '#3A2A1E' },
  preacher: { top: '#1E1E22', shirt: '#F3EEE2', tie: '#1E1E22', legs: '#1E1E22', shoes: '#141010', lapel: true },
  farmdress: { top: '#5A6A8A', legs: '#5A6A8A', shoes: '#3A2418', dress: true, apron: '#E9E0CC' },
  kimono: { top: '#3A4A6A', legs: '#2E2E3A', shoes: '#C9B89A', kimono: true, inner: '#E9E2D2', hakama: true, obi: '#6A2A24' },
  kimono2: { top: '#6A3A2A', legs: '#3A2E26', shoes: '#C9B89A', kimono: true, inner: '#E9E2D2', hakama: true, obi: '#2A2A2E' },
  kimonoW: { top: '#F2EADA', legs: '#5A5AA0', shoes: '#C9B89A', kimono: true, inner: '#C9302A', hakama: true, obi: '#C9302A' },
  ragged: { top: '#7A6A52', legs: '#5A4E3E', shoes: '#9A8A6A', kimono: true, inner: '#C9B89A', hakama: true, obi: '#3A2E22' },
  monk: { top: '#4A4A50', legs: '#4A4A50', shoes: '#C9B89A', kimono: true, inner: '#E9E2D2', dress: true, long: true, kesa: '#B8862E' },
  armor: { top: '#3A2A2A', legs: '#2E2420', shoes: '#2A1A14', kimono: true, inner: '#C9302A', hakama: true, obi: '#1A1A1A', armor: '#7A2A24' },
  peasant: { top: '#8A7A5A', legs: '#6A5A44', shoes: '#9A8A6A', kimono: true, inner: '#C9B89A', rolled: true },
  kidK: { top: '#5A6A4A', legs: '#4A4A3A', shoes: '#9A8A6A', kimono: true, inner: '#E9E2D2', hakama: true, obi: '#3A2E22' },
};
function stripes(id, col, w = 14) { return `<pattern id="${id}" width="${w}" height="10" patternUnits="userSpaceOnUse"><rect width="${w}" height="10" fill="none"/><rect x="${w / 2}" width="2" height="10" fill="${col}" opacity=".55"/></pattern>`; }

function limb(x1, y1, len, ang, w, col, end) { // ang in deg, 0 = down
  const a = ang * Math.PI / 180, x2 = x1 + Math.sin(a) * len, y2 = y1 + Math.cos(a) * len;
  return { s: `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`, x2, y2 };
}
const POSES = { // [leftArm, rightArm] angles (0 down, + toward character's left = viewer right?) we use viewer space: negative = to viewer-left
  stand: [[12, 0], [-12, 0]], hips: [[40, -70], [-40, 70]], point: [[12, 0], [-100, 0]], wave: [[12, 0], [-150, 20]],
  hold: [[-35, -60], [35, 60]], cross: [[30, 0], [-30, 0]], cigar: [[12, 0], [-150, -95]], up: [[150, 0], [-150, 0]],
  shrug: [[60, -40], [-60, 40]], reach: [[-80, 0], [-95, 0]], hand_face: [[12, 0], [-160, -110]], pockets: [[8, 0], [-8, 0]],
  fist: [[12, 0], [-40, -30]], sit: [[-20, -50], [20, 50]], hug: [[-50, -70], [50, 70]], mop: [[-25, -40], [-10, -55]],
};
export function body(o) {
  const H = o.h, k = o.age === 'kid' ? 'kid' : o.age === 'teen' ? 'teen' : 'adult';
  const of = { ...OUTFIT[o.outfit || 'suit'], ...(o.colors || {}) };
  const r = o.r;
  const neckY = -H + r * 2.05;
  const hipY = -H * (k === 'kid' ? 0.3 : 0.36);
  const shoulderW = (o.heavy ? 1.22 : 1.0) * r * (k === 'kid' ? 0.85 : 1.05);
  const hipW = shoulderW * (o.heavy ? 1.12 : 0.88);
  const armW = r * (k === 'kid' ? 0.3 : 0.34) * (o.heavy ? 1.15 : 1);
  const legW = r * (k === 'kid' ? 0.34 : 0.38) * (o.heavy ? 1.15 : 1);
  const pid = `st${++UID}`;
  let defs = '', s = '';
  if (of.stripes) defs += stripes(pid, of.stripes);
  const pose = o.pose || 'stand';
  const [la, ra] = POSES[pose] || POSES.stand;
  const sitting = pose === 'sit' || o.sit;
  const legLen0 = -hipY; if (of.cloak) s += `<path d="M${-shoulderW * 0.95} ${neckY + r * 0.2} Q${-shoulderW * 1.6} ${hipY} ${-shoulderW * 1.5} ${hipY + legLen0 * 0.55} L${shoulderW * 1.5} ${hipY + legLen0 * 0.55} Q${shoulderW * 1.6} ${hipY} ${shoulderW * 0.95} ${neckY + r * 0.2}Z" fill="${of.cloak}" ${OL()}/>`;
  // legs
  const legLen = -hipY;
  if (!of.dress || of.long) {
    if (sitting) {
      for (const sx of [-1, 1]) {
        const x = sx * hipW * 0.45;
        s += `<path d="M${x} ${hipY} L${x + sx * 4} ${hipY + legLen * 0.05} L${x + sx * 4 + legLen * 0.42} ${hipY + legLen * 0.1}" fill="none" stroke="${INK}" stroke-width="${legW + 10}" stroke-linecap="round" stroke-linejoin="round"/>`;
        s += `<path d="M${x} ${hipY} L${x + sx * 4} ${hipY + legLen * 0.05} L${x + sx * 4 + legLen * 0.42} ${hipY + legLen * 0.1}" fill="none" stroke="${of.legs}" stroke-width="${legW}" stroke-linecap="round" stroke-linejoin="round"/>`;
        s += `<path d="M${x + sx * 4 + legLen * 0.42} ${hipY + legLen * 0.1} L${x + sx * 4 + legLen * 0.44} ${hipY + legLen * 0.55}" stroke="${INK}" stroke-width="${legW + 10}" stroke-linecap="round"/><path d="M${x + sx * 4 + legLen * 0.42} ${hipY + legLen * 0.1} L${x + sx * 4 + legLen * 0.44} ${hipY + legLen * 0.55}" stroke="${of.legs}" stroke-width="${legW}" stroke-linecap="round"/>`;
        s += `<ellipse cx="${x + sx * 4 + legLen * 0.5}" cy="${hipY + legLen * 0.58}" rx="${legW * 0.85}" ry="${legW * 0.45}" fill="${of.shoes}" ${OL(4)}/>`;
      }
    } else {
      const spread = pose === 'run' ? 26 : 4;
      for (const sx of [-1, 1]) {
        const x = sx * hipW * 0.42;
        const L = limb(x, hipY, legLen - legW * 0.5, sx * spread, legW, of.bareLegs ? o.skinColor : of.shorts ? (of.socks || SKIN.olive) : of.legs);
        s += L.s;
        if (of.shorts) s += `<path d="M${x - legW * 0.75} ${hipY - 4} L${x + legW * 0.75} ${hipY - 4} L${x + legW * 0.8} ${hipY + legLen * 0.38} L${x - legW * 0.8} ${hipY + legLen * 0.38}Z" fill="${of.legs}" ${OL(4)}/>`;
        if (of.stripes && o.outfit === 'pajamas') s += `<path d="M${x} ${hipY} L${L.x2} ${L.y2}" stroke="${of.stripes}" stroke-width="${legW * 0.18}" opacity=".7"/>`;
        s += `<ellipse cx="${L.x2 + sx * legW * 0.25}" cy="${-legW * 0.28}" rx="${legW * 0.85}" ry="${legW * 0.42}" fill="${of.shoes}" ${OL(4)}/>`;
      }
    }
  } else {
    const hem = sitting ? hipY + legLen * 0.5 : -legW * 0.9;
    s += `<path d="M${-hipW * 0.75} ${neckY + r * 0.9} L${-hipW * 1.35} ${hem} Q0 ${hem + 18} ${hipW * 1.35} ${hem} L${hipW * 0.75} ${neckY + r * 0.9}Z" fill="${of.legs}" ${OL()}/>`;
    if (!sitting) for (const sx of [-1, 1]) s += `<ellipse cx="${sx * hipW * 0.45}" cy="${-legW * 0.3}" rx="${legW * 0.7}" ry="${legW * 0.4}" fill="${of.shoes}" ${OL(4)}/>`;
    if (of.apron) s += `<path d="M${-hipW * 0.7} ${hipY - r * 0.3} L${-hipW * 0.95} ${hem - 8} Q0 ${hem + 4} ${hipW * 0.95} ${hem - 8} L${hipW * 0.7} ${hipY - r * 0.3}Z" fill="${of.apron}" ${OL(4)}/>`;
  }
  if (of.hakama && !sitting) {
    s += `<path d="M${-hipW * 1.05} ${hipY - r * 0.3} L${-hipW * 1.5} ${-legW * 0.6} L${-hipW * 0.08} ${-legW * 0.6} L0 ${hipY + legLen * 0.2} L${hipW * 0.08} ${-legW * 0.6} L${hipW * 1.5} ${-legW * 0.6} L${hipW * 1.05} ${hipY - r * 0.3}Z" fill="${of.legs}" ${OL()}/><path d="M${-hipW * 0.6} ${hipY} L${-hipW * 0.8} ${-legW} M${hipW * 0.6} ${hipY} L${hipW * 0.8} ${-legW}" stroke="${shade(of.legs, -0.25)}" stroke-width="4"/>`;
  }
  if (o.swords) s += `<path d="M${-hipW * 1.2} ${hipY - r * 0.1} L${hipW * 2.2} ${hipY - r * 0.9}" stroke="${INK}" stroke-width="${r * 0.2}" stroke-linecap="round"/><path d="M${-hipW * 1.2} ${hipY - r * 0.1} L${hipW * 2.2} ${hipY - r * 0.9}" stroke="#2A1A14" stroke-width="${r * 0.12}" stroke-linecap="round"/><path d="M${-hipW * 1.0} ${hipY + r * 0.15} L${hipW * 1.6} ${hipY - r * 0.45}" stroke="${INK}" stroke-width="${r * 0.18}" stroke-linecap="round"/><path d="M${-hipW * 1.0} ${hipY + r * 0.15} L${hipW * 1.6} ${hipY - r * 0.45}" stroke="#3A2418" stroke-width="${r * 0.1}" stroke-linecap="round"/><rect x="${hipW * 1.5}" y="${hipY - r * 1.0}" width="${r * 0.16}" height="${r * 0.3}" fill="#C9A24A" transform="rotate(-20 ${hipW * 1.55} ${hipY - r * 0.85})"/>`;
  if (of.skirt && !sitting) s += `<path d="M${-hipW * 1.05} ${hipY - r * 0.4} L${-hipW * 1.25} ${hipY + legLen * 0.42} L${hipW * 1.25} ${hipY + legLen * 0.42} L${hipW * 1.05} ${hipY - r * 0.4}Z" fill="${of.skirt}" ${OL()}/>` + (of.trim ? `<path d="M${-hipW * 1.25} ${hipY + legLen * 0.38} H${hipW * 1.25}" stroke="${of.trim}" stroke-width="${r * 0.12}"/>` : '');
  // torso
  const tTop = neckY, tBot = hipY + (of.long ? legLen * 0.55 : r * 0.15);
  const torso = `M${-shoulderW} ${tTop + r * 0.25} Q${-shoulderW} ${tTop} ${-shoulderW * 0.6} ${tTop} L${shoulderW * 0.6} ${tTop} Q${shoulderW} ${tTop} ${shoulderW} ${tTop + r * 0.25} L${hipW * (of.long ? 1.25 : 1)} ${tBot} L${-hipW * (of.long ? 1.25 : 1)} ${tBot}Z`;
  const tid = `tc${UID}`;
  defs += `<clipPath id="${tid}"><path d="${torso}"/></clipPath>`;
  let t = `<path d="${torso}" fill="${of.top}"/>`;
  if (of.stripes) t += `<path d="${torso}" fill="url(#${pid})"/>`;
  t += `<g clip-path="url(#${tid})">`;
  if (of.robe) t += `<path d="M${-shoulderW * 1.1} ${tTop} L${-shoulderW * 0.35} ${tTop} L${-hipW * 0.5} ${tBot} L${-hipW * 1.3} ${tBot}Z M${shoulderW * 1.1} ${tTop} L${shoulderW * 0.35} ${tTop} L${hipW * 0.5} ${tBot} L${hipW * 1.3} ${tBot}Z" fill="${of.robe}" stroke="${INK}" stroke-width="4"/>`;
  if (of.lapel) {
    t += `<path d="M${-shoulderW * 0.42} ${tTop} L0 ${tTop + r * 1.15} L${shoulderW * 0.42} ${tTop}Z" fill="${of.shirt}"/>`;
    if (of.vest) t += `<path d="M${-shoulderW * 0.36} ${tTop + r * 0.5} L0 ${tTop + r * 1.15} L${shoulderW * 0.36} ${tTop + r * 0.5} L${shoulderW * 0.36} ${tBot} L${-shoulderW * 0.36} ${tBot}Z" fill="${shade(of.top, -0.15)}"/>`;
    t += `<path d="M-${r * 0.1} ${tTop + r * 0.05} L${r * 0.1} ${tTop + r * 0.05} L${r * 0.14} ${tTop + r * 0.95} L0 ${tTop + r * 1.1} L${-r * 0.14} ${tTop + r * 0.95}Z" fill="${of.tie}" stroke="${INK}" stroke-width="3"/>`;
    t += `<path d="M${-shoulderW * 0.42} ${tTop} L${-shoulderW * 0.15} ${tTop + r * 0.95} L${-shoulderW * 0.55} ${tTop + r * 0.35}Z M${shoulderW * 0.42} ${tTop} L${shoulderW * 0.15} ${tTop + r * 0.95} L${shoulderW * 0.55} ${tTop + r * 0.35}Z" fill="${shade(of.top, -0.12)}" stroke="${INK}" stroke-width="3"/>`;
    t += `<circle cx="${-shoulderW * 0.12}" cy="${tTop + r * 1.45}" r="${r * 0.06}" fill="${INK}"/><circle cx="${-shoulderW * 0.12}" cy="${tTop + r * 1.8}" r="${r * 0.06}" fill="${INK}"/>`;
    if (o.pocketSquare !== false) t += `<path d="M${shoulderW * 0.45} ${tTop + r * 0.75} l${r * 0.24} 0 l-${r * 0.06} ${r * 0.14} l-${r * 0.12} -${r * 0.08}Z" fill="#F7F2E6"/>`;
  }
  if (of.cuirass) t += `<path d="M${-shoulderW * 0.55} ${tTop + r * 0.7} Q0 ${tTop + r * 1.0} ${shoulderW * 0.55} ${tTop + r * 0.7} M${-shoulderW * 0.3} ${tTop + r * 1.5} Q0 ${tTop + r * 1.7} ${shoulderW * 0.3} ${tTop + r * 1.5}" stroke="${shade(of.top, -0.35)}" stroke-width="5" fill="none"/>`;
  if (of.scales) for (let yy = tTop + r * 0.3; yy < tBot; yy += r * 0.28) for (let xx = -shoulderW; xx < shoulderW; xx += r * 0.3) t += `<path d="M${xx} ${yy} q${r * 0.15} ${r * 0.25} ${r * 0.3} 0" stroke="${of.scales}" stroke-width="3" fill="none"/>`;
  if (of.trim && of.dress) t += `<path d="M0 ${tTop} V${tBot}" stroke="${of.trim}" stroke-width="${r * 0.14}"/>`;
  if (of.belt2) t += `<rect x="${-hipW}" y="${hipY - r * 0.7}" width="${hipW * 2}" height="${r * 0.16}" fill="${of.belt2}"/>`;
  if (of.kimono) {
    t += `<path d="M${-shoulderW * 0.55} ${tTop} L${shoulderW * 0.35} ${tTop + r * 1.6} L${shoulderW * 0.7} ${tTop + r * 1.6} L${-shoulderW * 0.2} ${tTop}Z" fill="${of.inner}" opacity=".95"/><path d="M${shoulderW * 0.55} ${tTop} L${-shoulderW * 0.1} ${tTop + r * 1.15}" stroke="${of.inner}" stroke-width="${r * 0.14}"/><path d="M${-shoulderW * 0.5} ${tTop} L${shoulderW * 0.4} ${tTop + r * 1.6}" stroke="${INK}" stroke-width="3"/>`;
    if (of.obi) t += `<rect x="${-hipW * 1.3}" y="${hipY - r * 0.55}" width="${hipW * 2.6}" height="${r * 0.42}" fill="${of.obi}" stroke="${INK}" stroke-width="3"/>`;
    if (of.kesa) t += `<path d="M${-shoulderW} ${tTop + r * 1.8} L${shoulderW * 0.6} ${tTop} L${shoulderW} ${tTop + r * 0.3} L${-shoulderW * 0.6} ${tTop + r * 2.4}Z" fill="${of.kesa}" stroke="${INK}" stroke-width="3"/>`;
    if (of.armor) t += Array.from({ length: 5 }, (_, i) => `<rect x="${-shoulderW}" y="${tTop + r * (0.5 + i * 0.36)}" width="${shoulderW * 2}" height="${r * 0.3}" fill="${of.armor}" stroke="${INK}" stroke-width="3"/>`).join('');
  }
  if (of.suspenders) t += `<path d="M${-shoulderW * 0.5} ${tTop} L${-shoulderW * 0.4} ${tBot} M${shoulderW * 0.5} ${tTop} L${shoulderW * 0.4} ${tBot}" stroke="${of.suspenders}" stroke-width="${r * 0.12}"/>`;
  if (of.vestOpen) t += `<path d="M${-shoulderW} ${tTop} L${-shoulderW * 0.25} ${tTop} L${-shoulderW * 0.3} ${tBot} L${-shoulderW} ${tBot}Z M${shoulderW} ${tTop} L${shoulderW * 0.25} ${tTop} L${shoulderW * 0.3} ${tBot} L${shoulderW} ${tBot}Z" fill="${of.vestOpen}"/>`;
  if (of.vest && !of.lapel) t += `<path d="M${-shoulderW * 0.75} ${tTop + r * 0.2} L0 ${tTop + r * 0.9} L${shoulderW * 0.75} ${tTop + r * 0.2} L${shoulderW * 0.8} ${tBot} L${-shoulderW * 0.8} ${tBot}Z" fill="${of.vest}"/>`;
  if (of.apronLong) t += `<rect x="${-hipW * 0.8}" y="${hipY - r * 0.2}" width="${hipW * 1.6}" height="${r * 2}" fill="${of.apronLong}"/>`;
  if (of.buttons) t += [0, 1, 2, 3].map(i => `<circle cx="0" cy="${tTop + r * (0.4 + i * 0.45)}" r="${r * 0.07}" fill="${of.buttons}"/>`).join('') + `<rect x="${-hipW}" y="${hipY - r * 0.25}" width="${hipW * 2}" height="${r * 0.22}" fill="${of.belt}"/>`;
  if (of.number) t += `<rect x="${shoulderW * 0.15}" y="${tTop + r * 0.55}" width="${r * 0.75}" height="${r * 0.42}" fill="#F3EEE2" stroke="${INK}" stroke-width="3"/><text x="${shoulderW * 0.15 + r * 0.375}" y="${tTop + r * 0.88}" font-family="Oswald" font-weight="700" font-size="${r * 0.34}" text-anchor="middle" fill="${INK}">${o.number || '85'}</text>`;
  if (of.collar) t += `<path d="M${-shoulderW * 0.5} ${tTop} Q0 ${tTop + r * 0.5} ${shoulderW * 0.5} ${tTop}" fill="${of.collar}" stroke="${INK}" stroke-width="3"/>`;
  if (o.outfit === 'pajamas') t += `<path d="M0 ${tTop} L0 ${tBot}" stroke="${INK}" stroke-width="3"/>`;
  t += `<path d="M${shoulderW * 0.35} ${tTop - 10} Q${shoulderW * 0.7} ${(tTop + tBot) / 2} ${shoulderW * 0.4} ${tBot + 10} L${shoulderW * 1.6} ${tBot + 10} L${shoulderW * 1.6} ${tTop - 10}Z" fill="#1A0E08" opacity=".22"/>`;
  t += `</g><path d="${torso}" fill="none" ${OL()}/>`;
  if (of.belt && !of.buttons) t += '';
  // arms
  let arms = '';
  const armLen = (hipY - neckY) * (k === 'kid' ? 0.95 : 0.98);
  const sleeve = (of.rolled && !of.lapel) ? of.top : of.top;
  const hands = [];
  for (const [i, sx] of [[0, -1], [1, 1]]) {
    const [a1, a2] = i === 0 ? la : ra;
    const x0 = sx * shoulderW * 0.92, y0 = tTop + r * 0.3;
    const A1 = a1 * Math.PI / 180, A2 = (a1 + a2) * Math.PI / 180;
    const ex = x0 + Math.sin(A1) * armLen * 0.52, ey = y0 + Math.cos(A1) * armLen * 0.52;
    const lo = { x2: ex + Math.sin(A2) * armLen * 0.5, y2: ey + Math.cos(A2) * armLen * 0.5 };
    const pth = `M${x0} ${y0} L${ex} ${ey} L${lo.x2} ${lo.y2}`;
    const sc = of.robe || sleeve, lc = of.rolled ? o.skinColor : sc;
    arms += `<path d="${pth}" fill="none" stroke="${INK}" stroke-width="${armW + 10}" stroke-linecap="round" stroke-linejoin="round"/>`;
    arms += `<path d="M${ex} ${ey} L${lo.x2} ${lo.y2}" fill="none" stroke="${lc}" stroke-width="${armW * 0.95}" stroke-linecap="round"/>`;
    arms += `<path d="M${x0} ${y0} L${ex} ${ey}" fill="none" stroke="${sc}" stroke-width="${armW}" stroke-linecap="round"/>`;
    if (!of.rolled) { const cx = ex + (lo.x2 - ex) * 0.78, cy = ey + (lo.y2 - ey) * 0.78; arms += `<path d="M${cx} ${cy} L${ex + (lo.x2 - ex) * 0.82} ${ey + (lo.y2 - ey) * 0.82}" stroke="${of.shirt || shade(sc, 0.35)}" stroke-width="${armW * 1.02}" stroke-linecap="butt"/>`; }
    hands.push([lo.x2, lo.y2]);
    arms += `<circle cx="${lo.x2}" cy="${lo.y2}" r="${armW * 0.7}" fill="${o.skinColor}" ${OL(4)}/>`;
  }
  if (o.ring) arms += `<circle cx="${hands[1][0] + 4}" cy="${hands[1][1] + 2}" r="${armW * 0.18}" fill="#CFE8FF" stroke="${INK}" stroke-width="2"/>`;
  if (o.cigar) { const [hx, hy] = hands[1]; arms += `<rect x="${hx - 6}" y="${hy - armW * 0.2}" width="${r * 0.55}" height="${r * 0.13}" rx="4" fill="#6A3E26" ${OL(3)}/><circle cx="${hx - 6 + r * 0.55}" cy="${hy - armW * 0.2 + r * 0.065}" r="${r * 0.06}" fill="#F08A3A"/>`; }
  if (o.holding) { const [hx, hy] = o.holdHand === 'left' ? hands[0] : hands[1]; arms += `<g transform="translate(${hx} ${hy})">${o.holding}</g>`; }
  if (o.holdL) { const [hx, hy] = hands[0]; arms += `<g transform="translate(${hx} ${hy})">${o.holdL}</g>`; }
  const neck = `<rect x="${-r * 0.28}" y="${neckY - r * 0.3}" width="${r * 0.56}" height="${r * 0.5}" fill="${o.skinColor}" ${OL(4)}/>`;
  return { defs, s: s + neck + t + arms, neckY };
}

// ---------- full character ----------
export function char(o) {
  o = { expr: 'neutral', age: 'adult', hair: 'short', hairColor: '#2A1C14', hatColor: '#9B9AA0', ...o };
  o.skinColor = SKIN[o.skin] || o.skin || SKIN.olive;
  const H = o.h || ({ adult: 470, teen: 400, kid: 330, baby: 150 }[o.age]);
  o.h = H;
  const r = o.r || ({ adult: 0.16, teen: 0.18, kid: 0.215 }[o.age] || 0.16) * H * (o.heavy ? 1.05 : 1);
  o.r = r;
  if (o.age === 'baby') return babyChar(o);
  const b = body(o);
  const headY = b.neckY - r * 0.78;
  let s = `<defs>${b.defs}</defs>`;
  s += `<ellipse cx="0" cy="4" rx="${r * 1.6}" ry="${r * 0.28}" fill="#000" opacity=".25"/>`;
  s += b.s;
  s += `<g transform="translate(0 ${headY}) rotate(${o.tilt || 0})">${head(o)}</g>`;
  return s;
}
function babyChar(o) {
  const r = o.h * 0.38;
  let s = `<ellipse cx="0" cy="4" rx="${r * 1.5}" ry="${r * 0.25}" fill="#000" opacity=".2"/>`;
  s += `<path d="M${-r * 1.3} 0 Q${-r * 1.5} ${-r * 1.3} 0 ${-r * 1.3} Q${r * 1.5} ${-r * 1.3} ${r * 1.3} 0Z" fill="${o.blanket || '#D9C9A8'}" ${OL()}/>`;
  s += `<g transform="translate(0 ${-r * 1.45})">${head({ ...o, r: r * 0.85, age: 'baby', hair: o.hair || 'tuft' })}</g>`;
  return s;
}
// place: wrap with translate/scale/flip
export function put(svg, x, y, s = 1, flip = false) { return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${svg}</g>`; }
