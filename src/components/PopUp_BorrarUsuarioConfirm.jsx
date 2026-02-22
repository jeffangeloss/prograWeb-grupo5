function PopUp_BorrarUsuario({ visible, onConfirm, onCancel, userName }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="w-11/12 max-w-sm rounded-2xl bg-white py-8 px-6 text-center shadow-2xl">
                <h3 className="mb-2 text-lg font-bold text-slate-800">¿Eliminar usuario?</h3>
                <p className="mb-6 text-slate-500">
                    Estás a punto de eliminar a <span className="font-semibold text-slate-700">{userName}</span>.
                    Esta acción no se puede deshacer.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-full border border-slate-300 px-5 py-2 font-medium text-slate-600 hover:bg-slate-50 transition">
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-full bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 shadow-md shadow-red-200 transition">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopUp_BorrarUsuario;