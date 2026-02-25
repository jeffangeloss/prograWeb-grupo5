import { useNavigate } from "react-router-dom"
import RoleBadge from "./RoleBadge"
import { canDeleteTarget, canEditTarget, normalizeRoleValue } from "../utils/roles"

const imagen = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771998697/trashbin_gwh0cl.png"

function CargarTablaAdmin({ listaUsuarios, borrarUsuario, actorRole }) {
    const navigate = useNavigate()

    return (
        listaUsuarios.map(function (usuario) {
            if (!usuario) {
                return null
            }

            const targetRole = normalizeRoleValue(usuario.role || usuario.role_value || usuario.rol, usuario.type)
            const actor = normalizeRoleValue(actorRole)
            const isSelf = Boolean(usuario.isSelf)
            const puedeEditar = canEditTarget(actor, targetRole)
            const puedeBorrar = canDeleteTarget(actor, targetRole, isSelf)

            return (
                <tr key={usuario.id} className="hover:bg-gray-500/20 transition">
                    <td className="px-4 py-4">{usuario.full_name}</td>
                    <td className="px-4 py-4">{usuario.email}</td>
                    <td>
                        <RoleBadge role={targetRole} />
                    </td>
                    <td className="px-4 py-4">{usuario.ultimoAcceso}</td>
                    <td className="px-3 py-4 text-right">
                        <button className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100 transition"
                            onClick={function () {
                                navigate("/seguridadUsuario", { state: usuario })
                            }}>Seguridad</button>
                    </td>
                    <td className="px-3 py-4 text-right">
                        {puedeEditar ? (
                            <button className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-100 transition"
                                onClick={function () {
                                    navigate("/editarUsuario", { state: usuario })
                                }}>Editar</button>
                        ) : (
                            <span className="text-xs text-slate-400">Sin permiso</span>
                        )}
                    </td>
                    <td className="px-3 py-4 text-right">
                        {puedeBorrar ? (
                            <button className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition"
                                onClick={function () { borrarUsuario(usuario) }}>
                                <img
                                    src={imagen}
                                    alt="Eliminar"
                                    className="w-4 h-4 size-auto"
                                />
                            </button>
                        ) : (
                            <span className="text-xs text-slate-400">Sin permiso</span>
                        )}
                    </td>
                </tr >
            )
        })
    )
}

export default CargarTablaAdmin
