import { useNavigate } from "react-router-dom"

function CargarTablaAdmin({ listaUsuarios }) {
    const navigate = useNavigate()

    return (
            listaUsuarios.map(function (usuario) {
                return (
                    <tr key={usuario.id} className="hover:bg-indigo-50/20 transition">
                        <td className="px-4 py-4">{usuario.nombre}</td>
                        <td className="px-4 py-4">{usuario.email}</td>
                        <td>
                            <span className= {usuario.rol == "Administrador" ? "px-3 py-2 rounded-2xl text-red-300 border border-red-500" : "px-3 py-2 rounded-2xl text-blue-300 border border-blue-500"}
                            >{usuario.rol}</span>
                        </td>
                        <td className="px-4 py-4">{usuario.ultimoAcceso}</td>
                        <td className="px-6 py-4 text-right">
                            <button className="px-3 py-1.5 text-xs rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-800/50 transition"
                                onClick={function () { navigate("/seguridadUsuario") }}>Seguridad</button>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="px-3 py-1.5 text-xs rounded-xl bg-orange-300/30 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition"
                                onClick={function () { navigate("/editarUsuario") }}>Editar</button>
                        </td>
                    </tr>
                )
            })
    )
}

export default CargarTablaAdmin
