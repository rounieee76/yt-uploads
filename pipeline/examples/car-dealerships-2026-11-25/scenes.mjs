// Scene list for "Car Dealerships Are (Finally) Getting What They Deserve…"
// Palette: showroom navy + window-sticker amber; lime for money, red for losses.
import { C, el, text, kicker, count, doc, headline, person, usmap, car, bars, cardStack, stamp, line, hl } from './lib.mjs';

export default function scenes(Q, E) {
  const S = [];
  const add = (cue, o) => S.push({ cue, ...o });
  const A = C.amber, NAVY = '#13233F';
  const rel = (t) => (t - Q._s).toFixed(2);
  const chip = (s, o) => el(`<div style="display:inline-block;padding:22px 34px;border-radius:999px;background:${o.bg || C.panel};border:3px solid ${o.bd || C.dim};font-size:${o.size || 40}px;font-weight:800;color:${o.color || C.paper}">${s}</div>`, { fx: 'pop', dur: .45, ...o });
  const chapter = (n, title, sub) => () =>
    el(`<div style="width:1920px;height:1080px;background:${A}"></div>`, { left: 0, top: 0, in: Q._s, fx: 'wipe', dur: .5 }) +
    text(n, { left: 140, top: 330, size: 54, color: C.ink, w: 900, in: Q._s + .15, css: 'letter-spacing:.14em' }) +
    text(title, { left: 140, top: 420, size: 140, color: C.ink, w: 900, in: Q._s + .3 }) +
    (sub ? text(sub, { left: 144, top: 620, size: 44, color: NAVY, w: 700, in: Q._s + .6 }) : '');
  const date = (s, t, o = {}) => text(s, { left: 120, top: 110, size: 60, color: A, in: t, fx: 'left', ...o });
  // top-down parking lot: n spaces, filled[] booleans, cars pop at t + i*step
  const lot = (o) => {
    const { cols = 12, rows = 4, fill = () => true, t, step = .03, x = 160, y = 330, cw = 120, ch = 150, colors = [C.blue, C.paper, C.red, A, C.gray] } = o;
    let h = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      h += `<div class="a" style="left:${c * cw}px;top:${r * (ch + 40)}px;width:${cw - 8}px;height:${ch}px;border:3px solid #2E3A2A;border-top:none"></div>`;
      if (fill(i)) h += `<div class="a" style="left:${c * cw + 22}px;top:${r * (ch + 40) + 18}px;width:${cw - 52}px;height:${ch - 36}px;border-radius:16px;background:${colors[(i * 7) % colors.length]};animation:pop .35s ease ${(t - Q._s + i * step).toFixed(2)}s both"><div style="margin:18px 8px 0;height:26px;border-radius:6px;background:${C.sky};opacity:.8"></div></div>`;
    }
    return el(h, { left: x, top: y });
  };
  const sticker = (o) => el(`<div style="width:${o.w || 620}px;background:${C.white};border:6px solid #222;padding:30px 36px;font-family:M">
    <div style="font-size:22px;font-weight:800;letter-spacing:.16em;color:#555">WINDOW STICKER (ILLUSTRATION)</div>
    <div style="height:3px;background:#222;margin:14px 0 20px"></div>
    <div style="display:flex;justify-content:space-between;font-size:38px;font-weight:700;color:#222"><span>Sticker price</span><span>${o.msrp}</span></div>
    ${o.extra ? `<div style="display:flex;justify-content:space-between;font-size:38px;font-weight:800;color:${o.extraColor || C.red};margin-top:18px;animation:${`fade .4s ease ${rel(o.extraAt)}s both`}"><span>${o.extra[0]}</span><span>${o.extra[1]}</span></div>` : ''}
    ${o.total ? `<div style="height:3px;background:#222;margin:20px 0 14px;animation:${`fade .4s ease ${rel(o.totalAt)}s both`}"></div><div style="display:flex;justify-content:space-between;font-size:46px;font-weight:900;color:#111;animation:${`fade .4s ease ${rel(o.totalAt)}s both`}"><span>You pay</span><span>${o.total}</span></div>` : ''}
  </div>`, { fx: 'up', ...o });
  const door = (o) => el(`<div style="width:420px;height:620px;background:#2A3A5C;border-radius:10px 10px 0 0;position:relative;border:10px solid #1B2740">
    <div style="position:absolute;left:40px;right:40px;top:50px;height:120px;background:${C.paper};border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:30px;font-weight:900;color:${C.ink}">FINANCE &amp;</div><div style="font-size:30px;font-weight:900;color:${C.ink}">INSURANCE</div></div>
    <div style="position:absolute;right:46px;top:330px;width:26px;height:26px;border-radius:50%;background:${A}"></div></div>`, { fx: 'up', ...o });
  const arrow = (x1, y1, x2, y2, color, t) => el(`<svg width="1920" height="1080"><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="14" stroke-linecap="round" stroke-dasharray="2000" style="--len:2000;animation:draw .8s ease ${rel(t)}s both"/></svg>`, { left: 0, top: 0 });

  // ───────────── COLD OPEN ─────────────
  add(0, { body: () => {
    const t = Q('On the night of June 18th');
    return date('JUNE 18, 2024', 0) +
      text('Hackers break into the software behind America’s car dealers', { left: 120, top: 200, size: 46, w: 700, in: t + .6, css: 'max-width:1300px' }) +
      el(`<div style="width:1100px;height:560px;background:#0E1628;border:8px solid #2B3550;border-radius:18px;padding:40px;font-family:monospace">
        <div style="font-size:34px;color:${C.red};font-weight:700">⚠ SYSTEM UNAVAILABLE</div>
        <div style="font-size:28px;color:${C.gray};margin-top:24px">DEALER MANAGEMENT SYSTEM</div>
        ${['SALES ........ OFFLINE', 'FINANCE ...... OFFLINE', 'SERVICE ...... OFFLINE'].map((s, i) => `<div style="font-size:40px;color:${C.paper};margin-top:28px;animation:fade .3s ease ${rel(Q('hackers broke into') + .4 + i * .35)}s both">${s}</div>`).join('')}</div>`,
        { left: 410, top: 360, in: Q('hackers broke into'), fx: 'pop' }); },
    src: 'Help Net Security, Jun 20, 2024 (illustration of a dealer screen)' });

  add('The company was CDK Global', { body: () =>
    text('CDK Global', { left: 120, top: 200, size: 150, color: C.paper, in: Q('The company was CDK Global') }) +
    text('dealer software company', { left: 130, top: 380, size: 46, color: C.gray, in: Q('The company was CDK Global') + .3 }) +
    count({ left: 110, top: 520, to: 15000, pre: '~', t: Q('About 15,000 dealerships'), size: 230, color: C.red }) +
    text('dealerships in North America knocked offline', { left: 130, top: 790, size: 50, in: Q('lost the system they use') }) +
    ['sell', 'finance', 'service'].map((s, i) => chip(s, { left: [1100, 1330, 1620][i], top: 250, in: Q(['to sell', 'finance and service', 'service cars'][i]), size: 36, bg: C.red, bd: C.red, color: C.ink })).join(''),
    src: 'Help Net Security, Jun 20, 2024; BNN Bloomberg, Jul 2, 2024' });

  add('Six months later', { body: () =>
    date('DEC 19, 2024', Q('Six months later')) +
    usmap({ x: 900, y: 230, scale: .75, pins: [{ city: 'Chicago', label: 'Chicago area', t: Q('a Chicago area dealer group'), dx: -60, dy: -40 }], in: Q('Six months later') + .1 }) +
    text('FTC + Illinois', { left: 120, top: 260, size: 64, in: Q('the Federal Trade Commission') }) +
    count({ left: 110, top: 380, to: 20, pre: '$', suf: 'M', t: Q('20 million dollar settlement'), size: 220, color: C.lime }) +
    text('settlement', { left: 130, top: 620, size: 46, color: C.gray, in: Q('20 million dollar settlement') + .3 }) +
    text('FTC’s largest ever<br>with a car dealer', { left: 120, top: 760, size: 54, color: A, in: Q('It was the largest settlement') }),
    src: 'FTC press release, Dec 19, 2024 (Leader Automotive Group / AutoCanada)' });

  add('In September 2025, a Dallas', { body: () =>
    date('SEPT 10, 2025', Q('In September 2025, a Dallas')) +
    usmap({ x: 900, y: 230, scale: .75, pins: [{ city: 'Dallas', label: 'Tricolor · Dallas', t: Q('called Tricolor'), dx: -330, dy: 70, color: C.red }], in: Q('In September 2025, a Dallas') + .1 }) +
    text('Used car dealer<br>+ lender', { left: 120, top: 260, size: 64, in: Q('used car dealer and lender') }) +
    stamp('BANKRUPT', { left: 110, top: 520, in: Q('collapsed into bankruptcy'), size: 76 }) +
    text('CEO later charged with fraud', { left: 120, top: 780, size: 50, color: C.red, in: Q('Its CEO was later charged') }) +
    text('(charges are accusations)', { left: 120, top: 850, size: 34, color: C.gray, in: Q('Its CEO was later charged') + .4 }),
    src: 'U.S. Attorney’s Office SDNY, Dec 17, 2025; U.S. Bankruptcy Court, N.D. Texas' });

  add('And on October 1st, 2026', { body: () => {
    const t = Q('Three days to change');
    return date('OCT 1, 2026', Q('And on October 1st, 2026')) +
      usmap({ x: 900, y: 230, scale: .75, states: [{ s: 'California', t: Q('a new law in California') }], in: Q('And on October 1st, 2026') + .1 }) +
      text('New California law', { left: 120, top: 260, size: 64, in: Q('a new law in California') }) +
      ['DAY 1', 'DAY 2', 'DAY 3'].map((d, i) => el(`<div style="width:170px;height:170px;background:${C.paper};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:${C.ink}">${d}</div>`, { left: 120 + i * 200, top: 480, in: t + i * .3, fx: 'pop', dur: .4 })).join('') +
      text('to change your mind', { left: 120, top: 700, size: 60, color: C.lime, in: t + 1 }); },
    src: 'California SB 766 (CARS Act), signed Oct 6, 2025; California DMV' });

  add("Here's the strange part", { body: () =>
    text('Here’s the strange part.', { left: 120, top: 120, size: 72, in: Q("Here's the strange part") }) +
    text('Average new car price, Oct 2026', { left: 120, top: 300, size: 44, color: C.gray, in: Q('paying more for a new car') }) +
    count({ left: 110, top: 360, from: 40000, to: 51109, pre: '$', t: Q('the average one sold for'), size: 230, color: C.paper, dur: 1.6 }) +
    text('record high', { left: 130, top: 620, size: 50, color: A, in: Q('the average one sold for') + 1.6 }) +
    text(`Dealer profit per car ${hl('↓', C.red)}`, { left: 120, top: 790, size: 76, in: Q("the dealer's profit on that car") }),
    src: 'Cox Automotive / Kelley Blue Book average transaction price report, Nov 10, 2026' });

  add('This is the story of how car dealers', { body: () =>
    text('This is the story of…', { left: 120, top: 130, size: 50, color: C.gray, in: Q._s }) + text('Record money above sticker', { left: 120, top: 260, size: 66, in: Q('made record money') }) +
    text('Where the money really comes from', { left: 120, top: 420, size: 66, color: C.lime, in: Q('where their money really comes from') }) +
    text('Why the bill is coming due', { left: 120, top: 580, size: 66, color: C.red, in: Q('why the bill') }) });

  add(E('finally coming due.') + 0.35, { mark: false, cam: false, body: () => {
    const t = Q._s;
    return el(`<div style="width:1920px;height:1080px;background:${C.lime}"></div>`, { left: 0, top: 0, in: t, fx: 'wipe', dur: .45 }) +
      el(`<div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(5,44px);gap:10px">${['XXX', 'X..', 'XXX', '..X', 'XXX'].join('').split('').map((c, i) => `<b style="display:block;background:${c === 'X' ? C.ink : 'transparent'};animation:${`pop .3s ease ${(.35 + i * .04).toFixed(2)}s both`}"></b>`).join('')}</div>`, { left: 300, top: 360 }) +
      text('MONEY ENCODE', { left: 520, top: 420, size: 96, color: C.ink, w: 900, in: t + .9, fx: 'left', css: 'letter-spacing:.08em' }) +
      text('Car Dealerships Are (Finally) Getting What They Deserve…', { left: 524, top: 560, size: 40, color: NAVY, w: 700, in: t + 1.3 }); } });

  // ───────────── THE MARKUP YEARS ─────────────
  add('In January 2021, buying', { body: () =>
    date('JAN 2021', Q('In January 2021, buying')) +
    sticker({ left: 1150, top: 220, msrp: '$40,000', extra: ['Negotiated', '−$2,152'], extraColor: '#1E8E3E', extraAt: Q('paid about 2,152'), total: '$37,848', totalAt: Q('paid about 2,152') + .6, in: Q('buying a new car worked') }) +
    text('You negotiated.', { left: 120, top: 260, size: 90, in: Q('You negotiated') }) +
    text('Average buyer:', { left: 120, top: 450, size: 44, color: C.gray, in: Q('The average buyer paid') }) +
    count({ left: 110, top: 510, to: 2152, pre: '−$', t: Q('paid about 2,152'), size: 150, color: C.lime }) +
    text('below sticker', { left: 130, top: 690, size: 44, color: C.gray, in: Q('below the sticker price') }) +
    text('Paid over sticker: 2.8%', { left: 120, top: 820, size: 54, in: Q('fewer than 3 in 100') }),
    src: 'Edmunds, Feb 15, 2022 (January 2021 data). Sticker shown is an illustration' });

  add('Then the chips ran out', { body: () => {
    const t = Q('A global shortage');
    const chips = Array.from({ length: 10 }, (_, i) => el(`<div style="width:110px;height:110px;background:#26301F;border:4px solid ${C.gray};border-radius:8px;position:relative"><div style="position:absolute;inset:26px;background:${C.gray};border-radius:4px"></div></div>`,
      { left: 1000 + (i % 5) * 150, top: 300 + Math.floor(i / 5) * 160, in: Q('Then the chips ran out') + .2 + i * .05, fx: 'pop', dur: .3, out: t + .6 + (9 - i) * .12 })).join('');
    return text('Then the chips ran out.', { left: 120, top: 140, size: 80, in: Q('Then the chips ran out') }) + chips +
      text('Global chip shortage', { left: 120, top: 360, size: 56, color: A, in: t }) +
      text('Factories slow to a crawl', { left: 120, top: 460, size: 56, in: Q('slowed car factories') }) +
      text('2021–2022', { left: 120, top: 600, size: 48, color: C.gray, in: Q('slowed car factories') + .4 }); } });

  add('Dealer lots that used to be packed', { body: () => {
    const t = Q('Dealer lots that used to be packed');
    const keep = new Set([3, 8, 14, 21, 30, 37, 42]);
    return text('The lot empties out', { left: 120, top: 110, size: 70, in: t }) +
      lot({ t: t + .1, fill: (i) => keep.has(i), step: .015, y: 300, ch: 120 }) +
      Array.from({ length: 48 }, (_, i) => keep.has(i) ? '' : el(`<div style="width:68px;height:84px;border-radius:16px;background:${[C.blue, C.paper, C.red, A, C.gray][(i * 7) % 5]}"></div>`, { left: 160 + (i % 12) * 120 + 22, top: 300 + Math.floor(i / 12) * 160 + 18, in: t + .1 + i * .015, fx: 'pop', dur: .3, out: t + 1.4 + (i % 7) * .12 })).join('') +
      text('For most businesses: a disaster', { left: 1000, top: 130, size: 46, color: C.gray, in: Q('empty shelves are a disaster') }); } });

  add('For car dealers, it was the best', { body: () =>
    text('For car dealers…', { left: 120, top: 280, size: 90, color: C.gray, in: Q('For car dealers, it was') }) +
    text(`the ${hl('best thing', A)} that ever<br>happened to them.`, { left: 120, top: 430, size: 110, in: Q('the best thing that ever happened') }) });

  add('By January 2022, 82 percent', { body: () =>
    date('JAN 2022', Q('By January 2022')) +
    count({ left: 110, top: 200, to: 82.2, dec: 1, suf: '%', t: Q('82 percent'), size: 260, color: A }) +
    text('of new car buyers paid<br>more than sticker', { left: 130, top: 490, size: 56, in: Q('paying more than the sticker price') }) +
    sticker({ left: 1150, top: 220, msrp: '$40,000', extra: ['Over sticker (avg)', '+$728'], extraAt: Q('they paid 728'), total: '$40,728', totalAt: Q('they paid 728') + .6, in: Q('By January 2022') + .3 }) +
    text('A year earlier: haggling it down', { left: 120, top: 800, size: 50, color: C.gray, in: Q('A year earlier, the same buyers') }),
    src: 'Edmunds, Feb 15, 2022. Sticker shown is an illustration; +$728 is the January 2022 average' });

  add('The profits followed', { body: () =>
    text('The profits followed.', { left: 120, top: 120, size: 76, in: Q('The profits followed') }) +
    person({ left: 120, top: 280, name: 'NADA', role: 'National Automobile Dealers Association · the dealers’ own trade group', initials: 'N', size: 200, color: A, in: Q("The dealers' own trade group") }) +
    text('Average dealership pretax profit, first 9 months of 2021', { left: 120, top: 560, size: 40, color: C.gray, in: Q('reported that the average dealership') }) +
    count({ left: 110, top: 620, to: 128, pre: '+', suf: '%', t: Q('more than doubled'), size: 220, color: C.lime }) +
    text('vs. a year earlier', { left: 130, top: 870, size: 44, color: C.gray, in: Q('more than doubled') + .4 }),
    src: 'Kelley Blue Book, Nov 12, 2021, citing NADA (+128.2%)' });

  add('Look at AutoNation, one of', { body: () =>
    person({ left: 120, top: 150, name: 'AutoNation', role: 'One of America’s biggest public dealer groups', initials: 'AN', size: 200, color: C.blue, in: Q('Look at AutoNation') }) +
    text('Gross profit per new car, 2022', { left: 120, top: 470, size: 44, color: C.gray, in: Q('In 2022, it made a gross profit') }) +
    count({ left: 110, top: 530, to: 5942, pre: '$', t: Q('5,942 dollars on every new car'), size: 240, color: C.lime }) +
    text(`The car itself was the ${hl('jackpot.', A)}`, { left: 120, top: 830, size: 70, in: Q('Now the car itself was the jackpot') }),
    src: 'AutoNation Form 10-K, fiscal 2022' });

  // ───────────── HOW A DEALER MAKES MONEY ─────────────
  add('But the car was never the whole business', { body: () =>
    text('But the car was never<br>the whole business.', { left: 120, top: 300, size: 100, in: Q('But the car was never') }) +
    el(car(C.blue, 520), { left: 1250, top: 520, in: Q('But the car was never') + .4, fx: 'right' }) });

  add('To see the rest, picture the moment', { body: () => {
    const t = Q('You shake hands');
    return text('Deal agreed.', { left: 120, top: 130, size: 76, in: Q._s }) +
      stamp('DEAL ✓', { left: 160, top: 380, in: t, size: 110, color: C.lime }) +
      door({ left: 1200, top: 300, in: Q('walks you to a small office') }) +
      text('…then the office in the back', { left: 120, top: 820, size: 56, color: A, in: Q('walks you to a small office') + .3 }); } });

  add('That office is called finance and insurance', { body: () =>
    door({ left: 1300, top: 300, in: Q('That office is called') - .3 }) +
    text('Finance &amp; Insurance', { left: 120, top: 140, size: 80, color: A, in: Q('That office is called') }) +
    text('“F&amp;I”', { left: 120, top: 250, size: 50, color: C.gray, in: Q('That office is called') + .4 }) +
    text('Your loan gets written', { left: 120, top: 380, size: 54, in: Q('where your loan gets written') }) +
    ['Extended warranty', 'Gap insurance', 'Paint protection', 'Tire &amp; wheel'].map((s, i) => chip(s, { left: 120 + (i % 2) * 520, top: 520 + Math.floor(i / 2) * 150, in: Q(['An extended warranty', 'Gap insurance', 'Paint protection', 'Tire and wheel'][i]), size: 40, bg: C.paper, bd: C.paper, color: C.ink })).join('') });

  add("Here's what AutoNation earned", { body: () => {
    const segs = [['New cars', 11.5, C.blue, 'New cars, the thing', '11.5%'], ['Used', 8.6, C.gray, 'Used cars, about', '8.6%'], ['F&amp;I office', 28.9, A, 'That little office', '29%'], ['Service &amp; parts', 51.0, C.lime, 'And the service bay', '51%']];
    return text('AutoNation · Q3 2026 gross profit', { left: 120, top: 110, size: 54, color: C.gray, in: Q("Here's what AutoNation earned") }) +
      count({ left: 110, top: 190, to: 1.21, dec: 2, pre: '$', suf: 'B', t: Q('Total gross profit was'), size: 170, color: C.paper }) +
      el(`<div style="width:1680px;height:170px;display:flex;border-radius:10px;overflow:hidden">${segs.map(s => `<div style="width:${s[1]}%;background:${s[2]};transform-origin:left;animation:grow .6s ease ${rel(Q(s[3]))}s both"></div>`).join('')}</div>`, { left: 120, top: 470 }) +
      segs.map((s, i) => {
        const left = 120 + 1680 * (segs.slice(0, i).reduce((a, b) => a + b[1], 0) / 100);
        return text(s[4], { left: left + 14, top: 680, size: i < 2 ? 52 : 70, color: s[2], in: Q(s[3]) + .3 }) + text(s[0], { left: left + 14, top: 770, size: i < 2 ? 28 : 36, color: C.paper, w: 700, in: Q(s[3]) + .3 });
      }).join(''); },
    src: 'AutoNation Form 10-Q, quarter ended Sept 30, 2026: $1,207.6M gross profit' });

  add('Put that another way', { body: () =>
    text('Per vehicle · Q3 2026', { left: 120, top: 120, size: 50, color: C.gray, in: Q('Put that another way') }) +
    bars({ x: 360, y: 300, h: 460, bw: 320, gap: 360, max: 3000, items: [
      { label: 'Profit on the new car', value: 2176, show: '$2,176', t: Q('it made a gross profit of 2,176'), color: C.blue },
      { label: 'Finance &amp; insurance', value: 2698, show: '$2,698', t: Q('it made 2,698 dollars'), color: A }] }) +
    text(`The paperwork earns ${hl('more than the car.', A)}`, { left: 120, top: 900, size: 60, in: Q('The paperwork now earns') }),
    src: 'AutoNation Form 10-Q, Q3 2026 (new vehicle gross profit per unit; F&I gross profit per vehicle retailed)' });

  // ───────────── THE PRICE OF THE MONEY ─────────────
  add('The biggest piece of that paperwork', { mark: false, body: chapter('THE PAPERWORK', 'The price<br>of the money') });

  add("Most dealers don't lend you", { body: () => {
    const t = Q('They send your application');
    const box = (s, c) => `<div style="width:380px;height:200px;background:${c};border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;color:${C.ink};text-align:center">${s}</div>`;
    return text('Not the dealer’s money', { left: 120, top: 120, size: 70, in: Q("Most dealers don't lend") }) +
      el(box('YOU', C.paper), { left: 120, top: 420, in: Q("Most dealers don't lend") + .3, fx: 'pop' }) +
      el(box('DEALER', A), { left: 770, top: 420, in: t, fx: 'pop' }) +
      el(box('BANK', C.blue), { left: 1420, top: 420, in: Q('to a bank') }) +
      arrow(520, 520, 760, 520, C.paper, t + .3) + arrow(1170, 520, 1410, 520, C.paper, Q('to a bank') + .2) +
      text('rate: 7.0%', { left: 1440, top: 680, size: 56, color: C.blue, in: Q('the bank quotes them a rate') }) +
      arrow(1410, 580, 1180, 580, C.blue, Q('the bank quotes them a rate') + .2); } });

  add('Then, as the Consumer Financial', { body: () =>
    doc({ left: 120, top: 150, w: 1150, kind: 'FACT SHEET', issuer: 'Consumer Financial Protection Bureau', date: 'MARCH 2013', title: 'Auto finance: how dealer markup works',
      lines: ['“This increase in rate is typically called ‘dealer markup.’”', '“The lender shares part of the revenue from that increased interest rate with the dealer.”'], hlIdx: 0, hlAt: Q('typically called dealer markup'), in: Q('Then, as the Consumer Financial') }) +
    text('Bank rate', { left: 1400, top: 260, size: 44, color: C.gray, in: Q('the dealer can raise that rate') }) +
    text('7.0%', { left: 1400, top: 320, size: 110, color: C.blue, in: Q('the dealer can raise that rate') + .2 }) +
    text('Your rate', { left: 1400, top: 500, size: 44, color: C.gray, in: Q('before it reaches you') }) +
    text('8.0%', { left: 1400, top: 560, size: 110, color: C.red, in: Q('before it reaches you') + .2 }) +
    text('(illustration)', { left: 1400, top: 700, size: 32, color: C.gray, in: Q('before it reaches you') + .3 }) +
    text('Part of the extra → dealer', { left: 120, top: 860, size: 54, color: A, in: Q('And the lender shares part') }),
    src: 'CFPB, “Auto finance” fact sheet, March 2013. Rates shown are an illustration' });

  add("Here's the honest part", { body: () =>
    text('Here’s the honest part.', { left: 120, top: 130, size: 70, in: Q("Here's the honest part") }) +
    el(`<div style="width:1300px;height:120px;background:${C.white};border-radius:60px;display:flex;align-items:center;padding:0 50px;font-size:44px;font-weight:600;color:#333">🔍&nbsp; how often are car loan rates marked up?<span style="display:inline-block;width:4px;height:56px;background:#333;margin-left:8px"></span></div>`, { left: 120, top: 330, in: Q('We looked for a public number'), fx: 'wipe', dur: 1.2 }) +
    stamp('NOT REPORTED', { left: 520, top: 560, in: Q("We couldn't find one"), size: 80 }) +
    text('So: a simple illustration', { left: 120, top: 820, size: 54, color: A, in: Q("So here's a simple illustration") }) });

  add('In the third quarter of 2026, the average new car loan', { body: () => {
    const r = (s, t, top, c = C.paper) => text(s, { left: 140, top, size: 64, color: c, in: t, fx: 'left' });
    return kicker('Average new car loan · Q3 2026', { color: C.gray, in: Q._s }) +
      r('$44,664 borrowed', Q('44,664 dollars'), 190) + r('7.0% · ~70 months', Q('at 7 percent'), 290) +
      line({ left: 140, top: 410, w: 900, t: Q('By our math') }) +
      text('≈ $780 / month', { left: 140, top: 440, size: 90, color: C.paper, in: Q('By our math') }) +
      kicker('Our estimate', { left: 1150, top: 200, color: A, in: Q('By our math') }) +
      el(car(C.blue, 560), { left: 1200, top: 560, in: Q('the average new car loan was') + .3, fx: 'right' }); },
    src: 'Edmunds Q3 2026 financing data. Payment math is our estimate (standard amortization)' });

  add('Add just one percentage point', { body: () =>
    kicker('Our estimate · same loan, +1 point', { color: A, in: Q('Add just one percentage point') }) +
    bars({ x: 300, y: 250, h: 420, bw: 300, gap: 300, max: 820, items: [
      { label: '7.0% rate', value: 779, show: '$779', t: Q('Add just one percentage point') + .2, color: C.blue },
      { label: '8.0% rate', value: 801, show: '$801', t: Q('the payment rises by about 22'), color: C.red }] }) +
    count({ left: 1250, top: 300, to: 22, pre: '+$', suf: '/mo', t: Q('the payment rises by about 22') + .3, size: 140, color: C.red }) +
    text('over ~70 months:', { left: 1260, top: 520, size: 40, color: C.gray, in: Q('Over the life of the loan') }) +
    count({ left: 1250, top: 580, to: 1500, pre: '≈ $', t: Q('roughly 1,500 dollars more'), size: 130, color: C.red }) +
    text('more interest', { left: 1260, top: 760, size: 40, color: C.gray, in: Q('roughly 1,500 dollars more') + .3 }),
    src: 'Our estimate: $44,664 at 7.0% vs 8.0% over 70 months (standard amortization). Illustration, not a dealer figure' });

  add('Most buyers watch the price of the car', { body: () =>
    text('Price of the car', { left: 120, top: 300, size: 100, color: C.gray, in: Q('Most buyers watch the price of the car') }) +
    text(`Price of the ${hl('money', A)}`, { left: 120, top: 470, size: 120, in: Q('Far fewer watch the price of the money') }) });

  add('And more of them are struggling', { body: () =>
    text('Paying $1,000+ a month', { left: 120, top: 130, size: 64, in: Q('And more of them are struggling') }) +
    count({ left: 110, top: 240, to: 21.2, dec: 1, suf: '%', t: Q('21 percent of new car buyers'), size: 260, color: C.red }) +
    text('of new car buyers, Q3 2026', { left: 130, top: 530, size: 50, color: C.gray, in: Q('21 percent of new car buyers') + .3 }) +
    Array.from({ length: 20 }, (_, i) => el(`<div style="width:60px;height:110px;border-radius:30px 30px 8px 8px;background:${i < 4 ? C.red : C.dim}"></div>`, { left: 1050 + (i % 10) * 76, top: 300 + Math.floor(i / 10) * 150, in: Q('21 percent of new car buyers') + .4 + i * .04, fx: 'pop', dur: .3 })).join('') +
    text('≈ 1 in 5', { left: 1050, top: 640, size: 70, color: C.red, in: Q('pay at least 1,000') }),
    src: 'Edmunds, Q3 2026 new-vehicle financing report (21.2%)' });

  // ───────────── FALL #1 ─────────────
  add('Fall number one: the markup is gone', { mark: false, body: chapter('FALL #1', 'The markup<br>is gone') });

  add('The factories caught up', { body: () => {
    const t = Q('The factories caught up');
    return text('The lots fill back up', { left: 120, top: 110, size: 70, in: t }) +
      lot({ t: t + .3, fill: () => true, step: .02, y: 260, rows: 3 }) +
      el(`<div style="background:${C.ink};padding:20px 30px;border-radius:12px"><div class="t" style="font-size:120px;color:${A}">2.92M</div><div style="font-size:40px;font-weight:700;color:${C.paper}">new cars on lots · Oct 2026</div><div style="font-size:40px;font-weight:700;color:${C.gray}">≈ 87 days of sales</div></div>`, { left: 900, top: 620, in: Q('dealers had 2.92 million'), fx: 'pop' }); },
    src: 'Cox Automotive new-vehicle inventory report, Nov 12, 2026' });

  add('Some brands were far worse', { body: () =>
    text('Days of supply · Sept 2026', { left: 120, top: 120, size: 56, in: Q('Some brands were far worse') }) +
    bars({ x: 300, y: 260, h: 520, bw: 280, gap: 220, max: 180, items: [
      { label: 'Industry (Oct)', value: 87, show: '87', t: Q('Some brands were far worse') + .3, color: C.gray },
      { label: 'Jeep', value: 169, show: '169', t: Q('Jeep dealers had about 169'), color: C.red },
      { label: 'Ram', value: 152, show: '152', t: Q('Ram, about 152'), color: C.red }] }),
    src: 'Cox Automotive inventory reports, September and October 2026' });

  add('When the lot is full', { body: () =>
    text('When the lot is full…', { left: 120, top: 150, size: 80, in: Q('When the lot is full') }) +
    text(`…the leverage flips ${hl('back to you.')}`, { left: 120, top: 280, size: 80, in: Q('the leverage flips back') }) +
    text('Average incentive, Oct 2026', { left: 120, top: 480, size: 44, color: C.gray, in: Q('Automakers are paying more incentives') }) +
    count({ left: 110, top: 540, to: 3490, pre: '$', t: Q('about 3,490 dollars'), size: 200, color: C.lime }) +
    text(`Dealer’s slice ${hl('↓', C.red)}`, { left: 120, top: 830, size: 70, in: Q("And the dealer's slice") }),
    src: 'Cox Automotive / KBB, Oct 2026 (incentives 6.8% of average transaction price)' });

  add("Remember AutoNation's 5,942", { body: () =>
    text('AutoNation · gross profit per new car', { left: 120, top: 110, size: 50, color: C.gray, in: Q("Remember AutoNation's") }) +
    bars({ x: 360, y: 260, h: 500, bw: 320, gap: 360, max: 6200, items: [
      { label: '2022', value: 5942, show: '$5,942', t: Q("Remember AutoNation's") + .3, color: C.lime },
      { label: 'Q3 2026', value: 2176, show: '$2,176', t: Q('it was 2,176'), color: C.red }] }) +
    text('−63%', { left: 1420, top: 330, size: 140, color: C.red, w: 900, in: Q('a drop of about 63'), fx: 'pop' }),
    src: 'AutoNation Form 10-K FY2022; Form 10-Q Q3 2026' });

  add('Its net profit margin went from', { body: () =>
    text('Net profit per $1 of revenue', { left: 120, top: 120, size: 56, color: C.gray, in: Q('Its net profit margin') }) +
    text('2022', { left: 200, top: 300, size: 54, color: C.gray, in: Q('Its net profit margin') + .2 }) +
    count({ left: 180, top: 370, to: 5.1, dec: 1, pre: '≈ ', suf: '¢', t: Q('about 5 percent'), size: 220, color: C.lime }) +
    text('Q3 2026', { left: 1050, top: 300, size: 54, color: C.gray, in: Q('to about 2 percent') }) +
    count({ left: 1030, top: 370, to: 2.3, dec: 1, pre: '≈ ', suf: '¢', t: Q('to about 2 percent'), size: 220, color: C.red }),
    src: 'AutoNation: 2022 net income $1,377.4M on $26,985M revenue; Q3 2026 $162.3M on $7,010.3M (our arithmetic)' });

  add("The tariffs didn't help", { body: () =>
    text('The tariffs didn’t help.', { left: 120, top: 130, size: 76, in: Q("The tariffs didn't help") }) +
    date('APR 3, 2025', Q('On April 3rd, 2025'), { top: 290 }) +
    count({ left: 110, top: 360, to: 25, suf: '%', t: Q('a 25 percent tariff'), size: 260, color: C.red }) +
    text('tariff on imported cars', { left: 130, top: 650, size: 54, in: Q('tariff on imported cars') }) +
    text(`Prices ${hl('↑', C.red)}   Dealer profit per car ${hl('↓', C.red)}`, { left: 120, top: 820, size: 62, in: Q('Prices went up for buyers') }),
    src: 'Federal Register, Proclamation 10908 (Apr 3, 2025)' });

  // ───────────── FALL #2 ─────────────
  add('Fall number two came from the regulators', { mark: false, body: chapter('FALL #2', 'The regulators') });

  add('In December 2023, the FTC finished', { body: () =>
    doc({ left: 120, top: 140, w: 1150, kind: 'PRESS RELEASE', issuer: 'Federal Trade Commission', date: 'DEC 12, 2023', title: 'FTC Announces CARS Rule to Fight Scams in Vehicle Shopping',
      lines: ['Bans bait-and-switch pricing claims', 'Requires an all-in “offering price”', 'Bans charges for add-ons with no benefit'], hlIdx: 2, hlAt: Q('add-ons that give the buyer no benefit'), in: Q('In December 2023') }) +
    text('“CARS Rule”', { left: 1380, top: 300, size: 70, color: A, in: Q('It was called the CARS Rule') }),
    src: 'FTC press release, Dec 12, 2023 (paraphrased summary of the rule)' });

  add('The FTC claimed it would save', { body: () =>
    text('What the FTC claimed it would save buyers', { left: 120, top: 150, size: 56, color: C.gray, in: Q('The FTC claimed it would save') }) +
    count({ left: 110, top: 260, to: 3.4, dec: 1, pre: '$', suf: 'B', t: Q('3.4 billion'), size: 300, color: C.lime }) +
    text('a year', { left: 130, top: 600, size: 70, in: Q('3.4 billion') + .4 }),
    src: 'FTC press release, Dec 12, 2023 (FTC estimate)' });

  add('The dealers sued', { body: () =>
    text('The dealers sued.', { left: 120, top: 140, size: 80, in: Q('The dealers sued') }) +
    date('JAN 27, 2025', Q('And on January 27th'), { top: 290 }) +
    doc({ left: 120, top: 380, w: 1300, kind: 'U.S. COURT OF APPEALS · FIFTH CIRCUIT', issuer: 'NADA v. FTC, No. 24-60013', date: 'JAN 27, 2025', title: 'CARS Rule vacated',
      lines: ['“The FTC violated its own regulations when it failed to issue an ANPRM…”'], hlIdx: 0, hlAt: Q('skipped a required step'), in: Q('a federal appeals court threw') }) +
    stamp('VACATED', { left: 1350, top: 220, in: Q('threw the rule out'), size: 80 }),
    src: 'U.S. Court of Appeals for the Fifth Circuit, opinion No. 24-60013 (ANPRM = advance notice of proposed rulemaking)' });

  add('So the FTC went after dealers', { body: () =>
    text('One dealer at a time', { left: 120, top: 120, size: 70, in: Q('So the FTC went after dealers') }) +
    cardStack({ x: 120, y: 280, w: 900, h: 500, items: [
      { top: 'DEC 2024 · CHICAGO AREA', title: 'Leader Automotive Group', body: 'FTC and Illinois alleged unwanted add-ons and hidden junk fees. Settled for $20 million.', t: Q('Leader Automotive, the Chicago group'), stamp: '$20M SETTLEMENT' }] }) +
    count({ left: 1150, top: 380, to: 20, pre: '$', suf: 'M', t: Q('It settled for 20 million'), size: 200, color: C.lime }),
    src: 'FTC press release, Dec 19, 2024. Allegations; settled' });

  add('In March 2026, the FTC sent', { body: () => {
    const t = Q('sent warning letters to 97');
    return date('MAR 13, 2026', Q('In March 2026, the FTC sent')) +
      Array.from({ length: 97 }, (_, i) => el(`<div style="width:56px;height:40px;background:${C.paper};border-radius:4px;position:relative"><div style="position:absolute;left:0;right:0;top:0;height:0;border-left:28px solid transparent;border-right:28px solid transparent;border-top:20px solid #C9C3B3"></div></div>`, { left: 120 + (i % 20) * 72, top: 260 + Math.floor(i / 20) * 64, in: t + i * .02, fx: 'pop', dur: .25 })).join('') +
      count({ left: 1580, top: 260, to: 97, t: t, size: 150, color: A }) +
      text('warning letters to dealership groups', { left: 120, top: 640, size: 54, in: t + 1 }) +
      text('advertised prices that left out required fees', { left: 120, top: 740, size: 46, color: C.gray, in: Q('about advertised prices') }); },
    src: 'FTC press release, Mar 13, 2026' });

  add('In August, a Connecticut Nissan dealer', { body: () =>
    date('AUG 19, 2026', Q('In August, a Connecticut')) +
    usmap({ x: 820, y: 180, scale: .85, pins: [{ city: 'Manchester', label: 'Connecticut', t: Q('a Connecticut Nissan dealer'), dx: -260, dy: 70, color: C.red }], in: Q('In August, a Connecticut') }) +
    count({ left: 110, top: 260, to: 4, pre: '$', suf: 'M', t: Q('agreed to pay 4 million'), size: 220, color: C.lime }) +
    text('settlement · FTC + Connecticut', { left: 130, top: 500, size: 40, color: C.gray, in: Q('agreed to pay 4 million') + .3 }) +
    text('Alleged: double charging<br>for “certified” cars', { left: 120, top: 640, size: 56, in: Q('double charged buyers') }),
    src: 'FTC press release, Aug 19, 2026 (Manchester City Nissan). Allegations; settled' });

  add('In October, the FTC said a Florida', { body: () =>
    date('OCT 8, 2026', Q('In October, the FTC said')) +
    usmap({ x: 820, y: 180, scale: .85, pins: [{ city: 'Tampa', label: 'Florida', t: Q('a Florida dealer group'), dx: -230, dy: 70, color: C.red }], in: Q('In October, the FTC said') }) +
    text('FTC alleged:', { left: 120, top: 240, size: 44, color: C.gray, in: Q('a Florida dealer group') }) +
    count({ left: 110, top: 300, to: 3350, pre: '+$', t: Q('about 3,350 dollars'), size: 190, color: C.red }) +
    text('above the advertised price', { left: 130, top: 520, size: 46, in: Q('above the advertised price') }) +
    count({ left: 110, top: 640, to: 92, suf: '%+', t: Q('in more than 92 percent'), size: 170, color: A }) +
    text('of deals', { left: 130, top: 840, size: 46, in: Q('in more than 92 percent') + .3 }),
    src: 'FTC press release, Oct 8, 2026 (Greenway Auto Group). Allegations; proposed order' });

  add('And in November, it settled', { body: () =>
    date('NOV 9, 2026', Q('And in November, it settled')) +
    usmap({ x: 820, y: 180, scale: .85, pins: [{ city: 'Long Island', label: 'Long Island, N.Y.', t: Q('a Long Island lot'), dx: -360, dy: 70, color: C.red }], in: Q('And in November, it settled') }) +
    text('The ad said:', { left: 120, top: 300, size: 50, color: C.gray, in: Q('whose ads promised') }) +
    el(`<div style="background:${C.white};padding:40px 50px;border:8px solid ${C.ink};font-size:76px;font-weight:900;color:${C.ink};letter-spacing:.02em">“NO FEES.<br>NO GAMES.”</div>`, { left: 120, top: 400, in: Q('quote, no fees'), fx: 'pop' }) +
    text('FTC alleged bait pricing and hidden down payments', { left: 120, top: 860, size: 40, color: C.red, in: Q('quote, no fees') + 1.2 }),
    src: 'FTC press release, Nov 9, 2026 (Stream Auto Outlet). Allegations; proposed order' });

  add('To be clear, these are allegations', { body: () =>
    text('Allegations and settlements.<br>Not court findings.', { left: 120, top: 200, size: 76, color: C.gray, in: Q('To be clear, these are allegations') }) +
    usmap({ x: 1180, y: 380, scale: .55, states: [{ s: 'California', t: Q("But California didn't wait") }], in: Q("But California didn't wait") - .2 }) +
    text(`California ${hl("didn't wait.", A)}`, { left: 120, top: 520, size: 90, in: Q("But California didn't wait") }) });

  add('Its new law, in effect since', { body: () =>
    date('OCT 1, 2026 · CALIFORNIA', Q('Its new law, in effect')) +
    cardStack({ x: 120, y: 260, w: 540, h: 560, items: [
      { top: 'USED CARS ≤ $50,000', title: '3 days to cancel', body: 'Buyers can cancel within three days, for a restocking fee.', t: Q('lets buyers cancel the purchase') },
      { top: 'ADD-ONS', title: 'Optional means optional', body: 'Optional add-ons must be labeled optional, in writing.', t: Q('Optional add-ons now have to be') },
      { top: 'NO-BENEFIT EXTRAS', title: 'Banned', body: 'No add-ons that do nothing for the buyer — like an oil change plan on an electric car.', t: Q('And dealers can\'t sell an add-on'), stamp: 'BANNED' }] }),
    src: 'California SB 766 (CARS Act), effective Oct 1, 2026; California DMV summary (paraphrased)' });

  // ───────────── FALL #3 ─────────────
  add('Fall number three is the borrowers', { mark: false, body: chapter('FALL #3', 'The borrowers') });

  add('Remember those 1,000 dollar payments', { body: () =>
    text('$1,000 a month…', { left: 120, top: 300, size: 130, color: C.red, in: Q('Remember those 1,000') }) +
    text('Not everyone can keep paying.', { left: 120, top: 520, size: 76, in: Q('Not everyone can keep making them') }) });

  add('In October 2025, the share of subprime', { body: () =>
    text('Subprime auto loans 60+ days past due', { left: 120, top: 110, size: 56, in: Q('the share of subprime') }) +
    date('OCT 2025', Q('In October 2025, the share'), { top: 210 }) +
    count({ left: 110, top: 290, to: 6.65, dec: 2, suf: '%', t: Q('hit 6.65 percent'), size: 260, color: C.red }) +
    el(`<div style="width:1500px;height:60px;background:${C.panel};border-radius:30px;overflow:hidden"><div style="width:66.5%;height:100%;background:${C.red};transform-origin:left;animation:grow 1.2s cubic-bezier(.2,.8,.2,1) ${rel(Q('hit 6.65 percent'))}s both"></div></div>`, { left: 120, top: 620 }) +
    text('of loans · scale 0–10%', { left: 120, top: 700, size: 32, color: C.gray, in: Q('hit 6.65 percent') + .4 }) +
    stamp('RECORD SINCE 1994', { left: 980, top: 300, in: Q('going back to 1994'), size: 60 }),
    src: 'Fitch Ratings via Bloomberg Government (Oct 2025: 6.65%, highest in data back to 1994)' });

  add('In 2024, Cox Automotive estimated', { body: () =>
    text('Cars repossessed in 2024', { left: 120, top: 130, size: 60, in: Q('In 2024, Cox Automotive estimated') }) +
    count({ left: 110, top: 240, to: 1.73, dec: 2, pre: '≈ ', suf: 'M', t: Q('about 1.73 million'), size: 210, color: C.red }) +
    text('most since 2009', { left: 130, top: 540, size: 60, color: A, in: Q('the most since 2009') }) +
    Array.from({ length: 6 }, (_, i) => el(car(C.gray, 200), { left: 1180 + (i % 3) * 230, top: 560 + Math.floor(i / 3) * 150, in: Q('about 1.73 million') + i * .12, fx: 'pop', dur: .35 })).join(''),
    src: 'Cox Automotive estimate, reported by Carscoops, Mar 2025' });

  add('The businesses that sell to those buyers', { body: () =>
    text('The hardest hit', { left: 120, top: 130, size: 70, in: Q('The businesses that sell to those buyers') }) +
    person({ left: 120, top: 300, name: 'Tricolor Holdings', role: 'Dallas · sold used cars in Texas and made the loans itself', initials: 'T', size: 220, color: C.red, in: Q('Tricolor sold used cars') }) +
    date('SEPT 10, 2025', Q('It filed for Chapter 7'), { top: 620 }) +
    text('Chapter 7 · shut down', { left: 120, top: 710, size: 72, color: C.red, in: Q('It filed for Chapter 7') + .3 }),
    src: 'U.S. Attorney’s Office SDNY, Dec 17, 2025' });

  add('Federal prosecutors say it pledged', { body: () =>
    text('Prosecutors allege: the same loans, pledged twice', { left: 120, top: 120, size: 52, in: Q('Federal prosecutors say') }) +
    bars({ x: 300, y: 300, h: 460, bw: 320, gap: 340, max: 2.4, items: [
      { label: 'Collateral pledged', value: 2.2, show: '$2.2B', t: Q('about 2.2 billion dollars'), color: A },
      { label: 'Collateral that existed', value: 1.4, show: '$1.4B', t: Q('roughly 1.4 billion'), color: C.gray }] }) +
    text('Owed to lenders: $900M+', { left: 1200, top: 900, size: 46, color: C.red, in: Q('Lenders were left owed') }) +
    text('Aug 2025 · alleged', { left: 1200, top: 300, size: 40, color: C.gray, in: Q('By August 2025, they allege') }),
    src: 'U.S. Attorney’s Office SDNY, Dec 17, 2025 (allegations)' });

  add('Its CEO, Daniel Chu', { body: () =>
    person({ left: 120, top: 220, name: 'Daniel Chu', role: 'Former CEO, Tricolor · charged Dec 2025', initials: 'DC', size: 240, color: C.gray, in: Q('Its CEO, Daniel Chu') }) +
    text('Presumed innocent. The charges are accusations.', { left: 120, top: 580, size: 50, color: C.gray, in: Q('He is presumed innocent') }) +
    text('2 other ex-executives pleaded guilty', { left: 120, top: 740, size: 60, color: C.red, in: Q('Two other former executives') }),
    src: 'U.S. Attorney’s Office SDNY, Dec 17, 2025' });

  add("And America's Car Mart", { body: () =>
    person({ left: 120, top: 120, name: 'America’s Car-Mart', role: 'Public chain that sells and finances used cars', initials: 'CM', size: 180, color: A, in: Q("And America's Car Mart") }) +
    count({ left: 110, top: 360, to: 139, pre: '−$', suf: 'M+', t: Q('lost more than 139'), size: 170, color: C.red }) +
    text('loss, fiscal 2026', { left: 130, top: 560, size: 42, color: C.gray, in: Q('lost more than 139') + .3 }) +
    stamp('GOING CONCERN DOUBT', { left: 900, top: 420, in: Q('substantial doubt'), size: 52 }) +
    text('Stores: 154 → 94', { left: 120, top: 760, size: 80, in: Q('it had 94 stores') }),
    src: 'America’s Car-Mart Form 10-K (fiscal 2026); Talk Business & Politics, Sept 9, 2026' });

  // ───────────── OTHER SIDE ─────────────
  add('Now, the other side', { mark: false, body: chapter('NOW', 'The other side') });

  add('Most dealers are not Tricolor', { body: () =>
    text('Most dealers are not Tricolor.', { left: 120, top: 120, size: 70, in: Q('Most dealers are not Tricolor') }) +
    count({ left: 110, top: 260, to: 16990, t: Q('about 17,000 franchised'), size: 170, color: C.paper }) +
    text('franchised new car dealerships (2025)', { left: 130, top: 460, size: 44, color: C.gray, in: Q('about 17,000 franchised') + .3 }) +
    count({ left: 110, top: 580, to: 1.12, dec: 2, suf: 'M', t: Q('more than 1.1 million people'), size: 170, color: C.lime }) +
    text('people employed', { left: 130, top: 780, size: 44, color: C.gray, in: Q('more than 1.1 million people') + .3 }),
    src: 'NADA Data 2025 (16,990 dealerships; 1,123,100 employees)' });

  add('And the margins are thinner', { body: () =>
    text('Thinner than you think', { left: 120, top: 120, size: 70, in: Q('And the margins are thinner') }) +
    el(`<div style="width:300px;height:300px;border-radius:50%;background:${C.amber};display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:900;color:${C.ink}">$1</div>`, { left: 200, top: 360, in: Q('AutoNation kept about 2 cents'), fx: 'pop' }) +
    el(`<div style="width:70px;height:70px;border-radius:50%;background:${C.lime};display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:${C.ink}">2¢</div>`, { left: 640, top: 590, in: Q('AutoNation kept about 2 cents') + .6, fx: 'pop' }) +
    text('profit kept per $1 of revenue', { left: 800, top: 460, size: 56, in: Q('AutoNation kept about 2 cents') + .6 }) +
    text('AutoNation, Q3 2026', { left: 800, top: 560, size: 40, color: C.gray, in: Q('AutoNation kept about 2 cents') + .8 }),
    src: 'AutoNation Form 10-Q, Q3 2026 ($162.3M net income on $7,010.3M revenue)' });

  add("The legal fight isn't one sided", { body: () =>
    text('Not one sided', { left: 120, top: 120, size: 70, in: Q("The legal fight isn't one sided") }) +
    cardStack({ x: 120, y: 280, w: 820, h: 460, items: [
      { top: 'JAN 2025', title: 'CARS Rule', body: 'Thrown out by a federal appeals court on procedure.', t: Q('The CARS Rule is gone'), stamp: 'GONE', stampColor: C.gray },
      { top: 'OCT 5, 2026', title: 'FTC v. Asbury Automotive', body: 'The FTC dismissed its own case. No ruling on the claims.', t: Q('the FTC dropped its case'), stamp: 'DISMISSED', stampColor: C.gray }] }),
    src: 'Fifth Circuit No. 24-60013; FTC order dismissing complaint, Docket 9436, Oct 5, 2026' });

  add('Dealers also argue they do real work', { body: () =>
    text('Dealers say they do real work', { left: 120, top: 120, size: 66, in: Q('Dealers also argue') }) +
    ['Hold the inventory', 'Take trade-ins', 'Handle registration', 'Run the service bays'].map((s, i) => chip(s, { left: 120 + (i % 2) * 620, top: 300 + Math.floor(i / 2) * 150, in: Q(['They hold the inventory', 'take trade-ins', 'handle registration', 'run the service bays'][i]), size: 44, bg: C.paper, bd: C.paper, color: C.ink })).join('') +
    text('Many states: new cars must be sold through franchised dealers', { left: 120, top: 720, size: 46, color: A, in: Q('franchise laws still say') }),
    src: 'Kelley Blue Book, Feb 5, 2025 (state franchise laws)' });

  // ───────────── IT HAPPENED BEFORE ─────────────
  add('And dealers have survived worse', { mark: false, body: chapter('IT HAPPENED', 'Before', 'May 2009') });

  add('In May 2009, as Chrysler', { body: () => {
    const t = Q('it told 789');
    return date('MAY 14, 2009', Q('In May 2009, as Chrysler')) +
      text('Chrysler', { left: 120, top: 220, size: 64, in: Q('as Chrysler went through bankruptcy') }) +
      el(`<div style="display:grid;grid-template-columns:repeat(20,30px);gap:8px">${Array.from({ length: 80 }, (_, i) => `<div style="width:30px;height:30px;border-radius:5px;background:${i < 20 ? C.red : C.dim};animation:pop .3s ease ${(t - Q._s + .3 + i * .015).toFixed(2)}s both"></div>`).join('')}</div>`, { left: 120, top: 340 }) +
      text('789 of ~3,200 dealers cut', { left: 120, top: 560, size: 60, color: C.red, in: t + .4 }) +
      text('Next day · GM: ~1,100 not renewed', { left: 120, top: 700, size: 60, in: Q('The next day, GM') }) +
      text('NADA warned: ~100,000 jobs at risk', { left: 120, top: 830, size: 50, color: C.gray, in: Q('nearly 100,000 jobs') }); },
    src: 'Congressional Research Service R40712; NPR, May 15, 2009' });

  add('Dealers took it to Congress', { body: () =>
    text('Dec 2009: Congress gives cut dealers arbitration', { left: 120, top: 200, size: 60, in: Q('Dealers took it to Congress') }) +
    text('About a decade later…', { left: 120, top: 420, size: 60, color: C.gray, in: Q('About a decade later') }) +
    text('record profits', { left: 120, top: 510, size: 110, color: C.lime, in: Q('posting record profits') }) +
    text(`Dealers don’t disappear. ${hl('They adapt.', A)}`, { left: 120, top: 780, size: 70, in: Q("Dealers don't disappear") }),
    src: 'Public Law 111-117 (Dec 16, 2009); NADA via Jalopnik (2020 record dealership profit)' });

  // ───────────── VERDICT ─────────────
  add('So, are car dealerships finally', { mark: false, body: chapter('SO…', 'The verdict', 'Did they get what they deserve?') });

  add('Some of them are', { body: () =>
    text('Some of them are.', { left: 120, top: 110, size: 76, in: Q('Some of them are') }) +
    ['Markup years: over · profit per new car −63%', 'Fee cases: settlements · California: 3 days to cancel', 'Tricolor’s lenders: still counting'].map((s, i) => text(s, { left: 120, top: 320 + i * 160, size: 52, color: [C.red, A, C.paper][i], in: Q(['The markup years are over', 'The ones accused of hiding fees', 'And the lenders who trusted'][i]), fx: 'left' })).join('') });

  add('But the model itself is doing just fine', { body: () =>
    text('But the model is doing just fine.', { left: 120, top: 120, size: 70, in: Q('But the model itself') }) +
    el(`<div style="width:1680px;height:200px;display:flex;border-radius:12px;overflow:hidden">
      <div style="width:80%;background:${C.lime};display:flex;flex-direction:column;justify-content:center;padding-left:40px;color:${C.ink};font-weight:900;font-size:64px;transform-origin:left;animation:grow .7s ease ${rel(Q('the service bay and the finance office together'))}s both">≈ 80%<span style="font-size:30px;font-weight:700">service bay + finance office</span></div>
      <div style="width:11.5%;background:${C.blue};display:flex;flex-direction:column;justify-content:center;padding-left:16px;color:${C.ink};font-weight:900;font-size:44px;transform-origin:left;animation:grow .5s ease ${rel(Q('The new car out front'))}s both">11%<span style="font-size:20px;font-weight:700">new car</span></div>
      <div style="width:8.5%;background:${C.gray};transform-origin:left;animation:grow .5s ease ${rel(Q('The new car out front') + .3)}s both"></div></div>`, { left: 120, top: 400 }) +
    text('AutoNation gross profit, Q3 2026', { left: 120, top: 660, size: 40, color: C.gray, in: Q('the service bay and the finance office together') }),
    src: 'AutoNation Form 10-Q, Q3 2026 (our arithmetic: ($616.6M + $349.0M) / $1,207.6M)' });

  add("Here's the number that sums it up", { body: () =>
    text('The number that sums it up', { left: 120, top: 110, size: 60, color: C.gray, in: Q("Here's the number that sums it up") }) +
    sticker({ left: 120, top: 260, w: 760, msrp: '≈ $51,000', in: Q('On a car that costs 51,000') }) +
    el(car(C.blue, 600), { left: 200, top: 560, in: Q('On a car that costs 51,000') + .3, fx: 'left' }) +
    text('per car, AutoNation Q3 2026', { left: 1000, top: 240, size: 36, color: C.gray, in: Q('made more money on the paperwork') }) +
    text(`Paperwork: ${hl('$2,698', A)}`, { left: 1000, top: 320, size: 76, in: Q('made more money on the paperwork') }) +
    text(`The car: ${hl('$2,176', C.blue)}`, { left: 1000, top: 450, size: 76, in: Q('than on the car') }),
    src: 'Cox/KBB Oct 2026 average price; AutoNation 10-Q Q3 2026 gross profit per vehicle' });

  add("The car isn't really the product", { body: () =>
    text('The car isn’t the product.', { left: 120, top: 250, size: 100, color: C.gray, in: Q("The car isn't really the product") }) +
    text(`It’s the reason you ${hl('walk in.', A)}`, { left: 120, top: 420, size: 100, in: Q("It's the reason you walk") }) +
    text('Check the price of the money, not just the car.', { left: 120, top: 700, size: 56, color: C.lime, in: Q('check the price of the money') }) });

  add('Next on Money Encode', { body: () =>
    text('NEXT ON MONEY ENCODE', { left: 120, top: 300, size: 44, color: A, in: Q('Next on Money Encode'), css: 'letter-spacing:.14em' }) +
    text(`The ${hl('$40')} oil change<br>that’s never $40`, { left: 120, top: 380, size: 120, in: Q('the 40 dollar oil change') }) });

  return S;
}
