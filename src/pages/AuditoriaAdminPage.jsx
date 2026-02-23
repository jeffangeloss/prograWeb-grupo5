import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBarAdmin from "../components/NavBarAdmin"
import { normalizeRoleValue } from "../utils/roles"

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
    return "No se pudo cargar la auditoría administrativa."
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

        const params = new URLSearchParams()
        params.set("limit", "200")
        if (accion !== "TODAS") {
            params.set("action", accion)
        }

        try {
            const resp = await fetch(`http://127.0.0.1:8000/admin/auditoria/admin?${params.toString()}`, {
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

    useEffect(function () {
        if (role !== "owner" && role !== "auditor") {
            navigate("/admin")
            return
        }
        cargarAuditoriaAdmin()
    }, [])

    return (
        <div className="bg-slate-50 text-slate-800 min-h-screen">
            <NavBarAdmin onLogout={logout} />

            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Auditoría administrativa</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Seguimiento de acciones críticas sobre cuentas y roles.
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
                            <label className="text-xs font-semibold uppercase text-slate-500">Acción</label>
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

                    {cargando && <p className="mt-4 text-sm text-slate-500">Cargando auditoría administrativa...</p>}
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
                                        <th className="px-4 py-3">Acción</th>
                                        <th className="px-4 py-3">Actor</th>
                                        <th className="px-4 py-3">Target</th>
                                        <th className="px-4 py-3">Detalle</th>
                                        <th className="px-4 py-3">IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(function (log) {
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
                </div>
            </main>
        </div>
    )
}

export default AuditoriaAdminPage
