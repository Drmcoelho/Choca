# PERFUNDA.md — Constituição do Braço 2 · **PERFUNDE · CHOCA**

> Documento-mãe do segundo braço do hexápode de medicina crítica.
> É o análogo do `CLAUDE.md` do braço 1 (Respira·Ventila): governa **o que este braço é, como é construído e o que ele nunca faz**.
> Conteúdo clínico-fisiológico detalhado → `CHOQUE.md`. Mecânica de build e regras de agente → `AGENTS.md`.

---

## 1. Identidade e tese

PERFUNDE·CHOCA ensina a **segunda metade do transporte de oxigênio**: depois que o gás entra e troca (Respira·Ventila), como o O₂ chega à célula, vira ATP — e o que acontece quando a entrega falha.

**Tese-espinha (o análogo da "inversão causal" do Ventila 15):**

> **Choque não é pressão arterial baixa. É falência da entrega de oxigênio (DO₂).**
> A PA é apenas *um termo*, e tardio. A inversão que salva é ler **PAM = DC × RVS** de trás para frente: a mesma PAM emerge de mecânicas opostas (DC alto / RVS baixa no distributivo; DC baixo / RVS alta no cardiogênico). Tratar o número sem decompor o que o gerou mata.

Define-se cada tipo de choque pela **física do que quebrou** — não pela aparência. Mesmo método do braço 1: o modo/estado é o que se *fixa* × o que *resulta*.

---

## 2. Lugar no hexápode

Seis braços, ordenados por **acuidade na porta da UTI e complexidade crescente**:

| # | Braço | Eixo | Estado |
|---|-------|------|--------|
| 1 | **RESPIRA · VENTILA** | troca gasosa + bomba mecânica de ar | ✅ concluído (10 + 15 módulos) |
| 2 | **PERFUNDE · CHOCA** | transporte de O₂ + falência circulatória | ◀ **este documento** |
| 3 | FILTRA · DIALISA | renal · LRA como *downstream* do choque | planejado |
| 4 | ALIMENTA · DESNUTRE | nutricional · subagudo, autocontido | planejado |
| 5 | METABOLIZA · INTOXICA | hepático + metabolismo + toxicologia · **capstone integrador** | planejado |
| 6 | CONSCIÊNCIA · COMA | neuro (PPC = PAM − PIC, Monro-Kellie, autorregulação) · o mais complexo | planejado, por último |

PERFUNDE é o **núcleo da ressuscitação** ao lado do braço 1 — o B e o C do ABC. Filtra·Dialisa é quase seu epílogo (o rim é o termômetro da perfusão). Metaboliza é o finale porque exige renal + perfusão + ácido-base já na mão.

---

## 3. Invariantes arquiteturais inegociáveis

Herdados do braço 1, sem exceção:

- **Single-file HTML/CSS/JS** · offline · **zero dependências externas**.
- **Sem armazenamento de navegador** (nada de `localStorage`).
- **Todo motor fisiológico é numericamente validado antes de virar UI** (Node → presets → jsdom).
- **Links de navegação relativos** em todo o material.
- **Pipeline de build explicitamente rejeitado** — antifragilidade é valor de projeto.
- Saída em **português do Brasil**; raciocínio em prosa com **setas (→)**, não bullets; código auditável e comentado; **sem floreio**.
- **"Teto, não piso":** cada módulo excede o que o livro-texto entrega, fisiológica e pedagogicamente.
- **Honestidade no próprio artefato:** limitações do modelo moram no arquivo (disclaimer/nota), não só na conversa.
- Rodapé de toda peça: **CRM-SP 151.318 · Dr. Matheus M. Coelho · Limeira**.

---

## 4. A espinha quantitativa (a régua que percorre todos os módulos)

```
DO₂  = DC × CaO₂                          entrega de oxigênio
CaO₂ = 1,34 · Hb · SaO₂ + 0,003 · PaO₂    conteúdo arterial (a fração dissolvida quase nunca importa, mas existe)
DC   = FC × VS                            débito = ritmo × ejeção
VO₂  = DC × (CaO₂ − CvO₂)                 consumo (Fick)
O₂ER = VO₂ / DO₂                          taxa de extração
PAM  = DC × RVS                           a inversão causal macrocirculatória
```

→ **lactato sobe quando DO₂ < DO₂crítico** (a curva bifásica de dependência de suprimento).
→ Cada **tipo de choque = uma quebra localizada num termo** desta cadeia. O módulo correspondente isola e quantifica essa quebra.

O detalhamento fisiológico de cada termo e de cada engine está em `CHOQUE.md`.

---

## 5. A inversão causal como princípio organizador

No Ventila 15, o modo se definia por *o que você fixa × o que resulta*. Aqui o equivalente:

> **A mesma PAM não significa o mesmo paciente.** PAM = DC × RVS é um produto; dois fatores em sentidos opostos dão o mesmo número. O choque críptico (normotenso, lactato alto) é a prova: a PA "normal" é o saldo de compensações, não equilíbrio — exatamente como o pH 7,37 que esconde distúrbio misto no braço 1.

Toda a pedagogia decorre disto: **decompor antes de tratar.** O número-resultante (PA, pH, SpO₂) é a sombra; o que importa é qual termo da equação o gerou.

