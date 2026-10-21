# DESIGN.md

**Leitura do briefing:** página de evento (casamento) para convidados e família, linguagem editorial e fotográfica, contada pelo scroll. Dials: variância 7, movimento 8, densidade 3. Motion com peso principal no estilo Jakub (polimento discreto) e Jhey nas cenas de storytelling; a visita é rara, então expressividade é bem-vinda, desde que tenha motivo.

## Princípios

1. A foto é o protagonista. Interface discreta, sem moldura decorativa.
2. Cada seção tem uma interação real: filtrar, ampliar, pular para um capítulo, configurar o telão.
3. Funciona projetado numa TV e no celular de um convidado.

## Paleta

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `bg` | #f3f3ef | #111513 | fundo |
| `surface` | #e8e9e3 | #181e1b | faixa da galeria |
| `ink` | #1b2420 | #eceae4 | texto principal (≈15:1) |
| `ink-muted` | #55605b | #a3aca7 | texto secundário (≈6:1 / ≈8:1) |
| `line` | #cfd3cc | #2c3530 | divisórias, contornos |
| `accent` | #2e5b4e | #9cc5b3 | acento único: botões, ano, ativo |
| `accent-ink` | #f3f3ef | #0f1a16 | texto sobre acento (≈7,7:1 / ≈9,6:1) |
| `night` / `on-photo` | #0d1210 / #f6f6f2 | iguais | sobre fotos e vídeos |

Verde-pinho no lugar do bege com dourado, que é o padrão óbvio de casamento.

## Tipografia

- Títulos: EB Garamond 500, itálico nos nomes. Serifa justificada pelo contexto (convite, papelaria de casamento).
- Texto e interface: Manrope variável.
- Cormorant Garamond foi testada e descartada: o "é" saía com o acento deslocado.

## Forma e motion

- Raios: 4px fotos, 16px painéis, pílula em botões.
- GSAP + ScrollTrigger para as cenas; Lenis (`lerp 0.085`) para o scroll suave. Motion só nos diálogos.
- Cada animação comunica algo: a abertura se fecha numa moldura (passagem do vídeo para a página), o manifesto acende no ritmo da leitura, a história anda no tempo (horizontal), a cena em canvas é o dia passando, a cortina da galeria revela cada foto, o filme se abre ao chegar.
- Só `transform`, `opacity`, `filter` e `clip-path`. Entradas com blur; saídas mais curtas.
- Movimento reduzido: sem scroll suave, sem pin, sem scrub. História em grade, cena em canvas vira 4 fotos com legenda, vídeo do hero parado.

## Cenas

| Cena | Técnica | Interação |
|---|---|---|
| Abertura | pin + scrub + clip-path (vídeo vira moldura), letras em stagger | pausar vídeo |
| Manifesto | scrub de opacidade palavra por palavra | leitura |
| Nossa história | pin + scroll horizontal + parallax interno (containerAnimation) | leitura |
| O dia, quadro a quadro | pin + sequência de 156 quadros em canvas + timeline de legendas | leitura |
| Galeria | parallax de colunas + cortina (clip-path) em lote | filtros, lightbox com setas, swipe e download |
| Filme | clip-path abrindo + zoom do pôster, capítulos em stagger | pular para capítulo |
| Modo telão | entrada em stagger, prévia cresce com o scroll | tempo, ordem aleatória, nomes, tela cheia |
| Encerramento | nomes sobem de dentro da máscara | |
| Barra do topo | progresso da página (scaleX com scrub) | |
