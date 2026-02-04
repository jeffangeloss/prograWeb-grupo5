function FiltroPopUp({ visible, onClose }) {

        return visible ?
                <div
                        className="fixed inset-0 z-50 flex items-center justify-end mr-10"
                        onClick={onClose}>
                        <div
                                onClick={(e) => e.stopPropagation()}
                                className="right-0 top-10 z-50 w-72 rounded-xl bg-white p-4 shadow-xl border border-slate-200">
                                <div className="space-y-4">
                                        <label className="text-sm font-medium text-slate-700">Categoría</label>
                                        <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
                                                <option>Cosa 1</option>
                                                <option>Cosa 2</option>
                                                <option>Cosa 3</option>
                                        </select>
                                </div>


                                <div className="space-y-4">

                                        <div className="mt-3 mb-2 flex items-center">

                                                <label className="ml-2 mr-3 text-sm font-medium text-slate-700">Desde:</label>
                                                <input type="date"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                                        required />
                                        </div>
                                        <div className="mb-2 flex items-center">
                                                <label className="ml-2 mr-4 text-sm font-medium text-slate-700">Hasta:</label>
                                                <input type="date"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                                        required />
                                        </div>

                                </div>

                                <div className="space-y-4">
                                        <label className="text-sm font-medium text-slate-700">Monto</label>
                                        <div className="mt-3 mb-2 flex items-center">

                                                <label className="ml-2 mr-3 text-sm font-medium text-slate-700">Desde:</label>
                                                <input type="number"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                                        required />
                                        </div>
                                        <div className="mb-2 flex items-center">
                                                <label className="ml-2 mr-4 text-sm font-medium text-slate-700">Hasta:</label>
                                                <input type="number"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                                        required />
                                        </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-3">
                                        <button
                                                onClick={onClose}
                                                className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        >
                                                Aplicar filtros
                                        </button>

                                        <button
                                                onClick={onClose}
                                                className="w-full rounded-full bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                        >
                                                Eliminar filtros
                                        </button>
                                </div>


                        </div>

                </div> : null
}

export default FiltroPopUp