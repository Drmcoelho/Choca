// ===== model24.js — O coração-pulmão (interação cardiopulmonar) · PERFUNDE·CHOCA módulo 24 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md / modulos.md §24. Integra braço 1 + M7/M17/M18/M19.
// TESE: a PRESSÃO INTRATORÁCICA (PIT) acopla o pulmão aos DOIS ventrículos — de formas OPOSTAS.
//   Pressão positiva / PEEP (PIT↑): retorno venoso↓ (pré-carga de VD↓) · PVR↑ se sobredistende · pós-carga de VE↓.
//   Esforço espontâneo (PIT↓):      retorno venoso↑ (pré-carga de VD↑) · pós-carga de VE↑ (risco de edema agudo).
// A PÉROLA: a MESMA manobra (subir PEEP) AJUDA o VE que falha (descarrega a pós-carga) e PREJUDICA o VD que falha
//   (derruba a pré-carga e sobe a PVR). Saber QUAL ventrículo falha vem ANTES de girar o botão do ventilador.
// E a PVR é uma curva em U no volume pulmonar: mínima perto do FRC; sobe na atelectasia (PEEP baixa) e na
//   sobredistensão (PEEP alta). Há uma PEEP ÓTIMA. O débito em SÉRIE é limitado pelo ventrículo mais fraco.

var BASE = {
  ITP0:-2, kPeepITP:0.7, kEffortITP:6,        // PIT média = ITP0 + 0.7·PEEP − 6·esforço (cmH2O)
  Pmsf0:12, kVol:8, RAP0:2, kITP_RAP:0.5, kVR:0.62,   // retorno venoso ∝ (Pmsf − RAP); a PIT sobe a RAP
  PVRmin:1.0, peepOpt:8, kU:0.018, kRvFail:4.2,        // PVR em U: mínima na PEEP ótima; rvFail eleva a base
  ejectRV0:1.0, kPVRej:0.16,                   // o VD é INTOLERANTE à pós-carga: ejeção cai com a PVR
  LVaff0:90, kAffITP:1.1, LVmax:6.5, kLvAff:0.92      // pós-carga de VE transmural = LVaff0 − 1.1·PIT; VE que falha é sensível a ela
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }   // não-número/NaN → piso (nunca propaga NaN)
function clamp01(v){ return clampv(v||0,0,1); }

// Estado cardiopulmonar dado o ajuste ventilatório e o coração.
// p = { peep(0..20 cmH2O), effort(0..1 esforço espontâneo), lvFail(0..1), rvFail(0..1), volemia(0..1) }
function cardiopulm(p){
  p=p||{}; var B=BASE;
  var peep=clampv(p.peep==null?5:p.peep,0,22), effort=clamp01(p.effort),
      lvFail=clamp01(p.lvFail), rvFail=clamp01(p.rvFail),
      volemia=(p.volemia==null?0.6:clamp01(p.volemia));

  // pressão intratorácica média (cmH2O): PEEP sobe, esforço espontâneo derruba
  var meanITP = B.ITP0 + B.kPeepITP*peep - B.kEffortITP*effort;
  // retorno venoso: gradiente (Pmsf − RAP); a PIT é transmitida à RAP → PIT↑ derruba o retorno
  var Pmsf = B.Pmsf0 + B.kVol*(volemia-0.6);
  var RAP = B.RAP0 + B.kITP_RAP*meanITP;
  var VR = clampv(B.kVR*(Pmsf - RAP), 0.5, 9);
  var rvPreload = VR;
  // PVR: curva em U no volume pulmonar (desvio da PEEP ótima) + carga da doença de VD
  var dev = peep - B.peepOpt;
  var PVR = B.PVRmin + B.kU*dev*dev + B.kRvFail*rvFail;
  // ejeção do VD cai com a PVR (intolerância à pós-carga) → débito de VD
  var ejectRV = clampv(B.ejectRV0 - B.kPVRej*(PVR-B.PVRmin), 0.2, 1);
  var RVout = clampv(rvPreload*ejectRV, 0.3, 9);
  // pós-carga de VE transmural: a PIT positiva DESCARREGA o VE; o esforço (PIT negativa) a AUMENTA
  var LVafterload = clampv(B.LVaff0 - B.kAffITP*meanITP, 40, 160);
  // capacidade do VE: VE que falha é sensível à pós-carga → PIT↑ (pós-carga↓) ajuda
  var LVcap = clampv(B.LVmax*(1 - B.kLvAff*lvFail*(LVafterload/B.LVaff0)), 0.5, B.LVmax);
  // circulação em SÉRIE: o débito é limitado pelo ventrículo mais fraco
  var CO = Math.min(RVout, LVcap);
  var limiting = (RVout < LVcap) ? 'VD' : 'VE';
  return { peep:peep, effort:effort, lvFail:lvFail, rvFail:rvFail, volemia:volemia,
    meanITP:meanITP, Pmsf:Pmsf, RAP:RAP, VR:VR, rvPreload:rvPreload, PVR:PVR, ejectRV:ejectRV,
    RVout:RVout, LVafterload:LVafterload, LVcap:LVcap, CO:CO, limiting:limiting };
}

// Qual ventrículo é o que falha (governa a resposta à ventilação).
function dominantVentricle(p){ p=p||{}; var lv=clamp01(p.lvFail), rv=clamp01(p.rvFail);
  if(lv<0.3 && rv<0.3) return 'none';
  if(rv>=lv) return 'rv'; return 'lv'; }

// PEEP ÓTIMA: varre 0..20 e devolve a que MAXIMIZA o débito (o trade-off computado).
function optimalPeep(p){ p=p||{}; var best=0, bco=-1;
  for(var pe=0; pe<=20; pe+=1){ var co=cardiopulm(Object.assign({},p,{peep:pe})).CO; if(co>bco+1e-9){ bco=co; best=pe; } }
  return { peep:best, CO:bco }; }

// Resposta à ventilação: débito espontâneo vs passivo vs PEEP (a curva que se INVERTE entre VE e VD).
function ventResponse(p){ p=p||{};
  return { espontaneo: cardiopulm(Object.assign({},p,{effort:0.8,peep:0})).CO,
           passivo:    cardiopulm(Object.assign({},p,{effort:0,  peep:0})).CO,
           peep:       cardiopulm(Object.assign({},p,{effort:0,  peep:12})).CO }; }

// ---- Alavancas (mecanismo, SEM dose/protocolo) ----
function applyPEEP(p){ var s=Object.assign({},p); s.peep=Math.min(20,(p.peep==null?5:p.peep)+7); s.effort=0; return s; }   // pressão positiva
function applySpontaneous(p){ var s=Object.assign({},p); s.effort=Math.min(1,(p.effort||0)+0.8); s.peep=0; return s; }       // esforço espontâneo

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, cardiopulm, dominantVentricle, optimalPeep, ventResponse, applyPEEP, applySpontaneous };
}
