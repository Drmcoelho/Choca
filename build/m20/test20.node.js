const M=require('./model20.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— LINHA DE BASE (tônus normal) —');
const N=M.distState({tonus:0.78,DC:5,pressor:0,extracao:1});
ok('PAM ≈ 90', near(N.PAM,90,3), r(N.PAM,0));
ok('RVS ≈ 1358', near(N.RVSdyn,1358,25), r(N.RVSdyn,0));
ok('O₂ER ≈ 0,25', near(N.O2ER,0.25,0.04), r(N.O2ER,3));
ok('ScvO₂ ≈ 0,74', near(N.ScvO2,0.74,0.03), r(N.ScvO2,3));
ok('lactato basal ~1', near(N.lactate,1.0,0.1), r(N.lactate,2));
ok('classe compensado', M.classeDist(N)==='compensado');

console.log('\n— O DISTRIBUTIVO (RVS é o termo quebrado) —');
const D=M.distState({tonus:0.12,DC:7.5,pressor:0,extracao:0.25});
ok('RVS despencou (<900)', D.RVSdyn<900, r(D.RVSdyn,0));
ok('PAM baixa (<65) APESAR de DC alto', D.PAM<65 && D.DC>=7, 'PAM '+r(D.PAM,0)+' DC '+r(D.DC));
ok('classe distributivo', M.classeDist(D)==='distributivo');
ok('DC alto não resgata: cranking p/ DC 9 ainda deixa PAM < 80', M.distState({tonus:0.12,DC:9,pressor:0,extracao:0.25}).PAM<80, r(M.distState({tonus:0.12,DC:9,pressor:0,extracao:0.25}).PAM,0));

console.log('\n— A INVERSÃO DA EXTRAÇÃO (micro) —');
ok('DO₂ ALTA (>1400) no distributivo', D.DO2>1400, r(D.DO2,0));
ok('ScvO₂ ALTA (>0,85)', D.ScvO2>0.85, r(D.ScvO2,3));
ok('lactato ALTO (>3) com tecido faminto', D.lactate>3 && D.deficit>0, 'lac '+r(D.lactate,1)+' def '+r(D.deficit,0));
ok('inversaoExtracao = true (ScvO₂ alta + lactato alto)', M.inversaoExtracao(D)===true);

console.log('\n— A SAGACIDADE: ScvO₂ alta SOZINHA é ambígua —');
const HD=M.distState({tonus:0.5,DC:8,pressor:0,extracao:1});
ok('hiperdinâmico: ScvO₂ ALTA (>0,78)', HD.ScvO2>0.78, r(HD.ScvO2,3));
ok('mas lactato NORMAL (<1,5)', HD.lactate<1.5, r(HD.lactate,2));
ok('scvO2Ambigua = true (alta sem falência)', M.scvO2Ambigua(HD)===true);
ok('NÃO é inversão de extração', M.inversaoExtracao(HD)===false);
ok('o discriminador é o LACTATO, não a ScvO₂', D.ScvO2>0.78 && HD.ScvO2>0.78 && D.lactate>2 && HD.lactate<1.5);

console.log('\n— O α1 É O EIXO (o termo quebrado escolhe a alavanca) —');
const P=M.distState({tonus:0.12,DC:7.5,pressor:0.8,extracao:0.25});
ok('vasopressor restaura a PAM (>+30)', P.PAM>D.PAM+30, r(D.PAM,0)+' → '+r(P.PAM,0));
ok('porque sobe a RVS (o termo quebrado)', P.RVSdyn>D.RVSdyn+400, r(P.RVSdyn,0));
ok('corrigir RVS rende mais PAM que empurrar DC', M.ganhoPAM_porRVS(D) > 5*M.ganhoPAM_porDC(D), r(M.ganhoPAM_porRVS(D),1)+' vs '+r(M.ganhoPAM_porDC(D),1));
ok('pressor 0,5 sobe a PAM mais que DC +2,5',
   M.distState({tonus:0.12,DC:7.5,pressor:0.5,extracao:0.25}).PAM > M.distState({tonus:0.12,DC:10,pressor:0,extracao:0.25}).PAM+8);
ok('MAS a micro persiste: inversão segue sob pressor', M.inversaoExtracao(P)===true, 'lac '+r(P.lactate,1));

console.log('\n— MONOTONIAS —');
ok('PAM sobe com a RVS (tônus)', M.distState({tonus:0.6,DC:6,extracao:1}).PAM > M.distState({tonus:0.2,DC:6,extracao:1}).PAM);
ok('PAM sobe com o DC', M.distState({tonus:0.4,DC:8,extracao:1}).PAM > M.distState({tonus:0.4,DC:4,extracao:1}).PAM);
ok('ScvO₂ sobe quando a extração falha', M.distState({tonus:0.3,DC:7,extracao:0.2}).ScvO2 > M.distState({tonus:0.3,DC:7,extracao:1}).ScvO2);
ok('lactato sobe quando a extração falha', M.distState({tonus:0.3,DC:7,extracao:0.2}).lactate > M.distState({tonus:0.3,DC:7,extracao:1}).lactate);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
