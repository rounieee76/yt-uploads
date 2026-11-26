import { char, put } from './chars.mjs';
import { room, street, P } from './bgs.mjs';
import { open, snap, close } from './snap.mjs';
const AL = { hair: 'slick', hat: 'fedora', hatColor: '#B9B7BE', outfit: 'pinstripe', heavy: true, scar: true, ring: true, skin: 'olive', expr: 'smirk', pose: 'cigar', cigar: true };
const txt = (x, y, t, size, fill, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><text x="${x}" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="none" stroke="#0A0604" stroke-width="${size * 0.16}" stroke-linejoin="round">${t}</text><text x="${x}" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="${fill}">${t}</text></g>`;
let s = `<defs><clipPath id="L"><path d="M0 0 H900 L1020 1080 H0Z"/></clipPath><clipPath id="R"><path d="M900 0 H1920 V1080 H1020Z"/></clipPath>
<radialGradient id="g1" cx="0.35" cy="0.45" r="0.6"><stop offset="0" stop-color="#FFB45A" stop-opacity=".75"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stop-color="#FF6A2A" stop-opacity=".8"/><stop offset="1" stop-color="#FF6A2A" stop-opacity="0"/></radialGradient>
<filter id="glow"><feGaussianBlur stdDeviation="18"/></filter></defs>`;
s += `<g clip-path="url(#L)">${room({ wall: '#5A4A5E', pattern: 'stripes', floor: '#4A3628', horizon: 820 })}<rect width="1920" height="1080" fill="#1A1430" opacity=".35"/><rect width="1920" height="1080" fill="url(#g1)"/>${P.crib(470, 1110)}${put(char({ age: 'baby', expr: 'angry', skin: 'olive', blanket: '#C9B89A', h: 300 }), 470, 1000, 1.25)}${P.oilLamp(160, 760, 1.4)}<ellipse cx="160" cy="580" rx="140" ry="140" fill="#FFC870" opacity=".35" filter="url(#glow)"/></g>`;
s += `<g clip-path="url(#R)">${street({ mode: 'night', wet: true, cobble: true, horizon: 900, skyline: true })}<rect width="1920" height="1080" fill="#0A0A20" opacity=".45"/><rect width="1920" height="1080" fill="url(#g2)"/>`;
for (const [x, y] of [[1150, 820], [1820, 760], [1700, 880]]) s += `<circle cx="${x}" cy="${y}" r="90" fill="#FFE08A" filter="url(#glow)"/><path d="M${x - 70} ${y} L${x + 70} ${y} M${x} ${y - 70} L${x} ${y + 70}" stroke="#FFF6D0" stroke-width="10"/>`;
s += Array.from({ length: 70 }, (_, i) => `<path d="M${900 + (i * 137) % 1020} ${(i * 251) % 1080} l-8 -40" stroke="#C8D4F0" stroke-width="3" opacity=".5"/>`).join('');
s += `${put(char(AL), 1440, 1500, 2.2)}</g>`;
s += `<path d="M900 0 L1020 1080" stroke="#0A0604" stroke-width="22"/><path d="M900 0 L1020 1080" stroke="#F4E6C8" stroke-width="8"/>`;
s += txt(450, 210, 'AGE 0', 190, '#FFFFFF', -3) + txt(1480, 200, 'SCARFACE', 200, '#FFD23A', 2);
await open(1280 / 1920); await snap(s, '/home/claude/lived/capone/out/thumbnail.png', '#000'); await close();
