// build/m29/cases29.js — Casos clínicos dinâmicos V/F INTEGRADOS do capstone (M29)
// 6 casos que evoluem por etapas e costuram o braço inteiro (conteúdo → entrega
// → consumo/extração → pressão → categoria → alavanca). 6 × 4 etapas × 5 = 120
// assertivas Verdadeiro/Falso (60 V / 60 F; cada caso 10/10), com gabarito +
// racional. Mesma forma de dados do M28 (UI reutilizável). Firewall SaMD:
// afirmações educacionais de mecanismo — sem ordem imperativa nem dose.
'use strict';

var CASES_VF=[
  { id:'septico', titulo:'Séptico → a cascata inteira', sub:'conteúdo ok, mas entrega e extração quebram',
    abertura:'Mulher, 62 anos, pielonefrite. PA 80/40, FC 122, Hb 12, SaO₂ 97%, lactato 4,5, extremidades quentes.',
    etapas:[
      { fase:'Decompor a apresentação', evol:'Quente, hipotensa, débito alto presumido; conteúdo de O₂ preservado.', asser:[
        { t:'Com Hb 12 e SaO₂ 97%, o conteúdo arterial de O₂ (CaO₂) está praticamente preservado — o problema não é de conteúdo.', v:true, r:'CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂: Hb e SaO₂ adequadas mantêm o conteúdo.' },
        { t:'PA 80/40 com extremidades quentes e débito alto aponta para o termo RVS quebrado (distributivo).', v:true, r:'Vasoplegia: RVS baixa com débito alto = distributivo.' },
        { t:'O lactato de 4,5, na sepse, pode somar hipoperfusão (tipo A) e estímulo metabólico (tipo B).', v:true, r:'Os dois mecanismos coexistem na sepse.' },
        { t:'A PA baixa, por si, prova que a bomba é o termo primário deste choque.', v:false, r:'O débito está alto; o termo quebrado é a RVS, não a contratilidade.' },
        { t:'Como a SaO₂ é 97%, está descartada qualquer hipoperfusão tecidual.', v:false, r:'SaO₂ alta não garante entrega nem extração; o lactato denuncia o déficit.' }
      ]},
      { fase:'A entrega e a extração', evol:'ScvO₂ 82%, lactato persistente apesar de PA quase normalizada com volume.', asser:[
        { t:'A entrega de O₂ (DO₂) depende diretamente da PAM, de modo que normalizar a pressão já garante a entrega.', v:false, r:'DO₂ = DC × CaO₂ × 10: depende de fluxo e conteúdo, não da PAM diretamente.' },
        { t:'ScvO₂ alta com lactato alto sugere falha de extração/utilização (microcirculação/mitocôndria).', v:true, r:'O O₂ chega mas não é usado: o sangue volta "cheio".' },
        { t:'Uma PAM normalizada garante que a perfusão tecidual foi restaurada.', v:false, r:'PAM normal pode coexistir com déficit (lactato persistente).' },
        { t:'Repor volume indefinidamente corrige a vasoplegia subjacente.', v:false, r:'Volume tem janela; a RVS quebrada pede o termo certo (vasopressor), não mais volume.' },
        { t:'A ScvO₂ alta, neste contexto, indica oferta excessiva e tecido plenamente satisfeito.', v:false, r:'Indica extração falha, não satisfação tecidual.' }
      ]},
      { fase:'A alavanca para a RVS', evol:'Inicia-se suporte vasopressor; lactato começa a cair.', asser:[
        { t:'Um agente de perfil α1 predominante move o termo quebrado (RVS) e sustenta a PAM.', v:true, r:'α1 → vasoconstrição = sobe a RVS, o termo certo aqui.' },
        { t:'A vasopressina (V1) acrescenta pressão por via não-adrenérgica, poupando catecolamina.', v:true, r:'V1 age fora do eixo adrenérgico.' },
        { t:'A queda do lactato com melhora clínica sugere que a oferta voltou a cobrir a demanda.', v:true, r:'Marcador de perfusão melhorando.' },
        { t:'Um inodilatador isolado (dobutamina) é a melhor escolha para a vasoplegia.', v:false, r:'Vasodilata ainda mais o vasoplégico: termo errado, agrava a hipotensão.' },
        { t:'Em acidemia intensa, a resposta ao vasopressor α tende a aumentar.', v:false, r:'A acidose reduz a responsividade α; corrigir o pH ajuda.' }
      ]},
      { fase:'Cardiomiopatia séptica (vira misto)', evol:'ECO: FE 30%. Soma-se um componente de bomba.', asser:[
        { t:'A disfunção miocárdica séptica acrescenta um termo de bomba: o quadro passa a MISTO.', v:true, r:'RVS baixa + bomba fraca = misto.' },
        { t:'No misto, faz sentido endereçar os dois termos (ex.: vasopressor + inotrópico).', v:true, r:'Cada alavanca move o seu termo quebrado.' },
        { t:'Subir apenas a RVS, agora, sempre melhora a perfusão.', v:false, r:'Mais pós-carga sobre bomba fraca pode reduzir o débito/entrega.' },
        { t:'Uma PAM-alvo atingida dispensa reavaliar a perfusão daqui em diante.', v:false, r:'A PAM normal não garante perfusão; reavaliar lactato/ScvO₂.' },
        { t:'A milrinona gera inotropia sem passar pelo receptor β (inibe a PDE-3).', v:true, r:'PDE-3 contorna o β: inotropia com menos demanda/arritmia.' }
      ]}
    ]},

  { id:'hemorragico', titulo:'Hemorrágico → conteúdo + pré-carga', sub:'dois termos quebrados: volume perdido e Hb caindo',
    abertura:'Homem, 30 anos, trauma abdominal. PA 84/58, FC 132, Hb 6,5, extremidades frias, lactato 5,0.',
    etapas:[
      { fase:'Decompor', evol:'Taquicárdico, frio, hipotenso; sangramento ativo presumido.', asser:[
        { t:'O choque hemorrágico quebra dois termos: o retorno/pré-carga (volume) e o conteúdo (Hb).', v:true, r:'Perda de sangue tira volume E hemoglobina.' },
        { t:'A Hb 6,5 reduz diretamente o CaO₂ e, portanto, a entrega de O₂ (DO₂).', v:true, r:'CaO₂ ∝ Hb; menos Hb → menos DO₂ para o mesmo débito.' },
        { t:'Extremidades frias com FC 132 indicam vasoconstrição compensatória (RVS alta).', v:true, r:'Resposta simpática à hipovolemia: vasoconstrição + taquicardia.' },
        { t:'A RVS baixa por vasoplegia é o mecanismo primário aqui.', v:false, r:'A RVS está ALTA (compensatória); o problema é volume/conteúdo.' },
        { t:'Como a SaO₂ está normal, o conteúdo de O₂ está garantido.', v:false, r:'Conteúdo depende sobretudo da Hb, que está muito baixa.' }
      ]},
      { fase:'A alavanca certa', evol:'Discute-se o que move os termos quebrados.', asser:[
        { t:'O pilar mecânico é controlar a fonte (hemostasia) e repor o que se perdeu.', v:true, r:'Tratar a causa: estancar + repor volume/hemácias.' },
        { t:'A transfusão move o termo CONTEÚDO: sobe a Hb, o CaO₂ e a DO₂.', v:true, r:'Repor hemácias eleva o conteúdo arterial de O₂.' },
        { t:'Um vasopressor isolado corrige a causa do choque hemorrágico.', v:false, r:'Pressor maquia a PAM; não repõe volume nem Hb.' },
        { t:'Encher de cristaloide sem limite é inofensivo enquanto a PA estiver baixa.', v:false, r:'Diluição/coagulopatia e custo; volume tem janela.' },
        { t:'Subir a RVS com α1 puro aumenta o conteúdo de O₂ perdido no sangramento.', v:false, r:'α1 não tem efeito sobre Hb/conteúdo; só sobe a pós-carga.' }
      ]},
      { fase:'Resposta à reposição', evol:'Após hemostasia e hemocomponentes, lactato cai, FC 98.', asser:[
        { t:'A queda do lactato e da FC sugere que a entrega voltou a cobrir a demanda.', v:true, r:'Marcadores de perfusão melhorando.' },
        { t:'Restaurados volume e Hb, a vasoconstrição compensatória tende a ceder.', v:true, r:'Resolvido o estímulo, a RVS alta normaliza.' },
        { t:'A pré-carga responsiva é mais bem avaliada pela PVC isolada do que por testes dinâmicos.', v:false, r:'PVC estática prediz mal; índices dinâmicos (PLR, ΔPP) são superiores.' },
        { t:'Com a PA normalizada, não há mais necessidade de vigiar a perfusão.', v:false, r:'Reavaliar sempre: pode ressangrar ou descompensar.' },
        { t:'Transfundir além do necessário é sempre benéfico e sem custo.', v:false, r:'Excesso transfusional tem custos próprios; repor o necessário.' }
      ]},
      { fase:'Recidiva', evol:'Nova queda de PA; suspeita de ressangramento.', asser:[
        { t:'Reavaliar dinamicamente é essencial: o termo quebrado pode reabrir (ressangramento).', v:true, r:'O choque é móvel; o volume/conteúdo pode cair de novo.' },
        { t:'A mesma PAM de antes pode agora coexistir com um débito e uma entrega piores.', v:true, r:'PAM = DC × RVS: o número repete com mecânica pior.' },
        { t:'Um lactato que volta a subir, com a PAM mantida, deve ser ignorado como ruído laboratorial.', v:false, r:'Lactato subindo sinaliza hipoperfusão recorrente — não se ignora.' },
        { t:'Persistir só elevando a PAM com pressor resolve um ressangramento ativo.', v:false, r:'Sem controlar a fonte e repor, o pressor apenas maquia.' },
        { t:'Decompor a PAM em débito e resistência continua sendo obrigatório a cada reavaliação.', v:true, r:'Decompor antes de interpretar, sempre.' }
      ]}
    ]},

  { id:'cardiogenico', titulo:'Cardiogênico → coração-pulmão', sub:'bomba fraca, pós-carga e a pressão intratorácica',
    abertura:'Homem, 70 anos, IAM anterior. PA 82/60, FC 108, frio, congestão pulmonar, lactato 3,2, SaO₂ 88%.',
    etapas:[
      { fase:'Decompor', evol:'Frio, úmido, hipoxêmico; baixo débito com congestão.', asser:[
        { t:'Frio + úmido + PA baixa configura perfil cardiogênico: a bomba é o termo quebrado.', v:true, r:'Baixo fluxo + congestão = falência de VE.' },
        { t:'A RVS tende a estar ELEVADA por vasoconstrição compensatória.', v:true, r:'Compensação que defende a PAM e mascara o débito baixo.' },
        { t:'A hipoxemia (SaO₂ 88%) reduz o CaO₂ e agrava ainda mais a entrega já comprometida pelo baixo débito.', v:true, r:'Dois fatores derrubando a DO₂: débito↓ e conteúdo↓.' },
        { t:'A RVS baixa por vasoplegia domina o quadro.', v:false, r:'A RVS está alta; o termo quebrado é a contratilidade.' },
        { t:'Repor volume generosamente é o pilar do cardiogênico já congesto.', v:false, r:'Há congestão; volume agrava o edema sem corrigir a bomba.' }
      ]},
      { fase:'A alavanca e o custo', evol:'Escolhe-se a alavanca pelo termo quebrado.', asser:[
        { t:'Um inotrópico (β1) ataca a contratilidade, aceitando custo de demanda de O₂.', v:true, r:'β1 sobe a bomba; o preço é demanda miocárdica.' },
        { t:'Um α1 puro (fenilefrina) tende a afundar o débito por somar pós-carga à bomba fraca.', v:true, r:'O ventrículo fraco é sensível à pós-carga: VS cai.' },
        { t:'A milrinona, por ser β-bloqueador, está contraindicada para inotropismo.', v:false, r:'Não é β-bloqueador: é inibidor da PDE-3 (inodilatador).' },
        { t:'Subir só a RVS é a forma mais segura de tratar a bomba.', v:false, r:'Mais pós-carga sobre bomba fraca reduz o débito.' },
        { t:'O custo de O₂ do suporte β é desprezível.', v:false, r:'β eleva a demanda miocárdica — custo central na isquemia.' }
      ]},
      { fase:'Ventilação e VD', evol:'Indicada ventilação com pressão positiva.', asser:[
        { t:'A pressão intratorácica positiva pode descarregar o VE ao reduzir sua pós-carga transmural.', v:true, r:'Pressão pleural positiva baixa a pós-carga do VE que falha.' },
        { t:'A mesma pressão positiva, num VD sobrecarregado, pode reduzir o retorno e piorar o débito.', v:true, r:'Pré-carga do VD cai e a RVP pode subir — efeito oposto.' },
        { t:'A PEEP nunca afeta a pré- ou a pós-carga ventricular.', v:false, r:'Afeta ambas (coração-pulmão); por isso há PEEP "ótima".' },
        { t:'A ventilação corrige diretamente a contratilidade do miocárdio isquêmico.', v:false, r:'Não age na contratilidade; modula cargas e oxigenação.' },
        { t:'Corrigir a hipoxemia não altera o conteúdo de O₂, pois o CaO₂ depende apenas da hemoglobina.', v:false, r:'CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂: a SaO₂ entra no conteúdo; corrigi-la o eleva.' }
      ]},
      { fase:'Refratário / síntese', evol:'Bomba refratária à droga.', asser:[
        { t:'Quando a inotropia farmacológica se esgota, o suporte mecânico atua onde a droga não basta.', v:true, r:'Suporte circulatório mecânico no refratário.' },
        { t:'O objetivo mecânico é restaurar fluxo (débito), não apenas o número da pressão.', v:true, r:'Perfusão é fluxo; PAM é resultado.' },
        { t:'Atingir uma PAM "boa" com vasoconstritor garante a perfusão coronária e a recuperação.', v:false, r:'Pressão sem fluxo não garante perfusão; pode piorar o débito.' },
        { t:'No cardiogênico, taquicardizar mais sempre melhora o débito.', v:false, r:'Encurta a diástole e eleva a demanda — pode agravar a isquemia.' },
        { t:'Reavaliar o equilíbrio oferta/demanda (lactato, ScvO₂) guia melhor que a PAM isolada.', v:true, r:'Marcadores de perfusão acima do número de pressão.' }
      ]}
    ]},

  { id:'obstrutivo', titulo:'Obstrutivo (TEP) → ventrículo direito', sub:'barreira mecânica e interdependência ventricular',
    abertura:'Mulher, 55 anos, pós-operatório, dispneia súbita. PA 86/54, FC 126, SaO₂ 89%, VD dilatado ao ECO.',
    etapas:[
      { fase:'Decompor', evol:'Hipotensão aguda com VD dilatado e hipoxemia.', asser:[
        { t:'O TEP maciço é obstrutivo: aumento agudo da pós-carga do VD por obstrução do leito pulmonar.', v:true, r:'Barreira ao fluxo pulmonar sobrecarrega o VD.' },
        { t:'O VD dilatado pode desviar o septo e reduzir o enchimento do VE (interdependência).', v:true, r:'Mecânica do VD que limita o VE.' },
        { t:'A taquicardia é uma resposta compensatória esperada.', v:true, r:'Tenta defender o débito caindo.' },
        { t:'O termo primário quebrado é a RVS sistêmica baixa.', v:false, r:'É obstrutivo (pós-carga do VD), não vasoplegia.' },
        { t:'A hipotensão exige, necessariamente, um VE intrinsecamente doente.', v:false, r:'O VE pode ser normal; a falha é do VD/obstrução.' }
      ]},
      { fase:'Suporte enquanto se trata a causa', evol:'Sustenta-se a pressão e avalia-se desobstrução.', asser:[
        { t:'O suporte vasopressor mantém a pressão de perfusão coronária do VD enquanto se trata a causa.', v:true, r:'A perfusão do VD depende da PA sistêmica.' },
        { t:'O tratamento mecânico definitivo é reduzir/remover a obstrução.', v:true, r:'Sem desobstruir, o mecanismo persiste.' },
        { t:'Encher de volume sem limite o VD sobrecarregado melhora sempre o débito.', v:false, r:'Sobredistensão do VD piora a interdependência.' },
        { t:'O quadro se resolve apenas com inotrópico, sem tratar a obstrução.', v:false, r:'A obstrução é a causa; inotrópico não a remove.' },
        { t:'Reduzir a pós-carga do VD (vasodilatação pulmonar) não tem qualquer papel.', v:false, r:'Em casos selecionados, baixar a RVP descarrega o VD.' }
      ]},
      { fase:'Contrastes obstrutivos', evol:'Diferencial com tamponamento e pneumotórax.', asser:[
        { t:'Tamponamento e pneumotórax hipertensivo também são obstrutivos (restrição ao enchimento/retorno).', v:true, r:'Obstrutivo = barreira mecânica ao enchimento/ejeção.' },
        { t:'No tamponamento, o tratamento é drenar (pericardiocentese), não apenas pressóricos.', v:true, r:'Remover a restrição é o pilar.' },
        { t:'O pneumotórax hipertensivo melhora com volume isolado, sem descompressão.', v:false, r:'Exige descompressão; volume não resolve.' },
        { t:'Esses quadros são, na verdade, distributivos por vasoplegia.', v:false, r:'São obstrutivos, não distributivos.' },
        { t:'Turgência jugular com hipotensão e bulhas abafadas evoca tamponamento.', v:true, r:'Tríade de Beck, clássica.' }
      ]},
      { fase:'Pós-desobstrução / síntese', evol:'Tratada a causa, reavalia-se.', asser:[
        { t:'Removida a obstrução, a pós-carga do VD cai e o enchimento do VE tende a melhorar.', v:true, r:'Desfeita a barreira, a interdependência alivia.' },
        { t:'O suporte pressórico pode ser desmamado conforme o VD se recupera.', v:true, r:'Retira-se o suporte do termo que se resolve.' },
        { t:'A mesma PAM de antes da desobstrução significava a mesma fisiologia.', v:false, r:'Mesmo número, mecânica diferente: decompor sempre.' },
        { t:'Após a melhora, dispensa-se qualquer reavaliação da perfusão.', v:false, r:'Reavaliar: pode recorrer ou deixar disfunção residual de VD.' },
        { t:'Uma vez corrigida, a hipoxemia não influencia a entrega de O₂ neste contexto.', v:false, r:'SaO₂↑ → CaO₂↑ → DO₂↑: a oxigenação influencia a entrega.' }
      ]}
    ]},

  { id:'criptico', titulo:'Críptico/compensado → o precipício', sub:'a PAM normal mente; a reserva é finita',
    abertura:'Homem, 48 anos, pancreatite. PA 118/72 (PAM 87), FC 104, lactato 3,8, pele pálida, diurese caindo.',
    etapas:[
      { fase:'A PAM que mente', evol:'PAM normal, mas lactato alto e sinais sutis de hipoperfusão.', asser:[
        { t:'Uma PAM normal pode coexistir com hipoperfusão tecidual (choque críptico/compensado).', v:true, r:'A compensação sustenta o número enquanto o tecido sofre.' },
        { t:'Lactato alto com diurese caindo são marcadores ocultos que denunciam o déficit.', v:true, r:'Sinais de hipoperfusão apesar da PAM "boa".' },
        { t:'A vasoconstrição compensatória pode manter a PAM mesmo com débito reduzido.', v:true, r:'PAM = DC × RVS: RVS alta compensa DC baixo.' },
        { t:'PAM 87 exclui, com segurança, qualquer estado de choque.', v:false, r:'Choque é falência de perfusão, não um número de pressão.' },
        { t:'Lactato elevado sem hipotensão é sempre artefato laboratorial.', v:false, r:'Pode refletir hipoperfusão compensada real.' }
      ]},
      { fase:'Reserva finita', evol:'A compensação consome reserva; aproxima-se o limite.', asser:[
        { t:'A compensação tem reserva finita: passado o limite, a descompensação é abrupta (precipício).', v:true, r:'Curva não linear: pequeno empurrão → queda brusca.' },
        { t:'Decompor a PAM em débito e resistência revela o débito baixo escondido.', v:true, r:'A decomposição expõe o mecanismo.' },
        { t:'Enquanto a PAM estiver normal, a intervenção pode ser sempre adiada com segurança.', v:false, r:'Adiar gasta reserva; o precipício chega sem aviso pela PAM.' },
        { t:'A taquicardia leve aqui é irrelevante e não merece atenção.', v:false, r:'Pode ser sinal compensatório precoce do déficit.' },
        { t:'Um único valor de PAM informa mais do que a tendência de lactato, diurese e perfusão.', v:false, r:'A trajetória (tendência) informa mais que um ponto isolado.' }
      ]},
      { fase:'Identificar o termo', evol:'Investiga-se o que está quebrado sob a PAM normal.', asser:[
        { t:'O termo quebrado deve ser buscado mesmo com PAM normal — pode ser bomba, volume ou extração.', v:true, r:'A categoria não se lê pela PAM; decompor.' },
        { t:'POCUS e marcadores ajudam a discriminar o mecanismo oculto.', v:true, r:'Imagem + laboratório revelam o termo.' },
        { t:'Com a pressão normal, a oferta de O₂ (DO₂) está sempre garantida.', v:false, r:'DO₂ = DC × CaO₂; independe da PAM — pode estar baixa com pressão normal.' },
        { t:'Com PAM normal, a DO₂ está necessariamente adequada.', v:false, r:'DO₂ depende de fluxo e conteúdo, não da pressão.' },
        { t:'Tratar o número da PAM resolve o choque críptico.', v:false, r:'O número já está "bom"; o déficit é de perfusão/entrega.' }
      ]},
      { fase:'Descompensa', evol:'Súbita queda de PA; o precipício chegou.', asser:[
        { t:'A descompensação tardia confirma que a reserva compensatória se esgotou.', v:true, r:'O precipício materializa-se quando a compensação cede.' },
        { t:'Agora o termo quebrado precisa ser endereçado diretamente, não só a pressão.', v:true, r:'Casar a alavanca ao termo, não perseguir o número.' },
        { t:'A descompensação prova que a PAM normal anterior nunca significou segurança.', v:true, r:'A PAM "boa" mascarava o déficit o tempo todo.' },
        { t:'Ter esperado a PAM cair foi a conduta mais segura possível.', v:false, r:'A janela de intervenção precoce foi perdida; o precipício pune o atraso.' },
        { t:'Após estabilizar, não é mais necessário reavaliar a perfusão.', v:false, r:'Reavaliação contínua segue obrigatória.' }
      ]}
    ]},

  { id:'politrauma', titulo:'Politrauma → a grande integração (misto)', sub:'hemorragia + pneumotórax + componente distributivo',
    abertura:'Homem, 25 anos, colisão. PA 78/50, FC 138, Hb 7, SaO₂ 86%, MV abolido à direita, jugulares túrgidas.',
    etapas:[
      { fase:'Vários termos ao mesmo tempo', evol:'Hipotensão grave com hemorragia E sinais de obstrução torácica.', asser:[
        { t:'O politrauma pode quebrar vários termos juntos: conteúdo/pré-carga (hemorragia) e enchimento (pneumotórax hipertensivo).', v:true, r:'Choque misto: termos somados de categorias diferentes.' },
        { t:'MV abolido à direita com jugulares túrgidas e hipotensão sugere pneumotórax hipertensivo (obstrutivo).', v:true, r:'Obstrução ao retorno/enchimento — emergência mecânica.' },
        { t:'A Hb 7 e a SaO₂ 86% derrubam o conteúdo (CaO₂) e a entrega de O₂.', v:true, r:'Conteúdo baixo por anemia + hipoxemia.' },
        { t:'Atribuir todo o quadro a um único mecanismo é a leitura correta aqui.', v:false, r:'É misto; reduzir a um só termo engana e atrasa.' },
        { t:'Jugulares túrgidas excluem hipovolemia, encerrando o raciocínio.', v:false, r:'A turgência aqui é obstrutiva; a hemorragia coexiste — não se exclui.' }
      ]},
      { fase:'Ordem dos termos', evol:'Prioriza-se o que mata mais rápido e é reversível mecanicamente.', asser:[
        { t:'O pneumotórax hipertensivo exige descompressão mecânica — volume ou pressor não substituem.', v:true, r:'Remover a obstrução é o pilar imediato.' },
        { t:'A hemorragia exige controle da fonte e reposição de volume e hemácias.', v:true, r:'Tratar a causa: hemostasia + repor o perdido.' },
        { t:'Um vasopressor isolado, sem descomprimir nem repor, corrige o politrauma.', v:false, r:'Maquia a PAM; não remove a obstrução nem repõe volume/Hb.' },
        { t:'Transfundir e descomprimir movem o mesmo termo quebrado, sendo medidas intercambiáveis.', v:false, r:'São termos distintos (conteúdo × enchimento), cada um com a sua alavanca.' },
        { t:'Corrigir a SaO₂ não tem efeito sobre a entrega de O₂.', v:false, r:'SaO₂↑ eleva o CaO₂ e a DO₂.' }
      ]},
      { fase:'Componente distributivo tardio', evol:'Horas depois: febre, RVS caindo, novo componente vasoplégico.', asser:[
        { t:'Surge um componente distributivo (vasoplegia) que soma um terceiro termo quebrado (RVS).', v:true, r:'O misto evolui; um novo termo entra.' },
        { t:'A mesma PAM de antes pode agora esconder uma mecânica totalmente diferente.', v:true, r:'PAM = DC × RVS: o número se repete com fatores novos.' },
        { t:'Instalada a vasoplegia, o termo RVS pode pedir suporte vasopressor por mecanismo.', v:true, r:'RVS quebrada = alavanca α1/V1.' },
        { t:'Uma vez misto, o quadro nunca incorpora novos mecanismos.', v:false, r:'Pode incorporar — aqui somou-se um componente distributivo.' },
        { t:'Ler a PAM isolada basta para conduzir um politrauma em evolução.', v:false, r:'Decompor a cada reavaliação é obrigatório.' }
      ]},
      { fase:'Síntese do braço', evol:'Estabilização e a regra final.', asser:[
        { t:'A regra do braço: identificar o termo quebrado → escolher a alavanca que o move → pesar o custo.', v:true, r:'A síntese que unifica todos os módulos.' },
        { t:'Toda alavanca cobra um preço (demanda de O₂, arritmia, congestão), e a escolha pesa benefício × custo.', v:true, r:'Mover o termo certo não basta: pesar o custo.' },
        { t:'O desmame dos suportes deve ser simultâneo, independentemente da recuperação de cada termo.', v:false, r:'Desmama-se o suporte do termo que se recupera — guiado pela recuperação, não em bloco.' },
        { t:'No misto, a meta correta é o número da PAM, ignorando os mecanismos somados.', v:false, r:'Decompor e tratar cada termo; o número não é a meta.' },
        { t:'Choque é, afinal, apenas pressão arterial baixa.', v:false, r:'Choque é falência da entrega efetiva de O₂ ao tecido — não um número.' }
      ]}
    ]}
];

function flatAssertions(){ var out=[]; CASES_VF.forEach(function(c){ c.etapas.forEach(function(e,ei){ e.asser.forEach(function(a,ai){ out.push({caso:c.id, etapa:ei, idx:ai, t:a.t, v:a.v, r:a.r}); }); }); }); return out; }
function vfStats(){ var f=flatAssertions(), v=0; f.forEach(function(a){ if(a.v) v++; }); return { total:f.length, v:v, f:f.length-v, casos:CASES_VF.length, etapas:CASES_VF.reduce(function(s,c){return s+c.etapas.length;},0) }; }

if(typeof module!=='undefined' && module.exports){ module.exports={ CASES_VF:CASES_VF, flatAssertions:flatAssertions, vfStats:vfStats }; }
