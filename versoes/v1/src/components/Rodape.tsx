import { casal } from '../data/casamento'

export function Rodape() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <p className="font-display text-4xl italic leading-none">
            {casal.noiva} &amp; {casal.noivo}
          </p>
          <p className="mt-3 text-ink-muted">
            <time dateTime={casal.data}>{casal.dataPorExtenso}</time>. Obrigado por fazer parte.
          </p>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Página de demonstração: nomes e história são fictícios. Fotos de{' '}
          <a href="https://unsplash.com/license" className="underline underline-offset-4 hover:text-ink" rel="noreferrer" target="_blank">
            Unsplash
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
