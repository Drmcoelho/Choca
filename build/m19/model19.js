// ===== model19.js — Obstrutivos: tamponamento · TEP · pneumotórax · PERFUNDE·CHOCA módulo 19 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §3 / modulos.md §19.
// Capstone procedimental do obstrutivo (herda 18). Os TRÊS dão choque obstrutivo (DC↓, RVS↑),
// mas IMPEDEM PASSOS DIFERENTES da circulação — e cada um tem assinatura e ALÍVIO próprios:
//   tamponamento → ENCHIMENTO diastólico (constrição pericárdica externa) · pulso paradoxal · derrame
//   TEP maciço   → EJEÇÃO do VD (pós-carga súbita) · VD dilatado / septo em D
//   pneumotórax  → RETORNO VENOSO (pressão intratorácica + kink de cavas) · MV ausente · desvio traqueal
// Estado s = {pp, em, pn} (severidades 0..1 de pericárdio, embolia, pneumo).

// Fatores de redução do débito por passo impedido (independentes; 1 = sem impedimento).
function fEnchimento(pp){ return 1 - 0.72*Math.max(0,Math.min(1,pp)); }   // tamponamento
function fEjecaoVD(em){ return 1 - 0.72*Math.max(0,Math.min(1,em)); }      // TEP (pós-carga VD)
function fRetorno(pn){ return 1 - 0.72*Math.max(0,Math.min(1,pn)); }        // pneumotórax

// Débito (L/min). Normal 5; cada obstrução multiplica seu fator.
function co(s){ return 5.0 * fEnchimento(s.pp||0) * fEjecaoVD(s.em||0) * fRetorno(s.pn||0); }

// Pulso paradoxal (queda inspiratória da PAS, mmHg): GRANDE no tamponamento (constrição +
// interdependência sob volume fixo), modesto no pneumotórax, ~basal no TEP. Normal < 10.
function pulsus(s){ return 4 + 22*(s.pp||0) + 7*(s.pn||0); }

// Assinatura de beira de leito / POCUS (sinais discriminadores).
function signs(s){
  return {
    pulsus: pulsus(s),
    derrame:    (s.pp||0) > 0.3,                 // derrame pericárdico (tamponamento)
    dShape:     (s.em||0) > 0.4,                 // VD dilatado / septo em D (TEP)
    mvAusente:  (s.pn||0) > 0.4,                 // murmúrio vesicular ausente unilateral (pneumo)
    desvioTraqueal: (s.pn||0) > 0.55,            // desvio de traqueia/mediastino (pneumo hipertensivo)
    jvd: ((s.pp||0)>0.3 || (s.em||0)>0.4 || (s.pn||0)>0.4)   // turgência jugular: comum aos obstrutivos
  };
}

// O passo da circulação que cada entidade impede (o coração lógico do módulo).
function impededStep(entity){
  return entity==='tamponamento' ? 'enchimento diastólico (constrição externa)'
       : entity==='tep'          ? 'ejeção do VD (pós-carga súbita)'
       : entity==='pneumotorax'  ? 'retorno venoso (pressão intratorácica + kink de cavas)'
       : 'sem obstrução evidente';
}

// Discriminador: dos SINAIS à entidade (árvore de decisão).
function discriminate(s){
  var g = signs(s);
  if (g.derrame && g.pulsus > 12) return 'tamponamento';
  if (g.mvAusente || g.desvioTraqueal) return 'pneumotorax';
  if (g.dShape) return 'tep';
  return 'indeterminado';
}

// Alívio ESPECÍFICO: cada manobra zera o parâmetro do seu próprio mecanismo.
//   pericardiocentese → pp ; trombólise/embolectomia → em ; descompressão (agulha/dreno) → pn.
function reliefParam(type){ return type==='pericardiocentese'?'pp':type==='trombolise'?'em':type==='descompressao'?'pn':null; }
function reliefFor(entity){ return entity==='tamponamento'?'pericardiocentese':entity==='tep'?'trombolise':entity==='pneumotorax'?'descompressao':null; }

// Aplica o alívio: reduz o parâmetro-alvo (a ~0,1). Se NÃO casar com a obstrução ativa,
// o débito praticamente não muda — a lição da especificidade do alívio.
function applyRelief(s, type){
  var p = reliefParam(type); if(!p) return { s:s, co:co(s) };
  var s2 = Object.assign({}, s); s2[p] = Math.min(s2[p]||0, 0.1);
  return { s:s2, co:co(s2) };
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { fEnchimento, fEjecaoVD, fRetorno, co, pulsus, signs, impededStep, discriminate, reliefParam, reliefFor, applyRelief };
}
