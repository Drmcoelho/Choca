# M30+ · Sistema de Avaliação de Domínio — Plano de construção (Step 0)

> **Tese do salto.** O `M30_ASSESSMENT_SPEC.md` pede um *exame* de 100 questões. Esta proposta cumpre **toda** a constituição vigente e a **excede**: transforma o M30 num **sistema de avaliação de domínio** — banco com o **triplo do tamanho (300 itens)**, **dobro da robustez psicométrica**, e cinco inovações que nenhum módulo anterior tem. Nada aqui afrouxa o firewall SaMD nem a regra "mecanismo, não conduta".

O critério-mãe permanece: *quem passa não decorou o curso — internalizou o mapa causal.* O que muda é que agora o sistema **prova** isso, **mede onde o mapa tem buracos** e **devolve a rota de remediação**.

---

## 0. O que é "mais que robusto" aqui

| Eixo | Spec vigente (M30) | M30+ (esta proposta) |
|---|---|---|
| Tamanho | 100 itens | **300 itens** (×3) |
| Formatos | 1 (SBA-MCQ) | **6 formatos** (SBA, asserção-razão, V/F-cluster, estimativa computada, "ache a pegadinha", vinheta de 2 passos) |
| Gabarito provado | revisão humana | **itens engine-grounded**: o validador **recomputa** a resposta pelos motores m1/m8/m9/m28/m29 |
| Saída | nota /100 | **radar de maestria** em 8 eixos + veredito de domínio + **remediação** ligada ao módulo |
| Auditorias do validador | ~11 obrigatórias + ~5 desejáveis | **~24 auditorias** (×2): + recomputação, + monotonia de dificuldade, + distribuição por quarto, + piso de cobertura, + cobertura da taxonomia de armadilhas, + determinismo do embaralhamento semeado, + paridade de comprimento correta×distratores |
| Ordem | aleatória/crescente (manual) | **embaralhamento semeado determinístico** (LCG): parece aleatório, é auditável e reproduzível |

---

## 1. As cinco inovações (o "surprise")

1. **Itens engine-grounded (física viva dentro da prova).** Uma classe de itens tem a resposta **computada** pelos motores já testados — `model29.cascade/brokenTerm/appropriate`, `model1` (CaO₂/DO₂), `model9` (PAM=DC×RVS), `model28` (conversão dose↔mL/h, §11). O `validate30` **recomputa** o item e exige que o gabarito declarado **bata com o motor**. Resultado: esses gabaritos são **provadamente corretos** — impossível erro humano, 100% auditável. Nenhum exame médico costuma ter isto.

2. **Radar de maestria + veredito de domínio.** Cada item é etiquetado por **eixo de competência** (8). Ao fim, o aluno recebe um **radar** (% por eixo), um **veredito** ("domínio sólido" / "lacuna em microcirculação & lactato") e **links de remediação** para os módulos fracos. Avalia-se o *mapa*, não só o placar.

3. **Seis formatos de item.** Além do SBA-MCQ: **asserção-razão** (alta discriminação), **V/F-cluster** (caso dinâmico, herdando o motor do M28/M29), **estimativa computada** (escolher o valor mais próximo, gerado pelo motor), **"ache a pegadinha"** (identificar a alternativa que encarna uma armadilha nomeada) e **vinheta de 2 passos** (a resposta do passo 1 condiciona o passo 2).

4. **Psicometria anti-gaming de 2ª ordem.** Não basta gabarito sem padrão: o validador mede **discriminação por dificuldade** (monotonia por quarto), **paridade de comprimento** entre correta e distratores (correta-mais-longa < 30%), **varredura de corridas de letra**, **distribuição por quarto** (não só global), **guarda de maior-número-correto**, **termos absolutos**, **atalhos "todas/nenhuma"**, e **cobertura da taxonomia de 16 armadilhas** (cada armadilha testada ≥ N vezes).

5. **Embaralhamento semeado determinístico.** Um **LCG** minúsculo gera a ordem dos módulos dentro de cada quarto a partir de uma *seed*. A prova *parece* aleatória ao aluno, mas é **reproduzível e auditável** — o validador replica a seed e confere que a ordem não cria padrão e não segue M0→M29.

---

## 2. Os 8 eixos de competência (radar)

