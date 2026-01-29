import { useNavigate } from "react-router-dom"
import CargarTablaAdmin from "./CargarTablaAdmin"

function TablaAdmin({ usuarios }) {
    const navigate = useNavigate()

    return <div className="mt-10 mx-4">
        <div className="overflow-x-auto scroll rounded-lr-2xl rounded-t-2xl shadow-2xl">
            <table className="text-xs bg-[#7d7493]/15 text-slate-600 text-left min-w-full">
                <thead className="text-sm text-white bg-[#5645b6]">
                    <tr>
                        <th className="font-medium px-4 py-3">NOMBRE</th>
                        <th className="font-medium px-4 py-3">EMAIL</th>
                        <th className="font-medium px-4 py-3">ROL</th>
                        <th className="font-medium px-4 py-3">ÚLTIMO ACCESO</th>
                        <th className="font-medium px-4 py-3"></th>
                        <th className="font-medium px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    <CargarTablaAdmin listaUsuarios={usuarios} />
                </tbody>
            </table>

        </div>
        <span className="px-4 py-2 text-xs rounded-b-2xl flex bg-indigo-50 text-[#6c64a6] justify-end overflow-x-auto">Usuarios: {usuarios.length}</span>
    </div>
}

export default TablaAdmin