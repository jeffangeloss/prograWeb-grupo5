import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import NavBarUser from "../components/NavBarUser"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import { clearAuthData, hasActiveSession } from "../utils/auth"
import params from "../params"

const API_URL = params.BACKEND_URL

function EditarEgresoPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const egresoDesdeEstado = location.state?.egreso || null
    const [egreso, setEgreso] = useState(egresoDesdeEstado)
    const [monto, setMonto] = useState("")
    const [fecha, setFecha] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    function obtenerSesion() {
        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function obtenerToken() {
        const sesion = obtenerSesion()
        return sesion?.token || ""
    }

    function logout() {
        clearAuthData()
        navigate("/")
    }

    useEffect(function () {
        if (!hasActiveSession()) {
            navigate("/sesion")
            return
        }

        const sesion = obtenerSesion()
        const role = normalizeRoleValue(sesion?.rol)

        if (isAdminPanelRole(role)) {
            navigate("/admin")
            return
        }

        if (role !== "user") {
            navigate("/sesion")
            return
        }

        if (egresoDesdeEstado) {
            localStorage.setItem("EGRESO_EDITAR", JSON.stringify(egresoDesdeEstado))
            setEgreso(egresoDesdeEstado)
            return
        }

        try {
            const raw = localStorage.getItem("EGRESO_EDITAR")
            const fallback = raw ? JSON.parse(raw) : null
            if (fallback?.id) {
                setEgreso(fallback)
            }
        } catch {
            setEgreso(null)
        }
    }, [navigate, egresoDesdeEstado])

    useEffect(function () {
        if (!egreso) {
            return
        }

        setMonto(String(egreso.amount ?? ""))
        setDescripcion(egreso.description || "")

        const fechaRaw = String(egreso.expense_date || "")
        setFecha(fechaRaw.slice(0, 10))
    }, [egreso])

    const categoriaNombre = useMemo(function () {
        return egreso?.category_name || "-"
    }, [egreso])

    async function guardarCambios(ev) {
        ev.preventDefault()
        setError("")

        if (!egreso?.id) {
            setError("No se encontro el egreso a editar.")
            return
        }

        if (!monto || !fecha || !descripcion.trim()) {
            setError("Completa monto, fecha y descripcion.")
            return
        }

        const token = obtenerToken()
        if (!token) {
            clearAuthData()
            navigate("/sesion")
            setError("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        const payload = {
            amount: Number(monto),
            expense_date: `${fecha}T00:00:00`,
            description: descripcion.trim(),
        }

        if (egreso.category_id) {
            payload.category_id = egreso.category_id
        }

        setGuardando(true)
        try {
            const resp = await fetch(`${API_URL}/expenses/${egreso.id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                if (resp.status === 401 || resp.status === 403) {
                    clearAuthData()
                    navigate("/sesion")
                    return
                }
                setError(data.detail || "No se pudo actualizar el egreso.")
                return
            }

            localStorage.removeItem("EGRESO_EDITAR")
            navigate("/user", { replace: true })
        } catch {
            setError("No se pudo conectar con el backend.")
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen">
            <NavBarUser onLogout={logout} />

            <main className="w-full px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
                <div className="mx-auto w-full max-w-[900px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700">Editar egreso</h1>
                        <p className="mt-1 text-sm text-slate-500">Actualiza la informacion del egreso seleccionado.</p>

                        {!egreso ? (
                            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                                No se encontro un egreso seleccionado para editar.
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={function () {
                                            navigate("/user")
                                        }}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        Volver a mis egresos
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={guardarCambios} className="mt-6 grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Monto</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={monto}
                                        onChange={function (ev) {
                                            setMonto(ev.target.value)
                                        }}
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Categoria</label>
                                    <input
                                        type="text"
                                        value={categoriaNombre}
                                        readOnly
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Fecha</label>
                                    <input
                                        type="date"
                                        value={fecha}
                                        onChange={function (ev) {
                                            setFecha(ev.target.value)
                                        }}
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Descripcion</label>
                                    <textarea
                                        rows={4}
                                        value={descripcion}
                                        onChange={function (ev) {
                                            setDescripcion(ev.target.value)
                                        }}
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm font-medium text-rose-600">{error}</p>
                                )}

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        className="rounded-full px-6 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                                        onClick={function () {
                                            navigate("/user")
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={guardando}
                                        className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {guardando ? "Guardando..." : "Guardar cambios"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default EditarEgresoPage
