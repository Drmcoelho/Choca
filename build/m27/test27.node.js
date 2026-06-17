const M=require('./model27.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const f=M.radar, P=M.profile;
const A={volume:0.7,pump:0.8}, B={volume:1.3,pump:0.75}, L={volume:0.2,pump:0.75}, C={volume:0.9,pump:0.25};

console.log('— OS 4 PERFIS (quente/frio × seco/úmido) —');
ok('A = quente-seco', P(A)==='A' && f(A).warm && !f(A).wet);
ok('B = quente-úmido', P(B)==='B' && f(B).warm && f(B).wet);
ok('L = frio-seco', P(L)==='L' && !f(L).warm && !f(L).wet);
ok('C = frio-úmido', P(C)==='C' && !f(C).warm && f(C).wet);
ok('os quatro perfis são alcançáveis', ['A','B','L','C'].every(function(q){ return [A,B,L,C].some(function(s){return P(s)===q;}); }));
ok('PROFILE_NAME mapeia os rótulos', M.PROFILE_NAME.C==='frio-úmido' && M.PROFILE_NAME.L==='frio-seco');

console.log('\n— PERFUSÃO É FLUXO, NÃO PRESSÃO (a armadilha do frio com PA normal) —');
const FRIO={volume:0.25,pump:0.7,tone:0.95};
ok('frio (perfusão baixa) mesmo com PA normal', !f(FRIO).warm && f(FRIO).map>=90, 'PA '+r(f(FRIO).map,0));
ok('a vasoconstrição sustenta a PA sem esquentar a perfusão', f({volume:0.25,pump:0.7,tone:0.95}).map > f({volume:0.25,pump:0.7,tone:0.1}).map && f({volume:0.25,pump:0.7,tone:0.95}).perfusion===f({volume:0.25,pump:0.7,tone:0.1}).perfusion);

console.log('\n— CONGESTÃO = VOLUME ACIMA DO QUE A BOMBA AGUENTA —');
ok('mais volume → mais congestão', f({volume:1.3,pump:0.7}).congestion > f({volume:0.6,pump:0.7}).congestion);
ok('bomba fraca congestiona mais para o mesmo volume', f({volume:0.9,pump:0.25}).congestion > f({volume:0.9,pump:0.85}).congestion);

console.log('\n— DÉBITO / FRANK-STARLING —');
ok('mais volume sobe o débito na parte íngreme', f({volume:0.6,pump:0.7}).CO > f({volume:0.2,pump:0.7}).CO);
ok('bomba melhor sobe o débito', f({volume:0.7,pump:0.9}).CO > f({volume:0.7,pump:0.3}).CO);

console.log('\n— A MESMA ALAVANCA, EFEITO OPOSTO POR PERFIL —');
const vL=M.leverEffect(L,M.applyVolume), vC=M.leverEffect(C,M.applyVolume);
ok('VOLUME no frio-seco (L): sobe muito o débito → tira do frio', vL.dCO>1 && (vL.profTo==='A'||vL.profTo==='B'), 'ΔCO '+r(vL.dCO,2)+' '+vL.profFrom+'→'+vL.profTo);
ok('VOLUME no frio-úmido (C): AFOGA (congestão↑, pouco débito)', vC.dCong>0.3 && vC.dCO<1 && !f(M.applyVolume(C)).warm, 'ΔCong '+r(vC.dCong,2)+' ΔCO '+r(vC.dCO,2));
ok('o volume ajuda L e piora C (efeito oposto)', vL.dCO>vC.dCO && vC.dCong>vL.dCong);
const iC=M.leverEffect(C,M.applyInotrope);
ok('INOTRÓPICO no frio-úmido (C): tira do canto (débito↑, congestão↓)', iC.dCO>0.5 && iC.dCong<0 && iC.profTo!=='C', 'ΔCO '+r(iC.dCO,2)+' ΔCong '+r(iC.dCong,2)+' '+iC.profFrom+'→'+iC.profTo);
const dB=M.leverEffect(B,M.applyDiuretic);
ok('DIURÉTICO no quente-úmido (B): descongestiona (B→A)', dB.dCong<0 && dB.profTo==='A');

console.log('\n— HIPÓTESES (mapa, não diagnóstico) —');
ok('cada perfil devolve hipóteses de mecanismo', M.hypotheses('C').length>=2 && /cardiog/i.test(M.hypotheses('C').join(' ')) && /hipovol/i.test(M.hypotheses('L').join(' ')));

console.log('\n— ROBUSTEZ / LIMITES —');
ok('radar() sem argumento / null não lançam', (function(){try{return !isNaN(f().CO)&&!isNaN(f(null).CO);}catch(e){return false;}})());
ok('alavancas com null/undefined não lançam', (function(){try{return M.applyVolume().volume>0 && M.applyInotrope(null).pump>0 && M.applyDiuretic().volume>=0;}catch(e){return false;}})());
const ABS=f({volume:9,pump:'x',tone:NaN});
ok('NaN/string/absurdo: sem NaN', [ABS.CO,ABS.SV,ABS.perfusion,ABS.congestion,ABS.map].every(v=>typeof v==='number'&&!isNaN(v)));
ok('perfusão/congestão/débito clampados', ABS.perfusion>=0 && ABS.congestion>=0 && ABS.CO>=0);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
