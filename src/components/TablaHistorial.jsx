import AccionBadge from "./AccionBadge"

function TablaHistorial({ logs }) {
    return <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ">
        <div className="w-full overflow-x-auto md:overflow-visible">
            <table className="min-w-[640px] md:min-w-full w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200/80 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-4 py-3">Navegador</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Hora</th>
                        <th className="px-4 py-3 w-[180px]">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(function (log, i) {
                        return (
                            <tr key={i} className="border-b border-slate-100">
                                <td className="px-4 py-3 text-slate-600">{log.navegador}</td>
                                <td className="px-4 py-3 text-slate-600">{log.fecha}</td>
                                <td className="px-4 py-3 text-slate-600">{log.hora}</td>
                                <td className="px-4 py-3 w-[180px]">
                                    <AccionBadge accion={log.accion} />
                                </td>

                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 text-right">
            Registros: {logs.length}
        </div>
    </div>
}

export default TablaHistorial