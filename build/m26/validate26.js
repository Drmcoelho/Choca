const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde26.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','cliff','markers','cliffLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iInsult','iReserve','iBeta',
 'presets','lab-veredito','opbox-cliff','opbox-markers','opbox-lab','lab-vbig',
 'caso-interativo','caso-prog','prever','prever-opts','prever-fb'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha expandida ≥9',doc.querySelectorAll('#panel-trilha .step').length>=9);
ok('Trilha com pistas progressivas',doc.querySelectorAll('#panel-trilha .pista').length>=4);
ok('nota de fisiologia (compensação→termo)',!!doc.querySelector('.pharm')&&/RVS|vasoconstri|extração/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('sem insulto: PAM normal (≈92)', near(ev('crypticFn({insult:0,reserve:0.8}).PAM'),92,2), ev('crypticFn({insult:0,reserve:0.8}).PAM').toFixed(0));
ok('A PAM MENTE: fica flat enquanto a reserva cobre', near(ev('crypticFn({insult:0.2,reserve:0.8}).PAM'),ev('crypticFn({insult:0.6,reserve:0.8}).PAM'),0.5) && ev('crypticFn({insult:0.6,reserve:0.8}).PAM')>=90);
ok('CRÍPTICO: PAM≥65 mas marcadores ruins (occult)', ev('occultFn(crypticFn({insult:0.55,reserve:0.85}))')===true && ev('crypticFn({insult:0.55,reserve:0.85}).PAM')>=65);
ok('lactato alto apesar da PAM normal', ev('crypticFn({insult:0.55,reserve:0.85}).lactate')>2);
ok('SvO₂ baixa / extração alta', ev('crypticFn({insult:0.55,reserve:0.85}).svo2')<0.55);
ok('pressão de pulso estreita', ev('crypticFn({insult:0.55,reserve:0.85}).pulsePressure')<38);
ok('marcadores pioram com o insulto', ev('crypticFn({insult:0.7,reserve:0.9}).lactate') > ev('crypticFn({insult:0.3,reserve:0.9}).lactate') && ev('crypticFn({insult:0.7,reserve:0.9}).svo2') < ev('crypticFn({insult:0.3,reserve:0.9}).svo2'));
ok('PRECIPÍCIO: insulto = reserva', near(ev('cliffInsultFn({reserve:0.5})'),0.5,1e-9));
ok('PAM despenca além do precipício', ev('crypticFn({insult:0.85,reserve:0.5}).PAM') < ev('crypticFn({insult:0.45,reserve:0.5}).PAM')-15);
ok('nearCliff: compensado mas reserva quase toda gasta', ev('nearCliffFn(crypticFn({insult:0.72,reserve:0.8}))')===true);
ok('estágios cobrem normal/críptico/precipício/descompensado', ev('stageFn({insult:0.05,reserve:0.8})')==='normal' && ev('stageFn({insult:0.45,reserve:0.9})')==='criptico' && ev('stageFn({insult:0.74,reserve:0.8})')==='precipicio' && ev('stageFn({insult:0.95,reserve:0.5})')==='descompensado');
ok('ARMADILHA: o estressor derruba a PAM', ev('crypticFn(applySedationFn({insult:0.7,reserve:0.6})).PAM') < ev('crypticFn({insult:0.7,reserve:0.6}).PAM'));
ok('β-bloqueio mascara a taquicardia', ev('crypticFn({insult:0.7,reserve:0.8,betaBlock:0.9}).HR') < ev('crypticFn({insult:0.7,reserve:0.8}).HR'));

console.log('\n— UI ≡ ENGINE —');
ok('readout precipício cita PAM/lactato/reserva/estágio', /PAM/.test($('opbox-cliff').innerHTML)&&/lactato/.test($('opbox-cliff').innerHTML)&&/reserva/.test($('opbox-cliff').innerHTML)&&/estágio/.test($('opbox-cliff').innerHTML));
ok('readout marcadores cita PP/enchimento/FC', /PP/.test($('opbox-markers').innerHTML)&&/capilar/.test($('opbox-markers').innerHTML)&&/FC/.test($('opbox-markers').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({insult:0.55,reserve:0.85}); ok('críptico: CHOQUE CRÍPTICO + banner cripto',/CRÍPTICO/.test(txt('lab-vbig'))&&$('ban-cripto').classList.contains('show'),txt('lab-vbig'));
ok('críptico: banner lactato + perfusão',$('ban-lactato').classList.contains('show')&&$('ban-perfusao').classList.contains('show'));
window.setLabState({insult:0.74,reserve:0.8}); ok('precipício: À BEIRA + banner precipício',/PRECIPÍCIO/.test(txt('lab-vbig'))&&$('ban-precipicio').classList.contains('show'),txt('lab-vbig'));
window.setLabState({insult:0.95,reserve:0.5}); ok('descompensado: DESCOMPENSADO',/DESCOMPENSADO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({insult:0.55,reserve:0.45,betaBlock:0.8}); ok('β-bloqueado: banner betabloq',$('ban-betabloq').classList.contains('show'));
window.setLabState({insult:0.05,reserve:0.85}); ok('normal: SEM CHOQUE',/SEM CHOQUE/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— INTERATIVO: caso com decisões —');
const dec=doc.querySelectorAll('#caso-interativo .decision');
ok('caso progressivo ≥3 decisões',dec.length>=3,dec.length);
ok('apenas a 1ª decisão visível no início', dec.length>1 && dec[0].style.display!=='none' && dec[1].style.display==='none');
const dec0=dec[0]?dec[0].querySelector('.dopts .opt'):null;
ok('decisão tem botões',!!dec0);
if(dec0){ dec0.dispatchEvent(new window.Event('click',{bubbles:true}));
  ok('responder revela consequência do motor', dec[0].querySelector('.dfb.show')!=null && /motor/.test(dec[0].querySelector('.dfb').textContent));
  ok('responder revela a próxima decisão', dec[1].style.display!=='none'); }

console.log('\n— INTERATIVO: prever-depois-revelar —');
const pbtns=doc.querySelectorAll('#prever-opts .opt');
ok('prever tem 3 opções (muito/pouco/nada)',pbtns.length===3);
ok('feedback começa oculto',!$('prever-fb').classList.contains('show'));
window.setLabState({insult:0.7,reserve:0.55});   // perto do precipício → estressor derruba "muito"
pbtns[0].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder revela a PAM pós-estressor', $('prever-fb').classList.contains('show') && /PAM/.test(txt('prever-fb')));
window.setLabState({insult:0.05,reserve:0.85}); ok('mudar o paciente re-arma a previsão', !$('prever-fb').classList.contains('show'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('banco ≥16',Array.isArray(T)&&T.length>=16,T?T.length:'∅');
ok('chips de dificuldade (crescente)',doc.querySelectorAll('#tutor .dif').length===(T?T.length:0) && !!doc.querySelector('#tutor .dif-a'));
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (cliff+markers) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 26',/M[óo]dulo\s*26/.test(txt('kicker')));
ok('pontes 8/9/13/14',['perfunde8','perfunde9','perfunde13','perfunde14'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita reserva/lactato/precipício/proxy',/(reserva|lactato|precipício|proxy|compensa)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(PAM|conduta|intubar|meta)/i.test(txt('disclaimer')));
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM meta de PAM prescrita', !/\bmeta\s+de\s+pam\s+(de|em|≥|>)\s*\d/i.test(html) && !/\bmanter\s+pam\s*[≥>]\s*\d/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
