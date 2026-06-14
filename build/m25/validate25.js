const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde25.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 260;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','curve','quad','curveLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iVol','iPreDep','iContract','iLeak','iVeno',
 'presets','lab-veredito','opbox-curve','opbox-quad','opbox-lab','lab-vbig',
 'caso-interativo','caso-prog','prever','prever-opts','prever-fb'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha expandida ≥9',doc.querySelectorAll('#panel-trilha .step').length>=9);
ok('Trilha com pistas progressivas',doc.querySelectorAll('#panel-trilha .pista').length>=4);
ok('nota de física do volume (intervenção→termo)',!!doc.querySelector('.pharm')&&/P\s*<sub>?msf|Pmsf|P<sub>msf|retorno venoso/.test(doc.querySelector('.pharm').innerHTML));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const HY='{preDep:0.85,contract:0.75,leak:0.1}';
ok('volemic basal dá número', !isNaN(ev('volemicFn({}).CO')));
ok('hipovolêmico é responsivo', ev('responsiveFn('+HY+')')===true);
ok('1º bolus sobe muito o débito', ev('volemicFn({preDep:0.85,contract:0.75,leak:0.1,vol:1}).CO') > ev('volemicFn('+HY+').CO')*1.4);
ok('BENEFÍCIO decai (ΔCO do bolus cai com o volume)', ev('marginalFn({preDep:0.85,contract:0.75,leak:0.1,vol:0}).dCO') > ev('marginalFn({preDep:0.85,contract:0.75,leak:0.1,vol:2}).dCO'));
ok('CUSTO acumula (congestão cresce com o volume)', ev('volemicFn({preDep:0.85,contract:0.75,leak:0.1,vol:0}).congestion') < ev('volemicFn({preDep:0.85,contract:0.75,leak:0.1,vol:4}).congestion'));
ok('vira platô (não-responsivo após ressuscitar)', ev('responsiveFn({preDep:0.85,contract:0.75,leak:0.1,vol:3})')===false);
ok('GIVE: responsivo + tolerante', ev('quadrantFn('+HY+')')==='give');
ok('FÚTIL: não-responsivo + tolerante', ev('quadrantFn({preDep:0.85,contract:0.75,leak:0.1,vol:2})')==='futile');
ok('SÓ CUSTO: não-responsivo + intolerante (creep)', ev('quadrantFn({preDep:0.85,contract:0.75,leak:0.1,vol:4})')==='harm');
ok('TRADEOFF: responsivo MAS intolerante (leak)', ev('quadrantFn({preDep:0.7,contract:0.45,leak:0.8,vol:1})')==='tradeoff' && ev('responsiveFn({preDep:0.7,contract:0.45,leak:0.8,vol:1})')===true && ev('tolerantFn({preDep:0.7,contract:0.45,leak:0.8,vol:1})')===false);
ok('responsividade ≠ tolerância (eixos independentes)', ev('responsiveFn({preDep:0.7,contract:0.45,leak:0.8,vol:1})')!==ev('tolerantFn({preDep:0.7,contract:0.45,leak:0.8,vol:1})'));
ok('leak reduz a fração intravascular', ev('volemicFn({leak:0.8}).intravasc') < ev('volemicFn({leak:0.1}).intravasc'));
ok('leak congestiona mais', ev('volemicFn({preDep:0.7,leak:0.8,vol:1}).congestion') > ev('volemicFn({preDep:0.7,leak:0.1,vol:1}).congestion'));
ok('optimalVolume devolve ponto de parada', ev('optimalVolumeFn('+HY+').vol')>=1 && ev('optimalVolumeFn('+HY+').vol')<=5);
ok('applyBolus incrementa o volume', ev('applyBolusFn({vol:1}).vol')===2);

console.log('\n— UI ≡ ENGINE —');
ok('readout curva cita CO/congestão/parar', /CO/.test($('opbox-curve').innerHTML)&&/congestão/.test($('opbox-curve').innerHTML)&&/parar/.test($('opbox-curve').innerHTML));
ok('readout mapa cita responsivo/tolerante/quadrante', /responsivo/.test($('opbox-quad').innerHTML)&&/tolerante/.test($('opbox-quad').innerHTML)&&/quadrante/.test($('opbox-quad').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({preDep:0.85,contract:0.75,leak:0.1,vol:0}); ok('hipovol: DAR VOLUME + banner responsivo',/DAR VOLUME/.test(txt('lab-vbig'))&&$('ban-responsivo').classList.contains('show'),txt('lab-vbig'));
window.setLabState({preDep:0.85,contract:0.75,leak:0.1,vol:5}); ok('creep: SÓ CUSTO + banner creep',/SÓ CUSTO/.test(txt('lab-vbig'))&&$('ban-creep').classList.contains('show'),txt('lab-vbig'));
window.setLabState({preDep:0.7,contract:0.55,leak:0.8,vol:1}); ok('séptico leak: banner leak',$('ban-leak').classList.contains('show'));
window.setLabState({preDep:0.85,contract:0.75,leak:0.1,vol:3}); ok('ressuscitado: banner platô (não-responsivo)',$('ban-plato').classList.contains('show'));
ok('banner ponto-de-parar sempre presente',$('ban-otimo').classList.contains('show'));

console.log('\n— INTERATIVO: caso com decisões —');
const dec=doc.querySelectorAll('#caso-interativo .decision');
ok('caso progressivo ≥3 decisões',dec.length>=3,dec.length);
ok('apenas a 1ª decisão visível no início', dec.length>1 && dec[0].style.display!=='none' && dec[1].style.display==='none');
const dec0=dec[0]?dec[0].querySelector('.dopts .opt'):null;
ok('decisão tem botões',!!dec0);
if(dec0){ dec0.dispatchEvent(new window.Event('click',{bubbles:true}));
  ok('responder revela consequência no motor (CO→CO)', dec[0].querySelector('.dfb.show')!=null && /CO\s/.test(dec[0].querySelector('.dfb').textContent));
  ok('responder revela a próxima decisão', dec[1].style.display!=='none'); }

console.log('\n— INTERATIVO: prever-depois-revelar —');
const pbtns=doc.querySelectorAll('#prever-opts .opt');
ok('prever tem 3 opções (muito/pouco/nada)',pbtns.length===3);
ok('feedback começa oculto',!$('prever-fb').classList.contains('show'));
window.setLabState({preDep:0.85,contract:0.75,leak:0.1,vol:0});   // responsivo → "muito"
pbtns[0].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder revela o ΔDC do motor', $('prever-fb').classList.contains('show') && /ΔDC/.test(txt('prever-fb')));
window.setLabState({}); ok('mudar o paciente re-arma a previsão', !$('prever-fb').classList.contains('show'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('banco ≥16',Array.isArray(T)&&T.length>=16,T?T.length:'∅');
ok('chips de dificuldade (crescente)',doc.querySelectorAll('#tutor .dif').length===(T?T.length:0) && !!doc.querySelector('#tutor .dif-a'));
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (curve+quad) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 25',/M[óo]dulo\s*25/.test(txt('kicker')));
ok('pontes 4/6/12/14',['perfunde4','perfunde6','perfunde12','perfunde14'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita Starling/congestão/glicocálice',/(starling|congest|glicoc|pré-carga)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(volume|protocolo|fluido)/i.test(txt('disclaimer')));
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM volume prescrito (mL/L de bolus)', !/\b\d+(?:[.,]\d+)?\s*(ml|l)\s+de\s+(soro|cristal|fluido|bolus|volume)/i.test(html) && !/bolus\s+de\s+\d+/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
