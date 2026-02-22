import { useNavigate } from "react-router-dom"

function NavBarUser({ onLogout }) {
    const navigate = useNavigate()

    function cambiarContrasena() {
        navigate("/mi-contrasena")
    }

    function obtenerDatosSesion() {
        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function nombreDesdeCorreo(correo) {
        if (!correo) {
            return "Usuario"
        }

        const localPart = correo.split("@")[0] || ""
        const limpio = localPart.replace(/[._-]+/g, " ").trim()

        if (!limpio) {
            return "Usuario"
        }

        return limpio
            .split(" ")
            .filter(Boolean)
            .map(function (p) {
                return p.charAt(0).toUpperCase() + p.slice(1)
            })
            .join(" ")
    }

    const sesion = obtenerDatosSesion()
    const correoUsuario = sesion?.correo || "usuario@correo.com"
    const nombreUsuario = sesion?.nombre || nombreDesdeCorreo(correoUsuario)

    return (
        <div className="bg-slate-100 px-4 py-3 sm:px-6 sm:py-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src="/img/user.jpg"
                    alt="Usuario"
                    className="h-10 w-10 rounded-full object-cover border border-blue-900/20"
                />

                <div className="min-w-0 leading-tight">
                    <h1 className="text-base sm:text-lg font-semibold text-slate-700 truncate">{nombreUsuario}</h1>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{correoUsuario}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                    onClick={function () {
                        cambiarContrasena()
                    }}
                >
                    Cambiar contraseña
                </button>

                <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                    onClick={function () {
                        onLogout()
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}

export default NavBarUser
