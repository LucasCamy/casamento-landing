import { ArrowsOutSimple } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { categorias, fotos, type Categoria } from '../data/casamento'
import { Lightbox } from './Lightbox'

export function Galeria() {
  const reduzir = useReducedMotion()
  const [filtro, setFiltro] = useState<Categoria | 'todas'>('todas')
  const [aberta, setAberta] = useState<number | null>(null)

  const visiveis = filtro === 'todas' ? fotos : fotos.filter((f) => f.categoria === filtro)

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 id="galeria-titulo" className="font-display text-5xl font-medium leading-[1.05] md:text-6xl">
          Galeria
        </h2>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
          Toque em uma foto para ver em tela cheia. Use as setas do teclado ou deslize para passar.
        </p>

        <div role="group" aria-label="Filtrar fotos" className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {categorias.map((c) => {
            const total = c.id === 'todas' ? fotos.length : fotos.filter((f) => f.categoria === c.id).length
            const ativo = filtro === c.id
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(c.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-medium transition active:scale-[0.98] ${
                  ativo ? 'bg-accent text-accent-ink' : 'text-ink ring-1 ring-line hover:ring-ink-muted'
                }`}
              >
                {c.rotulo}
                <span className={`tabular-nums ${ativo ? 'opacity-80' : 'text-ink-muted'}`}>{total}</span>
              </button>
            )
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {visiveis.length} fotos exibidas
        </p>

        {/* Masonry com colunas CSS: mantém a proporção original de cada foto. */}
        <ul className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3 [&>li]:mb-3 sm:[&>li]:mb-4">
          <AnimatePresence initial={false} mode="popLayout">
            {visiveis.map((f, i) => (
              <motion.li
                key={f.id}
                className="break-inside-avoid"
                initial={reduzir ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setAberta(i)}
                  className="group relative block w-full overflow-hidden rounded-[var(--radius-photo)]"
                  aria-label={`Ampliar: ${f.alt}`}
                >
                  <img
                    src={f.thumb}
                    alt=""
                    width={f.largura}
                    height={f.altura}
                    loading="lazy"
                    decoding="async"
                    style={{ aspectRatio: `${f.largura} / ${f.altura}` }}
                    className="block w-full bg-line object-cover transition-transform duration-[560ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-night/60 text-on-photo opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ArrowsOutSimple size={18} />
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Lightbox fotos={visiveis} indice={aberta} onMudar={setAberta} onFechar={() => setAberta(null)} />
    </section>
  )
}
