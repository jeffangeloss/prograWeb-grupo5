function RestableceContra_3() {
    return <div class="grid md:grid-cols-[30%_70%]">
        {/* imagen izq */}
        <div class="h-40 md:h-screen">
            <img class="w-full h-full"
                src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
        </div>
        {/* contenido derecha */}
        <div class="py-8 px-16">
            {/* boton regresar */}
            <div class="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                <a href="#"
                    class="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    Regresar
                </a>
            </div>
            {/* header */}
            <div class="my-10">
                <h1 class="text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
                <p class="mt-2 text-slate-500">Ingresa tu nueva contraseña</p>
            </div>

            {/* form */}
            <div class="mb-5">
                <form class="grid gap-3">
                    <label class="text-sm font-medium text-slate-700">Contraseña</label>
                    <input
                        class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        type="password" placeholder="******">
                    </input>

                    <label class="text-sm font-medium text-slate-700">Confirmar contraseña</label>
                    <input
                        class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        type="password" placeholder="******">
                    </input>
                    <button
                        class="mt-4 w-min rounded-full bg-indigo-600 px-16 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                        type="submit">Continuar
                    </button>
                </form>
            </div>

            {/* mensaje de error */}
            <div class="pt-2 space-y-1 text-sm text-red-500">
                <p>Debe completar todos los campos para continuar</p>
                <p>La contraseña debe tener mínimo 8 caracteres y un simbolo (quizá mayúscusla o número)</p>
            </div>

        </div>
    </div>

}

export default RestableceContra_3