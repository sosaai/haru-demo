// Generator: builds 13 static per-restaurant mini-sites at locali/<key>/index.html
// Single source of truth (this template) -> 13 fully-rendered static zh-CN pages.
// Run: node build-sedi.js
const fs = require('fs');
const path = require('path');

global.window = {};
require('./assets/data.js');
require('./assets/menus-sedi.js');
const SEDE_MENUS = (global.window && global.window.HARU_SEDE_MENUS) || {};
const SEDI = window.HARU_SEDI;
const MENU = window.HARU_MENU;

const REGION = { CO:'Lombardia', MI:'Lombardia', SO:'Lombardia', BS:'Lombardia', BG:'Lombardia', LC:'Lombardia', NO:'Piemonte', TO:'Piemonte', SV:'Liguria' };
const P = '../../'; // depth: locali/<key>/
const DOMAIN = 'https://haru-sushi-cn.vercel.app'; // <-- sostituire con l'URL reale al deploy

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// pick ~6 menu highlights from popular food categories (with images)
function highlights() {
  const want = ['Uramaki','Nigiri','Chirashi e Cake','Sashimi','Temaki','Tartare'];
  const out = [];
  want.forEach(cat => {
    const g = MENU.find(c => c.category === cat);
    if (g) { const it = g.items.find(i => i.img && i.name); if (it) out.push(it); }
  });
  return out.slice(0, 6);
}
const HL = highlights();

// 3 localized reviews per sede (rotated)
function reviews(city) {
  return [
    { t:`Il sushi di questo Harù di ${city} è freschissimo, porzioni generose e impiattamento curato. Anche da asporto arriva impeccabile: ci torneremo di sicuro.`, n:'Marco R.' },
    { t:'Uramaki e sashimi davvero ottimi, la qualità del pesce si sente. Servizio veloce e prezzi onesti.', n:'Giulia B.' },
    { t:`È da sempre il giapponese preferito di tutta la nostra famiglia a ${city}. Ordinare è comodissimo e con i punti si ottengono anche piatti gratis: un bel pensiero.`, n:'Davide T.' },
  ];
}

const NAV = (key) => `
<div class="topbar"><div class="wrap">
  <span><strong>Ordina diretto su harù.it</strong> &nbsp;·&nbsp; <span class="pill-0">−10% sul primo ordine</span> &nbsp;·&nbsp; Prezzi del ristorante, nessun sovrapprezzo</span>
  <div class="tb-right"><span>13 ristoranti · LO · PI · LI · TO</span><span>★ 4,4 / 5 su Google</span></div>
</div></div>
<div class="nav-shell"><nav class="nav">
  <a href="${P}haru-index.html" class="brand"><span class="mark">春</span> Harù</a>
  <div class="links">
    <a href="${P}haru-index.html">Home</a>
    <a href="${P}haru-menu.html">Menu</a>
    <a href="${P}haru-order.html">Ordina</a>
    <a href="${P}haru-locali.html" class="active">Locali</a>
    <a href="${P}haru-app.html">App</a>
    <a href="${P}haru-owners.html" class="owners">Per i proprietari</a>
  </div>
  <a href="${P}haru-order.html" class="cta-mini">Ordina ora</a>
  <button class="menu-toggle" aria-label="Menu"><span></span></button>
</nav></div>
<div class="mobile-menu">
  <a href="${P}haru-index.html">Home</a><a href="${P}haru-menu.html">Menu</a><a href="${P}haru-order.html">Ordina</a><a href="${P}haru-locali.html">Locali</a><a href="${P}haru-app.html">App</a><a href="${P}haru-owners.html">Per i proprietari</a>
</div>`;

