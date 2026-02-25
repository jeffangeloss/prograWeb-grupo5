import { useEffect, useState } from "react"

import Mensaje from "../components/Mensaje"
import TextoContra from "../components/TextoContra"
import params from "../params"
import ThemeToggleButton from "../components/ThemeToggleButton"

function RestablecerContra_2() {
    const [correo, setCorreo] = useState("")
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const [mensajeVisible, setMensajeVisible] = useState(false)

    useEffect(function () {
        const correoGuardado = localStorage.getItem("CorreoRecuperar")
        if (correoGuardado) {
            setCorreo(correoGuardado)
        }
    }, [])

    async function reenviarCorreo() {
        if (!correo) return

        try {
            setCargando(true)
            setMensaje("")
            setMensajeVisible(false)

            const resp = await fetch(`${params.API_URL}/reset-pass/request`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: correo,
                }),
            })

            if (!resp.ok) {
                throw new Error("Error reenviando correo")
            }

            setMensaje("Correo reenviado correctamente.")
            setMensajeVisible(true)
        } catch {
            setMensaje("Ocurrio un error al reenviar el correo.")
            setMensajeVisible(true)
        } finally {
            setCargando(false)
        }
    }

    return <div className="min-h-screen bg-white text-slate-800 grid md:grid-cols-[20%_80%] dark:bg-slate-950 dark:text-slate-100">
        {/* imagen izq */}
        <div className="h-20 md:h-screen">
            <img className="w-full h-full"
                src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
        </div>
        {/* contenido derecha */}
        <div className="px-4 py-8 sm:px-8 lg:px-16">
            {/* boton regresar */}
            <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-600">
                <ThemeToggleButton />
                <span className="text-gray-700 text-sm sm:text-base">¿Recordaste tu contraseña?</span>
                <a href="#/sesion"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Regresar
                </a>
            </div>
            {/* header */}
            <div className="my-8 sm:my-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
            </div>

            {/* texto */}
            <TextoContra
                onResend={reenviarCorreo}
                cargando={cargando}
                correo={correo}
            />

            <Mensaje msg={mensaje} visible={mensajeVisible} />
        </div>
    </div>
}

export default RestablecerContra_2
