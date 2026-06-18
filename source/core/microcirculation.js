// ===== source/core/microcirculation.js — micro (canônica) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). O desacoplamento macro→micro:
// shunt · glicocálice · heterogeneidade derrubam a extração efetiva; ScvO₂ SOBE
// (paradoxo) e o tecido gera lactato apesar da DO₂ global preservada. Forma canônica
// do model12. ATENÇÃO: o lactato AQUI (K_LAC=0,02, déficit TECIDUAL) é um sub-modelo
// distinto do lactato macro de oxygen.js (LACT_K=0,03, déficit de DO₂) — por isso as
// constantes vivem separadas. Âncoras: CHOQUE.md §2/§4/§10.

var E0 = 0.70;        // extração fracional máxima de um capilar nutritivo
var K_HET = 0.45;     // penalidade da heterogeneidade sobre a extração
var EPS_SHUNT = 0.02; // o pouquíssimo que o shunt ainda extrai
var K_LAC = 0.02;     // mmol/L de lactato por mL/min de déficit TECIDUAL
var LAC_BASE = 1.0;   // lactato basal (mmol/L)
var LAC_MAX = 15;     // teto do modelo

// Extração efetiva ao longo do leito nutritivo (fração 0..1).
function effExtraction(gly, het){ return E0 * gly * (1 - K_HET*het); }

// Microcirculação: do macro (DO₂, SaO₂) + estado micro → o que o TECIDO recebe.
function micro(p){
  var SaO2 = p.SaO2!==undefined? p.SaO2 : 0.98;
  var demand = p.demand!==undefined? p.demand : 250;
  var E = effExtraction(p.gly, p.het);
  var nutritive = p.DO2 * (1 - p.fs);
  var ceiling   = nutritive * E;
  var extracted = Math.min(demand, ceiling);
  var deficit   = Math.max(0, demand - ceiling);
  var O2ER  = extracted / p.DO2;
  var ScvO2 = SaO2 * (1 - O2ER);
  var lactate = Math.min(LAC_MAX, LAC_BASE + K_LAC*deficit);
  return { E:E, nutritive:nutritive, ceiling:ceiling, VO2:extracted, demand:demand,
           deficit:deficit, O2ER:O2ER, ScvO2:ScvO2, lactate:lactate, DO2:p.DO2, SaO2:SaO2 };
}

// Veredito do acoplamento macro→micro (não conduta).
function vereditoMicro(R){
  if(R.deficit < 5)   return 'acoplado';
  if(R.deficit < 100) return 'leve';
  return 'grave';
}
// O paradoxo, booleano didático: extração baixa + ScvO₂ alta COM tecido faminto.
function isParadoxo(R){ return R.O2ER < 0.18 && R.ScvO2 > 0.78 && R.deficit > 0; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { E0, K_HET, EPS_SHUNT, K_LAC, LAC_BASE, LAC_MAX,
    effExtraction, micro, vereditoMicro, isParadoxo };
}
