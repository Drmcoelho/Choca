const M = require('./model4.js');
let oks=0, falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

// parâmetros normais (calibrados p/ ponto de operação limpo)
const NORMAL = { Pmsf:7, Rvr:1.4, COmax:10, pra0:-2, K:2, colapso:-4 };

console.log('— ZEROS E INCLINAÇÕES —');
ok('VR zera em Pra = Pmsf', M.venousReturn(7,7,1.4)===0, M.venousReturn(7,7,1.4));
ok('VR(0) = Pmsf/Rvr = 5,0', near(M.venousReturn(0,7,1.4),5.0,1e-9), M.venousReturn(0,7,1.4));
ok('VR decresce com Pra', M.venousReturn(2,7,1.4) < M.venousReturn(0,7,1.4));
ok('VR satura abaixo do colapso (platô)', M.venousReturn(-6,7,1.4)===M.venousReturn(-4,7,1.4), r(M.venousReturn(-6,7,1.4),2));
ok('Cardiac zera no intercepto pra0=-2', M.cardiacOutput(-2,10,-2,2)===0);
ok('Cardiac cresce com Pra', M.cardiacOutput(2,10,-2,2) > M.cardiacOutput(0,10,-2,2));
ok('Cardiac→platô COmax (Pra grande)', near(M.cardiacOutput(2000,10,-2,2),10,0.1), r(M.cardiacOutput(2000,10,-2,2),3));

console.log('\n— PONTO DE OPERAÇÃO NORMAL —');
const op = M.intersecao(NORMAL);
ok('Pra* ≈ 0 mmHg', near(op.pra,0,0.1), r(op.pra,3));
ok('CO* ≈ 5,0 L/min', near(op.co,5.0,0.1), r(op.co,3));
ok('coerência: VR(Pra*) = CO(Pra*)', near(M.venousReturn(op.pra,7,1.4), op.co, 0.02));

console.log('\n— DESLOCAMENTOS (sanidades direcionais) —');
const base = M.intersecao(NORMAL);
// volume: Pmsf 7→11 (desloca VR p/ direita)
const vol = M.intersecao(Object.assign({},NORMAL,{Pmsf:11}));
ok('Volume↑ → CO sobe', vol.co > base.co, r(base.co,2)+'→'+r(vol.co,2));
ok('Volume↑ → Pra sobe', vol.pra > base.pra, r(base.pra,2)+'→'+r(vol.pra,2));
// falência de bomba: achata Starling (COmax 10→6)
const fail = M.intersecao(Object.assign({},NORMAL,{COmax:6}));
ok('Falência → CO cai', fail.co < base.co, r(base.co,2)+'→'+r(fail.co,2));
ok('Falência → Pra sobe (congestão)', fail.pra > base.pra, r(base.pra,2)+'→'+r(fail.pra,2));
// inotrópico: COmax 10→13
const ino = M.intersecao(Object.assign({},NORMAL,{COmax:13}));
ok('Inotrópico → CO sobe', ino.co > base.co, r(base.co,2)+'→'+r(ino.co,2));
ok('Inotrópico → Pra cai', ino.pra < base.pra, r(base.pra,2)+'→'+r(ino.pra,2));
// hipovolemia: Pmsf 7→4
const hipo = M.intersecao(Object.assign({},NORMAL,{Pmsf:4}));
ok('Hipovolemia → CO cai', hipo.co < base.co, r(base.co,2)+'→'+r(hipo.co,2));
ok('Hipovolemia → Pra cai', hipo.pra < base.pra, r(base.pra,2)+'→'+r(hipo.pra,2));
// responsivo vs não-responsivo: ganho de CO por +Pmsf maior na bomba normal que na falida
const dCO_normal = M.intersecao(Object.assign({},NORMAL,{Pmsf:11})).co - base.co;
const dCO_fail   = M.intersecao(Object.assign({},NORMAL,{COmax:6,Pmsf:11})).co - fail.co;
ok('Responsividade a volume MAIOR na bomba normal que na falida', dCO_normal > dCO_fail, r(dCO_normal,2)+' vs '+r(dCO_fail,2));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
