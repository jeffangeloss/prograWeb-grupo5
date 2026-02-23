import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://127.0.0.1:8000"
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

function NavBarUser({ onLogout }) {
    const navigate = useNavigate()
    const [openMenu, setOpenMenu] = useState(false)
    const [sesionData, setSesionData] = useState(null)
    const [avatarError, setAvatarError] = useState("")
    const [subiendoAvatar, setSubiendoAvatar] = useState(false)
    const menuRef = useRef(null)
    const avatarInputRef = useRef(null)

    function abrirPerfil() {
        setOpenMenu(false)
        navigate("/perfil")
    }

    function obtenerDatosSesion() {
        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            const perfilRaw = localStorage.getItem("PERFIL_LOCAL")
            const sesion = raw ? JSON.parse(raw) : null
            const perfil = perfilRaw ? JSON.parse(perfilRaw) : null
            if (!sesion && !perfil) {
                return null
            }
            return {
                ...perfil,
                ...sesion,
            }
        } catch {
            return null
        }
    }

    function refrescarSesion() {
        setSesionData(obtenerDatosSesion())
    }

    function resolverAvatarSrc(rawAvatar) {
        if (!rawAvatar) {
            return "/img/user.jpg"
        }

        if (rawAvatar.startsWith("data:image")) {
            return rawAvatar
        }

        if (rawAvatar.startsWith("http://") || rawAvatar.startsWith("https://")) {
            return rawAvatar
        }

        if (rawAvatar.startsWith("/uploads/")) {
            return `${API_URL}${rawAvatar}`
        }

        return rawAvatar
    }

    function obtenerToken() {
        const tokenLegacy = localStorage.getItem("TOKEN")
        if (tokenLegacy) {
            return tokenLegacy
        }
        const sesion = obtenerDatosSesion()
        return sesion?.token || ""
    }

    function persistirUsuarioEnStorage(user) {
        if (!user) {
            return
        }

        let sesion = {}
        let perfil = {}

        try {
            sesion = JSON.parse(localStorage.getItem("DATOS_LOGIN") || "{}")
        } catch {
            sesion = {}
        }

        try {
            perfil = JSON.parse(localStorage.getItem("PERFIL_LOCAL") || "{}")
        } catch {
            perfil = {}
        }

        const merged = {
            ...perfil,
            ...sesion,
            id: user.id || sesion.id || perfil.id,
            name: user.name || sesion.name || perfil.name,
            nombre: user.name || sesion.nombre || perfil.nombre,
            email: user.email || sesion.email || perfil.email,
            correo: user.email || sesion.correo || perfil.correo,
            rol: user.rol || sesion.rol || perfil.rol,
            avatar_url: user.avatar_url || "",
            updated_at: user.updated_at || sesion.updated_at || perfil.updated_at,
        }

        localStorage.setItem("DATOS_LOGIN", JSON.stringify({ ...sesion, ...merged }))
        localStorage.setItem("PERFIL_LOCAL", JSON.stringify({ ...perfil, ...merged }))

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
            setAvatarError("Sesion expirada. Inicia sesion nuevamente.")
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

    function nombreDesdeCorreo(correo) {
        if (!correo) {
            return "Usuario"
        }

        const localPart = correo.split("@")[0] || ""
        const limpio = localPart.replace(/[._-]+/g, " ").trim()

        if (!limpio) {
            return "Usuario"
        }

        return limpio
            .split(" ")
            .filter(Boolean)
            .map(function (p) {
                return p.charAt(0).toUpperCase() + p.slice(1)
            })
            .join(" ")
    }

    useEffect(function () {
        refrescarSesion()

        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false)
            }
        }

        function handleProfileRefresh() {
            refrescarSesion()
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("storage", handleProfileRefresh)
        window.addEventListener("user-profile-updated", handleProfileRefresh)

        return function () {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("storage", handleProfileRefresh)
            window.removeEventListener("user-profile-updated", handleProfileRefresh)
        }
    }, [])

    const sesion = sesionData || obtenerDatosSesion()
    const correoUsuario = sesion?.correo || sesion?.email || "usuario@correo.com"
    const nombreUsuario = sesion?.nombre || sesion?.name || nombreDesdeCorreo(correoUsuario)
    const avatarUsuario = resolverAvatarSrc(sesion?.avatar_url || sesion?.avatar || "")

    return (
        <div className="bg-slate-100 px-4 py-3 sm:px-6 sm:py-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center min-w-0">
                <img
                    src="/img/logotemp.png"
                    alt="Grupo 5"
                    className="h-10 sm:h-11 w-auto object-contain"
                />
                <span className="ml-2 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                    GRUPO 5
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
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
                        className="inline-flex items-center gap-2 px-1 py-1 text-slate-700 transition"
                        onClick={function () {
                            setOpenMenu(!openMenu)
                        }}
                        aria-label="Abrir menu de usuario"
                        aria-expanded={openMenu}
                    >
                        <div className="min-w-0 leading-tight text-right">
                            <h1 className="text-sm sm:text-base font-semibold truncate">{nombreUsuario}</h1>
                            <p className="text-[11px] sm:text-xs text-slate-500 truncate">{correoUsuario}</p>
                        </div>

                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-900/20 bg-white">
                            <img
                                src={avatarUsuario}
                                alt="Menu usuario"
                                className="h-8 w-8 rounded-full object-cover"
                                onError={function (ev) {
                                    ev.currentTarget.src = "/img/user.jpg"
                                }}
                            />
                        </span>
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className={`h-4 w-4 text-slate-600 transition-transform ${openMenu ? "rotate-180" : ""}`}
                            aria-hidden="true"
                        >
                            <path d="M5 8l5 5 5-5" />
                        </svg>
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                            <div className="border-b border-slate-100 px-4 py-4 text-center">
                                <img
                                    src={avatarUsuario}
                                    alt="Usuario"
                                    className="mx-auto h-14 w-14 rounded-full object-cover border border-blue-900/20"
                                    onError={function (ev) {
                                        ev.currentTarget.src = "/img/user.jpg"
                                    }}
                                />
                                <p className="mt-2 text-sm font-semibold text-slate-700 truncate">{nombreUsuario}</p>
                                <p className="text-xs text-slate-500 truncate">{correoUsuario}</p>
                            </div>

                            <div className="p-2 space-y-1">
                                <button
                                    type="button"
                                    className="w-full rounded-lg px-3 py-2.5 text-left text-sky-600 hover:bg-sky-50 transition"
                                    onClick={function () {
                                        if (avatarInputRef.current) {
                                            avatarInputRef.current.click()
                                        }
                                    }}
                                >
                                    {subiendoAvatar ? "Subiendo imagen..." : "Cambiar imagen"}
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 hover:bg-slate-100 transition"
                                    onClick={abrirPerfil}
                                >
                                    Perfil
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg px-3 py-2.5 text-left text-rose-600 hover:bg-rose-50 transition"
                                    onClick={function () {
                                        setOpenMenu(false)
                                        onLogout()
                                    }}
                                >
                                    Cerrar sesion
                                </button>
                            </div>
                            {avatarError && (
                                <p className="px-4 pb-3 text-xs font-medium text-rose-600">{avatarError}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBarUser
