// Lived It scene kit: flat 2D illustration, thick dark outlines, warm steppe palette. All drawings original.
const FONT = 'file:///home/claude/ce/tools/node_modules/@fontsource/montserrat/files';
const ANTON = 'file:///home/claude/ce/tools/fonts/Anton.ttf';
export const C = {
  ink: '#2A1E16', cream: '#F4E6C8', paper: '#EFE0BE', sand: '#E3C48E', sky: '#F2D9A8', skyHi: '#F7E7C4',
  dusk: '#E8955A', duskHi: '#F2B978', night: '#1D2638', nightHi: '#2B3A55', grass: '#9AA65E', grass2: '#7E8C47', grass3: '#5F6E35',
  hill: '#B9A46A', mtn: '#8C7F67', mtnD: '#6E6352', river: '#5F8FA8', riverHi: '#8DB6C8', red: '#B63A2A', redD: '#8C2A1F',
  blue: '#2F4A6D', blueL: '#4A6E96', ochre: '#C98B2E', gold: '#E2B43C', brown: '#7A4B2A', brownL: '#A26A3E', skin: '#E2A878',
  skinD: '#C98A5C', hair: '#2A1E16', white: '#FBF4E4', gray: '#8E8579', green: '#5C7A3A', felt: '#EFE3C9', feltD: '#D6C6A4',
  blood: '#9E1B14', shadow: 'rgba(42,30,22,.18)'
};
const O = `stroke="${C.ink}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
const O4 = `stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

const css = `
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:M;src:url(${FONT}/montserrat-latin-800-normal.woff2);font-weight:800}
@font-face{font-family:A;src:url(${ANTON})}
*{box-sizing:border-box;margin:0;padding:0;animation-play-state:paused!important}
html,body{width:1920px;height:1080px;overflow:hidden;font-family:M,sans-serif}
.stage{position:absolute;inset:0;overflow:hidden}.cam{position:absolute;inset:0;transform-origin:50% 55%}
.a{position:absolute}
svg .g{transform-box:fill-box;transform-origin:center}
.mark{position:absolute;left:40px;top:32px;z-index:60;display:flex;align-items:center;gap:10px;font-family:A;font-size:28px;letter-spacing:.06em;color:${C.cream};background:rgba(42,30,22,.78);padding:6px 16px 6px 8px;border-radius:30px}
.mark b{width:26px;height:26px;border-radius:50%;background:${C.red};border:3px solid ${C.cream};display:inline-block}
@keyframes up{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes down{from{opacity:0;transform:translateY(-60px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes out{from{opacity:1}to{opacity:0}}
@keyframes pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@keyframes left{from{opacity:0;transform:translateX(-260px)}to{opacity:1;transform:none}}
@keyframes right{from{opacity:0;transform:translateX(260px)}to{opacity:1;transform:none}}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes stampin{0%{opacity:0;transform:scale(2.4) rotate(-7deg)}60%{opacity:1;transform:scale(.94) rotate(-7deg)}100%{opacity:1;transform:scale(1) rotate(-7deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes gallop{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-14px) rotate(-2deg)}75%{transform:translateY(-4px) rotate(1.5deg)}}
@keyframes flicker{0%,100%{transform:scaleY(1) scaleX(1)}30%{transform:scaleY(1.12) scaleX(.94)}60%{transform:scaleY(.92) scaleX(1.05)}}
@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes ride{from{transform:translateX(var(--from,-600px))}to{transform:translateX(var(--to,2400px))}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-120px)}}
@keyframes shake{0%,100%{transform:translate(0,0)}20%{transform:translate(-8px,4px)}40%{transform:translate(7px,-5px)}60%{transform:translate(-5px,-3px)}80%{transform:translate(4px,5px)}}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes rise{from{transform:translateY(0);opacity:.9}to{transform:translateY(-220px);opacity:0}}
@keyframes zoomin{from{transform:scale(1.25)}to{transform:scale(1)}}
`;

