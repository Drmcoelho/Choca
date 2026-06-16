// build/m30/bank30.js — Banco do M30+ · Sistema de Avaliação de Domínio
// PARTE 1 · itens 1–50 (eixos E1–E3: conteúdo/transporte, determinantes,
// inversão/beira-leito). Crescerá para 150 nas partes 2–3. Formato de item:
//   { id, format, quarter, difficulty, axis, modules:[], concepts:[], trap,
//     grounded: null | {ref,args,kind,optionValues,tol?},
//     stem, o:[4], a:índice, rationale:{correct, why:[4], trap, concept} }
// Firewall SaMD: mecanismo, nunca dose/conduta. Itens grounded recomputados
// pelo grounding30 (gabarito = motor). Ver build/m30/PLAN.md.
'use strict';

var m29=(typeof require!=='undefined')?require('../m29/model29.js'):null;
var _dist=m29?m29.PRESETS.distributivo.state:null, _card=m29?m29.PRESETS.cardiogenico.state:null;

var BANK=[
  // ===================== E1 · Conteúdo & transporte (M0–M2) =====================
  { id:'m30_q001', format:'sba', quarter:1, difficulty:1, axis:'E1', modules:['M1'], concepts:['CaO2','Hb'], trap:'T03',
    stem:'Numa anemia grave com SaO₂ 98% e PaO₂ normais, o que cai primeiro na cadeia de transporte?',
    o:['a PaO₂, porque a hemoglobina disponível deixa de saturar adequadamente o plasma circulante','o conteúdo arterial de O₂ (CaO₂), porque depende sobretudo da hemoglobina','a saturação, que cai junto com a hemoglobina em qualquer anemia','nada relevante enquanto a SaO₂ permanecer em 98%'], a:1,
    rationale:{ correct:'CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂: a Hb é o termo dominante; menos Hb derruba o conteúdo com SaO₂/PaO₂ normais.', why:['a PaO₂ não depende da Hb e está normal','correta: o conteúdo cai por falta de carreador','SaO₂ é fração ocupada, não muda só por anemia','a saturação alta mascara o conteúdo baixo'], trap:'conteúdo ≠ saturação', concept:'M1 · CaO₂' } },

  { id:'m30_q002', format:'sba', quarter:1, difficulty:1, axis:'E1', modules:['M1','M2'], concepts:['SpO2','conteudo'], trap:'T03',
    stem:'Por que "saturar bem" não garante "transportar bem"?',
    o:['porque a SpO₂ mede a fração de Hb ocupada, não a quantidade de Hb que carrega O₂','porque a SpO₂ sempre superestima a PaO₂ em qualquer contexto clínico','porque a curva de oxi-hemoglobina não tem relação com a entrega tecidual','porque o O₂ fisicamente dissolvido no plasma é, na prática, a maior parte do conteúdo arterial de oxigênio'], a:0,
    rationale:{ correct:'SpO₂ é percentual de ocupação; o conteúdo depende de quanta Hb existe. Anemia satura 100% e transporta pouco.', why:['correta: ocupação ≠ quantidade','a relação SpO₂–PaO₂ é pela curva, não superestimativa fixa','a curva É entrega tecidual (M2)','o dissolvido é quase desprezível'], trap:'conteúdo ≠ saturação', concept:'M1/M2 · conteúdo × saturação' } },

  { id:'m30_q003', format:'est', quarter:1, difficulty:1, axis:'E1', modules:['M1'], concepts:['CaO2'], trap:'T03',
    grounded:{ ref:'model1.ca', args:{hb:10, sao2:0.90, pao2:80}, kind:'number', optionValues:[12.3, 13.4, 9.2, 6.7], tol:0.6 },
    stem:'Hb 10 g/dL, SaO₂ 90%, PaO₂ 80 mmHg. O conteúdo arterial de O₂ (CaO₂), em mL/dL, é aproximadamente:',
    o:['12,3','13,4','9,2','6,7'], a:0,
    rationale:{ correct:'1,34·10·0,90 + 0,003·80 = 12,06 + 0,24 = 12,30 mL/dL.', why:['correta: aplica a fórmula completa','superestima (fator de Hüfner ou saturação errados)','subestima ao tratar mal a hemoglobina','cerca de metade do valor real'], trap:'conteúdo ≠ saturação', concept:'M1 · CaO₂ (computado)' } },

  { id:'m30_q004', format:'sba', quarter:2, difficulty:2, axis:'E1', modules:['M2'], concepts:['curva','P50'], trap:'T13',
    stem:'Um desvio da curva de oxi-hemoglobina para a direita (P50 maior) significa, na entrega tecidual:',
    o:['menor afinidade da Hb pelo O₂, favorecendo a liberação ao tecido','maior afinidade, retendo o O₂ na hemoglobina e dificultando a entrega','nenhuma mudança na entrega, apenas na captação pulmonar','queda obrigatória da SaO₂ a níveis críticos'], a:0,
    rationale:{ correct:'Direita = P50↑ = menor afinidade: a Hb "solta" mais O₂ no tecido (acidose, CO₂, temperatura, 2,3-DPG).', why:['correta: menor afinidade, mais offloading','direita é menor afinidade, não maior','a curva é também entrega, não só captação','o desvio não obriga SaO₂ crítica'], trap:'supply/entrega mal lida', concept:'M2 · curva como entrega' } },

  { id:'m30_q005', format:'trap', quarter:3, difficulty:3, axis:'E1', modules:['M1','M8'], concepts:['CaO2','DO2'], trap:'T03',
    stem:'Qual alternativa encarna a armadilha "conteúdo = saturação"?',
    o:['"como a SpO₂ está em 99%, a entrega de O₂ está garantida mesmo com Hb 5"','"a entrega depende do débito e do conteúdo, e o conteúdo depende sobretudo da Hb"','"transfundir hemácias eleva o CaO₂ e, para o mesmo débito, a DO₂"','"anemia profunda reduz a entrega mesmo com saturação plena"'], a:0,
    rationale:{ correct:'A frase confunde ocupação (SpO₂) com quantidade de carreador: com Hb 5, a entrega NÃO está garantida.', why:['correta: a armadilha clássica','essa frase está correta (conteúdo depende da Hb)','correta fisiologicamente, não é a armadilha','verdadeira: anemia reduz entrega'], trap:'conteúdo ≠ saturação', concept:'M1/M8 · meta-armadilha' } },

  { id:'m30_q006', format:'sba', quarter:1, difficulty:1, axis:'E1', modules:['M0','M1'], concepts:['regua','unidades'], trap:'T01',
    stem:'Por que a régua quantitativa (CaO₂, DO₂, O₂ER) precede qualquer discussão de choque?',
    o:['porque sem unidade e mecanismo o aluno faz "medicina de número" e confunde resultado com causa','porque as fórmulas substituem o exame clínico à beira do leito','porque o número do monitor é sempre a verdade fisiológica','porque a matemática dispensa entender a fisiologia subjacente'], a:0,
    rationale:{ correct:'A régua existe para enxergar ONDE a cadeia quebrou; sem ela, trata-se o número-resultante, não o mecanismo.', why:['correta: evita medicina de número','a régua não substitui o exame','o monitor tem erro (M10)','a matemática serve à fisiologia, não a dispensa'], trap:'número ≠ mecanismo', concept:'M0 · régua do transporte' } },

  // ===================== E2 · Determinantes do débito (M3–M8) =====================
  { id:'m30_q007', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M3'], concepts:['DC','FC','VS'], trap:'T01',
    stem:'Por que "frequência cardíaca alta" não significa "débito cardíaco alto"?',
    o:['porque DC = FC × VS, e a taquicardia excessiva encurta a diástole e reduz o volume sistólico','porque a FC não tem qualquer relação com o débito cardíaco','porque o volume sistólico é fixo e independe do enchimento','porque o débito depende apenas da resistência vascular'], a:0,
    rationale:{ correct:'DC = FC × VS: além de certo ponto, a FC alta encurta o enchimento diastólico e o VS cai, podendo derrubar o débito.', why:['correta: FC e VS se multiplicam, com teto','a FC entra no produto do débito','o VS varia com pré-carga/contratilidade','o débito não depende só da RVS'], trap:'número ≠ mecanismo', concept:'M3 · débito cardíaco' } },

  { id:'m30_q008', format:'est', quarter:2, difficulty:2, axis:'E2', modules:['M1','M8'], concepts:['DO2'], trap:'T13',
    grounded:{ ref:'model1.do2', args:{dc:5, cao2:20}, kind:'number', optionValues:[100, 1000, 250, 400], tol:5 },
    stem:'Débito 5 L/min e CaO₂ 20 mL/dL. A entrega de O₂ (DO₂), em mL/min, é aproximadamente:',
    o:['100','1000','250','400'], a:1,
    rationale:{ correct:'DO₂ = DC × CaO₂ × 10 = 5 × 20 × 10 = 1000 mL/min.', why:['esquece o fator de conversão ×10','correta: aplica DO₂ = DC·CaO₂·10','confunde com o limiar crítico','usa débito errado'], trap:'supply/entrega', concept:'M8 · DO₂ (computado)' } },

  { id:'m30_q009', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M6'], concepts:['Frank-Starling','preload'], trap:'T04',
    stem:'Na curva de Frank-Starling, por que "mais pré-carga" deixa de ajudar?',
    o:['porque, passado o platô, mais volume não aumenta o volume sistólico e só acrescenta congestão','porque o volume sistólico cresce indefinidamente com a pré-carga','porque a pré-carga não tem efeito sobre a ejeção','porque a contratilidade cai sempre que se administra volume'], a:0,
    rationale:{ correct:'A curva satura: além do ponto responsivo, a pré-carga extra vira custo (congestão) sem ganho de débito.', why:['correta: platô da curva','o VS não cresce sem limite','a pré-carga modula a ejeção (Starling)','volume não derruba a contratilidade por si'], trap:'responsivo ≠ tolerante', concept:'M6 · Frank-Starling' } },

  { id:'m30_q010', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M5'], concepts:['responsivo','tolerante'], trap:'T04',
    stem:'"Responsivo a volume" e "tolerante a volume" são perguntas diferentes porque:',
    o:['a primeira pergunta se o débito sobe com volume; a segunda, se o paciente suporta o volume sem congestão','são sinônimos: quem responde sempre tolera o volume administrado','tolerância implica responsividade em todos os casos clínicos','ambas dependem unicamente da pressão venosa central medida'], a:0,
    rationale:{ correct:'Responsividade = ganho de débito na curva ascendente; tolerância = ausência de dano (edema). Pode-se responder e não tolerar.', why:['correta: ganho × dano são eixos distintos','não são sinônimos','tolerância não implica responsividade','a PVC isolada prediz mal ambas'], trap:'responsivo ≠ tolerante', concept:'M5 · Guyton aplicado' } },

  { id:'m30_q011', format:'est', quarter:2, difficulty:2, axis:'E2', modules:['M3','M6','M7'], concepts:['DC','determinantes'], trap:'T01',
    grounded:{ ref:'model29.cascade.co', args:{state:{}}, kind:'number', optionValues:[2.5, 5.0, 7.5, 4.0], tol:0.3 },
    stem:'Num paciente com determinantes normais (FC, contratilidade, pré-carga e RVS fisiológicas), o débito cardíaco computado fica em torno de:',
    o:['2,5 L/min','5,0 L/min','7,5 L/min','4,0 L/min'], a:1,
    rationale:{ correct:'Com FC ~75, contratilidade e pré-carga normais, o débito sai ~5 L/min (faixa fisiológica).', why:['baixo demais para o normal','correta: ~5 L/min','seria débito alto (ex.: distributivo)','abaixo da faixa normal'], trap:'número ≠ mecanismo', concept:'M3 · DC (computado)' } },

  { id:'m30_q012', format:'sba', quarter:3, difficulty:3, axis:'E2', modules:['M7'], concepts:['posCarga','PA'], trap:'T09',
    stem:'Por que "pós-carga" não é sinônimo de "pressão arterial"?',
    o:['porque a pós-carga é a carga contra a ejeção (tensão de parede), e a PA é só uma de suas componentes','porque a pós-carga é sempre menor que a pressão arterial sistólica','porque a PA não influencia em nada a ejeção ventricular','porque a pós-carga depende exclusivamente da frequência cardíaca'], a:0,
    rationale:{ correct:'Pós-carga é tensão parietal na ejeção (Laplace: pressão, raio, espessura); a PA é uma componente, não a definição.', why:['correta: carga contra a ejeção','não é uma regra de magnitude fixa','a PA influencia a ejeção','não depende da FC'], trap:'pós-carga ≠ PA', concept:'M7 · pós-carga & alça PV' } },

  { id:'m30_q013', format:'sba', quarter:3, difficulty:3, axis:'E2', modules:['M8'], concepts:['supply-dependence','DO2crit'], trap:'T13',
    stem:'Abaixo do limiar crítico de entrega (DO₂crit), o consumo de O₂ (VO₂):',
    o:['passa a depender linearmente da oferta, caindo com a DO₂ e gerando déficit/lactato','permanece constante, pois é sempre independente da oferta','aumenta progressivamente acima da própria demanda metabólica, pois a oferta extra impulsiona o consumo celular','deixa de ter relação com a extração tecidual'], a:0,
    rationale:{ correct:'Acima do DO₂crit o VO₂ é independente (a extração compensa); abaixo, vira supply-dependent e acumula déficit → lactato.', why:['correta: supply-dependence','só é independente ACIMA do limiar','o consumo é limitado pela demanda','a extração é justamente o mecanismo'], trap:'supply-independent × dependent', concept:'M8 · DO₂/VO₂' } },

  { id:'m30_q014', format:'ar', quarter:3, difficulty:3, axis:'E2', modules:['M8','M13'], concepts:['lactato','supply'], trap:'T12',
    stem:'ASSERÇÃO: o lactato pode subir sem queda da SpO₂. PORQUE: o déficit de O₂ surge quando a entrega cruza o limiar crítico, independentemente da saturação.',
    o:['as duas afirmações são verdadeiras e a segunda justifica a primeira','as duas são verdadeiras, mas a segunda não justifica a primeira','a primeira é verdadeira e a segunda é falsa','a primeira é falsa e a segunda é verdadeira'], a:0,
    rationale:{ correct:'Ambas verdadeiras e ligadas: o déficit (e o lactato) depende da DO₂ cruzar o DO₂crit — a SpO₂ pode estar normal.', why:['correta: V/V com nexo causal','há nexo causal entre elas','a segunda é verdadeira','a primeira é verdadeira'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M8/M13 · supply-dependence' } },

  { id:'m30_q015', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M4'], concepts:['Guyton','PVC'], trap:'T01',
    stem:'No modelo de Guyton, a PVC isolada é um marcador pobre de pré-carga porque:',
    o:['o ponto hemodinâmico emerge da interseção das curvas de retorno venoso e função cardíaca, não de um valor fixo','a PVC é sempre igual ao volume diastólico final do ventrículo','a PVC mede diretamente a responsividade a volume','o retorno venoso não influencia o débito cardíaco'], a:0,
    rationale:{ correct:'O débito real é a interseção retorno×função; a PVC, isolada, não diz onde o paciente está na curva.', why:['correta: é interseção, não ponto fixo','PVC ≠ volume diastólico','PVC isolada não prediz responsividade','o retorno venoso determina o débito'], trap:'número ≠ mecanismo', concept:'M4 · interseção de Guyton' } },

  { id:'m30_q016', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M7','M16'], concepts:['posCarga','alcaPV'], trap:'T09',
    stem:'Aumentar a pós-carga num ventrículo de contratilidade reduzida tende a:',
    o:['reduzir o volume sistólico, porque a bomba fraca é sensível à carga contra a ejeção','aumentar o volume sistólico de forma proporcional à pressão gerada, pois mais carga recruta mais contração','não alterar a ejeção, que depende só da pré-carga','elevar a contratilidade por reflexo compensatório imediato'], a:0,
    rationale:{ correct:'O ventrículo fraco é afterload-sensível: mais pós-carga → menos VS (a alça PV "encolhe" pela parede de ESPVR baixa).', why:['correta: bomba fraca perde VS com carga','mais carga não aumenta o VS','a ejeção depende também da pós-carga','a contratilidade não sobe por carga'], trap:'pós-carga ≠ PA', concept:'M7 · alça pressão-volume' } },

  { id:'m30_q017', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M8'], concepts:['O2ER','SvO2'], trap:'T06',
    stem:'Quando a oferta de O₂ cai e a demanda se mantém, a taxa de extração (O₂ER) e a SvO₂ tendem a:',
    o:['O₂ER sobe e SvO₂ cai, porque o tecido extrai mais para sustentar o consumo','O₂ER cai e SvO₂ sobe, porque o tecido extrai menos','ambas sobem de forma proporcional à queda da oferta, pois extração e saturação venosa caminham no mesmo sentido','ambas permanecem fixas, pois não dependem da oferta'], a:0,
    rationale:{ correct:'SvO₂ ≈ SaO₂·(1−O₂ER): oferta↓ → extração↑ → SvO₂↓. (Quando a extração falha, a SvO₂ sobe paradoxalmente.)', why:['correta: extração sobe, SvO₂ cai','é o oposto','não sobem as duas juntas','dependem da oferta'], trap:'SvO₂ alta ≠ boa extração', concept:'M8 · O₂ER/SvO₂' } },

  // ===================== E3 · Inversão & beira-leito (M9–M11) =====================
  { id:'m30_q018', format:'sba', quarter:1, difficulty:1, axis:'E3', modules:['M9'], concepts:['MAP','CO','SVR'], trap:'T02',
    stem:'Por que a PAM é um "número que engana"?',
    o:['porque pode estar normal com débito e perfusão ruins, já que PAM = DC × RVS','porque é sempre baixa em qualquer estado de choque','porque a pressão arterial média não guarda nenhuma relação direta com o débito cardíaco do paciente','porque depende apenas da volemia do paciente'], a:0,
    rationale:{ correct:'PAM = PVC + DC·RVS: a vasoconstrição (RVS↑) sustenta a PAM enquanto o débito e a perfusão caem.', why:['correta: PAM resulta de DC e RVS','no críptico a PAM é normal','a PAM depende do débito','não depende só da volemia'], trap:'PAM ≠ perfusão', concept:'M9 · PAM = DC × RVS' } },

  { id:'m30_q019', format:'est', quarter:2, difficulty:2, axis:'E3', modules:['M9'], concepts:['MAP','decomposicao'], trap:'T02',
    grounded:{ ref:'model9.pam', args:{co:4, rvs:1400, pvc:6}, kind:'number', optionValues:[76, 56, 96, 65], tol:3 },
    stem:'Débito 4 L/min, RVS 1400 dyn·s·cm⁻⁵, PVC 6 mmHg. A PAM (mmHg) é aproximadamente:',
    o:['76','56','96','65'], a:0,
    rationale:{ correct:'PAM = PVC + DC·RVS/80 = 6 + 4·1400/80 = 6 + 70 = 76 mmHg.', why:['correta: aplica a fórmula','esquece a PVC e subestima','superestima a resistência','confunde com um alvo de 65'], trap:'PAM ≠ perfusão', concept:'M9 · decomposição (computado)' } },

  { id:'m30_q020', format:'sba', quarter:2, difficulty:2, axis:'E3', modules:['M9'], concepts:['mesmaPAM'], trap:'T02',
    stem:'Dois pacientes têm a MESMA PAM de 70 mmHg. Por que isso não os iguala?',
    o:['porque um pode ter débito alto/RVS baixa e o outro débito baixo/RVS alta — mecânicas opostas','porque a PAM de 70 é sempre normal e nada muda entre eles','porque a PAM independe do débito cardíaco em ambos os casos','porque necessariamente têm o mesmo lactato e a mesma perfusão'], a:0,
    rationale:{ correct:'PAM = DC × RVS: o mesmo produto nasce de fatores opostos. Decompor antes de interpretar.', why:['correta: mesma PAM, mecânicas opostas','70 não é "sempre normal"','a PAM depende do débito','mesma PAM não iguala a perfusão'], trap:'PAM ≠ perfusão', concept:'M9 · a inversão' } },

  { id:'m30_q021', format:'est', quarter:3, difficulty:3, axis:'E3', modules:['M9'], concepts:['SVR','decomposicao'], trap:'T01',
    grounded:{ ref:'model9.rvsForPam', args:{pam:70, dc:8, pvc:5}, kind:'number', optionValues:[650, 1300, 200, 900], tol:30 },
    stem:'Para uma PAM de 70 com débito ALTO de 8 L/min (PVC 5), a RVS necessária (dyn·s·cm⁻⁵) é aproximadamente:',
    o:['650','1300','200','900'], a:0,
    rationale:{ correct:'RVS = 80·(PAM−PVC)/DC = 80·65/8 ≈ 650 — RVS baixa, típica de débito alto (distributivo).', why:['correta: ~650, RVS baixa','seria débito baixo, não alto','baixa demais (irreal)','superestima a resistência'], trap:'número ≠ mecanismo', concept:'M9 · RVS de uma PAM (computado)' } },

  { id:'m30_q022', format:'sba', quarter:3, difficulty:3, axis:'E3', modules:['M9','M12'], concepts:['PAM','perfusao'], trap:'T02',
    stem:'Subir a PAM com um vasoconstritor puro, num débito baixo, pode:',
    o:['elevar a PAM enquanto a entrega (DO₂) e a perfusão pioram, porque o fluxo não aumentou','garantir a perfusão tecidual por restaurar a pressão de perfusão','aumentar o débito cardíaco diretamente pela vasoconstrição','corrigir a anemia subjacente ao quadro, já que a vasoconstrição redistribui hemácias para a circulação central'], a:0,
    rationale:{ correct:'PAM ≠ perfusão: a DO₂ depende do fluxo (DC × CaO₂); mais RVS sobe o número e pode reduzir o fluxo.', why:['correta: pressão sem fluxo engana','PAM alta não garante perfusão','vasoconstrição não eleva o débito','não age sobre a Hb'], trap:'PAM ≠ perfusão', concept:'M9/M12 · pressão × fluxo' } },

  { id:'m30_q023', format:'sba', quarter:2, difficulty:2, axis:'E3', modules:['M10'], concepts:['monitorizacao','artefato'], trap:'T01',
    stem:'A postura correta diante de um número do monitor hemodinâmico é:',
    o:['tratá-lo como medida física com erro e fontes de artefato, não como verdade revelada','aceitá-lo sempre, pois o monitor não erra','ignorá-lo por completo e decidir apenas pela impressão clínica, já que todo monitor é intrinsecamente falho','assumir que o pior valor exibido é o verdadeiro'], a:0,
    rationale:{ correct:'O número tem transdutor, zero, posição, curva — fontes de erro. Perguntar de onde veio antes de agir.', why:['correta: medida física com erro','o monitor erra (zero/posição/curva)','o número informa, não se ignora','o pior valor não é "o verdadeiro"'], trap:'número ≠ mecanismo', concept:'M10 · monitorização' } },

  { id:'m30_q024', format:'sba', quarter:3, difficulty:3, axis:'E3', modules:['M11'], concepts:['POCUS','indicacao'], trap:'T10',
    stem:'O papel correto do POCUS na avaliação hemodinâmica é:',
    o:['responder a perguntas mecânicas específicas (VCI, função de VE/VD, B-lines), integrando ao raciocínio','dar o diagnóstico final isoladamente a partir de um único achado','substituir a decomposição fisiológica da PAM','definir conduta a partir de um achado fora de contexto'], a:0,
    rationale:{ correct:'POCUS responde perguntas mecânicas pontuais; o achado isolado vira conduta só se integrado ao quadro.', why:['correta: responde perguntas mecânicas','um achado não fecha diagnóstico sozinho','complementa, não substitui a decomposição','achado fora de contexto não define conduta'], trap:'procedimento ≠ indicação', concept:'M11 · POCUS' } },

  { id:'m30_q025', format:'sba', quarter:1, difficulty:1, axis:'E3', modules:['M9'], concepts:['perfil','RVS'], trap:'T07',
    stem:'No mapa débito × resistência, o perfil "frio" corresponde a:',
    o:['resistência vascular elevada (vasoconstrição) com débito baixo','resistência baixa com débito alto e extremidades aquecidas','pressão de pulso aumentada por volume sistólico alto','saturação venosa central elevada por extração tecidual eficiente e fluxo periférico bem preservado'], a:0,
    rationale:{ correct:'Frio = vasoconstrito (RVS alta) defendendo a PAM apesar do débito baixo; quente = vasodilatado (RVS baixa).', why:['correta: RVS alta, débito baixo','isso é "quente"','pressão de pulso não define "frio"','SvO₂ alta não é o perfil frio'], trap:'hipotensão ≠ hipovolemia', concept:'M9 · perfis hemodinâmicos' } },

  // ===================== mais E2/E3 para densidade =====================
  { id:'m30_q026', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M8','M12'], concepts:['extracao','O2ER'], trap:'T06',
    stem:'Uma ScvO₂ alta com lactato elevado, na sepse, sugere sobretudo:',
    o:['falha de extração/utilização (microcirculação/mitocôndria): o O₂ chega mas não é usado','oferta excessiva com tecido plenamente satisfeito e sem déficit','anemia grave isolada reduzindo o retorno venoso','erro de medida laboratorial que invalida tanto a ScvO₂ quanto o lactato obtidos naquela amostra de sangue'], a:0,
    rationale:{ correct:'Extração falha → o sangue retorna "cheio" (SvO₂ alta) enquanto o tecido segue faminto (lactato alto).', why:['correta: extração/utilização quebradas','satisfação não cursa com lactato alto','anemia não explica SvO₂ alta','não é erro obrigatório'], trap:'SvO₂ alta ≠ boa extração', concept:'M12 · microcirculação' } },

  { id:'m30_q027', format:'sba', quarter:3, difficulty:3, axis:'E2', modules:['M8'], concepts:['supply'], trap:'T13',
    stem:'Por que aumentar a DO₂ acima do normal NÃO eleva indefinidamente o VO₂?',
    o:['porque, acima do limiar, o consumo é ditado pela demanda metabólica, não pela oferta','porque a extração tecidual cresce sem qualquer limite','porque o lactato passa a bloquear o consumo celular','porque a saturação venosa cai progressivamente a zero quando a oferta de O₂ é elevada acima do normal'], a:0,
    rationale:{ correct:'Supply-independence: passado o DO₂crit, ofertar mais O₂ não cria consumo — a demanda manda.', why:['correta: demanda limita o consumo','a extração tem teto','lactato não bloqueia o consumo assim','SvO₂ sobe, não zera, com oferta alta'], trap:'supply-independent × dependent', concept:'M8 · supply-independence' } },

  { id:'m30_q028', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M5','M25'], concepts:['volume','janela'], trap:'T04',
    stem:'A reposição volêmica perde benefício e ganha custo quando:',
    o:['o paciente deixa de ser responsivo: mais pré-carga não gera débito, só congestão','a pré-carga ainda está na porção ascendente da curva de Starling','cada nova alíquota de volume ainda aumenta o volume sistólico e, com ele, o débito cardíaco do paciente','nunca, pois volume sempre melhora a hemodinâmica'], a:0,
    rationale:{ correct:'No platô de Starling, volume vira congestão sem ganho de débito — volume é droga com janela.', why:['correta: fora da responsividade, vira custo','na ascendente ainda há ganho','se ainda ganha VS, ainda responde','volume tem janela, não é sempre bom'], trap:'responsivo ≠ tolerante', concept:'M25 · volume como droga' } },

  { id:'m30_q029', format:'ar', quarter:3, difficulty:3, axis:'E3', modules:['M9','M26'], concepts:['cryptic'], trap:'T02',
    stem:'ASSERÇÃO: uma PAM normal não exclui choque. PORQUE: a vasoconstrição compensatória sustenta a pressão enquanto a perfusão e o débito caem.',
    o:['as duas são verdadeiras e a segunda justifica a primeira','as duas são verdadeiras, mas sem nexo causal entre elas','a primeira é verdadeira e a segunda é falsa','a primeira é falsa e a segunda é verdadeira'], a:0,
    rationale:{ correct:'V/V com nexo: a compensação (RVS↑) mantém a PAM e mascara a hipoperfusão (choque críptico).', why:['correta: V/V com causa','há nexo causal direto','a segunda é verdadeira','a primeira é verdadeira'], trap:'PAM ≠ perfusão', concept:'M9/M26 · críptico' } },

  { id:'m30_q030', format:'sba', quarter:4, difficulty:4, axis:'E3', modules:['M9','M20'], concepts:['inversao','distributivo'], trap:'T05',
    stem:'Numa PAM de 65 com débito ALTO e extremidades quentes, a leitura mais coerente é:',
    o:['distributivo (RVS baixa): o termo quebrado é a resistência, não a bomba','cardiogênico: o débito alto indica esforço compensatório da bomba falha','hipovolemia pura: toda hipotensão decorre de baixa pré-carga','obstrutivo: a PAM baixa exige sempre barreira mecânica ao fluxo'], a:0,
    rationale:{ correct:'Débito alto + quente + PAM baixa = vasoplegia (RVS↓). O termo quebrado é a RVS.', why:['correta: distributivo/RVS baixa','débito alto não é cardiogênico','nem toda hipotensão é hipovolemia','não há sinais de obstrução aqui'], trap:'distributivo ≠ séptico', concept:'M9/M20 · inversão' } },

  { id:'m30_q031', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M3'], concepts:['DC','fluxo'], trap:'T01',
    stem:'O débito cardíaco é mais bem entendido como:',
    o:['fluxo (volume de sangue por minuto), produto de frequência e volume sistólico','a pressão gerada pelo ventrículo a cada batimento','a frequência cardíaca isolada do paciente, tomada como sinônimo direto do fluxo sanguíneo por minuto','a resistência vascular sistêmica contra a qual o ventrículo precisa ejetar o sangue a cada sístole cardíaca'], a:0,
    rationale:{ correct:'DC é fluxo: FC × VS. Não é pressão, não é só FC, não é resistência.', why:['correta: fluxo = FC × VS','débito é fluxo, não pressão','FC isolada não é o débito','isso é a pós-carga/RVS'], trap:'número ≠ mecanismo', concept:'M3 · débito como fluxo' } },

  { id:'m30_q032', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M4','M5'], concepts:['retornoVenoso'], trap:'T04',
    stem:'O retorno venoso, no modelo de Guyton, é determinante do débito porque:',
    o:['o coração só pode ejetar o sangue que lhe retorna; o retorno limita o débito sustentável','o coração gera débito independentemente do volume que recebe','o retorno venoso depende apenas da contratilidade ventricular','a função cardíaca isolada, sem o retorno venoso, é o que define sozinha o ponto de operação hemodinâmico'], a:0,
    rationale:{ correct:'O ponto de operação é a interseção retorno×função: o retorno limita o que a bomba pode ejetar.', why:['correta: ejeta-se o que retorna','o coração não cria sangue do nada','o retorno depende de volume/capacitância','é interseção, não só função'], trap:'responsivo ≠ tolerante', concept:'M4/M5 · Guyton' } },

  { id:'m30_q033', format:'trap', quarter:3, difficulty:3, axis:'E3', modules:['M9'], concepts:['PAM'], trap:'T02',
    stem:'Qual frase comete a armadilha "PAM = perfusão"?',
    o:['"a PAM voltou a 70, portanto a perfusão tecidual está garantida"','"a PAM subiu com vasoconstritor, mas o lactato segue alto — falta fluxo"','"PAM = DC × RVS; pressão normal pode esconder débito baixo"','"perfusão depende do fluxo (DO₂), não só do número de pressão"'], a:0,
    rationale:{ correct:'Igualar PAM a perfusão ignora que pressão sem fluxo não entrega O₂.', why:['correta: a armadilha','essa frase reconhece o engano','correta fisiologicamente','correta: fluxo, não pressão'], trap:'PAM ≠ perfusão', concept:'M9 · meta-armadilha' } },

  { id:'m30_q034', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M7'], concepts:['alcaPV','Ea/Ees'], trap:'T09',
    stem:'O acoplamento ventrículo-arterial (Ea/Ees) descreve:',
    o:['a relação entre a carga arterial e a contratilidade, que governa a eficiência da ejeção','apenas a pressão arterial sistólica medida no membro','a frequência cardíaca dividida pelo volume sistólico','a resistência vascular pulmonar isolada, medida no leito arterial do pulmão, sem relação com a contratilidade'], a:0,
    rationale:{ correct:'Ea (carga arterial) e Ees (contratilidade) acoplados definem trabalho e eficiência — não é só a PA.', why:['correta: carga × contratilidade','não é a PA sistólica','não é FC/VS','não é a RVP'], trap:'pós-carga ≠ PA', concept:'M7 · acoplamento VA' } },

  { id:'m30_q035', format:'sba', quarter:1, difficulty:1, axis:'E1', modules:['M2'], concepts:['curva','offloading'], trap:'T13',
    stem:'A mesma SaO₂ pode entregar quantidades diferentes de O₂ ao tecido porque:',
    o:['a posição da curva (P50) muda quanto a Hb solta no tecido, para a mesma saturação','a SaO₂ determina sozinha e por completo a entrega tecidual','o O₂ fisicamente dissolvido no plasma domina a entrega ao tecido, mais até que a fração ligada à hemoglobina','a curva só descreve a captação pulmonar, não a entrega'], a:0,
    rationale:{ correct:'Desvios da curva (acidose, CO₂, temperatura, 2,3-DPG) mudam o offloading para a mesma SaO₂.', why:['correta: a posição da curva manda no offloading','a SaO₂ não determina tudo sozinha','o dissolvido é mínimo','a curva também é entrega'], trap:'supply/entrega', concept:'M2 · offloading' } },

  { id:'m30_q036', format:'sba', quarter:4, difficulty:4, axis:'E2', modules:['M8','M13'], concepts:['lactato','tipoB'], trap:'T12',
    stem:'Um lactato elevado com perfusão aparentemente adequada pode refletir:',
    o:['produção tipo B (metabólica/adrenérgica) ou depuração reduzida, não apenas hipóxia tipo A','sempre e exclusivamente hipóxia tecidual por baixa oferta','um valor que pode ser ignorado se a PAM estiver normal','erro analítico na quase totalidade dos casos'], a:0,
    rationale:{ correct:'Lactato é balanço de produção (A e B) e depuração; tipo B (β/metabólico) e fígado entram na conta.', why:['correta: tipo A × B + clearance','não é só hipóxia','não se ignora pela PAM','não é erro na maioria'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M13 · lactato & depuração' } },

  { id:'m30_q037', format:'sba', quarter:3, difficulty:3, axis:'E3', modules:['M10','M9'], concepts:['curvaArterial'], trap:'T01',
    stem:'A curva de pressão arterial invasiva informa, além da PAM:',
    o:['pistas de débito e responsividade (variação respiratória, inclinação), sujeitas a artefato de transdução','apenas um número isolado, sem qualquer informação dinâmica','a saturação venosa central de forma direta','a hemoglobina e o conteúdo arterial de O₂'], a:0,
    rationale:{ correct:'A morfologia e a variação respiratória da curva dão pistas dinâmicas — com erro de zero/posição/transdutor.', why:['correta: informação dinâmica com artefato','não é só um número','não dá SvO₂','não dá Hb/CaO₂'], trap:'número ≠ mecanismo', concept:'M10 · curva arterial' } },

  { id:'m30_q038', format:'sba', quarter:2, difficulty:2, axis:'E3', modules:['M9'], concepts:['RVS','derivada'], trap:'T01',
    stem:'A RVS calculada é uma variável DERIVADA, o que significa que:',
    o:['ela herda os erros de PAM, PVC e débito usados no cálculo, não é medida diretamente','é medida diretamente por um sensor arterial dedicado','independe por completo do débito cardíaco usado no cálculo, sendo uma propriedade fixa do tônus vascular','é mais confiável que as variáveis que a compõem'], a:0,
    rationale:{ correct:'RVS = 80·(PAM−PVC)/DC: é calculada; erros de PAM/PVC/DC se propagam para ela.', why:['correta: derivada, herda erros','não há sensor direto de RVS','depende do débito no denominador','não é mais confiável que suas partes'], trap:'número ≠ mecanismo', concept:'M9 · RVS derivada' } },

  { id:'m30_q039', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M6'], concepts:['contratilidade'], trap:'T01',
    stem:'Contratilidade (inotropismo) refere-se a:',
    o:['a força intrínseca de contração, independente de pré- e pós-carga','a frequência com que o coração bate por minuto','o volume de sangue que retorna ao coração','a resistência vascular contra a qual o ventrículo ejeta'], a:0,
    rationale:{ correct:'Contratilidade é a propriedade intrínseca de força (Ees), separada das condições de carga.', why:['correta: força intrínseca','isso é a frequência','isso é a pré-carga','isso é a pós-carga'], trap:'número ≠ mecanismo', concept:'M6 · contratilidade' } },

  { id:'m30_q040', format:'sba', quarter:4, difficulty:4, axis:'E3', modules:['M9','M27'], concepts:['perfil','fluxoCongestao'], trap:'T07',
    stem:'No 2×2 perfusão (fluxo) × congestão, o canto "frio e seco" sugere mecanicamente:',
    o:['baixo fluxo sem congestão — pré-carga insuficiente ou bomba sem volume para ejetar','vasoplegia com débito alto e extremidades quentes','congestão pulmonar com boa perfusão periférica','resistência vascular baixa acompanhada de pressão de pulso ampla e de extremidades muito bem perfundidas'], a:0,
    rationale:{ correct:'Frio (baixo fluxo) + seco (sem congestão) aponta para pré-carga/volume insuficiente, não congestão.', why:['correta: baixo fluxo sem congestão','isso é quente, distributivo','seco é ausência de congestão','isso descreve vasodilatação'], trap:'hipotensão ≠ hipovolemia', concept:'M27 · 4 perfis' } },

  { id:'m30_q041', format:'sba', quarter:2, difficulty:2, axis:'E2', modules:['M8'], concepts:['DO2','determinantes'], trap:'T03',
    stem:'A DO₂ pode cair por duas "portas" independentes:',
    o:['queda do débito (bomba/ritmo/volume) OU queda do conteúdo (anemia/hipoxemia)','apenas por queda da pressão arterial média','exclusivamente por aumento da resistência vascular','somente por elevação do lactato sérico, que por si reduz diretamente a entrega de oxigênio aos tecidos'], a:0,
    rationale:{ correct:'DO₂ = DC × CaO₂: cai por fluxo (débito) ou por conteúdo (CaO₂). Duas portas para o mesmo déficit.', why:['correta: débito OU conteúdo','a PAM não é fator direto da DO₂','RVS não entra na DO₂','lactato é consequência, não causa'], trap:'conteúdo ≠ saturação', concept:'M8 · determinantes da DO₂' } },

  { id:'m30_q042', format:'sba', quarter:3, difficulty:3, axis:'E2', modules:['M5','M11'], concepts:['responsividade','VCI'], trap:'T04',
    stem:'Índices dinâmicos (variação de pressão de pulso, VCI, elevação de pernas) predizem melhor que a PVC porque:',
    o:['avaliam a resposta do débito a uma mudança de pré-carga, não um valor estático','medem diretamente o volume diastólico final do ventrículo','substituem por completo a curva de Frank-Starling do paciente, tornando-a desnecessária à beira do leito','garantem tolerância a volume além da responsividade'], a:0,
    rationale:{ correct:'Dinâmicos testam onde o paciente está na curva (responde ou não); a PVC estática prediz mal.', why:['correta: testam a resposta, não um valor fixo','não medem volume diastólico direto','não substituem Starling, a exploram','responsividade ≠ tolerância'], trap:'responsivo ≠ tolerante', concept:'M5/M11 · responsividade' } },

  { id:'m30_q043', format:'sba', quarter:1, difficulty:1, axis:'E3', modules:['M9'], concepts:['equacao'], trap:'T01',
    stem:'Na decomposição PAM = PVC + DC·RVS, qual leitura é correta?',
    o:['a PAM é resultado de fluxo (DC) e tônus (RVS); decompor revela o mecanismo','a PAM é uma grandeza primária da qual derivam o DC e a RVS','o débito cardíaco não participa diretamente da geração da pressão arterial média do paciente em choque','a RVS é irrelevante quando a PAM está normal'], a:0,
    rationale:{ correct:'A PAM é número-resultante; DC e RVS são os termos causais. Decompor mostra qual quebrou.', why:['correta: PAM resulta de DC e RVS','a PAM é resultante, não primária','o DC participa diretamente','a RVS importa mesmo com PAM normal'], trap:'número ≠ mecanismo', concept:'M9 · a equação' } },

  { id:'m30_q044', format:'sba', quarter:2, difficulty:2, axis:'E1', modules:['M1'], concepts:['CaO2','dissolvido'], trap:'T03',
    stem:'No CaO₂, o termo do O₂ dissolvido (0,003·PaO₂) é:',
    o:['quase desprezível em condições usuais, frente ao O₂ ligado à hemoglobina','o principal responsável pelo conteúdo arterial de O₂','maior que o O₂ ligado quando a SaO₂ é alta','irrelevante apenas em pacientes anêmicos, nos quais a hemoglobina baixa deixa o dissolvido predominar'], a:0,
    rationale:{ correct:'O ligado (1,34·Hb·SaO₂) domina; o dissolvido só pesa em hiperóxia extrema (câmara hiperbárica).', why:['correta: dissolvido é mínimo','o ligado é o principal','o ligado é muito maior','é pequeno em geral, não só na anemia'], trap:'conteúdo ≠ saturação', concept:'M1 · O₂ dissolvido' } },

  { id:'m30_q045', format:'sba', quarter:4, difficulty:4, axis:'E3', modules:['M9','M12','M13'], concepts:['integracao'], trap:'T14',
    stem:'Um vasopressor melhora a macro-hemodinâmica (PAM, DC), mas o lactato não cai. A leitura integrada é:',
    o:['a macro pode melhorar sem corrigir a microcirculação/extração — perfusão tecidual não é só pressão','o lactato persistente prova falha do vasopressor em elevar a PAM','a PAM adequada garante, por definição, a perfusão microcirculatória','o lactato alto é necessariamente erro laboratorial nesse cenário'], a:0,
    rationale:{ correct:'Macro e micro podem dissociar: pressão/fluxo sistêmicos ok, mas extração/micro quebradas mantêm o déficit.', why:['correta: macro ≠ micro','a PAM até melhorou, não falhou','PAM boa não garante micro','não é erro obrigatório'], trap:'pressor melhora macro ≠ micro', concept:'M12/M13 · macro × micro' } },

  { id:'m30_q046', format:'sba', quarter:3, difficulty:3, axis:'E2', modules:['M8'], concepts:['O2ER','reserva'], trap:'T13',
    stem:'A "reserva de extração" se esgota quando:',
    o:['a O₂ER se aproxima do seu máximo e novas quedas de oferta passam a reduzir o consumo','a oferta de O₂ está muito acima da demanda metabólica','a SvO₂ está elevada por boa perfusão','o lactato sérico está normal e estável, sinalizando que a reserva de extração permanece totalmente intacta'], a:0,
    rationale:{ correct:'Há um teto de extração; atingido ele, a queda de oferta vira queda de consumo (supply-dependence).', why:['correta: teto de extração','oferta alta não esgota a reserva','SvO₂ alta é o oposto do esgotamento','lactato normal não indica esgotamento'], trap:'supply-independent × dependent', concept:'M8 · reserva de extração' } },

  { id:'m30_q047', format:'sba', quarter:2, difficulty:2, axis:'E3', modules:['M11'], concepts:['VCI','volemia'], trap:'T07',
    stem:'Uma VCI pequena e colapsável, isoladamente, deve ser interpretada como:',
    o:['uma pista de possível responsividade a volume, a integrar ao contexto — não um diagnóstico de hipovolemia','prova definitiva de choque hipovolêmico','indicação automática de grande reposição volêmica','irrelevante para a avaliação hemodinâmica'], a:0,
    rationale:{ correct:'VCI é pista mecânica; achado isolado não fecha hipovolemia nem indica conduta fora do contexto.', why:['correta: pista a integrar','um achado não prova a categoria','não indica conduta automática','é relevante, mas não isolada'], trap:'hipotensão ≠ hipovolemia', concept:'M11 · VCI' } },

  { id:'m30_q048', format:'sba', quarter:1, difficulty:1, axis:'E2', modules:['M8'], concepts:['Fick'], trap:'T01',
    stem:'O princípio de Fick (VO₂ = DC × (CaO₂ − CvO₂) × 10) mostra que o consumo de O₂ depende de:',
    o:['fluxo (débito) e da diferença arteriovenosa de conteúdo extraída pelo tecido','apenas da pressão arterial média do paciente','somente da frequência cardíaca','exclusivamente da saturação venosa central isolada, tomada como o único determinante do consumo de O₂'], a:0,
    rationale:{ correct:'Fick liga consumo a fluxo × extração (diferença a-v de conteúdo); não é PAM, FC isolada nem SvO₂ só.', why:['correta: fluxo × extração','a PAM não está em Fick','FC isolada não basta','SvO₂ é parte, não o todo'], trap:'número ≠ mecanismo', concept:'M8 · princípio de Fick' } },

  { id:'m30_q049', format:'ar', quarter:3, difficulty:3, axis:'E2', modules:['M7','M16'], concepts:['posCarga','cardiogenico'], trap:'T09',
    stem:'ASSERÇÃO: reduzir a pós-carga pode aumentar o débito de um ventrículo falho. PORQUE: a bomba fraca é sensível à carga contra a ejeção.',
    o:['as duas são verdadeiras e a segunda justifica a primeira','as duas são verdadeiras, mas sem relação causal','a primeira é verdadeira e a segunda é falsa','a primeira é falsa e a segunda é verdadeira'], a:0,
    rationale:{ correct:'V/V com nexo: o ventrículo afterload-sensível ganha VS quando a carga contra a ejeção diminui.', why:['correta: V/V com causa','o nexo existe','a segunda é verdadeira','a primeira é verdadeira'], trap:'pós-carga ≠ PA', concept:'M7/M16 · pós-carga' } },

  { id:'m30_q050', format:'sba', quarter:4, difficulty:4, axis:'E3', modules:['M9','M10','M12'], concepts:['sintese','leitura'], trap:'T02',
    stem:'A leitura beira-leito mais robusta de um choque combina:',
    o:['decompor a PAM (DC × RVS), checar marcadores de perfusão (lactato, ScvO₂) e questionar a origem de cada número','confiar no valor de PAM exibido, que resume todo o estado hemodinâmico','escolher a variável isolada mais alarmante e agir sobre ela','adiar qualquer interpretação até obter um cateter de artéria pulmonar'], a:0,
    rationale:{ correct:'Decompor + marcadores de perfusão + ceticismo com o número: é assim que a beira-leito vira mecanismo, não palpite.', why:['correta: decomposição + perfusão + ceticismo','a PAM não resume o estado','uma variável isolada engana','não se adia a leitura por um cateter'], trap:'PAM ≠ perfusão', concept:'M9/M10/M12 · síntese de leitura' } }
];

// ---- distribuição do gabarito: rotação semeada determinística ----
// Os itens foram autorados com a correta em posição variável; buildBank() rotaciona
// cada item para uma letra-alvo (TG), mantendo ALINHADOS o.[], optionValues (grounded),
// e rationale.why[]. Assim o gabarito fica assimétrico (15–35% por letra) sem padrão.
function _lcg(seed){ var s=(seed>>>0)||1; return function(){ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; }; }
function _targets(n, seed){
  // multiset assimétrico: A≈20% B≈30% C≈26% D≈24% (escala com n)
  var counts=[Math.round(n*0.20), Math.round(n*0.30), Math.round(n*0.26), n], i;
  counts[3]=n-counts[0]-counts[1]-counts[2];
  var ms=[]; for(i=0;i<4;i++){ for(var k=0;k<counts[i];k++) ms.push(i); }
  var r=_lcg(seed); for(i=ms.length-1;i>0;i--){ var j=Math.floor(r()*(i+1)); var t=ms[i]; ms[i]=ms[j]; ms[j]=t; }
  return ms;
}
var TG=_targets(BANK.length, 1);   // seed fixa → reprodutível e auditável (maxRun ≤ 3)
function _rotate(item, tg){
  var sh=((tg-item.a)%4+4)%4; if(sh===0) return item;
  var o=item.o.slice(), why=item.rationale.why.slice(), ov=item.grounded?item.grounded.optionValues.slice():null;
  for(var s=0;s<sh;s++){ o.unshift(o.pop()); why.unshift(why.pop()); if(ov) ov.unshift(ov.pop()); }
  var ni={ id:item.id, format:item.format, quarter:item.quarter, difficulty:item.difficulty, axis:item.axis,
    modules:item.modules, concepts:item.concepts, trap:item.trap, stem:item.stem, o:o, a:tg,
    rationale:{ correct:item.rationale.correct, why:why, trap:item.rationale.trap, concept:item.rationale.concept },
    grounded: item.grounded ? { ref:item.grounded.ref, args:item.grounded.args, kind:item.grounded.kind, optionValues:ov, tol:item.grounded.tol } : null };
  return ni;
}
function buildBank(){ return BANK.map(function(it,i){ return _rotate(it, TG[i%TG.length]); }); }

if(typeof module!=='undefined' && module.exports){ module.exports={ BANK:BANK, buildBank:buildBank, TG:TG, _targets:_targets }; }
