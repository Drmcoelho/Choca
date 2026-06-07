// ===== model18.js — Choque obstrutivo (categoria) · PERFUNDE·CHOCA módulo 18 =====
// GUYTON DE NOVO, MAS INVERTIDO. A obstrução é mecânica: uma PRESSÃO EXTERNA (pericárdica
// no tamponamento; intratorácica no pneumotórax hipertensivo / auto-PEEP) desloca as duas
// curvas do plano de Guyton. O resultado é a ASSINATURA ESPECULAR do hipovolêmico:
//   PVC (Pra medido) ALTA  +  DC BAIXO  —  ao contrário do hipovolêmico (PVC baixa).
// Funções PURAS, determinísticas. Âncoras: CHOQUE.md §3/§5 · modulos.md §18. Ponte: auto-PEEP (braço 1, mvp1).

// ---- Guyton base (idêntico ao m4/m14) ----
function venousReturn(pra, Pmsf, Rvr, colapso){
  if (colapso === undefined) colapso = -4;
  if (pra >= Pmsf) return 0;
  var p = (pra < colapso) ? colapso : pra;   // abaixo do colapso (= Pext), o RV satura
  return (Pmsf - p) / Rvr;
}
function cardiacOutput(praTm, COmax, pra0, K){   // praTm = pressão TRANSMURAL (pra − Pext)
  if (pra0 === undefined) pra0 = -2;
  if (K === undefined) K = 2;
  var d = praTm - pra0; if (d <= 0) return 0;
  return COmax * d / (K + d);
}

var BASE = {
  Pmsf0:8.0, Rvr0:1.2, COmax0:7.5, pra0:-2, K:2,
  RVS0:17.0, HR0:75, HRmax:165, Cart:1.7,
  kVeno:0.70,   // venoconstrição compensatória: Pmsf sobe ~0,7 mmHg por mmHg de Pext (mantém gradiente)
  volBoost:12,  // mmHg de Pmsf adicionados por unidade de "volume" reposto (0..1)
  kArt:0.42, kHR:0.55,        // compensação arterial/cronotrópica leve
  DCcrit:3.2, kLac:2.6
};
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }

// Pressão sistêmica média de enchimento efetiva (compensação venosa + volume).
function pmsfEff(Pext, vol){ return BASE.Pmsf0 + BASE.kVeno*Pext + BASE.volBoost*(vol||0); }

// Interseção no plano (Pra MEDIDO, fluxo), com a função cardíaca deslocada por Pext
// e o colapso venoso elevado a Pext. Bisseção robusta em pra ∈ [Pext, Pmsf].
function intersecaoObs(Pext, Pmsf, Rvr, COmax, pra0, K){
  var f=function(pra){ return venousReturn(pra,Pmsf,Rvr,Pext) - cardiacOutput(pra-Pext,COmax,pra0,K); };
  // lo: onde a função cardíaca começa (transmural = pra0 → CO=0); a curva de RV está no platô de colapso.
  // hi: Pra = Pmsf (RV = 0). A raiz pode cair NO platô (pra < Pext) quando a compressão é forte.
  var lo=Pext+pra0, hi=Pmsf;
  if (hi<=lo) return { pra:Math.max(Pext,Pmsf), co:0 };       // Pmsf não supera a compressão → sem fluxo
  if (f(lo)<=0) return { pra:lo, co:cardiacOutput(lo-Pext,COmax,pra0,K) };
  for (var i=0;i<80;i++){ var mid=(lo+hi)/2; if(f(mid)>0) lo=mid; else hi=mid; }
  var praStar=(lo+hi)/2; return { pra:praStar, co:cardiacOutput(praStar-Pext,COmax,pra0,K) };
}

// Estado hemodinâmico dado o cenário obstrutivo.
// p = { Pext (pressão externa mmHg), vol (volume reposto 0..1), hr }
function obsState(p){
  var B=BASE, Pext=p.Pext||0, vol=p.vol||0;
  var Pmsf=pmsfEff(Pext, vol);
  var inter=intersecaoObs(Pext, Pmsf, B.Rvr0, B.COmax0, B.pra0, B.K);
  var DC=Math.max(0, inter.co), CVP=inter.pra;          // CVP = Pra MEDIDO (alto na obstrução)
  var transmural=CVP-Pext;                              // o enchimento REAL (baixo)
  var sev=clampv((5.0-DC)/5.0, 0, 1);                   // gravidade pela queda de DC
  var RVSw=B.RVS0*(1+B.kArt*sev);
  var hr=p.hr || Math.min(B.HRmax, B.HR0*(1+B.kHR*sev));
  var MAP=DC*RVSw + 0.3*CVP;                            // contribuição venosa pequena
  var SVml=DC*1000/hr, PP=SVml/B.Cart, SBP=MAP+2*PP/3, DBP=MAP-PP/3, SI=hr/SBP;
  var lactate=Math.min(15, 1.0 + B.kLac*Math.max(0, B.DCcrit-DC));
  return { Pext:Pext, vol:vol, Pmsf:Pmsf, Rvr:B.Rvr0, COmax:B.COmax0, pra0:B.pra0, K:B.K,
    DC:DC, CVP:CVP, transmural:transmural, RVSw:RVSw, HR:hr, MAP:MAP, SVml:SVml, PP:PP,
    SBP:SBP, DBP:DBP, SI:SI, lactate:lactate, sev:sev };
}

// Veredito (assinatura fisiológica, NÃO conduta): PVC alta + DC baixo = obstrutivo.
function classeObs(R){
  var cvpHigh=R.CVP>=10, low=R.DC<3.5;
  if (R.DC<2.2 && cvpHigh) return 'colapso';
  if (cvpHigh && low) return 'obstrutivo';
  if (low) return 'limitrofe';
  return 'normal';
}

// Estado HIPOVOLÊMICO de comparação (Pmsf↓, sem Pext) com o MESMO DC-alvo, para o contraste
// didático: mesma queda de DC, mas PVC BAIXA (o espelho). Reduz Pmsf até bater o DC pedido.
function hipoComparavel(DCalvo){
  var B=BASE, lo=1.0, hi=8.0;
  for (var i=0;i<60;i++){ var Pmsf=(lo+hi)/2;
    var inter=intersecaoObs(0, Pmsf, B.Rvr0, B.COmax0, B.pra0, B.K);
    if (inter.co > DCalvo) hi=Pmsf; else lo=Pmsf; }
  var Pmsf=(lo+hi)/2, it=intersecaoObs(0,Pmsf,B.Rvr0,B.COmax0,B.pra0,B.K);
  return { Pmsf:Pmsf, DC:it.co, CVP:it.pra };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, venousReturn, cardiacOutput, pmsfEff, intersecaoObs, obsState, classeObs, hipoComparavel };
}
