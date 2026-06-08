// ===== model20.js — Choque distributivo (categoria) · PERFUNDE·CHOCA módulo 20 =====
// O TERMO QUEBRADO É A RVS — e a extração se inverte. Reusa o núcleo PAM=DC×RVS (m9) e
// a extração (m12). O distributivo é um DUPLO PARADOXO:
//   MACRO: PAM = PVC + DC·RVS/80. A RVS despenca; mesmo DC alto (hiperdinâmico) NÃO resgata,
//          porque a hipérbole iso-PAM é plana em RVS baixa. O α1 (RVS) é o EIXO da correção.
//   MICRO: a distribuição/extração falha → ScvO₂ SOBE (sangue passa sem ser usado) com lactato
//          ALTO e tecido faminto. SAGACIDADE: ScvO₂ alta SOZINHA é ambígua (todo estado
//          hiperdinâmico tem ScvO₂ alta); só ScvO₂ alta + LACTATO alto = falência de extração.
// Funções PURAS, determinísticas. Âncoras: CHOQUE.md §2/§3/§10 · modulos.md §20.

// ---- macro: PAM = PVC + DC·RVS/80 (RVS em dyn·s·cm⁻⁵; idêntico ao m9) ----
function pam(dc, rvsDyn, pvc){ if(pvc===undefined)pvc=5; return pvc + dc*rvsDyn/80; }
function rvsForPam(pamVal, dc, pvc){ if(pvc===undefined)pvc=5; return 80*(pamVal-pvc)/dc; }   // hipérbole iso-PAM
function rvsWood(rvsDyn){ return rvsDyn/80; }

var BASE = {
  RVS_floor:500, kTonus:1100, kPressor:750,   // RVS_dyn = floor + kTonus·tonus + kPressor·pressor
  PVC:5, SaO2:0.98, CaO2:20, demand:250,       // demanda de VO₂ (mL/min)
  E0:0.55, eExp:1.5,                           // extração efetiva máxima E_eff = E0·integridade^eExp
  kLac:0.020, LAC_MAX:12, HR0:75, HRmax:170
};
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }

// RVS efetiva (dyn) a partir do tônus intrínseco (0..1) e do vasopressor exógeno (0..1).
function rvsEff(tonus, pressor){ return clampv(BASE.RVS_floor + BASE.kTonus*tonus + BASE.kPressor*(pressor||0), 200, 2600); }

// Extração efetiva máxima (fração) — colapsa com a falência de distribuição/micro.
function extractionCeil(integridade){ return BASE.E0 * Math.pow(clampv(integridade,0,1), BASE.eExp); }

// Estado distributivo completo.
// p = { tonus (0..1), DC (L/min), pressor (0..1), extracao (integridade 0..1), hr? }
function distState(p){
  var B=BASE, tonus=p.tonus, DC=p.DC, pressor=p.pressor||0, integ=(p.extracao===undefined?1:p.extracao);
  var RVSdyn=rvsEff(tonus, pressor);
  var PAM=pam(DC, RVSdyn, B.PVC);
  var DO2=DC*B.CaO2*10;                              // mL O₂/min (alta no hiperdinâmico)
  var Eeff=extractionCeil(integ);
  var ceiling=DO2*Eeff;                             // O₂ extraível pelo tecido
  var VO2=Math.min(B.demand, ceiling);
  var deficit=Math.max(0, B.demand-ceiling);
  var O2ER=VO2/DO2;                                 // extração GLOBAL aparente
  var ScvO2=B.SaO2*(1-O2ER);                        // proxy venoso — SOBE quando a extração falha
  var lactate=Math.min(B.LAC_MAX, 1.0 + B.kLac*deficit);
  var sev=clampv((90-PAM)/40,0,1);
  var hr=p.hr || Math.min(B.HRmax, B.HR0*(1+0.5*sev));
  return { tonus:tonus, DC:DC, pressor:pressor, extracao:integ,
    RVSdyn:RVSdyn, RVSwood:rvsWood(RVSdyn), PAM:PAM, PVC:B.PVC,
    DO2:DO2, Eeff:Eeff, ceiling:ceiling, VO2:VO2, deficit:deficit, O2ER:O2ER, ScvO2:ScvO2,
    lactate:lactate, HR:hr, sev:sev };
}

// O paradoxo da extração (booleano didático): ScvO₂ alta E tecido faminto (lactato/déficit).
function inversaoExtracao(R){ return R.ScvO2 > 0.75 && R.lactate > 2.0 && R.deficit > 0; }
// A ARMADILHA da ScvO₂: alta SEM falência de extração (estado hiperdinâmico, lactato normal).
function scvO2Ambigua(R){ return R.ScvO2 > 0.75 && R.lactate < 1.8; }

// Veredito (assinatura fisiológica, NÃO conduta): RVS baixa + PAM baixa = distributivo.
function classeDist(R){
  var vasoplegic = R.RVSdyn < 900;
  var hypotensive = R.PAM < 65;
  if (hypotensive && vasoplegic) return 'distributivo';
  if (hypotensive || (vasoplegic && R.lactate>2)) return 'limitrofe';
  return 'compensado';
}

// Eficiência da alavanca: de quanto sobe a PAM ao corrigir o TERMO QUEBRADO (RVS, via pressor)
// vs ao empurrar o DC. Quantifica "o termo quebrado escolhe a alavanca".
function ganhoPAM_porRVS(R){ return R.DC/80*BASE.kPressor; }    // dPAM por unidade de pressor
function ganhoPAM_porDC(R){ return R.RVSdyn/80; }               // dPAM por L/min de DC

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, pam, rvsForPam, rvsWood, rvsEff, extractionCeil, distState,
    inversaoExtracao, scvO2Ambigua, classeDist, ganhoPAM_porRVS, ganhoPAM_porDC };
}
