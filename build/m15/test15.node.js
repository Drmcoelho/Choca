const M=require('./model15.js');
let oks=0,falhas=0;
const r=(x,n=1)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— PERDA DE VOLUME (comum aos dois) —');
ok('DC compensado até ~10% (perda 0,10 ≈ DC0)', near(M.dcAfter(0.10),5.0,0.05), r(M.dcAfter(0.10),2));
ok('DC cai após a compensação (0,30 < 0,10)', M.dcAfter(0.30) < M.dcAfter(0.10), r(M.dcAfter(0.30),2));
ok('índice de choque sobe com a perda', M.shockIndex(0.35) > M.shockIndex(0.10), r(M.shockIndex(0.10),2)+'→'+r(M.shockIndex(0.35),2));
ok('classe ATLS por perda (I/II/III/IV)', M.hemorrhageClass(0.1).classe==='I' && M.hemorrhageClass(0.2).classe==='II' && M.hemorrhageClass(0.35).classe==='III' && M.hemorrhageClass(0.45).classe==='IV');

console.log('\n— CONTEÚDO: o que separa os dois —');
ok('hemorragia DERRUBA a Hb', M.hbAfter(0.30,'hemorragia') < 15, r(M.hbAfter(0.30,'hemorragia')));
ok('não-hemorrágica HEMOCONCENTRA (Hb sobe)', M.hbAfter(0.30,'naohemorragica') > 15, r(M.hbAfter(0.30,'naohemorragica')));
ok('mesma perda: DO₂ hemorragia < DO₂ não-hemorrágica (duplo golpe)', M.do2At(0.30,'hemorragia') < M.do2At(0.30,'naohemorragica'), r(M.do2At(0.30,'hemorragia'),0)+' < '+r(M.do2At(0.30,'naohemorragica'),0));
ok('DC é o MESMO nos dois à mesma perda (só o conteúdo difere)', M.dcAfter(0.30)===M.dcAfter(0.30));
ok('falta: hemorragia = volume E conteúdo', /conteúdo/.test(M.falta('hemorragia')) && /volume/.test(M.falta('naohemorragica')));

console.log('\n— RESSUSCITAÇÃO: volume ≠ conteúdo —');
const crist = M.resuscitate(0.35,'hemorragia','cristaloide');
const sang  = M.resuscitate(0.35,'hemorragia','sangue');
ok('cristaloide restaura o FLUXO (DC sobe)', crist.dc > M.dcAfter(0.35), r(M.dcAfter(0.35),2)+'→'+r(crist.dc,2));
ok('cristaloide DILUI a Hb (conteúdo cai)', crist.hb < M.hbAfter(0.35,'hemorragia'), r(M.hbAfter(0.35,'hemorragia'))+'→'+r(crist.hb));
ok('sangue recupera DO₂ mais que cristaloide na hemorragia', sang.do2 > crist.do2, r(crist.do2,0)+' < '+r(sang.do2,0));
ok('na hemorragia, sangue sobe a Hb; cristaloide não', sang.hb > crist.hb, r(crist.hb)+' < '+r(sang.hb));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
