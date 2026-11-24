// Money Encode scene library: flat, Montserrat, per-video palette (car wash blue), lime for money/answers.
import fs from 'fs';
const FONT = 'file:///home/claude/ce/tools/node_modules/@fontsource/montserrat/files';
export const C = { ink: '#0B0F09', panel: '#141B12', paper: '#F1EEE5', lime: '#C5EE3C', blue: '#3AA0FF', deep: '#0E2F52',
  sky: '#BFE3FF', red: '#FF5B4A', gray: '#8D9488', dim: '#5B6357', white: '#FFFFFF', amber: '#FFC93C' };
export const MAP = JSON.parse(fs.readFileSync(new URL('./usmap.json', import.meta.url)));

const css = `
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-500-normal.woff2);font-weight:500}
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-800-normal.woff2);font-weight:800}
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-900-normal.woff2);font-weight:900}
*{box-sizing:border-box;margin:0;padding:0;animation-play-state:paused!important}
html,body{width:1920px;height:1080px;overflow:hidden;font-family:M,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:absolute;inset:0;overflow:hidden}
.cam{position:absolute;inset:0;transform-origin:50% 50%}
.a{position:absolute}
.t{font-weight:800;letter-spacing:-0.02em;line-height:1.05}
.k{font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:26px}
.mark{position:absolute;right:54px;bottom:44px;display:flex;align-items:center;gap:14px;opacity:.9;z-index:50}
.mark i{display:grid;grid-template-columns:repeat(3,7px);grid-template-rows:repeat(5,7px);gap:2px}
.mark i b{width:7px;height:7px;background:${C.lime}}.mark i b.o{background:transparent}
.mark span{font-weight:800;font-size:18px;letter-spacing:.18em;color:${C.gray}}
.src{position:absolute;left:64px;bottom:44px;font-size:19px;font-weight:600;color:${C.gray};max-width:1300px;z-index:50}
@keyframes up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes down{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes out{from{opacity:1}to{opacity:0}}
@keyframes pop{0%{opacity:0;transform:scale(.6)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes left{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:none}}
@keyframes right{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:none}}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes wipeu{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes growy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
@keyframes stampin{0%{opacity:0;transform:scale(2.2) rotate(-8deg)}60%{opacity:1;transform:scale(.95) rotate(-8deg)}100%{opacity:1;transform:scale(1) rotate(-8deg)}}
@keyframes drive{from{transform:translateX(-700px)}to{transform:translateX(2300px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ring{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.6);opacity:0}}
@keyframes strike{from{width:0}to{width:100%}}
@keyframes drip{0%{transform:translateY(-40px);opacity:0}20%{opacity:1}100%{transform:translateY(260px);opacity:0}}
`;

let D = 0; // scene start (absolute seconds), set by page()
export const at = (abs) => Math.max(0, +(abs - D).toFixed(3));
// anim(name, absTime, dur, ease) -> CSS animation string
export const an = (n, t, dur = 0.6, e = 'cubic-bezier(.2,.8,.2,1)') => `${n} ${dur}s ${e} ${at(t)}s both`;
const pos = (o) => Object.entries(o).filter(([k]) => ['left', 'top', 'right', 'bottom', 'width', 'height'].includes(k)).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';');

export function el(html, o = {}) {
  const anims = [];
  if (o.in !== undefined) anims.push(an(o.fx || 'up', o.in, o.dur || 0.6));
  if (o.out !== undefined) anims.push(an('out', o.out, 0.35, 'linear'));
  const st = [pos(o), anims.length ? `animation:${anims.join(',')}` : '', o.style || ''].filter(Boolean).join(';');
  return `<div class="a ${o.cls || ''}" style="${st}">${html}</div>`;
}
export const text = (s, o = {}) => el(`<div class="t" style="font-size:${o.size || 72}px;color:${o.color || C.paper};font-weight:${o.w || 800};text-align:${o.align || 'left'};${o.css || ''}">${s}</div>`, o);
export const kicker = (s, o = {}) => el(`<div class="k" style="color:${o.color || C.blue}">${s}</div>`, { left: 120, top: 110, ...o });
export const src = (s) => `<div class="src">Source: ${s}</div>`;
export const hl = (s, c = C.lime) => `<span style="color:${c}">${s}</span>`;

