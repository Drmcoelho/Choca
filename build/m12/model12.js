// ===== model12.js — A microcirculação · PERFUNDE·CHOCA módulo 12 =====
// O DESACOPLAMENTO MACRO-MICRO — por que o tecido passa fome com a macro "boa".
// Funções PURAS, determinísticas. O compartimento microcirculatório como engine próprio:
//   shunt (sangue não-nutritivo passa sem entregar) · glicocálice (difusão/edema) ·
//   heterogeneidade (capilares parados ao lado de rápidos) → extração efetiva colapsa,
//   ScvO₂ SOBE (paradoxo) e o tecido gera lactato apesar da DO₂ global preservada.
// Âncoras: CHOQUE.md §2/§4/§10 · modulos.md §12. Em <script> clássico viram globais;
// em Node, o guard de module.exports no fim expõe a API.

var E0 = 0.70;        // extração fracional máxima de um capilar nutritivo (ideal)
var K_HET = 0.45;     // penalidade da heterogeneidade sobre a extração
var EPS_SHUNT = 0.02; // o pouquíssimo que o shunt ainda extrai
var K_LAC = 0.02;     // mmol/L de lactato por mL/min de déficit de O₂ tecidual
var LAC_BASE = 1.0;   // lactato basal (mmol/L)
var LAC_MAX = 15;     // teto do modelo

// Extração efetiva ao longo do leito nutritivo (fração 0..1).
// Glicocálice íntegro mantém a camada de plasma e a curta distância de difusão; sua
// destruição (edema/permeabilidade) e a heterogeneidade de fluxo derrubam a extração.
function effExtraction(gly, het){ return E0 * gly * (1 - K_HET*het); }

// Microcirculação: dado o macro (DO₂, SaO₂) e o estado micro (shunt, glicocálice,
// heterogeneidade, demanda VO₂), devolve o que o TECIDO de fato recebe e suas assinaturas.
// p = { DO2 (mL/min), SaO2 (0..1), fs (shunt 0..1), gly (0..1), het (0..1), demand (mL/min) }
function micro(p){
  var SaO2 = p.SaO2!==undefined? p.SaO2 : 0.98;
  var demand = p.demand!==undefined? p.demand : 250;
  var E = effExtraction(p.gly, p.het);
  var nutritive = p.DO2 * (1 - p.fs);     // O₂ que chega aos capilares nutritivos
  var ceiling   = nutritive * E;          // teto de O₂ extraível pelo tecido
  var extracted = Math.min(demand, ceiling);
  var deficit   = Math.max(0, demand - ceiling);
  var O2ER  = extracted / p.DO2;          // extração GLOBAL aparente (cai no séptico)
  var ScvO2 = SaO2 * (1 - O2ER);          // proxy de conteúdo venoso — SOBE quando há shunt
  var lactate = Math.min(LAC_MAX, LAC_BASE + K_LAC*deficit);
  return { E:E, nutritive:nutritive, ceiling:ceiling, VO2:extracted, demand:demand,
           deficit:deficit, O2ER:O2ER, ScvO2:ScvO2, lactate:lactate, DO2:p.DO2, SaO2:SaO2 };
}

// Veredito do acoplamento macro→micro (não conduta): o tecido está sendo alimentado?
function vereditoMicro(R){
  if(R.deficit < 5)   return 'acoplado';
  if(R.deficit < 100) return 'leve';
  return 'grave';
}

// O paradoxo, como booleano didático: extração baixa + ScvO₂ alta COM tecido faminto.
function isParadoxo(R){ return R.O2ER < 0.18 && R.ScvO2 > 0.78 && R.deficit > 0; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { E0, K_HET, EPS_SHUNT, K_LAC, LAC_BASE, LAC_MAX,
    effExtraction, micro, vereditoMicro, isParadoxo };
}
