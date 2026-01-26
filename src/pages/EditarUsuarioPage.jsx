function EditarUsuarioPage() {
  return (
    <div>

      <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 shadow-xl flex sm:justify-between">
        <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" className="h-10" />
        <button className="border shadow-xl rounded-xl px-4 py-2 bg-blue-900 hover:bg-blue-300 text-white">Usuario</button>
      </div>

      <div className="grid grid-cols-[220px_1fr] min-h-screen">
        <div className="px-3 py-2 flex flex-col bg-blue-950 gap-3">
          <p className="text-sm text-white text-center">Menú</p>
          <button className="mt-4 shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">
            Usuarios
          </button>
          <button className="shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">
            Dashboard
          </button>
        </div>

        <div className="bg-sky-900 px-6 py-10">
          <h1 className="mt-2 mb-8 text-3xl text-white font-semibold">Editar Usuario</h1>
          <div className="bg-blue-950 rounded-2xl shadow-xl p-8 max-w-2xl">
            <div className="mb-6">
              <label className="text-white mb-2 ml-1">Nombre completo</label>
              <input type="text" placeholder="Nombre del usuario" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-6">
              <label className="text-white mb-2 ml-1">Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black" />
            </div>

            <div className="mb-6">
              <label className="text-white mb-2 ml-1">Rol</label>
              <select className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-white text-black">
                <option>Usuario</option>
                <option>Administrador</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="text-white mb-2 ml-1">Último acceso</label>
              <input type="text" placeholder="Fecha último acceso" disabled className="w-full mt-2 px-4 py-2 rounded-xl shadow-md bg-gray-300 text-gray-600"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl shadow-md">Eliminar</button>

              <div className="flex gap-4">
                <button className="bg-gray-400 hover:bg-gray-300 text-black px-4 py-2 rounded-xl shadow-md">Cancelar</button>
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md">Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditarUsuarioPage
