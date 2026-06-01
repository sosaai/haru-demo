// SHUN — Sushi & Omakase Template

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Sticky menu nav active state
const menuSections = document.querySelectorAll('.menu-section');
const menuLinks = document.querySelectorAll('.menu-nav a');
if (menuSections.length && menuLinks.length) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        menuLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  menuSections.forEach(s => so.observe(s));
}

// Chips (form selection)
document.querySelectorAll('.chip-group').forEach(group => {
  group.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
});

// Gallery filters
const filters = document.querySelectorAll('.gallery-filters button');
const galleryItems = document.querySelectorAll('.gallery-item');
filters.forEach(f => f.addEventListener('click', () => {
  filters.forEach(x => x.classList.remove('active'));
  f.classList.add('active');
  const cat = f.dataset.cat;
  galleryItems.forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}));

// Nav scroll state
const nav = document.querySelector('.nav-shell');
if (nav) {
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.top = y > 40 ? '12px' : '18px';
    last = y;
  }, { passive: true });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// FAQ category filter
const faqCats = document.querySelectorAll('.faq-cats button');
const faqItems = document.querySelectorAll('.faq-item');
faqCats.forEach(b => b.addEventListener('click', () => {
  faqCats.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const cat = b.dataset.cat;
  faqItems.forEach(it => {
    it.classList.remove('open');
    it.style.display = (cat === 'all' || it.dataset.cat === cat) ? '' : 'none';
  });
}));

// --- POLISH: image fade-in on load ---
// Tag content images so they fade in smoothly once decoded.
(function () {
  const sel = '.pc-media img, .loc-thumb img, .signature-card img, .split .media img, .space-media img, .app-mini img, .store-card-media img, .gallery-item img';
  document.querySelectorAll(sel).forEach(img => {
    img.classList.add('img-fade');
    const done = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  });
  // Also catch images injected later (dynamic menu/router render)
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      const imgs = n.matches && n.matches(sel) ? [n] : (n.querySelectorAll ? n.querySelectorAll(sel) : []);
      imgs.forEach(img => {
        if (img.classList.contains('img-fade')) return;
        img.classList.add('img-fade');
        const done = () => img.classList.add('is-loaded');
        if (img.complete && img.naturalWidth) done();
        else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
      });
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

// --- POLISH: staggered reveal for grids/lists ---
const sio = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
// auto-apply stagger to static content grids (skip dynamically-rendered ones to avoid flashes)
document.querySelectorAll('.feat-grid, .signature-grid, .roadmap, .diag-grid, .review-grid, .awards, .tiers, .compare, .facts').forEach(el => {
  if (!el.classList.contains('reveal-stagger') && !el.dataset.noStagger) el.classList.add('reveal-stagger');
});
document.querySelectorAll('.reveal-stagger').forEach(el => sio.observe(el));

// --- x100: count-up numbers ([data-countup="13.5"] data-suffix data-prefix data-decimals data-sep) ---
(function () {
  function fmt(n, dec, sep) {
    var s = n.toFixed(dec);
    if (sep) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep === 'dot' ? '.' : ','); s = p.join(dec ? ',' : ''); }
    else if (dec) { s = s.replace('.', ','); }
    return s;
  }
  var els = document.querySelectorAll('[data-countup]');
  if (!els.length) return;
  // Respect reduced-motion: render final values immediately, skip animation.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) {
      var target = parseFloat(el.dataset.countup);
      var dec = parseInt(el.dataset.decimals || '0', 10);
      var sep = el.dataset.sep || '';
      var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      el.textContent = pre + fmt(target, dec, sep) + suf;
    });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el);
      var target = parseFloat(el.dataset.countup);
      var dec = parseInt(el.dataset.decimals || '0', 10);
      var sep = el.dataset.sep || '';
      var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      var dur = parseInt(el.dataset.duration || '1400', 10), t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(target * eased, dec, sep) + suf;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = pre + fmt(target, dec, sep) + suf;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(function (el) { io.observe(el); });
})();

