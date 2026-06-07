// ===== model6.js — Frank-Starling · PERFUNDE·CHOCA módulo 6 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §4 / modulos.md §6.
//
// A SAGACIDADE do módulo: separar dois sentidos de "pré-carga".
//   (1) pré-carga = VOLUME diastólico final (VDF) → a Frank-Starling VERDADEIRA:
//       VS sobe e SATURA com o VDF, MONOTÔNICA — não existe ramo descendente do sarcômero.
//   (2) pré-carga = PRESSÃO de enchimento (Pench) → o que se mede à beira do leito.
//       A relação diastólica pressão-volume (EDPVR) é EXPONENCIAL: perto do platô da
//       Starling, a pressão dispara enquanto o VS quase não sobe. A "falsa queda" do
//       ramo descendente clínico é CONGESTÃO/afterload mismatch no eixo de pressão,
//       nunca overstretch. (Katz; Sarnoff.)

var V0   = 15;     // volume não-estressado aproximado (mL) — abaixo dele não há ejeção útil
var V0D  = 5;      // intercepto da curva diastólica (mL)
var SVMAX_BASE = 110;  // platô de VS com contratilidade normal (mL)
var KM   = 55;     // VDF efetivo na meia-saturação (mL)
var EDPVR_P0 = 1.4;    // escala da pressão diastólica (mmHg)
var EDPVR_BETA = 0.018;// rigidez diastólica (1/mL) — quanto maior, mais íngreme a EDPVR
var CONGESTAO = 18;    // limiar de congestão pulmonar (mmHg)

// Fator de pós-carga: pós-carga alta reduz o VS (afterload mismatch). af normal ~80.
function afterloadFactor(af){ if(af===undefined) af=80; return 1/(1 + 0.008*Math.max(0, af-80)); }

// Frank-Starling VERDADEIRA: VS (mL) em função do VDF (mL).
// Saturante (Michaelis-Menten no VDF efetivo). Contratilidade escala o platô.
function starlingVS(vdf, contr, af){
  if (contr===undefined) contr=1; if (af===undefined) af=80;
  var ef = Math.max(0, vdf - V0);                  // VDF efetivo
  var svmax = SVMAX_BASE * contr;
  return svmax * ef/(KM + ef) * afterloadFactor(af);
}

// EDPVR: pressão diastólica final (mmHg) em função do VDF — exponencial.
// INDEPENDENTE da contratilidade (é propriedade diastólica/passiva).
function edpvr(vdf){
  return EDPVR_P0 * (Math.exp(EDPVR_BETA*Math.max(0, vdf - V0D)) - 1);
}
// Inverso: VDF (mL) para uma dada pressão de enchimento — para plotar VS × Pench.
function vdfFromPench(p){
  return V0D + Math.log(p/EDPVR_P0 + 1)/EDPVR_BETA;
}

// Fração de ejeção e volume sistólico final.
function ef(vdf, contr, af){ return vdf>0 ? starlingVS(vdf,contr,af)/vdf : 0; }
function esv(vdf, contr, af){ return vdf - starlingVS(vdf,contr,af); }

// VS plotado contra a PRESSÃO de enchimento (a curva "clínica"): converte p→VDF→VS.
function vsAtPench(p, contr, af){ return starlingVS(vdfFromPench(p), contr, af); }

// Inclinação local da Starling (dVS/dVDF) — mede "responsividade" da curva.
function slope(vdf, contr, af, h){ h=h||1; return (starlingVS(vdf+h,contr,af)-starlingVS(vdf-h,contr,af))/(2*h); }

if (typeof module!=='undefined' && module.exports){
  module.exports = { V0, V0D, CONGESTAO, afterloadFactor, starlingVS, edpvr, vdfFromPench, ef, esv, vsAtPench, slope };
}
