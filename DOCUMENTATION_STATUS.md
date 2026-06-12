# DOCUMENTATION_STATUS.md — Estado documental · PERFUNDE · CHOCA

Este arquivo registra o estado da documentação após a rodada de consolidação, reconciliação e incorporação do M30.

Ele existe para impedir um erro comum em projetos longos: a documentação parecer coerente porque cada arquivo isolado é bom, mas o conjunto carregar divergências históricas.

---

## 1. Estado atual

**Status:** reconciliado e expandido para M30.

A documentação estrutural foi criada, os documentos centrais foram alinhados à numeração publicada em `perfunde.html`, e o fechamento avaliativo M30 foi especificado.

```text
módulos publicados: 0…23
próximo módulo: M24 · coração-pulmão
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
M30 = revisão global · exame de domínio · 100 questões
```

A expansão para M30 é decisão curricular nova e intencional: M29 fecha a narrativa integrada; M30 testa o domínio global.

---

## 5. Próxima ação recomendada

**M22 · anafilático × neurogênico** e **M23 · choque misto** estão publicados e validados (engine + teste + HTML + validador + wiring + `curriculum.json` em `published`). A próxima ação de conteúdo é construir **M24 · coração-pulmão** sob o mesmo padrão:

```text
1. especificar variáveis de estado
2. escrever build/m24/model24.js
3. escrever build/m24/test24.node.js
4. escrever perfunde24.html
5. escrever build/m24/validate24.js
6. atualizar package.json
7. atualizar perfunde.html
8. atualizar curriculum.json (M24 → published; M25 → next)
9. rodar npm run check
```

A ação avaliativa futura é construir M30 em quatro partes:

```text
Parte 1 → questões 1–25
Parte 2 → questões 26–50
Parte 3 → questões 51–75
Parte 4 → questões 76–100
```

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
