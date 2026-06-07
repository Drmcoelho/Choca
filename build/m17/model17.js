// ===== model17.js — O ventrículo direito (o VD esquecido) · PERFUNDE·CHOCA módulo 17 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §4 / modulos.md §17.
// Capstone do cardiogênico (herda a lógica de bomba do 16). O VD é OUTRO animal:
//   parede fina, feito para BAIXA pós-carga → exquisitamente INTOLERANTE a pós-carga (RVP/Ppa);
//   PRÉ-CARGA-dependente, mas com CORCOVA: overdistensão piora (a "Starling de VD" desce).
//   INTERDEPENDÊNCIA: VD dilatado desvia o septo (D-shape) → rouba o enchimento do VE.
//   ESPIRAL: pós-carga↑ → VD dilata → MAP↓ → isquemia coronária do VD → pior contratilidade.
// Tudo normalizado; CO em L/min (normal ≈ 5).

// Pós-carga do VD: fator íngreme — pequenas altas de RVP derrubam o fluxo anterógrado.
function afterloadFactor(pvr){ return 1/(1 + 1.3*Math.max(0, pvr-1)); }   // pvr normalizado (1 = normal)
// Perfusão coronária do VD ditada pela MAP (gradiente de perfusão). <40 ~ nula; ≥65 plena.
function coronaryFactor(map){ return Math.max(0, Math.min(1, (map-40)/25)); }
// Contratilidade EFETIVA do VD = intrínseca × (perfusão coronária) — o elo da espiral.
function rvEffContr(rvContr, map){ return rvContr*(0.55 + 0.45*coronaryFactor(map)); }
// Pré-carga do VD com CORCOVA (overdistensão derruba). vol normalizado (1 = euvolemia).
function preloadHump(vol){ return vol<=0 ? 0 : vol*Math.exp(1-vol); }   // pico em vol≈1, decai depois
// Fluxo anterógrado do VD (fração do normal): contratilidade × pré-carga × (1/pós-carga).
function rvForward(P){ return rvEffContr(P.rvContr, P.map) * preloadHump(P.vol) * afterloadFactor(P.pvr); }

// Dilatação do VD (proxy de tamanho/pressão): overfilling + sobrecarga de pressão.
function rvDilation(P){ return Math.max(0, P.vol-1)*0.7 + (1 - afterloadFactor(P.pvr))*1.0; }
// Desvio septal (fração de redução do enchimento do VE pela interdependência).
function septalShift(P){ return Math.min(0.8, 0.5*rvDilation(P)); }

// Enchimento do VE (fração do normal): limitado em SÉRIE (o que o VD bombeia) E em
// PARALELO (o septo desviado reduz a complacência/volume do VE).
function lvFill(P){ return Math.max(0, Math.min(rvForward(P), 1 - septalShift(P))); }
// Starling do VE (saturante), normalizada a 1 no enchimento pleno.
function lvStarling(f){ return f<=0 ? 0 : 1.4*f/(0.4+f); }
// Débito sistêmico (L/min). O VE está normal; cai por SUBenchimento (interdependência), não por falha própria.
function co(P){ return 5.0 * lvStarling(lvFill(P)); }

// Espiral ativa: pós-carga alta + MAP baixa + débito baixo (o ciclo vicioso do VD).
function spiral(P){ return P.pvr>1.6 && P.map<60 && co(P)<3.2; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { afterloadFactor, coronaryFactor, rvEffContr, preloadHump, rvForward, rvDilation, septalShift, lvFill, lvStarling, co, spiral };
}
