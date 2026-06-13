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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','curve','vent','curveLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iPeep','iEffort','iLv','iRv','iVol',
 'presets','lab-veredito','opbox-curve','opbox-vent','opbox-lab','lab-vbig'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
ok('nota de mecânica ventilatória (PEEP→termo)',!!doc.querySelector('.pharm')&&/PEEP/.test(doc.querySelector('.pharm').textContent)&&/pós-carga/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('CO basal passivo ≈ 5,5', near(ev('cardiopulmFn({}).CO'),5.5,0.6), ev('cardiopulmFn({}).CO').toFixed(2));
ok('PEEP sobe a PIT e derruba o retorno venoso', ev('cardiopulmFn({peep:15}).meanITP')>ev('cardiopulmFn({}).meanITP') && ev('cardiopulmFn({peep:15}).VR')<ev('cardiopulmFn({}).VR'));
ok('PVR em U: mínima na PEEP ótima (~8)', ev('cardiopulmFn({peep:8}).PVR')<ev('cardiopulmFn({peep:0}).PVR') && ev('cardiopulmFn({peep:8}).PVR')<ev('cardiopulmFn({peep:16}).PVR'));
ok('VE que falha: +PEEP SOBE o débito', ev('cardiopulmFn({lvFail:0.8,peep:12}).CO')>ev('cardiopulmFn({lvFail:0.8,peep:0}).CO'));
ok('VE que falha: espontâneo PIORA', ev('cardiopulmFn({lvFail:0.8,effort:0.8,peep:0}).CO')<ev('cardiopulmFn({lvFail:0.8,peep:0}).CO'));
ok('VD que falha: +PEEP alta DERRUBA o débito', ev('cardiopulmFn({rvFail:0.8,peep:14}).CO')<ev('cardiopulmFn({rvFail:0.8,peep:0}).CO'));
ok('A PÉROLA: +PEEP ajuda o VE (Δ>0) e prejudica o VD (Δ<0)', (ev('cardiopulmFn({lvFail:0.8,peep:12}).CO')-ev('cardiopulmFn({lvFail:0.8,peep:0}).CO'))>0 && (ev('cardiopulmFn({rvFail:0.8,peep:12}).CO')-ev('cardiopulmFn({rvFail:0.8,peep:0}).CO'))<0);
ok('dominantVentricle classifica VE/VD/none', ev('dominantVentricleFn({lvFail:0.8})')==='lv' && ev('dominantVentricleFn({rvFail:0.8})')==='rv' && ev('dominantVentricleFn({})')==='none');
ok('PEEP ótima: alta no VE, baixa/moderada no VD', ev('optimalPeepFn({lvFail:0.8}).peep')>=10 && ev('optimalPeepFn({rvFail:0.8}).peep')<=8);
ok('ventResponse VE: PEEP > passivo > espontâneo', ev('ventResponseFn({lvFail:0.8}).peep')>ev('ventResponseFn({lvFail:0.8}).passivo') && ev('ventResponseFn({lvFail:0.8}).passivo')>ev('ventResponseFn({lvFail:0.8}).espontaneo'));
ok('ventResponse VD: PEEP < passivo', ev('ventResponseFn({rvFail:0.8}).peep')<ev('ventResponseFn({rvFail:0.8}).passivo'));
ok('série: débito = min(VD, VE)', near(ev('cardiopulmFn({}).CO'), Math.min(ev('cardiopulmFn({}).RVout'),ev('cardiopulmFn({}).LVcap')), 1e-9));
ok('alavancas: applyPEEP sobe PIT; applySpontaneous sobe esforço', ev('applyPEEPFn({}).peep')>5 && ev('applySpontaneousFn({}).effort')>0);

console.log('\n— UI ≡ ENGINE —');
ok('readout curva cita ventrículo/CO/PEEP ótima', /ventrículo/.test($('opbox-curve').innerHTML)&&/PEEP ótima/.test($('opbox-curve').innerHTML));
ok('readout ventilação cita espontâneo/passivo/PEEP', /espontâneo/.test($('opbox-vent').innerHTML)&&/passivo/.test($('opbox-vent').innerHTML)&&/PEEP/.test($('opbox-vent').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({lvFail:0.8,effort:0.8,peep:0}); ok('VE falha: veredito VE QUE FALHA + banner VE',/VE QUE FALHA/.test(txt('lab-vbig'))&&$('ban-ve').classList.contains('show'),txt('lab-vbig'));
window.setLabState({rvFail:0.8,peep:14}); ok('VD falha: veredito VD QUE FALHA + banner VD',/VD QUE FALHA/.test(txt('lab-vbig'))&&$('ban-vd').classList.contains('show'),txt('lab-vbig'));
ok('VD+PEEP alta: banner PIT (retorno venoso↓)',$('ban-pit').classList.contains('show'));
window.setLabState({volemia:0.3,peep:12}); ok('hipovolêmico+PEEP: banner série sempre presente',$('ban-serie').classList.contains('show'));
window.setLabState({}); ok('normal: ACOPLAMENTO NORMAL',/NORMAL/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (curve+vent) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 24',/M[óo]dulo\s*24/.test(txt('kicker')));
ok('pontes 7/17/18/19',['perfunde7','perfunde17','perfunde18','perfunde19'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita PIT/PVR/série/pós-carga',/(PIT|PVR|série|pós-carga|transmural)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(PEEP|conduta|modo)/i.test(txt('disclaimer')));
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM comando de ajuste prescritivo', !/\b(ajuste|titule|coloque|programe|use)\s+(a\s+)?peep\s+(em|para|de)\s+\d/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
