// Scene list for "Car Washes Are (Finally) Getting What They Deserve…"
// Every scene starts on a phrase of the voiceover (Q) and ends where the next one starts.
import { C, el, text, kicker, count, doc, headline, person, usmap, kiosk, car, tunnel, bars, cardStack, stamp, line, hl } from './lib.mjs';

export default function scenes(Q, E) {
  const S = [];
  const add = (cue, o) => S.push({ cue, ...o });
  const chip = (s, o) => el(`<div style="display:inline-block;padding:22px 34px;border-radius:999px;background:${o.bg || C.panel};border:3px solid ${o.bd || C.dim};font-size:${o.size || 40}px;font-weight:800;color:${o.color || C.paper}">${s}</div>`, { fx: 'pop', dur: .45, ...o });
  const chapter = (n, title, sub) => () =>
    el(`<div style="width:1920px;height:1080px;background:${C.blue}"></div>`, { left: 0, top: 0, in: 0.0 + 0, fx: 'wipe', dur: .5 }) +
    text(n, { left: 140, top: 330, size: 54, color: C.ink, w: 900, in: Q._s + .15, css: 'letter-spacing:.14em' }) +
    text(title, { left: 140, top: 420, size: 150, color: C.ink, w: 900, in: Q._s + .3 }) +
    (sub ? text(sub, { left: 144, top: 620, size: 44, color: C.deep, w: 700, in: Q._s + .6 }) : '');

  // ───────────── COLD OPEN ─────────────
  add('On February 5th', { body: () =>
    text('FEB 5, 2025', { left: 120, top: 120, size: 64, color: C.blue, in: Q('On February 5th'), fx: 'left' }) +
    usmap({ x: 360, y: 190, pins: [{ city: 'Dallas', label: 'Bankruptcy court, Dallas', t: Q('walked into a bankruptcy court'), dx: -470, dy: 70 }], in: Q('On February 5th') + .2 }) +
    text('One of America’s biggest car wash chains', { left: 120, top: 210, size: 40, color: C.paper, w: 700, in: Q('one of the biggest car wash chains') }),
    src: 'Bloomberg Law, Feb 6, 2025; U.S. Bankruptcy Court, N.D. Texas, case 25-80069' });

  add('Zips Car Wash had about 260', { body: () =>
    headline({ left: 160, top: 170, outlet: 'Law360', date: 'Feb 6, 2025', text: 'Zips Car Wash Hits Ch. 11 With Plan To Trim $279M Debt', in: Q('Zips Car Wash had about 260') }) +
    count({ left: 170, top: 560, to: 260, t: Q('about 260'), size: 180, color: C.paper }) + text('locations', { left: 180, top: 770, size: 44, color: C.gray, in: Q('about 260') + .2 }) +
    count({ left: 820, top: 560, to: 23, t: Q('in 23 states'), size: 180, color: C.paper }) + text('states', { left: 830, top: 770, size: 44, color: C.gray, in: Q('in 23 states') + .2 }),
    src: 'Law360, Feb 6, 2025; CoStar, Mar 12, 2025' });

  add('It owed 654', { body: () =>
    text('Debt at filing', { left: 120, top: 250, size: 54, color: C.gray, in: Q('It owed 654') }) +
    count({ left: 110, top: 340, to: 654, pre: '$', suf: 'M', t: Q('It owed 654') + .1, size: 330, color: C.red, dur: 1.2 }),
    src: 'Bloomberg Law, Feb 6, 2025 ($654 million of total funded debt)' });

  add('Twenty days later', { body: () =>
    text('FEB 25, 2025', { left: 120, top: 110, size: 64, color: C.blue, in: Q('Twenty days later'), fx: 'left' }) +
    doc({ left: 120, top: 230, w: 1080, issuer: 'Driven Brands Holdings Inc.', date: 'FEB 25, 2025', title: 'Driven Brands Announces Agreement to Divest U.S. Car Wash Business for $385 Million',
      lines: ['“This transaction will enable Driven Brands to reduce debt and enhance our focus on our growing Take 5 Oil Change® brand…”', '— Jonathan Fitzpatrick, President and CEO'], hlIdx: 0, hlAt: Q('getting out of car washes'), in: Q('Driven Brands') }) +
    count({ left: 1300, top: 560, to: 385, pre: '$', suf: 'M', t: Q('for 385 million'), size: 150, color: C.lime }),
    src: 'Driven Brands press release, Feb 25, 2025' });

  add('Then the lawsuits arrived', { body: () =>
    text('Then came the lawsuits', { left: 120, top: 110, size: 72, in: Q('Then the lawsuits arrived') }) +
    usmap({ x: 420, y: 200, states: ['California', 'Arizona', 'Colorado'].map(n => ({ s: n, t: Q(n + '.') })), in: Q('Then the lawsuits arrived') + .1 }) +
    ['California', 'Arizona', 'Colorado'].map((n, i) => chip(n, { left: 140 + i * 400, top: 930, in: Q(n + '.'), bg: C.blue, bd: C.blue, color: C.ink })).join('') });

  add('Customers said they paid for one wash', { body: () => {
    const t0 = Q('Customers said they paid for one wash');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
    return text('“I paid for one wash.”', { left: 120, top: 140, size: 76, in: t0 }) +
      months.map((m, i) => el(`<div style="width:240px;height:300px;background:${C.panel};border-radius:10px;border:3px solid ${C.dim};padding:24px">
        <div class="k" style="color:${C.gray}">${m}</div><div class="t" style="font-size:52px;color:${C.red};margin-top:110px">−$25</div></div>`,
        { left: 120 + i * 285, top: 400, in: Q('kept getting charged') + i * .28, fx: 'pop', dur: .4 })).join('') +
      text('Charged every month', { left: 120, top: 760, size: 48, color: C.red, in: Q('every month.') }); },
    src: 'Claims made in lawsuits against car wash chains, 2025 (illustration; amounts vary by case)' });

  add('And in May 2026', { body: () =>
    text('MAY 19, 2026', { left: 120, top: 110, size: 64, color: C.blue, in: Q('And in May 2026'), fx: 'left' }) +
    doc({ left: 120, top: 230, w: 1150, kind: 'SEC FORM 8-K · EXHIBIT 99.1', issuer: 'Mister Car Wash, Inc.', date: 'MAY 19, 2026', title: 'Mister Car Wash Announces Completion of Take-Private by Leonard Green & Partners',
      lines: ['…for $7.00 per share in cash.', 'Mister Car Wash’s common stock has ceased trading and will be delisted from Nasdaq.'], hlIdx: 0, hlAt: Q('at 7 dollars a share'), in: Q('the biggest car wash company') }),
    src: 'Mister Car Wash, Form 8-K, May 19, 2026' });

  add('Five years earlier', { body: () =>
    text('2021', { left: 260, top: 230, size: 60, color: C.gray, in: Q('Five years earlier') }) +
    count({ left: 230, top: 320, to: 15, pre: '$', t: Q('Five years earlier') + .2, size: 300, color: C.paper }) +
    text('sold to the public', { left: 260, top: 640, size: 44, color: C.gray, in: Q('sold that same stock') }) +
    el(`<svg width="300" height="200"><path d="M10 40 L250 160" stroke="${C.red}" stroke-width="16" stroke-linecap="round"/><path d="M200 175 L262 166 L240 108" fill="none" stroke="${C.red}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { left: 760, top: 380, in: Q('for 15.'), fx: 'fade' }) +
    text('2026', { left: 1170, top: 230, size: 60, color: C.gray, in: Q('for 15.') + .2 }) +
    text('$7', { left: 1140, top: 320, size: 300, color: C.red, w: 900, in: Q('for 15.') + .3, fx: 'pop' }) +
    text('bought back', { left: 1170, top: 640, size: 44, color: C.gray, in: Q('for 15.') + .4 }),
    src: 'SEC Form 424B4 (June 2021 IPO at $15.00); Form 8-K (May 2026, $7.00 per share)' });

  add("Here's the strange part", { body: () =>
    text('Here’s the strange part.', { left: 120, top: 120, size: 72, in: Q("Here's the strange part") }) +
    text('Mister Car Wash members', { left: 120, top: 300, size: 40, color: C.gray, in: Q('paying for more car wash memberships') }) +
    bars({ x: 160, y: 400, h: 380, bw: 260, gap: 160, max: 2.6, items: [
      { label: 'Mar 2021', value: 1.4, show: '1.4M', t: Q('paying for more car wash memberships') + .2, color: C.blue },
      { label: 'Dec 2025', value: 2.3, show: '2.3M', t: Q('memberships than ever') + .2, color: C.lime }] }) +
    text(`Money ${hl('↑')}`, { left: 1100, top: 430, size: 110, in: Q('The money keeps coming in') }) +
    text(`Trust ${hl('↓', C.red)}`, { left: 1100, top: 600, size: 110, in: Q("The trust doesn't") }),
    src: 'Mister Car Wash IPO prospectus (2021); Q4/FY2025 results (Feb 18, 2026)' });

  add('This is the story of how', { body: () =>
    text('How washing a car became a subscription', { left: 120, top: 260, size: 62, in: Q('how washing a car') }) +
    text('Who got rich from it', { left: 120, top: 420, size: 62, color: C.lime, in: Q('who got rich') }) +
    text('Why the bill is coming due', { left: 120, top: 580, size: 62, color: C.red, in: Q('why the bill') }) });

  add(E('finally coming due.') + 0.35, { mark: false, cam: false, body: () => {
    const t = Q._s;
    return el(`<div style="width:1920px;height:1080px;background:${C.lime}"></div>`, { left: 0, top: 0, in: t, fx: 'wipe', dur: .45 }) +
      el(`<div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(5,44px);gap:10px">${['XXX', 'X..', 'XXX', '..X', 'XXX'].join('').split('').map((c, i) => `<b style="display:block;background:${c === 'X' ? C.ink : 'transparent'};animation:${`pop .3s ease ${(.35 + i * .04).toFixed(2)}s both`}"></b>`).join('')}</div>`, { left: 300, top: 360 }) +
      text('MONEY ENCODE', { left: 520, top: 420, size: 96, color: C.ink, w: 900, in: t + .9, fx: 'left', css: 'letter-spacing:.08em' }) +
      text('Car Washes Are (Finally) Getting What They Deserve…', { left: 524, top: 560, size: 40, color: C.deep, w: 700, in: t + 1.3 }); } });

  // ───────────── GLORY DAYS ─────────────
  add('For most of the last century', { body: () =>
    tunnel({ t0: Q('For most of the last century'), n: 3, speed: 7 }) +
    text('A simple trade', { left: 120, top: 110, size: 70, in: Q('a simple trade') }) +
    text('pull in', { left: 140, top: 830, size: 50, color: C.paper, in: Q('You pulled in') }) +
    text('pay', { left: 520, top: 830, size: 50, color: C.lime, in: Q('you paid') }) +
    text('leave', { left: 800, top: 830, size: 50, color: C.paper, in: Q('you left') }) +
    text('1 car = 1 payment', { left: 1200, top: 830, size: 56, color: C.lime, in: Q('Cash per car') }) });

  add('That changed, quietly', { body: () =>
    count({ left: 120, top: 200, from: 1980, to: 2003, comma: false, t: Q('That changed'), dur: 1.3, size: 280, color: C.blue }) +
    usmap({ x: 820, y: 220, scale: .82, pins: [{ city: 'Tucson', label: 'Tucson, Ariz.', t: Q('A chain from Tucson'), dx: -60, dy: 70 }], in: Q('A chain from Tucson') - .3 }) +
    el(`<div style="background:${C.lime};padding:28px 40px;border-radius:12px"><div class="k" style="color:${C.ink}">Mister Car Wash</div><div class="t" style="font-size:64px;color:${C.ink};margin-top:8px">Unlimited<br>Wash Club</div></div>`, { left: 120, top: 560, in: Q('the Unlimited Wash Club'), fx: 'pop' }) });

  add('One monthly fee', { body: () => {
    const t0 = Q('One monthly fee');
    const cells = Array.from({ length: 30 }, (_, i) => `<div style="width:118px;height:96px;border-radius:8px;background:${C.panel};position:relative">${[2, 5, 9, 12, 16, 19, 23, 27].includes(i) ? `<div style="position:absolute;inset:18px 30px;border-radius:50%;background:${C.blue};animation:pop .35s ease ${(at0(t0) + 1.3 + i * .05).toFixed(2)}s both"></div>` : ''}</div>`).join('');
    function at0(x) { return x - Q._s; }
    return text('1 fee', { left: 120, top: 160, size: 120, color: C.lime, in: t0 }) + text('per month', { left: 120, top: 300, size: 46, color: C.gray, in: t0 + .2 }) +
      el(`<div style="display:grid;grid-template-columns:repeat(7,118px);gap:12px">${cells}</div>`, { left: 860, top: 160, in: t0 + .3, fx: 'fade' }) +
      text('Wash as often<br>as you like', { left: 120, top: 520, size: 72, in: Q('Wash as often') }); } });

  add('It sounds like a gift', { body: () =>
    text('A gift to the customer?', { left: 120, top: 280, size: 80, color: C.gray, in: Q('It sounds like a gift') }) +
    text(`A gift to the ${hl('business.')}`, { left: 120, top: 460, size: 100, in: Q('It was really a gift') }) });

  add('A wash that charges per car', { body: () => {
    const v1 = [70, 45, 88, 30, 62, 20, 95, 50, 35, 80, 25, 66];
    const t0 = Q('A wash that charges per car'), t1 = Q('A wash that charges per month');
    const b = (vals, color, t, x, lab) => el(`<div style="display:flex;align-items:flex-end;gap:12px;height:330px">${vals.map((v, i) => `<div style="width:40px;height:${v * 3.3}px;background:${color};transform-origin:bottom;animation:growy .5s ease ${(t - Q._s + i * .05).toFixed(2)}s both"></div>`).join('')}</div>
      <div class="k" style="color:${color};margin-top:24px">${lab}</div>`, { left: x, top: 330 });
    return text('Revenue by month (illustration)', { left: 120, top: 130, size: 46, color: C.gray, in: t0 }) +
      b(v1, C.blue, t0 + .3, 120, 'Pay per car') +
      el(`<svg width="200" height="150" viewBox="0 0 200 150"><path d="M50 90 Q20 90 20 65 Q20 40 50 42 Q60 10 100 15 Q135 18 140 45 Q180 42 180 70 Q180 92 150 92Z" fill="${C.gray}"/>${[50, 85, 120, 155].map(x => `<path d="M${x} 105 l-10 30" stroke="${C.sky}" stroke-width="8" stroke-linecap="round"/>`).join('')}</svg>`, { left: 360, top: 190, in: Q('a rainy weekend'), fx: 'pop' }) +
      b(Array(12).fill(72), C.lime, t1 + .2, 1040, 'Pay per month') +
      text('paid, rain or shine', { left: 1040, top: 790, size: 44, color: C.lime, in: Q('whether it rains or not') }); } });

  add('Private equity noticed', { body: () =>
    text('Private equity noticed.', { left: 120, top: 140, size: 76, in: Q('Private equity noticed') }) +
    person({ left: 120, top: 380, name: 'Leonard Green & Partners', role: 'Los Angeles buyout firm · first invested in Mister Car Wash in 2014', initials: 'LGP', size: 260, in: Q('In 2014, Leonard Green') }),
    src: 'Mister Car Wash / Leonard Green announcements, Feb 18, 2026' });

  add('Seven years later', { body: () =>
    doc({ left: 120, top: 150, w: 1080, kind: 'SEC FORM 424B4 · PROSPECTUS', issuer: 'Mister Car Wash, Inc.', date: 'JUNE 2021', title: 'Initial public offering',
      lines: ['Initial public offering price — Per share: $15.0000', 'Total: $562,500,000'], hlIdx: 0, hlAt: Q('at 15 dollars a share'), in: Q('Seven years later') }) +
    text('IPO', { left: 1350, top: 260, size: 60, color: C.gray, in: Q('took the company public') }) +
    count({ left: 1330, top: 340, to: 15, pre: '$', dec: 2, t: Q('at 15 dollars a share'), size: 150, color: C.paper }) +
    text('Day one', { left: 1350, top: 560, size: 60, color: C.gray, in: Q('On its first day of trading') }) +
    count({ left: 1330, top: 640, from: 15, to: 22.4, pre: '$', dec: 2, t: Q('jumped to 22'), size: 150, color: C.lime }) +
    text('+49%', { left: 1350, top: 830, size: 60, color: C.lime, in: Q('jumped to 22') + 1.2 }),
    src: 'SEC Form 424B4, June 2021; MarketBeat, June 2021' });

  add('Wall Street loved one number', { body: () =>
    text('The number Wall Street loved', { left: 120, top: 120, size: 60, color: C.gray, in: Q('Wall Street loved one number') }) +
    count({ left: 110, top: 220, to: 1.4, dec: 1, suf: 'M', t: Q('About 1.4 million'), size: 280, color: C.lime }) +
    text('people paying every month', { left: 130, top: 520, size: 52, in: Q('paying Mister every single month') }) +
    el(`<div style="width:1500px;height:70px;background:${C.panel};border-radius:35px;overflow:hidden"><div style="width:62%;height:100%;background:${C.blue};transform-origin:left;animation:grow 1s cubic-bezier(.2,.8,.2,1) ${(Q('62 percent') - Q._s).toFixed(2)}s both"></div></div>`, { left: 130, top: 690, in: Q('Those members already made up'), fx: 'fade' }) +
    text('62% of wash sales', { left: 130, top: 790, size: 56, color: C.blue, in: Q('62 percent') + .5 }),
    src: 'Mister Car Wash IPO prospectus: 1.4M UWC members, 62% of wash sales (quarter ended Mar 31, 2021)' });

  add('That number became the template', { body: () => {
    const t0 = Q('That number became the template');
    return text('The template for an entire industry', { left: 120, top: 120, size: 64, in: t0 }) +
      Array.from({ length: 12 }, (_, i) => el(`<div style="width:240px;height:160px;background:${C.deep};border-radius:12px 12px 0 0;position:relative"><div style="position:absolute;left:30px;right:30px;top:-30px;height:46px;background:${C.lime};border-radius:8px"></div></div>`,
        { left: 140 + (i % 6) * 280, top: 360 + Math.floor(i / 6) * 260, in: t0 + .4 + i * .12, fx: 'pop', dur: .4 })).join(''); } });

  // ───────────── HOW THE MONEY WORKS ─────────────
  add('To see why, picture the screen', { body: () =>
    kiosk({ left: 1060, top: 90, single: '$10–15', plan: '$20–25', in: Q('To see why, picture') }) +
    text('Saturday, 10 a.m.', { left: 120, top: 160, size: 64, color: C.blue, in: Q("It's a Saturday morning") }) +
    el(car(C.red, 300), { left: 120, top: 640, in: Q('line of SUVs'), fx: 'left' }) + el(car(C.paper, 300), { left: 450, top: 640, in: Q('line of SUVs') + .2, fx: 'left' }) +
    text('Single wash: $10–15', { left: 120, top: 330, size: 52, in: Q('a single wash for around') }) +
    text(`Unlimited: ${hl('$20–25/mo')}`, { left: 120, top: 430, size: 52, in: Q('an unlimited plan') }),
    src: 'Typical U.S. express wash pricing, 2025-26 (varies by market)' });

  add('That ratio is not an accident', { body: () =>
    text('That ratio is no accident.', { left: 120, top: 140, size: 70, in: Q('That ratio is not an accident') }) +
    text(`1 plan ≈ ${hl('2 single washes')}`, { left: 120, top: 360, size: 110, in: Q('price a membership at about two single washes') }) +
    text('“or less”', { left: 130, top: 540, size: 56, color: C.gray, in: Q('or less') }) +
    text('2 visits → it pays for itself', { left: 120, top: 700, size: 64, color: C.lime, in: Q('Two visits, and it pays for itself') }),
    src: 'Professional Carwashing & Detailing, “Membership tips and tricks”' });

  add('You tap the plan', { body: () =>
    kiosk({ left: 1060, top: 90, single: '$15', plan: '$25', in: Q('You tap the plan') - .2, tapAt: Q('You tap the plan') + .4 }) +
    Array.from({ length: 6 }, (_, i) => el(car(i < 5 ? C.lime : C.gray, 260), { left: 80 + (i % 3) * 300, top: 300 + Math.floor(i / 3) * 220, in: Q('So do most of the people') + i * .15, fx: 'pop', dur: .4 })).join('') });

  add('Now look at it from the other side', { body: () => {
    const rows = [['Water', '$0.40 – $1.80', 'one car for about a dollar thirty'], ['Electricity', '$0.50 – $1.00', 'power and soap'], ['Chemicals', '$0.40 – $1.25', 'somewhere between']];
    const t0 = Q('A trade magazine');
    return text('The other side of the tunnel', { left: 120, top: 110, size: 64, in: Q('Now look at it from the other side') }) +
      el(`<div style="width:900px;background:${C.paper};padding:50px 60px;border-radius:6px"><div class="k" style="color:#6B7065">Cost per car · illustrative ranges</div>
      ${rows.map((r, i) => `<div style="display:flex;justify-content:space-between;font-size:44px;font-weight:700;color:${C.ink};margin-top:30px;animation:fade .4s ease ${(t0 - Q._s + .4 + i * .5).toFixed(2)}s both"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}
      <div style="height:4px;background:${C.ink};margin:34px 0 20px"></div>
      <div style="display:flex;justify-content:space-between;font-size:54px;font-weight:900;color:${C.ink};animation:fade .4s ease ${(Q('four dollars') - Q._s).toFixed(2)}s both"><span>Total</span><span>≈ $1.30 – $4</span></div></div>`, { left: 120, top: 270, in: t0, fx: 'up' }) +
      text('≈ $1.30–4 per visit', { left: 1150, top: 400, size: 56, color: C.red, in: Q('every visit you make') }) +
      text('$0', { left: 1150, top: 560, size: 200, color: C.lime, in: Q("Every month you don't come") }) +
      text('if you don’t come', { left: 1160, top: 800, size: 44, color: C.lime, in: Q("Every month you don't come") + .3 }); },
    src: 'Professional Carwashing & Detailing, “Carwash operational cost savings strategies” (illustrative ranges)' });

  add("Here's the honest part", { body: () => {
    const t0 = Q('We looked for a public number');
    return text('Here’s the honest part.', { left: 120, top: 130, size: 70, in: Q("Here's the honest part") }) +
      el(`<div style="width:1300px;height:120px;background:${C.white};border-radius:60px;display:flex;align-items:center;padding:0 50px;font-size:46px;font-weight:600;color:#333">🔍&nbsp; average visits per member per month<span style="display:inline-block;width:4px;height:56px;background:#333;margin-left:8px"></span></div>`, { left: 120, top: 330, in: t0, fx: 'wipe', dur: 1.2 }) +
      stamp('NOT DISCLOSED', { left: 520, top: 560, in: Q("We couldn't find a reliable one"), size: 80 }) +
      text('So: rough math with what Mister did publish', { left: 120, top: 820, size: 48, color: C.lime, in: Q('But we can do rough math') }); } });

  add('In 2025, it reported just over 1 billion', { body: () => {
    const r = (s, t, c = C.paper, top) => text(s, { left: 140, top, size: 76, color: c, in: t, fx: 'left' });
    return kicker('Rough estimate', { color: C.amber, in: Q('In 2025, it reported') }) +
      r('$1.05B revenue (2025)', Q('just over 1 billion'), C.paper, 200) +
      r('× ~¾ from members', Q('If roughly three quarters'), C.paper, 460) +
      r('÷ 2.3M members', Q('about 2.3 million members'), C.paper, 330) +
      r('÷ 12 months', Q('each one paid about') - .4, C.paper, 590) +
      line({ left: 140, top: 720, w: 1100, t: Q('each one paid about') - .1 }) +
      count({ left: 130, top: 760, from: 0, to: 29, pre: '≈ $', suf: ' / month', t: Q('each one paid about'), size: 150, color: C.lime }) +
      text('Q4 2025: members =<br>79% of wash sales', { left: 1300, top: 330, size: 50, color: C.blue, in: Q('79 percent') }); },
    src: 'Mister Car Wash Q4/FY2025 results, Feb 18, 2026. Estimate is ours: 0.77 × $1,051.7M ÷ 2.3M ÷ 12' });

  add("That's a lot of money to wash", { body: () =>
    text('$29 a month', { left: 120, top: 300, size: 170, color: C.lime, in: Q("That's a lot of money") }) +
    text('…for a car you could rinse in your driveway.', { left: 130, top: 560, size: 56, color: C.gray, in: Q('rinse in your own driveway') }) +
    text('And then came the land rush.', { left: 120, top: 800, size: 60, in: Q('the land rush') }) });

  // ───────────── THE GOLD RUSH ─────────────
  add('Once investors saw monthly billing', { body: () =>
    text('Software', { left: 120, top: 280, size: 220, color: C.paper, in: Q('started looking like software') }) +
    text('…with soap.', { left: 140, top: 540, size: 120, color: C.blue, in: Q('with soap') }) +
    text('Monthly billing', { left: 120, top: 130, size: 54, color: C.lime, in: Q('Once investors saw monthly billing') }) });

  add('Private equity firms started buying', { body: () => {
    const t0 = Q('Private equity firms started buying');
    return text('Buy local washes. Build new ones.', { left: 120, top: 120, size: 60, in: t0 }) +
      count({ left: 110, top: 280, to: 900, pre: '~', t: Q('around 900 new car wash'), size: 300, color: C.lime }) +
      text('new car wash locations a year', { left: 130, top: 610, size: 56, in: Q('around 900 new car wash') + .3 }) +
      text('in several recent years', { left: 130, top: 690, size: 40, color: C.gray, in: Q('around 900 new car wash') + .5 }) +
      Array.from({ length: 18 }, (_, i) => el(`<div style="width:70px;height:46px;background:${C.blue};border-radius:8px 8px 0 0"></div>`, { left: 1180 + (i % 6) * 100, top: 300 + Math.floor(i / 6) * 110, in: t0 + .5 + i * .1, fx: 'pop', dur: .35 })).join(''); },
    src: 'CoStar, Mar 12, 2025 (citing Boulder Group)' });

  add('Most were built on the same plan', { body: () =>
    tunnel({ t0: Q('Most were built on the same plan'), n: 3, speed: 6, sign: 'UNLIMITED $25' }) +
    ['A long tunnel', 'Free vacuums', 'A bright sign', 'The membership screen'].map((s, i) =>
      chip(s, { left: [120, 500, 860, 1220][i], top: 110, in: Q(['A long tunnel', 'free vacuums', 'a bright sign', 'a screen that pushes'][i]), bg: C.paper, bd: C.paper, color: C.ink, size: 34 })).join('') });

  add('And many of them landed on the same roads', { body: () => {
    const t0 = Q('And many of them landed');
    return el(`<div style="width:1920px;height:90px;background:#252D21"></div>`, { left: 0, top: 560, in: t0, fx: 'fade' }) +
      [0, 1, 2].map(i => el(`<div style="width:300px;height:200px;background:${C.deep};border-radius:14px 14px 0 0;position:relative"><div style="position:absolute;left:40px;right:40px;top:-36px;height:56px;background:${C.lime};border-radius:8px;font-size:26px;font-weight:900;text-align:center;line-height:56px;color:${C.ink}">WASH ${i + 1}</div></div>`,
        { left: 260 + i * 520, top: 360, in: (i === 0 ? t0 + .3 : Q('Put three new tunnels') + i * .3), fx: 'pop' })).join('') +
      text('needs ~2,000 members', { left: 230, top: 700, size: 40, color: C.lime, in: Q('about 2,000 members') }) +
      text('needs ~2,000', { left: 790, top: 700, size: 40, color: C.lime, in: Q('Put three new tunnels') + .5 }) +
      text('needs ~2,000', { left: 1310, top: 700, size: 40, color: C.lime, in: Q('Put three new tunnels') + .8 }) +
      text('Someone comes up short.', { left: 120, top: 860, size: 62, color: C.red, in: Q('someone is going to come up short') }) +
      text('Same road. Same drivers.', { left: 120, top: 130, size: 64, in: t0 + .2 }); },
    src: 'Professional Carwashing & Detailing (“the average for the industry is probably closer to 2,000 members per site”)' });

  add('A lot of this was built with borrowed money', { body: () => {
    const pts = [[0, .08], [1, 4.33], [2, 5.33]];
    const X = (i) => 260 + i * 620, Y = (v) => 820 - v * 100;
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join(' ');
    const t1 = Q('Then they didn');
    return text('Borrowed money', { left: 120, top: 110, size: 70, in: Q('built with borrowed money') }) +
      text('Effective federal funds rate, year-end', { left: 120, top: 210, size: 40, color: C.gray, in: Q('interest rates sat near zero') }) +
      el(`<svg width="1920" height="1080"><path d="${d}" fill="none" stroke="${C.red}" stroke-width="12" stroke-linejoin="round" stroke-dasharray="2400" style="--len:2400;animation:draw 1.6s ease ${(t1 - Q._s - .2).toFixed(2)}s both"/>
      ${['Dec 2021', 'Dec 2022', 'Dec 2023'].map((y, i) => `<text x="${X(i)}" y="900" font-family="M" font-weight="700" font-size="32" fill="${C.gray}" text-anchor="middle">${y}</text>`).join('')}</svg>`, { left: 0, top: 0, in: Q('interest rates sat near zero'), fx: 'fade' }) +
      text('0.08%', { left: 300, top: 830, size: 60, color: C.lime, in: Q('near zero') }) +
      text('5.33%', { left: 1400, top: 150, size: 80, color: C.red, in: t1 + 1.0 }); },
    src: 'Federal Reserve, effective federal funds rate (rounded)' });

  // ───────────── FALL 1: DEBT ─────────────
  add('Fall number one was the debt', { mark: false, body: chapter('FALL #1', 'The debt') });

  add('Zips Car Wash was one of the fastest growers', { body: () =>
    usmap({ x: 560, y: 150, pins: [{ city: 'Plano', label: 'Plano, Texas', t: Q('Based in Plano') }], in: Q('Zips Car Wash was one') }) +
    text('Zips Car Wash', { left: 120, top: 130, size: 80, in: Q('Zips Car Wash was one') }) +
    text('Backed by<br>Atlantic Street Capital', { left: 120, top: 300, size: 48, color: C.blue, in: Q('Atlantic Street Capital') }) +
    count({ left: 110, top: 560, to: 260, pre: '~', t: Q('it reached about 260'), size: 170, color: C.paper }) + text('locations · 23 states', { left: 130, top: 760, size: 44, color: C.gray, in: Q('across 23 states') }),
    src: 'CoStar, Mar 12, 2025; Bloomberg Law, Feb 6, 2025' });

  add('When it filed for Chapter 11', { body: () =>
    headline({ left: 120, top: 120, w: 1250, outlet: 'Bloomberg', date: 'Feb 6, 2025', text: 'Private Credit Lenders to Take Over Zips Car Wash Through Bankruptcy', in: Q('When it filed for Chapter 11') }) +
    bars({ x: 260, y: 460, h: 380, bw: 300, gap: 260, max: 654, items: [
      { label: 'Debt at filing', value: 654, show: '$654M', t: Q('654 million dollars of funded debt'), color: C.red },
      { label: 'After the plan', value: 375, show: '≈$375M', t: Q('The plan cut about 279'), color: C.blue }] }) +
    text('−$279M', { left: 1300, top: 560, size: 120, color: C.lime, in: Q('The plan cut about 279') + .6 }) +
    text('→ lenders take control', { left: 1300, top: 720, size: 44, color: C.paper, in: Q('handed the company to its private credit lenders') }),
    src: 'Bloomberg Law, Feb 6, 2025; Law360, Feb 6, 2025' });

  add('It also asked to reject the leases', { body: () => {
    const t0 = Q('reject the leases'), red = new Set([3, 17, 22, 31, 40, 48, 55, 61, 70, 77, 84, 90, 101, 108, 115, 122, 130, 139, 146, 151, 160, 166, 171, 178, 186, 193, 199, 205, 211, 217, 224, 230, 236, 241, 245, 249, 252, 255, 257, 258, 259]);
    return text(`${hl('41', C.red)} leases rejected`, { left: 120, top: 110, size: 76, in: t0 }) +
      el(`<div style="display:grid;grid-template-columns:repeat(26,52px);gap:10px">${Array.from({ length: 260 }, (_, i) => `<div style="width:52px;height:52px;border-radius:6px;background:${C.blue};${red.has(i) ? `animation:rd .3s ease ${(t0 - Q._s + .5 + [...red].indexOf(i) * .04).toFixed(2)}s both` : ''}"></div>`).join('')}</div><style>@keyframes rd{to{background:${C.red};transform:scale(.8)}}</style>`, { left: 120, top: 260, in: Q('It also asked'), fx: 'fade' }) +
      text('Cost more to keep open than they brought in', { left: 120, top: 920, size: 44, color: C.gray, in: Q('In other words') }); },
    src: 'CoStar, Mar 12, 2025 (“at least 41 locations”). Grid shows ~260 sites; red squares are not actual locations' });

  add('Zips pointed to competition', { body: () =>
    chip('Competition', { left: 120, top: 200, in: Q('pointed to competition') }) +
    chip('Rising interest rates', { left: 560, top: 200, in: Q('rising interest rates') }) +
    chip('Debt', { left: 1180, top: 200, in: Q('the weight of its debt') }) +
    text('Too many washes.', { left: 120, top: 400, size: 90, in: Q('too many washes') }) +
    text('Too much debt.', { left: 120, top: 520, size: 90, in: Q('too much debt') }) +
    text('Too much rent.', { left: 120, top: 640, size: 90, in: Q('too much rent') }),
    src: 'Law360, Feb 6, 2025; CoStar, Mar 12, 2025' });

  add("Notice what isn't on that list", { body: () =>
    text('Not on the list:', { left: 120, top: 220, size: 70, color: C.gray, in: Q("Notice what isn't") }) +
    text('Memberships', { left: 120, top: 360, size: 170, color: C.lime, in: Q('The memberships.') }) +
    text('still billing ✓', { left: 130, top: 600, size: 70, color: C.lime, in: Q('They kept billing') }) });

  add('The court confirmed the plan', { body: () =>
    text('APR 18, 2025', { left: 120, top: 140, size: 64, color: C.blue, in: Q('The court confirmed') }) +
    text('Plan confirmed', { left: 120, top: 240, size: 80, in: Q('The court confirmed') + .2 }) +
    doc({ left: 120, top: 400, w: 1150, kind: 'SEC FORM 8-K · EXHIBIT 99.1', issuer: 'Driven Brands Holdings Inc.', date: 'APR 10, 2025', title: 'Driven Brands Announces Closing of Sale of U.S. Car Wash Business',
      lines: ['Whistle paid Driven Brands approximately $255 million in cash…'], hlIdx: 0, hlAt: Q('for 385 million dollars'), in: Q('a bigger company had already looked') }),
    src: 'Elevenflo case summary (confirmation Apr 18, 2025); Driven Brands Form 8-K, Apr 10, 2025' });

  add('Driven Brands sold nearly 400', { body: () =>
    text('~400 washes → Whistle Express', { left: 120, top: 120, size: 64, in: Q('Driven Brands sold nearly 400') }) +
    el(`<div style="width:1600px;height:150px;display:flex;border-radius:10px;overflow:hidden">
      <div style="width:66.2%;background:${C.lime};display:flex;align-items:center;padding-left:40px;font-size:56px;font-weight:900;color:${C.ink};transform-origin:left;animation:grow .8s ease ${(Q('for 385 million') - Q._s).toFixed(2)}s both">$255M cash</div>
      <div style="width:33.8%;background:${C.amber};display:flex;align-items:center;padding-left:40px;font-size:56px;font-weight:900;color:${C.ink};transform-origin:left;animation:grow .8s ease ${(Q("wasn't even cash") - Q._s).toFixed(2)}s both">$130M note</div></div>`, { left: 120, top: 320 }) +
    text('= $385M', { left: 120, top: 520, size: 110, color: C.paper, in: Q('for 385 million') + .6 }) +
    text('a promise to pay later', { left: 1200, top: 520, size: 50, color: C.amber, in: Q('a promise to pay later') }) +
    text('Reason given: pay down debt, focus on oil changes (paraphrased)', { left: 120, top: 760, size: 42, color: C.gray, in: Q('Driven Brands said the sale') }),
    src: 'Driven Brands press releases, Feb 25 and Apr 10, 2025; CoStar' });

  // ───────────── FALL 2: CUSTOMERS ─────────────
  add('Fall number two came from the customers', { mark: false, body: chapter('FALL #2', 'The customers') });

  add('Signing up at the screen takes one tap', { body: () =>
    text('Join', { left: 160, top: 260, size: 90, color: C.lime, in: Q('Signing up at the screen') }) +
    chip('1 tap', { left: 160, top: 420, in: Q('takes one tap'), bg: C.lime, bd: C.lime, color: C.ink, size: 60 }) +
    text('Cancel', { left: 1000, top: 260, size: 90, color: C.red, in: Q('Getting out') }) +
    ['Find the page', 'Call?', 'Confirm', 'Still charged?'].map((s, i) => chip(s, { left: 1000 + (i % 2) * 380, top: 420 + Math.floor(i / 2) * 140, in: Q('can be a lot harder') + i * .25, size: 36 })).join(''),
    src: 'Allegations in consumer lawsuits, 2025' });

  add('In March 2025, a California man sued', { body: () =>
    text('CALIFORNIA · MARCH 2025', { left: 120, top: 120, size: 40, color: C.blue, in: Q('In March 2025, a California man sued'), css: 'letter-spacing:.12em' }) +
    text('GO Car Wash', { left: 120, top: 190, size: 110, in: Q('In March 2025, a California man sued') + .1 }) +
    text('145+ locations in 10 states', { left: 120, top: 360, size: 46, color: C.paper, w: 600, in: Q('which runs at least 145') }) + text('“I canceled.” An employee confirmed it.', { left: 120, top: 450, size: 46, color: C.paper, w: 600, in: Q('He said he canceled') }) + text('Still charged:', { left: 120, top: 540, size: 46, color: C.paper, w: 600, in: Q('he was still charged') }) +
    count({ left: 120, top: 700, to: 34.99, dec: 2, pre: '$', t: Q('34 dollars and 99'), size: 190, color: C.red }) +
    stamp('ALLEGATION', { left: 1300, top: 160, in: Q('In March 2025, a California man sued') + 1.2, size: 56 }),
    src: 'Rodriguez v. GO Car Wash Management Corp., federal court, California (complaint, 2025)' });

  add('That July, four customers filed', { body: () =>
    text('ARIZONA · JULY 2025', { left: 120, top: 120, size: 40, color: C.blue, in: Q('That July, four customers filed'), css: 'letter-spacing:.12em' }) +
    text('True Blue Car Wash', { left: 120, top: 190, size: 110, in: Q('That July, four customers filed') + .1 }) +
    text('Owner of Rainstorm and Clean Freak', { left: 120, top: 360, size: 46, color: C.paper, w: 600, in: Q('the owner of Rainstorm') }) + text('70+ washes in 4 states', { left: 120, top: 450, size: 46, color: C.paper, w: 600, in: Q('more than 70 washes') }) + text('Bought one wash → enrolled monthly', { left: 120, top: 540, size: 46, color: C.paper, w: 600, in: Q('ended up in a monthly plan') }) +
    el(car(C.blue, 420), { left: 1250, top: 600, in: Q('thought they were buying one wash'), fx: 'left' }) +
    stamp('ALLEGATION', { left: 1300, top: 160, in: Q('That July, four customers filed') + 1.2, size: 56 }),
    src: 'Connors v. True Blue Car Wash LLC, D. Ariz., No. 25-cv-2318 (complaint)' });

  add('In another California case', { body: () =>
    text('CALIFORNIA · 2025', { left: 120, top: 120, size: 40, color: C.blue, in: Q('In another California case'), css: 'letter-spacing:.12em' }) +
    text('Soapy Joe’s', { left: 120, top: 190, size: 110, in: Q('In another California case') + .1 }) +
    text('Monthly charges she says she didn’t notice:', { left: 120, top: 360, size: 46, color: C.paper, w: 600, in: Q("didn't notice") }) +
    count({ left: 120, top: 520, to: 25, pre: '$', suf: '/mo', t: Q('25 dollar monthly charges'), size: 190, color: C.red }) + text('× 2 months', { left: 130, top: 760, size: 64, color: C.paper, in: Q('for two months') }) +
    stamp('ALLEGATION', { left: 1300, top: 160, in: Q('In another California case') + 1.2, size: 56 }),
    src: 'Tate v. Soapy Joe’s, California (complaint)' });

  add('To be clear, these are claims', { body: () =>
    text('Claims in lawsuits.', { left: 120, top: 300, size: 100, in: Q('To be clear') }) +
    text('Not findings by a court.', { left: 120, top: 440, size: 100, color: C.gray, in: Q('not findings by a court') }) });

  add('But in Colorado, the state itself', { body: () =>
    usmap({ x: 300, y: 160, states: ['Colorado'], pins: [{ city: 'Denver', label: 'Colorado Attorney General', t: Q('the state itself stepped in') + .3 }], in: Q('But in Colorado') }) });

  add('On August 20th, 2026', { body: () =>
    doc({ left: 120, top: 140, w: 1280, kind: 'PRESS RELEASE', issuer: 'Colorado Attorney General', date: 'AUG 20, 2026', title: 'Attorney General Phil Weiser announces settlement with Cobblestone Car Wash for using unfair auto-renewal practices',
      lines: ['“In Colorado, businesses that offer auto-renewal contracts must provide simple, easy-to-use ways for a customer to cancel.”'], hlIdx: 0, hlAt: Q('over its auto-renewal practices'), in: Q('On August 20th') }) +
    headline({ left: 300, top: 720, w: 1520, outlet: 'Denver7', date: 'Aug 2026', text: 'Cobblestone Car Wash to pay $1.3 million to consumers over auto-renewal violations', in: Q('Cobblestone agreed to pay'), bar: C.lime }),
    src: 'Colorado Attorney General, Aug 20, 2026; Denver7' });

  add('That works out to around 19 dollars', { body: () =>
    text('$1,353,465 ÷ 70,000 ≈', { left: 120, top: 180, size: 72, color: C.gray, in: Q('That works out') }) +
    count({ left: 110, top: 280, to: 19, pre: '$', t: Q('around 19 dollars each'), size: 340, color: C.lime }) +
    text('each', { left: 720, top: 470, size: 80, in: Q('around 19 dollars each') + .4 }) +
    text('+ 25 days’ notice before price increases', { left: 120, top: 720, size: 52, in: Q("25 days' notice") }) +
    bars({ x: 1250, y: 300, h: 420, bw: 180, gap: 80, max: 23, items: [
      { label: 'Refund', value: 19, show: '$19', t: Q('Nineteen dollars.'), color: C.lime },
      { label: '1 month', value: 22.99, show: '$22.99', t: Q('Less than one month'), color: C.red }] }),
    src: 'Colorado Attorney General, Aug 20, 2026; Denver7. Plan price: typical Mister Car Wash base plan, 2025' });

  // ───────────── FALL 3: WALL STREET ─────────────
  add('Fall number three was Wall Street', { mark: false, body: chapter('FALL #3', 'Wall Street') });

  add('Remember that 15 dollar IPO', { body: () =>
    doc({ left: 120, top: 130, w: 1100, issuer: 'Mister Car Wash, Inc.', date: 'FEB 18, 2026', title: 'Fourth Quarter and Full Year 2025 Results',
      lines: ['Net revenues increased 6% to $1,051.7 million', 'Net income and net income per diluted share were $103.1 million and $0.31…', 'Ended the quarter with approximately 2.3 million UWC members'], hlIdx: 0, hlAt: Q('revenue passed 1 billion'), in: Q('Mister Car Wash kept growing') }) +
    text('$15', { left: 1370, top: 200, size: 160, color: C.gray, in: Q('Remember that 15 dollar IPO') }) +
    chip('Revenue $1.05B', { left: 1300, top: 470, in: Q('revenue passed 1 billion') + .3, bg: C.lime, bd: C.lime, color: C.ink, size: 36 }) +
    chip('Net income $103M', { left: 1300, top: 590, in: Q('net income was 103'), size: 36 }) +
    chip('Members +7%', { left: 1300, top: 710, in: Q('membership was up 7 percent'), size: 36 }),
    src: 'Mister Car Wash Q4/FY2025 results, Feb 18, 2026' });

  add('The stock went the other way', { body: () =>
    text('The stock went the other way.', { left: 120, top: 110, size: 66, in: Q('The stock went the other way') }) +
    doc({ left: 120, top: 250, w: 1200, kind: 'SEC FORM 8-K · EXHIBIT 99.2', issuer: 'Mister Car Wash, Inc.', date: 'FEB 18, 2026', title: 'Mister Car Wash to Be Taken Private by Leonard Green & Partners for $7.00 Per Share',
      lines: ['…for $7.00 per share in cash, which implies a total enterprise value of the Company of $3.1 billion.'], hlIdx: 0, hlAt: Q('for 7 dollars a share'), in: Q('On February 18th, 2026') }),
    src: 'Mister Car Wash, Form 8-K, Feb 18, 2026' });

  add("That's less than half the IPO price", { body: () => {
    const P = [['IPO, Jun 2021', 15, C.paper], ['Day one', 22.4, C.lime], ['Buyout, 2026', 7, C.red]];
    const X = (i) => 300 + i * 620, Y = (v) => 860 - v * 28;
    const t0 = Q("That's less than half");
    return text('Share price', { left: 120, top: 110, size: 60, color: C.gray, in: t0 }) +
      el(`<svg width="1920" height="1080"><path d="M${X(0)} ${Y(15)} L${X(1)} ${Y(22.4)} L${X(2)} ${Y(7)}" fill="none" stroke="${C.gray}" stroke-width="8" stroke-dasharray="2000" style="--len:2000;animation:draw 1.4s ease ${(t0 - Q._s + .2).toFixed(2)}s both"/>
      ${P.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p[1])}" r="22" fill="${p[2]}"/><text x="${X(i)}" y="${Y(p[1]) - 50}" font-family="M" font-weight="900" font-size="64" fill="${p[2]}" text-anchor="middle">$${p[1].toFixed(2)}</text><text x="${X(i)}" y="${Y(p[1]) + 80}" font-family="M" font-weight="700" font-size="32" fill="${C.gray}" text-anchor="middle">${p[0]}</text>`).join('')}</svg>`, { left: 0, top: 0, in: t0, fx: 'fade' }) +
      text('< ½ of IPO', { left: 140, top: 640, size: 54, color: C.red, in: Q('less than half the IPO price') }) +
      text('< ⅓ of day one', { left: 140, top: 720, size: 54, color: C.red, in: Q('less than a third') }); },
    src: 'SEC Form 424B4 (2021); MarketBeat (first-day high); Form 8-K (Feb 18, 2026). Only these three prices shown' });

  add('The deal valued the company', { body: () =>
    count({ left: 110, top: 200, to: 3.1, dec: 1, pre: '$', suf: 'B', t: Q('The deal valued'), size: 280, color: C.paper }) +
    text('enterprise value, including debt', { left: 130, top: 500, size: 48, color: C.gray, in: Q('including its debt') }) +
    stamp('DELISTED', { left: 1100, top: 300, in: Q('the stock stopped trading'), size: 100 }) +
    text('MAY 19, 2026', { left: 1140, top: 620, size: 56, color: C.blue, in: Q('It closed on May 19th') }),
    src: 'Mister Car Wash, Form 8-K, May 19, 2026' });

  add('Leonard Green already owned about two thirds', { body: () => {
    const t0 = Q('Leonard Green already owned');
    return el(`<svg width="560" height="560" viewBox="-1 -1 2 2" style="transform:rotate(-90deg)"><circle r=".8" fill="none" stroke="${C.panel}" stroke-width=".36"/>
      <circle r=".8" fill="none" stroke="${C.blue}" stroke-width=".36" stroke-dasharray="${(2 * Math.PI * .8 * .67).toFixed(3)} 9" style="--len:${(2 * Math.PI * .8 * .67).toFixed(3)};animation:draw 1s ease ${(t0 - Q._s + .2).toFixed(2)}s both"/></svg>`, { left: 140, top: 260, in: t0, fx: 'fade' }) +
      text('~67%', { left: 300, top: 470, size: 100, color: C.blue, in: t0 + .8 }) + text('owned by Leonard Green', { left: 150, top: 860, size: 40, color: C.gray, in: t0 + 1 }) +
      text(`Sold IPO shares at ${hl('$15', C.paper)}`, { left: 860, top: 380, size: 64, in: Q('had sold shares in the IPO') }) +
      text(`Bought the rest at ${hl('$7', C.red)}`, { left: 860, top: 520, size: 64, in: Q('buying the rest back at 7') }) +
      count({ left: 850, top: 650, from: 0, to: -53, suf: '%', t: Q('lost 53 percent'), size: 180, color: C.red }) +
      text('for IPO buyers who held', { left: 870, top: 860, size: 40, color: C.gray, in: Q('lost 53 percent') + .3 }); },
    src: 'Latham & Watkins (IPO selling stockholders incl. LGP affiliates); Feb 2026 deal coverage (~67% stake). −53% = ($7 − $15) ÷ $15' });

  // ───────────── THE OTHER SIDE ─────────────
  add('Now, the other side', { mark: false, body: chapter('NOW', 'The other side') });

  add('For a lot of drivers, the membership is a good deal', { body: () =>
    text('A good deal — for some drivers', { left: 120, top: 120, size: 60, in: Q('For a lot of drivers') }) +
    text('If you really wash twice a month:', { left: 120, top: 210, size: 44, color: C.gray, in: Q('If you really wash twice a month') }) +
    bars({ x: 200, y: 400, h: 380, bw: 300, gap: 200, max: 32, items: [
      { label: '2 × $15 visits', value: 30, show: '$30', t: Q('beats paying 15 dollars a visit'), color: C.red },
      { label: 'Unlimited plan', value: 25, show: '$25', t: Q('a 25 dollar plan'), color: C.lime }] }) +
    text('Members, Q1 2026', { left: 1250, top: 330, size: 46, color: C.gray, in: Q('In the first quarter of 2026') }) +
    count({ left: 1240, top: 400, to: 11, pre: '+', suf: '%', t: Q('up 11 percent'), size: 220, color: C.lime }),
    src: 'Mister Car Wash Q1 2026 results, Apr 29, 2026 (UWC memberships +11%)' });

  add('Operators also argue', { body: () =>
    text('What operators say', { left: 120, top: 120, size: 64, color: C.gray, in: Q('Operators also argue') }) +
    chip('Smooths out the weather', { left: 120, top: 280, in: Q('smooth out the weather') }) +
    chip('Crews work all year', { left: 120, top: 420, in: Q('keep crews working') }) +
    chip('Pays for better equipment', { left: 120, top: 560, in: Q('better equipment') }) +
    el(`<div style="display:flex;align-items:flex-end;gap:14px;height:300px">${Array(12).fill(0).map((_, i) => `<div style="width:44px;height:220px;background:${C.lime};transform-origin:bottom;animation:growy .5s ease ${(Q('smooth out the weather') - Q._s + i * .05).toFixed(2)}s both"></div>`).join('')}</div><div class="k" style="color:${C.lime};margin-top:20px">Steady monthly revenue</div>`, { left: 1100, top: 330 }) });

  add('And on the regulation front', { body: () =>
    text('The regulation front', { left: 120, top: 120, size: 64, color: C.gray, in: Q('And on the regulation front') }) +
    text('Click to cancel', { left: 120, top: 300, size: 80, color: C.paper, in: Q('The FTC wrote a click to cancel rule') }) +
    text('“as easy to cancel as to join”', { left: 120, top: 410, size: 40, color: C.gray, in: Q('as easy as joining') }) +
    stamp('VACATED', { left: 140, top: 520, in: Q('threw it out'), size: 90, color: C.amber }) +
    text('JULY 8, 2025 · 8th Circuit', { left: 130, top: 780, size: 40, color: C.amber, in: Q('On July 8th') }) +
    text('Would have required canceling to be as easy as signing up', { left: 900, top: 320, size: 44, color: C.paper, w: 700, in: Q('as easy as joining') + .4, css: 'max-width:900px' }),
    src: 'U.S. Court of Appeals, 8th Circuit, Custom Communications v. FTC (July 8, 2025); Greenberg Traurig' });

  add("So there's no single federal crackdown", { body: () =>
    text('No federal crackdown.', { left: 120, top: 280, size: 96, in: Q("So there's no single federal crackdown") }) +
    text('State laws and lawsuits,', { left: 120, top: 440, size: 80, color: C.blue, in: Q('state laws and lawsuits') }) +
    text('one at a time.', { left: 120, top: 550, size: 80, color: C.blue, in: Q('one at a time') }) });

  // ───────────── IT HAPPENED BEFORE ─────────────
  add("We've seen this story before", { mark: false, body: chapter('IT HAPPENED', 'Before') });

  add('Not at a car wash. At Amazon', { body: () =>
    headline({ left: 120, top: 120, w: 1500, outlet: 'Associated Press', date: 'Sep 25, 2025', text: 'Amazon to pay $2.5 billion to settle FTC allegations it duped customers into enrolling in Prime', in: Q('In September 2025, Amazon') }) +
    count({ left: 110, top: 470, to: 2.5, dec: 1, pre: '$', suf: 'B', t: Q('agreed to pay 2.5 billion'), size: 220, color: C.paper }) +
    chip('$1B penalty', { left: 120, top: 760, in: Q('One billion in penalties'), size: 44 }) +
    chip('$1.5B refunds · up to $51 each', { left: 520, top: 760, in: Q('1.5 billion in refunds'), bg: C.lime, bd: C.lime, color: C.ink, size: 44 }) +
    text('No admission of wrongdoing', { left: 1150, top: 560, size: 46, color: C.gray, in: Q('Amazon admitted no wrongdoing') }),
    src: 'Associated Press, Sep 25, 2025; CBS News' });

  add('But the lesson carries over', { body: () =>
    text('The lesson', { left: 120, top: 60, size: 44, color: C.blue, in: Q('But the lesson carries over'), css: 'letter-spacing:.12em' }) +
    text('Earns more from people who…', { left: 120, top: 140, size: 64, color: C.gray, in: Q('But the lesson carries over') + .4 }) +
    text('illustration', { left: 124, top: 230, size: 32, color: C.dim, in: Q('When a business earns more') }) +
    bars({ x: 300, y: 330, h: 440, bw: 320, gap: 300, max: 10, items: [
      { label: 'show up', value: 4, show: ' ', t: Q('than from the people who show up'), color: C.blue },
      { label: 'forget', value: 9, show: ' ', t: Q('from the people who forget'), color: C.lime }] }) +
    text('…regulators start counting too.', { left: 1050, top: 900, size: 50, in: Q('regulators eventually start counting') }) });

  // ───────────── VERDICT ─────────────
  add('So, are car washes finally getting', { mark: false, body: chapter('SO…', 'The verdict', 'Did they get what they deserve?') });

  add('Some of them are', { body: () => {
    const row = (a, b, t, top) => text(`${hl('✓')} ${a} <span style="color:${C.gray}">→ ${b}</span>`, { left: 120, top, size: 56, in: t, fx: 'left' });
    return text('Some of them are.', { left: 120, top: 120, size: 80, in: Q('Some of them are') }) +
      row('Borrowed too much, built too close', 'bankruptcy court', Q('The chains that borrowed'), 300) +
      row('Accused of trapping customers', 'lawyers, refunds', Q('accused of trapping'), 430) +
      row('Public shareholders', '−53% on the way out', Q('public shareholders'), 560); } });

  add('But the model itself is doing just fine', { body: () =>
    text('The model itself?', { left: 120, top: 120, size: 70, in: Q('But the model itself') }) +
    text('Doing fine.', { left: 120, top: 220, size: 120, color: C.lime, in: Q('doing just fine') }) +
    count({ left: 110, top: 420, to: 550, pre: '~', t: Q('roughly 550 locations'), size: 200, color: C.paper }) +
    text('locations · largest car wash subscription program in North America', { left: 130, top: 650, size: 40, color: C.gray, in: Q('largest car wash subscription') }) +
    text('Private equity: round two', { left: 120, top: 800, size: 60, color: C.blue, in: Q('a second round') }),
    src: 'Mister Car Wash Form 8-K, May 19, 2026; Roland Berger, “The second PE cycle in express car wash”' });

  add("Here's the number that sums it up", { body: () => {
    const t0 = Q('A plan of about 23 dollars');
    return text('The number that sums it up', { left: 120, top: 110, size: 60, color: C.gray, in: Q("Here's the number") }) +
      text('$23 plan · 2 washes a month', { left: 120, top: 210, size: 70, in: t0 }) +
      el(`<div style="width:1680px;height:200px;display:flex;border-radius:12px;overflow:hidden">
        <div style="width:24%;background:${C.red};display:flex;flex-direction:column;justify-content:center;padding-left:30px;color:${C.ink};font-weight:900;font-size:46px;transform-origin:left;animation:grow .7s ease ${(Q('costs the wash roughly') - Q._s).toFixed(2)}s both">$3–8<span style="font-size:26px;font-weight:700">water · power · soap</span></div>
        <div style="width:76%;background:${C.lime};display:flex;flex-direction:column;justify-content:center;padding-left:40px;color:${C.ink};font-weight:900;font-size:60px;transform-origin:left;animation:grow .7s ease ${(Q('The rest pays for') - Q._s).toFixed(2)}s both">$15–20 left<span style="font-size:30px;font-weight:700">land · debt · investors</span></div></div>`, { left: 120, top: 400 }) +
      chip('the land', { left: 520, top: 690, in: Q('the land,'), size: 40 }) + chip('the debt', { left: 820, top: 690, in: Q('the debt,'), size: 40 }) + chip('the investors', { left: 1120, top: 690, in: Q('the investors behind them'), size: 40 }); },
    src: 'Our estimate from trade-magazine cost ranges (2 × $1.30–$4). Illustrative, not a company figure' });

  add("The car wash isn't really selling clean cars", { body: () =>
    text('Not selling clean cars.', { left: 120, top: 260, size: 100, color: C.gray, in: Q("isn't really selling clean cars") }) +
    text(`Selling a ${hl('monthly habit.')}`, { left: 120, top: 420, size: 110, in: Q("It's selling a monthly habit") }) +
    text('…sold with borrowed money.', { left: 120, top: 640, size: 64, color: C.red, in: Q('sold that habit with borrowed money') }) });

  add('So next time the screen offers you unlimited', { body: () => {
    const t0 = Q('Count how many times');
    const cells = Array.from({ length: 30 }, (_, i) => `<div style="width:96px;height:80px;border-radius:8px;background:${C.panel};position:relative">${[6, 20].includes(i) ? `<div style="position:absolute;inset:14px 24px;border-radius:50%;background:${C.blue};animation:pop .35s ease ${(t0 - Q._s + .6 + (i === 20 ? .5 : 0)).toFixed(2)}s both"></div>` : ''}</div>`).join('');
    return kiosk({ left: 1180, top: 90, single: '$15', plan: '$25', in: Q('So next time the screen') }) +
      text('Check one thing first.', { left: 120, top: 130, size: 66, in: Q('check one thing first') }) +
      el(`<div style="display:grid;grid-template-columns:repeat(7,96px);gap:10px">${cells}</div>`, { left: 120, top: 300, in: t0, fx: 'fade' }) +
      text('Washes last month: 2', { left: 120, top: 820, size: 56, color: C.lime, in: t0 + 1.4 }); } });

  add('Next on Money Encode', { body: () =>
    text('NEXT ON MONEY ENCODE', { left: 120, top: 300, size: 44, color: C.blue, in: Q('Next on Money Encode'), css: 'letter-spacing:.14em' }) +
    text(`The ${hl('$40')} oil change<br>that’s never $40`, { left: 120, top: 380, size: 120, in: Q('the 40 dollar oil change') }) });

  return S;
}
