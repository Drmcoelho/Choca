// ===== test28g.node.js — fenótipos: âncoras de geometria + CONFORMÂNCIA × pharmacodynamics =====
'use strict';
const g = require('./model28g.js');
const pd = require('../../source/core/pharmacodynamics.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// — âncoras: cada fenótipo é uma geometria; o combo a corrige —
ok('6 fenótipos no catálogo', g.PHENO_ORDER.length===6 && g.PHENO_ORDER.every(k=>!!g.PHENOTYPES[k]));
ok('séptico quente: o combo sobe a PAM (RVS era o problema)', g.geometry('septico_quente').dPAM>0);
ok('séptico baixo débito: o combo sobe a PAM E o débito', (function(){ const x=g.geometry('septico_baixo_debito'); return x.dPAM>0 && x.dDC>0; })());
ok('séptico baixo débito usa nora + dobutamina', g.geometry('septico_baixo_debito').combo.indexOf('noradrenalina')>=0 && g.geometry('septico_baixo_debito').combo.indexOf('dobutamina')>=0);
ok('cardiogênico frio: a dobutamina sobe o débito', g.geometry('cardiogenico_frio').dDC>0);
ok('anafilaxia: combo é adrenalina (4 termos)', g.geometry('anafilaxia').combo[0]==='adrenalina');
ok('todo fenótipo tem leito de base e nota', g.PHENO_ORDER.every(k=>{ const p=g.PHENOTYPES[k]; return p.base && p.base.rvs>0 && p.nota.length>10; }));

// — CONFORMÂNCIA × pharmacodynamics (effect + profile) —
let drift=0;
['noradrenalina','adrenalina','dobutamina','dopamina','fenilefrina','vasopressina','milrinona'].forEach(k=>{
  [0,0.5,1].forEach(fr=>{ const dose=g.doseAt(k,fr); const a=g.effect(k,dose), b=pd.effect(k,dose);
    g.TERMS.forEach(t=>{ if(!eq(a[t],b[t])) drift++; }); });
});
ok('conformância 28G.effect === pharmacodynamics.effect', drift===0);
g.PHENO_ORDER.forEach(key=>{ const ph=g.PHENOTYPES[key];
  const list=ph.combo.map(d=>({drug:d,dose:g.doseAt(d,0.5)}));
  const a=g.profile(g.compose(list), ph.base), b=pd.profile(pd.compose(list), ph.base);
  if(!eq(a.PAM,b.PAM)||!eq(a.DC,b.DC)||!eq(a.RVS,b.RVS)) drift++;
});
ok('conformância 28G.profile === pharmacodynamics.profile (todos os fenótipos)', drift===0);

console.log('m28g · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
