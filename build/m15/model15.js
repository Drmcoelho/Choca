// ===== model15.js — Hemorrágico × não-hemorrágico · PERFUNDE·CHOCA módulo 15 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §3 / modulos.md §15.
// Capstone do hipovolêmico (herda 14). Tese: ambos perdem VOLUME (→ pré-carga↓ → DC↓),
// mas SÓ a hemorragia perde CONTEÚDO (massa de Hb). Logo a DO₂ leva DOIS golpes na
// hemorragia (fluxo E conteúdo); na perda não-hemorrágica há hemoconcentração (Hb↑).
// E repor VOLUME ≠ repor CONTEÚDO: cristaloide restaura fluxo mas dilui a Hb; sangue restaura os dois.

var Hb0=15, SAT=0.97, PAO2=95, DC0=5.0, HR0=75, SBP0=120, HB_CAP=19;

// Conteúdo arterial (mL/dL) — reusa a aritmética do módulo 0/1.
function caO2(hb){ return 1.34*hb*SAT + 0.003*PAO2; }
// Entrega (mL/min) = DC × CaO₂ × 10.
function do2(dc, hb){ return dc * caO2(hb) * 10; }

// Hb resultante após a perda (g/dL), por tipo:
//   hemorragia → perde massa de hemácias: Hb cai com a fração perdida.
//   não-hemorrágica → perde só plasma/água: hemoconcentração (Hb sobe), com teto.
function hbAfter(lossFrac, tipo){
  if (tipo==='hemorragia') return Hb0*(1 - lossFrac);
  return Math.min(HB_CAP, Hb0/(1 - Math.min(0.6, lossFrac)));   // hemoconcentração
}

// DC após a perda (L/min): compensado até ~10%, depois declina (Guyton: Pmsf↓ → RV↓).
function dcAfter(lossFrac){ return Math.max(0.2*DC0, DC0*(1 - 1.4*Math.max(0, lossFrac-0.10))); }

// DO₂ no estado de perda, por tipo (mL/min).
function do2At(lossFrac, tipo){ return do2(dcAfter(lossFrac), hbAfter(lossFrac, tipo)); }

// Índice de choque = FC/PAS (adimensional). FC sobe; PAS cai só após a compensação esgotar.
function hr(lossFrac){ return HR0 + 110*lossFrac; }
function sbp(lossFrac){ return SBP0 - 250*Math.max(0, lossFrac-0.25); }
function shockIndex(lossFrac){ return hr(lossFrac)/sbp(lossFrac); }

// Classe de hemorragia (ATLS, didático) pela fração de volemia perdida.
function hemorrhageClass(lossFrac){
  if (lossFrac < 0.15) return { classe:'I',   sinais:'compensada; FC/PA normais' };
  if (lossFrac < 0.30) return { classe:'II',  sinais:'taquicardia, PA ainda mantida' };
  if (lossFrac < 0.40) return { classe:'III', sinais:'taquicardia + hipotensão, confusão' };
  return                        { classe:'IV',  sinais:'crítica; risco iminente' };
}

// O que está faltando (conceito, não conduta): conteúdo × volume.
function falta(tipo){
  return tipo==='hemorragia'
    ? 'volume E conteúdo (perdeu massa de Hb) — repor só volume não recupera o conteúdo'
    : 'sobretudo volume (conteúdo/Hb preservado, até concentrado)';
}

// Ressuscitação (conceito físico, SEM gatilho/dose):
//   cristaloide → restaura o VOLUME (DC↑) mas DILUI a Hb (conteúdo↓).
//   sangue      → restaura volume E conteúdo (Hb↑).
function resuscitate(lossFrac, tipo, fluido){
  var hb = hbAfter(lossFrac, tipo);
  var dc = Math.min(DC0, dcAfter(lossFrac) + 0.9*(DC0 - dcAfter(lossFrac))); // volume repõe fluxo
  if (fluido==='cristaloide') hb = hb*0.72;                 // diluição
  else if (fluido==='sangue') hb = Math.min(Hb0, hb + (Hb0-hb)*0.7);
  return { dc:dc, hb:hb, do2:do2(dc, hb) };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { caO2, do2, hbAfter, dcAfter, do2At, hr, sbp, shockIndex, hemorrhageClass, falta, resuscitate };
}
