// ===== model16.js — Choque cardiogênico (categoria) · PERFUNDE·CHOCA módulo 16 =====
// A BOMBA QUE FALHA, LIDA NA ALÇA PV. Herda o framework de Sunagawa do módulo 7:
//   ESPVR  P = Ees·(V − V0)      (contratilidade; Ees↓ = a falência)
//   reta Ea P = Ea·(VDF − V)     (pós-carga efetiva)
//   sístole-final = interseção → SV = Ees·(VDF − V0)/(Ea+Ees), EF ≈ 1/(1 + Ea/Ees).
// Acrescenta: congestão retrógrada (pré-carga como PRESSÃO de enchimento → EDV pela EDPVR),
// e A ESPIRAL: DC↓ → perfusão coronária↓ → isquemia → Ees↓ → DC↓ (ponto-fixo iterado).
// Funções PURAS, determinísticas. Âncoras: CHOQUE.md §2/§5 · modulos.md §16.

var V0=10;            // volume de pressão zero da ESPVR (mL) — mesmo do m7
var V0D=5;            // intercepto da EDPVR (mL)
var EDPVR_P0=1.4, EDPVR_BETA=0.018;   // diástole exponencial (mesma família do m6/m7)
var HR0=75;
// Espiral isquêmica (fator saturante: sem isquemia com boa perfusão; runaway só quando ela desaba):
var CPP_ON=28;        // acima desta perfusão coronária (mmHg) não há isquemia (fator 1)
var CPP_LO=6;         // abaixo desta, isquemia máxima (fator no piso)
var ISCH_FLOOR=0.25;  // piso do fator de contratilidade por isquemia extrema
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }

// ---- diástole (EDPVR) e sua inversa: a pré-carga como pressão ----
function ped(edv){ return EDPVR_P0*(Math.exp(EDPVR_BETA*Math.max(0, edv - V0D)) - 1); }   // mmHg no VDF
function edvFromPfill(Pfill){ return V0D + Math.log(Math.max(0,Pfill)/EDPVR_P0 + 1)/EDPVR_BETA; } // mL

// ---- framework de Sunagawa (idêntico ao m7) ----
function ves(edv, Ees, Ea){ return (Ea*edv + Ees*V0)/(Ea+Ees); }
function strokeVolume(edv, Ees, Ea){ return Math.max(0, Ees*(edv - V0)/(Ea+Ees)); }
function pes(edv, Ees, Ea){ return Ea*strokeVolume(edv,Ees,Ea); }     // = Ees·Ea·(VDF−V0)/(Ea+Ees)
function ef(edv, Ees, Ea){ return edv>0 ? strokeVolume(edv,Ees,Ea)/edv : 0; }
function coupling(Ees, Ea){ return Ea/Ees; }
function loopCorners(edv, Ees, Ea){
  var Ve=ves(edv,Ees,Ea), Ps=pes(edv,Ees,Ea), pAo=0.75*Ps;
  return { A:[edv, ped(edv)], B:[edv, pAo], C:[Ve, Ps], D:[Ve, ped(Ve)] };
}
function strokeWork(edv, Ees, Ea){
  var k=loopCorners(edv,Ees,Ea), p=[k.A,k.B,k.C,k.D], s=0;
  for (var i=0;i<4;i++){ var a=p[i], b=p[(i+1)%4]; s += a[0]*b[1]-b[0]*a[1]; }
  return Math.abs(s)/2;
}

// Hemodinâmica num dado Ees efetivo (sem o laço isquêmico).
function hemoAt(Ees, Ea, edv, hr){
  var SV=strokeVolume(edv,Ees,Ea), Ps=pes(edv,Ees,Ea), EF=ef(edv,Ees,Ea);
  var CO=SV*hr/1000;                 // L/min
  var MAP=0.83*Ps;                   // média ~ entre Pes(sistólica) e diastólica (0,75·Pes)
  var DBP=0.75*Ps;                   // diastólica arterial (aprox. do m7)
  var LVEDP=ped(edv);                // = pressão de enchimento (congestão)
  var CPP=Math.max(0, DBP - LVEDP);  // perfusão coronária ≈ diastólica − pressão de enchimento do VE
  return { Ees:Ees, Ea:Ea, edv:edv, hr:hr, SV:SV, ESV:edv-SV, Pes:Ps, EF:EF, CO:CO, MAP:MAP, DBP:DBP, LVEDP:LVEDP, CPP:CPP };
}

