# ROADMAP.md — Plano de evolução · PERFUNDE · CHOCA

Este roadmap organiza a saída do estado atual — módulos excelentes porém ainda artesanais — para uma plataforma fisiológica educacional verificável.

O critério de maturidade não é quantidade de módulos. É coerência entre fisiologia, engine, UI, avaliação, documentação e segurança.

---

## 1. Estado operacional atual

O repositório já contém:

- índice `perfunde.html`;
- módulos publicados `perfunde0.html` até `perfunde21.html`;
- engines `build/m0` até `build/m21`;
- testes Node por módulo;
- validadores jsdom por módulo;
- `package.json` com `npm run check`;
- GitHub Actions rodando o portão de validação.

O próximo módulo operacional é:

```text
M22 · anafilático × neurogênico
```

---

## 2. Tese da próxima fase

A próxima fase não deve ser “criar mais HTML”.

A próxima fase deve converter o projeto em um sistema com contratos explícitos:

```text
cada módulo → conceito isolado → engine puro → invariantes → UI equivalente → tutor causal → validação
```

M22 será o primeiro módulo construído sob a documentação nova.

---

## 3. Fase 0 — Consolidação documental

Objetivo: transformar documentação em infraestrutura de projeto.

Arquivos-alvo:

- `README.md` — porta de entrada;
- `ARCHITECTURE.md` — arquitetura técnica;
- `MODULE_CONTRACT.md` — contrato de módulo;
- `SAFETY.md` — fronteira clínica;
- `ROADMAP.md` — execução;
- futura reconciliação de `PERFUNDA.md`, `CHOQUE.md` e `modulos.md`.

Critério de pronto:

```text
um agente novo consegue entender o projeto, construir M22 e não violar SaMD sem depender da conversa anterior
```

Status: iniciado.

---

## 4. Fase 1 — Reconciliação documental

Há documentos antigos com numeração histórica e documentos operacionais com numeração real publicada.

Regra:

```text
perfunde.html + package.json + build/mN/ = verdade operacional
PERFUNDA.md + CHOQUE.md + modulos.md = verdade constitucional/curricular
```

A fase 1 deve:

1. atualizar `PERFUNDA.md` para refletir o estado M0–M21 e próximo M22;
2. atualizar `CHOQUE.md` sem apagar a fisiologia já boa;
3. atualizar `modulos.md` para alinhar blueprint e publicação;
4. registrar claramente se o projeto terá 29, 30 ou mais módulos;
5. manter histórico de decisões, sem fingir que a numeração nunca mudou.

Critério de pronto:

```text
nenhum documento central afirma que M21 é outra coisa enquanto o índice publicado mostra M21 como séptico
```

---

## 5. Fase 2 — M22 como módulo exemplar

Tema:

```text
Anafilático × neurogênico
```

Tese:

```text
Ambos são distributivos, mas não quebram a fisiologia pelo mesmo caminho.
Anafilático = vasoplegia + extravasamento + eixo respiratório/imunológico.
Neurogênico = perda simpática + capacitância venosa + bradicardia relativa/absoluta.
```

Dependências:

- M9 — PAM = DC × RVS;
- M20 — distributivo;
- M21 — séptico;
- M12/M13 se micro/lactato forem usados como contraste.

Variáveis candidatas do engine:

```js
{
  rvs,
  sympatheticTone,
  venousCapacitance,
  capillaryLeak,
  preload,
  bronchospasm,
  airwayEdema,
  heartRate,
  cardiacOutput,
  map,
  lactate,
  phenotype
}
```

Invariantes mínimas:

```text
anafilaxia: RVS↓ + leak↑ + possível broncoespasmo/edema + FC compensatória geralmente ↑
neurogênico: RVS↓ + tônus simpático↓ + capacitância venosa↑ + FC inapropriadamente baixa/normal
séptico: RVS↓ + micro/mito/extração quebradas + lactato por desacoplamento
```

Proibições específicas:

- sem dose de adrenalina;
- sem algoritmo de anafilaxia;
- sem indicação de via aérea;
- sem comando terapêutico;
- apenas mecanismo.

Critério de pronto:

```text
M22 diferencia três distributivos sem virar protocolo: séptico, anafilático e neurogênico
```

---

## 6. Fase 3 — Refatoração sentinela: M9, M20, M21

Antes de extrair o core inteiro, refatorar mentalmente e documentalmente três módulos sentinela:

