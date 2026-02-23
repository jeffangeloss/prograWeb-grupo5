function FiltroPopUp({ visible, onClose }) {

        return visible ?
                <div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        onClick={onClose}>
                        <div
                                onClick={(e) => e.stopPropagation()}
                                className="relative right-0 top-10 z-50 w-72 rounded-xl bg-white p-4 shadow-xl border border-slate-200">
                                <div className="my-1">
                                        <label className="text-sm font-medium text-slate-700">Categoría</label>
                                        <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
                                                <option>Cosa 1</option>
                                                <option>Cosa 2</option>
                                                <option>Cosa 3</option>
                                        </select>
                                </div>


                                <div className="my-1">
                                        <label className="text-sm font-medium text-slate-700">Fecha del egreso</label>
                                        <div className="mt-1 mb-2 flex items-center">
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

                                <button
                                        onClick={onClose}
                                        className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                        Aplicar filtros
                                </button>

                        </div>

                </div> : null


}

export default FiltroPopUp