// build/qa/qa.js — GUARDIÃO de QA transversal do braço PERFUNDE · CHOCA
// Audita TODOS os módulos de uma vez (não um por um): inventário × curriculum,
// índice sem órfãos, links relativos resolvem, cromo de série, firewall SaMD,
// fiação do package.json, arquivos de build e coerência da documentação.
// Puro Node, sem dependências. Roda no `npm run check`. Imprime "N OK · M falhas".
'use strict';
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..','..');
let oks=0, falhas=0;
const ok=(n,c,got='')=>{ if(c){oks++;console.log('  OK  · '+n+(got!==''?'  ['+got+']':''));} else {falhas++;console.log('FALHA · '+n+(got!==''?'  ['+got+']':''));} };
const read=f=>{ try{ return fs.readFileSync(path.join(ROOT,f),'utf8'); }catch(e){ return null; } };
const exists=f=>fs.existsSync(path.join(ROOT,f));

const curriculum=JSON.parse(read('curriculum.json'));
const pub=curriculum.published_range;                       // [0, N]
const N=pub[1];
const IDS=[]; for(let i=0;i<=N;i++) IDS.push(i);
const indexHtml=read('perfunde.html')||'';

console.log('— INVENTÁRIO × CURRICULUM —');
ok('published_range bate com os módulos "published" do curriculum', (function(){
  const p=curriculum.modules.filter(m=>m.status==='published').map(m=>m.id).sort((a,b)=>a-b);
  return p.length===N+1 && p[0]===0 && p[p.length-1]===N;
})(), '0…'+N);
ok('todo módulo 0…'+N+' tem perfundeN.html', IDS.every(i=>exists('perfunde'+i+'.html')), IDS.filter(i=>!exists('perfunde'+i+'.html')).map(i=>'M'+i).join(',')||'todos');
(function(){ // nenhum perfundeN.html órfão (acima do range publicado) sem status
  const files=fs.readdirSync(ROOT).filter(f=>/^perfunde\d+\.html$/.test(f)).map(f=>+f.match(/\d+/)[0]);
  const extras=files.filter(i=>i>N);
  ok('sem perfundeN.html além do published_range', extras.length===0, extras.map(i=>'M'+i).join(',')||'nenhum');
})();
ok('assessment_spec aponta para o módulo terminal (M30)', !curriculum.assessment_spec || curriculum.assessment_spec.module===N || curriculum.assessment_spec.module===30);

console.log('\n— ÍNDICE (perfunde.html) SEM ÓRFÃOS —');
const indexLinks=(indexHtml.match(/href="(perfunde\d+\.html)"/g)||[]).map(s=>s.match(/perfunde\d+\.html/)[0]);
ok('todo módulo publicado está linkado no índice', IDS.every(i=>indexLinks.indexOf('perfunde'+i+'.html')>=0), IDS.filter(i=>indexLinks.indexOf('perfunde'+i+'.html')<0).map(i=>'M'+i).join(',')||'todos');
ok('todo link de módulo no índice aponta para um arquivo existente', indexLinks.every(l=>exists(l)), indexLinks.filter(l=>!exists(l)).join(',')||'todos ok');
ok('índice não tem mais cards "em breve" (tudo publicado)', !/class="card soon"/.test(indexHtml));

console.log('\n— LINKS INTRA-BRAÇO RESOLVEM (perfundeN.html) —');
(function(){ let quebrados=[];
  // verifica só os links estáticos para módulos deste braço (perfundeN.html).
  // pontes para outros braços (mvp*/ventila*, URLs absolutas) e templates JS ficam fora do escopo.
  IDS.forEach(i=>{ const h=read('perfunde'+i+'.html')||''; const rels=(h.match(/href="(perfunde\d+\.html)"/g)||[]).map(s=>s.match(/="([^"]+)"/)[1]);
    rels.forEach(r=>{ if(!exists(r)) quebrados.push('M'+i+'→'+r); }); });
  ok('nenhum link perfundeN.html quebrado em nenhum módulo', quebrados.length===0, quebrados.slice(0,6).join(' ')||'todos resolvem');
})();

