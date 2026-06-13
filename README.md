# PERFUNDE · CHOCA

**Simulador causal offline de fisiologia do choque para raciocínio médico de alta fidelidade.**

PERFUNDE · CHOCA é o braço de perfusão e choque do hexápode de medicina crítica. O projeto não ensina choque como lista de categorias. Ele ensina choque como falência localizada da cadeia de transporte de oxigênio: conteúdo arterial, débito cardíaco, pressão de perfusão, resistência vascular sistêmica, microcirculação, extração, utilização mitocondrial e lactato.

A tese-mãe é simples e brutal:

> **Choque não é pressão baixa. Choque é falência da entrega efetiva de oxigênio ao tecido.**

A pressão arterial é um número resultante. A fisiologia mora nos termos que produziram esse número.

---

## Estado atual

O repositório contém o índice `perfunde.html`, módulos `perfunde0.html` a `perfunde21.html`, engines puros em `build/mN/modelN.js`, testes Node em `build/mN/testN.node.js`, validadores jsdom em `build/mN/validateN.js` e portão automatizado via `npm run check`.

Estado curricular atual:

- **M0–M2** — fundamentos do transporte, CaO₂ e curva de oxi-hemoglobina.
- **M3–M8** — determinantes: débito cardíaco, pré-carga/Guyton, Frank-Starling, pós-carga/alça PV, DO₂/VO₂.
- **M9–M13** — inversão causal, monitorização, POCUS/acessos, microcirculação e lactato.
- **M14–M21** — choques: hipovolêmico, hemorrágico/não-hemorrágico, cardiogênico, VD, obstrutivo, capstone obstrutivo, distributivo e séptico.
- **M22** — publicado: anafilático × neurogênico — discrimina os três distributivos (séptico, anafilático, neurogênico) pela assinatura FC × RVS.
- **M23** — publicado: choque misto — compõe os termos quebrados, atribui o déficit ao mecanismo dominante e expõe o mascaramento (PAM normal, tecido faminto). Próximo módulo de conteúdo: **M24 · coração-pulmão**.
- **M24–M29** — integração e resgate.
- **M30** — revisão global / exame de domínio com 100 questões.

---

## Como rodar

```bash
npm install
npm run check
```

`npm run check` executa dois portões:

```bash
npm test          # engines fisiológicos em Node
npm run validate  # HTML + UI + jsdom + bancos de questões
```

A regra é binária: **0 falhas ou não entra**.

---

## Documentação essencial

- `PERFUNDA.md` — constituição do braço: identidade, tese, invariantes, escada canônica e fronteira SaMD.
- `CHOQUE.md` — domínio clínico-fisiológico: taxonomia, engines, assinaturas e âncoras.
- `modulos.md` — blueprint curricular e pedagógico, alinhado ao índice publicado.
- `AGENTS.md` — rito operacional para agentes/codex: como construir, validar e entregar.
- `ARCHITECTURE.md` — arquitetura técnica e alvo de excelência.
- `MODULE_CONTRACT.md` — contrato formal de qualquer novo módulo.
- `SAFETY.md` — fronteira clínica, SaMD e proibições absolutas.
- `ROADMAP.md` — plano de evolução para plataforma fisiológica verificável.
- `DOCUMENTATION_STATUS.md` — estado documental reconciliado.
- `curriculum.json` — manifesto curricular legível por máquina.
- `M30_ASSESSMENT_SPEC.md` — especificação do exame global de 100 questões.

---

## Filosofia de construção

Cada módulo de conteúdo deve obedecer à mesma ordem:

```text
fisiologia → engine puro → teste Node → HTML single-file → validação jsdom → índice → CI
```

O pixel não manda na fisiologia. O motor manda no pixel.

O padrão mínimo de um módulo é:

1. caso clínico de 5 atos;
2. trilha socrática;
3. instrumento visual computado ao vivo;
4. lab com sliders, veredito e banners;
5. avaliação com feedback causal;
6. pontes para módulos vizinhos;
7. nota explícita de honestidade do modelo;
8. rodapé da série;
9. engine determinístico;
10. teste e validador com 0 falhas.

M30 é exceção: ele é avaliação global, não conteúdo novo. Seu padrão é psicométrico: 100 questões, quatro quartos, dificuldade crescente, módulos embaralhados, distribuição A/B/C/D controlada e gabarito ultra-robusto.

---

## Invariantes do produto

- **Offline.** Nenhum módulo depende de rede para funcionar.
- **Single-file por módulo.** O HTML publicado deve sobreviver sozinho.
- **Zero dependências externas em runtime.** `jsdom` existe apenas como ferramenta de validação.
- **Sem armazenamento de navegador.** Nada de `localStorage` ou telemetria oculta.
- **Engine antes de UI.** Fórmula validada antes de gráfico.
- **Física viva.** Gráficos e questões são computados, não imagens pré-cozidas.
- **Português do Brasil.** Prosa causal, seca, com setas quando útil.
- **SaMD hard-stop.** Mecanismo sim; dose, alvo terapêutico acionável e prescrição automatizada, não.
- **Avaliação sem pista formal.** No M30, a resposta correta não pode ser inferida por letra, tamanho, maior número ou padrão.

---

## O que este projeto nunca deve virar

PERFUNDE · CHOCA não é protocolo de choque, calculadora de dose, triador terapêutico, substituto de julgamento clínico ou ferramenta de suporte à decisão para caso real.

Ele é uma máquina educacional: explicita causalidade, força decomposição fisiológica e treina o aluno a não confundir número resultante com mecanismo.

---

## Próxima fronteira

A documentação estrutural foi consolidada e reconciliada, e `M22 · anafilático × neurogênico` e `M23 · choque misto` estão publicados sob o novo padrão documental. A próxima etapa concreta é construir `M24 · coração-pulmão` no mesmo rito:

```text
1. especificar variáveis de estado
2. escrever build/m24/model24.js
3. escrever build/m24/test24.node.js
4. construir perfunde24.html
5. escrever build/m24/validate24.js
6. atualizar package.json e perfunde.html
7. atualizar curriculum.json para status published
8. rodar npm run check
```

Em paralelo, M30 já está especificado como fechamento avaliativo do braço. Ele será construído em quatro partes de 25 questões após estabilização de M22–M29.

O alvo final é um sistema em que cada botão obedeça à fisiologia, cada fórmula seja testável, cada erro do aluno revele uma falha conceitual e cada módulo pertença a um mapa causal maior.
