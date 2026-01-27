 import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter , Route, Routes } from 'react-router-dom'
import './main.css'
import InicioSesion from './pages/InicioSesion'
import AdminPage from './pages/AdminPage'
import EditarUsuarioPage from './pages/EditarUsuarioPage'
import RestableceContra from './pages/RestableceContra'
import RestablecerContra_2 from './pages/RestablecerContra_2'
import RestablecerContra_3 from './pages/RestablecerContra_3'
import RestablecerContra_correo from './pages/RestablecerContra_correo'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HashRouter>
    <Routes>
      <Route path="/" element={<InicioSesion />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/editarUsuario" element={<EditarUsuarioPage />} />
      <Route path="/restablecer" element={<RestableceContra />} />
      <Route path="/restablecer/mensaje" element={<RestablecerContra_2/>} />
      <Route path="/restablecer/correo" element={<RestablecerContra_correo/>} />
      <Route path="/restablecer/form" element={<RestablecerContra_3/>} />
    </Routes>
  </HashRouter>
  </StrictMode>,
)
