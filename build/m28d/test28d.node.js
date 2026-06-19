// ===== test28d.node.js — inotrópicos: âncoras + CONFORMÂNCIA × model28 =====
'use strict';
const d = require('./model28d.js');
const m28 = require('../m28/model28.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// paciente cardiogênico: bomba fraca, RVS compensatória alta
const cardio={ rvs:17, pump:0.32, preload:1.05 };

// — âncoras —
ok('todos os inotrópicos sobem o débito no cardiogênico', d.compareInotropes(cardio).every(x=>x.dCO>0));
ok('milrinona é inodilatador (baixa a RVS)', (function(){ const m=d.compareInotropes(cardio).find(x=>x.agent==='milrinona'); return m.dRVS<0 && m.inodilator; })());
ok('dobutamina sobe o débito (inotrópico β1)', d.compareInotropes(cardio).find(x=>x.agent==='dobutamina').dCO>0);
ok('adrenalina é vaso-inotrópica (sobe a RVS); dobutamina baixa a RVS', d.terms(d.AGENTS.adrenalina).dRVS>0 && d.terms(d.AGENTS.dobutamina).dRVS<0);
ok('noradrenalina sozinha NÃO é inotrópico primário (sobe pouco a contratilidade)', d.applyDrug(cardio,d.AGENTS.noradrenalina).dInotropy < d.applyDrug(cardio,d.AGENTS.dobutamina).dInotropy);
ok('PDE-3 dá inotropia sem β (sem taquicardia direta)', eq(d.applyDrug(cardio,d.AGENTS.milrinona).dHR, 0));

// — CONFORMÂNCIA × model28 —
let drift=0;
const SS=[0,0.3,0.6,1];
SS.forEach(a1=>SS.forEach(b1=>SS.forEach(b2=>SS.forEach(pde=>{
  const drug={a1:a1,b1:b1,b2:b2,v1:0,pde:pde};
  const x=d.terms(drug), y=m28.terms(drug);
  if(!eq(x.dRVS,y.dRVS)||!eq(x.dInotropy,y.dInotropy)||!eq(x.dHR,y.dHR)) drift++;
}))));
ok('conformância 28D.terms === model28.terms', drift===0);
[cardio,{rvs:7,pump:0.78,preload:0.95},{rvs:14,pump:0.6,preload:0.9}].forEach(p=>{
  Object.keys(d.AGENTS).forEach(k=>{ const x=d.applyDrug(p,d.AGENTS[k]), y=m28.applyDrug(p,m28.AGENTS[k]||d.AGENTS[k]);
    if(!eq(x.CO,y.CO)||!eq(x.PAM,y.PAM)||!eq(x.o2balance,y.o2balance)) drift++; });
});
ok('conformância 28D.applyDrug === model28.applyDrug (CO/PAM/o2balance)', drift===0);

console.log('m28d · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
