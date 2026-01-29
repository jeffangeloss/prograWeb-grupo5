import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Mensaje from "../components/Mensaje"
import LoginForm from "../components/LoginForm"
import Azul from "../components/auth/Azul"

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

    return <div className="grid md:grid-cols-[20%_80%]">
        {/*imagen izq*/}
        <Azul />

        {/* contenido derecha */}
        <div className="py-8 px-16">
            {/* boton regresar */}
            <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                <span className="text-gray-700 text-sm sm:text-base">¿No tienes una cuenta?</span>
                <a href="#/registro"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Registrarse
                </a>
            </div>


            <div className="">
                {/* header */}
                <div className="my-10">
                    <h1 className="text-5xl font-extrabold tracking-tight text-slate-700">INICIAR SESIÓN</h1>
                    <p className="mt-2 text-slate-500">Inicia sesión y empieza a gestionar tu dinero</p>
                </div>

                <LoginForm onLogin={login} />
                {/* mensaje de error */}
                <Mensaje
                    msg={mensaje}
                    visible={mensajeVisible}
                />
            </div>
        </div>
    </div>
    </div>
}

export default InicioSesionPage