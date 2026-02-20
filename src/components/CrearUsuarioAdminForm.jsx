import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CrearUsuarioForm() {
    const navigate = useNavigate()

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [contra, setContra] = useState("")
    const [confirmarContra, setConfirmarContra] = useState("")
    const [rol, setRol] = useState("1")

    function formatearUsuarioNuevo() {
        const usuarioNuevo = {
            nombre: nombre,
            email: email,
            password: contra,
            type: parseInt(rol)
        }
        return usuarioNuevo
    }

    async function enviarUsuarioNuevo() {
        if (contra !== confirmarContra) {
            alert("Las contraseñas no coinciden.")
            return
        }

        const usuarioNuevo = formatearUsuarioNuevo()

        const URL = "http://127.0.0.1:8000/admin"
        const response = await fetch(URL,
            {
                method: "PUT",
                body: JSON.stringify(usuarioNuevo),
                headers: {
                    "content-type": "application/json",
                    "x-token": localStorage.getItem("TOKEN")
                }
            }
        )
        const data = await response.json()
        if (!response.ok) {
            console.error("Error de peticion" + data.status)
            alert("Error al crear usuario:" + data.detail)
            return
        }
        alert("Usuario creado correctamente.")
        navigate("/admin")
    }

    return (
        <div className="flex justify-center p-4">
            <div className="rounded-2xl shadow-xl p-8 max-w-full">

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Nombre completo</label>
                    <input type="text" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={nombre} onChange={function (ev) { setNombre(ev.target.value) }} />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Correo electrónico</label>
                    <input type="email" placeholder="correo@ejemplo.com" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={email} onChange={function (ev) { setEmail(ev.target.value) }} />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Contraseña</label>
                    <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={contra} onChange={function (ev) { setContra(ev.target.value) }} />
                </div>

                <div className="mb-6">
                    <label className="text-slate-700 mb-2 ml-1">Confirmar Contraseña</label>
                    <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={confirmarContra} onChange={function (ev) { setConfirmarContra(ev.target.value) }} />
                </div>

                <div className="mb-8">
                    <label className="text-slate-700 mb-2 ml-1">Rol</label>
                    <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                        value={rol} onChange={function (ev) { setRol(ev.target.value) }}>
                        <option value="1">Usuario</option>
                        <option value="2">Administrador</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        className="rounded-2xl bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition"
                        onClick={function () { navigate("/admin") }}>Cancelar</button>
                    <button
                        className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                        onClick={function () { enviarUsuarioNuevo() }}>Crear usuario</button>
                </div>
            </div>
        </div>)
}

export default CrearUsuarioForm