let D = 0;
export const at = (abs) => +(abs - D).toFixed(3);
export const an = (n, t, dur = 0.6, e = 'cubic-bezier(.2,.8,.2,1)', extra = 'both') => `${n} ${dur}s ${e} ${at(t)}s ${extra}`;
export const loop = (n, dur, delay = 0) => `${n} ${dur}s ease-in-out ${(-delay).toFixed(2)}s infinite both`;
// wrap svg content in an animated group: g(svg, {in, fx, dur, out, loop, x, y, s, flip, rot})
export function g(inner, o = {}) {
  const anims = [];
  if (o.in !== undefined) anims.push(an(o.fx || 'pop', o.in, o.dur || 0.6));
  if (o.out !== undefined) anims.push(an('out', o.out, 0.3, 'linear'));
  if (o.loop) anims.push(o.loop);
  const tr = `${o.s ? `scale(${o.s})` : ''}${o.flip ? ' scale(-1 1)' : ''}${o.rot ? ` rotate(${o.rot})` : ''}`;
  const st = `${anims.length ? `animation:${anims.join(',')};` : ''}${o.style || ''}`;
  return `<g transform="translate(${o.x || 0} ${o.y || 0})"><g class="g" style="${st}"><g transform="${tr}">${inner}</g></g></g>`;
}
export const svg = (inner, o = {}) => `<svg class="a" style="left:0;top:0;${o.style || ''}" width="1920" height="1080" viewBox="0 0 1920 1080">${inner}</svg>`;

// ---------- backgrounds ----------
export function sky(mode = 'day', o = {}) {
  const top = { day: C.skyHi, dusk: C.duskHi, night: C.nightHi, dawn: '#E9C9A9' }[mode], low = { day: C.sky, dusk: C.dusk, night: C.night, dawn: '#D9A98A' }[mode];
  let s = `<rect width="1920" height="1080" fill="${low}"/><rect width="1920" height="380" fill="${top}"/><rect y="380" width="1920" height="120" fill="${top}" opacity=".5"/>`;
  if (mode === 'night') s += Array.from({ length: 46 }, (_, i) => `<circle cx="${(i * 397) % 1900 + 10}" cy="${(i * 173) % 520 + 20}" r="${i % 5 ? 2.5 : 4}" fill="${C.cream}" style="animation:${loop('twinkle', 2 + (i % 4), i * .37)}"/>`).join('');
  if (o.moon) s += `<circle cx="${o.moon[0]}" cy="${o.moon[1]}" r="70" fill="${C.cream}" ${O}/><circle cx="${o.moon[0] - 20}" cy="${o.moon[1] - 12}" r="12" fill="${C.feltD}"/><circle cx="${o.moon[0] + 22}" cy="${o.moon[1] + 18}" r="8" fill="${C.feltD}"/>`;
  if (o.sun) s += `<circle cx="${o.sun[0]}" cy="${o.sun[1]}" r="80" fill="${mode === 'dusk' ? '#F7D08A' : '#FBEBC0'}"/>`;
  if (o.clouds !== false && mode !== 'night') s += `<g style="animation:drift 40s linear ${-(o.t0 || 0)}s both">${cloud(300, 170, 1)}${cloud(1250, 120, .8)}${cloud(1700, 230, .6)}</g>`;
  return s;
}
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".85"><path d="M0 40 Q10 0 60 10 Q90 -20 140 8 Q190 0 200 40 Z" fill="${C.cream}"/></g>`;
export function hills(mode = 'day', o = {}) {
  const k = mode === 'night' ? .45 : mode === 'dusk' ? .8 : 1;
  const col = (c) => mix(c, '#1D2638', 1 - k);
  const far = `<path d="M0 560 Q240 470 520 530 T1040 510 T1560 530 T1920 500 V1080 H0Z" fill="${col(o.far || C.hill)}"/>`;
  const mid = `<path d="M0 650 Q300 580 640 630 T1300 610 T1920 640 V1080 H0Z" fill="${col(C.grass)}" ${O4}/>`;
  const near = `<path d="M0 800 Q360 740 760 790 T1500 770 T1920 790 V1080 H0Z" fill="${col(C.grass2)}" ${O4}/>`;
  const tufts = Array.from({ length: 14 }, (_, i) => `<path d="M${80 + i * 135} ${880 + (i % 3) * 40} l8 -26 l8 26 l8 -18 l6 18" fill="none" stroke="${col(C.grass3)}" stroke-width="5" stroke-linecap="round"/>`).join('');
  return far + (o.mountain ? mountain(o.mountain, col) : '') + mid + (o.river ? river(col) : '') + near + tufts;
}
function mountain(x, col) {
  return `<path d="M${x - 420} 600 L${x - 120} 260 L${x - 40} 330 L${x + 60} 210 L${x + 420} 600Z" fill="${col(C.mtn)}" ${O}/><path d="M${x - 120} 260 L${x - 60} 330 L${x - 40} 330 L${x + 10} 270 L${x + 60} 210 L${x + 110} 290 L${x + 40} 280 L${x - 20} 350 L${x - 90} 300Z" fill="${C.cream}" opacity=".85"/>`;
}
function river(col) {
  return `<path d="M-20 720 Q400 680 760 720 T1500 700 T1940 715 L1940 770 Q1500 760 1100 780 T380 770 T-20 780Z" fill="${col(C.river)}" ${O4}/><path d="M200 735 h90 M640 742 h70 M1180 728 h110 M1600 735 h60" stroke="${C.riverHi}" stroke-width="6" stroke-linecap="round"/>`;
}
function mix(a, b, t) { const p = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }

export function bgSteppe(mode = 'day', o = {}) { return sky(mode, o) + hills(mode, o); }
export const ground = (y = 900, c = C.grass2) => `<rect y="${y}" width="1920" height="${1080 - y}" fill="${c}"/>`;
export const shadowE = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .16}" fill="${C.shadow}"/>`;

