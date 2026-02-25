import { useNavigate } from "react-router-dom"

function RestablecerContra_correo() {

    const navigate = useNavigate();
    
    function onContinue(){
        navigate("/restablecer/form")
    }

    return <div className="grid grid-cols-1">
        {/* contenido */}
        <div className="w-full max-w-xl justify-self-center px-4 text-center sm:px-8">
            {/* header */}
            <div className="my-8 sm:my-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-700">RESTABLECER CONTRASEÑA</h1>
            </div>

            {/* texto */}
            <div className="mb-5 grid gap-3">
                <p className="text-slate-500">Hemos recibido una solicitud para reestablecer tu contraseña, haz click en el siguiente
                    enlace para continuar </p>

                <button type="button"
                    onClick={ function() { onContinue() } }
                    className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition">
                    Continuar
                </button>
                <p className="text-slate-500">Este enlace expira en 5 minutos</p>
                <p className="mt-5 text-slate-400">Si no hiciste la solicitud para restablecer tu contraseña, puedes ignorar este correo. Tu contraseña sólo puede ser cambiada mediante este enlace</p>
            </div>
        </div>
    </div>
}

export default RestablecerContra_correo
