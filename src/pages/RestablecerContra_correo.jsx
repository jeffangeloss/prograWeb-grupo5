function RestablecerContra_correo() {
    return <div class="grid grid-cols-1">
        {/* contenido */}
        <div class="w-1/2 justify-self-center text-center">
            {/* header */}
            <div class="my-10">
                <h1 class="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
            </div>

            {/* texto */}
            <div class="mb-5 grid gap-3">
                <p class="text-slate-500">Hemos recibido una solicitud para reestablecer tu contraseña, haz click en el siguiente
                    enlace para continuar </p>

                <button type="button"
                    class="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition">
                    Continuar
                </button>
                <p class="text-slate-500">Este enlace expira en 5 minutos</p>
                <p class="mt-5 text-slate-400">Si no hiciste la solicitud para restablecer tu contraseña, puedes ignorar este correo. Tu contraseña sólo puede ser cambiada mediante este enlace</p>
            </div>
        </div>
    </div>
}

export default RestablecerContra_correo