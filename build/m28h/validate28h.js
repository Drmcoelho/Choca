const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde28h.html');
const html=fs.readFileSync(file,'utf8');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const dom=new JSDOM(html,{ runScripts:'dangerously', pretendToBeVisual:true, beforeParse(window){
  window.requestAnimationFrame=()=>0; window.cancelAnimationFrame=()=>{};
  window.matchMedia=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','ref-banner','tabs','panel-calc','panel-referencia','panel-seguranca','panel-aval',
 'hdrug','hdose','hweight','hrate','hconc','hfaixa','hreftable','hreftable-body','hsafety','quiz','pontes','disclaimer','honestidade'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
ok('1 tablist',doc.querySelectorAll('[role="tablist"]').length===1);
ok('4 abas',doc.querySelectorAll('[role="tab"]').length===4);
ok('4 painéis',doc.querySelectorAll('[role="tabpanel"]').length===4);
ok('seletor com 7 agentes',$('hdrug').querySelectorAll('option').length===7);

console.log('— CALCULADORA §11 (window.H28) —');
ok('concentração nora = 64 mcg/mL',near(ev('H28.concentration("noradrenalina").value'),64,0.01));
ok('nora 0,1 mcg/kg/min @70 kg ≈ 6,56 mL/h',near(ev('H28.infusionRate("noradrenalina",0.1,70)'),6.5625,0.01));
ok('vasopressina não é peso-dependente',ev('H28.infusionRate("vasopressina",0.03,50)')===ev('H28.infusionRate("vasopressina",0.03,120)'));
// UI viva: trocar agente e mover sliders atualiza a taxa
$('hdrug').value='dobutamina'; $('hdrug').dispatchEvent(new window.Event('change',{bubbles:true}));
$('hweight').value='70'; $('hweight').dispatchEvent(new window.Event('input',{bubbles:true}));
ok('readout de mL/h preenchido',/\d/.test(txt('hrate')),txt('hrate'));
ok('faixa de dose de referência exibida',/faixa usual de refer/i.test(txt('hfaixa')));
ok('tabela de referência com 7 linhas',doc.querySelectorAll('#hreftable-body tr').length===7);
ok('segurança operacional ≥6 itens',doc.querySelectorAll('#hsafety .safe').length>=6);
ok('segurança cita extravasamento, lactato β2 e desmame',/extravasamento/i.test($('hsafety').innerHTML)&&/β2/.test($('hsafety').innerHTML)&&/desmame/i.test($('hsafety').innerHTML));

console.log('— AVALIAÇÃO —');
const T=window.QUIZ;
ok('banco ≥8',Array.isArray(T)&&T.length>=8,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb))bankOk=false; });
ok('4 opções/índice/q-fb',bankOk);
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('as 4 letras presentes',dist.every(d=>d>0),'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
ok('gabarito DISPROPORCIONAL (max-min ≥2)',(Math.max.apply(null,dist)-Math.min.apply(null,dist))>=2,'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
let longest=0; (T||[]).forEach(q=>{ const l=q.o.map(o=>o.length); if(l[q.a]===Math.max.apply(null,l)) longest++; });
ok('correta NÃO é a mais longa na maioria (<50%)',longest/T.length<0.5,longest+'/'+T.length);
const q0=doc.querySelector('#quiz .q'); const opts=q0.querySelectorAll('.opt');
opts[T[0].a].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder marca a correta e revela feedback',q0.querySelector('.opt.ok')!=null && q0.querySelector('.fb.show')!=null);

console.log('— SaMD §11: referência PERMITIDA, ordem individualizada PROIBIDA —');
ok('banner de referência educacional presente',/refer[êe]ncia educacional/i.test($('ref-banner').innerHTML)&&/protocolo da sua institui/i.test($('ref-banner').innerHTML));
ok('enquadramento: não é prescrição + peso hipotético',/n[ãa]o é prescri/i.test(html)&&/peso\s+hipot[ée]tico/i.test(html));
ok('honestidade cita §11 e calculadora como aritmética',/§\s*11/.test(txt('honestidade'))&&/aritm[ée]tica/i.test(txt('honestidade')));
ok('exibe FAIXA de dose (referência) — permitido (§11.1)',/faixa usual de refer/i.test(html));
ok('SEM ordem imperativa individualizada (§11.2)',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a|infunda|ministre|aplique)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente\b/i.test(html));
ok('SEM "para ESTE paciente, use/dê X"',!/para\s+este\s+paciente[^.]{0,40}\b(use|d[êe]|administre|inicie)\b/i.test(html));

console.log('— CROMO —');
ok('backlink ao hub',/perfunde28\.html/.test($('backlink').getAttribute('href')));
ok('kicker 28H',/28H/.test(txt('kicker')));
ok('pontes M9/M13/M28',['perfunde9','perfunde13','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
