// ===== test28c.node.js — vasopressina: âncoras + CONFORMÂNCIA × model28 =====
'use strict';
const c = require('./model28c.js');
const m28 = require('../m28/model28.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,co)=>{ if(co){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

const X = c.contrast();
ok('vasopressina sobe a RVS (V1)', X.vasopressina.RVS>5);
ok('vasopressina NÃO taquicardiza (FC≈0)', X.semTaquicardia && eq(X.vasopressina.FC,0));
ok('vasopressina sem custo metabólico β', X.semCustoBeta && eq(X.vasopressina.metabolic,0));
ok('vasopressina poupa catecolamina (pressão não-adrenérgica)', X.poupaCatecolamina && X.vasopressina.adrenergic===false);
ok('vasopressina é dose FIXA (não por peso)', c.AGENTS.vasopressina.weightBased===false);
ok('noradrenalina, em contraste, é adrenérgica e por peso', X.noradrenalina.adrenergic===true && c.AGENTS.noradrenalina.weightBased===true);
ok('ambas sobem a RVS, mas só a nora mexe na FC', X.vasopressina.RVS>0 && X.noradrenalina.RVS>0 && Math.abs(X.noradrenalina.FC)>Math.abs(X.vasopressina.FC));

// CONFORMÂNCIA × model28
let drift=0;
[0,0.5,1].forEach(v1=>[0,0.5,1].forEach(a1=>[0,0.5,1].forEach(b1=>{
  const drug={a1:a1,b1:b1,b2:0,v1:v1,pde:0}; const x=c.terms(drug), y=m28.terms(drug);
  if(!eq(x.dRVS,y.dRVS)||!eq(x.dInotropy,y.dInotropy)||!eq(x.dHR,y.dHR)) drift++;
})));
ok('conformância 28C.terms === model28.terms', drift===0);
const mv=m28.AGENTS.vasopressina;
ok('perfil da vasopressina bate com model28 (V1)', c.AGENTS.vasopressina.v1===mv.v1 && c.AGENTS.vasopressina.a1===mv.a1 && c.AGENTS.vasopressina.b1===mv.b1);

console.log('m28c · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
