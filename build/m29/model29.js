// build/m29/model29.js — Motor UNIFICADO do capstone (PERFUNDE · CHOCA · Módulo 29)
// Costura o braço inteiro num único paciente integrado: conteúdo (CaO2) →
// entrega (DO2) → consumo/extração (VO2, O2ER, SvO2, lactato) → pressão
// (PAM = PVC + DC·RVS/80) → perfil. As categorias de choque são presets que
// quebram termos específicos; a alavanca vasoativa (receptor→termo, do M28)
// recalcula a cascata inteira. Funções puras, determinísticas, calibradas
// contra os motores canônicos m1 (CaO2/DO2), m8 (VO2/supply-dependence) e
// m9 (PAM=DC×RVS). Firewall SaMD: mecanismo, não conduta individualizada.
'use strict';

// ---- constantes canônicas (consistentes com m1/m8/m9) ----
var K_HUFNER=1.34, K_DISS=0.003;     // CaO2 = 1.34·Hb·SaO2 + 0.003·PaO2
var SV_BASE=83;                       // mL — calibra CO normal ≈ 5 L/min
var K_AFTER=0.25;                      // sensibilidade do VS à pós-carga (modulada pela fraqueza do ventrículo)
var LACT_BASE=1.0, LACT_K=0.03;   // m8
var PVC_NL=6;                         // mmHg

function clamp(x,a,b){ return x<a?a:(x>b?b:x); }
function num(x,d){ return (typeof x==='number'&&isFinite(x))?x:d; }
function asFrac(s){ return s>1 ? s/100 : s; }

// ---- paciente integrado normal (todas as primitivas em bandas fisiológicas) ----
var NORMAL={ hb:15, sao2:0.98, pao2:95, hr:75, contractility:0.70, preload:0.90, rvs:1200, vo2demand:250, o2ermax:0.60, pvc:PVC_NL };

function normState(s){ s=s||{};
  return { hb:clamp(num(s.hb,NORMAL.hb),2,22), sao2:clamp(asFrac(num(s.sao2,NORMAL.sao2)),0.4,1), pao2:clamp(num(s.pao2,NORMAL.pao2),20,600),
    hr:clamp(num(s.hr,NORMAL.hr),30,200), contractility:clamp(num(s.contractility,NORMAL.contractility),0.05,1.6),
    preload:clamp(num(s.preload,NORMAL.preload),0.1,1.6), rvs:clamp(num(s.rvs,NORMAL.rvs),200,3000),
    vo2demand:clamp(num(s.vo2demand,NORMAL.vo2demand),120,700), o2ermax:clamp(num(s.o2ermax,NORMAL.o2ermax),0.2,0.8), pvc:clamp(num(s.pvc,NORMAL.pvc),0,20) };
}

// ---- blocos físicos ----
function cao2(hb,sao2,pao2){ return K_HUFNER*hb*asFrac(sao2) + K_DISS*pao2; }                  // mL/dL
// Volume sistólico SENSÍVEL À PÓS-CARGA: o ventrículo fraco (contratilidade baixa)
// perde VS quando a RVS sobe; o ventrículo normal é quase insensível. rvs default
// 1200 (normal) → fator 1, preservando a calibração e as chamadas de 2 argumentos.
function strokeVolume(contractility, preload, rvs){ var p=preload*preload;
  var base=SV_BASE*(contractility/0.7)*(p/(p+0.2));
  var aff=1 - K_AFTER*((num(rvs,1200)-1200)/1000)*(1.1-clamp(num(contractility,0.7),0.05,1.1));
  return base*clamp(aff,0.3,1.25); } // mL
function cardiacOutput(hr, contractility, preload, rvs){ return hr*strokeVolume(contractility,preload,rvs)/1000; } // L/min
function pamOf(co, rvs, pvc){ return (pvc==null?PVC_NL:pvc) + co*rvs/80; }                     // mmHg (RVS em dyn·s·cm⁻⁵)
function do2crit(vo2demand,o2ermax){ return vo2demand/o2ermax; }
function vo2Of(do2, vo2demand, o2ermax){ var crit=do2crit(vo2demand,o2ermax); return do2>=crit ? vo2demand : o2ermax*do2; }

