// Percorre a página rolando até pontos de cada cena e salva screenshots.
// Uso: node scripts/capturas.mjs <pasta-saida> [largura] [altura] [reduce|no-preference]
// Requer o servidor de dev rodando em http://localhost:5173 e o Edge instalado.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const [saida = 'capturas', largura = '1440', altura = '900', movimento = 'no-preference'] = process.argv.slice(2)
mkdirSync(saida, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({
  viewport: { width: Number(largura), height: Number(altura) },
  reducedMotion: movimento,
})
const erros = []
page.on('pageerror', (e) => erros.push(e.message))
page.on('console', (m) => m.type() === 'error' && erros.push(m.text()))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2200)

// Início de cada cena (o pin-spacer, quando a seção é fixada) e altura percorrida.
const cenas = await page.evaluate(() => {
  const info = (sel) => {
    const el = document.querySelector(sel)
    const caixa = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el
    return { y: Math.round(caixa.getBoundingClientRect().top + scrollY), h: caixa.offsetHeight }
  }
  return {
    hero: info('#inicio'),
    manifesto: info('[aria-label="Sobre nós"]'),
    historia: info('#historia'),
    dia: info('[aria-labelledby="dia-titulo"]'),
    galeria: info('#galeria'),
    filme: info('#filme'),
    telao: info('#telao'),
    fim: { y: document.documentElement.scrollHeight - innerHeight, h: 0 },
  }
})

const vh = Number(altura)
const pontos = [
  ['01-hero', cenas.hero.y],
  ['02-hero-fechando', cenas.hero.y + vh * 0.45],
  ['03-manifesto', cenas.manifesto.y - vh * 0.25],
  ['04-historia-inicio', cenas.historia.y + 10],
  ['05-historia-meio', cenas.historia.y + (cenas.historia.h - vh) * 0.55],
  ['06-dia-inicio', cenas.dia.y + 10],
  ['07-dia-meio', cenas.dia.y + (cenas.dia.h - vh) * 0.38],
  ['08-dia-fim', cenas.dia.y + (cenas.dia.h - vh) * 0.85],
  ['09-galeria', cenas.galeria.y + vh * 0.35],
  ['10-filme-abrindo', cenas.filme.y - vh * 0.35],
  ['11-filme', cenas.filme.y + vh * 0.2],
  ['12-telao', cenas.telao.y + vh * 0.1],
  ['13-final', cenas.fim.y],
]

for (const [nome, y] of pontos) {
  await page.evaluate((alvo) => window.scrollTo(0, alvo), Math.round(y))
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${saida}/${nome}.png` })
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
console.log(JSON.stringify({ cenas, overflowX: overflow, erros }, null, 1))
await browser.close()
