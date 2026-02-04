import CrearUsuarioAdminForm from "../components/CrearUsuarioAdminForm"
import NavBarAdmin from "../components/NavBarAdmin"
import { useNavigate } from "react-router-dom"

function CrearUsuarioAdminPage() {
  const navigate = useNavigate()
  function logout() {
    localStorage.clear()
    navigate("/")
  }

  return <div className="bg-slate-50 bg-cover min-h-screen bg-center">
    <NavBarAdmin onLogout={logout} />
    <div className="px-6 py-6">
      <h1 className="pb-5 ml-6 text-3xl font-semibold text-center">Añadir Usuario</h1>
      <CrearUsuarioAdminForm />
    </div>
  </div>

}

export default CrearUsuarioAdminPage
