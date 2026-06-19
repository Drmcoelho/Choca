const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde28d.html');
const html=fs.readFileSync(file,'utf8');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
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
['backlink','kicker','tabs','panel-caso','panel-instrumento','panel-lab','panel-aval',
 'dpump','drvs','vpump','vrvs','dcmp','dcmp-body','dVerdict','presets','quiz','pontes','disclaimer','honestidade'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
ok('1 role="tablist"',doc.querySelectorAll('[role="tablist"]').length===1);
ok('4 abas',doc.querySelectorAll('[role="tab"]').length===4);
ok('4 painéis',doc.querySelectorAll('[role="tabpanel"]').length===4);
ok('3 presets',doc.querySelectorAll('#presets .preset').length===3);

console.log('— MOTOR inotrópicos (window.D28) —');
ok('milrinona é inodilatador (ΔRVS<0)',ev('D28.terms(D28.AGENTS.milrinona).dRVS')<0);
ok('dobutamina sobe a contratilidade',ev('D28.terms(D28.AGENTS.dobutamina).dInotropy')>0.3);
ok('adrenalina sobe a RVS (vaso-inotrópica)',ev('D28.terms(D28.AGENTS.adrenalina).dRVS')>0);

console.log('— INSTRUMENTO · comparação no cardiogênico —');
$('dpump').value='0.32'; $('dpump').dispatchEvent(new window.Event('input',{bubbles:true}));
const C=window.DSCEN;
ok('3 inotrópicos comparados',Array.isArray(C)&&C.length===3);
ok('todos sobem o débito (ΔDC>0)',C.every(x=>x.dCO>0),C.map(x=>x.agent+' +'+x.dCO.toFixed(2)).join(' '));
ok('milrinona aparece como inodilatador (ΔRVS<0)',C.find(x=>x.agent==='milrinona').dRVS<0);
ok('tabela 3 linhas',doc.querySelectorAll('#dcmp-body tr').length===3);
ok('veredito alerta: vasoconstritor puro NÃO é inotropia',/n[ãa]o é inotropia/i.test(txt('dVerdict')));
doc.querySelector('#presets .preset[data-pump="0.24"]').dispatchEvent(new window.Event('click',{bubbles:true}));
ok('preset ajusta a contratilidade basal',$('dpump').value==='0.24');

console.log('— AVALIAÇÃO · banco psicométrico —');
const T=window.QUIZ;
ok('banco ≥8',Array.isArray(T)&&T.length>=8,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb))bankOk=false; });
ok('4 opções/índice/q-fb',bankOk);
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('as 4 letras presentes',dist.every(d=>d>0),'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
ok('gabarito DISPROPORCIONAL (max-min ≥2)',(Math.max.apply(null,dist)-Math.min.apply(null,dist))>=2,'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
let longest=0; (T||[]).forEach(q=>{ const l=q.o.map(o=>o.length); if(l[q.a]===Math.max.apply(null,l)) longest++; });
ok('correta NÃO é a mais longa na maioria (<50%)',longest/T.length<0.5,longest+'/'+T.length);
ok('quiz renderiza um cartão por questão',doc.querySelectorAll('#quiz .q').length===T.length);
const q0=doc.querySelector('#quiz .q'); const opts=q0.querySelectorAll('.opt');
opts[T[0].a].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder marca a correta e revela feedback',q0.querySelector('.opt.ok')!=null && q0.querySelector('.fb.show')!=null);

console.log('— CROMO + FIREWALL §11 —');
ok('backlink ao hub',/perfunde28\.html/.test($('backlink').getAttribute('href')));
ok('kicker Módulo 28D',/28D/.test(txt('kicker')));
ok('pontes M7/M16/M28',['perfunde7','perfunde16','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('disclaimer: referência educacional + protocolo',/refer[êe]ncia educacional/i.test(html)&&/protocolo da sua institui/i.test(html));
ok('honestidade cita §11',/§\s*11/.test(txt('honestidade')));
ok('SEM dose numérica imperativa',!/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i.test(html));
ok('SEM ordem imperativa individualizada',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
