# Pravopisný tréner — mäkké i / tvrdé y

Interaktívna hra na precvičovanie slovenského pravopisu i/í a y/ý pre deti.
Jediný súbor `pravopisny-trener.html` — žiadna inštalácia, žiadne závislosti,
žiadne sieťové volania. Beží offline priamo z disku.

---

## Verzie

| Verzia | Dátum | Zmeny |
|--------|------------|-------|
| v2.0 | 2026-07-18 | Tlačidlá odpovede výslovne ukazujú aj dlhé varianty: „i (í)" a „y (ý)" s popisom „mäkké/tvrdé — aj dlhé". Viditeľné označenie „verzia 2" na domovskej obrazovke. Verzia v exporte štatistík zvýšená na 2.0. Slovník bez zmeny. |
| v1.0 | 2026-07-18 | Prvé vydanie: 3 režimy, 245 položiek, adaptívny výber, štatistiky, export/import, zvuky, konfety. |

---

## Spustenie

1. Stiahni `pravopisny-trener.html`.
2. Otvor ho dvojklikom v ľubovoľnom modernom prehliadači (Safari, Chrome,
   Firefox, Edge) — aj na iPade.
3. Hotovo. Aplikácia funguje úplne offline.

> **Poznámka k náhľadu v Claude:** v náhľade artefaktu nefunguje trvalé
> ukladanie (localStorage) ani dialógové okná. Plná funkčnosť je až po
> stiahnutí a otvorení súboru lokálne.

---

## Herné režimy

| Režim | Popis | Zásoba |
|-------|-------|--------|
| 📝 **Doplňovačka** | Klasika: doplň i/y do slova alebo vety, dĺžeň sa doplní automaticky. Pri chybe sa zobrazí správny tvar + pravidlo a pokračuje sa až po potvrdení (dieťa si vysvetlenie prečíta). | všetkých 245 položiek |
| 🚀 **Padajúce slová** | Slovo padá z neba; treba stihnúť odpovedať, kým dopadne. 3 životy, rýchlosť sa postupne zvyšuje (8 s → min. 3,5 s; −0,35 s za každé 3 správne). | 186 slov (bez viet) |
| 🔍 **Nájdi chybu** | Vo vete je jedno i/y naschvál vymenené. Dieťa naň klepne. | 56 viet (vety s ≥ 2 výskytmi i/y) |

Ovládanie klávesnicou: **i** / **y** = odpoveď, **Enter** = ďalej.

Tlačidlo **i (í)** platí pre krátke i aj dlhé í, tlačidlo **y (ý)** pre krátke
y aj dlhé ý — správnu dĺžku doplní aplikácia sama. Slovník obsahuje všetky
štyri varianty.

---

## Adaptívny výber slov

Každá položka má váhu, podľa ktorej sa žrebuje do kola (vážený výber bez
opakovania):

| Situácia | Váha |
|----------|------|
| Nové, ešte nevidené slovo | **1,3** |
| Po chybe | ×3 (strop **30**) |
| Po správnej odpovedi | ×0,6 (dno **0,35**) |

Slovo, v ktorom dieťa opakovane chybuje, sa tak vracia mnohonásobne častejšie;
dobre zvládnuté slová sa objavujú zriedkavo, ale nikdy nezmiznú úplne.

---

## Kategórie a počty (spolu 245)

| Kategória | Počet | Poznámka |
|-----------|------:|----------|
| Vybrané po B / M / P / R / S / V / Z | 16/16/12/20/12/16/8 | podľa školského zoznamu; pri V aj predpona vy-/vý- |
| Tvrdé spoluhlásky → y | 24 | h, ch, k, g, d, t, n, l (lyže, mlyn — L je tvrdá) |
| Mäkké spoluhlásky → i | 15 | c, dz, j, č, dž, š, ž |
| Mäkké di, ti, ni, li | 15 | d/t/n/l vyslovené mäkko → i (divadlo, ticho, list) |
| Mäkké i po obojakých | 15 | chytáky: obilie, misa, sila, zima… |
| Zradné dvojice | 17 | byť/biť, dobyť/dobiť, my/mi, výr/vír, vyť/viť, bydlo/bidlo, víla/vyla, rým/Rím + sirup |
| Gramatické koncovky | 42 | pekní/pekný, chlapi/duby/psy, oni/ony, sami/samy, radi/rady, siedmi/siedmy, -li v minulom čase, ulici/kosti/mamy… |
| Cudzie slová a výnimky | 17 | fyzika, cyklista vs. kino, gitara, diktát; zvukomalebné; predpony od-/pred- |

