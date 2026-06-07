const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde17.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 280;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotHeart','plotCOvol','plotHeartLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iPvr','iVol','iMap','iContr','lPvr','lVol','lMap','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE VD ≡ ÂNCORAS —');
const N='{pvr:1,vol:1,map:75,rvContr:1}';
ok('CO normal ≈ 5', near(ev('coFn('+N+')'),5.0,0.1));
ok('TEP (PVR3) derruba CO (<3,2)', ev('coFn({pvr:3,vol:1,map:65,rvContr:1})')<3.2, ev('coFn({pvr:3,vol:1,map:65,rvContr:1})').toFixed(2));
ok('reduzir RVP (3→1,5) sobe CO', ev('coFn({pvr:1.5,vol:1,map:75,rvContr:1})') > ev('coFn({pvr:3,vol:1,map:75,rvContr:1})'));
ok('septo desvia no VD dilatado', ev('septalShiftFn({pvr:3,vol:1,map:75,rvContr:1})')>0.2);
ok('sem desvio no normal', near(ev('septalShiftFn('+N+')'),0,1e-9));
ok('PARADOXO: volume 1,7 < volume 1,0 (PVR3)', ev('coFn({pvr:3,vol:1.7,map:65,rvContr:1})') < ev('coFn({pvr:3,vol:1.0,map:65,rvContr:1})'));
ok('MAP baixa reduz contratilidade efetiva', ev('rvEffContrFn(1,50)') < ev('rvEffContrFn(1,80)'));
ok('RESGATE: MAP 80 > MAP 50 (PVR3,vol1.2)', ev('coFn({pvr:3,vol:1.2,map:80,rvContr:1})') > ev('coFn({pvr:3,vol:1.2,map:50,rvContr:1})'));
ok('espiral sinalizada (PVR3,MAP50)', ev('spiralFn({pvr:3,vol:1.2,map:50,rvContr:1})')===true);
ok('VE subenche apesar de normal (interdependência)', ev('lvFillFn({pvr:3,vol:1,map:65,rvContr:1})')<0.5);

console.log('\n— UI ≡ ENGINE —');
ok('readout coração cita desvio septal/enchimento VE', /desvio septal/.test($('opbox-heart').innerHTML)&&/enchimento VE/.test($('opbox-heart').innerHTML));
ok('readout CO×volume cita o pico (paradoxo)', /pico de CO/.test($('opbox-covol').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLab({pvr:3,vol:1,map:65,rvContr:1}); ok('TEP: falência VD + banner pós-carga',/FALÊNCIA DE VD|ESPIRAL|INTERDEP/.test(txt('lab-vbig'))&&$('ban-afterload').classList.contains('show'),txt('lab-vbig'));
window.setLab({pvr:2.4,vol:1.8,map:65,rvContr:1}); ok('volume demais: banner paradoxo',$('ban-volume').classList.contains('show'));
window.setLab({pvr:3,vol:1.2,map:50,rvContr:1}); ok('espiral: veredito ESPIRAL + banner pressor',/ESPIRAL/.test(txt('lab-vbig'))&&$('ban-pressor').classList.contains('show'),txt('lab-vbig'));
window.setLab({pvr:1,vol:1,map:75,rvContr:1}); ok('normal: VD COMPENSADO',/COMPENSADO/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (heart+covol) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito do tutor espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 17',/M[óo]dulo\s*17/.test(txt('kicker')));
ok('pontes 16/19/24',['perfunde16','perfunde19','perfunde24'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita interdependência/RVP', /(interdepend|RVP|s[ée]rie|paralelo)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
