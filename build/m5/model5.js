// ===== model5.js — Guyton aplicado: responsivo ≠ tolerante · PERFUNDE·CHOCA módulo 5 =====
// Funções PURAS, determinísticas, comentadas. HERDA o engine de Guyton (módulo 4).
// Dois eixos independentes:
//   RESPONSIVIDADE = quanto a interseção sobe com um bolus (ΔCO por +Pmsf) — alta no ramo ascendente.
//   TOLERÂNCIA     = se pulmão/VD aguentam o volume (congestão pós-bolus vs complacência).
// Âncoras: CHOQUE.md §5 / modulos.md §5.

// --- Guyton herdado (idêntico ao model4) ---
function venousReturn(pra, Pmsf, Rvr, colapso){
  if (colapso===undefined) colapso=-4;
  if (pra>=Pmsf) return 0;
  var p=(pra<colapso)?colapso:pra;
  return (Pmsf-p)/Rvr;
}
function cardiacOutput(pra, COmax, pra0, K){
  if (pra0===undefined) pra0=-2; if (K===undefined) K=2;
  var d=pra-pra0; if (d<=0) return 0;
  return COmax*d/(K+d);
}
function intersecao(P){
  var Pmsf=P.Pmsf,Rvr=P.Rvr,COmax=P.COmax,
      pra0=(P.pra0===undefined?-2:P.pra0),K=(P.K===undefined?2:P.K),
      colapso=(P.colapso===undefined?-4:P.colapso);
  var f=function(pra){ return venousReturn(pra,Pmsf,Rvr,colapso)-cardiacOutput(pra,COmax,pra0,K); };
  var lo=colapso,hi=Pmsf;
  if (f(lo)<=0) return { pra:lo, co:cardiacOutput(lo,COmax,pra0,K) };
  for (var i=0;i<80;i++){ var mid=(lo+hi)/2; if (f(mid)>0) lo=mid; else hi=mid; }
  var praStar=(lo+hi)/2;
  return { pra:praStar, co:cardiacOutput(praStar,COmax,pra0,K) };
}

// --- Novas funções do módulo 5 ---

// Ganho de débito por um bolus (ΔCO, L/min) ao subir a Pmsf em dPmsf.
// Equivale à elevação reversível por elevação de pernas (auto-bolus).
function bolusGain(P, dPmsf){
  if (dPmsf===undefined) dPmsf=3;
  return intersecao(Object.assign({},P,{Pmsf:P.Pmsf+dPmsf})).co - intersecao(P).co;
}

// PPV/VVS (%): variação do débito ao longo do ciclo respiratório, que oscila a Pmsf
// efetiva em ±swing (a ventilação modula o retorno venoso). Alta = ramo íngreme = responsivo.
function ppvPercent(P, swing){
  if (swing===undefined) swing=2.5;
  var coHi=intersecao(Object.assign({},P,{Pmsf:P.Pmsf+swing})).co;
  var coLo=intersecao(Object.assign({},P,{Pmsf:Math.max(0,P.Pmsf-swing)})).co;
  var mean=(coHi+coLo)/2;
  return mean>0 ? 100*(coHi-coLo)/mean : 0;
}

// Colapsabilidade da VCI (%): cai com a pressão de operação (Pra). Pra baixa → veia vazia → colaba.
function ivcCollapse(P){
  var pra=intersecao(P).pra;
  var c=60*(6-pra)/10;                 // monotônica decrescente em Pra
  return Math.max(0, Math.min(70, c));
}

// Pressão de enchimento (Pra) PÓS-bolus padrão — o que sobe ao dar volume.
function praPosBolus(P, dPmsf){
  if (dPmsf===undefined) dPmsf=3;
  return intersecao(Object.assign({},P,{Pmsf:P.Pmsf+dPmsf})).pra;
}
// Índice de congestão para exibição: Pra pós-bolus normalizada pela complacência.
function congestionRisk(P, dPmsf){
  var Clung=(P.Clung===undefined?1:P.Clung);
  return praPosBolus(P, dPmsf) / Clung;
}

// Classificação de DOIS EIXOS independentes (o coração do módulo):
//   responsivo = o bolus rende débito (ramo ascendente da Starling)
//   tolerante  = pulmão/VD aguentam → complacência preservada E não-já-congesto
// Limiares calibrados (ver test5): ganho ≥ 0,4 L/min · Clung ≥ 0,6 · Pra pós-bolus < 12.
function classify(P){
  var Clung=(P.Clung===undefined?1:P.Clung);
  var responsivo = bolusGain(P) >= 0.4;
  var tolerante  = (Clung >= 0.6) && (praPosBolus(P) < 12);
  var quad;
  if (responsivo && tolerante) quad='responsivo-tolerante';
  else if (responsivo && !tolerante) quad='responsivo-intolerante';   // a armadilha
  else if (!responsivo && tolerante) quad='plato-tolerante';
  else quad='plato-intolerante';
  return { responsivo:responsivo, tolerante:tolerante, quadrante:quad,
           bolusGain:bolusGain(P), ppv:ppvPercent(P), ivc:ivcCollapse(P),
           praPos:praPosBolus(P), congestao:congestionRisk(P) };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { venousReturn, cardiacOutput, intersecao, bolusGain, ppvPercent, ivcCollapse, praPosBolus, congestionRisk, classify };
}
