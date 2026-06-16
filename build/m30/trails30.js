// build/m30/trails30.js — TRILHAS do M30 (puro, determinístico)
// Não gera questões novas: SELECIONA e ORDENA um subconjunto dos 225 itens
// existentes (bank30), compatível com a categoria escolhida e com as escolhas
// do usuário (tamanho 50/100/todas, semente). Cada trilha é um seletor sobre os
// metadados do item (axis, arms, difficulty, format, grounded, trap, modules).
'use strict';
var PSY=(typeof require!=='undefined')?require('./psyche30.js'):(typeof window!=='undefined'?window.PSY:null);

// nível: 'graduada' (cresce em dificuldade) · 'tema' (eixo do braço) ·
//        'interbracos' (pulmão–coração–rim) · 'formato' (tipo de item)
var TRAILS=[
  // ---- graduadas: do novato ao avançado ----
  { id:'novato',        nome:'Novato · reconhecimento',        nivel:'graduada', foco:'fundamentos', desc:'Itens de reconhecimento e decomposição básica (dificuldade 1). O ponto de partida.', sel:function(q){ return q.difficulty===1; } },
  { id:'aplicacao',     nome:'Aplicação & contraste',          nivel:'graduada', foco:'aplicar', desc:'Aplicar equações e diferenciar fenômenos próximos (dificuldade 2).', sel:function(q){ return q.difficulty===2; } },
  { id:'integracao',    nome:'Integração & conflito',          nivel:'graduada', foco:'cruzar', desc:'Cruzar módulos, conflitos de variáveis e pegadinhas (dificuldade 3).', sel:function(q){ return q.difficulty===3; } },
  { id:'avancado',      nome:'Avançado · exceções',            nivel:'graduada', foco:'exceções', desc:'Exceções, simultaneidade e leitura contraintuitiva (dificuldade 4).', sel:function(q){ return q.difficulty===4; } },
  { id:'escada',        nome:'Escada completa (novato→avançado)', nivel:'graduada', foco:'progressão', desc:'Todas as categorias, em dificuldade crescente: a progressão completa do braço.', sel:function(q){ return true; } },

  // ---- temas (eixos do braço 2) ----
  { id:'conteudo',      nome:'Conteúdo & transporte',          nivel:'tema', foco:'E1', desc:'CaO₂, curva de O₂, régua quantitativa (eixo E1).', sel:function(q){ return q.axis==='E1'; } },
  { id:'determinantes', nome:'Determinantes do débito',        nivel:'tema', foco:'E2', desc:'Guyton, Frank-Starling, pós-carga, DO₂/VO₂ (eixo E2).', sel:function(q){ return q.axis==='E2'; } },
  { id:'inversao',      nome:'A inversão & beira-leito',       nivel:'tema', foco:'E3', desc:'PAM = DC × RVS, monitorização, POCUS (eixo E3).', sel:function(q){ return q.axis==='E3'; } },
  { id:'micro',         nome:'Microcirculação & lactato',      nivel:'tema', foco:'E4', desc:'Extração, shunt, lactato tipo A/B (eixo E4).', sel:function(q){ return q.axis==='E4'; } },
  { id:'categorias',    nome:'Categorias de choque',           nivel:'tema', foco:'E5', desc:'Hipo, cardiogênico, VD, obstrutivo, distributivo e subtipos (eixo E5).', sel:function(q){ return q.axis==='E5'; } },
  { id:'mistos',        nome:'Integração & mistos',            nivel:'tema', foco:'E6', desc:'Misto, coração-pulmão, ressuscitação, críptico, perfis (eixo E6).', sel:function(q){ return q.axis==='E6'; } },
  { id:'alavancas',     nome:'Vasopressores & alavancas (§11)', nivel:'tema', foco:'E7', desc:'Receptor → termo, referência farmacológica educacional (eixo E7).', sel:function(q){ return q.axis==='E7'; } },
  { id:'capstone',      nome:'Capstone · síntese',             nivel:'tema', foco:'E8', desc:'A cascata integrada e a regra final do braço (eixo E8).', sel:function(q){ return q.axis==='E8'; } },

  // ---- inter-braços: pulmão–coração–rim ----
  { id:'pulmao-coracao-rim', nome:'Pulmão–coração–rim (tudo)',  nivel:'interbracos', foco:'R·P·F', desc:'Todas as questões que ligam dois ou três braços do hexápode (eixo E9).', sel:function(q){ return q.axis==='E9'; } },
  { id:'pulmao-coracao',     nome:'Pulmão × coração',           nivel:'interbracos', foco:'R·P', desc:'Troca gasosa × transporte/hemodinâmica: PEEP, curva, shunt, coração-pulmão.', sel:function(q){ return q.arms && q.arms.indexOf('R')>=0 && q.arms.indexOf('P')>=0; } },
  { id:'coracao-rim',        nome:'Coração × rim',              nivel:'interbracos', foco:'P·F', desc:'Perfusão × filtração: cardiorrenal, congestão venosa, perfusão renal.', sel:function(q){ return q.arms && q.arms.indexOf('P')>=0 && q.arms.indexOf('F')>=0; } },
  { id:'tres-bracos',        nome:'Os três braços juntos',      nivel:'interbracos', foco:'R·P·F', desc:'Questões que exigem pulmão, circulação E rim ao mesmo tempo (a tríade).', sel:function(q){ return q.arms && q.arms.length===3; } },
  { id:'pulmao-rim',         nome:'Pulmão × rim',               nivel:'interbracos', foco:'R·F', desc:'Troca gasosa × filtração: pH partilhado, hipoxemia renal, sobrecarga hídrica.', sel:function(q){ return q.arms && q.arms.indexOf('R')>=0 && q.arms.indexOf('F')>=0; } },

  // ---- formato / meta ----
  { id:'grounded',      nome:'Prova viva (engine-grounded)',   nivel:'formato', foco:'computado', desc:'Só os itens cujo gabarito é recomputado pelos motores do braço — fisiologia computada.', sel:function(q){ return !!q.grounded; } },
  { id:'calculo',       nome:'Cálculo & estimativa',           nivel:'formato', foco:'est', desc:'Itens numéricos de estimativa: CaO₂, DO₂, PAM, RVS, conversão dose↔mL/h.', sel:function(q){ return q.format==='est'; } },
  { id:'pegadinhas',    nome:'Caça às pegadinhas',             nivel:'formato', foco:'trap+ar', desc:'"Ache a pegadinha" e asserção-razão: treinar a identificar armadilhas e nexos.', sel:function(q){ return q.format==='trap' || q.format==='ar'; } },

  // ---- pessoais (dinâmicas: dependem das suas respostas/maestria) ----
  { id:'nao-respondidas', nome:'Continuar · o que falta',        nivel:'pessoal', foco:'pendentes', dyn:true, desc:'As questões que você ainda NÃO respondeu, em dificuldade crescente — continue de onde parou.', selDyn:function(q,ctx){ return !(ctx.answers&&(q.id in ctx.answers)); } },
  { id:'remediacao',      nome:'Remediação · meus eixos fracos', nivel:'pessoal', foco:'lacunas', dyn:true, desc:'Itens ainda não feitos nos eixos em que o radar de maestria aponta lacuna (<60%). Responda algumas questões para ativar.', selDyn:function(q,ctx){ return ctx.weakAxes && ctx.weakAxes.indexOf(q.axis)>=0 && !(ctx.answers&&(q.id in ctx.answers)); } }
];

