function YaTienesCuenta() {
    return (
        <div className="absolute top-6 right-6 flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">¿Ya tienes una cuenta?</span>
            <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
                Iniciar sesión
            </a>
        </div>
    );
}
export default YaTienesCuenta;