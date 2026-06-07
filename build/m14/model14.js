// ===== model14.js — Choque hipovolêmico (categoria) · PERFUNDE·CHOCA módulo 14 =====
// O HIPOVOLÊMICO É UM PROBLEMA DE RETORNO VENOSO. Reusa o engine de Guyton do módulo 4:
//   a hemorragia derruba a Pmsf → a curva de retorno venoso desliza para a esquerda →
//   a interseção (DC) desce. A compensação (venoconstrição→Pmsf, RVS↑, FC↑) defende a
//   MAP — até a reserva saturar e a PA DESABAR. O índice de choque (FC/PAS) denuncia ANTES.
// Funções PURAS, determinísticas. Âncoras: CHOQUE.md §3/§5 · modulos.md §14.

// ---- Guyton (idêntico ao módulo 4) ----
function venousReturn(pra, Pmsf, Rvr, colapso){
  if (colapso === undefined) colapso = -4;
  if (pra >= Pmsf) return 0;
  var p = (pra < colapso) ? colapso : pra;
  return (Pmsf - p) / Rvr;
}
function cardiacOutput(pra, COmax, pra0, K){
  if (pra0 === undefined) pra0 = -2;
  if (K === undefined) K = 2;
  var d = pra - pra0; if (d <= 0) return 0;
  return COmax * d / (K + d);
}
function intersecao(P){
  var Pmsf=P.Pmsf, Rvr=P.Rvr, COmax=P.COmax,
      pra0=(P.pra0===undefined?-2:P.pra0), K=(P.K===undefined?2:P.K),
      colapso=(P.colapso===undefined?-4:P.colapso);
  var f=function(pra){ return venousReturn(pra,Pmsf,Rvr,colapso)-cardiacOutput(pra,COmax,pra0,K); };
  var lo=colapso, hi=Pmsf;
  if (f(lo)<=0){ return { pra:lo, co:cardiacOutput(lo,COmax,pra0,K) }; }
  for (var i=0;i<80;i++){ var mid=(lo+hi)/2; if(f(mid)>0) lo=mid; else hi=mid; }
  var praStar=(lo+hi)/2; return { pra:praStar, co:cardiacOutput(praStar,COmax,pra0,K) };
}

// ---- Linha de base (normovolemia) e constantes de acoplamento ----
var BASE = {
  Pmsf0:8.0, Rvr0:1.2, COmax0:7.5, pra0:-2, K:2, colapso:-4,
  RVS0:17.0,            // RVS em unidades de Wood (mmHg·min/L): MAP = DC·RVS + PVC
  HR0:75, HRmax:170,
  Cart:1.7,            // complacência arterial (mL/mmHg) → pressão de pulso = SV/Cart
  kVol:2.30,           // queda de Pmsf por fração de déficit
  kVeno:1.00, kVenoP:0.80,  // venoconstrição (compensação A) recruta volume → Pmsf;
                            //   o pressor exógeno recruta POUCO (não repõe volume perdido)
  kArt:0.12,  kArtP:0.35,   // vasoconstrição arteriolar → RVS (o pressor PROPÕE a MAP, não o fluxo)
  kHR:0.60,                 // taquicardia
  kCon:0.18,                // inotropismo simpático (sobe pouco o platô; o limite é o RV)
  DCcrit:3.2, kLac:2.6      // lactato quando o DC cruza o limiar de perfusão
};
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }

// Estado hemodinâmico dado o cenário de perda/resgate.
// p = { loss, repos, pressor, compReserve }  (frações 0..1; compReserve default 1)
function hemoState(p){
  var B=BASE;
  var loss=p.loss||0, repos=p.repos||0, pressor=p.pressor||0;
  var compReserve=(p.compReserve===undefined?1:p.compReserve);
  var d = clamp(loss - repos, 0, 0.6);                 // déficit volêmico líquido
  var A = compReserve * (1 - Math.exp(-d/0.10));        // ativação simpática (satura ~d 0,3)
  var Pmsf = Math.max(0.5, B.Pmsf0*(1 - B.kVol*d) + B.kVeno*A + B.kVenoP*pressor);
  var COmax = B.COmax0*(1 + B.kCon*A);
  var RVSw  = B.RVS0*(1 + B.kArt*A + B.kArtP*pressor);
  var HR    = Math.min(B.HRmax, B.HR0*(1 + B.kHR*A));
  var inter = intersecao({ Pmsf:Pmsf, Rvr:B.Rvr0, COmax:COmax, pra0:B.pra0, K:B.K, colapso:B.colapso });
  var DC=inter.co, PVC=inter.pra;
  var SVml = DC*1000/HR;
  var PP   = SVml / B.Cart;
  var MAP  = DC*RVSw + PVC;
  var SBP  = MAP + 2*PP/3, DBP = MAP - PP/3;
  var SI   = HR / SBP;
  var lactate = Math.min(15, 1.0 + B.kLac*Math.max(0, B.DCcrit - DC));
  return { d:d, A:A, Pmsf:Pmsf, Rvr:B.Rvr0, COmax:COmax, pra0:B.pra0, K:B.K, colapso:B.colapso,
    RVSw:RVSw, HR:HR, DC:DC, PVC:PVC, SVml:SVml, PP:PP, MAP:MAP, SBP:SBP, DBP:DBP, SI:SI, lactate:lactate };
}

// Classe fisiológica (educacional — assinatura da curva, NÃO conduta) pelo déficit líquido.
function classeHemo(R){
  if (R.d < 0.12) return 'compensado';
  if (R.d < 0.28) return 'limitrofe';     // compensação ativa: PA ainda mantida (o engano)
  if (R.d < 0.40) return 'descompensando';
  return 'colapso';
}

// Varredura da perda (0..maxLoss) para a curva "PA mantida até desabar".
function sweepLoss(p, n, maxLoss){
  n=n||60; maxLoss=maxLoss||0.5; var out=[];
  for (var i=0;i<n;i++){ var L=i/(n-1)*maxLoss;
    var R=hemoState({ loss:L, repos:0, pressor:p&&p.pressor||0, compReserve:(p&&p.compReserve!==undefined)?p.compReserve:1 });
    out.push({ loss:L, MAP:R.MAP, SBP:R.SBP, DBP:R.DBP, HR:R.HR, SI:R.SI, DC:R.DC, lactate:R.lactate });
  }
  return out;
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { venousReturn, cardiacOutput, intersecao, BASE, hemoState, classeHemo, sweepLoss };
}
