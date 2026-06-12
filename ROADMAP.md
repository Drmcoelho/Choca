# ROADMAP.md — Plano de evolução · PERFUNDE · CHOCA

Este roadmap organiza a transição de módulos excelentes porém ainda artesanais para uma plataforma fisiológica educacional verificável.

O critério de maturidade não é quantidade de páginas. É coerência entre fisiologia, engine, UI, avaliação, documentação e segurança.

---

## 1. Estado operacional atual

O repositório contém:

- índice `perfunde.html`;
- módulos publicados `perfunde0.html` até `perfunde21.html`;
- engines `build/m0` até `build/m21`;
- testes Node por módulo;
- validadores jsdom por módulo;
- `package.json` com `npm run check`;
- GitHub Actions para o portão de validação;
- documentação estrutural reconciliada;
- `curriculum.json` como manifesto curricular inicial.

Próximo módulo operacional:

```text
M22 · anafilático × neurogênico
```

---

## 2. Fases concluídas

### Fase 0 — Consolidação documental

**Status:** concluída.

Entregues:

```text
README.md
ARCHITECTURE.md
MODULE_CONTRACT.md
SAFETY.md
ROADMAP.md
DOCUMENTATION_STATUS.md
```

Critério cumprido:

```text
um agente novo consegue entender o produto, seus limites e seu rito de construção sem depender da conversa anterior
```

### Fase 1 — Reconciliação documental

**Status:** concluída.

Entregues:

```text
PERFUNDA.md reconciliado
CHOQUE.md reconciliado
modulos.md reconciliado
curriculum.json criado
DOCUMENTATION_STATUS.md atualizado para reconciliado
README.md atualizado pós-reconciliação
```

Divergência resolvida:

```text
M21 = séptico
M22 = anafilático × neurogênico
M23–M29 = integração e resgate
```

---

## 3. Fase 2 — M22 como módulo exemplar

**Status:** próxima.

Tema:

```text
Anafilático × neurogênico
```

Tese:

```text
Ambos são distributivos, mas não quebram a fisiologia pelo mesmo caminho.
Anafilático = vasoplegia + extravasamento + eixo respiratório/imunológico.
Neurogênico = perda simpática + capacitância venosa + bradicardia relativa/absoluta.
Séptico = distributivo com microcirculação/mitocôndria/extração quebradas.
```

Dependências:

```text
M9  · PAM = DC × RVS
M20 · distributivo
M21 · séptico
M12 · microcirculação, se contraste micro for usado
M13 · lactato, se contraste metabólico for usado
```

Variáveis candidatas do engine:

```js
{
  systemicVascularResistance,
  sympatheticTone,
  venousCapacitance,
  capillaryLeak,
  preload,
  bronchospasm,
  airwayEdema,
  heartRate,
  strokeVolume,
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

```text
sem dose de adrenalina
sem algoritmo de anafilaxia
sem indicação de via aérea
sem comando terapêutico
sem alvo individualizado
```

Critério de pronto:

```text
M22 diferencia três distributivos sem virar protocolo: séptico, anafilático e neurogênico
```

Ordem de build:

```text
1. build/m22/model22.js
2. build/m22/test22.node.js
3. perfunde22.html
4. build/m22/validate22.js
5. package.json
6. perfunde.html
7. curriculum.json
8. npm run check
```

---

## 4. Fase 3 — Refatoração sentinela: M9, M20, M21

**Status:** planejada.

Objetivo: preparar extração futura de core sem quebrar single-file.

Módulos sentinela:

```text
M9  · macro-hemodinâmica: PAM = DC × RVS
M20 · categoria distributiva: RVS como termo quebrado
M21 · subtipo séptico: macro × micro × mitocôndria
```

Critério de pronto:

```text
as mesmas fórmulas não aparecem com semântica divergente entre M9, M20 e M21
```

---

## 5. Fase 4 — Core fisiológico compartilhado

**Status:** planejada.

Criar fonte modular sem abandonar HTML final autossuficiente.

Primeiro núcleo recomendado:

```text
source/core/oxygen.js
source/core/hemodynamics.js
```

Depois:

```text
source/core/guyton.js
source/core/ventricle.js
source/core/microcirculation.js
source/core/shock.js
source/core/units.js
source/core/guards.js
```

Regra:

```text
fonte modular pode existir; saída publicada continua single-file
```

---

## 6. Fase 5 — QA transversal

**Status:** planejada.

Adicionar checadores de plataforma:

```text
checador de links relativos
checador de módulos órfãos
checador de numeração contra curriculum.json
checador de disclaimers
checador de rodapé
checador de ausência de doses proibidas
checador de IDs mínimos
checador de tutor
checador de acessibilidade básica
```

Critério de pronto:

```text
um módulo não pode quebrar cromo, segurança, índice ou numeração sem o CI acusar
```

---

## 7. Fase 6 — Bloco IV

**Status:** planejada.

Depois de M22:

```text
M23 · choque misto
M24 · coração-pulmão
M25 · ressuscitação volêmica
M26 · choque críptico/compensado
M27 · os 4 perfis · radar
M28 · vasopressores & inotrópicos
M29 · capstone integrado
```

Regra: integração só deve avançar quando os módulos determinantes estiverem testados e semanticamente estáveis.

---

## 8. Critério de projeto supremo

O projeto atinge estado excelente quando cada módulo responde, sem ambiguidade:

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

Enquanto essas dez perguntas não forem respondidas para todos os módulos, ainda há trabalho estrutural.
