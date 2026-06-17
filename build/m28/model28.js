// ===== model28.js — Vasopressores & inotrópicos (receptor → termo) · PERFUNDE·CHOCA módulo 28 =====
// Funções PURAS, determinísticas, comentadas. Âncoras: CHOQUE.md / modulos.md §28. Integra M7/M9/M16/M20/M21/M22/M27.
// TESE: uma droga vasoativa NÃO é um nome a decorar — é um PERFIL DE RECEPTORES que move TERMOS da equação:
//   α1 → RVS↑ · β1 → contratilidade↑ e FC↑ (e demanda de O₂↑) · β2 → vasodilatação + demanda metabólica ·
//   V1 (vasopressina) → RVS↑ NÃO-adrenérgica · PDE (milrinona) → inodilatador (contratilidade↑ + vasodilatação).
// Prevê-se o efeito pelo RECEPTOR, não pelo nome. E o agente CERTO é o que move o TERMO QUEBRADO (integra o m27):
//   distributivo (RVS↓) → quem sobe a RVS (α1/V1) · cardiogênico (bomba↓) → quem sobe a contratilidade (β1/PDE).
//   O agente ERRADO custa: vasoconstritor puro num cardiogênico sobe a pós-carga; inodilatador num vasoplégico derruba a PAM.
// SEM dose, SEM titulação, SEM alvo. Só receptor → termo → efeito.

var BASE = {
  PVC:5, HR0:75, SVbase:70,                        // hemodinâmica basal
  kA1_rvs:9.0, kV1_rvs:8.0, kB2_rvs:5.0, kPDE_rvs:5.5,   // RVS (Wood-ish): α1/V1 sobem; β2/PDE descem
  kB1_ino:0.55, kPDE_ino:0.5,                      // contratilidade: β1 e PDE sobem
  kB1_hr:34, kA1_hr:-10,                           // FC: β1 sobe; α1 (reflexo) tende a baixar
  kB1_met:0.55, kB2_met:0.35, RVS0:14, RVSfloor:4, RVSceil:30,
  demand0:1.0
};
function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }
function clamp01(v){ return clampv(v,0,1); }

// Perfil de receptores → vetor de TERMOS movidos (independe do paciente).
// drug = { a1, b1, b2, v1, pde } (0..1 cada)
function terms(drug){
  drug=drug||{}; var B=BASE;
  var a1=clamp01(drug.a1), b1=clamp01(drug.b1), b2=clamp01(drug.b2), v1=clamp01(drug.v1), pde=clamp01(drug.pde);
  return {
    dRVS: B.kA1_rvs*a1 + B.kV1_rvs*v1 - B.kB2_rvs*b2 - B.kPDE_rvs*pde,   // Wood
    dInotropy: B.kB1_ino*b1 + B.kPDE_ino*pde,                            // fração de contratilidade
    dHR: B.kB1_hr*b1 + B.kA1_hr*a1,                                      // bpm
    metabolic: B.kB1_met*b1 + B.kB2_met*b2,                             // demanda de O₂ / risco arrítmico (β)
    a1:a1,b1:b1,b2:b2,v1:v1,pde:pde
  };
}

