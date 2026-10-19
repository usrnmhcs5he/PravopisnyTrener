<!--
  CLAUDE.md — kontext projektu pre Claude Code
  VERSION HISTORY
  v1.0 (2026-10-19) — prvé vydanie: stav projektu v6.0, pravidlá práce,
                      otvorené úlohy pre v7, plán nasadenia na Cloudflare.
-->

# Pravopisný tréner — kontext pre Claude Code

Bezplatná detská hra na precvičovanie slovenského pravopisu (mäkké i / tvrdé y).
Komunikácia s vlastníkom repa prebieha **po slovensky**, výstupy (texty v appke,
README) sú po slovensky.

## Stav: v6.0 (2026-08-04)

| Súbor | Úloha |
|---|---|
| `pravopisny-trener.html` | **Master / zdroj pravdy.** Komentovaný, s históriou verzií v hlavičke. Všetky zmeny hry sa robia len tu. |
| `build_web.py` | Build skript (v1.0). `python3 build_web.py` → pregeneruje `dist/`. Vyžaduje Python 3, Node.js (syntax check), Pillow (ikony). |
| `dist/` | Vygenerované nasadenie pre Cloudflare Pages + offline verzia. **Needitovať ručne** — vždy pregenerovať buildom. Je commitnuté zámerne, aby Pages nepotreboval build krok. |
| `README.md` | Hlavné README projektu (v6.0). |
| `build_web_README.md` | Párové README k build skriptu (v1.0). |

Obsah hry: 245 položiek v 14 kategóriách, 3 režimy (Doplňovačka, Padajúce slová,
Nájdi chybu), adaptívne váhy (nové 1,3 / chyba ×3 max 30 / správne ×0,6 min 0,35),
Vysvetlivky s vyhľadávaním, žiarovka 💡, trofeje a easter eggy (Ypsilonový/Íčkový
špekulant → odomkne Nočný zošit), localStorage s in-memory fallbackom.

## Pravidlá práce (záväzné)

1. **Verzovanie:** každý kódový súbor má históriu verzií na začiatku a komentár
   s verziou na konci; pri každej zmene verzia +1. Pri zmene mastera zvýšiť aj
   `ver:` v exporte štatistík, text `verzia N` na domovskej obrazovke a `VER`
   v `build_web.py` (ten kontroluje, že master je vo verzii `VER`).
2. **README v páre:** pri každej zmene skriptu/súboru dodať aktualizované README.
3. **Hygiena pre GitHub:** žiadne citlivé údaje (IP, hostnames, e-maily, tokeny,
   identifikátory) v kóde ani vo výstupe skriptov. Kontaktné údaje len ako
   placeholdery (pozri nižšie).
4. **Bezpečnosť webu:** žiadny inline `style="..."`, žiadny inline skript, žiadne
   tretie strany — `_headers` vynucuje CSP `default-src 'none'; script-src 'self';
   style-src 'self'`. Build to kontroluje; nesmie sa to porušiť.
5. **Presnosť obsahu:** pravopisné pravidlá overovať v zdrojoch, neodhadovať.
   L je v slovenčine tvrdá spoluhláska (lyže, mlyn ≠ vybrané slová).
6. **Pred inštaláciou balíkov / sťahovaním z internetu** predložiť zoznam
   krokov na schválenie.
7. **Commity a PR:** bez riadkov „Generated with Claude Code", bez
   `Co-Authored-By` a bez odkazov na session/účet.
8. Po každej zmene: `python3 build_web.py` musí prejsť (`BUILD OK`).

## Placeholdery (nahradiť pred ostrým spustením webu)

- `KONTAKT@VASA-DOMENA.SK` — kontaktný e-mail (v `build_web.py` → `PH_EMAIL`)
- `https://github.com/VAS-UCET/pravopisny-trener` — URL repa (`PH_GITHUB`)
- `https://VASA-DOMENA.SK` — doména (`PH_DOMAIN`)

Meniť ich v `build_web.py`, nie v `dist/`, a potom pregenerovať.

## Otvorené úlohy — v7 (rozpracované, NEIMPLEMENTOVANÉ)

### A) Filter vo Vysvetlivkách — rozhodnuté
Rad čipov nad vyhľadávaním: „Všetko", „Vybrané spolu" (všetkých 7 kategórií
vb–vz), potom jednotlivo B/M/P/R/S/V/Z a ostatné kategórie. Jedno klepnutie,
kombinovateľné s vyhľadávaním.

### B) Pamäťovky na vybrané slová — čiastočne rozhodnuté
- Formát: **oba** — príbehová veta aj rýmované dvojveršie pre každé písmeno.
- Zvýraznenie: **vybrané slová tučne + písmeno y/ý oranžovo** (`.hl-y`).
- Obsah musí byť **vlastný** (nie prebraté školské riekanky — autorské práva).
- Pravidlo čistoty: každé i/y po obojakej spoluhláske vo vete je výhradne
  vybrané slovo s y; veta nesmie obsahovať žiadne iné obojaká+i (napr. „kúpil",
  „si", „kŕmi").
- **Umiestnenie NIE JE rozhodnuté.** Vlastník chce najprv rozobrať, aký je cieľ,
  aby sa to neprekomplikovalo. Navrhnuté možnosti: karta nad kategóriou vo
  Vysvetlivkách / samostatná obrazovka v menu / v žiarovke / na výsledkoch pri
  chybách. Pred implementáciou sa opýtať.

Navrhnuté príbehové vety (overené na pravidlo čistoty):
1. B: Bystrý býk býva v Bytči a jeho kobyla stráži dobytok v obyčajnom byte.
2. M: My myslíme, že myš z Myjavy umýva mydlom mýto.
3. P: Pyšný pytliak v pyžame sa pýta, či bude za pýchu pykať.
4. R: Ryšavý rytier rýchlo ryje rýľom skrýšu, kým korytnačka žerie bryndzu s ryžou.
5. S: V sychravé ráno sýty syseľ sype syr syčiacej sýkorke.
6. V: Vysoký výr výska, vydra zavýja a vyžla má zvyk vykať.
7. Z: Dlhý jazyk sa vždy ozýva, každého pozýva a vyzýva — preto má prezývku Jazýček.

Ukážky dvojverší (sadu pre všetkých 7 písmen ešte treba dopísať a overiť):
- R: „Ryšavý rytier rýľom ryl, / bryndzu s ryžou v skrýši skryl."
- B: „V Bytči býva bystrý býk, / obyčaj má — starý zvyk."

## Ďalší krok po v7 — nasadenie na Cloudflare Pages

1. Repo na GitHube (verejné).
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → toto repo.
   Framework preset: None. Build command: prázdny. Build output directory: `dist`.
3. Custom domain na Pages projekte.
4. Bezpečnosť **neskôr** (vlastník to odložil): DNSSEC, SSL Full (strict),
   Always Use HTTPS, min. TLS 1.2, Bot Fight Mode, WAF free managed ruleset;
   HSTS už posiela `_headers` (preload zatiaľ nie).
5. Analytika: zatiaľ žiadna (rozhodne sa neskôr — kandidáti: CF Web Analytics
   alebo len serverové metriky CF). Kontaktný formulár zatiaľ nie je — kontakt
   je čistý text.

<!-- v1.0 (2026-10-19) — koniec súboru -->
