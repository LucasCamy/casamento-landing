import { CaretLeft, CaretRight, Pause, Play, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fotos } from '../data/casamento'
import { useDialogo } from '../lib/dialogo'
import { useSlideshow, type ConfigTelao } from '../lib/slideshow'
import { Quadro } from './Quadro'
import { NomesNaTela } from './Telao'

type Props = {
  config: ConfigTelao
  onFechar: () => void
}

/** Apresentação em tela cheia para projetor ou TV. Montado apenas enquanto aberto. */
export function TelaoPlayer({ config, onFechar }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [tocando, setTocando] = useState(true)
  const [controlesVisiveis, setControlesVisiveis] = useState(true)
  const { foto, posicao, total, passo, ir } = useSlideshow(fotos, config, tocando)
  useDialogo(ref, true, onFechar)

  // Teclado: espaço pausa, setas navegam. Esc é tratado por useDialogo.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault()
        setTocando((t) => !t)
      }
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ir])

  // Esconde controles e cursor depois de alguns segundos sem mexer o mouse.
  useEffect(() => {
    let timer = 0
    function mostrar() {
      setControlesVisiveis(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setControlesVisiveis(false), 2500)
    }
    mostrar()
    const el = ref.current
    el?.addEventListener('pointermove', mostrar)
    el?.addEventListener('pointerdown', mostrar)
    document.addEventListener('keydown', mostrar)
    return () => {
      window.clearTimeout(timer)
      el?.removeEventListener('pointermove', mostrar)
      el?.removeEventListener('pointerdown', mostrar)
      document.removeEventListener('keydown', mostrar)
    }
  }, [])

  // Mantém a tela acesa enquanto o telão estiver aberto, quando o navegador permite.
  useEffect(() => {
    let lock: WakeLockSentinel | undefined
    navigator.wakeLock
      ?.request('screen')
      .then((l) => (lock = l))
      .catch(() => {})
    return () => {
      lock?.release().catch(() => {})
    }
  }, [])

  // Sair da tela cheia pelo navegador não fecha o telão; fechar o telão sai da tela cheia.
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  const botao = 'inline-flex size-12 items-center justify-center rounded-full text-on-photo transition hover:bg-on-photo/15'

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Telão de fotos"
      className={`fixed inset-0 z-[60] bg-night ${controlesVisiveis ? '' : 'cursor-none'}`}
    >
      <Quadro foto={foto} intervalo={config.intervalo} tocando={tocando} />
      {config.mostrarNomes && <NomesNaTela />}

      {/* Tempo restante da foto atual. */}
      <div
        key={passo}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-on-photo/70"
        style={{
          animation: `progresso ${config.intervalo}s linear forwards`,
          animationPlayState: tocando ? 'running' : 'paused',
        }}
      />

      <div
        className={`absolute top-4 right-4 flex items-center gap-2 rounded-full bg-night/60 p-1 backdrop-blur-md transition-opacity duration-[280ms] sm:top-6 sm:right-6 ${
          controlesVisiveis ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="px-3 text-sm tabular-nums text-on-photo/80" aria-live="polite">
          {posicao + 1} de {total}
        </span>
        <button type="button" onClick={() => ir(-1)} className={botao} aria-label="Foto anterior">
          <CaretLeft size={22} />
        </button>
        <button
          type="button"
          data-autofoco
          onClick={() => setTocando((t) => !t)}
          className={botao}
          aria-label={tocando ? 'Pausar' : 'Continuar'}
        >
          {tocando ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
        </button>
        <button type="button" onClick={() => ir(1)} className={botao} aria-label="Próxima foto">
          <CaretRight size={22} />
        </button>
        <button type="button" onClick={onFechar} className={botao} aria-label="Sair do telão">
          <X size={22} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
