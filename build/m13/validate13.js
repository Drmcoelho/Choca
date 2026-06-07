const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde13.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 820;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 200;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotBalance','plotTrend','plotBalanceLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iDo2','iDem','iB2','iMet','iHep','lDo2','lB2','lHep','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE LACTATO ≡ ÂNCORAS —');
ok('normal → ~0,8', near(ev('lactateFn({do2:1000,demand:250,beta2:0,met:0,hepatic:1})'),0.8,0.05));
ok('hipoperfusão (DO₂250) → tipo A', /tipo A/.test(ev('classifyFn({do2:250,demand:250,beta2:0,met:0,hepatic:1}).tipo')));
ok('β2 alto DO₂ normal → tipo B sem hipóxia', /tipo B/.test(ev('classifyFn({do2:1000,demand:250,beta2:6,met:0,hepatic:1}).tipo')) && ev('o2deficitFn(1000,250)')===0);
ok('seed (450/300/β2 5) ≈ 3,9', near(ev('lactateFn({do2:450,demand:300,beta2:5,met:0,hepatic:1})'),3.9,0.3), ev('lactateFn({do2:450,demand:300,beta2:5,met:0,hepatic:1})').toFixed(2));
ok('seed predominante tipo B', ev('classifyFn({do2:450,demand:300,beta2:5,met:0,hepatic:1}).fracB') > ev('classifyFn({do2:450,demand:300,beta2:5,met:0,hepatic:1}).fracA'));
ok('hepatopatia → clearance-limitado', ev('classifyFn({do2:1000,demand:250,beta2:2,met:0,hepatic:0.35}).clearanceLimited')===true);
ok('pior fígado → mais lactato (mesma produção)', ev('lactateFn({do2:1000,demand:250,beta2:2,met:0,hepatic:0.4})') > ev('lactateFn({do2:1000,demand:250,beta2:2,met:0,hepatic:1})'));
ok('clearancePct(4→2,8)=30%', near(ev('clearancePctFn(4.0,2.8)'),30,0.1));
ok('serial cai no tempo', ev('serialFn(4,1.5,1,6)')[12].lac < ev('serialFn(4,1.5,1,6)')[0].lac);

console.log('\n— UI ≡ ENGINE + tendência —');
ok('readout balança (lactato + tipo A/B)', /lactato <b>/.test($('opbox-bal').innerHTML)&&/tipo A/.test($('opbox-bal').innerHTML));
ok('readout tendência cita clearance', /clearance/i.test($('opbox-trend').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({do2:250,demand:250,beta2:0,met:0,hepatic:1}); ok('tipo A: veredito TIPO A + banner A',/TIPO A/.test(txt('lab-vbig'))&&$('ban-tipoA').classList.contains('show'),txt('lab-vbig'));
window.setLabState({do2:1000,demand:250,beta2:6,met:0,hepatic:1}); ok('tipo B: veredito TIPO B + banner B',/TIPO B/.test(txt('lab-vbig'))&&$('ban-tipoB').classList.contains('show'),txt('lab-vbig'));
window.setLabState({do2:1000,demand:250,beta2:2,met:0,hepatic:0.35}); ok('hepatopatia: CLEARANCE LIMITADO + banner',/CLEARANCE/.test(txt('lab-vbig'))&&$('ban-clearance').classList.contains('show'),txt('lab-vbig'));
window.setLabState({do2:1000,demand:250,beta2:0,met:2.5,hepatic:0.6}); ok('metformina: banner metformina',$('ban-metformina').classList.contains('show'));
window.setLabState({do2:450,demand:300,beta2:5,met:0,hepatic:1}); ok('seed: predominante B (misto)',/TIPO B|MISTO/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,170); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 13',/M[óo]dulo\s*13/.test(txt('kicker')));
ok('pontes 8/12/21',['perfunde8','perfunde12','perfunde21'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita multifatorial/balanço', /(multifatorial|balan|tipo B)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
