const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde28.html');
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

console.log('— ESTRUTURA / ABAS (6, com Farmácia) —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score','receptors','outcome','outcomeLab',
 'panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao','panel-farmacologia',
 'iA1','iB1','iB2','iV1','iPDE','presets','lab-veredito','opbox-receptors','opbox-outcome','opbox-lab','lab-vbig',
 'caso-interativo','caso-prog','prever','prever-opts','prever-fb',
 'farm-aviso','farm-agentes','iWeight','iDose','farm-out','farm-faixa','farm-titulacao','farm-diluicoes','farm-combos','farm-interacoes','farm-usos','farm-iatro'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao','tab-farmacologia'].forEach(t=>ok('aba '+t,!!$(t)));
ok('Caso 5 atos',doc.querySelectorAll('#panel-caso .ato').length===5);
ok('Trilha expandida ≥9',doc.querySelectorAll('#panel-trilha .step').length>=9);
ok('Trilha com pistas progressivas',doc.querySelectorAll('#panel-trilha .pista').length>=4);
window.activateTab('tab-farmacologia'); ok('troca aba ativa Farmácia',$('panel-farmacologia').classList.contains('active')); window.activateTab('tab-instrumento');

console.log('\n— ENGINE MECANISMO ≡ ÂNCORAS —');
ok('α1 → RVS (vasopressor)', ev('termsFn({a1:1}).dRVS')>5 && ev('termsFn({a1:1}).dInotropy')<0.05 && ev('dominantTermFn({a1:1})')==='rvs');
ok('β1 → contratilidade + FC', ev('termsFn({b1:1}).dInotropy')>0.3 && ev('termsFn({b1:1}).dHR')>15);
ok('V1 → RVS não-adrenérgica (sem FC)', ev('termsFn({v1:1}).dRVS')>5 && near(ev('termsFn({v1:1}).dHR'),0,0.01));
ok('PDE → inodilatador (inotropia↑, RVS↓)', ev('termsFn({pde:1}).dInotropy')>0.3 && ev('termsFn({pde:1}).dRVS')<0);
ok('distributivo: noradrenalina APTA, dobutamina não', ev('appropriateFn({rvs:7,pump:0.78,preload:0.95,broken:"rvs"},AGENTSref.noradrenalina).ok')===true && ev('appropriateFn({rvs:7,pump:0.78,preload:0.95,broken:"rvs"},AGENTSref.dobutamina).ok')===false);
ok('cardiogênico: dobutamina APTA, fenilefrina não (afunda o débito)', ev('appropriateFn({rvs:17,pump:0.32,preload:1.05,broken:"pump"},AGENTSref.dobutamina).ok')===true && ev('appropriateFn({rvs:17,pump:0.32,preload:1.05,broken:"pump"},AGENTSref.fenilefrina).ok')===false);

console.log('\n— FARMÁCIA · CALCULADORA (SAFETY.md §11) —');
ok('concentração nora = 64 mcg/mL', near(ev('phConcFn("noradrenalina").value'),64,0.01));
ok('nora 0,1 mcg/kg/min @70 kg ≈ 6,56 mL/h', near(ev('phRateFn("noradrenalina",0.1,70)'),6.5625,0.01), ev('phRateFn("noradrenalina",0.1,70)').toFixed(2));
ok('dobuta 5 mcg/kg/min @70 kg ≈ 21 mL/h', near(ev('phRateFn("dobutamina",5,70)'),21,0.1));
ok('vasopressina não é peso-dependente', ev('phRateFn("vasopressina",0.03,50)')===ev('phRateFn("vasopressina",0.03,120)'));
ok('round-trip dose↔mL/h', near(ev('phDoseFn("noradrenalina",phRateFn("noradrenalina",0.2,70),70)'),0.2,1e-9));
ok('titulação monotônica crescente', (function(){ var t=ev('phTitrationFn("noradrenalina",70,5)'); for(var i=1;i<t.length;i++){ if(t[i].mLh<=t[i-1].mLh) return false; } return true; })());
ok('readout da calculadora preenchido (mL/h)', /mL\/h/.test($('farm-out').innerHTML));
ok('tabela de diluições com os 7 agentes', (($('farm-diluicoes').innerHTML.match(/<tr/g)||[]).length)>=8);
ok('combos incluem dobutamina+noradrenalina', /dobutamina/.test($('farm-combos').innerHTML)&&/noradrenalina/.test($('farm-combos').innerHTML));
ok('usos inusitados/exclusivos e iatrogênicos renderizados', /inusitado|exclusivo/.test($('farm-usos').innerHTML) && /iatrog/i.test($('farm-iatro').innerHTML));

console.log('\n— LAB · veredito + banners —');
ok('6 presets (agentes)',doc.querySelectorAll('#presets .preset').length===6);
window.setLabState({patient:'rvs'}); window.setAgentFn('noradrenalina'); ok('distributivo + nora: TERMO CERTO',/TERMO CERTO/.test(txt('lab-vbig')),txt('lab-vbig'));
window.setLabState({patient:'pump'}); window.setAgentFn('fenilefrina'); ok('cardiogênico + fenilefrina: TERMO ERRADO',/TERMO ERRADO/.test(txt('lab-vbig')),txt('lab-vbig'));

console.log('\n— INTERATIVO —');
const dec=doc.querySelectorAll('#caso-interativo .decision');
ok('caso progressivo ≥3 decisões',dec.length>=3,dec.length);
const dec0=dec[0]?dec[0].querySelector('.dopts .opt'):null;
ok('decisão tem botões',!!dec0);
if(dec0){ dec0.dispatchEvent(new window.Event('click',{bubbles:true})); ok('responder revela consequência do motor', dec[0].querySelector('.dfb.show')!=null && /motor/.test(dec[0].querySelector('.dfb').textContent)); ok('revela a próxima decisão', dec[1].style.display!=='none'); }
const pbtns=doc.querySelectorAll('#prever-opts .opt');
ok('prever tem 3 opções',pbtns.length===3);
window.setLabState({patient:'pump'}); window.setAgentFn('fenilefrina'); pbtns[2].dispatchEvent(new window.Event('click',{bubbles:true}));
ok('responder a previsão revela o desfecho', $('prever-fb').classList.contains('show') && /PAM|inapto|apto/.test(txt('prever-fb')));

console.log('\n— TUTOR · banco grande, gabarito disproporcional, correta ≠ mais longa —');
const T=window.TUTOR;
ok('banco grande (≥20)',Array.isArray(T)&&T.length>=20,T?T.length:'∅');
ok('chips de dificuldade (crescente, com avançado)',doc.querySelectorAll('#tutor .dif').length===(T?T.length:0) && !!doc.querySelector('#tutor .dif-a'));
let bankOk=true; (T||[]).forEach(q=>{ if(!(Array.isArray(q.o)&&q.o.length===4))bankOk=false; if(!(Number.isInteger(q.a)&&q.a>=0&&q.a<4))bankOk=false; if(!(q.q&&q.fb&&q.cap))bankOk=false; });
ok('tutor: 4 opções/índice/q-fb-cap',bankOk);
const dist=[0,0,0,0]; (T||[]).forEach(q=>dist[q.a]++);
ok('as 4 letras presentes', dist.every(d=>d>0), 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
ok('gabarito DISPROPORCIONAL (não uniforme)', (Math.max.apply(null,dist)-Math.min.apply(null,dist))>=2, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
let longest=0; (T||[]).forEach(q=>{ var l=q.o.map(o=>o.length); if(l[q.a]===Math.max.apply(null,l)) longest++; });
ok('a correta NÃO é a mais longa na maioria (<50%)', longest/(T.length)<0.5, longest+'/'+T.length);
let drew=true,threw=null; const fc=new Proxy({},{ get:(t,p)=>(p in t?t[p]:(typeof p==='string'&&/^[a-z]/.test(p)?()=>{}:undefined)), set:(t,p,v)=>{t[p]=v;return true;} });
(T||[]).forEach((q,i)=>{ try{ q.draw(fc,760,200); }catch(e){ drew=false; threw=(i+1)+': '+e.message; } });
ok('tutor draw() sem lançar',drew,threw||'ok');

console.log('\n— CROMO —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 28',/M[óo]dulo\s*28/.test(txt('kicker')));
ok('pontes 7/9/16/20/22',['perfunde7','perfunde9','perfunde16','perfunde20','perfunde22'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));

console.log('\n— GUARDA SaMD §11 (referência permitida · ordem individualizada proibida) —');
ok('disclaimer cita referência educacional + protocolo institucional', /refer[êe]ncia educacional/i.test(html) && /protocolo da sua institui/i.test(html));
ok('aviso da Farmácia diz "não é prescrição"', /n[ãa]o é prescri/i.test($('farm-aviso').innerHTML));
ok('honestidade cita o §11 / peso hipotético', /§\s*11|hipot[ée]tico|refer[êe]ncia/i.test(txt('honestidade')));
ok('SEM comando imperativo individualizado', !/\b(inicie|administre|titule|prescreva|comece|fa[çc]a)\s+\S+\s+(neste|no|na|para o|para a|para este|para esta|deste|nesta)\s+paciente/i.test(html));
ok('SEM "para ESTE paciente, use/dê X"', !/para\s+este\s+paciente[^.]{0,40}\b(use|d[êe]|administre|inicie)\b/i.test(html));
ok('disclaimer firewall presente (nunca dose/conduta individual)', /nunca/i.test(txt('disclaimer')));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
