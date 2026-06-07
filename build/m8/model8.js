// ===== model8.js — DO₂/VO₂ & supply-dependence · PERFUNDE·CHOCA módulo 8 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §2 / modulos.md §8.
//
// A curva BIFÁSICA do consumo de oxigênio:
//   acima do DO₂crítico → VO₂ é INDEPENDENTE da entrega (platô): a extração sobe para compensar.
//   abaixo do DO₂crítico → a extração está no MÁXIMO (O₂ERmax); VO₂ passa a DEPENDER da entrega
//                          (cai linearmente) → déficit de O₂ → metabolismo anaeróbio → LACTATO.
//   DO₂crítico = VO₂(demanda) / O₂ERmax  — o joelho onde o lactato nasce.

var O2ERMAX = 0.6;        // extração máxima alcançável (fração)
var LACT_BASE = 1.0;      // lactato basal (mmol/L)
var LACT_K = 0.03;        // mmol/L por mL/min de déficit de O₂ (mapeamento didático)

// Entrega (mL O₂/min): reusa a aritmética do módulo 0. co L/min, cao2 mL/dL.
function do2(co, cao2){ return co*cao2*10; }

// DO₂ crítico (mL O₂/min): onde a extração máxima já não cobre a demanda.
function do2crit(vo2demand, o2ermax){ if(o2ermax===undefined)o2ermax=O2ERMAX; return vo2demand/o2ermax; }

// Consumo de O₂ (mL/min): platô (=demanda) acima do crítico; rampa (=O₂ERmax·DO₂) abaixo.
function vo2(do2val, vo2demand, o2ermax){
  if(o2ermax===undefined)o2ermax=O2ERMAX;
  var crit=do2crit(vo2demand,o2ermax);
  return (do2val>=crit) ? vo2demand : o2ermax*do2val;
}

// Taxa de extração (fração): sobe ao cair a DO₂; satura em O₂ERmax abaixo do crítico.
function o2er(do2val, vo2demand, o2ermax){
  if(do2val<=0) return 0;
  return vo2(do2val,vo2demand,o2ermax)/do2val;
}

// SvO₂ aproximada (fração): SaO₂·(1 − O₂ER). Ignora o O₂ dissolvido (declarado).
function svo2(do2val, sao2, vo2demand, o2ermax){
  if(sao2===undefined)sao2=0.98;
  return sao2*(1 - o2er(do2val,vo2demand,o2ermax));
}

// Déficit de O₂ (mL/min) abaixo do crítico e lactato resultante (mmol/L).
function o2deficit(do2val, vo2demand, o2ermax){ return Math.max(0, vo2demand - vo2(do2val,vo2demand,o2ermax)); }
function lactate(do2val, vo2demand, o2ermax){ return LACT_BASE + LACT_K*o2deficit(do2val,vo2demand,o2ermax); }

if (typeof module!=='undefined' && module.exports){
  module.exports = { O2ERMAX, LACT_BASE, do2, do2crit, vo2, o2er, svo2, o2deficit, lactate };
}
