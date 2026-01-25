function AdminPage() {
    return <div>

        <div class="bg-blue-600 border p-4 shadow-md flex sm:justify-between ">
            <img src="https://www.ulima.edu.pe/themes/custom/ulima/logo.svg" class="h-10" />
            <button type="button"
                class="border border-gray-500 rounded-md p-2 bg-blue-900 hover:bg-blue-300 text-white">Usuario</button>
        </div>
        <div class="grid grid-cols-[260px_1fr] min-h-screen">
            <div class="px-6 flex flex-col bg-blue-950 gap-4">
                <button type="button" class="mt-4 shadow-md bg-blue-700 rounded-2xl w-64 py-3 text-white">Usuarios</button>
                <button type="button" class="shadow-md bg-blue-700 rounded-2xl w-64 py-3 text-white">Dashboard</button>
            </div>
            <div class="bg-sky-700">
                <h1 class="mt-6 ml-6 object-left text-3xl text-white">Usuarios</h1>
                <div class="flex gap-4 mt-4 place-self-end">
                    <button type="button" class="shadow-md bg-blue-700 rounded-2xl w-64 py-2 text-white">Añadir
                        Usuario</button>
                    <button type="button"
                        class="shadow-md bg-blue-700 rounded-2xl w-64 py-2 text-white">Exportar</button>
                </div>
                <div class="mt-6 gap-6 flex flex-auto px-12">
                    <input class="px-4 py-1 rounded-md shadow-md" type="text" value="Buscar usuario..."></input>
                    <select class="pl-4 rounded-md shadow-md" value="Rol">
                        <option>Rol</option>
                        <option>Usuario</option>
                        <option>Administrador</option>
                    </select>
                </div>
                <div class="mt-10 rounded-md shadow-md place-self-center">
                    <table class="border text-xs text-white">
                        <thead class="text-sm text-gray-200 bg-blue-900">
                            <tr>
                                <th class="px-4 py-3">
                                    <input type="checkbox" class="w-4 h-4" />
                                </th>
                                <th class="px-4 py-3">Nombre</th>
                                <th class="px-4 py-3">Email</th>
                                <th class="px-4 py-3">Rol</th>
                                <th class="px-4 py-3">Último acceso</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-2">
                            <tr>
                                <td class="px-4 py-3">
                                    <input type="checkbox" class="w-4 h-4" />
                                </td>
                                <td class="px-4 py-3">Isabella Stanley</td>
                                <td class="px-4 py-3">stanley.li@hotmail.com</td>
                                <td class="px-4 py-3">Usuario</td>
                                <td class="px-4 py-3">25/01/2025</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3">
                                    <input type="checkbox" class="w-4 h-4" />
                                </td>
                                <td class="px-4 py-3">Jose Blake</td>
                                <td class="px-4 py-3">jose.blake@gmail.com</td>
                                <td class="px-4 py-3">Administrador</td>
                                <td class="px-4 py-3">21/01/2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
}

export default AdminPage;