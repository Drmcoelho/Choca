const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde9.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 350;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotPAM','plotPAMLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iDc','iRvs','iPvc','lDc','lRvs','presets','lab-veredito','chip-perfil','chip-fluxo'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE (a inversão) ≡ ÂNCORAS —');
ok('round-trip pam(rvsForPam)=pam', near(ev('pamFn(6, rvsForPamFn(80,6,5), 5)'),80,1e-9));
ok('mesma PAM 65: quente(DC8) e frio(DC3,2)', near(ev('pamFn(8, rvsForPamFn(65,8,5), 5)'),65,1e-9) && near(ev('pamFn(3.2, rvsForPamFn(65,3.2,5), 5)'),65,1e-9));
ok('quente RVS<800', ev('rvsForPamFn(65,8,5)')<800, ev('rvsForPamFn(65,8,5)').toFixed(0));
ok('frio RVS>1200', ev('rvsForPamFn(65,3.2,5)')>1200, ev('rvsForPamFn(65,3.2,5)').toFixed(0));
ok('hipérbole: RVS cai quando DC sobe (iso-PAM)', ev('rvsForPamFn(65,8,5)') < ev('rvsForPamFn(65,3.2,5)'));
ok('↑DC→PAM sobe; ↑RVS→PAM sobe', ev('pamFn(7,1000,5)')>ev('pamFn(4,1000,5)') && ev('pamFn(5,1400,5)')>ev('pamFn(5,900,5)'));
ok('perfil: RVS baixa=quente, alta=frio', ev('profileFn(8,600).temp')==='quente' && ev('profileFn(3.2,1500).temp')==='frio');
ok('críptico: PAM≥65 e DC<3,5', ev('crypticoFn(3.0, rvsForPamFn(90,3.0,5), 5)')===true && ev('crypticoFn(6.0, rvsForPamFn(90,6.0,5), 5)')===false);

console.log('\n— UI ≡ ENGINE + chips —');
ok('readout decompõe PAM=PVC+DC×RVS/80', /PAM <b>/.test($('opbox-instr').innerHTML)&&/RVS/.test($('opbox-instr').innerHTML));
ok('chips de perfil e fluxo', /tônus:/.test(txt('chip-perfil'))&&/fluxo:/.test(txt('chip-fluxo')));

console.log('\n— LAB · perfil + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5);
window.setLabState({dc:8,rvs:600,pvc:5}); ok('distributivo: QUENTE + banner quente + inversão',/QUENTE/.test(txt('lab-vbig'))&&$('ban-quente').classList.contains('show')&&$('ban-inversao').classList.contains('show'),txt('lab-vbig'));
window.setLabState({dc:3.2,rvs:1300,pvc:5}); ok('cardiogênico: FRIO + banner frio',/FRIO/.test(txt('lab-vbig'))&&$('ban-frio').classList.contains('show'),txt('lab-vbig'));
window.setLabState({dc:3.0,rvs:2267,pvc:5}); ok('críptico: veredito crit + banner críptico',$('lab-veredito').classList.contains('crit')&&$('ban-criptico').classList.contains('show')&&/CR[IÍ]PTICO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({dc:5.5,rvs:1160,pvc:5}); ok('normal: PERFIL NEUTRO',/NEUTRO/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 9',/M[óo]dulo\s*9/.test(txt('kicker')));
ok('pontes 26/27/28',['perfunde26','perfunde27','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita macrocirculatório/RVS derivada',/(macrocirculat|derivad)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
