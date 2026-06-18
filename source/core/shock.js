// ===== source/core/shock.js — choque séptico & misto (canônico) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). DOIS sub-modelos distintos, em
// namespaces separados para tornar IMPOSSÍVEL a colisão de nomes que existe nos engines
// (m21.applyPressor sobe a RVS; m23.applyPressor soma tônus exógeno — mesmo nome,
// semântica divergente; idem lactate/deficit). Forma canônica de model21 e model23.
//   septic    — cascata de 3 compartimentos (convectivo→difusivo→utilização) [m21]
//   composite — composição de termos quebrados + atribuição + mascaramento     [m23]
// Âncoras: CHOQUE.md §2/§10 / modulos.md §21/§23.

// ---------------- septic [m21] ----------------
var S_SAT=0.97, S_LAC_BASE=1.0, S_LAC_K=0.045;
function s_caO2(hb){ return 1.34*hb*S_SAT + 0.003*95; }
function s_macroDO2(co, hb){ return co*s_caO2(hb)*10; }                 // convectivo (mL/min)
function s_map(co, rvsWood, pvc){ if(pvc===undefined)pvc=5; return pvc + co*rvsWood; }
function s_tissueAvailable(P){ return s_macroDO2(P.co,P.hb) * (1 - Math.max(0,Math.min(0.9,P.shunt))) * Math.max(0,Math.min(1,P.glyco)); }
function s_usable(P){ return s_tissueAvailable(P) * Math.max(0,Math.min(1,P.mito)); }
function s_vo2Actual(P){ return Math.min(P.demand, s_usable(P)); }
function s_deficit(P){ return Math.max(0, P.demand - s_vo2Actual(P)); }
function s_lactate(P){ return S_LAC_BASE + S_LAC_K*s_deficit(P); }
function s_o2er(P){ var d=s_macroDO2(P.co,P.hb); return d>0 ? s_vo2Actual(P)/d : 0; }
function s_svo2(P){ return S_SAT*(1 - s_o2er(P)); }
function s_paradoxo(P){ return s_svo2(P) > 0.70 && s_deficit(P) > 0; }
function s_applyPressor(P){ var s=Object.assign({}, P); s.rvsWood=(P.rvsWood||9)+7; return s; }
function s_applyMicro(P){ var s=Object.assign({}, P); s.shunt=Math.max(0.05,P.shunt-0.4); s.glyco=Math.min(1,P.glyco+0.3); return s; }
function s_applyMito(P){ var s=Object.assign({}, P); s.mito=Math.min(1,P.mito+0.35); return s; }

var septic = { SAT:S_SAT, LAC_BASE:S_LAC_BASE, LAC_K:S_LAC_K,
  caO2:s_caO2, macroDO2:s_macroDO2, map:s_map, tissueAvailable:s_tissueAvailable,
  usable:s_usable, vo2Actual:s_vo2Actual, deficit:s_deficit, lactate:s_lactate,
  o2er:s_o2er, svo2:s_svo2, paradoxo:s_paradoxo,
  applyPressor:s_applyPressor, applyMicro:s_applyMicro, applyMito:s_applyMito };

// ---------------- composite [m23] ----------------
var BASE = {
  SVmax:75, HRrest:75, HRmax:160, RVSnorm:1100, PVC:6, Hb:14, PaO2:95, demand:320,
  kPreHypo:0.72, kPreObstr:0.62, kContr:0.72, kRvsDistr:0.62,
  extrCap0:0.62, kExtrSeptic:0.70, kSaO2Hypox:0.22,
  kCompHR:70, kCompRVS:520, kPressor:420, LAC_K:0.020, LAC_MAX:14,
  PAM_target:70
};
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }
function clamp01(v){ return clampv(v||0,0,1); }

