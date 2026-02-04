import { useLocation, useNavigate } from "react-router-dom"

function EditarUsuarioForm() {
    const navigate = useNavigate()
    const { state: usuario } = useLocation()

    return <div className="flex justify-center p-4">

        <div className="rounded-2xl shadow-xl p-8 max-w-full">
            <div className="mb-6">
                <label className="text-slate-700 mb-2 ml-1">Nombre completo</label>
                <input type="text" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" value={usuario.nombre} />
            </div>

            <div className="mb-6">
                <label className="text-slate-700 mb-2 ml-1">Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" value={usuario.email} />
            </div>

            <div className="mb-6">
                <label className="text-slate-700mb-2 ml-1">Rol</label>
                <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" value={usuario.rol}>
                    <option>Usuario</option>
                    <option>Administrador</option>
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
                    onClick={function () { navigate("/admin") }}>Guardar cambios</button>
            </div>
        </div>
    </div>
}

export default EditarUsuarioForm