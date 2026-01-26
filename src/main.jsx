import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter , Route, Routes } from 'react-router-dom'
import './main.css'
import InicioSesion from './pages/InicioSesion'
import AdminPage from './pages/AdminPage'
import EditarUsuarioPage from './pages/EditarUsuarioPage'
import RestableceContra from './pages/RestableceContra'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HashRouter>
    <Routes>
      <Route path="/" element={<InicioSesion />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user" element={<EditarUsuarioPage />} />
      <Route path="/restablecer" element={<RestableceContra />} />
    </Routes>
  </HashRouter>
  </StrictMode>,
)
