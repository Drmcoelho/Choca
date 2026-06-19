# Figuras · Atlas farmacológico M28

Figuras editoriais em SVG para o atlas farmacológico do braço **PERFUNDE · CHOCA**.

A regra pedagógica é: **figura antes da decomposição textual**. A imagem não é galeria nem ornamento. Ela deve abrir a seção, antecipar o mapa causal e preparar o leitor para a aba, caso ou matriz que vem depois.

Cada integração em HTML deve usar:

1. `<figure class="m28-fig-viva">`
2. `<img loading="lazy">`
3. `alt` mecanístico, não genérico
4. `<figcaption>` com leitura orientada
5. legenda explicando **o que olhar**, **por que importa**, **qual erro evita** e **qual ponte abre**

## Primeira leva · figuras-mãe

### `atlas-receptores-hemodinamicos.svg` → `perfunde28.html`

Função: figura-mãe do hub M28. Entra antes do `atlas-nav`, como abertura visual do atlas farmacológico.

Legenda sugerida:

> **Fig. 28 · Atlas de receptores hemodinâmicos.** A figura transforma a lista de drogas em mapa causal: α1 e V1a movem RVS; β1 move contratilidade e frequência; β2 e NO/cGMP deslocam o leito para vasodilatação; PDE3 junta inotropia com vasodilatação. A leitura correta não começa pelo nome comercial da droga, mas pelo termo da equação que ela altera. O objetivo é evitar o erro clássico de tratar toda hipotensão como se o mesmo receptor resolvesse o mesmo problema.

Alt sugerido:

> Infográfico do atlas de receptores hemodinâmicos relacionando α1, β1, β2, V1a, D1, PDE3, AT1 e NO/cGMP aos efeitos iniciais em RVS, débito, frequência, vasodilatação e microcirculação.

### `vasopressores-comparados.svg` → `perfunde28b.html`

Função: matriz visual dos vasopressores e comparativos.

Legenda sugerida:

> **Fig. 28B · Vasopressores comparados por mecanismo.** A matriz mostra que vários fármacos podem elevar PAM, mas não pelo mesmo caminho. Noradrenalina sustenta RVS com algum β1; adrenalina aumenta potência ao custo de FC, lactato e demanda; fenilefrina entrega α1 quase puro; vasopressina e angiotensina II recuperam tônus fora da catecolamina. A figura obriga a perguntar: estou corrigindo vasoplegia, bomba, retorno venoso ou apenas fabricando pressão?

Alt sugerido:

> Matriz comparativa de vasopressores mostrando receptor-alvo, efeito em RVS, frequência cardíaca, contratilidade, retorno venoso, lactato, arritmia e contexto de uso.

### `dobutamina-fluxo-pressao.svg` → `perfunde28e.html`

Função: figura central da dobutamina. Entra logo depois da tese “ganhar fluxo não é ganhar pressão”, antes das abas.

Legenda sugerida:

> **Fig. 28E · Dobutamina como droga de integração.** A imagem antecipa a tese do módulo: a dobutamina aumenta fluxo por β1, mas a pressão depende do chão vascular. Por isso ela é didática para choque misto, miocardiopatia séptica e baixo débito com vasoplegia. Se o leito vascular estiver aberto demais, ganhar débito pode não significar ganhar PAM — e a combinação com noradrenalina ou vasopressina passa a ser fisiológica, não decorativa.

Alt sugerido:

> Infográfico da dobutamina mostrando perfil β1 maior que β2, aumento de contratilidade e débito, risco de queda de RVS e combinações com noradrenalina, vasopressina e vasodilatadores.

### `combinacoes-hemodinamicas.svg` → `perfunde28g.html`

Função: figura-mãe do raciocínio por fenótipo. Entra antes das abas, como mapa visual da lógica do módulo.

Legenda sugerida:

