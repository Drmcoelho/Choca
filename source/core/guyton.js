// ===== source/core/guyton.js — interseção de Guyton (canônica) · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). Retorno venoso × função cardíaca
// e o PONTO DE OPERAÇÃO (interseção por bisseção). Forma canônica do model4 — o engine-jóia.
// A bisseção é reproduzida byte-a-byte (80 iterações, mesmos limites) para conformância exata.
// Âncoras: CHOQUE.md §5.

// Retorno venoso (L/min). Pmsf mmHg · Rvr mmHg·min/L · colapso (Pra de colapso venoso).
function venousReturn(pra, Pmsf, Rvr, colapso){
  if (colapso === undefined) colapso = -4;
  if (pra >= Pmsf) return 0;                       // gradiente nulo → sem retorno
  var p = (pra < colapso) ? colapso : pra;         // abaixo do colapso, RV satura (platô)
  return (Pmsf - p) / Rvr;
}

// Função cardíaca / Frank-Starling (L/min): CO = COmax·(pra−pra0)/(K+(pra−pra0)).
function cardiacOutput(pra, COmax, pra0, K){
  if (pra0 === undefined) pra0 = -2;
  if (K === undefined) K = 2;
  var d = pra - pra0;
  if (d <= 0) return 0;
  return COmax * d / (K + d);
}

// Ponto de operação = interseção VR(pra) = CO(pra) por bisseção robusta. { pra, co }.
function intersecao(P){
  var Pmsf = P.Pmsf, Rvr = P.Rvr, COmax = P.COmax,
      pra0 = (P.pra0===undefined?-2:P.pra0), K = (P.K===undefined?2:P.K),
      colapso = (P.colapso===undefined?-4:P.colapso);
  var f = function(pra){ return venousReturn(pra,Pmsf,Rvr,colapso) - cardiacOutput(pra,COmax,pra0,K); };
  var lo = colapso, hi = Pmsf;          // f(lo) > 0 (VR máx, CO baixo) ; f(hi) < 0
  if (f(lo) <= 0) { var pra0c = lo; return { pra: pra0c, co: cardiacOutput(pra0c,COmax,pra0,K) }; }
  for (var i=0;i<80;i++){
    var mid = (lo+hi)/2, fm = f(mid);
    if (fm > 0) lo = mid; else hi = mid;
  }
  var praStar = (lo+hi)/2;
  var coStar = cardiacOutput(praStar,COmax,pra0,K);
  return { pra: praStar, co: coStar };
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { venousReturn, cardiacOutput, intersecao };
}
