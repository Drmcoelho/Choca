# SAFETY.md — Fronteira clínica, SaMD e segurança pedagógica · PERFUNDE · CHOCA

Este documento define o limite clínico do projeto.

PERFUNDE · CHOCA ensina fisiologia do choque. Ele não prescreve conduta, não calcula dose, não decide tratamento e não classifica paciente real para ação clínica.

A fronteira é simples:

```text
mecanismo educacional → permitido
caso real → conduta acionável → proibido
```

---

## 1. Princípio maior

O projeto pode responder:

```text
qual termo da equação quebrou?
por que a variável mudou?
qual alavanca fisiológica age sobre qual termo?
por que dois fenótipos parecidos têm mecanismos diferentes?
por que um número normal pode ser enganoso?
```

O projeto não pode responder:

```text
qual droga iniciar neste paciente?
qual dose usar?
qual alvo perseguir neste caso?
qual intervenção fazer agora?
qual conduta é indicada para a pessoa real X?
```

A diferença não é estética. É regulatória, ética e epistemológica.

---

## 2. O que é permitido

### 2.1 Mecanismo

Permitido:

- explicar `PAM = DC × RVS`;
- mostrar que pressor aumenta RVS;
- mostrar que inotropismo altera contratilidade;
- mostrar que volume desloca Pmsf e retorno venoso;
- mostrar que anemia reduz CaO₂;
- mostrar que microcirculação pode falhar apesar de PAM normal;
- mostrar que SvO₂ alta pode ser paradoxo de extração;
- mostrar que neurogênico pode ter bradicardia relativa;
- mostrar que anafilaxia combina vasoplegia, extravasamento e eixo respiratório.

### 2.2 Comparação fisiológica

Permitido:

- comparar tamponamento, TEP e pneumotórax por passo impedido;
- comparar séptico, anafilático e neurogênico por mecanismo distributivo;
- comparar choque hemorrágico e séptico por SvO₂ e O₂ER;
- comparar baixa entrega com baixa utilização.

### 2.3 Simulação didática

Permitido:

- sliders abstratos;
- presets fictícios;
- casos compostos;
- valores arredondados para ensino;
- vereditos pedagógicos como “macro preservada / micro falha”.

Desde que fique claro que a saída é explicação de fisiologia, não decisão clínica.

---

## 3. O que é proibido

### 3.1 Dose

Proibido:

```text
noradrenalina X µg/kg/min
dobutamina X µg/kg/min
adrenalina X mg ou X mL
dose de fluido em mL/kg
meta terapêutica individualizada por entrada do usuário
```

O módulo pode dizer “α1 aumenta RVS”. Não pode dizer “inicie em X”.

### 3.2 Conduta acionável

Proibido:

```text
este paciente deve receber trombólise
este paciente deve ser intubado
este paciente deve receber volume
este paciente deve receber adrenalina
este paciente deve ir para sala vermelha
este paciente deve ser drenado agora
```

O módulo pode explicar por que TEP maciço aumenta pós-carga do VD. Não pode rotear paciente real para trombólise.

### 3.3 Alvo terapêutico individual

Proibido:

```text
corrija a PAM para X neste caso
persiga lactato abaixo de Y neste paciente
titule pressor até Z
pare volume quando parâmetro W
```

Alvos podem aparecer apenas como contexto fisiológico geral e não como comando para caso real.

### 3.4 Diagnóstico automatizado de paciente real

Proibido:

```text
entradas do usuário → classificação clínica final → conduta
```

Exemplo proibido:

```text
FC 52, PAM 55, trauma raquimedular → neurogênico → faça X
```

Exemplo permitido:

```text
em um cenário didático, perda simpática reduz RVS e pode impedir taquicardia compensatória; isso diferencia o mecanismo neurogênico de outros distributivos
```

---

## 4. Linguagem segura

### Use

```text
mecanismo
termo da equação
alavanca fisiológica
fenótipo didático
cenário simulado
assinatura causal
explica
sugere mecanisticamente
```

### Evite

```text
indicação
prescrição
recomendação para este paciente
faça
inicie
administre
titule
alvo obrigatório
```

