# PERFUNDE · CHOCA

**Simulador causal offline de fisiologia do choque para raciocínio médico de alta fidelidade.**

PERFUNDE · CHOCA é o braço de perfusão e choque do hexápode de medicina crítica. O projeto não ensina choque como lista de categorias. Ele ensina choque como falência localizada da cadeia de transporte de oxigênio: conteúdo arterial, débito cardíaco, pressão de perfusão, resistência vascular sistêmica, microcirculação, extração, utilização mitocondrial e lactato.

A tese-mãe é simples e brutal:

> **Choque não é pressão baixa. Choque é falência da entrega efetiva de oxigênio ao tecido.**

A pressão arterial é um número resultante. A fisiologia mora nos termos que produziram esse número.

---

## Estado atual

O repositório contém o índice `perfunde.html`, módulos `perfunde0.html` a `perfunde30.html`, engines puros em `build/mN/modelN.js`, testes Node em `build/mN/testN.node.js`, validadores jsdom em `build/mN/validateN.js`, um núcleo fisiológico compartilhado em `source/core/` (fórmulas canônicas + teste de conformância contra os engines), o guardião transversal em `build/qa/qa.js` e portão automatizado via `npm run check`.

Estado curricular atual:

- **M0–M2** — fundamentos do transporte, CaO₂ e curva de oxi-hemoglobina.
- **M3–M8** — determinantes: débito cardíaco, pré-carga/Guyton, Frank-Starling, pós-carga/alça PV, DO₂/VO₂.
- **M9–M13** — inversão causal, monitorização, POCUS/acessos, microcirculação e lactato.
- **M14–M21** — choques: hipovolêmico, hemorrágico/não-hemorrágico, cardiogênico, VD, obstrutivo, capstone obstrutivo, distributivo e séptico.
- **M22** — publicado: anafilático × neurogênico — discrimina os três distributivos (séptico, anafilático, neurogênico) pela assinatura FC × RVS.
- **M23** — publicado: choque misto — compõe os termos quebrados, atribui o déficit ao mecanismo dominante e expõe o mascaramento (PAM normal, tecido faminto).
- **M24** — publicado: o coração-pulmão — a pressão intratorácica descarrega o VE que falha e esmaga o VD que falha; PVR em U e PEEP ótima.
- **M25** — publicado: ressuscitação volêmica — volume como droga com janela terapêutica (benefício decai, custo acumula); o 2×2 responsivo × tolerante.
- **M26** — publicado: choque críptico/compensado — a PAM normal mente; a compensação tem reserva finita e há um precipício; marcadores ocultos denunciam.
- **M27** — publicado: os 4 perfis · radar — perfusão (fluxo) × congestão num mapa 2×2 (A/B/L/C); a mesma alavanca tem efeito oposto por canto.
- **M28** — publicado: vasopressores & inotrópicos — receptor → termo da equação; inaugura a **camada de referência farmacológica** (diluições/doses usuais, calculadora dose↔mL/h) sob o `SAFETY.md §11`. Evoluído em **hub do atlas farmacológico** (`expansao.md`), com 8 submódulos: **28A** gramática · **28B** catecolaminérgicos · **28C** vasopressina · **28D** inotrópicos · **28E** dobutamina (fluxo × pressão) · **28F** inodilatadores · **28G** combinações por fenótipo · **28H** segurança operacional §11. Cada submódulo conforma o engine publicado (motor `source/core/pharmacodynamics.js`).
- **M29** — publicado: capstone · caso integrado — o braço inteiro num **motor unificado** (cascata CaO₂→DO₂→VO₂→PAM→perfil), com instrumento ao vivo, caso que muda de categoria, 30 MCQ e 120 assertivas V/F.
- **M30** — publicado: exame global de domínio — **225 itens** (150 do braço + **75 inter-braços**) em 4 quartos, 6 formatos, **engine-grounded** (gabarito recomputado pelos motores), **radar de maestria** em 9 eixos (incl. integração inter-braços), **21 trilhas** (categorias que selecionam e ordenam os itens existentes — do novato ao avançado, ou focando pulmão–coração–rim) e psicometria anti-gaming. Fecha o braço e costura os vizinhos.

---

## Como rodar

```bash
npm install
npm run check
```

`npm run check` executa três portões:

```bash
npm test          # engines fisiológicos em Node
npm run validate  # HTML + UI + jsdom + bancos de questões
npm run qa        # guardião transversal: audita TODOS os módulos de uma vez
```

O guardião (`build/qa/qa.js`) é o portão de coerência do braço inteiro: confere inventário × `curriculum.json`, índice sem órfãos, links intra-braço, cromo de série (rodapé/backlink/disclaimer), firewall SaMD transversal, fiação do `package.json`, arquivos de build por módulo, presença/fiação do núcleo `source/core`, acessibilidade básica (lang/charset/viewport/título), andaime de UI (abas/painéis ARIA pareados), tutor socrático nos módulos de conteúdo, psicometria do banco do M30 (letras 15–35%, correta≠mais-longa), o **atlas farmacológico** (hub M28 + submódulos 28A–28H: links hub↔submódulo, cromo/a11y/UI/firewall por submódulo, enquadramento §11 onde há dose) e coerência de contagens/ranges na documentação.

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
- `M30_ASSESSMENT_SPEC.md` — especificação do exame global (publicado com 225 itens: 150 do braço + 75 inter-braços).
- `source/core/README.md` — núcleo fisiológico compartilhado (fonte modular das fórmulas) e seu teste de conformância contra os engines.
- `expansao.md` — o atlas farmacológico: M28 como hub, os submódulos 28A–28H, a aba Surviving do M21 e a fronteira §11 (concluído).

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

M30 é exceção: ele é avaliação global, não conteúdo novo. Seu padrão é psicométrico: 225 itens (150 do braço + 75 inter-braços), quatro quartos, dificuldade crescente, módulos embaralhados, distribuição A/B/C/D controlada e gabarito ultra-robusto.

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

## Estado do braço

O braço está **completo**: `M0`…`M30` publicados e validados (`npm run check` verde). O Bloco IV (`M23`…`M29`) está no padrão interativo rico (`MODULE_CONTRACT.md §2.6`); o M28 inaugurou a camada de referência farmacológica (`SAFETY.md §11`); o M29 fechou o conteúdo com o motor unificado da cascata; e o **M30** fecha o braço como **sistema de avaliação de domínio**: 225 itens (150 do braço + 75 **inter-braços**, eixo E9, cada questão ligando 2–3 braços do hexápode: RESPIRA·VENTILA × PERFUNDE·CHOCA × FILTRA·DIALISA), 6 formatos, **engine-grounded** (`build/m30/grounding30.js`), **radar de maestria** em 9 eixos (`scoring30.js`) e psicometria anti-gaming (`psyche30.js`), com `build/m30/PLAN.md` documentando o desenho.

O alvo foi atingido: cada botão obedece à fisiologia, cada fórmula é testável, cada erro do aluno revela uma falha conceitual e cada módulo pertence a um mapa causal maior — agora com uma prova final que mede o domínio desse mapa.
