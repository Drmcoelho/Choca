# PERFUNDA.md — Constituição do Braço 2 · **PERFUNDE · CHOCA**

> Documento-mãe do segundo braço do hexápode de medicina crítica.
> Governa identidade, invariantes, fronteira clínica e arquitetura filosófica do braço.
> Domínio fisiológico detalhado → `CHOQUE.md`. Blueprint modular → `modulos.md`. Operação → `AGENTS.md`. Arquitetura → `ARCHITECTURE.md`. Segurança → `SAFETY.md`. Exame global → `M30_ASSESSMENT_SPEC.md`.

---

## 1. Identidade

PERFUNDE · CHOCA ensina a segunda metade do transporte de oxigênio: depois que o gás entra, difunde e satura a hemoglobina, como o O₂ chega ao tecido, é extraído, é utilizado pela mitocôndria — e o que acontece quando essa cadeia falha.

A tese constitucional é:

> **Choque não é pressão arterial baixa. Choque é falência da entrega efetiva de oxigênio ao tecido.**

A pressão arterial é número resultante. A fisiologia está nos termos que produziram esse número.

---

## 2. A inversão causal

O eixo equivalente ao “modo ventilatório” do braço 1 é a decomposição hemodinâmica:

```text
PAM = DC × RVS
```

A mesma PAM pode nascer de mecânicas opostas:

```text
DC alto + RVS baixa    → distributivo
DC baixo + RVS alta    → cardiogênico/hipovolêmico/obstrutivo compensado
PAM normal + lactato↑  → choque críptico/compensado
```

Regra pedagógica:

> **Decompor antes de interpretar.**

PAM, SpO₂, pH, lactato e SvO₂ são sombras. O módulo deve ensinar qual termo da equação gerou a sombra.

---

## 3. Lugar no hexápode

| # | Braço | Eixo | Estado |
|---|-------|------|--------|
| 1 | **RESPIRA · VENTILA** | troca gasosa + bomba mecânica de ar | concluído |
| 2 | **PERFUNDE · CHOCA** | transporte de O₂ + falência circulatória | este braço |
| 3 | FILTRA · DIALISA | rim, LRA, diálise e consequência da perfusão | planejado |
| 4 | ALIMENTA · DESNUTRE | nutrição, catabolismo e reabilitação metabólica | planejado |
| 5 | METABOLIZA · INTOXICA | fígado, metabolismo e toxicologia | planejado |
| 6 | CONSCIÊNCIA · COMA | neurocrítico, PPC, PIC, autorregulação | planejado |

PERFUNDE é o braço do C do ABC. Ele é par do Respira/Ventila: um explica entrada/troca/mecânica do ar; o outro explica entrega, circulação, perfusão e falência tecidual.

---

## 4. Estado operacional atual

O estado publicado do repositório é a fonte operacional de verdade.

```text
índice: perfunde.html
publicados: perfunde0.html … perfunde26.html
engines: build/m0 … build/m26
portão: npm run check
próximo módulo: M27 · os 4 perfis · radar
fechamento avaliativo planejado: M30 · revisão global / exame de domínio
```

A numeração canônica atual é a do índice publicado e da documentação reconciliada:

```text
M0–M2   Fundamentos do transporte
M3–M8   Determinantes
M9–M13  Inversão, leitura, POCUS, microcirculação, lactato
M14–M22 Choques: categorias e capstones
M23–M29 Integração e resgate
M30     Revisão global · exame de domínio
```

Houve expansão curricular durante o desenvolvimento. A constituição atual fixa: **M21 = séptico; M22 = anafilático × neurogênico; M30 = exame global de domínio.**

---

## 5. Espinha quantitativa

A régua comum do braço é:

```text
CaO₂ = 1,34 · Hb · SaO₂ + 0,003 · PaO₂
DO₂  = DC × CaO₂ × 10
DC   = FC × VS
VO₂  = DC × (CaO₂ − CvO₂) × 10
O₂ER = VO₂ / DO₂
SvO₂ ≈ SaO₂ · (1 − O₂ER)
PAM  = PVC + DC · RVS
```

A intenção não é decorar fórmulas. É enxergar onde a cadeia quebrou:

```text
conteúdo ↓          → anemia/hipoxemia
DC ↓                → bomba, ritmo, pré-carga, pós-carga
RVS ↓               → distributivo
retorno venoso ↓    → hipovolêmico/obstrutivo
extração ↓          → microcirculação/mitocôndria
utilização ↓        → falência citopática
```

---

## 6. Escada canônica de módulos

### Bloco 0 · Fundamentos do transporte

```text
0  Matemática do transporte
1  Conteúdo de O₂ (CaO₂)
2  A curva como entrega
```

