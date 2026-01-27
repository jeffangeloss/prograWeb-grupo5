import { useNavigate } from "react-router-dom"

function TablaAdmin() {
    const navigate = useNavigate()

    return <div className="border border-blue-900/50 mt-10 mx-8 rounded-2xl shadow-xl overflow-hidden min-w-full">
        <table className="text-xs bg-gray-800/50 text-gray-200 text-left min-w-full">
            <thead className="text-sm text-gray-200 bg-blue-900">
                <tr>
                    <th className="font-medium px-4 py-3">NOMBRE</th>
                    <th className="font-medium px-4 py-3">EMAIL</th>
                    <th className="font-medium px-4 py-3">ROL</th>
                    <th className="font-medium px-4 py-3">ÚLTIMO ACCESO</th>
                    <th className="font-medium px-4 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/50">
                <tr className="hover:bg-gray-500/50 transition">
                    <td className="px-4 py-4">Isabella Stanley</td>
                    <td className="px-4 py-4">ejemplo@usuario.com</td>
                    <td>
                        <span className="px-3 py-2 rounded-2xl text-blue-300 border border-blue-500">Usuario</span>
                    </td>
                    <td className="px-4 py-4">25/01/2025</td>
                    <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 text-xs rounded-xl bg-orange-300/30 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition"
                            onClick={function () { navigate("/editarUsuario") }}>Editar</button>
                    </td>
                </tr>
                <tr className="hover:bg-gray-500/50 transition">
                    <td className="px-4 py-4">Jose Blake</td>
                    <td className="px-4 py-4">ejemplo@admin.com</td>
                    <td>
                        <span className="px-3 py-2 rounded-2xl text-red-300 border border-red-500">Administrador</span>
                    </td>
                    <td className="px-4 py-4">21/01/2025</td>
                    <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 text-xs rounded-xl bg-orange-300/30 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition"
                        onClick={function () { navigate("/editarUsuario") }}>Editar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <span className="px-4 py-2 text-xs flex bg-gray-400/20 text-white justify-end">Usuarios: 2</span>
    </div>
}

export default TablaAdmin