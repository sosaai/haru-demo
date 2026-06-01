# Digital Audit & Sales-Pitch Playbook: Harù Restaurant

## TL;DR
- **Harù's digital stack is years out of date and bleeding margin:** the main site and every ordering subdomain run on WooCommerce 4.8.3 (released December 2020), online payment is essentially PayPal-only (no Satispay, no Apple/Google Pay, no saved cards), the ordering architecture is fragmented (only 3 of ~13 locations have a working shop; the rest are PDF flyers or a dead link), and there is no app, no loyalty program, no structured data, and no booking system — while category competitors Poke House and NIMA Sushi already run branded apps with loyalty.
- **The single most persuasive owner argument is margin recapture:** Harù pays roughly 14–35% commission on every delivery-platform order (Il Fatto Quotidiano, Feb 2021: Glovo averages ~30% and "non supera la soglia del 35"; Uber Eats "il 14 per cento per il solo servizio di vetrina e il 30 per cento per la consegna"; Just Eat "dal 14 al 29 per cento"), and UBRI president Enzo Ferrieri told Il Fatto Quotidiano that "spesso il costo totale in fattura trattenuto dagli operatori di delivery supera il 50%." Strengthening Harù's own direct channel + app cuts that toward zero and hands Harù the customer data it currently gives away.
- **Pitch in three tiers:** (1) Quick wins — platform/security update, payments (add Satispay + wallets), local SEO + Google Business Profiles, structured data; (2) unified website + multi-zone e-commerce rebuild; (3) recurring-revenue upsells — branded app, loyalty/CRM, WhatsApp/email automation, reservations. Lead with commission-savings and customer-ownership, because that is what a gatekeeper manager can forward upward to convince sole-proprietor owners.

## Key Findings

### Current-state diagnosis (the pain points)
1. **Obsolete platform.** Both `www.harurestaurant.it` and `valtellina.harurestaurant.it` expose `meta-generator: WooCommerce 4.8.3` — a version the WooCommerce developer blog dates to its public release on 8 December 2020. WooCommerce is now on the 9.x/10.x line, meaning years of missed security patches, performance gains and checkout features. This is the cleanest "this is broken, act now" evidence for the owners.
2. **Fragmented, inconsistent multi-zone architecture.** The "Take Away" hub mixes three fulfilment models: real ordering subdomains (`oggiono.`, `mozzate.`, `valtellina.harurestaurant.it`), static PDF flyers (Leini, Cairo, Darfo, Madone, Milano Baggio, Romagnano Sesia, Abbiategrasso), and at least one broken `#` link. Most of the ~13 locations cannot take an online order at all.
3. **Separate legal entities per subdomain, no unifying brand layer.** The main site footer shows "HOTATE S.A.S. DI CHEN XIANGRONG & C." (P.I. 03631720137) while Valtellina shows "YE SONDRIO S.R.L." (P.I. 01029600143) — confirming the franchise/multi-owner reality and explaining the fragmentation. There is no central account, cart, or loyalty that works across zones.
4. **Thin, dated product presentation.** Product pages are minimal: a single photo, one line of description, allergens. Some catalog items use the WooCommerce placeholder image (e.g. the €50 "230 / Sushi misto"). The menu is numbered like a paper takeaway list rather than a modern visual catalog.
5. **Mixed-language, unpolished UI.** The storefront mixes Italian and untranslated English WooCommerce strings ("Add to cart," "Showing the single result," "Search for:," "Register"). No professional multilingual support.
6. **Payments are minimal.** Per Harù's own Terms & Conditions ("Modalità di pagamento"), online payment is effectively **PayPal only** (which also processes cards: "potrà effettuare il pagamento sia con carte di credito (senza avere un conto Paypal), sia con il proprio conto Paypal"), plus **Contanti** (cash on delivery/pickup) and **Bancomat** (debit, in-restaurant pickup only). No Satispay, no Stripe, no Apple Pay/Google Pay, no saved cards. HTTPS is enforced.
7. **Friction in the funnel.** A persistent banner on every page reads "Ritiro -30% | Consegna -20% | Ordine min. consegna €50 al netto di Sconti." A €50 delivery minimum is high and likely suppresses conversion; the discount structure is buried in a banner rather than merchandised.
8. **No structured data / weak SEO foundation.** No Restaurant/LocalBusiness JSON-LD was found in page source. Titles are generic ("Home - Haru Restaurant"). No evidence of per-location schema, hreflang, or rich-result optimization.
9. **No owned engagement channel.** No customer app, no loyalty/rewards, no CRM, no email/SMS/WhatsApp automation, no online reservation/table-management system. Every repeat-customer relationship is mediated by the phone or by third-party platforms.
10. **Reputation is a strength to leverage, not fix.** The Valtellina location holds about 4.4/5 on Google (RestaurantGuru and directory epcr.it both cite 4.4/5, across roughly 750–800 reviews); Mozzate has 950+ review mentions. Harù is confirmed live on Deliveroo (Milano "Haru Asian Fusion Restaurant"). The food and brand are well-liked — the bottleneck is digital infrastructure, not product. That is the optimistic framing for the pitch.

