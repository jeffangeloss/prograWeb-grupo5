function RestableceContra() {
    return <div className="grid md:grid-cols-2">
        <div className="h-40 md:h-screen">
            <img
                className="w-full h-full"
                src="https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
        </div>

        <div className="py-8 px-16">
            <button className="px-8 pt-1 pb-2 flex justify-self-end underline text-blue-600 border border-blue-500 rounded-full" type="button">Regresar</button>
            <div className="my-10">
                <h1 className="text-3xl font-bold text-blue-950">RESTABLECER CONTRASEÑA</h1>
                <p className="text-gray-600">Indica el correo electrónico con el que te registraste</p>
            </div>

            <div className="mb-5">
                <form className="grid">
                    <label>Correo electrónico</label>
                    <input className="border border-gray-400 rounded-sm text-gray-700 py-1 px-2" type="text"></input>
                    <button className="w-min bg-blue-600 text-white hover:bg-blue-500 underline rounded-full py-3 px-16 mt-5" type="button">Continuar</button>
                </form>
            </div>

            <div className="text-red-600">
                <p>Debe completar todos los campos para continuar</p>
                <p>El correo ingresado no tiene una cuenta asociada</p>
            </div>

        </div>
    </div>
}

export default RestableceContra