// ---- cascata integrada completa ----
function cascade(state){
  var s=normState(state);
  var CaO2=cao2(s.hb,s.sao2,s.pao2);
  var SV=strokeVolume(s.contractility,s.preload,s.rvs);
  var CO=s.hr*SV/1000;
  var DO2=CO*CaO2*10;                                  // mL/min
  var crit=do2crit(s.vo2demand,s.o2ermax);
  var VO2=vo2Of(DO2,s.vo2demand,s.o2ermax);
  var O2ER=DO2>0?VO2/DO2:0;
  var SvO2=DO2>0?s.sao2*(1-O2ER):0;
  var deficit=Math.max(0,s.vo2demand-VO2);
  var lactate=LACT_BASE+LACT_K*deficit;
  var PAM=clamp(pamOf(CO,s.rvs,s.pvc),35,140);
  var supplyDependent=DO2<crit;
  return { hb:s.hb, sao2:s.sao2, pao2:s.pao2, hr:s.hr, contractility:s.contractility, preload:s.preload, rvs:s.rvs, vo2demand:s.vo2demand, o2ermax:s.o2ermax, pvc:s.pvc,
    cao2:CaO2, sv:SV, co:CO, do2:DO2, do2crit:crit, vo2:VO2, o2er:O2ER, svo2:SvO2, lactate:lactate, o2deficit:deficit, pam:PAM,
    supplyDependent:supplyDependent,
    profile:profileOf(CO,s.rvs), cryptic:(PAM>=65 && deficit>0) };
}
function profileOf(co, rvs){
  return { temp:(rvs<800?'quente':(rvs>1400?'frio':'neutro')), fluxo:(co<3.5?'baixo':(co>7?'alto':'normal')),
           vasodilatado:rvs<800, vasoconstrito:rvs>1400, baixoDebito:co<3.5 };
}

// ---- classificador do TERMO QUEBRADO (qual primitiva saiu da banda) ----
// retorna o termo dominante e o ranking; bandas didáticas.
var TERMOS=[
  { id:'conteudo', label:'conteúdo de O₂ (CaO₂)', test:function(s){ return Math.max(0,(18 - cao2(s.hb,s.sao2,s.pao2))/18); } },        // anemia/hipoxemia
  { id:'pre',      label:'retorno/pré-carga',      test:function(s){ return Math.max(0,(0.85 - s.preload)/0.85); } },                   // hipovolêmico/obstrutivo
  { id:'bomba',    label:'bomba (contratilidade)', test:function(s){ return Math.max(0,(0.6 - s.contractility)/0.6); } },               // cardiogênico
  { id:'rvs',      label:'resistência (RVS)',      test:function(s){ return Math.max(0,(950 - s.rvs)/950); } },                          // distributivo
  { id:'extracao', label:'extração/mitocôndria',   test:function(s){ return Math.max(0,(0.55 - s.o2ermax)/0.55) + Math.max(0,(s.vo2demand-300)/300)*0.5; } } // micro/mito
];
function brokenRanking(state){ var s=normState(state); return TERMOS.map(function(t){ return { id:t.id, label:t.label, sev:t.test(s) }; }).sort(function(a,b){ return b.sev-a.sev; }); }
function brokenTerm(state){ var r=brokenRanking(state); return (r[0].sev>0.12)?r[0].id:'nenhum'; }
function isMixed(state){ var r=brokenRanking(state); var sig=r.filter(function(x){return x.sev>0.2;}); return sig.length>=2; }

// ---- alavanca vasoativa: receptor → termo (consistente com o M28) ----
// perfil de receptores normalizado {a1,b1,b2,v1,pde}; aplica deltas à cascata.
var LEVERS={
  noradrenalina:{ nome:'Noradrenalina', a1:1.0, b1:0.25, b2:0, v1:0, pde:0 },
  adrenalina:   { nome:'Adrenalina',     a1:0.8, b1:0.9,  b2:0.6, v1:0, pde:0 },
  dobutamina:   { nome:'Dobutamina',     a1:0,   b1:1.0,  b2:0.5, v1:0, pde:0 },
  dopamina:     { nome:'Dopamina',       a1:0.5, b1:0.7,  b2:0.2, v1:0, pde:0 },
  vasopressina: { nome:'Vasopressina',   a1:0,   b1:0,    b2:0,   v1:1.0, pde:0 },
  milrinona:    { nome:'Milrinona',      a1:0,   b1:0,    b2:0,   v1:0, pde:1.0 },
  fenilefrina:  { nome:'Fenilefrina',    a1:1.0, b1:0,    b2:0,   v1:0, pde:0 },
  volume:       { nome:'Volume (pré-carga)', a1:0, b1:0,  b2:0,   v1:0, pde:0, dPreload:0.35 },
  transfusao:   { nome:'Transfusão (conteúdo)', a1:0, b1:0, b2:0, v1:0, pde:0, dHb:3 }
};
var K_RVS=520, K_INO=0.42, K_HR=26, K_MET=130;   // ganhos didáticos por unidade de receptor
function applyLever(state, lever){
  var s=normState(state); var L=lever||{};
  var dRVS=K_RVS*(num(L.a1,0)+num(L.v1,0)) - K_RVS*0.8*num(L.b2,0) - K_RVS*0.7*num(L.pde,0);
  var dIno=K_INO*(num(L.b1,0)+num(L.pde,0));
  var dHR =K_HR*num(L.b1,0);
  var dMet=K_MET*(num(L.b1,0)+num(L.b2,0));
  return normState({ hb:s.hb+num(L.dHb,0), sao2:s.sao2, pao2:s.pao2, hr:s.hr+dHR,
    contractility:s.contractility+dIno, preload:s.preload+num(L.dPreload,0), rvs:s.rvs+dRVS,
    vo2demand:s.vo2demand+dMet, o2ermax:s.o2ermax, pvc:s.pvc });
}

