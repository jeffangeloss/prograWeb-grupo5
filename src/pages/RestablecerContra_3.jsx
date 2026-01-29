import { useState } from "react"
import ContraForm from "../components/ContraForm"
import Mensaje from "../components/Mensaje"
import PopUp_ContraConfirm from "../components/PopUp_ContraConfirm"

function RestableceContra_3() {
    //no estoy poniendo getitem para el correo xq es backend, igual noc si entraria aca pero me pongo esto como marcador y no olvidarme XD
    const [mensaje, setMensaje] = useState("")
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [popUpVisible, setPopUpVisible ] = useState(false)

    function Continue(pass, passConfirm) {
        if (!pass || !passConfirm) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            setPopUpVisible(false)
        }
        else {
            if (pass == passConfirm) {
                console.log("Contraseña correcta")
                setMensaje("")
                setMensajeVisible(false)
                setPopUpVisible(true)
                //hacer que aparezca un componente que diga "confirmado"
            }
            else {
                setMensaje("La contraseña ingresada debe ser igual en ambos campos")
                setMensajeVisible(true)
                setPopUpVisible(false)
            }

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

            <ContraForm onContinue={Continue} />

            {/* mensaje de error */}
            <Mensaje
                msg={mensaje}
                visible={mensajeVisible}
            />
            <PopUp_ContraConfirm visible={popUpVisible}/>

        </div>
    </div>

}

export default RestableceContra_3