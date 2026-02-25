import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"

import EgresosForm from "../components/EgresosForm"
import FiltroPopUp from "../components/FiltroPopUp"
import NavBarUser from "../components/NavBarUser"
import { clearAuthData, getAuthSession, getAuthToken, hasActiveSession } from "../utils/auth"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import ChatBotPage from "./ChatBotPage"
import params from "../params"

const LOGIN_REDIRECT_DELAY_MS = 1400

const EMPTY_FILTERS = {
    category_id: "",
    date_from: "",
    date_to: "",
    amount_min: "",
    amount_max: "",
}

function EgresosPage() {
    const navigate = useNavigate()

    const [openCrear, setOpenCrear] = useState(false)
    const [openFiltro, setOpenFiltro] = useState(false)
    const [filtroSection, setFiltroSection] = useState("")

    const [egresos, setEgresos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [errorApi, setErrorApi] = useState("")
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [ordenFecha, setOrdenFecha] = useState("desc")
    const [egresoEliminar, setEgresoEliminar] = useState(null)

    const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS)
    const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)

    const [sesionBloqueada, setSesionBloqueada] = useState(false)
    const [mensajeSesion, setMensajeSesion] = useState("Debes iniciar sesion para continuar.")
    const sesionTimerRef = useRef(null)

    const totalRegistrado = useMemo(function () {
        return egresos.reduce(function (acc, item) {
            return acc + Number(item.amount || 0)
        }, 0)
    }, [egresos])

    const filtroActivo = useMemo(function () {
        return Boolean(
            appliedFilters.category_id ||
            appliedFilters.date_from ||
            appliedFilters.date_to ||
            appliedFilters.amount_min !== "" ||
            appliedFilters.amount_max !== ""
        )
    }, [appliedFilters])

    const chipsActivos = useMemo(function () {
        const chips = []

        if (appliedFilters.category_id) {
            const category = categories.find(function (item) {
                return item.id === appliedFilters.category_id
            })
            chips.push(`Categoria: ${category?.name || "seleccionada"}`)
        }

        if (appliedFilters.date_from || appliedFilters.date_to) {
            const from = appliedFilters.date_from || "..."
            const to = appliedFilters.date_to || "..."
            chips.push(`Fecha: ${from} - ${to}`)
        }

        if (appliedFilters.amount_min !== "" || appliedFilters.amount_max !== "") {
            const min = appliedFilters.amount_min !== "" ? Number(appliedFilters.amount_min).toFixed(2) : "0.00"
            const max = appliedFilters.amount_max !== "" ? Number(appliedFilters.amount_max).toFixed(2) : "..."
            chips.push(`Monto: S/ ${min} - ${max}`)
        }

        return chips
    }, [appliedFilters, categories])

    function logout() {
        clearAuthData()
        navigate("/")
    }

    function bloquearSesion(mensaje) {
        if (sesionBloqueada) {
            return
        }

        setMensajeSesion(mensaje || "Sesion invalida. Inicia sesion nuevamente.")
        setSesionBloqueada(true)
        clearAuthData()

        if (sesionTimerRef.current) {
            window.clearTimeout(sesionTimerRef.current)
        }
        sesionTimerRef.current = window.setTimeout(function () {
            navigate("/sesion", { replace: true })
        }, LOGIN_REDIRECT_DELAY_MS)
    }

    useEffect(function () {
        return function () {
            if (sesionTimerRef.current) {
                window.clearTimeout(sesionTimerRef.current)
            }
        }
    }, [])

    useEffect(function () {
        if (!hasActiveSession()) {
            bloquearSesion("Debes iniciar sesion para ver tus egresos.")
            return
        }

        const sesion = getAuthSession()
        const role = normalizeRoleValue(sesion?.rol)

        if (isAdminPanelRole(role)) {
            navigate("/admin", { replace: true })
            return
        }

        if (role !== "user") {
            bloquearSesion("No tienes permisos para acceder a esta pantalla.")
            return
        }

        cargarCategorias()
    }, [])

    useEffect(function () {
        if (sesionBloqueada) {
            return
        }
        cargarEgresos()
    }, [ordenFecha, appliedFilters, sesionBloqueada])

    function formatearFecha(isoDate) {
        const parsed = new Date(isoDate)
        if (Number.isNaN(parsed.getTime())) return "-"
        return parsed.toLocaleDateString("es-PE")
    }

    function formatearMonto(value) {
        const monto = Number(value)
        if (!Number.isFinite(monto)) return "S/ 0.00"
        return `S/ ${monto.toFixed(2)}`
    }

    function construirQueryString() {
        const query = new URLSearchParams()
        query.set("order", ordenFecha)

        if (appliedFilters.category_id) {
            query.set("category_id", appliedFilters.category_id)
        }
        if (appliedFilters.date_from) {
            query.set("date_from", `${appliedFilters.date_from}T00:00:00`)
        }
        if (appliedFilters.date_to) {
            query.set("date_to", `${appliedFilters.date_to}T23:59:59`)
        }
        if (appliedFilters.amount_min !== "") {
            query.set("amount_min", String(appliedFilters.amount_min))
        }
        if (appliedFilters.amount_max !== "") {
            query.set("amount_max", String(appliedFilters.amount_max))
        }

        return query.toString()
    }

    function actualizarCategoriasDesdeEgresos(listadoEgresos) {
        if (!Array.isArray(listadoEgresos) || listadoEgresos.length === 0) return

        const nuevas = listadoEgresos
            .map(function (egreso) {
                if (!egreso?.category_id || !egreso?.category_name) return null
                return {
                    id: egreso.category_id,
                    name: egreso.category_name,
                }
            })
            .filter(Boolean)

        if (nuevas.length === 0) return

        setCategories(function (previas) {
            const mapa = new Map()
            previas.forEach(function (item) {
                mapa.set(item.id, item)
            })
            nuevas.forEach(function (item) {
                mapa.set(item.id, item)
            })
            return Array.from(mapa.values()).sort(function (a, b) {
                return a.name.localeCompare(b.name, "es")
            })
        })
    }

    async function cargarEgresos() {
        const token = getAuthToken()
        if (!token) {
            setCargando(false)
            setEgresos([])
            bloquearSesion("No hay sesion activa. Inicia sesion nuevamente.")
            return
        }

        setCargando(true)
        setErrorApi("")

        try {
            const queryString = construirQueryString()
            const resp = await fetch(`${params.API_URL}/expenses/?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                if (resp.status === 401 || resp.status === 403) {
                    bloquearSesion("Tu sesion expiro. Vuelve a iniciar sesion.")
                    return
                }
                setEgresos([])
                setErrorApi(data.detail || "No se pudieron cargar los egresos")
                return
            }

            const listado = Array.isArray(data.data) ? data.data : []
            setEgresos(listado)
            actualizarCategoriasDesdeEgresos(listado)
        } catch {
            setEgresos([])
            setErrorApi("No se pudo conectar con el backend")
        } finally {
            setCargando(false)
        }
    }

    async function cargarCategorias() {
        const token = getAuthToken()
        if (!token) {
            bloquearSesion("No hay sesion activa. Inicia sesion nuevamente.")
            return
        }

        setCategoriesLoading(true)
        try {
            const resp = await fetch(`${params.API_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (resp.status === 401 || resp.status === 403) {
                bloquearSesion("Tu sesion expiro. Vuelve a iniciar sesion.")
                return
            }

            let listado = []

            if (resp.ok) {
                listado = Array.isArray(data?.data) ? data.data : []
            } else if (resp.status === 404) {
                const legacyResp = await fetch(`${API_URL}/categories/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const legacyData = await legacyResp.json().catch(function () {
                    return []
                })

                if (legacyResp.status === 401 || legacyResp.status === 403) {
                    bloquearSesion("Tu sesion expiro. Vuelve a iniciar sesion.")
                    return
                }

                if (legacyResp.ok) {
                    listado = Array.isArray(legacyData)
                        ? legacyData
                            .map(function (item) {
                                if (!item?.id) return null
                                const name = String(item.name || item.nombre || "").trim()
                                if (!name) return null
                                return { id: item.id, name: name }
                            })
                            .filter(Boolean)
                        : []
                }
            }

            if (listado.length === 0) return

            setCategories(function (previas) {
                const mapa = new Map()
                previas.forEach(function (item) {
                    mapa.set(item.id, item)
                })
                listado.forEach(function (item) {
                    if (item?.id && item?.name) {
                        mapa.set(item.id, { id: item.id, name: item.name })
                    }
                })
                return Array.from(mapa.values()).sort(function (a, b) {
                    return a.name.localeCompare(b.name, "es")
                })
            })
        } catch {
            // no-op: si el backend no responde, el combo puede inferirse desde egresos
        } finally {
            setCategoriesLoading(false)
        }
    }

    async function handleCrearEgreso(fecha, monto, categoria, descripcion) {
        const token = getAuthToken()
        if (!token) {
            bloquearSesion("Sesion expirada. Inicia sesion nuevamente.")
            return {
                ok: false,
                error: "Sesion expirada. Inicia sesion nuevamente.",
            }
        }

        try {
            const resp = await fetch(`${params.API_URL}/expenses/`, {
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
                if (resp.status === 401 || resp.status === 403) {
                    bloquearSesion("Tu sesion expiro. Vuelve a iniciar sesion.")
                    return {
                        ok: false,
                        error: "Tu sesion expiro. Vuelve a iniciar sesion.",
                    }
                }
                return {
                    ok: false,
                    error: data.detail || "No se pudo registrar el egreso",
                }
            }

            setOpenCrear(false)
            await cargarEgresos()
            await cargarCategorias()
            return { ok: true }
        } catch {
            return {
                ok: false,
                error: "No se pudo conectar con el backend",
            }
        }
    }

    async function eliminarEgreso(id) {
        const token = getAuthToken()
        if (!token) {
            bloquearSesion("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        try {
            const resp = await fetch(`${params.API_URL}/expenses/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (resp.ok) {
                setEgresos(function (prev) {
                    return prev.filter(function (item) {
                        return item.id !== id
                    })
                })
                setEgresoEliminar(null)
                toast.success("Egreso eliminado con exito")
                return
            }

            if (resp.status === 401 || resp.status === 403) {
                bloquearSesion("Tu sesion expiro. Vuelve a iniciar sesion.")
                return
            }

            const data = await resp.json().catch(function () {
                return {}
            })
            setErrorApi(data.detail || "Error al eliminar egreso")
        } catch {
            setErrorApi("No se pudo conectar con el backend")
        }
    }

    function abrirFiltro(section) {
        setDraftFilters(function () {
            return { ...appliedFilters }
        })
        setFiltroSection(section)
        setOpenFiltro(true)
    }

    function cerrarFiltro() {
        setOpenFiltro(false)
        setFiltroSection("")
    }

    function onChangeDraft(field, value) {
        setDraftFilters(function (prev) {
            return {
                ...prev,
                [field]: value,
            }
        })
    }

    function onApplySection(section) {
        setAppliedFilters(function (prev) {
            if (section === "category") {
                return {
                    ...prev,
                    category_id: draftFilters.category_id || "",
                }
            }

            if (section === "date") {
                return {
                    ...prev,
                    date_from: draftFilters.date_from || "",
                    date_to: draftFilters.date_to || "",
                }
            }

            if (section === "amount") {
                return {
                    ...prev,
                    amount_min: draftFilters.amount_min === "" ? "" : draftFilters.amount_min,
                    amount_max: draftFilters.amount_max === "" ? "" : draftFilters.amount_max,
                }
            }

            return prev
        })

        cerrarFiltro()
    }

    function onClearSection(section) {
        let resetFields = {}

        if (section === "category") {
            resetFields = { category_id: "" }
        } else if (section === "date") {
            resetFields = { date_from: "", date_to: "" }
        } else if (section === "amount") {
            resetFields = { amount_min: "", amount_max: "" }
        }

        setDraftFilters(function (prev) {
            return { ...prev, ...resetFields }
        })
        setAppliedFilters(function (prev) {
            return { ...prev, ...resetFields }
        })

        cerrarFiltro()
    }

    function limpiarTodosFiltros() {
        setDraftFilters(EMPTY_FILTERS)
        setAppliedFilters(EMPTY_FILTERS)
        cerrarFiltro()
    }

    function classChipFiltro(active) {
        if (active) {
            return "rounded-full border border-indigo-400 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        }
        return "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Toaster position="bottom-right" richColors closeButton />
            <NavBarUser onLogout={logout} />

            <main className="w-full px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
                <div className="mx-auto w-full max-w-[1280px]">
                    <section className="rounded-2xl border border-slate-200 bg-slate-100/90 p-4 shadow-sm sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight text-slate-700">MIS EGRESOS</h2>
                                <p className="text-sm text-slate-500">Total registrado: {formatearMonto(totalRegistrado)}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={function () {
                                        cargarCategorias()
                                        setOpenCrear(true)
                                    }}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                >
                                    <span className="text-lg leading-none">+</span>
                                    <span>Crear egreso</span>
                                </button>

                                <button
                                    onClick={function () {
                                        navigate("/GraficosUsuario")
                                    }}
                                    className="rounded-md p-0.5 transition hover:bg-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                    type="button"
                                >
                                    <img
                                        className="w-7"
                                        src="https://cdn-icons-png.freepik.com/512/5952/5952983.png"
                                        alt="Estadisticas"
                                    />
                                </button>

                                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {egresos.length} {egresos.length === 1 ? "registro" : "registros"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={function () {
                                    abrirFiltro("category")
                                }}
                                className={classChipFiltro(Boolean(appliedFilters.category_id))}
                            >
                                Categoria
                            </button>

                            <button
                                type="button"
                                onClick={function () {
                                    abrirFiltro("date")
                                }}
                                className={classChipFiltro(Boolean(appliedFilters.date_from || appliedFilters.date_to))}
                            >
                                Fecha
                            </button>

                            <button
                                type="button"
                                onClick={function () {
                                    abrirFiltro("amount")
                                }}
                                className={classChipFiltro(Boolean(appliedFilters.amount_min !== "" || appliedFilters.amount_max !== ""))}
                            >
                                Monto
                            </button>

                            {filtroActivo && (
                                <button
                                    type="button"
                                    onClick={limpiarTodosFiltros}
                                    className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {chipsActivos.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {chipsActivos.map(function (chip) {
                                    return (
                                        <span
                                            key={chip}
                                            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                        >
                                            {chip}
                                        </span>
                                    )
                                })}
                            </div>
                        )}

                        <FiltroPopUp
                            key={`${filtroSection}-${openFiltro ? "open" : "closed"}`}
                            visible={openFiltro}
                            section={filtroSection}
                            categories={categories}
                            draftFilters={draftFilters}
                            onChangeDraft={onChangeDraft}
                            onApplySection={onApplySection}
                            onClearSection={onClearSection}
                            onClose={cerrarFiltro}
                        />

                        {errorApi && (
                            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {errorApi}
                            </p>
                        )}

                        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full min-w-[860px] table-fixed text-left text-base text-slate-700">
                                <thead className="border-b border-slate-200/80 bg-slate-50 text-[13px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-5">
                                            Fecha
                                            <button
                                                type="button"
                                                onClick={function () {
                                                    setOrdenFecha(ordenFecha === "desc" ? "asc" : "desc")
                                                }}
                                                className="ml-3 rounded-md border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-200"
                                            >
                                                {ordenFecha === "desc" ? "DESC" : "ASC"}
                                            </button>
                                        </th>
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
                                                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                                                onClick={function () {
                                                                    localStorage.setItem("EGRESO_EDITAR", JSON.stringify(egreso))
                                                                    navigate("/editarEgreso", { state: { egreso: egreso } })
                                                                }}
                                                            >
                                                                Editar egreso
                                                            </button>

                                                            {egresoEliminar === egreso.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={function () {
                                                                            eliminarEgreso(egreso.id)
                                                                        }}
                                                                        className="rounded-full bg-red-600 px-4 py-2 text-[10px] font-bold text-white shadow-md hover:bg-red-700"
                                                                    >
                                                                        Si
                                                                    </button>
                                                                    <button
                                                                        onClick={function () {
                                                                            setEgresoEliminar(null)
                                                                        }}
                                                                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
                                                                    >
                                                                        No
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                                                    onClick={function () {
                                                                        setEgresoEliminar(egreso.id)
                                                                    }}
                                                                >
                                                                    <img src="/img/trashbin.png" alt="Eliminar" className="h-4 w-4" />
                                                                </button>
                                                            )}
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
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/45 p-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0"
                        onClick={function () {
                            setOpenCrear(false)
                        }}
                    />

                    <section className="relative z-10 my-8 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
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

                        <EgresosForm
                            onComplete={handleCrearEgreso}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                        />
                    </section>
                </div>
            )}

            {sesionBloqueada && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4">
                    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xl">
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-700">Acceso restringido</h2>
                        <p className="mt-2 text-sm text-slate-600">{mensajeSesion}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Redirigiendo a login...</p>
                    </section>
                </div>
            )}

            <button
                type="button"
                className="fixed bottom-4 right-4 z-50 rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white shadow-lg hover:bg-indigo-700"
                onClick={function () {
                    navigate("/chatbot")
                }}
            >
                Prueba Chatbot
            </button>
        </div>
    )
}

export default EgresosPage
