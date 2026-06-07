// validate0.js — portão jsdom do módulo 0. Imprime "N OK · M falhas"; sai 1 se M>0.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const file = process.argv[2] || path.join(__dirname, 'perfunde0.html');
const html = fs.readFileSync(file, 'utf8');

let oks = 0, falhas = 0;
const ok  = (n, c, got='') => { if(c){oks++; console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));}
  else {falhas++; console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near = (a,b,tol) => Math.abs(a-b) <= tol;
const num  = s => parseFloat(String(s).replace(/\./g,'').replace(',','.')); // pt-BR → Number

// ---- stubs de ambiente (AGENTS §2) ----
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window){
    window.scrollTo = () => {};
    window.requestAnimationFrame = () => 0;   // no-op: não dispara loop
    window.cancelAnimationFrame = () => {};
    window.matchMedia = () => ({ matches:true, media:'', addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} });
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.devicePixelRatio = 1;
    // canvas 2d falso: todos os métodos no-op, props graváveis
    const ctx = new Proxy({}, { get:(t,p)=> (p in t ? t[p] : (typeof p==='string' && /^[a-z]/.test(p) ? ()=>{} : undefined)),
      set:(t,p,v)=>{ t[p]=v; return true; } });
    window.HTMLCanvasElement.prototype.getContext = () => ctx;
    Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 880;},configurable:true});
    Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 84;},configurable:true});
  }
});
const { window } = dom;
const doc = window.document;
const $ = id => doc.getElementById(id);
const txt = id => { const e=$(id); return e ? e.textContent.trim() : null; };