const FOOTER = `
<footer class="footer"><div class="footer-grid">
  <div class="footer-brand"><img src="${P}assets/img/site/logo-white.png" alt="Harù" style="height:46px;width:auto;margin-bottom:16px" /><p>Sushi e cucina asiatica dal 2014. 13 ristoranti tra Lombardia, Piemonte, Liguria e Torino. Un solo brand, una sola App, il tuo ordine diretto.</p></div>
  <div class="footer-col"><h5>Ordina</h5><ul><li><a href="${P}haru-menu.html">Menu completo</a></li><li><a href="${P}haru-order.html">Ordina online</a></li><li><a href="${P}haru-locali.html">I nostri locali</a></li><li><a href="${P}haru-app.html">App &amp; fidelity</a></li></ul></div>
  <div class="footer-col"><h5>Brand</h5><ul><li><a href="${P}haru-index.html">Chi siamo</a></li><li><a href="${P}haru-owners.html">Per i proprietari</a></li></ul></div>
  <div class="footer-col"><h5>Contatti</h5><p>info@haru.it<br/>13 ristoranti nel Nord Italia<br/>Lun–Dom · pranzo e cena</p></div>
</div><div class="footer-bottom"><span>© 2026 Harù · Demo dimostrativa · HOTATE S.A.S. / YE SONDRIO S.R.L.</span><div class="socials"><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">TikTok</a></div></div></footer>`;

