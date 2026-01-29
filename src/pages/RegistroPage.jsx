import Azul from "../components/auth/Azul";

function RegistroPage() {
    return <div>
        {/* Por ahora tenemos: */}
        {/* - Layout 20/80 azul y blanco */}
        {/* - Top right de inicio sesión */}
        {/* - Título y subtítulo */}
        {/* - El form para ingresar datos */}

        <div className="min-h-screen bg-white text-slate-800">
            {/* <!-- 20% de la primera col, 80% de la segunda siempre q sea md size o más --> */}
            <main className="min-h-screen grid grid-cols-1 md:grid-cols-[20%_80%]">
                {/* <!-- PANEL AZUL (IMAGEN) --> */}
                {/* <!-- A partir de md size se considera un bloque (menos de eso y se oculta)--> */}
                <Azul />

                {/* <!-- CONTENIDO --> */}
                {/* <!-- relative para que el absolute de abajo se pueda mover con respecto a --> */}
                <section className="relative flex items-center justify-center px-6 py-10">
                    {/* <!-- Top-right: login (para que solo esa parte se vaya a la derecha arriba)--> */}
                    <div className="absolute top-6 right-6 flex items-center gap-3 text-sm text-slate-600">
                        <span className="hidden sm:inline">¿Ya tienes una cuenta?</span>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            Iniciar sesión
                        </a>
                    </div>

                    {/* <!-- CARD --> */}
                    <div className="w-full max-w-xl">
                        <header className="mb-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-700 ">
                                {/* <!-- tracking-tight apachurra las letras --> */}
                                CREA TU CUENTA
                            </h1>
                            <p className="mt-2 text-slate-500">Complete con su información personal</p>
                        </header>

                        <form className="space-y-5"> {/* <!-- como un margin automatico para cada seccion --> */}
                            {/* <!-- GRID PRINCIPAL --> */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* <!-- NOMBRE --> */}
                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="text-sm font-medium text-slate-700">Nombre</label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        placeholder="Nombre"
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    />
                                </div>

                                {/* <!-- APELLIDO --> */}
                                <div className="space-y-2">
                                    <label htmlFor="apellido" className="text-sm font-medium text-slate-700">Apellido</label>
                                    <input
                                        id="apellido"
                                        name="apellido"
                                        type="text"
                                        placeholder="Apellido"
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    />
                                </div>

                                {/* <!-- CORREO (full width) --> */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="correo" className="text-sm font-medium text-slate-700">Correo electrónico</label>
                                    <input
                                        id="correo"
                                        name="correo"
                                        type="email"
                                        placeholder="hello@reallygreatsite.com"
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    />
                                </div>

                                {/* <!-- CONTRASEÑA --> */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    />
                                </div>

                                {/* <!-- CONFIRMAR --> */}
                                <div className="space-y-2">
                                    <label htmlFor="confirm" className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
                                    <input
                                        id="confirm"
                                        name="confirm"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    />
                                </div>
                            </div>

                            {/* <!-- CHECKBOX --> */}
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                                />
                                <span>Acepto los términos y condiciones.</span>
                            </label>

                            {/* <!-- BOTÓN --> */}
                            <button
                                type="submit"
                                className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition"
                            >
                                Crear cuenta
                            </button>

                            {/* <!-- ERRORES --> */}
                            <div className="pt-2 space-y-1 text-sm text-red-500">
                                <p>Debe completar todos los campos para continuar</p>
                                <p>El correo ingresado es inválido</p>
                                <p>La contraseña debe tener mínimo 8 caracteres y un símbolo (quizá mayúscula o número)</p>
                            </div>
                        </form>

                    </div>
                </section>
            </main>
        </div>
    </div>
}

export default RegistroPage;