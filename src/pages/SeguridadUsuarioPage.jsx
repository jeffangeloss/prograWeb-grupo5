import NavBarAdmin from "../components/NavBarAdmin"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import UserCard from "../components/UserCard"
import FilterHistorial from "../components/FilterHistorial"
import TablaHistorial from "../components/TablaHistorial"

function SeguridadUsuarioPage() {
    const { state: usuario } = useLocation()
    const [accion, setAccion] = useState("TODAS")
    const [logs, setLogs] = useState([])
    const [usuarioApi, setUsuarioApi] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [errorApi, setErrorApi] = useState("")
    const navigate = useNavigate()

    const rol = usuarioApi?.rol || usuario?.rol || "Usuario"
    const img = rol === "Administrador" ? "/img/admin.jpg" : "/img/user.jpg"
    const label = rol === "Administrador" ? "Administrador" : "Usuario"

    const usuarioCard = usuarioApi || usuario || { nombre: "-", email: "-" }

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
            const resp = await fetch(`http://127.0.0.1:8000/admin/auditoria/${usuario.id}`, {
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

    useEffect(function () {
        cargarAuditoria()
    }, [])

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    return (
        <div className="bg-slate-50 text-slate-800 min-h-screen">
            <NavBarAdmin onLogout={logout} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800">Historial de acceso</h2>
                    <p className="text-sm text-slate-500 mt-1">Auditar accesos de un usuario especifico.</p>

                    <UserCard usuario={usuarioCard} imgSrc={img} label={label} />
                    <FilterHistorial onFiltro={aplicarFiltro} />

                    {cargando && <p className="mt-4 text-sm text-slate-500">Cargando auditoria...</p>}
                    {errorApi && (
                        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorApi}
                        </p>
                    )}

                    <TablaHistorial logs={logsFiltrados} />
                </div>
            </div>
        </div>
    )
}

export default SeguridadUsuarioPage
