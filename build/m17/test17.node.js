const M=require('./model17.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const P=(o)=>Object.assign({pvr:1,vol:1,rvContr:1,map:75},o);

console.log('— NORMAL —');
ok('CO normal ≈ 5,0', near(M.co(P({})),5.0,0.1), r(M.co(P({}))));
ok('sem desvio septal no normal', near(M.septalShift(P({})),0,1e-9));
ok('fluxo anterógrado do VD = 1 (normal)', near(M.rvForward(P({})),1,0.02), r(M.rvForward(P({}))));

console.log('\n— INTOLERÂNCIA A PÓS-CARGA (TEP) —');
ok('RVP alta (3) derruba o fluxo do VD', M.rvForward(P({pvr:3})) < 0.4, r(M.rvForward(P({pvr:3}))));
ok('TEP (PVR3) derruba o CO', M.co(P({pvr:3})) < 3.2, r(M.co(P({pvr:3}))));
ok('pequena alta de pós-carga já reduz muito (PVR1→1,5)', M.rvForward(P({pvr:1.5})) < 0.7, r(M.rvForward(P({pvr:1.5}))));
ok('reduzir a RVP (3→1,5) RECUPERA o CO', M.co(P({pvr:1.5})) > M.co(P({pvr:3})), r(M.co(P({pvr:3})))+'→'+r(M.co(P({pvr:1.5}))));

console.log('\n— INTERDEPENDÊNCIA (septo em D) —');
ok('VD dilatado → desvio septal > 0', M.septalShift(P({pvr:3}))>0.2, r(M.septalShift(P({pvr:3}))));
ok('o VE está NORMAL e ainda assim subenche (interdependência)', M.lvFill(P({pvr:3})) < 0.5 && M.co(P({pvr:3}))<3.2, 'lvFill '+r(M.lvFill(P({pvr:3}))));
ok('volume↑ aumenta o desvio septal', M.septalShift(P({pvr:2,vol:1.8})) > M.septalShift(P({pvr:2,vol:1.0})));

console.log('\n— O PARADOXO DO VOLUME (mais volume PIORA) —');
ok('na falência de VD (PVR3), volume 1,7 dá CO MENOR que volume 1,0',
   M.co(P({pvr:3,vol:1.7})) < M.co(P({pvr:3,vol:1.0})), r(M.co(P({pvr:3,vol:1.0})))+'→'+r(M.co(P({pvr:3,vol:1.7}))));
ok('idem em pós-carga moderada (PVR2)', M.co(P({pvr:2,vol:1.7})) < M.co(P({pvr:2,vol:1.0})), r(M.co(P({pvr:2,vol:1.0})))+'→'+r(M.co(P({pvr:2,vol:1.7}))));

console.log('\n— A ESPIRAL E O RESGATE PELO PRESSOR —');
ok('MAP baixa reduz a contratilidade efetiva do VD (coronária)', M.rvEffContr(1,50) < M.rvEffContr(1,80), r(M.rvEffContr(1,50))+' < '+r(M.rvEffContr(1,80)));
ok('subir a MAP (pressor) RESGATA o CO no VD em espiral (50→80)',
   M.co(P({pvr:3,vol:1.2,map:80})) > M.co(P({pvr:3,vol:1.2,map:50})), r(M.co(P({pvr:3,vol:1.2,map:50})))+'→'+r(M.co(P({pvr:3,vol:1.2,map:80}))));
ok('espiral sinalizada (PVR alto + MAP baixa + CO baixo)', M.spiral(P({pvr:3,vol:1.2,map:50}))===true);
ok('sem espiral quando MAP recuperada', M.spiral(P({pvr:3,vol:1.2,map:80}))===false);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
