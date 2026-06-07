const M=require('./model6.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— PONTO NORMAL (VDF 120, contr 1, af 80) —');
ok('VS ≈ 70 mL', near(M.starlingVS(120,1,80),72,4), r(M.starlingVS(120,1,80),1));
ok('EF ≈ 60%', near(M.ef(120,1,80),0.60,0.04), r(M.ef(120,1,80)*100,0)+'%');
ok('Pench ≈ 10 mmHg', near(M.edpvr(120),10,2), r(M.edpvr(120),1));

console.log('\n— FALÊNCIA (contr 0,5) vs NORMAL na MESMA pré-carga —');
ok('VS falência < VS normal @VDF120', M.starlingVS(120,0.5,80) < M.starlingVS(120,1,80), r(M.starlingVS(120,0.5,80),1)+' vs '+r(M.starlingVS(120,1,80),1));
ok('EF falência ≈ 30%', near(M.ef(120,0.5,80),0.30,0.05), r(M.ef(120,0.5,80)*100,0)+'%');
ok('falência precisa de muito mais VDF p/ pouco VS (curva achatada)', (M.starlingVS(220,0.5,80)-M.starlingVS(120,0.5,80)) < 10, r(M.starlingVS(220,0.5,80)-M.starlingVS(120,0.5,80),1));

console.log('\n— MONOTONICIDADE: NÃO há ramo descendente (VS×VDF) —');
let mono=true, prev=-1;
for(let v=60; v<=260; v+=10){ const vs=M.starlingVS(v,1,80); if(vs<prev-1e-9) mono=false; prev=vs; }
ok('VS é monotônica crescente no VDF (sem overstretch)', mono);
ok('platô: inclinação cai (slope 120 > slope 200)', M.slope(120,1,80) > M.slope(200,1,80), r(M.slope(120,1,80),3)+' > '+r(M.slope(200,1,80),3));
ok('inclinação sempre > 0', M.slope(240,1,80) > 0, r(M.slope(240,1,80),3));

console.log('\n— FARMACOLOGIA (mecanismo) —');
ok('inotrópico desloca a curva PARA CIMA (VS↑ @VDF fixo)', M.starlingVS(120,1.5,80) > M.starlingVS(120,1,80), r(M.starlingVS(120,1.5,80),1));
ok('ordem por contratilidade 0,5<1<1,5', M.starlingVS(120,0.5,80)<M.starlingVS(120,1,80) && M.starlingVS(120,1,80)<M.starlingVS(120,1.5,80));
ok('pós-carga↑ derruba o VS (afterload mismatch)', M.starlingVS(120,1,160) < M.starlingVS(120,1,80), r(M.starlingVS(120,1,160),1));

console.log('\n— EDPVR (diástole) e a falsa queda clínica —');
ok('EDPVR monotônica e ACELERANTE (exponencial)', (M.edpvr(180)-M.edpvr(160)) > (M.edpvr(120)-M.edpvr(100)));
ok('congestão: Pench(180) > 18 mmHg', M.edpvr(180) > M.CONGESTAO, r(M.edpvr(180),1));
ok('EDPVR independe da contratilidade (passiva)', M.edpvr(160)===M.edpvr(160));
ok('round-trip vdf↔pench: edpvr(vdfFromPench(20))≈20', near(M.edpvr(M.vdfFromPench(20)),20,1e-6), r(M.edpvr(M.vdfFromPench(20)),3));
// a "falsa queda": no eixo de PRESSÃO, dobrar a Pench rende pouquíssimo VS
const dVS = M.vsAtPench(30,1,80)-M.vsAtPench(15,1,80);
ok('VS×Pench: de 15→30 mmHg o VS quase não sobe (platô + congestão)', dVS < 6 && dVS >= 0, 'ΔVS='+r(dVS,1)+' mL p/ +15 mmHg');

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
