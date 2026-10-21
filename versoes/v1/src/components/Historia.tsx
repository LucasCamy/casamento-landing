import { motion, useReducedMotion } from 'motion/react'
import { fotoPorId, historia } from '../data/casamento'

const ease = [0.22, 1, 0.36, 1] as const

export function Historia() {
  const reduzir = useReducedMotion()

  return (
    <section id="historia" aria-labelledby="historia-titulo" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <h2 id="historia-titulo" className="max-w-2xl font-display text-5xl font-medium leading-[1.05] md:text-6xl">
        Oito anos até o sim
      </h2>
      <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
        Antes das fotos do grande dia, um pouco do caminho que trouxe a gente até aqui.
      </p>

      {/* Linha do tempo: vertical no celular, horizontal a partir de lg. */}
      <ol className="relative mt-16 grid gap-14 lg:mt-24 lg:grid-cols-4 lg:gap-8">
        <motion.span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-line lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
          initial={reduzir ? false : { scaleY: 0, scaleX: 0 }}
          whileInView={{ scaleY: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        />
        {historia.map((m, i) => {
          const f = fotoPorId(m.fotoId)
          return (
            <motion.li
              key={m.ano}
              className="relative pl-10 lg:pl-0 lg:pt-12"
              initial={reduzir ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.56, delay: reduzir ? 0 : 0.15 + i * 0.12, ease }}
            >
              <span aria-hidden="true" className="absolute top-1 left-0 size-[15px] rounded-full border-2 border-accent bg-bg lg:top-0" />
              {/* Colunas alternadas descem um pouco no desktop; o ponto continua na linha. */}
              <div className={i % 2 === 1 ? 'lg:mt-20' : ''}>
                <p className="font-display text-3xl italic text-accent">{m.ano}</p>
                <h3 className="mt-1 text-lg font-semibold">{m.titulo}</h3>
                <p className="mt-2 max-w-[38ch] leading-relaxed text-ink-muted">{m.texto}</p>
                <img
                  src={f.thumb}
                  alt={f.alt}
                  width={f.largura}
                  height={f.altura}
                  loading="lazy"
                  decoding="async"
                  className="mt-6 aspect-[4/5] w-full max-w-sm rounded-[var(--radius-photo)] object-cover lg:max-w-none"
                />
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
