// ===== model24.js — O coração-pulmão · PERFUNDE·CHOCA módulo 24 =====
// A VENTILAÇÃO É HEMODINÂMICA. A pressão intratorácica (PIT) reescreve quatro termos de uma vez:
//   (1) RETORNO VENOSO / pré-carga do VD — Guyton: VR = (Pmsf − Pra)/Rvr; a PIT é transmitida ao átrio
//        direito. Inspiração espontânea → PIT↓ → Pra↓ → VR↑ (bomba torácica). Pressão positiva/PEEP →
//        PIT↑ → Pra↑ → VR↓ (a PEEP corta a pré-carga — derruba o DC no hipovolêmico).
//   (2) PÓS-CARGA do VD (PVR) — curva em U com o volume pulmonar: mínima na CRF; atelectasia (volume
//        baixo, vasoconstrição hipóxica + colapso de vasos extra-alveolares) e hiperdistensão (volume
//        alto, esmagamento de vasos alveolares, West zona 1/2) ELEVAM a PVR. PEEP pode recrutar (PVR↓)
//        ou hiperdistender (PVR↓→↑). O VD é sensível à pós-carga.
//   (3) PÓS-CARGA do VE (transmural = Pcav − PIT). PIT positiva (PEEP) REDUZ a transmural → DESCARREGA
//        o VE. PIT negativa (esforço espontâneo, distress) AUMENTA a transmural → carrega o VE. Por isso
//        a pressão positiva (CPAP) ajuda o edema agudo cardiogênico, e o esforço negativo o piora.
//   (4) DC NET — a MESMA pressão positiva DERRUBA o DC do pré-carga-dependente e SUSTENTA/eleva o DC do
//        VE congesto. O discriminador é a CURVA DC × PEEP: hipovolêmico cai monotônico; atelectásico tem
//        PEEP ótima (sobe→cai); cardiogênico congesto sobe. Funções PURAS. Reusa pam(DC,RVS,PVC) do m9.
// Âncoras: CHOQUE.md (coração-pulmão) · modulos.md §24 · braço 1 (mecânica) · m9 (PAM macro).

function clampv(v,a,b){ return v<a?a:(v>b?b:v); }

// ---- macro: PAM = PVC + DC·RVS/80 (RVS dyn·s·cm⁻⁵; idêntico ao m9) ----
function pam(dc, rvsDyn, pvc){ if(pvc===undefined)pvc=4; return pvc + dc*rvsDyn/80; }

var BASE = {
  // Guyton / retorno venoso
  Pmsf0:6, kPmsf:16,                 // Pmsf = Pmsf0 + kPmsf·volemia (mmHg) — pressão de enchimento sistêmico
  ITP0:-2, kPeepITP:0.35, kEffortITP:7,   // PIT média (mmHg): PEEP a sobe, esforço espontâneo a derruba
  pRAfill:5, Rvr:2.2,                // Pra = PIT + pRAfill (CVP medida); Rvr resistência ao retorno (normaliza VR→DC)
  // volume pulmonar e pós-carga do VD (PVR em U em torno da CRF=0.5)
  kPeepVol:0.55, kColapso:0.5,       // índice de volume pulmonar = 0.5 + kPeepVol·peep/20 − kColapso·colapso
  PVRmin:1.0, kAtelect:2.4, kOverdist:2.6, pvrExp:1.6,
  kRVafter:0.55, RVeff_floor:0.25,   // RVeff = 1 − kRVafter·(PVRrel−1)  (penalidade de pós-carga do VD)
  // pós-carga do VE (transmural a partir da PIT) e contratilidade
  cLVunload:0.6,                     // LVafter = 1 − cLVunload·(PIT−PIT0)/10  (PIT+ descarrega; PIT− carrega)
  kLVfail:0.5,                       // VE falido é MAIS sensível à pós-carga (expoente cresce com a falência)
  // bomba / saída
  SVmax:95, tauStarling:3.0,         // SVrel = 1 − exp(−preloadLV/tau)  (Frank–Starling saturante)
  HR0:78, kBaro:4.0, HR_min:50, HR_max:140,
  RVS_sys:1300, PVC_macro:4,
  // oxigenação (shunt por atelectasia, recrutável por PEEP)
  SaO2_norm:0.985, kShunt:0.34, Hb:14,
  // perfusão / lactato (proxy)
  demand:250, kLac:0.022, LAC_MAX:12
};

function caO2(sat){ return 1.34*BASE.Hb*sat + 0.003*90; }   // conteúdo arterial (mL/dL)

