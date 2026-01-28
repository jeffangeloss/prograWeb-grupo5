import { useState } from "react"
import EgresosForm from "../components/EgresosForm"
import NavBarUser from "../components/NavBarUser"
import { useNavigate } from "react-router-dom"
import FiltroPopUp from "../components/FiltroPopUp"

function EgresosPage() {

    const navigate = useNavigate()
    const [openFiltro, setOpenFiltro] = useState(false)

    return <div className="bg-slate-50 text-slate-800 lg:h-screen lg:overflow-hidden">
        <NavBarUser />

        <main className="min-h-screen lg:h-screen lg:flex lg:items-start lg:justify-center p-4 md:p-6 pt-2 sm:pt-3 lg:pt-2">
            <div className="w-full max-w-6xl mx-auto grid gap-4 lg:grid-cols-[340px_1fr]">
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

                    <div className="space-y-1">
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-700">
                            REGISTRAR EGRESO
                        </h2>
                        <p className="text-sm text-slate-500">
                            Completa los campos y guarda el gasto asociado a tu sesión.
                        </p>
                    </div>
                    <EgresosForm />
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight text-slate-700">
                                MIS EGRESOS
                            </h2>
                            <p className="text-sm text-slate-500">Total registrado: S/ 0.00</p>
                        </div>

                        <div className="flex items-center gap-3 mt-2 md:m-0 relative">

                            <button
                                onClick={function () {
                                    setOpenFiltro(true)
                                }}
                                className="focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:bg-slate-200 rounded-md p-0.5" type="button">
                                <img
                                    className="w-7"
                                    src="https://cdn-icons-png.flaticon.com/256/11462/11462900.png" alt="Filtro"
                                />
                            </button>

                            <FiltroPopUp visible={openFiltro} onClose={ function(){
                                setOpenFiltro(false)
                            }}/>

                            <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                                1 registro
                            </span>

                        </div>

                    </div>

                    <div className="mt-4 overflow-x-auto lg:max-h-[50vh] lg:overflow-y-auto hidden sm:block">
                        <table className="min-w-[720px] text-left text-sm text-slate-700">
                            <thead className="border-b border-slate-200/80 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Descripción</th>
                                    <th className="px-4 py-3 text-right">Monto</th>
                                    <th className="px-4 py-3">Registrado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="px-4 py-3">27/01/2026</td>
                                    <td className="px-4 py-3">Alimentación</td>
                                    <td className="px-4 py-3">Compra supermercado</td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        S/ 85.50
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        Hoy
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                            onClick={function () {
                                                navigate("/editarEgreso")
                                            }}>
                                            Editar egreso
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    </div>
}

export default EgresosPage
