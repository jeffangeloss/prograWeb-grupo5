import { useEffect, useState } from "react"
import { THEME_CHANGED_EVENT, isDarkThemeActive, toggleThemeMode } from "../utils/theme"

function ThemeToggleButton({ className = "" }) {
    const [isDarkMode, setIsDarkMode] = useState(function () {
        return isDarkThemeActive()
    })

    function alternarTema() {
        const temaAplicado = toggleThemeMode()
        setIsDarkMode(temaAplicado === "dark")
    }

    useEffect(function () {
        function sincronizarTema() {
            setIsDarkMode(isDarkThemeActive())
        }

        window.addEventListener(THEME_CHANGED_EVENT, sincronizarTema)
        window.addEventListener("storage", sincronizarTema)

        return function () {
            window.removeEventListener(THEME_CHANGED_EVENT, sincronizarTema)
            window.removeEventListener("storage", sincronizarTema)
        }
    }, [])

    return (
        <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`.trim()}
            onClick={alternarTema}
            aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
            title={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
            {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
            )}
        </button>
    )
}

export default ThemeToggleButton
