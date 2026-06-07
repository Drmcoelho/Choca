# CHOQUE.md — Domínio Clínico-Fisiológico · **PERFUNDE · CHOCA**

> O “quê” do braço 2: a fisiologia, a taxonomia, os engines e suas âncoras de validação, a triagem SaMD por módulo e as honestidades de modelo.
> Governança e invariantes → `PERFUNDA.md`. Execução e build → `AGENTS.md`.

-----

## 1. Propósito

Transformar o choque de “lista de tipos a decorar” em **um único eixo causal quantitativo**: a entrega de oxigênio (DO₂) e sua falência. Cada tipo de choque deixa de ser uma entrada de tabela e vira **a quebra de um termo específico** da cadeia de transporte — visível, computável, validável.

-----

## 2. A fisiologia do transporte (cada termo, com o que o aluno erra)

**CaO₂ — conteúdo arterial de O₂.** `CaO₂ = 1,34·Hb·SaO₂ + 0,003·PaO₂`.
→ O erro clássico: confundir **PaO₂** (tensão, o que a gasometria mostra) com **conteúdo** (o que a célula recebe). Anemia derruba o conteúdo com PaO₂ e SaO₂ perfeitas. A fração dissolvida (0,003·PaO₂) é quase sempre desprezível — mas existe, e é por isso que hiperóxia move pouco o conteúdo num anêmico.
→ Ponte direta com o caso-semente (Hct 32 ≈ Hb 10,7): conteúdo ~30% reduzido com SpO₂ “ok”. Saturação engana.

**A curva de oxi-hemoglobina pelo lado tecidual.** Severinghaus (já validado no mvp2).
→ No braço 1 a curva explicava captação pulmonar; aqui explica **offloading**: P50, efeito Bohr (acidose/CO₂/temperatura/2,3-DPG deslocam para a direita → entrega facilitada ao tecido). O *ombro* da curva (onde o caso de hoje vivia, PaO₂ 64 ↔ Sat ~91%) é o precipício.

**DC — débito cardíaco.** `DC = FC × VS`.
→ Determinantes do VS: pré-carga, contratilidade, pós-carga. A taquicardia compensatória tem teto (enchimento diastólico encurta) — FC 120 não é “coração forte”, é bandeira.

**Pré-carga e a interseção de Guyton.** *(o engine-jóia — §5)*
→ O erro: tratar pré-carga como PVC. PVC é **ponto de operação**, não pré-carga; e responsividade a volume ≠ tolerância a volume. *Fluid responsive* (vai subir o VS na curva de Starling) é diferente de *fluid tolerant* (o pulmão/VD aguentam o volume).

**Pós-carga e a alça pressão-volume.** ESPVR/EDPVR, acoplamento Ea/Ees.
→ Pós-carga não é “a PA”; é a carga contra a ejeção. No cardiogênico, baixar pós-carga pode subir o DC — contraintuitivo para quem só olha PA.

**DO₂/VO₂ e extração.** `VO₂ = DC × (CaO₂−CvO₂)`, `O₂ER = VO₂/DO₂`.
→ A curva bifásica: VO₂ é independente de DO₂ até o **DO₂crítico**; abaixo dele, VO₂ passa a depender da entrega → metabolismo anaeróbio → lactato. ScvO₂/SvO₂ lê a extração: baixa = extraindo demais (entrega insuficiente); alta = não extraindo (shunt microcirculatório/falência citopática do séptico).

**PAM = DC × RVS — a inversão causal.**
→ O coração do braço. Mesma PAM, mecânicas opostas. A PA normal no choque críptico é o saldo de RVS↑ compensando DC↓ — falsa segurança.

-----

## 3. Taxonomia: cada choque = uma quebra localizada

|Choque                  |Termo quebrado                                   |Assinatura                                          |Compensação típica                             |
|------------------------|-------------------------------------------------|----------------------------------------------------|-----------------------------------------------|
|**Hipovolêmico**        |pré-carga (Guyton: retorno venoso ↓)             |DC↓, RVS↑, extração↑                                |taquicardia, vasoconstrição                    |
|**Cardiogênico**        |bomba (contratilidade / Ees↓)                    |DC↓, RVS↑, congestão                                |a espiral: DC↓→isquemia→DC↓                    |
|**Obstrutivo**          |enchimento mecânico (pré-carga por causa externa)|DC↓, RVS↑                                           |depende da causa (tamponamento/TEP/pneumotórax)|
|**Distributivo/séptico**|RVS (e microcirculação/mitocôndria)              |DC normal/↑, RVS↓, extração **paradoxalmente baixa**|DC alto não resgata se a extração falha        |

