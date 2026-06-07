const M=require('./model12.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

const sadio  ={ DO2:1000, SaO2:0.98, fs:0.05, gly:1.0, het:0.1, demand:250 };
const septico={ DO2:1100, SaO2:0.98, fs:0.50, gly:0.4, het:0.7, demand:280 };

console.log('— EXTRAÇÃO EFETIVA —');
ok('saudável E ≈ 0,67', near(M.effExtraction(1.0,0.1),0.6685,1e-3), r(M.effExtraction(1.0,0.1),3));
ok('séptico E ≈ 0,19', near(M.effExtraction(0.4,0.7),0.1918,1e-3), r(M.effExtraction(0.4,0.7),3));
ok('E cai com glicocálice roto', M.effExtraction(0.3,0.2)<M.effExtraction(1.0,0.2));
ok('E cai com heterogeneidade', M.effExtraction(1.0,0.8)<M.effExtraction(1.0,0.1));

console.log('\n— TECIDO SADIO (acoplado) —');
const Rs=M.micro(sadio);
ok('O₂ER normal ~0,25', near(Rs.O2ER,0.25,0.05), r(Rs.O2ER,3));
ok('ScvO₂ normal ~0,70–0,75', Rs.ScvO2>0.70 && Rs.ScvO2<0.76, r(Rs.ScvO2,3));
ok('sem déficit', near(Rs.deficit,0,1e-9), r(Rs.deficit));
ok('lactato basal ~1,0', near(Rs.lactate,1.0,0.1), r(Rs.lactate,2));
ok('veredito acoplado', M.vereditoMicro(Rs)==='acoplado');
ok('sem paradoxo', M.isParadoxo(Rs)===false);

console.log('\n— SÉPTICO (o paradoxo) —');
const Rsep=M.micro(septico);
ok('macro preservada (DO₂ 1100 alta)', Rsep.DO2>=1000);
ok('O₂ER BAIXA (<0,15) apesar do tecido faminto', Rsep.O2ER<0.15, r(Rsep.O2ER,3));
ok('ScvO₂ ALTA (>0,80) — o paradoxo', Rsep.ScvO2>0.80, r(Rsep.ScvO2,3));
ok('déficit tecidual > 100 mL/min', Rsep.deficit>100, r(Rsep.deficit));
ok('lactato elevado (>3,5)', Rsep.lactate>3.5, r(Rsep.lactate,2));
ok('isParadoxo = true', M.isParadoxo(Rsep)===true);
ok('veredito grave', M.vereditoMicro(Rsep)==='grave');

console.log('\n— MONOTONIAS (leito já no limite de oferta) —');
// num leito com reserva, shunt leve não starva (fisiológico); estas âncoras vivem no regime supply-limited.
const lim={ DO2:1000, SaO2:0.98, fs:0.2, gly:0.6, het:0.5, demand:320 };
ok('ScvO₂ SOBE com o shunt', M.micro(Object.assign({},lim,{fs:0.6})).ScvO2 > M.micro(lim).ScvO2,
   r(M.micro(lim).ScvO2,3)+'→'+r(M.micro(Object.assign({},lim,{fs:0.6})).ScvO2,3));
ok('déficit SOBE com o shunt', M.micro(Object.assign({},lim,{fs:0.6})).deficit > M.micro(lim).deficit);
ok('déficit SOBE com glicocálice roto', M.micro(Object.assign({},lim,{gly:0.3})).deficit > M.micro(Object.assign({},lim,{gly:0.95})).deficit);
ok('déficit SOBE com heterogeneidade', M.micro(Object.assign({},lim,{het:0.8})).deficit > M.micro(Object.assign({},lim,{het:0.2})).deficit);
ok('com reserva, shunt leve NÃO starva (acoplamento preservado)', M.micro(Object.assign({},sadio,{fs:0.6})).deficit===0);

console.log('\n— PRESSOR NÃO CONSERTA A MICRO —');
const lowDO2 =M.micro(Object.assign({},septico,{DO2:1100}));
const highDO2=M.micro(Object.assign({},septico,{DO2:1500}));   // "pressor": macro maior, micro intacta
ok('subir DO₂ não fecha o déficit', highDO2.deficit>50, r(highDO2.deficit));
ok('O₂ER segue baixa mesmo com DO₂ maior', highDO2.O2ER<0.12, r(highDO2.O2ER,3));
ok('ScvO₂ não cai (segue "tranquilizadora")', highDO2.ScvO2>=lowDO2.ScvO2-0.001, r(highDO2.ScvO2,3));
ok('micro reparada (shunt↓, glicocálice↑) fecha o déficit',
   M.micro(Object.assign({},septico,{fs:0.08,gly:0.95,het:0.15})).deficit < lowDO2.deficit*0.3,
   r(M.micro(Object.assign({},septico,{fs:0.08,gly:0.95,het:0.15})).deficit));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
