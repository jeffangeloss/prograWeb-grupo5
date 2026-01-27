import { useState } from "react"
import { useNavigate } from "react-router-dom"

function RestableceContra() {

    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    function continuar(){
        if(!correo){
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
        }

        if(correo == "ejemplo@admin.com" || correo =="ejemplo@user.com"){
            setMensaje("")
            setMensajeVisible(false)
            navigate("/restablecer/mensaje")
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
                <a href="#"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Regresar
                </a>
            </div>

            {/* header */}
            <div className="my-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
                <p className="mt-2 -->text-slate-500">Indica el correo electrónico con el que te registraste</p>
            </div>

            {/* form */}
            <div className="mb-5">
                <form className="grid gap-3">
                    <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                    <input
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        type="text" placeholder="hello@reallygreatsite.com">
                    </input>
                    <button
                        className="mt-4 w-min rounded-full bg-indigo-600 px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                        type="submit">Continuar
                    </button>
                </form>
            </div>

            {/* mensaje de error */}
            <div className="pt-2 space-y-1 text-sm text-red-500">
                <p>Debe completar todos los campos para continuar</p>
                <p>El correo ingresado no tiene una cuenta asociada</p>
            </div>

        </div>
    </div>
}

export default RestableceContra