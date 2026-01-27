import { useNavigate } from "react-router-dom"
import CargarTablaAdmin from "./CargarTablaAdmin"

function TablaAdmin({ usuarios }) {
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
            <tbody className="divide-y divide-blue-900/50 text-gray-200">
                <CargarTablaAdmin listaUsuarios={usuarios}/>
            </tbody>
        </table>
        <span className="px-4 py-2 text-xs flex bg-gray-400/20 text-gray-200 justify-end">Usuarios: {usuarios.length}</span>
    </div>
}

export default TablaAdmin