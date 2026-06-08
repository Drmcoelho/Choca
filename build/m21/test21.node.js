const M=require('./model21.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const NORMAL={co:5,hb:14,rvsWood:16,shunt:0.05,glyco:1,mito:1,demand:250};
const SEPSE ={co:7,hb:13,rvsWood:9, shunt:0.5, glyco:0.6,mito:0.6,demand:280};

console.log('— NORMAL —');
ok('SvO₂ normal ~70%', near(M.svo2(NORMAL),0.71,0.03), r(M.svo2(NORMAL)*100,0)+'%');
ok('sem déficit no normal', M.deficit(NORMAL)===0);
ok('lactato basal no normal', near(M.lactate(NORMAL),1.0,0.01));

console.log('\n— SÉPTICO: macro normal/alta, micro+mito falham —');
ok('DO₂ macro NORMAL/ALTA no séptico (≥1000)', M.macroDO2(SEPSE.co,SEPSE.hb) >= 1000, r(M.macroDO2(SEPSE.co,SEPSE.hb),0));
ok('mesmo assim há DÉFICIT tecidual', M.deficit(SEPSE) > 0, r(M.deficit(SEPSE),0));
ok('lactato alto', M.lactate(SEPSE) > 3, r(M.lactate(SEPSE),1));
ok('O PARADOXO: SvO₂ ALTA (>0,74) com tecido faminto', M.svo2(SEPSE) > 0.74 && M.deficit(SEPSE)>0, 'SvO₂ '+r(M.svo2(SEPSE)*100,0)+'%');
ok('paradoxo sinalizado', M.paradoxo(SEPSE)===true);
ok('extração BAIXA apesar da entrega normal', M.o2er(SEPSE) < 0.25, r(M.o2er(SEPSE)*100,0)+'%');

console.log('\n— A LIÇÃO: pressor (macro) NÃO basta —');
const sp=M.applyPressor(SEPSE);
ok('pressor SOBE a MAP', M.map(sp.co,sp.rvsWood) > M.map(SEPSE.co,SEPSE.rvsWood), r(M.map(SEPSE.co,SEPSE.rvsWood),0)+'→'+r(M.map(sp.co,sp.rvsWood),0));
ok('pressor NÃO reduz o déficit (micro/mito intactos)', near(M.deficit(sp), M.deficit(SEPSE), 1e-9));
ok('pressor NÃO reduz o lactato', near(M.lactate(sp), M.lactate(SEPSE), 1e-9));

console.log('\n— O QUE REALMENTE FECHA O DÉFICIT —');
const mi=M.applyMicro(SEPSE), mt=M.applyMito(SEPSE);
ok('recrutar a microcirculação reduz o déficit', M.deficit(mi) < M.deficit(SEPSE), r(M.deficit(SEPSE),0)+'→'+r(M.deficit(mi),0));
ok('recrutar micro reduz o lactato', M.lactate(mi) < M.lactate(SEPSE));
ok('recrutar micro reduz o paradoxo (SvO₂ cai, extração sobe)', M.o2er(mi) > M.o2er(SEPSE));
ok('recuperar a mitocôndria também fecha o déficit', M.deficit(mt) < M.deficit(SEPSE), r(M.deficit(mt),0));

console.log('\n— CONTRASTE COM EXTRAÇÃO MÁXIMA (não-séptico) —');
const HEMORR={co:3,hb:9,rvsWood:22,shunt:0.05,glyco:1,mito:1,demand:250}; // baixa entrega, extração máxima
ok('na baixa entrega com micro/mito ok, a SvO₂ é BAIXA (extração alta)', M.svo2(HEMORR) < M.svo2(SEPSE), r(M.svo2(HEMORR)*100,0)+'% < '+r(M.svo2(SEPSE)*100,0)+'%');

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
