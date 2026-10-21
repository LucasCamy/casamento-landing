import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useSyncExternalStore } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * `?movimento=1` liga as animações mesmo com "reduzir movimento" ativo no sistema.
 * Serve para demonstrar a página; visitantes reais seguem a preferência do sistema.
 */
export const movimentoForcado = new URLSearchParams(window.location.search).has('movimento')

const preferencia = movimentoForcado ? 'all' : '(prefers-reduced-motion: no-preference)'

/** Media query para gsap.matchMedia: movimento permitido, opcionalmente com outra condição. */
export function comMovimento(extra?: string) {
  return [extra, movimentoForcado ? undefined : preferencia].filter(Boolean).join(' and ') || 'all'
}

function assinar(callback: () => void) {
  const mq = window.matchMedia(preferencia)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

/** true quando a página pode animar (scroll suave, pins, scrub). */
export function useMovimento() {
  return useSyncExternalStore(assinar, () => window.matchMedia(preferencia).matches)
}

let lenis: Lenis | null = null

/** Pausa ou retoma o scroll suave (diálogos abertos não devem rolar a página). */
export function travarScroll(travar: boolean) {
  if (travar) lenis?.stop()
  else lenis?.start()
}

/**
 * Scroll suave com Lenis, sincronizado com o ScrollTrigger pelo ticker do GSAP.
 * Desligado quando o usuário prefere menos movimento.
 */
export function useScrollSuave(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return
    const instancia = new Lenis({ lerp: 0.085, anchors: { offset: -64 } })
    lenis = instancia
    instancia.on('scroll', ScrollTrigger.update)
    const tick = (tempo: number) => instancia.raf(tempo * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Fontes mudam a altura dos títulos; recalcula as posições dos gatilhos quando chegarem.
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => {
      gsap.ticker.remove(tick)
      instancia.destroy()
      lenis = null
    }
  }, [ativo])
}

export { gsap, ScrollTrigger, useGSAP }