### Bloco I · Determinantes

```text
3  Débito cardíaco
4  Interseção de Guyton
5  Guyton aplicado · responsivo ≠ tolerante
6  Frank-Starling
7  Pós-carga & alça pressão-volume
8  DO₂/VO₂ & supply-dependence
```

### Bloco II · Inversão e leitura

```text
9   PAM = DC × RVS · a inversão
10  Monitorização hemodinâmica
11  POCUS & acessos vasculares
12  A microcirculação
13  Lactato & depuração
```

### Bloco III · Os choques

```text
14  Hipovolêmico
15  ↳ hemorrágico × não-hemorrágico
16  Cardiogênico
17  ↳ o ventrículo direito
18  Obstrutivo
19  ↳ tamponamento · TEP · pneumotórax
20  Distributivo
21  ↳ séptico
22  ↳ anafilático × neurogênico
```

### Bloco IV · Integração e resgate

```text
23  Choque misto
24  O coração-pulmão
25  Ressuscitação volêmica
26  Choque críptico/compensado
27  Os 4 perfis · radar
28  Vasopressores & inotrópicos
29  Capstone · caso integrado
```

### Bloco V · Avaliação global

```text
30  Revisão global · exame de domínio · 100 questões
```

M30 não é módulo de conteúdo novo. É avaliação global, holística, randomizada por módulo e crescente em dificuldade. Sua especificação está em `M30_ASSESSMENT_SPEC.md`.

---

## 7. Invariantes arquiteturais

### 7.1 Publicação

- Cada módulo publicado é `perfundeN.html` single-file.
- O módulo funciona offline.
- O módulo não depende de CDN, fonte externa, imagem remota ou rede.
- Links são relativos.
- O rodapé de série é obrigatório: `CRM-SP 151.318 · Dr. Matheus M. Coelho · Limeira`.

### 7.2 Engine

- Todo motor fisiológico deve ser puro, determinístico e testável.
- O engine vem antes da UI.
- Fórmula sem teste não entra.
- UI que contradiz engine é bug crítico.

### 7.3 Validação

- `npm run check` é portão.
- 0 falhas é obrigatório.
- Teste Node valida fisiologia.
- Validador jsdom valida HTML, UI, tutor, gráficos, cromo e segurança.
- M30 exige validador psicométrico adicional: 100 questões, quatro quartos, distribuição de alternativas, progressão de dificuldade, cobertura e gabaritos robustos.

### 7.4 Antifragilidade

O artefato publicado continua single-file. Uma fonte modular futura é permitida, desde que gere HTML autossuficiente. O valor constitucional não é “não organizar”; é não depender de runtime externo para ensinar.

---

## 8. SaMD e fronteira clínica

PERFUNDE · CHOCA é educação fisiológica. Não é protocolo, calculadora de dose, triador, prescritor ou suporte automatizado à decisão clínica.

Permitido:

```text
mecanismo
termo quebrado
receptor → termo da equação
por que uma alavanca fisiológica muda uma variável
por que dois fenótipos parecidos têm causas diferentes
```

Proibido:

```text
dose
ordem terapêutica
alvo individualizado
conduta para paciente real
classificação automatizada de caso real para ação
```

A regra operacional está em `SAFETY.md` e tem precedência sobre utilidade, estética e completude.

---

## 9. Princípios de qualidade

→ **Teto, não piso.** O módulo deve exceder a tabela do livro, não reproduzi-la.

→ **Física viva.** Gráfico é computado pelo motor, não desenhado como enfeite.

→ **Erro cognitivo explícito.** Cada módulo deve saber qual confusão pretende corrigir.

→ **Caso → variável escondida → engine → lab → tutor.** Essa é a cadeia pedagógica.

→ **Honestidade no artefato.** Simplificações e limitações devem aparecer dentro do próprio módulo.

→ **Prosa causal.** O aluno deve sair com mecanismo, não com lista.

→ **Avaliação sem pista formal.** No M30, a alternativa correta deve ser correta por fisiologia, não por tamanho, posição, letra, número maior ou padrão estatístico.

---

## 10. Estado de perfeição

O estado supremo do braço é atingido quando cada módulo responde, sem ambiguidade:

```text
qual termo quebrou?
qual variável engana?
qual erro cognitivo o aluno cometeria?
qual engine prova a relação?
qual gráfico torna a relação visível?
qual preset demonstra o contraste?
qual questão detecta compreensão?
qual disclaimer impede extrapolação clínica?
qual módulo anterior é necessário?
qual módulo posterior fica preparado?
```

E quando M30 prova o domínio global com 100 questões sem padrão explorável, dificuldade crescente e gabarito explicativo completo.
