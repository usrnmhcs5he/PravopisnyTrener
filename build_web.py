#!/usr/bin/env python3
# =====================================================================
#  build_web.py — Pravopisný tréner: build webovej a offline distribúcie
# =====================================================================
#  VERSION HISTORY
#  v1.1 (2026-10-19)
#    - VER = 6.1 (master v6.1: sanitizacia importu statistik).
#    - Oprava: patička webu sa vkladala len pri presnom texte
#      "verzia 6"; teraz regex na lubovolnu verziu + assert, aby
#      zmena verzie patičku potichu nevyradila.
#  v1.0 (2026-08-04)
#    - Prvé vydanie. Z master súboru pravopisny-trener.html generuje:
#        dist/index.html                     (web, bez komentárov)
#        dist/app.css, dist/app.js           (oddelené kvôli prísnemu CSP)
#        dist/sw.js, dist/manifest.webmanifest  (PWA / offline)
#        dist/podmienky.html                 (podmienky + súkromie + kontakt)
#        dist/_headers                       (bezpečnostné hlavičky CF Pages)
#        dist/robots.txt
#        dist/icons/ (SVG + PNG 512/192/180) (ikony generované cez Pillow)
#        dist/pravopisny-trener-offline.html (jednosúborová offline verzia)
#    - QA: node --check na app.js a sw.js, kontrola nulových inline
#      štýlov, kontrola počtu položiek slovníka, súpis placeholderov.
#    - Hygiena: výstup neobsahuje žiadne citlivé údaje; kontaktné a
#      doménové údaje sú výhradne placeholdery na ručné nahradenie.
# =====================================================================

import re, os, sys, subprocess, shutil

MASTER = "pravopisny-trener.html"
DIST = "dist"
VER = "6.1"
DATE = "2026-10-19"

# ------------------------------------------------------------------ #
#  Placeholdery — pred nasadením nahradiť skutočnými hodnotami        #
# ------------------------------------------------------------------ #
PH_EMAIL = "KONTAKT@VASA-DOMENA.SK"
PH_DOMAIN = "https://VASA-DOMENA.SK"
PH_GITHUB = "https://github.com/VAS-UCET/pravopisny-trener"

# ------------------------------------------------------------------ #
#  Pomocné funkcie                                                    #
# ------------------------------------------------------------------ #

def strip_html_comments(t):
    return re.sub(r"<!--[\s\S]*?-->", "", t)

def strip_block_comments(t):
    # /* ... */ — bezpečné: zdroj neobsahuje tieto sekvencie v reťazcoch
    return re.sub(r"/\*[\s\S]*?\*/", "", t)

def strip_line_comments_js(t):
    # len celé riadky začínajúce //, nič v strede riadku (URL a pod.)
    return re.sub(r"(?m)^\s*//.*$", "", t)

def tidy(t):
    t = re.sub(r"[ \t]+$", "", t, flags=re.M)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip() + "\n"

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("CHYBA:", " ".join(cmd))
        print(r.stdout, r.stderr)
        sys.exit(1)

# ------------------------------------------------------------------ #
#  1) Načítanie a rozobratie mastera                                  #
# ------------------------------------------------------------------ #
src = open(MASTER, encoding="utf-8").read()
assert ("v" + VER) in src, "Master nie je vo verzii " + VER

m_css = re.search(r"<style>([\s\S]*?)</style>", src)
m_js = re.search(r"<script>([\s\S]*)</script>", src)
assert m_css and m_js, "Nenájdený style/script blok"

css = tidy(strip_block_comments(m_css.group(1)))
js = tidy(strip_line_comments_js(strip_block_comments(m_js.group(1))))

dict_items = len(re.findall(r"\{id:'", js))
assert dict_items == 245, "Slovník nemá 245 položiek, má " + str(dict_items)

# ------------------------------------------------------------------ #
#  2) Offline jednosúborová verzia (bez komentárov)                   #
# ------------------------------------------------------------------ #
off = strip_html_comments(src)
off = off.replace(m_css.group(1), "\n" + css)
off = off.replace(m_js.group(1), "\n" + js)
off = tidy(off)
off = ("<!-- Pravopisný tréner v" + VER + "-offline (" + DATE + ") | "
       "jednosúborová verzia bez internetu | zdroj: " + PH_GITHUB + " -->\n"
       + off + "<!-- v" + VER + "-offline — koniec súboru -->\n")

