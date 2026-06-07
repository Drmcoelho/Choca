const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde10.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 300;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotWave','plotThermo','plotWaveLab',
 'opbox-wave','opbox-thermo','opbox-lab','panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iLevel','iZeta','iFn','iVinj','iTinj','lLevel','lZeta','lFn','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('offset 14cm abaixo ≈ +10,3',near(ev('levelOffsetFn(-14)'),10.3,0.1),ev('levelOffsetFn(-14)').toFixed(2));
const sub='measuredFn({sbp:120,dbp:80,hr:75,zeta:0.12,fn:13,levelCm:0})';
ok('SUBamortecido: SBP medida > verdadeira',ev(sub+'.sbpMeas')>ev(sub+'.sbpTrue')+5,ev(sub+'.sbpMeas').toFixed(0)+'>'+ev(sub+'.sbpTrue').toFixed(0));
ok('SUBamortecido: PAM ≈ verdadeira (±3)',near(ev(sub+'.mapMeas'),ev(sub+'.mapTrue'),3),ev(sub+'.mapMeas').toFixed(1)+'/'+ev(sub+'.mapTrue').toFixed(1));
const sup='measuredFn({sbp:120,dbp:80,hr:75,zeta:1.1,fn:7,levelCm:0})';
ok('SUPERamortecido: SBP medida < verdadeira',ev(sup+'.sbpMeas')<ev(sup+'.sbpTrue')-5,ev(sup+'.sbpMeas').toFixed(0)+'<'+ev(sup+'.sbpTrue').toFixed(0));
const lvl='measuredFn({sbp:120,dbp:80,hr:75,zeta:0.55,fn:22,levelCm:-14})';
ok('mal-zerado: PAM medida desloca ~+10',near(ev(lvl+'.mapMeas')-ev(lvl+'.mapTrue'),10.3,0.7),(ev(lvl+'.mapMeas')-ev(lvl+'.mapTrue')).toFixed(1));
ok('veredito confiável ok',ev('vereditoFn(measuredFn({sbp:120,dbp:80,hr:75,zeta:0.55,fn:22,levelCm:0})).ok')===true);
ok('termo nominal → CO_comp = CO_true',near(ev('coCompFn(5,10,4,10,4,37)'),5,1e-9));
ok('termo volume parcial 7/10 → CO ALTO',ev('coCompFn(5,7,4,10,4,37)')>5.1,ev('coCompFn(5,7,4,10,4,37)').toFixed(2));
ok('termo injetado quente → CO ALTO',ev('coCompFn(5,10,14,10,4,37)')>5.1,ev('coCompFn(5,10,14,10,4,37)').toFixed(2));
ok('fast-flush subamortecido gera ≥2 picos',ev('fastFlushFn({sbp:120,dbp:80,hr:75,zeta:0.2,fn:18}).peaks.length')>=2,ev('fastFlushFn({sbp:120,dbp:80,hr:75,zeta:0.2,fn:18}).peaks.length'));

console.log('\n— UI ≡ ENGINE (default confiável) —');
ok('readout traçado mostra Monitor + PAM',/Monitor/.test($('opbox-wave').innerHTML)&&/PAM/.test($('opbox-wave').innerHTML),txt('opbox-wave'));
ok('readout termo: DC computado fiel',/DC computado <b>5,0/.test($('opbox-thermo').innerHTML)&&/fiel/.test($('opbox-thermo').innerHTML),txt('opbox-thermo'));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5,doc.querySelectorAll('#presets .preset').length);
window.setLabState({levelCm:0,zeta:0.55,fn:22}); ok('confiável = OK',$('lab-veredito').classList.contains('ok')&&/CONFI[ÁA]VEL/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({levelCm:-12,zeta:0.55,fn:22}); ok('mal-zerado = CRÍTICO + banner zero (sem sub falso)',$('lab-veredito').classList.contains('crit')&&$('ban-zero').classList.contains('show')&&!$('ban-sub').classList.contains('show'),txt('lab-vbig'));
window.setLabState({levelCm:0,zeta:0.12,fn:13}); ok('subamortecido = banner sub + banner PAM-ok',$('ban-sub').classList.contains('show')&&$('ban-mapok').classList.contains('show'));
window.setLabState({levelCm:0,zeta:1.1,fn:7}); ok('superamortecido = banner super',$('ban-super').classList.contains('show'));
window.setLabState({levelCm:0,zeta:0.55,fn:22});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('TUTOR ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('todas 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
ok('mistura de tipos (wave+flush+thermo)',['wave','flush','thermo'].every(k=>(T||[]).some(q=>q.kind===k)));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,820,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('todo draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 10',/M[óo]dulo\s*10/.test(txt('kicker')));
ok('pontes 9/11/5',['perfunde9','perfunde11','perfunde5'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade: termodiluição + procedimento',/termodilui/i.test(txt('honestidade'))&&/(linha arterial|rationale|manual)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|manual)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
