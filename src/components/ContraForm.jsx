import { useState } from "react"

function ContraForm({ cargando, onContinue }) {

    const [pass, setPass] = useState("")
    const [passConfirm, setPassConfirm] = useState("")

    function passOnChange(ev) {
        setPass(ev.target.value)
    }
    function passConfirmOnChange(ev) {
        setPassConfirm(ev.target.value)
    }

    function submitOnContinue(ev) {
        ev.preventDefault()
        onContinue(pass, passConfirm)
    }

    return <div className="mb-5">
        <form onSubmit={submitOnContinue} className="grid gap-3">
            <label className="text-sm font-medium text-slate-700">Contraseña</label>
            <input
                value={pass}
                onChange={passOnChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                type="password" placeholder="******">
            </input>

            <label className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
            <input
                value={passConfirm}
                onChange={passConfirmOnChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                type="password" placeholder="******">
            </input>
            <button
                disabled={cargando}
                className="mt-4 w-full rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] sm:w-fit sm:px-16"
                type="submit" >{cargando ? "Procesando..." : "Continuar"}
            </button>
        </form>
    </div>
}

export default ContraForm
