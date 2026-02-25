const FALLBACK_BACKEND_URL = "https://pw-backend-grupo5.onrender.com"

const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL).trim()
const normalizedBackendUrl = rawBackendUrl.endsWith("/") ? rawBackendUrl.slice(0, -1) : rawBackendUrl
const pageUsesHttps = typeof window !== "undefined" && window.location.protocol === "https:"
const backendUrl = pageUsesHttps && normalizedBackendUrl.startsWith("http://")
    ? `https://${normalizedBackendUrl.slice(7)}`
    : normalizedBackendUrl

const params = {
    BACKEND_URL: backendUrl,
    API_URL: backendUrl,
}

export default params
