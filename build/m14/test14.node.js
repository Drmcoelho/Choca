const M=require('./model14.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— LINHA DE BASE (normovolemia) —');
const B=M.hemoState({loss:0});
ok('DC ≈ 5,0 L/min', near(B.DC,5.0,0.08), r(B.DC));
ok('PVC ≈ 2,0 mmHg', near(B.PVC,2.0,0.2), r(B.PVC));
ok('MAP ≈ 87 mmHg', near(B.MAP,87,2), r(B.MAP));
ok('FC 75 · SI ≈ 0,66', near(B.HR,75,1)&&near(B.SI,0.66,0.05), 'SI '+r(B.SI));
ok('lactato basal 1,0', near(B.lactate,1.0,0.05));
ok('classe compensado', M.classeHemo(B)==='compensado');

console.log('\n— A PA MANTIDA, O SI JÁ DENUNCIA (o engano da compensação) —');
const L10=M.hemoState({loss:0.10}), L20=M.hemoState({loss:0.20});
ok('perda 10%: MAP ainda mantida (>85)', L10.MAP>85, r(L10.MAP));
ok('perda 10%: SI já elevado (>0,85) — detector precoce', L10.SI>0.85, r(L10.SI));
ok('perda 10%: lactato ainda normal', near(L10.lactate,1.0,0.05));
ok('pressão de pulso ESTREITA com a perda', L20.PP < B.PP-8, r(L20.PP)+' vs '+r(B.PP));
ok('perda 20% ainda classe limítrofe (PA defendida)', M.classeHemo(L20)==='limitrofe');

console.log('\n— A DESCOMPENSAÇÃO (a PA desaba) —');
const L40=M.hemoState({loss:0.40});
ok('perda 40%: MAP desaba (<60)', L40.MAP<60, r(L40.MAP));
ok('perda 40%: DC baixo (<2,8)', L40.DC<2.8, r(L40.DC));
ok('perda 40%: lactato elevado (>2,5)', L40.lactate>2.5, r(L40.lactate));
ok('perda 40%: SI alto (>2,0)', L40.SI>2.0, r(L40.SI));
ok('perda 45% classe colapso', M.classeHemo(M.hemoState({loss:0.45}))==='colapso');

console.log('\n— MONOTONIAS (Guyton: Pmsf↓ → RV↓ → DC↓) —');
ok('Pmsf cai com a perda', M.hemoState({loss:0.3}).Pmsf < B.Pmsf, r(M.hemoState({loss:0.3}).Pmsf));
ok('DC cai monotonicamente', M.hemoState({loss:0.1}).DC>M.hemoState({loss:0.3}).DC && M.hemoState({loss:0.3}).DC>M.hemoState({loss:0.5}).DC);
ok('MAP cai após o platô', M.hemoState({loss:0.25}).MAP > M.hemoState({loss:0.40}).MAP);
ok('SI sobe com a perda', M.hemoState({loss:0.3}).SI > L10.SI);

console.log('\n— COMPENSAÇÃO EMBOTADA (idoso/β-bloqueio) cai antes —');
ok('mesma perda, MAP menor com reserva baixa', M.hemoState({loss:0.20,compReserve:0.3}).MAP < L20.MAP, r(M.hemoState({loss:0.20,compReserve:0.3}).MAP)+' < '+r(L20.MAP));

console.log('\n— PRESSOR GANHA TEMPO × VOLUME CORRIGE (mecanismo, sem dose) —');
const base40=M.hemoState({loss:0.4});
const pres40=M.hemoState({loss:0.4,pressor:0.9});
const vol40 =M.hemoState({loss:0.4,repos:0.35});
ok('pressor PROPÕE a MAP (sobe vs base)', pres40.MAP>base40.MAP+10, r(pres40.MAP)+' vs '+r(base40.MAP));
ok('mas o DC (fluxo) quase não sobe', pres40.DC < vol40.DC-1.5, 'pressor '+r(pres40.DC)+' · volume '+r(vol40.DC));
ok('e o lactato persiste sob pressor', pres40.lactate>1.5, r(pres40.lactate));
ok('volume RESTAURA o DC (Pmsf→VR→DC)', vol40.DC>4.5 && near(vol40.lactate,1.0,0.1), 'DC '+r(vol40.DC)+' lac '+r(vol40.lactate));
ok('volume sobe a Pmsf; pressor quase não', (vol40.Pmsf - base40.Pmsf) > 3*(pres40.Pmsf - base40.Pmsf), 'ΔPmsf vol '+r(vol40.Pmsf-base40.Pmsf)+' vs pressor '+r(pres40.Pmsf-base40.Pmsf));

console.log('\n— sweepLoss (curva da PA) —');
const sw=M.sweepLoss({},60,0.5);
ok('60 pontos', sw.length===60);
ok('platô precoce: MAP(10%) perto do basal (±6)', near(sw[Math.round(0.10/0.5*59)].MAP, sw[0].MAP, 6));
ok('despenca no fim: MAP(45%) << basal', sw[Math.round(0.45/0.5*59)].MAP < sw[0].MAP-35);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
