import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import ContraForm from "../components/ContraForm"
import Mensaje from "../components/Mensaje"
import PopUp_ToLogin from "../components/PopUp_ToLogin"
import { passwordMeetsPolicy, passwordPolicyMessage } from "../utils/passwordPolicy"

function RestableceContra_3() {
    const location = useLocation()
    const navigate = useNavigate()

    const token = useMemo(function () {
        const params = new URLSearchParams(location.search)
        return (params.get("token") || "").trim()
    }, [location.search])

    const [mensaje, setMensaje] = useState("")
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [popUpMensaje, setPopUpMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    const tokenValido = token.length >= 8

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    async function continuar(pass, passConfirm) {
        if (!tokenValido) {
            setMensaje("Enlace invalido. Solicita un nuevo correo de recuperacion.")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        if (!pass || !passConfirm) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        if (pass !== passConfirm) {
            setMensaje("La contrasena ingresada debe ser igual en ambos campos")
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        if (!passwordMeetsPolicy(pass)) {
            setMensaje(passwordPolicyMessage("La contrasena"))
            setMensajeVisible(true)
            setPopUpVisible(false)
            return
        }

        try {
            setCargando(true)

            const resp = await fetch("http://127.0.0.1:8000/reset-pass/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: pass,
                }),
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                const backendMsg =
                    typeof data?.detail === "string"
                        ? data.detail
                        : data?.detail?.msg

                let userMessage = "Ocurrio un error al restablecer la contrasena."

                if (backendMsg === "INVALID TOKEN") {
                    userMessage = "El enlace de recuperacion no es valido."
                } else if (backendMsg === "EXPIRED TOKEN") {
                    userMessage = "El enlace ha expirado. Solicita uno nuevo."
                }

                throw new Error(userMessage)
            }

            setMensaje("")
            setMensajeVisible(false)
            setPopUpMensaje("Tu contrasena ha sido cambiada con exito")
            setPopUpVisible(true)
        } catch (error) {
            setMensaje(error.message || "Error al restablecer contrasena")
            setMensajeVisible(true)
            setPopUpVisible(false)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="grid md:grid-cols-[20%_80%]">
            <div className="h-20 md:h-screen">
                <img
                    className="w-full h-full"
                    src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
                />
            </div>

            <div className="py-8 px-16">
                <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-gray-700 text-sm sm:text-base">Recordaste tu contrasena?</span>
                    <a
                        href="#/sesion"
                        className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        Regresar
                    </a>
                </div>

                <div className="my-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASENA</h1>
                    <p className="mt-2 text-slate-500">Ingresa tu nueva contrasena</p>
                </div>

                {!tokenValido ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                        No se detecto un token valido en el enlace. Solicita un nuevo correo de recuperacion.
                        <div className="mt-4">
                            <button
                                type="button"
                                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                onClick={function () {
                                    navigate("/restablecer")
                                }}
                            >
                                Solicitar enlace nuevo
                            </button>
                        </div>
                    </div>
                ) : (
                    <ContraForm cargando={cargando} onContinue={continuar} />
                )}

                <Mensaje msg={mensaje} visible={mensajeVisible} />
                <PopUp_ToLogin onLogout={logout} mensaje={popUpMensaje} visible={popUpVisible} />
            </div>
        </div>
    )
}

export default RestableceContra_3
