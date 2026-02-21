function FiltradoAdmin({ rolSeleccionado, onFiltro }) {
    return <div className="ml-4 mt-6 gap-6 flex flex-col sm:flex-row sm:items-center">
        <input className="bg-white sm:w-64 px-4 py-1 rounded-xl shadow-xl" type="text" placeholder="Buscar usuario..."></input>
        <select className="py-1 bg-white sm:w-48 px-4 rounded-xl shadow-xl"
            value={rolSeleccionado} onChange={function (ev) { onFiltro(ev.target.value) }}>
            <option value="">Todos</option>
            <option value="1">Usuario</option>
            <option value="2">Administrador</option>
        </select>
    </div>
}

export default FiltradoAdmin