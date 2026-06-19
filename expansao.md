# expansao.md — O atlas farmacológico do Choque · PERFUNDE · CHOCA

**Status:** **aprovado · em construção** (decisões fechadas em 2026-06-18).
**Origem:** consolidação da expansão do M28 em hub farmacológico + abas Surviving no M21.
**Fronteira:** tudo aqui obedece ao `SAFETY.md §11` (referência farmacológica educacional) e ao `PERFUNDA.md` (engine antes de UI; física viva; single-file).

**Decisões fechadas:**
- **Identidade:** submódulos como **sub-IDs `28A…28H`** aninhados no hub M28 (`published_range` segue `[0,30]`; não renumera o braço).
- **Execução:** construir **a expansão inteira**, em fases verdes (PR-0…PR-7), começando pela fundação (o motor).
- **28C (1ª passada):** **só vasopressina**. Angiotensina II e azul de metileno/hidroxocobalamina ficam como **stubs planejados** (rotulados excepcional-resgate), não entram agora.

---

## 0.1 Estado real do M28 (achado da construção)

O `perfunde28.html` **já é um dos módulos mais ricos** do braço: 7 abas (Caso, Trilha,
Instrumento, Lab, Avaliação, **Farmácia**, **Casos V/F**), um engine receptor→termo
(`build/m28/model28.js`: `terms`, `applyDrug`, `appropriate`, `AGENTS`), a calculadora
§11 (`pharm28.js`) e 100 assertivas V/F. O "pequeno demais" é de **cobertura conceitual**
(mais agentes, fenótipos, dobutamina a fundo, Surviving), não de tamanho de arquivo.

Consequência de engenharia: havia o risco de **dois modelos receptor→termo divergentes**
(`model28.terms` Wood-ish × `source/core/pharmacodynamics`). Por isso a 1ª onda da
construção **reconcilia** os dois por conformância direcional (mesmo sinal de RVS/contr/FC
e mesmo termo dominante por agente) antes de erguer qualquer submódulo sobre o motor.

## 0. Tese da expansão

O M28, hoje, é um **substantivo**: "vasopressores & inotrópicos" como lista anotada. A expansão o torna um **verbo**: a camada que move os termos da equação inteira do braço.

```text
PAM = DC × RVS          (m9)
DO₂ = DC × CaO₂         (m1/m0)
VO₂ / extração / lactato / microcirculação   (m8/m12/m21)
```

Uma droga vasoativa não "sobe a pressão". Ela aplica um vetor de efeitos dose-dependentes sobre **esses termos** — e o desfecho clínico é a soma desses efeitos sobre a cascata. O atlas ensina farmacologia hemodinâmica como **mecânica computável**, não como prescrição decorada.

> **M28 deixa de ser um módulo e vira o painel de controle farmacológico do Choca.**
> `perfunde28.html` é mantido por compatibilidade, mas muda de papel: de módulo único → **hub** do atlas.

---

## 1. Princípios inviáveis (não-negociáveis)

1. **Engine-grounded.** Toda matriz, todo combo, toda lição ("ganha fluxo, perde pressão") é **computada** por um motor puro e testável — não afirmada em prosa. Reusa o rito do braço: `engine → teste Node → HTML single-file → validador jsdom → guardião`.
2. **Firewall SaMD (`§11`).** Mecanismo e **referência** sim (diluições usuais, faixas de dose, conversão dose↔mL/h, interações, usos inusitados/iatrogênicos). Ordem imperativa individualizada, alvo para paciente real e roteamento estado-real→conduta→dose: **não**. Peso é sempre **hipotético**.
3. **Física viva / single-file.** Cada submódulo é um `perfundeNN?.html` autossuficiente, offline, sem `localStorage`, com instrumento computado ao vivo.
4. **A diretriz é camada, não substituto.** A aba Surviving Sepsis é uma **camada de guideline sobreposta ao motor fisiológico**, ancorada ao termo que cada recomendação move — nunca "protocolo sem fisiologia".

---

## 2. Arquitetura de arquivos

