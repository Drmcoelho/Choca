// ===== source/core/units.js — fatores de unidade canônicos · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). Fonte ÚNICA dos fatores de
// conversão que aparecem espalhados pelos engines build/mN/modelN.js. A saída
// publicada continua single-file; este módulo é a verdade do BUILD, e o teste de
// conformância (test-core.node.js) prova que os engines concordam numericamente.
//
// Convenção: function-declarations viram globais em <script>; em Node o guard de
// module.exports no fim expõe a API (o mesmo dual-mode dos engines, sem 'use strict').

// dL → L: a aritmética do "×10" que converte (mL/dL)·(L/min) → mL/min em toda DO₂/VO₂.
var DL_PER_L = 10;
// Fator clínico da RVS em dyn·s·cm⁻⁵: RVS = 80·(ΔP)/DC; PAM = PVC + DC·RVS/80.
var DYNE_FACTOR = 80;

// Normaliza saturação: aceita fração (0..1) ou percentual (0..100) → fração.
// Espelha asFrac() do model1; é o ponto único onde "96" e "0,96" deixam de divergir.
function asFrac(sat){ return sat > 1 ? sat / 100 : sat; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DL_PER_L, DYNE_FACTOR, asFrac };
}
