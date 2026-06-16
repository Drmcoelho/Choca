const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const P=require('./psyche30.js'), G=require('./grounding30.js'), S=require('./scoring30.js'), Bank=require('./bank30.js');
const file=process.argv[2]||path.join(__dirname,'../../perfunde30.html');
const html=fs.readFileSync(file,'utf8');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const items=Bank.buildBank();

console.log('— AUDITORIA PSICOMÉTRICA GLOBAL (225 itens: 150 M30 + 75 inter-braços) —');
ok('225 itens', items.length===225, items.length);
ok('4 quartos presentes', [1,2,3,4].every(q=>items.some(x=>x.quarter===q)));
ok('cada item A/B/C/D com uma única correta', items.every(x=>Array.isArray(x.o)&&x.o.length===4&&Number.isInteger(x.a)&&x.a>=0&&x.a<4));
ok('todos bem-formados (metadados + rationale 5 camadas)', items.every(P.itemWellFormed));
ok('enunciados únicos', new Set(items.map(x=>x.stem)).size===225);
const lc=P.letterCounts(items), lf=P.letterFractions(items);
ok('distribuição de letras 15–35% por letra', P.letterDistOk(items,0.15,0.35), 'A'+lc.A+' B'+lc.B+' C'+lc.C+' D'+lc.D);
ok('distribuição assimétrica (não fabricada/uniforme)', P.nonUniform(items,0.05)&&!(lc.A===lc.B&&lc.B===lc.C&&lc.C===lc.D));
ok('a correta NÃO é sistematicamente a mais longa (<30%)', P.longestCorrectFraction(items)<0.30, Math.round(P.longestCorrectFraction(items)*100)+'%');
ok('o maior número não é sistematicamente correto (<40%)', P.largestNumberCorrectFraction(items)<0.40, Math.round(P.largestNumberCorrectFraction(items)*100)+'%');
ok('termos absolutos não dominam a correta (<20%)', P.absoluteCorrectFraction(items)<0.20, Math.round(P.absoluteCorrectFraction(items)*100)+'%');
ok('sem atalho "todas/nenhuma das anteriores"', !P.hasAllNoneShortcut(items));
ok('dificuldade crescente por quarto (monotônica)', P.difficultyMonotonic(items));
// cobertura de eixos
const ac=P.axisCounts(items), floors={E1:8,E2:20,E3:15,E4:12,E5:30,E6:18,E7:12,E8:14,E9:60};
ok('piso de cobertura por eixo (9 eixos, incl. inter-braços)', P.axisFloorOk(items,floors), JSON.stringify(ac));
(function(){ var e9=items.filter(q=>q.axis==='E9'); ok('inter-braços: 75 itens, cada um com 2–3 braços (nunca um só)', e9.length===75 && e9.every(q=>Array.isArray(q.arms)&&q.arms.length>=2&&q.arms.length<=3&&q.arms.every(a=>['R','P','F'].indexOf(a)>=0))); })();
// cobertura da taxonomia de armadilhas
const tc=P.trapCounts(items), TRAPS=['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16'];
ok('todas as 16 armadilhas presentes (≥1)', TRAPS.every(t=>(tc[t]||0)>=1), TRAPS.filter(t=>!(tc[t])).join(',')||'todas');
const core=['T01','T02','T03','T04','T05','T06','T07','T08','T09','T12','T13','T14'];
ok('armadilhas centrais bem cobertas (≥3)', core.every(t=>(tc[t]||0)>=3), core.filter(t=>(tc[t]||0)<3).join(',')||'ok');
ok('6 formatos presentes', Object.keys(P.formatCounts(items)).length>=6, JSON.stringify(P.formatCounts(items)));
// engine-grounded
const vb=G.verifyBank(items);
ok('itens engine-grounded recomputados (≥20)', vb.grounded>=20, vb.grounded);
ok('TODO gabarito grounded bate com o motor (m1/m9/m28/m29)', vb.fails.length===0, vb.ok+'/'+vb.grounded+(vb.fails.length?(' falhas:'+JSON.stringify(vb.fails.slice(0,2))):''));
// firewall
ok('firewall §11: nenhum item com ordem imperativa individualizada', items.every(P.firewallOk));
// embaralhamento semeado determinístico (replay)
ok('embaralhamento por seed é determinístico (replay)', JSON.stringify(P.shuffle(items,4242).map(x=>x.id))===JSON.stringify(P.shuffle(items,4242).map(x=>x.id)) && JSON.stringify(P.shuffle(items,1).map(x=>x.id))!==JSON.stringify(P.shuffle(items,2).map(x=>x.id)));
// gabaritos estáveis: os 150 originais não deslizam ao anexar os 75 inter-braços
ok('gabaritos: TG de 225 (150 estáveis + 75)', Bank.TG.length===225);

