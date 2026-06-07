const M=require('./model7.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— GEOMETRIA DE SUNAGAWA (identidades) —');
ok('Pes = Ea·SV (interseção)', near(M.pes(120,2.5,1.5), 1.5*M.strokeVolume(120,2.5,1.5), 1e-9), r(M.pes(120,2.5,1.5)));
ok('Ves = (Ea·VDF+Ees·V0)/(Ea+Ees)', near(M.ves(120,2.5,1.5),(1.5*120+2.5*10)/4,1e-9));
ok('SV = VDF − Ves', near(M.strokeVolume(120,2.5,1.5), 120-M.ves(120,2.5,1.5), 1e-9));

console.log('\n— PONTO NORMAL (Ees2.5, Ea1.5, EDV120) —');
ok('SV ≈ 69 mL', near(M.strokeVolume(120,2.5,1.5),69,4), r(M.strokeVolume(120,2.5,1.5),1));
ok('EF ≈ 57%', near(M.ef(120,2.5,1.5),0.57,0.04), r(M.ef(120,2.5,1.5)*100,0)+'%');
ok('Pes ≈ 103 mmHg', near(M.pes(120,2.5,1.5),103,5), r(M.pes(120,2.5,1.5),0));
ok('acoplamento Ea/Ees = 0,60', near(M.coupling(2.5,1.5),0.6,1e-9), r(M.coupling(2.5,1.5)));

console.log('\n— EF É LEITURA DO ACOPLAMENTO —');
ok('EF cai quando Ea/Ees sobe', M.ef(120,2.5,1.0) > M.ef(120,2.5,3.0), r(M.ef(120,2.5,1.0)*100,0)+'% > '+r(M.ef(120,2.5,3.0)*100,0)+'%');
ok('EF ≈ 1/(1+Ea/Ees) (com V0 pequeno)', near(M.ef(120,2.5,2.5), 1/(1+1.0), 0.06), r(M.ef(120,2.5,2.5)*100,0)+'%');

console.log('\n— O CASO: baixar PÓS-CARGA (Ea↓) —');
ok('vasodilatador (Ea 1,5→1,0): SV SOBE', M.strokeVolume(120,2.5,1.0) > M.strokeVolume(120,2.5,1.5), r(M.strokeVolume(120,2.5,1.5),1)+'→'+r(M.strokeVolume(120,2.5,1.0),1));
ok('vasodilatador: Pes CAI', M.pes(120,2.5,1.0) < M.pes(120,2.5,1.5), r(M.pes(120,2.5,1.5),0)+'→'+r(M.pes(120,2.5,1.0),0));
ok('hipertensivo (Ea↑): SV cai e Pes sobe', M.strokeVolume(120,2.5,3.0)<M.strokeVolume(120,2.5,1.5) && M.pes(120,2.5,3.0)>M.pes(120,2.5,1.5));

console.log('\n— FALÊNCIA E RESGATE —');
ok('falência (Ees 2.5→1.2): SV↓ & EF↓ & acoplamento↑', M.strokeVolume(120,1.2,1.5)<M.strokeVolume(120,2.5,1.5) && M.ef(120,1.2,1.5)<M.ef(120,2.5,1.5) && M.coupling(1.2,1.5)>1);
ok('na falência, baixar Ea RESGATA o SV', M.strokeVolume(120,1.2,0.9) > M.strokeVolume(120,1.2,1.5), r(M.strokeVolume(120,1.2,1.5),1)+'→'+r(M.strokeVolume(120,1.2,0.9),1));
ok('inotrópico (Ees↑): SV sobe', M.strokeVolume(120,3.5,1.5) > M.strokeVolume(120,2.5,1.5));

console.log('\n— PRÉ-CARGA E TRABALHO —');
ok('pré-carga↑ (EDV 120→160): SV sobe', M.strokeVolume(160,2.5,1.5) > M.strokeVolume(120,2.5,1.5));
ok('trabalho sistólico (SW) máximo perto de Ea/Ees≈1', M.strokeWork(120,2.5,2.5) > M.strokeWork(120,2.5,0.6) && M.strokeWork(120,2.5,2.5) > M.strokeWork(120,2.5,5.0), 'SW@1='+r(M.strokeWork(120,2.5,2.5),0));
ok('eficiência mecânica cai com o acoplamento', M.efficiency(120,2.5,0.6) > M.efficiency(120,2.5,5.0), r(M.efficiency(120,2.5,0.6)*100,0)+'% > '+r(M.efficiency(120,2.5,5.0)*100,0)+'%');
ok('SW e eficiência positivos', M.strokeWork(120,2.5,1.5)>0 && M.efficiency(120,2.5,1.5)>0 && M.efficiency(120,2.5,1.5)<1);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
