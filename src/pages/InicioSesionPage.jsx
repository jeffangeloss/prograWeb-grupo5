import LoginForm from "../components/LoginForm";
import Mensaje from "../components/Mensaje";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    return <div className="min-h-screen">
        <div className="flex min-h-screen w-full">
            <div className="hidden md:block md:w-1/4 xl:w-[22%] max-w-md">
                <img className="h-full w-full object-cover" src="/public/img/azul.png" alt="leftSideImage" />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="w-full flex justify-end items-center gap-4 px-6 sm:px-10 py-6">
                    <span className="text-gray-700 text-sm sm:text-base">¿No tienes una cuenta?</span>
                    <a href="#/registro"
                        className="px-8 py-2.5 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition text-sm sm:text-base" >
                        Registrarse
                    </a>
                </div>

                <div className="flex-1 flex items-center">
                    <div className="w-full px-6 sm:px-10 lg:pl-16 lg:pr-12">
                        <LoginForm onLogin={login} />
                        <Mensaje msg={mensaje} visible={mensajeVisible} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default InicioSesionPage;