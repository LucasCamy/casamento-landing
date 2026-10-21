import { useRef } from 'react'
import { fotoPorId, historia } from '../data/casamento'
import { comMovimento, gsap, useGSAP, useMovimento } from '../lib/scroll'

export function Historia() {
  const raiz = useRef<HTMLElement>(null)
  const trilho = useRef<HTMLDivElement>(null)
  // Sem movimento, a linha do tempo vira uma grade comum (o trilho horizontal depende do scroll).
  const horizontal = useMovimento()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: a seção fica fixa e a linha do tempo anda na horizontal.
      mm.add(comMovimento('(min-width: 1024px)'), () => {
        const t = trilho.current!
        const distancia = () => t.scrollWidth - window.innerWidth
        const pan = gsap.to(t, {
          x: () => -distancia(),
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        // Parallax dentro de cada foto, amarrado ao movimento horizontal.
        gsap.utils.toArray<HTMLElement>('[data-momento-img]').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, containerAnimation: pan, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
        // A linha se desenha conforme a viagem avança.
        gsap.fromTo('[data-linha]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top top', end: () => `+=${distancia()}`, scrub: true } })
      })

      // Celular: cada momento entra ao aparecer na tela.
      mm.add(comMovimento('(max-width: 1023px)'), () => {
        gsap.utils.toArray<HTMLElement>('[data-momento]').forEach((m) => {
          gsap.from(m, { autoAlpha: 0, y: 32, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: m, start: 'top 85%', once: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: raiz, dependencies: [horizontal], revertOnUpdate: true },
  )

  return (
    <section ref={raiz} id="historia" aria-labelledby="historia-titulo" className={`relative overflow-hidden py-24 ${horizontal ? 'lg:flex lg:h-[100dvh] lg:items-center lg:py-0' : 'lg:py-32'}`}>
      <div
        ref={trilho}
        className={`relative grid gap-20 px-4 sm:px-6 ${
          horizontal ? 'lg:flex lg:w-max lg:items-center lg:gap-[8vw] lg:px-[6vw]' : 'mx-auto max-w-7xl lg:grid-cols-4 lg:gap-8 lg:px-10'
        }`}
      >
        <span data-linha aria-hidden="true" className={`absolute top-1/2 left-0 hidden h-px w-full origin-left bg-line ${horizontal ? 'lg:block' : ''}`} />

        <div className={`relative max-w-xl ${horizontal ? 'lg:w-[34vw] lg:max-w-none' : 'lg:col-span-4 lg:mb-8'}`}>
          <h2 id="historia-titulo" className="font-display text-5xl leading-[1.02] font-medium md:text-7xl">
            Oito anos até o sim
          </h2>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-ink-muted">
            Antes das fotos do grande dia, um pouco do caminho que trouxe a gente até aqui.
          </p>
        </div>

        <ol className="contents">
          {historia.map((m, i) => {
            const f = fotoPorId(m.fotoId)
            return (
              <li key={m.ano} data-momento className={`relative bg-bg ${horizontal ? `lg:w-[min(30vw,460px)] ${i % 2 === 1 ? 'lg:translate-y-[9vh]' : 'lg:-translate-y-[6vh]'}` : ''}`}>
                <div className={`aspect-[4/5] overflow-hidden rounded-[var(--radius-photo)] ${horizontal ? 'lg:aspect-auto lg:h-[52vh]' : ''}`}>
                  <img
                    data-momento-img
                    src={f.thumb}
                    alt={f.alt}
                    width={f.largura}
                    height={f.altura}
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-[1.18] object-cover"
                  />
                </div>
                <p className="mt-5 font-display text-4xl italic text-accent">{m.ano}</p>
                <h3 className="mt-1 text-lg font-semibold">{m.titulo}</h3>
                <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-muted">{m.texto}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
