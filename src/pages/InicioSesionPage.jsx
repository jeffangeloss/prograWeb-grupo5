import LoginForm from "../components/LoginForm"
import Mensaje from "../components/Mensaje"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function InicioSesionPage() {
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    function login(correo, password) {
        if (!correo || !password) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            return
        }

        if (correo === "ejemplo@admin.com" && password === "admin1234") {
            setMensaje("")
            setMensajeVisible(false)
            navigate("/admin")
            return
        }

        if (correo === "ejemplo@user.com" && password === "user1234") {
            setMensaje("")
            setMensajeVisible(false)
            navigate("/user")
            return
        }

        setMensaje("Correo y/o contraseña incorrectos")
        setMensajeVisible(true)
    }

    function irARegistro() {
        navigate("/registro")
    }

    return <div className="grid grid-cols-1 md:grid-cols-[20%_80%] min-h-screen">
        <div className="h-20 md:h-screen">
            <img className="w-full h-full" src="/img/azul.png" alt="leftSideImage" />
        </div>

        <div className="py-8 px-6 sm:px-10 md:px-16">
            <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                <span className="text-gray-700 text-sm sm:text-base">
                    ¿No tienes una cuenta?
                </span>
                <button
                    type="button"
                    onClick={irARegistro}
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    Registrarse
                </button>
            </div>

            <div className="my-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-700">
                    INICIAR SESIÓN
                </h1>
                <p className="mt-2 text-slate-500">
                    Inicia sesión y empieza a gestionar tu dinero
                </p>
            </div>

            <LoginForm onLogin={login} />
            <Mensaje msg={mensaje} visible={mensajeVisible} />
        </div>
    </div>
}

export default InicioSesionPage
