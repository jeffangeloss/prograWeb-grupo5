import CargarTablaAdmin from "./CargarTablaAdmin"

function TablaAdmin({ usuarios, totalUsuarios, borrarUsuario, actorRole }) {

    return <div className="mt-10 mx-4">
        <div className="overflow-x-auto scroll rounded-lr-2xl rounded-t-2xl shadow-2xl">
            <table className="text-xs text-slate-600 text-left min-w-full font-semibold ">
                <thead className="text-sm text-white bg-indigo-600">
                    <tr>
                        <th className="font-medium px-4 py-3">NOMBRE</th>
                        <th className="font-medium px-4 py-3">EMAIL</th>
                        <th className="font-medium px-4 py-3">ROL</th>
                        <th className="font-medium px-4 py-3">ÚLTIMO ACCESO</th>
                        <th className="font-medium px-4 py-3"></th>
                        <th className="font-medium px-4 py-3"></th>
                        <th className="font-medium px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    <CargarTablaAdmin listaUsuarios={usuarios} borrarUsuario={borrarUsuario} actorRole={actorRole} />
                </tbody>
            </table>

        </div>
        <span className="px-4 py-2 text-xs rounded-b-2xl flex bg-slate-50 text-slate-500 justify-end overflow-x-auto">
            Usuarios: {typeof totalUsuarios === "number" ? totalUsuarios : usuarios.length}
        </span>
    </div>
}

export default TablaAdmin
