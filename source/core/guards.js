// ===== source/core/guards.js — guardas numéricas e fronteira SaMD · PERFUNDE·CHOCA =====
// Núcleo fisiológico compartilhado (ROADMAP Fase 4). Dois grupos:
//  (1) guardas numéricas reutilizáveis (clamp, finitude, positividade);
//  (2) a fronteira SaMD como FONTE ÚNICA: o detector de ORDEM IMPERATIVA
//      individualizada ("inicie/administre/titule… o paciente"). O guardião de QA
//      (build/qa/qa.js) importa daqui para não duplicar a regra do SAFETY.md §11.

// — guardas numéricas —
function clamp(x, lo, hi){ return x < lo ? lo : (x > hi ? hi : x); }
function clamp01(x){ return clamp(x, 0, 1); }
function isFiniteNum(x){ return typeof x === 'number' && isFinite(x); }
function requirePositive(x, nome){ if(!(isFiniteNum(x) && x > 0)) throw new Error((nome||'valor')+' deve ser > 0'); return x; }

// — fronteira SaMD —
// Bloqueia ORDEM imperativa dirigida a "o paciente". Doses de REFERÊNCIA (diluições,
// faixas usuais) continuam permitidas (SAFETY.md §11); só o imperativo individualizado
// é proibido. Atenção: "dê" (imperativo) é bloqueado; "de" (preposição) não.
var IMPERATIVE_RE = /\b(inicie|administre|titule|prescreva|comece|faça|dê|infunda|ministre|aplique)\b[^<>\n]{0,60}?\b(neste|no|na|para o|para a|para este|para esta|deste|desta|nesta|nele|nela|ao|à|em|do|da)\s+paciente\b/i;

// true se a linha contém uma ordem imperativa individualizada proibida.
function hasImperativeOrder(linha){ return IMPERATIVE_RE.test(linha); }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clamp, clamp01, isFiniteNum, requirePositive, IMPERATIVE_RE, hasImperativeOrder };
}
