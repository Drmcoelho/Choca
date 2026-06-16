const fs=require('fs'), path=require('path');
const { JSDOM }=require('jsdom');
const file=process.argv[2]||path.join(__dirname,'../../perfunde29.html');
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
const M=window.M29ref;

console.log('— ESTRUTURA / 6 ABAS —');
['backlink','kicker','disclaimer','honestidade','pontes','tutor','score',
 'panel-caso','panel-trilha','panel-cascata','panel-lab','panel-avaliacao','panel-vf',
 'caso-interativo','caso-vitais','caso-prog','prever','prever-opts','prever-fb','trilha',
 'casc','casc-num','casc-hint','iHb','iSat','iHr','iIno','iPre','iRvs','iDem','iExt',
 'lab-presets','lab-levers','lab-veredito','lab-vbig','lab-vnum','lab-banners',
 'vf-navcasos','vf-caso','vf-score'].forEach(id=>ok('#'+id,!!$(id)));
ok('footer',!!doc.querySelector('footer'));
['tab-caso','tab-trilha','tab-cascata','tab-lab','tab-avaliacao','tab-vf'].forEach(t=>ok('aba '+t,!!$(t)));
ok('6 abas + 6 painéis',doc.querySelectorAll('.tab').length===6 && doc.querySelectorAll('.panel').length===6);

console.log('\n— MOTOR UNIFICADO ≡ ÂNCORAS (cascata + adequação) —');
ok('motor M29 exposto',!!(M&&M.cascade&&M.appropriate&&M.brokenTerm));
const n=M.cascade({});
ok('cascata normal: DC≈5, DO₂≈1000, PAM 75–92, lactato≈1', near(n.co,5,0.6)&&near(n.do2,1000,140)&&n.pam>=75&&n.pam<=92&&near(n.lactate,1,0.06));
ok('CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂', near(M.cao2(15,0.98,95), 1.34*15*0.98+0.003*95, 1e-9));
const grave=M.cascade({hb:5,sao2:0.85,hr:120,contractility:0.5,preload:0.6});
ok('supply-dependence: DO₂ baixa → déficit + lactato↑', grave.supplyDependent && grave.o2deficit>0 && grave.lactate>2);
ok('classificador: distributivo→rvs, cardiogênico→bomba, hipovolêmico→pré-carga',
  M.brokenTerm(M.PRESETS.distributivo.state)==='rvs' && M.brokenTerm(M.PRESETS.cardiogenico.state)==='bomba' && M.brokenTerm(M.PRESETS.hipovolemico.state)==='pre');
ok('adequação: distributivo+noradrenalina APTA; +dobutamina não',
  M.appropriate(M.PRESETS.distributivo.state,M.LEVERS.noradrenalina).ok===true && M.appropriate(M.PRESETS.distributivo.state,M.LEVERS.dobutamina).ok===false);
ok('adequação: cardiogênico+fenilefrina afunda o débito (inapta)',
  M.appropriate(M.PRESETS.cardiogenico.state,M.LEVERS.fenilefrina).ok===false && M.appropriate(M.PRESETS.cardiogenico.state,M.LEVERS.fenilefrina).piorouPerfusao===true);

console.log('\n— INSTRUMENTO DA CASCATA —');
ok('drawCascade() sem lançar',(function(){try{window.drawCascadeFn();return true;}catch(e){return false;}})());
ok('8 células numéricas preenchidas',doc.querySelectorAll('#casc-num div').length===8 && /mmHg|mL/.test($('casc-num').innerHTML));
ok('hint cita supply-dependence + termo dominante',/supply-dependence/.test(txt('casc-hint'))&&/termo dominante/.test(txt('casc-hint')));
(function(){ const before=txt('casc-num'); const s=$('iHb'); s.value='6'; s.dispatchEvent(new window.Event('input',{bubbles:true}));
  ok('mexer na Hb recomputa a cascata (readout muda)', txt('casc-num')!==before); s.value='15'; s.dispatchEvent(new window.Event('input',{bubbles:true})); })();
window.activateTab('tab-cascata'); ok('aba Cascata ativa',$('panel-cascata').classList.contains('active'));

console.log('\n— LAB · termo quebrado × alavanca —');
ok('10 categorias + 7 alavancas',doc.querySelectorAll('#lab-presets .preset').length===10 && doc.querySelectorAll('#lab-levers .preset').length===7);
function labPick(catLabel, leverName){
  const cat=[...doc.querySelectorAll('#lab-presets .preset')].find(b=>b.textContent.includes(catLabel)); if(cat) cat.dispatchEvent(new window.Event('click',{bubbles:true}));
  const lev=[...doc.querySelectorAll('#lab-levers .preset')].find(b=>b.textContent.includes(leverName)); if(lev) lev.dispatchEvent(new window.Event('click',{bubbles:true}));
}
labPick('Distributivo','Noradrenalina'); ok('distributivo + noradrenalina → APTA',/APTA/.test(txt('lab-vbig'))&&!/INAPTA/.test(txt('lab-vbig')),txt('lab-vbig'));
labPick('Cardiogênico','Fenilefrina'); ok('cardiogênico + fenilefrina → INAPTA + banner de termo errado',/INAPTA/.test(txt('lab-vbig'))&&/termo errado|piorou/i.test($('lab-banners').textContent),txt('lab-vbig'));
ok('veredito mostra a cascata pre→post',/PAM .*→/.test(txt('lab-vnum'))&&/déficit/.test(txt('lab-vnum')));