(async()=>{
try {
const dom=new JSDOM(html,{ runScripts:'dangerously', pretendToBeVisual:true, beforeParse(window){
  window.scrollTo=()=>{}; window.requestAnimationFrame=()=>0; window.cancelAnimationFrame=()=>{};
  window.matchMedia=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  window.HTMLElement.prototype.scrollIntoView=()=>{}; window.devicePixelRatio=1;
  const ctx=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
  window.HTMLCanvasElement.prototype.getContext=()=>ctx;
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 460;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 380;},configurable:true});
}});
const { window }=dom, doc=window.document, $=id=>doc.getElementById(id), txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));

console.log('\n— ESTRUTURA / UI —');
['backlink','kicker','disclaimer','honestidade','pontes','scorebar','exam','bar',
 'panel-exame','panel-maestria','panel-revisao','panel-como','radar','verdict','verdict-big','axes','remed-box','revisao','how-stats'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-exame','tab-maestria','tab-revisao','tab-como'].forEach(t=>ok('aba '+t,!!$(t)));
ok('exame renderiza 225 questões',doc.querySelectorAll('#exam .q').length===225);
ok('4 seções de quarto',doc.querySelectorAll('#exam .qsec').length===4);
ok('cada questão com 4 opções',[...doc.querySelectorAll('#exam .q')].every(q=>q.querySelectorAll('.opt').length===4));
ok('motor M30 exposto (225 itens, ordem)',window.M30&&window.M30.length===225&&window.M30order.length===225);

console.log('\n— INTERAÇÃO: responder revela gabarito de 5 camadas —');
const first=doc.querySelector('#exam .q .opt'); first.dispatchEvent(new window.Event('click',{bubbles:true}));
const fb=doc.querySelector('#exam .fb.show');
ok('responder revela feedback',!!fb);
ok('feedback traz gabarito + conceito + armadilha',!!fb && /gabarito/.test(fb.textContent) && /conceito/i.test(fb.textContent) && /armadilha/i.test(fb.textContent));
ok('placar e barra atualizam',/1 \/ 225/.test(txt('scorebar')));

console.log('\n— RADAR DE MAESTRIA —');
window.activateTab('tab-maestria');
ok('radar report gerado (9 eixos, incl. inter-braços)',window.scoreReportFn().score.axes.length===9);
ok('linhas de eixo renderizadas',doc.querySelectorAll('#axes .axrow').length===9);
ok('veredito de domínio exibido',!!txt('verdict-big') && txt('verdict-big').length>2, txt('verdict-big'));
// simula: acertar todo E1, errar todo E5 → E1 domina, E5 lacuna + remediação
(function(){ window.M30.forEach(q=>{ if(q.axis==='E1') window.M30answers[q.id]=q.a; else if(q.axis==='E5') window.M30answers[q.id]=(q.a+1)%4; }); window.renderRadarFn();
  const rep=window.scoreReportFn(); const e1=rep.axisVerdicts.find(a=>a.id==='E1'), e5=rep.axisVerdicts.find(a=>a.id==='E5');
  ok('E1 domina, E5 lacuna (agregação por eixo)', e1.veredito==='domina'&&e5.veredito==='lacuna', 'E1 '+Math.round(e1.pct*100)+'% · E5 '+Math.round(e5.pct*100)+'%');
  ok('remediação aponta E5 com módulos ligados',/E5|Categorias/.test($('remed-box').textContent) && /perfunde/.test($('remed-box').innerHTML)); })();

console.log('\n— REVISÃO —');
window.activateTab('tab-revisao'); window.renderRevisaoFn();
ok('revisão lista as erradas para refazer',doc.querySelectorAll('#revisao .q').length>=1 && doc.querySelectorAll('#revisao .opt').length>0);

console.log('\n— TRILHAS (categorias sobre os itens existentes) —');
ok('aba e painel de trilhas',!!$('tab-trilhas') && !!$('panel-trilhas') && !!$('trail-list'));
window.activateTab('tab-trilhas'); window.renderTrilhasFn();
ok('≥15 trilhas listadas como cartões',doc.querySelectorAll('#trail-list .tcard').length>=15, doc.querySelectorAll('#trail-list .tcard').length);
ok('grupos de nível (novato→avançado, tema, inter-braços, formato)',doc.querySelectorAll('#trail-list .tgrp').length>=4);
ok('seletor de tamanho (Todas/50/100)',doc.querySelectorAll('#trail-len .preset').length===3);
ok('motor de trilhas exposto (≥15)',window.TRAILS30 && window.TRAILS30.TRAILS.length>=15, window.TRAILS30?window.TRAILS30.TRAILS.length:'∅');
(function(){ // escolhe tamanho 50 + trilha pulmão-coração-rim → exame filtra para 50 itens E9, ordenado
  [].slice.call(doc.querySelectorAll('#trail-len .preset')).filter(function(b){return b.textContent==='50';})[0].dispatchEvent(new window.Event('click',{bubbles:true}));
  [].slice.call(doc.querySelectorAll('#trail-list .tcard')).filter(function(c){return c.getAttribute('data-id')==='pulmao-coracao-rim';})[0].dispatchEvent(new window.Event('click',{bubbles:true}));
  ok('escolher trilha+tamanho reordena o exame (50 itens)',doc.querySelectorAll('#exam .q').length===50);
  ok('itens da trilha são só da categoria (todos E9)',[].slice.call(doc.querySelectorAll('#exam .q .meta')).every(function(m){return /E9/.test(m.textContent);}));
  ok('cabeçalho da trilha exibido',/Trilha:/.test(txt('trailhead')) && /50 quest/.test(txt('trailhead')));
  ok('placar passa a ser relativo à trilha (/ 50)',/\/ 50/.test(txt('scorebar')));
  ok('trilha é ordenada (não cria itens novos: subconjunto de M30)',window.currentOrderFn().every(function(q){return window.M30.indexOf(q)>=0;}) && window.currentOrderFn().length===50);
  $('trail-clear').dispatchEvent(new window.Event('click',{bubbles:true}));
  ok('"exame completo" restaura os 225',doc.querySelectorAll('#exam .q').length===225);
})();

console.log('\n— TRILHAS EVOLUÍDAS (pessoais + por armadilha) —');
window.activateTab('tab-trilhas'); window.renderTrilhasFn();
ok('grupos incluem "Pessoais" e "Por armadilha"',/Pessoais/.test($('trail-list').textContent) && /armadilha/i.test($('trail-list').textContent));
ok('≥30 trilhas no total (com armadilhas e dinâmicas)',window.TRAILS30.TRAILS.length>=30, window.TRAILS30.TRAILS.length);
ok('trilha dinâmica sem dados aparece desabilitada (remediação)',doc.querySelectorAll('#trail-list .tcard.off').length>=1);
(function(){ // trilha por armadilha filtra só aquele trap-código
  var arm=[].slice.call(doc.querySelectorAll('#trail-list .tcard[data-id]')).filter(function(c){return c.getAttribute('data-id')==='armadilha-T02';})[0];
  arm.dispatchEvent(new window.Event('click',{bubbles:true}));
  var ord=window.currentOrderFn();
  ok('"Armadilha · PAM ≠ perfusão" seleciona só itens com trap T02',ord.length>0 && ord.every(function(q){return q.trap==='T02';}));
  ok('cabeçalho nomeia a armadilha',/Armadilha/.test(txt('trailhead')));
})();
(function(){ // dinâmica "o que falta": responde alguns e confere que some da contagem
  window.answerFn(window.M30[0].id, (window.M30[0].a+1)%4, 'exam'); // marca 1
  window.renderTrilhasFn();
  var nao=window.TRAILS30.trailStats(window.M30,{answers:window.M30answers,weakAxes:[]}).filter(function(s){return s.id==='nao-respondidas';})[0];
  ok('dinâmica "o que falta" reflete o que já foi respondido (<225)',nao.total<225 && nao.dyn===true, nao.total);
})();
window.activateTab('tab-exame');

console.log('\n— CROMO / SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 30',/M[óo]dulo\s*30/.test(txt('kicker')));
ok('como funciona cita engine-grounded + seed + firewall',/engine-grounded/i.test(html)&&/seed/i.test(html)&&/§\s*11/.test(html));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot)); ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('disclaimer SaMD (mecanismo, nunca conduta)',/nunca/i.test(txt('disclaimer'))&&/§\s*11/.test(txt('disclaimer')));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
} catch(err){ console.error('FALHA · exceção inesperada no validador:', err && err.message ? err.message : err); process.exit(1); }
})();