const STYLE = `
.sede-hero .hero-inner { gap: 22px; }
.sede-hero .eyebrow { margin-bottom: 18px; display:inline-block; }
.sede-hero .addr-line { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: var(--fg-muted); margin-top: 8px; display:flex; gap:10px; flex-wrap:wrap; }
.sede-hero .hero-actions { margin-top: 26px; }
.sede-info { display:grid; grid-template-columns: repeat(4,1fr); border-top:1px solid var(--border); }
@media (max-width:880px){ .sede-info { grid-template-columns: repeat(2,1fr); } }
.sede-info .si { padding:30px 26px 26px; border-right:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
.sede-info .si:last-child{ border-right:none; }
@media (max-width:880px){ .sede-info .si:nth-child(2){border-right:none;} .sede-info .si:nth-child(-n+2){border-bottom:1px solid var(--border);} }
.sede-info .si .k { font-family:var(--font-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--fg-muted); }
.sede-info .si .v { font-size:16px; color:var(--fg); font-weight:400; line-height:1.5; }
.sede-info .si a.v:hover{ color:var(--accent-2); }
.menu-note { font-size:13px; color:var(--fg-dim); margin-top:18px; font-family:var(--font-mono); letter-spacing:0.04em; }
.sede-gallery { display:grid; grid-template-columns: repeat(4,1fr); gap:4px; }
@media (max-width:680px){ .sede-gallery { grid-template-columns: repeat(2,1fr); } }
.sede-gallery .g { aspect-ratio:1; overflow:hidden; background:var(--bg-3); }
.sede-gallery .g img { width:100%; height:100%; object-fit:cover; transition:transform 1s var(--ease); }
.sede-gallery .g:hover img { transform:scale(1.06); }
.other-sedi { display:flex; flex-wrap:wrap; gap:8px; }
.other-sedi a { padding:11px 18px; border:1px solid var(--border-strong); border-radius:100px; font-size:14px; color:var(--fg); transition:all .3s var(--ease); }
.other-sedi a:hover { border-color:var(--border-gold); background:rgba(255,255,255,0.04); color:var(--accent-2); }
.sede-menu { display:grid; gap:clamp(26px,4vw,42px); }
.sm-cat { border-top:1px solid var(--border); padding-top:22px; }
.sm-cat-h { font-size:clamp(20px,2.4vw,28px); font-weight:300; letter-spacing:-0.02em; margin-bottom:14px; display:flex; align-items:baseline; gap:12px; }
.sm-cat-h .sm-ct { font-family:var(--font-mono); font-size:12px; color:var(--fg-dim); letter-spacing:0.1em; }
.sm-row { display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:baseline; padding:11px 0; border-top:1px solid var(--border); }
.sm-row:first-of-type{ border-top:none; }
.sm-code { font-family:var(--font-mono); font-size:11px; color:var(--fg-dim); }
.sm-name { font-size:15px; color:var(--fg); }
.sm-name .sm-desc { display:block; font-size:12.5px; color:var(--fg-muted); margin-top:2px; line-height:1.45; }
.sm-name .sm-al { display:block; font-family:var(--font-mono); font-size:10px; color:var(--fg-dim); text-transform:uppercase; margin-top:3px; letter-spacing:0.06em; }
.sm-price { font-family:var(--font-mono); font-size:14px; color:var(--fg); white-space:nowrap; }
.sm-fallback { border:1px solid var(--border-gold); background:var(--haru-green-soft); border-radius:14px; padding:28px 30px; }
.sm-fallback p { color:var(--fg-muted); font-size:15px; line-height:1.65; }
.sede-pay { display:flex; flex-wrap:wrap; gap:10px; }
.sede-pay .pm { display:inline-flex; align-items:center; gap:9px; padding:15px 22px; border:1px solid var(--border-strong); border-radius:100px; background:var(--bg-2); font-size:14.5px; font-weight:400; color:var(--fg); transition:all .3s var(--ease); box-shadow:0 8px 24px -18px rgba(0,0,0,.8); }
.sede-pay .pm:hover { border-color:var(--border-gold); transform:translateY(-2px); color:var(--accent-2); }
.sede-pay .pm svg { width:22px; height:22px; flex-shrink:0; }

/* status badge variants */
.tag-status.open { color:var(--accent-2); }
.tag-status.soon { color:var(--fg-dim); }

/* live / soon banner */
.order-state { display:flex; align-items:flex-start; gap:18px; padding:24px 26px; border:1px solid var(--border-strong); border-radius:14px; background:var(--bg-2); margin-top:26px; }
.order-state.is-soon { border-color:var(--border); background:var(--bg-3); }
.order-state .os-dot { width:9px; height:9px; border-radius:100px; margin-top:7px; flex-shrink:0; background:var(--accent-2); box-shadow:0 0 0 4px rgba(122,179,143,0.16); }
.order-state.is-soon .os-dot { background:var(--fg-dim); box-shadow:none; }
.order-state .os-title { font-size:16px; color:var(--fg); font-weight:500; }
.order-state .os-sub { font-size:13.5px; color:var(--fg-muted); margin-top:6px; line-height:1.6; }
.order-state .os-sub a { color:var(--accent-2); }

/* hours / delivery info cards */
.sede-hours { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:8px; }
@media (max-width:760px){ .sede-hours { grid-template-columns:1fr; } }
.sede-hours .hc { padding:24px 24px 22px; border:1px solid var(--border); border-radius:14px; background:var(--bg-2); display:flex; flex-direction:column; gap:9px; }
.sede-hours .hc .hk { font-family:var(--font-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--fg-muted); }
.sede-hours .hc .hv { font-size:20px; color:var(--fg); font-weight:300; line-height:1.3; }
.sede-hours .hc .hv em { font-style:normal; color:var(--accent-2); }
.sede-hours .hc .hd { font-size:13px; color:var(--fg-dim); line-height:1.6; }

/* map block */
.sede-map { display:grid; grid-template-columns:1.45fr 1fr; gap:0; border:1px solid var(--border); border-radius:16px; overflow:hidden; background:var(--bg-2); }
@media (max-width:880px){ .sede-map { grid-template-columns:1fr; } }
.sede-map .map-frame { position:relative; min-height:340px; background:var(--bg-3); }
.sede-map .map-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; filter:grayscale(0.35) contrast(1.05); }
.sede-map .map-side { padding:34px 32px; display:flex; flex-direction:column; gap:16px; justify-content:center; }
.sede-map .map-side .ms-k { font-family:var(--font-mono); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--fg-muted); }
.sede-map .map-side .ms-addr { font-size:19px; color:var(--fg); font-weight:300; line-height:1.4; }
.sede-map .map-side .ms-row { font-size:14px; color:var(--fg-muted); line-height:1.6; }
.sede-map .map-side .ms-row a { color:var(--accent-2); }
.sede-map .map-side .ms-actions { margin-top:8px; display:flex; flex-wrap:wrap; gap:10px; }

/* combo / set highlight */
.sede-combo { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:34px; }
@media (max-width:760px){ .sede-combo { grid-template-columns:1fr; } }
.sede-combo .cc { display:block; padding:26px 24px; border:1px solid var(--border-strong); border-radius:14px; background:linear-gradient(160deg,var(--bg-2),var(--bg-3)); transition:all .3s var(--ease); }
.sede-combo .cc:hover { border-color:var(--border-gold); transform:translateY(-3px); }
.sede-combo .cc .cc-tag { font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent-2); }
.sede-combo .cc .cc-name { font-size:19px; color:var(--fg); font-weight:400; margin:12px 0 8px; }
.sede-combo .cc .cc-desc { font-size:13.5px; color:var(--fg-muted); line-height:1.65; }
.sede-combo .cc .cc-foot { margin-top:16px; display:flex; align-items:baseline; justify-content:space-between; }
.sede-combo .cc .cc-price { font-family:var(--font-mono); font-size:16px; color:var(--fg); }
.sede-combo .cc .cc-go { font-size:12.5px; color:var(--accent-2); }

/* sticky mobile order bar */
.sticky-order { position:fixed; left:0; right:0; bottom:0; z-index:90; transform:translateY(120%); transition:transform .4s var(--ease); padding:12px 16px calc(12px + env(safe-area-inset-bottom)); background:rgba(12,12,13,0.86); backdrop-filter:blur(14px); border-top:1px solid var(--border-strong); display:flex; align-items:center; gap:14px; }
.sticky-order.show { transform:translateY(0); }
.sticky-order .so-info { flex:1; min-width:0; }
.sticky-order .so-info .so-t { font-size:14px; color:var(--fg); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sticky-order .so-info .so-s { font-size:11.5px; color:var(--fg-muted); margin-top:2px; }
.sticky-order .btn { flex-shrink:0; padding:13px 22px; }
@media (min-width:861px){ .sticky-order { display:none; } }`;

