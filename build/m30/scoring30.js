// build/m30/scoring30.js — Motor de MAESTRIA do M30+ (puro)
// Agrega respostas por eixo de competência → radar (% por eixo), veredito de
// domínio e remediação (módulos a revisar nos eixos fracos). Entrada: itens do
// bank + um mapa de respostas {id -> índice escolhido}.
'use strict';

var AXES=[
  { id:'E1', nome:'Conteúdo & transporte',        modulos:['M0','M1','M2'] },
  { id:'E2', nome:'Determinantes do débito',      modulos:['M3','M4','M5','M6','M7','M8'] },
  { id:'E3', nome:'Inversão & beira-leito',       modulos:['M9','M10','M11'] },
  { id:'E4', nome:'Microcirculação & lactato',    modulos:['M12','M13'] },
  { id:'E5', nome:'Categorias de choque',         modulos:['M14','M15','M16','M17','M18','M19','M20','M21','M22'] },
  { id:'E6', nome:'Integração & mistos',          modulos:['M23','M24','M25','M26','M27'] },
  { id:'E7', nome:'Alavancas (farmacologia §11)', modulos:['M28'] },
  { id:'E8', nome:'Síntese / capstone',           modulos:['M29'] }
];
// answers: { itemId: índiceEscolhido }
function score(items, answers){
  answers=answers||{};
  var per={}; AXES.forEach(function(a){ per[a.id]={ id:a.id, nome:a.nome, total:0, answered:0, correct:0, modulos:a.modulos }; });
  var total=0, answered=0, correct=0;
  items.forEach(function(q){
    var ax=per[q.axis]; if(!ax) return; ax.total++; total++;
    if(q.id in answers){ ax.answered++; answered++; var ok=(answers[q.id]===q.a); if(ok){ ax.correct++; correct++; } }
  });
  AXES.forEach(function(a){ var p=per[a.id]; p.pct=p.answered?(p.correct/p.answered):0; });
  return { total:total, answered:answered, correct:correct, pct:(answered?correct/answered:0), axes:AXES.map(function(a){return per[a.id];}) };
}

// veredito por eixo: domina ≥0,80 · parcial ≥0,60 · lacuna <0,60 (só conta eixos respondidos)
function axisVerdict(p){ if(!p.answered) return 'sem dados'; if(p.pct>=0.80) return 'domina'; if(p.pct>=0.60) return 'parcial'; return 'lacuna'; }

// veredito global de domínio
function domainVerdict(s){
  if(!s.answered) return { nivel:'sem dados', texto:'Responda o exame para gerar o veredito.' };
  if(s.answered < s.total) return { nivel:'incompleto', texto:'Responda a todas as questões para gerar o veredito de domínio.' };
  var fracas=s.axes.filter(function(p){ return p.answered && p.pct<0.60; });
  if(s.pct>=0.85 && fracas.length===0) return { nivel:'domínio sólido', texto:'Internalizou o mapa causal: decompõe, casa a alavanca ao termo e pesa o custo em todos os eixos.' };
  if(s.pct>=0.70 && fracas.length<=1) return { nivel:'domínio consistente', texto:'Mapa causal sólido, com '+(fracas.length?('uma lacuna em '+fracas[0].nome):'pequenas arestas')+'.' };
  if(s.pct>=0.55) return { nivel:'domínio em formação', texto:'Bases presentes; revise os eixos marcados como lacuna antes de considerar o domínio fechado.' };
  return { nivel:'domínio frágil', texto:'Vários eixos com lacuna: o raciocínio ainda decora rótulos em vez de decompor o mecanismo.' };
}

// remediação: módulos a revisar nos eixos fracos
function remediation(s){
  return s.axes.filter(function(p){ return p.answered && p.pct<0.60; })
    .sort(function(a,b){ return a.pct-b.pct; })
    .map(function(p){ return { eixo:p.id, nome:p.nome, pct:p.pct, modulos:p.modulos }; });
}

function report(items, answers){ var s=score(items, answers);
  return { score:s, axisVerdicts:s.axes.map(function(p){ return { id:p.id, nome:p.nome, pct:p.pct, veredito:axisVerdict(p) }; }),
           domain:domainVerdict(s), remediation:remediation(s) }; }

if(typeof module!=='undefined' && module.exports){ module.exports={ AXES:AXES, score:score, axisVerdict:axisVerdict, domainVerdict:domainVerdict, remediation:remediation, report:report }; }
