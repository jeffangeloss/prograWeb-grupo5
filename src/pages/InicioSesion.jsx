function InicioSesion() {
    return <div className="min-h-screen">
        <div className="flex min-h-screen w-full">
            <div className="hidden md:block md:w-1/4 xl:w-[22%] max-w-[420px] shrink-0">
                <img className="h-full w-full object-cover" src="/src/img/azul.png" alt="leftSideImage" />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="w-full flex justify-end items-center gap-4 px-6 sm:px-10 py-6">
                    <span className="text-gray-700 text-sm sm:text-base">¿No tienes una cuenta?</span>
                    <a href="#"
                        className="px-8 py-2.5 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition text-sm sm:text-base">
                        Registrarse
                    </a>
                </div>

                <div className="flex-1 flex items-center">
                    <div className="w-full px-6 sm:px-10 lg:pl-16 lg:pr-12">
                        <form className="w-full max-w-3xl flex flex-col items-start">
                            <h2 className="text-4xl sm:text-5xl text-gray-900 font-bold">INICIAR SESIÓN</h2>

                            <p className="text-base sm:text-lg text-gray-500/90 font-normal mt-4">
                                Inicia sesión y empieza a gestionar tu dinero
                            </p>

                            <div className="w-full mt-10 sm:mt-12">
                                <label for="email" className="block text-base sm:text-lg text-gray-700 mb-3">
                                    Correo electrónico
                                </label>
                                <input id="email" name="email" type="email" placeholder="ejemplo@user.com"
                                    className="w-full h-14 px-5 border border-gray-300 rounded-md outline-none text-base focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    required autocomplete="current-password" />
                            </div>

                            <div className="w-full mt-7 sm:mt-8">
                                <label for="password" className="block text-base sm:text-lg text-gray-700 mb-3">
                                    Contraseña
                                </label>
                                <input id="password" name="password" type="password" placeholder="********"
                                    className="w-full h-14 px-5 border border-gray-300 rounded-md outline-none text-base focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                                    required autocomplete="current-password" />

                            </div>

                            <div className="w-full mt-5 text-right">
                                <a href="#" className="text-sm sm:text-base underline text-gray-600 hover:text-gray-800">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            <button type="submit"
                                className="mt-10 w-full sm:w-auto sm:px-16 h-14 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity text-base sm:text-lg">
                                Iniciar sesión
                            </button>
                            <div className="pt-2 space-y-1 text-sm text-red-500">
                                <p>Debe completar todos los campos para continuar</p>
                                <p>El correo ingresado no tiene una cuenta asociada</p>
                                <p>La contraseña es incorrecta</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default InicioSesion;