const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde24.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','signature','pressPanel','curveLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iPeep','iVolemia','iEffort','iLvContr','iColapso','vPeep','vVolemia','vEffort','vLvContr','vColapso',
 'presets','lab-veredito','lab-vbig','lab-vnum','opbox-sig','opbox-press','opbox-lab'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
ok('nota de mecânica (PIT → termo)',!!doc.querySelector('.pharm')&&/transmural/.test(doc.querySelector('.pharm').textContent)&&/pré-carga/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const NORM ='{peep:0,volemia:0.5,effort:0.15,lvContr:0.8,colapso:0.05}';
const HIPO ='{peep:0,volemia:0.12,effort:0.15,lvContr:0.8,colapso:0.0}';
const HIPOP='{peep:12,volemia:0.12,effort:0.15,lvContr:0.8,colapso:0.0}';
const CARD ='{peep:0,volemia:0.85,effort:0.6,lvContr:0.28,colapso:0.12}';
const CARDC='{peep:10,volemia:0.85,effort:0.15,lvContr:0.28,colapso:0.12}';
const ATEL ='{peep:0,volemia:0.5,effort:0.2,lvContr:0.8,colapso:0.85}';
const ATELP='{peep:10,volemia:0.5,effort:0.2,lvContr:0.8,colapso:0.85}';
const OVER ='{peep:20,volemia:0.5,effort:0.15,lvContr:0.8,colapso:0.0}';
ok('PAM = m9 (PVC + DC·RVS/80)', near(ev('pamFn(5,800,4)'), 4+5*800/80, 1e-9), ev('pamFn(5,800,4)'));
ok('normal: classe normal', ev('classeFn(corPulmaoFn('+NORM+'))')==='normal');
ok('normal: DC ≈ 5,1', near(ev('corPulmaoFn('+NORM+').CO'),5.1,0.6), ev('corPulmaoFn('+NORM+').CO').toFixed(2));
ok('normal: PAM ≈ 87', near(ev('corPulmaoFn('+NORM+').PAM'),87,6), ev('corPulmaoFn('+NORM+').PAM').toFixed(0));
ok('normal: PVR ≈ 1 na CRF', near(ev('corPulmaoFn('+NORM+').PVRrel'),1,0.15), ev('corPulmaoFn('+NORM+').PVRrel').toFixed(2));
ok('hipovolêmico: PEEP↑ derruba o DC', ev('corPulmaoFn('+HIPOP+').CO') < ev('corPulmaoFn('+HIPO+').CO')-0.8, ev('corPulmaoFn('+HIPO+').CO').toFixed(2)+'→'+ev('corPulmaoFn('+HIPOP+').CO').toFixed(2));
ok('hipovolêmico: sob PEEP vira preload-dependente', ev('classeFn(corPulmaoFn('+HIPOP+'))')==='preload_dep');
ok('hipovolêmico: curva DC×PEEP CAI', ev('peepOtimaFn('+HIPO+').tipo')==='cai', ev('peepOtimaFn('+HIPO+').tipo'));
ok('cardiogênico: classe ve_congesto', ev('classeFn(corPulmaoFn('+CARD+'))')==='ve_congesto');
ok('cardiogênico: CPAP descarrega o VE (pós-carga↓)', ev('corPulmaoFn('+CARDC+').LVafter') < ev('corPulmaoFn('+CARD+').LVafter')-0.2);
ok('cardiogênico: CPAP SOBE o DC', ev('corPulmaoFn('+CARDC+').CO') > ev('corPulmaoFn('+CARD+').CO')+0.5, ev('corPulmaoFn('+CARD+').CO').toFixed(2)+'→'+ev('corPulmaoFn('+CARDC+').CO').toFixed(2));
ok('atelectásico: SaO₂ baixa por shunt (<0,80)', ev('corPulmaoFn('+ATEL+').SaO2')<0.80, ev('corPulmaoFn('+ATEL+').SaO2').toFixed(2));
ok('atelectásico: curva tem PEEP ótima interior', ev('peepOtimaFn('+ATEL+').tipo')==='otimo'&&ev('peepOtimaFn('+ATEL+').peepOtima')>2&&ev('peepOtimaFn('+ATEL+').peepOtima')<20, 'ótima '+ev('peepOtimaFn('+ATEL+').peepOtima'));
ok('atelectásico: PEEP recruta (SaO₂↑ e PVR↓)', ev('corPulmaoFn('+ATELP+').SaO2')>ev('corPulmaoFn('+ATEL+').SaO2')&&ev('corPulmaoFn('+ATELP+').PVRrel')<ev('corPulmaoFn('+ATEL+').PVRrel'));
ok('PVR é U: atelectasia e hiperdistensão ambas elevam', ev('pvrFn(0,0.85)')>1.8 && ev('pvrFn(20,0)')>1.8 && ev('pvrFn(0,0)')<1.1, ev('pvrFn(0,0.85)').toFixed(2)+'/'+ev('pvrFn(0,0)').toFixed(2)+'/'+ev('pvrFn(20,0)').toFixed(2));
ok('hiperdistensão: VD sobrecarregado (RVeff<0,5)', ev('corPulmaoFn('+OVER+').RVeff')<0.5, ev('corPulmaoFn('+OVER+').RVeff').toFixed(2));
ok('A PÉROLA: a CVP engana sob PEEP (cvpEngana=true)', ev('cvpFn('+HIPO+')')===true);
ok('quatro termos: pressão positiva corta a pré-carga e descarrega o VE', ev('pressaoTermosFn('+CARD+').vr.com')<ev('pressaoTermosFn('+CARD+').vr.sem') && ev('pressaoTermosFn('+CARD+').lvafter.com')<ev('pressaoTermosFn('+CARD+').lvafter.sem'));
ok('quatro termos: net OPOSTO por fenótipo (cardiog↑ × hipovol↓)', ev('pressaoTermosFn('+CARD+').deltaCO')>0 && ev('pressaoTermosFn('+HIPO+').deltaCO')<0, 'card '+ev('pressaoTermosFn('+CARD+').deltaCO').toFixed(2)+' × hipo '+ev('pressaoTermosFn('+HIPO+').deltaCO').toFixed(2));

console.log('\n— UI ≡ ENGINE —');
ok('readout instrumento cita curva/DC/PAM/PEEP', /curva/.test($('opbox-sig').innerHTML)&&/DC/.test($('opbox-sig').innerHTML)&&/PEEP/.test($('opbox-sig').innerHTML));
ok('readout quatro termos cita pré-carga/pós-carga/ΔDC/CVP', /pré-carga/.test($('opbox-press').innerHTML)&&/pós-carga/.test($('opbox-press').innerHTML)&&/ΔDC/.test($('opbox-press').innerHTML)&&/CVP/.test($('opbox-press').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({peep:12,volemia:0.12,effort:0.15,lvContr:0.8,colapso:0.0}); ok('hipovolêmico+PEEP: PRÉ-CARGA-DEPENDENTE + banners',/PRÉ-CARGA-DEPENDENTE/.test(txt('lab-vbig'))&&$('ban-preload').classList.contains('show')&&$('ban-cvp').classList.contains('show'),txt('lab-vbig'));
window.setLabState({peep:0,volemia:0.85,effort:0.6,lvContr:0.28,colapso:0.12}); ok('cardiogênico: VE CONGESTO + banner esforço carrega o VE',/VE CONGESTO/.test(txt('lab-vbig'))&&$('ban-cardiog').classList.contains('show')&&$('ban-effort').classList.contains('show'),txt('lab-vbig'));
window.setLabState({peep:10,volemia:0.85,effort:0.15,lvContr:0.28,colapso:0.12}); ok('cardiogênico+CPAP: sai do congesto (resgatado)',!/VE CONGESTO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({peep:0,volemia:0.5,effort:0.2,lvContr:0.8,colapso:0.85}); ok('atelectásico: VD SOBRECARREGADO + banner recruta',/VD SOBRECARREGADO/.test(txt('lab-vbig'))&&$('ban-recruit').classList.contains('show'),txt('lab-vbig'));
window.setLabState({peep:20,volemia:0.5,effort:0.15,lvContr:0.8,colapso:0.0}); ok('hiperdistensão: banner overdist',$('ban-overdist').classList.contains('show'));
window.setLabState({peep:0,volemia:0.5,effort:0.15,lvContr:0.8,colapso:0.05}); ok('normal: NORMAL',/NORMAL/.test(txt('lab-vbig'))&&!/PRÉ-CARGA/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (curva+termos) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 24',/M[óo]dulo\s*24/.test(txt('kicker')));
ok('pontes 17/5/9',['perfunde17','perfunde5','perfunde9'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita mecanismo (PIT/transmural/PVR/retorno)',/(intrator|transmural|PVR|retorno|Pmsf|pré-carga)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|PEEP)/i.test(txt('disclaimer')));
// guarda de dose: o material é mecânica, nunca posologia
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM comando posológico (iniciar/prescrever/titular X)', !/\b(inicie|iniciar|prescrev|titule|titular|administre|administrar)\s+\w*(noradrenalin|dobutamin|seda|propofol)/i.test(html));
// guarda ventilatória: mecânica é permitida ("PEEP recruta", "curva DC × PEEP"); COMANDO terapêutico, não.
ok('SEM comando ventilatório prescritivo (iniciar/titular/ajustar PEEP/CPAP; intubar)', !/\b(inicie|iniciar|titule|titular|prescreva|prescrever|ajuste|ajustar|intube|intubar)\s+(a\s+|o\s+|um\s+|uma\s+|para\s+|com\s+)?(peep|cpap|press[ãa]o\s+positiva|ventila[çc]|vni|alvo\s+de\s+peep)\b/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
