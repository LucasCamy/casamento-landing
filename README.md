# Landing page de casamento

Página única para mostrar as fotos e o filme do casamento, contada pelo scroll (GSAP ScrollTrigger + Lenis): abertura em vídeo que vira moldura, nossa história na horizontal, o dia quadro a quadro num canvas, galeria com parallax, filme com capítulos e **modo telão** para deixar as fotos passando no projetor durante a festa.

O conteúdo atual é de demonstração (casal fictício, fotos do Unsplash e vídeos gerados a partir delas).

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Para gerar a versão final: `npm run build` (sai em `dist/`).

As animações respeitam a opção "reduzir movimento" do sistema (no Windows: Configurações > Acessibilidade > Efeitos visuais > Efeitos de animação). Para ver as animações mesmo com ela ligada, abra http://localhost:5173/?movimento=1.

A primeira versão, sem scroll animado, está guardada em `versoes/v1/` só para comparação.

## Rodar com Docker

```bash
docker compose up -d --build
```

Abra http://localhost:8080. A imagem compila o site com Node e serve só os arquivos finais com Nginx (cache longo para JS/CSS, vídeo com avanço/retrocesso). Para parar: `docker compose down`. Depois de trocar fotos ou textos, rode o primeiro comando de novo.

## Colocar as fotos e vídeos de vocês

1. Coloque os arquivos em `public/media/` (por exemplo, `public/media/nossas-fotos/`).
2. Para cada foto, gere uma versão menor (cerca de 900px de largura) numa pasta `thumbs/`. Com ffmpeg:
   ```bash
   ffmpeg -i foto.jpg -vf "scale=900:-2" -q:v 4 thumbs/foto.jpg
   ```
3. Edite `src/data/casamento.ts`: nomes, data, local, lista de fotos (com largura e altura reais), história, filme e capítulos.

Tudo o que aparece na página vem desse arquivo.

Para a cena "O dia, quadro a quadro", gere os quadros a partir do vídeo de vocês (ou de fotos) e ajuste `sequencia.total` no mesmo arquivo:

```bash
bash scripts/gerar-sequencia.sh nosso-video.mp4
```

## Modo telão

Na seção "Modo telão", escolha o tempo de cada foto, ordem aleatória e se os nomes aparecem. "Abrir telão" entra em tela cheia e mantém a tela acesa. Espaço pausa, setas trocam a foto, Esc sai.
