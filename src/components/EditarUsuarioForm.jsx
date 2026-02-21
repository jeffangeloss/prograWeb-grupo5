import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function EditarUsuarioForm() {
    const navigate = useNavigate()
    const { state: usuario } = useLocation()
    const [nombre, setNombre] = useState(usuario.nombre)
    const [email, setEmail] = useState(usuario.email)
    const [rol, setRol] = useState(usuario.rol == "admin" ? "2" : "1")

    async function guardarCambios() {
        const usuarioEditado = {
            nombre: nombre,
            email: email,
            type: parseInt(rol)
        }

        const URL = `http://127.0.0.1:8000/admin/${usuario.id}`
        const response = await fetch(URL, {
            method: "PATCH",
            body: JSON.stringify(usuarioEditado),
            headers: {
                "content-type": "application/json",
                "x-token": localStorage.getItem("TOKEN")
            }
        })

        const data = await response.json()

        if (!response.ok) {
            alert("Error al actualizar: " + data.detail)
            return
        }

        alert("Usuario actualizado correctamente")
        navigate("/admin")
    }


    return <div className="flex justify-center p-4">

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
                <label className="text-slate-700mb-2 ml-1">Rol</label>
                <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black"
                    value={rol} onChange={function (ev) { setRol(ev.target.value) }}>
                    <option value="1">Usuario</option>
                    <option value="2">Administrador</option>
                </select>
            </div>

            <div className="mb-8">
                <label className="text-slate-700 mb-2 ml-1">Último acceso</label>
                <input type="text" placeholder="Fecha último acceso" disabled className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-gray-300 text-gray-600" value={usuario.ultimoAcceso} />
            </div>

            <div className="flex gap-4 justify-end">
                <button className="rounded-2xl bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition"
                    onClick={function () { navigate("/admin") }}>Cancelar</button>
                <button className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    onClick={function () { guardarCambios() }}>Guardar cambios</button>
            </div>
        </div>
    </div>
}

export default EditarUsuarioForm