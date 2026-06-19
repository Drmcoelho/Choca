# ROADMAP.md — Plano de evolução · PERFUNDE · CHOCA

Este roadmap organiza a transição de módulos excelentes porém ainda artesanais para uma plataforma fisiológica educacional verificável.

O critério de maturidade não é quantidade de páginas. É coerência entre fisiologia, engine, UI, avaliação, documentação, segurança e prova global de domínio.

---

## 1. Estado operacional atual

O repositório contém:

- índice `perfunde.html`;
- módulos publicados `perfunde0.html` até `perfunde30.html`;
- engines `build/m0` até `build/m30`;
- testes Node por módulo;
- validadores jsdom por módulo;
- `package.json` com `npm run check`;
- GitHub Actions para o portão de validação;
- documentação estrutural reconciliada;
- `curriculum.json` como manifesto curricular inicial;
- `M30_ASSESSMENT_SPEC.md` como especificação do exame global.

Próximo módulo operacional:

```text
M30 · revisão global · exame de domínio · 100 questões
```

(M22…M29 publicados e validados; o M28 inaugurou a camada de referência farmacológica do SAFETY.md §11 e o M29 fechou o conteúdo com o motor unificado da cascata integrada. Resta o M30 — o exame global de domínio.)

Fechamento avaliativo planejado:

```text
M30 · revisão global · exame de domínio · 100 questões
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
M30 = revisão global / exame de domínio
```

### Fase 1.5 — Especificação do M30

**Status:** concluída.

Entregue:

```text
M30_ASSESSMENT_SPEC.md
```

Critério cumprido:

```text
M30 definido como prova global de 100 questões, em quatro quartos, com módulos embaralhados, dificuldade crescente, distribuição A/B/C/D controlada e gabarito ultra-robusto
```

---

## 3. Fase 2 — M22 como módulo exemplar

**Status:** concluída — publicado e validado. `perfunde22.html` + `build/m22/{model,test,validate}22.js`, ligados ao `package.json`/`perfunde.html`/`curriculum.json`, `npm run check` verde. A FC é o discriminador; o painel da adrenalina prova os quatro termos; guarda SaMD no validador rejeita dose. A ausência de taquicardia no neurogênico é tratada como assinatura clássica/no modelo, não absoluto clínico.

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

**Status:** primeiro núcleo entregue.

Criar fonte modular sem abandonar HTML final autossuficiente.

Núcleos entregues (`source/core/`):

```text
source/core/units.js            fatores de unidade (×10 dL→L, ×80 dyne, asFrac)
source/core/oxygen.js           CaO₂, DO₂, VO₂, O₂ER, SvO₂, DO₂crítico, lactato (macro)
source/core/hemodynamics.js     PAM=DC×RVS e inversas; CO=FC×VS; colisão rvsWood desambiguada
source/core/guyton.js           retorno venoso × função cardíaca; interseção (bisseção) [m4]
source/core/ventricle.js        Sunagawa: Ves/SV/Pes/EF/coupling, EDPVR, trabalho/eficiência [m7]
source/core/microcirculation.js shunt·glicocálice·heterogeneidade; paradoxo; lactato tecidual [m12]
source/core/shock.js            séptico 3-compartimentos [m21] + choque misto/atribuição [m23]
source/core/guards.js           clamp/finitude/positividade + fronteira SaMD (regex IMPERATIVE_RE)
source/core/test-core.node.js   auto-teste + CONFORMÂNCIA núcleo × engines (test:core)
```

Primeira passada do núcleo **completa**: cadeia do O₂, macro-hemodinâmica, Guyton,
ventrículo (Sunagawa), microcirculação e choque (séptico + misto) — toda travada por
conformância (69 OK). Evolução futura: extrair a aritmética inline dos HTML para
consumir o núcleo no build (sem quebrar o single-file) e cobrir os engines restantes
(m5/m6/m16/m24/m25/m29) à medida que compartilharem fórmulas.

Regra:

```text
fonte modular pode existir; saída publicada continua single-file
```

O que torna o núcleo *load-bearing* (não código paralelo morto): `test:core` recomputa
cada fórmula compartilhada pelo núcleo E pelos engines `build/mN/modelN.js` sobre uma
bateria determinística e exige igualdade numérica. Se M9 divergir de M29/do núcleo numa
fórmula, o CI acusa — o critério de pronto da Fase 3 (semântica não pode divergir). A
colisão real `rvsWood` (model0: de pressões; model9: dyne→Wood) está desambiguada e
travada por teste. O guardião (`build/qa/qa.js`) importa a fronteira SaMD de
`source/core/guards.js`, eliminando a duplicação da regra do `SAFETY.md §11`.

---

## 6. Fase 5 — QA transversal

**Status:** entregue — guardião `build/qa/qa.js` no `npm run qa` (dentro do `npm run check`).

Checadores de plataforma já no portão (`build/qa/qa.js`):

```text
[x] links relativos intra-braço (perfundeN.html) resolvem
[x] sem módulos órfãos (perfundeN.html além do published_range)
[x] numeração contra curriculum.json (inventário × published_range)
[x] disclaimers educacionais (SaMD) por módulo
[x] rodapé de série (CRM-SP 151.318 · Coelho · Limeira) por módulo
[x] ausência de ordem imperativa individualizada (firewall SaMD transversal)
[x] índice sem órfãos / sem cards "em breve" / todos linkados
[x] fiação do package.json (test:N/validate:N/test:core, cadeias, check)
[x] arquivos de build por módulo (testN.node.js / validateN.js)
[x] núcleo source/core presente e wired (test:core)
[x] coerência documental (ranges perfunde0…N, M0…N, build/m0…N; contagem do M30)
[x] acessibilidade básica (lang=pt-BR, charset, viewport, <title> por módulo)
[x] andaime de UI (1 role="tablist", ≥4 abas, abas↔painéis pareados, aria-controls)
[x] tutor socrático presente nos módulos de conteúdo (class="trilha" + .qq/.aa)
[x] checador M30 fino: letras A–D em 15–35% e correta≠mais-longa <30% no banco real
```

Checadores ainda planejados (próxima evolução do guardião):

```text
[ ] contraste/cor declarados (acessibilidade avançada)
[ ] rótulos/aria-label em todos os controles interativos (sliders/botões)
```

Critério de pronto:

```text
um módulo não pode quebrar cromo, segurança, índice, numeração ou avaliação sem o CI acusar
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

## 8. Fase 7 — M30 · exame global

**Status:** planejada, especificada.

Construção em quatro entregas:

```text
Parte 1 → questões 1–25
Parte 2 → questões 26–50
Parte 3 → questões 51–75
Parte 4 → questões 76–100
```

Regras centrais:

```text
módulos em ordem aleatória
dificuldade crescente por quarto
cada letra correta entre 15 e 35 no total
sem padrão explorável
sem alternativa correta por tamanho, número maior ou posição
gabarito explica correta e distratores
```

M30 só deve ser publicado depois que M22–M29 estiverem estáveis o suficiente para serem avaliados.

---

## 9. Critério de projeto supremo

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

E quando M30 prova, em 100 questões, que o aluno sustenta esse mapa causal fora da ordem curricular e sem pistas artificiais.
