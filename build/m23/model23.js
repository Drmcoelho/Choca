// ===== model23.js — Choque misto (composição de termos quebrados) · PERFUNDE·CHOCA módulo 23 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md (taxonomia) / modulos.md §23.
// Capstone de integração do Bloco IV: o paciente real quebra MAIS DE UM termo ao mesmo tempo.
// A cadeia macro→tecido é uma só:  SV = SVmax·preload·contratilidade · DC = FC·SV · PAM = PVC + DC·RVS/80
//   DO₂ = DC·CaO₂ · disponível = DO₂·extração · VO₂ = min(demanda, disponível) · déficit = demanda − VO₂.
// Cada arquétipo quebra termos específicos; o motor os COMPÕE:
//   hipovolêmico → pré-carga↓        cardiogênico → contratilidade↓ (e congestão)
//   obstrutivo   → pré-carga↓ (não enche; volume não resolve)      distributivo → RVS↓
//   séptico      → extração↓ (micro/mito, o eixo do m21)           hipoxêmico → SaO₂↓
// DUAS lições nucleares:
//   COMPOSIÇÃO  — dois choques pioram a entrega MAIS que cada um sozinho (descompensam o que compensava).
//   MASCARAMENTO— compensação (FC↑, RVS↑) segura a PAM enquanto o tecido já tem déficit → "PAM normal não basta".
// E a guarda terapêutica (mecanismo, SEM dose): tratar o termo ERRADO não fecha o déficit e pode piorar o oculto.

var BASE = {
  SVmax:75, HRrest:75, HRmax:160, RVSnorm:1100, PVC:6, Hb:14, PaO2:95, demand:320,
  kPreHypo:0.72, kPreObstr:0.62, kContr:0.72, kRvsDistr:0.62,
  extrCap0:0.62, kExtrSeptic:0.70, kSaO2Hypox:0.22,
  kCompHR:70, kCompRVS:520, kPressor:420, LAC_K:0.020, LAC_MAX:14,
  PAM_target:70                                   // referência de perfusão que dispara a compensação
};
function clampv(v,a,b){ return v<a?a:(v>b?b:v); }
function clamp01(v){ return clampv(v||0,0,1); }

// Estado hemodinâmico-tecidual dado o vetor de severidades 0..1.
// p = { hypo, cardio, obstr, distr, septic, hypox, comp }
//   comp = reserva compensatória autonômica (0..1; default 0.7). Baixa = compensação esgotada/bloqueada (β-bloqueio, neurogênico).
function mixed(p){
  p = p||{};
  var B=BASE;
  var hypo=clamp01(p.hypo), cardio=clamp01(p.cardio), obstr=clamp01(p.obstr),
      distr=clamp01(p.distr), septic=clamp01(p.septic), hypox=clamp01(p.hypox);
  var comp = (p.comp==null?0.7:clamp01(p.comp));
  var pressor = clamp01(p.pressor);                                          // tônus α1 EXÓGENO somado (mecanismo, sem dose)

  // termos quebrados (cada um é monotônico e clampado)
  var preloadF = clampv(1 - B.kPreHypo*hypo - B.kPreObstr*obstr, 0.12, 1);   // hipovolemia + obstrução esvaziam o enchimento
  var contract = clampv(1 - B.kContr*cardio, 0.18, 1);                       // cardiogênico derruba a contratilidade
  var SaO2     = clampv(0.97 - B.kSaO2Hypox*hypox, 0.60, 0.99);              // hipoxemia derruba a saturação
  var CaO2     = 1.34*B.Hb*SaO2 + 0.003*B.PaO2;                              // conteúdo arterial (mL/dL)
  var rvsOpen  = B.RVSnorm*(1 - B.kRvsDistr*distr);                          // vasoplegia distributiva abre a RVS

  // 1ª passada (sem compensação) para dimensionar a ameaça de perfusão
  var SV = B.SVmax*preloadF*contract;
  var DC0 = B.HRrest*SV/1000;
  var PAM0 = B.PVC + DC0*rvsOpen/80;
  var threat = clampv((B.PAM_target - PAM0)/B.PAM_target, 0, 1);             // o quanto a PAM caiu abaixo do alvo

  // compensação: taquicardia e vasoconstrição proporcionais à ameaça, limitadas pela reserva `comp`
  var HR  = clampv(B.HRrest + comp*B.kCompHR*threat, 40, B.HRmax);
  // o pressor exógeno SOMA tônus à RVS (não corrige pré-carga, contratilidade nem extração) → sobe a PAM, não o fluxo
  var rvs = clampv(rvsOpen + comp*B.kCompRVS*threat + B.kPressor*pressor, 250, 2400);

  // 2ª passada (com compensação) — a compensação defende a entrega (e é o que MASCARA)
  var DC  = HR*SV/1000;
  var PAM = B.PVC + DC*rvs/80;
  var DO2 = DC*CaO2*10;                                                      // entrega convectiva (mL/min)
  var extrCap = clampv(B.extrCap0*(1 - B.kExtrSeptic*septic), 0.10, B.extrCap0); // séptico quebra a extração (m21)
  var available = DO2*extrCap;                                              // O₂ utilizável pelo tecido
  var VO2 = Math.min(B.demand, available);
  var deficit = Math.max(0, B.demand - VO2);
  var lactate = clampv(1.0 + B.LAC_K*deficit, 1.0, B.LAC_MAX);

  // congestão pulmonar: pré-carga sobre uma bomba fraca (ou enchimento obstruído) → pressões de enchimento↑
  var congestion = clampv((0.62*cardio + 0.38*obstr)*(0.45+preloadF), 0, 1.2);

  return { hypo:hypo, cardio:cardio, obstr:obstr, distr:distr, septic:septic, hypox:hypox, comp:comp,
    preloadF:preloadF, contract:contract, SaO2:SaO2, CaO2:CaO2, rvsOpen:rvsOpen, rvs:rvs,
    SV:SV, HR:HR, DC:DC, PAM:PAM, DO2:DO2, extrCap:extrCap, available:available, VO2:VO2,
    deficit:deficit, lactate:lactate, congestion:congestion, threat:threat };
}

