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
    rationale:{ correct:'Decompor + marcadores de perfusão + ceticismo com o número: é assim que a beira-leito vira mecanismo, não palpite.', why:['correta: decomposição + perfusão + ceticismo','a PAM não resume o estado','uma variável isolada engana','não se adia a leitura por um cateter'], trap:'PAM ≠ perfusão', concept:'M9/M10/M12 · síntese de leitura' } },

  // ===================== PARTE 2 · itens 51–100 (E4 micro/lactato · E5 categorias) =====================
  // ---- E4 · Microcirculação & lactato (M12–M13) ----
  { id:'m30_q051', format:'sba', quarter:2, difficulty:2, axis:'E4', modules:['M12'], concepts:['microcirculacao','macro'], trap:'T14',
    stem:'Por que uma macro-hemodinâmica normalizada pode coexistir com tecido faminto?',
    o:['porque a microcirculação (shunt, heterogeneidade, glicocálice) pode falhar mesmo com pressão e fluxo sistêmicos adequados','porque a PAM normal garante, por definição, a perfusão de cada capilar do organismo','porque o débito cardíaco normal distribui o fluxo de modo perfeitamente homogêneo a todos os leitos','porque a saturação venosa central reflete sempre e exatamente a extração de cada tecido isolado'], a:0,
    rationale:{ correct:'Macro e micro dissociam: shunt e heterogeneidade capilar mantêm o déficit apesar da pressão/fluxo sistêmicos.', why:['correta: a micro pode falhar isolada','PAM não garante o capilar','o fluxo não é homogêneo','ScvO₂ é média, não local'], trap:'pressor melhora macro ≠ micro', concept:'M12 · microcirculação' } },

  { id:'m30_q052', format:'sba', quarter:2, difficulty:2, axis:'E4', modules:['M13'], concepts:['lactato','tipoA','tipoB'], trap:'T12',
    stem:'Um lactato elevado deve ser lido como:',
    o:['balanço entre produção (hipóxia tipo A e estímulo metabólico tipo B) e depuração (fígado/rim), não um sinônimo simples de hipóxia','prova inequívoca e isolada de hipoperfusão tecidual grave em todos os contextos clínicos possíveis','consequência exclusiva de baixa saturação periférica de oxigênio detectada no oxímetro de pulso','um marcador sem qualquer valor prognóstico ou de acompanhamento na evolução do choque'], a:0,
    rationale:{ correct:'Lactato é produção (A e B) menos depuração; tipo B (β/metabólico) e clearance hepático entram na conta.', why:['correta: balanço produção × depuração','não é só hipóxia','não depende da SpO₂','tem valor prognóstico'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M13 · lactato & depuração' } },

  { id:'m30_q053', format:'est', quarter:2, difficulty:2, axis:'E4', modules:['M1','M8'], concepts:['DO2','anemia'], trap:'T03',
    grounded:{ ref:'model29.cascade.do2', args:{state:{hb:6, sao2:0.92, hr:110}}, kind:'number', optionValues:[562, 1000, 300, 780], tol:40 },
    stem:'Numa anemia (Hb 6) com SaO₂ 92% e FC 110, a entrega de O₂ (DO₂) computada fica em torno de (mL/min):',
    o:['562','1000','300','780'], a:0,
    rationale:{ correct:'CaO₂ cai com a Hb 6; mesmo com débito compensatório, a DO₂ fica ~560, bem abaixo do normal.', why:['correta: ~560, reduzida pela anemia','seria o normal, não anemia','baixa demais para esse débito','superestima o conteúdo'], trap:'conteúdo ≠ saturação', concept:'M8 · DO₂ na anemia (computado)' } },

  { id:'m30_q054', format:'vf', quarter:3, difficulty:3, axis:'E4', modules:['M12','M8'], concepts:['SvO2','extracao'], trap:'T06',
    stem:'Sobre extração e saturação venosa, qual assertiva é VERDADEIRA?',
    o:['uma SvO₂ alta com lactato alto sugere falha de extração/utilização, não tecido satisfeito','uma SvO₂ alta sempre indica boa extração e perfusão tecidual plenamente adequada em qualquer cenário','a extração de O₂ pelos tecidos não tem qualquer relação com o valor da saturação venosa medida','a SvO₂ depende apenas da hemoglobina, sendo independente da oferta e do consumo de oxigênio'], a:0,
    rationale:{ correct:'SvO₂ alta + lactato alto = O₂ chega e não é usado (micro/mito), não satisfação.', why:['correta: falha de extração','SvO₂ alta pode ser falha de extração','SvO₂ ≈ SaO₂·(1−O₂ER): há relação','depende de oferta e consumo'], trap:'SvO₂ alta ≠ boa extração', concept:'M12 · extração' } },

  { id:'m30_q055', format:'sba', quarter:3, difficulty:3, axis:'E4', modules:['M13'], concepts:['clearance','depuracao'], trap:'T12',
    stem:'Por que a depuração (clearance) do lactato importa tanto quanto o valor absoluto?',
    o:['porque a tendência de queda reflete restauração da perfusão e da função hepática, informando mais que um ponto isolado','porque o valor absoluto inicial é o único determinante prognóstico relevante, devendo guiar sozinho toda a conduta subsequente do paciente grave','porque a depuração depende exclusivamente da função renal e não tem relação com a perfusão sistêmica','porque um lactato que não cai indica sempre erro de coleta laboratorial e deve ser desconsiderado'], a:0,
    rationale:{ correct:'A trajetória (clearance) reflete perfusão e fígado se recuperando — informa mais que um valor único.', why:['correta: a tendência manda','o ponto isolado não basta','não é só rim','não é erro de coleta'], trap:'número ≠ mecanismo', concept:'M13 · clearance' } },

  { id:'m30_q056', format:'sba', quarter:4, difficulty:4, axis:'E4', modules:['M12','M13','M21'], concepts:['mito','desacoplamento'], trap:'T13',
    stem:'Na sepse, a "falência citopática" descreve:',
    o:['incapacidade da mitocôndria de utilizar o O₂ entregue, gerando déficit mesmo com oferta e extração macroscópicas preservadas','um defeito puramente macro-hemodinâmico de débito cardíaco que responde prontamente à reposição volêmica','um excesso de oferta de O₂ que satura por completo a cadeia respiratória e cessa a produção de lactato','uma anemia funcional por sequestro de hemoglobina que reduz o conteúdo arterial de oxigênio'], a:0,
    rationale:{ correct:'A mitocôndria não usa o O₂ entregue (disóxia citopática): déficit apesar de macro/extração ok.', why:['correta: mitocôndria não usa o O₂','não é só macro','não é excesso de oferta','não é anemia'], trap:'supply-independent × dependent', concept:'M12/M21 · mitocôndria' } },

  { id:'m30_q057', format:'trap', quarter:3, difficulty:3, axis:'E4', modules:['M13'], concepts:['lactato'], trap:'T12',
    stem:'Qual frase comete a armadilha "lactato alto = sempre hipóxia"?',
    o:['"o lactato subiu, logo há necessariamente hipoperfusão e baixa oferta de O₂ ao tecido"','"a adrenalina pode elevar o lactato por estímulo β, sem que haja déficit de oferta (tipo B)"','"o lactato é um balanço de produção e depuração, e o fígado participa do clearance"','"a tendência do lactato informa mais que um valor isolado na evolução do choque"'], a:0,
    rationale:{ correct:'Igualar lactato a hipóxia ignora o tipo B (metabólico/β) e a depuração.', why:['correta: a armadilha','reconhece o tipo B','correto: balanço','correto: tendência'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M13 · meta-armadilha' } },

  { id:'m30_q058', format:'sba', quarter:2, difficulty:2, axis:'E4', modules:['M12'], concepts:['glicocalice'], trap:'T14',
    stem:'O glicocálice endotelial, quando lesado (sepse, ressuscitação agressiva), contribui para:',
    o:['extravasamento capilar e heterogeneidade de fluxo, agravando o déficit de extração tecidual','aumento da contratilidade miocárdica e elevação direta do débito cardíaco sistêmico','vasoconstrição arteriolar seletiva que melhora a pressão de perfusão e desvia o fluxo sanguíneo para os tecidos isquêmicos dos órgãos nobres','elevação do conteúdo arterial de O₂ por captação pulmonar mais eficiente do oxigênio'], a:0,
    rationale:{ correct:'A lesão do glicocálice aumenta leak e heterogeneidade microvascular — piora a extração.', why:['correta: leak + heterogeneidade','não age na contratilidade','não é vasoconstrição benéfica','não muda o conteúdo'], trap:'pressor melhora macro ≠ micro', concept:'M12 · glicocálice' } },

  { id:'m30_q059', format:'ar', quarter:3, difficulty:3, axis:'E4', modules:['M12','M9'], concepts:['macro','micro'], trap:'T14',
    stem:'ASSERÇÃO: corrigir a PAM não garante corrigir a perfusão tecidual. PORQUE: a microcirculação pode permanecer disfuncional apesar da macro-hemodinâmica restaurada.',
    o:['as duas são verdadeiras e a segunda justifica a primeira','as duas são verdadeiras, mas não há relação causal direta entre elas neste caso','a primeira é verdadeira e a segunda é falsa','a primeira é falsa e a segunda é verdadeira'], a:0,
    rationale:{ correct:'V/V com nexo: a disfunção micro persistente explica por que a PAM corrigida não basta.', why:['correta: V/V com causa','há nexo causal','a segunda é verdadeira','a primeira é verdadeira'], trap:'pressor melhora macro ≠ micro', concept:'M12 · macro × micro' } },

  { id:'m30_q060', format:'sba', quarter:1, difficulty:1, axis:'E4', modules:['M13'], concepts:['lactato','depuracao'], trap:'T12',
    stem:'Um lactato normal sempre significa ausência de hipoperfusão?',
    o:['não: depuração eficiente ou hipoperfusão regional localizada podem mascarar o déficit no valor sistêmico','sim: lactato normal é prova definitiva e suficiente de perfusão tecidual global adequada','sim: a produção de lactato cessa por completo assim que a oferta de O₂ se torna adequada','não: porque o lactato normal indica sempre falência hepática compensatória subjacente'], a:0,
    rationale:{ correct:'Lactato normal não exclui hipoperfusão: clearance bom ou déficit regional podem mascarar.', why:['correta: pode mascarar','não é prova suficiente','a produção não cessa abruptamente','não indica falência hepática'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M13 · interpretação' } },

  { id:'m30_q061', format:'vignette', quarter:3, difficulty:3, axis:'E4', modules:['M8','M12','M13'], concepts:['supply','lactato'], trap:'T13',
    stem:'Passo 1: paciente com DO₂ caindo e lactato subindo. Passo 2: eleva-se a DO₂ acima do normal e o lactato se estabiliza, mas não zera. A leitura mais coerente é:',
    o:['havia componente supply-dependent (corrigido pela oferta) somado a produção tipo B/depuração, que mantém algum lactato residual','a oferta de O₂ não tinha qualquer relação com o lactato, que subiu apenas por erro analítico de laboratório','o lactato residual prova que a entrega de O₂ permanece criticamente baixa apesar da intervenção realizada','elevar a DO₂ acima do normal deveria zerar o lactato, e a falha indica hipóxia tecidual progressiva'], a:0,
    rationale:{ correct:'A resposta à oferta revela o componente supply-dependent; o resíduo reflete tipo B/clearance, não déficit de oferta.', why:['correta: supply-dependent + tipo B','não foi erro analítico','a DO₂ está alta, não baixa','acima do limiar, mais O₂ não zera o lactato'], trap:'supply-independent × dependent', concept:'M8/M13 · vinheta' } },

  { id:'m30_q062', format:'sba', quarter:2, difficulty:2, axis:'E4', modules:['M12'], concepts:['heterogeneidade'], trap:'T14',
    stem:'A heterogeneidade do fluxo microvascular na sepse significa que:',
    o:['capilares vizinhos podem ter fluxos muito distintos, com áreas hipoperfundidas mesmo quando o fluxo global está normal','todos os capilares recebem exatamente o mesmo fluxo quando o débito cardíaco está adequado','o fluxo microvascular é sempre proporcional e idêntico à pressão arterial média medida','a microcirculação deixa de existir funcionalmente assim que a PAM ultrapassa 65 mmHg'], a:0,
    rationale:{ correct:'Fluxo heterogêneo: áreas de shunt e áreas isquêmicas coexistem apesar do fluxo global normal.', why:['correta: fluxos distintos lado a lado','não é homogêneo','não é proporcional à PAM','a micro não "desaparece"'], trap:'pressor melhora macro ≠ micro', concept:'M12 · heterogeneidade' } },

  { id:'m30_q063', format:'sba', quarter:1, difficulty:1, axis:'E4', modules:['M13'], concepts:['lactato','tipoB'], trap:'T12',
    stem:'Lactato "tipo B" refere-se a:',
    o:['produção sem hipóxia tecidual, por estímulo metabólico/adrenérgico ou redução de depuração','produção exclusivamente por hipoperfusão e baixa oferta de O₂ aos tecidos periféricos, sem qualquer contribuição de estímulo metabólico','um valor que só aparece em pacientes com parada cardíaca recente documentada','uma forma de lactato que não é detectada pelos métodos laboratoriais habituais'], a:0,
    rationale:{ correct:'Tipo B = sem hipóxia: β-adrenérgico, metabólico, ou clearance reduzido (fígado).', why:['correta: sem hipóxia','isso é tipo A','não exige PCR','é detectável'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M13 · tipo B' } },

  { id:'m30_q064', format:'sba', quarter:4, difficulty:4, axis:'E4', modules:['M12','M13','M9'], concepts:['integracao'], trap:'T14',
    stem:'Após otimizar PAM e débito, o lactato persiste alto e a perfusão capilar (vídeo-microscopia) está heterogênea. A conduta mecanística coerente é:',
    o:['reconhecer a dissociação macro–micro e evitar escalar a pressão indefinidamente, que não corrige a microcirculação','elevar a PAM-alvo progressivamente até o lactato normalizar, pois pressão e perfusão capilar são exatamente a mesma variável fisiológica','assumir erro de medida do lactato e da vídeo-microscopia, mantendo a conduta sem qualquer reavaliação','interromper toda monitorização de perfusão, já que a macro-hemodinâmica foi otimizada com sucesso'], a:0,
    rationale:{ correct:'Macro otimizada + micro disfuncional: subir a pressão não conserta o capilar e tem custo.', why:['correta: reconhece a dissociação','pressão ≠ perfusão capilar','não é erro de medida','não se abandona a perfusão'], trap:'pressor melhora macro ≠ micro', concept:'M12 · dissociação macro-micro' } },

  // ---- E5 · Categorias de choque (M14–M22) ----
  { id:'m30_q065', format:'est', quarter:2, difficulty:2, axis:'E5', modules:['M20'], concepts:['distributivo','termo'], trap:'T05',
    grounded:{ ref:'model29.brokenTerm', args:{state:{rvs:520, hr:120, o2ermax:0.42, vo2demand:330}}, kind:'label', optionValues:['conteudo','pre','bomba','rvs'] },
    stem:'Choque com RVS muito baixa, débito alto e extremidades quentes. O termo quebrado, computado pelo motor, é:',
    o:['conteúdo de O₂','pré-carga / retorno venoso','bomba / contratilidade','resistência vascular (RVS)'], a:3,
    rationale:{ correct:'O motor classifica a RVS como termo dominante quebrado — é o distributivo.', why:['conteúdo está preservado','a pré-carga não é o primário','a bomba não é o problema','correta: RVS (distributivo)'], trap:'distributivo ≠ séptico', concept:'M20 · distributivo (computado)' } },

  { id:'m30_q066', format:'est', quarter:2, difficulty:2, axis:'E5', modules:['M16'], concepts:['cardiogenico','termo'], trap:'T08',
    grounded:{ ref:'model29.brokenTerm', args:{state:{contractility:0.32, preload:1.15, hr:108, rvs:1750}}, kind:'label', optionValues:['rvs','bomba','pre','conteudo'] },
    stem:'Choque frio, congesto, com RVS elevada e contratilidade reduzida. O termo quebrado, computado, é:',
    o:['resistência vascular (RVS)','bomba / contratilidade','pré-carga / retorno venoso','conteúdo de O₂'], a:1,
    rationale:{ correct:'O motor aponta a bomba (contratilidade) como termo quebrado — é o cardiogênico.', why:['a RVS está alta, mas compensatória','correta: bomba','a pré-carga não é o primário','o conteúdo está preservado'], trap:'VD ≠ VE', concept:'M16 · cardiogênico (computado)' } },

  { id:'m30_q067', format:'est', quarter:3, difficulty:3, axis:'E5', modules:['M15'], concepts:['hemorragico','conteudo'], trap:'T03',
    grounded:{ ref:'model29.brokenTerm', args:{state:{preload:0.5, hb:7, hr:120, rvs:1450}}, kind:'label', optionValues:['conteudo','rvs','bomba','pre'] },
    stem:'Trauma com hipotensão, Hb 7, taquicardia e vasoconstrição. O termo dominante quebrado, computado, é:',
    o:['conteúdo de O₂ (Hb baixa)','resistência vascular (RVS)','bomba / contratilidade','pré-carga / retorno venoso'], a:0,
    rationale:{ correct:'Com Hb 7, o motor classifica o conteúdo como termo dominante (somado à pré-carga perdida).', why:['correta: conteúdo (Hb 7)','a RVS está alta, compensatória','a bomba está preservada','a pré-carga também caiu, mas o conteúdo domina aqui'], trap:'conteúdo ≠ saturação', concept:'M15 · hemorrágico (computado)' } },

  { id:'m30_q068', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M14'], concepts:['hipovolemico'], trap:'T07',
    stem:'A quebra primária no choque hipovolêmico é:',
    o:['o retorno venoso / pré-carga, por perda de volume efetivo circulante','a contratilidade miocárdica, que falha de modo intrínseco e primário','a resistência vascular sistêmica, que cai por vasoplegia inflamatória','o conteúdo arterial de O₂, mesmo quando não houve perda de sangue'], a:0,
    rationale:{ correct:'Hipovolemia quebra o retorno venoso/pré-carga; RVS e FC sobem em compensação.', why:['correta: pré-carga/retorno','a bomba está íntegra','a RVS sobe, não cai','sem sangramento, o conteúdo é normal'], trap:'hipotensão ≠ hipovolemia', concept:'M14 · hipovolêmico' } },

  { id:'m30_q069', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M17'], concepts:['VD','interdependencia'], trap:'T08',
    stem:'O ventrículo direito falha por regras próprias porque:',
    o:['é sensível à pós-carga pulmonar e, dilatado, reduz o enchimento do VE por interdependência (septo/pericárdio)','tem a mesma fisiologia do VE, podendo ser tratado exatamente como uma falência de ventrículo esquerdo','não sofre influência da pressão intratorácica nem da resistência vascular pulmonar em nenhuma circunstância hemodinâmica relevante','responde sempre a grandes volumes, que melhoram seu débito de forma proporcional e previsível'], a:0,
    rationale:{ correct:'VD é afterload-sensível (RVP) e, dilatado, comprime o VE — interdependência ventricular.', why:['correta: pós-carga pulmonar + interdependência','não é igual ao VE','sofre influência pleural/RVP','volume excessivo piora o VD'], trap:'VD ≠ VE', concept:'M17 · ventrículo direito' } },

  { id:'m30_q070', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M18','M19'], concepts:['obstrutivo'], trap:'T07',
    stem:'O denominador comum dos choques obstrutivos (TEP, tamponamento, pneumotórax hipertensivo) é:',
    o:['uma barreira mecânica ao enchimento ou à ejeção, que reduz o fluxo apesar de bomba e volume frequentemente preservados','uma vasoplegia sistêmica grave que derruba a resistência vascular e o retorno venoso simultaneamente','uma falência intrínseca e primária da contratilidade dos dois ventrículos ao mesmo tempo','uma perda maciça de volume circulante por hemorragia interna oculta não identificada'], a:0,
    rationale:{ correct:'Obstrutivo = barreira mecânica (ao enchimento/retorno/ejeção); bomba e volume podem estar ok.', why:['correta: barreira mecânica','não é vasoplegia','não é falência de contratilidade','não é hipovolemia'], trap:'hipotensão ≠ hipovolemia', concept:'M18 · obstrutivo' } },

  { id:'m30_q071', format:'vf', quarter:3, difficulty:3, axis:'E5', modules:['M19'], concepts:['tamponamento','pneumotorax'], trap:'T10',
    stem:'Sobre os obstrutivos torácicos, qual assertiva é VERDADEIRA?',
    o:['no tamponamento, o tratamento mecânico é drenar o pericárdio; vasopressor apenas sustenta a pressão enquanto isso','o pneumotórax hipertensivo melhora de forma definitiva apenas com reposição volêmica generosa, sem necessidade de descompressão imediata','o tamponamento se resolve com inotrópico, pois a falha é primariamente de contratilidade do ventrículo','esses quadros são distributivos por vasoplegia e respondem bem a expansão volêmica isolada'], a:0,
    rationale:{ correct:'Remover a restrição (drenar) é o pilar; o pressor é ponte, não solução.', why:['correta: drenar é o tratamento','pneumotórax exige descompressão','tamponamento não é falha de bomba','são obstrutivos, não distributivos'], trap:'procedimento ≠ indicação', concept:'M19 · obstrutivos torácicos' } },

  { id:'m30_q072', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M20','M21'], concepts:['distributivo','septico'], trap:'T05',
    stem:'Por que "distributivo" e "séptico" não são sinônimos?',
    o:['distributivo é a categoria (RVS baixa); séptico é um subtipo, somando micro/mitocôndria/extração quebradas','são exatamente o mesmo conceito, apenas com nomes diferentes para a mesma fisiologia','séptico é a categoria ampla e distributivo é um subtipo raro dentro dela','distributivo é sempre infeccioso, enquanto séptico pode ter qualquer etiologia não infecciosa'], a:0,
    rationale:{ correct:'Distributivo = categoria (vasoplegia); séptico = subtipo com micro/mito/extração também quebradas.', why:['correta: categoria × subtipo','não são sinônimos','é o inverso da hierarquia','distributivo não é sempre infeccioso (anaf/neuro)'], trap:'distributivo ≠ séptico', concept:'M20/M21 · categoria × subtipo' } },

  { id:'m30_q073', format:'est', quarter:3, difficulty:3, axis:'E5', modules:['M18'], concepts:['obstrutivo','VD'], trap:'T08',
    grounded:{ ref:'model29.brokenTerm', args:{state:{preload:0.5, contractility:0.6, hr:122, rvs:1500}}, kind:'label', optionValues:['bomba','conteudo','pre','rvs'] },
    stem:'TEP com VD sobrecarregado e enchimento do VE reduzido. O termo dominante quebrado, computado, é:',
    o:['bomba / contratilidade','conteúdo de O₂','pré-carga / enchimento','resistência vascular (RVS)'], a:2,
    rationale:{ correct:'O motor aponta o enchimento (pré-carga efetiva do VE) como dominante — a barreira do VD limita o VE.', why:['a contratilidade do VE não é o primário','o conteúdo está preservado','correta: enchimento/pré-carga efetiva','a RVS está alta, compensatória'], trap:'VD ≠ VE', concept:'M18 · obstrutivo (computado)' } },

  { id:'m30_q074', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M22'], concepts:['anafilatico','neurogenico'], trap:'T05',
    stem:'O melhor discriminador entre anafilático e neurogênico (ambos distributivos) é:',
    o:['a frequência cardíaca: taquicardia compensatória favorece o anafilático; bradicardia relativa, o neurogênico (perda simpática)','a pressão arterial média exata, que é sistematicamente mais baixa no choque neurogênico do que no anafilático','o valor isolado da hemoglobina, que cai no anafilático por extravasamento e permanece normal no neurogênico','a temperatura das extremidades, sempre frias no anafilático e sempre quentes no choque neurogênico'], a:0,
    rationale:{ correct:'A FC separa: anafilático taquicardiza; neurogênico perde o simpático e não taquicardiza.', why:['correta: a FC é o discriminador','a PAM não os separa de forma fixa','a Hb não é o discriminador','a temperatura não os separa assim'], trap:'distributivo ≠ séptico', concept:'M22 · anaf × neuro' } },

  { id:'m30_q075', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M16'], concepts:['cardiogenico','perfil'], trap:'T08',
    stem:'O perfil clássico do choque cardiogênico é:',
    o:['frio e congesto (baixo débito com pressões de enchimento elevadas a montante)','quente e seco, com resistência baixa e débito cardíaco elevado','quente e congesto, com vasoplegia e extremidades bem perfundidas e débito cardíaco bastante elevado','frio e seco, exclusivamente por perda de volume circulante'], a:0,
    rationale:{ correct:'Cardiogênico = bomba falha: baixo débito (frio) + congestão a montante (úmido).', why:['correta: frio e congesto','isso é distributivo','vasoplegia não é cardiogênico','frio e seco sugere hipovolemia'], trap:'VD ≠ VE', concept:'M16 · perfil cardiogênico' } },

  { id:'m30_q076', format:'vignette', quarter:4, difficulty:4, axis:'E5', modules:['M14','M16','M23'], concepts:['categoria','evolucao'], trap:'T05',
    stem:'Passo 1: jovem hipotenso, frio, taquicárdico, após diarreia volumosa — responde parcialmente a volume. Passo 2: persiste hipotenso, e o ECO mostra função sistólica deprimida. A leitura é:',
    o:['hipovolemia inicial que desmascarou (ou somou) um componente de bomba — o quadro evoluiu para misto e pede reavaliação','hipovolemia pura desde o início, e a disfunção sistólica ao ECO é necessariamente um artefato de imagem','choque distributivo por vasoplegia, já que toda hipotensão que responde a volume é distributiva','choque obstrutivo, pois a resposta parcial a volume exclui qualquer outro mecanismo possível'], a:0,
    rationale:{ correct:'A resposta parcial + disfunção sistólica revelam um componente de bomba somado: virou misto.', why:['correta: misto (volume + bomba)','a disfunção não é artefato','responder a volume não define distributivo','não há sinais de obstrução'], trap:'distributivo ≠ séptico', concept:'M23 · vinheta de evolução' } },

  { id:'m30_q077', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M21'], concepts:['septico','micro'], trap:'T14',
    stem:'No choque séptico, a macro-hemodinâmica restaurada pode não bastar porque:',
    o:['a disfunção microcirculatória e mitocondrial mantém o déficit de extração apesar de pressão e fluxo adequados','a sepse é um choque puramente hipovolêmico que sempre se resolve apenas com grandes volumes','a pressão arterial média elevada garante por si a normalização do lactato em todos os casos','o séptico não envolve componente distributivo, sendo um choque essencialmente cardiogênico'], a:0,
    rationale:{ correct:'Séptico soma micro/mito/extração quebradas ao distributivo: macro ok não garante perfusão.', why:['correta: micro/mito mantêm o déficit','não é só hipovolêmico','PAM alta não normaliza o lactato','é distributivo, não cardiogênico'], trap:'pressor melhora macro ≠ micro', concept:'M21 · séptico' } },

  { id:'m30_q078', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M17','M24'], concepts:['VD','coracaoPulmao'], trap:'T08',
    stem:'A ventilação com pressão positiva, num VD já sobrecarregado, pode:',
    o:['reduzir o retorno venoso e elevar a pós-carga pulmonar, piorando o débito do VD que falha','descarregar o VD de forma sempre benéfica, reduzindo sua pós-carga em qualquer ajuste de PEEP','aumentar diretamente a contratilidade do VD por estímulo mecânico da parede livre','corrigir a interdependência ventricular por restaurar a geometria septal imediatamente'], a:0,
    rationale:{ correct:'Pressão positiva baixa o retorno e pode subir a RVP — duplo golpe no VD sobrecarregado.', why:['correta: retorno↓ + RVP↑','nem sempre descarrega o VD','não eleva a contratilidade','não corrige a geometria por si'], trap:'VD ≠ VE', concept:'M24 · coração-pulmão' } },

  { id:'m30_q079', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M20'], concepts:['distributivo','perfil'], trap:'T07',
    stem:'O perfil hemodinâmico típico do distributivo é:',
    o:['quente, com resistência vascular baixa e débito cardíaco geralmente alto','frio, com resistência alta e débito cardíaco muito reduzido','congesto, com pressões de enchimento elevadas por falência de bomba do ventrículo esquerdo','seco e frio, por perda aguda de grande volume circulante'], a:0,
    rationale:{ correct:'Distributivo = vasoplegia: RVS baixa, débito alto, extremidades quentes.', why:['correta: quente, RVS baixa, débito alto','frio/RVS alta é cardiogênico/hipo','congestão é cardiogênico','seco/frio é hipovolêmico'], trap:'hipotensão ≠ hipovolemia', concept:'M20 · perfil distributivo' } },

  { id:'m30_q080', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M22'], concepts:['neurogenico'], trap:'T07',
    stem:'A ausência de taquicardia num paciente hipotenso após trauma raquimedular sugere:',
    o:['choque neurogênico: a perda do tônus simpático vasodilata e impede a resposta cronotrópica compensatória','hipovolemia simples, já que toda hipotensão pós-trauma decorre exclusivamente de sangramento','choque séptico precoce, pois a bradicardia é a assinatura mais comum da sepse inicial','choque cardiogênico, definido pela presença de bradicardia em qualquer contexto clínico'], a:0,
    rationale:{ correct:'Sem simpático: vasodilata e não taquicardiza — assinatura do neurogênico.', why:['correta: perda simpática','pode haver hemorragia associada, mas a FC baixa aponta neuro','sepse não cursa com bradicardia típica','bradicardia não define cardiogênico'], trap:'hipotensão ≠ hipovolemia', concept:'M22 · neurogênico' } },

  { id:'m30_q081', format:'est', quarter:4, difficulty:4, axis:'E5', modules:['M23'], concepts:['misto','termo'], trap:'T05',
    grounded:{ ref:'model29.brokenTerm', args:{state:{rvs:600, contractility:0.38, hr:118, o2ermax:0.45, vo2demand:320}}, kind:'label', optionValues:['pre','conteudo','rvs','bomba'] },
    stem:'Séptico que evolui com FE reduzida (RVS baixa + contratilidade baixa). O termo dominante computado é:',
    o:['pré-carga / retorno venoso','conteúdo de O₂','resistência vascular (RVS)','bomba / contratilidade'], a:2,
    rationale:{ correct:'O motor aponta a RVS como dominante, mas há também a bomba — é misto (dois termos).', why:['a pré-carga não é o dominante','o conteúdo está preservado','correta: RVS domina (com bomba somada)','a bomba está quebrada também, mas a RVS domina'], trap:'distributivo ≠ séptico', concept:'M23 · misto (computado)' } },

  { id:'m30_q082', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M15'], concepts:['hemorragico','conteudo'], trap:'T03',
    stem:'Por que cristaloide não "substitui" sangue do ponto de vista da entrega de O₂?',
    o:['porque repõe volume, mas não repõe hemoglobina — não restaura o conteúdo (CaO₂) nem a entrega (DO₂)','porque o cristaloide tem maior capacidade de transporte de O₂ que as próprias hemácias','porque o cristaloide eleva a saturação arterial de O₂ de forma mais eficiente que a própria transfusão de hemácias','porque volume e conteúdo são a mesma variável fisiológica na equação da entrega de oxigênio'], a:0,
    rationale:{ correct:'Cristaloide repõe pré-carga, não Hb; sem conteúdo, a DO₂ não se restaura.', why:['correta: volume ≠ conteúdo','cristaloide não transporta O₂','não eleva a SaO₂','volume e conteúdo são distintos'], trap:'conteúdo ≠ saturação', concept:'M15 · hemorrágico' } },

  { id:'m30_q083', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M21','M12'], concepts:['septico','SvO2'], trap:'T06',
    stem:'No séptico, uma ScvO₂ normal ou alta:',
    o:['não exclui hipoperfusão: pode refletir falha de extração tecidual, com O₂ entregue e não utilizado','prova que a oferta de O₂ excede a demanda e que a perfusão tecidual está plenamente adequada em qualquer fase da sepse','indica sempre que a reposição volêmica foi excessiva e deve ser imediatamente revertida','é incompatível com o diagnóstico de sepse e sugere erro na coleta da amostra venosa'], a:0,
    rationale:{ correct:'ScvO₂ alta no séptico pode ser falha de extração (micro/mito), não tecido satisfeito.', why:['correta: pode ser falha de extração','não prova adequação','não indica só excesso de volume','é compatível com sepse'], trap:'SvO₂ alta ≠ boa extração', concept:'M21 · ScvO₂ na sepse' } },

  { id:'m30_q084', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M18'], concepts:['obstrutivo','TEP'], trap:'T08',
    stem:'No TEP maciço, a hipotensão decorre primariamente de:',
    o:['sobrecarga aguda do VD por aumento da pós-carga pulmonar, reduzindo o enchimento do VE','falência intrínseca e primária da contratilidade do ventrículo esquerdo','vasoplegia sistêmica por liberação maciça de mediadores inflamatórios do coágulo trombótico pulmonar','perda de volume circulante para o leito pulmonar obstruído pelo trombo'], a:0,
    rationale:{ correct:'A obstrução pulmonar sobrecarrega o VD; o VE recebe menos e o débito cai.', why:['correta: sobrecarga do VD','o VE não é o primário','não é vasoplegia','não é perda de volume'], trap:'VD ≠ VE', concept:'M18 · TEP' } },

  { id:'m30_q085', format:'ar', quarter:4, difficulty:4, axis:'E5', modules:['M16','M7'], concepts:['cardiogenico','posCarga'], trap:'T09',
    stem:'ASSERÇÃO: no cardiogênico, reduzir a pós-carga pode melhorar o débito. PORQUE: o ventrículo falho é sensível à carga contra a ejeção.',
    o:['as duas são verdadeiras e a segunda justifica a primeira','as duas são verdadeiras, mas não há nexo causal entre elas neste contexto clínico','a primeira é verdadeira e a segunda é falsa','a primeira é falsa e a segunda é verdadeira'], a:0,
    rationale:{ correct:'V/V com nexo: o ventrículo afterload-sensível ganha débito quando a pós-carga cai.', why:['correta: V/V com causa','há nexo causal','a segunda é verdadeira','a primeira é verdadeira'], trap:'pós-carga ≠ PA', concept:'M16 · pós-carga no cardiogênico' } },

  { id:'m30_q086', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M14','M5'], concepts:['hipovolemico','responsividade'], trap:'T04',
    stem:'Por que nem todo hipovolêmico se beneficia de volume indefinidamente?',
    o:['porque a responsividade se esgota: além do ponto da curva, mais volume gera congestão sem ganho de débito','porque a hipovolemia, uma vez instalada, nunca responde a qualquer reposição de volume','porque o volume administrado se converte integralmente em débito cardíaco sem qualquer perda','porque a pré-carga não tem relação com o débito no choque hipovolêmico estabelecido'], a:0,
    rationale:{ correct:'Mesmo no hipovolêmico há janela: passada a responsividade, volume vira custo.', why:['correta: a responsividade se esgota','responde, sim, na fase inicial','há perdas (terceiro espaço)','a pré-carga determina o débito aqui'], trap:'responsivo ≠ tolerante', concept:'M14 · responsividade' } },

  { id:'m30_q087', format:'vf', quarter:3, difficulty:3, axis:'E5', modules:['M16','M20','M14'], concepts:['perfil','categoria'], trap:'T07',
    stem:'Sobre perfis e categorias, qual assertiva é VERDADEIRA?',
    o:['o mesmo valor de PAM pode aparecer num quente (RVS baixa/débito alto) e num frio (RVS alta/débito baixo)','toda hipotensão com extremidades frias é, por definição, um choque hipovolêmico por perda de volume circulante efetivo','o perfil quente com débito alto é exclusivo do choque cardiogênico em fase descompensada','a resistência vascular não influencia o perfil clínico nem a temperatura das extremidades'], a:0,
    rationale:{ correct:'PAM = DC × RVS: a mesma pressão nasce de perfis opostos (quente × frio).', why:['correta: mesma PAM, perfis opostos','frio não é só hipovolemia','quente/débito alto é distributivo','a RVS define o perfil térmico'], trap:'hipotensão ≠ hipovolemia', concept:'M9/M20 · perfis' } },

  { id:'m30_q088', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M21','M13'], concepts:['septico','lactato'], trap:'T12',
    stem:'No séptico tratado, um lactato que cai lentamente apesar de macro otimizada pode refletir:',
    o:['clearance hepático reduzido e/ou produção tipo B residual, além de disfunção microcirculatória persistente','exclusivamente hipoperfusão macro-hemodinâmica não corrigida, exigindo escalonar a pressão arterial de forma agressiva','um erro analítico sistemático do laboratório que deve ser ignorado na decisão clínica','uma resposta normal e esperada que dispensa qualquer reavaliação da perfusão tecidual'], a:0,
    rationale:{ correct:'Lactato lento: clearance reduzido + tipo B + micro persistente — não só macro.', why:['correta: clearance + tipo B + micro','não é só macro','não é erro analítico','merece reavaliação'], trap:'lactato alto ≠ sempre hipóxia (A×B)', concept:'M21/M13 · lactato na sepse' } },

  { id:'m30_q089', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M19'], concepts:['tamponamento'], trap:'T07',
    stem:'A tríade de Beck (hipotensão, turgência jugular, bulhas abafadas) sugere:',
    o:['tamponamento cardíaco: a restrição pericárdica impede o enchimento, reduzindo o débito','choque hipovolêmico clássico, no qual as jugulares estão sempre colapsadas','sepse com vasoplegia, na qual a turgência jugular reflete a resistência vascular sistêmica elevada','infarto de VE com edema agudo, definido pela ausência de turgência jugular'], a:0,
    rationale:{ correct:'Beck = tamponamento: restrição ao enchimento (obstrutivo), com turgência jugular.', why:['correta: tamponamento','hipovolemia tem jugular colapsada','não é vasoplegia','a turgência está presente, não ausente'], trap:'hipotensão ≠ hipovolemia', concept:'M19 · tamponamento' } },

  { id:'m30_q090', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M20','M12','M13'], concepts:['septico','definicao'], trap:'T05',
    stem:'A definição mecanística mais completa do choque séptico inclui:',
    o:['vasoplegia (RVS baixa) somada a disfunção microcirculatória, mitocondrial e de extração — e, por vezes, de bomba','apenas hipotensão refratária a volume, sem qualquer componente micro ou metabólico associado','exclusivamente uma queda do débito cardíaco por falência primária da contratilidade miocárdica','somente uma perda de volume intravascular por extravasamento capilar, sem vasoplegia'], a:0,
    rationale:{ correct:'Séptico = distributivo + micro/mito/extração (± cardiomiopatia): vários termos.', why:['correta: vasoplegia + micro/mito (± bomba)','não é só hipotensão','não é só bomba','não é só leak'], trap:'distributivo ≠ séptico', concept:'M21 · definição integrada' } },

  { id:'m30_q091', format:'est', quarter:3, difficulty:3, axis:'E5', modules:['M14'], concepts:['hipovolemico','termo'], trap:'T07',
    grounded:{ ref:'model29.brokenTerm', args:{state:{preload:0.45, hr:115, rvs:1500}}, kind:'label', optionValues:['rvs','pre','bomba','conteudo'] },
    stem:'Hipotensão com pré-carga muito baixa, taquicardia e vasoconstrição, sem anemia. O termo quebrado computado é:',
    o:['resistência vascular (RVS)','pré-carga / retorno venoso','bomba / contratilidade','conteúdo de O₂'], a:1,
    rationale:{ correct:'O motor aponta a pré-carga como termo quebrado — é o hipovolêmico.', why:['a RVS está alta, compensatória','correta: pré-carga/retorno','a bomba está preservada','sem anemia, o conteúdo é normal'], trap:'hipotensão ≠ hipovolemia', concept:'M14 · hipovolêmico (computado)' } },

  { id:'m30_q092', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M17','M19'], concepts:['VD','obstrutivo'], trap:'T08',
    stem:'Por que o TEP e o tamponamento, embora ambos obstrutivos, exigem leituras mecânicas distintas?',
    o:['o TEP sobrecarrega o VD por pós-carga pulmonar; o tamponamento restringe o enchimento de ambas as câmaras por pressão pericárdica','são fisiologicamente idênticos e o tratamento mecânico é exatamente o mesmo nos dois casos','o tamponamento é uma falência de contratilidade e o TEP é uma vasoplegia pulmonar aguda','ambos se resolvem apenas com grandes volumes, sem necessidade de intervenção mecânica específica'], a:0,
    rationale:{ correct:'Mecanismos distintos: pós-carga do VD (TEP) × restrição ao enchimento (tamponamento) — intervenções diferentes.', why:['correta: pós-carga × restrição','não são idênticos','nenhum é falência de contratilidade','volume não resolve a barreira'], trap:'VD ≠ VE', concept:'M17/M19 · obstrutivos distintos' } },

  { id:'m30_q093', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M15'], concepts:['hemorragico','classes'], trap:'T07',
    stem:'No choque hemorrágico, a taquicardia e a vasoconstrição precoces representam:',
    o:['compensação à perda de volume, que pode manter a PAM normal até um ponto de descompensação abrupta','sinais de vasoplegia distributiva por liberação de mediadores do sangramento','evidência de falência primária da bomba cardíaca pela perda de sangue','indicação de que o conteúdo de O₂ está elevado para compensar a anemia'], a:0,
    rationale:{ correct:'Compensação simpática: FC↑ e RVS↑ defendem a PAM até a reserva esgotar (precipício).', why:['correta: compensação à perda','não é vasoplegia','a bomba está íntegra','o conteúdo cai, não sobe'], trap:'hipotensão ≠ hipovolemia', concept:'M15 · classes de perda' } },

  { id:'m30_q094', format:'vignette', quarter:4, difficulty:4, axis:'E5', modules:['M18','M16','M9'], concepts:['obstrutivo','decomposicao'], trap:'T02',
    stem:'Passo 1: hipotensão súbita, VD dilatado, VE pequeno e hiperdinâmico ao ECO. Passo 2: a PAM "responde" a um vasopressor, mas a hipoxemia persiste. A leitura é:',
    o:['obstrutivo (provável TEP): o vasopressor sustenta a pressão de perfusão do VD, mas não remove a obstrução — tratar a causa','cardiogênico por falência de VE, já que a hipotensão respondeu ao vasopressor administrado','distributivo por vasoplegia, definido pela resposta da PAM ao vasopressor utilizado','hipovolemia, pois todo VE pequeno ao ECO indica perda de volume circulante como causa única'], a:0,
    rationale:{ correct:'VD dilatado + VE pequeno hiperdinâmico = obstrutivo (VD); o pressor é ponte, a causa é a obstrução.', why:['correta: obstrutivo, tratar a causa','VE hiperdinâmico não é falência de VE','responder ao pressor não define distributivo','o VE pequeno aqui é por baixo enchimento do VD'], trap:'PAM ≠ perfusão', concept:'M18 · vinheta obstrutiva' } },

  { id:'m30_q095', format:'sba', quarter:2, difficulty:2, axis:'E5', modules:['M16','M27'], concepts:['perfil','fluxoCongestao'], trap:'T07',
    stem:'No 2×2 perfusão × congestão, "frio e úmido" corresponde mecanicamente a:',
    o:['baixo fluxo (má perfusão) com congestão a montante — o padrão do cardiogênico descompensado','bom fluxo com ausência de congestão, o padrão de um paciente compensado e estável','vasoplegia com débito alto e extremidades quentes, típica do distributivo','perda de volume sem congestão, definindo o quadro hipovolêmico clássico'], a:0,
    rationale:{ correct:'Frio (baixo fluxo) + úmido (congesto) = cardiogênico descompensado; o termo é a bomba.', why:['correta: baixo fluxo + congestão','isso é "quente e seco"','quente/débito alto é distributivo','sem congestão sugere hipovolemia'], trap:'hipotensão ≠ hipovolemia', concept:'M27 · perfis' } },

  { id:'m30_q096', format:'sba', quarter:3, difficulty:3, axis:'E5', modules:['M22'], concepts:['anafilatico','eixo'], trap:'T05',
    stem:'O choque anafilático difere do séptico, mesmo sendo ambos distributivos, porque:',
    o:['soma à vasoplegia um eixo respiratório/imunológico de instalação rápida (broncoespasmo, edema, leak maciço)','é, na verdade, um choque cardiogênico por depressão miocárdica primária mediada por histamina','não cursa com queda da resistência vascular, mantendo a RVS elevada durante toda a evolução','depende exclusivamente de perda de volume, sem qualquer componente de vasodilatação associado'], a:0,
    rationale:{ correct:'Anafilático = vasoplegia + leak + via aérea (broncoespasmo/edema), rápido — eixo respiratório/imune.', why:['correta: soma o eixo respiratório/imune','não é cardiogênico','a RVS cai (é distributivo)','há vasodilatação, não só leak'], trap:'distributivo ≠ séptico', concept:'M22 · anafilático' } },

  { id:'m30_q097', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M23','M27'], concepts:['misto','reavaliacao'], trap:'T05',
    stem:'Por que o choque misto exige reavaliação dinâmica mais que qualquer categoria pura?',
    o:['porque os termos quebrados se somam e o termo dominante pode mudar ao longo do tempo, exigindo recasar a leitura','porque, uma vez classificado como misto, o quadro permanece idêntico e dispensa qualquer reavaliação posterior do estado clínico','porque o misto é sempre menos grave que as categorias puras e evolui invariavelmente para a cura','porque a PAM isolada, no misto, passa a refletir com exatidão todo o estado hemodinâmico do paciente'], a:0,
    rationale:{ correct:'No misto os termos se somam e o dominante muda — a leitura precisa ser refeita no tempo.', why:['correta: termo dominante muda','não permanece idêntico','não é menos grave','a PAM isolada segue enganando'], trap:'distributivo ≠ séptico', concept:'M23 · misto dinâmico' } },

  { id:'m30_q098', format:'sba', quarter:1, difficulty:1, axis:'E5', modules:['M14','M15'], concepts:['hipovolemico','assinatura'], trap:'T07',
    stem:'A assinatura hemodinâmica clássica do choque hipovolêmico é:',
    o:['débito cardíaco baixo, resistência vascular alta e extração de O₂ aumentada','débito alto, resistência baixa e extração reduzida, com extremidades quentes','resistência baixa por vasoplegia com pressões de enchimento elevadas','débito alto com congestão pulmonar por sobrecarga de volume circulante'], a:0,
    rationale:{ correct:'Hipovolêmico: DC↓ (pouco retorno), RVS↑ (compensação), extração↑ (tecido espremendo O₂).', why:['correta: DC↓, RVS↑, extração↑','isso é distributivo','vasoplegia não é hipovolemia','não há sobrecarga de volume'], trap:'hipotensão ≠ hipovolemia', concept:'M14 · assinatura' } },

  { id:'m30_q099', format:'trap', quarter:3, difficulty:3, axis:'E5', modules:['M20','M14'], concepts:['categoria'], trap:'T07',
    stem:'Qual frase comete a armadilha "toda hipotensão é hipovolemia"?',
    o:['"está hipotenso, então com certeza está hipovolêmico e precisa de mais volume"','"a hipotensão com extremidades quentes e débito alto aponta para vasoplegia distributiva"','"a hipotensão com bomba falha e congestão sugere cardiogênico, não hipovolemia"','"decompor a PAM em débito e resistência define a categoria antes de repor volume"'], a:0,
    rationale:{ correct:'Assumir hipovolemia em toda hipotensão ignora distributivo, cardiogênico e obstrutivo.', why:['correta: a armadilha','reconhece o distributivo','reconhece o cardiogênico','correto: decompor primeiro'], trap:'hipotensão ≠ hipovolemia', concept:'M14/M20 · meta-armadilha' } },

  { id:'m30_q100', format:'sba', quarter:4, difficulty:4, axis:'E5', modules:['M21','M23','M12'], concepts:['septico','misto','integracao'], trap:'T14',
    stem:'Um séptico com PAM 70 (em vasopressor), ScvO₂ 78%, lactato 4 e tempo de enchimento capilar lento ilustra que:',
    o:['a macro pode estar "no alvo" enquanto micro/extração seguem quebradas — a perfusão não se resume ao número da PAM','a PAM de 70 garante perfusão tecidual adequada e o lactato elevado é necessariamente um artefato laboratorial sem valor real','a ScvO₂ de 78% prova extração eficiente e exclui qualquer disfunção microcirculatória residual','o quadro já está resolvido, pois todos os alvos macro-hemodinâmicos foram plenamente atingidos'], a:0,
    rationale:{ correct:'PAM no alvo + ScvO₂ alta + lactato alto + TEC lento = micro/extração quebradas apesar da macro.', why:['correta: macro ok, micro quebrada','PAM 70 não garante perfusão','ScvO₂ alta pode ser falha de extração','não está resolvido'], trap:'pressor melhora macro ≠ micro', concept:'M21/M12 · síntese integrada' } }
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
var TG=_targets(150, 7);   // tamanho FINAL (150); seed 7 → prefixos 50/100/150 todos em banda, maxRun ≤ 3 (estável entre as partes)
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
function buildBank(){ return BANK.map(function(it,i){ return _rotate(it, TG[i]); }); }   // item i → alvo fixo TG[i] (estável entre as partes)

if(typeof module!=='undefined' && module.exports){ module.exports={ BANK:BANK, buildBank:buildBank, TG:TG, _targets:_targets }; }
