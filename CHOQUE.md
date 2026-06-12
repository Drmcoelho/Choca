# CHOQUE.md — Domínio clínico-fisiológico · **PERFUNDE · CHOCA**

> O “quê” do braço 2: fisiologia, taxonomia, motores, âncoras de validação e honestidades de modelo.
> Constituição → `PERFUNDA.md`. Blueprint modular → `modulos.md`. Execução → `AGENTS.md`. Fronteira clínica → `SAFETY.md`.

---

## 1. Propósito

Transformar choque de lista decorada em eixo causal quantitativo.

A cadeia é:

```text
CaO₂ → DO₂ → extração → VO₂ → ATP/lactato
```

A leitura hemodinâmica é:

```text
PAM = PVC + DC · RVS
```

Cada tipo de choque corresponde a uma quebra localizada — ou combinação de quebras — nessa cadeia.

---

## 2. Fisiologia nuclear

### 2.1 Conteúdo arterial de oxigênio

```text
CaO₂ = 1,34 · Hb · SaO₂ + 0,003 · PaO₂
```

Erro que o módulo corrige: confundir PaO₂/SpO₂ com conteúdo. Anemia pode produzir hipóxia tecidual com saturação aparentemente ótima.

### 2.2 Entrega de oxigênio

```text
DO₂ = DC · CaO₂ · 10
```

Erro que o módulo corrige: achar que oxigenação pulmonar normal garante entrega. Sem fluxo ou sem conteúdo, o tecido não recebe O₂ suficiente.

### 2.3 Débito cardíaco

```text
DC = FC · VS
```

Erro que o módulo corrige: interpretar taquicardia como força. Frequência alta pode reduzir enchimento e derrubar volume sistólico.

### 2.4 Pré-carga como ponto de operação

Pré-carga não é PVC isolada. O ponto real emerge da interseção entre retorno venoso e função cardíaca.

```text
retorno venoso ≈ (Pmsf − PVC) / Rvr
```

Erro que o módulo corrige: tratar PVC como sinônimo de volume ou responsividade.

### 2.5 Pós-carga e alça PV

Pós-carga não é simplesmente “a pressão”. É a carga contra a ejeção. No cardiogênico, reduzir pós-carga pode aumentar DC apesar de reduzir pressão.

Erro que o módulo corrige: pensar que PA maior sempre significa ejeção melhor.

### 2.6 Extração e consumo

```text
VO₂  = DC · (CaO₂ − CvO₂) · 10
O₂ER = VO₂ / DO₂
SvO₂ ≈ SaO₂ · (1 − O₂ER)
```

Interpretação:

```text
SvO₂ baixa → extração alta → entrega insuficiente ou demanda alta
SvO₂ alta + lactato↑ → extração/utilização falha → paradoxo séptico/distributivo
```

Erro que o módulo corrige: interpretar SvO₂ alta como perfusão necessariamente boa.

### 2.7 Lactato

Lactato é marcador de desequilíbrio entre produção e depuração, não um sinônimo automático de hipóxia pura.

Erros que o módulo corrige:

- lactato alto = sempre hipoxemia;
- lactato normal = sempre perfusão adequada;
- lactato isolado substitui decomposição fisiológica.

### 2.8 Macrocirculação e microcirculação

Macro restaurada não garante tecido perfundido.

```text
PAM/DC adequados ≠ capilar homogêneo ≠ mitocôndria usando O₂
```

Erro que o módulo corrige: encerrar o raciocínio quando a PAM melhora.

---

## 3. Taxonomia mecanística

| Categoria | Termo quebrado dominante | Assinatura causal | Erro clássico |
|---|---|---|---|
| Hipovolêmico | retorno venoso / pré-carga | DC↓, RVS↑, extração↑ | achar que todo responsivo tolera volume |
| Cardiogênico | bomba / contratilidade / alça PV | DC↓, pressões de enchimento↑, congestão | tratar PA como pós-carga simples |
| Obstrutivo | impedimento mecânico externo | DC↓ por enchimento/ejeção/retorno bloqueado | juntar tamponamento, TEP e pneumotórax como se fossem iguais |
| Distributivo | RVS↓ ± extração/utilização falha | DC normal/↑, RVS↓, ScvO₂/SvO₂ às vezes alta | achar que distributivo = séptico |
| Misto | mais de um termo quebrado | sinais sobrepostos | forçar rótulo único |

---

## 4. Escada canônica de módulos e engines

Esta é a numeração publicada e operacional. Ela prevalece sobre versões históricas.

