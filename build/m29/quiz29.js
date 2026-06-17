// build/m29/quiz29.js — Banco de MCQ integradas do capstone (Módulo 29)
// 30 questões que cruzam o braço inteiro (CaO2/DO2, supply-dependence, a
// inversão PAM=DC×RVS, micro/lactato, as categorias, misto, 4 perfis,
// receptor→termo). Dificuldade crescente. Gabarito DISPROPORCIONAL e a correta
// NUNCA é sistematicamente a mais longa. Firewall SaMD: mecanismo, não conduta.
'use strict';

// cada item: {tier:'b'|'i'|'a', cap, q, o:[4], a:índice da correta tal como AUTORADA, fb, ref?:presetId}
var RAW=[
  // — básico: leitura da cascata —
  { tier:'b', cap:'Conteúdo de O₂', q:'Numa anemia grave com SaO₂ e PaO₂ normais, o que cai primeiro na cadeia de transporte?', o:[
    'a PaO₂, porque a hemoglobina disponível deixa de saturar adequadamente o plasma','o conteúdo arterial de O₂ (CaO₂), porque depende da hemoglobina','a saturação venosa, exclusivamente, sem afetar o conteúdo arterial','nada muda enquanto a SaO₂ estiver normal'], a:1,
    fb:'CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂: a Hb é o termo dominante. Menos Hb → menos conteúdo, mesmo com SaO₂ e PaO₂ normais.' },
  { tier:'b', cap:'DO₂', q:'A entrega de oxigênio (DO₂) é o produto de:', o:[
    'débito cardíaco × conteúdo arterial de O₂ (× 10)','pressão arterial média × resistência vascular','frequência cardíaca × pressão de pulso','saturação venosa × lactato'], a:0,
    fb:'DO₂ = DC × CaO₂ × 10. Cai por bomba/ritmo/volume (DC) ou por anemia/hipoxemia (CaO₂).' },
  { tier:'b', cap:'A inversão', q:'Por que a pressão arterial média (PAM) é um número que engana?', o:[
    'porque é sempre normal no choque','porque pode estar normal com débito e perfusão ruins, já que PAM = DC × RVS','porque não tem relação com o débito cardíaco','porque depende apenas da volemia e do tônus venoso, sendo a resistência arteriolar um fator secundário e tardio'], a:1,
    fb:'PAM = PVC + DC·RVS: a vasoconstrição (RVS↑) sustenta a PAM enquanto o débito e a perfusão despencam.' },
  { tier:'b', cap:'Lactato', q:'Um lactato elevado, na cadeia de transporte, sinaliza sobretudo:', o:[
    'sempre infecção bacteriana ativa','déficit entre demanda e oferta de O₂ (ou desacoplamento metabólico)','exclusivamente falência hepática, já que o fígado é o único órgão capaz de produzir e depurar o lactato circulante','um erro laboratorial na maioria das vezes'], a:1,
    fb:'Lactato sobe quando a oferta não cobre a demanda (tipo A) ou por estímulo metabólico/β (tipo B). É marcador, não diagnóstico único.' },
  { tier:'b', cap:'Perfil', q:'Num mapa débito × resistência, o perfil "frio" corresponde a:', o:[
    'resistência vascular elevada (vasoconstrição) com débito baixo','resistência baixa com débito alto','pressão de pulso aumentada por elevação isolada do volume sistólico, mantida a resistência vascular preservada','saturação venosa alta'], a:0,
    fb:'Frio = vasoconstrito (RVS alta) tentando defender a PAM apesar do débito baixo; quente = vasodilatado (RVS baixa).' },
  { tier:'b', cap:'SvO₂', q:'A saturação venosa central (ScvO₂) tende a CAIR quando:', o:[
    'a oferta de O₂ cai e o tecido extrai mais para manter o consumo','a oferta de O₂ sobe acima da demanda','a hemoglobina aumenta sem mudar o débito, elevando proporcionalmente a saturação do sangue que retorna ao coração direito','a demanda metabólica zera'], a:0,
    fb:'SvO₂ ≈ SaO₂·(1 − O2ER): se a oferta cai, a extração sobe e a SvO₂ desce. (Pode subir paradoxalmente quando a extração falha — micro/mito.)' },
  { tier:'b', cap:'Termo quebrado', q:'A lógica unificadora do braço para escolher uma alavanca é:', o:[
    'tratar sempre a pressão até normalizar o número','identificar o termo quebrado, escolher a alavanca que o move e pesar o custo','dar volume a todos os choques de início, pois a pré-carga é o determinante universal do débito cardíaco','começar por vasopressor em qualquer caso'], a:1,
    fb:'Termo quebrado → alavanca que o move → custo. A droga/medida é mecanismo casado ao problema, não receita fixa.' },
  { tier:'b', cap:'Categorias', q:'O choque distributivo se distingue por:', o:[
    'débito baixo com resistência muito alta','resistência vascular baixa (vasoplegia), com débito geralmente alto','pré-carga altíssima por retenção hidrossalina, com congestão venosa sistêmica como traço predominante','conteúdo de O₂ sempre baixo'], a:1,
    fb:'Distributivo = RVS baixa (vasoplegia); o débito costuma estar alto. O termo quebrado é a resistência.' },

  // — intermediário: relações e contrastes —
  { tier:'i', cap:'Supply-dependence', q:'Abaixo do limiar crítico de entrega (DO₂crit), o consumo de O₂ (VO₂) passa a:', o:[
    'permanecer constante, pois é independente da oferta em qualquer faixa','depender linearmente da oferta — cai junto com a DO₂, e surge déficit/lactato','aumentar acima da demanda','não ter relação com a extração'], a:1,
    fb:'Acima do DO₂crit, o VO₂ é independente da oferta (a extração compensa); abaixo, vira supply-dependent e acumula déficit → lactato.' },
  { tier:'i', cap:'Mesma PAM', q:'Dois pacientes têm a MESMA PAM de 70 mmHg. Por que isso não os iguala?', o:[
    'porque a PAM de 70 é sempre normal e nada muda','porque um pode ter DC alto/RVS baixa e o outro DC baixo/RVS alta — mecânicas opostas','porque a PAM não depende do débito cardíaco, apenas do tônus arteriolar e da pressão venosa central medida','porque ambos têm necessariamente o mesmo lactato'], a:1,
    fb:'PAM = DC × RVS: o mesmo produto nasce de fatores opostos. Decompor antes de interpretar.' },
  { tier:'i', cap:'Cardiogênico', q:'No cardiogênico, por que a resistência vascular costuma estar ALTA?', o:[
    'por vasoplegia inflamatória','por vasoconstrição compensatória que tenta defender a PAM apesar do débito baixo','porque o coração bombeia em excesso','por efeito vasoconstritor direto do lactato acumulado sobre a musculatura lisa das arteríolas periféricas'], a:1,
    fb:'O baixo débito dispara vasoconstrição reflexa; a RVS alta mascara a PAM. O termo quebrado é a bomba, não a RVS.' },
  { tier:'i', cap:'Pós-carga', q:'Dar um vasoconstritor α1 puro a um ventrículo já fraco tende a:', o:[
    'melhorar o débito por aumentar a contratilidade','reduzir o débito, porque a pós-carga extra sobrecarrega a bomba que já falha','não ter efeito sobre o débito','corrigir a causa da falência ao restaurar a pressão de perfusão coronária do miocárdio isquêmico'], a:1,
    fb:'α1 sobe a pós-carga = RVS; o ventrículo fraco é sensível à pós-carga e o volume sistólico cai. Termo errado.' },
  { tier:'i', cap:'Micro/mito', q:'No choque séptico, uma ScvO₂ paradoxalmente ALTA com lactato alto sugere:', o:[
    'oferta excessiva e tecido satisfeito','falha de extração/utilização (micro/mitocôndria): o O₂ chega mas não é usado','anemia grave isolada, com a queda do conteúdo arterial reduzindo a saturação do sangue venoso de retorno','erro de medida obrigatório'], a:1,
    fb:'Quando a extração falha, o sangue volta "cheio" de O₂ (SvO₂ alta) enquanto o tecido segue faminto (lactato alto).' },
  { tier:'i', cap:'Volume como droga', q:'A reposição volêmica perde benefício quando:', o:[
    'o paciente deixa de ser responsivo a volume — mais pré-carga não gera mais débito, só congestão','a pré-carga ainda está na porção ascendente da curva','o débito ainda sobe a cada alíquota','nunca; volume sempre ajuda'], a:0,
    fb:'Frank-Starling tem platô: passado o ponto responsivo, volume vira custo (congestão) sem ganho de débito.' },
  { tier:'i', cap:'Inodilatador', q:'A vantagem mecanística de um inodilatador (PDE-3) sobre um β-agonista, no mesmo objetivo inotrópico, é:', o:[
    'elevar a resistência vascular ao mesmo tempo','gerar inotropia sem passar pelo receptor β, com menos demanda de O₂ e arritmia','ser dose fixa e dispensar diluição','sedar e reduzir a demanda metabólica cerebral concomitante, poupando oxigênio para o miocárdio sobrecarregado'], a:1,
    fb:'A PDE-3 contorna o β: sobe a contratilidade com menos custo adrenérgico (mas vasodilata, podendo baixar a PA).' },
  { tier:'i', cap:'Vasopressina', q:'O que torna a vasopressina (V1) singular entre os vasopressores?', o:[
    'sobe a contratilidade seletivamente','sustenta a pressão por via NÃO-adrenérgica, poupando catecolamina','broncodilata intensamente','reduz seletivamente a pós-carga do ventrículo direito ao vasodilatar o leito arterial pulmonar'], a:1,
    fb:'V1 age fora do eixo adrenérgico: pressão poupadora de catecolamina, útil na vasoplegia.' },
  { tier:'i', cap:'Obstrutivo', q:'No TEP maciço, o termo mecanicamente quebrado é mais bem descrito como:', o:[
    'vasoplegia sistêmica','barreira ao débito por sobrecarga aguda do ventrículo direito (pós-carga pulmonar)','perda primária de conteúdo de O₂','excesso de pré-carga do ventrículo esquerdo por congestão pulmonar retrógrada maciça e aguda'], a:1,
    fb:'A obstrução pulmonar sobrecarrega o VD; o VE recebe menos. É obstrutivo — tratar a obstrução é o pilar.' },
  { tier:'i', cap:'Anaf × neuro', q:'Anafilático e neurogênico são ambos distributivos. O melhor discriminador clínico é:', o:[
    'a cor da pele isoladamente','a frequência cardíaca: alta favorece anafilático; baixa/normal favorece neurogênico','o valor exato da PAM','a hemoglobina'], a:1,
    fb:'Ambos vasodilatam, mas por vias distintas; a FC (resposta simpática presente × ausente) os separa.' },
  { tier:'i', cap:'Críptico', q:'Choque "críptico/compensado" significa:', o:[
    'PAM francamente baixa e sintomática desde a apresentação, dispensando qualquer marcador laboratorial de perfusão','PAM normal mantida por compensação, mascarando hipoperfusão (lactato/marcadores denunciam)','ausência total de choque','choque apenas laboratorial, sem risco'], a:1,
    fb:'A compensação tem reserva finita: a PAM normal mente até o precipício. Marcadores ocultos revelam o déficit.' },
  { tier:'i', cap:'Adrenalina', q:'A hiperlactatemia que pode surgir com adrenalina, sem piora da perfusão, deve-se a:', o:[
    'hipoperfusão tecidual por vasoconstrição excessiva','estímulo β2 da glicólise (lactato tipo B), e não a déficit de O₂','contaminação da amostra','falência hepática aguda'], a:1,
    fb:'β2 acelera a glicólise → lactato tipo B; pode simular piora sem haver déficit de oferta.' },

  // — avançado: integração e armadilhas —
  { tier:'a', cap:'Misto', q:'Um paciente séptico evolui com FE 30% ao ECO. O que muda na conduta mecanística?', o:[
    'nada: segue sendo distributivo puro','passa a misto (RVS baixa + bomba fraca): endereçar os dois termos, p.ex. vasopressor + inotrópico','deve-se apenas repor volume até normalizar a PAM','troca-se o diagnóstico para cardiogênico puro, ignorando a vasoplegia'], a:1,
    fb:'Cardiomiopatia séptica soma um termo de bomba ao distributivo. Mistos pedem alavancas para cada termo quebrado.' },
  { tier:'a', cap:'DO₂ vs PAM', q:'Subir apenas a RVS (vasoconstritor puro) num débito baixo pode:', o:[
    'garantir a perfusão tecidual por elevar a PAM','elevar a PAM enquanto a entrega (DO₂) e a perfusão pioram, porque o fluxo não aumentou','aumentar o débito cardíaco diretamente, já que mais pressão na raiz da aorta acelera o esvaziamento ventricular','corrigir a anemia subjacente'], a:1,
    fb:'PAM ≠ perfusão. RVS alta sobe o número, mas a DO₂ depende do fluxo (DC × CaO₂). Pressão sem fluxo engana.' },
  { tier:'a', cap:'Extração', q:'Por que aumentar a DO₂ acima do normal NÃO eleva indefinidamente o VO₂?', o:[
    'porque o VO₂ é independente da oferta acima do DO₂crit — limitado pela demanda, não pela oferta','porque a extração cresce sem limite','porque o lactato bloqueia o consumo','porque a SvO₂ cai a zero'], a:0,
    fb:'Acima do limiar, o consumo é ditado pela demanda metabólica; ofertar mais não cria consumo (supply-independence).' },
  { tier:'a', cap:'Hemorrágico', q:'No choque hemorrágico, por que o vasopressor não "resolve" o quadro?', o:[
    'porque corrige a causa, tornando-se suficiente','porque a causa é a perda de volume/conteúdo: o pilar é hemostasia + reposição; pressor só maquia o número','porque o vasopressor reduz a frequência cardíaca e o consumo miocárdico, estancando o sangramento por vasoconstrição esplâncnica seletiva','porque eleva a hemoglobina'], a:1,
    fb:'O termo quebrado é o retorno/pré-carga (e o conteúdo, se sangrou). Pressor sobe a PAM sem repor o que falta.' },
  { tier:'a', cap:'Fenilefrina', q:'Em qual cenário um α1 puro (fenilefrina) faz mais sentido mecanístico?', o:[
    'cardiogênico com bomba muito fraca','hipotensão com taquicardia e bomba preservada, onde subir a RVS e aceitar bradicardia reflexa ajuda','choque hemorrágico não controlado','sepse com débito alto e extração falha'], a:1,
    fb:'α1 puro sobe a RVS e gera bradicardia reflexa — útil quando a bomba está boa e a RVS é o que falta, não na bomba fraca.' },
  { tier:'a', cap:'Acidose', q:'Por que a acidemia intensa pode tornar os vasopressores "menos eficazes"?', o:[
    'porque aumenta a resposta α, exigindo doses menores','porque reduz a responsividade do receptor α — corrigir o pH costuma melhorar a resposta','porque converte funcionalmente o estímulo α em resposta β, invertendo o efeito vascular esperado da droga','porque eleva a pré-carga'], a:1,
    fb:'O meio ácido reduz a responsividade adrenérgica; a correção do distúrbio melhora a resposta pressórica.' },
  { tier:'a', cap:'Coração-pulmão', q:'A pressão intratorácica positiva (ventilação) pode AJUDAR o ventrículo esquerdo que falha porque:', o:[
    'aumenta o retorno venoso ao máximo','reduz a pós-carga transmural do VE (descarrega a bomba), embora possa reduzir a pré-carga','eleva diretamente a contratilidade','remove o líquido alveolar mecanicamente'], a:1,
    fb:'A pressão pleural positiva baixa a pós-carga transmural do VE — descarrega a bomba que falha; no VD sobrecarregado o efeito pode ser oposto.' },
  { tier:'a', cap:'Síntese 4 perfis', q:'No 2×2 perfusão × congestão, "frio e úmido" típico do cardiogênico pede, mecanicamente:', o:[
    'volume generoso para subir a pré-carga','melhorar o fluxo (inotropismo) e, se preciso, sustentar a pressão — não mais congestão','apenas vasoconstritor potente para subir a PAM e, com ela, garantir a perfusão dos órgãos nobres','reduzir a frequência cardíaca como medida central'], a:1,
    fb:'Frio (baixo fluxo) + úmido (congesto): o termo quebrado é a bomba; somar volume só agrava a congestão.' },
  { tier:'a', cap:'Reavaliação', q:'A razão mais robusta para reavaliar o choque dinamicamente ao longo do tempo é:', o:[
    'os valores nunca mudam, então é apenas protocolo','o termo dominante pode mudar (categorias se somam/evoluem), exigindo recasar a alavanca ao novo termo quebrado','para repetir exames sem motivo','porque a PAM isolada basta e dispensa reavaliação'], a:1,
    fb:'O choque é móvel: o que era distributivo vira misto, o obstrutivo resolve etc. Decompor de novo a cada interação.' },
  { tier:'a', cap:'Custo', q:'Por que "mover o termo quebrado" não basta — também se pesa o custo?', o:[
    'porque o custo é irrelevante se a PAM subir','porque toda alavanca cobra um preço (demanda de O₂, arritmia, congestão); a escolha pesa benefício × custo no termo certo','porque o custo só existe para vasopressores','porque mover o termo errado não tem custo'], a:1,
    fb:'A regra final: termo quebrado → alavanca que o move → custo. β custa O₂/ritmo; volume custa congestão; pressor custa isquemia. Casar e pesar.' }
];

