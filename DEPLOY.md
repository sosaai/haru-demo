# Come pubblicare modifiche (deploy)

Il sito **Harù** è su **Vercel** e si aggiorna **da solo a ogni modifica salvata su GitHub**.

- **Repo:** https://github.com/sosaai/haru-demo
- **Sito live:** https://haru-sushi-cn.vercel.app

> In pratica: **modifichi un file → salvi (commit) su GitHub → dopo ~30 secondi è online.**
> Nessun comando da lanciare, niente da installare.

---

## Metodo semplice — dal browser (consigliato)

1. Vai sul repo: **https://github.com/sosaai/haru-demo**
2. Apri il file da cambiare (es. `haru-index.html`).
3. Clicca la **matita ✏️** in alto a destra del file (*Edit this file*).
4. Fai la modifica.
5. In fondo alla pagina clicca il bottone verde **Commit changes**
   (puoi lasciare il messaggio di default).
6. Fatto ✅ — Vercel ripubblica da solo. Dopo ~30 secondi ricarica
   https://haru-sushi-cn.vercel.app

**Per vedere quando è pronto:** https://vercel.com → progetto **haru** → scheda
**Deployments**. Pallino verde "Ready" = online.

---

## Metodo da computer (per chi usa Git)

```bash
git clone https://github.com/sosaai/haru-demo.git
cd haru-demo
#  ...modifica i file...
git add -A
git commit -m "cosa ho cambiato"
git push
```

Il `git push` fa partire il deploy automatico.

---

## Cose utili da sapere

- **La home** è `haru-index.html` (la pagina iniziale del sito). Ne esiste una copia
  `index.html` da tenere **identica**: se cambi una, cambia anche l'altra.
- Le pagine delle 13 sedi sono in `locali/<città>/index.html`.
- Alcuni file NON finiscono sul sito pubblico (script di build, `data/`, vecchi
  template) — l'elenco è in `.vercelignore`. Le modifiche a quei file non cambiano il sito.
- **Tornare indietro dopo un errore:** vai su Vercel → progetto **haru** →
  **Deployments** → scegli un deploy precedente che funzionava → menu **⋯** →
  **Instant Rollback** (rimette online la versione vecchia in pochi secondi).
