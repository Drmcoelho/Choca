const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde16.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotLoop','plotSpiral','plotLoopLab',
 'opbox-loop','opbox-spiral','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iEes','iEa','iPfill','iHr','lEes','lEa','lPfill','lHr','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const N='cardioFn({Ees:2.5,Ea:1.7,Pfill:10,hr:75})';
const C='cardioFn({Ees:0.7,Ea:1.9,Pfill:20,hr:80})';
ok('normal: DC ≈ 5,0',near(ev(N+'.CO'),5.0,0.2),ev(N+'.CO').toFixed(2));
ok('normal: EF ≈ 0,55',near(ev(N+'.EF'),0.55,0.04),ev(N+'.EF').toFixed(3));
ok('normal: veredito compensado',ev('vereditoFn('+N+')')==='compensado');
ok('cardiogênico: EF < 0,30',ev(C+'.EF')<0.30,ev(C+'.EF').toFixed(3));
ok('cardiogênico: CO < 3,3',ev(C+'.CO')<3.3,ev(C+'.CO').toFixed(2));
ok('cardiogênico: LVEDP ≥ 18 (congestão)',ev(C+'.LVEDP')>=18,ev(C+'.LVEDP').toFixed(1));
ok('cardiogênico: veredito cardiogenico',ev('vereditoFn('+C+')')==='cardiogenico');
ok('vasopressor (↑Ea) PIORA o DC',ev('cardioFn({Ees:0.7,Ea:3.2,Pfill:20,hr:80}).CO')<ev(C+'.CO')-0.5);
ok('vasopressor PROPÕE a MAP',ev('cardioFn({Ees:0.7,Ea:3.2,Pfill:20,hr:80}).MAP')>ev(C+'.MAP')+4);
ok('descarga (↓Ea) SOBE o DC',ev('cardioFn({Ees:0.7,Ea:1.1,Pfill:20,hr:80}).CO')>ev(C+'.CO')+0.8);
ok('inotrópico (↑Ees) sobe DC',ev('cardioFn({Ees:1.7,Ea:1.9,Pfill:20,hr:80}).CO')>ev(C+'.CO')+1.5);
ok('EF ≈ 1/(1+Ea/Ees)',near(ev(N+'.EF'),1/(1+1.7/2.5),0.06));
ok('espiral severa colapsa',ev('spiralFn(0.5,2.2,edvFn(23),95).collapses')===true && ev('spiralFn(0.5,2.2,edvFn(23),95).COend')<1.5);
ok('boa perfusão não espirala',ev('spiralFn(2.5,1.7,edvFn(10),75).collapses')===false);

console.log('\n— UI ≡ ENGINE (default cardiogênico) —');
ok('readout alça mostra SV/EF',/SV/.test($('opbox-loop').innerHTML)&&/EF/.test($('opbox-loop').innerHTML),txt('opbox-loop'));
ok('readout espiral mostra CPP',/CPP/.test($('opbox-spiral').innerHTML),txt('opbox-spiral'));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6,doc.querySelectorAll('#presets .preset').length);
window.setLabState({Ees:2.5,Ea:1.7,Pfill:10,hr:75}); ok('normal = COMPENSADA',$('lab-veredito').classList.contains('ok')&&/COMPENSADA/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({Ees:0.7,Ea:1.9,Pfill:20,hr:80}); ok('cardiogênico = CARDIOGÊNICO + congestão + frio-úmido',$('lab-veredito').classList.contains('crit')&&$('ban-congestao').classList.contains('show')&&$('ban-frio').classList.contains('show'),txt('lab-vbig'));
window.setLabState({Ees:0.7,Ea:3.2,Pfill:20,hr:80}); ok('vasopressor: banner vasopressor',$('ban-vasopressor').classList.contains('show'));
window.setLabState({Ees:0.7,Ea:1.1,Pfill:20,hr:80}); ok('descarga: banner descarga',$('ban-descarga').classList.contains('show'));
window.setLabState({Ees:0.5,Ea:2.2,Pfill:23,hr:95}); ok('espiral: banner espiral',$('ban-espiral').classList.contains('show'));
window.setLabState({Ees:0.7,Ea:1.9,Pfill:20,hr:80});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (loop+spiral)',['loop','spiral'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,210); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 16',/M[óo]dulo\s*16/.test(txt('kicker')));
ok('pontes 7/6/24',['perfunde7','perfunde6','perfunde24'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: dobutamina + descarga(BIA/Impella)',/dobutamina/i.test(txt('honestidade'))&&/(BIA|Impella|descarga)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|alvo)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
