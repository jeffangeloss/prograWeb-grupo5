import NavBarAdmin from "../components/NavBarAdmin"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import UserCard from "../components/UserCard"
import FilterHistorial from "../components/FilterHistorial"
import TablaHistorial from "../components/TablaHistorial"
import { normalizeRoleValue, roleLabel } from "../utils/roles"
import params from "../params"

const PAGE_SIZE_OPTIONS = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "all", label: "Todos" },
]

function SeguridadUsuarioPage() {
    const { state: usuario } = useLocation()
    const [accion, setAccion] = useState("TODAS")
    const [logs, setLogs] = useState([])
    const [usuarioApi, setUsuarioApi] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [errorApi, setErrorApi] = useState("")
    const [pageSize, setPageSize] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    const roleValue = normalizeRoleValue(
        usuarioApi?.role_value || usuarioApi?.role || usuarioApi?.rol || usuario?.role || usuario?.rol,
        usuarioApi?.type || usuario?.type
    )
    const avatarFallback = roleValue === "user"
        ? "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
        : "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-2_mtutkd.png"
    const label = roleLabel(roleValue)

    const usuarioCard = usuarioApi || usuario || { nombre: "-", email: "-" }
    const img = useMemo(function () {
        const rawAvatar = (usuarioCard?.avatar_url || "").trim()
        if (!rawAvatar) {
            return avatarFallback
        }

        const secureAvatar = rawAvatar.startsWith("http://")
            ? `https://${rawAvatar.slice(7)}`
            : rawAvatar

        if (secureAvatar.startsWith("data:image")) {
            return secureAvatar
        }

        // Force refresh when avatar was updated to avoid stale cached image in admin/audit views.
        const avatarVersion = usuarioCard?.updated_at
            ? encodeURIComponent(String(usuarioCard.updated_at))
            : Date.now()
        return `${secureAvatar}${secureAvatar.includes("?") ? "&" : "?"}v=${avatarVersion}`
    }, [avatarFallback, usuarioCard?.avatar_url, usuarioCard?.updated_at])

    function parseNavegador(webAgent) {
        const ua = (webAgent || "").toLowerCase().trim()
        if (!ua) return "Desconocido"
        if (ua === "brave" || ua.includes("brave")) return "Brave"
        if (ua === "edge" || ua.includes("edg/")) return "Edge"
        if (ua === "opera" || ua.includes("opr/") || ua.includes("opera")) return "Opera"
        if (ua === "firefox" || ua.includes("firefox")) return "Firefox"
        if (ua === "safari" || (ua.includes("safari") && !ua.includes("chrome"))) return "Safari"
        if (ua === "chrome" || ua.includes("chrome")) return "Chrome"
        return "Desconocido"
    }

    function getTokenAdmin() {
        const tokenLegacy = localStorage.getItem("TOKEN")
        if (tokenLegacy) {
            return tokenLegacy
        }

        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            const login = raw ? JSON.parse(raw) : null
            return login?.token || ""
        } catch {
            return ""
        }
    }

    async function cargarAuditoria() {
        if (!usuario?.id) {
            setErrorApi("No se encontro el usuario a auditar. Vuelve al dashboard.")
            return
        }

        const token = getTokenAdmin()
        setCargando(true)
        setErrorApi("")

        try {
            const resp = await fetch(`${params.BACKEND_URL}/admin/auditoria/usuario/${usuario.id}`, {
                method: "GET",
                headers: {
                    "x-token": token,
                },
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setLogs([])
                setErrorApi(data?.detail?.msg || data?.detail || "No se pudo cargar la auditoria")
                return
            }

            setUsuarioApi(data.user || null)
            const logsAdaptados = Array.isArray(data.data)
                ? data.data.map(function (log) {
                    return {
                        navegador: parseNavegador(log.web_agent),
                        fecha: log.fecha || "-",
                        hora: log.hora || "-",
                        accion: log.accion || "DESCONOCIDA",
                    }
                })
                : []

            setLogs(logsAdaptados)
        } catch {
            setLogs([])
            setErrorApi("No se pudo conectar con el backend")
        } finally {
            setCargando(false)
        }
    }

    function aplicarFiltro(accionSeleccionada) {
        setAccion(accionSeleccionada)
    }

    const logsFiltrados = useMemo(
        function () {
            if (accion === "TODAS") return logs
            return logs.filter(function (l) {
                return l.accion === accion
            })
        },
        [accion, logs]
    )

    const pageSizeNumber = useMemo(function () {
        if (pageSize === "all") {
            return Math.max(logsFiltrados.length, 1)
        }
        const parsed = Number(pageSize)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 10
    }, [pageSize, logsFiltrados.length])

    const totalPaginas = useMemo(function () {
        if (pageSize === "all") {
            return 1
        }
        return Math.max(1, Math.ceil(logsFiltrados.length / pageSizeNumber))
    }, [logsFiltrados.length, pageSize, pageSizeNumber])

    const logsPaginados = useMemo(function () {
        if (pageSize === "all") {
            return logsFiltrados
        }
        const inicio = (currentPage - 1) * pageSizeNumber
        return logsFiltrados.slice(inicio, inicio + pageSizeNumber)
    }, [logsFiltrados, pageSize, currentPage, pageSizeNumber])

    const resumenPaginacion = useMemo(function () {
        if (logsFiltrados.length === 0) {
            return "0 de 0"
        }

        if (pageSize === "all") {
            return `1-${logsFiltrados.length} de ${logsFiltrados.length}`
        }

        const inicio = (currentPage - 1) * pageSizeNumber + 1
        const fin = Math.min(currentPage * pageSizeNumber, logsFiltrados.length)
        return `${inicio}-${fin} de ${logsFiltrados.length}`
    }, [logsFiltrados.length, pageSize, currentPage, pageSizeNumber])

    useEffect(function () {
        cargarAuditoria()
    }, [])

    useEffect(function () {
        setCurrentPage(1)
    }, [pageSize, accion])

    useEffect(function () {
        if (currentPage > totalPaginas) {
            setCurrentPage(totalPaginas)
        }
    }, [currentPage, totalPaginas])

    function logout() {
        localStorage.clear()
        navigate("/")
    }

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
        <div className="bg-slate-50 text-slate-800 min-h-screen">
            <NavBarAdmin onLogout={logout} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        type="button"
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={function () {
                            navigate("/admin")
                        }}
                    >
                        <span aria-hidden="true">←</span>
                        Volver al dashboard
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">Historial de acceso</h2>
                    <p className="text-sm text-slate-500 mt-1">Auditar accesos de un usuario especifico.</p>

                    <UserCard usuario={usuarioCard} imgSrc={img} label={label} role={roleValue} />
                    <FilterHistorial onFiltro={aplicarFiltro} />

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                            {logsFiltrados.length} {logsFiltrados.length === 1 ? "registro" : "registros"}
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

                    {cargando && <p className="mt-4 text-sm text-slate-500">Cargando auditoria...</p>}
                    {errorApi && (
                        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorApi}
                        </p>
                    )}

                    <TablaHistorial logs={logsPaginados} totalLogs={logsFiltrados.length} />

                    {!cargando && logsFiltrados.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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
                </div>
            </div>
        </div>
    )
}

export default SeguridadUsuarioPage
