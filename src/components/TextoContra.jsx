function TextoContra({correo}){
    return <div className="mb-5">
                <p className="text-slate-500">Hemos enviado un correo a {correo} con las instrucciones para continuar</p>
                <div className="mt-5">
                    <span className="text-slate-500 mr-1">¿No recibió un correo?</span>
                    <a href="#/restablecer/correo" className="text-sm sm:text-base underline text-gray-600 hover:text-gray-800">
                        Reenviar correo
                    </a>
                </div>
            </div>
}

export default TextoContra