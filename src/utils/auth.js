const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/

export function getAuthSession() {
    try {
        const raw = localStorage.getItem("DATOS_LOGIN")
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === "object" ? parsed : null
    } catch {
        return null
    }
}

export function getAuthToken() {
    const legacyToken = (localStorage.getItem("TOKEN") || "").trim()
    if (legacyToken) {
        return legacyToken
    }

    const sesion = getAuthSession()
    return (sesion?.token || "").trim()
}

export function isJwtLike(token) {
    return JWT_PATTERN.test((token || "").trim())
}

export function hasActiveSession() {
    const sesion = getAuthSession()
    const token = getAuthToken()
    return Boolean(sesion?.ingreso === true && token && isJwtLike(token))
}

export function clearAuthData() {
    localStorage.removeItem("DATOS_LOGIN")
    localStorage.removeItem("TOKEN")
    localStorage.removeItem("PERFIL_LOCAL")
    localStorage.removeItem("PERFIL_UPDATED_AT")
    localStorage.removeItem("PASSWORD_UPDATED_AT")
}
