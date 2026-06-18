# DOCUMENTATION_STATUS.md — Estado documental · PERFUNDE · CHOCA

Este arquivo registra o estado da documentação após a rodada de consolidação, reconciliação e incorporação do M30.

Ele existe para impedir um erro comum em projetos longos: a documentação parecer coerente porque cada arquivo isolado é bom, mas o conjunto carregar divergências históricas.

---

## 1. Estado atual

**Status:** reconciliado e expandido para M30.

A documentação estrutural foi criada, os documentos centrais foram alinhados à numeração publicada em `perfunde.html`, e o fechamento avaliativo M30 foi especificado.

```text
módulos publicados: 0…30 (braço completo)
fechamento: M30 · exame global de domínio (150 itens, engine-grounded) — publicado
planejados: M23…M30
portão global: npm run check
manifesto curricular: curriculum.json
exame global: M30_ASSESSMENT_SPEC.md
```

---

## 2. Documentos existentes

### Porta de entrada

- `README.md` — visão geral do produto, estado atual, como rodar, mapa documental, invariantes e próxima fronteira.

### Constituição e domínio

- `PERFUNDA.md` — identidade, tese-mãe, invariantes, escada canônica, M30 e fronteira SaMD.
- `CHOQUE.md` — fisiologia, taxonomia, escada canônica, assinaturas, âncoras e M30.
- `modulos.md` — blueprint pedagógico de cada módulo, agora alinhado ao índice publicado e expandido até M30.

### Operação e maturidade

- `AGENTS.md` — instruções operacionais para construção e validação.
- `ARCHITECTURE.md` — arquitetura técnica e arquitetura-alvo.
- `MODULE_CONTRACT.md` — contrato formal para novos módulos.
- `SAFETY.md` — fronteira clínica, SaMD e proibições.
- `ROADMAP.md` — fases de evolução para plataforma verificável.
- `curriculum.json` — manifesto curricular legível por máquina, agora com M30.
- `M30_ASSESSMENT_SPEC.md` — especificação do exame global de domínio.

---

## 3. Fonte da verdade

A verdade operacional é composta por:

```text
perfunde.html
package.json
perfundeN.html
build/mN/modelN.js
build/mN/testN.node.js
build/mN/validateN.js
```

A verdade documental é composta por:

```text
README.md
PERFUNDA.md
CHOQUE.md
modulos.md
AGENTS.md
ARCHITECTURE.md
MODULE_CONTRACT.md
SAFETY.md
ROADMAP.md
curriculum.json
M30_ASSESSMENT_SPEC.md
```

Quando houver divergência futura, prevalece a verdade operacional para saber o que existe publicado; em seguida, a documentação deve ser reconciliada, não reinterpretada informalmente.

---

## 4. Divergência histórica resolvida

Divergência anterior:

```text
estado publicado atual: M21 = séptico; M22 = anafilático × neurogênico
alguns documentos antigos: anafilático × neurogênico aparecia como M21
```

Resolução atual:

```text
M21 = séptico
M22 = anafilático × neurogênico
M23 = choque misto
M24 = coração-pulmão
M25 = ressuscitação volêmica
M26 = choque críptico/compensado
M27 = os 4 perfis · radar
M28 = vasopressores & inotrópicos
M29 = capstone integrado
M30 = revisão global · exame de domínio · 225 itens (150 do braço + 75 inter-braços)
```

A expansão para M30 foi decisão curricular intencional: M29 fechou a narrativa integrada; M30 testa o domínio global — publicado e validado, fecha o braço.

---

## 5. Próxima ação recomendada

**M0…M30** estão publicados e validados (engine + teste + HTML + validador + wiring + `curriculum.json` em `published`); M24…M29 trazem a camada interativa do `MODULE_CONTRACT.md §2.6`; o M28 inaugurou a camada de referência farmacológica do `SAFETY.md §11`; o M29 fechou o conteúdo com o motor unificado (cascata integrada); e o **M30** fechou o braço como exame global de domínio (225 itens · validador psicométrico · engine-grounded · radar de 9 eixos). O braço está completo.

O M30 foi entregue em quatro quartos, com 225 itens (150 do braço + 75 inter-braços):

```text
Quarto 1 → fundamentos do transporte e determinantes
Quarto 2 → inversão causal, monitorização, micro/lactato
Quarto 3 → taxonomia dos choques e choque misto
Quarto 4 → integração, ressuscitação e inter-braços (eixo E9)
```

A próxima evolução é transversal, não mais um módulo de conteúdo: o guardião de QA (`build/qa/qa.js`, no `npm run check`) que audita todos os módulos de uma vez, e o núcleo fisiológico compartilhado (`source/core/`, `ROADMAP.md` Fase 4).

---

## 6. Critério de pronto documental

A documentação está em estado excelente inicial quando:

```text
README.md explica o produto
PERFUNDA.md define a constituição
CHOQUE.md define a fisiologia
modulos.md define o currículo
AGENTS.md define execução
ARCHITECTURE.md define arquitetura
MODULE_CONTRACT.md define módulos
SAFETY.md define fronteiras clínicas
ROADMAP.md define sequência
curriculum.json permite leitura por máquina
M30_ASSESSMENT_SPEC.md define o exame global
```

Esse critério agora está cumprido em primeira versão.

O próximo ganho de maturidade será automatizar checagens transversais contra `curriculum.json` e contra as regras psicométricas do M30.
