const M=require('./model1.js');
let oks=0,falhas=0;
const r=(x,n=2)=>Math.round(x*10**n)/10**n;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const near=(a,b,t)=>Math.abs(a-b)<=t;

console.log('— A EQUAÇÃO DO CONTEÚDO ≡ ÂNCORA —');
const cn=M.caO2(15,1.0,100);
ok('ligado(15,100%) = 20,1', near(cn.ligado,20.1,1e-6), r(cn.ligado));
ok('dissolvido(PaO₂ 100) = 0,30', near(cn.dissolvido,0.30,1e-6), r(cn.dissolvido,2));
ok('total normal ≈ 20,4 mL/dL', near(cn.total,20.4,1e-6), r(cn.total));
ok('aceita SaO₂ em % ou fração', near(M.ca(15,100,100),M.ca(15,1.0,100),1e-9));
ok('CA_NORMAL bate com o total normal', near(M.CA_NORMAL,20.4,1e-6), r(M.CA_NORMAL));

console.log('\n— O CASO-SEMENTE (Hct 32 ≈ Hb 10,7 · SpO₂ 96%) —');
const seed=M.ca(10.7,0.96,70);
ok('CaO₂ do semente ≈ 14,0 mL/dL', near(seed,14.0,0.2), r(seed));
ok('conteúdo do semente ~30% abaixo do normal', near(M.pctNormal(10.7,0.96,70),68.5,3), r(M.pctNormal(10.7,0.96,70))+'%');
ok('queda ~30% com SpO₂ "ok" (96%)', M.pctNormal(10.7,0.96,70) < 75 && (10.7*0.96)>9);

console.log('\n— A FRAÇÃO DISSOLVIDA É MINÚSCULA (a letra-miúda) —');
ok('dissolvido <2% do conteúdo normal', M.fracDissolvida(15,1.0,100) < 0.02, r(M.fracDissolvida(15,1.0,100)*100,2)+'%');
ok('mesmo em hiperóxia (PaO₂ 500) <8%', M.fracDissolvida(15,1.0,500) < 0.08, r(M.fracDissolvida(15,1.0,500)*100,2)+'%');
ok('hiperóxia rende pouco: ΔCaO₂(100→500) < 1,5 mL/dL', (M.ca(15,1.0,500)-M.ca(15,1.0,100)) < 1.5, r(M.ca(15,1.0,500)-M.ca(15,1.0,100),2));

console.log('\n— ANEMIA E HIPOXEMIA SE MULTIPLICAM —');
ok('½Hb ≡ ½SaO₂ no termo ligado (multiplicativo)', near(M.caO2(7.5,1.0,100).ligado, M.caO2(15,0.5,100).ligado, 1e-9), r(M.caO2(7.5,1.0,100).ligado));
ok('anemia + hipoxemia juntas < cada uma isolada',
   M.ca(8,0.85,80) < M.ca(8,1.0,100) && M.ca(8,0.85,80) < M.ca(15,0.85,80), r(M.ca(8,0.85,80)));

console.log('\n— MONOTONIA —');
ok('CaO₂ sobe com Hb', M.ca(16,0.96,90) > M.ca(8,0.96,90));
ok('CaO₂ sobe com SaO₂', M.ca(12,0.98,90) > M.ca(12,0.80,90));
ok('CaO₂ sobe com PaO₂ (pouco)', M.ca(12,0.96,300) > M.ca(12,0.96,90));

console.log('\n— DO₂ E VEREDITO DE ENTREGA (DC fixo 5) —');
ok('DO₂ normal ≈ 1020 mL/min', near(M.do2At(15,1.0,100),1020,1), r(M.do2At(15,1.0,100)));
ok('DO₂ = DC × CaO₂ × 10', near(M.do2(5,20),1000,1e-9));
ok('normal → adequada', M.vereditoEntrega(M.do2At(15,1.0,100))==='adequada');
ok('semente → limítrofe', M.vereditoEntrega(M.do2At(10.7,0.96,70))==='limitrofe', r(M.do2At(10.7,0.96,70)));
ok('anemia grave + hipoxemia → crítica', M.vereditoEntrega(M.do2At(6,0.80,55))==='critica', r(M.do2At(6,0.80,55)));

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