# ------------------------------------------------------------------ #
#  3) Webový shell index.html                                          #
# ------------------------------------------------------------------ #
html = strip_html_comments(src)
html = html.replace("<style>" + m_css.group(1) + "</style>",
                    '<link rel="stylesheet" href="app.css">')
html = html.replace("<script>" + m_js.group(1) + "</script>",
                    '<script src="app.js" defer></script>')

head_extra = (
    '<meta name="description" content="Pravopisný tréner — bezplatná hra na '
    'precvičovanie mäkkého i a tvrdého y. Vybrané slová, gramatické koncovky, '
    'tri režimy, funguje aj offline.">\n'
    '<meta name="theme-color" content="#1E88A8">\n'
    '<link rel="manifest" href="manifest.webmanifest">\n'
    '<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">\n'
    '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
)
html = html.replace("<title>", head_extra + "<title>", 1)

FOOT = (
    '<div class="site-foot">\n'
    '        <a href="pravopisny-trener-offline.html" download="pravopisny-trener-offline.html">⬇️ Stiahnuť offline verziu</a>\n'
    '        <span class="dot">·</span>\n'
    '        <a href="podmienky.html">Podmienky použitia a súkromie</a>\n'
    '        <div class="foot-contact">Kontakt: ' + PH_EMAIL + "</div>\n"
    "      </div>"
)
# Pätička sa vkladá za riadok s verziou; text verzie sa berie z mastera,
# takže zmena verzie ju nevyradí. Chýbajúca značka = chyba buildu.
html, n_foot = re.subn(r'<div class="verline">(verzia [^<]+)</div>',
                       lambda m: '<div class="verline">' + m.group(1) + ' · web</div>\n      ' + FOOT,
                       html)
assert n_foot == 1, "Značka verline pre pätičku nenájdená (počet: " + str(n_foot) + ")"
index = tidy(html)

# ------------------------------------------------------------------ #
#  4) Webové doplnky CSS a JS                                          #
# ------------------------------------------------------------------ #
css_web = css + """
.site-foot{margin-top:14px;text-align:center;font-size:13.5px;color:var(--ink-soft);line-height:1.8;}
.site-foot a{color:var(--soft-deep);font-weight:700;text-decoration:none;}
.site-foot a:hover{text-decoration:underline;}
.site-foot .dot{margin:0 6px;}
body.night .site-foot a{color:#7FD2E8;}
a.chip-btn{display:inline-block;text-decoration:none;}
.legal h2{font-size:19px;margin:20px 0 6px;}
.legal p,.legal li{font-size:15.5px;line-height:1.6;}
.legal ul{padding-left:20px;}
"""

js_web = js + """
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")){
  window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js"); });
}
"""

# ------------------------------------------------------------------ #
#  5) Service worker, manifest, hlavičky, robots                       #
# ------------------------------------------------------------------ #
SW = """var C="pt-v""" + VER + """";
var A=["./","./index.html","./app.css","./app.js","./manifest.webmanifest","./podmienky.html","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./pravopisny-trener-offline.html"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(A);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(n){if(n!==C){return caches.delete(n);}}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"){return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    if(r){return r;}
    return fetch(e.request).then(function(res){
      var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return res;
    }).catch(function(){return caches.match("./index.html");});
  }));
});
"""

MANIFEST = ('{"name":"Pravopisný tréner — mäkké i / tvrdé y",'
            '"short_name":"Pravopis",'
            '"lang":"sk","start_url":"./","scope":"./","display":"standalone",'
            '"background_color":"#F4EFDE","theme_color":"#1E88A8",'
            '"description":"Hra na precvičovanie mäkkého i a tvrdého y.",'
            '"icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},'
            '{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]}\n')

HEADERS = """/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Cache-Control: public, max-age=3600
"""

ROBOTS = "User-agent: *\nAllow: /\n"

