const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde12.html');
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

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotBed','plotFlux','plotBedLab',
 'opbox-bed','opbox-flux','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iFs','iGly','iHet','iDO2','lFs','lGly','lHet','lDO2','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('E saudável ≈ 0,6685',near(ev('effExtractionFn(1,0.1)'),0.6685,1e-3),ev('effExtractionFn(1,0.1)').toFixed(3));
ok('E séptico ≈ 0,1918',near(ev('effExtractionFn(0.4,0.7)'),0.1918,1e-3),ev('effExtractionFn(0.4,0.7)').toFixed(3));
const sad='microFn({DO2:1000,SaO2:0.98,fs:0.05,gly:1.0,het:0.1,demand:280})';
const sep='microFn({DO2:1100,SaO2:0.98,fs:0.5,gly:0.4,het:0.7,demand:280})';
ok('saudável: déficit 0',near(ev(sad+'.deficit'),0,1e-9));
ok('saudável: veredito acoplado',ev('vereditoFn('+sad+')')==='acoplado');
ok('séptico: O₂ER < 0,15',ev(sep+'.O2ER')<0.15,ev(sep+'.O2ER').toFixed(3));
ok('séptico: ScvO₂ > 0,80',ev(sep+'.ScvO2')>0.80,ev(sep+'.ScvO2').toFixed(3));
ok('séptico: déficit > 100',ev(sep+'.deficit')>100,ev(sep+'.deficit').toFixed(0));
ok('séptico: lactato > 3,5',ev(sep+'.lactate')>3.5,ev(sep+'.lactate').toFixed(2));
ok('séptico: paradoxo = true',ev('paradoxoFn('+sep+')')===true);
const pre='microFn({DO2:1500,SaO2:0.98,fs:0.5,gly:0.4,het:0.7,demand:280})';
ok('pressor (DO₂↑): déficit ainda > 50',ev(pre+'.deficit')>50,ev(pre+'.deficit').toFixed(0));
ok('pressor: O₂ER segue baixa (<0,12)',ev(pre+'.O2ER')<0.12,ev(pre+'.O2ER').toFixed(3));
ok('ScvO₂ sobe com shunt',ev('microFn({DO2:1000,SaO2:0.98,fs:0.6,gly:0.6,het:0.5,demand:320}).ScvO2')>ev('microFn({DO2:1000,SaO2:0.98,fs:0.2,gly:0.6,het:0.5,demand:320}).ScvO2'));

console.log('\n— UI ≡ ENGINE (default séptico) —');
ok('readout do leito mostra extração efetiva',/extra[çc][aã]o efetiva/i.test($('opbox-bed').innerHTML),txt('opbox-bed'));
ok('readout do fluxo mostra ScvO₂ + lactato',/ScvO₂/.test($('opbox-flux').innerHTML)&&/lactato/.test($('opbox-flux').innerHTML),txt('opbox-flux'));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5,doc.querySelectorAll('#presets .preset').length);
window.setLabState({fs:0.05,gly:1.0,het:0.1,DO2:1000}); ok('saudável = ACOPLADO',$('lab-veredito').classList.contains('ok')&&/ACOPLADO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({fs:0.5,gly:0.4,het:0.7,DO2:1100}); ok('séptico = GRAVE + paradoxo + shunt + glico + het',
  $('lab-veredito').classList.contains('crit')&&$('ban-paradoxo').classList.contains('show')&&$('ban-shunt').classList.contains('show')&&$('ban-glico').classList.contains('show')&&$('ban-het').classList.contains('show'),txt('lab-vbig'));
window.setLabState({fs:0.5,gly:0.4,het:0.7,DO2:1500}); ok('pressor (DO₂↑): banner pressor',$('ban-pressor').classList.contains('show'));
window.setLabState({fs:0.2,gly:0.2,het:0.45,DO2:1000}); ok('glicocálice roto: banner glico',$('ban-glico').classList.contains('show'));
window.setLabState({fs:0.5,gly:0.4,het:0.7,DO2:1100});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (bed+flux)',['bed','flux'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,210); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 12',/M[óo]dulo\s*12/.test(txt('kicker')));
ok('pontes 8/21/25',['perfunde8','perfunde21','perfunde25'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: mitocôndria/citopática + vasopressor',/(citop[áa]tica|mitocondrial)/i.test(txt('honestidade'))&&/vasopressor/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|alvo)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
