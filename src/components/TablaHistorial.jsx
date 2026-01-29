function TablaHistorial({ logs }) {
    return <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ">
        <div className="w-full overflow-x-auto md:overflow-visible">
            <table className="min-w-[640px] md:min-w-full w-full text-left text-sm text-slate-700">
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
                    {logs.map(function (log, i) {
                        return (
                            <tr key={i} className="border-b border-slate-100">
                                <td className="px-4 py-3 text-slate-600">{log.navegador}</td>
                                <td className="px-4 py-3 text-slate-600">{log.fecha}</td>
                                <td className="px-4 py-3 text-slate-600">{log.hora}</td>
                                <td className="px-4 py-3">{log.accion}</td>
                                <td className="px-4 py-3">
                                    <span className={
                                        log.resultado === "OK"
                                            ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                                            : "inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"
                                    }>
                                        {log.resultado}
                                    </span>
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