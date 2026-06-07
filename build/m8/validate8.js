const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde8.html');
const html=fs.readFileSync(file,'utf8');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const dom=new JSDOM(html,{ runScripts:'dangerously', pretendToBeVisual:true, beforeParse(window){
  window.scrollTo=()=>{}; window.requestAnimationFrame=()=>0; window.cancelAnimationFrame=()=>{};
  window.matchMedia=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  window.HTMLElement.prototype.scrollIntoView=()=>{}; window.devicePixelRatio=1;
  const ctx=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
  window.HTMLCanvasElement.prototype.getContext=()=>ctx;
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 860;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 340;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / 6 ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','mega','mega-score','plotVO2','plotVO2Lab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','panel-fecho',
 'iCo','iHb','iSat','iDem','lCo','lDem','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao','tab-fecho'].forEach(t=>ok('aba '+t,!!$(t)));
ok('6 abas no total',doc.querySelectorAll('.tabs .tab').length===6,doc.querySelectorAll('.tabs .tab').length);
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-fecho'); ok('aba Fecho ativa o painel mega',$('panel-fecho').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE SUPPLY-DEPENDENCE ≡ ÂNCORAS —');
ok('DO₂crit(250)≈417', near(ev('do2critFn(250)'),416.7,1), ev('do2critFn(250)').toFixed(0));
ok('VO₂ platô acima do crit (800==1200)', ev('vo2Fn(800,250)')===ev('vo2Fn(1200,250)'));
ok('O₂ER normal ~25% @DO₂1000', near(ev('o2erFn(1000,250)'),0.25,0.01));
ok('abaixo do crit O₂ER satura ~60%', near(ev('o2erFn(300,250)'),0.6,1e-9));
ok('lactato sobe abaixo do crit', ev('lactateFn(300,250)')>ev('lactateFn(1000,250)'));
ok('febre↑demanda desloca crit à direita', ev('do2critFn(400)')>ev('do2critFn(250)'));
ok('SvO₂ baixa no supply-dependent (<40%)', ev('svo2Fn(300,0.98,250)')<0.40);

console.log('\n— UI ≡ ENGINE + Lab —');
ok('readout DO₂/crit/VO₂/lactato', /DO₂ <b>/.test($('opbox-instr').innerHTML)&&/lactato <b>/.test($('opbox-instr').innerHTML));
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({co:5,hb:15,sat:98,dem:250}); ok('normal: SUPPLY-INDEPENDENT',$('lab-veredito').classList.contains('ok')&&/INDEPENDENT/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({co:2.0,hb:15,sat:98,dem:250}); ok('baixo débito: SUPPLY-DEPENDENT + anaeróbio',$('lab-veredito').classList.contains('crit')&&$('ban-anaerobio').classList.contains('show'),txt('lab-vbig'));
window.setLabState({co:4,hb:12,sat:96,dem:400}); ok('febre: banner demanda',$('ban-demanda').classList.contains('show'));
window.setLabState({co:5,hb:15,sat:98,dem:250});

console.log('\n— TUTOR GRÁFICO —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');

console.log('\n— MEGA-QUESTIONÁRIO: CONTEÚDO —');
const Q=window.MEGA;
ok('mega ≥30 questões',Array.isArray(Q)&&Q.length>=30,Q?Q.length:'∅');
let mOk=true; (Q||[]).forEach((q,i)=>{ if(!(Array.isArray(q.o)&&q.o.length===4))mOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))mOk=false; if(!(q.q&&q.fb&&q.m))mOk=false; });
ok('mega: todas 4 opções/índice/q-fb-m',mOk);
ok('mega renderizou no DOM',doc.querySelectorAll('#mega .q').length===(Q?Q.length:0),doc.querySelectorAll('#mega .q').length);
// cobertura de módulos
const mods=new Set((Q||[]).map(q=>q.m));
ok('cobre M0,1,2,3,4,5,6,7,8', ['M0','M1','M2','M3','M4','M5','M6','M7','M8'].every(m=>mods.has(m)), [...mods].join(','));
ok('M1 tem 8 questões dedicadas', (Q||[]).filter(q=>q.m==='M1').length===8, (Q||[]).filter(q=>q.m==='M1').length);
ok('total de 40 questões', Q.length===40, Q.length);
// minoria inédita/integrativa
const integ=(Q||[]).filter(q=>q.m==='integra'||q.m==='tese').length;
ok('inéditas/integrativas são minoria absoluta (<35%)', integ>0 && integ < Q.length*0.35, integ+'/'+Q.length);

console.log('\n— MEGA: AUDITORIA DO GABARITO —');
const counts=[0,0,0,0]; (Q||[]).forEach(q=>counts[q.a]++);
const L=['A','B','C','D'];
console.log('   distribuição: '+L.map((l,i)=>l+'='+counts[i]).join(' · '));
const total=Q.length, mx=Math.max(...counts), mn=Math.min(...counts);
ok('todas as 4 letras usadas', counts.every(c=>c>0));
ok('distribuição assimétrica/desproporcional (max−min ≥ 4)', (mx-mn)>=4, 'max '+mx+' min '+mn);
ok('NÃO dominada por A/B (A+B < 50%)', (counts[0]+counts[1]) < total*0.5, Math.round(100*(counts[0]+counts[1])/total)+'%');
ok('nenhuma letra é maioria absoluta (<45%)', mx < total*0.45, Math.round(100*mx/total)+'%');
// correta raramente a mais longa
let longestCorrect=0; (Q||[]).forEach(q=>{ var lens=q.o.map(s=>s.length); var mxlen=Math.max(...lens); var uniqueLongest=lens.filter(x=>x===mxlen).length===1; if(uniqueLongest && lens[q.a]===mxlen) longestCorrect++; });
console.log('   correta = alternativa mais longa em '+longestCorrect+'/'+total);
ok('correta raramente a mais longa (<34%)', longestCorrect < total*0.34, Math.round(100*longestCorrect/total)+'%');
// sem 3 corretas iguais consecutivas
let run=1,maxRun=1; for(let i=1;i<Q.length;i++){ if(Q[i].a===Q[i-1].a){run++; if(run>maxRun)maxRun=run;} else run=1; }
ok('sem 3+ corretas iguais consecutivas (run máx ≤ 2)', maxRun<=2, 'run máx '+maxRun);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 8',/M[óo]dulo\s*8/.test(txt('kicker')));
ok('pontes 0/2/13',['perfunde0','perfunde2','perfunde13'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita bifásica/DO2crit',/(bif[áa]sica|cr[íi]tico|O₂ERmax|supply)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
