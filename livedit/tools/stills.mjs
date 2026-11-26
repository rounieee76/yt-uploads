// stills.mjs [mode] : render one still per scene (near the end, or at given fraction) and contact sheets
import fs from 'fs'; import { execSync } from 'child_process'; import puppeteer from 'puppeteer-core';
const ROOT='/home/claude/gk'; const idx=JSON.parse(fs.readFileSync(`${ROOT}/scenes/index.json`));
const frac = +(process.argv[2] ?? 0.97); const only = process.argv[3] ? process.argv[3].split(',') : null;
fs.mkdirSync(`${ROOT}/work/stills`,{recursive:true}); execSync(`rm -f ${ROOT}/work/stills/*.jpg`);
const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--disable-gpu','--hide-scrollbars']});
const p=await b.newPage(); await p.setViewport({width:1920,height:1080});
for(const s of idx){ if(only && !only.includes(s.id)) continue;
  await p.goto(`file://${ROOT}/scenes/${s.id}.html`); await p.evaluate(()=>document.fonts.ready);
  const t=(s.frames/30)*frac; await p.evaluate(t=>window.__seek(t),t);
  await p.screenshot({path:`${ROOT}/work/stills/${s.id}.jpg`,type:'jpeg',quality:80}); }
await b.close();
execSync(`cd ${ROOT}/work/stills && ffmpeg -loglevel error -y -pattern_type glob -i '*.jpg' -vf "scale=640:-1,drawtext=text='%{eif\\:n\\:d}':x=10:y=10:fontsize=36:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -q:v 3 sheet_%02d.jpg`);
console.log(fs.readdirSync(`${ROOT}/work/stills`).filter(f=>f.startsWith('sheet')));
