import { useNavigate } from "react-router-dom"

function CargarTablaAdmin({ listaUsuarios }) {
    const navigate = useNavigate()

    return (
        listaUsuarios.map(function (usuario) {
            if (!usuario) {
                return null
            }
            return (
                <tr key={usuario.id} className="hover:bg-gray-500/20 transition">
                    <td className="px-4 py-4">{usuario.nombre}</td>
                    <td className="px-4 py-4">{usuario.email}</td>
                    <td>
                        <span className={usuario.rol == "Administrador" ? "border border-slate-500 px-3 py-2 rounded-2xl bg-slate-100 text-slate-600" : "px-3 py-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-blue-500"}
                        >{usuario.rol}</span>
                    </td>
                    <td className="px-4 py-4">{usuario.ultimoAcceso}</td>
                    <td className="px-3 py-4 text-right">
                        <button className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100 transition"
                            onClick={function () {
                                navigate("/seguridadUsuario", { state: usuario })
                            }}>Seguridad</button>
                    </td>
                    <td className="px-3 py-4 text-right">
                        <button className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-100 transition"
                            onClick={function () {
                                navigate("/editarUsuario", { state: usuario })
                            }}>Editar</button>
                    </td>
                    <td className="px-3 py-4 text-right">
                        <button className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition">
                            <img
                                src="img/trashbin.png"
                                alt="Eliminar"
                                className="w-4 h-4"
                            />
                        </button>
                    </td>
                </tr >
            )
        })
    )
}

export default CargarTablaAdmin
