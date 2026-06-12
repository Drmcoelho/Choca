# MODULE_CONTRACT.md — Contrato formal de módulo · PERFUNDE · CHOCA

Este documento define o que um módulo precisa ser para entrar no projeto.

Um módulo não é uma aula. Um módulo é uma unidade fisiológica computável, visual, avaliável e segura.

A forma mínima é:

```text
perfundeN.html
build/mN/modelN.js
build/mN/testN.node.js
build/mN/validateN.js
entrada em package.json
entrada em perfunde.html
ponte documental em ROADMAP.md/modulos.md quando necessário
```

---

## 1. Definição de pronto

Um módulo está pronto apenas quando cumpre todos os critérios abaixo.

### 1.1 Conceito

O módulo deve declarar:

- tese fisiológica central;
- variável escondida;
- erro cognitivo principal;
- dependências pedagógicas;
- ponte para módulos anteriores e posteriores.

Sem isso, o módulo vira conteúdo acumulado, não raciocínio.

### 1.2 Engine

O módulo deve conter `build/mN/modelN.js` com funções puras, determinísticas e comentadas.

Proibido no engine:

- manipular DOM;
- depender de canvas;
- depender de browser;
- ler input global implícito;
- fazer I/O;
- usar estado oculto mutável sem necessidade;
- misturar fórmula com texto de UI.

Permitido:

- constantes fisiológicas didáticas;
- clamps explícitos;
- funções auxiliares pequenas;
- retorno de objetos com variáveis intermediárias auditáveis.

O motor deve permitir que outro agente leia o arquivo e entenda a fisiologia sem abrir o HTML.

### 1.3 Teste Node

O módulo deve conter `build/mN/testN.node.js`.

O teste deve provar, no mínimo:

- valores basais plausíveis;
- contraste entre dois fenótipos;
- monotonicidades essenciais;
- invariante principal;
- ausência de falhas em cenário-limite educacional;
- que a mensagem fisiológica do módulo é verdadeira.

Teste que só verifica se a função roda é insuficiente.

### 1.4 HTML publicado

O módulo deve conter `perfundeN.html`, single-file, offline, autossuficiente.

Deve conter:

1. backlink para `perfunde.html`;
2. kicker com número e subtítulo;
3. título forte;
4. descrição curta da tese;
5. caso clínico de 5 atos ou formato justificado;
6. trilha socrática;
7. instrumento visual;
8. lab com controles;
9. veredito vivo;
10. banners contextuais;
11. avaliação/tutor;
12. pontes;
13. nota de honestidade;
14. disclaimer SaMD;
15. rodapé da série.

### 1.5 Validador jsdom

O módulo deve conter `build/mN/validateN.js`.

O validador deve checar:

- estrutura de abas;
- IDs essenciais;
- existência de caso/trilha/instrumento/lab/avaliação;
- funções globais necessárias para inspeção;
- readouts coerentes;
- vereditos em presets distintos;
- banners nos estados certos;
- tutor com banco válido;
- renderização de todos os gráficos sem lançar;
- backlink, kicker, pontes, CRM, honestidade e disclaimer;
- ausência de string proibida se houver guarda específica.

### 1.6 Portão global

Depois de adicionar o módulo:

```bash
npm run check
```

precisa retornar 0 falhas.

---

## 2. Anatomia pedagógica obrigatória

### 2.1 Caso clínico

O caso deve conter tensão causal. O aluno deve começar com uma leitura superficial e terminar percebendo que a variável relevante estava escondida.

Exemplo de forma:

```text
Ato 1 — apresentação aparente
Ato 2 — leitura ingênua
Ato 3 — dado que quebra a hipótese
Ato 4 — decomposição fisiológica
Ato 5 — síntese causal
```

O caso não deve prescrever conduta. Ele deve revelar mecanismo.

### 2.2 Trilha socrática

A trilha deve conduzir por perguntas encadeadas:

```text
número observado → decomposição → termo quebrado → compensação → consequência tecidual
```

A trilha não deve ser FAQ. Deve ser uma sequência de raciocínio.

