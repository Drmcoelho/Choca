// ===== model3.js — Débito cardíaco · PERFUNDE·CHOCA módulo 3 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §2 / modulos.md §3.
// Tese: DC = FC × VS, mas o VS depende do enchimento diastólico — e a diástole
// encurta com a taquicardia. Logo há um TETO: DC sobe com FC até um pico e cai.

// Tempo diastólico por batimento (s): ciclo (60/FC) menos a sístole.
// sístole tratada como ~constante (idealização: a diástole encurta primeiro).
function diastole(fc, sistole){
  if (sistole === undefined) sistole = 0.30;   // s, duração sistólica aproximada
  return Math.max(0, 60/fc - sistole);
}

// VS atingido (mL): enchimento saturante no tempo diastólico disponível.
//   VS = VSbasal · (1 − e^(−tdia/τ))
// VSbasal = teto de enchimento (pré-carga/contratilidade); τ = constante de enchimento.
function svAchieved(fc, vsBasal, tau, sistole){
  if (vsBasal === undefined) vsBasal = 85;
  if (tau === undefined) tau = 0.30;            // s
  var td = diastole(fc, sistole);
  return vsBasal * (1 - Math.exp(-td / tau));
}

// Identidade pura DC = FC × VS (L/min). vs em mL.
function dc(fc, vs){ return fc * vs / 1000; }

// DC fisiológico no ponto FC, com VS limitado pela diástole (L/min).
function dcAt(fc, vsBasal, tau, sistole){
  return dc(fc, svAchieved(fc, vsBasal, tau, sistole));
}

// FC que maximiza o DC (o ápice da curva DC×FC), por varredura fina.
function peakFC(vsBasal, tau, sistole, lo, hi){
  lo = lo || 40; hi = hi || 200;
  var best = lo, bestDC = -1;
  for (var fc = lo; fc <= hi; fc += 0.5){
    var d = dcAt(fc, vsBasal, tau, sistole);
    if (d > bestDC){ bestDC = d; best = fc; }
  }
  return { fc: best, dc: bestDC };
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { diastole, svAchieved, dc, dcAt, peakFC };
}
