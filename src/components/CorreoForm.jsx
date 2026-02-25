import { useState } from "react"
import InputEmail from "./InputEmail"

function CorreoForm({ onContinue }) {

    const [correo, setCorreo] = useState("")

    function correoOnChange(ev) {
        setCorreo(ev.target.value)
    }

    function submitOnContinue(ev) {
        ev.preventDefault()
        onContinue(correo)
    }

    return <div className="mb-5">
        <form onSubmit={submitOnContinue} className="grid gap-3">
            <InputEmail correo={correo} correoOnChange={correoOnChange} />
            <button
                className="mt-4 w-full rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] sm:w-fit sm:px-16"
                type="submit">Continuar
            </button>
        </form>
    </div>

}

export default CorreoForm
