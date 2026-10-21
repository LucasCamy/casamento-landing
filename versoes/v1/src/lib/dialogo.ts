import { useEffect, type RefObject } from 'react'

const focaveis =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'

/**
 * Comportamento comum de diálogos em tela cheia (menu, lightbox, telão):
 * prende o foco dentro do container, trava a rolagem da página,
 * fecha com Esc e devolve o foco ao elemento que abriu.
 */
export function useDialogo(ref: RefObject<HTMLElement | null>, aberto: boolean, fechar: () => void) {
  useEffect(() => {
    if (!aberto) return
    const anterior = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const container = ref.current
    const primeiro = container?.querySelector<HTMLElement>('[data-autofoco]') ?? container?.querySelector<HTMLElement>(focaveis)
    primeiro?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        fechar()
        return
      }
      if (e.key !== 'Tab' || !container) return
      const lista = [...container.querySelectorAll<HTMLElement>(focaveis)].filter((el) => el.offsetParent !== null)
      if (lista.length === 0) return
      const inicio = lista[0]
      const fim = lista[lista.length - 1]
      if (e.shiftKey && document.activeElement === inicio) {
        e.preventDefault()
        fim.focus()
      } else if (!e.shiftKey && document.activeElement === fim) {
        e.preventDefault()
        inicio.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      anterior?.focus({ preventScroll: true })
    }
  }, [aberto, fechar, ref])
}
