// build/m30/grounding30.js — Verificação ENGINE-GROUNDED do M30+ (puro)
// Recomputa a resposta de um item pelos motores já testados (m1, m9, m28, m29)
// e exige que o gabarito declarado (item.a) aponte para a opção que CASA com o
// resultado do motor. Itens grounded têm:
//   grounded: { ref:'<engine>.<call>', args:{...}, kind:'label'|'number',
//               optionValues:[v0,v1,v2,v3], tol?:number }
// optionValues alinha-se a item.o[] (mesma ordem A..D). label → match exato;
// number → opção mais próxima do valor computado (com checagem de discriminação).
'use strict';

var m1=require('../m1/model1.js');
var m9=require('../m9/model9.js');
var m29=require('../m29/model29.js');
var pharm=require('../m28/pharm28.js');

function compute(g){
  var a=g.args||{};
  switch(g.ref){
    case 'model29.brokenTerm':   return m29.brokenTerm(a.state);
    case 'model29.cascade.pam':  return m29.cascade(a.state).pam;
    case 'model29.cascade.co':   return m29.cascade(a.state).co;
    case 'model29.cascade.do2':  return m29.cascade(a.state).do2;
    case 'model29.cascade.svo2': return m29.cascade(a.state).svo2;
    case 'model29.cascade.cao2': return m29.cascade(a.state).cao2;
    case 'model1.ca':            return m1.ca(a.hb, a.sao2, a.pao2);
    case 'model1.do2':           return m1.do2(a.dc, a.cao2);
    case 'model9.pam':           return m9.pam(a.co, a.rvs, a.pvc);
    case 'model9.rvsForPam':     return m9.rvsForPam(a.pam, a.dc, a.pvc);
    case 'pharm.infusionRate':   return pharm.infusionRate(a.drug, a.dose, a.weight);
    case 'pharm.concentration':  return pharm.concentration(a.drug).value;
    default: throw new Error('grounding30: ref desconhecida ' + g.ref);
  }
}

// índice da opção que casa com o valor computado
function matchIndex(g, actual){
  if(g.kind==='label'){ return g.optionValues.indexOf(actual); }
  // number: a mais próxima
  var best=Infinity, idx=-1;
  g.optionValues.forEach(function(v,i){ var d=Math.abs(v-actual); if(d<best){ best=d; idx=i; } });
  return idx;
}

function verify(item){
  var g=item.grounded; if(!g) return { grounded:false, ok:true };
  var actual=compute(g);
  var idx=matchIndex(g, actual);
  var res={ grounded:true, ref:g.ref, kind:g.kind, actual:actual, expectedIdx:idx, answerIdx:item.a, ok:(idx===item.a) };
  // discriminação (number): o distrator mais próximo não pode estar dentro da tolerância da correta
  if(g.kind==='number'){
    var tol=(g.tol==null?0.001:g.tol);
    var nearest=Infinity;
    g.optionValues.forEach(function(v,i){ if(i!==item.a){ var d=Math.abs(v-actual); if(d<nearest) nearest=d; } });
    res.discriminates = nearest > tol;
    res.ok = res.ok && res.discriminates;
  }
  return res;
}

// verifica um banco inteiro; retorna o resumo
function verifyBank(items){
  var grounded=0, ok=0, fails=[];
  items.forEach(function(q){ if(q.grounded){ grounded++; var r=verify(q); if(r.ok) ok++; else fails.push({id:q.id, ref:r.ref, actual:r.actual, expectedIdx:r.expectedIdx, answerIdx:r.answerIdx, discriminates:r.discriminates}); } });
  return { grounded:grounded, ok:ok, fails:fails };
}

if(typeof module!=='undefined' && module.exports){ module.exports={ compute:compute, matchIndex:matchIndex, verify:verify, verifyBank:verifyBank }; }
