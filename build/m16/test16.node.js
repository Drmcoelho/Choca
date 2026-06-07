const M=require('./model16.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

const NORMAL={ Ees:2.5, Ea:1.7, Pfill:10, hr:75 };
const CARD={ Ees:0.7, Ea:1.9, Pfill:20, hr:80 };

console.log('— LINHA DE BASE (coração normal) —');
const N=M.cardioState(NORMAL);
ok('DC ≈ 5,0 L/min', near(N.CO,5.0,0.2), r(N.CO));
ok('EF ≈ 0,55', near(N.EF,0.55,0.04), r(N.EF,3));
ok('MAP ≈ 94', near(N.MAP,94,3), r(N.MAP,0));
ok('LVEDP baixa (~10)', near(N.LVEDP,10,1.5), r(N.LVEDP,1));
ok('veredito compensado', M.vereditoCardio(N)==='compensado');

console.log('\n— A BOMBA QUE FALHA (Ees↓) —');
const C=M.cardioState(CARD);
ok('SV colapsa vs normal', C.SV < N.SV-15, r(C.SV,0)+' vs '+r(N.SV,0));
ok('EF baixa (<0,30)', C.EF<0.30, r(C.EF,3));
ok('CO baixo (<3,3)', C.CO<3.3, r(C.CO,2));
ok('ESV sobe (mais volume retido)', C.ESV > N.ESV+20, r(C.ESV,0)+' vs '+r(N.ESV,0));
ok('MAP cai (<72)', C.MAP<72, r(C.MAP,0));
ok('veredito cardiogênico', M.vereditoCardio(C)==='cardiogenico');

console.log('\n— CONGESTÃO RETRÓGRADA (pré-carga como pressão) —');
ok('EDV sobe com a pressão de enchimento', M.edvFromPfill(24)>M.edvFromPfill(10));
ok('PED/EDPVR exponencial: 24>18>10', M.ped(M.edvFromPfill(24))>M.ped(M.edvFromPfill(18)) && M.ped(M.edvFromPfill(18))>M.ped(M.edvFromPfill(10)));
ok('cardiogênico congesto: LVEDP ≥ 18', C.LVEDP>=18, r(C.LVEDP,1));
ok('inversa da EDPVR é consistente', near(M.ped(M.edvFromPfill(15)),15,0.2), r(M.ped(M.edvFromPfill(15)),2));

console.log('\n— FARMACOLOGIA (mecanismo, sem dose) —');
const VP=M.cardioState(Object.assign({},CARD,{Ea:3.2}));   // vasopressor: ↑pós-carga
const DESC=M.cardioState(Object.assign({},CARD,{Ea:1.1})); // descarga/vasodilatador: ↓pós-carga
const INO=M.cardioState(Object.assign({},CARD,{Ees:1.7})); // inotrópico: ↑Ees
ok('vasopressor (↑Ea) PIORA o DC', VP.CO < C.CO-0.5, r(VP.CO,2)+' < '+r(C.CO,2));
ok('vasopressor PROPÕE a MAP (sobe)', VP.MAP > C.MAP+4, r(VP.MAP,0)+' > '+r(C.MAP,0));
ok('descarga (↓Ea) SOBE o SV/DC', DESC.CO > C.CO+0.8, r(DESC.CO,2)+' > '+r(C.CO,2));
ok('inotrópico (↑Ees) sobe DC e EF', INO.CO>C.CO+1.5 && INO.EF>C.EF+0.1, 'CO '+r(INO.CO,2)+' EF '+r(INO.EF,2));
ok('CO é monotônico ↓ com a pós-carga', M.cardioState(Object.assign({},CARD,{Ea:1.2})).CO > M.cardioState(Object.assign({},CARD,{Ea:1.9})).CO && M.cardioState(Object.assign({},CARD,{Ea:1.9})).CO > M.cardioState(Object.assign({},CARD,{Ea:2.8})).CO);
ok('CO é monotônico ↑ com a contratilidade', M.cardioState(Object.assign({},CARD,{Ees:0.5})).CO < M.cardioState(Object.assign({},CARD,{Ees:1.0})).CO);

console.log('\n— ACOPLAMENTO Ea/Ees —');
ok('coupling = Ea/Ees', near(M.coupling(2.0,1.6),0.8,1e-9));
ok('EF ≈ 1/(1+Ea/Ees) (aprox.)', near(N.EF, 1/(1+N.Ea/N.Ees), 0.06), r(N.EF,3)+' vs '+r(1/(1+N.Ea/N.Ees),3));

console.log('\n— A ESPIRAL (DC↓→isquemia→Ees↓→DC↓) —');
const sevEdv=M.edvFromPfill(23), sp=M.spiralRun(0.5,2.2,sevEdv,95);
ok('isquemia engaja e a espiral COLAPSA', sp.collapses && sp.COend<1.5, 'COend '+r(sp.COend,2));
ok('trajetória é descendente (CO cai)', sp.traj[0].CO > sp.traj[sp.traj.length-1].CO+1, r(sp.traj[0].CO,2)+'→'+r(sp.traj[sp.traj.length-1].CO,2));
const goodEdv=M.edvFromPfill(10), spOk=M.spiralRun(2.5,1.7,goodEdv,75);
ok('com boa perfusão NÃO espirala', !spOk.collapses && near(spOk.EesEnd,2.5,0.03), r(spOk.EesEnd,2));
ok('ischemiaFactor: platô(=1) acima do joelho', M.ischemiaFactor(60)===1 && M.ischemiaFactor(45)===1);
ok('ischemiaFactor: cai na hipoperfusão', M.ischemiaFactor(15)<1 && M.ischemiaFactor(15)>M.ischemiaFactor(4));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