→ Os quatro não são categorias a decorar: são **quatro lugares onde a mesma equação se rompe**. Combinações reais (séptico + cardiogênico) = duas quebras simultâneas, como o fenótipo misto do Ventila.

-----

## 4. Escada de módulos — engines e âncoras de validação

Todo engine é validado em Node contra a âncora antes de virar UI (ver `AGENTS.md`).

|# |Módulo                                 |Engine central                                                            |Âncora de validação                                                  |
|--|---------------------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------|
|0 |**Caderno · Matemática do transporte** |DO₂/VO₂/CaO₂/Fick · aritmética exata                                      |conferência algébrica fechada (análogo do “Matemática do Ventilador”)|
|1 |**Conteúdo de O₂ (CaO₂)**              |equação do conteúdo                                                       |valores canônicos: Hb 15/SaO₂ 100 → CaO₂ ~20,1 mL/dL; **reusa mvp2** |
|2 |**A curva como entrega**               |Severinghaus (lado tecidual)                                              |P50 ~26,8 mmHg; deslocamentos de Bohr; **reusa mvp2 já validado**    |
|3 |**Débito cardíaco**                    |DC = FC × VS · determinantes do VS                                        |identidades; VS ~70 mL, DC ~5 L/min em repouso                       |
|4 |**Pré-carga & responsividade a volume**|**interseção de Guyton** (retorno venoso × função cardíaca) + PPV/VVS, VCI|Pmsf, ponto de operação; curva de RV linear cruzando Starling (§5)   |
|5 |**Pós-carga & o ventrículo**           |alça PV · ESPVR/EDPVR · Ea/Ees                                            |acoplamento Ea/Ees ~1; deslocamentos da alça em falência             |
|6 |**DO₂/VO₂ & extração**                 |curva bifásica de dependência de suprimento                               |platô de VO₂ → DO₂crítico; O₂ER ~25% normal; lactato no joelho       |
|7 |**PAM = DC × RVS (núcleo)**            |decomposição macrocirculatória                                            |mesma PAM por DC↑/RVS↓ vs DC↓/RVS↑                                   |
|8 |**Choque hipovolêmico**                |Starling deslocado por RV↓                                                |classes de hemorragia; índice de choque (FC/PAS)                     |
|9 |**Choque cardiogênico**                |alça PV em falência · a espiral                                           |EDPVR/ESPVR deslocados; congestão a montante                         |
|10|**Choque obstrutivo**                  |pressão intratorácica → retorno venoso                                    |**ponte ao mvp1** (auto-PEEP); tamponamento/TEP/pneumotórax          |
|11|**Choque distributivo/séptico**        |RVS↓ + microcirculação + falência citopática                              |DC normal/alto com extração baixa; **lactato tipo B**                |
|12|**Choque críptico/compensado**         |PAM normal mascarando DC↓                                                 |lactato↑ com PA normal — **o caso-semente, literalmente**            |
|13|**Os 4 perfis · o radar**              |discriminador integrador (frio/quente × úmido/seco)                       |mapeamento perfil → quebra de termo                                  |
|14|**Vasopressores & inotrópicos**        |receptor → termo da equação                                               |farmacologia mecanística (§8) · **sem dose**                         |
|15|**Capstone**                           |caso integrado + tutor gráfico dinâmico                                   |molde Ventila 15; provável caso = a paciente-semente                 |

-----

## 5. Os engines-jóia (especificação física)

**Interseção de Guyton (módulo 4) — o mais difícil, logo cedo no build, para desentortar a arquitetura.**
→ Duas curvas no plano (PVC no eixo x, fluxo no eixo y): a **curva de retorno venoso** (decrescente: RV = (Pmsf − PVC)/Rvr, zera quando PVC = Pmsf) e a **curva de função cardíaca** (Starling, crescente). O **ponto de operação é a interseção** — é onde DC e PVC efetivamente caem. Volume sobe Pmsf → desloca RV para a direita → nova interseção com DC maior (se ainda na porção ascendente de Starling). Falência de bomba achata Starling → interseção desce. **É o engine que unifica pré-carga, responsividade a volume e congestão num só gráfico.** Validar: zeros, inclinações, deslocamento de interseção sob volume e sob inotropismo.