var TERMS = ['hypo','cardio','obstr','distr','septic','hypox'];

// Atribuição marginal: quanto do déficit some se cada componente fosse zerado (o que QUANTIFICA o choque misto).
function attribution(p){
  var full = mixed(p), out = {};
  TERMS.forEach(function(k){
    var off = Object.assign({}, p); off[k]=0;
    out[k] = Math.max(0, full.deficit - mixed(off).deficit);
  });
  return out;
}
// O termo dominante (maior atribuição). 'none' se não há déficit atribuível.
function dominantTerm(p){
  var a = attribution(p), best='none', bv=0;
  TERMS.forEach(function(k){ if(a[k]>bv){ bv=a[k]; best=k; } });
  return best;
}
// Quantos termos estão "ativos" (severidade relevante).
function activeTerms(p){ p=p||{}; return TERMS.filter(function(k){ return clamp01(p[k])>=0.2; }); }

// MASCARAMENTO: a macro parece aceitável (PAM ≥ 65) mas o tecido já tem déficit. "Normalizar a macro não basta."
function masking(R){ return R.PAM >= 65 && R.deficit > 0; }

// ---- Alavancas (mecanismo, SEM dose) — tratar o termo CERTO vs o errado ----
// Volume: restaura pré-carga (reduz hipovolemia). Em bomba fraca/obstrução, sobe congestão sem fechar o déficit.
function applyVolume(p){ var s=Object.assign({},p); s.hypo=Math.max(0,(p.hypo||0)-0.5); return s; }
// Pressor (α1): SOMA tônus exógeno → sobe a PAM (macro). Não toca pré-carga, contratilidade nem extração → pode MASCARAR.
function applyPressor(p){ var s=Object.assign({},p); s.pressor=Math.min(1,(p.pressor||0)+0.6); return s; }
// Inotrópico (β1): sobe a contratilidade (reduz o termo cardiogênico).
function applyInotrope(p){ var s=Object.assign({},p); s.cardio=Math.max(0,(p.cardio||0)-0.5); return s; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, TERMS, clampv, clamp01, mixed, attribution, dominantTerm, activeTerms, masking,
    applyVolume, applyPressor, applyInotrope };
}
