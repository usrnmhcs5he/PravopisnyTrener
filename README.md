# Pravopisný tréner

**Pravopisný tréner** je interaktívna hra na precvičovanie slovenského pravopisu
i/í a y/ý pre deti. Celá aplikácia je jediný súbor `pravopisny-trener.html` —
bez inštalácie, bez závislostí, bez sieťových volaní. Beží offline priamo z disku.

## Hlavné funkcie

- **3 herné režimy** — Doplňovačka, Padajúce slová a Nájdi chybu.
- **245 položiek** v 14 kategóriách, ktoré sa dajú ľubovoľne kombinovať.
- **Adaptívny výber** — slová, v ktorých dieťa chybuje, sa vracajú častejšie.
- **📖 Vysvetlivky** — slovník všetkých položiek s pravidlom a vyhľadávaním
  bez ohľadu na diakritiku.
- **💡 Žiarovka** — prehľad „Prečo i/y?" s poslednými slovami a správami.
- **🏆 Trofeje a easter eggy**, štatistiky, zvuky, konfety a téma 🌙 Nočný zošit.
- **Export/import** pokroku do JSON (záloha, prenos medzi zariadeniami).

## Požiadavky

Ľubovoľný moderný prehliadač (Safari, Chrome, Firefox, Edge), aj na iPade.
Nič sa neinštaluje.

## Spustenie

1. Stiahni `pravopisny-trener.html`.
2. Otvor ho dvojklikom v prehliadači.
3. Hotovo — aplikácia funguje úplne offline.

> **Poznámka:** v náhľade artefaktu v Claude nefunguje trvalé ukladanie
> (localStorage) ani dialógové okná. Plná funkčnosť je až po lokálnom otvorení.

Ovládanie klávesnicou: **i** / **y** = odpoveď, **Enter** = ďalej.

## Herné režimy

| Režim | Popis | Zásoba |
|-------|-------|--------|
| 📝 **Doplňovačka** | Doplň i/y do slova alebo vety; pri chybe sa ukáže správny tvar + pravidlo a pokračuje sa po potvrdení. | všetkých 245 položiek |
| 🚀 **Padajúce slová** | Slovo padá z neba, treba stihnúť odpovedať. 3 životy, rýchlosť rastie (8 s → min. 3,5 s; −0,35 s za každé 3 správne). | 186 slov (bez viet) |
| 🔍 **Nájdi chybu** | Vo vete je jedno i/y naschvál vymenené — dieťa naň klepne. | 56 viet (s ≥ 2 výskytmi i/y) |

Tlačidlo **i (í)** platí pre krátke aj dlhé í, tlačidlo **y (ý)** pre krátke aj
dlhé ý — správnu dĺžku doplní aplikácia sama.

### 📖 Vysvetlivky

Slovník všetkých položiek zoskupený podľa kategórií. Písmeno je farebne
zvýraznené (tyrkysové = mäkké i/í, oranžové = tvrdé y/ý) a pri každej položke je
pravidlo. Vyhľadávanie ignoruje diakritiku aj veľkosť písmen („byk" nájde „býk").

### 💡 Žiarovka

Je v hornej lište každého režimu a otvorí „Prečo i/y?":

- **Posledné slová v kole** — zodpovedané položiek (✅/❌), plný tvar a pravidlo.
- **Posledné správy** — log achievementov a sovích odkazov z aktuálneho sedenia.

V arkáde sa počas otvorenej žiarovky padanie pozastaví. Zatvorí sa cez ✕,
klepnutie mimo karty, Enter alebo Escape; klávesy i/y vtedy neodpovedajú.

## Adaptívny výber slov

Každá položka má váhu, podľa ktorej sa žrebuje do kola (vážený výber bez
opakovania):

| Situácia | Váha |
|----------|------|
| Nové, ešte nevidené slovo | **1,3** |
| Po chybe | ×3 (strop **30**) |
| Po správnej odpovedi | ×0,6 (dno **0,35**) |

Zvládnuté slová sa objavujú zriedkavo, ale nikdy nezmiznú úplne.

## Kategórie (spolu 245)

| Kategória | Počet | Poznámka |
|-----------|------:|----------|
| Vybrané po B / M / P / R / S / V / Z | 16/16/12/20/12/16/8 | podľa školského zoznamu; pri V aj vy-/vý- |
| Tvrdé spoluhlásky → y | 24 | h, ch, k, g, d, t, n, l (lyže, mlyn) |
| Mäkké spoluhlásky → i | 15 | c, dz, j, č, dž, š, ž |
| Mäkké di, ti, ni, li | 15 | d/t/n/l vyslovené mäkko → i |
| Mäkké i po obojakých | 15 | chytáky: obilie, misa, sila, zima… |
| Zradné dvojice | 17 | byť/biť, my/mi, výr/vír, rým/Rím… |
| Gramatické koncovky | 42 | pekní/pekný, chlapi/duby, oni/ony, -li v minulom čase… |
| Cudzie slová a výnimky | 17 | fyzika, cyklista vs. kino, gitara, diktát… |

Posuvník počtu slov má minimum 10 a maximum podľa aktuálneho výberu.

