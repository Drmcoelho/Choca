// Validação em Node das identidades de model0.js contra as âncoras fisiológicas.
const M = require('./model0.js');
let falhas = 0, oks = 0;
const round = (x, n=2) => Math.round(x * 10**n) / 10**n;
function ok(nome, cond, got){ if(cond){oks++; console.log('  OK  · '+nome+' = '+got);}
  else {falhas++; console.log('FALHA · '+nome+' = '+got);} }
function near(a,b,tol){ return Math.abs(a-b) <= tol; }

console.log('— Âncoras do transporte (CHOQUE §4 / PERFUNDA §4) —');

// 1) CaO2 normal: Hb15/Sat1,00/PaO2 100 → ligado ~20,1 · total ~20,4
const c = M.caO2(15, 1.00, 100);
ok('CaO2 ligado (Hb15,Sat100)', near(c.ligado, 20.1, 0.05), round(c.ligado,3));
ok('CaO2 total  (+dissolvido)', near(c.total, 20.4, 0.05), round(c.total,3));

// 2) DO2 normal: DC5 × CaO2 20,1 → ~1000 mL/min
const d = M.do2(5, 20.1);
ok('DO2 repouso (~1000)', near(d, 1005, 10), round(d,1));

// 3) VO2 Fick: DC5, Ca20,1, Cv15,0 → ~250 mL/min
const v = M.vo2Fick(5, 20.1, 15.0);
ok('VO2 Fick (~250)', near(v, 255, 8), round(v,1));

// 4) O2ER ~25% (e equivalência VO2/DO2 ≡ (Ca−Cv)/Ca)
const er1 = M.o2er(v, d), er2 = M.o2erConteudos(20.1, 15.0);
ok('O2ER ~0,25', near(er1, 0.25, 0.01), round(er1,4));
ok('O2ER equivalência VO2/DO2 ≡ (Ca−Cv)/Ca', near(er1, er2, 1e-9), round(er2,4));

// 5) PAM de manguito 120/80 → 93,33 (caso-semente normotensa 12×8)
const pam = M.pamCuff(120, 80);
ok('PAM 120/80 = 93,33', near(pam, 93.333, 0.01), round(pam,3));

// 6) RVS — conferência algébrica fechada + round-trip da inversão
const rd = M.rvsDyn(90, 5, 5), rw = M.rvsWood(90, 5, 5);
ok('RVS dyn (PAM90,PVC5,DC5) = 1360 exato', rd === 1360, rd);
ok('RVS Wood = 17 exato', rw === 17, rw);
ok('Round-trip PAM = PVC+DC·RVSwood', near(M.pamFromRvs(5,5,rw), 90, 1e-9), round(M.pamFromRvs(5,5,rw),3));
// preset em faixa normal (800–1200): PAM93/PVC8/DC6
const rn = M.rvsDyn(93, 8, 6);
ok('RVS faixa normal alcançável (800–1200)', rn>800 && rn<1200, round(rn,1));

// 7) Caso-semente: Hb 10,7 (Hct~32), Sat 0,96 → conteúdo ~30% reduzido vs 20,4
const seed = M.caO2(10.7, 0.96, 70);
const reducao = 1 - seed.total / 20.4;
ok('Seed CaO2 total', near(seed.total, 13.98, 0.1), round(seed.total,3));
ok('Seed redução de conteúdo ~30% (28–33%)', reducao>0.28 && reducao<0.33, round(reducao*100,1)+'%');

// 8) Fração dissolvida desprezível em normóxia (< 2% do total)
ok('Dissolvido desprezível normóxia (<2%)', (c.dissolvido/c.total) < 0.02, round(100*c.dissolvido/c.total,2)+'%');

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0 ? 1 : 0);