```text
E1 · Conteúdo & transporte        (M0–M2)   CaO₂, curva de O₂, régua quantitativa
E2 · Determinantes do débito      (M3–M8)   Guyton, Starling, pós-carga, DO₂/VO₂
E3 · Inversão & beira-leito        (M9–M11)  PAM=DC×RVS, monitorização, POCUS
E4 · Microcirculação & lactato    (M12–M13) extração, shunt, lactato tipo A/B
E5 · Categorias de choque         (M14–M22) hipo, cardio, VD, obstrutivo, distributivo+subtipos
E6 · Integração & mistos          (M23–M27) misto, coração-pulmão, ressuscitação, críptico, perfis
E7 · Alavancas (farmacologia §11) (M28)     receptor→termo, referência educacional
E8 · Síntese / capstone           (M29)     cascata integrada, decompor→alavanca→custo
```

## 3. Taxonomia de armadilhas (16) — cada distrator mapeia uma

```text
T01 número ≠ mecanismo            T09 pós-carga ≠ PA
T02 PAM ≠ perfusão                T10 procedimento ≠ indicação
T03 conteúdo ≠ saturação          T11 mecanismo farmacológico ≠ dose (firewall)
T04 responsivo ≠ tolerante        T12 lactato alto ≠ sempre hipóxia (A×B)
T05 distributivo ≠ séptico        T13 supply-independent × dependent
T06 SvO₂ alta ≠ boa extração      T14 pressor melhora macro ≠ micro
T07 hipotensão ≠ hipovolemia      T15 a mais longa/“mais técnica” ≠ correta (meta)
T08 VD ≠ VE                       T16 referência educacional ≠ prescrição (§11)
```

O validador exige que **cada armadilha** apareça como conceito testado em **≥ 8 itens** (cobertura da taxonomia).

---

## 4. Composição dos 300 itens

Por **formato** (auditado):

```text
SBA-MCQ              ~165
engine-grounded       ~45   (estimativa computada + SBA recomputado)
asserção-razão        ~30
"ache a pegadinha"    ~25
vinheta de 2 passos   ~20   (cada uma = 2 itens encadeados)
V/F-cluster           ~15   (clusters; cada um conta como item-mãe com sub-assertivas)
```

Por **dificuldade** (4 estratos, montados em ordem crescente na prova):

```text
D1 reconhecimento/decomposição   ~75
D2 aplicação/contraste           ~75
D3 integração/conflito           ~75
D4 exceção/simultaneidade        ~75
```

Por **eixo** (piso de cobertura — nenhum eixo abaixo do mínimo):

```text
E1 ≥25  E2 ≥40  E3 ≥35  E4 ≥25  E5 ≥60  E6 ≥45  E7 ≥25  E8 ≥30   (soma ≥ 285; folga p/ ajuste)
```

Distribuição de letras (constituição §4, mantida e endurecida): **cada letra 15–35% do total**, assimétrica, **e** sem padrão **por quarto**; correta-mais-longa **< 30%**.

---

## 5. Arquitetura de arquivos (engine antes de pixel)

```text
build/m30/
  bank30.js        # os 300 itens (dados + metadados §10 estendido), montados pelos 6 partes
  psyche30.js      # motor psicométrico PURO: LCG semeado, distribuição A/B/C/D (global+quarto),
                   #   varredura de padrões (corridas, sequências, maior-número, absolutos, todas/nenhuma),
                   #   paridade de comprimento, monotonia de dificuldade, piso de cobertura, taxonomia
  grounding30.js   # verificação engine-grounded: recomputa o subconjunto via m1/m8/m9/m28/m29
  scoring30.js     # maestria: agrega acertos por eixo → radar + veredito + remediação
  test30.node.js   # testa psyche30 + grounding30 + scoring30 + invariантes do banco
  validate30.js    # jsdom: estrutura do HTML + auditoria psicométrica (~24 checagens) + SaMD
perfunde30.html    # UI single-file: 4 quartos, 6 formatos, radar de maestria, modo revisão, seed
PLAN.md            # este documento
```

Metadados por item (estende o §10 da spec):

```json
{ "id":"m30_q001", "format":"sba|ar|vf|est|trap|vignette", "quarter":1, "difficulty":1,
  "axis":"E3", "modules":["M9","M20"], "concepts":["MAP","CO","SVR"], "trap":"T02",
  "grounded": { "engine":"model29", "call":"brokenTerm", "args":{...}, "expect":"rvs" } | null,
  "stem":"...", "options":{"A":"...","B":"...","C":"...","D":"..."}, "answer":"C",
  "rationale": { "correct":"...", "A":"...", "B":"...", "C":"...", "D":"...", "trap":"...", "concept":"..." } }
```

> **Firewall.** `grounded.engine` só chama motores **mecanísticos**; nenhum item carrega dose imperativa, prescrição ou conduta individualizada. O `validate30` roda os mesmos scanners de firewall do M28/M29 sobre os 300 itens.

