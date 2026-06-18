// ===== source/core/test-core.node.js — núcleo + CONFORMÂNCIA · PERFUNDE·CHOCA =====
// Dois deveres:
//  (1) auto-teste do núcleo contra âncoras conhecidas (CHOQUE.md §4);
//  (2) CONFORMÂNCIA: prova que os engines build/mN/modelN.js computam os MESMOS
//      números que o núcleo. É isto que torna source/core "load-bearing": se M9
//      divergir de M29/do núcleo numa fórmula compartilhada, o CI acusa (ROADMAP
//      Fase 3 — "as mesmas fórmulas não aparecem com semântica divergente").
'use strict';
const ox = require('./oxygen.js');
const hemo = require('./hemodynamics.js');
const guards = require('./guards.js');
const guyton = require('./guyton.js');
const ventricle = require('./ventricle.js');
const microcirc = require('./microcirculation.js');
const shock = require('./shock.js');
const pd = require('./pharmacodynamics.js');
const m0 = require('../../build/m0/model0.js');
const m1 = require('../../build/m1/model1.js');
const m3 = require('../../build/m3/model3.js');
const m4 = require('../../build/m4/model4.js');
const m7 = require('../../build/m7/model7.js');
const m8 = require('../../build/m8/model8.js');
const m9 = require('../../build/m9/model9.js');
const m12 = require('../../build/m12/model12.js');
const m21 = require('../../build/m21/model21.js');
const m23 = require('../../build/m23/model23.js');
const pharm28 = require('../../build/m28/pharm28.js');

let oks=0, falhas=0; const fails=[];
const ok=(n,c)=>{ if(c){oks++;} else {falhas++; if(fails.length<14) fails.push(n);} };
const EPS=1e-9;
const eq=(a,b)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));

// ---------- (1) âncoras do núcleo ----------
(function(){
  const c = ox.caO2(15, 1.0, 100);
  ok('âncora CaO₂: ligado ~20,1', eq(c.ligado, 20.1));
  ok('âncora CaO₂: dissolvido 0,30', eq(c.dissolvido, 0.30));
  ok('âncora CaO₂: total ~20,4', eq(c.total, 20.4));
  ok('âncora DO₂: DC5 · CaO₂20,4 → 1020', eq(ox.do2(5, 20.4), 1020));
  ok('âncora asFrac: 96 → 0,96 (núcleo normaliza % e fração)', eq(ox.ca(10,96,70), ox.ca(10,0.96,70)));
  ok('âncora PAM manguito: 120/80 → ~93,3', eq(hemo.pamCuff(120,80), 80+40/3));
  ok('âncora PAM=DC×RVS: DC5 · 1120dyn · PVC5 → 75', eq(hemo.pamFromDyn(5,1120,5), 75));
  ok('âncora colisão Wood: woodFromDyn(1600)=20', eq(hemo.woodFromDyn(1600), 20));
  ok('âncora colisão Wood: rvsWoodFromPressures(85,5,4)=20', eq(hemo.rvsWoodFromPressures(85,5,4), 20));
  ok('âncora DO₂crit: demanda250 / O₂ERmax0,5 = 500', eq(ox.do2crit(250,0.5), 500));
  ok('âncora supply-dep: VO₂ em platô acima do crítico', eq(ox.vo2Supply(900,250,0.5), 250));
  ok('âncora lactato: sem déficit → basal 1,0', eq(ox.lactate(900,250,0.5), 1.0));
})();

// ---------- (2) conformância núcleo × engines ----------
const CO=[2.5,4,5,6.5], HB=[7,10,12,15], SAT=[0.85,0.92,0.98,1.0], PAO2=[40,70,100,150];
const PAM=[50,65,80,95], PVC=[2,5,8], DC=[2.5,4,5,6], W=[10,15,20];
const DEMAND=[200,250,300], O2MAX=[0.5,0.6,0.7], DO2V=[300,500,800,1100], SAO2=[0.90,0.98];

