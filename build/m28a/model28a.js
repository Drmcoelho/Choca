// ===== model28a.js — Gramática farmacodinâmica (28A) · PERFUNDE·CHOCA =====
// Submódulo 28A do HUB de farmacologia hemodinâmica (expansao.md). A GRAMÁTICA:
// um agente é um PERFIL DE RECEPTORES que move TERMOS da equação — previsto pelo
// receptor, não pelo nome. Engine PURO, standalone (inlina no HTML como window.GRAM).
// Coeficientes IDÊNTICOS aos do model28 publicado (BASE) — test28a conforma os dois,
// para nunca haver um modelo receptor→termo divergente. SEM dose, SEM alvo (só mecanismo).

var BASE = {
  kA1_rvs:9.0, kV1_rvs:8.0, kB2_rvs:5.0, kPDE_rvs:5.5,   // RVS (Wood-ish): α1/V1 sobem; β2/PDE descem
  kB1_ino:0.55, kPDE_ino:0.5,                            // contratilidade: β1 e PDE sobem
  kB1_hr:34, kA1_hr:-10                                  // FC: β1 sobe; α1 (reflexo) tende a baixar
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }

// Perfil de receptores → vetor de TERMOS movidos (independe do paciente).
// drug = { a1, b1, b2, v1, pde } (0..1 cada).
function terms(drug){
  drug=drug||{}; var B=BASE;
  var a1=clamp01(drug.a1), b1=clamp01(drug.b1), b2=clamp01(drug.b2), v1=clamp01(drug.v1), pde=clamp01(drug.pde);
  return {
    dRVS: B.kA1_rvs*a1 + B.kV1_rvs*v1 - B.kB2_rvs*b2 - B.kPDE_rvs*pde,
    dInotropy: B.kB1_ino*b1 + B.kPDE_ino*pde,
    dHR: B.kB1_hr*b1 + B.kA1_hr*a1,
    a1:a1,b1:b1,b2:b2,v1:v1,pde:pde
  };
}

// Termo dominante (rótulo) que um agente move.
function dominantTerm(drug){ var t=terms(drug);
  var vaso=Math.abs(t.dRVS)/9, ino=t.dInotropy/0.55;
  if(vaso>=0.5 && ino>=0.5) return 'misto';
  if(vaso>=ino) return t.dRVS>=0 ? 'rvs' : 'vasodilata';
  return 'inotropy'; }

// Frase-gramática: receptor → termo → consequência (texto curto, mecanismo).
function gloss(rec){
  var G={ a1:'α1 → RVS↑ (e pós-carga de VE↑)', b1:'β1 → contratilidade↑ e FC↑ (e demanda de O₂↑)',
    b2:'β2 → vasodilatação (RVS↓) e demanda metabólica', v1:'V1 → RVS↑ NÃO-adrenérgica (sem taquicardia)',
    pde:'PDE-3 → inodilatador: contratilidade↑ + RVS↓' };
  return G[rec]||''; }

// Catálogo de agentes (PERFIS — mecanismo, SEM dose). Igual ao AGENTS do model28.
var AGENTS = {
  noradrenalina: { a1:0.9, b1:0.3, b2:0.0, v1:0,   pde:0 },
  adrenalina:    { a1:0.8, b1:0.9, b2:0.4, v1:0,   pde:0 },
  dobutamina:    { a1:0.1, b1:0.9, b2:0.5, v1:0,   pde:0 },
  vasopressina:  { a1:0.0, b1:0.0, b2:0.0, v1:1.0, pde:0 },
  fenilefrina:   { a1:1.0, b1:0.0, b2:0.0, v1:0,   pde:0 },
  milrinona:     { a1:0.0, b1:0.0, b2:0.0, v1:0,   pde:1.0 }
};

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, terms, dominantTerm, gloss, AGENTS };
}
