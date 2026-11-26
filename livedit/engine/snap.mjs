// render an SVG string (1920x1080 space) to a transparent PNG at scale
import puppeteer from 'puppeteer-core';
let browser, page;
export async function open(scale = 1.2) {
  browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'] });
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: scale });
}
const FONT = `@font-face{font-family:Oswald;src:url(file:///home/claude/lived/fonts/Oswald.ttf)}@font-face{font-family:Playfair;src:url(file:///home/claude/lived/fonts/PlayfairDisplay.ttf)}@font-face{font-family:Anton;src:url(file:///home/claude/lived/fonts/Anton.ttf)}`;
export async function snap(svg, path, bg = false) {
  const html = `<!doctype html><html><head><style>${FONT}html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:${bg ? bg : 'transparent'}}</style></head><body><svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">${svg}</svg></body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path, omitBackground: !bg, type: 'png' });
}
export async function close() { await browser.close(); }
