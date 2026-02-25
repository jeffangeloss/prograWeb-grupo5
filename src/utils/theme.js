const THEME_STORAGE_KEY = "APP_THEME_MODE"
const THEME_CHANGED_EVENT = "theme-changed"

function isBrowserEnvironment() {
    return typeof window !== "undefined" && typeof document !== "undefined"
}

function canUseStorage() {
    if (!isBrowserEnvironment()) return false
    try {
        const testKey = "__theme_test__"
        window.localStorage.setItem(testKey, "1")
        window.localStorage.removeItem(testKey)
        return true
    } catch {
        return false
    }
}

function normalizeThemeMode(value) {
    if (value === "dark" || value === "light" || value === "system") {
        return value
    }
    return "system"
}

function getStoredThemeMode() {
    if (!canUseStorage()) return "system"
    return normalizeThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY))
}

function setStoredThemeMode(mode) {
    if (!canUseStorage()) return

    if (mode === "system") {
        window.localStorage.removeItem(THEME_STORAGE_KEY)
        return
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
}

function systemPrefersDark() {
    if (!isBrowserEnvironment() || typeof window.matchMedia !== "function") {
        return false
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function resolveTheme(mode) {
    const normalizedMode = normalizeThemeMode(mode)
    if (normalizedMode === "system") {
        return systemPrefersDark() ? "dark" : "light"
    }
    return normalizedMode
}

function emitThemeChange(mode, effectiveTheme) {
    if (!isBrowserEnvironment()) return
    window.dispatchEvent(
        new CustomEvent(THEME_CHANGED_EVENT, {
            detail: {
                mode,
                effectiveTheme,
            },
        })
    )
}

export function applyTheme(mode) {
    if (!isBrowserEnvironment()) return "light"

    const normalizedMode = normalizeThemeMode(mode)
    const effectiveTheme = resolveTheme(normalizedMode)
    const root = document.documentElement

    root.classList.toggle("dark", effectiveTheme === "dark")
    root.setAttribute("data-theme", effectiveTheme)
    root.style.colorScheme = effectiveTheme

    return effectiveTheme
}

let systemListenerBound = false

function bindSystemThemeListener() {
    if (!isBrowserEnvironment() || systemListenerBound || typeof window.matchMedia !== "function") {
        return
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemChange = function () {
        const mode = getStoredThemeMode()
        if (mode !== "system") return
        const effectiveTheme = applyTheme(mode)
        emitThemeChange(mode, effectiveTheme)
    }

    if (typeof media.addEventListener === "function") {
        media.addEventListener("change", handleSystemChange)
        systemListenerBound = true
        return
    }

    if (typeof media.addListener === "function") {
        media.addListener(handleSystemChange)
        systemListenerBound = true
    }
}

export function initializeTheme() {
    const mode = getStoredThemeMode()
    const effectiveTheme = applyTheme(mode)
    bindSystemThemeListener()
    return effectiveTheme
}

export function getThemeMode() {
    return getStoredThemeMode()
}

export function isDarkThemeActive() {
    if (!isBrowserEnvironment()) return false
    return document.documentElement.classList.contains("dark")
}

export function setThemeMode(mode) {
    const normalizedMode = normalizeThemeMode(mode)
    setStoredThemeMode(normalizedMode)
    const effectiveTheme = applyTheme(normalizedMode)
    emitThemeChange(normalizedMode, effectiveTheme)
    return effectiveTheme
}

export function toggleThemeMode() {
    return setThemeMode(isDarkThemeActive() ? "light" : "dark")
}

export { THEME_CHANGED_EVENT }
