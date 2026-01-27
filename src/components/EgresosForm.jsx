import { useState } from "react"
import Mensaje from "./Mensaje"

function EgresosForm({ onComplete }) {
    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")

    const [Fecha, setFecha] = useState("")
    const [Monto, setMonto] = useState("")
    const [categoria, setCategoria] = useState("")
    const [Descripcion, setDescripcion] = useState("")

    function validarCampos() {
        if (!Fecha || !Monto || !categoria || !Descripcion) {
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



    return <div>
        <form className="mt-4 space-y-3">
            <div className="space-y-1">
                <label for="fecha" className="text-sm font-medium text-slate-700">Fecha</label>
                <input id="fecha" name="fecha" type="date"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    required value={Fecha} onChange={function (ev) {
                        setFecha(ev.target.value)
                    }} />
            </div>

            <div className="space-y-1">
                <label for="monto" className="text-sm font-medium text-slate-700">Monto</label>
                <input id="monto" name="monto" type="number" step="0.01" min="0" placeholder="250.00"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    required value={Monto} onChange={function (ev) {
                        setMonto(ev.target.value)
                    }} />
            </div>

            <div className="space-y-1">
                <label for="categoria" className="text-sm font-medium text-slate-700">Categoría</label>
                <select id="categoria" name="categoria"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    required value={categoria} onChange={function (ev) {
                        setCategoria(ev.target.value)
                    }} >
                    <option value="">Seleccione</option>
                    <option>Alimentación</option>
                    <option>Transporte</option>
                    <option>Servicios</option>
                    <option>Salud</option>
                    <option>Educación</option>
                    <option>Otros</option>
                </select>
            </div>

            <div className="space-y-1">
                <label for="descripcion" className="text-sm font-medium text-slate-700">Descripción</label>
                <textarea id="descripcion" name="descripcion" rows="3" placeholder="Ej: Taxi al aeropuerto"
                    className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    required value={Descripcion} onChange={function (ev) {
                        setDescripcion(ev.target.value)
                    }}></textarea>
            </div>

            <Mensaje msg={mensaje} visible={mensajeVisible} />

            <div className="mt-3 flex items-center gap-2">
                <button type="button"
                    className="flex-1 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300" onClick={function () {
                        if (validarCampos()) {
                            onComplete(Fecha, Monto, categoria, Descripcion)
                        }
                    }}
                >
                    Guardar egreso
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-full border border-indigo-400 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    onClick={limpiarFormulario}>Limpiar
                </button>
            </div>
        </form>
    </div>
}

export default EgresosForm;