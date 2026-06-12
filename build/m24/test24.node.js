const M=require('./model24.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

// Âncoras canônicas (idênticas às do validador e do HTML)
const NORMAL  ={peep:0, volemia:0.5,  effort:0.15, lvContr:0.8,  colapso:0.05};
const HIPOVOL ={peep:0, volemia:0.12, effort:0.15, lvContr:0.8,  colapso:0.0};
const HIPO_P  ={peep:12,volemia:0.12, effort:0.15, lvContr:0.8,  colapso:0.0};
const CARDIOG ={peep:0, volemia:0.85, effort:0.6,  lvContr:0.28, colapso:0.12};
const CARD_CP ={peep:10,volemia:0.85, effort:0.15, lvContr:0.28, colapso:0.12};
const ATELECT ={peep:0, volemia:0.5,  effort:0.2,  lvContr:0.8,  colapso:0.85};
const ATEL_P  ={peep:10,volemia:0.5,  effort:0.2,  lvContr:0.8,  colapso:0.85};
const OVERDIST={peep:20,volemia:0.5,  effort:0.15, lvContr:0.8,  colapso:0.0};

console.log('— LINHA DE BASE —');
const N=M.corPulmao(NORMAL);
ok('DC ≈ 5,1 L/min', near(N.CO,5.1,0.6), r(N.CO,2));
ok('PAM ≈ 87', near(N.PAM,87,6), r(N.PAM,0));
ok('SaO₂ ≈ 95%', near(N.SaO2,0.95,0.03), r(N.SaO2*100,0));
ok('PVR relativa ≈ 1 na CRF', near(N.PVRrel,1,0.15), r(N.PVRrel,2));
ok('classe normal', M.classeCP(N)==='normal');
ok('pós-carga do VE ≈ 1 na respiração tranquila', near(N.LVafter,1.0,0.12), r(N.LVafter,2));

console.log('\n— RETORNO VENOSO (Guyton): a PEEP corta a pré-carga —');
ok('PEEP↑ ⇒ Pra MEDIDA sobe', M.corPulmao(HIPO_P).Pra > M.corPulmao(HIPOVOL).Pra, r(M.corPulmao(HIPOVOL).Pra,1)+'→'+r(M.corPulmao(HIPO_P).Pra,1));
ok('PEEP↑ ⇒ retorno venoso VERDADEIRO cai', M.corPulmao(HIPO_P).VR < M.corPulmao(HIPOVOL).VR, r(M.corPulmao(HIPOVOL).VR,2)+'→'+r(M.corPulmao(HIPO_P).VR,2));
ok('esforço espontâneo↑ ⇒ PIT mais negativa ⇒ VR sobe', M.corPulmao(Object.assign({},NORMAL,{effort:0.7})).VR > N.VR);
ok('A PÉROLA: sob PEEP a CVP medida SOBE e o VR VERDADEIRO CAI (a CVP engana)', M.cvpEngana(HIPOVOL)===true);

console.log('\n— HIPOVOLÊMICO / PRÉ-CARGA-DEPENDENTE: a pressão positiva DERRUBA o DC —');
const H0=M.corPulmao(HIPOVOL), H1=M.corPulmao(HIPO_P);
ok('PEEP 12 derruba o DC no hipovolêmico', H1.CO < H0.CO-0.8, r(H0.CO,2)+'→'+r(H1.CO,2));
ok('sob PEEP vira preload-dependente', M.classeCP(H1)==='preload_dep');
ok('curva DC×PEEP do hipovolêmico é monotônica DECRESCENTE', M.peepOtima(HIPOVOL).tipo==='cai', M.peepOtima(HIPOVOL).tipo);

console.log('\n— CARDIOGÊNICO (VE falido, congesto): a pressão positiva AJUDA —');
const C0=M.corPulmao(CARDIOG), C1=M.corPulmao(CARD_CP);
ok('VE congesto no espontâneo (classe ve_congesto)', M.classeCP(C0)==='ve_congesto');
ok('pré-carga já saturada (VR alto)', C0.VR>6, r(C0.VR,2));
ok('CPAP DESCARREGA o VE (pós-carga transmural cai)', C1.LVafter < C0.LVafter-0.2, r(C0.LVafter,2)+'→'+r(C1.LVafter,2));
ok('CPAP SOBE o DC do VE congesto', C1.CO > C0.CO+0.5, r(C0.CO,2)+'→'+r(C1.CO,2));
ok('CPAP melhora a oxigenação (edema/recrutamento)', C1.SaO2 > C0.SaO2);
ok('esforço espontâneo CARREGA o VE falido (DC piora vs aliviado)', M.corPulmao(Object.assign({},CARDIOG,{effort:0.15})).CO > C0.CO, r(C0.CO,2)+' vs '+r(M.corPulmao(Object.assign({},CARDIOG,{effort:0.15})).CO,2));

console.log('\n— A CURVA DC×PEEP É O DISCRIMINADOR (mesma intervenção, respostas opostas) —');
ok('hipovolêmico: curva CAI', M.peepOtima(HIPOVOL).tipo==='cai');
ok('atelectásico: curva tem PEEP ÓTIMA interior (sobe→cai)', M.peepOtima(ATELECT).tipo==='otimo' && M.peepOtima(ATELECT).peepOtima>2 && M.peepOtima(ATELECT).peepOtima<20, 'ótima '+r(M.peepOtima(ATELECT).peepOtima,0));
ok('cardiogênico: DC sobe com pressão positiva (CO@10 > CO@0)', M.corPulmao(CARD_CP).CO > M.corPulmao(Object.assign({},CARD_CP,{peep:0})).CO);

console.log('\n— PÓS-CARGA do VD: a PVR é uma curva em U no volume pulmonar —');
ok('PVR mínima na CRF (peep0,colapso0 ≈ 1)', near(M.pvrRel(0,0),1,0.05), r(M.pvrRel(0,0),2));
ok('atelectasia (volume baixo) ⇒ PVR alta', M.pvrRel(0,0.85)>1.8, r(M.pvrRel(0,0.85),2));
ok('hiperdistensão (PEEP alta) ⇒ PVR alta', M.pvrRel(20,0)>1.8, r(M.pvrRel(20,0),2));
const At0=M.corPulmao(ATELECT), At1=M.corPulmao(ATEL_P);
ok('atelectásico: SaO₂ baixa por shunt', At0.SaO2<0.80, r(At0.SaO2*100,0));
ok('PEEP RECRUTA: SaO₂ sobe e PVR cai', At1.SaO2>At0.SaO2 && At1.PVRrel<At0.PVRrel, 'SaO₂ '+r(At0.SaO2*100,0)+'→'+r(At1.SaO2*100,0));
ok('PEEP recruta: DC sobe no atelectásico (pós-carga do VD aliviada)', At1.CO>At0.CO+0.8, r(At0.CO,2)+'→'+r(At1.CO,2));
const OD=M.corPulmao(OVERDIST);
ok('hiperdistensão: VD sobrecarregado (RVeff baixo)', OD.RVeff<0.5, r(OD.RVeff,2));
ok('hiperdistensão derruba o DC (PVR↑ + VR↓)', OD.CO < N.CO-1.5, r(OD.CO,2));

console.log('\n— OS QUATRO TERMOS movidos pela PRESSÃO POSITIVA —');
const pt=M.pressaoTermos(CARDIOG);
ok('pressão positiva CORTA a pré-carga (VR cai)', pt.vr.com < pt.vr.sem, r(pt.vr.sem,2)+'→'+r(pt.vr.com,2));
ok('pressão positiva DESCARREGA o VE (pós-carga cai)', pt.lvafter.com < pt.lvafter.sem, r(pt.lvafter.sem,2)+'→'+r(pt.lvafter.com,2));
ok('pressão positiva ELEVA a CVP medida (a armadilha)', pt.pra.com > pt.pra.sem, r(pt.pra.sem,1)+'→'+r(pt.pra.com,1));
ok('no VE congesto o NET é positivo (DC sobe)', pt.deltaCO>0, 'ΔDC '+r(pt.deltaCO,2));
const ptH=M.pressaoTermos(HIPOVOL);
ok('no hipovolêmico o MESMO ato dá NET negativo (DC cai)', ptH.deltaCO<0, 'ΔDC '+r(ptH.deltaCO,2));

console.log('\n— ROBUSTEZ / LIMITES (entradas absurdas, clamps, cobertura) —');
const ABS=M.corPulmao({peep:99,volemia:9,effort:-3,lvContr:8,colapso:5});
ok('sem NaN em entradas absurdas', [ABS.CO,ABS.PAM,ABS.VR,ABS.PVRrel,ABS.RVeff,ABS.SaO2,ABS.LVafter].every(v=>typeof v==='number'&&!isNaN(v)));
ok('PEEP clampada em [0,20]', ABS.peep>=0&&ABS.peep<=20, r(ABS.peep,0));
ok('RVeff clampado em [0,25 ; 1]', ABS.RVeff>=0.25&&ABS.RVeff<=1, r(ABS.RVeff,2));
ok('SaO₂ clampada em [0,60 ; 0,99]', ABS.SaO2>=0.60&&ABS.SaO2<=0.99, r(ABS.SaO2,2));
ok('HR clampada em [50,140]', ABS.HR>=50&&ABS.HR<=140, r(ABS.HR,0));
ok('vazio {} não lança e dá número', (function(){try{var z=M.corPulmao({});return !isNaN(z.CO)&&!isNaN(z.PAM);}catch(e){return false;}})());
ok('sem argumento / null não lançam (guarda p||{})', (function(){try{return !isNaN(M.corPulmao().CO)&&!isNaN(M.corPulmao(null).CO);}catch(e){return false;}})());
ok('curvaPEEP / peepOtima / pressaoTermos não lançam sem argumento', (function(){try{M.curvaPEEP();M.peepOtima();M.pressaoTermos();M.cvpEngana();return true;}catch(e){return false;}})());
ok('VRdrive ≥ 0 (cachoeira venosa, sem retorno negativo)', M.corPulmao({volemia:0,peep:20,effort:0}).VRdrive>=0, r(M.corPulmao({volemia:0,peep:20,effort:0}).VRdrive,2));
ok('classeCP cobre os 5 rótulos vivos', (function(){
  var c=function(p){return M.classeCP(M.corPulmao(p));};
  return c(NORMAL)==='normal' && c(HIPO_P)==='preload_dep' && c(CARDIOG)==='ve_congesto'
    && c(ATELECT)==='rv_sobrecarga' && c(HIPOVOL)==='limitrofe';
})());
ok('PAM = m9 (PVC + DC·RVS/80): pam(5,800,4) = 54', near(M.pam(5,800,4),54,1e-9), r(M.pam(5,800,4),0));
ok('caO2 idêntico à cadeia do braço (1,34·Hb·Sat + 0,003·90)', near(M.caO2(1.0),1.34*14+0.27,1e-9), r(M.caO2(1.0),2));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
