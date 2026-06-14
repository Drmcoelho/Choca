// ===== model26.js — Choque críptico/compensado (o precipício) · PERFUNDE·CHOCA módulo 26 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md / modulos.md §26. Integra M8/M9/M13/M14.
// TESE: a PAM normal MENTE. A compensação (vasoconstrição/RVS↑, taquicardia, extração↑) defende a PRESSÃO
//   enquanto a ENTREGA já caiu. Mas a compensação tem RESERVA FINITA: o paciente fica "estável" na macro
//   até a reserva esgotar — e então DESPENCA (o PRECIPÍCIO). É flat, flat, flat... e despenca.
// Os MARCADORES OCULTOS denunciam o choque ANTES do precipício, mesmo com PAM normal:
//   lactato↑ · extração↑ (SvO₂↓) · perfusão periférica ruim (mosqueamento/enchimento lento) · pressão de pulso ESTREITA.
// E a armadilha: um pequeno estressor extra (sedação/indução, sangramento, broncoaspiração) consome a reserva
//   que restava → o "estável" CODA. Mecanismo, SEM conduta/dose.

var BASE = {
  PAM0:92, kPAMfall:62, PAM_crit:65,        // PAM = PAM0 enquanto a reserva cobre; cai kPAMfall por unidade de gap NÃO-compensado
  LAC_BASE:1.0, LAC_K:12, LAC_KNEE:0.12,     // lactato sobe com o déficit (oculto), a partir de um pequeno joelho
  SaO2:0.98, O2ER0:0.28, kO2ER:0.55,         // extração basal 28%; sobe com a compensação desdobrada → SvO₂ cai
  CR0:1.8, kCR:4.2,                          // enchimento capilar (s) piora com a vasoconstrição compensatória
  PP0:48, kPP:30,                            // pressão de pulso estreita com a vasoconstrição
  HR0:74, kHR:60,                            // taquicardia faz parte da compensação (some no β-bloqueado)
  RES_CLIFF:0.85                             // reserva usada > 85% = à beira do precipício
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }

// Estado dado a gravidade do insulto e a reserva compensatória disponível.
// p = { insult(0..1 gravidade do choque subjacente), reserve(0..1 reserva autonômica), betaBlock(0..1 limita a taquicardia) }
function cryptic(p){
  p=p||{}; var B=BASE;
  var insult=clamp01(p.insult), reserve=(p.reserve==null?0.8:clamp01(p.reserve)), betaBlock=clamp01(p.betaBlock);

  // a compensação tenta cobrir o "gap" de pressão imposto pelo insulto, até o teto da reserva
  var compNeed = insult;
  var compDeployed = Math.min(compNeed, reserve);
  var uncompGap = Math.max(0, compNeed - reserve);          // gap que a reserva NÃO cobre
  var reserveUsed = (reserve>0 ? compDeployed/reserve : 1);  // fração da reserva já gasta

  // PAM: defendida (≈ PAM0) enquanto a reserva cobre; DESPENCA quando o gap excede a reserva (o precipício)
  var PAM = clampv(B.PAM0 - B.kPAMfall*uncompGap, 30, 100);

  // marcadores OCULTOS — dependem do insulto/compensação, NÃO da PAM
  var deficit = insult;                                      // déficit de entrega (proxy normalizado), presente mesmo com PAM normal
  var lactate = clampv(B.LAC_BASE + B.LAC_K*Math.max(0, deficit-B.LAC_KNEE), 1.0, 14);
  var o2er = clampv(B.O2ER0 + B.kO2ER*compDeployed, 0.2, 0.85);
  var svo2 = clampv(B.SaO2*(1-o2er), 0.20, 0.85);
  var capRefill = clampv(B.CR0 + B.kCR*compDeployed, 1.5, 8);
  var pulsePressure = clampv(B.PP0 - B.kPP*compDeployed, 12, 60);
  var HR = clampv(B.HR0 + B.kHR*compDeployed*(1-0.8*betaBlock), 50, 170);    // β-bloqueio mascara a taquicardia compensatória

  return { insult:insult, reserve:reserve, betaBlock:betaBlock,
    compDeployed:compDeployed, uncompGap:uncompGap, reserveUsed:reserveUsed,
    PAM:PAM, deficit:deficit, lactate:lactate, o2er:o2er, svo2:svo2, capRefill:capRefill, pulsePressure:pulsePressure, HR:HR };
}

// Há choque oculto? PAM "aceitável" (≥ crítico) MAS marcadores de hipoperfusão presentes.
function occult(R){ return R.PAM >= BASE.PAM_crit && (R.lactate > 2.0 || R.svo2 < 0.65); }
// À beira do precipício: ainda compensado (PAM ok) mas quase toda a reserva foi gasta.
function nearCliff(R){ return R.PAM >= BASE.PAM_crit && R.reserveUsed >= BASE.RES_CLIFF; }

// Estado clínico-fisiológico.
function stage(p){ var R=cryptic(p);
  if(R.PAM < BASE.PAM_crit) return 'descompensado';   // a pressão já caiu — choque manifesto
  if(occult(R)){ return nearCliff(R) ? 'precipicio' : 'criptico'; }
  return 'normal';
}

// O insulto em que a PAM começa a cair = a reserva (onde o precipício começa).
function cliffInsult(p){ p=p||{}; return clamp01(p.reserve==null?0.8:p.reserve); }

// ---- Estressores (mecanismo, SEM conduta) — consomem a reserva que restava ----
// Sedação/indução: remove o tônus simpático → derruba a reserva (revela/precipita o colapso).
function applySedation(p){ p=p||{}; var s=Object.assign({},p); s.reserve=Math.max(0,(p.reserve==null?0.8:p.reserve)-0.35); return s; }
// Novo insulto (sangramento, broncoaspiração): agrava o choque subjacente.
function applyHit(p){ p=p||{}; var s=Object.assign({},p); s.insult=Math.min(1,(p.insult||0)+0.2); return s; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, cryptic, occult, nearCliff, stage, cliffInsult, applySedation, applyHit };
}
