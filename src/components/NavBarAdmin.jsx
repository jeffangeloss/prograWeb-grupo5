import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import RoleBadge from "./RoleBadge"
import { normalizeRoleValue, roleLabel } from "../utils/roles"
import { toast } from "sonner"
import params from "../params"
import { THEME_CHANGED_EVENT, isDarkThemeActive, toggleThemeMode } from "../utils/theme"

const API_URL = params.BACKEND_URL
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const LOGO_LIGHT_URL = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771998697/logotemp_krs62l.png"
const LOGO_DARK_URL = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1772027332/Solarix_Halo_Tidalglow_2023_-_Royale_High_m4vfet.jpg"

function leerSesion() {
    try {
        const rawSesion = localStorage.getItem("DATOS_LOGIN")
        const rawPerfil = localStorage.getItem("PERFIL_LOCAL")
        const sesion = rawSesion ? JSON.parse(rawSesion) : {}
        const perfil = rawPerfil ? JSON.parse(rawPerfil) : {}
        return {
            ...perfil,
            ...sesion,
        }
    } catch {
        return {}
    }
}

function NavBarAdmin({ onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [openMenu, setOpenMenu] = useState(false)
    const [sesion, setSesion] = useState(function () {
        return leerSesion()
    })
    const [avatarError, setAvatarError] = useState("")
    const [subiendoAvatar, setSubiendoAvatar] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(function () {
        return isDarkThemeActive()
    })
    const menuRef = useRef(null)
    const avatarInputRef = useRef(null)

    function resolverAvatarSrc(rawAvatar) {
        if (!rawAvatar) {
            return "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
        }

        if (rawAvatar.startsWith("data:image")) {
            return rawAvatar
        }

        if (rawAvatar.startsWith("http://")) {
            return `https://${rawAvatar.slice(7)}`
        }

        if (rawAvatar.startsWith("https://")) {
            return rawAvatar
        }

        return rawAvatar
    }

    function obtenerToken() {
        const tokenLegacy = localStorage.getItem("TOKEN")
        if (tokenLegacy) {
            return tokenLegacy
        }
        return leerSesion()?.token || ""
    }

    function refrescarSesion() {
        setSesion(leerSesion())
    }

    function alternarTema() {
        const temaAplicado = toggleThemeMode()
        setIsDarkMode(temaAplicado === "dark")
    }

    function persistirUsuarioEnStorage(user) {
        if (!user) {
            return
        }

        let sesionActual = {}
        let perfilActual = {}

        try {
            sesionActual = JSON.parse(localStorage.getItem("DATOS_LOGIN") || "{}")
        } catch {
            sesionActual = {}
        }

        try {
            perfilActual = JSON.parse(localStorage.getItem("PERFIL_LOCAL") || "{}")
        } catch {
            perfilActual = {}
        }

        const merged = {
            ...perfilActual,
            ...sesionActual,
            id: user.id || sesionActual.id || perfilActual.id,
            name: user.name || sesionActual.name || perfilActual.name,
            nombre: user.name || sesionActual.nombre || perfilActual.nombre,
            email: user.email || sesionActual.email || perfilActual.email,
            correo: user.email || sesionActual.correo || perfilActual.correo,
            rol: user.rol || sesionActual.rol || perfilActual.rol,
            avatar_url: user.avatar_url || "",
            updated_at: user.updated_at || sesionActual.updated_at || perfilActual.updated_at,
        }

        localStorage.setItem("DATOS_LOGIN", JSON.stringify({ ...sesionActual, ...merged }))
        localStorage.setItem("PERFIL_LOCAL", JSON.stringify({ ...perfilActual, ...merged }))

        if (merged.updated_at) {
            localStorage.setItem("PERFIL_UPDATED_AT", merged.updated_at)
        }

        window.dispatchEvent(new Event("user-profile-updated"))
        refrescarSesion()
    }

    async function subirAvatarDesdeDropdown(file) {
        if (!file) {
            return
        }

        if (!file.type.startsWith("image/")) {
            setAvatarError("El archivo seleccionado no es una imagen.")
            return
        }

        if (file.size > MAX_AVATAR_BYTES) {
            setAvatarError("La imagen supera el limite de 5MB.")
            return
        }

        const token = obtenerToken()
        if (!token) {
            setAvatarError("Sesión expirada. Inicia sesión nuevamente.")
            return
        }

        setSubiendoAvatar(true)
        setAvatarError("")
        try {
            const formData = new FormData()
            formData.append("file", file)

            const resp = await fetch(`${API_URL}/me/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setAvatarError(data.detail || "No se pudo actualizar la imagen.")
                return
            }

            persistirUsuarioEnStorage(data.user || { avatar_url: data.avatar_url })
        } catch {
            setAvatarError("No se pudo conectar con el backend.")
        } finally {
            setSubiendoAvatar(false)
        }
    }

    useEffect(function () {
        function refrescar() {
            setSesion(leerSesion())
        }

        function cerrarMenuFuera(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false)
            }
        }

        document.addEventListener("mousedown", cerrarMenuFuera)
        window.addEventListener("storage", refrescar)
        window.addEventListener("user-profile-updated", refrescar)
        return function () {
            document.removeEventListener("mousedown", cerrarMenuFuera)
            window.removeEventListener("storage", refrescar)
            window.removeEventListener("user-profile-updated", refrescar)
        }
    }, [])

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

    const enEstadisticas = location.pathname === "/estadisticas"
    const enDashboard = location.pathname === "/admin"
    const enAuditoriaAdmin = location.pathname === "/auditoriaAdmin"
    const enPerfil = location.pathname === "/perfil"

    const roleValue = normalizeRoleValue(sesion?.rol || "admin")
    const nombre = sesion?.nombre || sesion?.name || `${roleLabel(roleValue)} Demo`
    const correo = sesion?.correo || sesion?.email || ""
    const avatarUsuario = resolverAvatarSrc(sesion?.avatar_url || sesion?.avatar || "")
    const puedeVerAuditoriaAdmin = roleValue === "owner" || roleValue === "auditor"
    const logoSrc = isDarkMode ? LOGO_DARK_URL : LOGO_LIGHT_URL

    function navegar(path) {
        setOpenMenu(false)
        navigate(path)
    }

    function abrirSpotifyToast() {
        toast.custom((t) => (
            <div className="relative group bg-white/50 backdrop-blur-md p-1 rounded-2xl shadow-2xl w-75">
                <button onClick={() => toast.dismiss(t)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-[10px] font-bold z-50"
                >✕</button>

                <div className="overflow-hidden rounded-xl">
                    <iframe
                        src="https://embed.spotify.com/playlist/37i9dQZF1DZ06evO08ff3r?si=iESH7iqkT5m-0xYJnb3zyQ?=autoplay=1"
                        width="100%"
                        height="152"
                        allow="encrypted-media; autoplay"
                        style={{ display: "block" }}
                    ></iframe>
                </div>
            </div>
        ), {
            duration: Infinity, position: "bottom-left"
        })
    }

    return (
        <header className="border-b border-slate-200/80 bg-gradient-to-r from-[#96c7ef] to-[#cfe6f2] shadow-md dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-800">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                    <img
                        src={logoSrc}
                        alt="Grupo 5"
                        className="h-10 w-auto object-contain sm:h-11 cursor-pointer transition-transform active:scale-90 hover:brightness-110"
                        onClick={() => navigate("/admin")}
                    />
                    <span
                        className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl cursor-pointer hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                        onClick={function () { abrirSpotifyToast() }}
                    >GRUPO 5
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
                    <div ref={menuRef} className="relative">
                        <input
                            ref={avatarInputRef}
                            type="file"
                            className="hidden"
                            accept=".tiff,.jfif,.bmp,.pjp,.apng,.jpeg,.jpg,.png,.webp,.svg,.heic,.gif,.ico,.xbm,.xjl,.dib,.tif,.pjpeg,.avif"
                            onChange={function (ev) {
                                const file = ev.target.files && ev.target.files[0] ? ev.target.files[0] : null
                                subirAvatarDesdeDropdown(file)
                                ev.target.value = ""
                            }}
                        />

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-1 py-1 text-slate-700 transition dark:text-slate-200"
                            onClick={function () {
                                setOpenMenu(!openMenu)
                            }}
                            aria-label="Abrir menu de usuario"
                            aria-expanded={openMenu}
                        >
                            <div className="min-w-0 leading-tight text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <h1 className="truncate text-sm font-semibold sm:text-base">{nombre}</h1>
                                    <RoleBadge role={roleValue} />
                                </div>
                                {correo && <p className="truncate text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">{correo}</p>}
                            </div>

                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-900/20 bg-white dark:border-slate-600 dark:bg-slate-700">
                                <img
                                    src={avatarUsuario}
                                    alt={roleLabel(roleValue)}
                                    className="h-8 w-8 rounded-full object-cover"
                                    onError={function (ev) {
                                        ev.currentTarget.src = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
                                    }}
                                />
                            </span>
                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className={`h-4 w-4 text-slate-600 transition-transform dark:text-slate-300 ${openMenu ? "rotate-180" : ""}`}
                                aria-hidden="true"
                            >
                                <path d="M5 8l5 5 5-5" />
                            </svg>
                        </button>

                        {openMenu && (
                            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                                <div className="border-b border-slate-100 px-4 py-4 text-center dark:border-slate-700">
                                    <img
                                        src={avatarUsuario}
                                        alt={roleLabel(roleValue)}
                                        className="mx-auto h-14 w-14 rounded-full border border-blue-900/20 object-cover dark:border-slate-600"
                                        onError={function (ev) {
                                            ev.currentTarget.src = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
                                        }}
                                    />
                                    <p className="mt-2 truncate text-sm font-semibold text-slate-700 dark:text-slate-100">{nombre}</p>
                                    {correo && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{correo}</p>}
                                    <div className="mt-2">
                                        <RoleBadge role={roleValue} />
                                    </div>
                                </div>

                                <div className="space-y-1 p-2">
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-slate-800"
                                        onClick={function () {
                                            if (avatarInputRef.current) {
                                                avatarInputRef.current.click()
                                            }
                                        }}
                                    >
                                        {subiendoAvatar ? "Subiendo imagen..." : "Cambiar imagen"}
                                    </button>
                                    {!enDashboard && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                            onClick={function () {
                                                navegar("/admin")
                                            }}
                                        >
                                            Dashboard
                                        </button>
                                    )}
                                    {!enEstadisticas && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                            onClick={function () {
                                                navegar("/estadisticas")
                                            }}
                                        >
                                            Estadisticas de usuarios
                                        </button>
                                    )}
                                    {puedeVerAuditoriaAdmin && !enAuditoriaAdmin && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                            onClick={function () {
                                                navegar("/auditoriaAdmin")
                                            }}
                                        >
                                            Auditoria admin
                                        </button>
                                    )}
                                    {!enPerfil && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                            onClick={function () {
                                                navegar("/perfil")
                                            }}
                                        >
                                            Perfil
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30"
                                        onClick={function () {
                                            setOpenMenu(false)
                                            onLogout()
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                                {avatarError && (
                                    <p className="px-4 pb-3 text-xs font-medium text-rose-600 dark:text-rose-300">{avatarError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NavBarAdmin
