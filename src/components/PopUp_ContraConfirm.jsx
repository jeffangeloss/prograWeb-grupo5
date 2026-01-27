function PopUp_ContraConfirm({visible}) {

    return visible ?
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-1/2 max-w-sm rounded-2xl bg-white py-8 px-5 text-center shadow-xl">
            <p className="mb-5 text-slate-500">Tu contraseña ha sido cambiada con éxito</p>
            <a href="#/"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Ir a iniciar sesión
            </a>
        </div>
    </div> : null
}

export default PopUp_ContraConfirm