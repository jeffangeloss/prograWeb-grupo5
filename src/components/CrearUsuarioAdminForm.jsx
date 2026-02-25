import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { passwordMeetsPolicy, passwordPolicyMessage } from "../utils/passwordPolicy"
import { canCreateRole, canManageUsers, normalizeRoleValue } from "../utils/roles"
import params from "../params"

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

function getCurrentRole() {
    try {
        const raw = localStorage.getItem("DATOS_LOGIN")
        const sesion = raw ? JSON.parse(raw) : null
        return normalizeRoleValue(sesion?.rol || "user")
    } catch {
        return "user"
    }
}

function extractError(data) {
    if (typeof data?.detail === "string") return data.detail
    if (typeof data?.detail?.msg === "string") return data.detail.msg
    return "No se pudo crear el usuario."
}

function CrearUsuarioForm() {
    const navigate = useNavigate()

    const actorRole = useMemo(function () {
        return getCurrentRole()
    }, [])

    const opcionesPermitidas = ROLE_OPTIONS.filter(function (option) {
        return canCreateRole(actorRole, option.role)
    })

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [contra, setContra] = useState("")
    const [confirmarContra, setConfirmarContra] = useState("")
    const [rol, setRol] = useState(opcionesPermitidas[0]?.value || "1")
    const [error, setError] = useState("")
    const [enviando, setEnviando] = useState(false)

    async function enviarUsuarioNuevo() {
        setError("")
        if (!canManageUsers(actorRole)) {
            setError("No tienes permisos para crear usuarios.")
            return
        }

        if (!nombre.trim() || !email.trim() || !contra || !confirmarContra) {
            setError("Completa todos los campos.")
            return
        }

        if (!passwordMeetsPolicy(contra)) {
            setError(passwordPolicyMessage("La contrasena"))
            return
        }

        if (contra !== confirmarContra) {
            setError("Las contrasenas no coinciden.")
            return
        }

        const roleOption = ROLE_OPTIONS.find(function (opt) {
            return opt.value === rol
        })
        if (!roleOption || !canCreateRole(actorRole, roleOption.role)) {
            setError("No tienes permisos para crear ese tipo de usuario.")
            return
        }

        const token = getToken()
        if (!token) {
            setError("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        setEnviando(true)
        try {
            const usuarioNuevo = {
                full_name: nombre.trim(),
                email: email.trim().toLowerCase(),
                password: contra,
                type: Number(rol),
            }

            const response = await fetch(`${params.BACKEND_URL}/admin/`, {
                method: "POST",
                body: JSON.stringify(usuarioNuevo),
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
            toast.success("Usuario creado correctamente")
        } catch {
            setError("No se pudo conectar con el backend.")
        } finally {
            setEnviando(false)
        }
    }

    if (!canManageUsers(actorRole)) {
        return (
            <div className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Este rol no puede crear usuarios.
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
                    <label className="text-slate-700 mb-2 ml-1">Correo electronico</label>
                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={email}
                        onChange={function (ev) { setEmail(ev.target.value) }}
                    />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Contrasena</label>
                    <input
                        type="password"
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={contra}
                        onChange={function (ev) { setContra(ev.target.value) }}
                    />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Confirmar contrasena</label>
                    <input
                        type="password"
                        className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={confirmarContra}
                        onChange={function (ev) { setConfirmarContra(ev.target.value) }}
                    />
                </div>

                <div className="mb-8">
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

                {error && (
                    <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        className="rounded-2xl bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition"
                        onClick={function () { navigate("/admin") }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                        onClick={enviarUsuarioNuevo}
                        disabled={enviando}
                    >
                        {enviando ? "Creando..." : "Crear usuario"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CrearUsuarioForm