// índice de volume pulmonar em torno da CRF (0.5 = ótimo). PEEP sobe, colapso/atelectasia desce.
function lungVolIndex(peep, colapso){
  return clampv(0.5 + BASE.kPeepVol*(peep/20) - BASE.kColapso*colapso, 0.05, 0.98);
}
// PVR relativa: curva em U (mínima na CRF; sobe na atelectasia e na hiperdistensão).
function pvrRel(peep, colapso){
  var lv=lungVolIndex(peep,colapso);
  var below=Math.max(0,0.5-lv), above=Math.max(0,lv-0.5);   // déficit/excesso a partir da CRF
  return BASE.PVRmin + BASE.kAtelect*Math.pow(2*below,BASE.pvrExp) + BASE.kOverdist*Math.pow(2*above,BASE.pvrExp);
}

// Estado dado os mecanismos.
// p = { peep(cmH2O 0..20), volemia(0..1→Pmsf), effort(0..1 esforço espontâneo→PIT−),
//       lvContr(0..1 contratilidade do VE; baixo = VE falido), colapso(0..1 atelectasia de base) }
function corPulmao(p){
  // guarda: entrada ausente/incompleta degrada para basal plausível — nunca NaN nem TypeError.
  p=p||{}; var B=BASE;
  var peep    = clampv(p.peep===undefined?0:p.peep, 0, 20);
  var volemia = clampv(p.volemia===undefined?0.5:p.volemia, 0, 1);
  var effort  = clampv(p.effort===undefined?0.15:p.effort, 0, 1);
  var lvContr = clampv(p.lvContr===undefined?0.8:p.lvContr, 0, 1);
  var colapso = clampv(p.colapso===undefined?0.1:p.colapso, 0, 1);

  // (1) RETORNO VENOSO — Guyton com cachoeira venosa (Pra efetivo não cai abaixo de 0).
  var Pmsf = B.Pmsf0 + B.kPmsf*volemia;
  var ITP  = B.ITP0 + B.kPeepITP*peep - B.kEffortITP*effort;   // PIT média (mmHg)
  var Pra  = ITP + B.pRAfill;                                   // CVP MEDIDA (referida à atmosfera)
  var VRdrive = Math.max(0, Pmsf - Math.max(Pra,0));            // gradiente de retorno (cachoeira no inlet torácico)
  var VR = VRdrive / B.Rvr;                                     // pré-carga do VD (equivalente L/min)

  // (2) PÓS-CARGA do VD — PVR em U; penaliza o que cruza o pulmão.
  var PVRrel = pvrRel(peep, colapso);
  var RVeff  = clampv(1 - B.kRVafter*(PVRrel-1), B.RVeff_floor, 1);
  var preloadLV = VR*RVeff;                                     // série: só o que atravessa o pulmão enche o VE

  // (3) PÓS-CARGA do VE — transmural a partir da PIT; VE falido é mais sensível.
  var LVafter = Math.max(0.45, 1 - B.cLVunload*(ITP-B.ITP0)/10); // referida à PIT basal: PIT+ → <1 (descarrega); PIT− → >1 (carrega)
  var afterPenalty = Math.pow(LVafter, 1 + B.kLVfail*(1-lvContr));

  // BOMBA — Frank–Starling saturante × contratilidade ÷ penalidade de pós-carga.
  var SVrel = 1 - Math.exp(-preloadLV/B.tauStarling);
  var SVlv  = B.SVmax * SVrel * (0.45+0.55*lvContr) / afterPenalty;
  var CO0   = B.HR0*SVlv/1000;
  var HR    = clampv(B.HR0 + B.kBaro*(5-CO0), B.HR_min, B.HR_max);  // barorreflexo suave (DC baixo → taqui)
  var CO    = HR*SVlv/1000;
  var PAM   = pam(CO, B.RVS_sys, B.PVC_macro);

  // (4) OXIGENAÇÃO — shunt por atelectasia, recrutável por PEEP.
  var lv=lungVolIndex(peep,colapso), below=Math.max(0,0.5-lv);
  var SaO2 = clampv(B.SaO2_norm - B.kShunt*(2*below), 0.60, 0.99);
  var CaO2 = caO2(SaO2), DO2 = CO*CaO2*10;

  // proxy de perfusão/lactato
  var perfDef = Math.max(0,70-PAM)/70 + Math.max(0,4.0-CO)/4.0;
  var lactate = clampv(1.0 + B.kLac*perfDef*90, 1.0, B.LAC_MAX);

  return { peep:peep, volemia:volemia, effort:effort, lvContr:lvContr, colapso:colapso,
    Pmsf:Pmsf, ITP:ITP, Pra:Pra, VRdrive:VRdrive, VR:VR,
    PVRrel:PVRrel, RVeff:RVeff, preloadLV:preloadLV, lungVol:lv,
    LVafter:LVafter, afterPenalty:afterPenalty, SVrel:SVrel, SV:SVlv,
    HR:HR, CO:CO, PAM:PAM, SaO2:SaO2, CaO2:CaO2, DO2:DO2, lactate:lactate };
}

