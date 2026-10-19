"use strict";

var MEM = {};
var store = {
  get: function(k){
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
    catch(e){ return MEM[k] || null; }
  },
  set: function(k, v){
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch(e){ MEM[k] = v; }
  }
};
var K_STATS = "pt_stats_v1";
var K_SET   = "pt_settings_v1";

var AC = null;
function ac(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function tone(freq, dur, type, when, gain){
  var c = ac(); if(!c || !SET.sound) return;
  var o = c.createOscillator(), g = c.createGain();
  o.type = type || "sine"; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + when);
  g.gain.exponentialRampToValueAtTime(gain || 0.18, c.currentTime + when + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
  o.connect(g); g.connect(c.destination);
  o.start(c.currentTime + when); o.stop(c.currentTime + when + dur + 0.05);
}
function sndGood(){ tone(523.25,.11,"sine",0); tone(659.25,.11,"sine",.09); tone(783.99,.16,"sine",.18); }
function sndBad(){ tone(160,.22,"sawtooth",0,.12); tone(110,.25,"sawtooth",.08,.12); }
function sndFanfare(){ tone(523.25,.12,"triangle",0); tone(659.25,.12,"triangle",.1); tone(783.99,.12,"triangle",.2); tone(1046.5,.3,"triangle",.3,.22); }
function sndHoot(){ tone(392,.16,"sine",0,.22); tone(294,.34,"sine",.2,.22); }

var CF_EMO = ["🎉","⭐","✨","🟠","🔵","💛","🟢"];
function confetti(n, set){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var arr = set || CF_EMO;
  for (var i=0;i<n;i++){
    var s = document.createElement("span");
    s.className = "cf";
    s.textContent = arr[Math.floor(Math.random()*arr.length)];
    s.style.left = (5+Math.random()*90) + "vw";
    s.style.animationDuration = (1.3+Math.random()*1.4) + "s";
    s.style.fontSize = (14+Math.random()*16) + "px";
    document.body.appendChild(s);
    setTimeout(function(el){ return function(){ el.remove(); }; }(s), 3000);
  }
}

var CATS = [
  ["vb","Vybrané po B"],["vm","Vybrané po M"],["vp","Vybrané po P"],
  ["vr","Vybrané po R"],["vs","Vybrané po S"],["vv","Vybrané po V"],
  ["vz","Vybrané po Z"],
  ["tv","Tvrdé spoluhlásky → y"],["mk","Mäkké spoluhlásky → i"],
  ["dl","Mäkké di, ti, ni, li"],["ob","Mäkké i po obojakých"],
  ["pr","Zradné dvojice"],["gr","Gramatické koncovky"],
  ["cu","Cudzie slová a výnimky"]
];

var DICT = [

{id:'vb01',t:'w',x:'b_k',a:'ý',c:'vb',e:'vybrané slovo po B',m:'🐂'},
{id:'vb02',t:'w',x:'dob_tok',a:'y',c:'vb',e:'vybrané slovo po B',m:'🐄'},
{id:'vb03',t:'w',x:'kob_la',a:'y',c:'vb',e:'vybrané slovo po B',m:'🐴'},
{id:'vb04',t:'w',x:'b_vol',a:'y',c:'vb',e:'vybrané slovo po B',m:'🐃'},
{id:'vb05',t:'w',x:'náb_tok',a:'y',c:'vb',e:'vybrané slovo po B',m:'🛋️'},
{id:'vb06',t:'w',x:'ob_vateľ',a:'y',c:'vb',e:'vybrané slovo po B (od slova bývať)',m:'🏠'},
{id:'vb07',t:'w',x:'b_t',a:'y',c:'vb',e:'vybrané slovo po B',m:'🏢'},
{id:'vb08',t:'w',x:'b_strý',a:'y',c:'vb',e:'vybrané slovo po B',m:'💡'},
{id:'vb09',t:'w',x:'B_strica',a:'y',c:'vb',e:'vybrané slovo po B (Banská Bystrica)'},
{id:'vb10',t:'w',x:'b_lina',a:'y',c:'vb',e:'vybrané slovo po B',m:'🌿'},
{id:'vb11',t:'w',x:'ob_čaj',a:'y',c:'vb',e:'vybrané slovo po B'},
{id:'vb12',t:'w',x:'zb_točný',a:'y',c:'vb',e:'vybrané slovo po B'},
{id:'vb13',t:'w',x:'príb_tok',a:'y',c:'vb',e:'vybrané slovo po B (od slova bývať)'},
{id:'vb14',t:'w',x:'b_dlisko',a:'y',c:'vb',e:'vybrané slovo po B'},
{id:'vb15',t:'w',x:'b_vať',a:'ý',c:'vb',e:'vybrané slovo po B'},
{id:'vb16',t:'w',x:'B_tča',a:'y',c:'vb',e:'vybrané slovo po B (mesto)'},

{id:'vm01',t:'w',x:'m_dlo',a:'y',c:'vm',e:'vybrané slovo po M (od slova umyť)',m:'🧼'},
{id:'vm02',t:'w',x:'m_š',a:'y',c:'vm',e:'vybrané slovo po M',m:'🐭'},
{id:'vm03',t:'w',x:'um_vať',a:'ý',c:'vm',e:'vybrané slovo po M',m:'🧽'},
{id:'vm04',t:'w',x:'m_liť sa',a:'ý',c:'vm',e:'vybrané slovo po M'},
{id:'vm05',t:'w',x:'om_l',a:'y',c:'vm',e:'vybrané slovo po M (od mýliť sa)'},
{id:'vm06',t:'w',x:'m_slieť',a:'y',c:'vm',e:'vybrané slovo po M',m:'🤔'},
{id:'vm07',t:'w',x:'m_šlienka',a:'y',c:'vm',e:'vybrané slovo po M (od myslieť)',m:'💭'},
{id:'vm08',t:'w',x:'zm_sel',a:'y',c:'vm',e:'vybrané slovo po M (od myslieť)'},
{id:'vm09',t:'w',x:'priem_sel',a:'y',c:'vm',e:'vybrané slovo po M (od myslieť)',m:'🏭'},
{id:'vm10',t:'w',x:'hm_z',a:'y',c:'vm',e:'vybrané slovo po M',m:'🐜'},
{id:'vm11',t:'w',x:'žm_kať',a:'ý',c:'vm',e:'vybrané slovo po M'},
{id:'vm12',t:'w',x:'šm_kľavka',a:'y',c:'vm',e:'vybrané slovo po M (od šmýkať sa)',m:'🛝'},
{id:'vm13',t:'w',x:'šm_k',a:'y',c:'vm',e:'vybrané slovo po M'},
{id:'vm14',t:'w',x:'zam_kať',a:'y',c:'vm',e:'vybrané slovo po M (od mykať)',m:'🔑'},
{id:'vm15',t:'w',x:'M_java',a:'y',c:'vm',e:'vybrané slovo po M (mesto)'},
{id:'vm16',t:'w',x:'m_to',a:'ý',c:'vm',e:'vybrané slovo po M (poplatok za cestu)',m:'🛣️'},

{id:'vp01',t:'w',x:'p_cha',a:'ý',c:'vp',e:'vybrané slovo po P'},
{id:'vp02',t:'w',x:'p_šný',a:'y',c:'vp',e:'vybrané slovo po P (od pýcha)',m:'🦚'},
{id:'vp03',t:'w',x:'p_tať sa',a:'ý',c:'vp',e:'vybrané slovo po P',m:'❓'},
{id:'vp04',t:'w',x:'p_tliak',a:'y',c:'vp',e:'vybrané slovo po P'},
{id:'vp05',t:'w',x:'kop_to',a:'y',c:'vp',e:'vybrané slovo po P',m:'🐎'},
{id:'vp06',t:'w',x:'p_kať',a:'y',c:'vp',e:'vybrané slovo po P (pykať za niečo)'},
{id:'vp07',t:'w',x:'prep_ch',a:'y',c:'vp',e:'vybrané slovo po P (od pýcha)',m:'💎'},
{id:'vp08',t:'w',x:'p_sk',a:'y',c:'vp',e:'vybrané slovo po P (papuľa)'},
{id:'vp09',t:'w',x:'zap_riť sa',a:'ý',c:'vp',e:'vybrané slovo po P (očervenieť)',m:'😊'},
{id:'vp10',t:'w',x:'dop_t',a:'y',c:'vp',e:'vybrané slovo po P (od pýtať sa)',m:'📈'},
{id:'vp11',t:'w',x:'p_r',a:'ý',c:'vp',e:'vybrané slovo po P (burina)',m:'🌱'},
{id:'vp12',t:'w',x:'p_žamo',a:'y',c:'vp',e:'vybrané slovo po P'},

{id:'vr01',t:'w',x:'r_ba',a:'y',c:'vr',e:'vybrané slovo po R',m:'🐟'},
{id:'vr02',t:'w',x:'r_bník',a:'y',c:'vr',e:'vybrané slovo po R (od ryba)'},
{id:'vr03',t:'w',x:'r_chly',a:'ý',c:'vr',e:'vybrané slovo po R',m:'🏃'},
{id:'vr04',t:'w',x:'r_ža',a:'y',c:'vr',e:'vybrané slovo po R',m:'🍚'},
{id:'vr05',t:'w',x:'br_ndza',a:'y',c:'vr',e:'vybrané slovo po R',m:'🧀'},
{id:'vr06',t:'w',x:'kor_tnačka',a:'y',c:'vr',e:'vybrané slovo po R (od koryto)',m:'🐢'},
{id:'vr07',t:'w',x:'kor_to',a:'y',c:'vr',e:'vybrané slovo po R'},
{id:'vr08',t:'w',x:'r_ť',a:'y',c:'vr',e:'vybrané slovo po R (rozrušovať pôdu)'},
{id:'vr09',t:'w',x:'r_ľ',a:'ý',c:'vr',e:'vybrané slovo po R (od ryť)'},
{id:'vr10',t:'w',x:'ukr_ť',a:'y',c:'vr',e:'vybrané slovo po R (od kryť)',m:'🙈'},
{id:'vr11',t:'w',x:'prikr_vka',a:'ý',c:'vr',e:'vybrané slovo po R (od kryť)',m:'🛏️'},
{id:'vr12',t:'w',x:'skr_ša',a:'ý',c:'vr',e:'vybrané slovo po R (od kryť)'},
{id:'vr13',t:'w',x:'str_ko',a:'ý',c:'vr',e:'vybrané slovo po R'},
{id:'vr14',t:'w',x:'r_tier',a:'y',c:'vr',e:'vybrané slovo po R',m:'⚔️'},
{id:'vr15',t:'w',x:'kr_ha',a:'y',c:'vr',e:'vybrané slovo po R',m:'🧊'},
{id:'vr16',t:'w',x:'r_šavý',a:'y',c:'vr',e:'vybrané slovo po R (ryšavé vlasy)',m:'🦊'},
{id:'vr17',t:'w',x:'hr_zť',a:'ý',c:'vr',e:'vybrané slovo po R',m:'🦷'},
{id:'vr18',t:'w',x:'úr_vok',a:'y',c:'vr',e:'vybrané slovo po R (časť textu)',m:'📖'},
{id:'vr19',t:'w',x:'r_dzik',a:'ý',c:'vr',e:'vybrané slovo po R (hríb)',m:'🍄'},
{id:'vr20',t:'w',x:'r_čať',a:'y',c:'vr',e:'vybrané slovo po R (rev zvierat)',m:'🦁'},

{id:'vs01',t:'w',x:'s_n',a:'y',c:'vs',e:'vybrané slovo po S',m:'👦'},
{id:'vs02',t:'w',x:'s_r',a:'y',c:'vs',e:'vybrané slovo po S',m:'🧀'},
{id:'vs03',t:'w',x:'s_ty',a:'ý',c:'vs',e:'vybrané slovo po S (najedený)'},
{id:'vs04',t:'w',x:'s_pať',a:'y',c:'vs',e:'vybrané slovo po S'},
{id:'vs05',t:'w',x:'os_pky',a:'ý',c:'vs',e:'vybrané slovo po S (choroba)',m:'🤒'},
{id:'vs06',t:'w',x:'s_korka',a:'ý',c:'vs',e:'vybrané slovo po S (vtáčik)',m:'🐦'},
{id:'vs07',t:'w',x:'s_čať',a:'y',c:'vs',e:'vybrané slovo po S',m:'🐍'},
{id:'vs08',t:'w',x:'s_seľ',a:'y',c:'vs',e:'vybrané slovo po S (hlodavec)',m:'🐿️'},
{id:'vs09',t:'w',x:'s_chravý',a:'y',c:'vs',e:'vybrané slovo po S (sychravé počasie)',m:'🌧️'},
{id:'vs10',t:'w',x:'vys_chať',a:'y',c:'vs',e:'vybrané slovo po S'},
{id:'vs11',t:'w',x:'s_pký',a:'y',c:'vs',e:'vybrané slovo po S (od sypať)'},
{id:'vs12',t:'w',x:'nenás_tný',a:'y',c:'vs',e:'vybrané slovo po S (od sýty)'},

{id:'vv01',t:'w',x:'v_kať',a:'y',c:'vv',e:'vybrané slovo po V (oslovovať „vy“)'},
{id:'vv02',t:'w',x:'v_soký',a:'y',c:'vv',e:'vybrané slovo po V',m:'📏'},
{id:'vv03',t:'w',x:'v_ška',a:'ý',c:'vv',e:'vybrané slovo po V (od vysoký)'},
{id:'vv04',t:'w',x:'zv_k',a:'y',c:'vv',e:'vybrané slovo po V'},
{id:'vv05',t:'w',x:'náv_k',a:'y',c:'vv',e:'vybrané slovo po V (od zvyk)'},
{id:'vv06',t:'w',x:'v_dra',a:'y',c:'vv',e:'vybrané slovo po V',m:'🦦'},
{id:'vv07',t:'w',x:'v_r',a:'ý',c:'vv',e:'vybrané slovo po V (výr = druh sovy)',m:'🦉'},
{id:'vv08',t:'w',x:'v_žla',a:'y',c:'vv',e:'vybrané slovo po V (poľovný pes)',m:'🐕'},
{id:'vv09',t:'w',x:'v_skať',a:'ý',c:'vv',e:'vybrané slovo po V (od radosti)',m:'🎉'},
{id:'vv10',t:'w',x:'zav_jať',a:'ý',c:'vv',e:'vybrané slovo po V (od vyť)',m:'🐺'},
{id:'vv11',t:'w',x:'zv_šok',a:'y',c:'vv',e:'vybrané slovo po V'},
{id:'vv12',t:'w',x:'v_hňa',a:'y',c:'vv',e:'vybrané slovo po V (kováčska dielňa)',m:'🔥'},
{id:'vv13',t:'w',x:'v_let',a:'ý',c:'vv',e:'predpona vý- sa vždy píše s y',m:'🎒'},
{id:'vv14',t:'w',x:'v_hra',a:'ý',c:'vv',e:'predpona vý- sa vždy píše s y',m:'🏆'},
{id:'vv15',t:'w',x:'v_myslieť',a:'y',c:'vv',e:'predpona vy- sa vždy píše s y'},
{id:'vv16',t:'w',x:'v_robiť',a:'y',c:'vv',e:'predpona vy- sa vždy píše s y'},

{id:'vz01',t:'w',x:'jaz_k',a:'y',c:'vz',e:'vybrané slovo po Z',m:'👅'},
{id:'vz02',t:'w',x:'jaz_ček',a:'ý',c:'vz',e:'vybrané slovo po Z (od jazyk)'},
{id:'vz03',t:'w',x:'naz_vať sa',a:'ý',c:'vz',e:'vybrané slovo po Z'},
{id:'vz04',t:'w',x:'poz_vať',a:'ý',c:'vz',e:'vybrané slovo po Z',m:'💌'},
{id:'vz05',t:'w',x:'oz_vať sa',a:'ý',c:'vz',e:'vybrané slovo po Z',m:'📢'},
{id:'vz06',t:'w',x:'vyz_vať',a:'ý',c:'vz',e:'vybrané slovo po Z'},
{id:'vz07',t:'w',x:'prez_vka',a:'ý',c:'vz',e:'vybrané slovo po Z'},
{id:'vz08',t:'w',x:'vz_vať',a:'ý',c:'vz',e:'vybrané slovo po Z'},

{id:'tv01',t:'w',x:'ch_ba',a:'y',c:'tv',e:'po tvrdej spoluhláske CH píšeme y'},
{id:'tv02',t:'w',x:'ch_tať',a:'y',c:'tv',e:'po tvrdej spoluhláske CH píšeme y',m:'🥎'},
{id:'tv03',t:'w',x:'ch_bať',a:'ý',c:'tv',e:'po tvrdej spoluhláske CH píšeme y'},
{id:'tv04',t:'w',x:'k_slý',a:'y',c:'tv',e:'po tvrdej spoluhláske K píšeme y',m:'🍋'},
{id:'tv05',t:'w',x:'k_tica',a:'y',c:'tv',e:'po tvrdej spoluhláske K píšeme y',m:'💐'},
{id:'tv06',t:'w',x:'k_chať',a:'ý',c:'tv',e:'po tvrdej spoluhláske K píšeme y',m:'🤧'},
{id:'tv07',t:'w',x:'h_bať sa',a:'ý',c:'tv',e:'po tvrdej spoluhláske H píšeme y',m:'🕺'},
{id:'tv08',t:'w',x:'h_dina',a:'y',c:'tv',e:'po tvrdej spoluhláske H píšeme y',m:'🐔'},
{id:'tv09',t:'w',x:'g_č',a:'ý',c:'tv',e:'po tvrdej spoluhláske G píšeme y'},
{id:'tv10',t:'w',x:'d_m',a:'y',c:'tv',e:'D tu znie tvrdo, preto píšeme y',m:'💨'},
{id:'tv11',t:'w',x:'d_chať',a:'ý',c:'tv',e:'D tu znie tvrdo, preto píšeme y'},
{id:'tv12',t:'w',x:'d_ka',a:'ý',c:'tv',e:'D tu znie tvrdo, preto píšeme y',m:'🗡️'},
{id:'tv13',t:'w',x:'mot_ka',a:'y',c:'tv',e:'T tu znie tvrdo, preto píšeme y'},
{id:'tv14',t:'w',x:'mot_ľ',a:'ý',c:'tv',e:'T tu znie tvrdo, preto píšeme y',m:'🦋'},
{id:'tv15',t:'w',x:'t_ždeň',a:'ý',c:'tv',e:'T tu znie tvrdo, preto píšeme y',m:'📅'},
{id:'tv16',t:'w',x:'t_kadlo',a:'y',c:'tv',e:'T tu znie tvrdo, preto píšeme y',m:'🐌'},
{id:'tv17',t:'w',x:'l_že',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y',m:'🎿'},
{id:'tv18',t:'w',x:'l_žica',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y',m:'🥄'},
{id:'tv19',t:'w',x:'ml_n',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y'},
{id:'tv20',t:'w',x:'pl_n',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y'},
{id:'tv21',t:'w',x:'pl_tký',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y'},
{id:'tv22',t:'w',x:'l_tko',a:'ý',c:'tv',e:'L tu znie tvrdo, preto píšeme y',m:'🦵'},
{id:'tv23',t:'w',x:'vzl_kať',a:'y',c:'tv',e:'L tu znie tvrdo, preto píšeme y',m:'😢'},
{id:'tv24',t:'w',x:'bl_skať sa',a:'ý',c:'tv',e:'L tu znie tvrdo, preto píšeme y',m:'⚡'},

{id:'mk01',t:'w',x:'c_buľa',a:'i',c:'mk',e:'po mäkkej spoluhláske C píšeme i',m:'🧅'},
{id:'mk02',t:'w',x:'c_trón',a:'i',c:'mk',e:'po mäkkej spoluhláske C píšeme i',m:'🍋'},
{id:'mk03',t:'w',x:'č_slo',a:'í',c:'mk',e:'po mäkkej spoluhláske Č píšeme i',m:'🔢'},
{id:'mk04',t:'w',x:'č_stý',a:'i',c:'mk',e:'po mäkkej spoluhláske Č píšeme i',m:'✨'},
{id:'mk05',t:'w',x:'č_žmy',a:'i',c:'mk',e:'po mäkkej spoluhláske Č píšeme i',m:'👢'},
{id:'mk06',t:'w',x:'ž_vot',a:'i',c:'mk',e:'po mäkkej spoluhláske Ž píšeme i'},
{id:'mk07',t:'w',x:'ž_rafa',a:'i',c:'mk',e:'po mäkkej spoluhláske Ž píšeme i',m:'🦒'},
{id:'mk08',t:'w',x:'ž_la',a:'i',c:'mk',e:'po mäkkej spoluhláske Ž píšeme i'},
{id:'mk09',t:'w',x:'š_ška',a:'i',c:'mk',e:'po mäkkej spoluhláske Š píšeme i',m:'🍩'},
{id:'mk10',t:'w',x:'š_p',a:'í',c:'mk',e:'po mäkkej spoluhláske Š píšeme i',m:'🏹'},
{id:'mk11',t:'w',x:'š_kovný',a:'i',c:'mk',e:'po mäkkej spoluhláske Š píšeme i'},
{id:'mk12',t:'w',x:'prij_mať',a:'í',c:'mk',e:'po mäkkej spoluhláske J píšeme i'},
{id:'mk13',t:'w',x:'cudz_',a:'í',c:'mk',e:'po mäkkej spoluhláske DZ píšeme i'},
{id:'mk14',t:'w',x:'medz_tým',a:'i',c:'mk',e:'po mäkkej spoluhláske DZ píšeme i'},
{id:'mk15',t:'w',x:'dž_nsy',a:'í',c:'mk',e:'po mäkkej spoluhláske DŽ píšeme i',m:'👖'},

{id:'dl01',t:'w',x:'d_vadlo',a:'i',c:'dl',e:'D tu znie mäkko [ďi], preto píšeme i',m:'🎭'},
{id:'dl02',t:'w',x:'hod_na',a:'i',c:'dl',e:'D tu znie mäkko [ďi], preto píšeme i',m:'⏰'},
{id:'dl03',t:'w',x:'rod_na',a:'i',c:'dl',e:'D tu znie mäkko [ďi], preto píšeme i',m:'🏡'},
{id:'dl04',t:'w',x:'t_cho',a:'i',c:'dl',e:'T tu znie mäkko [ťi], preto píšeme i',m:'🤫'},
{id:'dl05',t:'w',x:'cest_čka',a:'i',c:'dl',e:'T tu znie mäkko [ťi], preto píšeme i'},
{id:'dl06',t:'w',x:'n_č',a:'i',c:'dl',e:'N tu znie mäkko [ňi], preto píšeme i'},
{id:'dl07',t:'w',x:'n_kto',a:'i',c:'dl',e:'N tu znie mäkko [ňi], preto píšeme i'},
{id:'dl08',t:'w',x:'n_zky',a:'í',c:'dl',e:'N tu znie mäkko [ňí], preto píšeme i'},
{id:'dl09',t:'w',x:'l_st',a:'i',c:'dl',e:'L tu znie mäkko [ľi], preto píšeme i',m:'🍃'},
{id:'dl10',t:'w',x:'l_pa',a:'i',c:'dl',e:'L tu znie mäkko [ľi], preto píšeme i',m:'🌳'},
{id:'dl11',t:'w',x:'l_stok',a:'í',c:'dl',e:'L tu znie mäkko [ľí], preto píšeme i',m:'🎫'},
{id:'dl12',t:'w',x:'mal_na',a:'i',c:'dl',e:'L tu znie mäkko [ľi], preto píšeme i',m:'🍓'},
{id:'dl13',t:'w',x:'pol_ca',a:'i',c:'dl',e:'L tu znie mäkko [ľi], preto píšeme i'},
{id:'dl14',t:'w',x:'kl_nec',a:'i',c:'dl',e:'L tu znie mäkko [ľi], preto píšeme i',m:'🔨'},
{id:'dl15',t:'w',x:'pivn_ca',a:'i',c:'dl',e:'N tu znie mäkko [ňi], preto píšeme i'},

{id:'ob01',t:'w',x:'ob_lie',a:'i',c:'ob',e:'nie je to vybrané slovo — po B píšeme mäkké i',m:'🌾'},
{id:'ob02',t:'w',x:'b_cykel',a:'i',c:'ob',e:'cudzie slovo — po B píšeme mäkké i',m:'🚲'},
{id:'ob03',t:'w',x:'m_sa',a:'i',c:'ob',e:'nie je to vybrané slovo — po M píšeme mäkké i',m:'🍲'},
{id:'ob04',t:'w',x:'m_nca',a:'i',c:'ob',e:'nie je to vybrané slovo — po M píšeme mäkké i',m:'🪙'},
{id:'ob05',t:'w',x:'m_lý',a:'i',c:'ob',e:'nie je to vybrané slovo — po M píšeme mäkké i'},
{id:'ob06',t:'w',x:'p_sať',a:'í',c:'ob',e:'nie je to vybrané slovo — po P píšeme mäkké i',m:'✍️'},
{id:'ob07',t:'w',x:'p_šťalka',a:'í',c:'ob',e:'nie je to vybrané slovo — po P píšeme mäkké i'},
{id:'ob08',t:'w',x:'r_ziko',a:'i',c:'ob',e:'nie je to vybrané slovo — po R píšeme mäkké i'},
{id:'ob09',t:'w',x:'s_la',a:'i',c:'ob',e:'nie je to vybrané slovo — po S píšeme mäkké i',m:'💪'},
{id:'ob10',t:'w',x:'s_to',a:'i',c:'ob',e:'nie je to vybrané slovo — po S píšeme mäkké i'},
{id:'ob11',t:'w',x:'s_vý',a:'i',c:'ob',e:'nie je to vybrané slovo — po S píšeme mäkké i'},
{id:'ob12',t:'w',x:'v_dieť',a:'i',c:'ob',e:'nie je to vybrané slovo — po V píšeme mäkké i',m:'👀'},
{id:'ob13',t:'w',x:'v_dly',a:'i',c:'ob',e:'nie je to vybrané slovo — po V píšeme mäkké i'},
{id:'ob14',t:'w',x:'z_ma',a:'i',c:'ob',e:'nie je to vybrané slovo — po Z píšeme mäkké i',m:'❄️'},
{id:'ob15',t:'w',x:'z_sk',a:'i',c:'ob',e:'nie je to vybrané slovo — po Z píšeme mäkké i',m:'💰'},

{id:'pr01',t:'s',x:'Cez prázdniny chcem b_ť u starkej.',a:'y',c:'pr',e:'byť = nachádzať sa, existovať (vybrané slovo po B)',w:'byť'},
{id:'pr02',t:'s',x:'Nie je pekné b_ť spolužiakov.',a:'i',c:'pr',e:'biť = udierať — píšeme mäkké i',w:'biť'},
{id:'pr03',t:'s',x:'Rytieri chceli dob_ť hrad.',a:'y',c:'pr',e:'dobyť = zmocniť sa (vybrané slovo po B)',w:'dobyť'},
{id:'pr04',t:'s',x:'Potrebujem si dob_ť mobil.',a:'i',c:'pr',e:'dobiť = doplniť energiu — mäkké i',w:'dobiť',m:'🔋'},
{id:'pr05',t:'s',x:'M_ sme včera vyhrali zápas.',a:'y',c:'pr',e:'my = viacerí, množné číslo',w:'my'},
{id:'pr06',t:'s',x:'Podaj m_, prosím, tú knihu.',a:'i',c:'pr',e:'mi = mne, jednotné číslo',w:'mi'},
{id:'pr07',t:'s',x:'V noci na strome húkal v_r.',a:'ý',c:'pr',e:'výr = druh sovy (vybrané slovo po V)',w:'výr',m:'🦉'},
{id:'pr08',t:'s',x:'Voda v rieke vytvorila v_r.',a:'í',c:'pr',e:'vír = krútňava — mäkké í',w:'vír',m:'🌀'},
{id:'pr09',t:'s',x:'Vlk začal v noci v_ť.',a:'y',c:'pr',e:'vyť = vydávať zvuk (vybrané slovo po V)',w:'vyť',m:'🐺'},
{id:'pr10',t:'s',x:'Babka bude v_ť veniec z kvetov.',a:'i',c:'pr',e:'viť = pliesť — mäkké i',w:'viť',m:'💐'},
{id:'pr11',t:'s',x:'Sliepky sedeli na b_dle.',a:'i',c:'pr',e:'bidlo = žrď — mäkké i',w:'bidlo',m:'🐔'},
{id:'pr12',t:'s',x:'Rodina si hľadala nové b_dlo.',a:'y',c:'pr',e:'bydlo = bývanie (vybrané slovo po B)',w:'bydlo'},
{id:'pr13',t:'s',x:'Báseň má pekný r_m.',a:'ý',c:'pr',e:'rým = zvuková zhoda slov (vybrané slovo po R)',w:'rým',m:'🎵'},
{id:'pr14',t:'s',x:'Hlavné mesto Talianska je R_m.',a:'í',c:'pr',e:'Rím = mesto — mäkké í',w:'Rím',m:'🏛️'},
{id:'pr15',t:'s',x:'V lese tancovala krásna v_la.',a:'í',c:'pr',e:'víla = rozprávková bytosť — mäkké í',w:'víla',m:'🧚'},
{id:'pr16',t:'s',x:'Líška v_la na mesiac celú noc.',a:'y',c:'pr',e:'vyla = od slovesa vyť (vybrané slovo po V)',w:'vyla'},
{id:'pr17',t:'s',x:'Na palacinky si dáme sladký s_rup.',a:'i',c:'pr',e:'sirup — cudzie slovo s mäkkým i (nie je od slova syr!)',w:'sirup',m:'🍯'},

{id:'g01',t:'s',x:'Pekn_ chlapci sa hrali na ihrisku.',a:'í',c:'gr',e:'mužské osoby v množnom čísle → mäkké í (pekní chlapci)',w:'pekní'},
{id:'g02',t:'s',x:'Pred domom stál vysok_ strom.',a:'ý',c:'gr',e:'jednotné číslo → tvrdé ý (vysoký strom)',w:'vysoký'},
{id:'g03',t:'s',x:'Múdr_ žiaci vyriešili úlohu.',a:'i',c:'gr',e:'mužské osoby v množnom čísle → mäkké i (po dlhej slabike krátke: múdri)',w:'múdri'},
{id:'g04',t:'s',x:'Mil_ susedia nás pozdravili.',a:'í',c:'gr',e:'mužské osoby v množnom čísle → mäkké í (milí susedia)',w:'milí'},
{id:'g05',t:'s',x:'Na kopci stojí star_ hrad.',a:'ý',c:'gr',e:'jednotné číslo → tvrdé ý (starý hrad)',w:'starý'},
{id:'g06',t:'s',x:'Star_ rodičia nám doniesli koláč.',a:'í',c:'gr',e:'mužské osoby v množnom čísle → mäkké í (starí rodičia)',w:'starí'},
{id:'g07',t:'s',x:'Chlap_ opravovali strechu.',a:'i',c:'gr',e:'mužské osoby v množnom čísle → i (chlapi, vzor chlap)',w:'chlapi'},
{id:'g08',t:'s',x:'V lese rástli vysoké dub_.',a:'y',c:'gr',e:'neživotné podstatné meno → y (duby, vzor dub)',w:'duby'},
{id:'g09',t:'s',x:'Žen_ spievali ľudové piesne.',a:'y',c:'gr',e:'vzor žena → y (ženy)',w:'ženy'},
{id:'g10',t:'s',x:'Na lúke pobehovali ps_.',a:'y',c:'gr',e:'zvieratá v množnom čísle → y (psy)',w:'psy',m:'🐕'},
{id:'g11',t:'s',x:'Nad poľom krúžili vták_.',a:'y',c:'gr',e:'zvieratá v množnom čísle → y (vtáky)',w:'vtáky',m:'🐦'},
{id:'g12',t:'s',x:'Ryb_ plávali v potoku.',a:'y',c:'gr',e:'vzor žena → y (ryby)',w:'ryby',m:'🐟'},
{id:'g13',t:'s',x:'Kost_ boli rozhádzané po dvore.',a:'i',c:'gr',e:'vzor kosť → i (kosti)',w:'kosti',m:'🦴'},
{id:'g14',t:'s',x:'Deti sa hral_ celé popoludnie.',a:'i',c:'gr',e:'minulý čas: v množnom čísle vždy -li',w:'hrali'},
{id:'g15',t:'s',x:'Ženy varil_ chutný obed.',a:'i',c:'gr',e:'minulý čas: vždy -li, aj pri ženách',w:'varili'},
{id:'g16',t:'s',x:'Autá stál_ pred školou.',a:'i',c:'gr',e:'minulý čas: vždy -li, aj pri veciach',w:'stáli'},
{id:'g17',t:'s',x:'Chlapci vyhral_ turnaj.',a:'i',c:'gr',e:'minulý čas: v množnom čísle vždy -li',w:'vyhrali'},
{id:'g18',t:'s',x:'Na oblohe žiaril_ hviezdy.',a:'i',c:'gr',e:'minulý čas: vždy -li, aj pri hviezdach',w:'žiarili'},
{id:'g19',t:'s',x:'T_ chlapci sú moji kamaráti.',a:'í',c:'gr',e:'tí = ukazovacie zámeno pri mužských osobách → í',w:'tí'},
{id:'g20',t:'s',x:'Muži dobehli do cieľa. On_ boli najrýchlejší.',a:'i',c:'gr',e:'oni = mužské osoby → mäkké i',w:'oni'},
{id:'g21',t:'s',x:'Ženy dobehli do cieľa. On_ boli najrýchlejšie.',a:'y',c:'gr',e:'ony = ostatné rody (ženy, deti, veci) → tvrdé y',w:'ony'},
{id:'g22',t:'s',x:'Chlapci tam šli sam_.',a:'i',c:'gr',e:'sami = mužské osoby → mäkké i',w:'sami'},
{id:'g23',t:'s',x:'Dievčatá tam šli sam_.',a:'y',c:'gr',e:'samy = ostatné rody → tvrdé y',w:'samy'},
{id:'g24',t:'s',x:'Bratia sa rad_ hrajú vonku.',a:'i',c:'gr',e:'radi = mužské osoby → mäkké i',w:'radi'},
{id:'g25',t:'s',x:'Sestry sa rad_ hrajú vonku.',a:'y',c:'gr',e:'rady = ostatné rody → tvrdé y',w:'rady'},
{id:'g26',t:'s',x:'Všetc_ žiaci písali test.',a:'i',c:'gr',e:'všetci = mužské osoby → mäkké i',w:'všetci'},
{id:'g27',t:'s',x:'Ktor_ chlapci vyhrali?',a:'í',c:'gr',e:'ktorí = mužské osoby v množnom čísle → í',w:'ktorí'},
{id:'g28',t:'s',x:'Siedm_ trpaslíci pomáhali Snehulienke.',a:'i',c:'gr',e:'siedmi (koľkí?) = základná číslovka pri osobách → i',w:'siedmi'},
{id:'g29',t:'s',x:'Siedm_ trpaslík bol najmenší.',a:'y',c:'gr',e:'siedmy (koľký v poradí?) = radová číslovka → y',w:'siedmy'},
{id:'g30',t:'s',x:'Katkin_ bratia hrajú futbal.',a:'i',c:'gr',e:'Katkini = mužské osoby v množnom čísle → i',w:'Katkini'},
{id:'g31',t:'s',x:'S otcov_mi kolegami sme sa stretli.',a:'ý',c:'gr',e:'inštrumentál množného čísla → -ými (s otcovými)',w:'otcovými'},
{id:'g32',t:'s',x:'S mil_mi ľuďmi je radosť pracovať.',a:'ý',c:'gr',e:'inštrumentál množného čísla → -ými (milí ľudia, ale s milými!)',w:'milými'},
{id:'g33',t:'s',x:'Um_ si ruky pred jedlom!',a:'y',c:'gr',e:'umy = rozkaz od slovesa umyť (vybrané po M)',w:'umy',m:'🧼'},
{id:'g34',t:'s',x:'Skr_ sa za strom!',a:'y',c:'gr',e:'skry = rozkaz od slovesa skryť (vybrané po R)',w:'skry'},
{id:'g35',t:'s',x:'Bývame na tejto ulic_.',a:'i',c:'gr',e:'vzor ulica → i (na ulici)',w:'ulici'},
{id:'g36',t:'s',x:'Na dlan_ mu sedela lienka.',a:'i',c:'gr',e:'vzor dlaň → i (na dlani)',w:'dlani',m:'🐞'},
{id:'g37',t:'s',x:'Bez mam_ nikam nejdem.',a:'y',c:'gr',e:'genitív vzoru žena → y (bez mamy)',w:'mamy'},
{id:'g38',t:'s',x:'Do škol_ chodíme každé ráno.',a:'y',c:'gr',e:'genitív vzoru žena → y (do školy)',w:'školy',m:'🏫'},
{id:'g39',t:'s',x:'Muž_ pracovali na stavbe.',a:'i',c:'gr',e:'mužské osoby v množnom čísle → i (muži)',w:'muži'},
{id:'g40',t:'s',x:'Vlak_ meškali pre sneh.',a:'y',c:'gr',e:'neživotné podstatné meno → y (vlaky)',w:'vlaky',m:'🚂'},
{id:'g41',t:'s',x:'Zošit_ ležali na lavici.',a:'y',c:'gr',e:'neživotné podstatné meno → y (zošity)',w:'zošity'},
{id:'g42',t:'s',x:'Kamarát_ prišli na návštevu.',a:'i',c:'gr',e:'mužské osoby v množnom čísle → i (kamaráti)',w:'kamaráti'},

{id:'cu01',t:'w',x:'f_zika',a:'y',c:'cu',e:'cudzie slovo — po F píšeme y iba v cudzích slovách',m:'⚛️'},
{id:'cu02',t:'w',x:'bic_kel',a:'y',c:'cu',e:'cudzie slovo — po C tu výnimočne píšeme y',m:'🚲'},
{id:'cu03',t:'w',x:'c_klista',a:'y',c:'cu',e:'cudzie slovo — po C tu výnimočne píšeme y',m:'🚴'},
{id:'cu04',t:'w',x:'c_linder',a:'y',c:'cu',e:'cudzie slovo — po C tu výnimočne píšeme y',m:'🎩'},
{id:'cu05',t:'w',x:'ol_mpiáda',a:'y',c:'cu',e:'cudzie slovo — zapamätaj si y',m:'🏅'},
{id:'cu06',t:'w',x:'s_stém',a:'y',c:'cu',e:'cudzie slovo — zapamätaj si y',m:'💻'},
{id:'cu07',t:'w',x:'k_no',a:'i',c:'cu',e:'cudzie slovo — po tvrdej K tu výnimočne píšeme i',m:'🎬'},
{id:'cu08',t:'w',x:'g_tara',a:'i',c:'cu',e:'cudzie slovo — po tvrdej G tu výnimočne píšeme i',m:'🎸'},
{id:'cu09',t:'w',x:'mik_na',a:'i',c:'cu',e:'cudzie slovo — po tvrdej K píšeme i',m:'🧥'},
{id:'cu10',t:'w',x:'d_ktát',a:'i',c:'cu',e:'cudzie slovo — po D píšeme i, hoci znie tvrdo',m:'📝'},
{id:'cu11',t:'w',x:'h_stória',a:'i',c:'cu',e:'cudzie slovo — po tvrdej H tu píšeme i',m:'📜'},
{id:'cu12',t:'w',x:'k_lometer',a:'i',c:'cu',e:'cudzia predpona kilo- sa píše s i'},
{id:'cu13',t:'w',x:'t_ger',a:'i',c:'cu',e:'v slovenčine píšeme tiger s mäkkým i',m:'🐯'},
{id:'cu14',t:'w',x:'kikir_kať',a:'í',c:'cu',e:'zvukomalebné slovo — vždy mäkké i',m:'🐓'},
{id:'cu15',t:'w',x:'t_kať',a:'i',c:'cu',e:'zvukomalebné slovo (tik-tak) — mäkké i',m:'⏱️'},
{id:'cu16',t:'w',x:'od_sť',a:'í',c:'cu',e:'predpona od- + ísť: i z koreňa slova zostáva'},
{id:'cu17',t:'w',x:'pred_zba',a:'i',c:'cu',e:'predpona pred- + izba: i z koreňa slova zostáva',m:'🚪'}
];

function el(i){ return document.getElementById(i); }
var ALL_CATS = CATS.map(function(c){ return c[0]; });

function cleanNum(v, def){ return (typeof v === "number" && isFinite(v) && v >= 0) ? v : def; }
function cleanSet(raw){
  var r = (raw && typeof raw === "object") ? raw : {};
  var cats = Array.isArray(r.cats) ? r.cats.filter(function(c){ return ALL_CATS.indexOf(c) >= 0; }) : [];
  var ach = {};
  if (r.ach && typeof r.ach === "object"){
    Object.keys(r.ach).forEach(function(k){
      var v = r.ach[k];
      if (/^[A-Za-z0-9]{1,16}$/.test(k) && (v === true || (typeof v === "number" && isFinite(v)))) ach[k] = v;
    });
  }
  return {
    count: Math.round(cleanNum(r.count, 15)) || 15,
    cats: cats.length ? cats : ALL_CATS.slice(),
    sound: typeof r.sound === "boolean" ? r.sound : true,
    ach: ach,
    night: typeof r.night === "boolean" ? r.night : false,
    owlTaps: Math.floor(cleanNum(r.owlTaps, 0))
  };
}
var SET = cleanSet(store.get(K_SET));
var STATS = {};
function saveSet(){ store.set(K_SET, SET); }
function saveStats(){ store.set(K_STATS, STATS); }

function fullOf(d){ return d.x.replace("_", d.a); }
function dispOf(d){ return d.w ? d.w : fullOf(d); }
function isSoft(ch){ return ch === "i" || ch === "í"; }
function countIY(s){ var m = s.match(/[iíyýIÍYÝ]/g); return m ? m.length : 0; }
function shuffle(arr){
  for (var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

var BYID = {};
DICT.forEach(function(d){ BYID[d.id] = d; });

var W_NEW = 1.3, W_BAD = 3, W_MAX = 30, W_OK = 0.6, W_MIN = 0.35;
function cleanStats(raw){
  var out = {};
  if (!raw || typeof raw !== "object") return out;
  Object.keys(raw).forEach(function(id){
    var s = raw[id];
    if (!BYID.hasOwnProperty(id) || !s || typeof s !== "object") return;
    var ok = Math.floor(cleanNum(s.ok, 0)), bad = Math.floor(cleanNum(s.bad, 0));
    out[id] = {
      s: Math.max(Math.floor(cleanNum(s.s, 0)), ok + bad),
      ok: ok, bad: bad,
      w: Math.min(W_MAX, Math.max(W_MIN, cleanNum(s.w, W_NEW))),
      last: cleanNum(s.last, 0)
    };
  });
  return out;
}
STATS = cleanStats(store.get(K_STATS));
function weightOf(id){ var s = STATS[id]; return s ? s.w : W_NEW; }
function markAnswer(id, ok){
  var s = STATS[id] || (STATS[id] = { s:0, ok:0, bad:0, w:W_NEW, last:0 });
  s.s++; s.last = Date.now();
  if (ok){ s.ok++; if (!(R && R.egg)) s.w = Math.max(W_MIN, s.w * W_OK); }
  else   { s.bad++; s.w = Math.min(W_MAX, s.w * W_BAD); }
  if (R && R.hist){ R.hist.unshift({ id: id, ok: ok }); if (R.hist.length > 60) R.hist.pop(); }
  saveStats();
}
function poolFor(cats){ return DICT.filter(function(d){ return cats.indexOf(d.c) >= 0; }); }
function poolForMode(mode){
  var p = poolFor(SET.cats);
  if (mode === "arcade") p = p.filter(function(d){ return d.t === "w"; });
  if (mode === "find")   p = p.filter(function(d){ return d.t === "s" && countIY(fullOf(d)) >= 2; });
  return p;
}

function pickRound(pool, n){
  var src = pool.slice(), out = [];
  n = Math.min(n, src.length);
  while (out.length < n){
    var total = 0, i;
    for (i = 0; i < src.length; i++) total += weightOf(src[i].id);
    var r = Math.random() * total;
    for (i = 0; i < src.length; i++){
      r -= weightOf(src[i].id);
      if (r <= 0) break;
    }
    if (i >= src.length) i = src.length - 1;
    out.push(src[i]); src.splice(i, 1);
  }
  return out;
}

function show(id){
  var scr = document.querySelectorAll(".screen");
  for (var i = 0; i < scr.length; i++) scr[i].classList.remove("on");
  el(id).classList.add("on");
}
function scrOn(id){ return el(id).classList.contains("on"); }
var homeBtns = document.querySelectorAll("[data-home]");
for (var hb = 0; hb < homeBtns.length; hb++){
  homeBtns[hb].addEventListener("click", function(){ stopArcade(); show("scr-home"); refreshHome(); });
}

function renderCats(){
  var box = el("catBox"); box.innerHTML = "";
  CATS.forEach(function(c){
    var lab = document.createElement("span");
    lab.className = "cat" + (SET.cats.indexOf(c[0]) >= 0 ? " onx" : "");
    lab.textContent = c[1];
    lab.addEventListener("click", function(){
      var ix = SET.cats.indexOf(c[0]);
      if (ix >= 0) SET.cats.splice(ix, 1); else SET.cats.push(c[0]);
      saveSet(); renderCats(); refreshHome();
    });
    box.appendChild(lab);
  });
}
function refreshHome(){
  var pool = poolFor(SET.cats);
  var max = Math.max(10, pool.length);
  var range = el("countRange");
  range.max = max;
  if (SET.count > max) SET.count = max;
  if (SET.count < 10) SET.count = Math.min(10, max);
  range.value = SET.count;
  el("countVal").textContent = SET.count;
  el("poolInfo").textContent = "V zásobe: " + pool.length + " položiek z vybraných kategórií (celý slovník: " + DICT.length + ").";
  el("btnSound").textContent = SET.sound ? "🔊 Zvuk" : "🔇 Zvuk";
  var nb = el("btnNight");
  var unl = !!(SET.ach && (SET.ach.spekY || SET.ach.spekI));
  nb.disabled = !unl;
  nb.classList.toggle("locked", !unl);
  nb.textContent = unl ? (SET.night ? "🌙 Nočný zošit ✓" : "🌙 Nočný zošit") : "🔒 Nočný zošit";
}
el("countRange").addEventListener("input", function(){
  SET.count = parseInt(this.value, 10);
  el("countVal").textContent = SET.count;
  saveSet();
});
var quicks = document.querySelectorAll(".quick button");
for (var qb = 0; qb < quicks.length; qb++){
  quicks[qb].addEventListener("click", function(){
    var v = this.getAttribute("data-q");
    SET.count = (v === "max") ? parseInt(el("countRange").max, 10) : parseInt(v, 10);
    saveSet(); refreshHome();
  });
}
el("btnSound").addEventListener("click", function(){ SET.sound = !SET.sound; saveSet(); refreshHome(); if (SET.sound) sndGood(); });
el("btnStats").addEventListener("click", function(){ renderStats(); show("scr-stats"); });
var modeCards = document.querySelectorAll(".mode-card");
for (var mc = 0; mc < modeCards.length; mc++){
  modeCards[mc].addEventListener("click", function(){ launch(this.getAttribute("data-mode")); });
}

var R = null;
function launch(mode){
  var p = poolForMode(mode);
  if (!p.length){
    alert("Pre tento režim treba vybrať kategórie s vhodnými položkami (režim „Nájdi chybu“ potrebuje vety — napr. Zradné dvojice alebo Gramatické koncovky).");
    return;
  }
  var side = null;
  var allSoft = p.every(function(d){ return isSoft(d.a); });
  var allHard = p.every(function(d){ return !isSoft(d.a); });
  if (allSoft) side = "i"; else if (allHard) side = "y";
  startRound(mode, pickRound(p, SET.count), side);
}
function startRound(mode, items, egg){
  if (!items.length) return;
  R = { mode: mode, items: items, i: 0, ok: 0, bad: 0, mist: [], streak: 0, lives: 3, score: 0, done: false, egg: egg || null, hist: [] };
  if (mode === "quiz"){ show("scr-quiz"); nextQuiz(); }
  else if (mode === "find"){ show("scr-find"); nextFind(); }
  else { show("scr-arcade"); startArcade(); }
  if (R.egg) revealSpek(R.egg);
}

var busy = false;
function renderBlank(container, d, slotId){
  container.innerHTML = "";
  var parts = d.x.split("_");
  container.appendChild(document.createTextNode(parts[0]));
  var slot = document.createElement("span");
  slot.className = "slot"; slot.id = slotId; slot.textContent = "y";
  container.appendChild(slot);
  container.appendChild(document.createTextNode(parts[1]));
}
function chosenChar(d, soft){
  var lng = (d.a === "í" || d.a === "ý");
  return soft ? (lng ? "í" : "i") : (lng ? "ý" : "y");
}
function nextQuiz(){
  if (R.i >= R.items.length) return endRound();
  var d = R.items[R.i];
  busy = false;
  el("qNext").style.display = "none";
  el("btnI").disabled = false; el("btnY").disabled = false;
  el("qEmoji").textContent = d.m || "";
  var w = el("qWord");
  w.className = "q-word" + (d.t === "s" ? " sent" : "");
  renderBlank(w, d, "slot");
  el("qHint").innerHTML = "";
  el("qStreak").textContent = (R.egg ? "🕵️ " : "") + (R.streak >= 2 ? "🔥 " + R.streak : "");
  el("qProg").style.width = (R.i / R.items.length * 100) + "%";
}
function answerQuiz(soft){
  if (busy || !R || R.mode !== "quiz") return;
  busy = true;
  var d = R.items[R.i];
  var ok = isSoft(d.a) === soft;
  var slot = el("slot");
  slot.textContent = chosenChar(d, soft);
  slot.classList.add("filled", ok ? "good" : "bad");
  markAnswer(d.id, ok);
  var hint = el("qHint");
  if (ok){
    R.ok++; R.streak++; achStreak();
    sndGood(); confetti(10);
    hint.innerHTML = "<b>" + fullOf(d) + "</b> — " + d.e;
    if (R.streak === 5 || R.streak === 10 || R.streak === 15 || R.streak === 20){ sndFanfare(); confetti(40); }
    setTimeout(function(){ R.i++; nextQuiz(); }, 950);
  } else {
    R.bad++; R.streak = 0; R.mist.push(d);
    sndBad();
    slot.classList.add("squig");
    var card = el("qCard");
    card.classList.remove("card-shake"); void card.offsetWidth; card.classList.add("card-shake");
    hint.innerHTML = "Správne: <b>" + fullOf(d) + "</b><br>" + d.e;
    el("btnI").disabled = true; el("btnY").disabled = true;
    el("qNext").style.display = "block";
  }
}
el("qNext").addEventListener("click", function(){ R.i++; nextQuiz(); });
el("btnI").addEventListener("click", function(){ answerQuiz(true); });
el("btnY").addEventListener("click", function(){ answerQuiz(false); });

var A = null;
function startArcade(){
  A = { dur: 8000, active: false, raf: 0 };
  updHud();
  nextArcade();
}
function updHud(){
  var s = "";
  for (var i = 0; i < 3; i++) s += (i < R.lives) ? "❤️" : "🖤";
  el("aLives").textContent = s;
  el("aScore").textContent = R.score;
  el("aStreak").textContent = (R.egg ? "🕵️ " : "") + (R.streak >= 2 ? "🔥 " + R.streak : "");
}
function nextArcade(){
  if (!R || R.mode !== "arcade") return;
  if (A && A.hold){ A.waiting = true; return; }
  if (R.i >= R.items.length || R.lives <= 0) return endRound();
  var d = R.items[R.i];
  renderBlank(el("faller"), d, "aslot");
  el("faller").style.top = "-70px";
  el("arcFb").classList.remove("on");
  el("aBtnI").disabled = false; el("aBtnY").disabled = false;
  A.start = performance.now();
  A.active = true;
  cancelAnimationFrame(A.raf);
  A.raf = requestAnimationFrame(fallStep);
}
function fallStep(now){
  if (!A || !A.active) return;
  var h = el("sky").clientHeight;
  var p = (now - A.start) / A.dur;
  if (p >= 1) return arcMiss();
  el("faller").style.top = (-70 + p * (h + 30)) + "px";
  A.raf = requestAnimationFrame(fallStep);
}
function arcAnswer(soft){
  if (!A || !A.active || !R || R.mode !== "arcade") return;
  A.active = false; cancelAnimationFrame(A.raf);
  var d = R.items[R.i];
  var ok = isSoft(d.a) === soft;
  markAnswer(d.id, ok);
  var slot = el("aslot");
  if (slot){ slot.textContent = chosenChar(d, soft); slot.classList.add("filled", ok ? "good" : "bad"); }
  if (ok){
    R.ok++; R.score++; R.streak++; achStreak();
    if (R.ok % 3 === 0) A.dur = Math.max(3500, A.dur - 350);
    sndGood(); confetti(8); updHud();
    var fb = el("arcFb");
    fb.innerHTML = "✅ <b>" + fullOf(d) + "</b>";
    fb.classList.add("on");
    setTimeout(function(){ R.i++; nextArcade(); }, 650);
  } else {
    arcWrong(d, "Ups, nesprávne.");
  }
}
function arcMiss(){
  if (!A || !A.active) return;
  A.active = false; cancelAnimationFrame(A.raf);
  var d = R.items[R.i];
  markAnswer(d.id, false);
  arcWrong(d, "Slovo dopadlo!");
}
function arcWrong(d, ttl){
  R.bad++; R.streak = 0; R.lives--; R.mist.push(d);
  sndBad(); updHud();
  var fb = el("arcFb");
  fb.innerHTML = ttl + "<br>Správne: <b>" + fullOf(d) + "</b><br><span class=\"arc-note\">" + d.e + "</span>";
  fb.classList.add("on");
  el("aBtnI").disabled = true; el("aBtnY").disabled = true;
  setTimeout(function(){ R.i++; nextArcade(); }, 2100);
}
function stopArcade(){ if (A){ A.active = false; cancelAnimationFrame(A.raf); } }
el("aBtnI").addEventListener("click", function(){ arcAnswer(true); });
el("aBtnY").addEventListener("click", function(){ arcAnswer(false); });

var FLIP = { "i":"y", "y":"i", "í":"ý", "ý":"í" };
function nextFind(){
  if (!R || R.mode !== "find") return;
  if (R.i >= R.items.length) return endRound();
  var d = R.items[R.i];
  R.done = false;
  el("fNext").style.display = "none";
  el("fStreak").textContent = (R.egg ? "🕵️ " : "") + (R.streak >= 2 ? "🔥 " + R.streak : "");
  el("fProg").style.width = (R.i / R.items.length * 100) + "%";
  var full = fullOf(d);
  var blank = d.x.indexOf("_");
  var shown = full.slice(0, blank) + FLIP[d.a] + full.slice(blank + 1);
  var box = el("fSent"); box.innerHTML = "";
  for (var i = 0; i < shown.length; i++){
    var ch = shown[i];
    if (/[iíyýIÍYÝ]/.test(ch)){
      var sp = document.createElement("span");
      sp.className = "iy"; sp.textContent = ch;
      sp.setAttribute("data-pos", i);
      sp.addEventListener("click", findTap);
      box.appendChild(sp);
    } else if (ch === " "){
      var sps = document.createElement("span");
      sps.className = "sp";
      sps.textContent = "\u00A0";
      box.appendChild(sps);
    } else {
      box.appendChild(document.createTextNode(ch));
    }
  }
  R.blank = blank;
  el("fHint").innerHTML = "";
}
function findTap(ev){
  if (!R || R.done) return;
  R.done = true;
  var d = R.items[R.i];
  var sp = ev.currentTarget;
  var ok = parseInt(sp.getAttribute("data-pos"), 10) === R.blank;
  markAnswer(d.id, ok);
  if (ok){
    R.ok++; R.streak++; achStreak();
    sp.textContent = d.a; sp.classList.add("hit-good");
    sndGood(); confetti(10);
    el("fHint").innerHTML = "<b>" + fullOf(d) + "</b> — " + d.e;
    if (R.streak === 5 || R.streak === 10 || R.streak === 15){ sndFanfare(); confetti(40); }
    setTimeout(function(){ R.i++; nextFind(); }, 1150);
  } else {
    R.bad++; R.streak = 0; R.mist.push(d);
    sp.classList.add("hit-bad"); sndBad();
    var card = el("fCard");
    card.classList.remove("card-shake"); void card.offsetWidth; card.classList.add("card-shake");
    var spans = el("fSent").querySelectorAll(".iy");
    for (var i = 0; i < spans.length; i++){
      if (parseInt(spans[i].getAttribute("data-pos"), 10) === R.blank){
        spans[i].textContent = d.a; spans[i].classList.add("reveal");
      }
    }
    el("fHint").innerHTML = "Chyba bola tu: <b>" + fullOf(d) + "</b><br>" + d.e;
    el("fNext").style.display = "block";
  }
}
el("fNext").addEventListener("click", function(){ R.i++; nextFind(); });

function endRound(){
  stopArcade();
  var total = R.ok + R.bad;
  var pct = total ? Math.round(R.ok / total * 100) : 0;
  el("rStars").textContent = pct >= 90 ? "⭐⭐⭐" : pct >= 70 ? "⭐⭐" : pct >= 50 ? "⭐" : "💪";
  el("rScore").textContent = R.ok + " / " + total + " správne (" + pct + " %)";
  var mist = el("rMist"); mist.innerHTML = "";
  if (R.mist.length){
    var h = document.createElement("h4");
    h.textContent = "Kde sa stala chyba:";
    h.style.margin = "6px 0";
    mist.appendChild(h);
    R.mist.forEach(function(d){
      var dv = document.createElement("div");
      dv.className = "mist";
      dv.innerHTML = "<b>" + fullOf(d) + "</b><br>" + d.e;
      mist.appendChild(dv);
    });
  } else {
    var dv0 = document.createElement("div");
    dv0.className = "mist";
    dv0.textContent = "Bez jedinej chyby. Paráda! 🎉";
    mist.appendChild(dv0);
  }
  el("rOnlyBad").style.display = R.mist.length ? "block" : "none";
  if (pct >= 90 && total > 0){ sndFanfare(); confetti(60); }
  if (!R.egg && total === R.items.length && total >= 15 && R.bad === 0) unlock("perf");
  show("scr-results");
}
el("rAgain").addEventListener("click", function(){ launch(R.mode); });
el("rOnlyBad").addEventListener("click", function(){
  var uniq = [], seen = {};
  R.mist.forEach(function(d){ if (!seen[d.id]){ seen[d.id] = 1; uniq.push(d); } });
  startRound("quiz", shuffle(uniq));
});

function problemItems(){
  return DICT.filter(function(d){
    var s = STATS[d.id];
    if (!s || !s.bad) return false;
    return s.bad >= s.ok || (s.ok / s.s) < 0.6;
  }).sort(function(a, b){ return weightOf(b.id) - weightOf(a.id); });
}
function renderStats(){
  var body = el("statBody"); body.innerHTML = "";
  var tot = 0, okc = 0;
  Object.keys(STATS).forEach(function(id){ tot += STATS[id].s; okc += STATS[id].ok; });
  var l1 = document.createElement("div"); l1.className = "stat-line";
  l1.innerHTML = "<span>Zodpovedané spolu</span><b>" + tot + "</b>"; body.appendChild(l1);
  var l2 = document.createElement("div"); l2.className = "stat-line";
  l2.innerHTML = "<span>Úspešnosť</span><b>" + (tot ? Math.round(okc / tot * 100) : 0) + " %</b>"; body.appendChild(l2);
  CATS.forEach(function(c){
    var t = 0, o = 0;
    DICT.forEach(function(d){
      if (d.c === c[0] && STATS[d.id]){ t += STATS[d.id].s; o += STATS[d.id].ok; }
    });
    if (!t) return;
    var l = document.createElement("div"); l.className = "stat-line";
    l.innerHTML = "<span>" + c[1] + "</span><span>" + o + "/" + t + "</span>";
    body.appendChild(l);
    var b = document.createElement("div"); b.className = "bar";
    var bi = document.createElement("i");
    bi.style.width = Math.round(o / t * 100) + "%";
    b.appendChild(bi);
    body.appendChild(b);
  });
  var probs = problemItems();
  if (probs.length){
    var h = document.createElement("h4");
    h.textContent = "🔥 Najproblémovejšie slová";
    h.style.margin = "14px 0 4px";
    body.appendChild(h);
    probs.slice(0, 12).forEach(function(d){
      var s = STATS[d.id];
      var p = document.createElement("div"); p.className = "prob";
      p.innerHTML = "<span>" + dispOf(d) + "</span><small>" + s.ok + "/" + s.s + " správne</small>";
      body.appendChild(p);
    });
  }
  var th = document.createElement("h4");
  th.textContent = "🏆 Trofeje";
  th.style.margin = "14px 0 4px";
  body.appendChild(th);
  ACH.forEach(function(a){
    var un = SET.ach && SET.ach[a.id];
    var p = document.createElement("div"); p.className = "prob";
    if (un){
      p.innerHTML = "<span>" + a.ic + " " + a.n + "</span><small>" + a.d + "</small>";
    } else if (a.secret){
      p.innerHTML = "<span>🔒 ???</span><small>tajomstvo — objav ho pri hraní</small>";
      p.style.opacity = ".6";
    } else {
      p.innerHTML = "<span>🔒 " + a.n + "</span><small>" + a.d + "</small>";
      p.style.opacity = ".6";
    }
    body.appendChild(p);
  });
  if (!tot){
    var e0 = document.createElement("div"); e0.className = "mist";
    e0.textContent = "Zatiaľ tu nič nie je — zahraj si prvé kolo a štatistiky sa objavia.";
    body.appendChild(e0);
  }
}
el("btnProblem").addEventListener("click", function(){
  var items = problemItems();
  if (!items.length){ alert("Zatiaľ žiadne problémové slová. Len tak ďalej!"); return; }
  startRound("quiz", items.slice(0, Math.max(10, Math.min(items.length, SET.count))));
});
el("btnExport").addEventListener("click", function(){
  var data = { app: "pravopisny-trener", ver: "6.1", exported: new Date().toISOString(), stats: STATS, settings: SET };
  var blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pravopisny-trener-stats.json";
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
});
el("btnImport").addEventListener("click", function(){ el("impFile").click(); });
el("impFile").addEventListener("change", function(){
  var f = this.files[0]; if (!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try {
      var obj = JSON.parse(rd.result);
      if (obj && obj.stats){ STATS = cleanStats(obj.stats); saveStats(); }
      if (obj && obj.settings){ SET = cleanSet(obj.settings); saveSet(); applyNight(); }
      renderStats(); refreshHome();
      alert("Import hotový.");
    } catch (e){ alert("Súbor sa nepodarilo načítať — nie je to platný export."); }
  };
  rd.readAsText(f);
  this.value = "";
});
el("btnReset").addEventListener("click", function(){
  if (confirm("Naozaj vymazať všetky štatistiky? Toto sa nedá vrátiť späť.")){
    STATS = {}; saveStats(); renderStats();
  }
});

var ACH = [
  { id:"spekY", ic:"🕵️", n:"Ypsilonový špekulant", d:"Našiel si výber kategórií, kde je každá odpoveď tvrdé y.", secret:true },
  { id:"spekI", ic:"🪶", n:"Íčkový špekulant", d:"Našiel si výber kategórií, kde je každá odpoveď mäkké i.", secret:true },
  { id:"st10", ic:"🔥", n:"Séria 10", d:"10 správnych odpovedí v rade.", secret:false },
  { id:"st20", ic:"🚀", n:"Séria 20", d:"20 správnych odpovedí v rade.", secret:false },
  { id:"perf", ic:"💯", n:"Perfektné kolo", d:"Celé kolo (aspoň 15 slov) bez jedinej chyby.", secret:false },
  { id:"owl", ic:"🦉", n:"Sovia reč", d:"25 klepnutí na sovu — už ti rozumie.", secret:true }
];
var TQ = [], TBUSY = false;
var MSG_LOG = [];
function toast(html, cls, dur, fx){
  TQ.push({ h: html, c: cls, d: dur, f: fx });
  MSG_LOG.unshift({ h: html, ts: Date.now() });
  if (MSG_LOG.length > 12) MSG_LOG.pop();
  pumpToast();
}
function pumpToast(){
  if (TBUSY || !TQ.length) return;
  TBUSY = true;
  var t = TQ.shift();
  var d = document.createElement("div");
  d.className = "toast " + (t.c || "");
  d.innerHTML = t.h;
  document.body.appendChild(d);
  if (t.f === "ach"){ sndFanfare(); confetti(50); }
  if (t.f === "owl"){ sndHoot(); }
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ d.classList.add("onx"); }); });
  var closed = false;
  function close(){
    if (closed) return;
    closed = true;
    d.classList.remove("onx");
    setTimeout(function(){ d.remove(); TBUSY = false; pumpToast(); }, 380);
  }
  d.addEventListener("click", close);
  setTimeout(close, t.d || 12000);
}
function unlock(id){
  if (!SET.ach) SET.ach = {};
  if (SET.ach[id]) return false;
  SET.ach[id] = Date.now();
  saveSet();
  var a = null;
  for (var i = 0; i < ACH.length; i++) if (ACH[i].id === id) a = ACH[i];
  if (a) toast('<div class="t1">🏆 Achievement odomknutý</div><div class="t2">' + a.ic + " " + a.n + '</div><div class="t3">' + a.d + "</div>", "ach", 12600, "ach");
  return true;
}
function achStreak(){
  if (!R || R.egg) return;
  if (R.streak === 10) unlock("st10");
  if (R.streak === 20) unlock("st20");
}
function applyNight(){ document.body.classList.toggle("night", !!SET.night); }
function revealSpek(side){
  var id = side === "i" ? "spekI" : "spekY";
  var hadNight = !!(SET.ach.spekY || SET.ach.spekI);
  var isNew = unlock(id);
  if (!isNew) return;
  if (!hadNight){ SET.night = true; saveSet(); applyNight(); }
  var tip;
  if (side === "y"){
    tip = "Húú! Samé ypsilony — ty špekulant! 🕵️ " + (hadNight ? "" : "Odomkol si 🌙 Nočný zošit, prepínač nájdeš v menu. ") + "A skús pridať kategóriu „Mäkké i po obojakých“ — tam ťa dostanem. 😏";
  } else {
    tip = "Húú! Samé mäkké i — pravidlá si prekukol! 🪶 " + (hadNight ? "" : "Odomkol si 🌙 Nočný zošit, prepínač nájdeš v menu. ") + "A vraj existuje aj ypsilonový trik… 🕵️";
  }
  toast("🦉 " + tip, "owlmsg", 27000, "owl");
}
function bulbOpen(){ return el("bulbOv").classList.contains("onx"); }
function openBulb(){
  renderBulb();
  el("bulbOv").classList.add("onx");
  if (R && R.mode === "arcade" && A){
    if (A.active){
      A.pausedAt = performance.now();
      A.active = false; A.paused = true;
      cancelAnimationFrame(A.raf);
    }
    A.hold = true;
  }
}
function closeBulb(){
  el("bulbOv").classList.remove("onx");
  if (R && R.mode === "arcade" && A){
    A.hold = false;
    if (A.paused){
      A.paused = false;
      A.start = performance.now() - (A.pausedAt - A.start);
      A.active = true;
      A.raf = requestAnimationFrame(fallStep);
    } else if (A.waiting){
      A.waiting = false;
      nextArcade();
    }
  }
}
function renderBulb(){
  var body = el("bulbBody"); body.innerHTML = "";
  var h1 = document.createElement("div"); h1.className = "dict-cat";
  h1.textContent = "🔁 Posledné slová v tomto kole";
  body.appendChild(h1);
  if (R && R.hist && R.hist.length){
    R.hist.slice(0, 12).forEach(function(hrec){
      var d = BYID[hrec.id]; if (!d) return;
      var it = document.createElement("div"); it.className = "dict-item";
      var title = document.createElement("div"); title.className = "dict-word sm";
      var mark = hrec.ok ? "✅ " : "❌ ";
      if (d.t === "w"){
        title.innerHTML = mark + (d.m ? d.m + " " : "") + hlFull(d);
      } else {
        title.innerHTML = mark + (d.m ? d.m + " " : "") + dispOf(d);
      }
      it.appendChild(title);
      if (d.t === "s"){
        var sn = document.createElement("div"); sn.className = "dict-sent";
        sn.innerHTML = hlFull(d);
        it.appendChild(sn);
      }
      var ex = document.createElement("div"); ex.className = "dict-expl";
      ex.textContent = d.e;
      it.appendChild(ex);
      body.appendChild(it);
    });
  } else {
    var e1 = document.createElement("div"); e1.className = "dict-expl";
    e1.textContent = "Zatiaľ nič — odpovedz na prvé slovo a objaví sa tu aj s pravidlom.";
    body.appendChild(e1);
  }
  var h2 = document.createElement("div"); h2.className = "dict-cat";
  h2.textContent = "📬 Posledné správy";
  body.appendChild(h2);
  if (MSG_LOG.length){
    MSG_LOG.forEach(function(msg){
      var it = document.createElement("div"); it.className = "dict-item";
      it.innerHTML = msg.h;
      body.appendChild(it);
    });
  } else {
    var e2 = document.createElement("div"); e2.className = "dict-expl";
    e2.textContent = "Zatiaľ žiadne správy. Achievementy a sovie odkazy sa zobrazia tu.";
    body.appendChild(e2);
  }
}
el("qBulb").addEventListener("click", openBulb);
el("aBulb").addEventListener("click", openBulb);
el("fBulb").addEventListener("click", openBulb);
el("bulbClose").addEventListener("click", closeBulb);
el("bulbOv").addEventListener("click", function(ev){ if (ev.target === this) closeBulb(); });

el("btnNight").addEventListener("click", function(){
  if (this.disabled) return;
  SET.night = !SET.night;
  saveSet(); applyNight(); refreshHome();
});
el("owlBtn").addEventListener("click", function(){
  var o = this;
  o.classList.remove("hop"); void o.offsetWidth; o.classList.add("hop");
  SET.owlTaps = (SET.owlTaps || 0) + 1;
  saveSet();
  if (SET.owlTaps % 5 === 0){ sndHoot(); confetti(14, ["🦉","🪶","✨"]); }
  if (SET.owlTaps === 25) unlock("owl");
});

function norm(t){
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function hlFull(d){
  var full = fullOf(d);
  var pos = d.x.indexOf("_");
  var cls = isSoft(d.a) ? "hl-i" : "hl-y";
  return full.slice(0, pos) + "<span class=\"" + cls + "\">" + d.a + "</span>" + full.slice(pos + 1);
}
function renderDict(q){
  var body = el("dictBody"); body.innerHTML = "";
  var nq = q ? norm(q) : "";
  var shown = 0;
  CATS.forEach(function(c){
    var items = DICT.filter(function(d){ return d.c === c[0]; });
    if (nq){
      items = items.filter(function(d){
        return norm(fullOf(d)).indexOf(nq) >= 0 || (d.w && norm(d.w).indexOf(nq) >= 0);
      });
    }
    if (!items.length) return;
    var h = document.createElement("div");
    h.className = "dict-cat";
    h.textContent = c[1] + " (" + items.length + ")";
    body.appendChild(h);
    items.forEach(function(d){
      var it = document.createElement("div"); it.className = "dict-item";
      var title = document.createElement("div"); title.className = "dict-word";
      if (d.t === "w"){
        title.innerHTML = (d.m ? d.m + " " : "") + hlFull(d);
      } else {
        title.innerHTML = (d.m ? d.m + " " : "") + dispOf(d);
      }
      it.appendChild(title);
      if (d.t === "s"){
        var sn = document.createElement("div"); sn.className = "dict-sent";
        sn.innerHTML = hlFull(d);
        it.appendChild(sn);
      }
      var ex = document.createElement("div"); ex.className = "dict-expl";
      ex.textContent = d.e;
      it.appendChild(ex);
      body.appendChild(it); shown++;
    });
  });
  if (!shown){
    var e0 = document.createElement("div"); e0.className = "mist";
    e0.textContent = "Nič sa nenašlo. Skús to bez diakritiky alebo kratšie.";
    body.appendChild(e0);
  }
}
el("btnDict").addEventListener("click", function(){
  el("dictSearch").value = "";
  renderDict("");
  show("scr-dict");
});
el("dictSearch").addEventListener("input", function(){ renderDict(this.value.trim()); });

document.addEventListener("keydown", function(ev){
  var k = ev.key ? ev.key.toLowerCase() : "";
  if (bulbOpen()){
    if (k === "escape" || k === "enter"){ ev.preventDefault(); closeBulb(); }
    return;
  }
  if (scrOn("scr-quiz")){
    if (k === "i") answerQuiz(true);
    else if (k === "y") answerQuiz(false);
    else if (k === "enter" && el("qNext").style.display === "block"){ ev.preventDefault(); R.i++; nextQuiz(); }
  } else if (scrOn("scr-arcade")){
    if (k === "i") arcAnswer(true);
    else if (k === "y") arcAnswer(false);
  } else if (scrOn("scr-find")){
    if (k === "enter" && el("fNext").style.display === "block"){ ev.preventDefault(); R.i++; nextFind(); }
  }
});

renderCats();
refreshHome();
applyNight();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")){
  window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js"); });
}
