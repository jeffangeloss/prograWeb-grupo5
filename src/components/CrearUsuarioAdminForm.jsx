import { useNavigate } from "react-router-dom"

function CrearUsuarioForm() {
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
                <label className="text-white mb-2 ml-1">Contraseña</label>
                <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-6">
                <label className="text-white mb-2 ml-1">Confirmar Contraseña</label>
                <input type="password" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-8">
                <label className="text-white mb-2 ml-1">Rol</label>
                <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black">
                    <option>Usuario</option>
                    <option>Administrador</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    className="px-4 py-2 rounded-xl bg-gray-300 text-gray-700 border border-gray-300 hover:bg-gray-50/30 transition"
                    onClick={() => navigate("/admin")}>Cancelar</button>

                <button
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white border border-blue-900 hover:bg-blue-700/30 shadow-md transition"
                    onClick={() => navigate("/admin")}>Crear usuario</button>
            </div>
        </div>
    </div>
}

export default CrearUsuarioForm
