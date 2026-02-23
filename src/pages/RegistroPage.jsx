import Azul from "../components/auth/Azul";
import TituloCrearCuenta from "../components/auth/TituloCrearCuenta";
import YaTienesCuenta from "../components/auth/YaTienesCuenta";
import FormRegistro from "../components/auth/FormRegistro";

function RegistroPage() {
    return <div>
        <div className="min-h-screen bg-white text-slate-800">
            {/* <!-- 20% de la primera col, 80% de la segunda siempre q sea md size o más --> */}
            <main className="min-h-screen grid grid-cols-1 content-start md:grid-cols-[20%_80%]">
                {/* <!-- PANEL AZUL (IMAGEN) --> */}
                <Azul />

                {/* <!-- CONTENIDO --> */}
                {/* <!-- relative para que el absolute de abajo se pueda mover con respecto a --> */}
                <section className="relative flex items-start md:items-center justify-center px-6 py-10">
                    {/* <!-- Top-right: login (para que solo esa parte se vaya a la derecha arriba)--> */}
                    

                    {/* <!-- CARD --> */}
                    <div className="w-full max-w-xl">
                        {/* <!-- Top-right: login (para que solo esa parte se vaya a la derecha arriba)--> */}
                        <div className="flex justify-end mb-4 md:mb-0 md:absolute md:top-6 md:right-6 z-10">
                        <YaTienesCuenta />
                        </div>
                        <TituloCrearCuenta />

                        {/* FORMS */}
                        <FormRegistro />
                    </div>
                </section>
            </main>
        </div>
    </div>
}

export default RegistroPage;
