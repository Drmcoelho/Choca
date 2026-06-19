// ===== model28g.js — Combinações por fenótipo (28G) · PERFUNDE·CHOCA =====
// A JOIA: a pergunta deixa de ser "qual droga?" e vira "QUAL GEOMETRIA HEMODINÂMICA?".
// Cada fenótipo é um leito de base (DC, RVS) + um combo, e o motor COMPÕE os vetores de
// efeito (receptor→termo) e lê o perfil resultante pela equação do m9. Engine PURO
// standalone (window.G28), espelha source/core/pharmacodynamics (test28g conforma).
// Mecanismo/referência — SEM dose individualizada (§11).

var RECEPTOR_TERMS = {
  a1:{RVS:1.0,postLV:0.5}, b1:{contr:1.0,FC:0.6}, b2:{RVS:-0.6,FC:0.3,lacB:1.0},
  D1:{splanch:1.0}, V1:{RVS:1.0}, PDE3:{contr:0.8,RVS:-0.6,PVR:-0.5}, NOcGMP:{RVS:-1.0,PVR:-0.4}
};
var TERMS = ['RVS','contr','FC','lacB','postLV','PVR','splanch'];
var RX = {
  noradrenalina:{ranges:[0.01,3.0],recep:function(){return{a1:0.9,b1:0.3};},direct:function(){return{};}},
  adrenalina:{ranges:[0.01,0.5],recep:function(){return{a1:0.6,b1:0.8,b2:0.5};},direct:function(){return{};}},
  dobutamina:{ranges:[2.5,20],recep:function(){return{b1:1.0,b2:0.4};},direct:function(){return{};}},
  dopamina:{ranges:[2,20],recep:function(f){return{D1:Math.max(0,1-2*f),b1:0.4+0.6*Math.max(0,1-Math.abs(2*f-1)),a1:Math.max(0,2*f-1)};},direct:function(){return{};}},
  fenilefrina:{ranges:[0.1,1.4],recep:function(){return{a1:1.0};},direct:function(){return{FC:-0.3};}},
  vasopressina:{ranges:[0.01,0.04],recep:function(){return{V1:1.0};},direct:function(){return{};}},
  milrinona:{ranges:[0.125,0.75],recep:function(){return{PDE3:1.0};},direct:function(){return{};}}
};
function clampv(v,a,b){var n=Number(v);return isNaN(n)?a:(n<a?a:(n>b?b:n));}
function doseFrac(k,d){var x=RX[k];if(!x)return 0;var lo=x.ranges[0],hi=x.ranges[1];return hi>lo?clampv((clampv(d,lo,hi)-lo)/(hi-lo),0,1):0;}
function effect(k,d){var x=RX[k];var o={};TERMS.forEach(function(t){o[t]=0;});if(!x)return o;
  var f=doseFrac(k,d),rec=x.recep(f);Object.keys(rec).forEach(function(r){var w=rec[r],tm=RECEPTOR_TERMS[r];if(!tm)return;Object.keys(tm).forEach(function(t){o[t]+=w*tm[t];});});
  var dir=x.direct(f);Object.keys(dir).forEach(function(t){if(o[t]!=null)o[t]+=dir[t];});TERMS.forEach(function(t){o[t]*=f;});return o;}
function compose(list){var net={};TERMS.forEach(function(t){net[t]=0;});(list||[]).forEach(function(it){var e=effect(it.drug,it.dose);TERMS.forEach(function(t){net[t]+=e[t];});});return net;}
var K_RVS=0.35,K_CONTR=0.30,K_FC=0.10;
function profile(net,base){base=base||{};var DCb=(base.dc==null?5.0:base.dc),RVSb=(base.rvs==null?1100:base.rvs),PVC=(base.pvc==null?5:base.pvc);
  var RVS=Math.max(100,RVSb*(1+K_RVS*net.RVS)),DC=Math.max(0.5,DCb*(1+K_CONTR*net.contr+K_FC*net.FC));return{DC:DC,RVS:RVS,PAM:PVC+DC*RVS/80};}
function doseAt(k,f){var x=RX[k];return x?x.ranges[0]+f*(x.ranges[1]-x.ranges[0]):0;}

// Fenótipos: cada um é uma GEOMETRIA (leito de base) + o combo que a corrige.
var PHENOTYPES = {
  septico_quente:      { label:'séptico quente / vasoplégico', base:{dc:6.0, rvs:520}, combo:['noradrenalina','vasopressina'],
    nota:'RVS muito baixa, débito alto → subir a RVS (α1 + V1 poupador de catecolamina).' },
  septico_baixo_debito:{ label:'séptico com baixo débito (miocardiopatia)', base:{dc:3.4, rvs:760}, combo:['noradrenalina','dobutamina'],
    nota:'RVS baixa + bomba fraca → α1 para a PAM + β1 para o débito.' },
  cardiogenico_frio:   { label:'cardiogênico frio / congesto', base:{dc:3.0, rvs:1500}, combo:['dobutamina'],
    nota:'RVS alta compensatória + bomba fraca → inodilatador (sobe débito, baixa pós-carga).' },
  vd_afterload:        { label:'VD / TEP / hipertensão pulmonar', base:{dc:3.6, rvs:1000}, combo:['noradrenalina','dobutamina'],
    nota:'α1 para a perfusão coronária do VD; inotrópico com cautela; evitar colapso de RVS.' },
  misto_pos_intubacao: { label:'misto pós-intubação', base:{dc:4.0, rvs:700}, combo:['noradrenalina'],
    nota:'pressão positiva + sedação + retorno venoso caem → α1 sustenta a PAM.' },
  anafilaxia:          { label:'anafilaxia / distributivo agudo', base:{dc:4.0, rvs:500}, combo:['adrenalina'],
    nota:'adrenalina move os 4 termos — a geometria ampla do distributivo agudo.' }
};
var PHENO_ORDER = ['septico_quente','septico_baixo_debito','cardiogenico_frio','vd_afterload','misto_pos_intubacao','anafilaxia'];

// Geometria de um fenótipo: perfil base × perfil tratado (combo composto em dose 0.5 da faixa).
function geometry(key){
  var ph=PHENOTYPES[key]; if(!ph) return null;
  var list=ph.combo.map(function(drug){ return { drug:drug, dose:doseAt(drug,0.5) }; });
  var base=profile(compose([]), ph.base);
  var treated=profile(compose(list), ph.base);
  return { label:ph.label, combo:ph.combo, nota:ph.nota, base:base, treated:treated,
    dPAM:treated.PAM-base.PAM, dDC:treated.DC-base.DC }; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { TERMS, RX, effect, compose, profile, doseAt, PHENOTYPES, PHENO_ORDER, geometry, K_RVS:K_RVS, K_CONTR:K_CONTR, K_FC:K_FC }; }
