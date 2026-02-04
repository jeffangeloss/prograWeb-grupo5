function UserCard({ usuario, imgSrc = "/img/user.jpg", label = "Usuario" }) {
    return <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4">
        <img
            src={imgSrc}
            alt={label}
            className="h-12 w-12 rounded-full object-cover border border-blue-200"
        />
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <h3 className="text-lg font-semibold text-slate-800">{usuario?.nombre}</h3>
            <p className="text-sm text-slate-500">{usuario?.email}</p>
        </div>
    </div>
}

export default UserCard
