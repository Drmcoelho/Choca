// ===== source/core/oxygen.js — cadeia do oxigênio (canônica) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). Forma canônica de CaO₂, DO₂,
// VO₂, O₂ER, SvO₂, DO₂crítico e lactato — reconciliando model0/model1/model8.
// Âncoras: CHOQUE.md §2/§4. Hb 15 · SaO₂ 100% · PaO₂ 100 → ligado 20,1 · dissolvido
// 0,30 · total ~20,4 mL/dL. O teste de conformância exige que os engines casem com isto.

var U = (typeof require !== 'undefined') ? require('./units.js') : window.CoreUnits;
var DL_PER_L = U.DL_PER_L, asFrac = U.asFrac;

// Constante de Hüfner: mL O₂ por g de Hb 100% saturada (convenção do braço, CHOQUE.md §2).
var K_HUFNER = 1.34;
// Solubilidade do O₂ dissolvido no plasma: mL O₂ / dL / mmHg (a letra-miúda).
var K_DISSOLVIDO = 0.003;

// CaO₂ — conteúdo arterial de O₂ (mL O₂ / dL). Devolve as parcelas p/ a barra empilhada.
// hb g/dL · sat (fração ou %) · pao2 mmHg. Normaliza sat como o model1.
function caO2(hb, sat, pao2){
  var s = asFrac(sat);
  var ligado = K_HUFNER * hb * s;        // O₂ ligado à Hb — a quase totalidade
  var dissolvido = K_DISSOLVIDO * pao2;  // O₂ fisicamente dissolvido — quase desprezível
  return { ligado: ligado, dissolvido: dissolvido, total: ligado + dissolvido };
}
// Atalho: só o total (mL/dL).
function ca(hb, sat, pao2){ return caO2(hb, sat, pao2).total; }

// DO₂ — entrega de O₂ (mL O₂ / min). co L/min · cao2 mL/dL. ×10 converte dL→L.
function do2(co, cao2){ return co * cao2 * DL_PER_L; }

// VO₂ por Fick — consumo de O₂ (mL O₂ / min). co L/min · ca,cv mL/dL.
function vo2Fick(co, ca, cv){ return co * (ca - cv) * DL_PER_L; }

// O₂ER — taxa de extração (fração). As duas formas equivalentes: VO₂/DO₂ ≡ (Ca−Cv)/Ca.
function o2er(vo2val, do2val){ return vo2val / do2val; }
function o2erConteudos(ca, cv){ return (ca - cv) / ca; }

// — Curva BIFÁSICA do consumo (model8): platô acima do crítico, rampa abaixo. —
var O2ERMAX = 0.6;        // extração máxima alcançável (fração)
var LACT_BASE = 1.0;      // lactato basal (mmol/L)
var LACT_K = 0.03;        // mmol/L por mL/min de déficit de O₂

// DO₂ crítico (mL O₂/min): o joelho onde a extração máxima já não cobre a demanda.
function do2crit(vo2demand, o2ermax){ if(o2ermax===undefined)o2ermax=O2ERMAX; return vo2demand/o2ermax; }

// Consumo supply-dependent (mL/min): demanda acima do crítico; O₂ERmax·DO₂ abaixo.
function vo2Supply(do2val, vo2demand, o2ermax){
  if(o2ermax===undefined)o2ermax=O2ERMAX;
  var crit=do2crit(vo2demand,o2ermax);
  return (do2val>=crit) ? vo2demand : o2ermax*do2val;
}

// O₂ER efetiva sob a curva bifásica: sobe ao cair a DO₂; satura em O₂ERmax.
function o2erSupply(do2val, vo2demand, o2ermax){
  if(do2val<=0) return 0;
  return vo2Supply(do2val,vo2demand,o2ermax)/do2val;
}

// SvO₂ aproximada (fração): SaO₂·(1 − O₂ER). Ignora o O₂ dissolvido (declarado).
function svo2(do2val, sao2, vo2demand, o2ermax){
  if(sao2===undefined)sao2=0.98;
  return sao2*(1 - o2erSupply(do2val,vo2demand,o2ermax));
}

// Déficit de O₂ (mL/min) abaixo do crítico e o lactato resultante (mmol/L).
function o2deficit(do2val, vo2demand, o2ermax){ return Math.max(0, vo2demand - vo2Supply(do2val,vo2demand,o2ermax)); }
function lactate(do2val, vo2demand, o2ermax){ return LACT_BASE + LACT_K*o2deficit(do2val,vo2demand,o2ermax); }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { K_HUFNER, K_DISSOLVIDO, O2ERMAX, LACT_BASE, LACT_K,
    caO2, ca, do2, vo2Fick, o2er, o2erConteudos,
    do2crit, vo2Supply, o2erSupply, svo2, o2deficit, lactate };
}
