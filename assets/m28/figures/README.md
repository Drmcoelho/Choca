# Figuras · Atlas farmacológico M28

Figuras editoriais em SVG para o atlas farmacológico do braço **PERFUNDE · CHOCA**.

## Primeira leva · figuras-mãe

- `atlas-receptores-hemodinamicos.svg` → `perfunde28.html`  
  Mapa receptor → efeito inicial → fármaco representativo. Figura de abertura do hub M28.

- `vasopressores-comparados.svg` → `perfunde28b.html`  
  Matriz visual dos vasopressores e comparativos.

- `dobutamina-fluxo-pressao.svg` → `perfunde28e.html`  
  Dobutamina como droga de integração fluxo × pressão.

- `combinacoes-hemodinamicas.svg` → `perfunde28g.html`  
  Mapa visual das combinações por fenótipo.

- `choque-septico-surviving.svg` → `perfunde21.html`  
  Figura da aba Surviving Sepsis no módulo de choque séptico.

## Segunda leva · figuras de aprofundamento

- `noradrenalina-resgatar-pam.svg` → `perfunde28b.html`  
  Noradrenalina como vasopressor de base: α1 predominante, PAM, RVS, retorno venoso e combinações.

- `vasopressina-tonus-fora-catecolamina.svg` → `perfunde28c.html`  
  Vasopressina como adjuvante não catecolaminérgico: V1a, V2, vasoplegia refratária e cautelas.

- `adrenalina-aumentar-tudo-tem-preco.svg` → `perfunde28d.html`  
  Adrenalina como catecolamina α/β dose-dependente: potência ampla, lactato, arritmia e custo metabólico.

- `milrinona-inodilatacao-pde3.svg` → `perfunde28f.html`  
  Milrinona como inodilatador via PDE3: contratilidade, vasodilatação sistêmica/pulmonar, VD e risco de hipotensão.

- `vasodilatadores-nitroglicerina-nitroprussiato.svg` → `perfunde28f.html`  
  Comparativo NTG × NPS: venodilatação, afterload reduction, NO/cGMP e combinações com dobutamina.

- `ventriculo-direito-suporte-farmacologico.svg` → `perfunde28g.html`  
  Suporte farmacológico do VD: manter PAM/coronária do VD e reduzir pós-carga pulmonar quando possível.

- `cardiogenico-escalada-farmacologica-fenotipo.svg` → `perfunde28g.html`  
  Escalada farmacológica do cardiogênico por fenótipo: baixo débito hipotenso, congesto, VD e vasoplegia.

- `miocardiopatia-septica-choque-esfria.svg` → `perfunde21.html`  
  Miocardiopatia séptica: quando o choque séptico esfria e passa a exigir leitura de baixo débito.

## Convenção de integração

As imagens são SVGs leves, versionáveis e editáveis, prontas para embed direto nos HTMLs via `<figure>` + `<img loading="lazy">`.

Bloco-padrão:

```html
<figure class="m28-fig-viva" data-fig="dobutamina-fluxo-pressao">
  <img
    src="assets/m28/figures/dobutamina-fluxo-pressao.svg"
    alt="Infográfico da dobutamina mostrando perfil β1 maior que β2, aumento de contratilidade e débito, risco de queda de RVS e combinações hemodinâmicas"
    loading="lazy">
  <figcaption>
    <b>Fig. 28E · Dobutamina como droga de integração.</b>
    A imagem antecipa a tese do módulo: a dobutamina aumenta fluxo por β1, mas a pressão depende do chão vascular.
  </figcaption>
</figure>
```

CSS comum:

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
