// ===== model9.js — PAM = DC × RVS · a inversão causal · PERFUNDE·CHOCA módulo 9 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §2/§3 / modulos.md §9.
//
// O NÚCLEO do braço. PAM é um PRODUTO, não uma causa:
//   PAM = PVC + DC · RVS        (forma conceitual; RVS em mmHg·min/L → unidades de Wood)
//   RVS(dyn·s·cm⁻⁵) = 80 · (PAM − PVC) / DC
// A INVERSÃO: para uma mesma PAM, há um LEQUE de pares (DC, RVS) — uma hipérbole.
//   Quente/vasodilatado (DC↑, RVS↓) e frio/vasoconstrito (DC↓, RVS↑) podem dar a MESMA PAM.
//   O fluxo que perfunde é o DC; a PAM é a sombra do que o gerou. Ler o número sem
//   decompor o que o gerou é o erro que mata (choque críptico).

// PAM (mmHg) a partir de DC (L/min) e RVS (dyn·s·cm⁻⁵). pvc mmHg.
function pam(dc, rvsDyn, pvc){ if(pvc===undefined)pvc=5; return pvc + dc*rvsDyn/80; }

// RVS (dyn·s·cm⁻⁵) necessária para uma dada PAM com um dado DC — o LOCUS iso-PAM (hipérbole).
function rvsForPam(pamVal, dc, pvc){ if(pvc===undefined)pvc=5; return 80*(pamVal - pvc)/dc; }

// RVS em unidades de Wood (mmHg·min/L) e a recíproca.
function rvsWood(rvsDyn){ return rvsDyn/80; }
function dynFromWood(w){ return w*80; }

// Perfil hemodinâmico (preview do radar do módulo 27).
//   Temperatura (tônus) lida pela RVS: baixa = quente/vasodilatado; alta = frio/vasoconstrito.
//   Fluxo lido pelo DC.
function profile(dc, rvsDyn){
  var temp = (rvsDyn < 800) ? 'quente' : (rvsDyn > 1200 ? 'frio' : 'neutro');
  var fluxo = (dc < 3.5) ? 'baixo' : (dc > 7 ? 'alto' : 'normal');
  return { temp:temp, fluxo:fluxo,
           vasodilatado: rvsDyn < 800, vasoconstrito: rvsDyn > 1200 };
}

// Choque críptico: PAM "tranquilizadora" mascarando fluxo baixo.
//   PAM ≥ 65 (aparência ok) MAS DC baixo (perfusão real comprometida).
function cryptico(dc, rvsDyn, pvc){
  return pam(dc, rvsDyn, pvc) >= 65 && dc < 3.5;
}

// Par de pacientes na MESMA PAM por mecânicas opostas (para o caso/instrumento).
function paresMesmaPAM(pamVal, dcQuente, dcFrio, pvc){
  return {
    quente: { dc:dcQuente, rvs:rvsForPam(pamVal, dcQuente, pvc) },
    frio:   { dc:dcFrio,   rvs:rvsForPam(pamVal, dcFrio,   pvc) }
  };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { pam, rvsForPam, rvsWood, dynFromWood, profile, cryptico, paresMesmaPAM };
}
