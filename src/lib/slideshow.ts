import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Foto } from '../data/casamento'

export type ConfigTelao = {
  /** Tempo de cada foto, em segundos. */
  intervalo: number
  aleatorio: boolean
  mostrarNomes: boolean
}

export const configPadrao: ConfigTelao = { intervalo: 6, aleatorio: false, mostrarNomes: true }

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Estado de uma sequência de fotos que avança sozinha enquanto `tocando` for true. */
export function useSlideshow(fotos: Foto[], { intervalo, aleatorio }: ConfigTelao, tocando: boolean, usarThumb = false) {
  const ordem = useMemo(() => (aleatorio ? embaralhar(fotos) : fotos), [fotos, aleatorio])
  const [posicao, setPosicao] = useState(0)
  // Muda a cada troca para reiniciar o temporizador e a barra de progresso.
  const [passo, setPasso] = useState(0)

  const ir = useCallback(
    (delta: number) => {
      setPosicao((p) => (p + delta + ordem.length) % ordem.length)
      setPasso((n) => n + 1)
    },
    [ordem.length],
  )

  useEffect(() => {
    if (!tocando) return
    const t = window.setTimeout(() => ir(1), intervalo * 1000)
    return () => window.clearTimeout(t)
  }, [tocando, intervalo, ir, passo])

  useEffect(() => {
    const prox = new Image()
    const seguinte = ordem[(posicao + 1) % ordem.length]
    prox.src = usarThumb ? seguinte.thumb : seguinte.src
  }, [ordem, posicao, usarThumb])

  return { foto: ordem[posicao], posicao, total: ordem.length, passo, ir }
}
