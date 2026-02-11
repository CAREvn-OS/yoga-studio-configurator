import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Configurator } from '@care/configurator'
import './styles/base.css'
import './styles/sections.css'
import './styles/animations.css'
import './styles/layouts.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Configurator />
  </StrictMode>
)
