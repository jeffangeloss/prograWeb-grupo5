import { useNavigate } from "react-router-dom"

function NavBarAdmin() {
    const navigate = useNavigate()

    return <div className="bg-slate-100 px-6 py-4 shadow-md flex flex-row justify-between">
        <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" className="h-10" />
        <div className="flex gap-4">
            <button type="button"
                className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition">Perfil</button>
            <button type="button"
                className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition">Dashboard</button>
            <button type="button"
                className="px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                onClick={function () { navigate("/") }}>Cerrar sesión</button>
        </div>

    </div>
}

export default NavBarAdmin