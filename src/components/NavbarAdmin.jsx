import { useNavigate, useLocation } from "react-router-dom"

function NavBarAdmin() {
    const navigate = useNavigate()
    const location = useLocation()

    const enEstadisticas = location.pathname === "/estadisticas"
    const enDashboard = location.pathname === "/admin"

    return <div className="bg-slate-100 px-4 py-3 shadow-md flex flex-row justify-between">
        <div className="flex items-center gap-3">
            <img
                src="/public/img/admin.jpg"
                alt="Administrador"
                className="h-10 w-10 rounded-full object-cover border border-blue-900/20" />
            <h1 className="text-lg font-semibold text-slate-700">Administrador</h1>
        </div>
        <div className="flex gap-4">
            {!enEstadisticas && (
                <button type="button"
                    className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                    onClick={function () { navigate("/estadisticas") }}>Estadísticas de usuarios</button>
            )}
            {!enDashboard && (
                <button type="button"
                    className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                    onClick={function () { navigate("/admin") }}>Dashboard</button>
            )}
            <button type="button"
                className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                onClick={function () { navigate("/") }}>Cerrar sesión</button>
        </div>

    </div>
}

export default NavBarAdmin