// clickable payment methods (SVG logos consistent with the order checkout)
const PAY_METHODS = [
  ['<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#f94d00" d="M4 12l8-8 8 8-8 8z"/></svg>','Satispay'],
  ['<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.8-3.6.8-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.9 2.4-1.6 2.9-.4 7.1 1.2 9.5.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3.1-.7 1.4 0 1.8.7 3.1.7 1.3 0 2.1-1.1 2.9-2.3.6-.9.9-1.7.9-1.8 0 0-1.7-.7-1.7-2.6z"/></svg>','Apple Pay'],
  ['<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="#4285f4" stroke-width="2"/><path fill="#4285f4" d="M12 11v2h3a3 3 0 11-1-2.7"/></svg>','Google Pay'],
  ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" stroke-width="1.6"/><rect x="2" y="8" width="20" height="3" fill="currentColor" stroke="none"/></svg>','Carta'],
  ['<svg viewBox="0 0 24 24" fill="none" stroke="#3a7d5c" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" stroke-width="1.6"/><line x1="9" y1="6" x2="9" y2="18" stroke-dasharray="2 2"/></svg>','Buoni pasto'],
  ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke-width="1.6"/><text x="12" y="16" font-size="11" text-anchor="middle" fill="currentColor" stroke="none">€</text></svg>','Contanti'],
];

function page(s) {
  const region = REGION[s.prov] || 'Nord Italia';
  const statusBadge = s.live
    ? `<span class="tag-status open">Ordina online attivo</span>`
    : `<span class="tag-status soon">In arrivo sul nuovo sistema</span>`;
  const orderUrl = `${P}haru-order.html?zone=${encodeURIComponent(s.city)}`;
  const others = SEDI.filter(o => o.key !== s.key).slice(0, 6);
  const rv = reviews(s.city);

  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent('Haru ' + s.city)}&output=embed`;

  const schema = {
    "@context":"https://schema.org","@type":"Restaurant",
    "name":`Harù ${s.city}`,"servesCuisine":["Giapponese","Sushi","Cucina asiatica"],
    "priceRange":"€€","telephone":s.tel,
    "url":`${P}locali/${s.key}/`,
    "image":`${P}assets/img/sedi/${s.key}.jpg`,
    "address":{"@type":"PostalAddress","streetAddress":s.addr,"addressLocality":s.city,"addressRegion":s.prov,"addressCountry":"IT"},
    "geo":{"@type":"GeoCoordinates","name":`Harù ${s.city}`},
    "hasMap":s.map,
    "openingHours":"Mo-Su 11:30-14:30,18:30-22:30",
    "acceptsReservations":s.live,
    "potentialAction":{"@type":"OrderAction","target":orderUrl,"deliveryMethod":["http://purl.org/goodrelations/v1#DeliveryModePickUp","http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"]},
    "aggregateRating":{"@type":"AggregateRating","ratingValue":"4.4","reviewCount":"380"},
    "areaServed":region,"hasMenu":`${P}haru-menu.html`
  };

  return `<!doctype html><html lang="it"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Harù ${esc(s.city)} — Sushi e cucina asiatica · ${esc(s.prov)}</title>
