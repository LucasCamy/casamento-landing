import { useRef } from 'react'
import { casal } from '../data/casamento'
import { comMovimento, gsap, useGSAP } from '../lib/scroll'

export function Rodape() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(comMovimento(), () => {
        // Encerramento: os nomes sobem de dentro da máscara, linha a linha.
        gsap.from('[data-final-linha]', {
          yPercent: 110,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: raiz.current, start: 'top 75%', once: true },
        })
        gsap.from('[data-final-texto]', {
          autoAlpha: 0,
          y: 12,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: raiz.current, start: 'top 75%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <footer ref={raiz} className="overflow-hidden border-t border-line">
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 md:pt-40 lg:px-10">
        <p aria-label={`${casal.noiva} e ${casal.noivo}`} className="font-display text-[clamp(4rem,15vw,13rem)] leading-[0.88] font-medium italic tracking-tight">
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span data-final-linha className="block">
              {casal.noiva}
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.12em] pl-[0.5em]">
            <span data-final-linha className="block">
              &amp; {casal.noivo}
            </span>
          </span>
        </p>

        <div data-final-texto className="mt-14 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <p className="text-lg">
            <time dateTime={casal.data}>{casal.dataPorExtenso}</time>. Obrigado por fazer parte.
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
            Página de demonstração: nomes e história são fictícios. Fotos de{' '}
            <a href="https://unsplash.com/license" className="underline underline-offset-4 hover:text-ink" rel="noreferrer" target="_blank">
              Unsplash
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