**Frank-Starling (módulos 3-4-8).** Curva saturante VS × pré-carga; o platô explica por que volume além de um ponto não rende (e começa a congestionar).

**Alça pressão-volume (módulos 5-9).** Ea (elastância arterial, pós-carga) e Ees (elastância sistólica, contratilidade); acoplamento Ea/Ees como eficiência. Deslocamentos da alça em hipovolemia, falência sistólica, aumento de pós-carga.

**Curva de dependência de suprimento (módulo 6).** Bifásica: platô independente + rampa dependente abaixo do DO₂crítico; o joelho é onde o lactato nasce.

-----

## 6. Os quatro perfis hemodinâmicos (módulo 13, o radar)

Frio/quente (perfusão periférica ← DC e RVS) × seco/úmido (congestão ← pressões de enchimento). Cada quadrante mapeia para uma quebra de termo e para um vetor de raciocínio mecânico (não conduta automatizada). O radar integra os engines anteriores num discriminador de beira de leito.

-----

## 7. Choque críptico (módulo 12) — o que mais mata por ser ignorado

PA normal **não** exclui choque. Lactato↑ com PAM preservada = RVS compensando DC↓; a descompensação é súbita quando a vasoconstrição esgota. **O caso-semente é o módulo:** paciente normotensa (12×8), FC 120, lactato 3,9, conteúdo baixo (Hct 32) — perfusão tecidual já falhando sob PA “tranquilizadora”. Ensina a ler o lactato e a extração como detectores precoces, antes da PA cair.

-----

## 8. Vasopressores e inotrópicos (módulo 14) — receptor → termo, **nunca dose**

Mapeamento **mecanístico**, parando antes do miligrama:

→ **Noradrenalina** → α1 → RVS↑ (corrige o termo RVS no distributivo).
→ **Dobutamina** → β1 → contratilidade↑ / Ees↑ (corrige o termo bomba no cardiogênico).
→ **Vasopressina** → V1 → RVS↑ por via não-adrenérgica.
→ **Adrenalina** → β1+α → DC↑ e RVS↑.
→ A lógica: **identifique o termo quebrado na equação, escolha a alavanca que age sobre aquele termo.** O artefato mostra *qual termo cada droga move e por quê* — e explicitamente **não** diz quanto, em quem, ou quando iniciar.

-----

## 9. Triagem SaMD por módulo (firewall)

|Permitido (educacional)                           |Proibido (cruzaria para SaMD)                           |
|--------------------------------------------------|--------------------------------------------------------|
|“DO₂ cai porque o termo X quebrou”                |“este paciente precisa de volume agora”                 |
|“noradrenalina age na RVS”                        |“inicie noradrenalina a X µg/kg/min”                    |
|“por que a dose escala com o paciente” (mecanismo)|tabela de dose, alvo terapêutico, peso predito acionável|
|simular curvas com parâmetros que o aluno escolhe |classificar/rotear um caso real em conduta              |
|o caso-semente como **caso trabalhado didático**  |recomendação de conduta para um paciente específico     |

→ Antes de cada engine: **triagem explícita.** Se o engine começa a rotear caso → conduta, parou de ensinar mecanismo e virou suporte à decisão → redesenhar.

-----

## 10. Honestidades de modelo (no próprio artefato)

→ **Monocompartimental/idealizado:** Guyton e Starling são modelos lineares-por-trechos; a circulação real tem complacência venosa não-linear, interdependência ventricular, zonas de West afetando o RV. Declarar.
→ **SvO₂/extração** no séptico: o paradoxo (extração baixa com tecido faminto) é microcirculatório/mitocondrial — o modelo macro não captura a heterogeneidade; dizer que é simplificação.
→ **Lactato** não é só anaerobiose: tipo B (β2-agonista, como discutido no caso-semente), depuração hepática, etc. Não reduzir lactato a “hipoperfusão”.
→ **Severinghaus reaproveitado** assume curva normal; co-oximetria real (carboxi/metaHb) foge do modelo.

-----

## 11. Referências fisiológicas (âncoras)

Equação do conteúdo de O₂ · equação de Fick · curva de Severinghaus (P50, Bohr) · curvas de Frank-Starling · **modelo de retorno venoso de Guyton** (Pmsf, resistência ao retorno venoso) · análise de alça pressão-volume (Ea/Ees, Sunagawa) · curva de dependência VO₂/DO₂ e DO₂crítico · índice de choque · os quatro perfis hemodinâmicos clássicos.

-----

*Para a Dani.*