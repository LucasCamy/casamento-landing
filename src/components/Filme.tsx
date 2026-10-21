import { Play } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { filme } from '../data/casamento'
import { comMovimento, gsap, useGSAP } from '../lib/scroll'

function formatarTempo(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export function Filme() {
  const raiz = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(comMovimento(), () => {
        // A moldura do filme se abre enquanto ele sobe até o centro da tela.
        gsap.fromTo(
          '[data-filme-quadro]',
          { clipPath: 'inset(14% 22% 14% 22% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            ease: 'none',
            scrollTrigger: { trigger: '[data-filme-quadro]', start: 'top 95%', end: 'center 60%', scrub: 0.5 },
          },
        )
        gsap.fromTo('[data-filme-poster]', { scale: 1.25 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-filme-quadro]', start: 'top 95%', end: 'center 60%', scrub: 0.5 },
        })
        gsap.from('[data-capitulo]', {
          autoAlpha: 0,
          x: 16,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-capitulos]', start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: raiz },
  )

  const [iniciado, setIniciado] = useState(false)
  const [capituloAtual, setCapituloAtual] = useState(0)

  function tocarDe(segundos: number) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = segundos
    setIniciado(true)
    v.play().catch(() => {})
  }

  function onTempo() {
    const t = videoRef.current?.currentTime ?? 0
    let atual = 0
    filme.capitulos.forEach((c, i) => {
      if (t >= c.inicio) atual = i
    })
    if (atual !== capituloAtual) setCapituloAtual(atual)
  }

  return (
    <section ref={raiz} id="filme" aria-labelledby="filme-titulo" className="mx-auto max-w-7xl px-4 py-32 sm:px-6 md:py-48 lg:px-10">
      <h2 id="filme-titulo" className="font-display text-5xl leading-[1.05] font-medium md:text-7xl">
        {filme.titulo}
      </h2>
      <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
        {filme.duracao} do nosso dia. Escolha um capítulo para ir direto ao momento.
      </p>

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
        <div data-filme-quadro className="relative overflow-hidden rounded-[var(--radius-panel)] bg-night shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.45)]">
          <video
            ref={videoRef}
            data-filme-poster
            className="block aspect-video w-full"
            src={filme.src}
            poster={filme.poster}
            controls={iniciado}
            playsInline
            preload="none"
            onTimeUpdate={onTempo}
            onPlay={() => setIniciado(true)}
          >
            Seu navegador não reproduz vídeos.
          </video>

          {!iniciado && (
            <button
              type="button"
              onClick={() => tocarDe(0)}
              className="group absolute inset-0 flex items-center justify-center bg-night/25 text-on-photo transition-colors hover:bg-night/10"
              aria-label={`Assistir ao filme, ${filme.duracao}`}
            >
              <span className="inline-flex size-20 items-center justify-center rounded-full bg-on-photo/95 text-night shadow-lg transition-transform duration-[280ms] group-hover:scale-105 group-active:scale-[0.98] md:size-24">
                <Play size={30} weight="fill" className="translate-x-0.5" />
              </span>
            </button>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink-muted">Capítulos</h3>
          <ol data-capitulos className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {filme.capitulos.map((c, i) => {
              const ativo = iniciado && i === capituloAtual
              return (
                <li key={c.titulo} data-capitulo className="shrink-0">
                  <button
                    type="button"
                    onClick={() => tocarDe(c.inicio)}
                    aria-current={ativo ? 'true' : undefined}
                    className={`flex min-h-11 w-full items-center justify-between gap-6 rounded-full px-4 text-left transition lg:rounded-[var(--radius-panel)] ${
                      ativo ? 'bg-accent text-accent-ink' : 'ring-1 ring-line hover:ring-ink-muted lg:ring-0 lg:hover:bg-surface'
                    }`}
                  >
                    <span className="font-medium">{c.titulo}</span>
                    <span className={`text-sm tabular-nums ${ativo ? 'opacity-80' : 'text-ink-muted'}`}>{formatarTempo(c.inicio)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