### Technical evidence (for the "diagnosis" slide)
- **Platform:** WordPress + WooCommerce 4.8.3 on all properties; build credited to "Tauruslab.net" in the footer.
- **Hosting/assets:** Images served from `/wp-content/uploads/` on each subdomain with no evidence of a CDN/image-optimization layer; product/OG photos uploaded at large dimensions (up to ~2048px) without modern formats (WebP) — a likely speed drag.
- **Payments:** PayPal redirect flow + WooCommerce Cash-on-Delivery/offline; HTTPS enforced; no Stripe/Satispay/Nexi/XPay/Bonifico/PagoPA signatures found.
- **Architecture:** geographic subdomains, each its own WooCommerce store with its own catalog and prices (Valtellina shop has ~20 categories incl. Uramaki with 38 products); customer reviews explicitly complain the menu is "non uniformato" across Haru locations.

### Market & benchmark context (to justify the spend)
- **Delivery commissions are the killer stat.** Per Il Fatto Quotidiano (3 Feb 2021): Glovo's delivery commissions "si aggirano in media intorno al 30% e solitamente non superano la soglia del 35"; Uber Eats charges "il 14 per cento per il solo servizio di vetrina e il 30 per cento per la consegna," with Just Eat "dal 14 al 29 per cento." Other Italian sources (Fanpage, Gambero Rosso) put the typical full-logistics band at 19–25%, charged on the VAT-inclusive total, with 22% VAT then added on the fee itself. UBRI president Enzo Ferrieri (founder of Cioccolati Italiani), to Il Fatto Quotidiano: **"Spesso il costo totale in fattura trattenuto dagli operatori di delivery supera il 50%."**
- **Owned channel = owning the data and the relationship.** Italian industry analysis (Torino Oggi, Ordinalo, Doxaliber) stresses that on marketplaces the restaurant "rents" the customer relationship and cannot market to diners directly; an owned app/site lets Harù move repeat orders to a near-zero-commission channel and build a first-party database. A "-10% on your first direct order" incentive costs far less than a platform commission.
- **App economics are proven in the category.** Poke House runs a branded app with the "Squad" loyalty program (free bowl after a set number of orders), live order tracking, coupons and Apple/Google Wallet cards; NIMA Sushi (6 restaurants) runs a branded iOS/Android ordering app with push notifications and app-exclusive promotions ("Special promotions… reserved only for App users"); Sushi Daily promotes a "fidelity club" and online ordering. These are the "this is what good looks like" references.
- **Food delivery in Italy is large and growing.** Per the Osservatorio eCommerce B2c Netcomm–Politecnico di Milano, online Food & Grocery was worth €4.6bn in 2024 (+8% vs 2023) within a €75.5bn total Food & Grocery market (online food specifically ~€6.4bn), and food delivery reached "il 76% degli abitanti nel 2024"; over 70% of food e-commerce orders are re-orders — exactly the repeat behavior loyalty/app tools capture.
- **Speed and mobile convert.** Google's "The Need for Mobile Speed" research (2016) found "53% of mobile website visitors will leave if a webpage doesn't load within three seconds"; broader data shows conversions drop ~7% per added second and a 0.1s mobile speedup can lift retail conversions ~8%. An unoptimized WooCommerce 4.8.3 build almost certainly underperforms here.
- **WhatsApp is the highest-open owned channel.** Marketing sources (e.g. Trengo) cite WhatsApp open rates near 98% vs ~20% for email — a strong argument for WhatsApp-based ordering and marketing automation.
- **Reservations are going digital.** TheFork Insights 2024 (Country Manager Carlo Carollo): "In Italia, la piattaforma ha portato 23 milioni di consumatori nei ristoranti" in 2024, with Japanese cuisine at 6% of bookings. Harù has no online booking at all.
- **Meal vouchers are newly attractive to merchants.** Under Art. 36/37 of the Ddl Concorrenza (approved Dec 2024), from 1 September 2025 meal-voucher commissions to merchants are capped at 5% of nominal value (previously up to ~20%) — making digital buoni pasto acceptance a low-cost add-on worth selling in.