let dCaO2=0,dDO2=0,dVO2F=0,dO2ER=0,dPAMcuff=0,dRVSdyn=0,dWoodP=0,dPamDyn=0,dRvsForPam=0,
    dWoodFromDyn=0,dDynFromWood=0,dPamWood=0,dCO=0,dDo2crit=0,dVo2sup=0,dO2ersup=0,dSvo2=0,dDef=0,dLact=0;

HB.forEach(hb=>SAT.forEach(sat=>PAO2.forEach(pao2=>{
  // CaO₂: núcleo vs m0 (sat fração) e m1 (sat normalizada)
  if(!eq(ox.caO2(hb,sat,pao2).total, m0.caO2(hb,sat,pao2).total)) dCaO2++;
  if(!eq(ox.caO2(hb,sat,pao2).total, m1.caO2(hb,sat,pao2).total)) dCaO2++;
  CO.forEach(co=>{
    const cao2=ox.ca(hb,sat,pao2);
    if(!eq(ox.do2(co,cao2), m0.do2(co,cao2))) dDO2++;
    if(!eq(ox.do2(co,cao2), m1.do2(co,cao2))) dDO2++;
    if(!eq(ox.do2(co,cao2), m8.do2(co,cao2))) dDO2++;
  });
})));
// CaO₂ normalização de %: núcleo vs m1 (ambos aceitam percentual)
HB.forEach(hb=>[85,92,98,100].forEach(pct=>PAO2.forEach(pao2=>{
  if(!eq(ox.caO2(hb,pct,pao2).total, m1.caO2(hb,pct,pao2).total)) dCaO2++;
})));

CO.forEach(co=>[18,20].forEach(ca=>[12,14].forEach(cv=>{
  if(!eq(ox.vo2Fick(co,ca,cv), m0.vo2Fick(co,ca,cv))) dVO2F++;
  if(!eq(ox.o2erConteudos(ca,cv), m0.o2erConteudos(ca,cv))) dO2ER++;
  const vo2=ox.vo2Fick(co,ca,cv), do2=ox.do2(co,ca);
  if(!eq(ox.o2er(vo2,do2), m0.o2er(vo2,do2))) dO2ER++;
})));

PAM.forEach(pam=>PVC.forEach(pvc=>DC.forEach(dc=>{
  if(!eq(hemo.rvsDyn(pam,pvc,dc), m0.rvsDyn(pam,pvc,dc))) dRVSdyn++;
  if(!eq(hemo.rvsWoodFromPressures(pam,pvc,dc), m0.rvsWood(pam,pvc,dc))) dWoodP++;
  if(!eq(hemo.rvsForPam(pam,dc,pvc), m9.rvsForPam(pam,dc,pvc))) dRvsForPam++;
  const rd=hemo.rvsForPam(pam,dc,pvc);
  if(!eq(hemo.pamFromDyn(dc,rd,pvc), m9.pam(dc,rd,pvc))) dPamDyn++;
})));
[120,140].forEach(pas=>[70,90].forEach(pad=>{ if(!eq(hemo.pamCuff(pas,pad), m0.pamCuff(pas,pad))) dPAMcuff++; }));
[800,1200,1600].forEach(rd=>{ if(!eq(hemo.woodFromDyn(rd), m9.rvsWood(rd))) dWoodFromDyn++; });
W.forEach(w=>{ if(!eq(hemo.dynFromWood(w), m9.dynFromWood(w))) dDynFromWood++;
  PVC.forEach(pvc=>DC.forEach(dc=>{ if(!eq(hemo.pamFromWood(pvc,dc,w), m0.pamFromRvs(pvc,dc,w))) dPamWood++; })); });
[60,75,90].forEach(fc=>[40,70,100].forEach(vs=>{ if(!eq(hemo.co(fc,vs), m3.dc(fc,vs))) dCO++; }));

