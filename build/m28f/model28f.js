// ===== model28f.js — Inodilatadores & vasodilatadores (28F) · PERFUNDE·CHOCA =====
// Submódulo do hub: quando o problema é PÓS-CARGA / congestão, combina-se inotrópico com
// vaso/venodilatador. A mecânica é a alça PV de Sunagawa (m7): BAIXAR a elastância arterial
// Ea (vasodilatador) SOBE o volume sistólico do ventrículo fraco; SUBIR a Ees (inotrópico)
// soma. Engine PURO standalone (window.F28), coeficientes/forma IDÊNTICOS ao model7 (test28f
// conforma ves/strokeVolume/ef). SEM dose individualizada (mecanismo §11).

var V0 = 10;        // volume de pressão zero da ESPVR (mL) — igual ao model7
var V0D = 5, EDPVR_P0 = 1.4, EDPVR_BETA = 0.018;

function ves(edv, Ees, Ea){ return (Ea*edv + Ees*V0)/(Ea+Ees); }
function strokeVolume(edv, Ees, Ea){ return Ees*(edv - V0)/(Ea+Ees); }
function pes(edv, Ees, Ea){ return Ees*Ea*(edv - V0)/(Ea+Ees); }
function ef(edv, Ees, Ea){ return edv>0 ? strokeVolume(edv,Ees,Ea)/edv : 0; }
function coupling(Ees, Ea){ return Ea/Ees; }
function ped(edv){ return EDPVR_P0*(Math.exp(EDPVR_BETA*Math.max(0, edv - V0D)) - 1); }

// Agentes (mecanismo, sem dose): como cada um desloca Ees (contratilidade) e Ea (pós-carga).
// dEes>0 inotrópico; dEa<0 vasodilatador; venodilatador reduz a pré-carga (dEDV).
var AGENTS = {
  milrinona:      { dEes:+1.0, dEa:-0.6, dEDV:0,    classe:'inodilatador' },   // PDE-3: inotropia + vasodilata
  dobutamina:     { dEes:+1.2, dEa:-0.3, dEDV:0,    classe:'inodilatador (β)' },
  nitroprussiato: { dEes:0,    dEa:-1.0, dEDV:-8,   classe:'vasodilatador arterial+venoso' },
  nitroglicerina: { dEes:0,    dEa:-0.2, dEDV:-18,  classe:'venodilatador (pré-carga)' }
};

// Aplica um agente a um ventrículo (edv, Ees, Ea) e devolve a alça resultante.
function apply(vent, agent){
  var a=AGENTS[agent]||{dEes:0,dEa:0,dEDV:0};
  var Ees=Math.max(0.2, vent.Ees + (a.dEes||0));
  var Ea =Math.max(0.2, vent.Ea  + (a.dEa||0));
  var edv=Math.max(40, vent.edv + (a.dEDV||0));
  return { edv:edv, Ees:Ees, Ea:Ea, SV:strokeVolume(edv,Ees,Ea), EF:ef(edv,Ees,Ea),
    coupling:coupling(Ees,Ea), pedFill:ped(edv) }; }

// Varredura de pós-carga: SV do ventrículo (fraco) à medida que Ea cai (vasodilatador).
function afterloadSweep(edv, Ees, EaList){
  return EaList.map(function(Ea){ return { Ea:Ea, SV:strokeVolume(edv,Ees,Ea), EF:ef(edv,Ees,Ea) }; }); }

if (typeof module!=='undefined' && module.exports){
  module.exports = { V0, V0D, ves, strokeVolume, pes, ef, coupling, ped, AGENTS, apply, afterloadSweep }; }
