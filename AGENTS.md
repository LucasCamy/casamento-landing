# AGENTS.md

## Propósito e stack

Landing page de casamento para mostrar fotos e vídeos do casal, contada pelo scroll: abertura com vídeo fixada, texto que acende, linha do tempo horizontal, cena em canvas quadro a quadro, galeria com parallax e lightbox, filme com capítulos e modo telão para projetar na festa. Página única, sem backend.

- Vite 8 + React 19 + TypeScript (`tsconfig.app.json`, modo estrito do scaffold)
- Tailwind CSS v4 via `@tailwindcss/vite`, tokens em CSS variables
- GSAP 3 + ScrollTrigger (`@gsap/react`) para as cenas de scroll; Lenis para scroll suave
- Motion (`motion/react`) só para diálogos (menu, lightbox, telão); Phosphor Icons
- Fontes self-hosted via Fontsource: EB Garamond (títulos) e Manrope (texto)
- Idioma da interface: pt-BR

## Organização

```
src/
  data/casamento.ts   fonte única do conteúdo (casal, fotos, história, filme)
  lib/scroll.ts       GSAP/ScrollTrigger registrados, Lenis, useMovimento, comMovimento, ?movimento=1
  lib/                demais hooks: dialogo (foco, Esc, trava de rolagem), slideshow
  styles/tokens.css   cores e motion; mapeados no @theme inline de src/index.css
  components/         uma seção por arquivo; Lightbox, Quadro e TelaoPlayer são compartilhados
public/media/demo/    fotos, miniaturas (thumbs/) e vídeos de demonstração
public/media/sequencia/  quadros WebP da cena em canvas (gerados por script)
scripts/              gerar-sequencia.sh (ffmpeg), capturas.mjs (Playwright + Edge)
Dockerfile, nginx.conf, docker-compose.yml   imagem de produção (estáticos no Nginx)
versoes/v1/           cópia da primeira versão (sem scroll animado), só referência
```

## Comandos

| Comando | O que faz | Estado |
|---|---|---|
| `npm install` | instala dependências | executado |
| `npm run dev` | servidor local em http://localhost:5173 | executado |
| `npm run build` | `tsc -b` e build de produção em `dist/` | executado, sem erros |
| `npm run lint` | oxlint | executado, sem avisos |
| `npm run preview` | serve o `dist/` | encontrado, não executado |
| `docker compose up -d --build` | build multi-stage (node:24-alpine, depois nginx:1.28-alpine) servindo `dist/` em http://localhost:8080 | executado, healthcheck ok |
| `npm run capturas` | screenshots por cena em `capturas/` (precisa do dev rodando e do Edge) | executado |
| `bash scripts/gerar-sequencia.sh <video>` | quadros da cena em canvas (precisa de ffmpeg) | executado com `--fotos` |

Não há suíte de testes. Validação é feita no navegador (ver abaixo). `capturas.mjs` aceita largura, altura e `reduce`/`no-preference` para emular movimento reduzido.

## Convenções

- Conteúdo novo entra em `src/data/casamento.ts`, nunca fixo em componente.
- Cores só por token (`bg-bg`, `text-ink`, `bg-accent`, `bg-night`, `text-on-photo`...). Sem hex solto em componentes. `night` e `on-photo` são fixos nos dois temas e servem para texto sobre foto/vídeo.
- Um único acento (`accent`). Raios: 4px fotos (`--radius-photo`), 16px painéis (`--radius-panel`), pílula em botões.
- Tema claro e escuro via `prefers-color-scheme`; testar os dois.
- Cenas de scroll: GSAP dentro de `useGSAP` com `gsap.matchMedia()` e a query de `comMovimento()`. Nunca misturar GSAP e Motion no mesmo componente. Nada de `window.addEventListener('scroll')`.
- Movimento reduzido: sem Lenis, sem pin e sem scrub; cada cena tem versão estática (ex.: `CenaEstatica`, história em grade). `?movimento=1` força as animações para demonstração.
- Seções fixadas (pin) são criadas em ordem de cima para baixo. Ao mudar altura de conteúdo, `ScrollTrigger.refresh()`.
- Diálogos (menu, lightbox, telão) usam `useDialogo` para foco preso, Esc, devolução de foco e pausa do Lenis (`travarScroll`). Elementos `position: fixed` não devem ficar dentro do header (o `backdrop-blur` vira referência do fixed).
- Copy: frases curtas, sem travessão (— ou –) em texto visível.
- Fotos novas: gerar miniatura de cerca de 900px em `thumbs/` e informar largura/altura reais no dado (evita salto de layout).

## Validação de UI

Conferir com `npm run capturas` (1440x900 e 390x844, com `no-preference` e `reduce`) e no navegador, temas claro e escuro: overflow horizontal, cada cena fixada, âncoras com Lenis, lightbox (setas, Esc, foco, scroll parado), filtros, capítulos do filme, telão (avanço automático, pausa, Esc) e menu móvel.

Preferência do kit de agentes: estruturar mudanças de UI no Figma antes do código. Ainda não há arquivo Figma do projeto; a conta atual tem assento de visualização.

## Segurança e operação

Sem dados pessoais reais no repositório. As fotos de demonstração são do Unsplash (licença Unsplash) e devem ser trocadas pelas fotos do casal antes de publicar. Publicação (deploy) só com autorização explícita.
