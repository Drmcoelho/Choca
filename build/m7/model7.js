// ===== model7.js — Pós-carga & a alça pressão-volume (Sunagawa) · PERFUNDE·CHOCA módulo 7 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §2/§5 / modulos.md §7.
//
// O FRAMEWORK (Sunagawa/Suga): o ponto SÍSTOLE-FINAL é a INTERSEÇÃO de duas retas:
//   ESPVR : P = Ees·(V − V0)        contratilidade (inclinação Ees, mmHg/mL)
//   reta de Ea : P = Ea·(VDF − V)   pós-carga efetiva (elastância arterial)
// Igualando → Ves = (Ea·VDF + Ees·V0)/(Ea+Ees).
//   SV  = VDF − Ves = Ees·(VDF − V0)/(Ea+Ees)
//   Pes = Ees·(Ves − V0) = Ea·SV = Ees·Ea·(VDF − V0)/(Ea+Ees)
// A SACADA: EF = SV/VDF ≈ 1/(1 + Ea/Ees)  →  a fração de ejeção É a leitura do ACOPLAMENTO.
// Pós-carga NÃO é a PA: é a Ea (carga contra a ejeção). Baixar Ea no coração fraco SOBE o SV.

var V0  = 10;       // volume de pressão zero da ESPVR (mL)
var V0D = 5;        // intercepto da EDPVR (mL)
var EDPVR_P0 = 1.4, EDPVR_BETA = 0.018;  // diástole exponencial (mesma família do módulo 6)

// Volume sístole-final (mL): interseção ESPVR × reta de Ea.
function ves(edv, Ees, Ea){ return (Ea*edv + Ees*V0)/(Ea+Ees); }
// Volume sistólico ejetado (mL).
function strokeVolume(edv, Ees, Ea){ return Ees*(edv - V0)/(Ea+Ees); }
// Pressão sístole-final (mmHg) — o ponto na ESPVR (= Ea·SV).
function pes(edv, Ees, Ea){ return Ees*Ea*(edv - V0)/(Ea+Ees); }
// Fração de ejeção (a leitura do acoplamento).
function ef(edv, Ees, Ea){ return edv>0 ? strokeVolume(edv,Ees,Ea)/edv : 0; }
// Acoplamento ventrículo-arterial.
function coupling(Ees, Ea){ return Ea/Ees; }
// Pressão diastólica final (EDPVR) no VDF.
function ped(edv){ return EDPVR_P0*(Math.exp(EDPVR_BETA*Math.max(0, edv - V0D)) - 1); }

// Cantos da alça PV (4 vértices) para desenho e área.
//   A = enche até VDF na EDPVR           (edv, ped)
//   B = abre a aórtica (pressão diast.)  (edv, pAo)
//   C = sístole-final na ESPVR           (ves, pes)
//   D = relaxa isovolumicamente          (ves, ped(ves))
// pAo (diastólica arterial) aproximada como fração de Pes (didático).
function loopCorners(edv, Ees, Ea){
  var Ve = ves(edv,Ees,Ea), Ps = pes(edv,Ees,Ea);
  var pAo = 0.75*Ps;                       // aproximação da diastólica arterial
  return { A:[edv, ped(edv)], B:[edv, pAo], C:[Ve, Ps], D:[Ve, ped(Ve)] };
}
// Área da alça (trabalho sistólico, mmHg·mL) por shoelace dos 4 cantos A→B→C→D.
function strokeWork(edv, Ees, Ea){
  var k=loopCorners(edv,Ees,Ea), p=[k.A,k.B,k.C,k.D], s=0;
  for (var i=0;i<4;i++){ var a=p[i], b=p[(i+1)%4]; s += a[0]*b[1] - b[0]*a[1]; }
  return Math.abs(s)/2;
}
// Energia potencial (triângulo sob a ESPVR) e eficiência mecânica SW/PVA.
function potentialEnergy(edv, Ees, Ea){ return 0.5*pes(edv,Ees,Ea)*(ves(edv,Ees,Ea)-V0); }
function efficiency(edv, Ees, Ea){ var sw=strokeWork(edv,Ees,Ea); var pe=potentialEnergy(edv,Ees,Ea); return sw/(sw+pe); }

if (typeof module!=='undefined' && module.exports){
  module.exports = { V0, ves, strokeVolume, pes, ef, coupling, ped, loopCorners, strokeWork, potentialEnergy, efficiency };
}