// --- x100: real-dish marquee (fills .dish-marquee[data-marquee] from window.HARU_MENU) ---
(function () {
  var host = document.querySelector('.dish-marquee .dm-track');
  if (!host || !window.HARU_MENU) return;
  var picks = [];
  // language-agnostic: take a couple of dishes from the first food-first categories
  window.HARU_MENU.slice(0, 14).forEach(function (c) {
    c.items.slice(0, 2).forEach(function (it) { if (it.name) picks.push(it); });
  });
  picks = picks.slice(0, 18);
  function row() {
    return picks.map(function (it) {
      return '<span class="dm-item">' + it.name.replace(/[<>]/g, '') + (it.price ? ' <span class="px">' + it.price + '</span>' : '') + '</span>';
    }).join('');
  }
  host.innerHTML = row() + row(); // duplicate for seamless loop
})();

// Form submission (demo)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = 'Sent — ありがとう';
      btn.style.background = '#b8956a';
      btn.style.color = '#0a0a0a';
      setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 2500);
    }
  });
});

// --- Guided presentation tour (shared; auto-appears where steps exist) ---
(function () {
  function pageId() {
    var p = location.pathname;
    if (/\/locali\/[^/]+\/?$/.test(p)) return 'sede';
    if (/haru-menu/.test(p)) return 'menu';
    if (/haru-order/.test(p)) return 'order';
    if (/haru-locali/.test(p)) return 'locali';
    if (/haru-app/.test(p)) return 'app';
    if (/haru-owners/.test(p)) return 'owners';
    return 'index';
  }
  var TOURS = {
    index: [
      ['.hero h1', '品牌定位', '把 13 家门店统一在同一个品牌与体验下——直接解决今天「各自为政」的碎片化问题。'],
      ['.facts', '信任数据', '13 家门店、4,4★、约 6000 条评价、直营 0% 佣金。食物和品牌本就出色，缺的只是数字化。'],
      ['.dish-marquee', '真实菜单', '滚动的是真实菜品与价格，全部来自门店实际目录。'],
      ['[id*="sedi"], .sede-strip, [class*="sedi-strip"]', '13 家门店', '每家门店都有自己的专属页面——点击任意一家即可进入。'],
      ['.cta-banner', '行动召唤', '直接下单，把优惠和会员积分留给自己。']
    ],
    menu: [
      ['.dish-marquee', '完整真实菜单', '291 道菜、28 个分类，全部真实数据与照片。'],
      ['.mi-add', '一键加入', '在菜单页加入的菜品，会自动出现在点餐页的购物车里。'],
      ['.menu-nav, [class*="cat-strip"]', '分类速览', '点击任意分类即可跳转到对应区域。'],
      ['.btn-primary', '可下载菜单', '一键导出 PDF，随时打印或转发。']
    ],
    order: [
      ['#zoneGrid, .zone-finder', '第一步 · 选门店', '可搜索城市或邮编；也能从门店页一键带入并预选。'],
      ['.order-intro, .page-head', '三步下单流程', '选门店 → 挑选菜品 → 结算支付，全程真实可用。自取立省 30%、零平台佣金。'],
      ['.cat-tabs, #menuArea', '真实菜单 · 291 道', '选好门店即解锁完整菜单：分类、搜索、人气推荐，一键加入购物车。'],
      ['.cart-fab, .nav', '现代支付', '6 种即时支付：Satispay、Apple Pay、Google Pay、餐券——对比今天官网只有 PayPal。']
    ],
    locali: [
      ['.loc-statband, .loc-coverage', '覆盖区域', '13 家门店遍布伦巴第、皮埃蒙特、利古里亚与都灵。'],
      ['.loc-filter', '按地区筛选', '一键筛选你关心的区域。'],
      ['.store-card', '门店专属页', '每家门店都有自己的迷你站点——点击「查看门店」进入。'],
      ['.loc-why', '一个品牌的意义', '统一账户、统一菜单、通用会员。']
    ],
    app: [
      ['.phone', '品牌 App', '从 13 家门店点餐、实时追踪订单、累积会员积分。'],
      ['.loyalty-card', '会员体系', '每 10 单赠一道免费餐品——把回头客真正留住。'],
      ['.sede-pay, .pay-methods', '随心支付', '想怎么付都行，方式全部可点击。'],
      ['.bench-table, .faq-list', '对标同行', '竞品早已有 App，你有更好的产品，只差工具。']
    ],
    owners: [
      ['.calc-inputs, .calc', '佣金计算器', '用你自己的数字，实时看到每年流向平台的金额。'],
      ['.cr-big, #crBig', '可挽回的金额', '这就是每年可以重新留在你账上的 margin。'],
      ['[id*="years"], .bar-compare', '五年累计', '等待的代价不是零——它随月份不断叠加。'],
      ['.roadmap, .stage', '三阶段路线图', '先快赢、再结构、最后增长——每一阶段自筹资金，风险最低。']
    ],
    sede: [
      ['.sede-hero, .hero h1', '门店专属站点', '每一家餐厅都有自己完整的迷你网站。'],
      ['iframe[src*="maps"], .sede-map', '到店信息', '真实地图、地址、电话与营业信息。'],
      ['.sede-pay', '可点击支付', '任意支付方式都能直接从本店下单。'],
      ['.other-sedi', '互联门店网络', '一键跳转其他门店——一个品牌的整体网络。']
    ]
  };

  var raw = TOURS[pageId()] || [];
  function resolve(sel) {
    var parts = sel.split(',');
    for (var i = 0; i < parts.length; i++) {
      var el = document.querySelector(parts[i].trim());
      if (el && el.offsetParent !== null || (el && el.getClientRects().length)) return el;
    }
    return null;
  }
  // keep only steps whose target exists; resolve lazily at show time too
  var steps = raw.filter(function (s) { return resolve(s[0]); });
  if (steps.length < 2) return;

  // toggle button
  var btn = document.createElement('button');
  btn.className = 'tour-toggle';
  btn.type = 'button';
  btn.innerHTML = '<span class="td"></span>演示导览';
  document.body.appendChild(btn);

  var overlay, spot, card, idx = 0, active = false;
  function build() {
    overlay = document.createElement('div'); overlay.className = 'tour-overlay';
    spot = document.createElement('div'); spot.className = 'tour-spot';
    card = document.createElement('div'); card.className = 'tour-card';
    overlay.appendChild(spot); overlay.appendChild(card);
    document.body.appendChild(overlay);
    card.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-act'); if (!a) return;
      if (a === 'next') go(idx + 1);
      else if (a === 'prev') go(idx - 1);
      else if (a === 'close') stop();
    });
  }
  function position() {
    var el = resolve(steps[idx][0]); if (!el) return;
    var r = el.getBoundingClientRect();
    var pad = 8;
    spot.style.top = (r.top - pad) + 'px';
    spot.style.left = (r.left - pad) + 'px';
    spot.style.width = (r.width + pad * 2) + 'px';
    spot.style.height = (r.height + pad * 2) + 'px';
  }
  function render() {
    var s = steps[idx];
    var dots = steps.map(function (_, i) { return '<i class="' + (i === idx ? 'on' : '') + '"></i>'; }).join('');
    card.innerHTML =
      '<button class="tc-close" data-act="close" aria-label="关闭">×</button>' +
      '<div class="tc-step">导览 · ' + (idx + 1) + ' / ' + steps.length + '</div>' +
      '<div class="tc-title">' + s[1] + '</div>' +
      '<div class="tc-body">' + s[2] + '</div>' +
      '<div class="tc-ctrl"><div class="tc-dots">' + dots + '</div>' +
      (idx > 0 ? '<button class="tc-prev" data-act="prev">上一步</button>' : '') +
      '<button class="tc-next" data-act="' + (idx === steps.length - 1 ? 'close' : 'next') + '">' + (idx === steps.length - 1 ? '完成' : '下一步') + '</button></div>';
  }
  function go(i) {
    if (i < 0 || i >= steps.length) return;
    idx = i;
    var el = resolve(steps[idx][0]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    render();
    setTimeout(position, 380);
  }
  function start() { if (!overlay) build(); active = true; overlay.classList.add('on'); btn.style.display = 'none'; go(0); }
  function stop() { active = false; if (overlay) overlay.classList.remove('on'); btn.style.display = ''; }

  btn.addEventListener('click', start);
  window.addEventListener('scroll', function () { if (active) position(); }, { passive: true });
  window.addEventListener('resize', function () { if (active) position(); });
  document.addEventListener('keydown', function (e) {
    if (!active) return;
    if (e.key === 'Escape') stop();
    else if (e.key === 'ArrowRight') go(idx + 1);
    else if (e.key === 'ArrowLeft') go(idx - 1);
  });
})();