(async () => {
// espera o init (registrado em DOMContentLoaded) realmente rodar
await new Promise(res => {
  if (doc.readyState === 'complete') return res();
  window.addEventListener('load', res);
  setTimeout(res, 3000); // fallback
});
await new Promise(r => setTimeout(r, 0)); // microtask drain

console.log('— ESTRUTURA —');
['backlink','kicker','disclaimer','honestidade','avaliacao','pontes','score',
 'cell-cao2','cell-do2','cell-fick','cell-o2er','cell-pam','cell-rvs',
 'iHb','iSat','iPao2','iDc','iCv','iPas','iPad','iPvc','barCao2',
 'res-cao2','res-do2','res-fick','res-o2er','res-pam','res-rvs','res-rvsw','res-do2i'
].forEach(id => ok('id #'+id+' presente', !!$(id)));
ok('footer presente', !!doc.querySelector('footer'));

console.log('\n— ENGINE INLINED ≡ ÂNCORAS (via window) —');
const ev = expr => window.eval(expr);
const c = ev('caO2(15,1.00,100)');
ok('CaO2 ligado ~20,1', near(c.ligado,20.1,0.05), c.ligado.toFixed(3));
ok('CaO2 total ~20,4', near(c.total,20.4,0.05), c.total.toFixed(3));
ok('DO2 ~1000', near(ev('do2(5,20.1)'),1005,10), ev('do2(5,20.1)').toFixed(1));
ok('VO2 Fick ~250', near(ev('vo2Fick(5,20.1,15)'),255,8), ev('vo2Fick(5,20.1,15)').toFixed(1));
ok('O2ER equivalência VO2/DO2 ≡ (Ca−Cv)/Ca',
   near(ev('o2er(vo2Fick(5,20.1,15),do2(5,20.1))'), ev('o2erConteudos(20.1,15)'), 1e-9));
ok('PAM 120/80 = 93,33', near(ev('pamCuff(120,80)'),93.333,0.01), ev('pamCuff(120,80)').toFixed(3));
ok('RVS dyn(90,5,5)=1360 exato', ev('rvsDyn(90,5,5)')===1360);
ok('Round-trip pamFromRvs', near(ev('pamFromRvs(5,5,rvsWood(90,5,5))'),90,1e-9));
const seed = ev('caO2(10.7,0.96,70)');
ok('Seed redução conteúdo 28–33%', (1-seed.total/20.4)>0.28 && (1-seed.total/20.4)<0.33, (100*(1-seed.total/20.4)).toFixed(1)+'%');

console.log('\n— UI ≡ ENGINE (preset normal default) —');
// preset default: Hb15 Sat100 PaO2 100 DC5 Cv15 PAS120 PAD80 PVC5
const cTot = c.total;                       // 20.4
ok('UI CaO2 = engine', near(num(txt('res-cao2')), cTot, 0.02), txt('res-cao2'));
ok('UI DO2 = engine',  near(num(txt('res-do2')),  ev('do2(5,'+cTot+')'), 1), txt('res-do2'));
ok('UI VO2 = engine',  near(num(txt('res-fick')), ev('vo2Fick(5,'+cTot+',15)'), 1), txt('res-fick'));
ok('UI O2ER% coerente',near(num(txt('res-o2erp')), ev('o2er(vo2Fick(5,'+cTot+',15),do2(5,'+cTot+'))')*100, 0.2), txt('res-o2erp'));
ok('UI PAM = 93,3',    near(num(txt('res-pam')), 93.3, 0.1), txt('res-pam'));
ok('UI RVS = engine',  near(num(txt('res-rvs')), ev('rvsDyn(93.3333333,5,5)'), 2), txt('res-rvs'));

console.log('\n— BANCO DE QUESTÕES —');
const Q = window.QUESTOES;
ok('QUESTOES existe e ≥6', Array.isArray(Q) && Q.length>=6, Q?Q.length:'∅');
let bankOk = true;
(Q||[]).forEach((q,i)=>{
  if(!(Array.isArray(q.o) && q.o.length===4)) { bankOk=false; console.log('   Q'+(i+1)+' não tem 4 opções'); }
  if(!(Number.isInteger(q.a) && q.a>=0 && q.a<4)) { bankOk=false; console.log('   Q'+(i+1)+' índice inválido'); }
  if(!(q.q && q.fb)) { bankOk=false; console.log('   Q'+(i+1)+' falta texto/feedback'); }
});
ok('todas: 4 opções · índice válido · q+fb presentes', bankOk);
ok('quiz renderizou no DOM (botões .opt)', doc.querySelectorAll('#avaliacao .opt').length === (Q?Q.length*4:0),
   doc.querySelectorAll('#avaliacao .opt').length+' botões');

console.log('\n— DRAW CONTRA STUB (não lançar) —');
let drew = true;
try { window.drawBarCao2(); } catch(e){ drew = false; console.log('   throw: '+e.message); }
ok('drawBarCao2() roda sem lançar com ctx stub', drew);

console.log('\n— CROMO DE SÉRIE —');
ok('backlink → perfunde.html', /perfunde\.html/.test(txt('backlink')));
ok('kicker "Módulo 0"', /M[óo]dulo\s*0/.test(txt('kicker')));
ok('pontes: módulos 1/8/9/26', ['perfunde1','perfunde8','perfunde9','perfunde26'].every(h=> $('pontes').innerHTML.includes(h)));
const foot = doc.querySelector('footer').textContent;
ok('rodapé CRM-SP 151.318', /CRM-?SP\s*151\.?318/.test(foot));
ok('rodapé "Dr. Matheus M. Coelho · Limeira"', /Matheus M\. Coelho/.test(foot) && /Limeira/.test(foot));
var __ded = String.fromCharCode(80,97,114,97,32,97,32,68,97,110,105); // frase-alvo montada por códigos: nunca literal no fonte
ok('rodapé sem dedicatória pessoal (guarda permanente)', html.toLowerCase().indexOf(__ded.toLowerCase()) === -1);
ok('nota de honestidade do modelo', !!txt('honestidade') && txt('honestidade').length>80);
ok('firewall SaMD no disclaimer', /nunca/i.test(txt('disclaimer')) && /(dose|conduta)/i.test(txt('disclaimer')));

console.log('\n— ABAS (5 frentes) —');
['tab-caso','tab-trilha','tab-instrumento','tab-lab','tab-avaliacao'].forEach(t=>ok('aba '+t+' presente', !!$(t)));
['panel-caso','panel-trilha','panel-instrumento','panel-lab','panel-avaliacao'].forEach(p=>ok('painel '+p+' presente', !!$(p)));
ok('Caso ativo por padrão', $('panel-caso').classList.contains('active'));
ok('Caso tem 5 atos', doc.querySelectorAll('#panel-caso .ato').length===5, doc.querySelectorAll('#panel-caso .ato').length);
ok('Trilha tem ≥6 elos', doc.querySelectorAll('#panel-trilha .step').length>=6, doc.querySelectorAll('#panel-trilha .step').length);
ok('Caso tem revelação da variável escondida', !!doc.querySelector('#panel-caso .reveal'));
// troca de aba revela o painel
window.activateTab('tab-lab');
ok('clicar Lab ativa painel-lab', $('panel-lab').classList.contains('active'));
ok('e desativa painel-caso', !$('panel-caso').classList.contains('active'));
window.activateTab('tab-caso'); // restaura

console.log('\n— LAB · veredito que vira + banners —');
ok('5 botões de preset', doc.querySelectorAll('#presets .preset').length===5, doc.querySelectorAll('#presets .preset').length);
ok('sliders do Lab (lHb,lDc)', !!$('lHb') && !!$('lDc'));
// preset normal → entrega adequada
window.setLabState({ hb:15,sat:100,pao2:100,dc:5,cv:15,pas:120,pad:80,pvc:5 });
ok('veredito NORMAL = ADEQUADA (verde)', $('lab-veredito').classList.contains('ok') && /ADEQUADA/.test(txt('lab-vbig')), txt('lab-vbig'));
// preset caso-semente → limítrofe + banner críptico
window.setLabState({ hb:10.7,sat:96,pao2:70,dc:5.5,cv:9,pas:120,pad:80,pvc:6 });
ok('veredito SEMENTE = LIMÍTROFE (âmbar)', $('lab-veredito').classList.contains('lim') && /LIM[IÍ]TROFE/.test(txt('lab-vbig')), txt('lab-vbig'));
ok('banner choque críptico acende no semente', $('ban-criptico').classList.contains('show'));
ok('banner SpO₂-engana acende (Hb baixa, Sat96)', $('ban-spo2').classList.contains('show'));
// hiperóxia
window.setLabState({ hb:15,sat:100,pao2:400,dc:5,cv:15,pas:120,pad:80,pvc:5 });
ok('banner hiperóxia acende (PaO₂ 400)', $('ban-hiperoxia').classList.contains('show'));
// distributivo → extração baixa
window.setLabState({ hb:13,sat:98,pao2:95,dc:9,cv:17,pas:90,pad:45,pvc:6 });
ok('banner extração-baixa acende (distributivo)', $('ban-extracao-baixa').classList.contains('show'));
// restaura default p/ não interferir em leituras posteriores
window.setLabState({ hb:15,sat:100,pao2:100,dc:5,cv:15,pas:120,pad:80,pvc:5 });

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0 ? 1 : 0);
})();