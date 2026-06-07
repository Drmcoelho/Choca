// ===== model2.js — A curva como entrega (Severinghaus + Bohr) · PERFUNDE·CHOCA módulo 2 =====
// Funções PURAS, determinísticas, comentadas. Reimplementação do zero (repo separado);
// ponte ao mvp2 do braço 1 pendente. Âncoras: CHOQUE.md §2 / modulos.md §2.

var P50_STD = 26.8;          // P50 da curva padrão (mmHg)
function log10(x){ return Math.log(x)/Math.LN10; }

// Curva de dissociação padrão de Severinghaus (1979): saturação (fração) por PO2 (mmHg).
//   S = 1 / ( 23400/(PO2³ + 150·PO2) + 1 )
// Reproduz P50≈26,8 · S(40)≈0,75 (SvO2 normal) · S(100)≈0,98.
function severinghausStd(po2){
  if (po2 <= 0) return 0;
  return 1 / (23400/(Math.pow(po2,3) + 150*po2) + 1);
}

// P50 ajustada pelo efeito Bohr. Cada fator desloca o log(P50):
//   pH  : ΔlogP50/ΔpH ≈ -0,48  (acidose → P50↑ → desvio à direita)
//   temp: ΔlogP50/ΔT  ≈ +0,024 por °C
//   PCO2: ΔlogP50/Δlog PCO2 ≈ +0,06  (CO2 direto, além do efeito via pH)
//   2,3-DPG: aproximação linear ~ +2,5%/mmol acima de 5 (clampada)
function p50(pH, pco2, temp, dpg){
  if (pH===undefined) pH=7.4; if (pco2===undefined) pco2=40; if (temp===undefined) temp=37; if (dpg===undefined) dpg=5;
  var p = P50_STD;
  p *= Math.pow(10, -0.48*(pH - 7.4));
  p *= Math.pow(10,  0.024*(temp - 37));
  p *= Math.pow(10,  0.06*log10(pco2/40));
  p *= (1 + 0.025*(dpg - 5));
  return p;
}

// Saturação para um PO2 sob condições dadas: reescala o PO2 pela razão de P50
// (desloca a curva inteira ao longo do eixo). P50↑ → razão<1 → menos saturado.
function satCond(po2, pH, pco2, temp, dpg){
  var P = p50(pH, pco2, temp, dpg);
  return severinghausStd(po2 * P50_STD / P);
}
// versão direta por P50 explícito (útil para plot)
function satP50(po2, P){ return severinghausStd(po2 * P50_STD / P); }

// Descarga tecidual (offloading): fração de O2 liberada entre o ponto arterial e o venoso.
//   = SaO2(PaO2) − SvO2(PvO2), nas mesmas condições.
function offloading(pao2, pvo2, pH, pco2, temp, dpg){
  return satCond(pao2, pH, pco2, temp, dpg) - satCond(pvo2, pH, pco2, temp, dpg);
}

if (typeof module !== 'undefined' && module.exports){
  module.exports = { P50_STD, severinghausStd, p50, satCond, satP50, offloading, log10 };
}
