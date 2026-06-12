# DOCUMENTATION_STATUS.md — Estado documental · PERFUNDE · CHOCA

Este arquivo registra o estado da documentação após a primeira rodada de consolidação.

Ele existe para impedir um erro comum em projetos longos: a documentação parecer coerente porque cada arquivo isolado é bom, mas o conjunto ainda carregar divergências históricas.

---

## 1. Documentos agora existentes

### Porta de entrada

- `README.md` — visão geral do produto, estado atual, como rodar, mapa documental, invariantes e próxima fronteira.

### Constituição e domínio

- `PERFUNDA.md` — identidade, tese-mãe, invariantes e lugar no hexápode.
- `CHOQUE.md` — fisiologia, taxonomia e âncoras de engines.
- `modulos.md` — blueprint pedagógico dos módulos.

### Operação e maturidade

- `AGENTS.md` — instruções operacionais atualizadas para o estado atual do projeto.
- `ARCHITECTURE.md` — arquitetura técnica e arquitetura-alvo.
- `MODULE_CONTRACT.md` — contrato formal para novos módulos.
- `SAFETY.md` — fronteira clínica, SaMD e proibições.
- `ROADMAP.md` — fases de evolução para plataforma verificável.

---

## 2. Estado operacional reconhecido

A camada operacional reconhece:

```text
módulos publicados: 0…21
próximo módulo: M22 · anafilático × neurogênico
portão global: npm run check
```

A verdade operacional é composta por:

```text
perfunde.html
package.json
perfundeN.html
build/mN/modelN.js
build/mN/testN.node.js
build/mN/validateN.js
```

---

## 3. Divergência documental conhecida

`PERFUNDA.md`, `CHOQUE.md` e `modulos.md` foram escritos em momentos diferentes da evolução do braço. Eles preservam conteúdo fisiológico útil, mas podem carregar divergência de numeração e escopo em relação ao estado publicado atual.

A divergência mais importante:

```text
estado publicado atual: M21 = séptico; M22 = anafilático × neurogênico
alguns documentos antigos: anafilático × neurogênico aparece como M21
```

Isso não é erro fisiológico. É dívida de sincronização documental.

---

## 4. Regra de reconciliação

Não apagar história. Não fingir que a numeração nunca mudou.

Ao reconciliar:

1. preservar a tese fisiológica de cada documento;
2. atualizar numeração para o estado publicado;
3. registrar que houve deslocamento por expansão curricular;
4. manter `perfunde.html` e `package.json` como fonte operacional;
5. manter `PERFUNDA.md` como constituição, mas atualizada para a realidade atual.

---

## 5. Próxima ação documental recomendada

Ordem recomendada:

```text
1. revisar PERFUNDA.md
2. revisar CHOQUE.md §4, especialmente escada de módulos
3. revisar modulos.md para alinhar M19–M22
4. criar curriculum.json/yaml depois da reconciliação, não antes
```

Criar `curriculum.json` antes de reconciliar a numeração congelaria a inconsistência.

---

## 6. Critério de pronto da documentação

A documentação estará em estado excelente quando:

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
```

e nenhum deles contradiz o estado operacional do repositório.