### Bloco 0 · Fundamentos do transporte

| # | Módulo | Engine/foco | Âncora mínima |
|---|---|---|---|
| 0 | Matemática do transporte | identidades CaO₂/DO₂/Fick/O₂ER/PAM | aritmética fechada, unidades explícitas |
| 1 | Conteúdo de O₂ (CaO₂) | conteúdo Hb-ligado + dissolvido | Hb 15/SaO₂ 1/PaO₂ 100 ≈ 20 mL/dL |
| 2 | A curva como entrega | Severinghaus/Bohr pelo lado tecidual | P50, deslocamento e offloading |

### Bloco I · Determinantes

| # | Módulo | Engine/foco | Âncora mínima |
|---|---|---|---|
| 3 | Débito cardíaco | DC = FC × VS, teto da taquicardia | FC↑ extremo não aumenta DC indefinidamente |
| 4 | Interseção de Guyton | retorno venoso × função cardíaca | ponto de operação por interseção |
| 5 | Guyton aplicado | responsivo ≠ tolerante | volume desloca Pmsf; tolerância é outro eixo |
| 6 | Frank-Starling | curva saturante VS × pré-carga | porção ascendente vs platô |
| 7 | Pós-carga & alça PV | ESPVR/EDPVR/Ea/Ees | pós-carga muda VS e trabalho |
| 8 | DO₂/VO₂ & supply-dependence | curva bifásica VO₂×DO₂ | DO₂crítico e O₂ER |

### Bloco II · Inversão e leitura

| # | Módulo | Engine/foco | Âncora mínima |
|---|---|---|---|
| 9 | PAM = DC × RVS | decomposição macro | mesma PAM por mecânicas opostas |
| 10 | Monitorização hemodinâmica | origem e erro dos números | número medido ≠ verdade fisiológica |
| 11 | POCUS & acessos vasculares | janelas, linhas, CVC, artefatos | achado responde pergunta específica |
| 12 | A microcirculação | shunt, glicocálice, heterogeneidade | macro ok com tecido faminto |
| 13 | Lactato & depuração | produção × clearance × tipo A/B | lactato não é só hipóxia |

### Bloco III · Choques

| # | Módulo | Engine/foco | Âncora mínima |
|---|---|---|---|
| 14 | Hipovolêmico | retorno venoso/preload ↓ | DC↓, RVS↑, O₂ER↑ |
| 15 | Hemorrágico × não-hemorrágico | conteúdo + volume + terceiro espaço | sangue perdido não é só volume perdido |
| 16 | Cardiogênico | alça PV em falência | Ees↓, congestão, DC↓ |
| 17 | O ventrículo direito | interdependência e pós-carga de VD | D-shape, VD como bomba vulnerável |
| 18 | Obstrutivo | categoria | impedimento mecânico com DC↓ |
| 19 | Tamponamento · TEP · pneumotórax | três obstrutivos, três alívios | enchimento vs ejeção VD vs retorno venoso |
| 20 | Distributivo | RVS↓ + extração ambígua | DC alto não resgata PAM se RVS caiu |
| 21 | Séptico | macro × micro × mitocôndria | SvO₂ alta + lactato alto + déficit |
| 22 | Anafilático × neurogênico | dois distributivos não sépticos | leak/broncoespasmo vs simpaticólise/bradi |

### Bloco IV · Integração e resgate

| # | Módulo | Engine/foco | Âncora mínima |
|---|---|---|---|
| 23 | Choque misto | duas quebras simultâneas | séptico + cardiogênico etc. |
| 24 | O coração-pulmão | PEEP/VNI/pré/pós-carga | ponte forte com Ventila |
| 25 | Ressuscitação volêmica | custo do volume/glicocálice/fluid creep | mecanismo sem bolus prescritivo |
| 26 | Choque críptico/compensado | PAM normal mascarando falência | lactato/perfusão > PA isolada |
| 27 | Os 4 perfis · radar | frio/quente × seco/úmido | perfil como hipótese de termo quebrado |
| 28 | Vasopressores & inotrópicos | receptor → termo da equação | mecanismo, sem dose |
| 29 | Capstone · caso integrado | tutor gráfico dinâmico | múltiplos termos, múltiplas armadilhas |

---

## 5. Engines-jóia

### 5.1 Guyton

O engine de Guyton ensina que o ponto hemodinâmico não é uma variável isolada. Ele emerge da interseção entre retorno venoso e função cardíaca.

Invariantes:

```text
PVC → Pmsf reduz retorno venoso
volume ↑ desloca Pmsf
falência de bomba achata função cardíaca
interseção = DC e PVC reais
```

