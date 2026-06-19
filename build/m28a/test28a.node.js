// ===== test28a.node.js — gramática 28A: âncoras + CONFORMÂNCIA × model28 =====
'use strict';
const g = require('./model28a.js');
const m28 = require('../m28/model28.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// — âncoras da gramática (receptor → termo) —
ok('α1 puro → RVS↑ e FC↓ (reflexo), sem inotropia', (function(){ const t=g.terms({a1:1}); return t.dRVS>0 && t.dHR<0 && eq(t.dInotropy,0); })());
ok('β1 puro → contratilidade↑ e FC↑, RVS≈0', (function(){ const t=g.terms({b1:1}); return t.dInotropy>0 && t.dHR>0 && eq(t.dRVS,0); })());
ok('β2 puro → RVS↓ (vasodilata)', g.terms({b2:1}).dRVS<0);
ok('V1 puro → RVS↑ sem taquicardia', (function(){ const t=g.terms({v1:1}); return t.dRVS>0 && eq(t.dHR,0); })());
ok('PDE-3 → inodilatador: contratilidade↑ e RVS↓', (function(){ const t=g.terms({pde:1}); return t.dInotropy>0 && t.dRVS<0; })());
ok('dominante: noradrenalina é vasopressor (rvs)', g.dominantTerm(g.AGENTS.noradrenalina)==='rvs');
ok('dominante: dobutamina é inotrópico', g.dominantTerm(g.AGENTS.dobutamina)==='inotropy');
ok('dominante: vasopressina é vasopressor (rvs)', g.dominantTerm(g.AGENTS.vasopressina)==='rvs');
ok('gloss cobre os 5 receptores', ['a1','b1','b2','v1','pde'].every(r=>g.gloss(r).length>8));

// — CONFORMÂNCIA × model28 (mesma física, sem modelo divergente) —
let drift=0;
const SS=[0,0.25,0.5,0.75,1];
SS.forEach(a1=>SS.forEach(b1=>SS.forEach(b2=>SS.forEach(v1=>SS.forEach(pde=>{
  const d={a1:a1,b1:b1,b2:b2,v1:v1,pde:pde};
  const x=g.terms(d), y=m28.terms(d);
  if(!eq(x.dRVS,y.dRVS)||!eq(x.dInotropy,y.dInotropy)||!eq(x.dHR,y.dHR)) drift++;
})))));
ok('conformância 28A.terms === model28.terms (bateria 5⁵)', drift===0);
Object.keys(g.AGENTS).forEach(k=>{ if(g.dominantTerm(g.AGENTS[k])!==m28.dominantTerm(m28.AGENTS[k])) drift++; });
ok('conformância 28A.AGENTS/dominantTerm === model28', drift===0);

console.log('m28a · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
