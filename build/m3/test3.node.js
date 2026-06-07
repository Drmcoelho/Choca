const M=require('./model3.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— IDENTIDADE E ENCHIMENTO —');
ok('dc(70,70) = 4,9 (identidade)', near(M.dc(70,70),4.9,1e-9), r(M.dc(70,70)));
ok('diástole(70) ≈ 0,557 s', near(M.diastole(70),0.557,0.005), r(M.diastole(70),3));
ok('diástole encurta com FC (150<70)', M.diastole(150)<M.diastole(70), r(M.diastole(150),3));
ok('diástole→0 em FC extrema (200, sís 0,30)', near(M.diastole(200),0,1e-9), r(M.diastole(200),3));
ok('VS atingido(70,85) ≈ 72 mL', near(M.svAchieved(70,85),71.7,1.0), r(M.svAchieved(70,85),1));
ok('VS cai com FC (130<70)', M.svAchieved(130,85)<M.svAchieved(70,85), r(M.svAchieved(130,85),1)+'<'+r(M.svAchieved(70,85),1));

console.log('\n— A CURVA DC×FC (o teto) —');
ok('DC repouso(70) ≈ 5,0', near(M.dcAt(70,85),5.0,0.2), r(M.dcAt(70,85)));
ok('DC sobe de 70→95', M.dcAt(95,85)>M.dcAt(70,85), r(M.dcAt(70,85))+'→'+r(M.dcAt(95,85)));
ok('DC(130) < DC(95) (passou do pico)', M.dcAt(130,85)<M.dcAt(95,85), r(M.dcAt(95,85))+'→'+r(M.dcAt(130,85)));
ok('DC(130) < DC(70) — taquicardia que ENGANA', M.dcAt(130,85)<M.dcAt(70,85), r(M.dcAt(70,85))+' vs '+r(M.dcAt(130,85)));
ok('DC(160) < DC(130) — colapso de enchimento', M.dcAt(160,85)<M.dcAt(130,85), r(M.dcAt(160,85)));
const pk=M.peakFC(85);
ok('pico de DC entre FC 85 e 115', pk.fc>=85 && pk.fc<=115, 'FC '+pk.fc+' · DC '+r(pk.dc));
ok('inotropismo/enchimento↑ (VSbasal 100) sobe o DC no pico', M.peakFC(100).dc > pk.dc, r(M.peakFC(100).dc)+' vs '+r(pk.dc));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