# ------------------------------------------------------------------ #
#  6) Podmienky použitia a súkromie                                    #
# ------------------------------------------------------------------ #
PODMIENKY = """<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1E88A8">
<title>Podmienky použitia a súkromie — Pravopisný tréner</title>
<link rel="stylesheet" href="app.css">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <a class="chip-btn" href="./">← Späť na tréner</a>
  </div>
  <div class="paper tight legal">
    <h1 class="title h-md">Podmienky použitia a ochrana súkromia</h1>

    <h2>1. Prevádzkovateľ a kontakt</h2>
    <p>Stránku prevádzkuje súkromná osoba ako nekomerčný projekt.
    Kontakt: <b>""" + PH_EMAIL + """</b> — na správy odpovedáme podľa
    možností, spravidla do niekoľkých dní.</p>

    <h2>2. Účel stránky</h2>
    <p>Pravopisný tréner je bezplatná vzdelávacia pomôcka na precvičovanie
    slovenského pravopisu (mäkké i / tvrdé y). Nie je náhradou školskej
    výučby ani učebníc; obsah bol pripravovaný so starostlivosťou podľa
    verejných školských zdrojov, chyby sa však môžu vyskytnúť.</p>

    <h2>3. Používanie a zodpovednosť</h2>
    <ul>
      <li>Stránka a všetok obsah sa poskytujú bezplatne, „tak, ako sú",
      bez akejkoľvek záruky správnosti, dostupnosti či vhodnosti na
      konkrétny účel.</li>
      <li>V rozsahu, v akom to umožňujú platné právne predpisy,
      prevádzkovateľ nezodpovedá za žiadnu škodu vzniknutú používaním
      alebo nemožnosťou používania stránky.</li>
      <li>Stránku používate na vlastnú zodpovednosť. Ak s podmienkami
      nesúhlasíte, stránku nepoužívajte.</li>
    </ul>

    <h2>4. Ochrana súkromia</h2>
    <ul>
      <li>Stránka nevyžaduje registráciu, nepoužíva cookies, nenasadzuje
      analytické ani reklamné nástroje a <b>neodosiela žiadne údaje</b> —
      hra beží celá vo vašom prehliadači.</li>
      <li>Herné štatistiky (úspešnosť, trofeje, nastavenia) sa ukladajú
      výhradne lokálne vo vašom prehliadači (localStorage). Kedykoľvek ich
      vymažete priamo v aplikácii (Štatistiky → Vymazať) alebo vyčistením
      dát prehliadača.</li>
      <li>Stránka je doručovaná cez sieť Cloudflare, ktorá pri návšteve
      technicky spracúva IP adresu a bežné prevádzkové záznamy nevyhnutné
      na doručenie a ochranu obsahu.</li>
      <li>Obsah je vhodný pre deti; stránka neobsahuje reklamy ani
      sledovanie.</li>
    </ul>

    <h2>5. Offline používanie</h2>
    <ul>
      <li><b>iPhone / iPad:</b> otvorte stránku v Safari, klepnite na
      Zdieľať → <b>Pridať na plochu</b>. Aplikácia potom funguje aj úplne
      bez internetu a pokrok sa spoľahlivo ukladá.</li>
      <li><b>Počítač / Android:</b> stiahnite si
      <a href="pravopisny-trener-offline.html" download>offline verziu</a>
      (jeden súbor) a otvorte ju v prehliadači — nepotrebuje internet ani
      žiadne ďalšie súbory.</li>
    </ul>

    <h2>6. Duševné vlastníctvo</h2>
    <p>Zdrojový kód je zverejnený na GitHube: """ + PH_GITHUB + """
    (podmienky použitia kódu určuje licencia v repozitári).</p>

    <h2>7. Zmeny podmienok</h2>
    <p>Prevádzkovateľ môže tieto podmienky upraviť; aktuálne znenie je
    vždy na tejto stránke.</p>

    <p class="dict-expl">Verzia """ + VER + """ · """ + DATE + """</p>
  </div>
</div>
</body>
</html>
"""

# ------------------------------------------------------------------ #
#  7) Ikony (Pillow — bez externých závislostí)                        #
# ------------------------------------------------------------------ #