DEMAND.forEach(d=>O2MAX.forEach(om=>{
  if(!eq(ox.do2crit(d,om), m8.do2crit(d,om))) dDo2crit++;
  DO2V.forEach(dv=>{
    if(!eq(ox.vo2Supply(dv,d,om), m8.vo2(dv,d,om))) dVo2sup++;
    if(!eq(ox.o2erSupply(dv,d,om), m8.o2er(dv,d,om))) dO2ersup++;
    if(!eq(ox.o2deficit(dv,d,om), m8.o2deficit(dv,d,om))) dDef++;
    if(!eq(ox.lactate(dv,d,om), m8.lactate(dv,d,om))) dLact++;
    SAO2.forEach(s=>{ if(!eq(ox.svo2(dv,s,d,om), m8.svo2(dv,s,d,om))) dSvo2++; });
  });
}));

ok('conformância CaO₂: núcleo === m0 === m1 (e normalização %)', dCaO2===0);
ok('conformância DO₂: núcleo === m0 === m1 === m8', dDO2===0);
ok('conformância VO₂ Fick: núcleo === m0', dVO2F===0);
ok('conformância O₂ER (ambas as formas): núcleo === m0', dO2ER===0);
ok('conformância PAM manguito: núcleo === m0', dPAMcuff===0);
ok('conformância RVS dyne: núcleo === m0', dRVSdyn===0);
ok('conformância RVS Wood (de pressões): núcleo === m0.rvsWood', dWoodP===0);
ok('conformância PAM=DC×RVSdyn: núcleo === m9.pam', dPamDyn===0);
ok('conformância rvsForPam (locus iso-PAM): núcleo === m9', dRvsForPam===0);
ok('conformância Wood←dyne: núcleo === m9.rvsWood', dWoodFromDyn===0);
ok('conformância dyne←Wood: núcleo === m9.dynFromWood', dDynFromWood===0);
ok('conformância PAM←Wood: núcleo === m0.pamFromRvs', dPamWood===0);
ok('conformância CO=FC×VS: núcleo === m3.dc', dCO===0);
ok('conformância DO₂crítico: núcleo === m8', dDo2crit===0);
ok('conformância VO₂ supply-dep: núcleo === m8.vo2', dVo2sup===0);
ok('conformância O₂ER supply-dep: núcleo === m8.o2er', dO2ersup===0);
ok('conformância SvO₂: núcleo === m8.svo2', dSvo2===0);
ok('conformância déficit de O₂: núcleo === m8.o2deficit', dDef===0);
ok('conformância lactato: núcleo === m8.lactate', dLact===0);

// ---------- (2b) conformância Guyton · núcleo × m4 ----------
(function(){
  // âncoras
  ok('âncora Guyton: VR zera quando Pra ≥ Pmsf', eq(guyton.venousReturn(8,7,1.2), 0));
  ok('âncora Guyton: CO=0 abaixo de pra0', eq(guyton.cardiacOutput(-3,5), 0));
  let dVR=0, dCO=0, dInt=0;
  const PMSF=[6,7,9], RVR=[1.0,1.2,1.5], COMAX=[4,6,8], PRA=[-6,-2,0,3,6];
  PMSF.forEach(Pmsf=>RVR.forEach(Rvr=>PRA.forEach(pra=>{
    if(!eq(guyton.venousReturn(pra,Pmsf,Rvr), m4.venousReturn(pra,Pmsf,Rvr))) dVR++;
  })));
  COMAX.forEach(COmax=>PRA.forEach(pra=>{ if(!eq(guyton.cardiacOutput(pra,COmax), m4.cardiacOutput(pra,COmax))) dCO++; }));
  PMSF.forEach(Pmsf=>RVR.forEach(Rvr=>COMAX.forEach(COmax=>{
    const P={Pmsf:Pmsf,Rvr:Rvr,COmax:COmax};
    const a=guyton.intersecao(P), b=m4.intersecao(P);
    if(!eq(a.pra,b.pra) || !eq(a.co,b.co)) dInt++;
  })));
  ok('conformância retorno venoso: núcleo === m4.venousReturn', dVR===0);
  ok('conformância função cardíaca: núcleo === m4.cardiacOutput', dCO===0);
  ok('conformância interseção (bisseção): núcleo === m4.intersecao', dInt===0);
})();

