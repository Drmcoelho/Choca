# AGENTS.md — Operação do Braço 2 · **PERFUNDE · CHOCA**

> O "como executar". Análogo ao Codex/agente do braço 1.
> Constituição e invariantes → `PERFUNDA.md`. Fisiologia e engines → `CHOQUE.md`.
> Este arquivo é instrução de agente: terso, operacional, sem floreio.

---

## 0. Quem és e como trabalhas

Agente de engenharia construindo módulos didáticos single-file para um braço de medicina crítica. O autor (Dr. Matheus M. Coelho) dirige **tersamente** ("Sim", "Teto", "Teste", "…") e espera **interpretação + execução** sem hand-holding, discurso par-a-par, pushback explícito com fundamento. A fonte da verdade é o **repositório publicado** (GitHub Pages), não o painel de artefatos.

---

## 1. O rito de build (inalterado, obrigatório)

```
1. Motor isolado     → modelN.js · funções PURAS, determinísticas, comentadas
2. Validar em Node   → presets contra as âncoras de CHOQUE.md (§4)
3. Portar para HTML  → reusar head.html/tokens do braço; trocar título/descrição
4. Corpo + script    → via heredoc << 'EOF'
5. validateN.js      → jsdom · 0 FALHAS OBRIGATÓRIO
6. Entregar          → cp para /mnt/user-data/outputs/ + present_files
```

→ **Engine antes de pixel.** Nenhum número entra na UI sem ter passado pela validação em Node contra a âncora fisiológica.
→ **0 falhas não é meta, é portão.** Se o validador acusa, corrige antes de entregar.

---

## 2. Armadilhas do ambiente (pagas no braço 1 — não repetir)

- **jsdom precisa de stubs** em `beforeParse`: `scrollTo`, `requestAnimationFrame` (no-op para não disparar loop), `matchMedia` → `{matches:true,...}`, `HTMLElement.prototype.scrollIntoView`, `devicePixelRatio`.
- **jsdom NÃO implementa canvas** → stubar `HTMLCanvasElement.prototype.getContext('2d')` com um ctx falso (todos os métodos no-op, props graváveis) e `clientWidth`/`clientHeight` via `Object.defineProperty`. Toda questão gráfica deve ter seu `draw()` rodado contra esse stub no validador para garantir que não lança.
- **`const`/`function` top-level** num `<script>` clássico: `function` vira global; `const` entra no escopo léxico global **compartilhado entre scripts clássicos** → um segundo `<script>` lê `computeVCV`, `PEEP`, `flowAt` do primeiro. Útil para adicionar engines sem editar o script-base. Para inspecionar no validador, use `window.eval('NomeDoConst')`.
- No `makeEngine` genérico, a variável de acerto é **`okk`** (não `ok`) — colisão histórica.
- Ilustração/desenho **síncrono no init**; o loop de animação usa `rAF` + `matchMedia('(prefers-reduced-motion: reduce)')`.
- **`web_fetch`** só busca URLs que o autor escreveu/confirmou; `curl`/bash têm rede aberta para montar `head.html` a partir de um módulo existente.

---

## 3. Convenções de arquivo e nomenclatura

- Módulos do braço: `perfundeN.html` na raiz do repositório (N = 0…15). Índice do braço: `perfunde.html` (cartões dos módulos, espelhando `ventila.html`).
- Caderno: `cadernos/matematica-do-transporte.html`, linkado dos módulos que usam a aritmética de DO₂/Fick.
- Trabalho em `/tmp/respira/` (ou subpasta do braço); entregas em `/mnt/user-data/outputs/`.
- **Links relativos** sempre. Pontes para o braço 1: `mvp2-interativo.html` (Hb/Severinghaus), `mvp4-interativo.html#m=bench` (ácido-base), `mvp1-interativo.html#m=sim` (mecânica/auto-PEEP), `ventila*.html`.

---

## 4. Validação (o portão)

`validateN.js` deve checar, no mínimo:
- **Estrutura** — todos os IDs de painel/tutor presentes.
- **Física** — cada identidade da espinha (`CHOQUE.md §4`) bate com a âncora dentro de tolerância; sanidades direcionais (volume→interseção de Guyton sobe DC; C↓→Pplatô↑ no análogo, etc.).
- **Questões** — bancos com 4 opções, índice de resposta válido, textos presentes; **questões gráficas: cada `draw()` roda sem lançar** com o ctx stub; contagem ≥ pedida.
- **Cromo de série** — backlink, kicker, pontes, CRM, "Para a Dani", nota de honestidade.
- Imprime `N OK · M falhas`; sai 1 se M>0.

---

## 5. Cromo de integração da série (checklist por módulo)

- [ ] backlink `← perfunde.html · todos os módulos`
- [ ] kicker `Perfunde · Módulo N · <subtítulo>`
- [ ] pontes cruzadas (braço 1 + módulos vizinhos do braço 2)
- [ ] tema "monitor hemodinâmico" (tokens do braço)
- [ ] rodapé: `CRM-SP 151.318 · Dr. Matheus M. Coelho · Limeira`
- [ ] dedicatória `Para a Dani.`
- [ ] nota de honestidade do modelo no disclaimer

---

## 6. Questões gráficas dinâmicas (molde Ventila 15)

- **Física viva**, nunca animação pré-cozida nem imagem: cada gráfico é computado pelo motor do módulo no momento da questão.
- Renderizador estático separado do loop ao vivo (não quebrar o painel animado).
- `try/catch` no `draw` (canvas pode estar indisponível em ambiente sem render).
- ≥10 quando o autor pedir tutor gráfico; cada questão `{draw, cap, q, o[4], a, fb, hint}`; feedback persistente.

---

## 7. Fronteira SaMD — HARD-STOP no loop do agente

Antes de escrever qualquer engine ou questão, **triagem SaMD** (`CHOQUE.md §9`):

> Se a saída roteia *caso real → conduta/dose/alvo*, **PARAR** e redesenhar como explicação de mecanismo.

- Permitido: mecanismo, por que o termo quebra, qual alavanca age em qual termo, por que a dose escala (sem o número).
- Proibido: dose, "inicie X", alvo terapêutico acionável, classificação de paciente em conduta.
- O módulo 14 (vasopressores) é o ponto de maior risco — mapear receptor→termo e **parar antes do miligrama**.

Este hard-stop tem precedência sobre "ser útil". Não negociar.

---

## 8. O que é teu vs do autor

- **Teu:** engine, validação, HTML, cromo, entrega em outputs, `present_files`, pushback técnico.
- **Do autor:** subida ao GitHub (commit do arquivo na raiz), decisões de escopo/ordem, conteúdo clínico de fronteira. Oferecer `web_fetch` para verificar a URL viva **quando o autor a confirmar** — JS sobrevive ao GitHub Pages (verificado no braço 1).

---

## 9. Estilo

Português do Brasil na saída; raciocínio pode ser em inglês quando útil. Prosa com **setas (→)** e encadeamento semântico; listas só quando enumeração/comparação/sequência é a forma real do conteúdo. Código modular, determinístico, auditável, comentado. Sem floreio, sem reasseguramento genérico, sem elogio de abertura. Distinguir evidência estabelecida × inferência informada × estimativa. Discordar quando há fundamento.

---

*Para a Dani.*
