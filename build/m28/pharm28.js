// ===== pharm28.js — Referência farmacológica educacional + calculadora · PERFUNDE·CHOCA módulo 28 =====
// Funções PURAS, determinísticas, testáveis. Camada autorizada pelo SAFETY.md §11.
// REFERÊNCIA EDUCACIONAL · faixas e diluições USUAIS · confira o protocolo da sua instituição · NÃO é prescrição
// individualizada · o peso é HIPOTÉTICO/demonstrativo. A calculadora é ARITMÉTICA DE UNIDADES (dose ↔ mL/h), não conduta.
// Conversões: mL/h = dose · (peso, se mcg/kg/min) · 60 / concentração ;  concentração = massa_no_frasco / volume.

function clampv(v,a,b){ var n=Number(v); return isNaN(n)?a:(n<a?a:(n>b?b:n)); }

// Catálogo de referência (valores USUAIS de literatura; variam por fonte/instituição).
var DRUGS = {
  noradrenalina: { nome:'Noradrenalina', receptor:'α1 > β1', classe:'vasopressor',
    apresentacao:'ampola 4 mg / 4 mL (1 mg/mL)', diluicao:{ massa:16, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:16000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.01, doseMax:3.0,
    nota:'titular pela resposta; dose alta → isquemia periférica/mesentérica' },
  adrenalina: { nome:'Adrenalina', receptor:'α1 + β1 + β2', classe:'vaso-inotrópico',
    apresentacao:'ampola 1 mg / 1 mL (1:1000)', diluicao:{ massa:4, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:4000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.01, doseMax:0.5,
    nota:'move 4 termos (RVS/contratilidade/FC/metabolismo); hiperlactatemia tipo B' },
  dobutamina: { nome:'Dobutamina', receptor:'β1 > β2', classe:'inotrópico',
    apresentacao:'ampola 250 mg / 20 mL', diluicao:{ massa:250, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:250000, weightBased:true, unidade:'mcg/kg/min', doseMin:2.5, doseMax:20,
    nota:'pode baixar a PA (β2); taquicardia/arritmia em dose alta' },
  dopamina: { nome:'Dopamina', receptor:'DA / β1 / α1 (dose-dependente)', classe:'misto',
    apresentacao:'ampola 50 mg / 10 mL', diluicao:{ massa:400, massaU:'mg', volume:250, solvente:'SG 5%' },
    massaMcg:400000, weightBased:true, unidade:'mcg/kg/min', doseMin:2, doseMax:20,
    nota:'efeito muda com a dose (DA→β1→α1); mais arritmia que a noradrenalina' },
  vasopressina: { nome:'Vasopressina', receptor:'V1 (não-adrenérgico)', classe:'vasopressor',
    apresentacao:'ampola 20 U / 1 mL', diluicao:{ massa:20, massaU:'U', volume:100, solvente:'SG 5%' },
    massaU_total:20, weightBased:false, unidade:'U/min', doseMin:0.01, doseMax:0.04,
    nota:'dose FIXA (não por peso); poupadora de catecolamina; isquemia se dose alta' },
  milrinona: { nome:'Milrinona', receptor:'inibidor da PDE-3', classe:'inodilatador',
    apresentacao:'ampola 20 mg / 20 mL', diluicao:{ massa:20, massaU:'mg', volume:100, solvente:'SG 5%' },
    massaMcg:20000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.125, doseMax:0.75,
    nota:'inotropia sem β (menos demanda de O₂); vasodilata → pode baixar a PA; clearance renal' },
  fenilefrina: { nome:'Fenilefrina', receptor:'α1 puro', classe:'vasopressor',
    apresentacao:'ampola 10 mg / 1 mL', diluicao:{ massa:10, massaU:'mg', volume:100, solvente:'SG 5%' },
    massaMcg:10000, weightBased:true, unidade:'mcg/kg/min', doseMin:0.1, doseMax:1.4,
    nota:'α1 puro → bradicardia reflexa; sobe a pós-carga (cuidado na bomba fraca)' }
};

// Concentração da diluição: mcg/mL (drogas em massa) ou U/mL (vasopressina).
function concentration(key){ var d=DRUGS[key]; if(!d) return {value:0,unit:''};
  if(d.weightBased || d.massaMcg!=null){ return { value: d.massaMcg / d.diluicao.volume, unit:'mcg/mL' }; }
  return { value: d.massaU_total / d.diluicao.volume, unit:'U/mL' }; }

// Taxa de infusão (mL/h) para uma dose e um peso HIPOTÉTICO.
function infusionRate(key, dose, weightKg){
  var d=DRUGS[key]; if(!d) return 0; var c=concentration(key).value; if(c<=0) return 0;
  dose=clampv(dose,0,1e6); var w=clampv(weightKg==null?70:weightKg, 1, 400);
  var perMin = d.weightBased ? dose*w : dose;     // mcg/min ou U/min
  return (perMin*60)/c;                            // mL/h
}
// Dose a partir da taxa (mL/h) — a inversa.
function doseFromRate(key, mLh, weightKg){
  var d=DRUGS[key]; if(!d) return 0; var c=concentration(key).value; if(c<=0) return 0;
  var w=clampv(weightKg==null?70:weightKg, 1, 400); var perMin=(clampv(mLh,0,1e6)*c)/60;
  return d.weightBased ? perMin/w : perMin; }
// Tabela de titulação: n pontos da faixa usual → mL/h (para um peso hipotético).
function titration(key, weightKg, n){
  var d=DRUGS[key]; if(!d) return []; n=n||5; var out=[];
  for(var i=0;i<n;i++){ var dose=d.doseMin + (d.doseMax-d.doseMin)*(i/(n-1)); out.push({ dose:dose, mLh:infusionRate(key,dose,weightKg) }); }
  return out; }

// Usos combinados (mecanismo) — por que se associam.
var COMBOS = [
  { a:'dobutamina', b:'noradrenalina', mecanismo:'cardiogênico: a dobutamina (inodilatador) sobe o débito mas pode baixar a RVS/PA; a noradrenalina (α1) sustenta a RVS — somam fluxo + pressão.' },
  { a:'milrinona', b:'noradrenalina', mecanismo:'inodilatador + vasopressor: a milrinona melhora a bomba e baixa a RVP (útil no VD); a noradrenalina segura a PAM que a vasodilatação tira.' },
  { a:'vasopressina', b:'noradrenalina', mecanismo:'séptico: a vasopressina (V1) é poupadora de catecolamina; somada à noradrenalina, sobe a PAM por duas vias com menos dose adrenérgica.' },
  { a:'adrenalina', b:'—', mecanismo:'move 4 termos sozinha (α/β); usada quando se quer potência ampla (anafilaxia, PCR, baixo débito refratário), aceitando o custo metabólico.' }
];
// Interações relevantes (mecanismo).
var INTERACOES = [
  'β-agonista + β-bloqueador prévio → resposta inotrópica/cronotrópica atenuada (a milrinona, por não-β, contorna).',
  'simpaticomimético + IMAO/cocaína/antidepressivo → resposta pressórica exagerada.',
  'vasopressores em meio ácido (lactato alto) → resposta α reduzida; corrigir o pH melhora a responsividade.',
  'dois β (adrenalina + dobutamina) → soma de demanda de O₂ e risco arrítmico.'
];
// Usos inusitados / exclusivos (mecanismo/educação).
var USOS = [
  { droga:'vasopressina', tipo:'exclusivo', uso:'pressão NÃO-adrenérgica (V1) — poupadora de catecolamina e na vasoplegia pós-CEC.' },
  { droga:'azul de metileno', tipo:'inusitado', uso:'vasoplegia refratária: inibe a via NO/guanilato-ciclase (não é catecolamina).' },
  { droga:'milrinona', tipo:'exclusivo', uso:'disfunção de VD/hipertensão pulmonar: inodilatador que baixa a RVP.' },
  { droga:'adrenalina', tipo:'exclusivo', uso:'anafilaxia (os 4 termos) e parada cardíaca.' },
  { droga:'fenilefrina', tipo:'inusitado', uso:'bólus para hipotensão com taquicardia (α1 puro + bradicardia reflexa), p.ex. peri-indução.' }
];
// Efeitos iatrogênicos (mecanismo).
var IATROGENICOS = [
  'vasoconstrição excessiva → isquemia digital/mesentérica/renal (α1/V1 em dose alta).',
  'taquiarritmia e isquemia miocárdica por demanda (β1).',
  'hiperlactatemia tipo B pela adrenalina (estímulo β2/glicólise) — pode simular piora da perfusão.',
  'extravasamento de vasopressor periférico → necrose tecidual.',
  'hipotensão paradoxal: inodilatador (milrinona/dobutamina) num paciente já vasoplégico.',
  'isquemia esplâncnica e poliúria com vasopressina em dose alta.'
];

if (typeof module!=='undefined' && module.exports){
  module.exports = { clampv, DRUGS, concentration, infusionRate, doseFromRate, titration, COMBOS, INTERACOES, USOS, IATROGENICOS };
}
