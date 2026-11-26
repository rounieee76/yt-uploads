// Scene list for "Advance Auto Parts Is (Finally) Getting What They Deserve…"
// Palette: garage charcoal + safety-yellow amber (parts-counter look); lime for money, red for losses.
import { C, el, text, kicker, count, doc, headline, person, usmap, bars, cardStack, stamp, line, hl } from './lib.mjs';

export default function scenes(Q, E) {
  const S = [];
  const add = (cue, o) => S.push({ cue, ...o });
  const A = C.amber, STEEL = '#23292B', DARK = '#15191A';
  const rel = (t) => Math.max(0, t - Q._s).toFixed(2);
  const chip = (s, o) => el(`<div style="display:inline-block;padding:22px 34px;border-radius:999px;background:${o.bg || C.panel};border:3px solid ${o.bd || C.dim};font-size:${o.size || 40}px;font-weight:800;color:${o.color || C.paper}">${s}</div>`, { fx: 'pop', dur: .45, ...o });
  const chapter = (n, title, sub) => () =>
    el(`<div style="width:1920px;height:1080px;background:${A}"></div>`, { left: 0, top: 0, in: Q._s, fx: 'wipe', dur: .5 }) +
    text(n, { left: 140, top: 330, size: 54, color: C.ink, w: 900, in: Q._s + .15, css: 'letter-spacing:.14em' }) +
    text(title, { left: 140, top: 420, size: 140, color: C.ink, w: 900, in: Q._s + .3 }) +
    (sub ? text(sub, { left: 144, top: 760, size: 44, color: STEEL, w: 700, in: Q._s + .6 }) : '');
  const date = (s, t, o = {}) => text(s, { left: 120, top: 110, size: 60, color: A, in: t, fx: 'left', ...o });
  const box = (html, o) => el(`<div style="width:${o.w}px;${o.h ? `height:${o.h}px;` : ''}background:${o.bg || C.panel};border-radius:14px;padding:${o.pad || 36}px;border:3px solid ${o.bd || '#2A3326'}">${html}</div>`, { fx: 'up', ...o });
  // line chart drawn left to right. pts in chart coords (0..1 x, value y), w x h px
  const chart = (o) => {
    const { pts, x = 160, y = 260, w = 1100, h = 520, min = 0, max, t, dur = 2.2, color = A, labels = [] } = o;
    const P = pts.map(([px, v]) => [px * w, h - (v - min) / (max - min) * h]);
    const d = P.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const lb = labels.map(l => { const [px, py] = [l.x * w, h - (l.v - min) / (max - min) * h];
      return `<g style="animation:fade .4s ease ${rel(l.t)}s both"><circle cx="${px}" cy="${py}" r="14" fill="${l.color || color}"/>
      <text x="${px + (l.dx ?? 24)}" y="${py + (l.dy ?? -24)}" font-family="M" font-weight="900" font-size="${l.size || 48}" fill="${l.color || color}" text-anchor="${l.anchor || 'start'}">${l.s}</text></g>`; }).join('');
    return el(`<svg width="${w + 200}" height="${h + 80}" viewBox="-20 -60 ${w + 200} ${h + 80}"><line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="${C.dim}" stroke-width="3"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4000" style="--len:4000;animation:draw ${dur}s linear ${rel(t)}s both"/>${lb}</svg>`, { left: x, top: y });
  };
  // grid of small store squares; indexes in closed[] turn red with an X at closeAt (staggered)
  const stores = (o) => {
    const { cols = 30, rows = 10, x = 160, y = 300, s = 40, gap = 10, t, closeAt, closeEvery = 0, color = A } = o;
    let h = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, closed = closeEvery && i % closeEvery === 0;
      h += `<div class="a" style="left:${c * (s + gap)}px;top:${r * (s + gap)}px;width:${s}px;height:${s}px;border-radius:6px;background:${color};animation:pop .3s ease ${rel(t + i * .004)}s both"></div>`;
      if (closed && closeAt !== undefined) h += `<div class="a" style="left:${c * (s + gap)}px;top:${r * (s + gap)}px;width:${s}px;height:${s}px;border-radius:6px;background:${C.red};display:flex;align-items:center;justify-content:center;font-size:${s * .7}px;font-weight:900;color:${C.ink};animation:pop .3s ease ${rel(closeAt + (i / closeEvery) * .012)}s both">×</div>`;
    }
    return el(h, { left: x, top: y });
  };
  const truck = (color = A, w = 420) => `<svg width="${w}" height="${w * .5}" viewBox="0 0 420 210"><rect x="10" y="30" width="250" height="130" rx="10" fill="${color}"/>
    <path d="M260 70 L340 70 L390 115 L390 160 L260 160Z" fill="${C.paper}"/><path d="M280 85 L335 85 L368 115 L280 115Z" fill="${C.sky}"/>
    <circle cx="80" cy="168" r="30" fill="#111"/><circle cx="80" cy="168" r="12" fill="${C.gray}"/><circle cx="320" cy="168" r="30" fill="#111"/><circle cx="320" cy="168" r="12" fill="${C.gray}"/>
    <text x="135" y="108" text-anchor="middle" font-family="M" font-weight="900" font-size="34" fill="${C.ink}">PARTS</text></svg>`;
  const battery = (w = 360) => `<svg width="${w}" height="${w * .8}" viewBox="0 0 360 288"><rect x="20" y="50" width="320" height="220" rx="18" fill="#2B3134"/><rect x="20" y="50" width="320" height="56" rx="18" fill="${A}"/>
    <rect x="62" y="20" width="56" height="34" rx="6" fill="${C.gray}"/><rect x="242" y="20" width="56" height="34" rx="6" fill="${C.gray}"/>
    <text x="90" y="92" text-anchor="middle" font-family="M" font-weight="900" font-size="44" fill="${C.ink}">+</text><text x="270" y="92" text-anchor="middle" font-family="M" font-weight="900" font-size="44" fill="${C.ink}">−</text>
    <text x="180" y="200" text-anchor="middle" font-family="M" font-weight="900" font-size="46" fill="${C.paper}">12V</text></svg>`;
  const warehouse = (w = 120, color = A) => `<svg width="${w}" height="${w * .8}" viewBox="0 0 120 96"><path d="M6 36 L60 6 L114 36 L114 92 L6 92Z" fill="${color}"/><rect x="30" y="52" width="60" height="40" fill="${C.ink}" opacity=".55"/><rect x="30" y="62" width="60" height="4" fill="${color}"/><rect x="30" y="74" width="60" height="4" fill="${color}"/></svg>`;
  const clock = (o) => el(`<svg width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="130" fill="none" stroke="${o.color || A}" stroke-width="16"/>
    <path d="M150 150 L150 20 A130 130 0 0 1 150 280 Z" fill="${o.color || A}" opacity=".35" style="transform-origin:150px 150px;animation:fade .8s ease ${rel(o.in + .3)}s both"/>
    <line x1="150" y1="150" x2="150" y2="50" stroke="${C.paper}" stroke-width="12" stroke-linecap="round" style="transform-origin:150px 150px;animation:spin 2s ease-out ${rel(o.in)}s both"/>
    <circle cx="150" cy="150" r="14" fill="${C.paper}"/><style>@keyframes spin{from{transform:rotate(0)}to{transform:rotate(180deg)}}</style></svg>`, { fx: 'pop', ...o });
  const shelf = (o) => { // parts shelf: rows of boxes popping in
    const { x = 1080, y = 250, rows = 4, cols = 6, t, step = .05 } = o; let h = '';
    const cols2 = [A, C.blue, C.paper, C.red, C.gray, C.lime];
    for (let r = 0; r < rows; r++) { h += `<div class="a" style="left:0;top:${r * 150 + 120}px;width:${cols * 120}px;height:14px;background:#3A4245"></div>`;
      for (let c = 0; c < cols; c++) h += `<div class="a" style="left:${c * 120 + 10}px;top:${r * 150 + 30}px;width:96px;height:90px;border-radius:6px;background:${cols2[(r * 3 + c) % 6]};animation:pop .3s ease ${rel(t + (r * cols + c) * step)}s both"></div>`; }
    return el(h, { left: x, top: y });
  };
  const quote = (q, who, o) => el(`<div style="width:${o.w || 1400}px;border-left:14px solid ${o.bar || A};padding:20px 0 20px 50px">
    <div style="font-size:${o.size || 70}px;font-weight:800;color:${C.paper};line-height:1.15">“${q}”</div>
    <div style="font-size:32px;font-weight:700;color:${C.gray};margin-top:26px">${who}</div></div>`, { fx: 'left', ...o });
  const dots = (o) => { // n dots in a grid, the last `fade` of them fade out at outAt
    const { n, cols = 20, x = 160, y = 300, s = 30, gap = 12, t, keep, outAt, color = A } = o; let h = '';
    for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), c = i % cols;
      h += `<div class="a" style="left:${c * (s + gap)}px;top:${r * (s + gap)}px;width:${s}px;height:${s}px;border-radius:50%;background:${color};animation:pop .25s ease ${rel(t + i * .006)}s both${i >= keep ? `,out .4s linear ${rel(outAt + (n - i) * .006)}s both` : ''}"></div>`; }
    return el(h, { left: x, top: y });
  };

  // ───────────── COLD OPEN ─────────────
  add(0, { body: () => {
    const t = Q('It cut its quarterly dividend');
    return date('MAY 31, 2023', 0) +
      text('Advance Auto Parts', { left: 120, top: 200, size: 96, in: .3 }) +
      text('quarterly dividend per share', { left: 120, top: 360, size: 40, color: C.gray, in: t }) +
      text('$1.50', { left: 120, top: 420, size: 200, color: C.paper, w: 900, in: t + .3 }) +
      el(`<div style="height:14px;background:${C.red};width:0;animation:strike .4s ease ${rel(Q('to just 25 cents'))}s both"></div>`, { left: 110, top: 520, width: 560 }) +
      text('→', { left: 700, top: 440, size: 160, color: C.gray, in: Q('to just 25 cents') }) +
      text('$0.25', { left: 900, top: 420, size: 200, color: C.red, w: 900, in: Q('to just 25 cents') + .3, fx: 'pop' }) +
      text('per share, per quarter', { left: 120, top: 700, size: 44, color: C.gray, in: Q('to just 25 cents') + .6 }); },
    src: 'Advance Auto Parts Q1 2023 release (SEC)' });

  add('The stock fell about 35 percent', { body: () =>
    text('AAP stock, May 31, 2023', { left: 120, top: 110, size: 50, color: C.gray, in: Q('The stock fell about 35 percent') }) +
    chart({ x: 160, y: 260, w: 950, h: 500, min: 0, max: 100, t: Q('The stock fell about 35 percent'), dur: 1.4, color: C.red,
      pts: [[0, 92], [.45, 90], [.55, 62], [1, 60]], labels: [] }) +
    count({ left: 1290, top: 380, from: 0, to: -35, suf: '%', t: Q('The stock fell about 35 percent') + .6, size: 200, color: C.red }) +
    text('in a single day', { left: 1300, top: 600, size: 56, in: Q('in a single day') }),
    src: 'CNBC, May 31, 2023 (−35.04%); chart is illustrative' });

  add('That September, S and P', { body: () =>
    date('SEPT 2023', Q('That September, S and P')) +
    text('Debt rating', { left: 120, top: 230, size: 56, color: C.gray, in: Q('cut the company') }) +
    text('BBB−', { left: 120, top: 300, size: 180, color: C.paper, w: 900, in: Q('cut the company') + .2 }) +
    text('→ BB+', { left: 620, top: 300, size: 180, color: C.red, w: 900, in: Q('debt rating to junk') }) +
    stamp('JUNK', { left: 1300, top: 300, in: Q('debt rating to junk') + .5, size: 90 }) +
    person({ left: 120, top: 640, size: 200, name: 'CEO Tom Greco', role: 'out, September 2023', initials: 'TG', color: C.gray, in: Q('The same month, the CEO') }),
    src: 'S&P Global Ratings via Seeking Alpha, Sept 12, 2023; Advance 8-K, Aug 23, 2023' });

  add('In February 2024, Advance told regulators', { body: () =>
    date('FEB 28, 2024', Q('In February 2024, Advance told regulators')) +
    doc({ left: 120, top: 230, w: 1100, kind: 'SEC FILING · FORM 12b-25', date: 'FEB 28, 2024', issuer: 'Advance Auto Parts, Inc.', title: 'Notification of late filing (annual report)',
      lines: ['Errors found in 2021–2022 costs and expenses', 'Prior statements “should be revised” (quote)', 'Material weakness in internal control'], hlIdx: 0, hlAt: Q('It had found errors'), in: Q("couldn't file its annual report") }) +
    stamp('LATE', { left: 1360, top: 380, in: Q("couldn't file its annual report") + 1.2, size: 90, color: A }),
    src: 'Advance Auto Parts Form NT 10-K, Feb 28, 2024 (paraphrased except quote)' });

  add('And in November 2024, it announced', { body: () =>
    date('NOV 13, 2024', Q('And in November 2024, it announced')) +
    stores({ x: 120, y: 260, cols: 34, rows: 11, s: 34, gap: 9, t: Q('And in November 2024, it announced') + .2, closeAt: Q('close 523'), closeEvery: 7 }) +
    count({ left: 1620, top: 330, to: 523, t: Q('close 523'), size: 130, color: C.red, style: 'text-align:right' }) +
    text('stores<br>closing', { left: 1640, top: 480, size: 52, color: C.paper, in: Q('close 523') + .4 }),
    src: 'Advance Auto Parts release, Nov 13, 2024 (illustration, not to scale)' });

  add("Here's the strange part", { body: () =>
    text("Here’s the strange part.", { left: 120, top: 120, size: 60, color: C.gray, in: Q("Here's the strange part") }) +
    text('average age of a US car', { left: 120, top: 260, size: 44, color: C.paper, in: Q('Americans are keeping their cars') }) +
    count({ left: 110, top: 320, to: 12.8, dec: 1, suf: ' yrs', t: Q('about 12.8 years'), size: 220, color: A }) +
    text('record high (2025)', { left: 130, top: 560, size: 40, color: C.gray, in: Q('about 12.8 years') + .4 }) +
    text(`Old cars need ${hl('parts.', A)}`, { left: 120, top: 700, size: 90, in: Q('Old cars need parts') }),
    src: 'S&P Global Mobility, May 21, 2025' });

  add('Its two biggest rivals', { body: () =>
    text('AutoZone', { left: 160, top: 250, size: 90, color: C.paper, in: Q('Its two biggest rivals') }) +
    text('↑', { left: 160, top: 380, size: 200, color: C.lime, in: Q('are growing'), fx: 'up' }) +
    text("O’Reilly", { left: 760, top: 250, size: 90, color: C.paper, in: Q('AutoZone and O') + .4 }) +
    text('↑', { left: 760, top: 380, size: 200, color: C.lime, in: Q('are growing') + .15, fx: 'up' }) +
    text('Advance', { left: 1360, top: 250, size: 90, color: A, in: Q('And Advance is shrinking') }) +
    text('↓', { left: 1360, top: 380, size: 200, color: C.red, in: Q('And Advance is shrinking') + .3, fx: 'down' }),
    src: 'Company earnings releases, 2026' });

  add('This is the story of how the company', { body: () =>
    kicker('THIS IS THE STORY OF', { in: Q('This is the story of how'), color: A }) +
    text('How the biggest fell behind', { left: 120, top: 230, size: 76, in: Q('set out to be the biggest') }) +
    text('Where the money in a parts store comes from', { left: 120, top: 400, size: 66, color: C.lime, in: Q('where the money in a parts store') }) +
    text('Why the bill came due', { left: 120, top: 560, size: 76, color: C.red, in: Q('why the bill') }) });

  add(E('why the bill finally came due.') + 0.35, { mark: false, cam: false, body: () => {
    const t = Q._s;
    return el(`<div style="width:1920px;height:1080px;background:${C.lime}"></div>`, { left: 0, top: 0, in: t, fx: 'wipe', dur: .45 }) +
      el(`<div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(5,44px);gap:10px">${['XXX', 'X..', 'XXX', '..X', 'XXX'].join('').split('').map((c, i) => `<b style="display:block;background:${c === 'X' ? C.ink : 'transparent'};animation:${`pop .3s ease ${(.35 + i * .04).toFixed(2)}s both`}"></b>`).join('')}</div>`, { left: 300, top: 360 }) +
      text('MONEY ENCODE', { left: 520, top: 420, size: 96, color: C.ink, w: 900, in: t + .9, fx: 'left', css: 'letter-spacing:.08em' }) +
      text('Advance Auto Parts Is (Finally) Getting What They Deserve…', { left: 524, top: 560, size: 40, color: STEEL, w: 700, in: t + 1.3 }); } });

  // ───────────── GLORY ─────────────
  add('The story starts in 1932', { body: () =>
    date('1932', Q('The story starts in 1932')) +
    usmap({ x: 640, y: 200, scale: .9, pins: [{ city: 'Roanoke', label: 'Roanoke, VA', t: Q('in Roanoke, Virginia'), dx: -260, dy: -40, color: A }], in: Q('The story starts in 1932') + .2 }) +
    text('Arthur Taubman', { left: 120, top: 320, size: 64, in: Q('A man named Arthur Taubman') }) +
    text('takes over<br>“Advance Stores”', { left: 120, top: 420, size: 52, color: C.gray, in: Q('takes over a small chain') }) +
    text('one of America’s<br>big parts chains', { left: 120, top: 640, size: 56, color: A, in: Q('Over the next eight decades') }),
    src: 'Advance Auto Parts, “Advance Auto Parts celebrates 90 years”' });

  add('Then, in October 2013', { body: () =>
    date('OCT 16, 2013', Q('Then, in October 2013')) +
    text('The biggest bet', { left: 120, top: 220, size: 80, in: Q('the biggest bet in its history') }) +
    text('General Parts International', { left: 120, top: 380, size: 54, color: C.paper, in: Q('It agrees to buy General Parts') }) +
    chip('Carquest', { left: 120, top: 470, in: Q('the company behind Carquest'), bg: A, bd: A, color: C.ink }) +
    count({ left: 110, top: 600, to: 2.04, dec: 2, pre: '$', suf: 'B', t: Q('for 2.04 billion dollars'), size: 200, color: C.lime }) +
    text('all cash', { left: 130, top: 850, size: 56, color: C.gray, in: Q('for 2.04 billion dollars') + .6 }),
    src: 'Advance Auto Parts release, Oct 16, 2013 (SEC)' });

  add('Advance says the deal creates', { body: () =>
    doc({ left: 120, top: 200, w: 1300, kind: 'PRESS RELEASE', date: 'OCT 16, 2013', issuer: 'Advance Auto Parts, Inc.', title: 'Advance to acquire General Parts International',
      lines: ['All-cash transaction', '“Creates the largest automotive aftermarket', 'parts provider in North America”'], hlIdx: 1, hlAt: Q('creates the largest automotive') + .2, in: Q('Advance says the deal creates') }),
    src: 'Advance Auto Parts release, Oct 16, 2013 (exact quote)' });

  add('When it closes in January 2014', { body: () =>
    date('JAN 2014', Q('When it closes in January 2014')) +
    count({ left: 110, top: 210, to: 5300, pre: '~', t: Q('about 5,300 company stores'), size: 170, color: A }) +
    text('company stores', { left: 130, top: 400, size: 46, in: Q('about 5,300 company stores') + .3 }) +
    count({ left: 110, top: 480, to: 1400, pre: '+', t: Q('another 1,400 independent'), size: 130, color: C.paper }) +
    text('independent Carquest stores', { left: 130, top: 630, size: 46, in: Q('another 1,400 independent') + .3 }) +
    count({ left: 1000, top: 300, to: 9.3, dec: 1, pre: '$', suf: 'B+', t: Q('more than 9.3 billion'), size: 190, color: C.lime }) +
    text('in sales', { left: 1020, top: 500, size: 50, color: C.gray, in: Q('more than 9.3 billion') + .4 }),
    src: 'Advance Auto Parts release, Jan 3, 2014 (SEC)' });

  add("But bigger isn't the same", { body: () =>
    text('Bigger ≠ better', { left: 120, top: 150, size: 110, color: A, in: Q("But bigger isn't the same") }) +
    cardStack({ x: 120, y: 360, w: 760, h: 420, gap: 60, items: [
      { t: Q('an activist investor, Starboard'), top: '2015 · ACTIVIST', title: 'Starboard Value takes a stake', body: 'Settlement with the board, November 2015: new directors join.' },
      { t: Q('In 2016, Advance hires'), top: 'APRIL 2016 · NEW CEO', title: 'Tom Greco', body: 'Former CEO of Frito-Lay North America (PepsiCo).' }] }),
    src: 'Reuters, Sept 30, 2015; Advance releases Nov 12, 2015 and Apr 4, 2016' });

  add('And for a moment, it looks like', { body: () =>
    date('2021', Q('And for a moment')) +
    text('same store sales', { left: 120, top: 240, size: 46, color: C.gray, in: Q('same store sales jumped') }) +
    count({ left: 110, top: 300, from: 0, to: 10.7, dec: 1, pre: '+', suf: '%', t: Q('jumped 10.7 percent'), size: 230, color: C.lime }) +
    text('net sales', { left: 1000, top: 240, size: 46, color: C.gray, in: Q('Sales hit 11 billion') }) +
    count({ left: 990, top: 300, to: 11, pre: '$', suf: 'B', t: Q('Sales hit 11 billion'), size: 230, color: A }),
    src: 'Advance Auto Parts Q4 2021 release, Feb 2022 (SEC)' });

  add('The company celebrated', { body: () =>
    text('Returned to shareholders, 2021', { left: 120, top: 150, size: 50, color: C.gray, in: Q('The company celebrated') }) +
    count({ left: 110, top: 230, to: 1.0, dec: 1, pre: '$', suf: 'B', t: Q('It returned a record 1 billion'), size: 220, color: C.lime }) +
    text('a record', { left: 130, top: 480, size: 60, color: A, in: Q('It returned a record 1 billion') + .4 }) +
    bars({ x: 1150, y: 260, h: 420, bw: 220, gap: 80, max: 900, items: [
      { label: 'buybacks', value: 886.7, show: '$887M', t: Q('mostly by buying back'), color: C.lime },
      { label: 'dividends', value: 160.9, show: '$161M', t: Q('mostly by buying back') + .4, color: A }] }),
    src: 'Advance Auto Parts Q4 2021 release, Feb 2022 (SEC)' });

  add('Early in 2022, it raised its dividend', { body: () =>
    date('FEB 2022', Q('Early in 2022')) +
    text('dividend per quarter', { left: 120, top: 230, size: 44, color: C.gray, in: Q('it raised its dividend') }) +
    text('$1.00 →', { left: 120, top: 290, size: 140, color: C.paper, in: Q('it raised its dividend') + .2 }) +
    text('$1.50', { left: 720, top: 290, size: 140, color: C.lime, in: Q('to 1 dollar and 50 cents a quarter'), fx: 'pop' }) +
    chip('+50%', { left: 1200, top: 310, in: Q('by 50 percent'), bg: C.lime, bd: C.lime, color: C.ink, size: 56 }) +
    text('record stock price, Nov 15, 2021', { left: 120, top: 560, size: 44, color: C.gray, in: Q('In November 2021, the stock') }) +
    count({ left: 110, top: 620, to: 241.91, dec: 2, pre: '$', t: Q('record of about 242'), size: 190, color: A }),
    src: 'Advance Q4 2021 release (SEC); Schaeffer’s Research, Nov 15, 2021' });

  // ───────────── HOW THE MONEY WORKS ─────────────
  add('To understand the fall', { mark: false, body: chapter('THE BUSINESS', 'How a parts store<br>makes money') });

  add('A parts store has two very different', { body: () =>
    shelf({ x: 1050, y: 200, t: Q('A parts store has two') }) +
    text('Two very different<br>customers', { left: 120, top: 300, size: 96, in: Q('two very different customers') }) });

  add('The first one is you', { body: () =>
    kicker('CUSTOMER 1', { in: Q('The first one is you'), color: A }) +
    text('You.', { left: 120, top: 180, size: 150, in: Q('The first one is you') }) +
    text('Saturday, car won’t start', { left: 120, top: 400, size: 56, color: C.gray, in: Q("It's Saturday morning") }) +
    el(battery(420), { left: 1150, top: 260, in: Q('you walk in for a battery'), fx: 'pop' }) +
    chip('DO IT YOURSELF (DIY)', { left: 120, top: 620, in: Q('The industry calls you do it yourself'), bg: A, bd: A, color: C.ink, size: 52 }) });

  add('The second customer is the repair shop', { body: () =>
    kicker('CUSTOMER 2', { in: Q('The second customer'), color: C.blue }) +
    text('The repair shop', { left: 120, top: 180, size: 120, in: Q('The second customer is the repair shop') }) +
    text('car on the lift · driver in the lobby', { left: 120, top: 360, size: 48, color: C.gray, in: Q('It has a car on the lift') }) +
    clock({ left: 1350, top: 250, in: Q('it needs it in the next hour'), color: C.blue }) +
    text('needs it within the hour', { left: 120, top: 470, size: 56, color: C.blue, in: Q('it needs it in the next hour') }) +
    chip('DO IT FOR ME · COMMERCIAL', { left: 120, top: 640, in: Q('The industry calls that do it for me'), bg: C.blue, bd: C.blue, color: C.ink, size: 52 }) });

  add("At O'Reilly, the split is roughly", { body: () => {
    const pie = (x, pct, label, t, sub) => el(`<div style="width:380px;height:380px;border-radius:50%;background:conic-gradient(${C.blue} 0 ${pct}%, ${A} ${pct}% 100%)"></div>
      <div style="font-size:60px;font-weight:900;color:${C.paper};margin-top:30px">${label}</div><div style="font-size:34px;font-weight:700;color:${C.gray};margin-top:8px">${sub}</div>`, { left: x, top: 230, in: t, fx: 'pop' });
    return pie(200, 50, "O’Reilly", Q("At O'Reilly, the split"), '≈50% pros · ≈50% DIY') +
      pie(900, 33.1, 'AutoZone', Q('At AutoZone, the repair shops'), '33.1% of US sales = pros') +
      chip('pros = fastest growing', { left: 1300, top: 820, in: Q('and the fastest growing part'), bg: C.blue, bd: C.blue, color: C.ink, size: 36 }) +
      text('■ repair shops', { left: 1450, top: 300, size: 36, color: C.blue, in: Q("At O'Reilly, the split") + .5 }) +
      text('■ DIY', { left: 1450, top: 360, size: 36, color: A, in: Q("At O'Reilly, the split") + .7 }); },
    src: 'O’Reilly 2025 Form 10-K; AutoZone FY2026 Form 10-K (domestic commercial share)' });

  add('Now, follow one 100 dollar part', { body: () => {
    const t1 = Q('the gross margin is about 52'), t2 = Q('roughly 52 dollars are left');
    return text('Follow one $100 part', { left: 120, top: 120, size: 76, in: Q('Now, follow one 100 dollar part') }) +
      el(`<div style="display:flex;width:1600px;height:200px;border-radius:12px;overflow:hidden">
        <div style="width:48%;background:${C.gray};display:flex;align-items:center;padding-left:30px;font-size:52px;font-weight:900;color:${C.ink};transform-origin:left;animation:grow .6s ease ${rel(t2)}s both">$48 supplier</div>
        <div style="width:52%;background:${C.lime};display:flex;align-items:center;padding-left:30px;font-size:52px;font-weight:900;color:${C.ink};transform-origin:left;animation:grow .6s ease ${rel(t2 + .5)}s both">$52 gross profit</div></div>`, { left: 120, top: 400, in: Q('Now, follow one 100 dollar part') + .5, fx: 'fade' }) +
      text('gross margin ≈ 52% (AutoZone 52.3% · O’Reilly 51.6%)', { left: 120, top: 280, size: 44, color: A, in: t1 }) +
      text('OUR ILLUSTRATION, USING REPORTED MARGINS', { left: 120, top: 680, size: 32, color: C.gray, in: Q("That's our illustration"), css: 'letter-spacing:.1em' }); },
    src: 'AutoZone FY2026 Form 10-K; O’Reilly FY2025 results (our illustration)' });

  add('Out of that 52 dollars come', { body: () => {
    const items = [['rent', 'the rent'], ['wages', 'the wages'], ['trucks', 'the delivery trucks'], ['warehouses', 'and the warehouses']];
    return text('Out of the $52 come…', { left: 120, top: 120, size: 64, in: Q('Out of that 52 dollars') }) +
      items.map(([s, c], i) => chip(s, { left: 120 + i * 330, top: 260, in: Q(c), bg: C.panel, bd: C.red, color: C.paper, size: 44 })).join('') +
      text('left as operating profit, per $100', { left: 120, top: 450, size: 44, color: C.gray, in: Q('At the two leaders, about 18 to 20') }) +
      text('$18–$20', { left: 110, top: 510, size: 230, color: C.lime, w: 900, in: Q('At the two leaders, about 18 to 20') + .3, fx: 'pop' }) +
      text('…selling brake pads and wiper blades.', { left: 120, top: 800, size: 50, color: A, in: Q('For a store that sells brake pads') }); },
    src: 'AutoZone FY2026 (≈18.3%, our arithmetic); O’Reilly FY2025 (19.5%) operating margins' });

  add("Here's the honest part", { body: () =>
    text('The honest part', { left: 120, top: 120, size: 64, color: A, in: Q("Here's the honest part") }) +
    box(`<div style="font-size:44px;font-weight:800;color:${C.paper}">Margin on a DIY sale vs a repair-shop sale</div><div style="font-size:72px;font-weight:900;color:${C.red};margin-top:20px">not published</div>`, { left: 120, top: 260, w: 1300, in: Q('None of these companies publish') }) +
    quote('commercial mix drag', 'AutoZone CFO, earnings call, May 26, 2026 (short quote)', { left: 120, top: 560, w: 1500, size: 64, bar: C.blue, in: Q("AutoZone's finance chief has said") }) +
    text(`Lower margin… but ${hl('it grows.', C.lime)}`, { left: 120, top: 820, size: 60, in: Q("But it's the one that grows") }),
    src: 'AutoZone Q3 FY2026 earnings call transcript, May 26, 2026' });

  add('What really decides who wins is speed', { body: () =>
    text(`What decides who wins: ${hl('speed', A)}`, { left: 120, top: 120, size: 70, in: Q('What really decides who wins') }) +
    text('different parts in a normal AutoZone store', { left: 120, top: 300, size: 42, color: C.gray, in: Q('A normal AutoZone store carries') }) +
    text('20–25K', { left: 110, top: 350, size: 190, color: C.paper, w: 900, in: Q('A normal AutoZone store carries') + .3, fx: 'pop' }) +
    text('in its biggest hub stores', { left: 120, top: 600, size: 42, color: C.gray, in: Q('Its biggest hub stores') }) +
    count({ left: 110, top: 650, to: 110000, pre: 'up to ', t: Q('carry up to 110 thousand'), size: 150, color: A }) +
    shelf({ x: 1180, y: 230, rows: 4, cols: 5, t: Q('A normal AutoZone store carries'), step: .04 }),
    src: 'AutoZone FY2026 Form 10-K (store and Mega Hub assortments)' });

  add('If the shop calls and you have', { body: () =>
    el(truck(A, 520), { left: 140, top: 300, in: Q('you have the part on a truck'), fx: 'left', dur: .9 }) +
    clock({ left: 1300, top: 220, in: Q('in 30 minutes, you get'), color: C.lime }) +
    text('30 min', { left: 1330, top: 560, size: 90, color: C.lime, in: Q('in 30 minutes, you get') + .3 }) +
    text(`On time → ${hl('the next call', C.lime)}`, { left: 140, top: 700, size: 64, in: Q('you get the next call too') }) +
    text(`Late → ${hl('a competitor', C.red)}`, { left: 140, top: 810, size: 64, in: Q("If you don't, they call someone else") }) });

  add('And the winners do something else', { body: () =>
    text('AutoZone share buybacks since 1998', { left: 120, top: 130, size: 52, color: C.gray, in: Q('And the winners do something else') }) +
    count({ left: 110, top: 210, to: 40.5, dec: 1, pre: '$', suf: 'B', t: Q('AutoZone has spent 40.5 billion'), size: 210, color: C.lime }) +
    dots({ n: 152, cols: 19, x: 1060, y: 230, s: 30, gap: 11, t: Q('Its share count has fallen') - 1.2, keep: 16, outAt: Q('Its share count has fallen') + .3 }) +
    text('152M shares (1998) → ~16M (2026)', { left: 120, top: 470, size: 44, color: C.paper, in: Q('Its share count has fallen') }) +
    count({ left: 110, top: 540, from: 0, to: -89, suf: '%', pre: '≈', t: Q('fallen by about 89 percent'), size: 170, color: A }) +
    text('each share left owns a bigger slice', { left: 120, top: 760, size: 50, color: C.lime, in: Q('Fewer shares means') }),
    src: 'AutoZone FY2026 Form 10-K; FY1998 annual report (our arithmetic). 1 dot ≈ 1M shares' });

  // ───────────── FALL 1 ─────────────
  add('Fall number one was hiding', { mark: false, body: chapter('FALL #1', 'The warehouses') });

  add('When Advance bought Carquest', { body: () => {
    const wh = (x, y, n, color, t) => Array.from({ length: n }, (_, i) => el(warehouse(110, color), { left: x + (i % 4) * 130, top: y + Math.floor(i / 4) * 110, in: t + i * .08, fx: 'pop', dur: .35 })).join('');
    return text('Advance', { left: 160, top: 160, size: 70, color: A, in: Q('When Advance bought Carquest') }) +
      wh(160, 280, 8, A, Q('When Advance bought Carquest') + .3) +
      text('+ Carquest', { left: 1060, top: 160, size: 70, color: C.blue, in: Q('It also got a second supply chain') }) +
      wh(1060, 280, 8, C.blue, Q('It also got a second supply chain') + .2) +
      text('two supply chains, two ways of working', { left: 160, top: 620, size: 50, color: C.paper, in: Q('its own way of doing things') }); },
    src: 'Illustration. Advance Q4 2023 earnings call (Feb 2024)' });

  add('Years later, the networks', { body: () =>
    date('FEB 2024', Q('In February 2024, the new CEO')) +
    text('Years later: still not fully combined', { left: 120, top: 220, size: 56, color: C.gray, in: Q('Years later, the networks') }) +
    person({ left: 120, top: 360, size: 220, name: 'Shane O’Kelly', role: 'CEO since September 2023', initials: 'SO', color: A, in: Q('Shane O') }) +
    quote('inefficient and needs substantial work', 'O’Kelly on the distribution network, Feb 2024 call', { left: 120, top: 680, w: 1600, size: 60, in: Q('He said the network was inefficient') }),
    src: 'Advance Q4 2023 earnings call via Supply Chain Dive, Feb 2024' });

  add('Advance and Carquest were running 38', { body: () =>
    Array.from({ length: 38 }, (_, i) => el(warehouse(100, i % 2 ? C.blue : A), { left: 130 + (i % 13) * 128, top: 170 + Math.floor(i / 13) * 108, in: Q('Advance and Carquest were running 38') + i * .04, fx: 'pop', dur: .3 })).join('') +
    count({ left: 120, top: 520, to: 38, t: Q('running 38 distribution'), size: 200, color: A }) +
    text('distribution centers', { left: 380, top: 590, size: 60, in: Q('running 38 distribution') + .3 }) +
    quote('Thirty-eight is far too many', 'Shane O’Kelly, Feb 2024', { left: 120, top: 800, w: 1500, size: 64, bar: C.red, in: Q('In his words, thirty-eight') }),
    src: 'Advance Q4 2023 earnings call via Supply Chain Dive, Feb 2024 (exact quote)' });

  add('Think about what that means', { body: () =>
    text('What it means for the repair shop', { left: 120, top: 120, size: 60, color: C.gray, in: Q('Think about what that means') }) +
    el(warehouse(220, C.blue), { left: 180, top: 300, in: Q('The part might exist somewhere'), fx: 'pop' }) +
    text('part is here…', { left: 180, top: 500, size: 44, color: C.blue, in: Q('The part might exist somewhere') + .3 }) +
    el(warehouse(220, A), { left: 1400, top: 300, in: Q('but not in the right building'), fx: 'pop' }) +
    text('…needed here', { left: 1400, top: 500, size: 44, color: A, in: Q('but not in the right building') + .3 }) +
    el(`<div style="width:900px;height:0;border-top:8px dashed ${C.red}"></div>`, { left: 470, top: 400, in: Q('but not in the right building') + .5, fx: 'wipe' }) +
    text('No truck in 30 minutes', { left: 180, top: 680, size: 70, color: C.red, in: Q("So the truck doesn't come") }) +
    text(`→ the shop calls ${hl('O’Reilly', C.lime)}`, { left: 180, top: 790, size: 70, in: Q('and the shop calls O') }) });

  add("O'Kelly said it himself in November 2024", { body: () =>
    date('NOV 14, 2024', Q("O'Kelly said it himself")) +
    quote('Our largest gap to peers is sales productivity at the store level', 'Shane O’Kelly, Q3 2024 earnings call', { left: 120, top: 260, w: 1650, size: 72, in: Q('The biggest gap to its rivals') }) +
    text('Advance stores sold less than rivals’ stores', { left: 120, top: 720, size: 54, color: A, in: Q("The stores simply weren't selling") }),
    src: 'Advance Q3 2024 earnings call transcript (Investing.com), Nov 14, 2024' });

  // ───────────── FALL 2 ─────────────
  add('Fall number two is about where', { mark: false, body: chapter('FALL #2', 'The money<br>and the books') });

  add('In 2022, the boom faded', { body: () =>
    date('2022', Q('In 2022, the boom faded')) +
    bars({ x: 220, y: 260, h: 480, bw: 260, gap: 160, max: 11, items: [
      { label: '2021', value: 10.7, show: '+10.7%', t: Q('In 2022, the boom faded') + .3, color: C.lime },
      { label: '2022', value: 0.3, show: '+0.3%', t: Q('grew just 0.3 percent'), color: C.red }] }) +
    text('same store sales growth', { left: 1100, top: 300, size: 50, color: C.gray, in: Q('In 2022, the boom faded') + .5 }),
    src: 'Advance Q4 2021 and Q4 2022 releases (SEC)' });

  add("But the payouts didn't slow down", { body: () =>
    text("The payouts didn’t slow down", { left: 120, top: 120, size: 70, in: Q("But the payouts didn't") }) +
    text('2022', { left: 120, top: 250, size: 46, color: C.gray, in: Q('That year, Advance spent') }) +
    count({ left: 110, top: 300, to: 598, pre: '$', suf: 'M', t: Q('about 598 million dollars'), size: 150, color: C.lime }) +
    text('buybacks', { left: 130, top: 460, size: 44, in: Q('about 598 million dollars') + .3 }) +
    count({ left: 700, top: 300, to: 336, pre: '$', suf: 'M', t: Q('336 million on dividends'), size: 150, color: A }) +
    text('dividends', { left: 720, top: 460, size: 44, in: Q('336 million on dividends') + .3 }) +
    text('…while same store sales grew 0.3%', { left: 120, top: 640, size: 54, color: C.red, in: Q('336 million on dividends') + 1.2 }),
    src: 'Advance Q4 2022 release, Feb 28, 2023 (SEC)' });

  add('Add 2021, and by our math', { body: () =>
    text('Returned to shareholders, 2021 + 2022', { left: 120, top: 130, size: 52, color: C.gray, in: Q('Add 2021, and by our math') }) +
    count({ left: 110, top: 220, to: 1.9, dec: 1, pre: '≈ $', suf: 'B', t: Q('it handed about 1.9 billion'), size: 230, color: C.lime }) +
    text('OUR ARITHMETIC: $1.05B (2021) + $0.93B (2022)', { left: 120, top: 500, size: 32, color: C.gray, in: Q('it handed about 1.9 billion') + .5, css: 'letter-spacing:.08em' }) +
    Array.from({ length: 6 }, (_, i) => el(warehouse(150, C.red), { left: 120 + i * 190, top: 640, in: Q('while its warehouses needed fixing') + i * .1, fx: 'pop', dur: .35 })).join('') +
    text('…while the warehouses waited', { left: 120, top: 860, size: 50, color: C.red, in: Q('while its warehouses needed fixing') + .5 }),
    src: 'Advance Q4 2021 and Q4 2022 releases (SEC); our arithmetic' });

  add('Then came May 2023', { body: () =>
    date('MAY 31, 2023', Q('Then came May 2023')) +
    text('2023 profit forecast (EPS)', { left: 120, top: 220, size: 44, color: C.gray, in: Q('Advance cut its profit forecast') }) +
    text('$10.20–11.20', { left: 120, top: 280, size: 110, color: C.paper, in: Q('Advance cut its profit forecast') + .2 }) +
    text('→ $6.00–6.50', { left: 820, top: 280, size: 110, color: C.red, in: Q('by about 40 percent') }) +
    text('Dividend $1.50 → $0.25', { left: 120, top: 470, size: 80, color: A, in: Q('It slashed the dividend') }) +
    count({ left: 110, top: 620, from: 0, to: -35, suf: '%', t: Q('And the stock lost about a third'), size: 200, color: C.red }) +
    text('in one day', { left: 620, top: 700, size: 60, in: Q('of its value in one day') }),
    src: 'Advance Q1 2023 release (SEC); CNBC, May 31, 2023' });

  add('The fallout came fast', { body: () =>
    text('The fallout', { left: 120, top: 120, size: 80, color: C.red, in: Q('The fallout came fast') }) +
    cardStack({ x: 120, y: 300, w: 540, h: 420, gap: 40, items: [
      { t: Q("Advance's debt was cut to junk"), top: 'SEPT 2023', title: 'Debt cut to junk', body: 'S&P: BBB− to BB+', stamp: 'JUNK' },
      { t: Q('The CEO and the finance chief left'), top: 'AUG–SEPT 2023', title: 'CEO and CFO out', body: 'New CEO Shane O’Kelly starts Sept 11, 2023' },
      { t: Q('About 400 corporate jobs'), top: 'NOV 2023', title: '~400 corporate jobs cut', body: 'Roles eliminated worldwide', stamp: 'CUT' }] }),
    src: 'S&P via Seeking Alpha, Sept 12, 2023; Advance 8-K, Aug 23, 2023; ABC11, Nov 15, 2023' });

  add('Then the accounting', { body: () =>
    date('FEB 2024', Q('Then the accounting')) +
    doc({ left: 120, top: 210, w: 1250, kind: 'ANNUAL REPORT · FORM 10-K', date: 'FISCAL 2023', issuer: 'Advance Auto Parts, Inc.', title: 'Errors in 2021 and 2022 results',
      lines: ['Errors in 2021 and 2022 results,', '“primarily related to product returns and vendor credits”'], hlIdx: 1, hlAt: Q('mostly tied to product returns'), in: Q('Advance said it needed more time') }),
    src: 'Advance Auto Parts FY2023 Form 10-K (exact short quotes); Form NT 10-K, Feb 28, 2024' });

  add('The company called the errors immaterial', { body: () =>
    text('The company:', { left: 120, top: 180, size: 50, color: C.gray, in: Q('The company called the errors immaterial') }) +
    text('errors were “immaterial”', { left: 120, top: 250, size: 90, color: C.paper, in: Q('The company called the errors immaterial') + .3 }) +
    text('Also the company:', { left: 120, top: 480, size: 50, color: C.gray, in: Q('But it also said its internal controls') }) +
    text('internal control over reporting', { left: 120, top: 550, size: 70, in: Q('But it also said its internal controls') + .3 }) +
    stamp('“NOT EFFECTIVE”', { left: 160, top: 730, in: Q('were not effective'), size: 64 }),
    src: 'Advance Auto Parts FY2023 Form 10-K (exact short quotes)' });

  add('Investors sued, claiming', { body: () =>
    text('Investors sued', { left: 120, top: 140, size: 90, in: Q('Investors sued') }) +
    chip('ALLEGATIONS', { left: 120, top: 290, in: Q('To be clear, those were allegations'), bg: A, bd: A, color: C.ink, size: 44 }) +
    cardStack({ x: 120, y: 420, w: 540, h: 330, gap: 40, items: [
      { t: Q('Investors sued'), top: 'OCT 2023', title: 'Class action filed', body: 'E.D. North Carolina' },
      { t: Q('A federal judge dismissed'), top: 'JAN 23, 2025', title: 'Dismissed', body: 'Federal district court' },
      { t: Q('an appeals court upheld'), top: 'FEB 2026', title: 'Dismissal upheld', body: '4th Circuit appeals court' }] }) +
    text('…but activists already had 3 board seats (Mar 2024)', { left: 120, top: 800, size: 46, color: C.red, in: Q('But by then, activist investors') }),
    src: 'Advance 10-Q, Oct 2025; Bloomberg Law, Feb 17, 2026; Reuters/MarketScreener, Mar 11, 2024' });

  // ───────────── FALL 3 ─────────────
  add('Fall number three is the shrink', { mark: false, body: chapter('FALL #3', 'The shrink') });

  add('In August 2024, Advance agreed', { body: () =>
    date('AUG 2024', Q('In August 2024, Advance agreed')) +
    text('Worldpac', { left: 120, top: 230, size: 110, in: Q('to sell Worldpac') }) +
    text('parts for specialty & import cars', { left: 130, top: 370, size: 44, color: C.gray, in: Q('its parts business for specialty') }) +
    text('→ sold to Carlyle', { left: 120, top: 480, size: 70, color: C.paper, in: Q('to the private equity firm Carlyle') }) +
    count({ left: 110, top: 600, to: 1.5, dec: 1, pre: '$', suf: 'B', t: Q('for 1.5 billion dollars'), size: 210, color: C.lime }),
    src: 'Advance Auto Parts release, Nov 3, 2024 (deal closed Nov 1, 2024)' });

  add('Then, in November, came the closures', { body: () =>
    date('NOV 13, 2024', Q('Then, in November, came the closures')) +
    stores({ x: 120, y: 230, cols: 24, rows: 12, s: 34, gap: 9, t: Q('Then, in November, came the closures') + .2, closeAt: Q('523 Advance stores'), closeEvery: 6 }) +
    text(`${hl('523', C.red)} stores`, { left: 1250, top: 260, size: 100, in: Q('523 Advance stores') }) +
    text(`${hl('204', C.red)} independents`, { left: 1250, top: 420, size: 56, in: Q('204 independent locations') }) +
    el(Array.from({ length: 4 }, (_, i) => `<div style="display:inline-block;margin-right:20px">${warehouse(110, C.red)}</div>`).join(''), { left: 1250, top: 580, in: Q('And four distribution centers'), fx: 'pop' }) +
    text('4 distribution centers', { left: 1250, top: 700, size: 44, color: C.paper, in: Q('And four distribution centers') + .3 }),
    src: 'Advance Auto Parts release, Nov 13, 2024 (illustration, not to scale)' });

  add('In the quarter before, its adjusted', { body: () =>
    text('adjusted operating margin, Q3 2024', { left: 120, top: 200, size: 48, color: C.gray, in: Q('In the quarter before') }) +
    count({ left: 110, top: 270, to: 0.8, dec: 1, suf: '%', t: Q('was 0.8 percent'), size: 260, color: C.red }) +
    text('Every $100 of sales →', { left: 120, top: 620, size: 64, in: Q("That's less than a dollar") }) +
    text('< $1 profit', { left: 860, top: 600, size: 110, color: C.red, w: 900, in: Q("That's less than a dollar") + .5, fx: 'pop' }),
    src: 'Advance Auto Parts Q3 2024 release, Nov 13, 2024' });

  add('How many people lost their jobs', { body: () =>
    text('How many jobs?', { left: 120, top: 140, size: 90, in: Q('How many people lost their jobs') }) +
    box(`<div style="font-size:44px;font-weight:800;color:${C.paper}">National total</div><div style="font-size:72px;font-weight:900;color:${C.red};margin-top:16px">never published</div>`, { left: 120, top: 320, w: 900, in: Q('We looked, and Advance never') }) +
    usmap({ x: 1050, y: 250, scale: .62, states: [{ s: 'Texas', t: Q('In Texas alone') }], in: Q('We looked') }) +
    count({ left: 120, top: 640, to: 143, t: Q('state notices listed 143'), size: 180, color: A }) +
    text('jobs in Texas WARN notices alone', { left: 520, top: 700, size: 50, in: Q('state notices listed 143') + .3 }),
    src: 'Fortune, Nov 15, 2024; WFAA (Texas WARN notices), 2025' });

  add('In 2025, Advance closed 522', { body: () =>
    date('2025', Q('In 2025, Advance closed 522')) +
    text(`${hl('522', C.red)} closed · ${hl('39', C.lime)} opened`, { left: 120, top: 210, size: 80, in: Q('closed 522 stores') }) +
    bars({ x: 220, y: 440, h: 360, bw: 240, gap: 140, max: 11.2, items: [
      { label: '2022', value: 11.2, show: '$11.2B', t: Q('Three years earlier, they were 11.2'), color: A },
      { label: '2025', value: 8.6, show: '$8.6B', t: Q('Sales were 8.6 billion'), color: C.red }] }) +
    text('net sales', { left: 1060, top: 420, size: 46, color: C.gray, in: Q('Sales were 8.6 billion') }) +
    text('(partly the Worldpac sale)', { left: 1060, top: 490, size: 40, color: C.gray, in: Q('Part of that is the Worldpac sale') }),
    src: 'Advance FY2025 release, Feb 13, 2026; FY2022 release (SEC)' });

  add('That July, both S and P', { body: () =>
    date('JULY 24, 2025', Q('That July, both S and P')) +
    text('S&P', { left: 120, top: 280, size: 70, color: C.gray, in: Q('That July, both S and P') + .2 }) +
    text(`BB+ → ${hl('BB', C.red)}`, { left: 520, top: 270, size: 110, in: Q('That July, both S and P') + .4 }) +
    text('Moody’s', { left: 120, top: 470, size: 70, color: C.gray, in: Q("and Moody's cut") }) +
    text(`Ba1 → ${hl('Ba3', C.red)}`, { left: 520, top: 460, size: 110, in: Q("and Moody's cut") + .3 }) +
    stamp('DOWNGRADED', { left: 1050, top: 680, in: Q('cut its rating again'), size: 70 }),
    src: 'Investing.com, Jul 24, 2025 (S&P and Moody’s actions)' });

  add('And the comeback keeps slipping', { body: () =>
    text('The comeback keeps slipping', { left: 120, top: 120, size: 70, in: Q('And the comeback keeps slipping') }) +
    date('FEB 2026', Q('In February 2026, O'), { top: 260, size: 48 }) +
    text(`2027 margin target ${hl('7%', A)} → “below”`, { left: 120, top: 330, size: 66, in: Q('on pace to fall short') }) +
    date('AUG 20, 2026', Q('In August, the stock dropped'), { top: 520, size: 48 }) +
    count({ left: 110, top: 590, from: 0, to: -21, suf: '%', t: Q('the stock dropped 21 percent'), size: 200, color: C.red }) +
    text('in a day, after a sales miss', { left: 640, top: 670, size: 54, in: Q('after sales missed expectations') }),
    src: 'Advance Q4 2025 earnings call (Feb 13, 2026); 24/7 Wall St, Aug 20, 2026' });

  add("Here's the gap today", { body: () =>
    text('Same store sales, Q3 2026', { left: 120, top: 120, size: 56, color: C.gray, in: Q("Here's the gap today") }) +
    text("O’Reilly", { left: 160, top: 260, size: 70, in: Q("O'Reilly's same store sales grew") }) +
    count({ left: 150, top: 350, from: 0, to: 7.2, dec: 1, pre: '+', suf: '%', t: Q('grew 7.2 percent'), size: 220, color: C.lime }) +
    text('Advance', { left: 1060, top: 260, size: 70, color: A, in: Q("Advance's fell 1.2") }) +
    count({ left: 1050, top: 350, from: 0, to: -1.2, dec: 1, suf: '%', t: Q("Advance's fell 1.2") + .2, size: 220, color: C.red }) +
    line({ left: 120, top: 660, w: 1680, t: Q("Advance's fell 1.2") + .6, color: C.dim, th: 4 }),
    src: 'O’Reilly Q3 2026 release, Oct 28, 2026; Advance Q3 2026 release, Nov 5, 2026' });

  add('On November 25th, its stock closed', { body: () =>
    text('Advance stock price', { left: 120, top: 110, size: 50, color: C.gray, in: Q('On November 25th') }) +
    chart({ x: 160, y: 230, w: 1300, h: 560, min: 0, max: 260, t: Q('On November 25th') + .1, dur: 2.6, color: A,
      pts: [[0, 160], [.12, 241.9], [.3, 170], [.38, 110], [.45, 62], [.6, 55], [.7, 40], [.8, 55], [.9, 47], [1, 46.25]],
      labels: [{ x: .12, v: 241.9, s: '$241.91 · Nov 2021', t: Q('On November 25th') + .5, size: 40 },
        { x: 1, v: 46.25, s: '$46.25', t: Q('closed at about 46'), color: C.red, dy: -30, anchor: 'end', dx: -20 }] }) +
    count({ left: 1150, top: 360, from: 0, to: -81, suf: '%', pre: '≈', t: Q('roughly 81 percent below'), size: 170, color: C.red }),
    src: 'Google Finance close Nov 25, 2026; Schaeffer’s, Nov 15, 2021. Path between points simplified' });

  // ───────────── OTHER SIDE ─────────────
  add('Now, the other side', { mark: false, body: chapter('NOW', 'The other side') });

  add('Advance is not going out of business', { body: () =>
    text('Not going out of business', { left: 120, top: 120, size: 80, color: C.lime, in: Q('Advance is not going out') }) +
    count({ left: 110, top: 260, to: 4300, pre: '~', t: Q('It still has about 4,300 stores'), size: 160, color: A }) +
    text('stores', { left: 130, top: 430, size: 44, in: Q('It still has about 4,300 stores') + .3 }) +
    count({ left: 760, top: 260, to: 787, t: Q('close to 800 independent'), size: 160, color: C.paper }) +
    text('independent partners', { left: 780, top: 430, size: 44, in: Q('close to 800 independent') + .3 }) +
    count({ left: 110, top: 540, to: 8.5, dec: 1, pre: '≈ $', suf: 'B', t: Q('It expects about 8.5 billion'), size: 150, color: C.lime }) +
    text('2026 sales outlook', { left: 130, top: 700, size: 44, in: Q('It expects about 8.5 billion') + .3 }) +
    count({ left: 760, top: 540, to: 3.09, dec: 2, pre: '$', suf: 'B', t: Q('more than 3 billion dollars in cash'), size: 150, color: C.lime }) +
    text('cash, latest quarter', { left: 780, top: 700, size: 44, in: Q('more than 3 billion dollars in cash') + .3 }),
    src: 'Advance Auto Parts Q3 2026 release, Nov 5, 2026' });

  add('The repair work is real, too', { body: () =>
    text('The repair work is real', { left: 120, top: 110, size: 66, in: Q('The repair work is real') }) +
    Array.from({ length: 38 }, (_, i) => el(warehouse(70, i < 16 ? A : C.dim), { left: 120 + (i % 19) * 86, top: 230 + Math.floor(i / 19) * 80, in: Q('Its 38 distribution centers') + i * .02, fx: 'pop', dur: .3, style: i >= 16 ? `animation:pop .3s ease ${rel(Q('Its 38 distribution centers') + i * .02)}s both,out .4s linear ${rel(Q('are down to 16'))}s both` : '' })).join('') +
    text(`Distribution centers: 38 → ${hl('16', C.lime)}`, { left: 120, top: 480, size: 80, in: Q('are down to 16') }),
    src: 'Advance Q4 2025 earnings call, Feb 13, 2026' });

  add("It's opening what it calls market hubs", { body: () =>
    text('market hubs (bigger stores, more parts nearby)', { left: 120, top: 560, size: 42, color: C.gray, in: Q("It's opening what it calls market hubs") }) +
    text(`${hl('35', A)} (Jun 2026) → 60 target (2027)`, { left: 120, top: 620, size: 70, in: Q('It had 35 of them') }) +
    Array.from({ length: 60 }, (_, i) => el(`<div style="width:44px;height:44px;border-radius:8px;background:${i < 35 ? A : 'transparent'};border:3px solid ${i < 35 ? A : C.dim}"></div>`, { left: 120 + (i % 20) * 56, top: 230 + Math.floor(i / 20) * 56, in: Q("It's opening what it calls market hubs") + i * .03, fx: 'pop', dur: .3 })).join('') +
    text('adjusted operating margin, Q3 2024 → Q3 2026', { left: 120, top: 780, size: 42, color: C.gray, in: Q('Its adjusted operating margin was back up') }) +
    text('0.8% → 4.5%', { left: 1100, top: 760, size: 80, color: C.lime, in: Q('back up to 4.5 percent') }),
    src: 'Supply Chain Dive, Jun 2, 2026; Advance Q3 2024 and Q3 2026 releases' });

  add('And the rivals have had help', { body: () =>
    text('The rivals had help', { left: 120, top: 110, size: 70, in: Q('And the rivals have had help') }) +
    date('MAY 3, 2025', Q('In May 2025, a 25 percent tariff'), { top: 230, size: 48 }) +
    text(`${hl('25%', C.red)} tariff on imported auto parts`, { left: 120, top: 300, size: 66, in: Q('a 25 percent tariff') }) +
    text('prices on the same parts went up', { left: 120, top: 460, size: 56, color: C.gray, in: Q('and prices went up across') }),
    src: 'Federal Register, Apr 3, 2025 (Proclamation on auto parts, effective May 3, 2025)' });

  add('AutoZone said prices on the very same parts', { body: () =>
    text('“like for like same SKU inflation just north of 7%”', { left: 120, top: 240, size: 60, color: C.paper, in: Q('AutoZone said prices on the very same parts') }) +
    text('— AutoZone, earnings call, May 2026', { left: 120, top: 340, size: 34, color: C.gray, in: Q('AutoZone said prices on the very same parts') + .4 }) +
    chip('+ tariff refunds in 2026 profit', { left: 120, top: 480, in: Q('Some of its 2026 profit'), bg: A, bd: A, color: C.ink, size: 44 }) +
    text('Not every gain was earned on the shop floor.', { left: 120, top: 680, size: 54, color: C.lime, in: Q('Not every gain at the top') }),
    src: 'AutoZone Q3 FY2026 call, May 26, 2026; AutoZone Q4 FY2026 release ($96M tariff refund)' });

  // ───────────── IT HAPPENED BEFORE ─────────────
  add("And Advance isn't the first parts chain", { mark: false, body: chapter('IT HAPPENED', 'Before', 'Pep Boys') });

  add('Pep Boys was once a household name', { body: () =>
    text('Pep Boys', { left: 120, top: 150, size: 130, in: Q('Pep Boys was once') }) +
    text('a household name in car care', { left: 130, top: 320, size: 48, color: C.gray, in: Q('a household name') }) +
    text('bought by Carl Icahn’s company, about a decade ago', { left: 120, top: 460, size: 50, in: Q("Carl Icahn's company bought it") }) +
    count({ left: 110, top: 550, to: 1, pre: '≈ $', suf: 'B', t: Q('for roughly 1 billion'), size: 180, color: A }) +
    text('after a bidding war', { left: 600, top: 620, size: 50, color: C.gray, in: Q('after a bidding war') }),
    src: 'Philadelphia Inquirer, Jul 21, 2026' });

  add('Its parts distribution business, Auto Plus', { body: () =>
    date('JAN 31, 2023', Q('Its parts distribution business, Auto Plus')) +
    text('Auto Plus', { left: 120, top: 230, size: 130, in: Q('Auto Plus, filed') }) +
    text('Icahn’s parts distribution business', { left: 130, top: 400, size: 48, color: C.gray, in: Q('Auto Plus, filed') + .3 }) +
    stamp('BANKRUPT', { left: 140, top: 560, in: Q('filed for bankruptcy'), size: 90 }),
    src: 'Icahn Enterprises 2025 Form 10-K' });

  add('By early 2025, Icahn was out', { body: () =>
    cardStack({ x: 220, y: 220, w: 640, h: 460, gap: 80, items: [
      { t: Q('By early 2025, Icahn was out'), top: 'Q1 2025', title: 'Out of auto parts', body: '“exited the Aftermarket Parts business” — Icahn Enterprises' },
      { t: Q('Pep Boys itself was sold'), top: 'AUG 20, 2026', title: 'Pep Boys sold to Mavis', body: '$700 million in cash (announced Jul 21, 2026)', stamp: 'SOLD', stampColor: A }] }),
    src: 'Icahn Enterprises 2025 Form 10-K and Q3 2026 10-Q; Philadelphia Inquirer, Jul 21, 2026' });

  add('Even NAPA is being reshaped', { body: () =>
    text('NAPA', { left: 120, top: 150, size: 130, in: Q('Even NAPA is being reshaped') }) +
    text('Genuine Parts → two public companies, early 2027', { left: 120, top: 330, size: 54, in: Q('Its parent, Genuine Parts, plans') }) +
    headline({ left: 120, top: 470, w: 1300, outlet: 'Reported by Bloomberg', date: 'JUL 3, 2026', text: 'O’Reilly interest in NAPA business (paraphrased)', bar: C.gray, in: Q('Bloomberg reported') }) +
    chip('Genuine Parts denied talks with any competitor', { left: 120, top: 780, in: Q('but Genuine Parts denied'), size: 40 }),
    src: 'Genuine Parts releases, Feb 17 and Oct 20, 2026; Bloomberg, Jul 3, 2026; S&P Aftermarket Insight, Jul 21, 2026' });

  add('The lesson is simple', { body: () =>
    text('In auto parts…', { left: 120, top: 260, size: 80, color: C.gray, in: Q('The lesson is simple') }) +
    text('the big don’t automatically survive.', { left: 120, top: 400, size: 90, in: Q('the big don') }) +
    text(`The ${hl('fast', A)} ones do.`, { left: 120, top: 560, size: 120, in: Q('The fast ones do') }) });

  // ───────────── VERDICT ─────────────
  add('So, is Advance Auto Parts finally', { mark: false, body: chapter('SO…', 'The verdict', 'Did they get what they deserve?') });

  add('In a lot of ways, yes', { body: () =>
    text('In a lot of ways, yes.', { left: 120, top: 120, size: 80, color: A, in: Q('In a lot of ways, yes') }) +
    ['Bought its way to the top', 'Never fully fixed the network', '≈ $1.9B paid out (2021–22)', 'Errors in its own books'].map((s, i) =>
      text(`${i + 1}. ${s}`, { left: 140, top: 290 + i * 130, size: 64, color: i === 2 ? C.lime : C.paper, in: Q(['It bought its way to the top', 'never fully fixed the machine', 'paid out almost 2 billion', 'Then it found errors'][i]) })).join(''),
    src: 'Advance filings 2013–2024; our arithmetic' });

  add("The market didn't fail Advance", { body: () =>
    text('The market didn’t fail Advance.', { left: 120, top: 150, size: 84, in: Q("The market didn't fail") }) +
    ['same old cars', 'same repair shops', 'same rising prices'].map((s, i) => chip(s, { left: 120 + i * 520, top: 360, in: Q(['The same old cars', 'the same repair shops', 'the same rising prices'][i]), bg: C.panel, bd: A, size: 44 })).join('') +
    text(`→ AutoZone & O’Reilly ${hl('record sales', C.lime)}`, { left: 120, top: 520, size: 64, in: Q('made AutoZone and O') }) +
    text('Advance lost them to the store across the street.', { left: 120, top: 700, size: 58, color: C.red, in: Q('Advance had the same customers') }),
    src: 'AutoZone FY2026 and O’Reilly FY2025 results' });

  add("Here's the number that sums it up", { body: () =>
    text('Operating profit per $100 of sales, Q3 2026', { left: 120, top: 120, size: 52, color: C.gray, in: Q("Here's the number that sums it up") }) +
    bars({ x: 260, y: 260, h: 520, bw: 300, gap: 260, max: 22, items: [
      { label: "O’Reilly", value: 21.4, show: '$21', t: Q('Last quarter, O'), color: C.lime },
      { label: 'Advance (GAAP)', value: 2.3, show: '$2', t: Q('Advance kept about 2 dollars'), color: C.red },
      ] }) +
    text('$4.50 adjusted', { left: 1200, top: 620, size: 56, color: A, in: Q('or 4 and a half on an adjusted') }),
    src: 'O’Reilly Q3 2026 release (21.4%); Advance Q3 2026 release (2.3% GAAP, 4.5% adjusted)' });

  add("In this business, the part isn't", { body: () =>
    text('The part isn’t the product.', { left: 120, top: 250, size: 100, color: C.gray, in: Q("In this business, the part isn't") }) +
    text(`The product is the ${hl('30 minutes.', A)}`, { left: 120, top: 420, size: 100, in: Q('The product is the 30 minutes') }) +
    el(truck(A, 380), { left: 1400, top: 640, in: Q('it takes to get it to you'), fx: 'left' }) });

  add('Next on Money Encode', { body: () =>
    text('NEXT ON MONEY ENCODE', { left: 120, top: 300, size: 44, color: A, in: Q('Next on Money Encode'), css: 'letter-spacing:.14em' }) +
    text(`The ${hl('$40')} oil change<br>that’s never $40`, { left: 120, top: 380, size: 120, in: Q('the 40 dollar oil change') }) });

  return S;
}
