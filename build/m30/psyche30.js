// build/m30/psyche30.js — Motor PSICOMÉTRICO do M30+ (puro, determinístico)
// Embaralhamento semeado (LCG), distribuição de letras (global + por quarto),
// varreduras anti-padrão (corridas, sequências regulares, maior-número,
// termos absolutos, atalhos "todas/nenhuma"), paridade de comprimento,
// monotonia de dificuldade, pisos de cobertura (eixo) e da taxonomia de
// armadilhas. Opera sobre itens no formato do bank30 (o:[4], a:índice).
'use strict';

var LETTERS=['A','B','C','D'];
function letterOf(i){ return LETTERS[i]; }

// ---- LCG determinístico (Numerical Recipes) ----
function lcg(seed){ var s=(seed>>>0)||1; return function(){ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; }; }
function shuffle(arr, seed){ var r=lcg(seed), a=arr.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(r()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

// ---- distribuição de letras ----
function letterCounts(items){ var d={A:0,B:0,C:0,D:0}; items.forEach(function(q){ d[letterOf(q.a)]++; }); return d; }
function letterFractions(items){ var d=letterCounts(items), n=items.length||1; return {A:d.A/n,B:d.B/n,C:d.C/n,D:d.D/n}; }
// cada letra entre min e max (frações); por padrão a banda constitucional 0,15–0,35
function letterDistOk(items, min, max){ min=(min==null?0.15:min); max=(max==null?0.35:max); var f=letterFractions(items);
  return LETTERS.every(function(L){ return f[L]>=min && f[L]<=max; }); }
// não-uniforme (assimétrica o bastante): amplitude entre maior e menor ≥ tol
function nonUniform(items, tol){ tol=(tol==null?0.04:tol); var f=letterFractions(items); var vs=LETTERS.map(function(L){return f[L];}); return (Math.max.apply(null,vs)-Math.min.apply(null,vs))>=tol; }

// ---- varreduras de padrão (sobre uma ORDEM montada de itens) ----
function maxRun(items){ var run=1,mx=1; for(var i=1;i<items.length;i++){ if(items[i].a===items[i-1].a){ run++; if(run>mx)mx=run; } else run=1; } return mx; }
// detecta sequência regular A,B,C,D,A,B,C,D... ou A,A,B,B,...
function hasRegularSequence(items){ if(items.length<8) return false;
  var asc=true, pair=true;
  for(var i=1;i<items.length;i++){ if((items[i-1].a+1)%4!==items[i].a%4) asc=false; }
  for(var j=0;j<items.length-1;j+=2){ if(items[j].a!==items[j+1].a) pair=false; }
  return asc||pair; }

// ---- forma das alternativas ----
// estritamente mais longa que TODOS os distratores (empates não contam como "gaming por tamanho")
function correctIsLongest(q){ var L=q.o.map(function(s){return s.length;}); var cl=L[q.a]; return L.every(function(x,i){ return i===q.a || x<cl; }); }
function longestCorrectFraction(items){ var c=0; items.forEach(function(q){ if(correctIsLongest(q)) c++; }); return items.length?c/items.length:0; }
// itens cujas 4 opções são numéricas: a correta é o maior número?
function numericOf(s){ var m=String(s).replace(',','.').match(/-?\d+(\.\d+)?/); return m?parseFloat(m[0]):null; }
function largestNumberCorrectFraction(items){ var n=0,c=0; items.forEach(function(q){ var nums=q.o.map(numericOf); if(nums.every(function(x){return x!==null;})){ n++; if(nums[q.a]===Math.max.apply(null,nums)) c++; } }); return n?c/n:0; }
var ABS_RE=/\b(sempre|nunca|todos?|todas?|nenhum[ao]?|jamais|qualquer|impossível|garante|exclui)\b/i;
function absoluteCorrectFraction(items){ var c=0; items.forEach(function(q){ if(ABS_RE.test(q.o[q.a])) c++; }); return items.length?c/items.length:0; }
function hasAllNoneShortcut(items){ var re=/(todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)|n\.d\.a\.|t\.d\.a\.)/i; return items.some(function(q){ return q.o.some(function(o){ return re.test(o); }); }); }

// ---- dificuldade crescente por quarto ----
function meanBy(items, key){ if(!items.length) return 0; return items.reduce(function(s,q){return s+q[key];},0)/items.length; }
function difficultyMonotonic(items){ var qs=[1,2,3,4].map(function(Q){ return meanBy(items.filter(function(x){return x.quarter===Q;}),'difficulty'); });
  for(var i=1;i<qs.length;i++){ if(qs[i] < qs[i-1]) return false; } return true; }

// ---- cobertura ----
function axisCounts(items){ var d={}; items.forEach(function(q){ d[q.axis]=(d[q.axis]||0)+1; }); return d; }
function axisFloorOk(items, floors){ var c=axisCounts(items); return Object.keys(floors).every(function(E){ return (c[E]||0)>=floors[E]; }); }
function trapCounts(items){ var d={}; items.forEach(function(q){ if(q.trap) d[q.trap]=(d[q.trap]||0)+1; }); return d; }
function trapCoverageOk(items, traps, min){ var c=trapCounts(items); return traps.every(function(T){ return (c[T]||0)>=min; }); }
function formatCounts(items){ var d={}; items.forEach(function(q){ d[q.format]=(d[q.format]||0)+1; }); return d; }

// ---- bem-formação de item ----
var FORMATS=['sba','ar','vf','est','trap','vignette'];
var AXES=['E1','E2','E3','E4','E5','E6','E7','E8'];
function itemWellFormed(q){
  return q && typeof q.id==='string'
    && FORMATS.indexOf(q.format)>=0 && AXES.indexOf(q.axis)>=0
    && [1,2,3,4].indexOf(q.quarter)>=0 && [1,2,3,4].indexOf(q.difficulty)>=0
    && Array.isArray(q.o) && q.o.length===4 && q.o.every(function(s){return typeof s==='string'&&s.length>1;})
    && Number.isInteger(q.a) && q.a>=0 && q.a<4
    && Array.isArray(q.modules) && q.modules.length>0
    && typeof q.stem==='string' && q.stem.length>8
    && q.rationale && typeof q.rationale.correct==='string' && q.rationale.correct.length>8
    && Array.isArray(q.rationale.why) && q.rationale.why.length===4 && q.rationale.why.every(function(s){return typeof s==='string'&&s.length>3;})
    && typeof q.rationale.trap==='string' && typeof q.rationale.concept==='string';
}
// firewall: sem dose/ordem imperativa nos textos do item
var DOSE_RE=/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i;
var IMPER_RE=/\b(inicie|administre|titule|prescreva|comece|fa[çc]a|d[êe])\s+\S+\s+(neste|no|na|para o|para a|para este|deste|nesta)\s+paciente/i;
function firewallOk(q){ var t=[q.stem].concat(q.o).concat([q.rationale.correct],q.rationale.why); return !t.some(function(s){ return DOSE_RE.test(s)||IMPER_RE.test(s); }); }

if(typeof module!=='undefined' && module.exports){ module.exports={
  LETTERS:LETTERS, letterOf:letterOf, lcg:lcg, shuffle:shuffle,
  letterCounts:letterCounts, letterFractions:letterFractions, letterDistOk:letterDistOk, nonUniform:nonUniform,
  maxRun:maxRun, hasRegularSequence:hasRegularSequence,
  correctIsLongest:correctIsLongest, longestCorrectFraction:longestCorrectFraction,
  largestNumberCorrectFraction:largestNumberCorrectFraction, absoluteCorrectFraction:absoluteCorrectFraction, hasAllNoneShortcut:hasAllNoneShortcut,
  difficultyMonotonic:difficultyMonotonic, axisCounts:axisCounts, axisFloorOk:axisFloorOk,
  trapCounts:trapCounts, trapCoverageOk:trapCoverageOk, formatCounts:formatCounts,
  itemWellFormed:itemWellFormed, firewallOk:firewallOk, FORMATS:FORMATS, AXES:AXES
}; }
