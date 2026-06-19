// ===== source/core/pharmacodynamics.js — farmacodinâmica hemodinâmica · PERFUNDE·CHOCA =====
// O motor do ATLAS farmacológico (expansao.md): mapeia RECEPTOR → TERMO da equação.
// Uma droga é um vetor de efeitos dose-dependentes sobre RVS, contratilidade, FC,
// lactato tipo B, pós-carga de VE e RVP; um COMBO é a composição (soma) desses vetores.
// Assim as matrizes (28B/28D) e os fenótipos (28G) são COMPUTADOS, não digitados.
// Fronteira: modela MECANISMO e REFERÊNCIA (faixas usuais). NÃO recebe estado de
// paciente real para decidir conduta (SAFETY.md §11). Núcleo puro, sem dependências.
//
// Termos movidos (chaves do vetor de efeito):
//   RVS   resistência vascular sistêmica      contr  contratilidade (∝ DC)
//   FC    frequência cardíaca (∝ DC)          lacB   lactato tipo B (β2/glicólise)
//   postLV pós-carga de VE                    PVR    resistência vascular pulmonar
//   splanch  fluxo esplâncnico/renal (D1)

// Efeito unitário de cada receptor sobre os termos (por unidade de ativação).
var RECEPTOR_TERMS = {
  a1:    { RVS:+1.0, postLV:+0.5 },
  b1:    { contr:+1.0, FC:+0.6 },
  b2:    { RVS:-0.6, FC:+0.3, lacB:+1.0 },
  D1:    { splanch:+1.0 },                 // dose baixa: vasodilata esplâncnico/renal
  V1:    { RVS:+1.0 },                      // não-adrenérgico
  PDE3:  { contr:+0.8, RVS:-0.6, PVR:-0.5 },// inodilatador
  NOcGMP:{ RVS:-1.0, PVR:-0.4 }            // vasodilatadores diretos
};
var TERMS = ['RVS','contr','FC','lacB','postLV','PVR','splanch'];

// Perfil de receptores por droga (peso 0..1). Drogas dose-dependentes usam função de doseFrac.
// Os nomes/ordem espelham o receptor declarado em build/m28/pharm28.js (DRUGS[k].receptor).
var RX = {
  noradrenalina: { ranges:[0.01,3.0],  weightBased:true,  recep:function(){ return { a1:0.9, b1:0.3 }; },
    direct:function(){ return {}; } },
  adrenalina:    { ranges:[0.01,0.5],  weightBased:true,  recep:function(){ return { a1:0.6, b1:0.8, b2:0.5 }; },
    direct:function(){ return {}; } },
  dobutamina:    { ranges:[2.5,20],    weightBased:true,  recep:function(){ return { b1:1.0, b2:0.4 }; },
    direct:function(){ return {}; } },
  dopamina:      { ranges:[2,20],      weightBased:true,  recep:function(f){ // DA → β1 → α1 conforme a dose
      return { D1:Math.max(0,1-2*f), b1:0.4+0.6*Math.max(0,1-Math.abs(2*f-1)), a1:Math.max(0,2*f-1) }; },
    direct:function(){ return {}; } },
  fenilefrina:   { ranges:[0.1,1.4],   weightBased:true,  recep:function(){ return { a1:1.0 }; },
    direct:function(){ return { FC:-0.3 }; } },   // α1 puro → bradicardia reflexa
  vasopressina:  { ranges:[0.01,0.04], weightBased:false, recep:function(){ return { V1:1.0 }; },
    direct:function(){ return {}; } },
  milrinona:     { ranges:[0.125,0.75],weightBased:true,  recep:function(){ return { PDE3:1.0 }; },
    direct:function(){ return {}; } }
};

function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }

// Fração da dose dentro da faixa usual (0..1).
function doseFrac(key, dose){ var d=RX[key]; if(!d) return 0; var lo=d.ranges[0], hi=d.ranges[1];
  return hi>lo ? clampv((clampv(dose,lo,hi)-lo)/(hi-lo), 0, 1) : 0; }

// Vetor de efeito de UMA droga na dose dada (escala com a fração da dose).
function effect(key, dose){
  var d=RX[key]; var out={}; TERMS.forEach(function(t){ out[t]=0; });
  if(!d) return out;
  var f=doseFrac(key, dose);
  var rec=d.recep(f);
  Object.keys(rec).forEach(function(r){ var w=rec[r], tm=RECEPTOR_TERMS[r]; if(!tm) return;
    Object.keys(tm).forEach(function(t){ out[t]+=w*tm[t]; }); });
  var dir=d.direct(f); Object.keys(dir).forEach(function(t){ if(out[t]!=null) out[t]+=dir[t]; });
  TERMS.forEach(function(t){ out[t]*=f; });   // sem dose, sem efeito
  return out;
}

// Composição de um combo: soma os vetores de efeito. list = [{drug, dose}, ...].
function compose(list){
  var net={}; TERMS.forEach(function(t){ net[t]=0; });
  (list||[]).forEach(function(it){ var e=effect(it.drug, it.dose);
    TERMS.forEach(function(t){ net[t]+=e[t]; }); });
  return net;
}

// Lê o perfil hemodinâmico resultante sobre um estado-base (DC, RVSdyn), via a equação
// PAM = PVC + DC·RVS/80 (model9). Coeficientes modestos: o sinal e a ordem importam mais
// que a magnitude exata (é ensino de mecânica, não previsão de paciente).
var K_RVS=0.35, K_CONTR=0.30, K_FC=0.10;
function profile(net, base){
  base = base || {};
  var DCb=(base.dc==null?5.0:base.dc), RVSb=(base.rvs==null?1100:base.rvs), PVC=(base.pvc==null?5:base.pvc);
  var RVS=Math.max(100, RVSb*(1 + K_RVS*net.RVS));
  var DC =Math.max(0.5, DCb*(1 + K_CONTR*net.contr + K_FC*net.FC));
  var PAM=PVC + DC*RVS/80;
  return { DC:DC, RVS:RVS, PAM:PAM, lacB:net.lacB, PVR:net.PVR, postLV:net.postLV, splanch:net.splanch };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { RECEPTOR_TERMS, TERMS, RX, doseFrac, effect, compose, profile, clampv,
    K_RVS:K_RVS, K_CONTR:K_CONTR, K_FC:K_FC };
}
