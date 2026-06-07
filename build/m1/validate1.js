const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'..','..','perfunde1.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','plotCa','plotCaLab','sub-ca',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao',
 'iHb','iSat','iPao2','lHb','lSat','lPao2','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso ativo',$('panel-caso').classList.contains('active'));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5,doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6,doc.querySelectorAll('#panel-trilha .step').length);
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-caso');

console.log('\n— ENGINE CaO₂ ≡ ÂNCORAS —');
ok('ca(15,1,100)≈20,4',near(ev('caFn(15,1,100)'),20.4,1e-6),ev('caFn(15,1,100)').toFixed(2));
ok('ligado(15,100%)≈20,1',near(ev('caO2Fn(15,1,100).ligado'),20.1,1e-6),ev('caO2Fn(15,1,100).ligado').toFixed(2));
ok('semente ca(10.7,0.96,70)≈14,0',near(ev('caFn(10.7,0.96,70)'),14.0,0.2),ev('caFn(10.7,0.96,70)').toFixed(2));
ok('SaO₂ em % ≡ fração',near(ev('caFn(15,100,100)'),ev('caFn(15,1,100)'),1e-9));
ok('dissolvido normal <2%',ev('fracFn(15,1,100)')<0.02,(ev('fracFn(15,1,100)')*100).toFixed(2)+'%');
ok('hiperóxia dissolvido <8%',ev('fracFn(15,1,500)')<0.08,(ev('fracFn(15,1,500)')*100).toFixed(2)+'%');
ok('multiplicativo: ½Hb ≡ ½SaO₂ (ligado)',near(ev('caO2Fn(7.5,1,100).ligado'),ev('caO2Fn(15,0.5,100).ligado'),1e-9));
ok('CaO₂ sobe com Hb',ev('caFn(16,0.96,90)')>ev('caFn(8,0.96,90)'));
ok('CaO₂ sobe com SaO₂',ev('caFn(12,0.98,90)')>ev('caFn(12,0.80,90)'));
ok('DO₂ normal ≈ 1020',near(ev('do2AtFn(15,1,100)'),1020,1),ev('do2AtFn(15,1,100)').toFixed(0));
ok('normal → adequada',ev("vereditoFn(do2AtFn(15,1,100))")==='adequada');
ok('semente → limitrofe',ev("vereditoFn(do2AtFn(10.7,0.96,70))")==='limitrofe');
ok('anemia grave+hipoxemia → critica',ev("vereditoFn(do2AtFn(6,0.80,55))")==='critica');

console.log('\n— UI ≡ ENGINE (default Hb15/SaO₂98/PaO₂95) —');
ok('readout CaO₂ ≈ 20',/CaO₂ <b>(19|20)/.test($('opbox-instr').innerHTML),txt('opbox-instr'));
ok('substituição mostra 1,34',/1,34/.test($('sub-ca').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6,doc.querySelectorAll('#presets .preset').length);
window.setLabState({hb:15,sat:98,pao2:95}); ok('normal=ADEQUADA',$('lab-veredito').classList.contains('ok')&&/ADEQUADA/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({hb:10.7,sat:96,pao2:70}); ok('semente=LIMÍTROFE + banner semente',$('lab-veredito').classList.contains('lim')&&$('ban-semente').classList.contains('show'),txt('lab-vbig'));
window.setLabState({hb:7.5,sat:98,pao2:95}); ok('anemia isolada: banner anemia',$('ban-anemia').classList.contains('show'));
window.setLabState({hb:7,sat:82,pao2:52}); ok('dupla quebra: CRÍTICA + banner multiplica',$('lab-veredito').classList.contains('crit')&&$('ban-multiplica').classList.contains('show'),txt('lab-vbig'));
window.setLabState({hb:15,sat:100,pao2:450}); ok('hiperóxia: banner hiperóxia',$('ban-hiperoxia').classList.contains('show'));
window.setLabState({hb:15,sat:98,pao2:95});

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
ok('kicker Módulo 1',/M[óo]dulo\s*1/.test(txt('kicker')));
ok('pontes mvp2/8/15',['mvp2-interativo','perfunde8','perfunde15'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade + procedimento(transfusão)',/transfus/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta|gatilho)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
