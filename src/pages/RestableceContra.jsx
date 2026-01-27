import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CorreoForm from "../components/CorreoForm"
import Mensaje from "../components/Mensaje"

function RestableceContra() {

    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    function continuar(correo) {
        if (!correo) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
        }
        else if (correo == "ejemplo@admin.com" || correo == "ejemplo@user.com") {
            console.log("correo ingresado")
            setMensaje("")
            setMensajeVisible(false)
            localStorage.setItem("correo_restablecer", correo)
            navigate('/restablecer/mensaje')
        }
        else{
            setMensaje("El correo ingresado no tiene una cuenta asociada")
            setMensajeVisible(true)

        }
    }

    return <div className="grid md:grid-cols-[30%_70%]">
        {/*imagen izq*/}
        <div className="h-40 md:h-screen">
            <img className="w-full h-full"
                src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
        </div>

        {/* contenido derecha */}
        <div className="py-8 px-16">
            {/* boton regresar */}
            <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                <span className="text-gray-700 text-sm sm:text-base">¿Recordaste tu contraseña?</span>
                <a href="#/"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Regresar
                </a>
            </div>

            {/* header */}
            <div className="my-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
                <p className="mt-2 text-slate-500">Indica el correo electrónico con el que te registraste</p>
            </div>

            <CorreoForm onContinue={continuar} />

            {/* mensaje de error */}
            <Mensaje
                msg={mensaje}
                visible={mensajeVisible}
            />

        </div>
    </div>
}

export default RestableceContra