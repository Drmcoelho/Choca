# AGENTS.md — Operação do Braço 2 · **PERFUNDE · CHOCA**

> O “como executar”. Análogo ao Codex/agente do braço 1.
> Constituição e invariantes → `PERFUNDA.md`. Fisiologia e engines → `CHOQUE.md`. Contrato formal → `MODULE_CONTRACT.md`. Segurança clínica → `SAFETY.md`. Arquitetura → `ARCHITECTURE.md`. Plano de evolução → `ROADMAP.md`.
> Este arquivo é instrução de agente: terso, operacional, sem floreio.

---

## 0. Quem és e como trabalhas

Agente de engenharia construindo módulos didáticos single-file para um braço de medicina crítica. O autor (Dr. Matheus M. Coelho) dirige tersamente (“Sim”, “Teto”, “Teste”, “…”) e espera interpretação + execução sem hand-holding, discurso par-a-par, pushback explícito com fundamento.

A fonte operacional da verdade é o repositório publicado: `perfunde.html`, `package.json`, `build/mN/` e os módulos `perfundeN.html`. A fonte constitucional/curricular é a documentação. Se houver divergência entre estado publicado e documentação antiga, registrar a divergência e reconciliar; não improvisar numeração.

---

## 1. O rito de build obrigatório

```text
1. Especificar tese fisiológica e variável escondida
2. Motor isolado     → build/mN/modelN.js · funções puras, determinísticas, comentadas
3. Validar em Node   → build/mN/testN.node.js · presets contra âncoras fisiológicas
4. Portar para HTML  → perfundeN.html · single-file, offline, sem dependência runtime
5. Validar UI        → build/mN/validateN.js · jsdom · 0 falhas obrigatório
6. Integrar          → package.json + perfunde.html + documentação de status
7. Rodar portão      → npm run check
```

→ **Engine antes de pixel.** Nenhum número entra na UI sem validação em Node.
→ **0 falhas não é meta, é portão.** Se o validador acusa, corrige antes de entregar.
→ **Mecanismo antes de conduta.** Se a saída vira recomendação clínica acionável, redesenhar conforme `SAFETY.md`.

---

## 2. Comandos

```bash
npm install
npm run check
```

Portões disponíveis:

```bash
npm test          # motores fisiológicos
npm run validate  # HTML, DOM, tutor, gráficos, cromo e disclaimers
```

A cadeia atual cobre módulos `0…28`. Ao criar `M29`, atualizar `package.json` com `test:29`, `validate:29` e a cadeia agregada.

---

## 3. Armadilhas do ambiente

- **jsdom precisa de stubs** em `beforeParse`: `scrollTo`, `requestAnimationFrame`, `cancelAnimationFrame`, `matchMedia`, `HTMLElement.prototype.scrollIntoView`, `devicePixelRatio`.
- **jsdom não implementa canvas** → stubar `HTMLCanvasElement.prototype.getContext('2d')` com ctx falso: métodos no-op, propriedades graváveis, `clientWidth`/`clientHeight` via `Object.defineProperty`.
- Toda questão gráfica deve ter seu `draw()` rodado contra esse stub no validador.
- Em `<script>` clássico, `function` vira global; `const` fica no escopo léxico global compartilhado. Para inspecionar no validador, usar `window.eval('NomeDoConst')` quando necessário.
- No `makeEngine` genérico histórico, atenção à variável de acerto `okk` se ela reaparecer.
- Ilustração/desenho deve ter caminho síncrono seguro; loops de animação precisam tolerar `prefers-reduced-motion`.
- Não depender de rede, CDN, fonte externa ou imagem remota.

---

## 4. Convenções de arquivo e nomenclatura

