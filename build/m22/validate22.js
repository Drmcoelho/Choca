const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde22.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','signature','epiPanel','signatureLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iTonus','iSimp','iLeak','iEpi','iBroncho',
 'presets','lab-veredito','opbox-sig','opbox-epi','opbox-lab','lab-vbig'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
ok('nota de farmacologia (receptor→termo)',!!doc.querySelector('.pharm')&&/α1/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const NORM='{tonus:0.78,simpatico:0.45,vazamento:0,epi:0,broncho:0}';
const ANA ='{tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8}';
const NEU ='{tonus:0.22,simpatico:0.12,vazamento:0.35,epi:0,broncho:0}';
const AEPI='{tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0.85,broncho:0.8}';
const ALPH='{tonus:0.55,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8}';
ok('PAM = m9 (PVC + DC·RVS/80)', near(ev('pamFn(5,800,4)'), 4+5*800/80, 1e-9), ev('pamFn(5,800,4)'));
ok('normal: classe normal', ev('classeFn(distANFn('+NORM+'))')==='normal');
ok('normal: PAM ≈ 85', near(ev('distANFn('+NORM+').PAM'),85,4), ev('distANFn('+NORM+').PAM').toFixed(0));
ok('anafilático: RVS < 900', ev('distANFn('+ANA+').RVSdyn')<900, ev('distANFn('+ANA+').RVSdyn').toFixed(0));
ok('anafilático: TAQUICARDIA (FC ≥ 100)', ev('distANFn('+ANA+').HR')>=100, ev('distANFn('+ANA+').HR').toFixed(0));
ok('anafilático: SaO₂ baixa (<0,90) por broncho', ev('distANFn('+ANA+').SaO2')<0.90, ev('distANFn('+ANA+').SaO2').toFixed(3));
ok('anafilático: classe anafilatico', ev('classeFn(distANFn('+ANA+'))')==='anafilatico');
ok('anafilático: NÃO é a pérola', ev('neuroSigFn(distANFn('+ANA+'))')===false);
ok('neurogênico: RVS < 900', ev('distANFn('+NEU+').RVSdyn')<900, ev('distANFn('+NEU+').RVSdyn').toFixed(0));
ok('neurogênico: BRADICARDIA (FC ≤ 55)', ev('distANFn('+NEU+').HR')<=55, ev('distANFn('+NEU+').HR').toFixed(0));
ok('neurogênico: SaO₂ preservada (>0,95)', ev('distANFn('+NEU+').SaO2')>0.95, ev('distANFn('+NEU+').SaO2').toFixed(3));
ok('neurogênico: classe neurogenico', ev('classeFn(distANFn('+NEU+'))')==='neurogenico');
ok('A PÉROLA: neuroSig = true (único sem taquicardia)', ev('neuroSigFn(distANFn('+NEU+'))')===true);
ok('DISCRIMINADOR: mesma RVS↓, FC oposta', ev('distANFn('+ANA+').RVSdyn')<900 && ev('distANFn('+NEU+').RVSdyn')<900 && ev('distANFn('+ANA+').HR')>100 && ev('distANFn('+NEU+').HR')<60);
ok('padrão FC: taqui × bradi', ev('padraoFn(distANFn('+ANA+'))')==='taqui' && ev('padraoFn(distANFn('+NEU+'))')==='bradi');
ok('ADRENALINA move os QUATRO termos', ev('epiTermosFn('+AEPI+').nTermos')===4, ev('epiTermosFn('+AEPI+').nTermos')+' termos');
ok('α-puro restaura a PAM (>60)', ev('distANFn('+ALPH+').PAM')>60, ev('distANFn('+ALPH+').PAM').toFixed(0));
ok('α-puro DEIXA a SaO₂ baixa (<0,90)', ev('distANFn('+ALPH+').SaO2')<0.90, ev('distANFn('+ALPH+').SaO2').toFixed(3));

console.log('\n— UI ≡ ENGINE —');
ok('readout discriminador cita RVS/FC/PAM/classe', /RVS/.test($('opbox-sig').innerHTML)&&/FC/.test($('opbox-sig').innerHTML)&&/classe/.test($('opbox-sig').innerHTML));
ok('readout epi cita os 4 termos (RVS/SaO₂/pré-carga)', /termos/.test($('opbox-epi').innerHTML)&&/SaO₂/.test($('opbox-epi').innerHTML)&&/pré-carga/.test($('opbox-epi').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8}); ok('anafilático: ANAFILÁTICO + banner discriminador',/ANAFILÁTICO/.test(txt('lab-vbig'))&&$('ban-anafilatico').classList.contains('show')&&$('ban-discriminador').classList.contains('show'),txt('lab-vbig'));
ok('anafilático: banner broncho (SaO₂↓)',$('ban-broncho').classList.contains('show'));
window.setLabState({tonus:0.22,simpatico:0.12,vazamento:0.35,epi:0,broncho:0}); ok('neurogênico: NEUROGÊNICO + banner pérola',/NEUROGÊNICO/.test(txt('lab-vbig'))&&$('ban-neurogenico').classList.contains('show'),txt('lab-vbig'));
window.setLabState({tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0.85,broncho:0.8}); ok('+ adrenalina: banner 4 termos',$('ban-epi').classList.contains('show'));
window.setLabState({tonus:0.55,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8}); ok('+ α-puro: PAM ok mas banner α-incompleto (SaO₂↓)',$('ban-alpha').classList.contains('show'));
window.setLabState({tonus:0.25,simpatico:0.55,vazamento:0.2,epi:0,broncho:0}); ok('indeterminado: banner séptico (ponte M21)',$('ban-septico').classList.contains('show'));
window.setLabState({tonus:0.78,simpatico:0.45,vazamento:0,epi:0,broncho:0}); ok('normal: RESTAURADO / NORMAL',/NORMAL/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (sig+epi) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 22',/M[óo]dulo\s*22/.test(txt('kicker')));
ok('pontes 20/21/9',['perfunde20','perfunde21','perfunde9'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita mecanismo (FC/tônus/leak/broncho)',/(frequ|tônus|leak|broncho|simpát)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
// guarda de dose: o material é mecanismo, nunca posologia
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM comando posológico (iniciar/prescrever/titular X)', !/\b(inicie|iniciar|prescrev|titule|titular|administre|administrar)\s+\w*(adrenalin|noradrenalin|epinefrin)/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
