// ===== model25.js — Ressuscitação volêmica (benefício × custo) · PERFUNDE·CHOCA módulo 25 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md / modulos.md §25. Integra M4/M5/M6/M12/M14/M15.
// TESE: volume é intervenção FÍSICA com BENEFÍCIO e CUSTO. Benefício: Pmsf↑ → retorno venoso → pré-carga → VS
//   (na parte ÍNGREME de Frank-Starling). Custo: pressões de enchimento↑ → congestão/edema; glicocálice lesado.
// DUAS perguntas DIFERENTES (o 2×2 nuclear):
//   RESPONSIVIDADE — o débito SOBE com volume? (depende de onde se está na curva de Starling)
//   TOLERÂNCIA     — o paciente AGUENTA a congestão que o volume gera? (depende de coração/pulmão/leak)
// O benefício DECAI (a curva satura) e o custo ACUMULA (a congestão acelera). Há um ponto de PARAR.
// "Fluid creep" = repetir bolus além do benefício, colhendo só custo. Mecanismo, SEM protocolo/dose.

var BASE = {
  HR:82, SVmax0:95, kContrSV:0.55, Kp:0.62,        // Frank-Starling: SV = SVmax·preload²/(preload²+Kp²); SVmax cresce com a contratilidade
  preBase:1.05, kPreDep:0.78, kVeno:0.30,          // pré-carga inicial = preBase − kPreDep·dependência + tônus venoso
  kBolus:0.42, kLeakIntra:0.62,                    // cada bolus sobe a pré-carga·fração intravascular (leak rouba do intravascular)
  congKnee:0.72, kKneeLeak:0.30, kFill:0.62, kStiff:0.85, kLeakCong:0.68, // congestão: joelho desce com o leak; coração rígido e leak (glicocálice→edema) pioram
  RESP_THRESH:0.12, TOL_THRESH:0.72,               // responsivo: ΔCO ≥ 12% por bolus-teste · tolerante: congestão < 0.72
  demand:0                                          // (sem demanda explícita aqui; o foco é CO × congestão)
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }   // não-número/NaN → piso
function clamp01(v){ return clampv(v,0,1); }

// Estado dado o volume acumulado e o fenótipo.
// p = { vol(0..4 unidades de bolus), preDep(0..1 dependência de pré-carga), contract(0..1), leak(0..1), venoTone(0..1) }
function volemic(p){
  p=p||{}; var B=BASE;
  var vol=clampv(p.vol==null?0:p.vol, 0, 6), preDep=clamp01(p.preDep),
      contract=(p.contract==null?0.7:clamp01(p.contract)), leak=clamp01(p.leak),
      venoTone=(p.venoTone==null?0.5:clamp01(p.venoTone));

  var intravasc = clampv(1 - B.kLeakIntra*leak, 0.30, 1);                 // fração do bolus que fica no vaso
  var preload0  = clampv(B.preBase - B.kPreDep*preDep + B.kVeno*(venoTone-0.5), 0.20, 1.5); // pré-carga basal (baixa se dependente)
  var preload   = clampv(preload0 + B.kBolus*vol*intravasc, 0.20, 2.4);   // o volume sobe a pré-carga

  var SVmax = B.SVmax0*(0.45 + B.kContrSV*contract);                       // platô da curva (cai no coração fraco)
  var SV = SVmax*(preload*preload)/(preload*preload + B.Kp*B.Kp);          // Frank-Starling saturante
  var CO = B.HR*SV/1000;

  // congestão: o glicocálice lesado (leak) desce o "joelho" e soma edema intersticial; coração rígido amplifica
  var stiff = 1 + B.kStiff*(1-contract);
  var congKneeEff = clampv(B.congKnee - B.kKneeLeak*leak, 0.40, B.congKnee);
  var fillExcess = Math.max(0, preload - congKneeEff);
  var congestion = clampv(B.kFill*fillExcess*stiff + B.kLeakCong*leak, 0, 1.8);
  var edema = congestion > B.TOL_THRESH;

  return { vol:vol, preDep:preDep, contract:contract, leak:leak, venoTone:venoTone,
    intravasc:intravasc, preload0:preload0, preload:preload, SVmax:SVmax, SV:SV, CO:CO,
    stiff:stiff, congestion:congestion, edema:edema };
}

// Dar um bolus (mecanismo, sem volume prescrito): sobe o volume acumulado em 1 unidade.
function applyBolus(p){ var s=Object.assign({},p); s.vol=Math.min(6,(p.vol==null?0:p.vol)+1); return s; }

// Ganho marginal do PRÓXIMO bolus (ΔCO) e custo marginal (Δcongestão).
function marginal(p){ var a=volemic(p), b=volemic(applyBolus(p));
  return { dCO:b.CO-a.CO, dCong:b.congestion-a.congestion, dCOfrac:(a.CO>0?(b.CO-a.CO)/a.CO:0) }; }

// RESPONSIVIDADE: o próximo bolus sobe o débito ≥ 12%? (parte íngreme de Starling)
function responsive(p){ return marginal(p).dCOfrac >= BASE.RESP_THRESH; }
// TOLERÂNCIA: o paciente aguenta a congestão atual? (abaixo do limiar de edema)
function tolerant(p){ return volemic(p).congestion < BASE.TOL_THRESH; }

// O 2×2: responsivo × tolerante → a recomendação de MECANISMO (não de conduta).
function quadrant(p){ var r=responsive(p), t=tolerant(p);
  if(r&&t) return 'give';        // volume sobe o débito e é tolerado
  if(r&&!t) return 'tradeoff';   // subiria o débito, MAS a congestão já é cara
  if(!r&&t) return 'futile';     // não sobe o débito (platô) — só enche
  return 'harm';                 // não ajuda e ainda congestiona
}

// Volume ÓTIMO: varre o acumulado e maximiza utilidade = CO − penalidade pela congestão acima do limiar.
function optimalVolume(p){ p=p||{}; var best=0, bu=-1e9;
  for(var v=0; v<=5; v+=1){ var s=volemic(Object.assign({},p,{vol:v}));
    var u = s.CO - 2.2*Math.max(0, s.congestion-BASE.TOL_THRESH);
    if(u>bu+1e-9){ bu=u; best=v; } }
  return { vol:best, CO:volemic(Object.assign({},p,{vol:best})).CO }; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, volemic, applyBolus, marginal, responsive, tolerant, quadrant, optimalVolume };
}