def build_icons(outdir):
    from PIL import Image, ImageDraw, ImageFont
    os.makedirs(outdir, exist_ok=True)
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # papier
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=110, fill=(253, 251, 242, 255))
    # linajky
    for y in (205, 285, 365):
        d.line([(70, y), (S - 55, y)], fill=(196, 217, 233, 255), width=9)
    # okrajová čiara
    d.line([(120, 55), (120, S - 55)], fill=(236, 138, 128, 255), width=11)
    # písmená i / y na linajke
    font = None
    for fp in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
               "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"):
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, 300)
            break
    if font is None:
        font = ImageFont.load_default(size=300)
    d.text((170, 358), "i", font=font, fill=(30, 136, 168, 255), anchor="ls")
    d.text((280, 358), "y", font=font, fill=(232, 132, 43, 255), anchor="ls")
    img.save(os.path.join(outdir, "icon-512.png"))
    img.resize((192, 192), Image.LANCZOS).save(os.path.join(outdir, "icon-192.png"))
    # apple-touch-icon: nepriehľadný podklad
    at = Image.new("RGBA", (S, S), (244, 239, 222, 255))
    at.alpha_composite(img)
    at.convert("RGB").resize((180, 180), Image.LANCZOS).save(
        os.path.join(outdir, "apple-touch-icon.png"))

ICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect x="0" y="0" width="512" height="512" rx="110" fill="#FDFBF2"/>
<line x1="70" y1="205" x2="457" y2="205" stroke="#C4D9E9" stroke-width="9"/>
<line x1="70" y1="285" x2="457" y2="285" stroke="#C4D9E9" stroke-width="9"/>
<line x1="70" y1="365" x2="457" y2="365" stroke="#C4D9E9" stroke-width="9"/>
<line x1="120" y1="55" x2="120" y2="457" stroke="#EC8A80" stroke-width="11"/>
<text x="170" y="358" font-family="DejaVu Sans, Arial, sans-serif" font-size="300" font-weight="bold" fill="#1E88A8">i</text>
<text x="280" y="358" font-family="DejaVu Sans, Arial, sans-serif" font-size="300" font-weight="bold" fill="#E8842B">y</text>
</svg>
"""

# ------------------------------------------------------------------ #
#  8) Zápis dist/ a QA                                                 #
# ------------------------------------------------------------------ #
if os.path.isdir(DIST):
    shutil.rmtree(DIST)
os.makedirs(os.path.join(DIST, "icons"))

W = {
    "index.html": index,
    "app.css": tidy(css_web),
    "app.js": tidy(js_web),
    "sw.js": SW,
    "manifest.webmanifest": MANIFEST,
    "podmienky.html": PODMIENKY,
    "_headers": HEADERS,
    "robots.txt": ROBOTS,
    "pravopisny-trener-offline.html": off,
    os.path.join("icons", "icon.svg"): ICON_SVG,
}
for name, content in W.items():
    open(os.path.join(DIST, name), "w", encoding="utf-8").write(content)
build_icons(os.path.join(DIST, "icons"))

# QA
run(["node", "--check", os.path.join(DIST, "app.js")])
run(["node", "--check", os.path.join(DIST, "sw.js")])
for f in ("index.html", "podmienky.html", "pravopisny-trener-offline.html"):
    t = open(os.path.join(DIST, f), encoding="utf-8").read()
    assert 'style="' not in t, f + ": obsahuje inline style (porušuje CSP)"
web_html = open(os.path.join(DIST, "index.html"), encoding="utf-8").read()
assert "<!--" not in web_html, "index.html obsahuje komentáre"
assert "manifest.webmanifest" in web_html and "app.css" in web_html
offline_html = open(os.path.join(DIST, "pravopisny-trener-offline.html"), encoding="utf-8").read()
assert "manifest" not in offline_html and "sw.js" not in offline_html, "offline verzia nesmie obsahovať PWA prvky"
assert len(re.findall(r"\{id:'", offline_html)) == 245

print("BUILD OK — dist/ pripravené")
for name in sorted(os.listdir(DIST)):
    fp = os.path.join(DIST, name)
    if os.path.isfile(fp):
        print("  %-36s %6.1f kB" % (name, os.path.getsize(fp) / 1024))
for name in sorted(os.listdir(os.path.join(DIST, "icons"))):
    print("  icons/%-30s %6.1f kB" % (name, os.path.getsize(os.path.join(DIST, "icons", name)) / 1024))
print("\nPRED NASADENÍM NAHRADIŤ PLACEHOLDERY:")
print("  1) " + PH_EMAIL + "   (index.html, podmienky.html)")
print("  2) " + PH_GITHUB + "   (podmienky.html, offline verzia)")
print("  3) " + PH_DOMAIN + "   (podľa potreby v README)")

# v1.1 — koniec súboru
