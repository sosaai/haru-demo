// Parse Harù AYCE PDF menus -> per-sede menu data, with master name->category map. Run: node build-menus.js
const fs = require('fs'), https = require('https'), { execSync } = require('child_process');

function dl(url, out) {
  return new Promise((res, rej) => {
    const f = fs.createWriteStream(out);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => { r.pipe(f); f.on('finish', () => f.close(res)); }).on('error', rej);
  });
}
const ALLERG = {1:'glutine',2:'crostacei',3:'uova',4:'pesce',5:'arachidi',6:'soia',7:'latte',8:'frutta a guscio',9:'sedano',10:'senape',11:'sesamo',12:'solfiti',13:'lupini',14:'molluschi'};
const CATS = ['Dim Sum','Fritti','Zuppe','Insalate','Griglia','Tartare','Tataki','Carpaccio','Nigiri','Gunkan','Uramaki','Hosomaki','Futomaki','Temaki','Sashimi','Chirashi','Poke','Riso','Spaghetti','Tempura','Secondi piatti','Primi piatti','Special','Roll fritti','Sushi misto','Frutta fresca','Dolci'];
const ORDER = ['Sushi Misto','Chirashi e Cake','Antipasti','Dim Sum','Fritti','Zuppe','Insalate','Salad','Verdure','Griglia','Teppanyaki','Agemono','Tempura','Tartare','Tataki','Carpaccio','Usuzukuri','Nigiri','Gunkan','Uramaki','Hosomaki','Futomaki','Temaki','Sashimi','Chirashi','Poke','Roll fritti','Special cucina','Special','Piatti Speciali','Primi piatti','Primi','Secondi piatti','Secondi','Riso','Spaghetti','Sushi misto','Frutta fresca','Frutta','Dolci','Bevande','Birre','Bollicine','Vini Bianchi','Vini rossi','Vini Rosé','Mezze Bottiglie','Vini, Birre e Bevande','Altro'];
const rxesc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clean = s => String(s || '').replace(/[^\S ]+/g, ' ').replace(/[•▪●∙]/g, ' ').replace(/\s+/g, ' ').trim();
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function parse(txtPath) {
  let t = fs.readFileSync(txtPath, 'utf8');
  const A = '(?:1[0-4]|[1-9])';
  const heads = [];
  CATS.forEach(c => {
    const ns = c.replace(/\s+/g, '');
    const r = new RegExp('(?:' + rxesc(ns) + '|' + rxesc(c) + ')\\s+' + rxesc(c), 'g');
    let mm; while ((mm = r.exec(t))) heads.push({ pos: mm.index, cat: c });
  });
  heads.sort((a, b) => a.pos - b.pos);
  t = t.replace(new RegExp('Allergeni\\s*:\\s*(' + A + '(?:\\s*,\\s*' + A + ')*)', 'g'), 'ALL=$1');
  const re = /(\d{2,3})\s+([^\n]{2,46})([\s\S]*?)ALL=([\d,]+)/g;
  let m, items = [], seen = {};
  while ((m = re.exec(t))) {
    const code = m[1], name = clean(m[2]), desc = clean(m[3]);
    if (/prodotti|derivati|base di|concentrazion|provocano|allergi/i.test(name)) continue;
    if (name.length < 2 || !/^[A-ZÀ-Ù0-9]/.test(name)) continue;
    const key = code + '|' + name.toLowerCase(); if (seen[key]) continue; seen[key] = 1;
    const al = [...new Set(m[4].split(',').map(x => ALLERG[+x]).filter(Boolean))].join(', ');
    let cat = 'Altro', best = -1;
    heads.forEach(h => { if (h.pos < m.index && h.pos > best) { best = h.pos; cat = h.cat; } });
    items.push({ code, name, desc: desc.slice(0, 150), allergeni: al, cat, price: '' });
  }
  return items; // flat list of {code,name,desc,allergeni,cat,price}
}
function group(items) {
  const by = {};
  items.forEach(i => { (by[i.cat] = by[i.cat] || []).push({ code: i.code, name: i.name, desc: i.desc, allergeni: i.allergeni, price: i.price || '' }); });
  const menu = [];
  ORDER.forEach(c => { if (by[c] && by[c].length) { menu.push({ category: c, items: by[c] }); delete by[c]; } });
  Object.keys(by).forEach(c => menu.push({ category: c, items: by[c] }));
  return menu;
}

