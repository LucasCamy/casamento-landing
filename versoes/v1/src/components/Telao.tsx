import { Monitor, Moon, Shuffle, TextAa } from '@phosphor-icons/react'
import { useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { casal, fotos } from '../data/casamento'
import { useSlideshow, type ConfigTelao } from '../lib/slideshow'
import { Quadro } from './Quadro'

const intervalos = [4, 6, 10]

type Props = {
  config: ConfigTelao
  onConfig: (c: ConfigTelao) => void
  onAbrir: () => void
}

function Alternar({ ativo, onClick, icone, children }: { ativo: boolean; onClick: () => void; icone: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      onClick={onClick}
      className="flex min-h-12 w-full items-center gap-3 rounded-[var(--radius-panel)] px-4 text-left ring-1 ring-line transition hover:ring-ink-muted"
    >
      <span className="text-ink-muted">{icone}</span>
      <span className="flex-1 font-medium">{children}</span>
      <span aria-hidden="true" className={`relative h-6 w-10 rounded-full transition-colors ${ativo ? 'bg-accent' : 'bg-line'}`}>
        <span className={`absolute top-1 left-1 size-4 rounded-full bg-bg transition-transform duration-[180ms] ${ativo ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  )
}

export function Telao({ config, onConfig, onAbrir }: Props) {
  const reduzir = useReducedMotion()
  const previaRef = useRef<HTMLDivElement>(null)
  const visivel = useInView(previaRef, { amount: 0.4 })
  // A prévia só anda quando está na tela e o usuário não pediu menos movimento.
  const tocando = visivel && !reduzir
  const { foto } = useSlideshow(fotos, config, tocando, true)

  return (
    <section id="telao" aria-labelledby="telao-titulo" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Para a festa</p>
          <h2 id="telao-titulo" className="mt-4 font-display text-5xl font-medium leading-[1.05] md:text-6xl">
            Modo telão
          </h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-muted">
            Conecte o notebook no projetor ou na TV e deixe as fotos passando sozinhas durante a recepção.
          </p>

          <fieldset className="mt-10">
            <legend className="text-sm font-semibold text-ink-muted">Tempo de cada foto</legend>
            <div className="mt-3 flex gap-2">
              {intervalos.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={config.intervalo === s}
                  onClick={() => onConfig({ ...config, intervalo: s })}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap tabular-nums transition active:scale-[0.98] sm:px-5 ${
                    config.intervalo === s ? 'bg-accent text-accent-ink' : 'ring-1 ring-line hover:ring-ink-muted'
                  }`}
                >
                  {s} segundos
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-2">
            <Alternar ativo={config.aleatorio} onClick={() => onConfig({ ...config, aleatorio: !config.aleatorio })} icone={<Shuffle size={20} />}>
              Ordem aleatória
            </Alternar>
            <Alternar ativo={config.mostrarNomes} onClick={() => onConfig({ ...config, mostrarNomes: !config.mostrarNomes })} icone={<TextAa size={20} />}>
              Mostrar nossos nomes na tela
            </Alternar>
          </div>

          <button
            type="button"
            onClick={onAbrir}
            className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-7 font-medium text-accent-ink transition hover:opacity-90 active:scale-[0.98]"
          >
            <Monitor size={20} />
            Abrir telão
          </button>
          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
            <Moon size={18} className="mt-0.5 shrink-0" />
            Abre em tela cheia e mantém a tela acesa. Espaço pausa, setas trocam a foto e Esc sai.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div
            ref={previaRef}
            className="relative aspect-video overflow-hidden rounded-[var(--radius-panel)] bg-night shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.5)]"
            aria-label="Prévia do telão"
            role="img"
          >
            <Quadro foto={foto} intervalo={config.intervalo} tocando={tocando} usarThumb />
            {config.mostrarNomes && <NomesNaTela compacto />}
          </div>
          <p className="mt-3 text-sm text-ink-muted">Prévia ao vivo com as configurações escolhidas.</p>
        </div>
      </div>
    </section>
  )
}

export function NomesNaTela({ compacto = false }: { compacto?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent text-on-photo ${
        compacto ? 'px-5 pt-16 pb-4' : 'px-10 pt-40 pb-10'
      }`}
    >
      <p className={`font-display italic leading-none ${compacto ? 'text-3xl' : 'text-6xl lg:text-7xl'}`}>
        {casal.noiva} &amp; {casal.noivo}
      </p>
      <p className={`mt-2 text-on-photo/80 ${compacto ? 'text-xs' : 'text-lg'}`}>
        {casal.dataPorExtenso} <span className="mx-1">{casal.hashtag}</span>
      </p>
    </div>
  )
}