// ---------- (2c) conformância ventrículo (Sunagawa) · núcleo × m7 ----------
(function(){
  ok('âncora ventrículo: EF ≈ 1/(1+Ea/Ees)', eq(ventricle.ef(120,2.5,2.5), ventricle.strokeVolume(120,2.5,2.5)/120));
  let dVes=0,dSV=0,dPes=0,dEF=0,dCpl=0,dPed=0,dSW=0,dPE=0,dEff=0;
  const EDV=[90,120,150,180], EES=[1.2,2.5,4], EA=[1,2,3.5];
  EDV.forEach(edv=>EES.forEach(Ees=>EA.forEach(Ea=>{
    if(!eq(ventricle.ves(edv,Ees,Ea), m7.ves(edv,Ees,Ea))) dVes++;
    if(!eq(ventricle.strokeVolume(edv,Ees,Ea), m7.strokeVolume(edv,Ees,Ea))) dSV++;
    if(!eq(ventricle.pes(edv,Ees,Ea), m7.pes(edv,Ees,Ea))) dPes++;
    if(!eq(ventricle.ef(edv,Ees,Ea), m7.ef(edv,Ees,Ea))) dEF++;
    if(!eq(ventricle.coupling(Ees,Ea), m7.coupling(Ees,Ea))) dCpl++;
    if(!eq(ventricle.ped(edv), m7.ped(edv))) dPed++;
    if(!eq(ventricle.strokeWork(edv,Ees,Ea), m7.strokeWork(edv,Ees,Ea))) dSW++;
    if(!eq(ventricle.potentialEnergy(edv,Ees,Ea), m7.potentialEnergy(edv,Ees,Ea))) dPE++;
    if(!eq(ventricle.efficiency(edv,Ees,Ea), m7.efficiency(edv,Ees,Ea))) dEff++;
  })));
  ok('conformância Ves: núcleo === m7', dVes===0);
  ok('conformância SV: núcleo === m7', dSV===0);
  ok('conformância Pes: núcleo === m7', dPes===0);
  ok('conformância EF (acoplamento): núcleo === m7', dEF===0);
  ok('conformância coupling Ea/Ees: núcleo === m7', dCpl===0);
  ok('conformância EDPVR (Ped): núcleo === m7', dPed===0);
  ok('conformância trabalho/energia/eficiência: núcleo === m7', dSW===0 && dPE===0 && dEff===0);
})();

// ---------- (2d) conformância microcirculação · núcleo × m12 ----------
(function(){
  ok('âncora micro: extração máxima E0 com gly=1 het=0', eq(microcirc.effExtraction(1,0), microcirc.E0));
  let dE=0,dMicro=0,dVer=0,dPar=0;
  const GLY=[0.4,0.7,1.0], HET=[0,0.4,0.8], FS=[0,0.3,0.6], DO2=[600,900,1200], DEM=[200,300];
  GLY.forEach(gly=>HET.forEach(het=>{
    if(!eq(microcirc.effExtraction(gly,het), m12.effExtraction(gly,het))) dE++;
    FS.forEach(fs=>DO2.forEach(DO2v=>DEM.forEach(demand=>{
      const p={DO2:DO2v, fs:fs, gly:gly, het:het, demand:demand};
      const a=microcirc.micro(p), b=m12.micro(p);
      ['E','nutritive','ceiling','VO2','deficit','O2ER','ScvO2','lactate'].forEach(k=>{ if(!eq(a[k],b[k])) dMicro++; });
      if(microcirc.vereditoMicro(a)!==m12.vereditoMicro(b)) dVer++;
      if(microcirc.isParadoxo(a)!==m12.isParadoxo(b)) dPar++;
    })));
  }));
  ok('conformância extração efetiva: núcleo === m12.effExtraction', dE===0);
  ok('conformância micro (todos os campos): núcleo === m12.micro', dMicro===0);
  ok('conformância veredito micro: núcleo === m12', dVer===0);
  ok('conformância paradoxo: núcleo === m12.isParadoxo', dPar===0);
})();

