import { useEffect, useMemo, useState } from "react"
import EgresosForm from "../components/EgresosForm"
import NavBarUser from "../components/NavBarUser"
import { useNavigate } from "react-router-dom"
import FiltroPopUp from "../components/FiltroPopUp"
import EditarEgresoModal from "../components/EditarEgresoModal"

const API_URL = "http://127.0.0.1:8000"

function EgresosPage() {
    const navigate = useNavigate()
    const [openCrear, setOpenCrear] = useState(false)
    const [openFiltro, setOpenFiltro] = useState(false)
    const [egresos, setEgresos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [errorApi, setErrorApi] = useState("")
    const [openEditar, setOpenEditar] = useState(false)
    const [egresoSeleccionado, setEgresoSeleccionado] = useState(null)

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
        localStorage.clear()
        navigate("/")
    }

    function formatearFecha(isoDate) {
        const parsed = new Date(isoDate)
        if (Number.isNaN(parsed.getTime())) {
            return "-"
        }
        return parsed.toLocaleDateString("es-PE")
    }

    function formatearMonto(value) {
        const monto = Number(value)
        if (!Number.isFinite(monto)) {
            return "S/ 0.00"
        }
        return `S/ ${monto.toFixed(2)}`
    }

    const totalRegistrado = useMemo(function () {
        return egresos.reduce(function (acc, item) {
            return acc + Number(item.amount || 0)
        }, 0)
    }, [egresos])

    async function cargarEgresos() {
        const token = obtenerToken()
        if (!token) {
            setCargando(false)
            setEgresos([])
            setErrorApi("No hay sesion activa. Inicia sesion nuevamente.")
            return
        }

        setCargando(true)
        setErrorApi("")

        try {
            const resp = await fetch(`${API_URL}/expenses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setEgresos([])
                setErrorApi(data.detail || "No se pudieron cargar los egresos")
                return
            }

            setEgresos(Array.isArray(data.data) ? data.data : [])
        } catch {
            setEgresos([])
            setErrorApi("No se pudo conectar con el backend")
        } finally {
            setCargando(false)
        }
    }

    useEffect(function () {
        cargarEgresos()
    }, [])

    async function handleCrearEgreso(fecha, monto, categoria, descripcion) {
        const token = obtenerToken()
        if (!token) {
            return {
                ok: false,
                error: "Sesion expirada. Inicia sesion nuevamente.",
            }
        }

        try {
            const resp = await fetch(`${API_URL}/expenses`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: Number(monto),
                    expense_date: fecha,
                    category_name: categoria,
                    description: descripcion,
                }),
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                return {
                    ok: false,
                    error: data.detail || "No se pudo registrar el egreso",
                }
            }

            setOpenCrear(false)
            await cargarEgresos()
            return { ok: true }
        } catch {
            return {
                ok: false,
                error: "No se pudo conectar con el backend",
            }
        }
    }

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen">
            <NavBarUser onLogout={logout} />

            <main className="w-full px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
                <div className="w-full max-w-[1280px] mx-auto">
                    <section className="bg-slate-100/90 border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight text-slate-700">MIS EGRESOS</h2>
                                <p className="text-sm text-slate-500">Total registrado: {formatearMonto(totalRegistrado)}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0 relative">
                                <button
                                    type="button"
                                    onClick={function () {
                                        setOpenCrear(true)
                                    }}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                >
                                    <span className="text-lg leading-none">+</span>
                                    <span>Crear egreso</span>
                                </button>

                                {/* boton estadistica usuario */}
                                <button
                                    onClick={function () {
                                        navigate("/GraficosUsuario")
                                    }}
                                    className="peer focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:bg-slate-200 rounded-md p-0.5"
                                    type="button"
                                >
                                    <img
                                        className="w-7"
                                        src="https://cdn-icons-png.freepik.com/512/5952/5952983.png"
                                        alt="Estadisticas"
                                    />
                                </button>

                                {/* boton filtros */}
                                <button
                                    onClick={function () {
                                        setOpenFiltro(true)
                                    }}
                                    className="relative peer focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:bg-slate-200 rounded-md p-0.5"
                                    type="button"
                                >
                                    <img
                                        className="w-7"
                                        src="https://cdn-icons-png.flaticon.com/256/11462/11462900.png"
                                        alt="Filtro"
                                    />
                                </button>

                                <FiltroPopUp
                                    visible={openFiltro}
                                    onClose={function () {
                                        setOpenFiltro(false)
                                    }}
                                />

                                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {egresos.length} {egresos.length === 1 ? "registro" : "registros"}
                                </span>
                            </div>
                        </div>

                        {errorApi && (
                            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {errorApi}
                            </p>
                        )}

                        <div className="mt-5 rounded-xl border border-slate-200 bg-white overflow-x-auto">
                            <table className="w-full min-w-[860px] table-fixed text-left text-base text-slate-700">
                                <thead className="border-b border-slate-200/80 bg-slate-50 text-[13px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-5">Fecha</th>
                                        <th className="px-4 py-5">Categoria</th>
                                        <th className="px-4 py-5">Descripcion</th>
                                        <th className="px-4 py-5 text-right">Monto</th>
                                        <th className="px-4 py-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargando ? (
                                        <tr className="border-b border-slate-100">
                                            <td className="px-4 py-5 text-slate-500" colSpan={5}>
                                                Cargando egresos...
                                            </td>
                                        </tr>
                                    ) : egresos.length === 0 ? (
                                        <tr className="border-b border-slate-100">
                                            <td className="px-4 py-5 text-slate-500" colSpan={5}>
                                                Aun no tienes egresos registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        egresos.map(function (egreso) {
                                            return (
                                                <tr key={egreso.id} className="border-b border-slate-100">
                                                    <td className="px-4 py-5">{formatearFecha(egreso.expense_date)}</td>
                                                    <td className="px-4 py-5">{egreso.category_name || "-"}</td>
                                                    <td className="px-4 py-5">{egreso.description || "-"}</td>
                                                    <td className="px-4 py-5 text-right font-semibold">{formatearMonto(egreso.amount)}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                                                                onClick={function () {
                                                                    setEgresoSeleccionado(egreso)
                                                                    setOpenEditar(true)
                                                                }}
                                                            >
                                                                Editar egreso
                                                            </button>

                                                            <button
                                                                type="button"
                                                                aria-label="Eliminar egreso"
                                                                className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition"
                                                            >
                                                                <img src="/img/trashbin.png" alt="Eliminar" className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>

            {openCrear && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0"
                        onClick={function () {
                            setOpenCrear(false)
                        }}
                    />

                    <section className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
                        <button
                            type="button"
                            aria-label="Cerrar"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                            onClick={function () {
                                setOpenCrear(false)
                            }}
                        >
                            X
                        </button>

                        <div className="space-y-1 pr-10">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Nuevo egreso</h2>
                            <p className="text-sm text-slate-500">Completa los datos para registrar tu gasto.</p>
                        </div>

                        <EgresosForm onComplete={handleCrearEgreso} />
                    </section>
                </div>
            )}

            <button
                type="button"
                className="fixed bottom-4 left-4 z-50 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700"
                onClick={function () {
                    navigate("/chatbot")
                }}
            >
                Prueba Chatbot
            </button>

            {openEditar && (
                <EditarEgresoModal
                    egreso={egresoSeleccionado}
                    onClose={function () {
                        setOpenEditar(false)
                        setEgresoSeleccionado(null)
                    }}
                />
            )}
        </div>
    )
}

export default EgresosPage
