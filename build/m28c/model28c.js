// ===== model28c.js — Vasopressina · vasopressor não-catecolaminérgico (28C) · PERFUNDE·CHOCA =====
// Submódulo do hub (1ª passada: SÓ vasopressina). V1 sobe a RVS FORA da via adrenérgica:
// poupadora de catecolamina, SEM taquicardia e SEM custo metabólico β. Dose FIXA (não por
// peso). Engine PURO standalone (window.C28), terms conforme model28 (test28c). SEM dose
// individualizada (mecanismo/referência §11). Terlipressina/angiotensina II/azul de metileno
// ficam como stubs planejados (excepcional-resgate), fora desta passada.

var BASE = { kA1_rvs:9.0, kV1_rvs:8.0, kB2_rvs:5.0, kPDE_rvs:5.5, kB1_ino:0.55, kPDE_ino:0.5, kB1_hr:34, kA1_hr:-10, kB1_met:0.55, kB2_met:0.35 };
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }
function terms(drug){ drug=drug||{}; var B=BASE;
  var a1=clamp01(drug.a1),b1=clamp01(drug.b1),b2=clamp01(drug.b2),v1=clamp01(drug.v1),pde=clamp01(drug.pde);
  return { dRVS:B.kA1_rvs*a1+B.kV1_rvs*v1-B.kB2_rvs*b2-B.kPDE_rvs*pde,
    dInotropy:B.kB1_ino*b1+B.kPDE_ino*pde, dHR:B.kB1_hr*b1+B.kA1_hr*a1,
    metabolic:B.kB1_met*b1+B.kB2_met*b2, a1:a1,b1:b1,b2:b2,v1:v1,pde:pde }; }

var AGENTS = {
  vasopressina:  { v1:1.0, a1:0, b1:0, b2:0, pde:0, weightBased:false, dosing:'dose fixa (U/min) · não por peso' },
  noradrenalina: { a1:0.9, b1:0.3, b2:0.0, v1:0, pde:0, weightBased:true, dosing:'mcg/kg/min · por peso' }
};

// Contraste V1 × adrenérgico: ambos sobem a RVS, mas a vasopressina não taquicardiza nem
// custa β. Devolve os termos de cada um e as diferenças que importam.
function contrast(){
  var v=terms(AGENTS.vasopressina), n=terms(AGENTS.noradrenalina);
  return {
    vasopressina: { RVS:v.dRVS, FC:v.dHR, metabolic:v.metabolic, adrenergic:false, weightBased:false },
    noradrenalina:{ RVS:n.dRVS, FC:n.dHR, metabolic:n.metabolic, adrenergic:true,  weightBased:true },
    poupaCatecolamina: (v.dRVS>0),          // sobe a RVS sem adrenérgico
    semTaquicardia: (Math.abs(v.dHR)<1e-9), // V1 não mexe na FC
    semCustoBeta: (Math.abs(v.metabolic)<1e-9)
  };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, terms, AGENTS, contrast }; }
