import { useState } from "react"
import InputEmail from "./InputEmail"

function CorreoForm({ onContinue }) {

    const [correo, setCorreo] = useState("")

    function correoOnChange(ev) {
        setCorreo(ev.target.value)
    }

    return <div className="mb-5">
        <form className="grid gap-3">
            <InputEmail correo={correo} correoOnChange={correoOnChange} />
            <button
                onClick={function () {
                    onContinue(correo)
                }}
                className="mt-4 w-min rounded-full bg-indigo-600 px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                type="button">Continuar
            </button>
        </form>
    </div>

}

export default CorreoForm