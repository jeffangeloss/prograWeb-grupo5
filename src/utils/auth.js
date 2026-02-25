const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
const FORCE_2FA =
    String(import.meta?.env?.VITE_FORCE_2FA ?? "true").toLowerCase() !== "false"

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

export function decodeJwtPayload(token) {
    try {
        const raw = (token || "").trim()
        if (!isJwtLike(raw)) return null
        const payloadPart = raw.split(".")[1]
        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
        const decoded = atob(padded)
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

export function hasActiveSession() {
    const sesion = getAuthSession()
    const token = getAuthToken()
    if (!(sesion?.ingreso === true && token && isJwtLike(token))) {
        return false
    }

    if (!FORCE_2FA) {
        return true
    }

    const payload = decodeJwtPayload(token)
    const stage = String(payload?.stage || "").toUpperCase()
    return stage === "FULL"
}

export function clearAuthData() {
    localStorage.removeItem("DATOS_LOGIN")
    localStorage.removeItem("TOKEN")
    localStorage.removeItem("TWO_FACTOR_PENDING")
    localStorage.removeItem("PERFIL_LOCAL")
    localStorage.removeItem("PERFIL_UPDATED_AT")
    localStorage.removeItem("PASSWORD_UPDATED_AT")
}