// ---- adequação da alavanca ao termo quebrado (mecanismo casado + custo) ----
function appropriate(state, lever){
  var pre=cascade(state), broken=brokenTerm(state);
  var post=cascade(applyLever(state, lever));
  var rankPre=brokenRanking(state), rankPost=brokenRanking(post);
  var sevPre=(rankPre.filter(function(x){return x.id===broken;})[0]||{sev:0,label:broken});
  var sevPost=(rankPost.filter(function(x){return x.id===broken;})[0]||{sev:0});
  var moveuTermo = broken==='nenhum' ? false : (sevPost.sev < sevPre.sev - 0.04);
  var pioraFluxo = post.co < pre.co - 0.3;                      // ex.: α1 puro afundando o débito
  var pioraDeficit = post.o2deficit > pre.o2deficit + 1;
  var piorouPerfusao = pioraFluxo || pioraDeficit;
  var metCost = post.vo2demand - pre.vo2demand;
  var custoProibitivo = !moveuTermo && metCost > 120;          // β custa O2 sem mover o termo
  var melhorouEntrega = (post.o2deficit < pre.o2deficit - 1) || (moveuTermo && !piorouPerfusao && post.co > pre.co - 0.05 && post.pam >= pre.pam - 2);
  var ok = moveuTermo && !piorouPerfusao && !custoProibitivo;
  var why;
  if(broken==='nenhum') why='Sem termo claramente quebrado para casar a alavanca.';
  else if(pioraFluxo) why='Alavanca no termo errado: pós-carga sobre bomba fraca afunda o débito.';
  else if(pioraDeficit) why='A alavanca piora a relação oferta/demanda (déficit de O₂ sobe).';
  else if(custoProibitivo) why='Não move o termo quebrado e cobra demanda de O₂ desproporcional.';
  else if(ok) why='Move o termo quebrado ('+sevPre.label+') e melhora a entrega, com custo aceitável.';
  else why='Não move suficientemente o termo quebrado.';
  return { ok:ok, broken:broken, why:why, moveuTermo:moveuTermo, melhorouEntrega:melhorouEntrega, piorouPerfusao:piorouPerfusao, custoProibitivo:custoProibitivo, pre:pre, post:post };
}

// ---- presets de categoria (cada um quebra termos específicos) ----
var PRESETS={
  normal:       { label:'Normal', state:{}, broken:'nenhum' },
  hipovolemico: { label:'Hipovolêmico', state:{ preload:0.45, hr:115, rvs:1500 }, broken:'pre' },
  hemorragico:  { label:'Hemorrágico', state:{ preload:0.5, hb:7, hr:120, rvs:1450 }, broken:'pre' },
  cardiogenico: { label:'Cardiogênico', state:{ contractility:0.32, preload:1.15, hr:108, rvs:1750 }, broken:'bomba' },
  obstrutivo:   { label:'Obstrutivo (TEP)', state:{ preload:0.5, contractility:0.6, hr:122, rvs:1500 }, broken:'pre' },
  distributivo: { label:'Distributivo/séptico', state:{ rvs:520, hr:120, o2ermax:0.42, vo2demand:330 }, broken:'rvs' },
  anafilatico:  { label:'Anafilático', state:{ rvs:480, preload:0.6, hr:130 }, broken:'rvs' },
  neurogenico:  { label:'Neurogênico', state:{ rvs:560, hr:55, preload:0.7 }, broken:'rvs' },
  misto:        { label:'Misto (séptico+cardiogênico)', state:{ rvs:600, contractility:0.38, hr:118, o2ermax:0.45, vo2demand:320 }, broken:'rvs' },
  criptico:     { label:'Críptico/compensado', state:{ contractility:0.5, rvs:1500, hr:95, o2ermax:0.5, vo2demand:300 }, broken:'bomba' }
};

if(typeof module!=='undefined' && module.exports){
  module.exports={ K_HUFNER:K_HUFNER, K_DISS:K_DISS, SV_BASE:SV_BASE, NORMAL:NORMAL, normState:normState,
    cao2:cao2, strokeVolume:strokeVolume, cardiacOutput:cardiacOutput, pamOf:pamOf, do2crit:do2crit, vo2Of:vo2Of,
    cascade:cascade, profileOf:profileOf, brokenRanking:brokenRanking, brokenTerm:brokenTerm, isMixed:isMixed,
    LEVERS:LEVERS, applyLever:applyLever, appropriate:appropriate, PRESETS:PRESETS, TERMOS:TERMOS };
}