// ---------- (2e) conformância choque séptico (3 compartimentos) · núcleo × m21 ----------
(function(){
  const S=shock.septic;
  ok('âncora séptico: paradoxo SvO₂ alta + déficit', S.paradoxo({co:6,hb:13,shunt:0.6,glyco:0.4,mito:0.5,demand:300}));
  let dMacro=0,dAvail=0,dUse=0,dVo2=0,dDef=0,dLac=0,dO2er=0,dSvo2=0,dPar=0,dMap=0,dInt=0;
  const CO=[3,5,7], HB=[9,13,16], SHUNT=[0.1,0.5,0.8], GLY=[0.3,0.7,1], MITO=[0.3,0.6,1], DEM=[250,320];
  CO.forEach(co=>HB.forEach(hb=>SHUNT.forEach(shunt=>GLY.forEach(glyco=>MITO.forEach(mito=>DEM.forEach(demand=>{
    const P={co:co,hb:hb,shunt:shunt,glyco:glyco,mito:mito,demand:demand,rvsWood:9};
    if(!eq(S.macroDO2(co,hb), m21.macroDO2(co,hb))) dMacro++;
    if(!eq(S.tissueAvailable(P), m21.tissueAvailable(P))) dAvail++;
    if(!eq(S.usable(P), m21.usable(P))) dUse++;
    if(!eq(S.vo2Actual(P), m21.vo2Actual(P))) dVo2++;
    if(!eq(S.deficit(P), m21.deficit(P))) dDef++;
    if(!eq(S.lactate(P), m21.lactate(P))) dLac++;
    if(!eq(S.o2er(P), m21.o2er(P))) dO2er++;
    if(!eq(S.svo2(P), m21.svo2(P))) dSvo2++;
    if(S.paradoxo(P)!==m21.paradoxo(P)) dPar++;
    if(!eq(S.map(co,9,5), m21.map(co,9,5))) dMap++;
    // intervenções (mecanismo): o estado resultante reproduz o do engine
    const a=S.applyPressor(P), b=m21.applyPressor(P); if(!eq(a.rvsWood,b.rvsWood)) dInt++;
    const a2=S.applyMicro(P), b2=m21.applyMicro(P); if(!eq(a2.shunt,b2.shunt)||!eq(a2.glyco,b2.glyco)) dInt++;
    const a3=S.applyMito(P), b3=m21.applyMito(P); if(!eq(a3.mito,b3.mito)) dInt++;
  }))))));
  ok('conformância séptico DO₂/disponível/utilizável: núcleo === m21', dMacro===0 && dAvail===0 && dUse===0);
  ok('conformância séptico VO₂/déficit/lactato: núcleo === m21', dVo2===0 && dDef===0 && dLac===0);
  ok('conformância séptico O₂ER/SvO₂/paradoxo/MAP: núcleo === m21', dO2er===0 && dSvo2===0 && dPar===0 && dMap===0);
  ok('conformância séptico intervenções (pressor/micro/mito): núcleo === m21', dInt===0);
})();

