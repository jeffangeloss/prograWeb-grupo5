import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="bg-amber-300">Prueba de TailwindCSS</div>
  </StrictMode>,
)
