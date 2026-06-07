// ===== model4.js — Interseção de Guyton · PERFUNDE·CHOCA módulo 4 =====
// O engine-jóia. Funções PURAS, determinísticas, comentadas.
// Plano: x = Pra/PVC (mmHg), y = fluxo (L/min).
//   curva de RETORNO VENOSO  : decrescente, zera em Pra = Pmsf, com platô de colapso venoso.
//   curva de FUNÇÃO CARDÍACA : Starling saturante, crescente.
//   PONTO DE OPERAÇÃO        : a interseção (o coração ejeta o que retorna).
// Âncoras: CHOQUE.md §5 / modulos.md §4.

// Retorno venoso (L/min). Pmsf = pressão sistêmica média de enchimento (mmHg).
// Rvr = resistência ao retorno venoso (mmHg·min/L). colapso = Pra onde as
// grandes veias intratorácicas colabam (subatmosférica) → RV satura (platô).
function venousReturn(pra, Pmsf, Rvr, colapso){
  if (colapso === undefined) colapso = -4;
  if (pra >= Pmsf) return 0;                       // gradiente nulo → sem retorno
  var p = (pra < colapso) ? colapso : pra;         // abaixo do colapso, RV não cresce mais
  return (Pmsf - p) / Rvr;
}

// Função cardíaca / Frank-Starling (L/min). Curva saturante:
//   CO = COmax · (pra − pra0) / (K + (pra − pra0)),  para pra > pra0; senão 0.
// COmax = platô (contratilidade); pra0 = intercepto no eixo x; K = meia-saturação.
function cardiacOutput(pra, COmax, pra0, K){
  if (pra0 === undefined) pra0 = -2;
  if (K === undefined) K = 2;
  var d = pra - pra0;
  if (d <= 0) return 0;
  return COmax * d / (K + d);
}

// Ponto de operação = interseção das duas curvas (bisseção robusta).
// VR é não-crescente e CO é crescente em pra → cruzamento único.
// Retorna { pra, co } no ponto onde VR(pra) = CO(pra).
function intersecao(P){
  var Pmsf = P.Pmsf, Rvr = P.Rvr, COmax = P.COmax,
      pra0 = (P.pra0===undefined?-2:P.pra0), K = (P.K===undefined?2:P.K),
      colapso = (P.colapso===undefined?-4:P.colapso);
  var f = function(pra){ return venousReturn(pra,Pmsf,Rvr,colapso) - cardiacOutput(pra,COmax,pra0,K); };
  var lo = colapso, hi = Pmsf;          // f(lo) > 0 (VR máx, CO baixo) ; f(hi) < 0
  // garante sinais opostos; se não, devolve extremo plausível
  if (f(lo) <= 0) { var pra0c = lo; return { pra: pra0c, co: cardiacOutput(pra0c,COmax,pra0,K) }; }
  for (var i=0;i<80;i++){
    var mid = (lo+hi)/2, fm = f(mid);
    if (fm > 0) lo = mid; else hi = mid;
  }
  var praStar = (lo+hi)/2;
  var coStar = cardiacOutput(praStar,COmax,pra0,K);
  return { pra: praStar, co: coStar };
}

// amostragem das curvas p/ plotagem (arrays de {x,y})
function amostraVR(P, xs){
  return xs.map(function(x){ return { x:x, y:venousReturn(x,P.Pmsf,P.Rvr,(P.colapso===undefined?-4:P.colapso)) }; });
}
function amostraCardiac(P, xs){
  return xs.map(function(x){ return { x:x, y:cardiacOutput(x,P.COmax,(P.pra0===undefined?-2:P.pra0),(P.K===undefined?2:P.K)) }; });
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { venousReturn, cardiacOutput, intersecao, amostraVR, amostraCardiac };
}
