const M=require('./model26.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const f=M.cryptic;

console.log('— LINHA DE BASE —');
const N=f({insult:0,reserve:0.8});
ok('sem insulto: PAM normal (≈92)', near(N.PAM,92,2), r(N.PAM,0));
ok('sem insulto: lactato basal e estágio normal', near(N.lactate,1.0,0.1) && M.stage({insult:0,reserve:0.8})==='normal');

console.log('\n— A PAM MENTE: platô compensado —');
ok('PAM fica FLAT enquanto a reserva cobre o insulto', near(f({insult:0.2,reserve:0.8}).PAM, f({insult:0.6,reserve:0.8}).PAM, 0.01) && f({insult:0.6,reserve:0.8}).PAM>=90);
ok('mas o insulto JÁ derrubou a entrega (déficit presente)', f({insult:0.6,reserve:0.8}).deficit>0);

console.log('\n— MARCADORES OCULTOS denunciam (PAM normal, periferia não) —');
const C=f({insult:0.55,reserve:0.8});
ok('PAM aceitável (≥65) no críptico', C.PAM>=65, r(C.PAM,0));
ok('lactato alto apesar da PAM normal', C.lactate>2, r(C.lactate,1));
ok('extração alta / SvO₂ baixa', C.o2er>0.45 && C.svo2<0.55, 'SvO₂ '+r(C.svo2*100,0)+'%');
ok('pressão de pulso ESTREITA (vasoconstrição)', C.pulsePressure < 38, r(C.pulsePressure,0));
ok('enchimento capilar lento', C.capRefill > 3, r(C.capRefill,1));
ok('occult() sinaliza choque oculto', M.occult(C)===true);
ok('estágio = críptico (PAM normal + marcadores ruins)', M.stage({insult:0.55,reserve:0.8})==='criptico');

console.log('\n— OS MARCADORES PIORAM MONOTONICAMENTE COM O INSULTO —');
ok('lactato sobe com o insulto', f({insult:0.7,reserve:0.9}).lactate > f({insult:0.3,reserve:0.9}).lactate);
ok('SvO₂ cai com o insulto', f({insult:0.7,reserve:0.9}).svo2 < f({insult:0.3,reserve:0.9}).svo2);
ok('pressão de pulso estreita com o insulto', f({insult:0.7,reserve:0.9}).pulsePressure < f({insult:0.3,reserve:0.9}).pulsePressure);

console.log('\n— O PRECIPÍCIO: PAM despenca quando a reserva esgota —');
ok('o precipício começa no insulto = reserva', near(M.cliffInsult({reserve:0.5}),0.5,1e-9));
ok('PAM cai pouco ANTES do precipício', f({insult:0.45,reserve:0.5}).PAM >= 88, r(f({insult:0.45,reserve:0.5}).PAM,0));
ok('PAM DESPENCA depois do precipício', f({insult:0.85,reserve:0.5}).PAM < 72, r(f({insult:0.85,reserve:0.5}).PAM,1));
ok('queda além do precipício é íngreme (cliff)', (f({insult:0.45,reserve:0.5}).PAM - f({insult:0.85,reserve:0.5}).PAM) > 15);
ok('nearCliff: compensado mas reserva quase toda gasta', M.nearCliff(f({insult:0.72,reserve:0.8}))===true);
ok('estágios cobrem normal/críptico/precipício/descompensado', (function(){
  return M.stage({insult:0.05,reserve:0.8})==='normal'
    && M.stage({insult:0.45,reserve:0.9})==='criptico'
    && M.stage({insult:0.74,reserve:0.8})==='precipicio'
    && M.stage({insult:0.95,reserve:0.5})==='descompensado'; })());

console.log('\n— A ARMADILHA: o estressor consome a reserva restante —');
const NC={insult:0.7,reserve:0.6};
ok('a sedação derruba a PAM (consome a reserva)', f(M.applySedation(NC)).PAM < f(NC).PAM, r(f(NC).PAM,0)+'→'+r(f(M.applySedation(NC)).PAM,0));
ok('o "estável" passa a descompensado após o estressor', f(NC).PAM>=65 && M.stage(M.applySedation(NC))==='descompensado');
ok('novo insulto (applyHit) também precipita', f(M.applyHit({insult:0.7,reserve:0.7})).PAM < f({insult:0.7,reserve:0.7}).PAM);

console.log('\n— β-BLOQUEIO MASCARA A TAQUICARDIA —');
ok('a FC compensatória some no β-bloqueado', f({insult:0.7,reserve:0.8,betaBlock:0.9}).HR < f({insult:0.7,reserve:0.8}).HR, r(f({insult:0.7,reserve:0.8}).HR,0)+'→'+r(f({insult:0.7,reserve:0.8,betaBlock:0.9}).HR,0));

console.log('\n— ROBUSTEZ / LIMITES —');
ok('cryptic() sem argumento / null não lançam', (function(){try{return !isNaN(f().PAM)&&!isNaN(f(null).PAM);}catch(e){return false;}})());
ok('applySedation/applyHit sanitizam null/undefined/NaN/string', (function(){try{
  return !isNaN(M.applySedation().reserve) && !isNaN(M.applySedation({reserve:'x'}).reserve)
    && M.applyHit(null).insult===0.2 && !isNaN(M.applyHit({insult:NaN}).insult);
}catch(e){return false;}})());
const ABS=f({insult:9,reserve:'x',betaBlock:NaN});
ok('NaN/string/absurdo: sem NaN', [ABS.PAM,ABS.lactate,ABS.svo2,ABS.capRefill,ABS.HR].every(v=>typeof v==='number'&&!isNaN(v)));
ok('PAM e marcadores clampados', ABS.PAM>=30 && ABS.PAM<=100 && ABS.lactate<=14);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
