const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde27.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 300;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','radar','levers','radarLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iVolume','iPump','iTone',
 'presets','lab-veredito','opbox-radar','opbox-levers','opbox-lab','lab-vbig',
 'caso-interativo','caso-prog','prever','prever-opts','prever-fb'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha expandida ≥9',doc.querySelectorAll('#panel-trilha .step').length>=9);
ok('Trilha com pistas progressivas',doc.querySelectorAll('#panel-trilha .pista').length>=4);
ok('nota de alavancas (intervenção→termo)',!!doc.querySelector('.pharm')&&/volume|inotrópico|pré-carga/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const A='{volume:0.7,pump:0.8}', B='{volume:1.3,pump:0.75}', L='{volume:0.2,pump:0.75}', C='{volume:0.9,pump:0.25}';
ok('A = quente-seco', ev('profileFn('+A+')')==='A' && ev('radarFn('+A+').warm')===true && ev('radarFn('+A+').wet')===false);
ok('B = quente-úmido', ev('profileFn('+B+')')==='B' && ev('radarFn('+B+').warm')===true && ev('radarFn('+B+').wet')===true);
ok('L = frio-seco', ev('profileFn('+L+')')==='L' && ev('radarFn('+L+').warm')===false && ev('radarFn('+L+').wet')===false);
ok('C = frio-úmido', ev('profileFn('+C+')')==='C' && ev('radarFn('+C+').warm')===false && ev('radarFn('+C+').wet')===true);
ok('os 4 perfis são alcançáveis', ['A','B','L','C'].every(function(q){ return [A,B,L,C].some(function(s){return ev('profileFn('+s+')')===q;}); }));
ok('PERFUSÃO É FLUXO: frio com PA normal', ev('radarFn({volume:0.25,pump:0.7,tone:0.95}).warm')===false && ev('radarFn({volume:0.25,pump:0.7,tone:0.95}).map')>=90);
ok('a RVS sobe a PA sem esquentar a perfusão', ev('radarFn({volume:0.25,pump:0.7,tone:0.95}).map')>ev('radarFn({volume:0.25,pump:0.7,tone:0.1}).map') && ev('radarFn({volume:0.25,pump:0.7,tone:0.95}).perfusion')===ev('radarFn({volume:0.25,pump:0.7,tone:0.1}).perfusion'));
ok('bomba fraca congestiona mais', ev('radarFn({volume:0.9,pump:0.25}).congestion') > ev('radarFn({volume:0.9,pump:0.85}).congestion'));
ok('VOLUME no L: sobe o débito (tira do frio)', ev('leverEffectFn('+L+',applyVolumeFn).dCO')>1 && ev('leverEffectFn('+L+',applyVolumeFn).profTo')!=='L');
ok('VOLUME no C: AFOGA (congestão↑, pouco débito)', ev('leverEffectFn('+C+',applyVolumeFn).dCong')>0.3 && ev('leverEffectFn('+C+',applyVolumeFn).dCO')<1);
ok('o volume tem efeito OPOSTO em L vs C', ev('leverEffectFn('+L+',applyVolumeFn).dCO') > ev('leverEffectFn('+C+',applyVolumeFn).dCO') && ev('leverEffectFn('+C+',applyVolumeFn).dCong') > ev('leverEffectFn('+L+',applyVolumeFn).dCong'));
ok('INOTRÓPICO tira o C do canto (débito↑, congestão↓)', ev('leverEffectFn('+C+',applyInotropeFn).dCO')>0.5 && ev('leverEffectFn('+C+',applyInotropeFn).dCong')<0 && ev('leverEffectFn('+C+',applyInotropeFn).profTo')!=='C');
ok('hipóteses por perfil (cardiogênico no C, hipovolêmico no L)', /cardiog/i.test(ev('hypothesesFn("C").join(" ")')) && /hipovol/i.test(ev('hypothesesFn("L").join(" ")')));

console.log('\n— UI ≡ ENGINE —');
ok('readout radar cita perfil/perfusão/congestão', /perfil/.test($('opbox-radar').innerHTML)&&/perfusão/.test($('opbox-radar').innerHTML)&&/congestão/.test($('opbox-radar').innerHTML));
ok('readout alavancas cita volume/inotrópico/ΔDC', /volume/.test($('opbox-levers').innerHTML)&&/inotrópico/.test($('opbox-levers').innerHTML)&&/ΔDC/.test($('opbox-levers').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({volume:0.9,pump:0.25,tone:0.7}); ok('C: FRIO-ÚMIDO + banners frio/úmido/inotropo',/FRIO-ÚMIDO/.test(txt('lab-vbig'))&&$('ban-frio').classList.contains('show')&&$('ban-umido').classList.contains('show')&&$('ban-inotropo').classList.contains('show'),txt('lab-vbig'));
window.setLabState({volume:0.2,pump:0.75,tone:0.6}); ok('L: FRIO-SECO',/FRIO-SECO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({volume:0.25,pump:0.7,tone:0.95}); ok('frio com PA normal: banner PA engana',$('ban-pa-engana').classList.contains('show'));
window.setLabState({volume:1.3,pump:0.75,tone:0.5}); ok('B: QUENTE-ÚMIDO',/QUENTE-ÚMIDO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({volume:0.7,pump:0.8,tone:0.5}); ok('A: QUENTE-SECO + banner hipótese sempre',/QUENTE-SECO/.test(txt('lab-vbig'))&&$('ban-hipotese').classList.contains('show'),txt('lab-vbig'));

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
ok('prever tem 3 opções',pbtns.length===3);
ok('feedback começa oculto',!$('prever-fb').classList.contains('show'));
window.setLabState({volume:0.9,pump:0.25,tone:0.7});   // C: volume afoga
pbtns[2].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder revela o efeito do volume (ΔDC/Δcong)', $('prever-fb').classList.contains('show') && /Δcongest/.test(txt('prever-fb')));
window.setLabState({volume:0.7,pump:0.8,tone:0.5}); ok('mudar o paciente re-arma a previsão', !$('prever-fb').classList.contains('show'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('banco ≥16',Array.isArray(T)&&T.length>=16,T?T.length:'∅');
ok('chips de dificuldade (crescente)',doc.querySelectorAll('#tutor .dif').length===(T?T.length:0) && !!doc.querySelector('#tutor .dif-a'));
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (radar+levers) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA SaMD —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 27',/M[óo]dulo\s*27/.test(txt('kicker')));
ok('pontes 9/14/16/20',['perfunde9','perfunde14','perfunde16','perfunde20'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita perfusão/congestão/hipóteses',/(perfus|congest|hipótese|mapa)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(diagnóstico|fluido|conduta|droga)/i.test(txt('disclaimer')));
ok('SEM padrão de dose (mg/mcg/µg/mL·h⁻¹)', !/\b\d+(?:[.,]\d+)?\s*(mg|mcg|µg|ug)\b/i.test(html) && !/\b\d+(?:[.,]\d+)?\s*ml\s*\/\s*h\b/i.test(html));
ok('SEM volume/dose prescrita', !/bolus\s+de\s+\d/i.test(html) && !/\b\d+\s*ml\/kg/i.test(html));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
