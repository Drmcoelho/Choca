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

console.log('\n— TRILHAS (trails30 · seleciona e ordena os itens existentes) —');
const Tr=require('./trails30.js');
const stt=Tr.trailStats(items);
ok('pelo menos 15 trilhas', Tr.TRAILS.length>=15, Tr.TRAILS.length);
ok('cobre novato → avançado + temas + inter-braços + formato', ['graduada','tema','interbracos','formato'].every(n=>Tr.TRAILS.some(t=>t.nivel===n)));
ok('ids de trilha únicos', new Set(Tr.TRAILS.map(t=>t.id)).size===Tr.TRAILS.length);
ok('toda trilha ESTÁTICA seleciona ≥1 item dos existentes', stt.filter(t=>!t.dyn).every(t=>t.total>0));
ok('toda trilha tem nome e descrição', Tr.TRAILS.every(t=>t.nome&&t.nome.length>3&&t.desc&&t.desc.length>10));
ok('trilhas NÃO criam itens novos (subconjunto do banco)', Tr.TRAILS.every(t=>Tr.buildTrail(items,t.id,{}).every(q=>items.indexOf(q)>=0)));
ok('"escada" é a progressão completa, em dificuldade crescente', (function(){ var e=Tr.buildTrail(items,'escada',{}); if(e.length!==items.length) return false; for(var i=1;i<e.length;i++) if(e[i].difficulty<e[i-1].difficulty) return false; return true; })());
ok('embaralhamento por seed é determinístico', JSON.stringify(Tr.buildTrail(items,'categorias',{seed:7}).map(q=>q.id))===JSON.stringify(Tr.buildTrail(items,'categorias',{seed:7}).map(q=>q.id)));
ok('escolha de tamanho (50) respeitada e preserva o arco', (function(){ var s=Tr.buildTrail(items,'escada',{length:50}); return s.length===50 && s.some(q=>q.difficulty===1) && s.some(q=>q.difficulty===4); })());
ok('escolha de tamanho (100) respeitada', Tr.buildTrail(items,'escada',{length:100}).length===100);
ok('pulmão-coração-rim seleciona só inter-braços (E9)', Tr.buildTrail(items,'pulmao-coracao-rim',{}).every(q=>q.axis==='E9'));
ok('"três braços" seleciona itens com R, P e F', (function(){ var t=Tr.buildTrail(items,'tres-bracos',{}); return t.length>0 && t.every(q=>q.arms&&q.arms.length===3); })());
ok('pulmão×coração liga R e P; coração×rim liga P e F', Tr.buildTrail(items,'pulmao-coracao',{}).every(q=>q.arms.indexOf('R')>=0&&q.arms.indexOf('P')>=0) && Tr.buildTrail(items,'coracao-rim',{}).every(q=>q.arms.indexOf('P')>=0&&q.arms.indexOf('F')>=0));
ok('trilha "prova viva" só engine-grounded', Tr.buildTrail(items,'grounded',{}).every(q=>!!q.grounded));
ok('níveis incluem pessoal (dinâmicas) e armadilha', ['graduada','tema','interbracos','formato','pessoal','armadilha'].every(n=>Tr.TRAILS.some(t=>t.nivel===n)));
ok('trilhas por armadilha (≥10) selecionam só o trap-código', (function(){ var traps=Tr.TRAILS.filter(t=>t.nivel==='armadilha'); if(traps.length<10) return false; return traps.every(t=>{ var sel=Tr.buildTrail(items,t.id,{}); return sel.length>0 && sel.every(q=>q.trap===t.foco); }); })());
(function(){ var ans={}; items.slice(0,10).forEach(q=>{ ans[q.id]=q.a; });
  ok('dinâmica "o que falta" reflete as respondidas', Tr.buildTrail(items,'nao-respondidas',{ctx:{answers:ans}}).length===items.length-10 && Tr.buildTrail(items,'nao-respondidas',{ctx:{answers:ans}}).every(q=>!(q.id in ans)));
  ok('dinâmica "remediação" usa eixos fracos (não respondidos)', (function(){ var r=Tr.buildTrail(items,'remediacao',{ctx:{answers:ans,weakAxes:['E5']}}); return r.length>0 && r.every(q=>q.axis==='E5'&&!(q.id in ans)); })());
  ok('dinâmica "remediação" vazia sem eixo fraco', Tr.buildTrail(items,'remediacao',{ctx:{answers:ans,weakAxes:[]}}).length===0);
  ok('trailStats aceita contexto (dyn marcado)', Tr.trailStats(items,{answers:ans,weakAxes:[]}).find(s=>s.id==='nao-respondidas').dyn===true); })();

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