---

## 6. Escada de módulos (referência)

**~29 peças** (Caderno 0 + 28), em quatro blocos. **Sem teto artificial** — a granularidade segue a fisiologia: cada engine-jóia é módulo pleno, e cada categoria de choque ganha capstones de subtipo (tamponamento, TEP e pneumotórax são *três* fisiologias sob "obstrutivo"; séptico/anafilático/neurogênico são *três* caminhos para RVS↓). É, por desenho, o braço mais extenso até aqui. Tabela completa com engines e âncoras em `CHOQUE.md §4`.

**Bloco 0 · Fundamentos do transporte** — `0` Matemática do transporte (Caderno) · `1` CaO₂ · `2` curva como entrega *(1–2 reusam mvp2)*

**Bloco I · Os determinantes — engines-jóia, módulos plenos** — `3` débito cardíaco · `4` pré-carga I: **interseção de Guyton** · `5` pré-carga II: Guyton aplicado (responsivo ≠ tolerante) · `6` Frank-Starling · `7` pós-carga & alça PV (Ea/Ees) · `8` DO₂/VO₂ & supply-dependence (DO₂crítico)

**Bloco II · A inversão e a leitura** — `9` **PAM = DC × RVS (núcleo)** · `10` monitorização hemodinâmica · `11` a microcirculação · `12` lactato & depuração

**Bloco III · Os choques — categoria + capstones de subtipo** — `13` hipovolêmico → `14` ↳ hemorrágico × não-hemorrágico · `15` cardiogênico → `16` ↳ o ventrículo direito · `17` obstrutivo → `18` ↳ tamponamento · TEP · pneumotórax hipertensivo · `19` distributivo → `20` ↳ séptico → `21` ↳ anafilático × neurogênico

**Bloco IV · Integração & resgate** — `22` choque misto (duas quebras simultâneas) · `23` o coração-pulmão · `24` ressuscitação volêmica como fisiologia · `25` **choque críptico** (o caso-semente) · `26` os 4 perfis (radar) · `27` vasopressores/inotrópicos (**mecanismo, não dose**) · `28` capstone + tutor gráfico dinâmico

---

## 7. Identidade visual

Terceiro tema próprio — **"monitor hemodinâmico"**: vermelho arterial profundo, azul venoso, a estética do traçado de pressão arterial e da curva de PVC. Distinto do pergaminho (Respira) e do monitor teal-âmbar (Ventila 15). Tokens definidos no primeiro módulo e reusados via `head.html` do braço.

---

## 8. Pontes para o braço 1 (o braço não nasce órfão)

- **mvp2** (Hb / Severinghaus) → CaO₂ e a curva pelo lado tecidual. **Reaproveitamento direto do engine já validado.**
- **mvp4** (ácido-base / Winter) → lactato e a acidose metabólica do choque.
- **mvp1** (mecânica / auto-PEEP) → choque obstrutivo: pressão intratorácica → retorno venoso.
- **Ventila** (PEEP/VNI reduzindo pré e pós-carga) → o cardiogênico; a interação coração-pulmão.

Cada módulo carrega backlinks e pontes cruzadas como cromo de série (ver checklist em `AGENTS.md`).

---

## 9. Fronteira SaMD — no DNA, desde o módulo zero

Este é o braço onde a tentação de **prescrever número** é máxima, e onde cruzar para *suporte à decisão clínica automatizado* muda tudo (regulatório, responsabilidade, escopo).

**Regra inviolável, com o rigor dos disclaimers do Ventila:**

> Ensina-se **o mecanismo de por que a alavanca corrige o termo quebrado** — nunca a dose, nunca "inicie noradrenalina a X µg/kg/min", nunca um alvo terapêutico acionável para um paciente específico.

- Triagem SaMD **explícita antes de cada engine**, não como remendo posterior.
- O **módulo 14** (vasopressores/inotrópicos) é o teste de fogo: mapeia receptor → termo da equação (noradrenalina → RVS; dobutamina → contratilidade) e **para exatamente antes do miligrama**.
- Se um engine começa a rotear "este paciente → esta conduta", ele cruzou a linha → **parar e redesenhar** como explicação de mecanismo.

---

## 10. Princípios de qualidade

→ **Teto não piso** — superar o livro.
→ **Engine determinístico e auditável** — número validado contra referência fisiológica antes de qualquer pixel.
→ **Física viva, não animação pré-cozida** — toda curva e questão gráfica computada ao vivo pelo motor.
→ **Honestidade no artefato** — toda simplificação monocompartimental/idealizada declarada no próprio arquivo.
→ **Antifragilidade** — sem build, sem dependência; o arquivo sobrevive sozinho.

---

## 11. Rito de build

Inalterado em relação ao braço 1: **engine isolado → validação em Node contra âncoras → porta para HTML reusando tokens → validação jsdom (0 falhas obrigatório) → entrega em `/mnt/user-data/outputs/` → `present_files`.** Mecânica completa, armadilhas de ambiente e convenções de nomenclatura em `AGENTS.md`. Subida ao GitHub é responsabilidade do autor; verificação por `web_fetch` ofertada na confirmação da URL.
