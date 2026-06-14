const M=require('./model24.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const f=M.cardiopulm;

console.log('— LINHA DE BASE —');
const N=f({});
ok('débito basal passivo ≈ 5,5', near(N.CO,5.5,0.5), r(N.CO,2));
ok('PIT média positiva no passivo com PEEP', N.meanITP>0, r(N.meanITP,1));

console.log('— PIT e RETORNO VENOSO —');
ok('PEEP sobe a PIT média', f({peep:15}).meanITP > N.meanITP, r(f({peep:15}).meanITP,1));
ok('PEEP derruba o retorno venoso', f({peep:15}).VR < N.VR, r(N.VR,1)+'→'+r(f({peep:15}).VR,1));
ok('esforço espontâneo derruba a PIT e sobe o retorno', f({effort:0.8}).meanITP<N.meanITP && f({effort:0.8}).VR>N.VR);

console.log('\n— CURVA U DA PVR (mínima perto da PEEP ótima ~8) —');
ok('PVR mínima na PEEP ótima', f({peep:8}).PVR < f({peep:0}).PVR && f({peep:8}).PVR < f({peep:16}).PVR, 'p0 '+r(f({peep:0}).PVR,2)+' · p8 '+r(f({peep:8}).PVR,2)+' · p16 '+r(f({peep:16}).PVR,2));
ok('atelectasia (PEEP baixa) e sobredistensão (PEEP alta) sobem a PVR', f({peep:0}).PVR>f({peep:8}).PVR && f({peep:20}).PVR>f({peep:8}).PVR);
ok('curva é simétrica em torno do ótimo', near(f({peep:4}).PVR, f({peep:12}).PVR, 0.05));

console.log('\n— VE QUE FALHA: a pressão positiva AJUDA (descarrega a pós-carga) —');
const LV=function(o){return Object.assign({lvFail:0.8},o);};
ok('PIT positiva reduz a pós-carga de VE', f(LV({peep:12})).LVafterload < f(LV({peep:0})).LVafterload);
ok('+PEEP sobe o débito no VE que falha', f(LV({peep:12})).CO > f(LV({peep:0})).CO, r(f(LV({peep:0})).CO,2)+'→'+r(f(LV({peep:12})).CO,2));
ok('esforço espontâneo PIORA o VE que falha (pós-carga↑)', f(LV({effort:0.8,peep:0})).CO < f(LV({peep:0})).CO);
const vrLV=M.ventResponse({lvFail:0.8});
ok('resposta VE: espontâneo < passivo < PEEP', vrLV.espontaneo < vrLV.passivo && vrLV.passivo < vrLV.peep, 'esp '+r(vrLV.espontaneo,2)+' pas '+r(vrLV.passivo,2)+' peep '+r(vrLV.peep,2));
ok('PEEP ótima do VE que falha é alta (≥10)', M.optimalPeep({lvFail:0.8}).peep>=10, M.optimalPeep({lvFail:0.8}).peep);

console.log('\n— VD QUE FALHA: a pressão positiva PREJUDICA (PVR↑, pré-carga↓) —');
const RV=function(o){return Object.assign({rvFail:0.8},o);};
ok('rvFail eleva a PVR de base', f(RV({})).PVR > f({}).PVR, r(f(RV({})).PVR,1));
ok('o VD é intolerante à pós-carga (ejeção cai)', f(RV({})).ejectRV < 1, r(f(RV({})).ejectRV,2));
ok('+PEEP alta DERRUBA o débito no VD que falha', f(RV({peep:14})).CO < f(RV({peep:0})).CO, r(f(RV({peep:0})).CO,2)+'→'+r(f(RV({peep:14})).CO,2));
const vrRV=M.ventResponse({rvFail:0.8});
ok('resposta VD: PEEP < passivo (prejudica)', vrRV.peep < vrRV.passivo, 'pas '+r(vrRV.passivo,2)+' peep '+r(vrRV.peep,2));
ok('PEEP ótima do VD que falha é baixa/moderada (≤8)', M.optimalPeep({rvFail:0.8}).peep<=8, M.optimalPeep({rvFail:0.8}).peep);

console.log('\n— A PÉROLA · o MESMO botão, efeito OPOSTO —');
const dLV = f(LV({peep:12})).CO - f(LV({peep:0})).CO;
const dRV = f(RV({peep:12})).CO - f(RV({peep:0})).CO;
ok('+PEEP ajuda o VE (ΔCO > 0) e prejudica o VD (ΔCO < 0)', dLV>0 && dRV<0, 'ΔVE '+r(dLV,2)+' · ΔVD '+r(dRV,2));
ok('dominantVentricle classifica VE/VD/none', M.dominantVentricle({lvFail:0.8})==='lv' && M.dominantVentricle({rvFail:0.8})==='rv' && M.dominantVentricle({})==='none');

console.log('\n— ACOPLAMENTO EM SÉRIE —');
ok('débito = min(VD, VE)', near(N.CO, Math.min(N.RVout,N.LVcap), 1e-9));
ok('o ventrículo mais fraco limita (VE no LVfail)', f(LV({})).limiting==='VE');
ok('o VD limita quando o VD falha', f(RV({})).limiting==='VD');

console.log('\n— ALAVANCAS (mecanismo, sem dose) —');
ok('applyPEEP sobe a PIT', f(M.applyPEEP({})).meanITP > N.meanITP);
ok('applyPEEP ajuda o VE; no VD, o espontâneo bate a pressão positiva', f(M.applyPEEP(LV({}))).CO > f(LV({})).CO && f(M.applySpontaneous(RV({}))).CO > f(M.applyPEEP(RV({}))).CO);

console.log('\n— ROBUSTEZ / LIMITES —');
ok('sem argumento / null não lançam', (function(){try{return !isNaN(f().CO)&&!isNaN(f(null).CO);}catch(e){return false;}})());
ok('NaN/string nas entradas não propaga (clampv resiliente)', (function(){try{var z=f({peep:NaN,effort:'x',lvFail:undefined,rvFail:NaN,volemia:'abc'});return [z.CO,z.PVR,z.meanITP,z.VR,z.LVcap].every(v=>typeof v==='number'&&!isNaN(v));}catch(e){return false;}})());
const ABS=f({peep:99,effort:9,lvFail:5,rvFail:-2,volemia:8});
ok('entradas absurdas: sem NaN', [ABS.CO,ABS.PVR,ABS.VR,ABS.LVcap,ABS.RVout,ABS.meanITP].every(v=>typeof v==='number'&&!isNaN(v)));
ok('PVR e débito clampados (finitos, não-negativos)', ABS.PVR>0 && ABS.CO>=0 && ABS.RVout>=0);
ok('PEEP clampada (≤22)', ABS.peep<=22, ABS.peep);

console.log('\n— RECONCILIAÇÃO: enxertos (a CVP engana · os 4 termos · fenótipo) —');
ok('A PÉROLA: a CVP engana sob PEEP (CVP medida↑ enquanto o retorno↓)', M.cvpEngana({})===true && M.cvpEngana({volemia:0.3,peep:12})===true);
ok('cvpEngana sem argumento/null não lança', (function(){try{return typeof M.cvpEngana()==='boolean' && typeof M.cvpEngana(null)==='boolean';}catch(e){return false;}})());
const ptLV=M.pressaoTermos({lvFail:0.8}), ptRV=M.pressaoTermos({rvFail:0.8});
ok('4 termos: a pressão positiva corta a pré-carga (VR↓)', ptLV.vr.com<ptLV.vr.sem, r(ptLV.vr.sem,1)+'→'+r(ptLV.vr.com,1));
ok('4 termos: a pressão positiva descarrega o VE (pós-carga transmural↓)', ptLV.lvafter.com<ptLV.lvafter.sem, r(ptLV.lvafter.sem,0)+'→'+r(ptLV.lvafter.com,0));
ok('4 termos: a CVP medida (RAP) SOBE enquanto o retorno CAI — a armadilha', ptLV.rap.com>ptLV.rap.sem && ptLV.vr.com<ptLV.vr.sem, 'RAP '+r(ptLV.rap.sem,1)+'→'+r(ptLV.rap.com,1));
ok('4 termos: ΔDC net OPOSTO por ventrículo (VE↑ × VD↓)', ptLV.deltaCO>0 && ptRV.deltaCO<0, 'VE '+r(ptLV.deltaCO,2)+' × VD '+r(ptRV.deltaCO,2));
ok('pressaoTermos sem argumento/null não lança', (function(){try{return !isNaN(M.pressaoTermos().deltaCO) && !isNaN(M.pressaoTermos(null).deltaCO);}catch(e){return false;}})());
ok('fenótipo: normal / VE congesto / VD sobrecarga / pré-carga-dep', M.fenotipo({})==='normal' && M.fenotipo({lvFail:0.8})==='ve_congesto' && M.fenotipo({rvFail:0.8,peep:14})==='vd_sobrecarga' && M.fenotipo({volemia:0.2,peep:12})==='preload_dep');
ok('fenótipo sem argumento/null não lança e dá string', (function(){try{return typeof M.fenotipo()==='string' && typeof M.fenotipo(null)==='string';}catch(e){return false;}})());

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
