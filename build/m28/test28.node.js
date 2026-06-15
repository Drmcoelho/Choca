const M=require('./model28.js');
const Ph=require('./pharm28.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const T=M.terms, A=M.AGENTS;

console.log('— RECEPTOR → TERMO (cada receptor move o seu termo) —');
ok('α1 → RVS↑ (vasoconstrição)', T({a1:1}).dRVS>5 && T({a1:1}).dInotropy<0.05);
ok('β1 → contratilidade↑ E FC↑', T({b1:1}).dInotropy>0.3 && T({b1:1}).dHR>15);
ok('β2 → vasodilatação (RVS↓) + demanda', T({b2:1}).dRVS<0 && T({b2:1}).metabolic>0);
ok('V1 → RVS↑ NÃO-adrenérgica (sem FC)', T({v1:1}).dRVS>5 && near(T({v1:1}).dHR,0,0.01) && T({v1:1}).metabolic===0);
ok('PDE → inodilatador (contratilidade↑ + RVS↓)', T({pde:1}).dInotropy>0.3 && T({pde:1}).dRVS<0);
ok('β eleva a demanda de O₂; α1/V1 puros não', T({b1:1}).metabolic>0.3 && T({a1:1}).metabolic===0 && T({v1:1}).metabolic===0);

console.log('\n— PERFIS DOS AGENTES —');
ok('noradrenalina: termo dominante RVS', M.dominantTerm(A.noradrenalina)==='rvs');
ok('dobutamina: termo dominante inotropia', M.dominantTerm(A.dobutamina)==='inotropy');
ok('vasopressina: RVS sem taquicardia', T(A.vasopressina).dRVS>5 && near(T(A.vasopressina).dHR,0,0.01));
ok('fenilefrina: α1 puro com bradicardia reflexa', T(A.fenilefrina).dRVS>7 && T(A.fenilefrina).dHR<0);
ok('milrinona: inodilatador (inotropia↑, RVS↓)', T(A.milrinona).dInotropy>0.3 && T(A.milrinona).dRVS<0);
ok('ADRENALINA move QUATRO termos (RVS, inotropia, FC, demanda)', T(A.adrenalina).dRVS>0 && T(A.adrenalina).dInotropy>0.2 && T(A.adrenalina).dHR>10 && T(A.adrenalina).metabolic>0.3);

console.log('\n— DISTRIBUTIVO (RVS↓): o agente certo sobe a RVS e a PAM —');
const D={rvs:7,pump:0.78,preload:0.95,broken:'rvs'};
ok('noradrenalina é APTA (sobe RVS, alcança PAM)', M.appropriate(D,A.noradrenalina).ok===true);
ok('vasopressina é APTA (RVS não-adrenérgica)', M.appropriate(D,A.vasopressina).ok===true);
ok('dobutamina NÃO é apta (não sobe a RVS — termo errado)', M.appropriate(D,A.dobutamina).ok===false && /RVS/.test(M.appropriate(D,A.dobutamina).why.join(' ')));
ok('o vasopressor sobe a PAM no distributivo', M.applyDrug(D,A.noradrenalina).PAM > M.applyDrug(D,{}).PAM);

console.log('\n— CARDIOGÊNICO (bomba↓): o certo sobe a contratilidade; o vasopressor puro afoga —');
const C={rvs:17,pump:0.32,preload:1.05,broken:'pump'};
ok('dobutamina é APTA (sobe a contratilidade)', M.appropriate(C,A.dobutamina).ok===true && M.applyDrug(C,A.dobutamina).inotropy>M.applyDrug(C,{}).inotropy);
ok('milrinona é APTA (inodilatador)', M.appropriate(C,A.milrinona).ok===true);
ok('fenilefrina NÃO é apta (pós-carga sobe, débito CAI)', M.appropriate(C,A.fenilefrina).ok===false && M.applyDrug(C,A.fenilefrina).CO < M.applyDrug(C,{}).CO);
ok('noradrenalina NÃO é apta no cardiogênico puro (pós-carga)', M.appropriate(C,A.noradrenalina).ok===false && /pós-carga/.test(M.appropriate(C,A.noradrenalina).why.join(' ')));
ok('a dobutamina melhora o débito do cardiogênico', M.applyDrug(C,A.dobutamina).CO > M.applyDrug(C,{}).CO);

console.log('\n— CUSTO MIOCÁRDICO (β eleva a demanda) —');
ok('dobutamina tem custo de O₂ mais alto que a milrinona', M.applyDrug(C,A.dobutamina).o2balance < M.applyDrug(C,A.milrinona).o2balance);
ok('a adrenalina no distributivo funciona MAS com alerta de custo', M.appropriate(D,A.adrenalina).ok===true && M.appropriate(D,A.adrenalina).highCost===true);

console.log('\n— A MESMA DROGA, EFEITO POR TERMO QUEBRADO —');
ok('fenilefrina: apta no distributivo, inapta no cardiogênico', M.appropriate(D,A.fenilefrina).ok!==M.appropriate(C,A.fenilefrina).ok);
ok('dobutamina: apta no cardiogênico, inapta no distributivo', M.appropriate(C,A.dobutamina).ok!==M.appropriate(D,A.dobutamina).ok);

console.log('\n— ROBUSTEZ / LIMITES —');
ok('terms/applyDrug/appropriate sem argumento não lançam', (function(){try{return !isNaN(T().dRVS) && !isNaN(M.applyDrug().PAM) && typeof M.appropriate().ok==='boolean';}catch(e){return false;}})());
ok('null/NaN/string nas entradas não propaga', (function(){try{var z=M.applyDrug({rvs:'x',pump:NaN,preload:undefined},{a1:NaN,b1:'y'});return [z.PAM,z.CO,z.rvs,z.inotropy].every(v=>typeof v==='number'&&!isNaN(v));}catch(e){return false;}})());
const ABS=M.applyDrug({rvs:99,pump:9},{a1:9,b1:-2,b2:5,v1:8,pde:4});
ok('RVS/PAM/FC clampados', ABS.rvs<=30 && ABS.PAM<=140 && ABS.HR<=170 && ABS.HR>=40);

console.log('\n— REFERÊNCIA FARMACOLÓGICA · CONCENTRAÇÕES (SAFETY.md §11) —');
ok('noradrenalina 16 mg/250 mL = 64 mcg/mL', near(Ph.concentration('noradrenalina').value,64,0.01) && Ph.concentration('noradrenalina').unit==='mcg/mL');
ok('dobutamina 250 mg/250 mL = 1000 mcg/mL', near(Ph.concentration('dobutamina').value,1000,0.01));
ok('vasopressina 20 U/100 mL = 0,2 U/mL', near(Ph.concentration('vasopressina').value,0.2,0.001) && Ph.concentration('vasopressina').unit==='U/mL');
ok('todas as faixas têm doseMax > doseMin', Object.keys(Ph.DRUGS).every(function(k){ return Ph.DRUGS[k].doseMax>Ph.DRUGS[k].doseMin; }));

console.log('\n— CALCULADORA · CONVERSÃO dose ↔ mL/h —');
ok('nora 0,1 mcg/kg/min @70 kg ≈ 6,56 mL/h', near(Ph.infusionRate('noradrenalina',0.1,70),6.5625,0.01), r(Ph.infusionRate('noradrenalina',0.1,70),2));
ok('dobuta 5 mcg/kg/min @70 kg ≈ 21 mL/h', near(Ph.infusionRate('dobutamina',5,70),21,0.1));
ok('vasopressina 0,03 U/min = 9 mL/h (sem peso)', near(Ph.infusionRate('vasopressina',0.03),9,0.01));
ok('round-trip: dose → mL/h → dose preserva', near(Ph.doseFromRate('noradrenalina',Ph.infusionRate('noradrenalina',0.2,70),70),0.2,1e-9));
ok('peso-dependente: dobrar o peso dobra o mL/h (nora)', near(Ph.infusionRate('noradrenalina',0.1,140), 2*Ph.infusionRate('noradrenalina',0.1,70), 1e-9));
ok('vasopressina NÃO é peso-dependente', Ph.infusionRate('vasopressina',0.03,50)===Ph.infusionRate('vasopressina',0.03,120));

console.log('\n— TITULAÇÃO (faixa, não ordem) —');
ok('titulação monotônica crescente e dentro da faixa', (function(){ var t=Ph.titration('noradrenalina',70,5); var mono=true; for(var i=1;i<t.length;i++){ if(t[i].mLh<=t[i-1].mLh) mono=false; } return mono && near(t[0].dose,Ph.DRUGS.noradrenalina.doseMin,1e-9) && near(t[t.length-1].dose,Ph.DRUGS.noradrenalina.doseMax,1e-9); })());
ok('titulação n=1 não gera NaN (guard de divisão por zero)', (function(){ var t=Ph.titration('noradrenalina',70,1); return t.length===1 && !isNaN(t[0].mLh) && !isNaN(t[0].dose); })());

console.log('\n— CONHECIMENTO (interações/combos/usos/iatrogênicos) —');
ok('combos incluem dobutamina + noradrenalina', Ph.COMBOS.some(function(c){ return (c.a==='dobutamina'&&c.b==='noradrenalina'); }));
ok('usos inusitados/exclusivos não vazios', Ph.USOS.length>=4 && Ph.USOS.some(function(u){ return u.tipo==='inusitado'; }) && Ph.USOS.some(function(u){ return u.tipo==='exclusivo'; }));
ok('interações e iatrogênicos documentados', Ph.INTERACOES.length>=3 && Ph.IATROGENICOS.length>=4);

console.log('\n— ROBUSTEZ DA CALCULADORA —');
ok('droga inválida / NaN → 0 (não lança)', Ph.infusionRate('xxx',1,70)===0 && Ph.infusionRate('noradrenalina',NaN,70)===0 && Ph.doseFromRate('zzz',10,70)===0);
ok('peso fora de faixa é clampado (não NaN/Infinity)', isFinite(Ph.infusionRate('noradrenalina',0.1,0)) && isFinite(Ph.infusionRate('noradrenalina',0.1,9999)) && Ph.infusionRate('noradrenalina',0.1,0)>0);
ok('concentração de droga inexistente não lança', (function(){try{return Ph.concentration('nada').value===0;}catch(e){return false;}})());

console.log('\n— CASOS DINÂMICOS V/F (banco de 100 assertivas) —');
const Cv=require('./cases28.js');
const st=Cv.vfStats(), flat=Cv.flatAssertions();
ok('total = 100 assertivas', st.total===100, st.total);
ok('5 casos × 4 etapas (20 etapas)', st.casos===5 && st.etapas===20, st.casos+' casos / '+st.etapas+' etapas');
ok('cada etapa com exatamente 5 assertivas', Cv.CASES_VF.every(c=>c.etapas.length===4 && c.etapas.every(e=>e.asser.length===5)));
ok('balanço V/F exatamente 50/50', st.v===50 && st.f===50, st.v+' V / '+st.f+' F');
ok('cada caso internamente balanceado (10 V / 10 F)', Cv.CASES_VF.every(c=>{let v=0,f=0;c.etapas.forEach(e=>e.asser.forEach(a=>a.v?v++:f++));return v===10&&f===10;}));
ok('toda assertiva tem texto, gabarito booleano e racional', flat.every(a=>typeof a.t==='string'&&a.t.length>10&&typeof a.v==='boolean'&&typeof a.r==='string'&&a.r.length>5));
ok('assertivas são únicas (sem duplicata)', (new Set(flat.map(a=>a.t))).size===flat.length);
ok('SEM ordem imperativa nas assertivas (firewall SaMD)', !flat.some(a=>/\b(inicie|administre|titule|prescreva|comece|fa[çc]a|d[êe])\s+\w+\s+(neste|no|na|para o|para a|para este|deste|nesta)\s+paciente/i.test(a.t)));
ok('SEM dose numérica imperativa em assertiva', !flat.some(a=>/\b\d+([.,]\d+)?\s*(mcg|µg|mg|U)\s*\/\s*(kg\/)?min\b/i.test(a.t)));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
