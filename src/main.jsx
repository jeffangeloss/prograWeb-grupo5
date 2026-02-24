import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './main.css'
import InicioSesionPage from './pages/InicioSesionPage'
import AdminPage from './pages/AdminPage'
import EditarUsuarioPage from './pages/EditarUsuarioPage'
import CrearUsuarioAdminPage from './pages/CrearUsuarioAdminPage'
import SeguridadUsuarioPage from './pages/SeguridadUsuarioPage'
import RestableceContra from './pages/RestableceContra'
import RestablecerContra_2 from './pages/RestablecerContra_2'
import RestablecerContra_3 from './pages/RestablecerContra_3'
import RestablecerContra_correo from './pages/RestablecerContra_correo'
import EgresosPage from './pages/EgresosPage'
import RegistroPage from './pages/RegistroPage'
import EstadisticasPage from './pages/EstadisticasPage'
import ChatBotPage from './pages/ChatBotPage'
import GraficosUsuarioPage from './pages/GraficosUsuarioPage'
import LandingPage from './pages/LandingPage'
import CambiarContrasenaPage from './pages/CambiarContrasenaPage'
import PerfilUsuarioPage from './pages/PerfilUsuarioPage'
import AuditoriaAdminPage from './pages/AuditoriaAdminPage'
import EditarEgresoPage from './pages/EditarEgresoPage'
import ConfirmarEmailPage from './pages/ConfirmarEmailPage'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Toaster position="bottom-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sesion" element={<InicioSesionPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<EgresosPage />} />
        <Route path="/editarEgreso" element={<EditarEgresoPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/editarUsuario" element={<EditarUsuarioPage />} />
        <Route path="/crearUsuario" element={<CrearUsuarioAdminPage />} />
        <Route path="/seguridadUsuario" element={<SeguridadUsuarioPage />} />
        <Route path="/restablecer" element={<RestableceContra />} />
        <Route path="/restablecer/mensaje" element={<RestablecerContra_2 />} />
        <Route path="/restablecer/correo" element={<RestablecerContra_correo />} />
        <Route path="/restablecer/form" element={<RestablecerContra_3 />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/GraficosUsuario" element={<GraficosUsuarioPage />} />
        <Route path="/mi-contrasena" element={<CambiarContrasenaPage />} />
        <Route path="/perfil" element={<PerfilUsuarioPage />} />
        <Route path="/auditoriaAdmin" element={<AuditoriaAdminPage />} />
        <Route path="/registro/verif" element={<ConfirmarEmailPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
