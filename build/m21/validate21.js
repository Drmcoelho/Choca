const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'perfunde21.html');
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
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','cascade','plotInterv','cascadeLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','iCo','iRvs','iShunt','iGlyco','iMito','iDem','presets','lab-veredito'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-surviving','tab-avaliacao'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha ≥6',doc.querySelectorAll('#panel-trilha .step').length>=6);

console.log('— ABA SURVIVING SEPSIS (diretriz sobre o motor) —');
ok('#panel-surviving',!!$('panel-surviving'));
ok('#ssc-framing + #ssc-bundle + #ssc-ladder',!!$('ssc-framing')&&!!$('ssc-bundle')&&!!$('ssc-ladder'));
ok('bundle ancorado ao termo (≥5 itens)',doc.querySelectorAll('#ssc-bundle .ssc-item').length>=5);
ok('bundle cobre antibiótico, lactato, fluido, vasopressor, fonte',(function(){var h=$('ssc-bundle').innerHTML;return /antibi[óo]tico/i.test(h)&&/lactato/i.test(h)&&/fluido/i.test(h)&&/vasopressor/i.test(h)&&/fonte/i.test(h);})());
ok('escada SSC: nora 1ª linha + vaso/adrenalina adjuvantes + dobutamina (disfunção cardíaca)',(function(){var h=$('ssc-ladder').innerHTML;return /noradrenalina/i.test(h)&&/1[ªa]\s*linha/i.test(h)&&/vasopressina/i.test(h)&&/adrenalina/i.test(h)&&/dobutamina/i.test(h);})());
ok('escada ancora ao SSC 2021',/2021/.test($('panel-surviving').textContent));
ok('escada liga aos submódulos do atlas (28B/28C/28E)',['perfunde28b','perfunde28c','perfunde28e'].every(h=>$('ssc-ladder').innerHTML.includes(h)));
ok('Surviving é DIRETRIZ EDUCACIONAL (não prescrição, confira protocolo)',/diretriz educacional/i.test($('ssc-framing').innerHTML)&&/n[ãa]o é prescri/i.test($('ssc-framing').innerHTML)&&/protocolo da sua institui/i.test($('ssc-framing').innerHTML));
ok('Surviving mantém o paradoxo: normalizar a macro não fecha o déficit',/normalizar a/i.test($('panel-surviving').textContent)&&/n[ãa]o\s+fecha/i.test($('panel-surviving').textContent));
window.activateTab('tab-surviving'); ok('troca aba ativa Surviving',$('panel-surviving').classList.contains('active')); window.activateTab('tab-instrumento');
ok('Surviving SEM ordem imperativa individualizada',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente\b/i.test($('panel-surviving').innerHTML));
ok('nota de farmacologia (receptor→termo)',!!doc.querySelector('.pharm')&&/α1/.test(doc.querySelector('.pharm').textContent));
window.activateTab('tab-lab'); ok('troca aba ativa Lab',$('panel-lab').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE ≡ ÂNCORAS —');
const SEP='{co:7,hb:13,rvsWood:9,shunt:0.5,glyco:0.6,mito:0.6,demand:280}';
const NORM='{co:5,hb:14,rvsWood:16,shunt:0.05,glyco:1,mito:1,demand:250}';
ok('DO₂ macro alta no séptico (≥1000)', ev('macroDO2Fn(7,13)')>=1000);
ok('déficit > 0 no séptico apesar da macro', ev('deficitFn('+SEP+')')>0);
ok('PARADOXO: SvO₂ alta (>0,74) + déficit', ev('svo2Fn('+SEP+')')>0.74 && ev('deficitFn('+SEP+')')>0, 'SvO₂ '+(ev('svo2Fn('+SEP+')')*100).toFixed(0)+'%');
ok('paradoxo sinalizado', ev('paradoxoFn('+SEP+')')===true);
ok('extração baixa no séptico (<0,25)', ev('o2erFn('+SEP+')')<0.25);
ok('normal: sem déficit, SvO₂ ~70%', ev('deficitFn('+NORM+')')===0 && Math.abs(ev('svo2Fn('+NORM+')')-0.71)<0.03);
ok('pressor sobe a MAP', ev('mapFn(7,16)') > ev('mapFn(7,9)'));
ok('pressor NÃO muda o déficit', near(ev('deficitFn(applyPressorFn('+SEP+'))'), ev('deficitFn('+SEP+')'), 1e-9));
ok('recrutar micro REDUZ o déficit', ev('deficitFn(applyMicroFn('+SEP+'))') < ev('deficitFn('+SEP+')'));
ok('recuperar mito REDUZ o déficit', ev('deficitFn(applyMitoFn('+SEP+'))') < ev('deficitFn('+SEP+')'));
ok('contraste: hemorrágico tem SvO₂ baixa', ev('svo2Fn({co:3,hb:9,rvsWood:22,shunt:0.05,glyco:1,mito:1,demand:250})') < 0.55);

console.log('\n— UI ≡ ENGINE —');
ok('readout cascata cita SvO₂/déficit/lactato/paradoxo', /SvO₂/.test($('opbox-casc').innerHTML)&&/déficit/.test($('opbox-casc').innerHTML)&&/PARADOXO/.test($('opbox-casc').innerHTML));
ok('readout intervenções: pressor ≈ inalterado vs micro fecha', /pressor/.test($('opbox-interv').innerHTML)&&/micro/.test($('opbox-interv').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({co:7,hb:13,rvsWood:9,shunt:0.5,glyco:0.6,mito:0.6,demand:280}); ok('séptico: PARADOXO + banner paradoxo',/PARADOXO/.test(txt('lab-vbig'))&&$('ban-paradoxo').classList.contains('show'),txt('lab-vbig'));
window.setLabState({co:7,hb:13,rvsWood:16,shunt:0.5,glyco:0.6,mito:0.6,demand:280}); ok('+ pressor: déficit persiste + banner pressor',$('ban-pressor').classList.contains('show'));
window.setLabState({co:7,hb:13,rvsWood:9,shunt:0.12,glyco:0.92,mito:0.6,demand:280}); ok('+ recrutar micro: déficit cai',ev('deficitFn(window.__state)') < 30);
window.setLabState({co:3,hb:9,rvsWood:22,shunt:0.05,glyco:1,mito:1,demand:250}); ok('hemorrágico: banner contraste (SvO₂ baixa)',$('ban-contraste').classList.contains('show'));
window.setLabState({co:5,hb:14,rvsWood:16,shunt:0.05,glyco:1,mito:1,demand:250}); ok('normal: TECIDO PERFUNDIDO',/PERFUNDIDO/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— TUTOR —');
const T=window.TUTOR;
ok('tutor ≥10',Array.isArray(T)&&T.length>=10,T?T.length:'∅');
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
ok('canvases no DOM',doc.querySelectorAll('#tutor .qplot').length===(T?T.length:0));
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,190); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() (casc+interv) sem lançar',drew,threw||'ok');
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('gabarito espalhado (≥3 letras)', dist.filter(d=>d>0).length>=3, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);

console.log('\n— CROMO + GUARDA —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 21',/M[óo]dulo\s*21/.test(txt('kicker')));
ok('pontes 20/12/13',['perfunde20','perfunde12','perfunde13'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));
ok('honestidade cita micro/mito/macro',/(micro|mitoc|macro|desacopl)/i.test(txt('honestidade')));
ok('firewall SaMD',/nunca/i.test(txt('disclaimer'))&&/(dose|conduta)/i.test(txt('disclaimer')));
var __ded=String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105);
ok('SEM dedicatória (guarda)',html.toLowerCase().indexOf(__ded.toLowerCase())===-1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