## 🏆 Trofeje a easter eggy

> Pozor — spoilery pre deti. Tajné trofeje sú v Štatistikách zobrazené ako „🔒 ???".

| Trofej | Ako sa získa |
|--------|--------------|
| 🕵️ Ypsilonový špekulant *(tajná)* | Kolo, v ktorom je každá odpoveď tvrdé y. |
| 🪶 Íčkový špekulant *(tajná)* | Zrkadlový trik: všetko mäkké i. |
| 🔥 Séria 10 / 🚀 Séria 20 | 10 / 20 správnych odpovedí v rade. |
| 💯 Perfektné kolo | Kolo (aspoň 15 slov) bez jedinej chyby. |
| 🦉 Sovia reč *(tajná)* | 25 klepnutí na sovu na domovskej obrazovke. |

Špekulantské kolá:

- Detekcia je generická — kontroluje sa, či **celá zásoba kola** patrí jednej
  strane (y/ý alebo i/í), nie konkrétny zoznam kategórií.
- Prvý objav natrvalo **odomkne tému 🌙 Nočný zošit**.
- Váhy slov sa pri správnych odpovediach v takom kole **neznižujú** (nedá sa
  „vyfarmiť"); chyby sa počítajú plne. Trofeje Séria a Perfektné kolo sa v nich
  nezapočítavajú.
- Trofeje a stav témy sú súčasťou exportu/importu.

## Ukladanie dát

- Štatistiky: `pt_stats_v1`, nastavenia: `pt_settings_v1` v **localStorage**
  (viazané na konkrétny prehliadač a profil).
- Bez localStorage (náhľad, prísny privátny režim) aplikácia beží s dočasnou
  pamäťou.
- **Export/Import** v Štatistikách: `pravopisny-trener-stats.json`.
- „Vymazať" zmaže štatistiky po potvrdení; slovník ostáva nedotknutý.

## Ako pridať alebo upraviť slová

Slovník je medzi značkami `/*DICT-START*/` a `/*DICT-END*/`:

```js
{id:'vb01', t:'w', x:'b_k', a:'ý', c:'vb', e:'vybrané slovo po B', m:'🐂'}
```

| Pole | Význam |
|------|--------|
| `id` | jedinečný identifikátor (viaže sa naň štatistika) |
| `t`  | `'w'` slovo / `'s'` veta |
| `x`  | text s **presne jedným** `_` na mieste i/y |
| `a`  | správne písmeno: `i`, `í`, `y`, `ý` |
| `c`  | kód kategórie (`vb vm vp vr vs vv vz tv mk dl ob pr gr cu`) |
| `e`  | krátke vysvetlenie pravidla |
| `m`  | voliteľné emoji |
| `w`  | pri vetách: cieľové slovo (pre zoznamy chýb a štatistiky) |

Počty, posuvník aj režimy sa prispôsobia automaticky. Vety s aspoň 2 výskytmi
i/y sa zaradia aj do režimu „Nájdi chybu".

## Overenie obsahu

Slovník a pravidlá boli overené proti verejným školským zdrojom:

- Vybrané slová po B, M, P, R, S, V, Z — eduworld.sk, viemeposlovensky.sk, doucma.sk.
- Klasifikácia spoluhlások a pravidlo di/ti/ni/li — jazyková poradňa SME
  (JÚĽŠ SAV), eductify.com. „lyže, mlyn, plyn" nie sú vybrané slová — L je tvrdá.
- Cudzie výnimky, zvukomalebné slová, predpony od-/pred- — eductify.com.
- Gramatické koncovky (vzor pekný, oni/ony, sami/samy, siedmi/siedmy, minulý
  čas -li) — školské prehľady vzorov.

## Súkromie

Súbor neobsahuje osobné údaje, nevolá žiadnu sieť a všetko (zvuky, grafika,
dáta) je vnorené. Zapisujú sa len lokálne štatistiky hráča v prehliadači.

## Verzie

| Verzia | Dátum | Zmeny |
|--------|------------|-------|
| v5.0 | 2026-07-26 | Dlhšie zobrazenie achievementov a sovích oznámení; 💡 žiarovka vo všetkých režimoch (v arkáde pozastaví padanie); trvalý mini-návod na domovskej obrazovke; väčšie medzery v režime Nájdi chybu. |
| v4.0 | 2026-07-18 | Easter eggy a trofeje: špekulantské výbery (čisto-Y aj čisto-I), odomknutie témy 🌙 Nočný zošit, ochrana váh, trofeje Séria 10/20 a Perfektné kolo, interaktívna sova, trofejná polička. |
| v3.0 | 2026-07-18 | Obrazovka „📖 Vysvetlivky": slovník 245 položiek podľa kategórií, vyhľadávanie, farebné zvýraznenie i/y a pravidlá. |
| v2.0 | 2026-07-18 | Tlačidlá „i (í)" a „y (ý)" s popisom mäkké/tvrdé; označenie verzie 2 na domovskej obrazovke; verzia exportu 2.0. |
| v1.0 | 2026-07-18 | Prvé vydanie: 3 režimy, 245 položiek, adaptívny výber, štatistiky, export/import, zvuky, konfety. |
