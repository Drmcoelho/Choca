// ===== model28e.js — Dobutamina · fluxo × pressão (28E) · PERFUNDE·CHOCA =====
// Submódulo-joia do hub: a dobutamina ensina a diferença entre GANHAR FLUXO e PERDER
// PRESSÃO. Espelha source/core/pharmacodynamics.js (receptor→termo + composição + perfil
// pela equação do m9). Engine PURO standalone (inlina como window.E28); test28e conforma
// byte-a-byte com o núcleo. SEM dose individualizada (mecanismo/referência §11).

var RECEPTOR_TERMS = {
  a1:    { RVS:+1.0, postLV:+0.5 },
  b1:    { contr:+1.0, FC:+0.6 },
  b2:    { RVS:-0.6, FC:+0.3, lacB:+1.0 },
  D1:    { splanch:+1.0 },
  V1:    { RVS:+1.0 },
  PDE3:  { contr:+0.8, RVS:-0.6, PVR:-0.5 },
  NOcGMP:{ RVS:-1.0, PVR:-0.4 }
};
var TERMS = ['RVS','contr','FC','lacB','postLV','PVR','splanch'];
var RX = {
  noradrenalina: { ranges:[0.01,3.0],  weightBased:true,  recep:function(){ return { a1:0.9, b1:0.3 }; }, direct:function(){ return {}; } },
  adrenalina:    { ranges:[0.01,0.5],  weightBased:true,  recep:function(){ return { a1:0.6, b1:0.8, b2:0.5 }; }, direct:function(){ return {}; } },
  dobutamina:    { ranges:[2.5,20],    weightBased:true,  recep:function(){ return { b1:1.0, b2:0.4 }; }, direct:function(){ return {}; } },
  dopamina:      { ranges:[2,20],      weightBased:true,  recep:function(f){ return { D1:Math.max(0,1-2*f), b1:0.4+0.6*Math.max(0,1-Math.abs(2*f-1)), a1:Math.max(0,2*f-1) }; }, direct:function(){ return {}; } },
  fenilefrina:   { ranges:[0.1,1.4],   weightBased:true,  recep:function(){ return { a1:1.0 }; }, direct:function(){ return { FC:-0.3 }; } },
  vasopressina:  { ranges:[0.01,0.04], weightBased:false, recep:function(){ return { V1:1.0 }; }, direct:function(){ return {}; } },
  milrinona:     { ranges:[0.125,0.75],weightBased:true,  recep:function(){ return { PDE3:1.0 }; }, direct:function(){ return {}; } }
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function doseFrac(key, dose){ var d=RX[key]; if(!d) return 0; var lo=d.ranges[0], hi=d.ranges[1];
  return hi>lo ? clampv((clampv(dose,lo,hi)-lo)/(hi-lo), 0, 1) : 0; }
function effect(key, dose){
  var d=RX[key]; var out={}; TERMS.forEach(function(t){ out[t]=0; }); if(!d) return out;
  var f=doseFrac(key, dose); var rec=d.recep(f);
  Object.keys(rec).forEach(function(r){ var w=rec[r], tm=RECEPTOR_TERMS[r]; if(!tm) return;
    Object.keys(tm).forEach(function(t){ out[t]+=w*tm[t]; }); });
  var dir=d.direct(f); Object.keys(dir).forEach(function(t){ if(out[t]!=null) out[t]+=dir[t]; });
  TERMS.forEach(function(t){ out[t]*=f; });
  return out;
}
function compose(list){ var net={}; TERMS.forEach(function(t){ net[t]=0; });
  (list||[]).forEach(function(it){ var e=effect(it.drug, it.dose); TERMS.forEach(function(t){ net[t]+=e[t]; }); });
  return net; }
var K_RVS=0.35, K_CONTR=0.30, K_FC=0.10;
function profile(net, base){ base=base||{};
  var DCb=(base.dc==null?5.0:base.dc), RVSb=(base.rvs==null?1100:base.rvs), PVC=(base.pvc==null?5:base.pvc);
  var RVS=Math.max(100, RVSb*(1 + K_RVS*net.RVS));
  var DC =Math.max(0.5, DCb*(1 + K_CONTR*net.contr + K_FC*net.FC));
  var PAM=PVC + DC*RVS/80;
  return { DC:DC, RVS:RVS, PAM:PAM, lacB:net.lacB, PVR:net.PVR }; }

// Conveniência: dose na fração f da faixa usual.
function doseAt(key, f){ var d=RX[key]; return d ? d.ranges[0] + f*(d.ranges[1]-d.ranges[0]) : 0; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { RECEPTOR_TERMS, TERMS, RX, doseFrac, effect, compose, profile, doseAt, K_RVS:K_RVS, K_CONTR:K_CONTR, K_FC:K_FC };
}
