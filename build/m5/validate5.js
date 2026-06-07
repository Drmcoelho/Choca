const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde5.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotGuyton','ppvTrace','plotGuytonLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iPmsf','iCOmax','iClung','lPmsf','lClung','presets','lab-veredito','chip-resp','chip-tol'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE (herda Guyton) ≡ ÂNCORAS —');
ev('window.__B={Rvr:1.4,COmax:10,pra0:-2,K:2,colapso:-4,Clung:1.0}');
ok('interseção normal Pra≈0/CO≈5', near(ev('intersecaoFn(Object.assign({},window.__B,{Pmsf:7})).co'),5,0.1));
ok('hipovolemia responde > normo', ev('bolusGainFn(Object.assign({},window.__B,{Pmsf:4}))')>ev('bolusGainFn(Object.assign({},window.__B,{Pmsf:7}))'));
ok('platô (Pmsf19) NÃO responsivo (<0,4)', ev('bolusGainFn(Object.assign({},window.__B,{Pmsf:19}))')<0.4, ev('bolusGainFn(Object.assign({},window.__B,{Pmsf:19}))').toFixed(2));
ok('PPV maior no ascendente que no platô', ev('ppvFn(Object.assign({},window.__B,{Pmsf:5}))')>ev('ppvFn(Object.assign({},window.__B,{Pmsf:19}))'));
ok('IVC colaba mais com Pra baixa', ev('ivcFn(Object.assign({},window.__B,{Pmsf:4}))')>ev('ivcFn(Object.assign({},window.__B,{Pmsf:16}))'));

console.log('\n— OS QUATRO QUADRANTES —');
ok('hipovolemia = responsivo-tolerante', ev('classifyFn(Object.assign({},window.__B,{Pmsf:4,Clung:1.0})).quadrante')==='responsivo-tolerante');
ok('armadilha = responsivo-intolerante', ev('classifyFn(Object.assign({},window.__B,{Pmsf:5,Clung:0.35})).quadrante')==='responsivo-intolerante');
ok('platô = plato-tolerante', ev('classifyFn(Object.assign({},window.__B,{Pmsf:19,Clung:1.0})).quadrante')==='plato-tolerante');
ok('congestivo = plato-intolerante', ev('classifyFn(Object.assign({},window.__B,{Pmsf:16,COmax:6,Clung:0.5})).quadrante')==='plato-intolerante');

console.log('\n— UI ≡ ENGINE (default) + chips —');
ok('readout PPV/IVC no instrumento',/PPV <b>/.test($('opbox-instr').innerHTML)&&/IVC colaba/.test($('opbox-instr').innerHTML),txt('opbox-instr'));
ok('chip responsivo reflete estado',/sim|não/.test(txt('chip-resp')));

console.log('\n— LAB · veredito 2 eixos + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5);
window.setLabState({Pmsf:4,COmax:10,Clung:1.0}); ok('hipovolemia: veredito ok + banner responsivo',$('lab-veredito').classList.contains('ok')&&$('ban-responsivo').classList.contains('show'),txt('lab-vbig'));
window.setLabState({Pmsf:5,COmax:10,Clung:0.35}); ok('armadilha: crit + banner intolerante(pulmão)',$('lab-veredito').classList.contains('crit')&&$('ban-intolerante').classList.contains('show')&&/AFOGA/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({Pmsf:19,COmax:10,Clung:1.0}); ok('platô: lim + banner platô',$('lab-veredito').classList.contains('lim')&&$('ban-plato').classList.contains('show'),txt('lab-vbig'));
window.setLabState({Pmsf:16,COmax:6,Clung:0.5}); ok('congestivo: banner congesto',$('ban-congesto').classList.contains('show'));
window.setLabState({Pmsf:7,COmax:10,Clung:1.0});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 5',/M[óo]dulo\s*5/.test(txt('kicker')));
ok('pontes 4/24/25',['perfunde4','perfunde24','perfunde25'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita PPV/IVC como proxies',/(PPV|IVC)/.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|bolus)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
