// ===== model28d.js — Inotrópicos (28D) · PERFUNDE·CHOCA =====
// Submódulo do hub: o termo quebrado do cardiogênico é a CONTRATILIDADE. Os inotrópicos a
// sobem — mas não são iguais: β1 (dobutamina/adrenalina) sobem a demanda de O₂ e o risco
// arrítmico; PDE-3 (milrinona) é inodilatador (inotropia sem β, mas vasodilata). O erro mais
// comum é tratar débito baixo como se fosse vasoplegia. Engine PURO standalone (window.D28),
// coeficientes IDÊNTICOS ao model28 publicado (test28d conforma). SEM dose individualizada.

var BASE = {
  PVC:5, HR0:75, SVbase:70,
  kA1_rvs:9.0, kV1_rvs:8.0, kB2_rvs:5.0, kPDE_rvs:5.5,
  kB1_ino:0.55, kPDE_ino:0.5, kB1_hr:34, kA1_hr:-10,
  kB1_met:0.55, kB2_met:0.35, RVS0:14, RVSfloor:4, RVSceil:30, demand0:1.0
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }
function terms(drug){ drug=drug||{}; var B=BASE;
  var a1=clamp01(drug.a1),b1=clamp01(drug.b1),b2=clamp01(drug.b2),v1=clamp01(drug.v1),pde=clamp01(drug.pde);
  return { dRVS:B.kA1_rvs*a1+B.kV1_rvs*v1-B.kB2_rvs*b2-B.kPDE_rvs*pde,
    dInotropy:B.kB1_ino*b1+B.kPDE_ino*pde, dHR:B.kB1_hr*b1+B.kA1_hr*a1,
    metabolic:B.kB1_met*b1+B.kB2_met*b2, a1:a1,b1:b1,b2:b2,v1:v1,pde:pde }; }
function applyDrug(patient, drug){ patient=patient||{}; var B=BASE;
  var rvs0=clampv(patient.rvs==null?14:patient.rvs,B.RVSfloor,B.RVSceil),
      pump0=(patient.pump==null?0.7:clamp01(patient.pump)),
      preload=clampv(patient.preload==null?0.9:patient.preload,0.1,1.4);
  var t=terms(drug);
  var rvs=clampv(rvs0+t.dRVS,B.RVSfloor,B.RVSceil);
  var inotropy=clamp01(pump0+t.dInotropy);
  var HR=clampv(B.HR0+t.dHR,40,170);
  var SV=B.SVbase*inotropy/0.7*(preload*preload)/(preload*preload+0.2);
  var CO=HR*SV/1000;
  var PAM=clampv(B.PVC+CO*rvs,35,140);
  var demand=B.demand0*(HR/75)*(0.6+0.4*(inotropy/0.7))*(1+0.6*t.metabolic);
  var supply=clampv(PAM/72,0.3,1.6);
  var o2balance=supply-demand;
  return { rvs0:rvs0,pump0:pump0,preload:preload,dRVS:t.dRVS,dInotropy:t.dInotropy,dHR:t.dHR,metabolic:t.metabolic,
    rvs:rvs,inotropy:inotropy,HR:HR,SV:SV,CO:CO,PAM:PAM,demand:demand,supply:supply,o2balance:o2balance }; }
var AGENTS = {
  dobutamina:    { a1:0.1, b1:0.9, b2:0.5, v1:0, pde:0 },
  milrinona:     { a1:0.0, b1:0.0, b2:0.0, v1:0, pde:1.0 },
  adrenalina:    { a1:0.8, b1:0.9, b2:0.4, v1:0, pde:0 },
  noradrenalina: { a1:0.9, b1:0.3, b2:0.0, v1:0, pde:0 }
};
var INOTROPES = ['dobutamina','milrinona','adrenalina'];

// Compara os inotrópicos num paciente CARDIOGÊNICO (bomba fraca): ganho de débito e custo de O₂.
function compareInotropes(patient){
  var base=applyDrug(patient,{}).CO;
  return INOTROPES.map(function(k){ var R=applyDrug(patient,AGENTS[k]);
    return { agent:k, CO:R.CO, dCO:R.CO-base, o2balance:R.o2balance, PAM:R.PAM, dRVS:R.dRVS,
      highCost:R.o2balance<-0.45, inodilator:(AGENTS[k].pde>0) }; }); }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, terms, applyDrug, AGENTS, INOTROPES, compareInotropes }; }