Kategórie sa dajú na domovskej obrazovke ľubovoľne kombinovať; posuvník počtu
slov má minimum 10 a maximum podľa aktuálneho výberu.

---

## Ukladanie dát

- Štatistiky: kľúč `pt_stats_v1`, nastavenia: `pt_settings_v1` v **localStorage**
  prehliadača. Dáta sú viazané na konkrétny prehliadač a profil na danom
  zariadení.
- Ak localStorage nie je dostupné (napr. náhľad, prísny privátny režim),
  aplikácia beží ďalej s dočasnou pamäťou (dáta sa po zatvorení stratia).
- **Export/Import** v Štatistikách: JSON súbor `pravopisny-trener-stats.json`
  na zálohu alebo prenos pokroku medzi zariadeniami.
- „Vymazať" zmaže štatistiky po potvrdení; slovník ostáva nedotknutý.

---

## Ako pridať alebo upraviť slová

Slovník je v súbore medzi značkami `/*DICT-START*/` a `/*DICT-END*/`.
Formát položky:

```js
{id:'vb01', t:'w', x:'b_k', a:'ý', c:'vb', e:'vybrané slovo po B', m:'🐂'}
```

| Pole | Význam |
|------|--------|
| `id` | jedinečný identifikátor (viaže sa naň štatistika) |
| `t`  | `'w'` slovo / `'s'` veta |
| `x`  | text s **presne jedným** podčiarkovníkom `_` na mieste i/y |
| `a`  | správne písmeno: `i`, `í`, `y`, `ý` (dĺžeň rieši aplikácia) |
| `c`  | kód kategórie (`vb vm vp vr vs vv vz tv mk dl ob pr gr cu`) |
| `e`  | krátke vysvetlenie pravidla (zobrazí sa pri odpovedi) |
| `m`  | voliteľné emoji |
| `w`  | pri vetách: cieľové slovo (pre zoznamy chýb a štatistiky) |

Po pridaní netreba nič prepočítavať — počty, posuvník aj režimy sa prispôsobia
automaticky. Vety s aspoň 2 výskytmi i/y sa automaticky zaradia aj do režimu
„Nájdi chybu".

---

## Overenie obsahu (zdroje)

Slovník a pravidlá boli pri tvorbe overené proti verejným školským zdrojom:

- Zoznamy vybraných slov po B, M, P, R, S, V, Z — eduworld.sk (študijný
  materiál pre 3.–9. ročník ZŠ), krížovo viemeposlovensky.sk a doucma.sk.
- Klasifikácia spoluhlások (tvrdé h, ch, k, g, d, t, n, **l**; mäkké c, dz, j,
  ď, ť, ň, ľ, č, dž, š, ž; obojaké b, m, p, r, s, v, z, f) a pravidlo
  di/ti/ni/li podľa výslovnosti — jazyková poradňa SME (JÚĽŠ SAV), eductify.com.
  Pozn.: „lyže, mlyn, plyn" preto nie sú vybrané slová — L je tvrdá spoluhláska.
- Cudzie výnimky (kino, gitara, diktát, história, kilo- vs. fyzika, cyklista),
  zvukomalebné slová a predpony od-/pred- — eductify.com.
- Gramatické koncovky (vzor pekný: N pl. mužský životný → í; I pl. → -ými;
  oni/sami/radi vs. ony/samy/rady; siedmi/siedmy; Katkini; minulý čas vždy -li)
  — školské prehľady vzorov prídavných mien a zámen.

---

## Hygiena a súkromie

- Súbor neobsahuje žiadne osobné ani citlivé údaje.
- Nevykonáva žiadne sieťové volania; všetko (zvuky, grafika, dáta) je vnorené.
- Jediné zapisované dáta sú lokálne štatistiky hráča v prehliadači.

<!-- v2.0 (2026-07-18) — koniec súboru -->
