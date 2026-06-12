const M=require('./model23.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;
const f=M.mixed;

console.log('— LINHA DE BASE —');
const N=f({});
ok('PAM basal ≈ 83', near(N.PAM,83,4), r(N.PAM,0));
ok('sem déficit no normal', N.deficit===0);
ok('lactato basal ≈ 1,0', near(N.lactate,1.0,0.01));
ok('sem mascaramento no normal', M.masking(N)===false);

console.log('\n— SINGLES: moderado COMPENSA, grave DESCOMPENSA —');
ok('hipovolêmico 0.6 compensado (déficit 0)', f({hypo:0.6}).deficit===0, r(f({hypo:0.6}).PAM,0));
ok('cardiogênico 0.6 compensado (déficit 0)', f({cardio:0.6}).deficit===0);
ok('hipovolêmico 0.9 descompensa (déficit > 0)', f({hypo:0.9}).deficit>0, r(f({hypo:0.9}).deficit,0));
ok('cardiogênico 0.9 descompensa (déficit > 0)', f({cardio:0.9}).deficit>0, r(f({cardio:0.9}).deficit,0));
ok('compensação custa taquicardia (FC sobe no grave)', f({hypo:0.9}).HR>N.HR, r(f({hypo:0.9}).HR,0));

console.log('\n— A LIÇÃO 1 · COMPOSIÇÃO (dois choques descompensam o que cada um compensava) —');
const dHy=f({hypo:0.6}).deficit, dCa=f({cardio:0.6}).deficit, dMix=f({hypo:0.6,cardio:0.6}).deficit;
ok('cada single 0.6 sozinho não tem déficit', dHy===0 && dCa===0);
ok('a MISTURA 0.6+0.6 tem déficit > 0', dMix>0, r(dMix,0));
ok('mistura pior que cada parte (composição)', dMix>dHy && dMix>dCa);
ok('mais um termo nunca melhora a entrega (monotonia)', f({hypo:0.6,cardio:0.6,septic:0.6}).deficit >= dMix);
ok('déficit cresce com a severidade (monotonia em hipo)', f({hypo:0.95}).deficit > f({hypo:0.8}).deficit);

console.log('\n— A LIÇÃO 2 · MASCARAMENTO (PAM aceitável, tecido faminto) —');
const SEP={distr:0.6,septic:0.9};   // séptico: vasoplegia + extração quebrada
const RS=f(SEP);
ok('séptico: PAM ≥ 65 (macro aceitável)', RS.PAM>=65, r(RS.PAM,0));
ok('séptico: extração caiu (<0,40)', RS.extrCap<0.40, r(RS.extrCap,2));
ok('séptico: déficit tecidual > 0 apesar da macro', RS.deficit>0, r(RS.deficit,0));
ok('MASCARAMENTO sinalizado (PAM normal + déficit)', M.masking(RS)===true);
ok('vasoplegia pura é hiperdinâmica (DC alto, RVS baixa, sem déficit)',
   f({distr:0.8}).DC>N.DC && f({distr:0.8}).rvsOpen<M.BASE.RVSnorm && f({distr:0.8}).deficit===0);

console.log('\n— ATRIBUIÇÃO (quantificar o choque misto) —');
const a=M.attribution({distr:0.7,septic:0.7,cardio:0.6});
ok('séptico e cardiogênico ambos contribuem ao déficit', a.septic>0 && a.cardio>0, 'sep '+r(a.septic,0)+' · car '+r(a.cardio,0));
ok('termos inativos não contribuem', a.hypo===0 && a.obstr===0 && a.hypox===0);
ok('dominante de hipo-grave puro é "hypo"', M.dominantTerm({hypo:0.95})==='hypo');
ok('dominante sem choque é "none"', M.dominantTerm({})==='none');
ok('activeTerms conta os eixos ≥0.2', M.activeTerms({hypo:0.6,cardio:0.5,distr:0.1}).length===2);

console.log('\n— ALAVANCAS · tratar o termo CERTO vs o ERRADO (mecanismo, sem dose) —');
// pressor: sobe a PAM, NÃO fecha o déficit (mascara)
const pr=f(M.applyPressor(SEP));
ok('pressor SOBE a PAM', pr.PAM>RS.PAM, r(RS.PAM,0)+'→'+r(pr.PAM,0));
ok('pressor NÃO reduz o déficit (só macro)', near(pr.deficit,RS.deficit,1e-9), r(RS.deficit,0)+'→'+r(pr.deficit,0));
// inotrópico: trata o cardiogênico
const CD={cardio:0.9};
ok('inotrópico fecha o déficit do cardiogênico', f(M.applyInotrope(CD)).deficit < f(CD).deficit);
ok('inotrópico alivia a congestão', f(M.applyInotrope(CD)).congestion < f(CD).congestion, r(f(CD).congestion,2)+'→'+r(f(M.applyInotrope(CD)).congestion,2));
// volume: ajuda o hipovolêmico, NÃO o cardiogênico
ok('volume fecha o déficit do hipovolêmico', f(M.applyVolume({hypo:0.9})).deficit < f({hypo:0.9}).deficit);
ok('volume NÃO ajuda o cardiogênico sem hipovolemia', near(f(M.applyVolume(CD)).deficit, f(CD).deficit, 1e-9));

console.log('\n— CONGESTÃO + RESERVA COMPENSATÓRIA —');
ok('cardiogênico gera congestão; hipovolêmico não', f({cardio:0.8}).congestion>0.3 && f({hypo:0.8}).congestion<0.05);
ok('reserva esgotada (comp baixa) derruba mais a PAM', f({hypo:0.8,comp:0.2}).PAM < f({hypo:0.8,comp:0.9}).PAM,
   r(f({hypo:0.8,comp:0.9}).PAM,0)+'→'+r(f({hypo:0.8,comp:0.2}).PAM,0));

console.log('\n— ROBUSTEZ / LIMITES —');
ok('sem argumento / null não lançam', (function(){try{return !isNaN(f().PAM)&&!isNaN(f(null).deficit);}catch(e){return false;}})());
const ABS=f({hypo:9,cardio:-3,obstr:5,distr:8,septic:7,hypox:6,pressor:4,comp:-2});
ok('entradas absurdas: sem NaN', [ABS.PAM,ABS.DC,ABS.DO2,ABS.deficit,ABS.extrCap,ABS.rvs].every(v=>typeof v==='number'&&!isNaN(v)));
ok('extração clampada em [0,10 ; 0,62]', ABS.extrCap>=0.10&&ABS.extrCap<=0.62, r(ABS.extrCap,2));
ok('RVS clampada em [250 ; 2400]', ABS.rvs>=250&&ABS.rvs<=2400, r(ABS.rvs,0));
ok('déficit nunca negativo', ABS.deficit>=0 && N.deficit>=0);

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
