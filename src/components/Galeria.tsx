import { ArrowsOutSimple } from '@phosphor-icons/react'
import { useRef, useState, useSyncExternalStore } from 'react'
import { categorias, fotos, type Categoria, type Foto } from '../data/casamento'
import { comMovimento, gsap, ScrollTrigger, useGSAP } from '../lib/scroll'
import { Lightbox } from './Lightbox'

const mqDesktop = '(min-width: 1024px)'
function assinar(cb: () => void) {
  const mq = window.matchMedia(mqDesktop)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Distribui as fotos em colunas, em ordem de leitura (1ª, 2ª, 3ª coluna...). */
function emColunas(lista: Foto[], n: number) {
  const colunas: { foto: Foto; indice: number }[][] = Array.from({ length: n }, () => [])
  lista.forEach((foto, indice) => colunas[indice % n].push({ foto, indice }))
  return colunas
}

// Quanto cada coluna se desloca durante a passagem da galeria (yPercent).
const deslocamento = [4, 14, 7]

export function Galeria() {
  const raiz = useRef<HTMLElement>(null)
  const [filtro, setFiltro] = useState<Categoria | 'todas'>('todas')
  const [aberta, setAberta] = useState<number | null>(null)
  const desktop = useSyncExternalStore(assinar, () => window.matchMedia(mqDesktop).matches)

  const visiveis = filtro === 'todas' ? fotos : fotos.filter((f) => f.categoria === filtro)
  const colunas = emColunas(visiveis, desktop ? 3 : 2)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(comMovimento(), () => {
        // Cortina: cada foto se revela de baixo para cima ao entrar, em cascata.
        const itens = gsap.utils.toArray<HTMLElement>('[data-foto]')
        gsap.set(itens, { clipPath: 'inset(100% 0% 0% 0%)' })
        ScrollTrigger.batch(itens, {
          start: 'top 92%',
          once: true,
          onEnter: (lote) =>
            gsap.to(lote, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        })
      })
      // Parallax: no desktop as colunas andam em velocidades diferentes.
      mm.add(comMovimento(mqDesktop), () => {
        gsap.utils.toArray<HTMLElement>('[data-coluna]').forEach((col, i) => {
          gsap.fromTo(
            col,
            { yPercent: deslocamento[i] ?? 0 },
            {
              yPercent: -(deslocamento[i] ?? 0),
              ease: 'none',
              scrollTrigger: { trigger: '[data-grade]', start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: raiz, dependencies: [filtro, desktop], revertOnUpdate: true },
  )

  return (
    <section ref={raiz} id="galeria" aria-labelledby="galeria-titulo" className="overflow-hidden bg-surface py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 id="galeria-titulo" className="font-display text-5xl leading-[1.05] font-medium md:text-7xl">
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

        <div data-grade className={`mt-10 grid items-start gap-3 sm:gap-4 lg:mt-16 lg:gap-6 ${desktop ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {colunas.map((col, c) => (
            <ul key={c} data-coluna className="grid gap-3 sm:gap-4 lg:gap-6">
              {col.map(({ foto: f, indice }) => (
                <li key={f.id} data-foto>
                  <button
                    type="button"
                    onClick={() => setAberta(indice)}
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
                      className="block w-full bg-line object-cover transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-night/60 text-on-photo opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <ArrowsOutSimple size={18} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <Lightbox fotos={visiveis} indice={aberta} onMudar={setAberta} onFechar={() => setAberta(null)} />
    </section>
  )
}