- **M9** — macro: `PAM = DC × RVS`;
- **M20** — distributivo: RVS como termo quebrado;
- **M21** — séptico: macro × micro × mitocôndria.

Esses três módulos formam uma cadeia causal suficiente para testar a arquitetura futura:

```text
macro-hemodinâmica → categoria distributiva → subtipo séptico
```

Objetivo:

- padronizar nomenclatura;
- identificar funções repetidas;
- preparar extração para `core/hemodynamics.js`, `core/oxygen.js` e `core/microcirculation.js`;
- reforçar validadores com invariantes transversais.

Critério de pronto:

```text
as mesmas fórmulas não aparecem com semântica divergente entre M9, M20 e M21
```

---

## 7. Fase 4 — Core fisiológico compartilhado

Criar gradualmente um core de fonte, sem quebrar o requisito de HTML final single-file.

Proposta:

```text
source/core/oxygen.js
source/core/hemodynamics.js
source/core/guyton.js
source/core/ventricle.js
source/core/microcirculation.js
source/core/shock.js
source/core/units.js
source/core/guards.js
```

Regra de compatibilidade:

```text
fonte modular pode existir; saída publicada continua single-file
```

O core deve nascer pequeno. Não criar arquitetura abstrata antes de necessidade real.

Primeiro core recomendado:

```text
oxygen.js + hemodynamics.js
```

porque CaO₂, DO₂, O₂ER, SvO₂, PAM, DC e RVS já reaparecem em múltiplos módulos.

---

## 8. Fase 5 — Curriculum manifest

Criar um manifesto curricular legível por máquina:

```text
curriculum.json ou curriculum.yaml
```

Campos mínimos:

```json
{
  "id": 21,
  "slug": "septic-shock",
  "title": "Choque séptico",
  "status": "published",
  "depends_on": [9, 12, 20],
  "concepts": [],
  "misconceptions": [],
  "invariants": [],
  "safety_level": "high"
}
```

Esse manifesto permitirá:

- gerar índice;
- auditar módulos órfãos;
- detectar dependência quebrada;
- mapear questões por conceito;
- planejar revisão espaçada sem armazenar dados no navegador.

Observação: enquanto `PERFUNDA.md` proibir armazenamento de navegador, qualquer progresso do aluno deve ser in-memory, exportável manualmente ou deixado para ambiente externo. Nada de `localStorage` sem decisão constitucional explícita.

---

## 9. Fase 6 — QA de plataforma

Adicionar checagens transversais:

```text
link-checker relativo
checador de módulos órfãos
checador de numeração
checador de disclaimers
checador de rodapé
checador de ausência de doses proibidas
checador de IDs mínimos
checador de tutor
checador de acessibilidade básica
```

O objetivo é impedir regressão estrutural.

Critério de pronto:

```text
um módulo não pode quebrar cromo, segurança ou índice sem o CI acusar
```

---

## 10. Fase 7 — Bloco IV e integração

Após M22, o bloco seguinte deve integrar múltiplas quebras.

Sequência candidata, sujeita à reconciliação de numeração:

```text
M23 · choque misto
M24 · coração-pulmão
M25 · ressuscitação volêmica como fisiologia
M26 · choque críptico/compensado
M27 · radar dos perfis
M28 · vasopressores/inotrópicos como receptor → termo
M29 · capstone integrado
```

Regra: módulos de integração só devem ser feitos depois que os módulos determinantes estiverem testados e semanticamente estáveis.

---

## 11. Ordem recomendada agora

A sequência mais limpa a partir deste ponto:

```text
1. concluir documentação estrutural
2. reconciliar numeração dos documentos antigos
3. especificar M22 em MODULE_CONTRACT style
4. escrever build/m22/model22.js
5. escrever build/m22/test22.node.js
6. escrever perfunde22.html
7. escrever build/m22/validate22.js
8. atualizar package.json
9. atualizar perfunde.html
10. rodar npm run check
11. atualizar ROADMAP.md status
```

---

## 12. Critério de projeto supremo

O projeto atinge o estado excelente quando cada módulo responde, sem ambiguidade:

```text
qual termo quebrou?
qual variável engana?
qual erro cognitivo o aluno cometeria?
qual engine prova a relação?
qual gráfico torna a relação visível?
qual preset demonstra o contraste?
qual questão detecta a compreensão?
qual disclaimer impede extrapolação clínica?
qual módulo anterior é necessário?
qual módulo posterior fica preparado?
```

Enquanto essas dez perguntas não forem respondidas para todos os módulos, ainda há trabalho estrutural a fazer.
