import { useState } from "react"
import Mensaje from "./Mensaje"

function EgresosForm({ onComplete }) {
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")

    const [fecha, setFecha] = useState("")
    const [monto, setMonto] = useState("")
    const [categoria, setCategoria] = useState("")
    const [descripcion, setDescripcion] = useState("")

    function validarCampos() {
        if (!fecha || !monto || !categoria || !descripcion) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            return false
        }

        setMensaje("")
        setMensajeVisible(false)
        return true
    }

    function limpiarFormulario() {
        setFecha("")
        setMonto("")
        setCategoria("")
        setDescripcion("")
        setMensaje("")
        setMensajeVisible(false)
    }

    function guardarEgreso() {
        if (!validarCampos()) {
            return
        }

        if (typeof onComplete === "function") {
            onComplete(fecha, monto, categoria, descripcion)
        }

        limpiarFormulario()
    }

    return (
        <div>
            <form className="mt-4 space-y-3">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Fecha</label>
                    <input
                        type="date"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        required
                        value={fecha}
                        onChange={function (ev) {
                            setFecha(ev.target.value)
                        }}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Monto</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="250.00"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        required
                        value={monto}
                        onChange={function (ev) {
                            setMonto(ev.target.value)
                        }}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Categoria</label>
                    <select
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        required
                        value={categoria}
                        onChange={function (ev) {
                            setCategoria(ev.target.value)
                        }}
                    >
                        <option value="">Seleccione</option>
                        <option>Alimentacion</option>
                        <option>Transporte</option>
                        <option>Servicios</option>
                        <option>Salud</option>
                        <option>Educacion</option>
                        <option>Otros</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Descripcion</label>
                    <textarea
                        rows="3"
                        placeholder="Ej: Pollito a la brasa"
                        className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        required
                        value={descripcion}
                        onChange={function (ev) {
                            setDescripcion(ev.target.value)
                        }}
                    />
                </div>

                <Mensaje msg={mensaje} visible={mensajeVisible} />

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        className="flex-1 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onClick={guardarEgreso}
                    >
                        Guardar egreso
                    </button>

                    <button
                        type="button"
                        className="flex-1 rounded-full border border-indigo-400 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onClick={limpiarFormulario}
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EgresosForm

