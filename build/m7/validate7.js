const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde7.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 360;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotPV','plotPVLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iEdv','iEes','iEa','lEes','lEa','lEdv','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE SUNAGAWA ≡ ÂNCORAS —');
ok('Pes = Ea·SV (interseção)', near(ev('pesFn(120,2.5,1.5)'), 1.5*ev('svFn(120,2.5,1.5)'), 1e-9));
ok('SV(120,2.5,1.5)≈69', near(ev('svFn(120,2.5,1.5)'),69,4), ev('svFn(120,2.5,1.5)').toFixed(1));
ok('EF≈57%', near(ev('efFn(120,2.5,1.5)'),0.57,0.04), (ev('efFn(120,2.5,1.5)')*100).toFixed(0)+'%');
ok('Pes≈103', near(ev('pesFn(120,2.5,1.5)'),103,5), ev('pesFn(120,2.5,1.5)').toFixed(0));
ok('acoplamento Ea/Ees=0,60', near(ev('couplingFn(2.5,1.5)'),0.6,1e-9));
ok('EF cai quando Ea/Ees sobe', ev('efFn(120,2.5,1.0)') > ev('efFn(120,2.5,3.0)'));
ok('CASO: ↓Ea → SV↑ & Pes↓', ev('svFn(120,2.5,1.0)')>ev('svFn(120,2.5,1.5)') && ev('pesFn(120,2.5,1.0)')<ev('pesFn(120,2.5,1.5)'));
ok('falência+↓Ea resgata SV', ev('svFn(135,1.2,1.0)')>ev('svFn(135,1.2,2.0)'));
ok('inotrópico ↑Ees → SV↑', ev('svFn(120,3.5,1.5)')>ev('svFn(120,2.5,1.5)'));
ok('SW máximo perto de Ea/Ees≈1', ev('swFn(120,2.5,2.5)')>ev('swFn(120,2.5,0.6)') && ev('swFn(120,2.5,2.5)')>ev('swFn(120,2.5,5.0)'));
ok('eficiência cai com acoplamento', ev('effFn(120,2.5,0.6)')>ev('effFn(120,2.5,5.0)'));

console.log('\n— UI ≡ ENGINE —');
ok('readout SV/EF/Ea·Ees/trabalho', /SV <b>/.test($('opbox-instr').innerHTML)&&/Ea\/Ees <b>/.test($('opbox-instr').innerHTML)&&/trabalho <b>/.test($('opbox-instr').innerHTML), txt('opbox-instr'));

console.log('\n— LAB · veredito acoplamento + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6,doc.querySelectorAll('#presets .preset').length);
window.setLabState({edv:120,ees:2.5,ea:1.5}); ok('normal: ACOPLADO (ok)',$('lab-veredito').classList.contains('ok')&&/ACOPLADO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({edv:135,ees:1.2,ea:2.0}); ok('falência: DESACOPLADO (crit) + banner uncoupled',$('lab-veredito').classList.contains('crit')&&$('ban-uncoupled').classList.contains('show'),txt('lab-vbig'));
window.setLabState({edv:120,ees:2.5,ea:1.0}); ok('Ea baixa: banner vasodilatador',$('ban-vasodil').classList.contains('show'));
window.setLabState({edv:120,ees:3.5,ea:1.5}); ok('Ees alta: banner inotrópico',$('ban-inotropo').classList.contains('show'));
window.setLabState({edv:120,ees:2.5,ea:3.2}); ok('Ea alta: banner hipertensivo',$('ban-hipertensivo').classList.contains('show'));
window.setLabState({edv:120,ees:2.5,ea:1.5});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,240); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 7',/M[óo]dulo\s*7/.test(txt('kicker')));
ok('pontes 6/16/17',['perfunde6','perfunde16','perfunde17'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita Sunagawa/elastância',/(Sunagawa|elast[âa]ncia|Suga)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
