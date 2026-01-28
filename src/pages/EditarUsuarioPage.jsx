import EditarUsuarioForm from "../components/EditarUsuarioForm"
import NavBarAdmin from "../components/NavBarAdmin"

function EditarUsuarioPage() {
  return <div>
    <div className="bg-slate-50">
      <NavBarAdmin />
      <div className="px-6 py-6">
        <h1 className="pb-5 ml-6 object-left text-3xl text-white font-semibold">Editar Usuario</h1>
        <EditarUsuarioForm />
      </div>
    </div>
  </div>

}

export default EditarUsuarioPage