console.log('\n— CASO interativo (evolui de categoria) —');
const dec=doc.querySelectorAll('#caso-interativo .decision');
ok('ato 1 visível com opções',dec.length>=1 && dec[0].querySelectorAll('.opt').length===4);
ok('vitais computados pelo motor',/PA/.test($('caso-vitais').innerHTML)&&/DC/.test($('caso-vitais').innerHTML));
(function(){ for(let step=0; step<4; step++){ const d=doc.querySelectorAll('#caso-interativo .decision'); const last=d[d.length-1]; const opt=last.querySelector('.opt[data-k]'); if(opt) opt.dispatchEvent(new window.Event('click',{bubbles:true})); }
  ok('responder avança os 4 atos até o fim',/caso completo/.test(txt('caso-prog')),txt('caso-prog')); })();
window.predictAnswerFn('afunda'); ok('prever revela consequência computada (DC pre→post)',$('prever-fb').classList.contains('show')&&/afunda o débito/.test(txt('prever-fb'))&&/→/.test(txt('prever-fb')));

console.log('\n— TRILHA —');
ok('trilha ≥9 passos',doc.querySelectorAll('#trilha .step').length>=9,doc.querySelectorAll('#trilha .step').length);
ok('trilha com pistas progressivas',doc.querySelectorAll('#trilha .pista').length>=3);

console.log('\n— AVALIAÇÃO · 30 MCQ integradas —');
const Q=window.BANKref();
ok('30 questões renderizadas',doc.querySelectorAll('#tutor .q').length===30 && Q.length===30);
ok('chips de dificuldade (com avançado)',doc.querySelectorAll('#tutor .dif').length===30 && !!doc.querySelector('#tutor .dif-a'));
const dist=[0,0,0,0]; Q.forEach(q=>dist[q.a]++);
ok('gabarito DISPROPORCIONAL com as 4 letras', dist.every(d=>d>0)&&(Math.max.apply(null,dist)-Math.min.apply(null,dist))>=2, 'A'+dist[0]+' B'+dist[1]+' C'+dist[2]+' D'+dist[3]);
let longest=0; Q.forEach(q=>{ const L=q.o.map(o=>o.length); if(L[q.a]===Math.max.apply(null,L)) longest++; });
ok('a correta NÃO é a mais longa na maioria (<50%)', longest/Q.length<0.5, longest+'/'+Q.length);
ok('4 opções, índice válido, feedback',Q.every(q=>q.o.length===4&&q.o[q.a]&&q.fb));
(function(){ const q0=doc.querySelector('#tutor .opt'); q0.dispatchEvent(new window.Event('click',{bubbles:true}));
  ok('responder marca certo/errado e mostra feedback',!!doc.querySelector('#tutor .opt.right')&&doc.querySelector('#tutor .fb.show')!=null); })();

console.log('\n— CASOS V/F · 120 assertivas integradas —');
const VF=window.CASES_VFref;
ok('6 casos',VF.length===6);
ok('total = 120',window.vfScoreFn().tot===120,window.vfScoreFn().tot);
ok('cada caso 4×5; balanço 60/60',(function(){let v=0,f=0,okc=true;VF.forEach(c=>{let cv=0,cf=0;if(c.etapas.length!==4)okc=false;c.etapas.forEach(e=>{if(e.asser.length!==5)okc=false;e.asser.forEach(a=>{a.v?(v++,cv++):(f++,cf++);});});if(cv!==10||cf!==10)okc=false;});return okc&&v===60&&f===60;})());
window.activateTab('tab-vf');
ok('etapa 1 renderiza, etapa 2 bloqueada',doc.querySelectorAll('#vf-caso .vfstage:not(.locked)').length>=1 && !!doc.querySelector('#vf-caso .vfstage.locked'));
for(let i=0;i<5;i++){ const b=doc.querySelector('#vf-caso .vfas .vfbtns .vfb'); if(b) b.dispatchEvent(new window.Event('click',{bubbles:true})); }
ok('responder revela gabarito+racional e desbloqueia a etapa 2',doc.querySelectorAll('#vf-caso .vffb').length>=5 && doc.querySelectorAll('#vf-caso .vfstage:not(.locked)').length>=2);
ok('placar atualiza',window.vfScoreFn().ans===5,window.vfScoreFn().ans+' respondidas');
ok('navegação: 6 casos',doc.querySelectorAll('#vf-navcasos .preset').length===6);

console.log('\n— CROMO —');
ok('backlink',/perfunde\.html/.test(txt('backlink')));
ok('kicker Módulo 29',/M[óo]dulo\s*29/.test(txt('kicker')));
ok('pontes 1/8/9/16/20/28',['perfunde1','perfunde8','perfunde9','perfunde16','perfunde20','perfunde28'].every(h=>$('pontes').innerHTML.includes(h)));
const foot=doc.querySelector('footer').textContent;
ok('rodapé CRM',/CRM-?SP\s*151\.?318/.test(foot)); ok('rodapé Coelho·Limeira',/Matheus M\. Coelho/.test(foot)&&/Limeira/.test(foot));

console.log('\n— GUARDA SaMD §11 —');
const all=html;
ok('disclaimer cita §11 / referência educacional',/§\s*11/.test(all)&&/refer[êe]ncia educacional/i.test(all));
ok('honestidade: primitivas didáticas, não medidas reais',/n[ãa]o (s[ãa]o )?medidas reais|fatores did[áa]ticos/i.test(txt('honestidade')));
ok('SEM ordem imperativa individualizada',!/\b(inicie|administre|titule|prescreva|comece|fa[çc]a|d[êe])\s+\S+\s+(neste|no|na|para o|para a|para este|deste|nesta)\s+paciente/i.test(all));
ok('SEM dose numérica imperativa',!/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i.test(all.replace(/0,003·PaO₂/g,'')));
ok('disclaimer firewall (nunca dose/conduta individual)',/nunca/i.test(txt('disclaimer')));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
})();
