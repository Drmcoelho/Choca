// ===== model1.js — Conteúdo de O₂ (CaO₂) · PERFUNDE·CHOCA módulo 1 =====
// Funções PURAS, determinísticas, comentadas. Unidades explícitas na assinatura.
// Âncoras: CHOQUE.md §2/§4 — CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂.
//   Hb 15 / SaO₂ 100% / PaO₂ 100 → ligado 20,1 · dissolvido 0,30 · total ~20,4 mL/dL.
//   Caso-semente (Hct 32 ≈ Hb 10,7 · SpO₂ 96% · PaO₂ ~70) → ~14,0 mL/dL (~30% abaixo).
// Em <script> clássico estas function-declarations viram globais (reuso entre scripts);
// em Node, o guard de module.exports no fim expõe a API.

// Constante de Hüfner: mL O₂ carregados por g de Hb 100% saturada (convenção do braço).
var K_HUFNER = 1.34;
// Solubilidade do O₂ dissolvido no plasma: mL O₂ / dL / mmHg (a letra-miúda).
var K_DISSOLVIDO = 0.003;
// DC fixo do módulo: isola o termo CONTEÚDO (a variação de DC é dos módulos 3–9).
var DC_FIXO = 5.0;            // L/min
// Referência normal de conteúdo (Hb 15 · SaO₂ 100% · PaO₂ 100) p/ a barra-fantasma e o %.
var CA_NORMAL = caO2(15, 1.0, 100).total;   // ~20,4 mL/dL

// Normaliza saturação: aceita fração (0..1) ou percentual (0..100) → fração.
function asFrac(sat){ return sat > 1 ? sat / 100 : sat; }

// CaO₂ — conteúdo arterial de O₂ (mL O₂ / dL). Devolve as parcelas p/ a barra empilhada.
// hb g/dL · sat (fração ou %) · pao2 mmHg.
function caO2(hb, sat, pao2){
  var s = asFrac(sat);
  var ligado = K_HUFNER * hb * s;        // O₂ ligado à Hb — a quase totalidade
  var dissolvido = K_DISSOLVIDO * pao2;  // O₂ fisicamente dissolvido — quase desprezível, mas existe
  return { ligado: ligado, dissolvido: dissolvido, total: ligado + dissolvido };
}
// Atalho: só o total (mL/dL).
function ca(hb, sat, pao2){ return caO2(hb, sat, pao2).total; }

// Fração do conteúdo que vem do O₂ dissolvido (0..1). Mostra como hiperóxia rende pouco.
function fracDissolvida(hb, sat, pao2){ var c = caO2(hb, sat, pao2); return c.dissolvido / c.total; }

// Conteúdo em % do normal de referência (CA_NORMAL). <100% = déficit de conteúdo.
function pctNormal(hb, sat, pao2){ return 100 * ca(hb, sat, pao2) / CA_NORMAL; }

// DO₂ — entrega de O₂ (mL O₂ / min). dc L/min · caTotal mL/dL.
// ×10 converte dL→L: (mL/dL)·(10 dL/L)·(L/min) = mL/min.
function do2(dc, caTotal){ return dc * caTotal * 10; }
// DO₂ a partir dos componentes do conteúdo, com DC fixo do módulo por padrão.
function do2At(hb, sat, pao2, dc){ if(dc === undefined) dc = DC_FIXO; return do2(dc, ca(hb, sat, pao2)); }

// Veredito de entrega pela DO₂ (mL/min), com DC fixo. Normal ~1020; DO₂ crítico ~400–500.
//   adequada ≥ 800 · limítrofe 500–800 · crítica < 500.
function vereditoEntrega(do2val){
  if(do2val >= 800) return 'adequada';
  if(do2val >= 500) return 'limitrofe';
  return 'critica';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { K_HUFNER, K_DISSOLVIDO, DC_FIXO, CA_NORMAL,
    caO2, ca, fracDissolvida, pctNormal, do2, do2At, vereditoEntrega };
}
