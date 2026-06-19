// ===== test28e.node.js — 28E: âncoras fluxo×pressão + CONFORMÂNCIA × pharmacodynamics =====
'use strict';
const e = require('./model28e.js');
const pd = require('../../source/core/pharmacodynamics.js');
const m9 = require('../m9/model9.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// — a lição do 28E: à MESMA fração de dose, nora ganha PRESSÃO, dobuta ganha FLUXO —
const baseVaso={ dc:5.0, rvs:600, pvc:5 };
const pNora=e.profile(e.compose([{drug:'noradrenalina',dose:e.doseAt('noradrenalina',0.5)}]), baseVaso);
const pDobu=e.profile(e.compose([{drug:'dobutamina',dose:e.doseAt('dobutamina',0.5)}]), baseVaso);
const pBoth=e.profile(e.compose([{drug:'dobutamina',dose:e.doseAt('dobutamina',0.5)},{drug:'noradrenalina',dose:e.doseAt('noradrenalina',0.5)}]), baseVaso);
ok('nora ganha PRESSÃO: PAM(nora) > PAM(dobu)', pNora.PAM > pDobu.PAM);
ok('dobuta ganha FLUXO: DC(dobu) > DC(nora)', pDobu.DC > pNora.DC);
ok('somar nora à dobuta recupera a PAM (chão vascular)', pBoth.PAM > pDobu.PAM);
ok('PAM é computada pela equação do m9', eq(pBoth.PAM, m9.pam(pBoth.DC, pBoth.RVS, 5)));
ok('dobutamina baixa a RVS (β2)', e.effect('dobutamina', e.doseAt('dobutamina',1)).RVS < 0);
ok('dobutamina sobe a contratilidade (β1)', e.effect('dobutamina', e.doseAt('dobutamina',1)).contr > 0);

// — CONFORMÂNCIA byte-a-byte × source/core/pharmacodynamics —
let drift=0;
['noradrenalina','adrenalina','dobutamina','dopamina','fenilefrina','vasopressina','milrinona'].forEach(k=>{
  [0,0.25,0.5,0.75,1].forEach(f=>{
    const dose=e.doseAt(k,f); const a=e.effect(k,dose), b=pd.effect(k,dose);
    e.TERMS.forEach(t=>{ if(!eq(a[t],b[t])) drift++; });
  });
});
ok('conformância 28E.effect === pharmacodynamics.effect (7 agentes × 5 frações)', drift===0);
let dProf=0;
[{dc:5,rvs:600},{dc:4,rvs:1100},{dc:6,rvs:900}].forEach(base=>{
  ['noradrenalina','dobutamina','milrinona'].forEach(k=>{
    const net=e.compose([{drug:k,dose:e.doseAt(k,0.6)}]);
    const a=e.profile(net,base), b=pd.profile(net,base);
    if(!eq(a.PAM,b.PAM)||!eq(a.DC,b.DC)||!eq(a.RVS,b.RVS)) dProf++;
  });
});
ok('conformância 28E.profile === pharmacodynamics.profile', dProf===0);

console.log('m28e · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
