// ===== model27.js — Os 4 perfis · radar (quente/frio × seco/úmido) · PERFUNDE·CHOCA módulo 27 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md / modulos.md §27. Integra M9/M14/M16/M20/M23.
// TESE: dois eixos clínicos resumem o estado hemodinâmico — PERFUSÃO (quente↔frio, é FLUXO, não pressão) e
//   CONGESTÃO (seco↔úmido, são pressões de enchimento). O 2×2 dá quatro perfis (Nohria/Stevenson):
//     A = quente-seco (compensado)   B = quente-úmido (congesto, mas perfundindo)
//     L = frio-seco (hipoperfundido sem congestão · hipovolêmico)   C = frio-úmido (cardiogênico · o pior)
// É um MAPA DE HIPÓTESES, não diagnóstico fechado: o mesmo perfil nasce de mecanismos diferentes — o RADAR dos
//   termos (pré-carga, bomba, RVS) refina. E a MESMA alavanca tem efeito OPOSTO por perfil: volume salva o
//   frio-seco e AFOGA o frio-úmido; o inotrópico é o que tira o frio-úmido do canto. Mecanismo, SEM conduta.

var BASE = {
  HR:80, SVmax:95, kStarling:0.55, pumpFloor:0.25, kPumpSV:0.75,  // débito = FC·VS; VS = SVmax·volume²/(volume²+k)·(0.25+0.75·bomba)
  CO_warm:4.0,                                     // perfusão (quente) a partir do débito; quente se ≥ ~CO_warm
  congKnee:0.45, kCong:1.8, kPumpCong:0.6,         // congestão = pressão de enchimento: volume acima do que a bomba aguenta
  WARM:0.5, WET:0.5                                // limiares normalizados: quente se perfusão≥0.5; úmido se congestão≥0.5
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }

// Estado dado os termos subjacentes (a integração dos módulos anteriores).
// p = { volume(0..1.5 pré-carga/volemia), pump(0..1 contratilidade), tone(0..1 RVS/vasoconstrição) }
function radar(p){
  p=p||{}; var B=BASE;
  var volume=clampv(p.volume==null?0.7:p.volume, 0, 1.6),
      pump=(p.pump==null?0.7:clamp01(p.pump)),
      tone=(p.tone==null?0.5:clamp01(p.tone));

  // débito (fluxo anterógrado) — Frank-Starling saturante × contratilidade
  var SV = B.SVmax*(volume*volume)/(volume*volume + B.kStarling*B.kStarling)*(B.pumpFloor + B.kPumpSV*pump);
  var CO = B.HR*SV/1000;
  // PERFUSÃO (quente↔frio) = FLUXO, não pressão. A vasoconstrição (tone) segura a PRESSÃO mas esfria a periferia,
  // então NÃO esquenta a perfusão (de propósito: o frio com PA normal é a armadilha).
  var perfusion = clampv((CO-2.0)/(B.CO_warm-2.0), 0, 1.3);
  // CONGESTÃO (seco↔úmido) = pressão de enchimento: volume acima do que a bomba comporta → backup
  var fillExcess = Math.max(0, volume - B.congKnee - B.kPumpCong*pump);
  var congestion = clampv(B.kCong*fillExcess, 0, 1.6);

  var warm = perfusion >= B.WARM, wet = congestion >= B.WET;
  // pressão arterial (proxy) — pode estar NORMAL mesmo no frio, sustentada pela vasoconstrição
  var map = clampv(55 + 40*CO/B.CO_warm + 35*tone, 40, 130);

  return { volume:volume, pump:pump, tone:tone, SV:SV, CO:CO, perfusion:perfusion, congestion:congestion,
    warm:warm, wet:wet, map:map };
}

// Perfil (Nohria): A quente-seco · B quente-úmido · L frio-seco · C frio-úmido.
function profile(p){ var R=radar(p);
  if(R.warm) return R.wet?'B':'A';
  return R.wet?'C':'L'; }
var PROFILE_NAME = { A:'quente-seco', B:'quente-úmido', L:'frio-seco', C:'frio-úmido' };

// Hipóteses de mecanismo por perfil (mapa, não diagnóstico) — os termos que tipicamente o geram.
function hypotheses(prof){
  switch(prof){
    case 'A': return ['compensado/normal','sem termo dominante quebrado'];
    case 'B': return ['congestão com perfusão preservada','sobrecarga de volume / pós-carga (ex.: EAP hipertensivo)'];
    case 'L': return ['pré-carga baixa (hipovolêmico)','débito baixo SEM congestão'];
    case 'C': return ['bomba falida (cardiogênico)','débito baixo COM congestão — o pior canto'];
    default:  return [];
  }
}

// ---- Alavancas (mecanismo, SEM dose/protocolo) — o efeito DEPENDE do perfil ----
function applyVolume(p){ p=p||{}; var s=Object.assign({},p); var v=clampv(p.volume==null?0.7:p.volume,0,1.6); s.volume=Math.min(1.6,v+0.4); return s; }   // +pré-carga
function applyDiuretic(p){ p=p||{}; var s=Object.assign({},p); var v=clampv(p.volume==null?0.7:p.volume,0,1.6); s.volume=Math.max(0,v-0.4); return s; } // −volume (descongestiona)
function applyInotrope(p){ p=p||{}; var s=Object.assign({},p); var u=(p.pump==null?0.7:clamp01(p.pump)); s.pump=Math.min(1,u+0.35); return s; }        // +contratilidade

// Efeito de uma alavanca: ΔCO (perfusão) e Δcongestão — para mostrar que o mesmo gesto ajuda/piora conforme o perfil.
function leverEffect(p, fn){ var a=radar(p), b=radar(fn(p)); return { dCO:b.CO-a.CO, dCong:b.congestion-a.congestion, profFrom:profile(p), profTo:profile(fn(p)) }; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, radar, profile, PROFILE_NAME, hypotheses, applyVolume, applyDiuretic, applyInotrope, leverEffect };
}
