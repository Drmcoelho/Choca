const M=require('./model18.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— LINHA DE BASE (sem obstrução) —');
const N=M.obsState({Pext:0});
ok('DC ≈ 5,0', near(N.DC,5.0,0.1), r(N.DC));
ok('CVP baixa (~2)', near(N.CVP,2.0,1.0), r(N.CVP,1));
ok('MAP ≈ 85', near(N.MAP,85,4), r(N.MAP,0));
ok('classe normal', M.classeObs(N)==='normal');

console.log('\n— A ASSINATURA OBSTRUTIVA (PVC alta + DC baixo) —');
const O=M.obsState({Pext:14});
ok('CVP ALTA (≥12)', O.CVP>=12, r(O.CVP,1));
ok('DC BAIXO (<3,6)', O.DC<3.6, r(O.DC));
ok('enchimento transmural caiu (≈0 ou negativo)', O.transmural<1.0, r(O.transmural,1));
ok('classe obstrutivo', M.classeObs(O)==='obstrutivo');
const G=M.obsState({Pext:20});
ok('grave: DC < 2', G.DC<2, r(G.DC));
ok('grave: CVP > 18', G.CVP>18, r(G.CVP,1));
ok('grave: lactato elevado (>3)', G.lactate>3, r(G.lactate,1));
ok('grave: classe colapso', M.classeObs(G)==='colapso');

console.log('\n— O ESPELHO: obstrutivo × hipovolêmico (mesmo DC, CVP oposta) —');
const ob=M.obsState({Pext:18});
const hi=M.hipoComparavel(ob.DC);
ok('mesmo DC nos dois', near(ob.DC,hi.DC,0.15), r(ob.DC)+' vs '+r(hi.DC));
ok('obstrutivo: CVP ALTA (>12)', ob.CVP>12, r(ob.CVP,1));
ok('hipovolêmico: CVP BAIXA (<4)', hi.CVP<4, r(hi.CVP,1));
ok('a CVP é o discriminador (≥10 mmHg de diferença)', (ob.CVP-hi.CVP)>=10, r(ob.CVP-hi.CVP,1));

console.log('\n— MONOTONIAS (Pext sobe → DC↓, CVP↑) —');
ok('DC cai monotonicamente com Pext', M.obsState({Pext:6}).DC>M.obsState({Pext:14}).DC && M.obsState({Pext:14}).DC>M.obsState({Pext:22}).DC);
ok('CVP sobe monotonicamente com Pext', M.obsState({Pext:6}).CVP<M.obsState({Pext:14}).CVP && M.obsState({Pext:14}).CVP<M.obsState({Pext:22}).CVP);
ok('Pmsf compensatória sobe com Pext', M.pmsfEff(20,0)>M.pmsfEff(0,0));

console.log('\n— ENCHER CONTRA A OBSTRUÇÃO × ALÍVIO —');
const sev=M.obsState({Pext:20});
const vol=M.obsState({Pext:20,vol:0.5});
const ali=M.obsState({Pext:4});
ok('volume SOBE o DC (preload-dependência)', vol.DC>sev.DC+1.5, r(sev.DC)+' → '+r(vol.DC));
ok('mas a CVP sobe JUNTO (custo do volume)', vol.CVP>sev.CVP, r(vol.CVP,1)+' > '+r(sev.CVP,1));
ok('alívio (↓Pext) RESTAURA o DC', ali.DC>4.0, r(ali.DC));
ok('alívio devolve a CVP ao normal', ali.CVP<8, r(ali.CVP,1));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
