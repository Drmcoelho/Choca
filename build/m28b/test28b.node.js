// ===== test28b.node.js — catecolaminérgicos: âncoras + CONFORMÂNCIA × model28 =====
'use strict';
const b = require('./model28b.js');
const m28 = require('../m28/model28.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

const M = b.matrix();
const get = name => M.find(x=>x.agent===name);

// — âncoras da matriz —
ok('noradrenalina: RVS↑ com FC quase neutra', get('noradrenalina').RVS>5 && Math.abs(get('noradrenalina').FC)<5);
ok('fenilefrina (α1 puro): RVS↑, FC↓ (reflexo), maior pós-carga', get('fenilefrina').RVS>5 && get('fenilefrina').FC<0 && get('fenilefrina').posCarga>=1);
ok('adrenalina: maior custo metabólico e arritmia que a noradrenalina', get('adrenalina').metabolico>get('noradrenalina').metabolico && get('adrenalina').arritmia>get('noradrenalina').arritmia);
ok('dopamina: arritmia maior que a noradrenalina (mais β1)', get('dopamina').arritmia>get('noradrenalina').arritmia);
ok('os 4 agentes sobem a RVS (são vasopressores)', M.every(x=>x.RVS>0));
ok('fenilefrina não sobe o débito (sem β1) — débito ≤ noradrenalina', get('fenilefrina').debito <= get('noradrenalina').debito + 1e-9);

// — CONFORMÂNCIA × model28 —
let drift=0;
const SS=[0,0.4,0.8,1];
SS.forEach(a1=>SS.forEach(b1=>SS.forEach(b2=>{
  const drug={a1:a1,b1:b1,b2:b2,v1:0,pde:0};
  const x=b.terms(drug), y=m28.terms(drug);
  if(!eq(x.dRVS,y.dRVS)||!eq(x.dInotropy,y.dInotropy)||!eq(x.dHR,y.dHR)) drift++;
})));
ok('conformância 28B.terms === model28.terms', drift===0);
['noradrenalina','adrenalina','fenilefrina'].forEach(k=>{
  const a=b.AGENTS[k], m=m28.AGENTS[k];
  if(!(a.a1===m.a1 && a.b1===m.b1 && a.b2===m.b2 && a.v1===m.v1 && a.pde===m.pde)) drift++;
});
ok('perfis dos agentes partilhados batem com model28 (nora/adre/feni)', drift===0);
[{rvs:14,pump:0.7,preload:0.9},{rvs:17,pump:0.5,preload:1.0}].forEach(p=>{
  ['noradrenalina','adrenalina','fenilefrina'].forEach(k=>{ const x=b.applyDrug(p,b.AGENTS[k]), y=m28.applyDrug(p,m28.AGENTS[k]);
    if(!eq(x.CO,y.CO)||!eq(x.PAM,y.PAM)) drift++; });
});
ok('conformância 28B.applyDrug === model28.applyDrug (agentes partilhados)', drift===0);

console.log('m28b · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
