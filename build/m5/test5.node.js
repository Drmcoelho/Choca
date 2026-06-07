const M=require('./model5.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const B={Rvr:1.4,COmax:10,pra0:-2,K:2,colapso:-4,Clung:1.0};
const P=(o)=>Object.assign({},B,o);

console.log('— HERANÇA GUYTON —');
ok('interseção normal Pra≈0/CO≈5', near(M.intersecao(P({Pmsf:7})).pra,0,0.1) && near(M.intersecao(P({Pmsf:7})).co,5,0.1));

console.log('\n— RESPONSIVIDADE (ganho de bolus) —');
ok('hipovolemia responde mais que normovolemia', M.bolusGain(P({Pmsf:4})) > M.bolusGain(P({Pmsf:7})), r(M.bolusGain(P({Pmsf:7})))+'→'+r(M.bolusGain(P({Pmsf:4}))));
ok('ganho cai no platô (Pmsf19 < Pmsf7)', M.bolusGain(P({Pmsf:19})) < M.bolusGain(P({Pmsf:7})), r(M.bolusGain(P({Pmsf:19}))));
ok('Pmsf19 NÃO responsivo (ganho<0,4)', M.bolusGain(P({Pmsf:19})) < 0.4, r(M.bolusGain(P({Pmsf:19}))));
ok('elevação de pernas = bolus reversível (mesma conta)', near(M.bolusGain(P({Pmsf:5}),3), M.intersecao(P({Pmsf:8})).co - M.intersecao(P({Pmsf:5})).co, 1e-9));

console.log('\n— PPV / IVC —');
ok('PPV maior no ramo ascendente que no platô', M.ppvPercent(P({Pmsf:5})) > M.ppvPercent(P({Pmsf:19})), r(M.ppvPercent(P({Pmsf:5})),0)+'% vs '+r(M.ppvPercent(P({Pmsf:19})),0)+'%');
ok('IVC colaba mais com Pra baixa (hipovol > congesto)', M.ivcCollapse(P({Pmsf:4})) > M.ivcCollapse(P({Pmsf:16})), r(M.ivcCollapse(P({Pmsf:4})),0)+'% vs '+r(M.ivcCollapse(P({Pmsf:16})),0)+'%');

console.log('\n— TOLERÂNCIA —');
ok('pulmão com fuga (Clung 0,35) → intolerante', M.classify(P({Pmsf:5,Clung:0.35})).tolerante===false);
ok('pulmão normal + não-congesto → tolerante', M.classify(P({Pmsf:7,Clung:1.0})).tolerante===true);
ok('congestão alta (Pmsf16,COmax6,Clung0,5) → intolerante', M.classify(P({Pmsf:16,COmax:6,Clung:0.5})).tolerante===false);

console.log('\n— OS QUATRO QUADRANTES —');
ok('hipovolemia = responsivo-tolerante', M.classify(P({Pmsf:4,Clung:1.0})).quadrante==='responsivo-tolerante', M.classify(P({Pmsf:4,Clung:1.0})).quadrante);
ok('ARMADILHA = responsivo-intolerante (responde mas afoga)', M.classify(P({Pmsf:5,Clung:0.35})).quadrante==='responsivo-intolerante', M.classify(P({Pmsf:5,Clung:0.35})).quadrante);
ok('platô = plato-tolerante (não rende, tolera)', M.classify(P({Pmsf:19,Clung:1.0})).quadrante==='plato-tolerante', M.classify(P({Pmsf:19,Clung:1.0})).quadrante);
ok('congestivo = plato-intolerante (pior caso)', M.classify(P({Pmsf:16,COmax:6,Clung:0.5})).quadrante==='plato-intolerante', M.classify(P({Pmsf:16,COmax:6,Clung:0.5})).quadrante);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
