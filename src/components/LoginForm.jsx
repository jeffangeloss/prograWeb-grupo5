import { useState } from "react"

function LoginForm({ onLogin }) {
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")

    function correoOnChange(ev) {
        setCorreo(ev.target.value)
    }

    function passwordOnChange(ev) {
        setPassword(ev.target.value)
    }

    function loginOnClick() {
        onLogin(correo, password)
    }


    return <div className="mb-5" >
        <form className="grid gap-3">
            <label className="text-sm font-medium text-slate-700">
                Correo electrónico
            </label>
            <input
                value={correo}
                onChange={correoOnChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 sm:py-3 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                type="email"
                placeholder="ejemplo@user.com"
            />

            <label className="text-sm font-medium text-slate-700">
                Contraseña
            </label>
            <input
                value={password}
                onChange={passwordOnChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 sm:py-3 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                type="password"
                placeholder="********"
            />

            <div className="text-right">
                <a
                    href="#/restablecer"
                    className="text-sm sm:text-base underline text-gray-600 hover:text-gray-800"
                >
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            <button
                onClick={loginOnClick}
                className="mt-4 w-full sm:w-fit whitespace-nowrap rounded-full bg-indigo-600 px-10 sm:px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                type="button"
            >
                Iniciar sesión
            </button>

        </form>
    </div >
}

export default LoginForm