```text
perfunde28.html      HUB · "Farmacologia hemodinâmica" (mapa do atlas + instrumento integrador)
perfunde28a.html     28A · Gramática farmacodinâmica (receptor → termo → consequência)
perfunde28b.html     28B · Vasopressores catecolaminérgicos
perfunde28c.html     28C · Vasopressores não catecolaminérgicos
perfunde28d.html     28D · Inotrópicos
perfunde28e.html     28E · Dobutamina · droga-mestra de integração
perfunde28f.html     28F · Inodilatadores & vasodilatadores
perfunde28g.html     28G · Combinações por fenótipo (a joia)
perfunde28h.html     28H · Segurança operacional (referência §11)
perfunde21.html      M21 séptico ganha abas (inclui Surviving Sepsis)
```

O hub não duplica conteúdo: ele **orquestra**. Traz o mapa dos 8 submódulos, o instrumento integrador (uma droga/combo → vetor sobre a equação → perfil resultante) e as pontes para M9/M21/M23/M24/M27/M29.

---

## 3. O motor compartilhado — `source/core/pharmacodynamics.js`

**O coração técnico da expansão.** Sem ele, o atlas é "lista de drogas"; com ele, é física.

### 3.1 Modelo

Cada droga é um **vetor de efeitos dose-dependentes** sobre os termos da equação. O receptor é a *fonte* do efeito; o termo é o *destino*.

```text
receptor → termo da equação
  α1            → RVS ↑            (e pós-carga de VE ↑)
  β1            → contratilidade ↑ , FC ↑
  β2            → RVS ↓ (vasodilata), FC ↑, lactato tipo B ↑
  D1            → fluxo esplâncnico/renal (dose baixa)
  V1            → RVS ↑ (não-adrenérgico, poupa catecolamina)
  PDE-3 (inib.) → contratilidade ↑ + RVS ↓ (inodilatador)
  Ca²⁺-sensib.  → contratilidade ↑ sem ↑ demanda de O₂
  NO/cGMP       → RVS ↓ / venodilatação (vasodilatadores; azul de metileno bloqueia)
```

A droga, numa dose `d`, produz `effect(drug, d) = { dRVS, dDC, dFC, dContr, dLactato, dPVR, dMVO2, ... }` por interpolação na faixa usual (`doseMin..doseMax` do `DRUGS` já existente em `pharm28.js`). Os **combos** (28G) são a **composição** desses vetores: `compose([{drug,dose}, ...])` soma os efeitos sobre cada termo e devolve o perfil hemodinâmico resultante (fluxo × congestão × pressão), reaproveitando os engines `m9` (PAM=DC×RVS), `m7` (pós-carga/alça PV) e `m21/m23` (extração/déficit).

### 3.2 O que isso destrava (engine-grounded de verdade)

- **28B/28D matrizes:** as colunas (RVS, DC, FC, lactato, arritmia, pós-carga VD/VE…) são **lidas do motor**, não digitadas.
- **28E dobutamina:** a lição "aumenta DC mas pode cair a PA por β2 se o leito está vasoplégico" vira um **instrumento**: desliza a vasoplegia de base e vê a PAM computada cair — e vê a noradrenalina ("chão vascular") recuperá-la. Computado.
- **28G fenótipos:** cada combinação é um vetor composto; o aluno compara geometrias hemodinâmicas, não nomes.
- **Conformância (silver):** `test:core` ganha conformância `pharmacodynamics × pharm28` (as drogas, diluições e conversões batem com o engine do M28 já publicado).

### 3.3 Fronteira no motor

O `pharmacodynamics.js` modela **efeito sobre termos** (mecanismo) e **referência** (faixas/diluições). Ele **não** recebe estado de paciente real para decidir conduta. A função `compose` devolve *perfil fisiológico*, nunca "a conduta para fulano".

---

## 4. Os submódulos

Cada submódulo segue o contrato (`MODULE_CONTRACT.md`): caso/abertura, trilha socrática, instrumento vivo, matriz/lab, banco MCQ com gabarito robusto, pontes, honestidade do modelo, rodapé, engine+teste+validador. Banco-alvo sugerido: **20–40 MCQ por submódulo** (28D/28E/28G maiores), no padrão psicométrico do braço (distribuição desproporcional, correta≠mais-longa, armadilhas T01–T16).

