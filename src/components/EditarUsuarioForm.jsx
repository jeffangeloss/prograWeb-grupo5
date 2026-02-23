import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
    canEditTarget,
    canManageUsers,
    normalizeRoleValue,
    roleType,
} from "../utils/roles"

const ROLE_OPTIONS = [
    { value: "1", role: "user", label: "Usuario" },
    { value: "2", role: "admin", label: "Administrador" },
    { value: "3", role: "owner", label: "Owner" },
    { value: "4", role: "auditor", label: "Auditor" },
]

function getToken() {
    const tokenLegacy = localStorage.getItem("TOKEN")
    if (tokenLegacy) return tokenLegacy

    try {
        const raw = localStorage.getItem("DATOS_LOGIN")
        const sesion = raw ? JSON.parse(raw) : null
        return sesion?.token || ""
    } catch {
        return ""
    }
}

function getSesion() {
    try {
        const raw = localStorage.getItem("DATOS_LOGIN")
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function extractError(data) {
    if (typeof data?.detail === "string") return data.detail
    if (typeof data?.detail?.msg === "string") return data.detail.msg
    return "No se pudo actualizar el usuario."
}

function EditarUsuarioForm() {
    const navigate = useNavigate()
    const { state: usuario } = useLocation()

    const actorRole = useMemo(function () {
        return normalizeRoleValue(getSesion()?.rol || "user")
    }, [])

    const targetRole = normalizeRoleValue(
        usuario?.role || usuario?.role_value || usuario?.rol,
        usuario?.type
    )

    const puedeGestionar = canManageUsers(actorRole)
    const puedeEditarTarget = canEditTarget(actorRole, targetRole)

    const [nombre, setNombre] = useState(usuario?.full_name || usuario?.nombre || "")
    const [email, setEmail] = useState(usuario?.email || "")
    const [rol, setRol] = useState(String(roleType(targetRole)))
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    const opcionesPermitidas = ROLE_OPTIONS.filter(function (option) {
        if (actorRole === "owner") {
            if (usuario?.isSelf) {
                return option.role === "owner"
            }
            return true
        }
        if (actorRole === "admin") return option.role === "user"
        return false
    })

    async function guardarCambios() {
        setError("")

        if (!usuario?.id) {
            setError("No se encontró el usuario a editar.")
            return
        }

        if (!puedeGestionar || !puedeEditarTarget) {
            setError("No tienes permisos para editar este usuario.")
            return
        }

        if (!nombre.trim() || !email.trim()) {
            setError("Nombre y correo son obligatorios.")
            return
        }

        const token = getToken()
        if (!token) {
            setError("Sesión expirada. Inicia sesión nuevamente.")
            return
        }

        if (!ROLE_OPTIONS.some(function (opt) { return opt.value === rol })) {
            setError("Rol inválido.")
            return
        }

        setGuardando(true)
        try {
            const usuarioEditado = {
                full_name: nombre.trim(),
                email: email.trim().toLowerCase(),
                type: Number(rol),
            }

            const response = await fetch(`http://127.0.0.1:8000/admin/${usuario.id}`, {
                method: "PATCH",
                body: JSON.stringify(usuarioEditado),
                headers: {
                    "content-type": "application/json",
                    "x-token": token,
                },
            })

            const data = await response.json().catch(function () {
                return {}
            })

            if (!response.ok) {
                setError(extractError(data))
                return
            }

            navigate("/admin")
        } catch {
            setError("No se pudo conectar con el backend.")
        } finally {
            setGuardando(false)
        }
    }

    if (!usuario) {
        return (
            <div className="max-w-xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                No se recibió el usuario a editar. Vuelve al dashboard.
            </div>
        )
    }

    if (!puedeGestionar || !puedeEditarTarget) {
        return (
            <div className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Tu rol no puede editar este usuario.
            </div>
        )
    }

    return (
        <div className="flex justify-center p-4">
            <div className="w-full max-w-2xl rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Nombre completo</label>
                    <input
                        type="text"
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={nombre}
                        onChange={function (ev) { setNombre(ev.target.value) }}
                    />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={email}
                        onChange={function (ev) { setEmail(ev.target.value) }}
                    />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Rol</label>
                    <select
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={rol}
                        onChange={function (ev) { setRol(ev.target.value) }}
                    >
                        {opcionesPermitidas.map(function (option) {
                            return (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="mb-8">
                    <label className="text-slate-700 mb-2 ml-1">Último acceso</label>
                    <input
                        type="text"
                        disabled
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-gray-300 text-gray-600"
                        value={usuario?.ultimoAcceso || "-"}
                    />
                </div>

                {error && (
                    <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error}
                    </p>
                )}

                <div className="flex gap-4 justify-end">
                    <button
                        className="rounded-2xl bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition"
                        onClick={function () { navigate("/admin") }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={guardarCambios}
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditarUsuarioForm
