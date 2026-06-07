const M=require('./model9.js');
let oks=0,falhas=0;
const r=(x,n=1)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— IDENTIDADE E ROUND-TRIP —');
ok('PAM(DC5,RVS1040,PVC5) ≈ 70', near(M.pam(5,1040,5),70,0.5), r(M.pam(5,1040,5)));
ok('round-trip: pam(dc, rvsForPam(pam)) = pam', near(M.pam(6, M.rvsForPam(80,6,5), 5), 80, 1e-9));
ok('RVS em Wood = dyn/80 (1040→13)', near(M.rvsWood(1040),13,1e-9), r(M.rvsWood(1040)));

console.log('\n— A INVERSÃO: mesma PAM, mecânicas opostas —');
const par=M.paresMesmaPAM(65, 8, 3.2, 5);
ok('quente e frio têm a MESMA PAM 65', near(M.pam(par.quente.dc,par.quente.rvs,5),65,1e-9) && near(M.pam(par.frio.dc,par.frio.rvs,5),65,1e-9));
ok('quente: DC alto e RVS baixa', par.quente.dc>par.frio.dc && par.quente.rvs<par.frio.rvs, 'quente RVS '+r(par.quente.rvs)+' < frio RVS '+r(par.frio.rvs));
ok('quente RVS < 800 (vasodilatado)', par.quente.rvs<800, r(par.quente.rvs));
ok('frio RVS > 1200 (vasoconstrito)', par.frio.rvs>1200, r(par.frio.rvs));
ok('leque iso-PAM é hipérbole (RVS cai quando DC sobe)', M.rvsForPam(65,8,5) < M.rvsForPam(65,3.2,5));

console.log('\n— DIREÇÕES DO PRODUTO —');
ok('↑DC (RVS fixa) → PAM sobe', M.pam(7,1000,5) > M.pam(4,1000,5));
ok('↑RVS (DC fixo) → PAM sobe', M.pam(5,1400,5) > M.pam(5,900,5));
ok('mesma PAM por DC↑/RVS↓ (compensação)', near(M.pam(8,600,5), M.pam(3.2,1500,5), 1.0), r(M.pam(8,600,5))+' ≈ '+r(M.pam(3.2,1500,5)));

console.log('\n— PERFIL (preview do radar) —');
ok('RVS baixa = quente/vasodilatado', M.profile(8,600).temp==='quente' && M.profile(8,600).vasodilatado);
ok('RVS alta = frio/vasoconstrito', M.profile(3.2,1500).temp==='frio' && M.profile(3.2,1500).vasoconstrito);
ok('DC baixo = fluxo baixo', M.profile(3.0,1500).fluxo==='baixo');
ok('DC alto = fluxo alto', M.profile(8,600).fluxo==='alto');

console.log('\n— CHOQUE CRÍPTICO —');
ok('PAM 90 com DC 3,0 = críptico (pressão ok, fluxo baixo)', M.cryptico(3.0, M.rvsForPam(90,3.0,5), 5)===true, 'PAM '+r(M.pam(3.0,M.rvsForPam(90,3.0,5),5)));
ok('PAM 90 com DC 6,0 NÃO é críptico', M.cryptico(6.0, M.rvsForPam(90,6.0,5), 5)===false);
ok('críptico exige RVS alta compensando (>1200 no exemplo)', M.rvsForPam(90,3.0,5) > 1200, r(M.rvsForPam(90,3.0,5)));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
