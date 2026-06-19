// ===== test28h.node.js — calculadora §11: âncoras + CONFORMÂNCIA × pharm28 =====
'use strict';
const h = require('./model28h.js');
const pharm = require('../m28/pharm28.js');
let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<12) fails.push(n);} };
const EPS=1e-6, eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// — âncoras da calculadora (aritmética de unidades, peso hipotético) —
ok('concentração noradrenalina = 64 mcg/mL', eq(h.concentration('noradrenalina').value, 64));
ok('nora 0,1 mcg/kg/min @70 kg ≈ 6,5625 mL/h', eq(h.infusionRate('noradrenalina',0.1,70), 6.5625));
ok('round-trip dose↔mL/h', eq(h.doseFromRate('noradrenalina', h.infusionRate('noradrenalina',0.2,70), 70), 0.2));
ok('vasopressina NÃO é peso-dependente', h.infusionRate('vasopressina',0.03,50)===h.infusionRate('vasopressina',0.03,120));
ok('titulação monotônica crescente', (function(){ const t=h.titration('noradrenalina',70,5); for(let i=1;i<t.length;i++){ if(t[i].mLh<=t[i-1].mLh) return false; } return true; })());
ok('7 agentes com faixa de dose de referência', Object.keys(h.DRUGS).length===7 && Object.keys(h.DRUGS).every(k=>h.DRUGS[k].doseMin<h.DRUGS[k].doseMax));
ok('segurança operacional cobre extravasamento, desmame, lactato β2', !!(h.SAFETY.extravasamento && h.SAFETY.desmame && h.SAFETY.lactatoB2));
ok('enquadramento §11: referência + protocolo + não-prescrição + peso hipotético', !!(h.FRAMING.referencia && h.FRAMING.protocolo && h.FRAMING.naoPrescricao && h.FRAMING.pesoHipotetico));

// — CONFORMÂNCIA × pharm28 (a calculadora publicada do M28) —
let drift=0;
Object.keys(h.DRUGS).forEach(k=>{
  if(!eq(h.concentration(k).value, pharm.concentration(k).value)) drift++;
  [0.5,1,1.5].forEach(dose=>[50,70,90].forEach(w=>{
    if(!eq(h.infusionRate(k,dose,w), pharm.infusionRate(k,dose,w))) drift++;
    if(!eq(h.doseFromRate(k,10,w), pharm.doseFromRate(k,10,w))) drift++;
  }));
  // faixas de dose batem
  if(!(h.DRUGS[k].doseMin===pharm.DRUGS[k].doseMin && h.DRUGS[k].doseMax===pharm.DRUGS[k].doseMax)) drift++;
});
ok('conformância 28H calculadora === pharm28 (concentração/infusão/dose/faixas)', drift===0);

console.log('m28h · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
