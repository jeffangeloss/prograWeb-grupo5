import { useNavigate } from "react-router-dom"
import CargarTablaAdmin from "./CargarTablaAdmin"

function TablaAdmin({ usuarios }) {
    const navigate = useNavigate()

    return <div className="mt-10 mx-4 rounded-2xl shadow-2xl overflow-hidden w-fit">
        <table className="text-xs bg-[#7d7493]/25 text-slate-600 text-left">
            <thead className="text-sm text-white bg-[#4d447e]">
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
                <CargarTablaAdmin listaUsuarios={usuarios}/>
            </tbody>
        </table>
        <span className="px-4 py-2 text-xs flex bg-indigo-50 text-[#6c64a6] justify-end">Usuarios: {usuarios.length}</span>
    </div>
}

export default TablaAdmin