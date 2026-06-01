// Generates branded 1200x630 Open Graph cards (SVG -> PNG via rsvg-convert).
// Run: node build-og.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'assets/img/og');
const TMP = path.join(ROOT, '.og-tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

global.window = {};
require('./assets/data.js');
const SEDI = window.HARU_SEDI;

const FONT = "'PingFang SC','Hiragino Sans GB','Noto Sans SC','Helvetica Neue',sans-serif";
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function abs(p){ return path.join(ROOT, p); }

// build SVG string. opts: {bg, brandSub, lines:[{t,size}], sub, pill, pillColor, accent}
function svg(o){
  const accent = o.accent || '#c9302c';
  const headTspans = o.lines.map((l,i)=>`<tspan x="80" dy="${i===0?0:l.dy||86}" font-size="${l.size||64}" font-weight="600">${esc(l.t)}</tspan>`).join('');
  const pill = o.pill ? `
    <g transform="translate(80, 540)">
      <rect x="0" y="0" rx="26" ry="26" width="${o.pillW||520}" height="52" fill="none" stroke="${o.pillColor||'#b8956a'}" stroke-width="1.5"/>
      <text x="26" y="34" font-size="22" fill="#f5f1e8" font-family="${FONT}" letter-spacing="0.5">${esc(o.pill)}</text>
    </g>` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ov" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#0a0a0a" stop-opacity="0.30"/>
      <stop offset="0.55" stop-color="#0a0a0a" stop-opacity="0.50"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="0.86"/>
    </linearGradient>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0a0a0a" stop-opacity="0.97"/>
      <stop offset="0.7" stop-color="#0a0a0a" stop-opacity="0.62"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <image x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice" href="${o.bg}" xlink:href="${o.bg}"/>
  <rect width="1200" height="630" fill="url(#ov)"/>
  <rect width="900" height="630" fill="url(#side)"/>
  <rect x="0" y="0" width="8" height="630" fill="${accent}"/>
  <!-- brand -->
  <text x="80" y="96" font-family="${FONT}"><tspan font-size="46" fill="#b8956a" font-weight="600">春</tspan><tspan dx="14" font-size="40" fill="#f5f1e8" font-weight="600" letter-spacing="1">Harù</tspan></text>
  <text x="${o.brandSubX||235}" y="96" font-size="17" fill="#a8a39a" font-family="${FONT}" letter-spacing="3">${esc(o.brandSub||'寿司与亚洲料理')}</text>
  <!-- headline -->
  <text x="80" y="${o.headY||330}" fill="#f5f1e8" font-family="${FONT}" letter-spacing="-1">${headTspans}</text>
  <!-- sub -->
  <text x="80" y="${o.subY||500}" font-size="26" fill="#cfccc3" font-family="${FONT}" letter-spacing="0.5">${esc(o.sub||'')}</text>
  ${pill}
</svg>`;
}

function render(name, s){
  const sv = path.join(TMP, name + '.svg');
  fs.writeFileSync(sv, s);
  execSync(`rsvg-convert -w 1200 -h 630 "${sv}" -o "${path.join(OUT, name + '.png')}"`);
  console.log('  ✓', 'assets/img/og/' + name + '.png');
}

// 1) DEFAULT site card
render('default', svg({
  bg: abs('assets/img/site/hero-sushi.jpg'),
  brandSub: '寿司与亚洲料理',
  lines: [ {t:'北方的寿司。', size:70}, {t:'一个品牌，一个 App。', size:70, dy:90} ],
  headY: 300,
  sub: '13 家门店 · 意大利北部 · Google ★ 4,4',
  pill: '0% 平台佣金 · 首单立减 10%', pillW: 470
}));

// 2) PRESENTATION card (audit)
render('presentazione', svg({
  bg: abs('assets/img/site/ingredienti.jpg'),
  brandSub: 'Genesis AI · 数字审计',
  lines: [ {t:'每一单，你向平台', size:62}, {t:'白送出最高 35%。', size:62, dy:82} ],
  headY: 310,
  sub: '用你自己的数字，算算每年可挽回多少',
  pill: '机密文件 · 为 Harù 管理层准备', pillW: 520, accent: '#c9302c', pillColor: '#c9302c'
}));

// 3) Per-sede cards (real restaurant photo + city)
SEDI.forEach(s => {
  render('sede-' + s.key, svg({
    bg: abs('assets/img/sedi/' + s.key + '.jpg'),
    brandSub: '寿司与亚洲料理 · ' + s.prov,
    lines: [ {t:'Harù ' + s.city, size: s.city.length > 8 ? 50 : 64} ],
    headY: 320,
    sub: s.addr,
    pill: (s.live ? '在线点餐已开通 · 首单立减 10%' : '即将开通在线点餐'), pillW: s.live ? 470 : 320
  }));
});

// cleanup temp svgs
fs.rmSync(TMP, { recursive: true, force: true });
console.log('Generated', 2 + SEDI.length, 'branded OG cards in assets/img/og/');