### 28A — Gramática farmacodinâmica · **ENTREGUE** (`perfunde28a.html`)
**Tese:** droga não é "sobe pressão"; é um operador sobre termos. Receptor → efeito hemodinâmico → consequência clínica.
**Cobre:** α1, β1, β2, V1, PDE-3 (núcleo da gramática; D1/Ca²⁺-sensib./NO-cGMP/angiotensina entram nos submódulos seguintes).
**Instrumento:** mixer de receptores (sliders α1/β1/β2/V1/PDE-3) → termos movidos ao vivo (dRVS/contratilidade/FC) + termo dominante + glossário. Lab carrega os 6 agentes pelo perfil.
**Engine:** `build/m28a/model28a.js` — gramática receptor→termo, **conforme `model28`** (test28a: bateria 5⁵ + dominante). Banco de 9 MCQ (A2·B4·C1·D2; correta nunca a mais longa). Firewall §11 (sem dose, sem ordem individualizada).
**Padrão do submódulo estabelecido:** engine puro + teste Node (conformância) + HTML single-file + validador jsdom + wiring `test:28a`/`validate:28a`.

### 28B — Vasopressores catecolaminérgicos
**Drogas:** noradrenalina, adrenalina, dopamina, fenilefrina.
**Matriz computada:** RVS, DC, FC, lactato, arritmia, esplâncnico, pele, rim, pós-carga VD/VE.
**Armadilha-chave:** fenilefrina (α1 puro) sobe pós-carga e pode afundar a bomba fraca; dopamina = mais arritmia.

### 28C — Vasopressores não catecolaminérgicos
**1ª passada (fechada): só vasopressina (V1)** — adjuvante poupador de catecolamina, dose fixa (não por peso).
**Stubs planejados (excepcional-resgate, não entram agora):** terlipressina, angiotensina II (2ª linha conceitual), azul de metileno / hidroxocobalamina (vasoplegia refratária). Quando entrarem, com enquadramento de papel obrigatório (§10).

### 28D — Inotrópicos
**Drogas:** dobutamina, milrinona, levosimendana, adrenalina (dose inotrópica), dopamina (histórica/evitável).
**Tese:** aqui mora o erro mais comum — tratar débito baixo como se todo choque fosse vasoplegia. Submódulo grande.

### 28E — Dobutamina · droga-mestra de integração
**Por que submódulo próprio:** é a droga que ensina a diferença entre **aumentar fluxo** e **perder pressão**. β1 (contratilidade↑, DC↑, FC↑) + β2 (RVS↓ → PA pode cair no leito vasoplégico) → frequentemente precisa de "chão vascular" (noradrenalina/vasopressina).
**Instrumento:** vasoplegia de base como slider → PAM computada cai com dobutamina sozinha, recupera com noradrenalina. A síntese do choque misto.
**Casos:** cardiogênico+séptico, baixo débito pós-IAM, miocardiopatia séptica, VD, hipertensão pulmonar, pós-intubação.

### 28F — Inodilatadores & vasodilatadores
**Drogas:** milrinona, nitroglicerina, nitroprussiato, (clevidipina/nicardipina como contexto).
**Tese (mecânica, não prescrição):** combinar inotrópico com vaso/venodilatador quando o problema é pós-carga, congestão, hipertensão, EAP, falência de VE, ou VD com afterload pulmonar.

### 28G — Combinações por fenótipo (a joia)
**Pergunta:** não "qual droga?", mas "**qual geometria hemodinâmica?**". Cada fenótipo é um combo composto pelo motor:

```text
séptico quente/vasoplégico   → nora ± vasopressina; considerar adrenalina; corticoide conforme refratariedade
séptico baixo débito/miocard.→ nora (PAM) + dobutamina (se hipoperfusão com débito baixo)
cardiogênico frio/congesto   → inotrópico ± vasodilatador (se PA permite); nora se hipotenso
VD/TEP/hipertensão pulmonar  → nora (perfusão coronariana do VD); dobuta/milrinona com cautela; evitar colapso de RVS
misto pós-intubação          → sedação + pressão positiva + retorno venoso + pós-carga VD + vasoplegia
anafilaxia/neurogênico       → adrenalina/fenilefrina/nora conforme mecanismo (fisiologia explícita)
```

