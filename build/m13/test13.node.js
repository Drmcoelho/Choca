const M=require('./model13.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const P=(o)=>Object.assign({do2:1000,demand:250,beta2:0,met:0,hepatic:1},o);

console.log('— BASAL E TIPO A (anaeróbio) —');
ok('normal → lactato ~0,8', near(M.lactate(P({})),0.8,0.05), r(M.lactate(P({}))));
ok('hipoperfusão (DO₂250) eleva o lactato', M.lactate(P({do2:250})) > 2.5, r(M.lactate(P({do2:250}))));
ok('tipo A puro = predominante anaeróbio', M.classify(P({do2:250})).tipo.indexOf('tipo A')===0, M.classify(P({do2:250})).tipo);
ok('sem déficit acima do crítico (DO₂1000) → produção A nula', M.prodAnaerobic(1000,250)===0);

console.log('\n— TIPO B (β2) SEM HIPÓXIA —');
ok('β2 alto com DO₂ normal eleva o lactato', M.lactate(P({beta2:6})) > 3, r(M.lactate(P({beta2:6}))));
ok('isso é TIPO B (aeróbio), não A', M.classify(P({beta2:6})).tipo.indexOf('tipo B')===0, M.classify(P({beta2:6})).tipo);
ok('lactato↑ com β2 SEM nenhum déficit de O₂', M.o2deficit(1000,250)===0 && M.lactate(P({beta2:6}))>3);
ok('metformina (tipo B) também eleva', M.lactate(P({met:2.5})) > M.lactate(P({})), r(M.lactate(P({met:2.5}))));

console.log('\n— O CASO-SEMENTE: o 3,9 é predominantemente β2 —');
const seed = P({do2:450, demand:300, beta2:5});
ok('seed lactato ≈ 3,9', near(M.lactate(seed),3.9,0.3), r(M.lactate(seed)));
ok('seed é predominante TIPO B (β2 > anaeróbio)', M.classify(seed).fracB > M.classify(seed).fracA, 'fracB '+r(M.classify(seed).fracB*100,0)+'%');
ok('mas há componente A (misto/B, não A puro)', M.classify(seed).fracA > 0, r(M.classify(seed).fracA*100,0)+'%');

console.log('\n— DEPURAÇÃO HEPÁTICA (clearance-limitado) —');
ok('hepatopatia eleva o lactato com produção modesta', M.lactate(P({beta2:2,hepatic:0.35})) > 3, r(M.lactate(P({beta2:2,hepatic:0.35}))));
ok('classify marca clearance-limitado', M.classify(P({beta2:2,hepatic:0.35})).clearanceLimited===true);
ok('mesma produção, pior fígado → mais lactato', M.lactate(P({beta2:2,hepatic:0.4})) > M.lactate(P({beta2:2,hepatic:1.0})));

console.log('\n— TENDÊNCIA SERIADA (o clearance prognostica) —');
const tr = M.serial(4.0, 1.5, 1.0, 6);
ok('lactato cai ao longo do tempo (4,0 → menor)', tr[tr.length-1].lac < tr[0].lac, r(tr[0].lac)+'→'+r(tr[tr.length-1].lac));
ok('fígado melhor → queda mais rápida (clearance maior em 2h)',
   M.clearancePct(4.0, M.serial(4.0,1.5,1.0,6).find(p=>p.h===2).lac) > M.clearancePct(4.0, M.serial(4.0,1.5,0.4,6).find(p=>p.h===2).lac));
ok('clearancePct(4→2,8) ≈ 30%', near(M.clearancePct(4.0,2.8),30,0.1), r(M.clearancePct(4.0,2.8),1)+'%');

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
