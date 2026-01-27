function FiltradoAdmin() {
    return <div className="ml-4 mt-6 gap-6 flex flex-auto">
        <input className="bg-white px-20 py-1 rounded-xl shadow-xl" type="text" placeholder="Buscar usuario..."></input>
        <select className="bg-white px-5 rounded-xl shadow-xl" defaultValue="Rol">
            <option>Rol</option>
            <option>Usuario</option>
            <option>Administrador</option>
        </select>
    </div>
}

export default FiltradoAdmin