### 28H — Segurança operacional (referência §11)
**Cobre (como REFERÊNCIA educacional):** diluições e faixas usuais, acesso periférico/central, extravasamento, compatibilidade, titulação como **faixa**, metas, lactato falso por β2, arritmia, isquemia periférica, taquicardia, desmame de vasopressor, quando **considerar** adicionar vasopressina, quando **considerar** parar dobutamina.
**Enquadramento §11.3 obrigatório** em toda exibição (rotulada referência; "confira o protocolo da sua instituição"; não é prescrição; peso hipotético; dose como faixa). Sem imperativo individualizado.

---

## 5. M21 séptico ganha abas (+ Surviving Sepsis)

`perfunde21.html` passa de monólito para abas, com a Surviving como **camada de diretriz sobre o motor**:

```text
Fisiologia       — vasoplegia, endotélio, microcirculação, disóxia, lactato, capillary leak, miocardiopatia séptica
Reconhecimento   — infecção suspeita, disfunção orgânica, hipotensão, lactato, hipoperfusão (pele, diurese, mental)
Surviving Sepsis — bundle, antibiótico, cultura, lactato, fluido, vasopressor, fonte, reavaliação
Hemodinâmica     — noradrenalina, vasopressina, adrenalina, dobutamina, hidrocortisona, metas (reusa o motor 28)
Casos            — quente/vasoplégico, frio/baixo débito, idoso cardiopata, DRC, EAP+sepse, pós-intubação
```

**Âncora da Surviving Sepsis Campaign (SSC):** eixo internacional mais reconhecido para organização do cuidado; as diretrizes adultas abrangentes mais citadas foram atualizadas em **2021**. Sustentam **noradrenalina como vasopressor inicial**, **vasopressina/adrenalina como adjuvantes**, e **dobutamina quando há disfunção cardíaca / baixo débito com hipoperfusão persistente**. A aba apresenta isso como **diretriz rotulada**, cada item amarrado ao termo fisiológico que ele move — não como ordem.

---

## 6. Fronteira SaMD — reconciliação operacional

| Quero ensinar | Permitido (§11.1) | Como, sem furar (§11.2/§11.3) |
|---|---|---|
| Diluição/faixa de dose | sim, como referência | rotular "referência educacional"; faixa, não "a dose dele" |
| Conversão dose↔mL/h | sim (calculadora) | peso **hipotético**; aritmética pura; não recebe estado clínico |
| Titulação | sim, como **faixa** | nunca "titule para X neste paciente" |
| Combinações/fenótipo | sim (mecanismo) | "esta geometria move estes termos"; não "prescreva isto" |
| Surviving bundle | sim (diretriz rotulada) | "a diretriz recomenda…; confira seu protocolo"; ancorado ao termo |
| Usos inusitados/iatrogênicos | sim (educação) | mecanismo; rótulo de raridade/risco |

**Guardião transversal já cobre o firewall** (`IMPERATIVE_RE` em `source/core/guards.js`): qualquer ordem imperativa individualizada que vazar para um `perfunde28?.html` faz o `npm run qa` falhar. A expansão **herda** essa rede automaticamente.

---

## 7. Curriculum, guardião e wiring

- **`curriculum.json`:** M28 ganha `submodules: [28A…28H]` (sub-IDs, **não** novos inteiros — `published_range` segue `[0,30]`). Cada submódulo: `file`, `title`, `status`, `risk` (§5 do SAFETY), `samd_layer: "§11"`.
- **`package.json`:** `test:28a…28h` e `validate:28a…28h`; `test:core` ganha a conformância `pharmacodynamics × pharm28`.
- **Guardião (`build/qa/qa.js`):** estende para entender hub↔submódulo —
  ```text
  [+] hub perfunde28.html linka todos os 28A…28H; cada submódulo tem backlink ao hub e ao índice
  [+] cromo de série, a11y, andaime de UI e tutor socrático valem para cada perfunde28?.html
  [+] firewall §11: todo perfunde28?.html que exibe dose tem o enquadramento §11.3 (rótulo referência + "protocolo da instituição")
  [+] MCQ por submódulo no padrão psicométrico (letras 15–35%, correta≠mais-longa)
  [+] M21 com a aba Surviving rotulada como diretriz educacional
  ```
