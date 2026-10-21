import { useEffect, useRef } from 'react'
import { fotoPorId, quadroDaSequencia, sequencia } from '../data/casamento'
import { gsap, ScrollTrigger, useGSAP, useMovimento } from '../lib/scroll'

/** Desenha a imagem cobrindo o canvas inteiro (equivalente a object-fit: cover). */
function desenhar(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx || !img.naturalWidth) return
  const { width: w, height: h } = canvas
  const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * escala
  const dh = img.naturalHeight * escala
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

function CenaAnimada() {
  const raiz = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const quadros = useRef<HTMLImageElement[]>([])
  const atual = useRef(0)

  // Mostra o quadro pedido ou o carregado mais próximo antes dele.
  function mostrar(indice: number) {
    atual.current = indice
    const canvas = canvasRef.current
    if (!canvas) return
    for (let i = indice; i >= 0; i--) {
      const img = quadros.current[i]
      if (img?.complete && img.naturalWidth) {
        desenhar(canvas, img)
        return
      }
    }
  }

  // Ajusta a resolução do canvas à tela e redesenha.
  useEffect(() => {
    const canvas = canvasRef.current!
    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      mostrar(atual.current)
    }
    ajustar()
    window.addEventListener('resize', ajustar)
    return () => window.removeEventListener('resize', ajustar)
  }, [])

  useGSAP(
    () => {
      // Só baixa os quadros quando a cena está chegando, para não pesar a abertura.
      ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top 250%',
        once: true,
        onEnter: () => {
          for (let i = 0; i < sequencia.total; i++) {
            const img = new Image()
            img.decoding = 'async'
            img.src = quadroDaSequencia(i + 1)
            // Redesenha se o quadro que chegou é o que deveria estar na tela.
            img.onload = () => {
              if (i <= atual.current) mostrar(atual.current)
            }
            quadros.current[i] = img
          }
        },
      })

      const estado = { quadro: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: raiz.current, start: 'top top', end: '+=320%', pin: true, scrub: 0.4 },
      })
      tl.to(estado, {
        quadro: sequencia.total - 1,
        duration: 1,
        onUpdate: () => mostrar(Math.round(estado.quadro)),
      }, 0)

      // Cada legenda entra e sai na sua janela do scroll.
      sequencia.legendas.forEach((l, i) => {
        const el = `[data-legenda="${i}"]`
        const meio = (l.fim - l.inicio) * 0.2
        // A primeira já está visível quando a cena fixa; as outras entram com o scroll.
        if (i > 0) tl.fromTo(el, { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: meio }, l.inicio)
        if (i < sequencia.legendas.length - 1) tl.to(el, { autoAlpha: 0, y: -16, duration: meio * 0.8 }, l.fim - meio * 0.8)
      })
      tl.fromTo('[data-progresso-cena]', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} aria-labelledby="dia-titulo" className="relative h-[100dvh] overflow-hidden bg-night text-on-photo">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-night/40" />

      <h2 id="dia-titulo" className="absolute top-20 left-4 text-sm font-semibold tracking-[0.18em] uppercase opacity-80 sm:left-8 lg:left-12">
        O dia, quadro a quadro
      </h2>

      <div className="absolute inset-x-4 bottom-14 sm:inset-x-8 lg:inset-x-12 lg:bottom-20">
        {sequencia.legendas.map((l, i) => (
          <div key={l.titulo} data-legenda={i} className={`absolute bottom-0 left-0 max-w-xl ${i > 0 ? 'invisible' : ''}`}>
            <p className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-medium italic">{l.titulo}</p>
            <p className="mt-3 text-lg text-on-photo/80">{l.texto}</p>
          </div>
        ))}
      </div>

      <span data-progresso-cena aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-on-photo/70" />
    </section>
  )
}

/** Versão sem movimento: as mesmas quatro cenas como fotos com legenda. */
function CenaEstatica() {
  return (
    <section aria-labelledby="dia-titulo" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
      <h2 id="dia-titulo" className="font-display text-5xl font-medium md:text-6xl">
        O dia, quadro a quadro
      </h2>
      <ol className="mt-12 grid gap-8 sm:grid-cols-2">
        {sequencia.legendas.map((l, i) => {
          const f = fotoPorId(sequencia.fotosChave[i])
          return (
            <li key={l.titulo}>
              <img src={f.thumb} alt={f.alt} loading="lazy" className="aspect-video w-full rounded-[var(--radius-photo)] object-cover" />
              <p className="mt-4 font-display text-3xl italic">{l.titulo}</p>
              <p className="mt-1 text-ink-muted">{l.texto}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function Sequencia() {
  return useMovimento() ? <CenaAnimada /> : <CenaEstatica />
}
