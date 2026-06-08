// ===== model21.js — Choque séptico (macro × micro × mitocôndria) · PERFUNDE·CHOCA módulo 21 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §2/§10 / modulos.md §21.
// Capstone do distributivo (herda 20) + microcirculação (12). A CASCATA de três compartimentos:
//   CONVECTIVO  : DO₂ macro = DC × CaO₂ — no séptico hiperdinâmico costuma estar NORMAL ou ALTA.
//   DIFUSIVO    : o O₂ precisa CHEGAR à célula — shunt microcirculatório + glicocálice lesado o impedem.
//   UTILIZAÇÃO  : a mitocôndria precisa USAR o O₂ — a falência citopática o bloqueia.
// O PARADOXO: SvO₂ ALTA (extração falha) COM lactato alto e tecido faminto. E corrigir a MACRO
//   (pressor → MAP) NÃO fecha o déficit micro/mito — "normalizar a macro não basta".

var SAT=0.97, LAC_BASE=1.0, LAC_K=0.045;

function caO2(hb){ return 1.34*hb*SAT + 0.003*95; }
function macroDO2(co, hb){ return co*caO2(hb)*10; }                 // convectivo (mL/min)
function map(co, rvsWood, pvc){ if(pvc===undefined)pvc=5; return pvc + co*rvsWood; }  // PAM = PVC + DC·RVS (módulo 9)

// O₂ que efetivamente CHEGA ao tecido (difusivo): macro × (1−shunt) × glicocálice.
function tissueAvailable(P){ return macroDO2(P.co,P.hb) * (1 - Math.max(0,Math.min(0.9,P.shunt))) * Math.max(0,Math.min(1,P.glyco)); }
// O₂ UTILIZÁVEL: o que chega × função mitocondrial.
function usable(P){ return tissueAvailable(P) * Math.max(0,Math.min(1,P.mito)); }
// Consumo real: limitado pela demanda OU pelo que é utilizável (o que vier primeiro).
function vo2Actual(P){ return Math.min(P.demand, usable(P)); }
// Déficit de O₂ (tecido faminto) e lactato resultante.
function deficit(P){ return Math.max(0, P.demand - vo2Actual(P)); }
function lactate(P){ return LAC_BASE + LAC_K*deficit(P); }
// Extração efetiva e SvO₂ — caem/sobem com a falha de extração (o paradoxo).
function o2er(P){ var d=macroDO2(P.co,P.hb); return d>0 ? vo2Actual(P)/d : 0; }
function svo2(P){ return SAT*(1 - o2er(P)); }

// O paradoxo séptico: SvO₂ ALTA (>0,70) coexistindo com déficit tecidual (>0).
function paradoxo(P){ return svo2(P) > 0.70 && deficit(P) > 0; }

// ---- Intervenções (mecanismo, SEM dose) ----
// Pressor (α1/V1): sobe a RVS → a MAP (macro). NÃO toca shunt/glicocálice/mito → déficit inalterado.
function applyPressor(P){ var s=Object.assign({}, P); s.rvsWood=(P.rvsWood||9)+7; return s; }
// Recrutar a microcirculação: reduz o shunt e restaura o glicocálice → mais O₂ chega.
function applyMicro(P){ var s=Object.assign({}, P); s.shunt=Math.max(0.05,P.shunt-0.4); s.glyco=Math.min(1,P.glyco+0.3); return s; }
// Recuperar a mitocôndria (citopática): mais O₂ é usado.
function applyMito(P){ var s=Object.assign({}, P); s.mito=Math.min(1,P.mito+0.35); return s; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { caO2, macroDO2, map, tissueAvailable, usable, vo2Actual, deficit, lactate, o2er, svo2, paradoxo, applyPressor, applyMicro, applyMito };
}