### 5.2 Frank-Starling

Ensina que volume tem rendimento decrescente.

Invariantes:

```text
pré-carga ↑ aumenta VS na porção ascendente
no platô, volume rende pouco
em falência, a curva é achatada
```

### 5.3 Alça pressão-volume

Ensina acoplamento entre contratilidade, pós-carga, pré-carga e trabalho.

Invariantes:

```text
Ees↑ aumenta capacidade de ejeção
Ea↑ aumenta carga contra ejeção
Ea/Ees informa acoplamento mecânico
```

### 5.4 Supply-dependence

Ensina o joelho entre VO₂ independente de DO₂ e VO₂ dependente de DO₂.

Invariantes:

```text
acima do DO₂crítico, VO₂ fica em platô
abaixo do DO₂crítico, VO₂ cai com DO₂
lactato sobe quando déficit cresce
```

### 5.5 Macro × micro × mitocôndria

Ensina o paradoxo séptico.

Invariantes:

```text
DO₂ macro pode estar alto
shunt/glicocálice reduzem chegada tecidual
mitocôndria reduz utilização
SvO₂ pode subir porque o tecido não extrai/usa
pressor sobe PAM, mas não corrige micro/mito por si só
```

---

## 6. Assinaturas dos choques

### Hipovolêmico

```text
quebra dominante: retorno venoso/pré-carga
macro: DC↓, RVS↑
extração: O₂ER↑, SvO₂↓
armadilha: responsivo a volume ≠ tolerante a volume
```

### Cardiogênico

```text
quebra dominante: bomba
macro: DC↓, pressões de enchimento↑
compensação: RVS↑
armadilha: aumentar pressão pode piorar ejeção se pós-carga sobe
```

### Obstrutivo

```text
quebra dominante: obstáculo mecânico
subtipos:
  tamponamento → enchimento diastólico
  TEP maciço → ejeção do VD
  pneumotórax hipertensivo → retorno venoso
armadilha: tratar os três como uma entidade única
```

### Distributivo

```text
quebra dominante: RVS↓
macro: DC normal/↑, RVS↓
extração: pode estar normal, ambígua ou falha
armadilha: distributivo ≠ automaticamente séptico
```

### Séptico

```text
quebra dominante: RVS↓ + microcirculação + mitocôndria
assinatura: SvO₂ alta pode coexistir com lactato alto
armadilha: PAM restaurada ≠ tecido ressuscitado
```

### Anafilático

```text
quebra dominante: vasoplegia + extravasamento capilar + eixo respiratório
assinatura: leak/edema/broncoespasmo em cenário didático
armadilha: reduzir a anafilaxia a “RVS baixa” apaga o eixo respiratório/imune
```

### Neurogênico

```text
quebra dominante: perda simpática
assinatura: RVS↓ + capacitância venosa↑ + FC inapropriadamente baixa/normal
armadilha: esperar taquicardia compensatória em todo choque
```

---

## 7. Honestidades de modelo

Os módulos usam modelos reduzidos. Isso é uma escolha pedagógica, não uma afirmação de que o corpo real é simples.

Todo módulo deve declarar sua simplificação dominante:

- CaO₂ assume aproximação padrão da ligação Hb-O₂.
- PAM = DC × RVS é leitura macroscópica, não substitui vascularização regional.
- Microcirculação é reduzida a shunt/glicocálice/heterogeneidade.
- Mitocôndria é reduzida a capacidade de utilização.
- Choques reais podem ser mistos.
- Drogas e procedimentos aparecem como mecanismo, não prescrição.

---

## 8. Fronteira SaMD por domínio

Módulos de maior risco:

```text
19  obstrutivos procedimentais
21  séptico
22  anafilático × neurogênico
25  ressuscitação volêmica
28  vasopressores/inotrópicos
29  capstone
```

Nesses módulos, é obrigatório:

```text
sem dose
sem comando terapêutico
sem alvo individualizado
sem decisão para paciente real
veredito apenas fisiológico
```

O texto normativo completo está em `SAFETY.md`.

---

## 9. Critério de excelência fisiológica

Um módulo está fisiologicamente maduro quando prova:

```text
1. o estado normal
2. o fenótipo patológico
3. a variável enganosa
4. o termo quebrado
5. a compensação
6. o contraste com outro choque
7. a armadilha cognitiva
8. a limitação do modelo
```

Se o módulo não diferencia “número” de “mecanismo”, ele ainda não pertence ao estado excelente.
