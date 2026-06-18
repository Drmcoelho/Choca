// ===== source/core/ventricle.js — alça PV / Sunagawa (canônica) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). Acoplamento ventrículo-arterial:
//   ESPVR  P = Ees·(V − V0)   ·   reta de Ea  P = Ea·(VDF − V)
//   Ves = (Ea·VDF + Ees·V0)/(Ea+Ees) ; SV = Ees·(VDF−V0)/(Ea+Ees) ; EF ≈ 1/(1+Ea/Ees).
// Forma canônica do model7. Âncoras: CHOQUE.md §2/§5.

var V0  = 10;       // volume de pressão zero da ESPVR (mL)
var V0D = 5;        // intercepto da EDPVR (mL)
var EDPVR_P0 = 1.4, EDPVR_BETA = 0.018;  // diástole exponencial

function ves(edv, Ees, Ea){ return (Ea*edv + Ees*V0)/(Ea+Ees); }
function strokeVolume(edv, Ees, Ea){ return Ees*(edv - V0)/(Ea+Ees); }
function pes(edv, Ees, Ea){ return Ees*Ea*(edv - V0)/(Ea+Ees); }
function ef(edv, Ees, Ea){ return edv>0 ? strokeVolume(edv,Ees,Ea)/edv : 0; }
function coupling(Ees, Ea){ return Ea/Ees; }
function ped(edv){ return EDPVR_P0*(Math.exp(EDPVR_BETA*Math.max(0, edv - V0D)) - 1); }

// Cantos da alça PV (A enche · B abre aórtica · C sístole-final · D relaxa).
function loopCorners(edv, Ees, Ea){
  var Ve = ves(edv,Ees,Ea), Ps = pes(edv,Ees,Ea);
  var pAo = 0.75*Ps;
  return { A:[edv, ped(edv)], B:[edv, pAo], C:[Ve, Ps], D:[Ve, ped(Ve)] };
}
// Trabalho sistólico (mmHg·mL) por shoelace; energia potencial; eficiência SW/PVA.
function strokeWork(edv, Ees, Ea){
  var k=loopCorners(edv,Ees,Ea), p=[k.A,k.B,k.C,k.D], s=0;
  for (var i=0;i<4;i++){ var a=p[i], b=p[(i+1)%4]; s += a[0]*b[1] - b[0]*a[1]; }
  return Math.abs(s)/2;
}
function potentialEnergy(edv, Ees, Ea){ return 0.5*pes(edv,Ees,Ea)*(ves(edv,Ees,Ea)-V0); }
function efficiency(edv, Ees, Ea){ var sw=strokeWork(edv,Ees,Ea); var pe=potentialEnergy(edv,Ees,Ea); return sw/(sw+pe); }

if (typeof module !== 'undefined' && module.exports){
  module.exports = { V0, V0D, EDPVR_P0, EDPVR_BETA,
    ves, strokeVolume, pes, ef, coupling, ped, loopCorners, strokeWork, potentialEnergy, efficiency };
}
