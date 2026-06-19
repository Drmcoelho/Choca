// ===== test28f.node.js — inodilatadores: âncoras (alça PV) + CONFORMÂNCIA × model7 =====
'use strict';
const f = require('./model28f.js');
const m7 = require('../m7/model7.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-9, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// ventrículo FRACO (Ees baixa) com pós-carga alta
const weak={ edv:150, Ees:1.2, Ea:3.0 };

// — âncoras: baixar a pós-carga (Ea) sobe o SV no ventrículo fraco —
const sweep=f.afterloadSweep(weak.edv, weak.Ees, [3.0,2.0,1.0]);
ok('baixar Ea sobe o SV (vasodilatador ajuda a bomba fraca)', sweep[2].SV>sweep[1].SV && sweep[1].SV>sweep[0].SV);
ok('nitroprussiato (vasodilatador) sobe o SV vs base', f.apply(weak,'nitroprussiato').SV > f.strokeVolume(weak.edv,weak.Ees,weak.Ea));
ok('milrinona (inodilatador) sobe Ees E baixa Ea → SV maior', (function(){ const r=f.apply(weak,'milrinona'); return r.Ees>weak.Ees && r.Ea<weak.Ea && r.SV>f.strokeVolume(weak.edv,weak.Ees,weak.Ea); })());
ok('nitroglicerina (venodilatador) reduz a pré-carga (EDV) e a pressão de enchimento', (function(){ const r=f.apply(weak,'nitroglicerina'); return r.edv<weak.edv && r.pedFill<f.ped(weak.edv); })());
ok('inodilatador melhora o acoplamento (Ea/Ees cai)', f.apply(weak,'milrinona').coupling < f.coupling(weak.Ees,weak.Ea));

// — CONFORMÂNCIA × model7 —
let drift=0;
[90,120,150,180].forEach(edv=>[1.2,2.5,4].forEach(Ees=>[1,2,3.5].forEach(Ea=>{
  if(!eq(f.strokeVolume(edv,Ees,Ea), m7.strokeVolume(edv,Ees,Ea))) drift++;
  if(!eq(f.ves(edv,Ees,Ea), m7.ves(edv,Ees,Ea))) drift++;
  if(!eq(f.ef(edv,Ees,Ea), m7.ef(edv,Ees,Ea))) drift++;
  if(!eq(f.ped(edv), m7.ped(edv))) drift++;
})));
ok('conformância 28F (ves/SV/EF/EDPVR) === model7', drift===0);

console.log('m28f · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
