import { useNavigate} from "react-router-dom"

function NavBarUser({onLogout}) {
    const navigate = useNavigate()
    function cambiarContraseña() {
        navigate("/restablecer")
    }

    return <div className="bg-slate-100 px-4 py-3 sm:px-6 sm:py-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
            <img
                src="/img/user.jpg"
                alt="Usuario"
                className="h-10 w-10 rounded-full object-cover border border-blue-900/20" />
            <h1 className="text-lg font-semibold text-slate-700">Usuario</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                onClick={function () { cambiarContraseña() }}>Cambiar contraseña
            </button>

            <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                onClick={function (){
                    onLogout()
                }}>Cerrar sesión
            </button>
        </div>
    </div>
}

export default NavBarUser
