import EditarUsuarioForm from "../components/EditarUsuarioForm"
import NavBarAdmin from "../components/NavBarAdmin"
import { useNavigate } from "react-router-dom"
import { Toaster } from "sonner"

function EditarUsuarioPage() {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/")
  }

  return <div>
    <div className="bg-slate-50">
      <Toaster position="bottom-right" richColors closeButton />
      <NavBarAdmin onLogout={logout} />
      <div className="px-6 py-6">
        <h1 className="pb-5 ml-6 object-left text-3xl font-semibold text-center">Editar Usuario</h1>
        <EditarUsuarioForm />
      </div>
    </div>
  </div>

}

export default EditarUsuarioPage