// Fator de contratilidade por isquemia: 1 acima de CPP_ON, cai linearmente até o piso em CPP_LO.
// O platô em perfusão boa cria um equilíbrio ESTÁVEL de baixo débito (cardiogênico compensado);
// só quando a CPP cruza o joelho o ponto-fixo dispara a espiral até o colapso.
function ischemiaFactor(CPP){
  if (CPP>=CPP_ON) return 1;
  if (CPP<=CPP_LO) return ISCH_FLOOR;
  return ISCH_FLOOR + (1-ISCH_FLOOR)*(CPP-CPP_LO)/(CPP_ON-CPP_LO);
}

// A ESPIRAL (fenômeno à parte, ILUSTRATIVO — não contamina o estado estacionário do Lab).
// Parte do ponto de operação e itera o ponto-fixo Ees ← EesSet·isquemia(CPP(Ees)): se a
// perfusão coronária inicial já é baixa, a contratilidade cai, a CPP cai, e a espiral corre
// até o colapso; se a perfusão é boa, fica num único ponto estável. Guarda a trajetória.
function spiralRun(EesSet, Ea, edv, hr){
  hr=hr||HR0;
  var Ees=EesSet, traj=[], relax=0.55, last=Ees;
  for (var i=0;i<60;i++){
    var H=hemoAt(Ees, Ea, edv, hr);
    traj.push({ Ees:Ees, CO:H.CO, MAP:H.MAP, CPP:H.CPP });
    var next=Ees + relax*(EesSet*ischemiaFactor(H.CPP) - Ees);
    if (Math.abs(next-Ees)<1e-4){ Ees=next; break; }
    Ees=next;
  }
  var Hf=hemoAt(Ees,Ea,edv,hr);
  return { traj:traj, EesEnd:Ees, COend:Hf.CO, MAPend:Hf.MAP,
           collapses:(Ees < EesSet-0.03), steps:traj.length };
}

// Estado estacionário dado o cenário do Lab (no Ees AJUSTADO — sem laço isquêmico).
// p = { Ees (contratilidade), Ea (pós-carga), Pfill (pré-carga/enchimento mmHg), hr }
function cardioState(p){
  var Ea=p.Ea, Ees=p.Ees, hr=p.hr||HR0, Pfill=(p.Pfill===undefined?10:p.Pfill);
  var edv=edvFromPfill(Pfill);
  var H=hemoAt(Ees, Ea, edv, hr);
  var sp=spiralRun(Ees, Ea, edv, hr);
  H.Pfill=Pfill; H.coupling=coupling(Ees, Ea); H.SW=strokeWork(edv, Ees, Ea);
  H.corners=loopCorners(edv, Ees, Ea);
  H.spiralRisk=sp.collapses; H.spiralEnd=sp; H.traj=sp.traj;
  return H;
}

// Veredito (assinatura fisiológica, NÃO conduta): perfusão (CO) × congestão (Pfill/LVEDP).
function vereditoCardio(R){
  var cong = R.LVEDP >= 18;            // úmido (congesto)
  var low  = R.CO < 3.2;              // frio (baixo débito)
  if (R.CO < 2.2 || (low && cong)) return 'cardiogenico';   // frio + úmido = o quadrante
  if (low || cong) return 'limitrofe';
  return 'compensado';
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { V0, V0D, HR0, ped, edvFromPfill, ves, strokeVolume, pes, ef, coupling,
    loopCorners, strokeWork, hemoAt, ischemiaFactor, spiralRun, cardioState, vereditoCardio };
}
