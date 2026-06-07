// ===== model13.js — Lactato & depuração · PERFUNDE·CHOCA módulo 13 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §4 / modulos.md §13.
//
// Lactato é uma BALANÇA: produção × depuração. Não é sinônimo de hipoperfusão.
//   Produção tipo A (anaeróbia): déficit de O₂ abaixo do DO₂crítico (herda o módulo 8).
//   Produção tipo B (aeróbia)  : drive β2-adrenérgico (adrenalina, salbutamol), metformina, etc.
//   Depuração: sobretudo HEPÁTICA (ciclo de Cori/oxidação) — cai na hepatopatia e no baixo fluxo.
//   Lactato estacionário = base + produção / clearance.  O que prognostica é a TENDÊNCIA (clearance %).

var LAC_BASE = 0.8;     // lactato basal (mmol/L)
var O2ERMAX  = 0.6;     // extração máxima (p/ o déficit, igual ao módulo 8)
var kA = 0.022;         // mmol/L por mL/min de déficit de O₂ (tipo A)
var kB = 0.50;          // mmol/L por unidade de drive β2 (tipo B; β2 0..10, adimensional)
var kMet = 0.70;        // mmol/L por unidade de carga de metformina (0..3)

// Déficit de O₂ (mL/min) abaixo do DO₂ crítico — reusa a lógica do supply-dependence.
function o2deficit(do2, demand){
  var crit = demand / O2ERMAX;
  var vo2 = (do2 >= crit) ? demand : O2ERMAX*do2;
  return Math.max(0, demand - vo2);
}
function prodAnaerobic(do2, demand){ return kA * o2deficit(do2, demand); }     // tipo A
function prodTypeB(beta2, met){ return kB*(beta2||0) + kMet*(met||0); }          // tipo B

// Lactato estacionário (mmol/L). hepatic normalizado: 1 = normal; <1 = depuração reduzida.
function lactate(P){
  var hep = (P.hepatic===undefined?1:P.hepatic);
  var prod = prodAnaerobic(P.do2, P.demand) + prodTypeB(P.beta2, P.met);
  return LAC_BASE + prod / Math.max(0.1, hep);
}

// Frações de produção por tipo (exclui o basal) — responde "anaerobiose ou β2?".
function typeFraction(P){
  var a = prodAnaerobic(P.do2, P.demand), b = prodTypeB(P.beta2, P.met), tot = a+b;
  if (tot <= 1e-9) return { a:0, b:0 };
  return { a:a/tot, b:b/tot };
}

// Classificação do mecanismo predominante.
function classify(P){
  var hep = (P.hepatic===undefined?1:P.hepatic);
  var a = prodAnaerobic(P.do2, P.demand), b = prodTypeB(P.beta2, P.met), tot = a+b;
  var clearanceLimited = (hep < 0.6) && (tot < 1.2);   // produção modesta, lactato alto por clearance
  var f = typeFraction(P);
  var tipo;
  if (tot < 0.3) tipo = 'normal';
  else if (f.a >= 0.6) tipo = 'tipo A (anaeróbio)';
  else if (f.b >= 0.6) tipo = 'tipo B (aeróbio)';
  else tipo = 'misto';
  return { tipo:tipo, clearanceLimited:clearanceLimited, fracA:f.a, fracB:f.b, lactato:lactate(P) };
}

// Tendência seriada: lactato cai exponencialmente do valor inicial rumo a um novo estacionário,
// com constante de tempo ditada pela depuração (mais clearance = queda mais rápida).
// Retorna [{h, lac}] de 0 a hHoras. lacSteady = lactato com a produção corrigida.
function serial(lac0, lacSteady, hepatic, hHoras){
  hHoras = hHoras||6; var tau = 2.5/Math.max(0.2, hepatic);   // h
  var out=[];
  for (var h=0; h<=hHoras; h+=0.5){ out.push({ h:h, lac: lacSteady + (lac0-lacSteady)*Math.exp(-h/tau) }); }
  return out;
}
// Clearance percentual em t horas (o sinal prognóstico clássico das ~2h/6h).
function clearancePct(lac0, lacT){ return lac0>0 ? 100*(lac0-lacT)/lac0 : 0; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { LAC_BASE, o2deficit, prodAnaerobic, prodTypeB, lactate, typeFraction, classify, serial, clearancePct };
}
