// ===== source/core/hemodynamics.js — macro-hemodinâmica (canônica) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). PAM = DC × RVS e suas inversas,
// reconciliando model0 e model9 — incluindo a DESAMBIGUAÇÃO de uma colisão de nome real:
//   model0.rvsWood(pam,pvc,dc)  → RVS de Wood a partir de PRESSÕES   (ΔP/Q)
//   model9.rvsWood(rvsDyn)      → conversão dyne→Wood                (÷80)
// Mesmo identificador, semântica divergente (o exato risco do ROADMAP Fase 3). Aqui
// viram dois nomes distintos; o teste de conformância prende cada engine ao seu par.

var U = (typeof require !== 'undefined') ? require('./units.js') : window.CoreUnits;
var DYNE_FACTOR = U.DYNE_FACTOR;

// CO (L/min) = FC (bpm) × VS (mL) / 1000. A identidade do débito.
function co(fc, vs){ return fc * vs / 1000; }

// PAM estimada de manguito (mmHg): PAD + (PAS−PAD)/3.
function pamCuff(pas, pad){ return pad + (pas - pad) / 3; }

// RVS clínica (dyn·s·cm⁻⁵): 80·(PAM−PVC)/DC. Assinatura do model0 (pam, pvc, dc).
function rvsDyn(pam, pvc, dc){ return DYNE_FACTOR * (pam - pvc) / dc; }

// RVS de Wood (mmHg·min/L) a partir de PRESSÕES: (PAM−PVC)/DC. (= model0.rvsWood)
function rvsWoodFromPressures(pam, pvc, dc){ return (pam - pvc) / dc; }

// Conversões dyne ↔ Wood. woodFromDyn = model9.rvsWood; dynFromWood = model9.dynFromWood.
function woodFromDyn(rvsDyn){ return rvsDyn / DYNE_FACTOR; }
function dynFromWood(w){ return w * DYNE_FACTOR; }

// PAM (mmHg) a partir de DC e RVS em dyne: PVC + DC·RVSdyn/80. (= model9.pam)
function pamFromDyn(dc, rvsDyn, pvc){ if(pvc===undefined)pvc=5; return pvc + dc*rvsDyn/DYNE_FACTOR; }
// PAM a partir de RVS em Wood: PVC + DC·RVSwood. (= model0.pamFromRvs)
function pamFromWood(pvc, dc, rvsWoodVal){ return pvc + dc * rvsWoodVal; }

// RVS (dyn·s·cm⁻⁵) necessária para uma dada PAM com um dado DC — o locus iso-PAM. (= model9.rvsForPam)
function rvsForPam(pamVal, dc, pvc){ if(pvc===undefined)pvc=5; return DYNE_FACTOR*(pamVal - pvc)/dc; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { co, pamCuff, rvsDyn, rvsWoodFromPressures,
    woodFromDyn, dynFromWood, pamFromDyn, pamFromWood, rvsForPam };
}
