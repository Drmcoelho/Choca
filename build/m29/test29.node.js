const M=require('./model29.js');
const m1=require('../m1/model1.js'), m8=require('../m8/model8.js'), m9=require('../m9/model9.js');
let oks=0,falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const C=M.cascade, P=M.PRESETS, L=M.LEVERS;

console.log('— CALIBRAÇÃO DO PACIENTE NORMAL —');
const n=C({});
ok('CaO₂ normal ≈ 20 mL/dL', near(n.cao2,20,0.6), n.cao2.toFixed(2));
ok('DC normal ≈ 5 L/min', near(n.co,5,0.5), n.co.toFixed(2));
ok('DO₂ normal ≈ 1000 mL/min', near(n.do2,1000,120), Math.round(n.do2));
ok('PAM normal 75–90 mmHg', n.pam>=75&&n.pam<=92, n.pam.toFixed(1));
ok('lactato normal ≈ 1,0 (supply-independent)', near(n.lactate,1.0,0.05) && !n.supplyDependent, n.lactate.toFixed(2));
ok('SvO₂ normal ≈ 0,70–0,75', n.svo2>=0.68&&n.svo2<=0.78, n.svo2.toFixed(3));

console.log('\n— CONSISTÊNCIA COM OS MOTORES CANÔNICOS (m1/m8/m9) —');
ok('CaO₂ idêntico ao m1', near(M.cao2(15,0.98,95), m1.ca(15,0.98,95), 1e-9));
ok('DO₂ idêntico ao m1 (DC×CaO₂×10)', near(n.do2, m1.do2(n.co,n.cao2), 1e-9));
ok('PAM idêntica ao m9 (PVC + DC·RVS/80)', near(n.pam, m9.pam(n.co,n.rvs,n.pvc), 1e-9));
ok('VO₂/limiar idêntico ao m8', near(n.do2crit, m8.do2crit(250,0.6),1e-9) && near(M.vo2Of(417,250,0.6), m8.vo2(417,250,0.6),1e-6));

console.log('\n— SUPPLY-DEPENDENCE (a cascata quebra a entrega) —');
const grave=C({hb:5,sao2:0.85,hr:120,contractility:0.5,preload:0.6});
ok('DO₂ muito baixa → supply-dependent', grave.supplyDependent===true);
ok('VO₂ cai abaixo da demanda (déficit > 0)', grave.vo2<grave.vo2demand && grave.o2deficit>0, Math.round(grave.o2deficit));
ok('lactato sobe com o déficit', grave.lactate>2.0, grave.lactate.toFixed(2));
ok('monotonia: mais Hb → mais DO₂', C({hb:14}).do2 > C({hb:8}).do2);

console.log('\n— CLASSIFICADOR DO TERMO QUEBRADO (por categoria) —');
ok('hipovolêmico → pré-carga', M.brokenTerm(P.hipovolemico.state)==='pre', M.brokenTerm(P.hipovolemico.state));
ok('cardiogênico → bomba', M.brokenTerm(P.cardiogenico.state)==='bomba', M.brokenTerm(P.cardiogenico.state));
ok('distributivo → RVS', M.brokenTerm(P.distributivo.state)==='rvs', M.brokenTerm(P.distributivo.state));
ok('hemorrágico → também quebra conteúdo (Hb baixa)', M.brokenRanking(P.hemorragico.state).some(x=>x.id==='conteudo'&&x.sev>0.2));
ok('misto é detectado (≥2 termos significativos)', M.isMixed(P.misto.state)===true);
ok('normal não acusa termo quebrado', M.brokenTerm(P.normal.state)==='nenhum');
ok('cada preset mantém PAM plausível (35–130)', Object.keys(P).every(k=>{const c=C(P[k].state);return c.pam>=35&&c.pam<=130;}));

console.log('\n— ALAVANCA VASOATIVA (receptor → termo, recalcula a cascata) —');
const dist=P.distributivo.state, card=P.cardiogenico.state, hipo=P.hipovolemico.state;
ok('noradrenalina sobe RVS e PAM', M.applyLever(dist,L.noradrenalina).rvs>dist.rvs && C(M.applyLever(dist,L.noradrenalina)).pam>C(dist).pam);
ok('fenilefrina (α1) no cardiogênico sobe pós-carga e AFUNDA o débito', M.applyLever(card,L.fenilefrina).rvs>card.rvs && C(M.applyLever(card,L.fenilefrina)).co < C(card).co);
ok('dobutamina sobe contratilidade e débito', M.applyLever(card,L.dobutamina).contractility>card.contractility && C(M.applyLever(card,L.dobutamina)).co>C(card).co);
ok('vasopressina sobe RVS sem mexer na FC', M.applyLever(dist,L.vasopressina).rvs>dist.rvs && near(M.applyLever(dist,L.vasopressina).hr, M.normState(dist).hr, 0.01));
ok('milrinona: inotropia↑ e RVS↓ (inodilatador)', M.applyLever(card,L.milrinona).contractility>card.contractility && M.applyLever(card,L.milrinona).rvs<M.normState(card).rvs);
ok('volume sobe a pré-carga e o débito no hipovolêmico', M.applyLever(hipo,L.volume).preload>M.normState(hipo).preload && C(M.applyLever(hipo,L.volume)).co>C(hipo).co);
ok('transfusão sobe Hb, CaO₂ e DO₂', M.applyLever(hipo,L.transfusao).hb>M.normState(hipo).hb && C(M.applyLever(hipo,L.transfusao)).do2>C(hipo).do2);

console.log('\n— ADEQUAÇÃO: mecanismo casado ao termo quebrado —');
ok('distributivo: noradrenalina APTA', M.appropriate(dist,L.noradrenalina).ok===true);
ok('distributivo: dobutamina NÃO apta (termo errado)', M.appropriate(dist,L.dobutamina).ok===false);
ok('cardiogênico: dobutamina APTA', M.appropriate(card,L.dobutamina).ok===true);
ok('cardiogênico: fenilefrina NÃO apta (piora a perfusão)', M.appropriate(card,L.fenilefrina).ok===false && M.appropriate(card,L.fenilefrina).piorouPerfusao===true);
ok('hipovolêmico: volume APTO', M.appropriate(hipo,L.volume).ok===true);
ok('hipovolêmico: fenilefrina NÃO apta', M.appropriate(hipo,L.fenilefrina).ok===false);
ok('appropriate expõe o termo quebrado e o porquê', typeof M.appropriate(dist,L.noradrenalina).why==='string' && M.appropriate(dist,L.noradrenalina).broken==='rvs');

console.log('\n— ROBUSTEZ / CLAMPS —');
ok('estado vazio não lança e dá normal plausível', (function(){try{const c=C();return c.pam>0&&c.do2>0;}catch(e){return false;}})());
ok('valores absurdos são clampados (sem NaN/Infinity)', (function(){const c=C({hb:1e9,sao2:9,hr:-50,rvs:1e9,preload:-3});return isFinite(c.pam)&&isFinite(c.do2)&&isFinite(c.lactate);})());
ok('applyLever com alavanca vazia não altera nada', near(M.applyLever(dist,{}).rvs, M.normState(dist).rvs, 1e-9));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
