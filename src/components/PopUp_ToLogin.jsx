function PopUp_ToLogin({onLogout, mensaje, visible}) {

    return visible ?
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white px-5 py-8 text-center shadow-xl">
            <p className="mb-5 text-slate-500">{mensaje}</p>
            <button 
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            type="button">
                Regresar
            </button>
            
        </div>
    </div> : null
}

export default PopUp_ToLogin
