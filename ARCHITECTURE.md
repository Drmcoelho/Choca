# ARCHITECTURE.md — Arquitetura de excelência · PERFUNDE · CHOCA

Este documento define a arquitetura-alvo do projeto. Ele não substitui `PERFUNDA.md`, `CHOQUE.md`, `modulos.md` ou `AGENTS.md`; ele conecta esses documentos em uma forma técnica coesa.

A ambição arquitetural é transformar o repositório em uma plataforma fisiológica educacional verificável:

```text
conceito fisiológico → engine determinístico → simulação visual → tutor avaliativo → validação automatizada
```

O objetivo não é produzir páginas bonitas. O objetivo é produzir módulos nos quais a interface nunca contradiga o motor fisiológico.

---

## 1. Camadas do sistema

PERFUNDE · CHOCA tem cinco camadas.

### 1.1 Camada constitucional

Arquivos:

- `PERFUNDA.md`
- `CHOQUE.md`
- `modulos.md`
- `SAFETY.md`

Função: definir identidade, escopo, fisiologia, taxonomia, fronteira clínica e numeração curricular.

Essa camada responde: **o que este braço é, o que ele ensina e o que ele nunca faz.**

### 1.2 Camada operacional

Arquivos:

- `AGENTS.md`
- `MODULE_CONTRACT.md`
- `ROADMAP.md`

Função: definir como construir, validar, revisar e evoluir cada módulo.

Essa camada responde: **como o projeto cresce sem perder consistência.**

### 1.3 Camada de módulo publicado

Arquivos:

- `perfunde.html`
- `perfundeN.html`

Função: entregar o material ao aluno. Cada `perfundeN.html` deve funcionar sozinho, offline, sem rede e sem dependências externas em runtime.

Essa camada responde: **o que o aluno usa.**

### 1.4 Camada de motor fisiológico

Arquivos:

- `build/mN/modelN.js`

Função: conter funções puras, determinísticas, auditáveis e testáveis. O motor é a fonte da verdade numérica do módulo.

Essa camada responde: **qual fisiologia está sendo computada.**

### 1.5 Camada de validação

Arquivos:

- `build/mN/testN.node.js`
- `build/mN/validateN.js`
- `.github/workflows/check.yml`
- `package.json`

Função: impedir regressão conceitual, matemática, estrutural e visual.

Essa camada responde: **como sabemos que o módulo não está mentindo.**

---

## 2. Estado atual da arquitetura

O projeto já tem uma arquitetura funcional:

```text
perfundeN.html
build/mN/modelN.js
build/mN/testN.node.js
build/mN/validateN.js
package.json → npm run check
GitHub Actions → npm install → npm run check
```

Isso já é superior a uma coleção de páginas estáticas. Cada módulo importante tem engine, teste e validação de UI.

O ponto ainda imperfeito é a duplicação. Muitos módulos carregam CSS, helpers, lógica de abas, helpers de canvas e padrões de tutor de forma local. Isso preserva o requisito single-file, mas cria dívida técnica.

A direção correta não é abandonar o single-file. É criar uma fonte geradora ou um template canônico, mantendo o artefato final como HTML autossuficiente.

---

## 3. Arquitetura-alvo

A arquitetura ideal tem duas formas: fonte modular e saída autossuficiente.

```text
source/
  core/
    oxygen.js
    hemodynamics.js
    guyton.js
    ventricle.js
    microcirculation.js
    shock.js
    units.js
    guards.js
  modules/
    m22/
      module.yaml
      model.js
      content.md
      tutor.js
      tests.node.js
      validate.js
  templates/
    module.html
    styles.css
    tabs.js
    lab.js
    tutor.js

published/
  perfunde22.html  # single-file final
```

Enquanto o projeto não tiver gerador formal, a convenção vigente continua: HTML single-file na raiz + engine/test/validate em `build/mN/`.

A extração para `source/core` é alvo de maturidade, não pré-condição para continuar M22.

---

## 4. O core fisiológico compartilhado

A perfeição exige uma única fonte de verdade para fórmulas recorrentes. O alvo é extrair gradualmente funções repetidas para um core conceitual.

### 4.1 `core/oxygen.js`

Responsável por:

```js
caO2(hb, saO2, paO2)
do2(co, caO2)
vo2FromFick(co, caO2, cvO2)
o2er(vo2, do2)
svo2(saO2, o2er)
```

Invariantes:

- CaO₂ aumenta com Hb, SaO₂ e PaO₂.
- PaO₂ contribui pouco para conteúdo em comparação com Hb.
- DO₂ aumenta linearmente com DC e CaO₂.
- O₂ER só é interpretável quando DO₂ > 0.

### 4.2 `core/hemodynamics.js`

Responsável por:

```js
mapFromCoRvs(co, rvs, pvc)
rvsForMap(map, co, pvc)
rvsWoodToDyn(rvsWood)
rvsDynToWood(rvsDyn)
shockIndex(hr, sbp)
```

Invariantes:

- PAM sobe com DC se RVS constante.
- PAM sobe com RVS se DC constante.
- A mesma PAM pode surgir de estados opostos.

### 4.3 `core/guyton.js`

