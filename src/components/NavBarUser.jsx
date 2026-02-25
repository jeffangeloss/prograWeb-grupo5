import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import RoleBadge from "./RoleBadge"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import { toast } from "sonner"
import params from "../params"

const API_URL = params.BACKEND_URL
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

function NavBarUser({ onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()
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

    function abrirEgresos() {
        setOpenMenu(false)
        navigate("/user")
    }

    function abrirDashboard() {
        setOpenMenu(false)
        navigate("/admin")
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
            return "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
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
    const roleValue = normalizeRoleValue(sesion?.rol || "user")
    const esAdminPanel = isAdminPanelRole(roleValue)

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
        <header className="border-b border-slate-200/80 bg-gradient-to-r from-[#96c7ef] to-[#cfe6f2] shadow-md">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                    <img
                        src="https://res.cloudinary.com/dmmyupwuu/image/upload/v1771998697/logotemp_krs62l.png"
                        alt="Grupo 5"
                        className="h-10 w-auto object-contain sm:h-11 cursor-pointer transition-transform active:scale-90 hover:brightness-110"
                        onClick={() => navigate("/admin")}
                    />
                    <span
                        className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl cursor-pointer hover:text-slate-700"
                        onClick={function () { abrirSpotifyToast() }}
                    >GRUPO 5
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
                                <div className="flex items-center justify-end gap-2">
                                    <h1 className="truncate text-sm font-semibold sm:text-base">{nombreUsuario}</h1>
                                    <RoleBadge role={roleValue} />
                                </div>
                                <p className="truncate text-[11px] text-slate-500 sm:text-xs">{correoUsuario}</p>
                            </div>

                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-900/20 bg-white">
                                <img
                                    src={avatarUsuario}
                                    alt="Menu usuario"
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
                                className={`h-4 w-4 text-slate-600 transition-transform ${openMenu ? "rotate-180" : ""}`}
                                aria-hidden="true"
                            >
                                <path d="M5 8l5 5 5-5" />
                            </svg>
                        </button>

                        {openMenu && (
                            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-100 px-4 py-4 text-center">
                                    <img
                                        src={avatarUsuario}
                                        alt="Usuario"
                                        className="mx-auto h-14 w-14 rounded-full border border-blue-900/20 object-cover"
                                        onError={function (ev) {
                                            ev.currentTarget.src = "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png"
                                        }}
                                    />
                                    <p className="mt-2 truncate text-sm font-semibold text-slate-700">{nombreUsuario}</p>
                                    <p className="truncate text-xs text-slate-500">{correoUsuario}</p>
                                    <div className="mt-2">
                                        <RoleBadge role={roleValue} />
                                    </div>
                                </div>

                                <div className="space-y-1 p-2">
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sky-600 transition hover:bg-sky-50"
                                        onClick={function () {
                                            if (avatarInputRef.current) {
                                                avatarInputRef.current.click()
                                            }
                                        }}
                                    >
                                        {subiendoAvatar ? "Subiendo imagen..." : "Cambiar imagen"}
                                    </button>
                                    {!esAdminPanel && location.pathname !== "/user" && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                                            onClick={abrirEgresos}
                                        >
                                            Mis egresos
                                        </button>
                                    )}
                                    {esAdminPanel && location.pathname !== "/admin" && (
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                                            onClick={abrirDashboard}
                                        >
                                            Dashboard
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100"
                                        onClick={abrirPerfil}
                                    >
                                        Perfil
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-rose-600 transition hover:bg-rose-50"
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
        </header>
    )
}

export default NavBarUser
