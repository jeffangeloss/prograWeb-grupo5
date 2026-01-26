function AdminPage() {
    return <div>

        <div className="bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 shadow-xl flex sm:justify-between ">
            <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" className="h-10" />
            <button type="button"
                className="border shadow-xl rounded-xl px-4 py-2 bg-blue-900 hover:bg-blue-300 text-white">Usuario</button>
        </div>
        <div className="grid grid-cols-[220px_1fr] min-h-screen">
            <div className="px-3 py-2 flex flex-col bg-blue-950 gap-3">
                <p className="text-sm text-white text-center">Menú</p>
                <button type="button" className="mt-4 shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">Usuarios</button>
                <button type="button" className="shadow-md bg-blue-700 rounded-xl w-48 py-2 text-white">Dashboard</button>
            </div>
            <div className="bg-sky-900 px-4">
                <h1 className="mt-6 ml-6 object-left text-3xl text-white font-semibold">Usuarios</h1>
                <div className="ml-4 flex gap-4 mt-4">
                    <button type="button" className="shadow-md bg-blue-700 rounded-2xl w-64 py-2 text-white">Añadir Usuario</button>
                </div>
                <div className="ml-4 mt-6 gap-6 flex flex-auto">
                    <input className="bg-white px-10 py-1 rounded-xl shadow-xl" type="text" placeholder="Buscar usuario..."></input>
                    <select className="bg-white pl-3 rounded-xl shadow-xl" value="Rol">
                        <option>Rol</option>
                        <option>Usuario</option>
                        <option>Administrador</option>
                    </select>
                </div>

                <div className="border border-blue-900/50 mt-10 mx-8 rounded-2xl shadow-xl overflow-hidden ">
                    <table className="text-xs text-white text-left min-w-full">
                        <thead className="text-sm text-gray-200 bg-blue-900">
                            <tr>
                                <th className="px-4 py-4">
                                    <input type="checkbox" className="w-4 h-4" />
                                </th>
                                <th className="font-medium px-4 py-3">NOMBRE</th>
                                <th className="font-medium px-4 py-3">EMAIL</th>
                                <th className="font-medium px-4 py-3">ROL</th>
                                <th className="font-medium px-4 py-3">ÚLTIMO ACCESO</th>
                                <th className="font-medium px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/50">
                            <tr className="hover:bg-blue-600 transition">
                                <td className="px-4 py-4">
                                    <input type="checkbox" className="w-4 h-4" />
                                </td>
                                <td className="px-4 py-4">Isabella Stanley</td>
                                <td className="px-4 py-4">stanley.li@hotmail.com</td>
                                <td>
                                    <span className="px-3 py-2 rounded-2xl text-blue-300 border border-blue-500">Usuario</span>
                                </td>
                                <td className="px-4 py-4">25/01/2025</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-orange-300/30 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition">Editar</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-blue-600 transition">
                                <td className="px-4 py-4">
                                    <input type="checkbox" className="w-4 h-4" />
                                </td>
                                <td className="px-4 py-4">Jose Blake</td>
                                <td className="px-4 py-4">jose.blake@gmail.com</td>
                                <td>
                                    <span className="px-3 py-2 rounded-2xl text-red-300 border border-red-500">Administrador</span>
                                </td>
                                <td className="px-4 py-4">21/01/2025</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="px-3 py-1.5 text-xs rounded-md bg-orange-300/30 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition">Editar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <span className="p-3 text-white text-xs flex justify-end">Usuarios: 2</span>
                </div>
            </div>
        </div>

    </div>
}

export default AdminPage;