function mixed(p){
  p = p||{};
  var B=BASE;
  var hypo=clamp01(p.hypo), cardio=clamp01(p.cardio), obstr=clamp01(p.obstr),
      distr=clamp01(p.distr), septic=clamp01(p.septic), hypox=clamp01(p.hypox);
  var comp = (p.comp==null?0.7:clamp01(p.comp));
  var pressor = clamp01(p.pressor);

  var preloadF = clampv(1 - B.kPreHypo*hypo - B.kPreObstr*obstr, 0.12, 1);
  var contract = clampv(1 - B.kContr*cardio, 0.18, 1);
  var SaO2     = clampv(0.97 - B.kSaO2Hypox*hypox, 0.60, 0.99);
  var CaO2     = 1.34*B.Hb*SaO2 + 0.003*B.PaO2;
  var rvsOpen  = B.RVSnorm*(1 - B.kRvsDistr*distr);

  var SV = B.SVmax*preloadF*contract;
  var DC0 = B.HRrest*SV/1000;
  var PAM0 = B.PVC + DC0*rvsOpen/80;
  var threat = clampv((B.PAM_target - PAM0)/B.PAM_target, 0, 1);

  var HR  = clampv(B.HRrest + comp*B.kCompHR*threat, 40, B.HRmax);
  var rvs = clampv(rvsOpen + comp*B.kCompRVS*threat + B.kPressor*pressor, 250, 2400);

  var DC  = HR*SV/1000;
  var PAM = B.PVC + DC*rvs/80;
  var DO2 = DC*CaO2*10;
  var extrCap = clampv(B.extrCap0*(1 - B.kExtrSeptic*septic), 0.10, B.extrCap0);
  var available = DO2*extrCap;
  var VO2 = Math.min(B.demand, available);
  var deficit = Math.max(0, B.demand - VO2);
  var lactate = clampv(1.0 + B.LAC_K*deficit, 1.0, B.LAC_MAX);

  var congestion = clampv((0.62*cardio + 0.38*obstr)*(0.45+preloadF), 0, 1.2);

  return { hypo:hypo, cardio:cardio, obstr:obstr, distr:distr, septic:septic, hypox:hypox, comp:comp,
    preloadF:preloadF, contract:contract, SaO2:SaO2, CaO2:CaO2, rvsOpen:rvsOpen, rvs:rvs,
    SV:SV, HR:HR, DC:DC, PAM:PAM, DO2:DO2, extrCap:extrCap, available:available, VO2:VO2,
    deficit:deficit, lactate:lactate, congestion:congestion, threat:threat };
}

var TERMS = ['hypo','cardio','obstr','distr','septic','hypox'];

function attribution(p){
  var full = mixed(p), out = {};
  TERMS.forEach(function(k){
    var off = Object.assign({}, p); off[k]=0;
    out[k] = Math.max(0, full.deficit - mixed(off).deficit);
  });
  return out;
}
function dominantTerm(p){
  var a = attribution(p), best='none', bv=0;
  TERMS.forEach(function(k){ if(a[k]>bv){ bv=a[k]; best=k; } });
  return best;
}
function activeTerms(p){ p=p||{}; return TERMS.filter(function(k){ return clamp01(p[k])>=0.2; }); }
function masking(R){ return R.PAM >= 65 && R.deficit > 0; }

function applyVolume(p){ var s=Object.assign({},p); s.hypo=Math.max(0,(p.hypo||0)-0.5); return s; }
function applyPressor(p){ var s=Object.assign({},p); s.pressor=Math.min(1,(p.pressor||0)+0.6); return s; }
function applyInotrope(p){ var s=Object.assign({},p); s.cardio=Math.max(0,(p.cardio||0)-0.5); return s; }

var composite = { BASE:BASE, TERMS:TERMS, clampv:clampv, clamp01:clamp01,
  mixed:mixed, attribution:attribution, dominantTerm:dominantTerm, activeTerms:activeTerms,
  masking:masking, applyVolume:applyVolume, applyPressor:applyPressor, applyInotrope:applyInotrope };

if (typeof module !== 'undefined' && module.exports){
  module.exports = { septic:septic, composite:composite };
}
