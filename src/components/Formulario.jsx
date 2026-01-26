import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Formulario({ onLogin }) {
    const navigate = useNavigate()

    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")

    function correoOnChange(ev) {
        setCorreo(ev.target.value);
    }

    function passwordOnChange(ev) {
        setPassword(ev.target.value)
    }

    return <div>
        <form className="w-full max-w-3xl flex flex-col items-start">
            <h2 className="text-4xl sm:text-5xl text-gray-900 font-bold">INICIAR SESIÓN</h2>

            <p className="text-base sm:text-lg text-gray-500/90 font-normal mt-4">
                Inicia sesión y empieza a gestionar tu dinero
            </p>

            <div className="w-full mt-10 sm:mt-12">
                <label type="email" className="block text-base sm:text-lg text-gray-700 mb-3">
                    Correo electrónico
                </label>
                <input id="email" name="email" type="email" placeholder="ejemplo@user.com"
                    className="w-full h-14 px-5 border border-gray-300 rounded-md outline-none text-base focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                    value={correo} onChange={function (ev) {
                        setCorreo(ev.target.value)
                    }} />
            </div>

            <div className="w-full mt-7 sm:mt-8">
                <label type="password" className="block text-base sm:text-lg text-gray-700 mb-3">
                    Contraseña
                </label>
                <input id="password" name="password" type="password" placeholder="********"
                    className="w-full h-14 px-5 border border-gray-300 rounded-md outline-none text-base focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                    value={password} onChange={function (ev) {
                        setPassword(ev.target.value)
                    }} />
            </div>

            <div className="w-full mt-5 text-right">
                <a href="#/restablecer" className="text-sm sm:text-base underline text-gray-600 hover:text-gray-800">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            <button
                className="mt-10 w-full sm:w-auto sm:px-16 h-14 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity text-base sm:text-lg" type="button" onClick={function () {
                    onLogin(correo, password)
                }}>
                Iniciar sesión
            </button>
        </form>
    </div>
}

export default Formulario