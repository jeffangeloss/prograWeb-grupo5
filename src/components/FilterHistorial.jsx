import { useState } from "react"

function FilterHistorial({ onFiltro }) {
    const [accionSeleccionada, setAccionSeleccionada] = useState("TODAS")

    return <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto] items-end">
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">Acción</label>
            <select
                value={accionSeleccionada}
                onChange={function (e) { setAccionSeleccionada(e.target.value) }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
                <option>TODAS</option>
                <option>LOGIN_SUCCESS</option>
                <option>LOGIN_FAIL</option>
                <option>LOGOUT</option>
            </select>
        </div>

        <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
            onClick={function () { onFiltro(accionSeleccionada) }}
        >
            Actualizar
        </button>
    </div>
}

export default FilterHistorial
