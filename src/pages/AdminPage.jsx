import { useNavigate } from "react-router-dom";
import FiltradoAdmin from "../components/FiltradoAdmin";
import NavBarAdmin from "../components/NavBarAdmin";
import TablaAdmin from "../components/TablaAdmin";
import { useEffect, useState } from "react";

function AdminPage() {
    const navigate = useNavigate()

    const [rolSeleccionado, setRolSeleccionado] = useState("")
    const [listaUsuarios, setListaUsuarios] = useState([])

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

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    useEffect(function () {
        setListaUsuarios(usuarios)
    }, [])


    function filtradoAdmin(rol) {
        setRolSeleccionado(rol)

        const listaUsuariosFiltrada = usuarios.map(function (usuario) {
            if (rol == "") {
                return usuario
            }
            else if (usuario.rol == rol) {
                return usuario
            }
            else {
                return null
            }
        })
        setListaUsuarios(listaUsuariosFiltrada)
    }


    return <div className="bg-slate-50 min-h-screen">
        <NavBarAdmin onLogout={logout} />
        <div className="grid grid-cols-1 md:flex md:justify-center">
            <div className="px-6 py-6">
                <h1 className="ml-6 object-left text-3xl font-semibold">Usuarios</h1>
                <div className="ml-4 flex gap-4 mt-4">
                    <button type="button" className="w-64 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onClick={function () { navigate("/crearUsuario") }}>Añadir Usuario</button>
                </div>
                <FiltradoAdmin rolSeleccionado={rolSeleccionado} onFiltro={filtradoAdmin} />
                <TablaAdmin usuarios={listaUsuarios} />
            </div>
        </div>
    </div>
}

export default AdminPage;