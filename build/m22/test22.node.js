const M=require('./model22.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

const NORMAL={tonus:0.78,simpatico:0.45,vazamento:0,epi:0,broncho:0};
const ANA={tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8};
const NEU={tonus:0.22,simpatico:0.12,vazamento:0.35,epi:0,broncho:0};

console.log('— LINHA DE BASE —');
const N=M.distAN(NORMAL);
ok('PAM ≈ 85', near(N.PAM,85,4), r(N.PAM,0));
ok('FC ≈ 76', near(N.HR,76,4), r(N.HR,0));
ok('classe normal', M.classeAN(N)==='normal');

console.log('\n— ANAFILÁTICO (RVS↓ + TAQUICARDIA + broncho) —');
const A=M.distAN(ANA);
ok('RVS despencou (<900)', A.RVSdyn<900, r(A.RVSdyn,0));
ok('PAM baixa (<55)', A.PAM<55, r(A.PAM,0));
ok('TAQUICARDIA (FC ≥ 100)', A.HR>=100, r(A.HR,0));
ok('padrão taqui', M.padraoFC(A)==='taqui');
ok('broncho → SaO₂ baixa (<0,90)', A.SaO2<0.90, r(A.SaO2,3));
ok('classe anafilatico', M.classeAN(A)==='anafilatico');
ok('NÃO é a pérola (tem taquicardia)', M.neurogenicoSignature(A)===false);

console.log('\n— NEUROGÊNICO (RVS↓ + BRADICARDIA · o único sem taquicardia) —');
const NE=M.distAN(NEU);
ok('RVS despencou (<900)', NE.RVSdyn<900, r(NE.RVSdyn,0));
ok('PAM baixa (<65)', NE.PAM<65, r(NE.PAM,0));
ok('BRADICARDIA (FC ≤ 55)', NE.HR<=55, r(NE.HR,0));
ok('padrão bradi', M.padraoFC(NE)==='bradi');
ok('SaO₂ preservada (sem broncho)', NE.SaO2>0.95, r(NE.SaO2,3));
ok('A PÉROLA: neurogenicoSignature = true (único sem taquicardia)', M.neurogenicoSignature(NE)===true);
ok('classe neurogenico', M.classeAN(NE)==='neurogenico');

console.log('\n— O DISCRIMINADOR: mesma RVS↓, FC OPOSTA —');
ok('ambos com RVS baixa', A.RVSdyn<900 && NE.RVSdyn<900);
ok('FC oposta: anafilático taqui (>100) × neurogênico bradi (<60)', A.HR>100 && NE.HR<60, 'ana '+r(A.HR,0)+' × neuro '+r(NE.HR,0));
ok('a FC é o discriminador (Δ ≥ 50 bpm)', (A.HR-NE.HR)>=50, 'Δ '+r(A.HR-NE.HR,0));

console.log('\n— A ADRENALINA MOVE QUATRO TERMOS (por que é o agente) —');
const AE={tonus:0.15,simpatico:0.95,vazamento:0.7,epi:0.85,broncho:0.8};
const et=M.epiTermos(AE);
ok('epi sobe a RVS (α1)', et.rvs.com>et.rvs.sem+200, r(et.rvs.sem,0)+'→'+r(et.rvs.com,0));
ok('epi sobe o DC/FC (β1)', et.dc.com>et.dc.sem+1, r(et.dc.sem,1)+'→'+r(et.dc.com,1));
ok('epi sela o leak (pré-carga sobe)', et.preload.com>et.preload.sem+0.1, r(et.preload.sem,2)+'→'+r(et.preload.com,2));
ok('epi alivia o broncho (SaO₂ sobe, β2)', et.sao2.com>et.sao2.sem+0.05, r(et.sao2.sem,3)+'→'+r(et.sao2.com,3));
ok('os QUATRO termos se movem', et.nTermos===4, et.nTermos+' termos');
ok('PAM restaurada pela epi (>+40)', M.distAN(AE).PAM > A.PAM+40, r(A.PAM,0)+'→'+r(M.distAN(AE).PAM,0));

console.log('\n— CONTRASTE: α-puro corrige SÓ a RVS (deixa o broncho/leak) —');
const ALPHA={tonus:0.55,simpatico:0.95,vazamento:0.7,epi:0,broncho:0.8};   // só tônus, sem epi
const AL=M.distAN(ALPHA);
ok('α-puro restaura a PAM (>60)', AL.PAM>60, r(AL.PAM,0));
ok('MAS a SaO₂ segue baixa (broncho não tratado)', AL.SaO2<0.90, r(AL.SaO2,3));
ok('e o leak segue aberto (pré-carga baixa)', AL.preloadF<0.75, r(AL.preloadF,2));
ok('epi corrige a SaO₂ que o α-puro não corrige', M.distAN(AE).SaO2 > AL.SaO2+0.05, r(AL.SaO2,3)+' vs '+r(M.distAN(AE).SaO2,3));

console.log('\n— MONOTONIAS —');
ok('FC sobe com o tônus simpático', M.distAN(Object.assign({},NEU,{simpatico:0.9})).HR > M.distAN(NEU).HR);
ok('RVS sobe com o tônus e com a epi', M.distAN(Object.assign({},ANA,{tonus:0.6})).RVSdyn>A.RVSdyn && M.distAN(Object.assign({},ANA,{epi:0.7})).RVSdyn>A.RVSdyn);
ok('SaO₂ sobe com a epi (broncodilata)', M.distAN(Object.assign({},ANA,{epi:0.8})).SaO2 > A.SaO2);

console.log('\n— ROBUSTEZ / LIMITES (entradas absurdas, clamps, cobertura) —');
const ABS=M.distAN({tonus:9,simpatico:-3,vazamento:5,epi:8,broncho:7});   // tudo fora de faixa
ok('sem NaN em entradas absurdas', [ABS.RVSdyn,ABS.HR,ABS.SaO2,ABS.PAM,ABS.DC,ABS.preloadF].every(v=>typeof v==='number'&&!isNaN(v)));
ok('RVS clampada em [200,2400]', ABS.RVSdyn>=200&&ABS.RVSdyn<=2400, r(ABS.RVSdyn,0));
ok('FC clampada em [35,175]', ABS.HR>=35&&ABS.HR<=175, r(ABS.HR,0));
ok('SaO₂ clampada em [0,68 ; 0,99]', ABS.SaO2>=0.68&&ABS.SaO2<=0.99, r(ABS.SaO2,3));
ok('pré-carga clampada em [0,25 ; 1]', ABS.preloadF>=0.25&&ABS.preloadF<=1, r(ABS.preloadF,2));
ok('vazio {} não lança e dá número', (function(){try{var z=M.distAN({});return !isNaN(z.PAM);}catch(e){return false;}})());
ok('sem argumento / null não lançam (guarda p||{})', (function(){try{return !isNaN(M.distAN().PAM) && !isNaN(M.distAN(null).PAM);}catch(e){return false;}})());
ok('leak↑ ⇒ pré-carga↓ (monotonia, sem epi)', M.distAN({tonus:0.5,simpatico:0.5,vazamento:0.8,epi:0}).preloadF < M.distAN({tonus:0.5,simpatico:0.5,vazamento:0.2,epi:0}).preloadF);
ok('epi sela o leak: pré-carga sobe com epi a mesmo vazamento', M.distAN({tonus:0.5,simpatico:0.5,vazamento:0.8,epi:0.8}).preloadF > M.distAN({tonus:0.5,simpatico:0.5,vazamento:0.8,epi:0}).preloadF);
ok('PAM = m9: pam(5,800,4) = 4 + 5·800/80 = 54', near(M.pam(5,800,4), 54, 1e-9), r(M.pam(5,800,4),0));
ok('classeAN cobre os 4 rótulos vivos', (function(){
  var c=function(p){return M.classeAN(M.distAN(p));};
  return c(NORMAL)==='normal' && c(ANA)==='anafilatico' && c(NEU)==='neurogenico'
    && c({tonus:0.25,simpatico:0.55,vazamento:0.2,epi:0,broncho:0})==='distributivo';
})());

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
