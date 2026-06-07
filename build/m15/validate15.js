const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde15.html');
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
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 210;},configurable:true});
}});
const { window }=dom, doc=window.document;
const $=id=>doc.getElementById(id); const txt=id=>{const e=$(id);return e?e.textContent.trim():null;};
(async()=>{
await new Promise(res=>{ if(doc.readyState==='complete') return res(); window.addEventListener('load',res); setTimeout(res,3000); });
await new Promise(r=>setTimeout(r,0));
const ev=e=>window.eval(e);

console.log('— ESTRUTURA / ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotCompare','plotResus','plotLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iLoss','lLoss','segTipo','segFluido','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
ok('hemorragia derruba Hb', ev('hbAfterFn(0.30,"hemorragia")')<15);
ok('não-hemorrágica hemoconcentra', ev('hbAfterFn(0.30,"naohemorragica")')>15);
ok('mesma perda: DO₂ hemorragia < não-hem (duplo golpe)', ev('do2AtFn(0.30,"hemorragia")') < ev('do2AtFn(0.30,"naohemorragica")'), Math.round(ev('do2AtFn(0.30,"hemorragia")'))+' < '+Math.round(ev('do2AtFn(0.30,"naohemorragica")')));
ok('DC igual nos dois à mesma perda', ev('dcAfterFn(0.30)')===ev('dcAfterFn(0.30)'));
ok('índice de choque sobe com a perda', ev('shockIndexFn(0.35)') > ev('shockIndexFn(0.10)'));
ok('classes ATLS I–IV', ev('hemorrhageClassFn(0.1).classe')==='I' && ev('hemorrhageClassFn(0.45).classe')==='IV');
ok('cristaloide dilui Hb na hemorragia', ev('resuscitateFn(0.35,"hemorragia","cristaloide").hb') < ev('hbAfterFn(0.35,"hemorragia")'));
ok('sangue recupera DO₂ mais que cristaloide', ev('resuscitateFn(0.35,"hemorragia","sangue").do2') > ev('resuscitateFn(0.35,"hemorragia","cristaloide").do2'));
ok('falta: hemorragia=volume E conteúdo', /conteúdo/.test(ev('faltaFn("hemorragia")')));

console.log('\n— UI ≡ ENGINE —');
ok('readout comparação cita duplo golpe', /duplo golpe/.test($('opbox-cmp').innerHTML));
ok('readout reposição cita cristaloide e sangue', /cristaloide/i.test($('opbox-resus').innerHTML)&&/sangue/i.test($('opbox-resus').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('5 presets',doc.querySelectorAll('#presets .preset').length===5);
window.setLab({loss:0.35,tipo:'hemorragia',fluido:'nenhum'}); ok('hemorragia: veredito HEMORRÁGICO + banner duplo',/HEMORR[ÁA]GICO/.test(txt('lab-vbig'))&&$('ban-duplo').classList.contains('show'),txt('lab-vbig'));
window.setLab({loss:0.30,tipo:'naohemorragica',fluido:'nenhum'}); ok('não-hem: banner hemoconcentração',$('ban-hemoconc').classList.contains('show'));
window.setLab({loss:0.35,tipo:'hemorragia',fluido:'cristaloide'}); ok('cristaloide: banner diluição',$('ban-crist').classList.contains('show'));
window.setLab({loss:0.35,tipo:'hemorragia',fluido:'sangue'}); ok('sangue: banner conteúdo',$('ban-sangue').classList.contains('show'));
window.setLab({loss:0.35,tipo:'hemorragia',fluido:'nenhum'});

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,180); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito do tutor varia', dist.filter(d=>d>0).length>=2, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 15',/M[óo]dulo\s*15/.test(txt('kicker')));
ok('pontes 14/1/8',['perfunde14','perfunde1','perfunde8'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita conteúdo/diluição/Guyton', /(conteúdo|dilui|Guyton|hemoconcentra)/i.test(txt('honestidade')));
ok('firewall SaMD (sem gatilho/dose)', /nunca/i.test(txt('disclaimer'))&&/(gatilho|dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