// ---- por armadilha cognitiva: uma trilha para cada armadilha com itens suficientes ----
var TRAP_NOME={ T01:'número ≠ mecanismo', T02:'PAM ≠ perfusão', T03:'conteúdo ≠ saturação', T04:'responsivo ≠ tolerante', T05:'distributivo ≠ séptico', T06:'SvO₂ alta ≠ boa extração', T07:'hipotensão ≠ hipovolemia', T08:'VD ≠ VE', T09:'pós-carga ≠ PA', T11:'mecanismo farmacológico ≠ dose', T12:'lactato alto ≠ sempre hipóxia', T13:'supply-independent × dependent', T14:'pressor melhora macro ≠ micro' };
['T01','T02','T03','T04','T05','T06','T07','T08','T09','T11','T12','T13','T14'].forEach(function(code){
  TRAILS.push({ id:'armadilha-'+code, nome:'Armadilha · '+TRAP_NOME[code], nivel:'armadilha', foco:code,
    desc:'Treino dirigido à armadilha cognitiva "'+TRAP_NOME[code]+'" — todas as questões que a testam.',
    sel:(function(c){ return function(q){ return q.trap===c; }; })(code) });
});

function byId(id){ for(var i=0;i<TRAILS.length;i++){ if(TRAILS[i].id===id) return TRAILS[i]; } return null; }

// ordena por dificuldade crescente; dentro de cada faixa, embaralha por seed
function _ordered(sel, seed){
  var tiers={1:[],2:[],3:[],4:[]};
  sel.forEach(function(q){ (tiers[q.difficulty]||(tiers[q.difficulty]=[])).push(q); });
  var out=[]; [1,2,3,4].forEach(function(d){ var t=tiers[d]||[]; out=out.concat(PSY?PSY.shuffle(t, seed+d):t); });
  return out;
}
// seletor de uma trilha (estática ou dinâmica); ctx = { answers, weakAxes } para as dinâmicas
function _pred(def, ctx){ ctx=ctx||{}; return def.dyn ? function(q){ return def.selDyn(q, ctx); } : def.sel; }
// amostragem por passo (strided) preserva o arco novato→avançado mesmo ao cortar o tamanho
function buildTrail(items, id, opts){
  opts=opts||{}; var seed=opts.seed||7, length=opts.length||0;
  var def=byId(id); if(!def) return [];
  var ordered=_ordered(items.filter(_pred(def, opts.ctx)), seed);
  if(length>0 && length<ordered.length){
    // amostra por passo cobrindo TODO o arco: i=0 → primeiro (mais fácil), i=L-1 → último (mais difícil)
    var N=ordered.length, out=[];
    for(var i=0;i<length;i++){ var idx=(length===1)?0:Math.round(i*(N-1)/(length-1)); out.push(ordered[idx]); }
    return out;
  }
  return ordered;
}
// quantos itens cada trilha tem disponível + faixa de dificuldade (ctx para as dinâmicas)
function trailStats(items, ctx){
  return TRAILS.map(function(t){
    var sel=items.filter(_pred(t, ctx)), difs={};
    sel.forEach(function(q){ difs[q.difficulty]=(difs[q.difficulty]||0)+1; });
    return { id:t.id, nome:t.nome, nivel:t.nivel, foco:t.foco, dyn:!!t.dyn, total:sel.length, difs:difs };
  });
}

if(typeof module!=='undefined' && module.exports){ module.exports={ TRAILS:TRAILS, byId:byId, buildTrail:buildTrail, trailStats:trailStats }; }
