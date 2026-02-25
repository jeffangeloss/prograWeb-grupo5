import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBarAdmin from "../components/NavBarAdmin"
import { normalizeRoleValue } from "../utils/roles"
import params from "../params"

const PAGE_SIZE_OPTIONS = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "all", label: "Todos" },
]

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
    return "No se pudo cargar la auditoria administrativa."
}

function AuditoriaAdminPage() {
    const navigate = useNavigate()
    const sesion = useMemo(function () {
        return getSesion()
    }, [])
    const role = normalizeRoleValue(sesion?.rol || "user")
    const [accion, setAccion] = useState("TODAS")
    const [logs, setLogs] = useState([])
    const [cargando, setCargando] = useState(false)
    const [errorApi, setErrorApi] = useState("")
    const [pageSize, setPageSize] = useState("10")
    const [currentPage, setCurrentPage] = useState(1)

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    async function cargarAuditoriaAdmin() {
        const token = getToken()
        if (!token) {
            logout()
            return
        }

        setCargando(true)
        setErrorApi("")

        const queryParams = new URLSearchParams()
        queryParams.set("limit", "200")
        if (accion !== "TODAS") {
            queryParams.set("action", accion)
        }

        try {
            const resp = await fetch(`${params.BACKEND_URL}/admin/auditoria/admin?${queryParams.toString()}`, {
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
                setErrorApi(extractError(data))
                if (resp.status === 401 || resp.status === 403) {
                    navigate("/admin")
                }
                return
            }

            setLogs(Array.isArray(data?.data) ? data.data : [])
        } catch {
            setLogs([])
            setErrorApi("No se pudo conectar con el backend.")
        } finally {
            setCargando(false)
        }
    }

    const pageSizeNumber = useMemo(function () {
        if (pageSize === "all") {
            return Math.max(logs.length, 1)
        }
        const parsed = Number(pageSize)
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 10
    }, [pageSize, logs.length])

    const totalPaginas = useMemo(function () {
        if (pageSize === "all") {
            return 1
        }
        return Math.max(1, Math.ceil(logs.length / pageSizeNumber))
    }, [logs.length, pageSize, pageSizeNumber])

    const logsPaginados = useMemo(function () {
        if (pageSize === "all") {
            return logs
        }
        const inicio = (currentPage - 1) * pageSizeNumber
        return logs.slice(inicio, inicio + pageSizeNumber)
    }, [logs, pageSize, currentPage, pageSizeNumber])

    const resumenPaginacion = useMemo(function () {
        if (logs.length === 0) {
            return "0 de 0"
        }

        if (pageSize === "all") {
            return `1-${logs.length} de ${logs.length}`
        }

        const inicio = (currentPage - 1) * pageSizeNumber + 1
        const fin = Math.min(currentPage * pageSizeNumber, logs.length)
        return `${inicio}-${fin} de ${logs.length}`
    }, [logs.length, pageSize, currentPage, pageSizeNumber])

    useEffect(function () {
        if (role !== "owner" && role !== "auditor") {
            navigate("/admin")
            return
        }
        cargarAuditoriaAdmin()
    }, [])

    useEffect(function () {
        setCurrentPage(1)
    }, [pageSize, accion, logs.length])

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
        <div className="bg-slate-50 text-slate-800 min-h-screen dark:bg-slate-950 dark:text-slate-100">
            <NavBarAdmin onLogout={logout} />

            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Auditoria administrativa</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Seguimiento de acciones criticas sobre cuentas y roles.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                            onClick={function () { navigate("/admin") }}
                        >
                            Volver al dashboard
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto] items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">Accion</label>
                            <select
                                value={accion}
                                onChange={function (ev) { setAccion(ev.target.value) }}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="TODAS">TODAS</option>
                                <option value="USER_CREATE">USER_CREATE</option>
                                <option value="USER_UPDATE">USER_UPDATE</option>
                                <option value="USER_DELETE">USER_DELETE</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                            onClick={cargarAuditoriaAdmin}
                        >
                            Actualizar
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                            {logs.length} {logs.length === 1 ? "registro" : "registros"}
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

                    {cargando && <p className="mt-4 text-sm text-slate-500">Cargando auditoria administrativa...</p>}
                    {errorApi && (
                        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorApi}
                        </p>
                    )}

                    <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <table className="min-w-max md:min-w-full w-full text-left text-sm text-slate-700">
                                <thead className="border-b border-slate-200/80 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3">Hora</th>
                                        <th className="px-4 py-3">Accion</th>
                                        <th className="px-4 py-3">Actor</th>
                                        <th className="px-4 py-3">Target</th>
                                        <th className="px-4 py-3">Detalle</th>
                                        <th className="px-4 py-3">IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsPaginados.map(function (log) {
                                        return (
                                            <tr key={log.id} className="border-b border-slate-100">
                                                <td className="px-4 py-3">{log.fecha || "-"}</td>
                                                <td className="px-4 py-3">{log.hora || "-"}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                        {log.accion || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-700">{log?.actor?.nombre || "-"}</p>
                                                    <p className="text-xs text-slate-500">{log?.actor?.email || "-"}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-700">{log?.target?.nombre || "-"}</p>
                                                    <p className="text-xs text-slate-500">{log?.target?.email || "-"}</p>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{log.detalle || "-"}</td>
                                                <td className="px-4 py-3 text-slate-600">{log.ip || "-"}</td>
                                            </tr>
                                        )
                                    })}
                                    {logs.length === 0 && !cargando && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                                                No hay registros para el filtro seleccionado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 text-xs text-slate-500 text-right">
                            Registros: {logs.length}
                        </div>
                    </div>

                    {!cargando && logs.length > 0 && (
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
            </main>
        </div>
    )
}

export default AuditoriaAdminPage
