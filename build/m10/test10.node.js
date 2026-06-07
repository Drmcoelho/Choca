const M=require('./model10.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

// referência arterial verdadeira: 120/80, FC 75
const base={ sbp:120, dbp:80, hr:75 };
const P=(o)=>Object.assign({zeta:0.55,fn:22,levelCm:0}, base, o);

console.log('— (A) NIVELAMENTO · offset hidrostático —');
ok('14 cm abaixo do eixo → +10,3 mmHg', near(M.levelOffset(-14),10.3,0.1), r(M.levelOffset(-14)));
ok('14 cm acima do eixo → −10,3 mmHg', near(M.levelOffset(14),-10.3,0.1), r(M.levelOffset(14)));
ok('nível 0 → sem offset', near(M.levelOffset(0),0,1e-9));
const Rlow=M.measuredCycle(P({levelCm:-14}));
ok('transdutor baixo: PAM medida sobe ~+10', near(Rlow.mapMeas-Rlow.mapTrue,10.3,0.6), r(Rlow.mapMeas-Rlow.mapTrue));
ok('mal-zerado desloca SBP e DBP igualmente', near((Rlow.sbpMeas-Rlow.sbpTrue),(Rlow.dbpMeas-Rlow.dbpTrue),0.8), r(Rlow.sbpMeas-Rlow.sbpTrue)+'/'+r(Rlow.dbpMeas-Rlow.dbpTrue));

console.log('\n— (B) RESPOSTA DINÂMICA · a PAM sobrevive ao damping —');
const Rok=M.measuredCycle(P({zeta:0.55,fn:22}));
ok('bem amortecido: SBP medida ≈ verdadeira', near(Rok.sbpMeas,Rok.sbpTrue,4), r(Rok.sbpMeas)+' vs '+r(Rok.sbpTrue));
ok('bem amortecido: PAM ≈ verdadeira', near(Rok.mapMeas,Rok.mapTrue,2), r(Rok.mapMeas)+' vs '+r(Rok.mapTrue));
const Rsub=M.measuredCycle(P({zeta:0.12,fn:14}));
ok('SUBamortecido: SBP superestimada (overshoot)', Rsub.sbpMeas>Rsub.sbpTrue+5, r(Rsub.sbpMeas)+' vs '+r(Rsub.sbpTrue));
ok('SUBamortecido: PAM ainda ≈ verdadeira (±3)', near(Rsub.mapMeas,Rsub.mapTrue,3), r(Rsub.mapMeas)+' vs '+r(Rsub.mapTrue));
const Rsup=M.measuredCycle(P({zeta:1.1,fn:7}));
ok('SUPERamortecido: SBP subestimada (blunting)', Rsup.sbpMeas<Rsup.sbpTrue-5, r(Rsup.sbpMeas)+' vs '+r(Rsup.sbpTrue));
ok('SUPERamortecido: PAM ainda ≈ verdadeira (±3)', near(Rsup.mapMeas,Rsup.mapTrue,3), r(Rsup.mapMeas)+' vs '+r(Rsup.mapTrue));
ok('PP subamortecida > PP verdadeira > PP superamortecida',
   (Rsub.sbpMeas-Rsub.dbpMeas) > (Rok.sbpTrue-Rok.dbpTrue) && (Rok.sbpTrue-Rok.dbpTrue) > (Rsup.sbpMeas-Rsup.dbpMeas),
   r(Rsub.sbpMeas-Rsub.dbpMeas)+' > '+r(Rsup.sbpMeas-Rsup.dbpMeas));

console.log('\n— veredito do traçado —');
ok('confiável: ok',  M.vereditoTrace(Rok).ok===true);
ok('mal-zerado → flag zero', M.vereditoTrace(Rlow).flags.indexOf('zero')>=0);
ok('subamortecido → flag sub', M.vereditoTrace(Rsub).flags.indexOf('sub')>=0);
ok('superamortecido → flag super', M.vereditoTrace(Rsup).flags.indexOf('super')>=0);

console.log('\n— fast-flush recupera ζ —');
const ff=M.fastFlush(P({zeta:0.20,fn:18}));
ok('subamortecido gera ≥2 picos', ff.peaks.length>=2, ff.peaks.length+' picos');
ok('ζ recuperado ≈ 0,20 (decremento log)', near(ff.measuredZeta,0.20,0.05), r(ff.measuredZeta,3));
const ffSup=M.fastFlush(P({zeta:0.9,fn:8}));
ok('superamortecido: sem oscilação (0–1 pico)', ffSup.peaks.length<=1, ffSup.peaks.length+' picos');

console.log('\n— (C) TERMODILUIÇÃO · Stewart-Hamilton —');
ok('nominal → CO_comp = CO_true', near(M.coComputed(5, 10,4, 10,4, 37),5,1e-9), r(M.coComputed(5,10,4,10,4,37)));
ok('volume parcial (7 de 10 mL) → CO falsamente ALTO', M.coComputed(5, 7,4, 10,4, 37)>5.1, r(M.coComputed(5,7,4,10,4,37)));
ok('  …razão exata 10/7', near(M.coComputed(5,7,4,10,4,37), 5*10/7, 1e-9), r(M.coComputed(5,7,4,10,4,37)));
ok('injetado QUENTE (10°C vs 4°C nominal) → CO falsamente ALTO', M.coComputed(5, 10,10, 10,4, 37)>5.1, r(M.coComputed(5,10,10,10,4,37)));
ok('  …razão exata 33/27', near(M.coComputed(5,10,10,10,4,37), 5*(37-4)/(37-10), 1e-9), r(M.coComputed(5,10,10,10,4,37)));
const tcLow=M.thermoCurve(3,10,4,37), tcHigh=M.thermoCurve(7,10,4,37);
ok('CO baixo → AUC maior que CO alto', tcLow.auc>tcHigh.auc, r(tcLow.auc)+' > '+r(tcHigh.auc));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
