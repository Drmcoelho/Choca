const M=require('./model8.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const DEM=250, ER=0.6;

console.log('— DO₂ CRÍTICO E O JOELHO —');
ok('DO₂crit = demanda/O₂ERmax ≈ 417', near(M.do2crit(DEM,ER),416.7,1), r(M.do2crit(DEM,ER),1));
ok('febre↑ demanda → DO₂crit sobe (350)', M.do2crit(350,ER) > M.do2crit(DEM,ER), r(M.do2crit(350,ER),0));
ok('sedação↓ demanda → DO₂crit cai (180)', M.do2crit(180,ER) < M.do2crit(DEM,ER), r(M.do2crit(180,ER),0));

console.log('\n— PLATÔ (supply-independent) ACIMA DO CRÍTICO —');
ok('normal DO₂1000: VO₂ = demanda 250', near(M.vo2(1000,DEM,ER),250,1e-9), r(M.vo2(1000,DEM,ER)));
ok('VO₂ independe da DO₂ acima do crítico (800==1200)', M.vo2(800,DEM,ER)===M.vo2(1200,DEM,ER));
ok('O₂ER normal ≈ 25% @DO₂1000', near(M.o2er(1000,DEM,ER),0.25,0.005), r(M.o2er(1000,DEM,ER)*100,1)+'%');
ok('SvO₂ normal ≈ 73% (SaO₂0,98)', near(M.svo2(1000,0.98,DEM,ER),0.735,0.01), r(M.svo2(1000,0.98,DEM,ER)*100,0)+'%');
ok('extração SOBE quando DO₂ cai (600<1000) ainda no platô', M.o2er(600,DEM,ER) > M.o2er(1000,DEM,ER), r(M.o2er(600,DEM,ER)*100,0)+'% > '+r(M.o2er(1000,DEM,ER)*100,0)+'%');
ok('sem déficit nem lactato acima do crítico', M.o2deficit(1000,DEM,ER)===0 && M.lactate(1000,DEM,ER)===M.LACT_BASE);

console.log('\n— RAMPA (supply-dependent) ABAIXO DO CRÍTICO —');
ok('abaixo do crítico: O₂ER saturada em O₂ERmax', near(M.o2er(300,DEM,ER),0.6,1e-9), r(M.o2er(300,DEM,ER)*100,0)+'%');
ok('VO₂ passa a depender da DO₂ (300<demanda)', M.vo2(300,DEM,ER) < DEM, r(M.vo2(300,DEM,ER)));
ok('VO₂ cai com a DO₂ abaixo do crítico (200<300)', M.vo2(200,DEM,ER) < M.vo2(300,DEM,ER), r(M.vo2(200,DEM,ER))+' < '+r(M.vo2(300,DEM,ER)));
ok('déficit e lactato nascem abaixo do crítico', M.o2deficit(300,DEM,ER)>0 && M.lactate(300,DEM,ER)>M.LACT_BASE, 'lac='+r(M.lactate(300,DEM,ER),1));
ok('lactato piora conforme a DO₂ despenca (200>300)', M.lactate(200,DEM,ER) > M.lactate(300,DEM,ER), r(M.lactate(200,DEM,ER),1)+' > '+r(M.lactate(300,DEM,ER),1));
ok('SvO₂ baixa no supply-dependent (<40%)', M.svo2(300,0.98,DEM,ER) < 0.40, r(M.svo2(300,0.98,DEM,ER)*100,0)+'%');

console.log('\n— CONTINUIDADE NO JOELHO —');
const crit=M.do2crit(DEM,ER);
ok('VO₂ contínuo no crítico (≈ demanda)', near(M.vo2(crit,DEM,ER),DEM,1e-6), r(M.vo2(crit,DEM,ER),1));
ok('febre desloca o joelho p/ DO₂ maior (déficit a DO₂450 com demanda350)', M.o2deficit(450,350,ER)>0 && M.o2deficit(450,250,ER)===0);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
