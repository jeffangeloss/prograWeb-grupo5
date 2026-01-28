import { useNavigate } from "react-router-dom";
import FiltradoAdmin from "../components/FiltradoAdmin";
import NavBarAdmin from "../components/NavbarAdmin";
import TablaAdmin from "../components/TablaAdmin";

function AdminPage() {
    const navigate = useNavigate()

    const usuarios = [
        {
          id: 1,
          nombre: "Isabella Stanley",
          email: "ejemplo@usuario.com",
          rol: "Usuario",
          ultimoAcceso: "25/01/2025"
        },
        {
          id: 2,
          nombre: "Jose Blake",
          email: "ejemplo@admin.com",
          rol: "Administrador",
          ultimoAcceso: "21/01/2025"
        }
      ]
      

    return <div className="bg-[url('/img/azul.png')] bg-cover min-h-screen bg-center">
        <NavBarAdmin />
        <div className="justify-self-center">
            <div className="px-6 py-6">
                <h1 className="ml-6 object-left text-3xl text-white font-semibold">Usuarios</h1>
                <div className="ml-4 flex gap-4 mt-4">
                    <button type="button" className="shadow-xl bg-[#297383] rounded-2xl w-64 py-2 text-white hover:bg-[#5a9ca4] transition"
                    onClick={function() {navigate("/crearUsuario")}}>Añadir Usuario</button>
                </div>
                <FiltradoAdmin />
                <TablaAdmin usuarios={usuarios}/>
            </div>
        </div>
    </div>
}

export default AdminPage;