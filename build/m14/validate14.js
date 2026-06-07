const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde14.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 330;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotGuyton','plotCurve','plotCurveLab',
 'opbox-guyton','opbox-curve','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iLoss','iRepos','iPressor','iComp','lLoss','lRepos','lPressor','lComp','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('baseline DC ≈ 5,0',near(ev('hemoFn({loss:0}).DC'),5.0,0.08),ev('hemoFn({loss:0}).DC').toFixed(2));
ok('baseline MAP ≈ 87',near(ev('hemoFn({loss:0}).MAP'),87,2),ev('hemoFn({loss:0}).MAP').toFixed(0));
ok('baseline SI ≈ 0,66',near(ev('hemoFn({loss:0}).SI'),0.66,0.05),ev('hemoFn({loss:0}).SI').toFixed(2));
ok('perda 10%: MAP mantida (>85)',ev('hemoFn({loss:0.10}).MAP')>85,ev('hemoFn({loss:0.10}).MAP').toFixed(0));
ok('perda 10%: SI já elevado (>0,85)',ev('hemoFn({loss:0.10}).SI')>0.85,ev('hemoFn({loss:0.10}).SI').toFixed(2));
ok('perda 40%: MAP desaba (<60)',ev('hemoFn({loss:0.40}).MAP')<60,ev('hemoFn({loss:0.40}).MAP').toFixed(0));
ok('perda 40%: lactato >2,5',ev('hemoFn({loss:0.40}).lactate')>2.5,ev('hemoFn({loss:0.40}).lactate').toFixed(1));
ok('Pmsf cai com a perda',ev('hemoFn({loss:0.3}).Pmsf')<ev('hemoFn({loss:0}).Pmsf'));
ok('classe: 5% compensado',ev('classeFn(hemoFn({loss:0.05}))')==='compensado');
ok('classe: 45% colapso',ev('classeFn(hemoFn({loss:0.45}))')==='colapso');
ok('pressor PROPÕE MAP (vs base)',ev('hemoFn({loss:0.4,pressor:0.9}).MAP')>ev('hemoFn({loss:0.4}).MAP')+10);
ok('mas DC do pressor < DC do volume',ev('hemoFn({loss:0.4,pressor:0.9}).DC')<ev('hemoFn({loss:0.4,repos:0.35}).DC')-1.5);
ok('volume restaura DC (>4,5)',ev('hemoFn({loss:0.4,repos:0.35}).DC')>4.5);
ok('sweepFn 60 pontos',ev('sweepFn({},60,0.5).length')===60);

console.log('\n— UI ≡ ENGINE (default perda 25%) —');
ok('readout Guyton mostra Pmsf + DC',/Pmsf/.test($('opbox-guyton').innerHTML)&&/DC/.test($('opbox-guyton').innerHTML),txt('opbox-guyton'));
ok('readout curva mostra SI + lactato',/SI/.test($('opbox-curve').innerHTML)&&/lactato/.test($('opbox-curve').innerHTML),txt('opbox-curve'));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6,doc.querySelectorAll('#presets .preset').length);
window.setLabState({loss:0.10,repos:0,pressor:0,compReserve:1}); ok('perda leve = COMPENSADO',$('lab-veredito').classList.contains('ok')&&/COMPENSADO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({loss:0.22,repos:0,pressor:0,compReserve:1}); ok('22% = LIMÍTROFE + banner compensação + pulso estreito',$('lab-veredito').classList.contains('lim')&&$('ban-comp').classList.contains('show')&&$('ban-pp').classList.contains('show'),txt('lab-vbig'));
window.setLabState({loss:0.45,repos:0,pressor:0,compReserve:1}); ok('45% = COLAPSO + banner desaba',$('lab-veredito').classList.contains('crit')&&$('ban-desaba').classList.contains('show'),txt('lab-vbig'));
window.setLabState({loss:0.40,repos:0,pressor:0.9,compReserve:1}); ok('pressor: banner pressor',$('ban-pressor').classList.contains('show'));
window.setLabState({loss:0.40,repos:0.35,pressor:0,compReserve:1}); ok('volume: banner volume',$('ban-volume').classList.contains('show'));
window.setLabState({loss:0.25,repos:0,pressor:0,compReserve:1});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (guyton+curve)',['guyton','curve'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,210); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 14',/M[óo]dulo\s*14/.test(txt('kicker')));
ok('pontes 4/15/25',['perfunde4','perfunde15','perfunde25'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: Guyton + vasopressor + conteúdo(m15)',/guyton/i.test(txt('honestidade'))&&/vasopressor/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|volume)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
