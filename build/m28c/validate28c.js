const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde28c.html');
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

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','tabs','panel-caso','panel-instrumento','panel-lab','panel-aval','ccontrast','ccontrast-body','cVerdict','quiz','pontes','disclaimer','honestidade'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
ok('1 tablist',doc.querySelectorAll('[role="tablist"]').length===1);
ok('4 abas',doc.querySelectorAll('[role="tab"]').length===4);
ok('4 painéis',doc.querySelectorAll('[role="tabpanel"]').length===4);
ok('stubs de resgate (≥3)',doc.querySelectorAll('#panel-lab .stub').length>=3);

console.log('— CONTRASTE V1 × adrenérgico (window.CX) —');
const X=window.CX;
ok('vasopressina sobe a RVS',X.vasopressina.RVS>5);
ok('vasopressina NÃO é adrenérgica',X.vasopressina.adrenergic===false);
ok('vasopressina não taquicardiza (FC=0)',X.semTaquicardia && X.vasopressina.FC===0);
ok('vasopressina sem custo β',X.semCustoBeta && X.vasopressina.metabolic===0);
ok('vasopressina não é por peso; noradrenalina é',X.vasopressina.weightBased===false && X.noradrenalina.weightBased===true);
ok('tabela de contraste rende ≥5 linhas',doc.querySelectorAll('#ccontrast-body tr').length>=5);
ok('veredito: poupa catecolamina + isquemia como custo',/poupa catecolamina/i.test(txt('cVerdict'))&&/isquemia/i.test(txt('cVerdict')));

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

console.log('— CROMO + FIREWALL §11 —');
ok('backlink ao hub',/perfunde28\.html/.test($('backlink').getAttribute('href')));
ok('kicker 28C',/28C/.test(txt('kicker')));
ok('pontes M9/M21/M28',['perfunde9','perfunde21','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('disclaimer referência+protocolo',/refer[êe]ncia educacional/i.test(html)&&/protocolo da sua institui/i.test(html));
ok('honestidade cita §11',/§\s*11/.test(txt('honestidade')));
ok('SEM dose numérica imperativa',!/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i.test(html));
ok('SEM ordem imperativa individualizada',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