console.log('\n— CROMO DE SÉRIE (por módulo publicado) —');
(function(){ let semRodape=[], semBacklink=[], semDisc=[];
  IDS.forEach(i=>{ const h=read('perfunde'+i+'.html')||'';
    if(!(/CRM-?SP\s*151\.?318/.test(h) && /Matheus M\. Coelho/.test(h) && /Limeira/.test(h))) semRodape.push('M'+i);
    if(!/href="perfunde\.html"/.test(h)) semBacklink.push('M'+i);
    if(!(/educacional/i.test(h) && /(disclaimer|class="disc")/.test(h))) semDisc.push('M'+i);
  });
  ok('todo módulo tem rodapé CRM-SP 151.318 · Coelho · Limeira', semRodape.length===0, semRodape.join(',')||'todos');
  ok('todo módulo tem backlink para o índice', semBacklink.length===0, semBacklink.join(',')||'todos');
  ok('todo módulo tem disclaimer/nota educacional (SaMD)', semDisc.length===0, semDisc.join(',')||'todos');
})();

console.log('\n— FIREWALL SaMD TRANSVERSAL (sem ordem imperativa individualizada) —');
// Fonte ÚNICA da regra: o núcleo compartilhado (source/core/guards.js). Evita que a
// fronteira do SAFETY.md §11 viva duplicada e divirja entre o guardião e o produto.
const IMPER=require('../../source/core/guards.js').IMPERATIVE_RE;
(function(){ let viol=[];
  IDS.forEach(i=>{ const h=read('perfunde'+i+'.html')||''; h.split('\n').forEach((ln,k)=>{ if(IMPER.test(ln)) viol.push('M'+i+':'+(k+1)); }); });
  ok('nenhum módulo emite ordem imperativa para "o paciente"', viol.length===0, viol.slice(0,6).join(' ')||'limpo');
})();

console.log('\n— FIAÇÃO DO package.json —');
const pkg=JSON.parse(read('package.json')); const sc=pkg.scripts||{};
ok('test:N e validate:N existem para todo módulo', IDS.every(i=>sc['test:'+i] && sc['validate:'+i]), IDS.filter(i=>!(sc['test:'+i]&&sc['validate:'+i])).map(i=>'M'+i).join(',')||'todos');
ok('test:N aponta para build/mN/testN.node.js existente', IDS.every(i=>{ const m=(sc['test:'+i]||'').match(/build\/m\d+\/\S+\.js/); return m && exists(m[0]); }));
ok('validate:N aponta para build/mN/validateN.js existente', IDS.every(i=>{ const m=(sc['validate:'+i]||'').match(/build\/m\d+\/\S+\.js/); return m && exists(m[0]); }));
ok('cadeia agregada "test" inclui todos os test:N', IDS.every(i=>(sc.test||'').indexOf('run test:'+i+' ')>=0 || (sc.test||'').endsWith('run test:'+i)));
ok('cadeia agregada "validate" inclui todos os validate:N', IDS.every(i=>(sc.validate||'').indexOf('run validate:'+i+' ')>=0 || (sc.validate||'').endsWith('run validate:'+i)));
ok('"check" roda test, validate e qa', /test/.test(sc.check||'') && /validate/.test(sc.check||'') && /qa/.test(sc.check||''));

console.log('\n— ARQUIVOS DE BUILD POR MÓDULO —');
ok('todo módulo tem build/mN/testN.node.js', IDS.every(i=>exists('build/m'+i+'/test'+i+'.node.js')), IDS.filter(i=>!exists('build/m'+i+'/test'+i+'.node.js')).map(i=>'M'+i).join(',')||'todos');
ok('todo módulo tem build/mN/validateN.js', IDS.every(i=>exists('build/m'+i+'/validate'+i+'.js')), IDS.filter(i=>!exists('build/m'+i+'/validate'+i+'.js')).map(i=>'M'+i).join(',')||'todos');