<meta name="description" content="Harù ${esc(s.city)} (${esc(s.prov)}): indirizzo ${esc(s.addr)}, telefono, mappa, i piatti più richiesti del locale e l'ordine online. Sushi giapponese e cucina asiatica in ${esc(region)}." />
<meta property="og:type" content="restaurant" />
<meta property="og:site_name" content="Harù" />
<meta property="og:locale" content="it_IT" />
<meta property="og:title" content="Harù ${esc(s.city)} · Sushi e cucina asiatica" />
<meta property="og:description" content="Ristorante di ${esc(s.city)} (${esc(s.prov)}): indirizzo, mappa, i piatti più richiesti del locale e l'ordine online. Ordina diretto dal locale, prezzi del ristorante, −10% sul primo ordine." />
<meta property="og:image" content="${DOMAIN}/assets/img/og/sede-${s.key}.png" />
<meta property="og:url" content="${DOMAIN}/locali/${s.key}/" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Harù ${esc(s.city)} · Sushi e cucina asiatica" />
<meta name="twitter:image" content="${DOMAIN}/assets/img/og/sede-${s.key}.png" />
<link rel="icon" href="${P}assets/img/site/favicon.jpg" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;300;400;500;600&family=Geist+Mono:wght@400;500&family=Noto+Sans+JP:wght@200;300;400;500&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${P}assets/styles.css" /><link rel="stylesheet" href="${P}assets/haru.css" />
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${NAV(s.key)}

<!-- HERO -->
<header class="hero sede-hero">
  <div class="hero-bg"><img src="${P}assets/img/sedi/${s.key}.jpg" alt="Ristorante Harù ${esc(s.city)}" /></div>
  <div class="hero-inner">
    <span class="eyebrow"><span class="dot"></span>Ristorante · ${esc(s.prov)} · ${esc(region)}</span>
    <h1 class="display"><span class="kanji" style="color:var(--accent-2)">春</span> Harù<br/>${esc(s.city)}</h1>
    <div>${statusBadge}</div>
    <div class="addr-line"><span>${esc(s.addr)}</span><span>·</span><span>★ 4,4 su Google</span></div>
    <div class="hero-actions">
      ${s.live
        ? `<a href="${orderUrl}" class="btn btn-primary">Ordina da questo ristorante<svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>
      <a href="${esc(s.map)}" target="_blank" rel="noopener" class="btn btn-ghost">Vedi mappa</a>`
        : `<a href="tel:${esc(s.tel)}" class="btn btn-primary">Prenota per telefono<svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>
      <a href="${P}haru-menu.html" class="btn btn-ghost">Vedi il menu</a>`}
    </div>
  </div>
</header>

<!-- INFO -->
<section style="padding-top:0">
  <div class="wrap">
    <div class="sede-info reveal">
      <div class="si"><span class="k">Indirizzo</span><a class="v" href="${esc(s.map)}" target="_blank" rel="noopener">${esc(s.addr)}</a></div>
      <div class="si"><span class="k">Telefono</span><a class="v" href="tel:${esc(s.tel)}">${esc(s.tel)}</a></div>
      <div class="si"><span class="k">Orari</span><span class="v">Lun–Dom<br/>pranzo e cena</span></div>
      <div class="si"><span class="k">Stato</span><span class="v">${s.live ? 'Ordina online attivo' : 'In arrivo · ora prenoti per telefono'}</span></div>
    </div>
    ${s.live
      ? `<div class="order-state reveal">
        <span class="os-dot"></span>
        <div>
          <div class="os-title">Ristorante di ${esc(s.city)} · Ordina online attivo</div>
          <div class="os-sub">Ordina subito da questo ristorante su harù.it: ritiro −30%, consegna −20% (ordine minimo €25). Prezzi del ristorante, nessun sovrapprezzo. <a href="${orderUrl}">Ordina ora →</a></div>
        </div>
      </div>`
      : `<div class="order-state is-soon reveal">
        <span class="os-dot"></span>
        <div>
          <div class="os-title">Ristorante di ${esc(s.city)} · Ordine online in arrivo</div>
          <div class="os-sub">Questo ristorante sta attivando il nuovo sistema di ordine online: restate sintonizzati. Nel frattempo puoi <a href="tel:${esc(s.tel)}">chiamare il ${esc(s.tel)}</a> per prenotare o ordinare d'asporto.</div>
        </div>
      </div>`}
  </div>
