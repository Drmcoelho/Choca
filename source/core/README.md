# source/core — núcleo fisiológico compartilhado

Fonte modular única das fórmulas que hoje aparecem repetidas pelos engines
`build/mN/modelN.js`. É a **verdade do build**; a saída publicada continua
**single-file** (nenhum HTML depende deste diretório em runtime).

ROADMAP Fase 4. Prata do par "guardião (ouro) + núcleo (prata)".

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `units.js` | Fatores de unidade: `DL_PER_L` (×10 dL→L), `DYNE_FACTOR` (×80), `asFrac` (normaliza % ↔ fração). |
| `oxygen.js` | Cadeia do O₂: `caO2`, `ca`, `do2`, `vo2Fick`, `o2er`/`o2erConteudos`, curva bifásica (`do2crit`, `vo2Supply`, `o2erSupply`, `svo2`, `o2deficit`, `lactate`). |
| `hemodynamics.js` | Macro-hemodinâmica: `co`, `pamCuff`, `rvsDyn`, `rvsWoodFromPressures`, `woodFromDyn`/`dynFromWood`, `pamFromDyn`/`pamFromWood`, `rvsForPam`. |
| `guards.js` | Guardas numéricas (`clamp`, `clamp01`, `isFiniteNum`, `requirePositive`) + fronteira SaMD (`IMPERATIVE_RE`, `hasImperativeOrder`). |
| `test-core.node.js` | Auto-teste por âncoras **+ conformância** núcleo × engines. Roda no `npm run test:core` (e dentro de `npm test`). |

## Por que é *load-bearing*

`test-core.node.js` não testa só o núcleo: recomputa cada fórmula compartilhada
**pelo núcleo e pelos engines** (`m0`, `m1`, `m3`, `m8`, `m9`) sobre uma bateria
determinística e exige **igualdade numérica**. Se um engine divergir do núcleo numa
fórmula compartilhada, o CI acusa — o critério de pronto da **Fase 3** ("as mesmas
fórmulas não aparecem com semântica divergente entre módulos").

### Colisão de nome desambiguada

`rvsWood` significava **duas coisas** nos engines:

- `model0.rvsWood(pam, pvc, dc)` → RVS de Wood a partir de **pressões** (ΔP/Q);
- `model9.rvsWood(rvsDyn)` → **conversão** dyne→Wood (÷80).

Mesmo identificador, semântica divergente. No núcleo viram
`rvsWoodFromPressures(...)` e `woodFromDyn(...)`; o teste prende cada engine ao seu par
e prova que as duas funções realmente diferem.

## Fronteira SaMD — fonte única

`guards.IMPERATIVE_RE` é a regra do `SAFETY.md §11` (bloqueia ordem imperativa
individualizada; doses de **referência** continuam permitidas). O guardião de QA
(`build/qa/qa.js`) **importa** daqui em vez de duplicar a regex.

## Regras

- Estilo dos engines: sem `'use strict'`, `function`-declarations, `module.exports`
  guard dual-mode (Node + `<script>`), camelCase + `UPPER_SNAKE` para constantes.
- **Nada de `localStorage`/rede.** Funções puras e determinísticas.
- Ao adicionar um núcleo novo (`guyton.js`, `ventricle.js`, …), **adicione a
  conformância correspondente** em `test-core.node.js` — núcleo sem conformância é
  código paralelo morto.
