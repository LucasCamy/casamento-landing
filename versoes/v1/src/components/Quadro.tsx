import { AnimatePresence, motion } from 'motion/react'
import type { Foto } from '../data/casamento'

type Props = {
  foto: Foto
  /** Duração da foto em segundos; define o tempo do zoom lento. */
  intervalo: number
  tocando: boolean
  usarThumb?: boolean
}

/** Uma foto do telão com troca em fade cruzado e zoom lento enquanto aparece. */
export function Quadro({ foto, intervalo, tocando, usarThumb = false }: Props) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={foto.id}
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Fundo desfocado preenche as laterais de fotos verticais. */}
        <img src={foto.thumb} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl" />
        <img
          src={usarThumb ? foto.thumb : foto.src}
          alt={foto.alt}
          className="relative size-full object-contain"
          style={{
            animation: `kenburns ${intervalo + 1}s linear forwards`,
            animationPlayState: tocando ? 'running' : 'paused',
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