</section>

<!-- HOURS & DELIVERY -->
<section style="background:var(--bg-2)">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>Orari e ritiro</span>
        <h2 class="h2" style="margin-top:18px;">Orari<br/>e modalità di ritiro.</h2>
      </div>
      <p class="lede">Aperti tutta la settimana, da lunedì a domenica, con servizio a pranzo e a cena. ${s.live ? 'Disponibili ritiro e consegna: prima ordini, più risparmi.' : "L'ordine online sta per arrivare; per ora puoi prenotare il ritiro per telefono."}</p>
    </div>
    <div class="sede-hours reveal-stagger">
      <div class="hc"><span class="hk">Orari</span><span class="hv">Lun–Dom</span><span class="hd">Pranzo e cena · aperti tutta la settimana<br/>Gli orari precisi fanno fede quelli del locale</span></div>
      <div class="hc"><span class="hk">Ritiro</span><span class="hv"><em>−30%</em></span><span class="hd">Ordina online e ritira in negozio<br/>Sconto del 30% sul prezzo del locale</span></div>
      <div class="hc"><span class="hk">Consegna</span><span class="hv"><em>−20%</em></span><span class="hd">Consegna a domicilio, ordine minimo €25<br/>Sconto del 20% sul prezzo del locale</span></div>
    </div>
  </div>
</section>

<!-- MAP / HOW TO GET THERE -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>Come arrivare</span>
        <h2 class="h2" style="margin-top:18px;">Ristorante di ${esc(s.city)}<br/>indirizzo e mappa.</h2>
      </div>
      <p class="lede">Trova la posizione e il percorso di Harù ${esc(s.city)} sulla mappa e organizza la tua visita o il ritiro.</p>
    </div>
    <div class="sede-map reveal">
      <div class="map-frame">
        <iframe title="Mappa Harù ${esc(s.city)}" src="${mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div class="map-side">
        <span class="ms-k">Indirizzo</span>
        <div class="ms-addr">${esc(s.addr)}</div>
        <div class="ms-row">${esc(s.prov)} · ${esc(region)}</div>
        <div class="ms-row">Telefono <a href="tel:${esc(s.tel)}">${esc(s.tel)}</a></div>
        <div class="ms-actions">
          <a href="${esc(s.map)}" target="_blank" rel="noopener" class="btn btn-primary">Apri nella mappa</a>
          <a href="tel:${esc(s.tel)}" class="btn btn-ghost">Chiama il locale</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- MENU HIGHLIGHTS -->
