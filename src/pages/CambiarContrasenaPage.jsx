import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Mensaje from "../components/Mensaje"
import NavBarUser from "../components/NavBarUser"
import { passwordMeetsPolicy, passwordPolicyMessage } from "../utils/passwordPolicy"

function CambiarContrasenaPage() {
    const navigate = useNavigate()
    const [actual, setActual] = useState("")
    const [nueva, setNueva] = useState("")
    const [confirmar, setConfirmar] = useState("")
    const [cargando, setCargando] = useState(false)
    const [mensajeError, setMensajeError] = useState("")
    const [mensajeExito, setMensajeExito] = useState("")

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    function obtenerToken() {
        const tokenDirecto = localStorage.getItem("TOKEN")
        if (tokenDirecto) {
            return tokenDirecto
        }

        const raw = localStorage.getItem("DATOS_LOGIN")
        if (!raw) {
            return ""
        }

        try {
            const datos = JSON.parse(raw)
            return datos?.token || ""
        } catch {
            return ""
        }
    }

    function validar() {
        if (!actual || !nueva || !confirmar) {
            return "Debe completar todos los campos para continuar"
        }
        if (!passwordMeetsPolicy(nueva)) {
            return passwordPolicyMessage("La nueva contrasena")
        }
        if (nueva !== confirmar) {
            return "Las contrasenas no coinciden"
        }
        if (actual === nueva) {
            return "La nueva contrasena debe ser diferente a la actual"
        }
        return ""
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        setMensajeExito("")
        setMensajeError("")

        const errorValidacion = validar()
        if (errorValidacion) {
            setMensajeError(errorValidacion)
            return
        }

        const token = obtenerToken()
        if (!token) {
            setMensajeError("Tu sesion expiro. Inicia sesion nuevamente.")
            return
        }

        setCargando(true)
        const respuesta = await fetch("http://127.0.0.1:8000/me/password", {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                current_password: actual,
                new_password: nueva,
            }),
        })

        let data = null
        try {
            data = await respuesta.json()
        } catch {
            data = null
        }
        setCargando(false)

        if (!respuesta.ok) {
            const detalle = typeof data?.detail === "string"
                ? data.detail
                : "No se pudo actualizar la contrasena"
            setMensajeError(detalle)
            return
        }

        setActual("")
        setNueva("")
        setConfirmar("")
        setMensajeExito("Tu contrasena se cambio correctamente.")
    }

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen">
            <NavBarUser onLogout={logout} />

            <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-700">Cambiar contrasena</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Actualiza tu contrasena para mantener segura tu cuenta.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Contrasena actual</label>
                            <input
                                type="password"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                value={actual}
                                onChange={function (ev) {
                                    setActual(ev.target.value)
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Nueva contrasena</label>
                            <input
                                type="password"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                value={nueva}
                                onChange={function (ev) {
                                    setNueva(ev.target.value)
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Confirmar nueva contrasena</label>
                            <input
                                type="password"
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                value={confirmar}
                                onChange={function (ev) {
                                    setConfirmar(ev.target.value)
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {cargando ? "Actualizando..." : "Actualizar contrasena"}
                        </button>
                    </form>

                    <Mensaje msg={mensajeError} visible={Boolean(mensajeError)} />
                    {mensajeExito && (
                        <p className="mt-3 text-sm font-medium text-emerald-600">{mensajeExito}</p>
                    )}
                </section>
            </main>
        </div>
    )
}

export default CambiarContrasenaPage
