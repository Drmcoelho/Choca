const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde3.html');
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
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotDC','plotDCLab','sub-dc',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iFc','iVs','lFc','lVs','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE DC ≡ ÂNCORAS —');
ok('dc(70,70)=4,9',near(ev('dcFn(70,70)'),4.9,1e-9),ev('dcFn(70,70)').toFixed(2));
ok('diástole(70)≈0,557',near(ev('diastoleFn(70)'),0.557,0.005),ev('diastoleFn(70)').toFixed(3));
ok('VS cai com FC (130<70)',ev('svAchievedFn(130,85)')<ev('svAchievedFn(70,85)'));
ok('DC repouso(70)≈5,0',near(ev('dcAtFn(70,85)'),5.0,0.2),ev('dcAtFn(70,85)').toFixed(2));
ok('DC(95)>DC(70)',ev('dcAtFn(95,85)')>ev('dcAtFn(70,85)'));
ok('DC(130)<DC(70) — taquicardia engana',ev('dcAtFn(130,85)')<ev('dcAtFn(70,85)'),ev('dcAtFn(130,85)').toFixed(2)+'<'+ev('dcAtFn(70,85)').toFixed(2));
const pk=ev('peakFCFn(85)');
ok('pico FC 85–115',pk.fc>=85&&pk.fc<=115,'FC '+pk.fc);
ok('VSbasal↑ sobe o pico',ev('peakFCFn(105)').dc>pk.dc);

console.log('\n— UI ≡ ENGINE (default FC70/VS85) —');
ok('readout DC ≈ 5,0',/DC <b>5,0/.test($('opbox-instr').innerHTML)||/DC <b>4,9/.test($('opbox-instr').innerHTML),txt('opbox-instr'));
ok('identidade mostra VS atingido',/VS atingido/.test($('sub-dc').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5);
window.setLabState({fc:70,vs:85}); ok('repouso=SUSTENTADO',$('lab-veredito').classList.contains('ok')&&/SUSTENTADO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({fc:135,vs:80}); ok('taqui: banner teto + engana',$('ban-teto').classList.contains('show')&&$('ban-engana').classList.contains('show'),txt('lab-vbig'));
window.setLabState({fc:60,vs:85}); ok('FC60: banner reserva',$('ban-reserva').classList.contains('show'));
window.setLabState({fc:45,vs:95}); ok('bradi: banner bradicardia',$('ban-bradi').classList.contains('show'));
window.setLabState({fc:70,vs:85});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,230); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 3',/M[óo]dulo\s*3/.test(txt('kicker')));
ok('pontes 4/6/16',['perfunde4','perfunde6','perfunde16'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade + farmacologia(cronotrop)',/cronotr/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
