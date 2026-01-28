import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CrearUsuarioForm() {
    const navigate = useNavigate()

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [contra, setContra] = useState("")
    const [confirmarContra, setConfirmarContra] = useState("")
    const [rol, setRol] = useState("Usuario")

    function formatearUsuarioNuevo() {
        const usuarioNuevo = {
            nombre: nombre,
            email: email,
            contraseña: contra,
            rol: rol
        }
        console.log(usuarioNuevo)
    }

    return (<div>
        <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 min-w-xl lg:min-w-2xl place-self-center">

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Nombre completo</label>
                <input type="text" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={nombre} onChange={function (ev) { setNombre(ev.target.value) }} />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={email} onChange={function (ev) { setEmail(ev.target.value) }} />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Contraseña</label>
                <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={contra} onChange={function (ev) { setContra(ev.target.value) }} />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Confirmar Contraseña</label>
                <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={confirmarContra} onChange={function (ev) { setConfirmarContra(ev.target.value) }} />
            </div>

            <div className="mb-8">
                <label className="text-white mb-2 ml-1">Rol</label>
                <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={rol} onChange={function (ev) { setRol(ev.target.value) }}>
                    <option>Usuario</option>
                    <option>Administrador</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    className="px-4 py-2 rounded-xl bg-gray-300 text-gray-700 border border-gray-300 hover:bg-gray-50/30 transition"
                    onClick={function () { navigate("/admin") }}>Cancelar</button>

                <button
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white border border-blue-900 hover:bg-blue-700/30 transition"
                    onClick={function () {formatearUsuarioNuevo(), navigate("/admin") }}>Crear usuario</button>
            </div>
        </div>
    </div>)
}

export default CrearUsuarioForm
