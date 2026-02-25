import RoleBadge from "./RoleBadge"
import { normalizeRoleValue, roleLabel } from "../utils/roles"

function UserCard({ usuario, imgSrc = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png", label = "Usuario", role }) {
    const roleValue = normalizeRoleValue(role || usuario?.role || usuario?.role_value || usuario?.rol)
    const labelText = label || roleLabel(roleValue)

    return <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
        <img
            src={imgSrc}
            alt={labelText}
            className="h-12 w-12 rounded-full object-cover border border-blue-200"
        />
        <div>
            <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500">{labelText}</p>
                <RoleBadge role={roleValue} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{usuario?.nombre}</h3>
            <p className="text-sm text-slate-500">{usuario?.email}</p>
        </div>
    </div>
}

export default UserCard
