import { CaretLeft, CaretRight, DownloadSimple, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Foto } from '../data/casamento'
import { useDialogo } from '../lib/dialogo'

type Props = {
  fotos: Foto[]
  indice: number | null
  onMudar: (i: number) => void
  onFechar: () => void
}

export function Lightbox({ fotos, indice, onMudar, onFechar }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const aberto = indice !== null
  useDialogo(ref, aberto, onFechar)

  const ir = useCallback(
    (delta: number) => {
      if (indice === null) return
      onMudar((indice + delta + fotos.length) % fotos.length)
    },
    [indice, fotos.length, onMudar],
  )

  useEffect(() => {
    if (!aberto) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aberto, ir])

  // Pré-carrega a próxima foto para a troca ser instantânea.
  useEffect(() => {
    if (indice === null || fotos.length < 2) return
    const prox = new Image()
    prox.src = fotos[(indice + 1) % fotos.length].src
  }, [indice, fotos])

  function onArrastar(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) ir(1)
    else if (info.offset.x > 60) ir(-1)
  }

  const foto = indice !== null ? fotos[indice] : null

  return createPortal(
    <AnimatePresence>
      {foto && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-50 flex flex-col bg-night/95 text-on-photo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.28 }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm tabular-nums text-on-photo/75" aria-live="polite">
              {indice! + 1} de {fotos.length}
            </p>
            <div className="flex items-center gap-1">
              <a
                href={foto.src}
                download
                className="inline-flex size-11 items-center justify-center rounded-full hover:bg-on-photo/10"
                aria-label="Baixar foto"
              >
                <DownloadSimple size={22} />
              </a>
              <button
                type="button"
                data-autofoco
                onClick={onFechar}
                className="inline-flex size-11 items-center justify-center rounded-full hover:bg-on-photo/10"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={foto.id}
                src={foto.src}
                alt={foto.alt}
                className="max-h-full max-w-full touch-pan-y select-none rounded-[var(--radius-photo)] object-contain"
                initial={reduzir ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.28 }}
                drag={reduzir ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={onArrastar}
                draggable={false}
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 inline-flex size-12 items-center justify-center rounded-full bg-on-photo/10 hover:bg-on-photo/20"
            >
              <CaretLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Próxima foto"
              className="absolute right-2 inline-flex size-12 items-center justify-center rounded-full bg-on-photo/10 hover:bg-on-photo/20"
            >
              <CaretRight size={22} />
            </button>
          </div>

          <p aria-hidden="true" className="mx-auto max-w-2xl px-4 py-4 text-center text-sm leading-relaxed text-on-photo/80">{foto.alt}</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