// --- Language switch (中文 / Italiano) via Google Translate ---
(function () {
  function getCookie(n){ var m=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)'); return m?decodeURIComponent(m.pop()):''; }
  function setGoogtrans(v){
    var host=location.hostname, exp='path=/';
    document.cookie='googtrans='+v+';'+exp;
    document.cookie='googtrans='+v+';'+exp+';domain='+host;
    if(host.indexOf('.')>-1){ document.cookie='googtrans='+v+';'+exp+';domain=.'+host; }
  }
  var _lp=(new URLSearchParams(location.search)).get('lang'); if(_lp==='zh'||_lp==='zh-CN'){setGoogtrans('/it/zh-CN');}else if(_lp==='it'){setGoogtrans('/it/it');} /* lang param */
  var gt=getCookie('googtrans'); if(gt && gt.indexOf('/it/')!==0){ setGoogtrans('/it/it'); } var isZH = /\/zh-CN$/.test(gt);
  // keep brand, kanji and prices out of machine translation
  function tagNoTranslate(){
    var sel='.nav .brand,.brand,.mark,.kanji,.footer-brand .brand-large,.fbrand,.pc-name .jp,.pc-price,.price,.cr-big,.deliv-chip .dc-v,.bigstat .v';
    document.querySelectorAll(sel).forEach(function(el){el.classList.add('notranslate');el.setAttribute('translate','no');});
    document.querySelectorAll('span,em,b,strong,h1,h2').forEach(function(el){
      if(el.childElementCount===0){var t=el.textContent.trim();if(t==='春'||t==='春 Harù'||t==='Harù'){el.classList.add('notranslate');el.setAttribute('translate','no');}}
    });
  }
  tagNoTranslate();

  // hidden Google Translate element + loader
  var div=document.createElement('div'); div.id='google_translate_element'; div.style.display='none'; document.body.appendChild(div);
  window.googleTranslateElementInit=function(){
    try{ new google.translate.TranslateElement({pageLanguage:'it', includedLanguages:'it,zh-CN', autoDisplay:false}, 'google_translate_element'); }catch(e){}
  };
  var s=document.createElement('script'); s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; s.async=true; document.body.appendChild(s);

  // toggle button
  var btn=document.createElement('button'); btn.className='lang-toggle'; btn.type='button';
  btn.setAttribute('translate','no'); btn.classList.add('notranslate');
  btn.innerHTML='<span class="lt-ic">🌐</span>'+(isZH?'Italiano':'中文');
  document.body.appendChild(btn);
  btn.addEventListener('click', function(){
    setGoogtrans(isZH ? '/it/it' : '/it/zh-CN');
    location.reload();
  });
})();

