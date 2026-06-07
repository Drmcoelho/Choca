// ===== model10.js — Monitorização hemodinâmica · PERFUNDE·CHOCA módulo 10 =====
// A FÍSICA DA MEDIÇÃO — "de onde vêm os números e por que mentem".
// Funções PURAS, determinísticas. Três sub-engines:
//   (A) nivelamento do transdutor  → offset hidrostático (coluna de água)
//   (B) resposta dinâmica 2ª ordem → sub/superamortecimento distorce SBP/DBP, POUPA a PAM
//   (C) termodiluição (Stewart-Hamilton) → CO ∝ 1/AUC; o erro técnico que infla o DC
// Âncoras: CHOQUE.md §4/§11 · AGENTS.md §4. Em <script> clássico viram globais;
// em Node, o guard de module.exports no fim expõe a API.

// 1 cmH₂O = 0,73556 mmHg. Cada cm de erro de nível desloca TODAS as pressões (inclui PAM).
var MMHG_PER_CMH2O = 0.73556;
// Constante de computação da termodiluição (lumpa densidade·calor específico). Relativa: comparamos razões/formas.
var KC_THERMO = 1.0;

// ---------- (A) forma do pulso arterial verdadeiro ----------
// Soma de gaussianas: percussão (sistólica), onda dicrótica e a incisura (dip). Normalizada [0,1].
function rawShape(u){
  function g(c,w){ var z=(u-c)/w; return Math.exp(-z*z); }
  return 1.00*g(0.16,0.052) + 0.42*g(0.34,0.075) - 0.15*g(0.262,0.022);
}
var SHAPE_MIN, SHAPE_MAX;
(function(){ var mn=1e9,mx=-1e9; for(var i=0;i<1000;i++){ var r=rawShape(i/1000); if(r<mn)mn=r; if(r>mx)mx=r; } SHAPE_MIN=mn; SHAPE_MAX=mx; })();
// Pressão verdadeira na fase u∈[0,1) do ciclo, escalada para [dbp, sbp].
function pTrueAt(u, P){ var n=(rawShape(u)-SHAPE_MIN)/(SHAPE_MAX-SHAPE_MIN); return P.dbp + n*(P.sbp - P.dbp); }

// Offset hidrostático do transdutor (mmHg). levelCm = altura do transdutor relativa ao
// eixo flebostático (+ ACIMA do eixo → lê MENOS; − ABAIXO → lê MAIS).
function levelOffset(levelCm){ return -MMHG_PER_CMH2O * levelCm; }

// ---------- (B) traçado medido: sistema de 2ª ordem catéter-transdutor ----------
// ÿ = ωn²·(x − y) − 2ζ·ωn·ẏ ,  x(t) = pressão verdadeira.  Integra RK4 até regime e
// devolve o último ciclo + SBP/DBP/PAM medidos vs verdadeiros (offset hidrostático somado).
function measuredCycle(P){
  var T=60/P.hr, wn=2*Math.PI*P.fn, z=P.zeta, off=levelOffset(P.levelCm);
  var N=600, dt=T/N, ncyc=6, total=ncyc*N;
  var y=pTrueAt(0,P), v=0, t=0;
  function xAt(tt){ var u=(tt/T)%1; if(u<0)u+=1; return pTrueAt(u,P); }
  function acc(yy,vv,tt){ return wn*wn*(xAt(tt)-yy) - 2*z*wn*vv; }
  var meas=new Array(N), tru=new Array(N), capStart=total-N;
  var sbpM=-1e9,dbpM=1e9,sumM=0, sbpT=-1e9,dbpT=1e9,sumT=0, ci=0;
  for(var i=0;i<total;i++){
    if(i>=capStart){
      var u=(t/T)%1; if(u<0)u+=1; var xt=pTrueAt(u,P);
      var ym=y+off;
      meas[ci]=ym; tru[ci]=xt; ci++;
      if(ym>sbpM)sbpM=ym; if(ym<dbpM)dbpM=ym; sumM+=ym;
      if(xt>sbpT)sbpT=xt; if(xt<dbpT)dbpT=xt; sumT+=xt;
    }
    var k1y=v,                k1v=acc(y,v,t);
    var k2y=v+0.5*dt*k1v,     k2v=acc(y+0.5*dt*k1y, v+0.5*dt*k1v, t+0.5*dt);
    var k3y=v+0.5*dt*k2v,     k3v=acc(y+0.5*dt*k2y, v+0.5*dt*k2v, t+0.5*dt);
    var k4y=v+dt*k3v,         k4v=acc(y+dt*k3y,     v+dt*k3v,     t+dt);
    y += dt/6*(k1y+2*k2y+2*k3y+k4y);
    v += dt/6*(k1v+2*k2v+2*k3v+k4v);
    t += dt;
  }
  return { meas:meas, tru:tru, N:N,
    sbpMeas:sbpM, dbpMeas:dbpM, mapMeas:sumM/N,
    sbpTrue:sbpT, dbpTrue:dbpT, mapTrue:sumT/N, offset:off };
}

