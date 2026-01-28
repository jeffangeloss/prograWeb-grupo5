function InputEmail({ correo, correoOnChange }) {
    return <div>
        <label className="text-sm font-medium text-slate-700">
            Correo electrónico
        </label>
        <input
            value={correo}
            onChange={correoOnChange}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 sm:py-3 text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            type="email"
            placeholder="ejemplo@user.com"
        />
    </div>
}

export default InputEmail