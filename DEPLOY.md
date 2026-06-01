# Deploy su Netlify

## 1. Pubblica
- Vai su **app.netlify.com/drop** e trascina l'intera cartella `haru/`
  (oppure collega il repo Git → Netlify usa `netlify.toml` automaticamente).
- Ottieni un URL, es. `https://haru-demo.netlify.app`.

## 2. Attiva le anteprime-link (Open Graph)
Le og:image usano il placeholder `https://DEMO-URL`. Sostituiscilo con l'URL reale,
un solo comando dalla cartella `haru/`:

```bash
grep -rl 'DEMO-URL' . --include='*.html' --include='*.js' \
  | xargs sed -i '' 's|https://DEMO-URL|https://haru-demo.netlify.app|g'
```
(su Linux: `sed -i` senza `''`). Poi ripubblica.

> Dopo la sostituzione NON serve rigenerare: i file `locali/*/index.html` vengono
> aggiornati direttamente. Se rigeneri (`node build-sedi.js`), aggiorna prima
> anche `DOMAIN` in `build-sedi.js`.

## 3. URL utili da inviare (WhatsApp / mail)
- Presentazione (apertura a freddo): `https://haru-demo.netlify.app/presentazione`
- Sito demo (home): `https://haru-demo.netlify.app/`
- Mini-sito della loro città: `https://haru-demo.netlify.app/locali/mozzate/`

## Note
- Home servita alla root via redirect in `netlify.toml` (la home è `haru-index.html`).
- URL puliti (`/presentazione`, `/locali/<sede>`) sono nativi su Netlify.
- File di sviluppo (`server.js`, `build-*.js`, `data/`) sono innocui se pubblicati;
  per escluderli usa un repo Git con `.gitignore`.