console.log('\n— NÚCLEO FISIOLÓGICO COMPARTILHADO (source/core) —');
(function(){ const coreFiles=['units.js','oxygen.js','hemodynamics.js','guards.js','test-core.node.js'];
  ok('source/core tem os arquivos do primeiro núcleo', coreFiles.every(f=>exists('source/core/'+f)), coreFiles.filter(f=>!exists('source/core/'+f)).join(',')||'todos');
  ok('test:core existe e está na cadeia agregada "test"', !!sc['test:core'] && ((sc.test||'').indexOf('run test:core ')>=0 || (sc.test||'').endsWith('run test:core')));
  ok('test:core aponta para source/core/test-core.node.js existente', (function(){ const m=(sc['test:core']||'').match(/source\/core\/\S+\.js/); return !!m && exists(m[0]); })());
})();

console.log('\n— COERÊNCIA DA DOCUMENTAÇÃO (range × contagem) —');
(function(){ // "perfunde0.html … perfundeK.html" deve ter K === N
  const docs=['README.md','PERFUNDA.md','AGENTS.md','DOCUMENTATION_STATUS.md','ROADMAP.md','modulos.md'];
  let driftRange=[], driftMod=[];
  docs.forEach(d=>{ const t=read(d); if(t==null) return;
    let m; const re=/perfunde0\.html[^.]{0,8}(?:até|a|…|\.\.\.)[^.]{0,8}perfunde(\d+)\.html/gi;
    while((m=re.exec(t))){ if(+m[1]!==N) driftRange.push(d+':perfunde'+m[1]); }
    const re2=/\bM0[…\.\s-]+M(\d+)\b/g; while((m=re2.exec(t))){ if(+m[1]!==N) driftMod.push(d+':M'+m[1]); }
  });
  ok('docs citam o range "perfunde0…perfunde'+N+'" corretamente', driftRange.length===0, driftRange.join(' ')||'ok');
  ok('docs citam "M0…M'+N+'" corretamente', driftMod.length===0, driftMod.join(' ')||'ok');
  let driftEng=[];                                            // "build/m0 … build/mK" deve ter K === N
  docs.forEach(d=>{ const t=read(d); if(t==null) return; let m;
    const re=/build\/m0\b[^.]{0,16}(?:até|a|…|\.\.\.)[^.]{0,16}build\/m(\d+)\b/gi;
    while((m=re.exec(t))){ if(+m[1]!==N) driftEng.push(d+':build/m'+m[1]); } });
  ok('docs citam o range "build/m0…build/m'+N+'" corretamente', driftEng.length===0, driftEng.join(' ')||'ok');
})();
(function(){ // contagens obsoletas conhecidas do M30 (deve refletir o banco real)
  const bankN=require('../m30/bank30.js').buildBank().length;
  const docs=['README.md','PERFUNDA.md','DOCUMENTATION_STATUS.md','modulos.md','curriculum.json'];
  let stale=[];
  docs.forEach(d=>{ const t=read(d)||'';
    if(/exame global[^\n]*\(150 itens\)/i.test(t)) stale.push(d+':150itens');
    if(/exame global de (?:100 quest|dom[íi]nio de 100)/i.test(t)) stale.push(d+':100q');
    // contagem psicométrica obsoleta: "100 questões" / "150 itens" perto de "psicométrico/quartos"
    if(/(?:padr[ãa]o[^.\n]{0,40}psicom[ée]trico|quartos)[^.\n]{0,60}\b(100|150)\s+quest/i.test(t)) stale.push(d+':psico-stale');
    if(/\b(100|150)\s+quest[õo]es[^.\n]{0,40}(?:quartos|psicom)/i.test(t)) stale.push(d+':psico-stale');
  });
  ok('docs do M30 não citam contagem obsoleta (banco tem '+bankN+' itens)', stale.length===0, stale.join(' ')||'ok');
})();

console.log('\n'+oks+' OK · '+falhas+' falhas');
process.exit(falhas>0?1:0);
