# Harù — Demo sito + presentazione owner

> **Contesto per chi (umano o LLM) apre questo repo.** Questo è un sito-demo
> realizzato dall'agenzia **Studio Cima** (studio-cima.it) come *pitch commerciale*
> per convincere i proprietari della catena di ristoranti giapponesi/fusion
> **Harù** (13 sedi nel Nord Italia — Lombardia, Piemonte, Liguria, Torino,
> Valtellina) a rifare la loro presenza digitale: un sito unico + app per tutti i
> locali, con ordini online diretti (per ridurre la dipendenza dalle commissioni
> di Glovo/Deliveroo).
>
> **Non è il sito ufficiale di Harù.** È un mock-up ad alta fedeltà costruito con
> i loro contenuti, foto e menu *reali* (estratti dal sito vero e dai volantini
> PDF) per dimostrare il valore. I proprietari sono di origine cinese, quindi il
> sito è bilingue **Italiano (primario) / 中文 (cinese semplificato)**.

🔗 **Live:** https://haru-sushi-cn.vercel.app
📄 **Pagina business-case per i proprietari:** https://haru-sushi-cn.vercel.app/haru-owners.html (aggiungi `?lang=zh` per il cinese)

---

## Stack & filosofia

- **Sito statico** puro: HTML + CSS + JS vanilla, zero framework, zero build step
  per il runtime (i generatori Node sono solo per pre-produrre dati/asset).
- Design system **dark-editorial "japanese-modern"** (vedi `assets/styles.css` +
  `assets/haru.css`): palette scura, accenti, tipografia con Noto Sans SC per il
  cinese, film grain, micro-animazioni (reveal/stagger, count-up, marquee piatti).
- **Deploy: Vercel, automatico da GitHub.** Ogni `git push` sul branch `main` del repo
  [`sosaai/haru-demo`](https://github.com/sosaai/haru-demo) ripubblica da solo in ~30s
  su `https://haru-sushi-cn.vercel.app`. (Netlify era il piano A ma è bloccato da limite
  account → si usa Vercel.)

## Pagine principali (root)

| File | Ruolo |
|------|-------|
| `haru-index.html` / `index.html` | Home. `index.html` è la copia servita da Vercel alla root. **Tienile sincronizzate.** |
| `haru-menu.html` | Menu completo (291 piatti, 28 categorie). |
| `haru-order.html` | Ordine con carrello. |
| `haru-locali.html` | Le 13 sedi → linkano ai mini-siti `/locali/<key>/`. |
| `haru-app.html` | Pagina app, **rivolta al cliente** (non ai proprietari). |
| `haru-owners.html` | **Business-case / presentazione** per i proprietari: numeri, calcolatore costo-commissioni interattivo, grafico 5 anni, prima/dopo, roadmap 3 fasi, CTA email/call. È la pagina-chiave del pitch. |

I file `chef.html`, `contact.html`, `gallery.html`, `menu.html`, `omakase.html`,
`private-events.html`, `reservations.html` sono **vecchi residui del template SHUN**
e sono esclusi dal deploy (`.vercelignore`). Non fanno parte del sito Harù.

## Mini-siti per sede

`locali/<key>/index.html` — 13 micro-siti, uno per ristorante, generati da
`build-sedi.js`. Ogni mini-sito ha **inline solo il proprio menu** (per peso).

## Asset condivisi (`assets/`)

| File | Contenuto |
|------|-----------|
| `styles.css` | Design system base (variabili, tipografia, layout). |
| `haru.css` | Componenti + polish + film grain + guided-tour + language-toggle + stili menu per-sede. |
| `main.js` | JS condiviso da **tutte** le pagine: menu mobile, reveal/stagger, count-up, marquee piatti (language-agnostic), FAQ, **tour guidato**, **language toggle** (Google Translate + cookie `googtrans` + param `?lang=zh`), render menu per-sede, brand-protect (`notranslate` su 春/Harù/prezzi). |
| `data.js` | `window.HARU_MENU` (291 piatti IT) + `window.HARU_SEDI` (13 sedi). Rigenerato da `data/menu.json`. |
| `menus-sedi.js` | `window.HARU_SEDE_MENUS` — menu reali per 12 sedi. ~436KB, `.vercelignore`'d perché ormai inlined nei mini-siti. |
| `img/` | Foto prodotti + sedi + OG cards (`img/og/`). |

## Generatori Node (dev-time, non runtime)

| Script | Cosa fa |
|--------|---------|
| `build-sedi.js` | Genera i 13 mini-siti in `locali/<key>/`. `DOMAIN` = URL Vercel. |
| `build-menus.js` | Estrae i menu dai **PDF dei volantini AYCE** (`pdftotext -raw`), parsa con regex delimitate dagli allergeni (1–14), ri-categorizza con una master-map nome→categoria. Output → `assets/menus-sedi.js`. |
| `build-og.js` | Genera le 15 OG card (SVG→PNG 1200×630 via `rsvg-convert`) in `assets/img/og/`. |
| `server.js` | Server statico locale con clean-URL per testare. |

> ⚠️ I **PDF sorgente** (`data/pdf/*.pdf`, ~144MB) sono `.gitignore`'d (build
> artifact). I `.txt` estratti restano nel repo per rieseguire `build-menus.js`.

## Sistema lingua

- Default **italiano**. Toggle in alto a destra → cinese semplificato via widget
  **Google Translate Element** (cookie `googtrans=/it/zh-CN`).
- Deep-link: `?lang=zh` apre direttamente in cinese; `?lang=it` forza italiano.
- I termini di brand (`春`, `Harù`, `.brand`, `.kanji`, prezzi) sono marcati
  `notranslate` per non venire tradotti male (es. 春 → "Spring").

## Dati / fonti reali

- Menu à-la-carte (mozzate, oggiono, valtellina) → **WooCommerce Store API**
  (`/wp-json/wc/store/products`) del sito vero, **con prezzi**.
- Menu AYCE delle altre 9 sedi → **volantini PDF** del sito ufficiale, senza prezzi.
- 12/13 sedi hanno un menu reale. Manca solo **Milano Corso Sempione**.

## Stato / TODO noti

- ✅ Live, italiano-primario, bilingue, 0 errori console.
- ⬜ Menu per Milano Corso Sempione (unica sede senza).
- ⬜ Eventuale default cinese a livello sito.
- ⬜ Compressione immagini prodotti in WebP.
- ⬜ Distinzione menu pranzo/cena.

## Deploy (automatico da GitHub)

Il progetto Vercel `haru` è collegato al repo
[`sosaai/haru-demo`](https://github.com/sosaai/haru-demo): **ogni push sul branch `main`
pubblica in automatico** su `https://haru-sushi-cn.vercel.app` (~30s, nessun comando).
Vedi [`DEPLOY.md`](DEPLOY.md) per la guida passo-passo (anche da browser).

```bash
# (se cambi la home) sincronizza la copia root, poi committa e pusha
cp haru-index.html index.html
git add -A && git commit -m "descrizione modifica" && git push
```

`vercel.json` riscrive `/` → `/haru-index.html`. `.vercelignore` esclude
generatori, `data/`, `menus-sedi.js` e i vecchi file SHUN. Deploy manuale di
emergenza (sconsigliato, usa il push): `vercel deploy --prod`.

---

*Repo generato come materiale di pitch. Studio Cima · info@studio-cima.it*
