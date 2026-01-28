import { useNavigate } from "react-router-dom";

function SeguridadUSuariosPage() {
    const navigate = useNavigate();

    return <div className="bg-slate-50 text-slate-800 min-h-screen">
        <div className="bg-slate-100 px-6 py-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src="/public/img/admin.jpg" alt="Admin" className="h-10 w-10 rounded-full object-cover border border-blue-200" />
                <h1 className="text-lg font-semibold text-slate-700">Administrador</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-6 py-2.5 rounded-full border border-blue-300 text-blue-700 hover:bg-blue-50 transition">
                    Usuarios
                </button>
                <button className="px-6 py-2.5 rounded-full border border-blue-300 text-blue-700 hover:bg-blue-50 transition" onClick={function() {navigate("/")}}>
                    Cerrar sesión
                </button>
            </div>
        </div>

        <main className="p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800">Historial de acceso</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Auditar accesos de un usuario específico.
                </p>

                <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
                    <img src="/public/img/user.jpg" alt="Usuario"
                        className="h-12 w-12 rounded-full object-cover border border-blue-200" />
                    <div>
                        <p className="text-sm text-slate-500">Usuario</p>
                        <h3 className="text-lg font-semibold text-slate-800">Isabella Stanley</h3>
                        <p className="text-sm text-slate-500">ejemplo@usuario.com</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto] items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-500">Acción</label>
                        <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                            <option>TODAS</option>
                            <option>LOGIN_SUCCESS</option>
                            <option>LOGIN_FAIL</option>
                            <option>LOGOUT</option>
                        </select>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">
                        Actualizar
                    </button>
                </div>

                <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="min-w-full text-left text-sm text-slate-700">
                        <thead className="border-b border-slate-200/80 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Navegador</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Hora</th>
                                <th className="px-4 py-3">Acción</th>
                                <th className="px-4 py-3">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100">
                                <td className="px-4 py-3 text-slate-600">Chrome</td>
                                <td className="px-4 py-3 text-slate-600">25/01/2025</td>
                                <td className="px-4 py-3 text-slate-600">08:14</td>
                                <td className="px-4 py-3">LOGIN_SUCCESS</td>
                                <td className="px-4 py-3">
                                    <span
                                        className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">OK</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-slate-600">Edge</td>
                                <td className="px-4 py-3 text-slate-600">25/01/2025</td>
                                <td className="px-4 py-3 text-slate-600">08:10</td>
                                <td className="px-4 py-3">LOGIN_FAIL</td>
                                <td className="px-4 py-3">
                                    <span
                                        className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">FAIL</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="px-4 py-3 text-xs text-slate-500 text-right">
                        Registros: 2
                    </div>
                </div>
            </div>
        </main>
    </div>
}

export default SeguridadUSuariosPage;