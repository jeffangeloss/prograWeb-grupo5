function AccionBadge({ accion }) {
    return <div>
        <span className={
            accion === "LOGIN_SUCCESS"
                ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                : accion === "LOGIN_FAIL"
                    ? "inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"
                    : "inline-flex items-center rounded-full border border-[#bb88ee]/40 bg-[#bb88ee]/10 px-2.5 py-1 text-xs font-semibold text-[#bb88ee]"
        }>
            {accion}
        </span>
    </div>
}

export default AccionBadge
