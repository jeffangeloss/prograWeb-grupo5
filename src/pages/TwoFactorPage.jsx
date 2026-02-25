import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Azul from "../components/auth/Azul"
import Mensaje from "../components/Mensaje"
import ThemeToggleButton from "../components/ThemeToggleButton"
import { hasActiveSession, getAuthSession } from "../utils/auth"
import { clearTwoFactorPending, getTwoFactorPending } from "../utils/twoFactor"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import params from "../params"

function detectarNavegador() {
    if (typeof navigator === "undefined") {
        return "Desconocido"
    }

    const ua = (navigator.userAgent || "").toLowerCase()
    if (ua.includes("brave")) return "Brave"
    if (ua.includes("edg/")) return "Edge"
    if (ua.includes("opr/") || ua.includes("opera")) return "Opera"
    if (ua.includes("firefox")) return "Firefox"
    if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
    if (ua.includes("chrome")) return "Chrome"
    return "Desconocido"
}

function TwoFactorPage() {
    const navigate = useNavigate()
    const [pending, setPending] = useState(null)
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [mensajeVisible, setMensajeVisible] = useState(false)

    useEffect(function () {
        if (hasActiveSession()) {
            const session = getAuthSession()
            const role = normalizeRoleValue(session?.rol)
            if (isAdminPanelRole(role)) {
                navigate("/admin", { replace: true })
            } else {
                navigate("/user", { replace: true })
            }
            return
        }

        const stored = getTwoFactorPending()
        if (!stored) {
            navigate("/sesion", { replace: true })
            return
        }
        setPending(stored)
    }, [navigate])

    const correo = useMemo(function () {
        return pending?.correo || ""
    }, [pending])

    async function verificarCodigo(ev) {
        ev.preventDefault()
        const normalized = (code || "").replace(/\D/g, "").slice(0, 6)
        if (normalized.length !== 6) {
            setMensaje("Ingresa un codigo de 6 digitos.")
            setMensajeVisible(true)
            return
        }
        if (!pending?.tmp_token) {
            setMensaje("La solicitud 2FA expiro. Inicia sesion nuevamente.")
            setMensajeVisible(true)
            return
        }

        setLoading(true)
        setMensaje("")
        setMensajeVisible(false)
        try {
            const resp = await fetch(`${params.BACKEND_URL}/auth/2fa/verify`, {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "x-browser-name": detectarNavegador(),
                },
                body: JSON.stringify({
                    tmp_token: pending.tmp_token,
                    code: normalized,
                }),
            })
            const data = await resp.json()
            if (!resp.ok) {
                setMensaje(data?.detail || "Codigo incorrecto o expirado")
                setMensajeVisible(true)
                return
            }

            const token = data.access_token || data.token || ""
            if (!token) {
                setMensaje("No se recibio token de sesion final.")
                setMensajeVisible(true)
                return
            }

            const rol = normalizeRoleValue(data.rol || pending.rol)
            const datosLogin = {
                ingreso: true,
                correo: data.email || pending.correo || "",
                nombre: data.name || pending.nombre || "",
                rol,
                id: data.id || pending.id || "",
                avatar_url: data.avatar_url || pending.avatar_url || "",
                token,
                cantidadIntentos: 0,
            }
            localStorage.setItem("DATOS_LOGIN", JSON.stringify(datosLogin))
            localStorage.setItem("TOKEN", token)
            clearTwoFactorPending()

            if (isAdminPanelRole(rol)) {
                navigate("/admin", { replace: true })
            } else {
                navigate("/user", { replace: true })
            }
        } catch (error) {
            setMensaje(error?.message || "No se pudo verificar el codigo 2FA")
            setMensajeVisible(true)
        } finally {
            setLoading(false)
        }
    }

    function volverAlLogin() {
        clearTwoFactorPending()
        navigate("/sesion", { replace: true })
    }

    return <div className="min-h-screen bg-white text-slate-800">
        <div className="md:min-h-screen grid grid-cols-1 md:grid-cols-[20%_80%]">
            <Azul />

            <div className="px-4 py-8 sm:px-8 lg:px-16">
                <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-600">
                    <ThemeToggleButton />
                    <button
                        type="button"
                        onClick={volverAlLogin}
                        className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        Volver
                    </button>
                </div>

                <div className="my-8 sm:my-10 max-w-xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-700">VERIFICACION 2FA</h1>
                    <p className="mt-2 text-slate-500">
                        Ingresa el codigo de 6 digitos mostrado en el dispositivo Authenticator.
                    </p>
                    {correo ? (
                        <p className="mt-1 text-sm text-slate-400">
                            Usuario: {correo}
                        </p>
                    ) : null}
                </div>

                <form onSubmit={verificarCodigo} className="grid gap-3 max-w-md">
                    <label className="text-sm font-medium text-slate-700">
                        Codigo TOTP
                    </label>
                    <input
                        value={code}
                        onChange={function (ev) {
                            setCode((ev.target.value || "").replace(/\D/g, "").slice(0, 6))
                        }}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 sm:py-3 text-lg tracking-[0.25em] text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        type="text"
                        placeholder="000000"
                    />

                    <button
                        className="mt-3 w-full sm:w-fit whitespace-nowrap rounded-full bg-indigo-600 px-10 sm:px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition disabled:opacity-70"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar"}
                    </button>
                </form>

                <Mensaje msg={mensaje} visible={mensajeVisible} />
            </div>
        </div>
    </div>
}

export default TwoFactorPage
