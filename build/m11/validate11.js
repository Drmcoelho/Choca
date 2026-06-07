const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde11.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 760;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 200;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotIVC','plotLab','gallery','proc',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iDmax','iCi','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— IMAGEM OPEN-SOURCE: REAL + CRÉDITO + FALLBACK —');
const img=$('realimg');
ok('imagem real presente (<img>)', !!img);
ok('src aponta ao Wikimedia Commons (Special:FilePath)', !!img && /commons\.wikimedia\.org\/wiki\/Special:FilePath\//.test(img.getAttribute('src')), img&&img.getAttribute('src'));
ok('tem onerror → fallback', !!img && /realfallback/.test(img.getAttribute('onerror')||''));
ok('canvas de fallback presente', !!$('realfallback'));
const cred=doc.querySelector('.credit')?doc.querySelector('.credit').textContent:'';
ok('crédito cita licença CC BY-SA 3.0', /CC BY-SA 3\.0/.test(cred), cred.slice(0,60));
ok('crédito linka a página-fonte do Commons', !!doc.querySelector('.credit a[href*="commons.wikimedia.org/wiki/File:"]'));
ok('alt descritivo na imagem', !!img && (img.getAttribute('alt')||'').length>5);

console.log('\n— ESQUEMAS (galeria + procedimentos) —');
ok('4 janelas na galeria', doc.querySelectorAll('#gallery .wincard').length===4, doc.querySelectorAll('#gallery .wincard').length);
ok('3 procedimentos (CVC/art/IO)', doc.querySelectorAll('#proc .wincard').length===3);
ok('nota de firewall nos procedimentos', !!doc.querySelector('.procnote') && /Firewall/i.test(doc.querySelector('.procnote').textContent));
let drewWins=true; try{ ['subxifoide','paraesternal','pulmao','ivc','cvc','art','io'].forEach(function(k){ var fc=new Proxy({},{get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)),set:(t,p,v)=>{t[p]=v;return true;}}); window.drawWindow(fc,300,200,k,{effusion:true,dShape:true,bLines:true,dmax:2,ci:0.5}); }); }catch(e){ drewWins=false; }
ok('drawWindow roda p/ todas as janelas sem lançar', drewWins);

console.log('\n— ENGINE POCUS ≡ ÂNCORAS —');
ok('IVC pequena+colabável → baixa', ev('rapFromIVCFn(1.2,0.7).faixa')==='baixa');
ok('IVC grande+fixa → alta', ev('rapFromIVCFn(2.5,0.1).faixa')==='alta');
ok('lungLines ≥3 → B-lines/congestão', ev('lungLinesFn(4).padrao')==='B-lines');
ok('windowFor(tep) → D-shape + pós-carga VD', /D-shape/.test(ev('windowForFn("tep").achado')) && /VD/.test(ev('windowForFn("tep").termo')));

console.log('\n— LAB —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setScenario('tamponamento'); ok('tamponamento: janela subxifoide + banner derrame', /SUBXIFOIDE|PARAESTERNAL/.test(txt('lab-vbig'))&&$('ban-derrame').classList.contains('show'),txt('lab-vbig'));
window.setScenario('tep'); ok('TEP: termo pós-carga VD + banner D-shape', /pós-carga de VD/.test(txt('lab-vnum'))&&$('ban-dshape').classList.contains('show'));
window.setScenario('edema'); ok('edema: B-lines + banner blines', /B-lines/.test(txt('lab-vnum'))&&$('ban-blines').classList.contains('show'));
window.setScenario('hipovolemia'); ok('hipovolemia: IVC + banner ivc', /IVC/.test(txt('lab-vbig'))&&$('ban-ivc').classList.contains('show'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap&&q.kind))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap-kind',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');
// gabarito não-trivial (não todos 'a'=0)
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito do tutor varia (não só A)', dist[0] < (T?T.length:1), 'A='+dist[0]+' B='+dist[1]+' C='+dist[2]+' D='+dist[3]);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 11',/M[óo]dulo\s*11/.test(txt('kicker')));
ok('pontes 10/19/5',['perfunde10','perfunde19','perfunde5'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade declara imagem CC + exceção zero-dep', /(CC BY-SA|zero-depend)/i.test(txt('honestidade')));
ok('firewall SaMD', /nunca/i.test(txt('disclaimer'))&&/(indica|conduta|dose)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
