const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde2.html');
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
const $=id=>doc.getElementById(id);
const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotODC','plotODCLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'ipH','ipco2','itemp','idpg','ipao2','ipvo2','lpH','lpvo2','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-instrumento'); ok('troca aba ativa Instrumento',$('panel-instrumento').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE SEVERINGHAUS ≡ ÂNCORAS —');
ok('S(26,8)≈0,50',near(ev('severinghausStdFn(26.8)'),0.5,0.01),ev('severinghausStdFn(26.8)').toFixed(4));
ok('S(40)≈0,75',near(ev('severinghausStdFn(40)'),0.75,0.01),ev('severinghausStdFn(40)').toFixed(4));
ok('S(100)≈0,977',near(ev('severinghausStdFn(100)'),0.977,0.005),ev('severinghausStdFn(100)').toFixed(4));
ok('S(64)≈0,92',near(ev('severinghausStdFn(64)'),0.92,0.01),ev('severinghausStdFn(64)').toFixed(4));
ok('p50 padrão=26,8',near(ev('p50Fn(7.4,40,37,5)'),26.8,1e-9),ev('p50Fn(7.4,40,37,5)').toFixed(2));
ok('acidose→P50↑ (direita)',ev('p50Fn(7.2,40,37,5)')>26.8,ev('p50Fn(7.2,40,37,5)').toFixed(2));
ok('alcalose→P50↓ (esquerda)',ev('p50Fn(7.6,40,37,5)')<26.8,ev('p50Fn(7.6,40,37,5)').toFixed(2));
ok('febre→P50↑',ev('p50Fn(7.4,40,40,5)')>26.8);
ok('CO2↑→P50↑',ev('p50Fn(7.4,60,37,5)')>26.8);
ok('DPG↑→P50↑',ev('p50Fn(7.4,40,37,8)')>26.8);
ok('direita→sat menor em PO2 40',ev('satP50Fn(40,p50Fn(7.2,40,37,5))')<ev('severinghausStdFn(40)'));
ok('Bohr facilita offloading (acidose A−V↑)',ev('offloadingFn(95,40,7.2,40,37,5)')>ev('offloadingFn(95,40,7.4,40,37,5)'));

console.log('\n— UI ≡ ENGINE (Instrumento default) —');
ok('readout P50 ≈ 26,8',/P50\s*<b>26,8/.test($('opbox-instr').innerHTML),txt('opbox-instr'));
ok('readout SvO₂ ≈ 75%',/SvO₂ <b>75%/.test($('opbox-instr').innerHTML)||/SvO₂ <b>74%/.test($('opbox-instr').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5,doc.querySelectorAll('#presets .preset').length);
window.setLabState({pH:7.4,pco2:40,temp:37,dpg:5,pao2:95,pvo2:40}); ok('normal=CURVA NEUTRA',$('lab-veredito').classList.contains('lim')&&/NEUTRA/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({pH:7.2,pco2:55,temp:39,dpg:6,pao2:95,pvo2:40}); ok('direita: veredito ok + banner direita',$('lab-veredito').classList.contains('ok')&&$('ban-direita').classList.contains('show'),txt('lab-vbig'));
window.setLabState({pH:7.6,pco2:30,temp:34,dpg:4,pao2:95,pvo2:40}); ok('esquerda: veredito crit + banner esquerda',$('lab-veredito').classList.contains('crit')&&$('ban-esquerda').classList.contains('show'),txt('lab-vbig'));
window.setLabState({pH:7.4,pco2:40,temp:37,dpg:5,pao2:95,pvo2:25}); ok('extração máx acende (PvO2 25)',$('ban-extracao-max').classList.contains('show'));
window.setLabState({pH:7.4,pco2:40,temp:37,dpg:5,pao2:95,pvo2:52}); ok('extração baixa/paradoxo acende (PvO2 52)',$('ban-extracao-baixa').classList.contains('show'));
window.setLabState({pH:7.4,pco2:40,temp:37,dpg:5,pao2:95,pvo2:40});

console.log('\n— TUTOR GRÁFICO —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach((q,i)=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas: 4 opções·índice·q/fb/cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0),doc.querySelectorAll('#tutor .qplot').length);
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() roda sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink perfunde.html',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 2',/M[óo]dulo\s*2/.test(txt('kicker')));
ok('pontes 1/12',['perfunde1','perfunde12'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade presente',!!txt('honestidade')&&txt('honestidade').length>80);
ok('honestidade cita paradoxo micro/mitocondrial',/(micro|mitocondrial)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