> **Fig. 28G · Combinações hemodinâmicas por fenótipo.** A figura mostra que combinação de vasoativo não é empilhamento de drogas, mas recomposição de uma geometria. Quando há baixo débito e vasoplegia, dobutamina precisa de chão pressórico. Quando há congestão com pressão ainda sustentada, inotropia pode precisar de venodilatação ou redução de pós-carga. No VD, o dilema é manter perfusão coronariana direita sem piorar a pós-carga pulmonar. A pergunta passa a ser: qual termo está quebrado e qual termo a próxima droga move?

Alt sugerido:

> Infográfico de combinações hemodinâmicas por fenótipo mostrando noradrenalina com dobutamina, noradrenalina com vasopressina e dobutamina com vasodilatadores em cenários de baixo débito, vasoplegia, congestão e falência de VD.

### `choque-septico-surviving.svg` → `perfunde21.html`

Função: abre a aba Surviving Sepsis antes do bundle textual.

Legenda sugerida:

> **Fig. 21 · Choque séptico pela lente Surviving.** A figura organiza a primeira hora sem apagar a fisiologia: reconhecer, medir lactato, coletar culturas sem atrasar antibiótico, ressuscitar quando indicado, usar vasopressor se a hipotensão persiste, controlar foco e reavaliar. A escada farmacológica mostra noradrenalina como base, vasopressina como adjuvante, adrenalina como escalada e dobutamina quando a hipoperfusão persiste por baixo débito ou miocardiopatia séptica. O protocolo entra como mapa de ação; a fisiologia decide se ele está funcionando.

Alt sugerido:

> Infográfico do choque séptico com bundle da primeira hora, antibiótico precoce, lactato, culturas, volume, vasopressor, controle de foco e escada farmacológica com noradrenalina, vasopressina, adrenalina e dobutamina.

## Segunda leva · figuras de aprofundamento

### `noradrenalina-resgatar-pam.svg` → `perfunde28b.html`

Função: explicar noradrenalina como viga-mestra da vasoplegia e do resgate pressórico sem tratar PAM como fetiche.

Legenda sugerida:

> **Fig. 28B.1 · Noradrenalina como viga pressórica.** A figura mostra a noradrenalina como α1 dominante com β1 secundário: ela sobe RVS, melhora retorno venoso e resgata PAM sem grande taquicardia direta. A leitura crítica é que “subir pressão” só é útil se restaurar perfusão; excesso de pós-carga ou vasoconstrição periférica pode piorar fluxo regional. Por isso a figura liga a droga às combinações: com dobutamina quando há baixo débito, com vasopressina quando a vasoplegia exige catecholamine-sparing e com adrenalina quando a escalada precisa também de β.

Alt sugerido:

> Infográfico da noradrenalina mostrando molécula, ação α1 predominante, β1 secundária, aumento de RVS, PAM, retorno venoso, uso em vasoplegia e combinações com dobutamina, vasopressina e adrenalina.

### `vasopressina-tonus-fora-catecolamina.svg` → `perfunde28c.html`

Função: explicar vasopressina como recuperação de tônus vascular por via não catecolaminérgica.

Legenda sugerida:

> **Fig. 28C · Vasopressina e o tônus não adrenérgico.** A figura separa V1a de V2: o efeito hemodinâmico buscado é V1a vascular, com aumento de RVS e retorno venoso sem estímulo β direto. Isso explica seu papel como adjuvante quando a noradrenalina já está sustentando o sistema, mas a vasoplegia continua aberta. A cautela também é estrutural: uma droga que fecha leito vascular pode preservar PAM e, ao mesmo tempo, ameaçar pele, dedo, mesentério ou circulação regional se a perfusão global não for reavaliada.

Alt sugerido:

> Infográfico da vasopressina mostrando ação V1a vascular, V2 renal, aumento de RVS, uso como adjuvante em vasoplegia refratária, estratégia poupadora de catecolamina e riscos de isquemia e hiponatremia.

