# build_web.py — README

Build skript projektu **Pravopisný tréner**. Z master súboru
`pravopisny-trener.html` (komentovaný zdroj) generuje kompletnú webovú
distribúciu a jednosúborovú offline verziu.

## Verzie

| Verzia | Dátum | Zmeny |
|--------|------------|-------|
| v1.2 | 2026-11-04 | Bezpečný zápis: build ide do `dist.build-tmp/`, QA beží tam a `dist/` sa nahradí až po úspechu — pri chybe ostáva predchádzajúci `dist/` nedotknutý. Kontrola Pillow a Node.js hneď na začiatku. Obnova `dist/` po prerušenom behu. |
| v1.1 | 2026-10-19 | `VER = "6.1"`, `DATE` = dátum vydania 6.1. Oprava: pätička webu (offline verzia, podmienky, kontakt) sa vkladá pri ľubovoľnom texte verzie a build zlyhá, ak značka chýba — predtým zmena verzie pätičku potichu vynechala. |
| v1.0 | 2026-08-04 | Prvé vydanie: generovanie `dist/` (web + PWA + podmienky + hlavičky + ikony + offline verzia) s QA kontrolami. |

## Použitie

```bash
python3 build_web.py
```

Vyžaduje: Python 3, Node.js (syntaktická kontrola JS), Pillow (ikony).
Oboje sa kontroluje hneď na začiatku, ešte pred zápisom čohokoľvek.
Žiadne sťahovanie z internetu, žiadne ďalšie závislosti.

## Čo skript robí

1. Overí verziu mastera a počet položiek slovníka (245).
2. Odstráni komentáre (HTML `<!-- -->`, CSS/JS `/* */`, celé riadky `//`)
   — bezpečne, zdroj neobsahuje tieto sekvencie v reťazcoch.
3. Zostaví výstup do dočasného priečinka `dist.build-tmp/`:
   - `index.html`, `app.css`, `app.js` — web bez komentárov; oddelené
     súbory umožňujú CSP bez `unsafe-inline`; do `app.js` sa pridá
     registrácia service workera (len https/localhost),
   - `sw.js`, `manifest.webmanifest`, `icons/` — PWA a offline režim,
   - `podmienky.html` — podmienky použitia, súkromie, kontakt, návod
     na offline používanie,
   - `_headers` — bezpečnostné hlavičky pre Cloudflare Pages (CSP, HSTS,
     nosniff, COOP/CORP, Permissions-Policy…),
   - `robots.txt`,
   - `pravopisny-trener-offline.html` — jednosúborová verzia bez
     PWA prvkov, beží z disku bez internetu.
4. QA: `node --check` na `app.js` a `sw.js`; kontrola, že výstupy
   neobsahujú inline štýly ani komentáre; offline verzia neobsahuje
   manifest/SW; súpis veľkostí a placeholderov.
5. Až keď všetko prejde, nahradí `dist/` novou verziou. Pri akejkoľvek
   chybe (chýbajúci Pillow/Node.js, zlyhaná kontrola) sa dočasný priečinok
   zmaže a **`dist/` ostáva bez zmeny** — nikdy nezostane polovičný.

## Placeholdery (nahradiť pred nasadením)

- `KONTAKT@VASA-DOMENA.SK` — kontaktná adresa (index + podmienky)
- `https://github.com/VAS-UCET/pravopisny-trener` — odkaz na repo
- `https://VASA-DOMENA.SK` — doména (informačne)

## Hygiena

Výstup neobsahuje žiadne citlivé údaje, IP adresy, mená ani interné
identifikátory; kontaktné údaje sú výhradne placeholdery určené na ručné
nahradenie. Skript nevykonáva žiadne sieťové volania.

<!-- v1.2 (2026-11-04) — koniec súboru -->
