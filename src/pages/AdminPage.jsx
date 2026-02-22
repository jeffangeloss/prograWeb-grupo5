import { useNavigate } from "react-router-dom";
import FiltradoAdmin from "../components/FiltradoAdmin";
import NavBarAdmin from "../components/NavBarAdmin";
import TablaAdmin from "../components/TablaAdmin";
import PopUp_BorrarUsuario from "../components/PopUp_BorrarUsuarioConfirm";
import { useEffect, useState } from "react";

function AdminPage() {
    const navigate = useNavigate()

    const [rolSeleccionado, setRolSeleccionado] = useState("")
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    async function cargarListaUsuarios(rol) {
        let filtroRol = ""
        if (rol == "1") filtroRol = "user_type=1"
        if (rol == "2") filtroRol = "user_type=2"

        const URL = "http://127.0.0.1:8000/admin/?" + filtroRol
        const resp = await fetch(URL,
            {
                method: "GET",
                headers: {
                    "x-token": localStorage.getItem("TOKEN")
                }
            }
        )

        const data = await resp.json()

        if (!resp.ok) {
            console.error("Error al obtener usuarios", data.detail)
            if (resp.status == 403) {
                logout()
            }
        }
        setListaUsuarios(data.data)
    }

    function handleOpenModal(usuario) {
        setUsuarioSeleccionado(usuario);
        setModalVisible(true);
    }

    async function borrarUsuario() {
        const URL = `http://127.0.0.1:8000/admin/${usuarioSeleccionado.id}/`
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-token": localStorage.getItem("TOKEN")
            }
        })

        const data = await response.json()

        if (!response.ok) {
            alert("Error al borrar: " + data.detail)
            return
        }
        setModalVisible(false)
        cargarListaUsuarios()
    }

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    useEffect(function () {
        cargarListaUsuarios()
    }, [])


    function onFiltro(rol) {
        setRolSeleccionado(rol)
        cargarListaUsuarios(rol)
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
                <FiltradoAdmin rolSeleccionado={rolSeleccionado} onFiltro={onFiltro} />
                <TablaAdmin usuarios={listaUsuarios} borrarUsuario={handleOpenModal} />
                <PopUp_BorrarUsuario visible={modalVisible} userName={usuarioSeleccionado?.full_name} onCancel={function() {setModalVisible(false)}} onConfirm={borrarUsuario} />
            </div>
        </div>
    </div>
}

export default AdminPage;