// Aplica o agente a um paciente com um TERMO quebrado e devolve a hemodinâmica resultante.
// patient = { rvs (Wood basal), pump (0..1 contratilidade basal), preload (0..1.4) }
function applyDrug(patient, drug){
  patient=patient||{}; var B=BASE;
  var rvs0=clampv(patient.rvs==null?14:patient.rvs, B.RVSfloor, B.RVSceil),
      pump0=(patient.pump==null?0.7:clamp01(patient.pump)),
      preload=clampv(patient.preload==null?0.9:patient.preload, 0.1, 1.4);
  var t=terms(drug);
  var rvs=clampv(rvs0 + t.dRVS, B.RVSfloor, B.RVSceil);
  var inotropy=clamp01(pump0 + t.dInotropy);
  var HR=clampv(B.HR0 + t.dHR, 40, 170);
  var SV=B.SVbase*inotropy/0.7*(preload*preload)/(preload*preload+0.2);   // Frank-Starling × contratilidade
  var CO=HR*SV/1000;
  var PAM=clampv(B.PVC + CO*rvs, 35, 140);
  // balanço miocárdico de O₂: demanda (FC·inotropia·custo β) vs oferta (PAM ~ perfusão coronária). Baseline ≈ 0.
  var demand=B.demand0*(HR/75)*(0.6 + 0.4*(inotropy/0.7))*(1 + 0.6*t.metabolic);
  var supply=clampv(PAM/72, 0.3, 1.6);
  var o2balance=supply - demand;     // < 0 = custo/isquemia miocárdica
  return { rvs0:rvs0,pump0:pump0,preload:preload, dRVS:t.dRVS,dInotropy:t.dInotropy,dHR:t.dHR,metabolic:t.metabolic,
    rvs:rvs, inotropy:inotropy, HR:HR, SV:SV, CO:CO, PAM:PAM, demand:demand, supply:supply, o2balance:o2balance };
}

// Catálogo de agentes (PERFIS DE RECEPTORES — mecanismo, SEM dose).
var AGENTS = {
  noradrenalina: { a1:0.9, b1:0.3, b2:0.0, v1:0,   pde:0 },
  adrenalina:    { a1:0.8, b1:0.9, b2:0.4, v1:0,   pde:0 },
  dobutamina:    { a1:0.1, b1:0.9, b2:0.5, v1:0,   pde:0 },
  vasopressina:  { a1:0.0, b1:0.0, b2:0.0, v1:1.0, pde:0 },
  fenilefrina:   { a1:1.0, b1:0.0, b2:0.0, v1:0,   pde:0 },
  milrinona:     { a1:0.0, b1:0.0, b2:0.0, v1:0,   pde:1.0 }
};
var AGENT_NAME = { noradrenalina:'noradrenalina', adrenalina:'adrenalina', dobutamina:'dobutamina', vasopressina:'vasopressina', fenilefrina:'fenilefrina', milrinona:'milrinona' };

// O TERMO DOMINANTE que um agente move (rótulo): 'rvs' (vasopressor), 'inotropy' (inotrópico), 'misto'.
function dominantTerm(drug){ var t=terms(drug);
  var vaso=Math.abs(t.dRVS)/9, ino=t.dInotropy/0.55;
  if(vaso>=0.5 && ino>=0.5) return 'misto';
  if(vaso>=ino) return t.dRVS>=0 ? 'rvs' : 'vasodilata';
  return 'inotropy'; }

// Adequação ao paciente: o agente move o termo QUEBRADO na direção certa e alcança perfusão, sem erro grosseiro?
// O custo miocárdico de O₂ é um ALERTA separado (highCost), não desqualifica sozinho.
// patient.broken = 'rvs' (distributivo) | 'pump' (cardiogênico)
function appropriate(patient, drug){
  patient=patient||{}; var R=applyDrug(patient, drug);
  var baseCO=applyDrug(patient, {}).CO;   // débito sem droga
  var ok=true, why=[];
  if(patient.broken==='rvs'){
    if(R.dRVS<=1){ ok=false; why.push('não sobe a RVS (o termo quebrado)'); }
    if(R.PAM<65){ ok=false; why.push('não alcança a PAM de perfusão'); }
  }
  if(patient.broken==='pump'){
    if(R.dInotropy<=0.05){ ok=false; why.push('não sobe a contratilidade (o termo quebrado)'); }
    if(R.dRVS>5){ ok=false; why.push('sobe demais a pós-carga sobre uma bomba fraca'); }
    if(R.CO<=baseCO+0.1){ ok=false; why.push('não melhora o débito'); }
  }
  var highCost=R.o2balance < -0.45;
  if(highCost) why.push('atenção: custo miocárdico de O₂ elevado');
  return { ok:ok, highCost:highCost, why:why, PAM:R.PAM, CO:R.CO, o2balance:R.o2balance }; }

if (typeof module!=='undefined' && module.exports){
  module.exports = { BASE, clampv, clamp01, terms, applyDrug, AGENTS, AGENT_NAME, dominantTerm, appropriate };
}