// --- Per-sede full menu (mini-sites): render #sedeMenu from window.HARU_SEDE_MENUS[key] ---
(function () {
  var host = document.getElementById('sedeMenu');
  if (!host) return;
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  var key = host.getAttribute('data-key');
  var tel = host.getAttribute('data-tel') || '';
  var M = (window.HARU_SEDE_MENUS || {})[key];
  if (!M || !M.length) {
    host.className = 'sm-fallback';
    host.innerHTML = '<p>Questo locale non ha ancora l\'ordine online attivo: il menu completo è disponibile in negozio. Chiama il <a href="tel:' + tel + '" style="color:var(--accent-2)">ristorante</a> o passa a trovarci — è tra i prossimi ad arrivare sul nuovo sistema.</p>';
    var lede = document.getElementById('sedeMenuLede');
    if (lede) lede.textContent = 'Menu completo disponibile in negozio — l\'ordine online di questa sede è in arrivo.';
    return;
  }
  host.innerHTML = M.map(function (c) {
    var rows = c.items.map(function (it) {
      var nm = '<span class="sm-name">' + esc(it.name) +
        (it.desc ? '<span class="sm-desc">' + esc(it.desc) + '</span>' : '') +
        (it.allergeni ? '<span class="sm-al">Allergeni: ' + esc(it.allergeni) + '</span>' : '') + '</span>';
      return '<div class="sm-row"><span class="sm-code">' + (esc(it.code) || '·') + '</span>' + nm +
        '<span class="sm-price">' + esc(it.price) + '</span></div>';
    }).join('');
    return '<div class="sm-cat"><h3 class="sm-cat-h">' + esc(c.category) +
      ' <span class="sm-ct">' + c.items.length + '</span></h3>' + rows + '</div>';
  }).join('');
})();