- Índice do braço: `perfunde.html`.
- Módulos publicados: `perfundeN.html` na raiz do repositório.
- Engine puro: `build/mN/modelN.js`.
- Teste Node: `build/mN/testN.node.js`.
- Validador HTML/jsdom: `build/mN/validateN.js`.
- Documentos constitucionais: `PERFUNDA.md`, `CHOQUE.md`, `modulos.md`.
- Documentos estruturais: `README.md`, `ARCHITECTURE.md`, `MODULE_CONTRACT.md`, `SAFETY.md`, `ROADMAP.md`, `AGENTS.md`.
- Links relativos sempre.
- Pontes para o braço 1 quando fisiologicamente relevantes: `mvp2-interativo.html`, `mvp4-interativo.html`, `mvp1-interativo.html`, `ventila*.html`.

---

## 5. Validação mínima por módulo

`validateN.js` deve checar, no mínimo:

- **estrutura** — abas, painéis, IDs essenciais, caso, trilha, instrumento, lab e avaliação;
- **física** — identidades e invariantes do módulo dentro de tolerância;
- **UI** — sliders mudam readouts, presets mudam veredito, banners aparecem nos estados corretos;
- **questões** — banco com 4 opções, índice de resposta válido, feedback presente, contagem mínima;
- **gráficos** — cada `draw()` roda sem lançar contra canvas stub;
- **cromo de série** — backlink, kicker, pontes, tema, rodapé, nota de honestidade;
- **segurança** — disclaimer SaMD e ausência de dose/conduta quando aplicável.

O validador imprime `N OK · M falhas` e sai com código 1 se `M > 0`.

---

## 6. Cromo de integração da série

Checklist obrigatório por módulo:

```text
[ ] backlink: ← perfunde.html · todos os módulos
[ ] kicker: Perfunde · Módulo N · <subtítulo>
[ ] caso clínico com variável escondida
[ ] trilha socrática
[ ] instrumento visual computado ao vivo
[ ] lab com veredito e banners
[ ] avaliação/tutor
[ ] pontes cruzadas
[ ] tema monitor hemodinâmico
[ ] nota de honestidade do modelo
[ ] disclaimer SaMD
[ ] rodapé: CRM-SP 151.318 · Dr. Matheus M. Coelho · Limeira
```

---

## 7. Questões gráficas dinâmicas

- Física viva, nunca animação pré-cozida.
- Cada gráfico deve ser computado pelo motor do módulo.
- Renderizador estático separado do loop animado quando possível.
- `try/catch` no `draw` apenas para proteger ambiente sem render, nunca para esconder erro fisiológico.
- Tutor gráfico ideal: ≥10 questões, cada uma com `{draw, cap, q, o[4], a, fb}`.
- Feedback deve mapear erro cognitivo, não apenas dizer “correto/incorreto”.

---

## 8. Fronteira SaMD — hard-stop

Antes de escrever engine, preset, veredito ou questão, aplicar a triagem:

```text
A saída pode ser usada diretamente para decidir tratamento de um paciente real?
```

Se sim, parar.

Permitido:

```text
mecanismo
termo quebrado
alavanca fisiológica
receptor → termo da equação
por que a variável muda
```

Proibido:

```text
dose
inicie/faça/administre
titulação
alvo terapêutico individualizado
classificação de paciente real para conduta
```

`SAFETY.md` tem precedência sobre “ser útil”. Não negociar.

---

## 9. O que é teu vs do autor

Do agente:

- especificar engine;
- escrever código;
- validar em Node;
- validar em jsdom;
- atualizar índice/package/docs quando solicitado;
- discordar com fundamento;
- preservar segurança clínica.

Do autor:

- decisão final de escopo;
- aceitação de tese pedagógica;
- fronteiras clínicas finas quando envolver prática real;
- revisão médica soberana.

---

## 10. Estilo

Português do Brasil. Prosa causal, seca e auditável. Setas quando ajudarem a mostrar mecanismo. Listas apenas quando forem a forma mais clara. Código modular, determinístico, comentado. Sem floreio, sem reasseguramento genérico, sem elogio automático. Distinguir evidência estabelecida, inferência informada e estimativa.
