const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde23.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','attribution','levers','attributionLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iHypo','iCardio','iObstr','iDistr','iSeptic','iComp',
 'presets','lab-veredito','opbox-attr','opbox-levers','opbox-lab','lab-vbig'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
ok('nota de farmacologia (receptor→termo)',!!doc.querySelector('.pharm')&&/α1/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const NORM='{}';
const HY06='{hypo:0.6}', CA06='{cardio:0.6}', MIX='{hypo:0.6,cardio:0.6}';
const SEP='{distr:0.6,septic:0.9}';
ok('normal: PAM ≈ 83', near(ev('mixedFn('+NORM+').PAM'),83,4), ev('mixedFn('+NORM+').PAM').toFixed(0));
ok('normal: sem déficit', ev('mixedFn('+NORM+').deficit')===0);
ok('single 0.6 compensa (hipo e cardio sem déficit)', ev('mixedFn('+HY06+').deficit')===0 && ev('mixedFn('+CA06+').deficit')===0);
ok('COMPOSIÇÃO: mistura 0.6+0.6 tem déficit > 0', ev('mixedFn('+MIX+').deficit')>0, ev('mixedFn('+MIX+').deficit').toFixed(0));
ok('mistura pior que cada parte', ev('mixedFn('+MIX+').deficit')>ev('mixedFn('+HY06+').deficit') && ev('mixedFn('+MIX+').deficit')>ev('mixedFn('+CA06+').deficit'));
ok('single grave 0.9 descompensa', ev('mixedFn({hypo:0.9}).deficit')>0);
ok('MASCARAMENTO: séptico PAM≥65 + déficit', ev('mixedFn('+SEP+').PAM')>=65 && ev('mixedFn('+SEP+').deficit')>0);
ok('maskingFn sinaliza no séptico', ev('maskingFn(mixedFn('+SEP+'))')===true);
ok('extração cai no séptico (<0,40)', ev('mixedFn('+SEP+').extrCap')<0.40, ev('mixedFn('+SEP+').extrCap').toFixed(2));
ok('vasoplegia pura: hiperdinâmica e sem déficit', ev('mixedFn({distr:0.8}).DC')>ev('mixedFn({}).DC') && ev('mixedFn({distr:0.8}).deficit')===0);
ok('atribuição: séptico+cardio ambos contribuem', ev('attributionFn({distr:0.7,septic:0.7,cardio:0.6}).septic')>0 && ev('attributionFn({distr:0.7,septic:0.7,cardio:0.6}).cardio')>0);
ok('dominante de hipo-grave é hypo', ev('dominantFn({hypo:0.95})')==='hypo');
ok('activeTerms conta eixos ≥0.2', ev('activeTermsFn({hypo:0.6,cardio:0.5,distr:0.1}).length')===2);
ok('PRESSOR mascara: sobe PAM, não o déficit', ev('mixedFn(applyPressorFn('+SEP+')).PAM')>ev('mixedFn('+SEP+').PAM') && near(ev('mixedFn(applyPressorFn('+SEP+')).deficit'),ev('mixedFn('+SEP+').deficit'),1e-9));
ok('INÓTROPO fecha o cardiogênico', ev('mixedFn(applyInotropeFn({cardio:0.9})).deficit') < ev('mixedFn({cardio:0.9}).deficit'));
ok('VOLUME fecha o hipovolêmico, não o cardiogênico', ev('mixedFn(applyVolumeFn({hypo:0.9})).deficit') < ev('mixedFn({hypo:0.9}).deficit') && near(ev('mixedFn(applyVolumeFn({cardio:0.9})).deficit'),ev('mixedFn({cardio:0.9}).deficit'),1e-9));
ok('reserva baixa derruba a PAM', ev('mixedFn({hypo:0.8,comp:0.2}).PAM') < ev('mixedFn({hypo:0.8,comp:0.9}).PAM'));

console.log('\n— UI ≡ ENGINE —');
ok('readout atribuição cita dominante/déficit', /dominante/.test($('opbox-attr').innerHTML)&&/déficit/.test($('opbox-attr').innerHTML));
ok('readout alavancas cita volume/inótropo/pressor', /volume/.test($('opbox-levers').innerHTML)&&/inótropo/.test($('opbox-levers').innerHTML)&&/pressor/.test($('opbox-levers').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({distr:0.7,septic:0.7,cardio:0.6}); ok('misto: CHOQUE MISTO + banner composição',/MISTO/.test(txt('lab-vbig'))&&$('ban-composicao').classList.contains('show'),txt('lab-vbig'));
ok('misto séptico: banner extração + alavanca',$('ban-extracao').classList.contains('show')&&$('ban-alavanca').classList.contains('show'));
window.setLabState({distr:0.6,septic:0.9}); ok('séptico: banner mascaramento',$('ban-masking').classList.contains('show'));
window.setLabState({cardio:0.85}); ok('cardiogênico: banner congestão',$('ban-congestao').classList.contains('show'));
window.setLabState({hypo:0.8,comp:0.2}); ok('reserva baixa: banner reserva',$('ban-reserva').classList.contains('show'));
window.setLabState({}); ok('normal: SEM CHOQUE',/SEM CHOQUE/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (attr+levers) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 23',/M[óo]dulo\s*23/.test(txt('kicker')));
ok('pontes 14/16/21',['perfunde14','perfunde16','perfunde21'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita composição/atribuição/mascaramento',/(composi|atribui|mascar)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM comando posológico', !/\b(inicie|iniciar|prescrev|titule|titular|administre|administrar)\s+\w*(adrenalin|noradrenalin|dobutamin|volume|cristal)/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
