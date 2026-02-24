import { useMemo, useState } from "react"

const TITLES = {
    category: "Categoria",
    date: "Fecha",
    amount: "Monto",
}

function FiltroPopUp({
    visible,
    section,
    categories,
    draftFilters,
    onChangeDraft,
    onApplySection,
    onClearSection,
    onClose,
}) {
    const [error, setError] = useState("")

    const title = TITLES[section] || "Filtros"

    const categoryOptions = useMemo(function () {
        if (!Array.isArray(categories)) return []
        return categories
            .filter(function (item) {
                return item?.id && item?.name
            })
            .sort(function (a, b) {
                return a.name.localeCompare(b.name, "es")
            })
    }, [categories])

    function validarSeccion() {
        if (section === "date") {
            const from = draftFilters?.date_from || ""
            const to = draftFilters?.date_to || ""
            if (from && to && from > to) {
                return "La fecha 'Desde' no puede ser mayor que 'Hasta'."
            }
        }

        if (section === "amount") {
            const min = draftFilters?.amount_min
            const max = draftFilters?.amount_max
            const hasMin = min !== "" && min !== null && min !== undefined
            const hasMax = max !== "" && max !== null && max !== undefined

            if (hasMin && Number(min) < 0) {
                return "El monto minimo no puede ser negativo."
            }
            if (hasMax && Number(max) < 0) {
                return "El monto maximo no puede ser negativo."
            }
            if (hasMin && hasMax && Number(min) > Number(max)) {
                return "El monto minimo no puede ser mayor que el maximo."
            }
        }

        return ""
    }

    function onApplyClick() {
        const errorValidacion = validarSeccion()
        setError(errorValidacion)
        if (errorValidacion) return
        onApplySection(section)
    }

    function onClearClick() {
        setError("")
        onClearSection(section)
    }

    if (!visible || !section) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end bg-slate-900/35 sm:items-start sm:justify-end sm:p-4"
            onClick={onClose}
        >
            <section
                onClick={function (ev) {
                    ev.stopPropagation()
                }}
                className="w-full max-h-[86vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:mt-16 sm:w-[26rem] sm:rounded-2xl"
            >
                <header className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                    >
                        X
                    </button>
                </header>

                {section === "category" && (
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={function () {
                                onChangeDraft("category_id", "")
                            }}
                            className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left hover:bg-slate-50"
                        >
                            <span className="font-medium text-slate-700">Todas</span>
                            <span className={draftFilters?.category_id === "" ? "h-5 w-5 rounded-full border-2 border-indigo-500 bg-indigo-500" : "h-5 w-5 rounded-full border-2 border-slate-300"} />
                        </button>

                        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                            {categoryOptions.map(function (category) {
                                const selected = draftFilters?.category_id === category.id
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={function () {
                                            onChangeDraft("category_id", category.id)
                                        }}
                                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left hover:bg-slate-50"
                                    >
                                        <span className="font-medium text-slate-700">{category.name}</span>
                                        <span className={selected ? "h-5 w-5 rounded-full border-2 border-indigo-500 bg-indigo-500" : "h-5 w-5 rounded-full border-2 border-slate-300"} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {section === "date" && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Desde</label>
                            <input
                                type="date"
                                value={draftFilters?.date_from || ""}
                                onChange={function (ev) {
                                    onChangeDraft("date_from", ev.target.value)
                                }}
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">Hasta</label>
                            <input
                                type="date"
                                value={draftFilters?.date_to || ""}
                                onChange={function (ev) {
                                    onChangeDraft("date_to", ev.target.value)
                                }}
                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>
                )}

                {section === "amount" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Min.</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={draftFilters?.amount_min ?? ""}
                                    onChange={function (ev) {
                                        onChangeDraft("amount_min", ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Max.</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={draftFilters?.amount_max ?? ""}
                                    onChange={function (ev) {
                                        onChangeDraft("amount_max", ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onApplyClick}
                        className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        Aplicar
                    </button>

                    <button
                        type="button"
                        onClick={onClearClick}
                        className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                        Limpiar
                    </button>
                </div>
            </section>
        </div>
    )
}

export default FiltroPopUp
