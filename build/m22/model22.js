// ===== model22.js — Anafilático × neurogênico · PERFUNDE·CHOCA módulo 22 =====
// DOIS DISTRIBUTIVOS NÃO-SÉPTICOS, MESMA RVS↓, FC OPOSTA. Capstone do m20 (distributivo).
// Reusa pam(DC,RVS,PVC) do m9. A quebra compartilhada é a RVS; o DISCRIMINADOR é a FC:
//   ANAFILÁTICO  → simpático INTACTO → TAQUICARDIA (+ leak capilar + broncoespasmo).
//   NEUROGÊNICO  → simpático PERDIDO  → o ÚNICO choque SEM taquicardia (BRADICARDIA).
// E a sagacidade farmacológica: a ADRENALINA é o agente da anafilaxia porque move QUATRO
// termos de uma vez (α→RVS e sela o leak; β1→FC/inotropia; β2→broncodilata) — um α-puro
// corrige só a RVS e deixa o broncho/leak. Funções PURAS. Âncoras: CHOQUE.md §3 · modulos.md §22.

// ---- macro: PAM = PVC + DC·RVS/80 (RVS dyn·s·cm⁻⁵; idêntico ao m9) ----
function pam(dc, rvsDyn, pvc){ if(pvc===undefined)pvc=4; return pvc + dc*rvsDyn/80; }

var BASE = {
  RVS_floor:350, kTone:1100, kEpiAlpha:560,     // RVS = floor + kTone·tônus + kEpiAlpha·epi
  HR_brady:40, HR_span:80, kEpiChrono:22,       // FC = brady + span·simpático + chrono·epi
  SVmax:70, kLeak:0.50, kEpiSeal:0.70,          // SV = SVmax·preloadF·(1+fillBonus)·(1+inotropia)
  kFill:0.55, kInoEpi:0.15,                     // bradicardia ganha SV (diástole longa); epi β1 inotropia
  PVC:4, Hb:14, SaO2_norm:0.98, kBroncho:0.18, kEpiBroncho:0.85,
  demand:250, kLac:0.020, LAC_MAX:12
};
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }

function caO2(sat){ return 1.34*BASE.Hb*sat + 0.003*90; }   // conteúdo arterial (mL/dL)

// Estado dado os mecanismos.
// p = { tonus(0..1→RVS), simpatico(0..1→FC), vazamento(0..1 leak/venodilatação), epi(0..1), broncho(0..1) }
function distAN(p){
  // guarda: p ausente vira {} e cada mecanismo default 0 — entrada nula/incompleta degrada para basal, nunca NaN nem TypeError.
  p=p||{}; var B=BASE, tonus=p.tonus||0, simp=p.simpatico||0, vaz=p.vazamento||0, epi=p.epi||0, broncho=p.broncho||0;
  var RVSdyn = clampv(B.RVS_floor + B.kTone*tonus + B.kEpiAlpha*epi, 200, 2400);
  var HR = clampv(B.HR_brady + B.HR_span*simp + B.kEpiChrono*epi, 35, 175);
  var fillBonus = clampv((78-HR)/78, 0, 0.5)*B.kFill;          // bradicardia → mais enchimento por batida
  var leakEff = vaz*(1 - B.kEpiSeal*epi);                       // a adrenalina (α) SELA o vazamento
  var preloadF = clampv(1 - B.kLeak*leakEff, 0.25, 1);
  var SV = B.SVmax*preloadF*(1+fillBonus)*(1+B.kInoEpi*epi);
  var DC = HR*SV/1000;
  var PAM = pam(DC, RVSdyn, B.PVC);
  var bronchoEff = broncho*(1 - B.kEpiBroncho*epi);            // a adrenalina (β2) BRONCODILATA
  var SaO2 = clampv(B.SaO2_norm - B.kBroncho*bronchoEff, 0.68, 0.99);
  var CaO2 = caO2(SaO2), DO2 = DC*CaO2*10;
  var perfDef = Math.max(0, 70-PAM)/70 + Math.max(0, 3.5-DC)/3.5;  // déficit de perfusão (proxy)
  var lactate = clampv(1.0 + B.kLac*perfDef*90, 1.0, B.LAC_MAX);
  return { tonus:tonus, simpatico:simp, vazamento:vaz, epi:epi, broncho:broncho,
    RVSdyn:RVSdyn, HR:HR, SV:SV, DC:DC, PAM:PAM, PVC:B.PVC,
    preloadF:preloadF, leakEff:leakEff, bronchoEff:bronchoEff, SaO2:SaO2, CaO2:CaO2, DO2:DO2, lactate:lactate };
}

// Padrão de FC — o discriminador.
function padraoFC(R){ if(R.HR>=100) return 'taqui'; if(R.HR<=65) return 'bradi'; return 'normal'; }

// Assinatura: distributivo (RVS↓ + PAM↓) + o padrão de FC.
function classeAN(R){
  var vaso=R.RVSdyn<900, hypo=R.PAM<65;
  if(!(vaso&&hypo)) return (hypo||vaso)?'limitrofe':'normal';
  return R.HR>=100 ? 'anafilatico' : (R.HR<=65 ? 'neurogenico' : 'distributivo');
}
// A PÉROLA: o único choque SEM taquicardia (distributivo com FC baixa).
function neurogenicoSignature(R){ return R.RVSdyn<900 && R.PAM<70 && R.HR<=65; }

// Os QUATRO termos que a adrenalina move — antes (epi=0) vs com a epi pedida.
// Devolve, para RVS, DC, pré-carga(preloadF) e SaO2, os valores sem e com epi (para o painel).
function epiTermos(p){
  var sem=distAN(Object.assign({}, p, {epi:0}));
  var com=distAN(p);
  return {
    rvs:{ sem:sem.RVSdyn, com:com.RVSdyn },
    dc:{ sem:sem.DC, com:com.DC },
    preload:{ sem:sem.preloadF, com:com.preloadF },
    sao2:{ sem:sem.SaO2, com:com.SaO2 },
    nTermos: ( (com.RVSdyn>sem.RVSdyn+30?1:0) + (com.DC>sem.DC+0.3?1:0) + (com.preloadF>sem.preloadF+0.03?1:0) + (com.SaO2>sem.SaO2+0.01?1:0) )
  };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, pam, caO2, distAN, padraoFC, classeAN, neurogenicoSignature, epiTermos };
}
