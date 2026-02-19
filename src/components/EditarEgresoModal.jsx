function EditarEgresoModal({ onClose }) {

    function handleSubmit(e) {
        e.preventDefault()
        // aquí luego conectas tu lógica para actualizar el egreso
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {/* click fuera para cerrar */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <section className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-4 sm:p-5 animate-fadeIn">
                
                {/* HEADER */}
                <div className="space-y-1 mb-4">
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-700 text-center">
                        EDITAR EGRESO
                    </h1>
                    <p className="text-sm text-slate-500 text-center">
                        Modifica la información del egreso seleccionado.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Monto
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            placeholder="250.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Categoría
                        </label>
                        <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            required
                        >
                            <option value="">Seleccione</option>
                            <option>Alimentación</option>
                            <option>Transporte</option>
                            <option>Servicios</option>
                            <option>Salud</option>
                            <option>Educación</option>
                            <option>Otros</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Fecha
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Nota
                        </label>
                        <textarea
                            rows="3"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            placeholder="Ej: Compra de ropa"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="flex-1 rounded-full bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                        >
                            Guardar cambios
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border border-slate-300 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default EditarEgresoModal
