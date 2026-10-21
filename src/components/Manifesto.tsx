import { useRef } from 'react'
import { manifesto } from '../data/casamento'
import { comMovimento, gsap, useGSAP } from '../lib/scroll'

/** Texto que acende palavra por palavra acompanhando o scroll (e apaga ao voltar). */
export function Manifesto() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(comMovimento(), () => {
        gsap.fromTo(
          '[data-palavra]',
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: raiz.current, start: 'top 72%', end: 'bottom 55%', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} aria-label="Sobre nós" className="mx-auto max-w-6xl px-4 py-32 sm:px-6 md:py-48 lg:px-10">
      <p className="font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.12] font-medium">
        {manifesto.split(' ').map((p, i) => (
          <span key={i} data-palavra>
            {p}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