### `adrenalina-aumentar-tudo-tem-preco.svg` → `perfunde28d.html`

Função: explicar adrenalina como droga potente, ampla e cara metabolicamente.

Legenda sugerida:

> **Fig. 28D · Adrenalina: potência ampla, custo amplo.** A imagem mostra a adrenalina como catecolamina que move β1, β2 e α1 em graus dependentes de dose e contexto. Ela pode aumentar contratilidade, frequência, RVS e PAM, mas cobra em arritmia, demanda miocárdica e lactato. O ponto didático é impedir a leitura ingênua do lactato como marcador puro de hipoperfusão quando há estímulo β2 importante, e impedir que “potente” seja confundido com “sempre melhor”.

Alt sugerido:

> Infográfico da adrenalina mostrando molécula, perfil β1, β2 e α1 dose-dependente, aumento de contratilidade, frequência, RVS, lactato, demanda miocárdica e riscos de taquiarritmia e isquemia.

### `milrinona-inodilatacao-pde3.svg` → `perfunde28f.html`

Função: explicar milrinona como inodilatador, não como “dobutamina diferente”.

Legenda sugerida:

> **Fig. 28F.1 · Milrinona como inodilatação via PDE3.** A figura mostra que a milrinona aumenta cAMP por inibição de PDE3, produzindo dois efeitos simultâneos: inotropia e vasodilatação sistêmica/pulmonar. Isso a torna útil quando o problema é baixo débito com pós-carga elevada, falência de VD ou paciente beta-bloqueado, mas perigosa se a pressão já está no limite. A imagem deve ser lida como uma balança: melhora fluxo e reduz resistência, mas pode remover o chão pressórico.

Alt sugerido:

> Infográfico da milrinona mostrando inibição de PDE3, aumento de cAMP, inotropia, vasodilatação sistêmica e pulmonar, uso em baixo débito, falência de VD, hipertensão pulmonar e riscos de hipotensão e depuração renal.

### `vasodilatadores-nitroglicerina-nitroprussiato.svg` → `perfunde28f.html`

Função: explicar vasodilatação como ferramenta geométrica, não como contraindicação automática no choque.

Legenda sugerida:

> **Fig. 28F.2 · Nitroglicerina versus nitroprussiato.** A figura diferencia venodilatação predominante da nitroglicerina e vasodilatação arterial/venosa balanceada do nitroprussiato. O ponto não é “vasodilatador no choque”, mas geometria: reduzir pré-carga quando a congestão domina, reduzir pós-carga quando o ventrículo falha contra uma carga excessiva, e combinar com inotropia quando há baixo débito com pressão ainda sustentada. A armadilha é usar vasodilatação sem chão pressórico ou ignorar toxicidade no nitroprussiato.

Alt sugerido:

> Infográfico comparando nitroglicerina e nitroprussiato pela via NO-cGMP, mostrando venodilatação, redução de pré-carga, redução de pós-carga, uso com dobutamina e riscos de hipotensão e toxicidade por cianeto/tiocianato.

### `ventriculo-direito-suporte-farmacologico.svg` → `perfunde28g.html`

Função: explicar o VD como sistema vulnerável entre perfusão coronariana e pós-carga pulmonar.

Legenda sugerida:

> **Fig. 28G.1 · Apoiar o ventrículo direito sem derrubar o sistema.** A figura organiza a farmacologia do VD em dois pilares: manter pressão sistêmica para perfundir a coronária direita e reduzir pós-carga pulmonar quando possível. Noradrenalina e vasopressina protegem o chão sistêmico; dobutamina e milrinona ajudam a bomba; vasodilatação pulmonar seletiva entra quando o problema é RVP. O erro que a imagem evita é tratar VD como se fosse apenas VE pequeno: no VD, queda de PAM, taquiarritmia, hipoxemia, acidose e aumento de RVP podem fechar o circuito rapidamente.

