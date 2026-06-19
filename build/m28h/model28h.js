// ===== model28h.js — Segurança operacional · camada de referência §11 (28H) · PERFUNDE·CHOCA =====
// Submódulo do hub: a camada de REFERÊNCIA EDUCACIONAL (SAFETY.md §11). Diluições e faixas
// USUAIS, calculadora de CONVERSÃO dose↔mL/h (peso HIPOTÉTICO), titulação como FAIXA, e a
// segurança operacional (acesso, extravasamento, metas, lactato falso por β2, desmame).
// Engine PURO standalone (window.H28); a aritmética CONFORMA build/m28/pharm28.js (test28h).
// PERMITIDO exibir faixa de dose (§11.1); PROIBIDO ordem imperativa individualizada (§11.2).

function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }

// Diluições e faixas USUAIS de referência (idênticas ao pharm28 publicado).
var DRUGS = {
  noradrenalina: { nome:'Noradrenalina', receptor:'α1 > β1', classe:'vasopressor',
    apresentacao:'ampola 4 mg / 4 mL', diluicao:{ massa:16, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:16000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.01, doseMax:3.0 },
  adrenalina: { nome:'Adrenalina', receptor:'α1 + β1 + β2', classe:'vaso-inotrópico',
    apresentacao:'ampola 1 mg / 1 mL', diluicao:{ massa:4, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:4000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.01, doseMax:0.5 },
  dobutamina: { nome:'Dobutamina', receptor:'β1 > β2', classe:'inotrópico',
    apresentacao:'ampola 250 mg / 20 mL', diluicao:{ massa:250, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:250000, weightBased:true, unidade:'mcg/kg/min', doseMin:2.5, doseMax:20 },
  dopamina: { nome:'Dopamina', receptor:'DA / β1 / α1', classe:'misto',
    apresentacao:'ampola 50 mg / 10 mL', diluicao:{ massa:400, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:400000, weightBased:true, unidade:'mcg/kg/min', doseMin:2, doseMax:20 },
  vasopressina: { nome:'Vasopressina', receptor:'V1', classe:'vasopressor',
    apresentacao:'ampola 20 U / 1 mL', diluicao:{ massa:20, massaU:'U', volume:100, solvente:'SG 5%' },
    massaU_total:20, weightBased:false, unidade:'U/min', doseMin:0.01, doseMax:0.04 },
  milrinona: { nome:'Milrinona', receptor:'inibidor da PDE-3', classe:'inodilatador',
    apresentacao:'ampola 20 mg / 20 mL', diluicao:{ massa:20, massaU:'mg', volume:100, solvente:'SG 5%' },
    massaMcg:20000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.125, doseMax:0.75 },
  fenilefrina: { nome:'Fenilefrina', receptor:'α1 puro', classe:'vasopressor',
    apresentacao:'ampola 10 mg / 1 mL', diluicao:{ massa:10, massaU:'mg', volume:100, solvente:'SG 5%' },
    massaMcg:10000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.1, doseMax:1.4 }
};

function concentration(key){ var d=DRUGS[key]; if(!d) return {value:0,unit:''};
  if(d.weightBased || d.massaMcg!=null){ return { value:d.massaMcg/d.diluicao.volume, unit:'mcg/mL' }; }
  return { value:d.massaU_total/d.diluicao.volume, unit:'U/mL' }; }
// Conversão (aritmética de unidades) — peso HIPOTÉTICO.
function infusionRate(key, dose, weightKg){ var d=DRUGS[key]; if(!d) return 0; var c=concentration(key).value; if(c<=0) return 0;
  dose=clampv(dose,0,1e6); var w=clampv(weightKg==null?70:weightKg,1,400); var perMin=d.weightBased?dose*w:dose; return (perMin*60)/c; }
function doseFromRate(key, mLh, weightKg){ var d=DRUGS[key]; if(!d) return 0; var c=concentration(key).value; if(c<=0) return 0;
  var w=clampv(weightKg==null?70:weightKg,1,400); var perMin=(clampv(mLh,0,1e6)*c)/60; return d.weightBased?perMin/w:perMin; }
function titration(key, weightKg, n){ var d=DRUGS[key]; if(!d) return []; n=n||5; var out=[], denom=(n>1)?(n-1):1;
  for(var i=0;i<n;i++){ var dose=d.doseMin+(d.doseMax-d.doseMin)*(i/denom); out.push({ dose:dose, mLh:infusionRate(key,dose,weightKg) }); } return out; }

// Segurança operacional (mecanismo/efeito — NÃO conduta individualizada).
var SAFETY = {
  acesso: 'preferir acesso central para vasopressor; periférico apenas transitório e vigiado (risco de extravasamento).',
  extravasamento: 'vasopressor extravasado → vasoconstrição local → necrose; reconhecer cedo é o que importa.',
  metas: 'a meta de PAM é um alvo de perfusão (referência ~65 mmHg na maioria), individualizado pela equipe — não por esta página.',
  lactatoB2: 'agentes β (adrenalina) sobem o lactato por estímulo β2 (tipo B): pode simular piora de perfusão sem hipoperfusão.',
  arritmia: 'β1/β2 e dose alta → taquiarritmia e isquemia por demanda; vigiar o ritmo.',
  isquemia: 'α1/V1 em dose alta → isquemia digital, mesentérica, renal.',
  desmame: 'reduzir o vasopressor à medida que o termo quebrado se recupera; a ordem e o ritmo são decisão da equipe à beira do leito.',
  compatibilidade: 'checar compatibilidade em Y e estabilidade da diluição conforme a fonte/instituição.'
};

// Enquadramento §11 obrigatório (texto-âncora para a UI e o validador).
var FRAMING = {
  referencia: 'os valores são FAIXAS USUAIS DE REFERÊNCIA, variam por fonte/instituição.',
  protocolo: 'confira o protocolo da sua instituição.',
  naoPrescricao: 'não é prescrição individualizada nem substitui o julgamento clínico.',
  pesoHipotetico: 'o peso é hipotético/demonstrativo, não o de um paciente real.'
};

if (typeof module!=='undefined' && module.exports){
  module.exports = { clampv, DRUGS, concentration, infusionRate, doseFromRate, titration, SAFETY, FRAMING }; }
