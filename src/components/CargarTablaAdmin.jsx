import { useNavigate } from "react-router-dom"

function CargarTablaAdmin({ listaUsuarios, borrarUsuario }) {
    const navigate = useNavigate()

    return (
        listaUsuarios.map(function (usuario) {
            if (!usuario) {
                return null
            }
            return (
                <tr key={usuario.id} className="hover:bg-gray-500/20 transition">
                    <td className="px-4 py-4">{usuario.full_name}</td>
                    <td className="px-4 py-4">{usuario.email}</td>
                    <td>
                        <span className={usuario.role == "admin" ? "capitalize border border-slate-500 px-3 py-2 rounded-2xl bg-slate-100 text-slate-600" : "capitalize px-3 py-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-blue-500"}
                        >{usuario.role}</span>
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
                        <button className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition"
                            onClick={function () { borrarUsuario(usuario.id) }}>
                            <img
                                src="img/trashbin.png"
                                alt="Eliminar"
                                className="w-4 h-4 size-auto"
                            />
                        </button>
                    </td>
                </tr >
            )
        })
    )
}

export default CargarTablaAdmin