// counting number; value rendered by __seek
export function count(o) {
  const { from = 0, to, dec = 0, pre = '', suf = '', size = 200, color = C.lime, t, dur = 1.4, comma = true } = o;
  return el(`<div class="t" data-count='${JSON.stringify({ from, to, dec, pre, suf, t: at(t), dur, comma })}' style="font-size:${size}px;color:${color};font-weight:900;white-space:nowrap">${pre}${to}${suf}</div>`, { in: t, fx: 'pop', dur: .5, ...o });
}

export function doc(o) {
  // a real document excerpt (exact short quote), neutral styling, highlighter on line o.hl at o.hlAt
  const { issuer, date, title, lines, hlIdx = -1, hlAt, w = 980, kind = 'PRESS RELEASE' } = o;
  const L = lines.map((l, i) => {
    const h = i === hlIdx ? `<b style="position:absolute;left:-8px;right:-8px;top:2px;bottom:2px;background:${C.lime};opacity:.85;transform-origin:left;animation:${an('grow', hlAt, .7)}"></b>` : '';
    return `<div style="position:relative;font-size:30px;line-height:1.45;color:#22261F;font-weight:${i === hlIdx ? 700 : 500};margin:6px 0">${h}<span style="position:relative">${l}</span></div>`;
  }).join('');
  return el(`<div style="width:${w}px;background:${C.paper};padding:54px 64px 60px;border-radius:6px;box-shadow:0 30px 0 rgba(0,0,0,.25)">
    <div style="display:flex;justify-content:space-between;font-size:20px;font-weight:800;letter-spacing:.16em;color:#6B7065">${kind}<span>${date}</span></div>
    <div style="height:3px;background:#22261F;margin:18px 0 26px"></div>
    <div style="font-size:24px;font-weight:700;color:#6B7065;margin-bottom:6px">${issuer}</div>
    <div style="font-size:40px;font-weight:800;color:#11140F;line-height:1.15;margin-bottom:22px">${title}</div>${L}</div>`, { fx: 'up', ...o });
}

export function headline(o) {
  const { outlet, date, text: tx, w = 1100 } = o;
  return el(`<div style="width:${w}px;background:${C.white};padding:40px 52px;border-left:14px solid ${o.bar || C.blue}">
    <div style="display:flex;justify-content:space-between;font-size:22px;font-weight:800;letter-spacing:.12em;color:#555;text-transform:uppercase">${outlet}<span>${date}</span></div>
    <div style="font-size:52px;font-weight:800;color:#111;line-height:1.12;margin-top:16px">${tx}</div></div>`, { fx: 'left', ...o });
}

export function person(o) {
  const { name, role, initials, size = 300, color = C.blue } = o;
  return el(`<div style="display:flex;align-items:center;gap:44px">
   <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:${size * .36}px;font-weight:900;color:${C.ink}">${initials}</div>
   <div><div class="t" style="font-size:64px;color:${C.paper}">${name}</div><div style="font-size:32px;font-weight:600;color:${C.gray};margin-top:12px">${role}</div></div></div>`, { fx: 'left', ...o });
}

export function usmap(o) {
  const { x = 300, y = 150, scale = 1, pins = [], states = [], stateAt, color = C.panel } = o;
  const st = states.map(s => { const n = typeof s === 'string' ? s : s.s, t = typeof s === 'string' ? (stateAt ?? o.in) : s.t;
    return `<path d="${MAP.states[n]}" fill="${C.blue}" style="opacity:0;animation:${an('fade', t, .6)}"/>`; }).join('');
  const pn = pins.map(p => {
    const [px, py] = MAP.pts[p.city];
    const lx = p.dx ?? 26, ly = p.dy ?? -18;
    return `<g transform="translate(${px},${py})"><g style="animation:${an('pop', p.t, .5)};transform-box:fill-box;transform-origin:center">
      <circle r="34" fill="none" stroke="${p.color || C.lime}" stroke-width="5" style="transform-box:fill-box;transform-origin:center;animation:${an('ring', p.t + .1, 1.4, 'ease-out')}"/>
      <circle r="16" fill="${p.color || C.lime}"/></g>
      <text x="${lx}" y="${ly}" font-family="M" font-weight="800" font-size="34" fill="${C.paper}" style="animation:${an('fade', p.t + .15, .4)}">${p.label}</text></g>`;
  }).join('');
  return el(`<svg width="${1300 * scale}" height="${820 * scale}" viewBox="0 0 1300 820"><path d="${MAP.nation}" fill="${color}" stroke="${C.dim}" stroke-width="2"/>${st}<path d="${MAP.borders}" fill="none" stroke="#2A3326" stroke-width="1.5"/>${pn}</svg>`, { left: x, top: y, fx: 'fade', ...o });
}