// gabarito-alvo DISPROPORCIONAL (30 questões → A5 B9 C8 D8 ≈ 17/30/27/27%) — nunca round-robin
var TG=[0,1,2,3,1,0,2,3,1,2,0,1,3,2,1,3,0,2,1,3,2,1,0,3,2,1,3,2,1,3];

function buildBank(){
  return RAW.map(function(it,qi){
    var o=it.o.slice(), tg=TG[qi%TG.length], a=it.a;
    var sh=((tg-a)%4+4)%4; for(var s=0;s<sh;s++){ o.unshift(o.pop()); }
    return { tier:it.tier, cap:it.cap, q:it.q, o:o, a:tg, fb:it.fb, ref:it.ref||null };
  });
}
function stats(){ var b=buildBank(), d=[0,0,0,0], longest=0;
  b.forEach(function(q){ d[q.a]++; var L=q.o.map(function(x){return x.length;}); if(L[q.a]===Math.max.apply(null,L)) longest++; });
  return { n:b.length, dist:d, longest:longest, tiers:{ b:b.filter(function(x){return x.tier==='b';}).length, i:b.filter(function(x){return x.tier==='i';}).length, a:b.filter(function(x){return x.tier==='a';}).length } };
}

if(typeof module!=='undefined' && module.exports){ module.exports={ RAW:RAW, buildBank:buildBank, stats:stats }; }
