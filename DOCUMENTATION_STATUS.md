# DOCUMENTATION_STATUS.md — Estado documental · PERFUNDE · CHOCA

Este arquivo registra o estado da documentação após a rodada de consolidação e reconciliação.

Ele existe para impedir um erro comum em projetos longos: a documentação parecer coerente porque cada arquivo isolado é bom, mas o conjunto carregar divergências históricas.

---

## 1. Estado atual

**Status:** reconciliado.

A documentação estrutural foi criada e os documentos centrais foram alinhados à numeração publicada em `perfunde.html`.

```text
módulos publicados: 0…21
próximo módulo: M22 · anafilático × neurogênico
planejados: M23…M29
portão global: npm run check
manifesto curricular: curriculum.json
```

---

## 2. Documentos existentes

### Porta de entrada

- `README.md` — visão geral do produto, estado atual, como rodar, mapa documental, invariantes e próxima fronteira.

### Constituição e domínio

- `PERFUNDA.md` — identidade, tese-mãe, invariantes, escada canônica e fronteira SaMD.
- `CHOQUE.md` — fisiologia, taxonomia, escada canônica, assinaturas e âncoras.
- `modulos.md` — blueprint pedagógico de cada módulo, agora alinhado ao índice publicado.

### Operação e maturidade

- `AGENTS.md` — instruções operacionais para construção e validação.
- `ARCHITECTURE.md` — arquitetura técnica e arquitetura-alvo.
- `MODULE_CONTRACT.md` — contrato formal para novos módulos.
- `SAFETY.md` — fronteira clínica, SaMD e proibições.
- `ROADMAP.md` — fases de evolução para plataforma verificável.
- `curriculum.json` — manifesto curricular legível por máquina.

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
```

Quando houver divergência futura, prevalece a verdade operacional para saber o que existe publicado; em seguida, a documentação deve ser reconciliada, não reinterpretada informalmente.

---

## 4. Divergência histórica resolvida

Divergência anterior:

```text
estado publicado atual: M21 = séptico; M22 = anafilático × neurogênico
alguns documentos antigos: anafilático × neurogênico aparecia como M21
```

Resolução:

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
```

A divergência era efeito de expansão curricular, não erro fisiológico.

---

## 5. Próxima ação recomendada

A próxima ação não é mais reconciliar documentação. Isso foi feito.

A próxima ação é construir **M22 · anafilático × neurogênico** sob o novo padrão:

```text
1. especificar variáveis de estado
2. escrever build/m22/model22.js
3. escrever build/m22/test22.node.js
4. escrever perfunde22.html
5. escrever build/m22/validate22.js
6. atualizar package.json
7. atualizar perfunde.html
8. atualizar curriculum.json para status published
9. rodar npm run check
```

M22 será o primeiro módulo criado integralmente depois da consolidação documental.

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
```

Esse critério agora está cumprido em primeira versão.

O próximo ganho de maturidade será automatizar checagens transversais contra `curriculum.json`.