<section style="background:var(--bg-2)">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>I più richiesti del locale</span>
        <h2 class="h2" style="margin-top:18px;">Le specialità<br/>di ${esc(s.city)}.</h2>
      </div>
      <p class="lede">Pesce del giorno, preparato al momento. Ecco i piatti più richiesti del locale; per il resto, dai un'occhiata al menu completo.</p>
    </div>
    <div class="sede-combo reveal-stagger">
      <a class="cc" href="${orderUrl}">
        <span class="cc-tag">Menu del locale</span>
        <div class="cc-name">Misto sushi per due · ${esc(s.city)}</div>
        <div class="cc-desc">Il classico mix di uramaki, nigiri e sashimi, con pesce fresco di giornata: perfetto da condividere in due.</div>
        <div class="cc-foot"><span class="cc-price">Per due</span><span class="cc-go">Ordina online →</span></div>
      </a>
      <a class="cc" href="${orderUrl}">
        <span class="cc-tag">Abbinamento consigliato</span>
        <div class="cc-name">Sashimi + temaki</div>
        <div class="cc-desc">Sashimi selezionato con temaki preparati al momento: freschezza e gusto insieme, la scelta leggera preferita dai clienti abituali.</div>
        <div class="cc-foot"><span class="cc-price">Per una persona</span><span class="cc-go">Ordina online →</span></div>
      </a>
      <a class="cc" href="${orderUrl}">
        <span class="cc-tag">Da condividere in famiglia</span>
        <div class="cc-name">Grande misto per la famiglia</div>
        <div class="cc-desc">Una ricca varietà di sushi e cucina asiatica tutta in una volta, con porzioni abbondanti: condividere in famiglia conviene di più.</div>
        <div class="cc-foot"><span class="cc-price">Per più persone</span><span class="cc-go">Ordina online →</span></div>
      </a>
    </div>
    <div class="signature-grid reveal-stagger">
      ${HL.map((it,i)=>`<a class="signature-card" href="${orderUrl}">
        <img src="${P}${esc(it.img)}" alt="${esc(it.name)}" loading="lazy" />
        <div class="info">
          <span class="num">0${i+1}</span>
          <div>
            <div class="name"><span class="jp">${esc(it.cat)}</span>${esc(it.name)}<span class="price">${esc(it.price)}</span></div>
          </div>
        </div>
      </a>`).join('')}
    </div>
    <p class="menu-note">* I più richiesti — qui sotto il menu completo del locale.</p>
  </div>
</section>

