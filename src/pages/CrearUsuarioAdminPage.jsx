import CrearUsuarioAdminForm from "../components/CrearUsuarioAdminForm"
import NavBarAdmin from "../components/NavbarAdmin"

function EditarUsuarioPage() {
  return <div>
    <div className="bg-[url('/img/azul.png')] bg-cover min-h-screen bg-center">
      <NavBarAdmin />
      <div className="px-6 py-6">
        <h1 className="pb-5 ml-6 object-left text-3xl text-white font-semibold">Añadir Usuario</h1>
        <CrearUsuarioAdminForm />
      </div>
    </div>
  </div>

}

export default EditarUsuarioPage
