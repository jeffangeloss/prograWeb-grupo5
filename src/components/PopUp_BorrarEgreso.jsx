function EliminarEgresoPopUp({ visible, onClose, onConfirm, egresoNombre }) {
    if (!visible) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900">¿Eliminar este egreso?</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Estás a punto de eliminar <span className="font-semibold text-slate-700">{egresoNombre || "este registro"}</span>. 
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <button
                        onClick={onConfirm}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-red-700 active:scale-95 transition-all"
                    >
                        Sí, eliminar registro
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                    >
                        No, mantener
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EliminarEgresoPopUp;