// ---------- (2f) conformância choque misto (composição) · núcleo × m23 ----------
(function(){
  const C=shock.composite;
  ok('âncora misto: composição quebra mais de um termo', C.activeTerms({hypo:0.5,septic:0.4}).length===2);
  let dFields=0,dAttr=0,dDom=0,dActive=0,dMask=0,dInt=0;
  const SEV=[0,0.3,0.7], EIXOS=['hypo','cardio','obstr','distr','septic','hypox'], states=[];
  // vetores de severidade variando dois eixos por vez (bateria determinística e enxuta)
  EIXOS.forEach((k1,i)=>{
    EIXOS.slice(i+1).forEach(k2=>{
      SEV.forEach(v1=>{
        SEV.forEach(v2=>{
          const p={}; p[k1]=v1; p[k2]=v2;
          states.push(p);
          states.push(Object.assign({comp:0.3}, p));
          states.push(Object.assign({pressor:0.5}, p));
        });
      });
    });
  });
  const FIELDS=['preloadF','contract','SaO2','CaO2','rvsOpen','rvs','SV','HR','DC','PAM','DO2','extrCap','available','VO2','deficit','lactate','congestion','threat'];
  states.forEach(p=>{
    const a=C.mixed(p), b=m23.mixed(p);
    FIELDS.forEach(f=>{ if(!eq(a[f],b[f])) dFields++; });
    const aa=C.attribution(p), ba=m23.attribution(p);
    C.TERMS.forEach(k=>{ if(!eq(aa[k],ba[k])) dAttr++; });
    if(C.dominantTerm(p)!==m23.dominantTerm(p)) dDom++;
    if(C.activeTerms(p).join(',')!==m23.activeTerms(p).join(',')) dActive++;
    if(C.masking(a)!==m23.masking(b)) dMask++;
    const av=C.applyVolume(p), bv=m23.applyVolume(p); if(!eq(av.hypo||0,bv.hypo||0)) dInt++;
    const ap=C.applyPressor(p), bp=m23.applyPressor(p); if(!eq(ap.pressor||0,bp.pressor||0)) dInt++;
    const ai=C.applyInotrope(p), bi=m23.applyInotrope(p); if(!eq(ai.cardio||0,bi.cardio||0)) dInt++;
  });
  ok('conformância misto mixed() (18 campos): núcleo === m23', dFields===0);
  ok('conformância misto atribuição marginal: núcleo === m23', dAttr===0);
  ok('conformância misto termo dominante / ativos: núcleo === m23', dDom===0 && dActive===0);
  ok('conformância misto mascaramento: núcleo === m23', dMask===0);
  ok('conformância misto alavancas (volume/pressor/inotrópico): núcleo === m23', dInt===0);
})();

// ---------- (2g) farmacodinâmica · física do efeito (anchors) + conformância × pharm28 ----------
(function(){
  // sinais do efeito = a fisiologia (receptor → termo). Dose máxima da faixa para amplificar.
  const eff=(k)=>pd.effect(k, pd.RX[k].ranges[1]);
  const nora=eff('noradrenalina'), feni=eff('fenilefrina'), dobu=eff('dobutamina'),
        milr=eff('milrinona'), vaso=eff('vasopressina'), adre=eff('adrenalina'), dopa=eff('dopamina');
  ok('PD anchor: noradrenalina sobe RVS, mexe pouco na FC', nora.RVS>0 && nora.FC < nora.RVS);
  ok('PD anchor: fenilefrina (α1 puro) → RVS↑ e FC↓ (reflexo)', feni.RVS>0 && feni.FC<0 && Math.abs(feni.contr)<1e-9);
  ok('PD anchor: dobutamina → contratilidade↑, FC↑, RVS↓ (β2)', dobu.contr>0 && dobu.FC>0 && dobu.RVS<0);
  ok('PD anchor: milrinona (PDE-3) → contratilidade↑ e RVS↓ e PVR↓', milr.contr>0 && milr.RVS<0 && milr.PVR<0);
  ok('PD anchor: vasopressina (V1) → RVS↑ sem contratilidade nem FC', vaso.RVS>0 && Math.abs(vaso.contr)<1e-9 && Math.abs(vaso.FC)<1e-9);
  ok('PD anchor: adrenalina move 4 termos (RVS,contr,FC,lactato B)', adre.RVS>0 && adre.contr>0 && adre.FC>0 && adre.lacB>0);
  ok('PD anchor: dopamina em dose alta vira α1 (RVS↑)', dopa.RVS>0);
  // sem dose → sem efeito
  const zero=pd.effect('noradrenalina', pd.RX.noradrenalina.ranges[0]);
  ok('PD anchor: na dose mínima o efeito é ~nulo (escala com a dose)', pd.TERMS.every(t=>Math.abs(zero[t])<1e-9));

  // A LIÇÃO DO 28E (dobutamina), computada e à prova de coeficiente: comparadas na MESMA
  // fração de dose, a noradrenalina ganha PRESSÃO (RVS) e a dobutamina ganha FLUXO (DC).
  // E somar noradrenalina ("chão vascular") à dobutamina recupera a PAM.
  const doseAt=(k,f)=>pd.RX[k].ranges[0] + f*(pd.RX[k].ranges[1]-pd.RX[k].ranges[0]);
  const baseVaso={ dc:5.0, rvs:600, pvc:5 };
  const pNora = pd.profile(pd.compose([{drug:'noradrenalina', dose:doseAt('noradrenalina',0.5)}]), baseVaso);
  const pDobu = pd.profile(pd.compose([{drug:'dobutamina',    dose:doseAt('dobutamina',0.5)}]), baseVaso);
  const pBoth = pd.profile(pd.compose([{drug:'dobutamina', dose:doseAt('dobutamina',0.5)},{drug:'noradrenalina', dose:doseAt('noradrenalina',0.5)}]), baseVaso);
  ok('PD 28E: noradrenalina ganha PRESSÃO — PAM(nora) > PAM(dobu) à mesma fração', pNora.PAM > pDobu.PAM);
  ok('PD 28E: dobutamina ganha FLUXO — DC(dobu) > DC(nora) à mesma fração', pDobu.DC > pNora.DC);
  ok('PD 28E: somar noradrenalina à dobutamina recupera a PAM (chão vascular)', pBoth.PAM > pDobu.PAM);
  ok('PD 28E: a PAM resultante é computada pela equação m9', eq(pBoth.PAM, m9.pam(pBoth.DC, pBoth.RVS, 5)));

  // CONFORMÂNCIA × pharm28 (M28 publicado): as drogas do motor são um subconjunto das
  // drogas publicadas, com a MESMA faixa de dose de referência (sem drift do §11).
  let dFaixa=0, faltam=[];
  Object.keys(pd.RX).forEach(k=>{ const D=pharm28.DRUGS[k];
    if(!D){ faltam.push(k); return; }
    if(!eq(pd.RX[k].ranges[0], D.doseMin) || !eq(pd.RX[k].ranges[1], D.doseMax)) dFaixa++;
    if(pd.RX[k].weightBased!==!!D.weightBased) dFaixa++;
  });
  ok('conformância PD × pharm28: toda droga do motor existe no M28 publicado', faltam.length===0, faltam.join(',')||'todas');
  ok('conformância PD × pharm28: faixas de dose e weightBased batem', dFaixa===0);
})();