Alt sugerido:

> Infográfico do suporte farmacológico do ventrículo direito mostrando embolia pulmonar, infarto de VD, hipertensão pulmonar, choque séptico com VD, noradrenalina, dobutamina, milrinona, vasopressina e vasodilatação pulmonar seletiva.

### `cardiogenico-escalada-farmacologica-fenotipo.svg` → `perfunde28g.html`

Função: explicar cardiogênico por fenótipo e não por receita única.

Legenda sugerida:

> **Fig. 28G.2 · Choque cardiogênico por fenótipo farmacológico.** A figura força a pergunta que deve vir antes da droga: baixo débito está acompanhado de hipotensão, congestão, falência de VD ou vasoplegia? No baixo débito hipotenso, noradrenalina pode dar chão para dobutamina. No congesto com pressão preservada, inotrópico pode precisar de vasodilatação. No VD, a lógica muda para perfusão coronariana direita e RVP. No cardiogênico vasoplégico, vasopressor e inotrópico deixam de ser opostos e passam a ser complementares.

Alt sugerido:

> Infográfico de choque cardiogênico por fenótipo mostrando baixo débito hipotenso, baixo débito congesto, falência de VD e cardiogênico com vasoplegia, com noradrenalina, dobutamina, milrinona, vasodilatadores e vasopressina.

### `miocardiopatia-septica-choque-esfria.svg` → `perfunde21.html`

Função: complementar a aba Surviving do choque séptico com o fenótipo frio/baixo débito.

Legenda sugerida:

> **Fig. 21.2 · Miocardiopatia séptica: quando o choque séptico esfria.** A figura mostra a transição do séptico vasoplégico clássico para o séptico com baixo débito: extremidades frias, eco ruim, lactato que não clareia, diurese baixa e perfusão periférica inadequada apesar de PAM aparentemente aceitável. A base continua sendo pressão de perfusão com noradrenalina, muitas vezes com vasopressina; a dobutamina entra quando o problema residual é débito. A adrenalina aparece como escalada possível, mas com o custo de lactato, FC e demanda. A imagem impede o erro de tratar todo choque séptico como quente para sempre.

Alt sugerido:

> Infográfico de miocardiopatia séptica mostrando choque séptico frio, baixo débito, extremidades frias, ScvO2 baixa, lactato persistente, eco com contratilidade reduzida, noradrenalina, vasopressina, dobutamina, adrenalina e reavaliação dinâmica.

## Bloco-padrão de integração

```html
<figure class="m28-fig-viva" data-fig="dobutamina-fluxo-pressao">
  <img
    src="assets/m28/figures/dobutamina-fluxo-pressao.svg"
    alt="Infográfico da dobutamina mostrando perfil β1 maior que β2, aumento de contratilidade e débito, risco de queda de RVS e combinações hemodinâmicas"
    loading="lazy">
  <figcaption>
    <b>Fig. 28E · Dobutamina como droga de integração.</b>
    A imagem antecipa a tese do módulo: a dobutamina aumenta fluxo por β1, mas a pressão depende do chão vascular.
    Por isso ela é didática para choque misto, miocardiopatia séptica e baixo débito com vasoplegia.
  </figcaption>
</figure>
```

## CSS comum

```css
.m28-fig-viva{
  margin:16px 0 20px;
  background:var(--cell,var(--bg-cell,#11151f));
  border:1px solid var(--line,#26314a);
  border-radius:12px;
  padding:10px;
}
.m28-fig-viva img{
  display:block;
  width:100%;
  height:auto;
  border-radius:10px;
  background:#07090d;
}
.m28-fig-viva figcaption{
  margin-top:8px;
  font-size:.86rem;
  line-height:1.5;
  color:var(--dim,var(--ink-dim,#97a3ba));
}
.m28-fig-viva figcaption b{
  color:var(--accent,var(--warn,#ffcf5c));
}
```
