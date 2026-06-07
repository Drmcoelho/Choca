const M=require('./model2.js');
let oks=0,falhas=0;
const r=(x,n=4)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— CURVA PADRÃO (âncoras CHOQUE §2) —');
ok('S(26,8) ≈ 0,50 (P50)', near(M.severinghausStd(26.8),0.5,0.01), r(M.severinghausStd(26.8)));
ok('S(40) ≈ 0,75 (SvO2 normal)', near(M.severinghausStd(40),0.75,0.01), r(M.severinghausStd(40)));
ok('S(100) ≈ 0,977', near(M.severinghausStd(100),0.977,0.005), r(M.severinghausStd(100)));
ok('S(64) ≈ 0,92 (ombro/caso-semente)', near(M.severinghausStd(64),0.92,0.01), r(M.severinghausStd(64)));
ok('S monotônica crescente', M.severinghausStd(30)<M.severinghausStd(60) && M.severinghausStd(60)<M.severinghausStd(90));

console.log('\n— P50 EM CONDIÇÕES PADRÃO —');
ok('p50(7,40·37·5) = 26,8', near(M.p50(7.4,40,37,5),26.8,1e-9), r(M.p50(7.4,40,37,5),3));

console.log('\n— EFEITO BOHR (direção do desvio) —');
ok('acidose (pH7,2) → P50 sobe (direita)', M.p50(7.2,40,37,5) > 26.8, r(M.p50(7.2,40,37,5),2));
ok('alcalose (pH7,6) → P50 cai (esquerda)', M.p50(7.6,40,37,5) < 26.8, r(M.p50(7.6,40,37,5),2));
ok('febre (40°C) → P50 sobe', M.p50(7.4,40,40,5) > 26.8, r(M.p50(7.4,40,40,5),2));
ok('hipotermia (33°C) → P50 cai', M.p50(7.4,40,33,5) < 26.8, r(M.p50(7.4,40,33,5),2));
ok('CO2↑ (60) → P50 sobe', M.p50(7.4,60,37,5) > 26.8, r(M.p50(7.4,60,37,5),2));
ok('2,3-DPG↑ (8) → P50 sobe', M.p50(7.4,40,37,8) > 26.8, r(M.p50(7.4,40,37,8),2));

console.log('\n— SATURAÇÃO EM PO2 FIXO E OFFLOADING —');
ok('desvio à direita → sat menor em PO2=40', M.satCond(40,7.2,40,37,5) < M.severinghausStd(40), r(M.satCond(40,7.2,40,37,5)));
ok('desvio à esquerda → sat maior em PO2=40', M.satCond(40,7.6,40,37,5) > M.severinghausStd(40), r(M.satCond(40,7.6,40,37,5)));
const offStd = M.offloading(95,40,7.4,40,37,5);
const offAcid= M.offloading(95,40,7.2,40,37,5);
ok('Bohr facilita offloading (acidose libera mais A−V)', offAcid > offStd, r(offStd,3)+'→'+r(offAcid,3));
ok('offloading positivo no padrão', offStd>0, r(offStd,3));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
