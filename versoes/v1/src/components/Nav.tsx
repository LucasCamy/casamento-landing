import { List, X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { casal } from '../data/casamento'
import { useDialogo } from '../lib/dialogo'

const links = [
  { href: '#historia', rotulo: 'Nossa história' },
  { href: '#galeria', rotulo: 'Galeria' },
  { href: '#filme', rotulo: 'Filme' },
  { href: '#telao', rotulo: 'Telão' },
]

export function Nav({ onAbrirTelao }: { onAbrirTelao: () => void }) {
  const { scrollY } = useScroll()
  // Começa já sólida se a página for recarregada no meio da rolagem.
  const [solida, setSolida] = useState(() => window.scrollY > window.innerHeight * 0.75)
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const fecharMenu = useCallback(() => setMenuAberto(false), [])
  useDialogo(menuRef, menuAberto, fecharMenu)

  // A barra fica transparente sobre o vídeo do hero e ganha fundo depois dele.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const limite = window.innerHeight * 0.75
    if (y > limite !== solida) setSolida(y > limite)
  })

  const claro = !solida && !menuAberto

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[280ms] ${
          claro ? 'bg-transparent text-white' : 'border-b border-line bg-bg/90 text-ink backdrop-blur-md'
        }`}
      >
        <nav aria-label="Principal" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <a href="#inicio" className="font-display text-2xl italic leading-none">
            {casal.noiva} <span aria-hidden="true">&amp;</span>
            <span className="sr-only">e</span> {casal.noivo}
          </a>
  
          <ul className="hidden items-center gap-8 text-sm lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="opacity-85 transition-opacity hover:opacity-100">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
  
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAbrirTelao}
              className={`hidden min-h-11 rounded-full px-5 text-sm font-medium transition active:scale-[0.98] sm:inline-flex sm:items-center ${
                claro ? 'bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25' : 'bg-accent text-accent-ink hover:opacity-90'
              }`}
            >
              Abrir telão
            </button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full lg:hidden"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              aria-controls="menu-movel"
              onClick={() => setMenuAberto((v) => !v)}
            >
              {menuAberto ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            id="menu-movel"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-bg px-4 pt-6 pb-10 text-ink sm:px-6 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={fecharMenu} className="block py-4 font-display text-4xl">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                fecharMenu()
                onAbrirTelao()
              }}
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-medium text-accent-ink"
            >
              Abrir telão
            </button>
            {/* Mantém o botão de fechar dentro do ciclo de foco do diálogo. */}
            <button type="button" onClick={fecharMenu} className="sr-only focus:not-sr-only focus:mt-4 focus:block">
              Fechar menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