export function kiosk(o) {
  const { single = '$15', plan = '$25', tapAt } = o;
  return el(`<svg width="760" height="900" viewBox="0 0 760 900">
   <rect x="160" y="40" width="440" height="820" rx="30" fill="#232B20"/><rect x="190" y="80" width="380" height="460" rx="12" fill="${C.deep}"/>
   <text x="380" y="140" text-anchor="middle" font-family="M" font-weight="800" font-size="30" fill="${C.sky}">CHOOSE YOUR WASH</text>
   <rect x="215" y="175" width="330" height="120" rx="12" fill="#1C4E80"/>
   <text x="240" y="225" font-family="M" font-weight="700" font-size="28" fill="${C.paper}">Single wash</text>
   <text x="240" y="272" font-family="M" font-weight="900" font-size="44" fill="${C.paper}">${single}</text>
   <rect x="215" y="315" width="330" height="190" rx="12" fill="${C.lime}"/>
   <text x="240" y="365" font-family="M" font-weight="800" font-size="28" fill="${C.ink}">UNLIMITED</text>
   <text x="240" y="440" font-family="M" font-weight="900" font-size="64" fill="${C.ink}">${plan}</text>
   <text x="240" y="480" font-family="M" font-weight="700" font-size="26" fill="${C.ink}">per month</text>
   <rect x="300" y="600" width="160" height="16" rx="8" fill="#0E120C"/><rect x="250" y="660" width="260" height="140" rx="14" fill="#2E382A"/>
   ${tapAt !== undefined ? `<g style="animation:${an('pop', tapAt, .35)};transform-box:fill-box;transform-origin:center"><circle cx="470" cy="420" r="38" fill="none" stroke="${C.white}" stroke-width="6" style="transform-box:fill-box;transform-origin:center;animation:${an('ring', tapAt + .05, 1.0, 'ease-out')}"/><circle cx="470" cy="420" r="18" fill="${C.white}"/></g>` : ''}
  </svg>`, { fx: 'up', ...o });
}

export function car(color = C.blue, w = 380) {
  return `<svg width="${w}" height="${w * .42}" viewBox="0 0 380 160"><path d="M30 110 L60 60 Q70 45 95 45 L250 45 Q275 45 295 65 L330 100 L355 108 Q370 112 370 126 L370 132 L20 132 L20 122 Q20 112 30 110Z" fill="${color}"/>
  <path d="M95 60 L150 60 L150 98 L72 98Z M165 60 L245 60 Q262 60 280 80 L295 98 L165 98Z" fill="${C.sky}"/>
  <circle cx="95" cy="132" r="26" fill="#1A1F17"/><circle cx="95" cy="132" r="11" fill="${C.gray}"/><circle cx="290" cy="132" r="26" fill="#1A1F17"/><circle cx="290" cy="132" r="11" fill="${C.gray}"/></svg>`;
}
export function tunnel(o) {
  const { t0, n = 4, speed = 6, sign = 'EXPRESS WASH' } = o;
  const cars = Array.from({ length: n }, (_, i) => `<div class="a" style="left:0;top:560px;animation:drive ${speed}s linear ${(at(t0) - i * speed / n).toFixed(2)}s infinite both">${car([C.blue, C.red, C.paper, C.amber][i % 4], 360)}</div>`).join('');
  const drops = Array.from({ length: 14 }, (_, i) => `<div class="a" style="left:${640 + i * 46}px;top:300px;width:8px;height:30px;border-radius:4px;background:${C.sky};animation:drip 1.2s linear ${(at(t0) - i * .17).toFixed(2)}s infinite both"></div>`).join('');
  return el(`<div style="position:relative;width:1920px;height:1080px">
   <div class="a" style="left:0;top:712px;width:1920px;height:12px;background:#273022"></div>
   ${cars}
   <div class="a" style="left:600px;top:250px;width:720px;height:470px;background:${C.deep};border-radius:20px 20px 0 0;opacity:.94"></div>
   <div class="a" style="left:640px;top:290px;width:640px;height:430px;background:#123E6A;border-radius:12px 12px 0 0"></div>
   ${drops}
   <div class="a" style="left:690px;top:180px;width:540px;height:100px;background:${C.lime};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;color:${C.ink};letter-spacing:.06em">${sign}</div>
  </div>`, { left: 0, top: 0, fx: 'fade', in: t0, dur: .5 });
}

