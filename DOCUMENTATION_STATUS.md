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
módulos publicados: 0…22
próximo módulo: M23 · choque misto
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

## 3. Divergência documental — RECONCILIADA

`PERFUNDA.md`, `CHOQUE.md` e `modulos.md` foram escritos em momentos diferentes da evolução do braço. A divergência de numeração foi **reconciliada** (commits de reconciliação na `main` + publicação do M22):

```text
estado publicado atual: M21 = séptico; M22 = anafilático × neurogênico (publicado)
próximo: M23 = choque misto
documentos antigos posicionavam anafilático/neurogênico como M21 — corrigido em todos os documentos centrais.
```

Não foi erro fisiológico; foi dívida de sincronização documental, agora quitada. A regra abaixo permanece como guarda contra reincidência.

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

Reconciliação concluída (PERFUNDA, CHOQUE, modulos alinhados a M0…M22). Ordem recomendada a partir daqui:

```text
1. extrair core mínimo (oxygen + hemodynamics) atrás de um passo de inline
2. provar o core nos sentinelas M9, M20, M21
3. criar curriculum.json/yaml — agora seguro, pois a numeração está estável
```

A inconsistência de numeração que tornaria perigoso criar `curriculum.json` foi resolvida.

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
