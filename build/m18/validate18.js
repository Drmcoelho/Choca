const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde18.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotGuyton','plotHeart','plotGuytonLab',
 'opbox-guyton','opbox-heart','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iPext','iVol','iHr','lPext','lVol','lHr','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('normal: DC ≈ 5,0',near(ev('obsFn({Pext:0}).DC'),5.0,0.1),ev('obsFn({Pext:0}).DC').toFixed(2));
ok('normal: CVP baixa (~2)',near(ev('obsFn({Pext:0}).CVP'),2,1),ev('obsFn({Pext:0}).CVP').toFixed(1));
ok('obstrutivo(14): CVP ALTA (≥12)',ev('obsFn({Pext:14}).CVP')>=12,ev('obsFn({Pext:14}).CVP').toFixed(1));
ok('obstrutivo(14): DC BAIXO (<3,6)',ev('obsFn({Pext:14}).DC')<3.6,ev('obsFn({Pext:14}).DC').toFixed(2));
ok('obstrutivo(14): classe obstrutivo',ev('classeFn(obsFn({Pext:14}))')==='obstrutivo');
ok('grave(20): DC<2 e classe colapso',ev('obsFn({Pext:20}).DC')<2 && ev('classeFn(obsFn({Pext:20}))')==='colapso');
ok('DC cai com Pext (monotônico)',ev('obsFn({Pext:6}).DC')>ev('obsFn({Pext:14}).DC') && ev('obsFn({Pext:14}).DC')>ev('obsFn({Pext:22}).DC'));
ok('CVP sobe com Pext (monotônico)',ev('obsFn({Pext:6}).CVP')<ev('obsFn({Pext:14}).CVP') && ev('obsFn({Pext:14}).CVP')<ev('obsFn({Pext:22}).CVP'));
ok('ESPELHO: obstrutivo CVP alta vs hipovolêmico CVP baixa',ev('obsFn({Pext:18}).CVP')-ev('hipoFn(obsFn({Pext:18}).DC).CVP')>=10,
   'Δ '+(ev('obsFn({Pext:18}).CVP')-ev('hipoFn(obsFn({Pext:18}).DC).CVP')).toFixed(1));
ok('volume SOBE o DC contra a obstrução',ev('obsFn({Pext:20,vol:0.5}).DC')>ev('obsFn({Pext:20}).DC')+1.5);
ok('volume sobe a CVP junto (custo)',ev('obsFn({Pext:20,vol:0.5}).CVP')>ev('obsFn({Pext:20}).CVP'));
ok('alívio (Pext↓) restaura o DC',ev('obsFn({Pext:4}).DC')>4.0);
ok('transmural cai com Pext',ev('obsFn({Pext:18}).transmural')<ev('obsFn({Pext:2}).transmural'));

console.log('\n— UI ≡ ENGINE (default obstrutivo Pext14) —');
ok('readout Guyton mostra PVC + transmural',/PVC/.test($('opbox-guyton').innerHTML)&&/transmural/.test($('opbox-guyton').innerHTML),txt('opbox-guyton'));
ok('readout coração mostra enchimento',/enchimento/.test($('opbox-heart').innerHTML),txt('opbox-heart'));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6,doc.querySelectorAll('#presets .preset').length);
window.setLabState({Pext:0,vol:0,hr:75}); ok('normal = PERFUSÃO NORMAL',$('lab-veredito').classList.contains('ok')&&/NORMAL/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({Pext:16,vol:0,hr:104}); ok('obstrutivo = CHOQUE OBSTRUTIVO + assinatura + auto-PEEP',$('lab-veredito').classList.contains('crit')&&$('ban-assinatura').classList.contains('show')&&$('ban-autopeep').classList.contains('show'),txt('lab-vbig'));
window.setLabState({Pext:23,vol:0,hr:130}); ok('colapso = banner colapso',$('ban-colapso').classList.contains('show'));
window.setLabState({Pext:18,vol:0.5,hr:96}); ok('volume: banner volume',$('ban-volume').classList.contains('show'));
window.setLabState({Pext:14,vol:0,hr:90});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (guyton+heart)',['guyton','heart'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,210); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 18',/M[óo]dulo\s*18/.test(txt('kicker')));
ok('pontes mvp1/4/19',['mvp1','perfunde4','perfunde19'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: alívio + auto-PEEP/intratorácica',/(pericardiocentese|descompress|al[íi]vio)/i.test(txt('honestidade'))&&/intrator[áa]cica/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|volume)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
