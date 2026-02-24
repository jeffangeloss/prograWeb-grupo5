import { useState } from "react"
import { useLocation } from "react-router-dom"
import ContraForm from "../components/ContraForm"
import Mensaje from "../components/Mensaje"
import PopUp_ToLogin from "../components/PopUp_ToLogin"

function RestableceContra_3() {

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    const [mensaje, setMensaje] = useState("")
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [popUpMensaje, setPopUpMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    async function Continue(pass, passConfirm) {
        if (!pass || !passConfirm) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        if (pass != passConfirm) {
            setMensaje("La contraseña ingresada debe ser igual en ambos campos")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        if (!token) {
            setMensaje("Token invalido.")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return

        }

        try {
            setCargando(true)

            const resp = await fetch("http://127.0.0.1:8000/reset-pass/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token,
                    password: pass
                })
            })

            const data = await resp.json()

            if (!resp.ok) {
                const backendMsg = data.detail?.msg

                let userMessage = "Ocurrió un error al restablecer la contraseña."

                if (backendMsg === "INVALID TOKEN") {
                    userMessage = "El enlace de recuperación no es válido."
                }
                else if (backendMsg === "EXPIRED TOKEN") {
                    userMessage = "El enlace ha expirado. Solicita uno nuevo."
                }

                throw new Error(userMessage)
            }

            setMensaje("")
            setMensajeVisible(false)
            setPopUpMensaje("Tu contraseña ha sido cambiada con éxito")
            setPopUpVisible(true)

        } catch (error) {
            setMensaje(error.message || "Error al restablecer contraseña")
            setMensajeVisible(true)
            setPopUpVisible(false)
        } finally {
            setCargando(false)
        }


    }

    return <div className="grid md:grid-cols-[20%_80%]">
        {/* imagen izq */}
        <div className="h-20 md:h-screen">
            <img className="w-full h-full"
                src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
        </div>
        {/* contenido derecha */}
        <div className="py-8 px-16">
            {/* boton regresar */}
            <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                <span className="text-gray-700 text-sm sm:text-base">¿Recordaste tu contraseña?</span>
                <a href="#/sesion"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Regresar
                </a>
            </div>
            {/* header */}
            <div className="my-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
                <p className="mt-2 text-slate-500">Ingresa tu nueva contraseña</p>
            </div>

            <ContraForm
                cargando={cargando}
                onContinue={Continue} />

            {/* mensaje de error */}
            <Mensaje
                msg={mensaje}
                visible={mensajeVisible}
            />
            <PopUp_ToLogin 
            onLogout={logout}
            mensaje={popUpMensaje} 
            visible={popUpVisible} />

        </div>
    </div>

}

export default RestableceContra_3