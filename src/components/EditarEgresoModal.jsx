import { useState } from "react"

function EditarEgresoModal({ onClose, egreso, categories, onUpdated }) {

    const [amount, setAmount] = useState(egreso.amount)
    const [categoryId, setCategoryId] = useState(egreso.category_id)
    const [date, setDate] = useState(egreso.expense_date.slice(0, 10))
    const [description, setDescription] = useState(egreso.description)

    async function handleSubmit(e) {
        e.preventDefault()

        const URL = `http://127.0.0.1:8000/expenses/${egreso.id}`

        const body = {}

        if (amount !== "" && amount !== null) {
            body.amount = Number(amount)
        }

        if (categoryId) {
            body.category_id = categoryId
        }

        if (date) {
            body.expense_date = new Date(date).toISOString()
        }

        if (description !== undefined) {
            body.description = description
        }

        try {
            const resp = await fetch(URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": localStorage.getItem("TOKEN")
                },
                body: JSON.stringify(body)
            })

            const data = await resp.json()

            if (!resp.ok) {
                throw new Error(data.detail || "Error actualizando")
            }

            if (onUpdated) {
                onUpdated(data.data)
            }

            onClose()

        } catch (err) {
            console.error(err)
            alert("Error editando egreso")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <section className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-4 sm:p-5 animate-fadeIn">
                <div className="space-y-1 mb-4">
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-700 text-center">
                        EDITAR EGRESO
                    </h1>
                    <p className="text-sm text-slate-500 text-center">
                        Modifica la información del egreso seleccionado.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Monto
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            required
                        >
                            <option value="">Seleccione</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Nota
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            placeholder="Ej: Compra de ropa"
                        />
                    </div>

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