// validate4.js — portão jsdom do módulo 4 (Guyton). "N OK · M falhas"; sai 1 se M>0.
const fs=require('fs'), path=require('path');
const { JSDOM } = require('jsdom');
const file=process.argv[2] || path.join(__dirname,'perfunde4.html');
const html=fs.readFileSync(file,'utf8');
let oks=0, falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const numpt=s=>parseFloat(String(s).replace(/\./g,'').replace(',','.'));

const dom=new JSDOM(html,{ runScripts:'dangerously', pretendToBeVisual:true, beforeParse(window){
  window.scrollTo=()=>{}; window.requestAnimationFrame=()=>0; window.cancelAnimationFrame=()=>{};
  window.matchMedia=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  window.HTMLElement.prototype.scrollIntoView=()=>{}; window.devicePixelRatio=1;
  const ctx=new Proxy({},{ get:(t,p)=> (p in t? t[p] : (typeof p==='string'&&/^[a-z]/.test(p)? ()=>{} : undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
  window.HTMLCanvasElement.prototype.getContext=()=>ctx;
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 860;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 340;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};

(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'plotGuyton','plotGuytonLab','iPmsf','iRvr','iCOmax','lPmsf','lCOmax','presets','lab-veredito'
].forEach(id=>ok('#'+id, !!$(id)));
ok('footer presente', !!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t, !!$(t)));
ok('Caso ativo por padrão', $('panel-caso').classList.contains('active'));
ok('Caso tem 5 atos', doc.querySelectorAll('#panel-caso .ato').length===5, doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6 elos', doc.querySelectorAll('#panel-trilha .step').length>=6, doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-instrumento');
ok('clicar Instrumento ativa painel', $('panel-instrumento').classList.contains('active'));
window.activateTab('tab-caso');

console.log('\n— ENGINE GUYTON ≡ ÂNCORAS —');
const NORMAL={Pmsf:7,Rvr:1.4,COmax:10,pra0:-2,K:2,colapso:-4};
ev('window.__N='+JSON.stringify(NORMAL));
ok('VR zera em Pra=Pmsf', ev('venousReturn(7,7,1.4)')===0);
ok('VR(0)=Pmsf/Rvr=5,0', near(ev('venousReturn(0,7,1.4)'),5.0,1e-9), ev('venousReturn(0,7,1.4)'));
ok('cardiac(pra0=-2)=0', ev('cardiacOutput(-2,10,-2,2)')===0);
const op=ev('intersecaoFn(window.__N)');
ok('ponto normal Pra*≈0', near(op.pra,0,0.1), op.pra.toFixed(3));
ok('ponto normal CO*≈5,0', near(op.co,5.0,0.1), op.co.toFixed(3));
const vol=ev('intersecaoFn(Object.assign({},window.__N,{Pmsf:11}))');
ok('volume↑ → CO sobe', vol.co>op.co, op.co.toFixed(2)+'→'+vol.co.toFixed(2));
ok('volume↑ → Pra sobe', vol.pra>op.pra, op.pra.toFixed(2)+'→'+vol.pra.toFixed(2));
const fail=ev('intersecaoFn(Object.assign({},window.__N,{COmax:6}))');
ok('falência → CO cai', fail.co<op.co, op.co.toFixed(2)+'→'+fail.co.toFixed(2));
ok('falência → Pra sobe (congestão)', fail.pra>op.pra, op.pra.toFixed(2)+'→'+fail.pra.toFixed(2));
const ino=ev('intersecaoFn(Object.assign({},window.__N,{COmax:13}))');
ok('inotrópico → CO↑ & Pra↓', ino.co>op.co && ino.pra<op.pra, 'CO '+ino.co.toFixed(2)+' Pra '+ino.pra.toFixed(2));
const hipo=ev('intersecaoFn(Object.assign({},window.__N,{Pmsf:4}))');
ok('hipovolemia → CO↓ & Pra↓', hipo.co<op.co && hipo.pra<op.pra, 'CO '+hipo.co.toFixed(2)+' Pra '+hipo.pra.toFixed(2));

console.log('\n— UI ≡ ENGINE (Instrumento, default) —');
ok('readout PVC* ≈ 0', near(numpt((txt('opbox-instr').match(/PVC\*\s*([\-\d.,]+)/)||[])[1]||'9'),0,0.2), txt('opbox-instr'));
ok('readout CO* ≈ 5,0', near(numpt((txt('opbox-instr').match(/CO\*\s*([\-\d.,]+)/)||[])[1]||'9'),5.0,0.15));

console.log('\n— LAB · veredito + banners —');
ok('5 presets', doc.querySelectorAll('#presets .preset').length===5, doc.querySelectorAll('#presets .preset').length);
window.setLabState({Pmsf:7,Rvr:1.4,COmax:10}); // normal
ok('veredito NORMAL = SUSTENTADO (ok)', $('lab-veredito').classList.contains('ok') && /SUSTENTADO/.test(txt('lab-vbig')), txt('lab-vbig'));
window.setLabState({Pmsf:8,Rvr:1.4,COmax:5.5}); // falência
ok('falência acende banner congestão', $('ban-congestao').classList.contains('show'));
window.setLabState({Pmsf:18,Rvr:1.4,COmax:10}); // platô
ok('muito volume acende banner platô', $('ban-plato').classList.contains('show'));
window.setLabState({Pmsf:4,Rvr:1.4,COmax:10}); // hipovolemia
ok('hipovolemia acende banner pré-carga baixa', $('ban-precarga-baixa').classList.contains('show'));
window.setLabState({Pmsf:7,Rvr:1.4,COmax:10});

console.log('\n— TUTOR GRÁFICO —');
const T=window.TUTOR;
ok('TUTOR ≥10 questões', Array.isArray(T)&&T.length>=10, T?T.length:'∅');
let bankOk=true;
(T||[]).forEach((q,i)=>{ if(!(Array.isArray(q.o)&&q.o.length===4)) {bankOk=false;console.log('  Q'+(i+1)+' !=4 opções');}
  if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4)) {bankOk=false;console.log('  Q'+(i+1)+' índice inválido');}
  if(!(q.q&&q.fb&&q.cap)) {bankOk=false;console.log('  Q'+(i+1)+' falta q/fb/cap');} });
ok('todas: 4 opções · índice válido · q/fb/cap', bankOk);
ok('canvases de questão no DOM', doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0), doc.querySelectorAll('#tutor .qplot').length);
// cada draw() roda sem lançar contra o ctx stub
let drewAll=true, threw=null;
const fakeCtx=new Proxy({},{ get:(t,p)=> (p in t? t[p] : (typeof p==='string'&&/^[a-z]/.test(p)? ()=>{} : undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fakeCtx,820,230); }catch(e){ drewAll=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() roda sem lançar (ctx stub)', drewAll, threw||'ok');

console.log('\n— CROMO + GUARDA ANTI-DEDICATÓRIA —');
ok('backlink → perfunde.html', /perfunde\.html/.test(txt('backlink')));
ok('kicker "Módulo 4"', /M[óo]dulo\s*4/.test(txt('kicker')));
ok('pontes: 5/6/11', ['perfunde5','perfunde6','perfunde11'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM-SP 151.318', /CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Matheus M. Coelho · Limeira', /Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('nota de honestidade presente', !!txt('honestidade')&&txt('honestidade').length>80);
ok('firewall SaMD no disclaimer', /nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória pessoal em qualquer lugar (guarda permanente)', html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