---

## 6. Validador psicométrico (~24 auditorias = dobro)

**Obrigatórias (constituição §11):** 300 itens; 4 quartos; A/B/C/D; uma única correta; cada letra 15–35%; sem padrão por quarto; sem corrida longa de letra; sem repetição mecânica de módulo; metadados presentes; rationale das 4 + correta; **zero dose/conduta**.

**De 2ª ordem (o reforço):** recomputação engine-grounded (gabarito = motor); monotonia de dificuldade por quarto; distribuição de letras **por quarto**; correta-mais-longa < 30%; maior-número-correto < limiar; varredura de termos absolutos; sem "todas/nenhuma"; paridade de comprimento correta×distratores; piso de cobertura por eixo; cobertura da taxonomia (cada T ≥ 8); diversidade de formato por quarto; determinismo do embaralhamento semeado (replay); unicidade de enunciados; mapeamento distrator→armadilha completo; rationale de 5 camadas presente em **todos**.

O validador imprime `N OK · M falhas` e sai 1 se `M>0`. Entra no `npm run check`.

---

## 7. Construção em partes (6 entregas, auditadas entre si)

O usuário pediu "em partes". Cada parte é um PR auditado antes da próxima.

```text
Parte 1 · itens 1–50    + INFRA: psyche30.js, grounding30.js, scoring30.js, validate30 esqueleto.
                          Eixos E1–E2 (fundamentos/determinantes) + 1º lote engine-grounded (CaO₂/DO₂).
Parte 2 · itens 51–100   E3–E4 (inversão/beira-leito, micro/lactato) + grounded PAM=DC×RVS.
Parte 3 · itens 101–150  E5a (hipo, cardio, VD, obstrutivo) + vinhetas de 2 passos.
Parte 4 · itens 151–200  E5b (distributivo, séptico, anaf×neuro) + V/F-clusters.
Parte 5 · itens 201–250  E6 (misto, coração-pulmão, ressuscitação, críptico, perfis) + asserção-razão.
Parte 6 · itens 251–300  E7–E8 (alavancas §11 + capstone) + RADAR de maestria/remediação + AUDITORIA GLOBAL final
                          (distribuição, cobertura, dificuldade, padrões, gabaritos) e publicação do HTML.
```

Entre partes: roda-se a auditoria parcial (distribuição/cobertura/firewall do acumulado) — nada avança com padrão explorável.

---

## 8. UI do `perfunde30.html` (single-file, offline)

```text
Abas: 1 Exame (4 quartos, 6 formatos, navegação + barra de progresso)
      2 Maestria (radar dos 8 eixos + veredito + remediação por módulo)  — aparece ao concluir
      3 Revisão (refazer as erradas; gabarito de 5 camadas por item)
      4 Como funciona (honestidade: itens computados, seed, sem padrão, firewall §11)
Seed visível/auditável · sem localStorage · cromo de série (backlink/kicker/pontes/rodapé).
```

## 9. Critério de excelência (elevado)

O M30+ está excelente quando, além de tudo que a spec §13 exige: **nenhum gabarito engine-grounded pode divergir do motor**; **cada eixo e cada armadilha têm cobertura mínima**; a **dificuldade cresce por raciocínio** (medida, não declarada); o aluno sai com um **mapa dos próprios buracos** e a rota para fechá-los; e a prova é **reproduzível por seed** sem jamais ser previsível.

## 10. Riscos & mitigações

```text
risco: 300 itens com gabarito frouxo → mitigação: engine-grounded + rationale de 5 camadas + auditoria por parte
risco: padrão de letra emergente ao crescer o banco → mitigação: psyche30 recalcula distribuição a cada parte
risco: dificuldade "por enunciado longo" → mitigação: paridade de comprimento + dificuldade medida
risco: HTML gigante → mitigação: bancos em build/m30 inlinados; UI enxuta; mesmo rito do M28/M29
risco: firewall → mitigação: scanners de dose/conduta sobre os 300, grounded só em motor mecanístico
```

## 11. Step 1 proposto (quando você der o sinal)

Construir a **Parte 1 (itens 1–50)** **junto com a infraestrutura** (`psyche30.js` + `grounding30.js` + `scoring30.js` + esqueleto do `validate30.js` + `test30.node.js`), provando o conceito engine-grounded e o motor psicométrico antes de escalar. PR auditado; só então a Parte 2.

---

*Tudo sob `PERFUNDA.md`/`SAFETY.md`: mecanismo, nunca conduta. O M30+ mede o domínio do mapa causal — não prescreve.*