// ---------- (3) colisão de nome documentada ----------
(function(){
  // model0.rvsWood(85,5,4) (de pressões) ≠ model9.rvsWood(85) (dyne→Wood): MESMO nome,
  // semântica divergente — exatamente o que o núcleo desambigua.
  const aPressoes=m0.rvsWood(85,5,4), aConv=m9.rvsWood(85);
  ok('colisão rvsWood real: m0(pressões) ≠ m9(conversão)', !eq(aPressoes,aConv));
  ok('núcleo desambigua: rvsWoodFromPressures === m0', eq(hemo.rvsWoodFromPressures(85,5,4), aPressoes));
  ok('núcleo desambigua: woodFromDyn === m9', eq(hemo.woodFromDyn(85), aConv));
})();

// ---------- (4) guardas / fronteira SaMD ----------
(function(){
  ok('clamp01 limita a [0,1]', guards.clamp01(1.4)===1 && guards.clamp01(-0.2)===0 && guards.clamp01(0.3)===0.3);
  ok('isFiniteNum rejeita NaN/Infinity', guards.isFiniteNum(3) && !guards.isFiniteNum(NaN) && !guards.isFiniteNum(Infinity));
  ok('requirePositive lança em ≤0', (function(){ try{ guards.requirePositive(0,'dc'); return false; }catch(e){ return true; } })());
  ok('SaMD: bloqueia ordem imperativa individualizada', guards.hasImperativeOrder('Inicie noradrenalina neste paciente agora'));
  ok('SaMD: permite dose de referência (sem imperativo a paciente)', !guards.hasImperativeOrder('A noradrenalina é diluída a 16 mcg/mL; faixa usual 0,01–0,5 mcg/kg/min'));
  ok('SaMD: "de" preposição não dispara (só "dê" imperativo)', !guards.hasImperativeOrder('a entrega de oxigênio do paciente caiu'));
})();

console.log('source/core · '+oks+' OK · '+falhas+' falhas');
if(falhas){ console.log('  falhas: '+fails.join(' | ')); }
process.exit(falhas>0?1:0);
