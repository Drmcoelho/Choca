const M=require('./model25.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const f=M.volemic;
const HYPO=function(o){return Object.assign({preDep:0.85,contract:0.75,leak:0.1},o);};

console.log('— BENEFÍCIO: o volume sobe o débito na parte íngreme de Starling —');
ok('hipovolêmico responsivo no início', M.responsive(HYPO({}))===true);
ok('o 1º bolus sobe muito o débito', f(HYPO({vol:1})).CO > f(HYPO({})).CO*1.4, r(f(HYPO({})).CO,1)+'→'+r(f(HYPO({vol:1})).CO,1));
ok('Frank-Starling satura (VS tende a um platô)', f(HYPO({vol:5})).SV > f(HYPO({vol:2})).SV && (f(HYPO({vol:5})).SV - f(HYPO({vol:4})).SV) < (f(HYPO({vol:1})).SV - f(HYPO({vol:0})).SV));

console.log('\n— O BENEFÍCIO DECAI / O CUSTO ACUMULA —');
const m0=M.marginal(HYPO({vol:0})), m1=M.marginal(HYPO({vol:1})), m2=M.marginal(HYPO({vol:2}));
ok('ganho marginal (ΔCO) decai a cada bolus', m0.dCO > m1.dCO && m1.dCO > m2.dCO, r(m0.dCO,2)+' > '+r(m1.dCO,2)+' > '+r(m2.dCO,2));
ok('responsividade fracionada decai', m0.dCOfrac > m1.dCOfrac && m1.dCOfrac > m2.dCOfrac, (m0.dCOfrac*100).toFixed(0)+'% → '+(m2.dCOfrac*100).toFixed(0)+'%');
ok('congestão cresce monotonicamente com o volume', f(HYPO({vol:0})).congestion < f(HYPO({vol:2})).congestion && f(HYPO({vol:2})).congestion < f(HYPO({vol:4})).congestion);
ok('eventualmente vira só custo (não-responsivo já no platô)', M.responsive(HYPO({vol:3}))===false);

console.log('\n— RESPONSIVIDADE ≠ TOLERÂNCIA · o 2×2 —');
ok('GIVE: responsivo + tolerante', M.quadrant(HYPO({}))==='give' && M.responsive(HYPO({})) && M.tolerant(HYPO({})));
ok('FUTILE: não-responsivo + tolerante (platô, sem congestão)', M.quadrant(HYPO({vol:2}))==='futile');
ok('HARM: não-responsivo + intolerante (fluid creep)', M.quadrant(HYPO({vol:4}))==='harm' && f(HYPO({vol:4})).edema);
const TRADE={preDep:0.7,contract:0.45,leak:0.8,vol:1};
ok('TRADEOFF: responsivo MAS intolerante (leak/glicocálice)', M.quadrant(TRADE)==='tradeoff' && M.responsive(TRADE)===true && M.tolerant(TRADE)===false);
ok('os quatro quadrantes são alcançáveis', ['give','futile','harm','tradeoff'].every(function(q){ return [HYPO({}),HYPO({vol:2}),HYPO({vol:4}),TRADE].some(function(s){return M.quadrant(s)===q;}); }));

console.log('\n— GLICOCÁLICE / LEAK: menos benefício, mais custo —');
ok('o leak reduz a fração intravascular', f({leak:0.8}).intravasc < f({leak:0.1}).intravasc, r(f({leak:0.8}).intravasc,2));
ok('mesmo bolus rende MENOS débito com leak alto', (f({preDep:0.8,leak:0.8,vol:2}).CO - f({preDep:0.8,leak:0.8,vol:0}).CO) < (f({preDep:0.8,leak:0.1,vol:2}).CO - f({preDep:0.8,leak:0.1,vol:0}).CO));
ok('o leak congestiona mais (desce o joelho + edema intersticial)', f({preDep:0.7,leak:0.8,vol:1}).congestion > f({preDep:0.7,leak:0.1,vol:1}).congestion);

console.log('\n— CORAÇÃO FRACO: platô mais baixo, congestão mais cedo —');
ok('contratilidade baixa → platô de VS menor', f({preDep:0.2,contract:0.3,vol:3}).SVmax < f({preDep:0.2,contract:0.9,vol:3}).SVmax);
ok('coração rígido congestiona mais para a mesma pré-carga', f({preDep:0.4,contract:0.3,vol:2}).congestion > f({preDep:0.4,contract:0.9,vol:2}).congestion);

console.log('\n— PARAR NO PONTO CERTO —');
const opt=M.optimalVolume(HYPO({}));
ok('optimalVolume devolve um ponto de parada finito', opt.vol>=1 && opt.vol<=5, opt.vol);
ok('passar do ótimo não melhora a utilidade (CO − penalidade de congestão)', (function(){
  var util=function(v){ var s=f(HYPO({vol:v})); return s.CO - 2.2*Math.max(0,s.congestion-M.BASE.TOL_THRESH); };
  return util(opt.vol) >= util(opt.vol+1) - 1e-9; })());
ok('applyBolus incrementa o volume', M.applyBolus(HYPO({vol:1})).vol===2);

console.log('\n— ROBUSTEZ / LIMITES —');
ok('sem argumento / null não lançam', (function(){try{return !isNaN(f().CO)&&!isNaN(f(null).CO);}catch(e){return false;}})());
const ABS=f({vol:99,preDep:'x',contract:undefined,leak:NaN,venoTone:9});
ok('NaN/string/absurdo: sem NaN', [ABS.CO,ABS.SV,ABS.preload,ABS.congestion,ABS.intravasc].every(v=>typeof v==='number'&&!isNaN(v)));
ok('congestão e CO clampados (finitos, não-negativos)', ABS.congestion>=0 && ABS.CO>=0 && ABS.preload>0);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
