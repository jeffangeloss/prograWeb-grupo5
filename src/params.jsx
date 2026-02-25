const FALLBACK_BACKEND_URL = "https://pw-backend-grupo5.onrender.com"

const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || FALLBACK_BACKEND_URL).trim()
const backendUrl = rawBackendUrl.endsWith("/") ? rawBackendUrl.slice(0, -1) : rawBackendUrl

const params = {
    BACKEND_URL: backendUrl,
    API_URL: backendUrl,
}

export default params
