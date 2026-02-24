import { useEffect, useMemo, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { isAdminPanelRole, normalizeRoleValue } from "../../utils/roles"
import { clearAuthData, getAuthSession, hasActiveSession } from "../../utils/auth"

const REDIRECT_DELAY_MS = 1600
const FALLBACK_ALLOWED_ROLES = ["user", "admin", "owner", "auditor"]

function resolveLandingByRole(role) {
    if (isAdminPanelRole(role)) {
        return "/admin"
    }
    return "/user"
}

function ProtectedRoute({ children, allowRoles = FALLBACK_ALLOWED_ROLES }) {
    const navigate = useNavigate()
    const location = useLocation()
    const redirectTimerRef = useRef(null)

    const sesion = useMemo(function () {
        return getAuthSession()
    }, [location.pathname])

    const role = normalizeRoleValue(sesion?.rol)
    const sessionActive = hasActiveSession()
    const roleAllowed = allowRoles.includes(role)

    useEffect(function () {
        return function () {
            if (redirectTimerRef.current) {
                window.clearTimeout(redirectTimerRef.current)
            }
        }
    }, [])

    useEffect(function () {
        if (sessionActive && roleAllowed) {
            return
        }

        if (sessionActive && !roleAllowed) {
            navigate(resolveLandingByRole(role), { replace: true })
            return
        }

        clearAuthData()
        if (redirectTimerRef.current) {
            window.clearTimeout(redirectTimerRef.current)
        }
        redirectTimerRef.current = window.setTimeout(function () {
            navigate("/sesion", {
                replace: true,
                state: {
                    motivo: "auth_required",
                    from: location.pathname,
                },
            })
        }, REDIRECT_DELAY_MS)
    }, [sessionActive, roleAllowed, role, navigate, location.pathname])

    if (sessionActive && roleAllowed) {
        return children
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xl">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Sesión requerida</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Debes iniciar sesión para continuar. Serás redirigido al login.
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Redirigiendo...</p>
            </section>
        </div>
    )
}

export default ProtectedRoute