const PDFS = {
  opera: '2022/06/Menu-CENA-2022_Haru-Opera.pdf', cairo: '2023/10/Menu-CENA-2023_Haru_CAIRO_OK.pdf',
  madone: '2026/04/Menu_CENA_2026_Haru_Madone_OK.pdf', baggio: '2023/11/Menu-CENA-2022_Haru-MILANO-BAGGIO-web.pdf',
  romagnano: '2024/12/Menu-CENA-Haru-Romagnano-Sesia.pdf', abbiategrasso: '2026/04/Menu_CENA_2026_Haru_Abbiategrasso_OK.pdf'
};

(async () => {
  const flat = { leini: parse('data/pdf/leini-cena.txt') };
  for (const k of Object.keys(PDFS)) {
    try {
      const pdf = 'data/pdf/' + k + '-cena.pdf', txt = 'data/pdf/' + k + '-cena.txt';
      if (!fs.existsSync(txt)) { await dl('https://www.harurestaurant.it/wp-content/uploads/' + PDFS[k], pdf); execSync('pdftotext -raw "' + pdf + '" "' + txt + '"'); }
      flat[k] = parse(txt);
    } catch (e) { console.log(k + ': ERR', String(e.message).slice(0, 70)); flat[k] = []; }
  }
  // existing à-la-carte (mozzate/oggiono/valtellina) — authoritative categories
  let cur = {};
  try { global.window = {}; delete require.cache[require.resolve('./assets/menus-sedi.js')]; require('./assets/menus-sedi.js'); cur = global.window.HARU_SEDE_MENUS || {}; } catch (e) {}

  // master name->category map: from à-la-carte first, then well-parsed PDFs (>=8 categories)
  const master = {};
  ['mozzate', 'oggiono', 'valtellina'].forEach(s => (cur[s] || []).forEach(c => c.items.forEach(it => { const n = norm(it.name); if (n && !master[n]) master[n] = c.category; })));
  Object.keys(flat).forEach(s => {
    const cats = new Set(flat[s].map(i => i.cat));
    if (cats.size >= 8) flat[s].forEach(it => { const n = norm(it.name); if (n && !master[n]) master[n] = it.cat; });
  });

  // re-categorize every PDF sede via master map (fallback to parsed cat)
  const fixed = {};
  Object.keys(flat).forEach(s => {
    fixed[s] = group(flat[s].map(it => ({ ...it, cat: master[norm(it.name)] || (it.cat !== 'Altro' ? it.cat : 'Altro') })));
  });

  const out = Object.assign({}, cur, {
    leini: fixed.leini, opera: fixed.opera, darfo: fixed.opera, cairo: fixed.cairo,
    madone: fixed.madone, baggio: fixed.baggio, romagnano: fixed.romagnano,
    como: fixed.romagnano, abbiategrasso: fixed.abbiategrasso
  });
  fs.writeFileSync('assets/menus-sedi.js', '// Menu reali per sede (shop online + volantini PDF AYCE) — harurestaurant.it\nwindow.HARU_SEDE_MENUS=' + JSON.stringify(out) + ';\n');
  console.log('SEDI:', Object.keys(out).length, '| file', Math.round(fs.statSync('assets/menus-sedi.js').size / 1024) + 'KB | master map:', Object.keys(master).length, 'voci\n');
  Object.keys(out).sort().forEach(k => {
    const tot = out[k].reduce((a, c) => a + c.items.length, 0);
    const altro = (out[k].find(c => c.category === 'Altro') || { items: [] }).items.length;
    console.log('  ' + k + ': ' + tot + ' piatti, ' + out[k].length + ' cat' + (altro ? ' (Altro: ' + altro + ')' : ''));
  });
})();