Responsável por retorno venoso, curva de função cardíaca e ponto de operação.

Invariantes:

- Retorno venoso cai quando PVC se aproxima de Pmsf.
- Volume desloca Pmsf.
- Falência de bomba achata a curva cardíaca.
- O ponto de operação é interseção, não variável isolada.

### 4.4 `core/ventricle.js`

Responsável por alça PV, ESPVR, EDPVR, Ea/Ees, contratilidade e pós-carga.

Invariantes:

- Aumentar pós-carga reduz VS quando contratilidade é constante.
- Aumentar contratilidade desloca ESPVR.
- Acoplamento Ea/Ees quantifica eficiência mecânica, não moralidade da pressão.

### 4.5 `core/microcirculation.js`

Responsável por shunt, glicocálice, heterogeneidade, extração efetiva e falência citopática.

Invariantes:

- Macro normal não garante tecido perfundido.
- Shunt e falência mitocondrial podem elevar SvO₂ com lactato alto.
- O paradoxo séptico exige leitura conjunta: SvO₂ alta + déficit/lactato.

### 4.6 `core/shock.js`

Responsável por composição de fenótipos:

```js
classifyHypovolemic(state)
classifyCardiogenic(state)
classifyObstructive(state)
classifyDistributive(state)
classifyMixedShock(state)
```

Regra: classificação educacional nunca pode retornar conduta clínica acionável.

---

## 5. Contrato de dados de um módulo

Cada módulo deve poder ser descrito por um manifesto legível por humano e máquina.

Exemplo-alvo:

```yaml
id: 22
slug: anaphylactic-vs-neurogenic
title: Anafilático × neurogênico
block: III
status: planned
depends_on: [9, 20, 21]
core_concepts:
  - distributive_shock
  - systemic_vascular_resistance
  - capillary_leak
  - sympathetic_tone
  - relative_bradycardia
misconceptions:
  - distributive_equals_septic
  - hypotension_defines_shock
  - warm_skin_always_means_sepsis
invariants:
  - anaphylaxis_has_leak_or_airway_axis
  - neurogenic_has_loss_of_sympathetic_tone
  - neurogenic_lacks_expected_tachycardia
safety_level: high
```

No estado atual, essa ficha pode morar em `ROADMAP.md` ou `modulos.md`. No estado excelente, ela vira `curriculum.json` ou `curriculum.yaml`.

---

## 6. Fluxo de build perfeito

O rito ideal por módulo:

```text
1. Especificar tese fisiológica.
2. Especificar variáveis de estado.
3. Especificar invariantes.
4. Escrever modelN.js.
5. Escrever testN.node.js.
6. Rodar teste Node até 0 falhas.
7. Portar engine para HTML.
8. Escrever caso, trilha, instrumento, lab e tutor.
9. Escrever validateN.js.
10. Rodar npm run check.
11. Atualizar perfunde.html.
12. Atualizar ROADMAP.md e/ou modulos.md.
```

Nada entra por estética. Tudo entra por fisiologia.

---

## 7. Testes esperados por maturidade

### 7.1 Teste de motor

Deve provar:

- valores de referência;
- monotonicidades;
- contrastes fisiológicos;
- invariantes do módulo;
- limites numéricos;
- ausência de NaN/Infinity em faixas educacionais válidas.

### 7.2 Validador HTML

Deve provar:

- IDs essenciais existem;
- abas funcionam;
- sliders atualizam readouts;
- vereditos mudam quando o estado muda;
- banners aparecem nos estados corretos;
- tutor tem número mínimo de questões;
- cada questão tem 4 opções;
- cada `draw()` roda sem lançar;
- backlink, kicker, pontes, rodapé e disclaimer existem;
- não há conteúdo proibido por `SAFETY.md`.

### 7.3 Teste de integração futura

Alvo futuro:

- checador de links relativos;
- checador de módulos órfãos;
- checador de numeração;
- checador de CSS/JS duplicado;
- checador de acessibilidade mínima;
- snapshot estrutural do índice.

---

## 8. Governança de numeração

O estado publicado é a fonte operacional de verdade. Se `perfunde.html` aponta M22 como próximo, então M22 é o próximo módulo real, mesmo que documentos antigos tenham uma numeração histórica diferente.

Regra de ouro:

```text
perfunde.html + package.json + build/mN/ = verdade operacional
PERFUNDA.md + CHOQUE.md + modulos.md = verdade constitucional/curricular
```

Quando houver divergência, não se improvisa. Cria-se uma tarefa explícita de reconciliação documental.

---

## 9. Critério de excelência

O projeto atinge excelência quando qualquer módulo puder ser auditado assim:

```text
Qual conceito ele ensina?
Qual variável ele isola?
Qual erro cognitivo ele corrige?
Qual engine calcula isso?
Qual teste prova que o engine está correto?
Qual interação visual demonstra a causalidade?
Qual questão detecta se o aluno entendeu?
Qual disclaimer impede uso como conduta?
Qual módulo anterior ele exige?
Qual módulo posterior ele prepara?
```

Se alguma dessas perguntas não tiver resposta clara, o módulo ainda não está no estado supremo.
