import { Pause, Play } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { casal, heroVideo } from '../data/casamento'
import { comMovimento, gsap, useGSAP, useMovimento } from '../lib/scroll'

/** Separa uma palavra em letras animáveis; o texto acessível fica no h1. */
function Letras({ texto }: { texto: string }) {
  return (
    <>
      {[...texto].map((l, i) => (
        <span key={i} data-letra className="inline-block whitespace-pre">
          {l}
        </span>
      ))}
    </>
  )
}

export function Hero() {
  const raiz = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const movimento = useMovimento()
  const [tocando, setTocando] = useState(false)

  // Com movimento reduzido o vídeo não inicia sozinho; o pôster fica parado.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (movimento) v.play().catch(() => setTocando(false))
    else v.pause()
  }, [movimento])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(comMovimento(), () => {
        // Entrada, uma vez: os nomes sobem letra a letra e o resto chega depois.
        gsap.from('[data-letra]', { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: 0.1 })
        gsap.from('[data-hero-sub]', { autoAlpha: 0, y: 16, filter: 'blur(6px)', duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.75 })

        // Scroll: a abertura fica fixa e o vídeo se fecha numa moldura, passando para a página.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: raiz.current, start: 'top top', end: '+=85%', scrub: 0.6, pin: true },
        })
        tl.fromTo('[data-hero-quadro]', { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(8% 5% 8% 5% round 20px)', ease: 'none' }, 0)
          .fromTo(videoRef.current, { scale: 1.14 }, { scale: 1, ease: 'none' }, 0)
          .to('[data-hero-conteudo]', { yPercent: -14, autoAlpha: 0, ease: 'power1.in' }, 0.3)
      })
      return () => mm.revert()
    },
    { scope: raiz },
  )

  function alternarVideo() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <section ref={raiz} id="inicio" aria-label="Abertura" className="relative h-[100dvh] min-h-[560px] overflow-hidden bg-bg">
      <div data-hero-quadro className="absolute inset-0 overflow-hidden bg-night text-on-photo">
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={heroVideo.src}
          poster={heroVideo.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlay={() => setTocando(true)}
          onPause={() => setTocando(false)}
        />
        {/* Véu radial só para legibilidade dos nomes sobre o vídeo. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(13_18_16/0.55),rgb(13_18_16/0.15)_70%)]" />

        <div data-hero-conteudo className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 aria-label={`${casal.noiva} e ${casal.noivo}`} className="font-display text-[clamp(3.75rem,13vw,11rem)] font-medium italic leading-[0.9] tracking-tight">
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
              <Letras texto={casal.noiva} />
            </span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.12em]">
              <Letras texto={`& ${casal.noivo}`} />
            </span>
          </h1>

          <p data-hero-sub className="mt-6 max-w-md text-base text-on-photo/85 sm:text-lg">
            <time dateTime={casal.data}>{casal.dataPorExtenso}</time>, {casal.local}
          </p>

          <div data-hero-sub className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#filme"
              className="inline-flex min-h-12 items-center rounded-full bg-on-photo px-6 font-medium text-night transition hover:bg-white active:scale-[0.98]"
            >
              Assistir ao filme
            </a>
            <a
              href="#galeria"
              className="inline-flex min-h-12 items-center rounded-full px-6 font-medium text-on-photo ring-1 ring-on-photo/50 transition hover:bg-on-photo/10 active:scale-[0.98]"
            >
              Ver galeria
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={alternarVideo}
          aria-label={tocando ? 'Pausar vídeo de fundo' : 'Tocar vídeo de fundo'}
          className="absolute right-4 bottom-5 inline-flex size-11 items-center justify-center rounded-full text-on-photo/85 ring-1 ring-on-photo/30 transition hover:text-on-photo sm:right-8 sm:bottom-8"
        >
          {tocando ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
      </div>
    </section>
  )
}