### 2.3 Instrumento

O instrumento deve mostrar a equação viva.

Não basta desenhar uma curva. A curva precisa responder ao estado.

Critério:

```text
mover controle → recalcular engine → redesenhar variável → alterar leitura fisiológica
```

### 2.4 Lab

O lab é onde o aluno quebra a fisiologia com as próprias mãos.

Deve ter:

- controles com faixas fisiologicamente educativas;
- readouts claros;
- veredito categórico;
- banners de armadilha;
- presets representativos.

### 2.5 Avaliação

A avaliação deve detectar erro conceitual, não decorar texto.

Cada questão idealmente mapeia:

```text
pergunta → conceito → distrator → erro cognitivo → feedback causal
```

O feedback deve explicar por que a alternativa errada parece plausível.

---

## 3. Contrato visual

A estética é subordinada à fisiologia.

Obrigatório:

- tema monitor hemodinâmico;
- contraste legível;
- código visual consistente para arterial/venoso/alerta;
- canvas com fallback operacional em validador;
- tipografia de leitura confortável;
- responsividade básica;
- ausência de dependência externa de fonte, CDN ou imagem.

Desejável:

- uma figura-síntese no topo;
- gráficos com eixos interpretáveis;
- legenda mínima;
- leitura possível sem animação.

Proibido:

- animação que ensina errado;
- gráfico bonito mas não computado;
- cor como único canal sem texto;
- UI que oculta a fórmula central.

---

## 4. Contrato numérico

Toda fórmula precisa declarar:

- unidade de entrada;
- unidade de saída;
- conversão usada;
- faixa educacional típica;
- simplificação assumida;
- limitação do modelo.

Exemplo:

```js
// DO2 = CO(L/min) * CaO2(mL/dL) * 10(dL/L)
function do2(co, cao2) {
  return co * cao2 * 10;
}
```

Se houver clamp, ele precisa ser explícito e comentado. Clamp silencioso pode esconder erro de modelo.

---

## 5. Contrato SaMD

O módulo deve ensinar mecanismo, não conduta.

Permitido:

```text
noradrenalina aumenta RVS por efeito α1 predominante
RVS maior pode elevar PAM se DC for preservado
dobutamina desloca contratilidade e pode aumentar DC
broncoespasmo aumenta trabalho ventilatório e altera oxigenação
```

Proibido:

```text
inicie noradrenalina em X dose
trate este paciente com Y
alvo de PAM obrigatório para este caso real
se lactato tal, faça tal intervenção
```

O módulo pode comparar alavancas fisiológicas. Não pode virar algoritmo terapêutico.

---

## 6. Checklist antes de commit

```text
[ ] tese fisiológica explícita
[ ] variável escondida clara
[ ] erro cognitivo nomeado
[ ] modelN.js puro e exportável
[ ] testN.node.js com invariantes reais
[ ] perfundeN.html single-file e offline
[ ] validateN.js cobre estrutura + engine + UI + tutor
[ ] package.json atualizado
[ ] perfunde.html atualizado
[ ] ROADMAP.md atualizado se o status mudou
[ ] disclaimer SaMD presente
[ ] rodapé presente
[ ] npm run check = 0 falhas
```

---

## 7. Escala de maturidade

### M0 — rascunho

Conteúdo existe, mas sem engine ou validação.

### M1 — módulo didático

HTML funcional, caso e explicação bons, mas validação limitada.

### M2 — módulo computável

Engine separado e teste Node existem.

### M3 — módulo validado

HTML tem validador jsdom robusto; `npm run check` passa.

### M4 — módulo excelente

Questões mapeiam erros conceituais; invariantes cobrem monotonicidades e contrastes; UI e engine são claramente equivalentes.

### M5 — módulo supremo

O módulo é legível por humano, testável por máquina, integrado ao grafo curricular, seguro do ponto de vista SaMD e capaz de ensinar a mesma ideia por caso, curva, lab e tutor sem contradição.

O alvo de todo módulo novo é M5.
