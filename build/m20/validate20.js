const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde20.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotPAM','plotExtract','plotPAMLab',
 'opbox-pam','opbox-extract','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iTonus','iDC','iPressor','iExtr','lTonus','lDC','lPressor','lExtr','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const N='distFn({tonus:0.78,DC:5,pressor:0,extracao:1})';
const D='distFn({tonus:0.12,DC:7.5,pressor:0,extracao:0.25})';
const HD='distFn({tonus:0.5,DC:8,pressor:0,extracao:1})';
const P='distFn({tonus:0.12,DC:7.5,pressor:0.8,extracao:0.25})';
ok('normal: PAM ≈ 90',near(ev(N+'.PAM'),90,3),ev(N+'.PAM').toFixed(0));
ok('normal: RVS ≈ 1358',near(ev(N+'.RVSdyn'),1358,25),ev(N+'.RVSdyn').toFixed(0));
ok('distributivo: RVS baixa (<900)',ev(D+'.RVSdyn')<900,ev(D+'.RVSdyn').toFixed(0));
ok('distributivo: PAM baixa (<65) com DC alto',ev(D+'.PAM')<65 && ev(D+'.DC')>=7);
ok('distributivo: classe distributivo',ev('classeFn('+D+')')==='distributivo');
ok('distributivo: DC alto não resgata (DC9 ainda <80)',ev('distFn({tonus:0.12,DC:9,pressor:0,extracao:0.25}).PAM')<80);
ok('distributivo: ScvO₂ ALTA (>0,85) + lactato ALTO (>3) = inversão',ev(D+'.ScvO2')>0.85 && ev(D+'.lactate')>3 && ev('inversaoFn('+D+')')===true);
ok('SAGACIDADE: hiperdinâmico ScvO₂ alta mas lactato normal',ev(HD+'.ScvO2')>0.78 && ev(HD+'.lactate')<1.5 && ev('ambiguaFn('+HD+')')===true && ev('inversaoFn('+HD+')')===false);
ok('o discriminador é o lactato (mesma ScvO₂ alta, lactato oposto)',ev(D+'.ScvO2')>0.78 && ev(HD+'.ScvO2')>0.78 && ev(D+'.lactate')>2 && ev(HD+'.lactate')<1.5);
ok('α1 é o eixo: pressor restaura a PAM (>+30)',ev(P+'.PAM')>ev(D+'.PAM')+30);
ok('corrigir RVS rende mais PAM que o DC',ev('ganhoRVSFn('+D+')')>5*ev('ganhoDCFn('+D+')'));
ok('mas a micro persiste sob pressor (inversão segue)',ev('inversaoFn('+P+')')===true);
ok('ScvO₂ sobe quando a extração falha',ev('distFn({tonus:0.3,DC:7,extracao:0.2}).ScvO2')>ev('distFn({tonus:0.3,DC:7,extracao:1}).ScvO2'));

console.log('\n— UI ≡ ENGINE (default distributivo) —');
ok('readout PAM mostra RVS',/RVS/.test($('opbox-pam').innerHTML),txt('opbox-pam'));
ok('readout extração mostra ScvO₂ + lactato',/ScvO₂/.test($('opbox-extract').innerHTML)&&/lactato/.test($('opbox-extract').innerHTML),txt('opbox-extract'));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5,doc.querySelectorAll('#presets .preset').length);
window.setLabState({tonus:0.78,DC:5,pressor:0,extracao:1}); ok('normal = COMPENSADA',$('lab-veredito').classList.contains('ok')&&/COMPENSADA/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({tonus:0.12,DC:7.5,pressor:0,extracao:0.25}); ok('distributivo = CHOQUE DISTRIBUTIVO + RVS + inversão',$('lab-veredito').classList.contains('crit')&&$('ban-rvs').classList.contains('show')&&$('ban-inversao').classList.contains('show'),txt('lab-vbig'));
window.setLabState({tonus:0.5,DC:8,pressor:0,extracao:1}); ok('hiperdinâmico: banner ScvO₂ ambígua (sagacidade)',$('ban-scvo2').classList.contains('show')&&!$('ban-inversao').classList.contains('show'));
window.setLabState({tonus:0.12,DC:7.5,pressor:0.8,extracao:0.25}); ok('pressor: banner α1 é o eixo',$('ban-pressor').classList.contains('show'));
window.setLabState({tonus:0.12,DC:7.5,pressor:0,extracao:0.25});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (pam+extract)',['pam','extract'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,210); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 20',/M[óo]dulo\s*20/.test(txt('kicker')));
ok('pontes 9/12/21',['perfunde9','perfunde12','perfunde21'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: α1 + micro/citopática',/α1|vasopressor/i.test(txt('honestidade'))&&/(citop[áa]tica|mitocondrial|shunt)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|alvo)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