<!-- FULL PER-SEDE MENU (real catalogue from the restaurant's own shop) -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <div><span class="eyebrow"><span class="dot"></span>Il menu</span>
      <h2 class="h2" style="margin-top:18px;">Il menu di<br/>${esc(s.city)}.</h2></div>
      <p class="lede" id="sedeMenuLede">Il menu completo del ristorante Harù di ${esc(s.city)}. Prezzi e disponibilità possono variare da sede a sede.</p>
    </div>
    <div id="sedeMenu" class="sede-menu" data-key="${s.key}" data-tel="${esc(s.tel)}"></div>
  </div>
</section>

<!-- PAYMENTS -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>Pagamenti</span>
        <h2 class="h2" style="margin-top:18px;">Paga<br/>come preferisci.</h2>
      </div>
      <p class="lede">Satispay, Apple Pay, Google Pay, carta, buoni pasto oppure in contanti al ritiro. Tocca un metodo qualsiasi per ordinare dal ristorante di ${esc(s.city)}.</p>
    </div>
    <div class="sede-pay reveal">
      ${PAY_METHODS.map(m=>`<a class="pm" href="${orderUrl}">${m[0]} ${m[1]}</a>`).join('')}
    </div>
  </div>
</section>

<!-- ABOUT THE AREA -->
<section style="background:var(--bg-2)">
  <div class="wrap">
    <div class="split">
      <div class="media"><img src="${P}assets/img/site/ingredienti.jpg" alt="Ingredienti Harù" loading="lazy" /></div>
      <div class="content">
        <span class="eyebrow"><span class="dot"></span>Su questo ristorante</span>
        <h2 class="h2" style="margin:18px 0 22px;">A ${esc(s.city)},<br/>un ristorante vero.</h2>
        <p class="lede">Ogni Harù è un ristorante vero, con la propria cucina e il proprio team. Quello di ${esc(s.city)} non fa eccezione: stessa qualità, stessa cura, per portare sushi fresco e cucina asiatica sulla tua tavola, partendo dai clienti della ${esc(region)}.</p>
        <div class="hero-actions" style="margin-top:26px;">
          <a href="${orderUrl}" class="btn btn-primary">Ordina da questo ristorante</a>
          <a href="tel:${esc(s.tel)}" class="btn btn-ghost">Chiama il locale</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- GALLERY -->
<section style="padding-top:clamp(40px,5vw,80px)">
  <div class="wrap">
    <div class="sede-gallery reveal">
      <div class="g"><img src="${P}assets/img/sedi/${s.key}.jpg" alt="Harù ${esc(s.city)}" loading="lazy" /></div>
      <div class="g"><img src="${P}assets/img/site/hero-sushi.jpg" alt="Misto di sushi" loading="lazy" /></div>
      <div class="g"><img src="${P}assets/img/site/ampia-scelta.jpg" alt="Ampia scelta" loading="lazy" /></div>
      <div class="g"><img src="${P}assets/img/site/sushi-2.jpg" alt="Sushi" loading="lazy" /></div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section style="background:var(--bg-2)">
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>Le voci dei clienti</span>
        <h2 class="h2" style="margin-top:18px;">Le recensioni<br/>da ${esc(s.city)}.</h2>
      </div>
      <p class="lede">Cibo e brand sono molto amati: il vero collo di bottiglia è il digitale, non la cucina.</p>
    </div>
    <div class="review-grid reveal-stagger">
      ${rv.map(r=>`<div class="review-card">
        <div class="rv-stars">★★★★★</div>
        <p class="rv-text">${esc(r.t)}</p>
        <div class="rv-who"><span class="rv-ava">春</span><div><div class="rv-name">${esc(r.n)}</div><div class="rv-src">Recensione Google · ${esc(s.city)}</div></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- OTHER LOCATIONS -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <div>
        <span class="eyebrow"><span class="dot"></span>Altri ristoranti</span>
        <h2 class="h2" style="margin-top:18px;">13 ristoranti,<br/>un solo brand.</h2>
      </div>
      <p class="lede">In ${esc(region)} e non solo, c'è sempre un Harù vicino a te.</p>
    </div>
    <div class="other-sedi reveal">
      ${others.map(o=>`<a href="../${o.key}/">Harù ${esc(o.city)} <span style="color:var(--fg-dim)">${esc(o.prov)}</span></a>`).join('')}
      <a href="${P}haru-locali.html" style="border-color:var(--border-gold);color:var(--accent-2)">Vedi tutti i 13 →</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-banner">
  <span class="eyebrow"><span class="dot"></span>A ${esc(s.city)}</span>
  <h2 class="h1">Voglia di sushi a ${esc(s.city)}?<br/>Ordina <em>diretto</em>.</h2>
  <p class="lede" style="margin:0 auto;">Prezzi del ristorante, nessun sovrapprezzo e −10% sul primo ordine. Ordina diretto e tieni per te sconti e punti.</p>
  <div class="actions">
    <a href="${orderUrl}" class="btn btn-primary">Ordina da questo ristorante<svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>
    <a href="${P}haru-app.html" class="btn btn-ghost">Scarica l'App</a>
  </div>
</section>

${FOOTER}

<!-- STICKY MOBILE ORDER BAR -->
<div class="sticky-order" id="stickyOrder">
  <div class="so-info">
    <div class="so-t">Harù ${esc(s.city)}</div>
    <div class="so-s">${s.live ? 'Ordina online attivo · ritiro −30%' : 'Ordine in arrivo · ora prenoti per telefono'}</div>
  </div>
  ${s.live
    ? `<a href="${orderUrl}" class="btn btn-primary">Ordina ora</a>`
    : `<a href="tel:${esc(s.tel)}" class="btn btn-primary">Prenota per telefono</a>`}
</div>
<script>
(function(){
  var bar=document.getElementById('stickyOrder');
  if(!bar) return;
  var onScroll=function(){
    if(window.scrollY>600){ bar.classList.add('show'); }
    else { bar.classList.remove('show'); }
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();
</script>

<script src="${P}assets/data.js"></script>${SEDE_MENUS[s.key]?('<script>window.HARU_SEDE_MENUS={'+JSON.stringify(s.key)+':'+JSON.stringify(SEDE_MENUS[s.key]).replace(/<\//g,'<\\/')+'};<\/script>'):''}<script src="${P}assets/main.js"></script>
</body></html>`;
}

let count = 0;
SEDI.forEach(s => {
  const dir = path.join(__dirname, 'locali', s.key);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(s));
  count++;
  console.log('  ✓ /locali/' + s.key + '/  (' + s.city + ' · ' + s.prov + (s.live ? ' · live' : ' · soon') + ')');
});
console.log('Generated ' + count + ' per-restaurant mini-sites.');