- **Índice (`perfunde.html`):** o card do M28 abre o hub; submódulos acessíveis a partir dele.

---

## 8. Faseamento em PRs (sequência recomendada)

Cada fase é um PR com portão verde (`npm run check`), respeitando o rito de build.

```text
PR-0  [ENTREGUE] expansao.md + source/core/pharmacodynamics.js (motor + conformância × pharm28)
PR-1  [ENTREGUE] reconciliação do modelo receptor→termo (PD × model28) + índice de dois
                 antebraços no guardião (perfunde.html + choca.html)
PR-2  [ENTREGUE] perfunde28.html vira HUB (atlas-nav) + 28A (gramática) — padrão do submódulo
                 estabelecido: engine build/m28a (conforma model28) + jsdom + test:28a/validate:28a
PR-3  28D (inotrópicos) + 28E (dobutamina, a joia integradora)
PR-4  28B + 28C (só vasopressina)
PR-5  28F (inodilatadores) + 28G (combinações por fenótipo)
PR-6  28H (segurança operacional · §11)
PR-7  M21 abas + Surviving Sepsis
PR-8  guardião entende hub/submódulos + curriculum.json + docs (reconciliação final)
```

Racional da ordem: **motor primeiro** (sem ele tudo vira lista); depois a **fundação pedagógica** (28A) e a **joia** (28E) que prova o valor; vasopressores e combinações na sequência; segurança e Surviving por último, já sobre uma base engine-grounded e com o guardião de rede.

---

## 9. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Virar "lista de drogas" / protocolo decorado | motor `pharmacodynamics.js` obrigatório; tudo computado |
| Drift do firewall em 8 arquivos novos | guardião §11 transversal já falha o CI; checagem do enquadramento §11.3 |
| Escopo enorme / fadiga | faseamento em 8 PRs pequenos e verdes; cada um entrega valor isolado |
| Gabaritos quebrando ao crescer | padrão psicométrico travado pelo guardião (letras 15–35%, correta≠longa) por submódulo |
| Acurácia clínica do conteúdo de referência | faixas declaradas "de referência, variam por fonte"; SSC 2021 como âncora datada |
| Manutenção do hub↔submódulo | guardião valida links hub↔submódulo e cromo automaticamente |

---

## 10. Glossário de papéis (obrigatório no conteúdo)

Para não achatar tudo em "drogas", todo agente é rotulado por papel:

```text
ROTINA            noradrenalina (1ª linha), dobutamina (disfunção cardíaca/baixo débito)
UTI SOFISTICADA   vasopressina adjuvante, milrinona/levosimendana, adrenalina
EXCEPCIONAL/RESGATE  angiotensina II (2ª linha conceitual), azul de metileno / hidroxocobalamina (vasoplegia refratária), terlipressina
```

---

## 11. Decisões em aberto (com recomendação)

1. **Identidade dos submódulos no currículo** — *recomendo* sub-IDs `28A…28H` aninhados em M28 (mantém `published_range [0,30]`, evita renumerar o braço). _Alternativa:_ promovê-los a inteiros M31…M38 (mais pesado; muda numeração).
2. **Onde começar a construção** — *recomendo* PR-0 (motor) → PR-1 (hub+28A) → PR-2 (28D+28E). _Alternativa:_ começar pela joia 28E como prova-de-conceito.
3. **Escopo de 28C** — *recomendo* incluir angiotensina II e azul de metileno **como conceito/resgate rotulado**, não como rotina. Confirmar se entra agora ou fica como "stub planejado".
4. **Banco por submódulo** — *recomendo* 20–40 MCQ; 28D/28E/28G maiores. Confirmar o alvo.
5. **M21** — *recomendo* abas + Surviving num PR próprio (PR-6), depois do motor, para a aba Hemodinâmica reusar `pharmacodynamics.js`.

---

*Este documento é vivo. Ao fechar cada decisão do §11 (aqui o §11 deste arquivo, não o do SAFETY), promover de "proposta em maturação" para "aprovado · em construção" e abrir o PR-0.*