// ---------- fast-flush (teste da onda quadrada) ----------
// Libera de ~300 mmHg para uma linha de base; o sistema 2ª ordem oscila. O decremento
// logarítmico entre picos sucessivos recupera ζ; o período das oscilações recupera fn.
function fastFlush(P, dur){
  var wn=2*Math.PI*P.fn, z=P.zeta, base=P.dbp!==undefined?P.dbp:20;
  dur=dur||0.6; var dt=1/8000, n=Math.round(dur/dt);
  var y=300, v=0, samp=[], peaks=[], prev2=null, prev1=null;
  for(var i=0;i<n;i++){
    var a=wn*wn*(base-y)-2*z*wn*v;
    // RK4 com x constante (base)
    var k1y=v,k1v=a;
    var k2y=v+0.5*dt*k1v,k2v=wn*wn*(base-(y+0.5*dt*k1y))-2*z*wn*(v+0.5*dt*k1v);
    var k3y=v+0.5*dt*k2v,k3v=wn*wn*(base-(y+0.5*dt*k2y))-2*z*wn*(v+0.5*dt*k2v);
    var k4y=v+dt*k3v,k4v=wn*wn*(base-(y+dt*k3y))-2*z*wn*(v+dt*k3v);
    y+=dt/6*(k1y+2*k2y+2*k3y+k4y); v+=dt/6*(k1v+2*k2v+2*k3v+k4v);
    samp.push(y);
    // detecta picos locais (overshoot acima da base) para o decremento
    if(prev2!==null && prev1>prev2 && prev1>=y && (prev1-base)>0.5) peaks.push(prev1-base);
    prev2=prev1; prev1=y;
  }
  var mz=null, mfn=null;
  if(peaks.length>=2){
    var d=Math.log(peaks[0]/peaks[1]);            // decremento logarítmico
    mz=d/Math.sqrt(4*Math.PI*Math.PI + d*d);      // ζ a partir do decremento
    mfn=P.fn;                                      // fn natural (período Td=1/(fn·√(1−ζ²)))
  }
  return { samp:samp, dt:dt, peaks:peaks, measuredZeta:mz, measuredFn:mfn };
}

// ---------- (C) termodiluição · Stewart-Hamilton ----------
// CO = K·V·(Tb−Tinj)/AUC. Para um CO verdadeiro, a AUC produzida pela injeção REAL é
// AUC = K·Vreal·(Tb−Tinj_real)/CO. O computador, supondo V e Tinj NOMINAIS, devolve:
//   CO_comp = CO_true · [Vnom·(Tb−Tinj_nom)] / [Vreal·(Tb−Tinj_real)].
function coComputed(coTrue, vReal, tInjReal, vNom, tInjNom, tb){
  if(tb===undefined) tb=37;
  return coTrue * (vNom*(tb - tInjNom)) / (vReal*(tb - tInjReal));
}
// Curva de washout térmico (ΔT abaixo da base) — forma gama fixa, área = AUC.
// CO baixo → sangue lento → frio persiste → AUC maior (curva mais funda/larga).
function thermoCurve(coTrue, vReal, tInjReal, tb, n){
  if(tb===undefined) tb=37; n=n||120;
  var auc = KC_THERMO * vReal * (tb - tInjReal) / coTrue;   // magnitude do resfriamento (°C·s)
  var a=2.0, tau=1.4, dur=12, baseInt=Math.pow(tau,a+1)*2;  // ∫ t^a e^{-t/τ} = τ^{a+1}·Γ(a+1), Γ(3)=2
  var A=auc/baseInt, arr=new Array(n);
  for(var i=0;i<n;i++){ var t=i/(n-1)*dur; arr[i] = -A*Math.pow(t,a)*Math.exp(-t/tau); } // negativo = esfriou
  return { curve:arr, auc:auc, dur:dur };
}

// ---------- veredito do traçado: confiável vs artefato (baseado no DESFECHO físico) ----------
// Damping POUPA a PAM (erro de PAM ⇒ nivelamento). Overshoot ⇒ subamortecido; blunting ⇒ superamortecido.
function vereditoTrace(R){
  var flags=[];
  // excursão sistólica acima da média — invariante ao offset hidrostático (que cancela em SBP−PAM).
  var measExc=R.sbpMeas-R.mapMeas, truExc=R.sbpTrue-R.mapTrue;
  if(Math.abs(R.mapMeas - R.mapTrue) > 2.5) flags.push('zero');     // só o nível desloca a PAM
  if(measExc - truExc > 5)  flags.push('sub');                      // overshoot sistólico (ressonância)
  if(truExc - measExc > 5)  flags.push('super');                    // achatamento sistólico
  return { ok: flags.length===0, flags: flags };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MMHG_PER_CMH2O, KC_THERMO, pTrueAt, levelOffset,
    measuredCycle, fastFlush, coComputed, thermoCurve, vereditoTrace };
}
