import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { movimentoForcado } from './lib/scroll'

if (movimentoForcado) document.documentElement.classList.add('movimento-forcado')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