// ---------- objects ----------
export function ger(o = {}) { // centered at 0,0 bottom middle, width ~420
  const c = o.color || C.felt;
  return `${shadowE(0, 0, 240)}<path d="M-200 0 V-150 H200 V0Z" fill="${c}" ${O}/><path d="M-220 -150 Q0 -330 220 -150Z" fill="${c}" ${O}/>
  <path d="M-200 -110 H200 M-200 -70 H200" stroke="${C.feltD}" stroke-width="6"/><path d="M-130 -160 Q0 -250 130 -160" fill="none" stroke="${C.red}" stroke-width="10"/>
  <rect x="-48" y="-120" width="96" height="120" fill="${o.door || C.red}" ${O}/><path d="M-30 -100 h60 M-30 -70 h60 M-30 -40 h60" stroke="${C.gold}" stroke-width="5"/>
  <rect x="-30" y="-252" width="60" height="16" rx="4" fill="${C.brown}" ${O4}/>${o.smoke ? smoke(0, -262) : ''}`;
}
const smoke = (x, y) => [0, 1, 2].map(i => `<circle cx="${x + i * 8}" cy="${y}" r="${18 - i * 3}" fill="${C.cream}" opacity=".7" style="transform-box:fill-box;animation:rise 3s linear ${-i}s infinite both"/>`).join('');
export function goldTent(o = {}) { return ger({ color: C.gold, door: C.redD, smoke: o.smoke }); }

export function horse(o = {}) { // facing right, hooves at y=0, ~ 360 wide
  const c = o.color || C.brownL, d = o.mane || C.ink;
  const legs = [[-110, 1], [-70, -1], [70, 1], [110, -1]].map(([x, k]) => `<path d="M${x} -110 L${x + k * 6} -20 L${x + k * 6 + 4} 0" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M${x} -110 L${x + k * 6} -20" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/>`).join('');
  return `${shadowE(0, 4, 190)}${legs}<path d="M-150 -170 Q-160 -230 -100 -230 L80 -232 Q130 -232 140 -200 L150 -150 Q140 -110 100 -105 L-120 -105 Q-155 -110 -150 -170Z" fill="${c}" ${O}/>
   <path d="M95 -220 L150 -330 Q165 -360 195 -350 L250 -300 Q262 -280 240 -270 L200 -275 L170 -200Z" fill="${c}" ${O}/>
   <path d="M150 -330 Q120 -300 105 -230" fill="none" stroke="${d}" stroke-width="22" stroke-linecap="round"/><circle cx="198" cy="-318" r="7" fill="${C.ink}"/>
   <path d="M175 -352 l8 -26 l14 22" fill="${c}" ${O4}/><path d="M-150 -200 Q-210 -170 -195 -90" fill="none" stroke="${d}" stroke-width="22" stroke-linecap="round"/>`;
}
export function rider(o = {}) { // horse + person sitting
  return horse(o) + `<g transform="translate(-10 -200)">${person({ ...o, seated: true })}</g>`;
}

