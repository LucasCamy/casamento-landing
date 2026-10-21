import { Pause, Play } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { casal, heroVideo } from '../data/casamento'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduzir = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [tocando, setTocando] = useState(false)

  // Com movimento reduzido o vídeo não inicia sozinho; o pôster fica parado.
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduzir) return
    v.play().catch(() => setTocando(false))
  }, [reduzir])

  function alternarVideo() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const linha = (atraso: number) =>
    reduzir
      ? {}
      : {
          initial: { y: '105%' },
          animate: { y: '0%' },
          transition: { duration: 0.9, delay: atraso, ease },
        }

  return (
    <section id="inicio" aria-label="Abertura" className="relative isolate flex min-h-[100dvh] items-end overflow-hidden bg-night text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 size-full object-cover"
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
      {/* Scrim só para legibilidade do texto sobre o vídeo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night/85 via-night/25 to-night/40" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
        <h1 className="font-display text-[clamp(3.5rem,11vw,9.5rem)] font-medium italic leading-[0.95] tracking-tight">
          <span className="block overflow-hidden pb-2">
            <motion.span className="block" {...linha(0.1)}>
              {casal.noiva}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-3 pl-[0.6em]">
            <motion.span className="block" {...linha(0.22)}>
              <span aria-hidden="true">&amp; </span>
              <span className="sr-only">e </span>
              {casal.noivo}
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={reduzir ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.56, delay: 0.55, ease }}
          className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            <time dateTime={casal.data}>{casal.dataPorExtenso}</time>, {casal.local}. As fotos e o filme do nosso dia, para rever quantas vezes quiser.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#filme"
              className="inline-flex min-h-12 items-center rounded-full bg-on-photo px-6 font-medium text-night transition hover:bg-white active:scale-[0.98]"
            >
              Assistir ao filme
            </a>
            <a
              href="#galeria"
              className="inline-flex min-h-12 items-center rounded-full px-6 font-medium text-white ring-1 ring-white/50 transition hover:bg-white/10 active:scale-[0.98]"
            >
              Ver galeria
            </a>
            <button
              type="button"
              onClick={alternarVideo}
              aria-label={tocando ? 'Pausar vídeo de fundo' : 'Tocar vídeo de fundo'}
              className="absolute right-4 bottom-5 inline-flex size-11 items-center justify-center rounded-full text-white/85 ring-1 ring-white/30 transition hover:text-white sm:static sm:size-12"
            >
              {tocando ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
