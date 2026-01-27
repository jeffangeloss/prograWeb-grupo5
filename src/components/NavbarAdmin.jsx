import { useNavigate } from "react-router-dom"

function NavBarAdmin() {
    const navigate = useNavigate()

    return <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 shadow-xl flex sm:justify-between ">
        <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" className="h-10" />
        <div className="flex gap-4">
            <button type="button"
                className="px-8 py-2.5 rounded-full border border-white text-white hover:bg-blue-100/50 transition text-sm sm:text-base">Usuario</button>
            <button type="button"
                className="px-8 py-2.5 rounded-full border border-white text-white hover:bg-blue-100/50 transition text-sm sm:text-base">Dashboard</button>
                {/* Este botón esta para la parte donde salen las métricas de los usuarios mensaules y tal*/}
            <button type="button"
                className="px-8 py-2.5 rounded-full border border-white text-white hover:bg-blue-100/50 transition text-sm sm:text-base"
                onClick={function () { navigate("/") }}>Cerrar sesión</button>
        </div>

    </div>
}

export default NavBarAdmin