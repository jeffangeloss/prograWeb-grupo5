import { useNavigate } from "react-router-dom"

function EditarEgresoPage() {

    const navigate = useNavigate()

    return (
        <div className="bg-slate-50 text-slate-800 min-h-screen flex items-start justify-center p-4 md:p-6">
            <section className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

                <div className="space-y-1 mb-4">
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-700 text-center">
                        EDITAR EGRESO
                    </h1>
                    <p className="text-sm text-slate-500 text-center">
                        Modifica la información del egreso seleccionado.
                    </p>
                </div>

                <form className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Monto
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="250.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Categoría
                        </label>
                        <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
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
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Nota
                        </label>
                        <textarea
                            rows="3"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Ej: Compra de ropa"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 rounded-full bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition">
                        Guardar cambios
                    </button>

                    <button
                        type="button"
                        className="mt-2 text-sm text-slate-500 underline text-center hover:text-slate-700"
                        onClick={function () {
                            navigate("/user") }}>
                        Cancelar
                    </button>
                </form>
            </section>
        </div>
    )
}

export default EditarEgresoPage
