function AdminPage() {
    return <div>

        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 shadow-md flex sm:justify-between ">
            <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" className="h-10" />
            <button type="button"
                className="border border-gray-500 rounded-xl p-2 bg-blue-900 hover:bg-blue-300 text-white">Usuario</button>
        </div>
        <div className="grid grid-cols-[220px_1fr] min-h-screen">
            <div className="px-3 py-2 flex flex-col bg-blue-950 gap-3">
                <p className="text-sm text-white text-center">Menú</p>
                <button type="button" className="mt-4 shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">Usuarios</button>
                <button type="button" className="shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">Dashboard</button>
            </div>
            <div className="bg-sky-700">
                <h1 className="mt-6 ml-6 object-left text-3xl text-white">Usuarios</h1>
                <div className="flex gap-4 mt-4 place-self-end">
                    <button type="button" className="shadow-md bg-blue-700 rounded-2xl w-64 py-2 text-white">Añadir
                        Usuario</button>
                    <button type="button"
                        className="shadow-md bg-blue-700 rounded-2xl w-64 py-2 text-white">Exportar</button>
                </div>
                <div className="mt-6 gap-6 flex flex-auto px-12">
                    <input className="bg-white px-4 py-1 rounded-xl shadow-md" type="text" placeholder="Buscar usuario..."></input>
                    <select className="bg-white pl-4 rounded-xl shadow-md" value="Rol">
                        <option>Rol</option>
                        <option>Usuario</option>
                        <option>Administrador</option>
                    </select>
                </div>
                <div className="border-slate-800 mt-10 rounded-2xl shadow-md place-self-center">
                    <table className="border text-xs text-white">
                        <thead className="text-sm text-gray-200 bg-blue-900">
                            <tr>
                                <th className="px-4 py-3">
                                    <input type="checkbox" className="w-4 h-4" />
                                </th>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Rol</th>
                                <th className="px-4 py-3">Último acceso</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2">
                            <tr>
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="w-4 h-4" />
                                </td>
                                <td className="px-4 py-3">Isabella Stanley</td>
                                <td className="px-4 py-3">stanley.li@hotmail.com</td>
                                <td className="px-4 py-3">Usuario</td>
                                <td className="px-4 py-3">25/01/2025</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="w-4 h-4" />
                                </td>
                                <td className="px-4 py-3">Jose Blake</td>
                                <td className="px-4 py-3">jose.blake@gmail.com</td>
                                <td className="px-4 py-3">Administrador</td>
                                <td className="px-4 py-3">21/01/2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
}

export default AdminPage;