// Curva DC × PEEP — a assinatura. Varre a PEEP e devolve o DC (e SaO₂) em cada nível.
// É o discriminador: hipovolêmico cai monotônico; atelectásico tem ótimo interior; cardiogênico sobe.
function curvaPEEP(p, n){
  p=p||{}; n=n||21; var pts=[];
  for(var i=0;i<n;i++){ var peep=20*i/(n-1); var R=corPulmao(Object.assign({},p,{peep:peep}));
    pts.push({ peep:peep, CO:R.CO, SaO2:R.SaO2, VR:R.VR, PVRrel:R.PVRrel, PAM:R.PAM }); }
  return pts;
}
// PEEP ótima (máximo DC) e o tipo de resposta da curva.
function peepOtima(p){
  var c=curvaPEEP(p,21), best=0, bestCO=-1;
  for(var i=0;i<c.length;i++){ if(c[i].CO>bestCO){ bestCO=c[i].CO; best=c[i].peep; } }
  var co0=c[0].CO, coMax=c[c.length-1].CO, monotonaCai=true, monotonaSobe=true;
  for(var j=1;j<c.length;j++){ if(c[j].CO>c[j-1].CO+1e-9) monotonaCai=false; if(c[j].CO<c[j-1].CO-1e-9) monotonaSobe=false; }
  var tipo = monotonaCai?'cai':(monotonaSobe?'sobe':(best>0&&best<20?'otimo':'plana'));
  return { peepOtima:best, COotima:bestCO, CO_peep0:co0, CO_peep20:coMax, tipo:tipo };
}

// Os QUATRO termos movidos pela PRESSÃO POSITIVA (o ato clínico: espontâneo→suportado).
// lo = espontâneo (peep 0, esforço do paciente); hi = suportado (peep aplicado, esforço aliviado).
function pressaoTermos(p){
  p=p||{};
  var sp=(p.peep>0)?p.peep:10;                 // nível de SUPORTE aplicado (se o estado já não traz PEEP, usa 10)
  var lo=corPulmao(Object.assign({}, p, {peep:0}));
  var hi=corPulmao(Object.assign({}, p, {peep:sp, effort:0.15}));
  return {
    vr:{ sem:lo.VR, com:hi.VR },                 // pré-carga — pressão positiva tende a CORTAR
    lvafter:{ sem:lo.LVafter, com:hi.LVafter },  // pós-carga do VE — pressão positiva DESCARREGA
    pvr:{ sem:lo.PVRrel, com:hi.PVRrel },        // pós-carga do VD — depende do U
    co:{ sem:lo.CO, com:hi.CO },                 // DC NET — depende do fenótipo
    deltaCO: hi.CO-lo.CO,
    pra:{ sem:lo.Pra, com:hi.Pra }               // CVP MEDIDA sobe — a armadilha
  };
}

// Assinatura estática do estado atual (rótulo único do fenótipo dominante).
function classeCP(R){
  if(R.VR < 2.6 && R.CO < 4.0) return 'preload_dep';          // pré-carga estrangulada (hipovolemia/PEEP)
  if(R.PVRrel > 2.2 && R.RVeff < 0.55) return 'rv_sobrecarga'; // pós-carga do VD (atelectasia/hiperdistensão)
  if(R.lvContr < 0.45 && R.LVafter > 1.10) return 've_congesto'; // VE falido sob pós-carga (edema cardiogênico)
  if(R.CO >= 4.2 && R.PAM >= 70 && R.SaO2 >= 0.93) return 'normal';
  return 'limitrofe';
}
// A PÉROLA: sob PEEP a CVP MEDIDA sobe enquanto o retorno venoso VERDADEIRO cai — a CVP engana.
function cvpEngana(p){
  p=p||{}; var lo=corPulmao(Object.assign({},p,{peep:0})), hi=corPulmao(Object.assign({},p,{peep:Math.max(8,(p.peep===undefined?10:p.peep))}));
  return hi.Pra>lo.Pra+0.5 && hi.VR<lo.VR-0.1;   // Pra↑ E VR↓ ao mesmo tempo
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, pam, caO2, lungVolIndex, pvrRel, corPulmao, curvaPEEP, peepOtima, pressaoTermos, classeCP, cvpEngana };
}
