import { useNavigate } from "react-router-dom"

function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#c5d7e3] to-white text-slate-900">
            {/* <!-- HEADER (sticky celeste) --> */}
            <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-[#96c7ef] to-[#cfe6f2]">
                <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
                    {/* <!-- LOGO --> */}
                    <button type="button"
                        onClick={function () { navigate("/") }}
                        className="flex items-center gap-3"
                    >
                        <img src="/img/logotemp.png" alt="logo" className="h-10 w-auto" />
                        <span className="hidden sm:block font-extrabold text-slate-900">
                            GRUPO 5
                        </span>
                    </button>

                    {/* <!-- BOTONES NAV --> */}
                    <nav className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={function () { navigate("/registro") }}
                            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-black hover:font-extrabold transition
                   focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            Registrarse
                        </button>
                        <button
                            onClick={function () { navigate("/sesion") }}
                            className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-black hover:font-extrabold transition
                   focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            Iniciar sesión
                        </button>
                    </nav>
                </div>
            </header>

            {/* <!-- MAIN --> */}
            <main className="mx-auto max-w-6xl px-6 pt-14 pb-16">
                {/* <!-- HERO --> */}
                <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {/* <!-- decor --> */}
                    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"></div>
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"></div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 sm:p-12">
                        {/* <!-- Texto --> */}
                        <div className="min-w-0">
                            <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold leading-[1.05]">
                                Controla tus gastos <br className="hidden sm:block" />
                                sin complicarte
                            </h1>

                            <p className="mt-5 text-slate-700 leading-relaxed max-w-prose">
                                Registra ingresos y egresos, clasifica por categorías y revisa tu historial.
                                Hecho para que se vea bien en móvil y sea fácil de usar desde el primer día.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={function () { navigate("/registro") }}
                                    className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-black hover:font-extrabold transition
                   focus:outline-none focus:ring-4 focus:ring-indigo-300"
                                >
                                    Crear cuenta
                                </button>

                                <button
                                    onClick={function () { navigate("/sesion") }}
                                    className="rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-black hover:font-extrabold transition
                   focus:outline-none focus:ring-4 focus:ring-indigo-300"
                                >
                                    Ya tengo cuenta
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="rounded-full border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-800 shadow-sm
                        hover:bg-slate-50 transition
                       focus:outline-none focus:ring-4 focus:ring-slate-200"
                                >
                                    Ver más
                                </button>
                            </div>

                            {/* <!-- mini stats --> */}
                            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <p className="text-xs text-slate-500">Categorías</p>
                                    <p className="text-lg font-extrabold">Rápidas</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <p className="text-xs text-slate-500">Historial</p>
                                    <p className="text-lg font-extrabold">Ordenado</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <p className="text-xs text-slate-500">Diseño</p>
                                    <p className="text-lg font-extrabold">Responsive</p>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Imagen --> */}
                        <div className="flex justify-center">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <img
                                    src="/img/chanchito.svg"
                                    alt="Ilustración"
                                    className="block w-full max-w-[360px] h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- FEATURES --> */}
                <section id="features" className="mt-14 scroll-mt-24">
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold">¿Qué ofrece?</h2>
                            <p className="mt-2 text-slate-600 max-w-prose">
                                Lo esencial para llevar un control real, sin saturarte.
                            </p>
                        </div>
                        <div className="text-sm text-slate-500">
                            Minimalista • Legible • Hecho para móviles
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* <!-- Card 1 --> */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                            <img src="/img/icon1.png" alt="" className="h-12 w-12 object-contain" />
                            <h3 className="mt-4 text-xl font-extrabold">Registro rápido</h3>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Agrega montos y descripciones en pocos segundos con campos claros.
                            </p>
                        </div>

                        {/* <!-- Card 2 --> */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                            <img src="/img/icon2.png" alt="" className="h-12 w-12 object-contain" />
                            <h3 className="mt-4 text-xl font-extrabold">Visual simple</h3>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Ordena tu historial y detecta hábitos con una interfaz limpia.
                            </p>
                        </div>

                        {/* <!-- Card 3 --> */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                            <img src="/img/icon3.png" alt="" className="h-12 w-12 object-contain" />
                            <h3 className="mt-4 text-xl font-extrabold">Orden y seguridad</h3>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Flujos pensados para autenticación y control básico de acceso.
                            </p>
                        </div>
                    </div>
                </section>

                {/* <!-- STEPS --> */}
                <section className="mt-14">
                    <h2 className="text-3xl sm:text-4xl font-extrabold">¿Cómo funciona?</h2>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-bold text-slate-500">Paso 1</div>
                            <div className="mt-2 text-xl font-extrabold">Crea tu cuenta</div>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Regístrate con tus datos y entra al sistema.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-bold text-slate-500">Paso 2</div>
                            <div className="mt-2 text-xl font-extrabold">Registra movimientos</div>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Añade egresos/ingresos con categoría, fecha y descripción.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-bold text-slate-500">Paso 3</div>
                            <div className="mt-2 text-xl font-extrabold">Revisa tu historial</div>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                                Consulta tu información y mantén control continuo.
                            </p>
                        </div>
                    </div>
                </section>

                {/* <!-- CALL TO ACTION --> */}
                <section className="mt-14">
                    <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-8 sm:p-10 shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold">
                                    Empieza hoy y ordénate en minutos
                                </h2>
                                <p className="mt-2 text-white/90 leading-relaxed max-w-prose">
                                    Regístrate y prueba el flujo completo de registro y acceso.
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <button
                                    onClick={function () { navigate("/registro") }}
                                    className="rounded-full bg-white px-7 py-3 font-extrabold text-slate-900
                       hover:bg-black hover:text-white shadow-xl transition
                       focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    Registrarme
                                </button>
                                <button
                                    onClick={function () { navigate("/sesion") }}
                                    className="rounded-full border border-white bg-white/10 px-7 py-3 font-extrabold text-white
                       hover:bg-black shadow-xl transition
                       focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    Iniciar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* <!-- FOOTER --> */}
            <footer className="bg-blue-900 text-blue-50">
                <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
                    <div>
                        <h3 className="text-2xl font-extrabold">Hecho por</h3>
                        <ul className="mt-4 space-y-1 text-sm text-blue-100">
                            <li className="font-semibold">Mariel Casolda - 20230000</li>
                            <li className="font-semibold">Gabriela Garay - 20233903</li>
                            <li className="font-semibold">Rafael Lau - 20230000</li>
                            <li className="font-semibold">Rafel Pérez - 20230000</li>
                            <li className="font-semibold">Jefferson Sanchez - 20235218</li>
                        </ul>
                        <p className="mt-6 text-xs text-blue-200">
                            © 2026 — Universidad de Lima
                        </p>
                    </div>

                    <div className="flex md:justify-end">
                        <img src="/img/logotemp.png" alt="logo" className="h-12 w-auto opacity-90" />
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default LandingPage;