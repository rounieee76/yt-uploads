import { char, put } from './chars.mjs';
import { room, street, P } from './bgs.mjs';
import { open, snap, close } from './snap.mjs';
const LU = { hair: 'slick', hairColor: '#1E1610', hat: 'fedora', hatColor: '#8A8A92', outfit: 'darksuit', skin: 'olive', scar: true, pocketSquare: true, expr: 'angry', pose: 'cigar', cigar: true };
const txt = (x, y, t, size, fill, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><text x="${x}" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="none" stroke="#0A0604" stroke-width="${size * 0.16}" stroke-linejoin="round">${t}</text><text x="${x}" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="${fill}">${t}</text></g>`;
let s = `<defs><clipPath id="L"><path d="M0 0 H880 L1000 1080 H0Z"/></clipPath><clipPath id="R"><path d="M880 0 H1920 V1080 H1000Z"/></clipPath>
<radialGradient id="g1" cx="0.3" cy="0.5" r="0.6"><stop offset="0" stop-color="#FFB45A" stop-opacity=".7"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="0.7" cy="0.55" r="0.6"><stop offset="0" stop-color="#E8302A" stop-opacity=".55"/><stop offset="1" stop-color="#E8302A" stop-opacity="0"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="18"/></filter></defs>`;
s += `<g clip-path="url(#L)">${room({ wall: '#C9B48A', pattern: 'stone', wain: false, floor: '#8A6A4A', horizon: 820 })}<rect width="1920" height="1080" fill="#2A1A10" opacity=".35"/><rect width="1920" height="1080" fill="url(#g1)"/>${P.crib(460, 1110)}${put(char({ age: 'baby', expr: 'angry', skin: 'olive', blanket: '#C9B89A', h: 300 }), 460, 1000, 1.3)}${P.oilLamp(150, 760, 1.4)}<ellipse cx="150" cy="580" rx="140" ry="140" fill="#FFC870" opacity=".35" filter="url(#glow)"/></g>`;
s += `<g clip-path="url(#R)">${street({ mode: 'night', wet: true, cobble: true, horizon: 900, fireEscape: true })}<rect width="1920" height="1080" fill="#0A0A20" opacity=".45"/><rect width="1920" height="1080" fill="url(#g2)"/>${P.car(1780, 1000, 1.0, '#141418', true)}`;
s += Array.from({ length: 70 }, (_, i) => `<path d="M${880 + (i * 137) % 1040} ${(i * 251) % 1080} l-8 -40" stroke="#C8D4F0" stroke-width="3" opacity=".5"/>`).join('');
s += `${put(char(LU), 1420, 1520, 2.2)}</g>`;
s += `<path d="M880 0 L1000 1080" stroke="#0A0604" stroke-width="22"/><path d="M880 0 L1000 1080" stroke="#F4E6C8" stroke-width="8"/>`;
s += txt(440, 210, 'AGE 0', 190, '#FFFFFF', -3) + txt(1440, 200, 'LEFT FOR DEAD', 150, '#E8302A', 2);
await open(1280 / 1920); await snap(s, process.argv[2] || '/home/claude/lived/luciano/out/thumbnail.png', '#000'); await close();