export function bars(o) {
  const { items, max, x = 220, y = 260, h = 520, bw = 220, gap = 120, unit = '' } = o;
  return items.map((it, i) => {
    const bh = Math.max(6, h * it.value / max), left = x + i * (bw + gap);
    return el(`<div style="position:absolute;left:0;top:${h - bh}px;width:${bw}px;height:${bh}px;background:${it.color || C.blue};transform-origin:bottom;animation:${an('growy', it.t, .8)}"></div>
     <div class="t" style="position:absolute;top:${h - bh - 86}px;width:${bw}px;text-align:center;font-size:56px;color:${it.color || C.blue};animation:${an('fade', it.t + .5, .4)}">${it.show || it.value + unit}</div>
     <div style="position:absolute;top:${h + 24}px;width:${bw + 80}px;margin-left:-40px;text-align:center;font-size:28px;font-weight:700;color:${C.paper};animation:${an('fade', it.t, .4)}">${it.label}</div>`,
      { left, top: y, width: bw, height: h });
  }).join('');
}

export function cardStack(o) {
  const { items, x = 120, y = 250, w = 540, gap = 40 } = o;
  return items.map((it, i) => el(`<div style="width:${w}px;height:${o.h || 520}px;background:${C.paper};border-radius:8px;padding:36px 38px;position:relative">
   <div style="font-size:20px;font-weight:800;letter-spacing:.14em;color:#6B7065">${it.top}</div>
   <div style="font-size:40px;font-weight:900;color:${C.ink};line-height:1.1;margin:14px 0 18px">${it.title}</div>
   <div style="font-size:27px;font-weight:600;color:#33382F;line-height:1.38">${it.body}</div>
   ${it.stamp ? `<div style="position:absolute;right:26px;bottom:28px;border:5px solid ${it.stampColor || C.red};color:${it.stampColor || C.red};font-weight:900;font-size:26px;letter-spacing:.12em;padding:8px 16px;animation:${an('stampin', it.t + .8, .45)}">${it.stamp}</div>` : ''}
  </div>`, { left: x + i * (w + gap), top: y, in: it.t, fx: 'up' })).join('');
}

export function stamp(s, o = {}) {
  return el(`<div style="border:8px solid ${o.color || C.red};color:${o.color || C.red};font-weight:900;font-size:${o.size || 70}px;letter-spacing:.1em;padding:14px 34px;transform:rotate(-8deg)">${s}</div>`, { fx: 'stampin', dur: .45, ...o });
}

export function line(o) { // horizontal rule growing
  return el(`<div style="width:${o.w}px;height:${o.th || 8}px;background:${o.color || C.lime};transform-origin:left;animation:${an('grow', o.t, o.dur || .7)}"></div>`, { left: o.left, top: o.top });
}

export function page(o) {
  D = o.start;
  const camAnim = o.cam === false ? '' : `animation:${o.camName || 'drift'} ${Math.max(o.dur, 1).toFixed(2)}s linear 0s both`;
  const camKF = `@keyframes drift{from{transform:scale(1)}to{transform:scale(${o.zoom || 1.035})}}@keyframes push{from{transform:scale(1)}to{transform:scale(${o.zoom || 1.12}) translate(${o.tx || 0}px,${o.ty || 0}px)}}`;
  const body = typeof o.body === 'function' ? o.body() : o.body;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}${camKF}</style></head>
<body style="background:${o.bg || C.ink}"><div class="stage"><div class="cam" style="${camAnim}">${body}</div>
${o.mark === false ? '' : `<div class="mark"><i>${dollar}</i><span>MONEY ENCODE</span></div>`}${o.src ? src(o.src) : ''}</div>
<script>
const ease=x=>1-Math.pow(1-x,3);
function fmt(v,c){let s=v.toFixed(c.dec);if(c.comma){const p=s.split('.');p[0]=p[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g,',');s=p.join('.')}return c.pre+s+c.suf}
window.__seek=(t)=>{document.getAnimations().forEach(a=>{a.currentTime=t*1000});
document.querySelectorAll('[data-count]').forEach(e=>{const c=JSON.parse(e.dataset.count);const p=Math.min(1,Math.max(0,(t-c.t)/c.dur));e.textContent=fmt(c.from+(c.to-c.from)*ease(p),c)})};
</script></body></html>`;
}
// 3x5 pixel dollar mark
const DOLLAR = ['XXX', 'X..', 'XXX', '..X', 'XXX'].join('').split('').map(ch => `<b class="${ch === 'X' ? '' : 'o'}"></b>`).join('');
const dollar = DOLLAR;
