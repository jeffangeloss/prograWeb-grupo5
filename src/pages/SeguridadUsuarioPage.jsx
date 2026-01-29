import NavBarAdmin from "../components/NavBarAdmin";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"
import UserCard from "../components/UserCard"
import FilterHistorial from "../components/FilterHistorial";
import TablaHistorial from "../components/TablaHistorial"

function SeguridadUsuarioPage() {
    const { state: usuario } = useLocation()
    const [accion, setAccion] = useState("TODAS")

    const logs = [
        {
            navegador: "Chrome",
            fecha: usuario?.ultimoAcceso || "—",
            hora: "—",
            accion: "LOGIN_SUCCESS"
        },
        { navegador: "Edge", fecha: "25/01/2025", hora: "08:10", accion: "LOGIN_FAIL" },
        { navegador: "Firefox", fecha: "24/01/2025", hora: "22:50", accion: "LOGOUT" }
    ]


    const rol = usuario?.rol || "Usuario"
    const img = rol === "Administrador" ? "/img/admin.jpg" : "/img/user.jpg"
    const label = rol === "Administrador" ? "Administrador" : "Usuario"


    function aplicarFiltro(accionSeleccionada) {
        setAccion(accionSeleccionada)
    }

    function filtrarLogs() {
        if (accion === "TODAS") return logs
        return logs.filter(function (l) {
            return l.accion === accion
        })
    }

    return <div className="bg-slate-50 text-slate-800 min-h-screen">
        <NavBarAdmin />
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800">Historial de acceso</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Auditar accesos de un usuario específico.
                </p>

                <UserCard usuario={usuario} imgSrc={img} label={label} />

                <FilterHistorial onFiltro={aplicarFiltro} />
                <TablaHistorial logs={filtrarLogs()} />
            </div>
        </div>
    </div>
}

export default SeguridadUsuarioPage;