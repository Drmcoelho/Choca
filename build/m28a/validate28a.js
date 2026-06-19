const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde28a.html');
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
 'ga1','gb1','gb2','gv1','gpde','va1','vb1','vb2','vv1','vpde',
 'oRVS','oIno','oHR','oDom','glossbox','presets','lab-profile','quiz','pontes','disclaimer','honestidade'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
ok('1 role="tablist"',doc.querySelectorAll('[role="tablist"]').length===1);
ok('4 abas (role=tab)',doc.querySelectorAll('[role="tab"]').length===4);
ok('4 painéis (role=tabpanel)',doc.querySelectorAll('[role="tabpanel"]').length===4);
['tab-caso','tab-instrumento','tab-lab','tab-aval'].forEach(t=>ok('aba '+t,!!$(t)));
ok('6 presets de agente',doc.querySelectorAll('#presets .preset').length===6);

console.log('\n— GRAMÁTICA receptor→termo (window.GRAM) —');
ok('α1 → RVS↑, sem inotropia',ev('GRAM.terms({a1:1}).dRVS')>5 && Math.abs(ev('GRAM.terms({a1:1}).dInotropy'))<1e-9);
ok('α1 → FC↓ (reflexo)',ev('GRAM.terms({a1:1}).dHR')<0);
ok('β1 → contratilidade↑ e FC↑',ev('GRAM.terms({b1:1}).dInotropy')>0.3 && ev('GRAM.terms({b1:1}).dHR')>15);
ok('β2 → RVS↓',ev('GRAM.terms({b2:1}).dRVS')<0);
ok('V1 → RVS↑ sem FC',ev('GRAM.terms({v1:1}).dRVS')>5 && Math.abs(ev('GRAM.terms({v1:1}).dHR'))<1e-9);
ok('PDE-3 → inodilatador (inotropia↑, RVS↓)',ev('GRAM.terms({pde:1}).dInotropy')>0.3 && ev('GRAM.terms({pde:1}).dRVS')<0);
ok('dominante: noradrenalina = rvs',ev('GRAM.dominantTerm(GRAM.AGENTS.noradrenalina)')==='rvs');
ok('dominante: dobutamina = inotropy',ev('GRAM.dominantTerm(GRAM.AGENTS.dobutamina)')==='inotropy');
ok('dominante: vasopressina = rvs',ev('GRAM.dominantTerm(GRAM.AGENTS.vasopressina)')==='rvs');

console.log('\n— INSTRUMENTO AO VIVO —');
$('ga1').value='1'; $('ga1').dispatchEvent(new window.Event('input',{bubbles:true}));
ok('mover α1 atualiza o readout de RVS (↑)',/\+/.test(txt('oRVS')) && /↑/.test(txt('oRVS')),txt('oRVS'));
ok('readout do termo dominante preenchido',!!txt('oDom') && txt('oDom')!=='—',txt('oDom'));
$('gb1').value='1'; $('gb1').dispatchEvent(new window.Event('input',{bubbles:true}));
ok('gloss lista os receptores ativos',$('glossbox').children.length>=2,$('glossbox').children.length+' itens');

console.log('\n— LAB · agentes —');
window.setAgent('noradrenalina'); ok('carregar noradrenalina preenche o perfil',/noradrenalina/.test($('lab-profile').innerHTML));
window.setAgent('dobutamina'); ok('dobutamina → dominante inotrópico no readout',/inotr[óo]pico|inotropy/i.test($('lab-profile').innerHTML),txt('oDom'));

console.log('\n— AVALIAÇÃO · banco psicométrico —');
const T=window.QUIZ;
ok('banco ≥8',Array.isArray(T)&&T.length>=8,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb))bankOk=false; });
ok('4 opções/índice/q-fb por item',bankOk);
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('as 4 letras presentes',dist.every(d=>d>0),'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
ok('gabarito DISPROPORCIONAL (max-min ≥2)',(Math.max.apply(null,dist)-Math.min.apply(null,dist))>=2,'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
let longest=0; (T||[]).forEach(q=>{ const l=q.o.map(o=>o.length); if(l[q.a]===Math.max.apply(null,l)) longest++; });
ok('a correta NÃO é a mais longa na maioria (<50%)',longest/T.length<0.5,longest+'/'+T.length);
// render + interação
ok('quiz renderiza um cartão por questão',doc.querySelectorAll('#quiz .q').length===T.length);
const q0=doc.querySelector('#quiz .q'); const opts=q0.querySelectorAll('.opt');
ok('cada questão rende 4 botões',opts.length===4);
opts[T[0].a].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder marca a correta e revela feedback',q0.querySelector('.opt.ok')!=null && q0.querySelector('.fb.show')!=null);

console.log('\n— CROMO + FIREWALL SaMD §11 —');
ok('backlink ao hub (perfunde28.html)',/perfunde28\.html/.test($('backlink').getAttribute('href')));
ok('kicker Módulo 28A',/28A/.test(txt('kicker')));
ok('pontes para M9/M27/M28',['perfunde9','perfunde27','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM-SP 151.318',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho · Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('disclaimer: referência educacional + protocolo institucional',/refer[êe]ncia educacional/i.test(html)&&/protocolo da sua institui/i.test(html));
ok('honestidade cita o §11',/§\s*11/.test(txt('honestidade')));
ok('SEM dose numérica (mcg/kg/min etc.) na gramática',!/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i.test(html));
ok('SEM ordem imperativa individualizada',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
