import { useNavigate } from "react-router-dom"
import FiltradoAdmin from "../components/FiltradoAdmin"
import NavBarAdmin from "../components/NavBarAdmin"
import TablaAdmin from "../components/TablaAdmin"
import PopUp_BorrarUsuario from "../components/PopUp_BorrarUsuarioConfirm"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import params from "../params"
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

const PAGE_SIZE_OPTIONS = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "all", label: "Todos" },
]

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
    const [pageSize, setPageSize] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)

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

        const URL = `${params.API_URL}/admin/${filtroRol ? `?${filtroRol}` : ""}`
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

        const toastId = toast.loading("Eliminando usuario...")

        try {
            const URL = `${params.API_URL}/admin/${usuarioSeleccionado.id}`
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
                toast.error(data, { id: toastId })
                return
            }
            setModalVisible(false)
            setUsuarioSeleccionado(null)
            toast.success("Usuario eliminado correctamente", { id: toastId })
            await cargarListaUsuarios(rolSeleccionado)
        } catch (err) {
            toast.error("No se pudo conectar con el backend", { id: toastId })
        }
    }

    useEffect(function () {
        if (location.state?.mensajeExito) {
            toast.success(location.state.mensajeExito)
            window.history.replaceState({}, document.title)
        }
    })

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

    const pageSizeNumber = useMemo(function () {
        if (pageSize === "all") {
            return Math.max(usuariosFiltrados.length, 1)
        }
        const parsed = Number(pageSize)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 10
    }, [pageSize, usuariosFiltrados.length])

    const totalPaginas = useMemo(function () {
        if (pageSize === "all") {
            return 1
        }
        return Math.max(1, Math.ceil(usuariosFiltrados.length / pageSizeNumber))
    }, [usuariosFiltrados.length, pageSize, pageSizeNumber])

    const usuariosPaginados = useMemo(function () {
        if (pageSize === "all") {
            return usuariosFiltrados
        }
        const inicio = (currentPage - 1) * pageSizeNumber
        return usuariosFiltrados.slice(inicio, inicio + pageSizeNumber)
    }, [usuariosFiltrados, pageSize, currentPage, pageSizeNumber])

    const resumenPaginacion = useMemo(function () {
        if (usuariosFiltrados.length === 0) {
            return "0 de 0"
        }

        if (pageSize === "all") {
            return `1-${usuariosFiltrados.length} de ${usuariosFiltrados.length}`
        }

        const inicio = (currentPage - 1) * pageSizeNumber + 1
        const fin = Math.min(currentPage * pageSizeNumber, usuariosFiltrados.length)
        return `${inicio}-${fin} de ${usuariosFiltrados.length}`
    }, [usuariosFiltrados.length, pageSize, currentPage, pageSizeNumber])

    useEffect(function () {
        setCurrentPage(1)
    }, [pageSize, rolSeleccionado, textoBusqueda])

    useEffect(function () {
        if (currentPage > totalPaginas) {
            setCurrentPage(totalPaginas)
        }
    }, [currentPage, totalPaginas])

    function irPaginaAnterior() {
        setCurrentPage(function (prev) {
            return Math.max(1, prev - 1)
        })
    }

    function irPaginaSiguiente() {
        setCurrentPage(function (prev) {
            return Math.min(totalPaginas, prev + 1)
        })
    }

    return (
        <div className="bg-slate-50 min-h-screen">
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

                    <div className="mt-4 ml-4 mr-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                            {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? "registro" : "registros"}
                        </span>

                        <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                            Mostrar
                            <select
                                value={pageSize}
                                onChange={function (ev) {
                                    setPageSize(ev.target.value)
                                }}
                                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                            >
                                {PAGE_SIZE_OPTIONS.map(function (option) {
                                    return (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    )
                                })}
                            </select>
                        </label>
                    </div>

                    <TablaAdmin
                        usuarios={usuariosPaginados}
                        totalUsuarios={usuariosFiltrados.length}
                        borrarUsuario={handleOpenModal}
                        actorRole={actorRole}
                    />

                    {!cargando && usuariosFiltrados.length > 0 && (
                        <div className="mx-4 mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <p>
                                Mostrando {resumenPaginacion}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={irPaginaAnterior}
                                    disabled={currentPage <= 1 || pageSize === "all"}
                                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Anterior
                                </button>

                                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700">
                                    Pagina {currentPage} de {totalPaginas}
                                </span>

                                <button
                                    type="button"
                                    onClick={irPaginaSiguiente}
                                    disabled={currentPage >= totalPaginas || pageSize === "all"}
                                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

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