// person: standing, feet at 0,0, ~ 330 tall adult. o: {robe, skin, hair:'mongol'|'woman'|'bald'|'hat', beard, face:'calm'|'angry'|'sad'|'shock', kid, arms:'down'|'up'|'bow'|'out', look}
export function person(o = {}) {
  const robe = o.robe || C.blue, skin = o.skin || C.skin, trim = o.trim || C.gold;
  const k = o.kid ? .72 : 1;
  const face = o.face || 'calm';
  const brows = { calm: `<path d="M-30 -292 h20 M10 -292 h20" ${O4}/>`, angry: `<path d="M-34 -298 l24 8 M34 -298 l-24 8" ${O4}/>`, sad: `<path d="M-32 -288 l20 -6 M32 -288 l-20 -6" ${O4}/>`, shock: `<path d="M-32 -300 q12 -8 22 0 M10 -300 q12 -8 22 0" fill="none" ${O4}/>` }[face];
  const mouth = { calm: `<path d="M-12 -248 q12 6 24 0" fill="none" ${O4}/>`, angry: `<path d="M-14 -246 h28" ${O4}/>`, sad: `<path d="M-12 -244 q12 -8 24 0" fill="none" ${O4}/>`, shock: `<ellipse cx="0" cy="-246" rx="9" ry="12" fill="${C.ink}"/>` }[face];
  let hair = '';
  if (o.hair === 'woman') hair = `<path d="M-52 -280 Q-56 -350 0 -352 Q56 -350 52 -280 Q40 -320 0 -322 Q-40 -320 -52 -280Z" fill="${C.hair}" ${O4}/><path d="M-52 -290 Q-80 -220 -60 -170" fill="none" stroke="${C.hair}" stroke-width="16" stroke-linecap="round"/><path d="M52 -290 Q80 -220 60 -170" fill="none" stroke="${C.hair}" stroke-width="16" stroke-linecap="round"/>`;
  else if (o.hair === 'hat') hair = `<path d="M-60 -300 Q-62 -372 0 -380 Q62 -372 60 -300Z" fill="${o.hatColor || C.red}" ${O4}/><path d="M-66 -306 Q0 -326 66 -306 L66 -292 Q0 -310 -66 -292Z" fill="${C.brown}" ${O4}/><circle cx="0" cy="-384" r="9" fill="${C.gold}" ${O4}/>`;
  else if (o.hair === 'bald') hair = '';
  else hair = `<path d="M-50 -296 Q-52 -350 0 -352 Q52 -350 50 -296 Q30 -330 0 -330 Q-30 -330 -50 -296Z" fill="${C.hair}"/><path d="M-52 -290 q-22 30 -4 52 M52 -290 q22 30 4 52" fill="none" stroke="${C.hair}" stroke-width="13" stroke-linecap="round"/>`;
  const beard = o.beard ? `<path d="M-40 -262 Q-30 -200 0 -196 Q30 -200 40 -262 Q24 -232 0 -232 Q-24 -232 -40 -262Z" fill="${o.beard === 'gray' ? C.gray : C.hair}" ${O4}/><path d="M-26 -258 q26 -14 52 0" fill="none" stroke="${o.beard === 'gray' ? C.gray : C.hair}" stroke-width="9" stroke-linecap="round"/>` : '';
  const armL = { down: 'M-62 -170 Q-80 -110 -76 -60', up: 'M-62 -170 Q-100 -230 -96 -300', out: 'M-62 -170 Q-120 -150 -160 -160', bow: 'M-62 -170 Q-110 -170 -150 -170' }[o.arms || 'down'];
  const armR = { down: 'M62 -170 Q80 -110 76 -60', up: 'M62 -170 Q100 -230 96 -300', out: 'M62 -170 Q120 -150 160 -160', bow: 'M62 -170 Q100 -160 140 -170' }[o.arms || 'down'];
  const hands = (p) => { const e = p.split(' ').slice(-2).join(' ').split(' '); const pts = p.match(/-?\d+/g).map(Number); return `<circle cx="${pts[pts.length - 2]}" cy="${pts[pts.length - 1]}" r="14" fill="${skin}" ${O4}/>`; };
  const bow = o.arms === 'bow' ? `<path d="M-150 -260 Q-210 -170 -150 -80" fill="none" stroke="${C.brown}" stroke-width="10" ${''}/><path d="M-150 -260 L-150 -80" stroke="${C.cream}" stroke-width="3"/><path d="M-150 -170 L140 -170" stroke="${C.ink}" stroke-width="5"/><path d="M-170 -170 l-26 -12 v24z" fill="${C.ink}"/>` : '';
  const body = o.seated
    ? `<path d="M-62 -190 Q0 -205 62 -190 L80 -40 Q0 -20 -80 -40Z" fill="${robe}" ${O}/><path d="M-70 -60 L-110 30 M70 -60 L110 30" stroke="${C.ink}" stroke-width="28" stroke-linecap="round"/><path d="M-70 -60 L-110 30 M70 -60 L110 30" stroke="${C.brown}" stroke-width="16" stroke-linecap="round"/>`
    : `<path d="M-62 -190 Q0 -205 62 -190 L92 -24 Q0 -8 -92 -24Z" fill="${robe}" ${O}/><rect x="-46" y="-26" width="36" height="26" rx="6" fill="${C.brown}" ${O4}/><rect x="10" y="-26" width="36" height="26" rx="6" fill="${C.brown}" ${O4}/>`;
  const sash = `<path d="M-70 -110 Q0 -100 70 -110 L72 -90 Q0 -80 -72 -90Z" fill="${trim}" ${O4}/><path d="M-20 -196 L30 -110" stroke="${trim}" stroke-width="10"/>`;
  const fur = o.fur ? `<path d="M-66 -196 Q0 -170 66 -196 Q60 -176 0 -164 Q-60 -176 -66 -196Z" fill="${C.cream}" ${O4}/>` : '';
  const cang = o.cangue ? `<g style="${o.cangueStyle || ''}"><rect x="-130" y="-232" width="260" height="56" rx="6" fill="${C.brownL}" ${O}/><path d="M-110 -214 h40 M70 -214 h40" stroke="${C.brown}" stroke-width="6"/><circle cx="-90" cy="-205" r="13" fill="${skin}" ${O4}/><circle cx="90" cy="-205" r="13" fill="${skin}" ${O4}/></g>` : '';
  const arms = o.cangue ? '' : `<path d="${armL}" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="${armL}" fill="none" stroke="${robe}" stroke-width="18" stroke-linecap="round"/><path d="${armR}" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="${armR}" fill="none" stroke="${robe}" stroke-width="18" stroke-linecap="round"/>${hands(armL)}${hands(armR)}`;
  const head = `<rect x="-16" y="-226" width="32" height="34" fill="${skin}" ${O4}/><ellipse cx="0" cy="-280" rx="52" ry="58" fill="${skin}" ${O}/>${hair}
   <circle cx="-20" cy="-276" r="6.5" fill="${C.ink}"/><circle cx="20" cy="-276" r="6.5" fill="${C.ink}"/>${brows}${mouth}${beard}${o.tear ? `<path d="M22 -266 q-6 14 0 22 q6 -8 0 -22Z" fill="${C.riverHi}" ${O4}/>` : ''}`;
  const inner = `${o.seated ? '' : shadowE(0, 2, 90)}${body}${sash}${fur}${arms}${head}${cang}${bow}`;
  return `<g transform="scale(${k}${o.flip ? ' ' : ''})">${o.flip ? `<g transform="scale(-1 1)">${inner}</g>` : inner}</g>`;
}
export function baby(o = {}) { // swaddled baby, ~ 260 long, center 0,0; fist raised with clot
  const fist = o.fist ? `<g style="${o.fistStyle || ''}"><path d="M40 -60 Q60 -110 70 -150" fill="none" stroke="${C.ink}" stroke-width="28" stroke-linecap="round"/><path d="M40 -60 Q60 -110 70 -150" fill="none" stroke="${C.skin}" stroke-width="16" stroke-linecap="round"/><circle cx="72" cy="-160" r="26" fill="${C.skin}" ${O}/>${o.clot ? `<circle cx="80" cy="-176" r="15" fill="${C.blood}" ${O4}/>` : ''}</g>` : '';
  const face = o.face || 'calm';
  return `${shadowE(0, 70, 170)}<path d="M-150 20 Q-150 -60 -60 -70 L110 -60 Q160 -50 160 10 Q160 70 100 75 L-90 80 Q-150 80 -150 20Z" fill="${o.wrap || C.cream}" ${O}/><path d="M-60 -60 L-20 75 M40 -62 L70 75" stroke="${C.red}" stroke-width="10"/>
   <circle cx="-100" cy="0" r="62" fill="${C.skin}" ${O}/><path d="M-150 -26 Q-130 -66 -86 -60" fill="none" stroke="${C.hair}" stroke-width="10" stroke-linecap="round"/>
   <circle cx="-118" cy="-2" r="6" fill="${C.ink}"/><circle cx="-86" cy="-2" r="6" fill="${C.ink}"/>
   ${face === 'angry' ? `<path d="M-130 -20 l18 7 M-74 -20 l-18 7" ${O4}/><path d="M-112 26 h22" ${O4}/>` : `<path d="M-112 24 q10 6 20 0" fill="none" ${O4}/>`}<circle cx="-132" cy="18" r="9" fill="#E98C7A" opacity=".6"/><circle cx="-70" cy="18" r="9" fill="#E98C7A" opacity=".6"/>${fist}`;
}
export const fish = (c = C.blueL) => `<path d="M-60 0 Q-10 -40 50 0 Q-10 40 -60 0Z" fill="${c}" ${O4}/><path d="M50 0 L84 -24 L84 24Z" fill="${c}" ${O4}/><circle cx="-36" cy="-6" r="5" fill="${C.ink}"/>`;
export const bird = () => `<path d="M-40 0 Q-20 -24 0 -6 Q20 -24 40 0 Q20 -10 0 4 Q-20 -10 -40 0Z" fill="${C.brown}" ${O4}/>`;
export const arrow = (len = 260) => `<path d="M0 0 H${len}" stroke="${C.ink}" stroke-width="7"/><path d="M${len} 0 l-22 -12 v24z" fill="${C.ink}"/><path d="M0 0 l-18 -12 M0 0 l-18 12 M10 0 l-18 -12 M10 0 l-18 12" stroke="${C.red}" stroke-width="5"/>`;
export const bowItem = () => `<path d="M0 -150 Q-70 0 0 150" fill="none" stroke="${C.brown}" stroke-width="14" stroke-linecap="round"/><path d="M0 -150 Q-70 0 0 150" fill="none" stroke="${C.ink}" stroke-width="4" opacity=".4"/><path d="M0 -150 V150" stroke="${C.cream}" stroke-width="4"/>`;
export function cart(o = {}) {
  return `${shadowE(0, 4, 230)}<rect x="-220" y="-170" width="380" height="80" fill="${C.brownL}" ${O}/><path d="M160 -120 L300 -110" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>
   <circle cx="-120" cy="-70" r="70" fill="${C.brown}" ${O}/><circle cx="-120" cy="-70" r="12" fill="${C.ink}"/><path d="M-120 -140 V0 M-190 -70 H-50" stroke="${C.ink}" stroke-width="5"/>
   <circle cx="80" cy="-70" r="70" fill="${C.brown}" ${O}/><circle cx="80" cy="-70" r="12" fill="${C.ink}"/><path d="M80 -140 V0 M10 -70 H150" stroke="${C.ink}" stroke-width="5"/>
   ${o.wool ? `<path d="M-230 -170 Q-240 -250 -170 -250 Q-150 -310 -80 -280 Q-20 -330 40 -290 Q110 -310 130 -250 Q190 -240 170 -170Z" fill="${C.white}" ${O}/><path d="M-140 -230 q20 -16 40 0 M0 -250 q20 -16 40 0 M80 -210 q20 -16 40 0" fill="none" stroke="${C.feltD}" stroke-width="6"/>` : ''}`;
}
export function cauldron(o = {}) {
  return `${fire({})}<path d="M-120 -90 Q-130 40 0 40 Q130 40 120 -90Z" fill="#3B3430" ${O}/><rect x="-136" y="-110" width="272" height="30" rx="10" fill="#4D4540" ${O}/>${o.steam ? smoke(0, -130) : ''}`;
}
export function fire(o = {}) {
  return `<g transform="translate(0 40)"><path d="M-70 10 L70 -10 M-70 -10 L70 10" stroke="${C.brown}" stroke-width="18" stroke-linecap="round"/>
   <g class="g" style="transform-origin:50% 100%;animation:${loop('flicker', .7, 0)}"><path d="M-50 0 Q-60 -80 -10 -140 Q0 -90 20 -100 Q60 -60 50 0Z" fill="${C.dusk}" ${O4}/><path d="M-24 0 Q-30 -50 0 -80 Q24 -40 22 0Z" fill="${C.gold}"/></g></g>`;
}
export function banner9(o = {}) {
  const tails = Array.from({ length: 9 }, (_, i) => `<path d="M${-60 + i * 15} -330 Q${-80 + i * 15} -250 ${-70 + i * 15} -200" fill="none" stroke="${C.white}" stroke-width="12" stroke-linecap="round" style="transform-box:fill-box;transform-origin:50% 0;animation:${loop('sway', 2.2 + (i % 3) * .3, i * .2)}"/>`).join('');
  return `<path d="M0 0 V-420" stroke="${C.brown}" stroke-width="16" stroke-linecap="round"/><path d="M0 -420 l-12 -40 l12 -30 l12 30z" fill="${C.gold}" ${O4}/><path d="M-70 -340 H70" stroke="${C.ink}" stroke-width="10"/>${tails}`;
}
export const stars = () => '';
export function lake(o = {}) { return `<ellipse cx="0" cy="0" rx="${o.w || 520}" ry="${o.h || 90}" fill="${o.mud ? '#7C6A48' : C.river}" ${O}/><path d="M-300 -10 h80 M60 20 h120 M-80 30 h60" stroke="${o.mud ? '#9B8762' : C.riverHi}" stroke-width="8" stroke-linecap="round"/>`; }
export function knucklebone() { return `<path d="M-30 -20 Q-40 -40 -20 -40 Q0 -30 20 -40 Q40 -40 30 -20 Q40 0 30 20 Q40 40 20 40 Q0 30 -20 40 Q-40 40 -30 20 Q-40 0 -30 -20Z" fill="${C.cream}" ${O4}/>`; }
export function coat() { return `<path d="M-80 -150 L-190 40 L-140 70 L-70 -40Z M80 -150 L190 40 L140 70 L70 -40Z" fill="#2E2622" ${O}/><path d="M-90 -160 Q0 -190 90 -160 L130 120 Q0 150 -130 120Z" fill="#2E2622" ${O}/><path d="M-60 -170 Q0 -130 60 -170 Q50 -200 0 -196 Q-50 -200 -60 -170Z" fill="#5A4A3E" ${O4}/><path d="M-90 -160 Q0 -120 90 -160" fill="none" stroke="#5A4A3E" stroke-width="14"/><path d="M0 -150 V130" stroke="#5A4A3E" stroke-width="6"/>`; }
export function camel() {
  return `${shadowE(0, 4, 170)}<path d="M-120 -150 Q-110 -260 -40 -230 Q0 -300 50 -230 Q100 -250 110 -150Z" fill="${C.sand}" ${O}/><path d="M100 -170 L150 -260 Q160 -290 190 -280 L210 -260 L180 -250 L150 -170Z" fill="${C.sand}" ${O}/>
   ${[-90, -50, 50, 90].map(x => `<path d="M${x} -150 V0" stroke="${C.ink}" stroke-width="24" stroke-linecap="round"/><path d="M${x} -150 V-8" stroke="${C.sand}" stroke-width="13" stroke-linecap="round"/>`).join('')}<circle cx="182" cy="-268" r="6" fill="${C.ink}"/>
   <rect x="-60" y="-270" width="90" height="50" fill="${C.red}" ${O4}/>`;
}
export function city(o = {}) { // walled city silhouette, bottom 0, width ~ 700
  const c = o.color || C.sand;
  return `<path d="M-350 0 V-160 h40 v-30 h40 v30 h60 v-30 h40 v30 h80 V-260 Q-50 -340 0 -260 V-160 h90 v-30 h40 v30 h60 v-30 h40 v30 h80 V0Z" fill="${c}" ${O}/><path d="M-70 0 V-90 Q-40 -130 -10 -90 V0Z" fill="${C.ink}"/><path d="M-30 -330 V-370" stroke="${C.ink}" stroke-width="6"/><path d="M-30 -370 l30 10 l-30 10z" fill="${C.red}"/>`;
}
export function mosque() { return `<path d="M-300 0 V-200 H300 V0Z" fill="${C.sand}" ${O}/><path d="M-140 -200 Q0 -380 140 -200Z" fill="${C.blueL}" ${O}/><rect x="230" y="-420" width="50" height="220" fill="${C.sand}" ${O}/><path d="M230 -420 l25 -40 l25 40z" fill="${C.blueL}" ${O4}/><path d="M-60 0 V-120 Q0 -180 60 -120 V0Z" fill="${C.ink}"/>`; }
export function skullStamp() { return ''; }

// ---------- UI / text ----------
export function chapter(o) { // big chapter card over a dimmed scene
  const { num, title, t } = o;
  return `<div class="a" style="inset:0;background:rgba(29,22,16,.55);animation:${an('fade', t, .4)}"></div>
   <div class="a" style="left:0;right:0;top:330px;text-align:center;font-family:A;font-size:120px;color:${C.gold};letter-spacing:.08em;text-shadow:0 6px 0 ${C.ink};animation:${an('pop', t + .1, .55)}">${num}</div>
   <div class="a" style="left:0;right:0;top:500px;text-align:center;font-family:A;font-size:110px;color:${C.cream};letter-spacing:.03em;text-shadow:0 6px 0 ${C.ink};animation:${an('up', t + .35, .6)}">${title}</div>
   <div class="a" style="left:760px;top:660px;width:400px;height:8px;background:${C.red};transform-origin:left;animation:${an('wipe', t + .6, .6)}"></div>`;
}
export function tag(s, o = {}) { // paper label "AGE 9", "1206"
  return `<div class="a" style="left:${o.x ?? 1500}px;top:${o.y ?? 70}px;transform:rotate(${o.rot ?? -3}deg);animation:${an(o.fx || 'stampin', o.t, .45)}"><div style="background:${o.bg || C.cream};border:5px solid ${C.ink};padding:10px 26px;font-family:A;font-size:${o.size || 64}px;color:${o.color || C.ink};letter-spacing:.04em;box-shadow:6px 8px 0 rgba(42,30,22,.35)">${s}</div></div>`;
}
export function caption(s, o = {}) { // big outlined text line
  return `<div class="a" style="left:${o.x ?? 0}px;${o.x === undefined ? 'right:0;text-align:center;' : ''}top:${o.y ?? 120}px;font-family:A;font-size:${o.size || 96}px;color:${o.color || C.cream};letter-spacing:.02em;-webkit-text-stroke:${o.stroke ?? 5}px ${C.ink};paint-order:stroke fill;text-shadow:0 7px 0 ${C.ink};animation:${an(o.fx || 'up', o.t, .5)}${o.out ? ',' + an('out', o.out, .3, 'linear') : ''}">${s}</div>`;
}
export function card(o) { // parchment card with handwritten-ish title + lines
  const { x, y, w = 760, title, lines = [], t } = o;
  return `<div class="a" style="left:${x}px;top:${y}px;width:${w}px;background:${C.paper};border:6px solid ${C.ink};border-radius:10px;padding:34px 44px;box-shadow:10px 12px 0 rgba(42,30,22,.35);transform:rotate(${o.rot || -1.5}deg);animation:${an(o.fx || 'up', t, .55)}">
   <div style="font-family:A;font-size:${o.tsize || 64}px;color:${C.ink};letter-spacing:.03em">${title}</div>
   ${lines.map((l, i) => `<div style="font-size:34px;font-weight:600;color:#4B3A2C;margin-top:12px;animation:${an('fade', (o.lt || [])[i] ?? t + .3 + i * .3, .4)}">${l}</div>`).join('')}</div>`;
}
export function mapPanel(o) { // stylised parchment map with route arrows; pts: {name:[x,y]}; route: [[a,b,t],...]
  const { pts, route = [], t0 } = o;
  const land = `<path d="M120 230 Q400 120 760 170 Q1100 110 1450 190 Q1720 230 1790 420 Q1820 640 1600 760 Q1300 880 900 830 Q560 900 300 800 Q110 700 130 480Z" fill="${C.sand}" ${O}/>
   <path d="M330 520 Q370 470 420 500 Q450 560 400 590 Q340 590 330 520Z" fill="${C.river}" ${O4}/><path d="M640 300 Q800 260 900 330" fill="none" stroke="${C.mtnD}" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>`;
  const dots = Object.entries(pts).map(([n, [x, y, lt, dx = 24, dy = -22]]) => `<g style="animation:${an('pop', lt ?? t0, .45)};transform-box:fill-box;transform-origin:center"><circle cx="${x}" cy="${y}" r="16" fill="${C.red}" ${O4}/></g><text x="${x + dx}" y="${y + dy}" font-family="A" font-size="44" fill="${C.ink}" style="animation:${an('fade', (lt ?? t0) + .15, .4)}">${n}</text>`).join('');
  const lines = route.map(([a, b, t]) => { const [x1, y1] = pts[a], [x2, y2] = pts[b]; const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 90; const len = Math.hypot(x2 - x1, y2 - y1) * 1.25;
    return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${C.redD}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${len}" style="stroke-dashoffset:${len};animation:dash${Math.round(len)} 1.2s ease-out ${at(t)}s both"/><style>@keyframes dash${Math.round(len)}{from{stroke-dashoffset:${len}}to{stroke-dashoffset:0}}</style>`; }).join('');
  return `<rect width="1920" height="1080" fill="#CDB07A"/>${land}${lines}${dots}`;
}

export function page(o) {
  D = o.start;
  const cam = o.cam === false ? '' : `animation:${o.camName || 'camz'} ${Math.max(o.dur, 1).toFixed(2)}s linear 0s both`;
  const kf = `@keyframes camz{from{transform:scale(${o.z0 || 1}) translate(${o.tx0 || 0}px,${o.ty0 || 0}px)}to{transform:scale(${o.zoom || 1.06}) translate(${o.tx || 0}px,${o.ty || 0}px)}}`;
  const body = typeof o.body === 'function' ? o.body() : o.body;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}${kf}</style></head>
<body style="background:${o.bg || C.ink}"><div class="stage"><div class="cam" style="${cam}">${body}</div>${o.over || ''}
${o.mark === false ? '' : `<div class="mark"><b></b>LIVED IT</div>`}</div>
<script>window.__seek=(t)=>{document.getAnimations().forEach(a=>{a.currentTime=t*1000})};</script></body></html>`;
}
