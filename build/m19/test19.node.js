const M=require('./model19.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const NORMAL={pp:0,em:0,pn:0}, TAMP={pp:0.7,em:0,pn:0}, TEP={pp:0,em:0.7,pn:0}, PNX={pp:0,em:0,pn:0.7};

console.log('— OS TRÊS DERRUBAM O DÉBITO (obstrutivo) —');
ok('normal CO ≈ 5', near(M.co(NORMAL),5,0.05), r(M.co(NORMAL)));
ok('tamponamento derruba CO', M.co(TAMP) < 3.5, r(M.co(TAMP)));
ok('TEP derruba CO', M.co(TEP) < 3.5, r(M.co(TEP)));
ok('pneumotórax derruba CO', M.co(PNX) < 3.5, r(M.co(PNX)));

console.log('\n— PASSOS IMPEDIDOS DIFERENTES —');
ok('tamponamento impede ENCHIMENTO', /enchimento/.test(M.impededStep('tamponamento')));
ok('TEP impede EJEÇÃO do VD', /ejeção do VD/.test(M.impededStep('tep')));
ok('pneumotórax impede RETORNO venoso', /retorno venoso/.test(M.impededStep('pneumotorax')));

console.log('\n— ASSINATURAS DISTINTAS —');
ok('pulso paradoxal GRANDE no tamponamento (>12)', M.pulsus(TAMP) > 12, r(M.pulsus(TAMP)));
ok('pulso paradoxal ~basal no TEP (<10)', M.pulsus(TEP) < 10, r(M.pulsus(TEP)));
ok('derrame presente só no tamponamento', M.signs(TAMP).derrame && !M.signs(TEP).derrame && !M.signs(PNX).derrame);
ok('D-shape presente só no TEP', M.signs(TEP).dShape && !M.signs(TAMP).dShape && !M.signs(PNX).dShape);
ok('MV ausente / desvio traqueal só no pneumotórax', M.signs(PNX).mvAusente && !M.signs(TAMP).mvAusente && !M.signs(TEP).mvAusente);
ok('turgência jugular comum aos três', M.signs(TAMP).jvd && M.signs(TEP).jvd && M.signs(PNX).jvd);

console.log('\n— DISCRIMINADOR —');
ok('discrimina tamponamento', M.discriminate(TAMP)==='tamponamento', M.discriminate(TAMP));
ok('discrimina TEP', M.discriminate(TEP)==='tep', M.discriminate(TEP));
ok('discrimina pneumotórax', M.discriminate(PNX)==='pneumotorax', M.discriminate(PNX));
ok('normal → indeterminado (sem sinais)', M.discriminate(NORMAL)==='indeterminado');

console.log('\n— ALÍVIO ESPECÍFICO (o errado não resolve) —');
ok('pericardiocentese RESOLVE o tamponamento', M.applyRelief(TAMP,'pericardiocentese').co > 4.3, r(M.applyRelief(TAMP,'pericardiocentese').co));
ok('pericardiocentese NÃO resolve o pneumotórax', near(M.applyRelief(PNX,'pericardiocentese').co, M.co(PNX), 1e-9), r(M.applyRelief(PNX,'pericardiocentese').co));
ok('descompressão RESOLVE o pneumotórax', M.applyRelief(PNX,'descompressao').co > 4.3, r(M.applyRelief(PNX,'descompressao').co));
ok('trombólise RESOLVE o TEP', M.applyRelief(TEP,'trombolise').co > 4.3, r(M.applyRelief(TEP,'trombolise').co));
ok('descompressão NÃO resolve o tamponamento', near(M.applyRelief(TAMP,'descompressao').co, M.co(TAMP), 1e-9));
ok('reliefFor casa entidade↔manobra', M.reliefFor('tamponamento')==='pericardiocentese' && M.reliefFor('tep')==='trombolise' && M.reliefFor('pneumotorax')==='descompressao');

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
