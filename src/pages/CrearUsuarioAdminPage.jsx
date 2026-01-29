import CrearUsuarioAdminForm from "../components/CrearUsuarioAdminForm"
import NavBarAdmin from "../components/NavBarAdmin"

function CrearUsuarioAdminPage() {

return <div className="bg-slate-50 bg-cover min-h-screen bg-center">
  <NavBarAdmin />
  <div className="px-6 py-6">
    <h1 className="pb-5 ml-6 text-3xl font-semibold">Añadir Usuario</h1>
    <CrearUsuarioAdminForm />
  </div>
</div>

}

export default CrearUsuarioAdminPage
