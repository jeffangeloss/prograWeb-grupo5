import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import AdminPage from './pages/AdminPage'
import InicioSesion from './pages/InicioSesion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InicioSesion />
    <AdminPage />
  </StrictMode>,
)