### Troca recomendada

Em vez de:

```text
Inicie noradrenalina para corrigir a PAM.
```

Usar:

```text
No modelo, aumentar o componente α1 eleva RVS e, se o DC for preservado, aumenta a PAM. Isso demonstra a alavanca fisiológica, não uma prescrição.
```

---

## 5. Níveis de risco por módulo

### Risco baixo

Módulos puramente matemáticos ou conceituais:

- CaO₂;
- curva de oxi-hemoglobina;
- DC = FC × VS;
- DO₂/VO₂.

Risco: interpretação simplista.

Mitigação: declarar unidades, simplificações e limites.

### Risco intermediário

Módulos que tocam monitorização e diagnóstico fisiológico:

- Guyton;
- POCUS;
- microcirculação;
- lactato;
- radar de perfis.

Risco: aluno achar que variável isolada decide conduta.

Mitigação: sempre decompor; nunca transformar achado em algoritmo terapêutico.

### Risco alto

Módulos com drogas, procedimentos ou choque grave:

- obstrutivo;
- séptico;
- anafilático;
- neurogênico;
- vasopressores/inotrópicos;
- ressuscitação volêmica;
- capstone.

Risco: parecer suporte à decisão clínica.

Mitigação: firewall textual forte, sem dose, sem alvo individualizado, sem “faça”.

---

## 6. Disclaimer padrão

Todo módulo de risco intermediário ou alto deve conter uma variação explícita deste bloco:

```text
Este módulo é uma simulação educacional de fisiologia. Ele explica mecanismos e relações causais. Não prescreve conduta, dose, alvo terapêutico ou decisão para paciente real. Qualquer decisão clínica exige avaliação médica contextual, recursos disponíveis, diretrizes locais e responsabilidade profissional.
```

O disclaimer não pode ficar escondido apenas no rodapé. Em módulos de risco alto, deve aparecer também perto do lab ou das intervenções simuladas.

---

## 7. SaMD hard-stop para agentes

Antes de escrever qualquer função, pergunta, preset ou veredito, aplicar esta triagem:

```text
A saída pode ser usada diretamente para decidir tratamento de um paciente real?
```

Se sim, parar e redesenhar.

Trocar:

```text
estado do paciente → conduta
```

por:

```text
estado simulado → termo quebrado → mecanismo → consequência fisiológica
```

---

## 8. Regras para vereditos

Vereditos são permitidos quando categorizam fisiologia simulada.

Permitido:

```text
RVS quebrada
macro restaurada, micro falha
extração paradoxalmente baixa
pré-carga responsiva, tolerância ruim
assinatura neurogênica simulada
```

Proibido:

```text
trate como séptico
inicie pressor
administre volume
indique trombólise
faça descompressão
```

Para módulos procedimentais, o veredito deve dizer “qual mecanismo está obstruído”, não “qual procedimento fazer”.

---

## 9. Regra de honestidade do modelo

Cada módulo deve declarar sua simplificação principal.

Exemplos:

```text
Este modelo reduz a microcirculação a shunt/glicocálice/mitocôndria; a realidade inclui heterogeneidade dinâmica, inflamação, coagulação, endotélio e tempo.
```

```text
Este modelo representa o neurogênico como perda simpática global; lesões reais variam por nível, extensão, fase e coexistência de hemorragia.
```

```text
Este modelo separa anafilaxia de sepse por eixo dominante; pacientes reais podem ter fenótipos mistos.
```

A honestidade não enfraquece o módulo. Ela aumenta a confiabilidade.

---

## 10. Revisão de segurança antes de merge

Checklist obrigatório:

```text
[ ] não há dose
[ ] não há comando terapêutico
[ ] não há alvo individualizado
[ ] não há classificação de paciente real para ação
[ ] disclaimers existem
[ ] limitações do modelo existem
[ ] vereditos são fisiológicos, não prescritivos
[ ] drogas aparecem como receptor → termo, não como prescrição
[ ] procedimentos aparecem como mecanismo/anatomia, não como indicação individual
[ ] exemplos são didáticos, simulados ou fictícios
```

Se um item falhar, o módulo não está pronto.
