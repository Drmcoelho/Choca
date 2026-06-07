const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde6.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotStarling','plotStarlingLab','toggle',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iVdf','iContr','iAf','lVdf','lContr','lAf','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
ok('toggle 2 modos',doc.querySelectorAll('#toggle button').length===2);
window.activateTab('tab-instrumento'); ok('troca aba ativa Instrumento',$('panel-instrumento').classList.contains('active'));

console.log('\n— ENGINE FRANK-STARLING ≡ ÂNCORAS —');
ok('VS(120,1,80)≈72', near(ev('starlingVSFn(120,1,80)'),72,4), ev('starlingVSFn(120,1,80)').toFixed(1));
ok('EF(120,1,80)≈0,60', near(ev('efFn(120,1,80)'),0.60,0.04), ev('efFn(120,1,80)').toFixed(3));
ok('Pench(120)≈10', near(ev('edpvrFn(120)'),10,2), ev('edpvrFn(120)').toFixed(1));
ok('falência VS<normal @120', ev('starlingVSFn(120,0.5,80)')<ev('starlingVSFn(120,1,80)'));
ok('inotrópico VS>normal @120', ev('starlingVSFn(120,1.5,80)')>ev('starlingVSFn(120,1,80)'));
ok('pós-carga↑ derruba VS', ev('starlingVSFn(120,1,160)')<ev('starlingVSFn(120,1,80)'));
ok('SEM ramo descendente: VS(240)>VS(180)>VS(120)', ev('starlingVSFn(240,1,80)')>ev('starlingVSFn(180,1,80)') && ev('starlingVSFn(180,1,80)')>ev('starlingVSFn(120,1,80)'));
ok('platô: slope(120)>slope(200)', ev('slopeFn(120,1,80)')>ev('slopeFn(200,1,80)'));
ok('congestão Pench(180)>18', ev('edpvrFn(180)')>18, ev('edpvrFn(180)').toFixed(1));
ok('falsa queda: VS×pench 15→30 sobe pouco', (ev('vsAtPenchFn(30,1,80)')-ev('vsAtPenchFn(15,1,80)'))<6);

console.log('\n— UI ≡ ENGINE + toggle —');
ok('readout VS/EF/Pench', /VS <b>/.test($('opbox-instr').innerHTML)&&/EF <b>/.test($('opbox-instr').innerHTML)&&/Pench <b>/.test($('opbox-instr').innerHTML), txt('opbox-instr'));
window.setMode('pench'); ok('toggle p/ modo pressão não quebra', !!txt('opbox-instr')); window.setMode('edv');

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5);
window.setLabState({vdf:80,contr:1.0,af:80}); ok('ascendente: ok + banner ascendente',$('lab-veredito').classList.contains('ok')&&$('ban-ascendente').classList.contains('show'),txt('lab-vbig'));
window.setLabState({vdf:140,contr:0.6,af:80}); ok('platô: lim + banner platô',$('lab-veredito').classList.contains('lim')&&$('ban-plato').classList.contains('show'),txt('lab-vbig'));
window.setLabState({vdf:200,contr:0.5,af:90}); ok('falência alto VDF: congestão + mito',$('lab-veredito').classList.contains('crit')&&$('ban-congestao').classList.contains('show')&&$('ban-mito').classList.contains('show'),txt('lab-vbig'));
window.setLabState({vdf:120,contr:1.5,af:80}); ok('inotrópico: banner inotropo',$('ban-inotropo').classList.contains('show'));
window.setLabState({vdf:120,contr:1.0,af:170}); ok('pós-carga alta: banner afterload',$('ban-afterload').classList.contains('show'));
window.setLabState({vdf:120,contr:1.0,af:80});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar (inclui modo pench)',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 6',/M[óo]dulo\s*6/.test(txt('kicker')));
ok('pontes 4/7/16',['perfunde4','perfunde7','perfunde16'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita EDPVR/ramo descendente',/(EDPVR|ramo descendente|overstretch)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
