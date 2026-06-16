// build/m30/test30.node.js — Testes da PARTE 1 do M30+ (infra + itens 1–50)
const P=require('./psyche30.js');
const G=require('./grounding30.js');
const S=require('./scoring30.js');
const Bank=require('./bank30.js');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };

const items=Bank.buildBank();

console.log('— PSYCHE30 · motor psicométrico —');
ok('LCG determinístico (mesma seed → mesma sequência)', (function(){ var a=P.lcg(7),b=P.lcg(7); return a()===b() && a()===b(); })());
ok('shuffle determinístico e que permuta', (function(){ var arr=[0,1,2,3,4,5,6,7,8,9]; var x=P.shuffle(arr,42), y=P.shuffle(arr,42); return JSON.stringify(x)===JSON.stringify(y) && JSON.stringify(x)!==JSON.stringify(arr) && x.slice().sort().join()===arr.join(); })());
ok('maxRun detecta corrida', P.maxRun([{a:0},{a:0},{a:0},{a:1}])===3);
ok('hasRegularSequence detecta A,B,C,D...', P.hasRegularSequence([{a:0},{a:1},{a:2},{a:3},{a:0},{a:1},{a:2},{a:3}])===true);
ok('hasRegularSequence detecta pares A,A,B,B...', P.hasRegularSequence([{a:0},{a:0},{a:1},{a:1},{a:2},{a:2},{a:3},{a:3}])===true);
ok('letterDistOk reprova fora da banda', P.letterDistOk([{a:0},{a:0},{a:0},{a:0}],0.15,0.35)===false);
ok('correctIsLongest detecta opção correta mais longa', P.correctIsLongest({o:['ab','abcdefgh','cd','ef'],a:1})===true);

console.log('\n— GROUNDING30 · recomputação engine-grounded —');
const vb=G.verifyBank(items);
ok('itens engine-grounded (≥20 no banco completo)', vb.grounded>=20, vb.grounded);
ok('TODO gabarito grounded bate com o motor', vb.ok===vb.grounded && vb.fails.length===0, vb.ok+'/'+vb.grounded+(vb.fails.length?(' · falhas: '+JSON.stringify(vb.fails.slice(0,3))):''));
ok('grounded numérico discrimina (distrator não cola na correta)', items.filter(q=>q.grounded&&q.grounded.kind==='number').every(q=>G.verify(q).discriminates));

console.log('\n— BANK30 · banco COMPLETO (225 itens: 150 M30 + 75 inter-braços) —');
ok('225 itens', items.length===225, items.length);
ok('ids únicos', new Set(items.map(q=>q.id)).size===items.length);
ok('enunciados únicos', new Set(items.map(q=>q.stem)).size===items.length);
ok('todos bem-formados (4 opções, índice, metadados, rationale 5 camadas)', items.every(P.itemWellFormed));
ok('firewall: sem ordem imperativa individualizada (§11 permite referência)', items.every(P.firewallOk));
ok('9 eixos cobertos (E1–E8 + E9 inter-braços)', P.AXES.every(e=>P.axisCounts(items)[e]>0), JSON.stringify(P.axisCounts(items)));
ok('6 formatos presentes', Object.keys(P.formatCounts(items)).length>=6, JSON.stringify(P.formatCounts(items)));
(function(){ var e9=items.filter(q=>q.axis==='E9'); var combos={}; e9.forEach(q=>{var k=(q.arms||[]).slice().sort().join('');combos[k]=(combos[k]||0)+1;});
  ok('75 itens inter-braços (E9)', e9.length===75, e9.length);
  ok('cada item inter-braços envolve 2–3 braços, NUNCA um só', e9.every(q=>Array.isArray(q.arms)&&q.arms.length>=2&&q.arms.length<=3&&q.arms.every(a=>['R','P','F'].indexOf(a)>=0)));
  ok('combos de braços presentes (R·P, P·F, R·F, R·P·F)', combos['PR']>0&&combos['FP']>0&&combos['FPR']>0, JSON.stringify(combos)); })();

console.log('\n— DISTRIBUIÇÃO & ANTI-PADRÃO (sobre o banco acumulado) —');
const lc=P.letterCounts(items);
ok('as 4 letras presentes', Object.keys(lc).every(L=>lc[L]>0), 'A'+lc.A+' B'+lc.B+' C'+lc.C+' D'+lc.D);
ok('cada letra na banda 15–35%', P.letterDistOk(items,0.15,0.35), JSON.stringify(P.letterFractions(items)));
ok('distribuição assimétrica (não uniforme)', P.nonUniform(items,0.06));
ok('correta NÃO é a mais longa na maioria (<40%)', P.longestCorrectFraction(items)<0.40, Math.round(P.longestCorrectFraction(items)*100)+'%');
ok('maior-número-correto não domina (<50% dos numéricos)', P.largestNumberCorrectFraction(items)<0.50, Math.round(P.largestNumberCorrectFraction(items)*100)+'%');
ok('sem corrida longa de letra (≤3) na ordem montada', P.maxRun(items)<=3, 'run '+P.maxRun(items));
ok('sem sequência regular A-B-C-D / pares', P.hasRegularSequence(items)===false);
ok('sem termos absolutos dominando a correta (<25%)', P.absoluteCorrectFraction(items)<0.25, Math.round(P.absoluteCorrectFraction(items)*100)+'%');
ok('sem atalho "todas/nenhuma das anteriores"', P.hasAllNoneShortcut(items)===false);

console.log('\n— SCORING30 · maestria —');
(function(){
  // simula: acerta tudo de E1, erra tudo de E3
  var ans={}; items.forEach(q=>{ if(q.axis==='E1') ans[q.id]=q.a; else if(q.axis==='E3') ans[q.id]=(q.a+1)%4; });
  var rep=S.report(items, ans);
  var e1=rep.axisVerdicts.find(a=>a.id==='E1'), e3=rep.axisVerdicts.find(a=>a.id==='E3');
  ok('agrega por eixo: E1 domina, E3 lacuna', e1.veredito==='domina' && e3.veredito==='lacuna', 'E1 '+Math.round(e1.pct*100)+'% · E3 '+Math.round(e3.pct*100)+'%');
  ok('remediação aponta o eixo fraco com módulos', rep.remediation.some(r=>r.eixo==='E3' && r.modulos.indexOf('M9')>=0));
  ok('veredito de domínio é gerado', typeof rep.domain.nivel==='string' && rep.domain.texto.length>10, rep.domain.nivel);
})();

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
