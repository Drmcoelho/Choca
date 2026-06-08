const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde19.html');
const html=fs.readFileSync(file,'utf8');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const dom=new JSDOM(html,{ runScripts:'dangerously', pretendToBeVisual:true, beforeParse(window){
  window.scrollTo=()=>{}; window.requestAnimationFrame=()=>0; window.cancelAnimationFrame=()=>{};
  window.matchMedia=()=>({matches:true,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  window.HTMLElement.prototype.scrollIntoView=()=>{}; window.devicePixelRatio=1;
  const ctx=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
  window.HTMLCanvasElement.prototype.getContext=()=>ctx;
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 820;},configurable:true});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 250;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','scene','plotRelief','sceneLab','signs','signsLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','segEntidade','segLab','iSev','lSev','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const TAMP='{pp:0.7,em:0,pn:0}', TEP='{pp:0,em:0.7,pn:0}', PNX='{pp:0,em:0,pn:0.7}';
ok('os três derrubam o CO', ev('coFn('+TAMP+')')<3.5 && ev('coFn('+TEP+')')<3.5 && ev('coFn('+PNX+')')<3.5);
ok('passos impedidos distintos', /enchimento/.test(ev('impededStepFn("tamponamento")')) && /ejeção do VD/.test(ev('impededStepFn("tep")')) && /retorno venoso/.test(ev('impededStepFn("pneumotorax")')));
ok('pulso paradoxal alto no tamponamento, baixo no TEP', ev('pulsusFn('+TAMP+')')>12 && ev('pulsusFn('+TEP+')')<10);
ok('discrimina os três', ev('discriminateFn('+TAMP+')')==='tamponamento' && ev('discriminateFn('+TEP+')')==='tep' && ev('discriminateFn('+PNX+')')==='pneumotorax');
ok('alívio casa: pericardiocentese↔tamponamento etc', ev('reliefForFn("tamponamento")')==='pericardiocentese' && ev('reliefForFn("tep")')==='trombolise' && ev('reliefForFn("pneumotorax")')==='descompressao');
ok('pericardiocentese RESOLVE tamponamento', ev('applyReliefFn('+TAMP+',"pericardiocentese").co')>4.3);
ok('pericardiocentese NÃO resolve pneumotórax', Math.abs(ev('applyReliefFn('+PNX+',"pericardiocentese").co') - ev('coFn('+PNX+')'))<1e-9);
ok('descompressão RESOLVE pneumotórax', ev('applyReliefFn('+PNX+',"descompressao").co')>4.3);
ok('JVD comum aos três', ev('signsFn('+TAMP+').jvd') && ev('signsFn('+TEP+').jvd') && ev('signsFn('+PNX+').jvd'));

console.log('\n— UI ≡ ENGINE —');
ok('readout cena cita passo travado + discriminador', /passo travado/.test($('opbox-scene').innerHTML)&&/discriminador/.test($('opbox-scene').innerHTML));
ok('readout alívio cita especificidade', /recupera o débito/.test($('opbox-relief').innerHTML));
ok('chips de sinais renderizam', doc.querySelectorAll('#signs .sign').length>=5);

console.log('\n— LAB —');
window.setLabEntity('tamponamento',0.7); ok('tamponamento: veredito + banner tamp',/TAMPONAMENTO/.test(txt('lab-vbig'))&&$('ban-tamp').classList.contains('show'),txt('lab-vbig'));
window.setLabEntity('tep',0.7); ok('TEP: veredito + banner tep',/TEP/.test(txt('lab-vbig'))&&$('ban-tep').classList.contains('show'));
window.setLabEntity('pneumotorax',0.8); ok('pneumotórax: veredito + banner pnx',/PNEUMOT[ÓO]RAX/.test(txt('lab-vbig'))&&$('ban-pnx').classList.contains('show'));
ok('banner de especificidade do alívio visível', $('ban-alivio').classList.contains('show'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (scene+relief) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 19',/M[óo]dulo\s*19/.test(txt('kicker')));
ok('pontes 18/17/11',['perfunde18','perfunde17','perfunde11'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita os mecanismos/alívio',/(pulso paradoxal|POCUS|alívio|sobreposi)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(indica|dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
