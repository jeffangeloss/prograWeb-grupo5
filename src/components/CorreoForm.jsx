import { useState } from "react"

function CorreoForm({onContinue}){
    
    const [correo, setCorreo] = useState("")

    function correoOnChange(ev){
        setCorreo(ev.target.value)
    }
    
    return <div className="mb-5">
                <form className="grid gap-3">
                    <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                    <input
                        value={correo}
                        onChange={correoOnChange}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        type="text" placeholder="ejemplo@user.com">
                    </input>
                    <button
                        onClick={ function(){
                            onContinue(correo)
                        }}
                        className="mt-4 w-min rounded-full bg-indigo-600 px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                        type="button">Continuar
                    </button>
                </form>
            </div>

}

export default CorreoForm