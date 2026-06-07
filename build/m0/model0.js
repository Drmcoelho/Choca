// ===== model0.js — Matemática do transporte · PERFUNDE·CHOCA módulo 0 =====
// Funções PURAS, determinísticas, comentadas. Unidades explícitas na assinatura.
// Âncoras de validação: CHOQUE.md §4 / PERFUNDA.md §4.
// Em <script> clássico estas function-declarations viram globais (reuso entre scripts);
// em Node, o guard de module.exports no fim expõe a API.

// Constante de Hüfner: mL O2 carregados por g de Hb 100% saturada.
// 1,34 é a convenção fixada pelo braço (CHOQUE.md §2). Texto varia 1,34–1,39.
var K_HUFNER = 1.34;
// Solubilidade do O2 dissolvido no plasma: mL O2 / dL / mmHg.
var K_DISSOLVIDO = 0.003;

// CaO2 — conteúdo arterial de O2 (mL O2 / dL de sangue).
// hb g/dL · sat fração(0..1) · pao2 mmHg. Devolve parcelas p/ a barra empilhada.
function caO2(hb, sat, pao2){
  var ligado = K_HUFNER * hb * sat;       // O2 carregado pela Hb (a quase totalidade)
  var dissolvido = K_DISSOLVIDO * pao2;   // O2 fisicamente dissolvido (a letra-miúda)
  return { ligado: ligado, dissolvido: dissolvido, total: ligado + dissolvido };
}

// DO2 — entrega de O2 (mL O2 / min). dc L/min · ca mL/dL.
// ×10 converte dL→L: (mL/dL)·(10 dL/L) = mL/L; ×(L/min) = mL/min.
function do2(dc, ca){ return dc * ca * 10; }

// DO2 indexado pela superfície corporal (mL/min/m²).
function do2Index(do2val, bsa){ return do2val / bsa; }

// VO2 por Fick — consumo de O2 (mL O2 / min). Mesmo fator 10.
function vo2Fick(dc, ca, cv){ return dc * (ca - cv) * 10; }

// O2ER — taxa de extração (fração). VO2/DO2 ≡ (Ca−Cv)/Ca.
function o2er(vo2val, do2val){ return vo2val / do2val; }
function o2erConteudos(ca, cv){ return (ca - cv) / ca; }

// PAM estimada de manguito (mmHg): PAD + (PAS−PAD)/3. Aproximação de repouso.
function pamCuff(pas, pad){ return pad + (pas - pad) / 3; }

// RVS clínica (dyn·s·cm⁻⁵): 80·(PAM−PVC)/DC. dc L/min. Normal ~800–1200.
function rvsDyn(pam, pvc, dc){ return 80 * (pam - pvc) / dc; }
// RVS em unidades de Wood/híbridas (mmHg·min/L): a forma limpa ΔP = Q·R.
function rvsWood(pam, pvc, dc){ return (pam - pvc) / dc; }
// Inversa conceitual: PAM = PVC + DC·RVS_wood (a inversão causal do braço).
function pamFromRvs(pvc, dc, rvsWoodVal){ return pvc + dc * rvsWoodVal; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { K_HUFNER, K_DISSOLVIDO, caO2, do2, do2Index,
    vo2Fick, o2er, o2erConteudos, pamCuff, rvsDyn, rvsWood, pamFromRvs };
}
