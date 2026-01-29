import { useNavigate } from "react-router-dom"

function EditarUsuarioForm() {
    const navigate = useNavigate()

    return <div>

        <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 min-w-xl lg:min-w-2xl place-self-center">
            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Nombre completo</label>
                <input type="text" placeholder="Nombre del usuario" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Correo electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Rol</label>
                <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black">
                    <option>Usuario</option>
                    <option>Administrador</option>
                </select>
            </div>

            <div className="mb-8">
                <label className="text-white mb-2 ml-1">Último acceso</label>
                <input type="text" placeholder="Fecha último acceso" disabled className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-gray-300 text-gray-600"
                />
            </div>

            <div className="flex justify-between pt-4">
                <button className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition">Eliminar</button>

                <div className="flex gap-4">
                    <button className="rounded-2xl bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition"
                    onClick={function() {navigate("/admin")}}>Cancelar</button>
                    <button className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    onClick={function() {navigate("/admin")}}>Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>
}

export default EditarUsuarioForm