## Details

### 1. Website & e-commerce audit
**Main site (`www.harurestaurant.it`):** A brochure site listing ~13 restaurants across Lombardy, Piedmont and Liguria (Mozzate, Milano Corso Sempione, Milano Baggio, Oggiono, Berbenno di Valtellina, Opera, Darfo Boario Terme, Madone, Romagnano Sesia, Como, Abbiategrasso, Leini, Cairo Montenotte). The "Take Away" page is the routing hub but routes inconsistently (subdomains vs PDFs vs a dead link). Copy still references being present "in 9 Province" while listing more — a sign of unmaintained content.

**Valtellina e-commerce (`valtellina.harurestaurant.it`):** A full WooCommerce store with ~20 categories (Nigiri, Uramaki [38 products], Sashimi, Tartare, Temaki, Teppanyaki, etc.) plus wine/beer/drinks, a Wishlist feature, account login/registration, and "Quick View." Zone routing is by the customer manually picking a restaurant/subdomain — there is no geolocation or postcode router. Each zone is a separate store with its own prices and menu, so the experience is coherent within a zone but fragmented across the brand.

**Ordering flow & friction points:**
- Catalog is functional but visually dated; reliance on numbered dish codes.
- Placeholder images on some products undermine the "sushi di qualità" positioning.
- €50 delivery minimum (net of discounts) is a major conversion barrier.
- Checkout offers PayPal/cash/Bancomat only; no wallets, no saved cards, no express checkout.
- No customer-facing order tracking/ETA (vs Poke House's live tracking).

### 2. Payments — gaps and opportunities
Current: PayPal (also cards), cash on delivery/pickup, in-person Bancomat. Missing and sellable: **Satispay** (very popular in Italy with a vast merchant network, low merchant friction, strong with younger diners), **Apple Pay / Google Pay**, **saved cards via a modern gateway** (Stripe or Nexi/XPay), and **digital meal-voucher (buoni pasto) acceptance** (now commission-capped at 5%). Adding one-tap wallets and Satispay directly attacks checkout abandonment.

### 3. Website improvement opportunities (concrete, sellable)
- **Security & platform:** migrate off WooCommerce 4.8.3 to a current, supported, hardened stack.
- **Performance:** image compression/WebP, lazy-loading, CDN, caching — tied to the conversion stats above.
- **Local SEO:** claim/optimize a Google Business Profile per location; consistent NAP; per-location landing pages; Restaurant/LocalBusiness + Menu JSON-LD; review-generation flow (food sentiment is already positive).
- **UX/mobile:** modern responsive redesign, visual menu with professional photography, clearer merchandising of the pickup/delivery discounts.
- **Multilingual:** proper IT/EN (relevant for tourist traffic in Valtellina).
- **Conversion:** reconsider or tier the €50 delivery minimum; add upsell/cross-sell, guest checkout, express wallets.
- **Reservations:** add table booking (own widget or TheFork integration).

### 4. Extra services / upsell menu (the recurring-revenue core of the pitch)
- **Branded ordering app (iOS/Android):** unified across all zones, push notifications, repeat/reorder, loyalty built in. Business case = commission avoidance + data ownership; benchmark against Poke House and NIMA Sushi.
- **Loyalty/rewards + CRM:** points, "free dish after N orders," birthday offers; centralizes the customer database the platforms currently own.
- **Marketing automation (email/SMS/WhatsApp):** WhatsApp's ~98% open rate makes it the hero channel for order confirmations, win-back and promotions.
- **Direct-channel migration program:** first-order discounts and in-pack QR codes to shift volume off Glovo/Deliveroo; the discount cost is far below platform commission.
- **Reservations/table management, social media management, content/photography, and AI/WhatsApp ordering** as add-on retainers.

### 5. Commission savings — the headline number for owners
On marketplace orders Harù loses roughly **20–35%** of order value to commissions and fees (and, per UBRI, the total retained can exceed 50% once promotions and fees are added). Illustratively, a location doing ~€8,000/month of platform delivery at a 28% blended take loses about €2,240/month — ~€26,880/year — per location, money that leaves the business permanently. Shifting even half of that volume to an owned app/site at near-zero commission funds the entire digital program quickly, and Harù keeps the customer data. This is the slide that makes a sole proprietor act.

## Recommendations

**Stage 1 — Quick wins (first 30–60 days, low cost, high "act now" value):**
- Emergency platform/security update off WooCommerce 4.8.3; backups and monitoring.
- Add Satispay + Apple Pay/Google Pay + saved cards (Stripe or Nexi/XPay); enable digital buoni pasto; reconsider the €50 delivery minimum.
- Claim/optimize Google Business Profiles for all ~13 locations; add Restaurant/LocalBusiness + Menu structured data; fix the broken "Take Away" links and convert PDF-only locations to real ordering.
- *Threshold to escalate to Stage 2:* if quick wins lift direct-order conversion or the owners engage, proceed to the rebuild.

**Stage 2 — Unified website & multi-zone e-commerce rebuild:**
- One modern, fast, responsive brand site with a true zone router (geolocation/postcode), consistent design, professional photography, visual menu, multilingual, a single account layer across zones, and customer order tracking.
- Bring all locations onto the same ordering platform (retire the PDF flyers).
- *Threshold to escalate to Stage 3:* once direct ordering is consolidated and measurable, layer on retention tools.

**Stage 3 — Recurring-revenue upsells (the agency's annuity):**
- Branded ordering app with loyalty; CRM + email/SMS/WhatsApp automation; direct-channel migration campaign; reservations; ongoing social/content retainer.
- Benchmark KPIs: % of orders on owned channels vs platforms, repeat-order rate, app downloads, loyalty enrollment, cost-per-retained-customer vs platform commission.

**How to arm the gatekeeper manager:** give them a one-page leave-behind led by (1) the WooCommerce 4.8.3 security/obsolescence flag, (2) the per-location commission-loss euro figure with the Ferrieri/UBRI "supera il 50%" quote, and (3) the Poke House/NIMA "competitors already have apps" comparison. These three are concrete, owner-friendly, and forwardable.

## Caveats
- The live checkout payment radio buttons could not be rendered (empty-cart redirect); the payment list is taken from Harù's authoritative Terms & Conditions and may differ slightly from the live populated checkout. The exact payment-gateway plugin slug was not confirmable from script paths.
- Commission percentages are ranges from Italian press/industry sources (2019–2026) and are negotiated per restaurant; chains often secure better rates than headline figures, so the €/year savings example is illustrative, not Harù's actual contract.
- Review counts/ratings (Google ~4.4/5 for Valtellina; ~750–800 reviews) vary by aggregator and date; treat as directional.
- The "ordering-enabled vs PDF-only" location split is based on the Take Away hub as crawled; Harù may have additional or changed subdomains not linked there.
- The WooCommerce version is read from the meta generator tag; given its consistency across properties it is reliable, but a masking layer cannot be 100% excluded.