import { useNavigate } from "react-router-dom"
import FiltradoAdmin from "../components/FiltradoAdmin"
import NavBarAdmin from "../components/NavBarAdmin"
import TablaAdmin from "../components/TablaAdmin"
import PopUp_BorrarUsuario from "../components/PopUp_BorrarUsuarioConfirm"
import { useEffect, useMemo, useState } from "react"
import { toast, Toaster } from "sonner";
import {
    canManageUsers,
    isAdminPanelRole,
    normalizeRoleValue,
    roleLabel,
} from "../utils/roles"

function getSesion() {
    try {
        const raw = localStorage.getItem("DATOS_LOGIN")
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function getToken() {
    const tokenLegacy = localStorage.getItem("TOKEN")
    if (tokenLegacy) return tokenLegacy
    return getSesion()?.token || ""
}

function extractError(data) {
    if (typeof data?.detail === "string") return data.detail
    if (typeof data?.detail?.msg === "string") return data.detail.msg
    return "Error inesperado en la petición."
}

function normalizarUsuarioApi(item, currentUserId) {
    const role = normalizeRoleValue(item?.role_value || item?.role || item?.rol, item?.type)
    const id = item?.id || ""

    return {
        id,
        full_name: item?.nombre || item?.name || item?.full_name || "-",
        email: item?.email || "-",
        role,
        role_label: roleLabel(role),
        type: item?.type || 1,
        ultimoAcceso: item?.ultimoAcceso || "-",
        isSelf: Boolean(currentUserId && id && currentUserId === id),
    }
}

function AdminPage() {
    const navigate = useNavigate()
    const sesion = useMemo(function () {
        return getSesion()
    }, [])
    const actorRole = normalizeRoleValue(sesion?.rol || "user")
    const actorId = sesion?.id || ""
    const puedeGestionar = canManageUsers(actorRole)
    const puedeVerAuditoriaAdmin = actorRole === "owner" || actorRole === "auditor"

    const [rolSeleccionado, setRolSeleccionado] = useState("")
    const [textoBusqueda, setTextoBusqueda] = useState("")
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [cargando, setCargando] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const [modalVisible, setModalVisible] = useState(false)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    async function cargarListaUsuarios(rol) {
        if (!isAdminPanelRole(actorRole)) {
            navigate("/user")
            return
        }

        const token = getToken()
        if (!token) {
            logout()
            return
        }

        setCargando(true)
        setErrorApi("")

        let filtroRol = ""
        if (rol === "1") filtroRol = "user_type=1"
        if (rol === "2") filtroRol = "user_type=2"
        if (rol === "3") filtroRol = "user_type=3"
        if (rol === "4") filtroRol = "user_type=4"

        const URL = `http://127.0.0.1:8000/admin/${filtroRol ? `?${filtroRol}` : ""}`
        try {
            const resp = await fetch(URL, {
                method: "GET",
                headers: {
                    "x-token": token,
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setListaUsuarios([])
                setErrorApi(extractError(data))
                if (resp.status === 401 || resp.status === 403) {
                    logout()
                }
                return
            }

            const normalizados = Array.isArray(data?.data)
                ? data.data.map(function (item) {
                    return normalizarUsuarioApi(item, actorId)
                })
                : []

            setListaUsuarios(normalizados)
        } catch (error) {
            setListaUsuarios([])
            setErrorApi(error?.message ? `Error de conexión: ${error.message}` : "No se pudo conectar con el backend.")
        } finally {
            setCargando(false)
        }
    }

    function handleOpenModal(usuario) {
        setUsuarioSeleccionado(usuario)
        setModalVisible(true)
    }

    async function borrarUsuario() {
        if (!usuarioSeleccionado?.id) {
            return
        }
        const token = getToken()
        if (!token) {
            logout()
            return
        }

        const URL = `http://127.0.0.1:8000/admin/${usuarioSeleccionado.id}`
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "x-token": token,
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json().catch(function () {
            return {}
        })

        if (!response.ok) {
            setErrorApi(extractError(data))
            return
        }
        setModalVisible(false)
        setUsuarioSeleccionado(null)
        toast.success("Usuario borrado con éxito")
        cargarListaUsuarios(rolSeleccionado)
    }

    useEffect(function () {
        if (!isAdminPanelRole(actorRole)) {
            navigate("/user")
            return
        }
        cargarListaUsuarios("")
    }, [])

    function onFiltro(rol) {
        setRolSeleccionado(rol)
        cargarListaUsuarios(rol)
    }

    const usuariosFiltrados = listaUsuarios.filter(function (u) {
        if (!textoBusqueda.trim()) return true
        const q = textoBusqueda.trim().toLowerCase()
        return (
            (u.full_name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.role_label || "").toLowerCase().includes(q)
        )
    })

    return (
        <div className="bg-slate-50 min-h-screen">
            <Toaster position="bottom-right" richColors closeButton />
            <NavBarAdmin onLogout={logout} />
            <div className="grid grid-cols-1 md:flex md:justify-center">
                <div className="px-6 py-6 w-full max-w-7xl">
                    <div className="ml-6 flex flex-wrap items-center justify-between gap-3">
                        <h1 className="object-left text-3xl font-semibold">Usuarios</h1>
                        {puedeVerAuditoriaAdmin && (
                            <button
                                type="button"
                                className="rounded-full border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                                onClick={function () { navigate("/auditoriaAdmin") }}
                            >
                                Ver auditoría admin
                            </button>
                        )}
                    </div>

                    {puedeGestionar && (
                        <div className="ml-4 flex gap-4 mt-4">
                            <button
                                type="button"
                                className="w-64 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                onClick={function () { navigate("/crearUsuario") }}
                            >
                                Añadir usuario
                            </button>
                        </div>
                    )}

                    <FiltradoAdmin
                        rolSeleccionado={rolSeleccionado}
                        onFiltro={onFiltro}
                        textoBusqueda={textoBusqueda}
                        onBuscar={setTextoBusqueda}
                    />

                    {cargando && (
                        <p className="mt-5 ml-4 text-sm text-slate-500">Cargando usuarios...</p>
                    )}

                    {errorApi && (
                        <p className="mt-5 ml-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorApi}
                        </p>
                    )}

                    <TablaAdmin usuarios={usuariosFiltrados} borrarUsuario={handleOpenModal} actorRole={actorRole} />
                    <PopUp_BorrarUsuario
                        visible={modalVisible}
                        userName={usuarioSeleccionado?.full_name}
                        onCancel={function () { setModalVisible(false) }}
                        onConfirm={borrarUsuario}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminPage
