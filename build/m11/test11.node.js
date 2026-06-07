const M=require('./model11.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— IVC: colapsabilidade e pressão de enchimento —');
ok('CI = (Dmax−Dmin)/Dmax (2,0/0,6 → 0,70)', near(M.ivcCI(2.0,0.6),0.70,1e-9), r(M.ivcCI(2.0,0.6)));
ok('IVC pequena e colabável → pressão BAIXA', M.rapFromIVC(1.2,0.7).faixa==='baixa', M.rapFromIVC(1.2,0.7).faixa);
ok('IVC grande e fixa → pressão ALTA', M.rapFromIVC(2.5,0.1).faixa==='alta', M.rapFromIVC(2.5,0.1).faixa);
ok('grande mas colabável → INTERMEDIÁRIA', M.rapFromIVC(2.5,0.7).faixa==='intermediária', M.rapFromIVC(2.5,0.7).faixa);
ok('pequena mas pouco colabável → INTERMEDIÁRIA', M.rapFromIVC(1.5,0.2).faixa==='intermediária', M.rapFromIVC(1.5,0.2).faixa);
ok('RAP baixa < intermediária < alta (mmHg)', M.rapFromIVC(1.2,0.7).rap < M.rapFromIVC(2.5,0.7).rap && M.rapFromIVC(2.5,0.7).rap < M.rapFromIVC(2.5,0.1).rap);
ok('volumeHint: baixa fala em reserva de pré-carga', /reserva/.test(M.volumeHint(1.2,0.7)));
ok('volumeHint: alta fala em congestão', /congest/.test(M.volumeHint(2.5,0.1)));

console.log('\n— PULMÃO (BLUE) —');
ok('<3 B/ campo → A-lines (seco)', M.lungLines(1).padrao==='A-lines');
ok('≥3 B/ campo → B-lines (congestão)', M.lungLines(4).padrao==='B-lines' && /congest/.test(M.lungLines(4).leitura));

console.log('\n— JANELA → ACHADO → TERMO —');
ok('tamponamento → subxifoide + derrame + obstrutivo', /subxifoide/.test(M.windowFor('tamponamento').janela) && /derrame/.test(M.windowFor('tamponamento').achado) && /obstrutivo/.test(M.windowFor('tamponamento').termo));
ok('TEP → VD dilatado / D-shape + pós-carga de VD', /D-shape/.test(M.windowFor('tep').achado) && /VD/.test(M.windowFor('tep').termo));
ok('edema → B-lines + congestão', /B-lines/.test(M.windowFor('edema').achado) && /congest/.test(M.windowFor('edema').termo));
ok('hipovolemia → IVC pequena colabável + pré-carga baixa', /IVC/.test(M.windowFor('hipovolemia').janela) && /pré-carga/.test(M.windowFor('hipovolemia').termo));
ok('falência VE → VE dilatado/hipocontrátil + bomba', /VE/.test(M.windowFor('ve_falencia').achado) && /bomba/.test(M.windowFor('ve_falencia').termo));
ok('normal → sem quebra evidente', /sem quebra/.test(M.windowFor('normal').termo));
ok('cenário desconhecido cai em normal', M.windowFor('xyz').termo===M.windowFor('normal').termo);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
