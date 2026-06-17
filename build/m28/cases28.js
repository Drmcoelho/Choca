// build/m28/cases28.js — Casos clínicos dinâmicos V/F do Módulo 28 (PERFUNDE · CHOCA)
// Motor de DADOS puro e testável: casos que evoluem em etapas; cada etapa traz
// assertivas Verdadeiro/Falso sobre o caso, a condução (mecanismo) e correlatos.
// Total fixo: 5 casos × 4 etapas × 5 assertivas = 100 assertivas (50 V / 50 F).
// Firewall SaMD: são afirmações EDUCACIONAIS de mecanismo/fisiologia, em V/F —
// nunca ordem imperativa nem alvo individualizado para paciente real.
'use strict';

var CASES_VF = [
  { id:'septico', titulo:'Choque séptico → cardiomiopatia séptica', sub:'distributivo quente que ganha um componente de bomba',
    abertura:'Mulher, 64 anos, pielonefrite. PA 78/40, FC 124, lactato 4,2, extremidades aquecidas, TEC inicial < 2 s.',
    etapas:[
      { fase:'Apresentação', evol:'Quente, hipotensa, taquicárdica, lactato alto. Débito estimado alto.', asser:[
        { t:'O perfil quente (extremidades aquecidas) com PA baixa e débito alto aponta para choque distributivo, com a RVS como termo quebrado.', v:true, r:'Vasoplegia: DC alto + RVS baixa = distributivo.' },
        { t:'A taquicardia compensatória eleva o débito cardíaco para tentar defender a PAM.', v:true, r:'FC↑ → DC↑ (DC = FC × VS), sustentando PAM = PVC + DC·RVS.' },
        { t:'O lactato elevado, na sepse, pode refletir tanto hipoperfusão quanto desacoplamento metabólico.', v:true, r:'Lactato tipo A (hipoperfusão) e tipo B (metabólico/β-adrenérgico) coexistem.' },
        { t:'A hipotensão deste quadro prova que a contratilidade (bomba) é o mecanismo primário.', v:false, r:'O débito está alto; o termo quebrado é a RVS, não a bomba.' },
        { t:'Uma PAM nos limites normais excluiria, com segurança, hipoperfusão tecidual.', v:false, r:'Choque críptico: PAM normal pode mascarar tecido faminto (lactato alto).' }
      ]},
      { fase:'Ressuscitação volêmica', evol:'Após volume adequado, segue hipotensa (PA 84/46), lactato 3,8.', asser:[
        { t:'Persistir hipotensa após volume adequado desloca o raciocínio para o termo RVS (suporte vasopressor, por mecanismo).', v:true, r:'Esgotada a responsividade a volume, o termo quebrado segue sendo a RVS.' },
        { t:'A responsividade a volume é mais bem avaliada por índices dinâmicos do que pela PVC isolada.', v:true, r:'PVC estática prediz mal; testes dinâmicos (elevação de pernas, ΔPP) são superiores.' },
        { t:'Volume pode ser reposto indefinidamente, pois não tem custo enquanto a PA estiver baixa.', v:false, r:'Volume é droga com janela: além do ponto responsivo, acumula congestão sem ganho de débito.' },
        { t:'Como o problema é a RVS, um inotrópico isolado normalizaria a PAM.', v:false, r:'Inotrópico move a bomba, não a RVS quebrada; não corrige a vasoplegia.' },
        { t:'A meta correta é o número da PAM, independentemente do mecanismo que a produziu.', v:false, r:'PAM = DC × RVS; perseguir só o número pode piorar a perfusão.' }
      ]},
      { fase:'Vasopressor + segundo agente', evol:'Em suporte vasopressor: ScvO₂ 68%, lactato cai a 2,5, mas a dose sobe.', asser:[
        { t:'A vasopressina atua pelo receptor V1, por via NÃO-adrenérgica, poupando catecolamina.', v:true, r:'V1 sobe a RVS fora do eixo adrenérgico.' },
        { t:'A vasopressina é administrada em dose fixa (U/min), não titulada por peso como a noradrenalina.', v:true, r:'Dose fixa; a calculadora não usa o peso.' },
        { t:'A queda do lactato com ScvO₂ adequada sugere melhora da relação oferta/demanda de O₂.', v:true, r:'Marcadores de perfusão melhorando = oferta acompanhando a demanda.' },
        { t:'Em acidemia intensa, a resposta α aos vasopressores tende a aumentar.', v:false, r:'A acidose REDUZ a responsividade α; corrigir o pH melhora a resposta.' },
        { t:'A noradrenalina é desprovida de qualquer efeito β1.', v:false, r:'Tem α1 dominante, mas também algum β1 (inotrópico).' }
      ]},
      { fase:'Cardiomiopatia séptica', evol:'ECO: FE 30%. Surge um componente de bomba sobre o distributivo.', asser:[
        { t:'A sepse pode cursar com disfunção miocárdica, somando um termo de bomba ao distributivo.', v:true, r:'Cardiomiopatia séptica: agora RVS E bomba quebradas.' },
        { t:'A milrinona, inibidor da PDE-3, gera inotropia sem passar pelo receptor β.', v:true, r:'PDE-3 contorna o β: inotropia com menos demanda/arritmia (mas vasodilata).' },
        { t:'Com o componente de bomba, o quadro deixa de ser misto e volta a ser puramente distributivo.', v:false, r:'Ao contrário: passa a MISTO (dois termos quebrados).' },
        { t:'Um inodilatador nunca reduz a PA, por isso dispensa o vasopressor concomitante.', v:false, r:'Inodilatador vasodilata e pode baixar a PA — daí a combinação com vasopressor.' },
        { t:'Atingida uma PAM normal, está descartada a necessidade de reavaliar a perfusão.', v:false, r:'PAM normal não garante perfusão; reavaliar lactato/ScvO₂/clínica.' }
      ]}
    ]},

  { id:'cardiogenico', titulo:'Choque cardiogênico (IAM) → ventrículo direito', sub:'bomba fria-úmida que evolui com falência de VD',
    abertura:'Homem, 68 anos, IAM anterior extenso. PA 82/60, FC 110, extremidades frias, TEC 4 s, congestão pulmonar, lactato 3,0.',
    etapas:[
      { fase:'Apresentação', evol:'Frio, úmido, hipotenso. Baixo débito com congestão.', asser:[
        { t:'Extremidades frias, TEC lento e congestão com PA baixa configuram perfil frio-úmido: a bomba é o termo quebrado.', v:true, r:'Baixo débito + congestão = falência de VE.' },
        { t:'A RVS, neste quadro, tende a estar ELEVADA por vasoconstrição compensatória.', v:true, r:'O organismo eleva a RVS para defender a PAM apesar do débito baixo.' },
        { t:'Uma PAM "normalizada" pela vasoconstrição pode coexistir com débito e perfusão ruins.', v:true, r:'PAM = DC × RVS: RVS alta compensa DC baixo e mascara.' },
        { t:'Neste cenário, a RVS baixa por vasoplegia é o mecanismo dominante.', v:false, r:'É o oposto: a RVS está alta; o termo quebrado é a contratilidade.' },
        { t:'Acelerar ainda mais a FC sempre melhora o débito no coração isquêmico.', v:false, r:'Taquicardia encurta a diástole e eleva a demanda de O₂ — pode agravar a isquemia.' }
      ]},
      { fase:'Condução (mecanismo)', evol:'Decide-se o agente pelo termo quebrado.', asser:[
        { t:'Um inotrópico de perfil β1 ataca o termo quebrado — a contratilidade — aceitando custo de O₂.', v:true, r:'β1 sobe a contratilidade; o preço é a demanda miocárdica.' },
        { t:'No cardiogênico hipotenso, combinar inotrópico com vasopressor soma fluxo e pressão.', v:true, r:'Inotrópico (débito) + vasopressor (RVS/PA) = fluxo + pressão.' },
        { t:'Um vasopressor α1 puro (fenilefrina) é a melhor escolha mecânica, pois alivia a bomba.', v:false, r:'α1 eleva a pós-carga sobre bomba fraca → afunda o débito.' },
        { t:'A dobutamina jamais reduz a pressão arterial.', v:false, r:'Pode baixar a PA por vasodilatação β2.' },
        { t:'Reposição volêmica agressiva é o pilar mecânico do cardiogênico já congesto.', v:false, r:'Já há congestão; volume agrava o edema sem corrigir a bomba.' }
      ]},
      { fase:'Evolução para VD', evol:'Surge falência de ventrículo direito (extensão do IAM).', asser:[
        { t:'O IAM pode comprometer o VD; sua sobrecarga reduz o enchimento do VE por interdependência ventricular.', v:true, r:'Septo desviado + pericárdio: o VD dilatado limita o VE.' },
        { t:'A pressão intratorácica e a PEEP modulam pré- e pós-carga do VD.', v:true, r:'Coração-pulmão: a pressão pleural afeta retorno e pós-carga (M24).' },
        { t:'No VD que falha, vasodilatar a circulação pulmonar pode ajudar a descarregá-lo.', v:true, r:'Reduzir a pós-carga do VD (RVP↓) melhora seu acoplamento.' },
        { t:'Encher de volume, sem limite, o VD que falha melhora o débito.', v:false, r:'A sobredistensão do VD piora a interdependência e o débito.' },
        { t:'A milrinona é contraindicada aqui por ser um β-bloqueador.', v:false, r:'Não é β-bloqueador: é inibidor da PDE-3 (inodilatador).' }
      ]},
      { fase:'Refratário / síntese', evol:'Bomba refratária à droga; reavalia-se o alvo.', asser:[
        { t:'Em bomba refratária ao fármaco, o suporte mecânico circulatório atua onde a droga não basta.', v:true, r:'Esgotada a inotropia farmacológica, entra o suporte mecânico.' },
        { t:'O objetivo mecânico é restaurar fluxo (débito), não apenas elevar o número da pressão.', v:true, r:'Perfusão é fluxo; a PAM é número resultante.' },
        { t:'O custo de O₂ do suporte inotrópico β é desprezível.', v:false, r:'O β eleva a demanda miocárdica de O₂ — custo central.' },
        { t:'Subir isoladamente a RVS é a forma mais segura de tratar a bomba.', v:false, r:'Mais pós-carga sobre bomba fraca pode reduzir o débito.' },
        { t:'Atingida a PAM-alvo, a perfusão tecidual está garantida.', v:false, r:'PAM normal não garante perfusão (lactato/TEC continuam mandando).' }
      ]}
    ]},

  { id:'misto', titulo:'Choque misto (séptico + cardiogênico)', sub:'mais de um termo quebrado ao mesmo tempo',
    abertura:'Idoso com pneumonia grave e cardiopatia prévia. PA 80/45, lactato 5,0, ECO com FE reduzida e sinais de vasoplegia.',
    etapas:[
      { fase:'Reconhecimento', evol:'Coexistem RVS baixa e bomba fraca.', asser:[
        { t:'Um paciente pode ter mais de um termo quebrado ao mesmo tempo (RVS baixa + bomba fraca).', v:true, r:'Choque misto: termos somados.' },
        { t:'No misto, a PAM pode estar enganosamente normal enquanto o tecido segue faminto.', v:true, r:'Compensações cruzadas mascaram o déficit.' },
        { t:'Lactato persistente apesar de PAM adequada sugere déficit de perfusão/extração oculto.', v:true, r:'O marcador denuncia o que a PAM esconde.' },
        { t:'No misto, atribuir todo o déficit a um único mecanismo é sempre o correto.', v:false, r:'Há mais de um termo; reduzir a um só engana.' },
        { t:'O perfil hemodinâmico do misto é sempre idêntico ao do distributivo puro.', v:false, r:'Depende dos pesos relativos dos termos quebrados.' }
      ]},
      { fase:'Condução combinada', evol:'Endereçam-se os dois termos.', asser:[
        { t:'Combinar vasopressor (RVS) com inotrópico (bomba) endereça os dois termos quebrados.', v:true, r:'Cada agente move o seu termo.' },
        { t:'ScvO₂ e lactato ajudam a julgar se a oferta acompanha a demanda.', v:true, r:'Marcadores de adequação oferta/demanda.' },
        { t:'A dobutamina isolada, havendo componente vasoplégico, tende a corrigir a PA.', v:false, r:'β2 vasodilata: pode AGRAVAR a hipotensão do componente distributivo.' },
        { t:'Em mistos, a conduta correta é mirar o número da PAM, ignorando o mecanismo.', v:false, r:'Decompor a PAM em DC e RVS é obrigatório.' },
        { t:'A noradrenalina não tem nenhum efeito inotrópico.', v:false, r:'α1 dominante, mas com algum β1.' }
      ]},
      { fase:'Agente de amplo espectro', evol:'Discute-se um agente que move vários termos.', asser:[
        { t:'A adrenalina move quatro termos (α1, β1, β2) e pode cobrir RVS e bomba de uma vez.', v:true, r:'Perfil amplo: potência com custo.' },
        { t:'A hiperlactatemia induzida pela adrenalina (β2) pode simular piora da perfusão.', v:true, r:'Lactato tipo B: metabólico, não hipoperfusão.' },
        { t:'A dopamina tem efeito dose-dependente e costuma causar mais arritmia que a noradrenalina.', v:true, r:'O perfil muda com a dose; mais taquiarritmia.' },
        { t:'A adrenalina praticamente não tem custo metabólico ou arrítmico.', v:false, r:'É o agente de maior custo do grupo.' },
        { t:'A vasopressina, por ser adrenérgica, soma taquicardia à adrenalina.', v:false, r:'V1 é NÃO-adrenérgica; não acrescenta taquicardia.' }
      ]},
      { fase:'Reavaliação dinâmica', evol:'O termo dominante muda ao longo das horas.', asser:[
        { t:'Reavaliar dinamicamente é essencial: o termo dominante pode mudar ao longo do tempo.', v:true, r:'O misto é móvel.' },
        { t:'O desmame dos agentes acompanha a recuperação do termo que estava quebrado.', v:true, r:'Retira-se o suporte do termo que se recupera.' },
        { t:'Uma vez instalado o misto, o quadro nunca regride a um único mecanismo.', v:false, r:'Pode regredir conforme um componente se resolve.' },
        { t:'O POCUS não acrescenta nada na discriminação dos componentes do misto.', v:false, r:'POCUS avalia VE, VD, volemia e pulmão — discrimina.' },
        { t:'Ler a PAM isolada basta para conduzir o choque misto.', v:false, r:'É preciso decompor em DC e RVS.' }
      ]}
    ]},

  { id:'anafilatico', titulo:'Choque anafilático (e o diferencial neurogênico)', sub:'distributivo de instalação rápida; FC como discriminador',
    abertura:'Adulto, minutos após antibiótico EV: urticária, sibilos, PA 70/38, FC 130, sensação de morte iminente.',
    etapas:[
      { fase:'Apresentação', evol:'Vasodilatação + leak + componente respiratório, rápido.', asser:[
        { t:'Vasodilatação, extravasamento capilar e possível broncoespasmo de instalação rápida configuram distributivo anafilático.', v:true, r:'Mecanismo: vasoplegia + leak + via respiratória.' },
        { t:'A FC costuma estar elevada (compensatória) no anafilático.', v:true, r:'Resposta adrenérgica à hipotensão.' },
        { t:'O edema de via aérea é um componente possível que extrapola a hemodinâmica.', v:true, r:'Risco respiratório associado ao quadro.' },
        { t:'No anafilático, a RVS está tipicamente elevada.', v:false, r:'Está REDUZIDA (vasoplegia) — é distributivo.' },
        { t:'A ausência de taquicardia descarta anafilaxia em qualquer cenário.', v:false, r:'Nem sempre; β-bloqueio e outros fatores podem alterar a FC.' }
      ]},
      { fase:'Condução (mecanismo)', evol:'Trata-se vasoplegia, leak e via aérea.', asser:[
        { t:'A reposição volêmica importa porque há extravasamento e hipovolemia relativa.', v:true, r:'Leak capilar → volume intravascular cai.' },
        { t:'Pacientes em uso de β-bloqueador podem ter resposta atenuada à adrenalina.', v:true, r:'O β bloqueado reduz a resposta β-adrenérgica.' },
        { t:'Um vasopressor α1 puro corrige todos os componentes da anafilaxia, inclusive o broncoespasmo.', v:false, r:'α1 puro não broncodilata; é o β2 (da adrenalina) que atua na via aérea.' },
        { t:'O efeito β2 não tem qualquer papel no manejo mecanístico da anafilaxia.', v:false, r:'β2 broncodilata — componente relevante.' },
        { t:'A anafilaxia nunca recorre depois da melhora inicial.', v:false, r:'Reação bifásica: pode recorrer horas depois.' }
      ]},
      { fase:'Diferencial neurogênico', evol:'Compara-se com o outro distributivo: o neurogênico.', asser:[
        { t:'O neurogênico é distributivo por perda do tônus simpático, com bradicardia relativa ou absoluta.', v:true, r:'Sem simpático: vasodilata e não taquicardiza.' },
        { t:'A FC é um bom discriminador: alta favorece anafilático; baixa/normal favorece neurogênico.', v:true, r:'Assinatura de FC × RVS (M22).' },
        { t:'No neurogênico há aumento da capacitância venosa, reduzindo o retorno.', v:true, r:'Venodilatação → pré-carga cai.' },
        { t:'Anafilático e neurogênico quebram a RVS pelo mesmo mecanismo.', v:false, r:'Vias diferentes: imuno-vasoativa × perda simpática.' },
        { t:'Ambos são, por definição, choques cardiogênicos.', v:false, r:'São distributivos, não cardiogênicos.' }
      ]},
      { fase:'Evolução', evol:'Resposta e vigilância.', asser:[
        { t:'A persistência da hipotensão pode exigir suporte vasopressor adicional, por mecanismo (RVS).', v:true, r:'Vasoplegia mantida = termo RVS ainda quebrado.' },
        { t:'Resolvidos a vasoplegia e o leak, o suporte vasopressor pode ser desmamado.', v:true, r:'Recuperado o termo, retira-se o suporte.' },
        { t:'Lactato e perfusão periférica não ajudam a julgar a resposta na anafilaxia.', v:false, r:'São marcadores úteis de perfusão.' },
        { t:'A anafilaxia jamais evolui com comprometimento respiratório.', v:false, r:'Pode haver broncoespasmo/edema de via aérea.' },
        { t:'No neurogênico, a taquicardia intensa é a regra esperada.', v:false, r:'O esperado é FC baixa/normal (perda simpática).' }
      ]}
    ]},

  { id:'obstrutivo', titulo:'Choque obstrutivo (TEP) — contrastes e síntese', sub:'barreira mecânica ao enchimento/ejeção; a síntese do braço',
    abertura:'Pós-operatório, dispneia súbita, PA 84/52, FC 128, hipoxemia, VD dilatado ao ECO.',
    etapas:[
      { fase:'Apresentação (TEP)', evol:'Sobrecarga aguda de VD por aumento da pós-carga pulmonar.', asser:[
        { t:'O TEP maciço gera choque obstrutivo por aumento agudo da pós-carga do VD.', v:true, r:'Obstrução do leito pulmonar → sobrecarga aguda do VD.' },
        { t:'O VD dilatado pode desviar o septo e reduzir o enchimento do VE (interdependência).', v:true, r:'Mecânica do VD que limita o VE.' },
        { t:'A taquicardia é uma resposta esperada nesse cenário.', v:true, r:'Compensação à queda do débito.' },
        { t:'O termo quebrado primário no TEP é a RVS sistêmica baixa.', v:false, r:'O problema é obstrutivo (pós-carga do VD), não vasoplegia.' },
        { t:'A hipotensão do TEP só ocorre se o VE estiver intrinsecamente doente.', v:false, r:'O VE pode ser normal; a falência é do VD/obstrução.' }
      ]},
      { fase:'Condução (mecanismo)', evol:'Sustenta-se a pressão enquanto se trata a causa.', asser:[
        { t:'O suporte vasopressor mantém a pressão de perfusão coronária do VD enquanto se trata a causa.', v:true, r:'A perfusão do VD depende da PA sistêmica.' },
        { t:'O tratamento mecânico definitivo é remover ou reduzir a obstrução (a causa).', v:true, r:'Resolver a obstrução é o pilar.' },
        { t:'Administrar volume sem limite melhora sempre o VD sobrecarregado no TEP.', v:false, r:'A sobredistensão do VD piora a interdependência.' },
        { t:'O choque obstrutivo se resolve apenas com inotrópico, sem tratar a obstrução.', v:false, r:'Sem desobstruir, o mecanismo persiste.' },
        { t:'Reduzir a pós-carga do VD nunca tem papel no manejo do TEP.', v:false, r:'Em casos selecionados, reduzir a RVP ajuda.' }
      ]},
      { fase:'Contrastes obstrutivos', evol:'Tamponamento e pneumotórax hipertensivo entram no diferencial.', asser:[
        { t:'Tamponamento e pneumotórax hipertensivo também são obstrutivos, por restrição ao enchimento/retorno.', v:true, r:'Obstrutivo = barreira mecânica ao enchimento/ejeção.' },
        { t:'No tamponamento, o tratamento mecânico é drenar (pericardiocentese), não apenas pressóricos.', v:true, r:'Remover a restrição é o pilar.' },
        { t:'Turgência jugular + hipotensão + bulhas abafadas evocam tamponamento (tríade de Beck).', v:true, r:'Sinais clássicos do tamponamento.' },
        { t:'O pneumotórax hipertensivo melhora com volume isolado, sem descompressão.', v:false, r:'Exige descompressão; volume não resolve.' },
        { t:'Esses quadros são, na verdade, distributivos por vasoplegia.', v:false, r:'São obstrutivos, não distributivos.' }
      ]},
      { fase:'Hemorrágico + síntese', evol:'Fecha-se com o contraste hipovolêmico e a regra do braço.', asser:[
        { t:'No choque hemorrágico, o termo quebrado é o retorno venoso/pré-carga por perda de volume.', v:true, r:'Volume perdido → pré-carga cai.' },
        { t:'A síntese do braço: achar o termo quebrado → escolher a alavanca que o move → pesar o custo.', v:true, r:'A regra final do M28.' },
        { t:'O vasopressor corrige a causa do choque hemorrágico.', v:false, r:'A causa é a perda de volume/sangramento; o pilar é hemostasia + reposição.' },
        { t:'Um mesmo valor de PAM nunca pode nascer de mecânicas hemodinâmicas opostas.', v:false, r:'Pode: DC alto/RVS baixa vs DC baixo/RVS alta dão a mesma PAM.' },
        { t:'Ler a PAM isolada, sem decompô-la, basta para classificar o choque.', v:false, r:'Decompor antes de interpretar (PAM = DC × RVS).' }
      ]}
    ]}
];

function flatAssertions(){ var out=[]; CASES_VF.forEach(function(c){ c.etapas.forEach(function(e,ei){ e.asser.forEach(function(a,ai){ out.push({caso:c.id, etapa:ei, idx:ai, t:a.t, v:a.v, r:a.r}); }); }); }); return out; }
function vfStats(){ var f=flatAssertions(), v=0; f.forEach(function(a){ if(a.v) v++; }); return { total:f.length, v:v, f:f.length-v, casos:CASES_VF.length, etapas:CASES_VF.reduce(function(s,c){return s+c.etapas.length;},0) }; }

if(typeof module!=='undefined' && module.exports){ module.exports={ CASES_VF:CASES_VF, flatAssertions:flatAssertions, vfStats:vfStats }; }
