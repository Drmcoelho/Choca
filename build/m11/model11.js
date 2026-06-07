// ===== model11.js — POCUS hemodinâmico & acessos · PERFUNDE·CHOCA módulo 11 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md §6 / modulos.md §11.
// Módulo-bandeira de procedimentos: o ultrassom responde à beira do leito QUAL termo quebrou.
// FIREWALL SaMD: interpreta o que a janela MEDE/REVELA (mecanismo) — nunca conduta de paciente.

// Índice de colapsabilidade da IVC (fração): (Dmax − Dmin)/Dmax na respiração.
function ivcCI(dmax, dmin){ if(dmax<=0) return 0; return (dmax - dmin)/dmax; }

// Estimativa CATEGÓRICA da pressão de átrio direito a partir da IVC (regra ASE, educacional).
//   pequena (≤2,1 cm) e muito colabável (>50%)  → pressão BAIXA  (~3 mmHg)
//   grande (>2,1 cm) e pouco colabável (<50%)    → pressão ALTA   (~15 mmHg)
//   demais combinações                            → INTERMEDIÁRIA (~8 mmHg)
function rapFromIVC(dmaxCm, ciFrac){
  if (dmaxCm <= 2.1 && ciFrac > 0.5) return { rap:3,  faixa:'baixa' };
  if (dmaxCm > 2.1 && ciFrac < 0.5)  return { rap:15, faixa:'alta' };
  return { rap:8, faixa:'intermediária' };
}

// Leitura de volume/pré-carga a partir da IVC (mecanismo, não conduta).
function volumeHint(dmaxCm, ciFrac){
  var f = rapFromIVC(dmaxCm, ciFrac).faixa;
  if (f==='baixa')  return 'pressão de enchimento baixa — reserva de pré-carga provável';
  if (f==='alta')   return 'pressão de enchimento alta — pouca reserva, risco de congestão';
  return 'zona cinzenta — integrar com clínica e outras janelas';
}

// Linhas pulmonares (protocolo BLUE): A-lines = pulmão arejado; ≥3 B-lines/campo = intersticial.
function lungLines(bPerField){
  if (bPerField >= 3) return { padrao:'B-lines', leitura:'síndrome intersticial / congestão (EVLW↑)' };
  return { padrao:'A-lines', leitura:'pulmão arejado (seco) — afasta congestão naquele campo' };
}

// Mapeia o CENÁRIO à janela que responde, ao achado e ao TERMO quebrado da equação do braço.
function windowFor(scenario){
  var M = {
    tamponamento: { janela:'subxifoide / paraesternal', achado:'derrame pericárdico + colapso diastólico de câmaras', termo:'enchimento (obstrutivo)' },
    tep:          { janela:'paraesternal / apical',      achado:'VD dilatado, septo em D (D-shape), McConnell', termo:'pós-carga de VD (obstrutivo)' },
    edema:        { janela:'pulmão (BLUE)',              achado:'B-lines difusas bilaterais',                 termo:'congestão / água extravascular' },
    hipovolemia:  { janela:'IVC',                         achado:'IVC pequena e muito colabável',               termo:'pré-carga baixa' },
    ve_falencia:  { janela:'paraesternal (eixo longo)',  achado:'VE dilatado e hipocontrátil (fração visual baixa)', termo:'bomba (contratilidade)' },
    normal:       { janela:'varredura geral',            achado:'IVC normal, sem derrame, A-lines, VE/VD normais', termo:'sem quebra evidente' }
  };
  return M[scenario] || M.normal;
}

if (typeof module!=='undefined' && module.exports){
  module.exports = { ivcCI, rapFromIVC, volumeHint, lungLines, windowFor };
}
