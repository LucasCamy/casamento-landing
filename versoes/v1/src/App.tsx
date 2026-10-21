import { MotionConfig } from 'motion/react'
import { useCallback, useState } from 'react'
import { Filme } from './components/Filme'
import { Galeria } from './components/Galeria'
import { Hero } from './components/Hero'
import { Historia } from './components/Historia'
import { Nav } from './components/Nav'
import { Rodape } from './components/Rodape'
import { Telao } from './components/Telao'
import { TelaoPlayer } from './components/TelaoPlayer'
import { configPadrao, type ConfigTelao } from './lib/slideshow'

export default function App() {
  const [config, setConfig] = useState<ConfigTelao>(configPadrao)
  const [telaoAberto, setTelaoAberto] = useState(false)

  // A tela cheia precisa ser pedida dentro do clique do usuário.
  const abrirTelao = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {})
    setTelaoAberto(true)
  }, [])
  const fecharTelao = useCallback(() => setTelaoAberto(false), [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-accent-ink"
      >
        Pular para o conteúdo
      </a>
      <Nav onAbrirTelao={abrirTelao} />
      <main id="conteudo">
        <Hero />
        <Historia />
        <Galeria />
        <Filme />
        <Telao config={config} onConfig={setConfig} onAbrir={abrirTelao} />
      </main>
      <Rodape />
      {telaoAberto && <TelaoPlayer config={config} onFechar={fecharTelao} />}
    </MotionConfig>
  )
}
