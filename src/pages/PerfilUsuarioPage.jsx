import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import NavBarUser from "../components/NavBarUser"
import NavBarAdmin from "../components/NavBarAdmin"
import RoleBadge from "../components/RoleBadge"
import { passwordMeetsPolicy, passwordPolicyMessage } from "../utils/passwordPolicy"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import params from "../params"

const API_URL = params.BACKEND_URL
const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ".tiff,.jfif,.bmp,.pjp,.apng,.jpeg,.jpg,.png,.webp,.svg,.heic,.gif,.ico,.xbm,.xjl,.dib,.tif,.pjpeg,.avif"
const ALLOWED_AVATAR_EXTENSIONS = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".jpe",
    ".webp",
    ".svg",
    ".heic",
    ".gif",
    ".ico",
    ".xbm",
    ".xjl",
    ".xpm",
    ".dib",
    ".tif",
    ".tiff",
    ".pjpeg",
    ".pjp",
    ".apng",
    ".avif",
    ".jfif",
    ".bmp",
])
const PRESET_AVATARS = [
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-1_pmyxdz.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-2_mtutkd.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-3_nwuh85.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-4_nsqbb7.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-5_m7vz7f.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-6_dlldqw.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-7_xkql3p.png",
    "https://res.cloudinary.com/dmmyupwuu/image/upload/v1771912745/gatito-8_kjf8nl.png",
]

function PerfilUsuarioPage() {
    const navigate = useNavigate()
    const avatarInputRef = useRef(null)
    const previewObjectUrlRef = useRef("")

    const [perfil, setPerfil] = useState({
        id: "",
        name: "Usuario",
        email: "usuario@correo.com",
        identificacion: "-",
        rol: "user",
        avatar_url: "",
    })
    const [cargandoPerfil, setCargandoPerfil] = useState(true)
    const [errorPerfil, setErrorPerfil] = useState("")
    const [aviso, setAviso] = useState({ tipo: "", texto: "" })
    const [ultimaActualizacion, setUltimaActualizacion] = useState("")
    const [ultimaContrasena, setUltimaContrasena] = useState("")

    const [openEditar, setOpenEditar] = useState(false)
    const [editNombre, setEditNombre] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editError, setEditError] = useState("")
    const [guardandoPerfil, setGuardandoPerfil] = useState(false)

    const [openContrasena, setOpenContrasena] = useState(false)
    const [actual, setActual] = useState("")
    const [nueva, setNueva] = useState("")
    const [confirmar, setConfirmar] = useState("")
    const [errorContrasena, setErrorContrasena] = useState("")
    const [guardandoContrasena, setGuardandoContrasena] = useState(false)

    const [openAvatar, setOpenAvatar] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [avatarSeleccionado, setAvatarSeleccionado] = useState("")
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarError, setAvatarError] = useState("")
    const [guardandoAvatar, setGuardandoAvatar] = useState(false)

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    function limpiarPreviewTemporal() {
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current)
            previewObjectUrlRef.current = ""
        }
    }

    useEffect(function () {
        return function () {
            limpiarPreviewTemporal()
        }
    }, [])

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

    function obtenerSesion() {
        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            return raw ? JSON.parse(raw) : {}
        } catch {
            return {}
        }
    }

    function obtenerPerfilLocal() {
        try {
            const raw = localStorage.getItem("PERFIL_LOCAL")
            return raw ? JSON.parse(raw) : {}
        } catch {
            return {}
        }
    }

    function obtenerToken() {
        const tokenLegacy = localStorage.getItem("TOKEN")
        if (tokenLegacy) {
            return tokenLegacy
        }

        const sesion = obtenerSesion()
        return sesion?.token || ""
    }

    function formatearFecha(valor) {
        const d = new Date(valor)
        if (Number.isNaN(d.getTime())) {
            return "-"
        }
        return d.toLocaleDateString("es-PE")
    }

    function emitirActualizacionPerfil() {
        window.dispatchEvent(new Event("user-profile-updated"))
    }

    function persistirPerfil(perfilRaw, updatedAt, emitEvent) {
        const perfilNormalizado = {
            id: perfilRaw?.id || perfil.id || "",
            name: perfilRaw?.name || perfilRaw?.full_name || perfil.name || "Usuario",
            email: perfilRaw?.email || perfil.email || "usuario@correo.com",
            identificacion: perfilRaw?.identificacion || perfil.identificacion || perfilRaw?.id || "-",
            rol: perfilRaw?.rol || perfil.role || perfil.rol || "user",
            avatar_url: perfilRaw?.avatar_url || "",
        }

        setPerfil(perfilNormalizado)
        localStorage.setItem("PERFIL_LOCAL", JSON.stringify(perfilNormalizado))

        const sesion = obtenerSesion()
        localStorage.setItem(
            "DATOS_LOGIN",
            JSON.stringify({
                ...sesion,
                id: perfilNormalizado.id,
                name: perfilNormalizado.name,
                nombre: perfilNormalizado.name,
                email: perfilNormalizado.email,
                correo: perfilNormalizado.email,
                rol: perfilNormalizado.rol,
                avatar_url: perfilNormalizado.avatar_url,
            })
        )

        if (updatedAt) {
            setUltimaActualizacion(updatedAt)
            localStorage.setItem("PERFIL_UPDATED_AT", updatedAt)
        }

        if (emitEvent !== false) {
            emitirActualizacionPerfil()
        }
    }

    async function cargarPerfil() {
        const sesion = obtenerSesion()
        const perfilLocal = obtenerPerfilLocal()
        const fechaPerfilGuardada = localStorage.getItem("PERFIL_UPDATED_AT") || ""
        const fechaContrasenaGuardada = localStorage.getItem("PASSWORD_UPDATED_AT") || ""

        setUltimaActualizacion(fechaPerfilGuardada)
        setUltimaContrasena(fechaContrasenaGuardada)

        const perfilBase = {
            id: sesion?.id || perfilLocal?.id || "",
            name: sesion?.name || sesion?.nombre || perfilLocal?.name || "Usuario",
            email: sesion?.email || sesion?.correo || perfilLocal?.email || "usuario@correo.com",
            identificacion: perfilLocal?.identificacion || sesion?.id || "-",
            rol: sesion?.rol || perfilLocal?.rol || "user",
            avatar_url: sesion?.avatar_url || perfilLocal?.avatar_url || "",
        }
        setPerfil(perfilBase)

        const token = obtenerToken()
        if (!token) {
            setErrorPerfil("No hay sesion activa. Inicia sesion nuevamente.")
            setCargandoPerfil(false)
            return
        }

        setCargandoPerfil(true)
        setErrorPerfil("")

        try {
            const resp = await fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setErrorPerfil(data.detail || "No se pudo cargar tu perfil.")
                return
            }

            const updatedAt = data?.updated_at || fechaPerfilGuardada || ""
            const normalizado = {
                ...data,
                identificacion: perfilLocal?.identificacion || data?.id || "-",
            }
            persistirPerfil(normalizado, updatedAt, false)
        } catch {
            setErrorPerfil("No se pudo conectar con el backend para traer tu perfil.")
        } finally {
            setCargandoPerfil(false)
        }
    }

    useEffect(function () {
        cargarPerfil()
    }, [])

    function abrirEditar() {
        setEditNombre(perfil.name || "")
        setEditEmail(perfil.email || "")
        setEditError("")
        setOpenEditar(true)
    }

    function abrirContrasena() {
        setActual("")
        setNueva("")
        setConfirmar("")
        setErrorContrasena("")
        setOpenContrasena(true)
    }

    function abrirModalAvatar() {
        limpiarPreviewTemporal()
        setAvatarError("")
        setAvatarFile(null)
        setAvatarSeleccionado(PRESET_AVATARS.includes(perfil.avatar_url) ? perfil.avatar_url : "")
        setAvatarPreview(resolverAvatarSrc(perfil.avatar_url))
        setOpenAvatar(true)
    }

    function cerrarModalAvatar() {
        limpiarPreviewTemporal()
        setOpenAvatar(false)
        setAvatarError("")
        setAvatarFile(null)
        setAvatarSeleccionado("")
        setAvatarPreview("")
    }

    function onAvatarInputChange(ev) {
        setAvatarError("")
        const file = ev.target.files && ev.target.files[0] ? ev.target.files[0] : null

        if (!file) {
            return
        }

        const ext = `.${(file.name.split(".").pop() || "").toLowerCase()}`
        if (!ALLOWED_AVATAR_EXTENSIONS.has(ext)) {
            setAvatarError("Formato no permitido. Usa un formato de imagen valido.")
            return
        }

        if (file.size > MAX_AVATAR_BYTES) {
            setAvatarError("La imagen supera el limite de 5MB.")
            return
        }

        if (!file.type.startsWith("image/")) {
            setAvatarError("El archivo seleccionado no es una imagen.")
            return
        }

        limpiarPreviewTemporal()
        const objectUrl = URL.createObjectURL(file)
        previewObjectUrlRef.current = objectUrl
        setAvatarPreview(objectUrl)
        setAvatarFile(file)
        setAvatarSeleccionado("")
    }
    async function guardarPerfil(ev) {
        ev.preventDefault()
        setEditError("")
        setAviso({ tipo: "", texto: "" })

        const nombreLimpio = editNombre.trim()
        const emailLimpio = editEmail.trim().toLowerCase()

        if (!nombreLimpio || !emailLimpio) {
            setEditError("Completa nombre y email para continuar.")
            return
        }

        const token = obtenerToken()
        if (!token) {
            setEditError("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        setGuardandoPerfil(true)
        try {
            const resp = await fetch(`${API_URL}/me/profile`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    full_name: nombreLimpio,
                    email: emailLimpio,
                }),
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setEditError(data.detail || "No se pudo actualizar tu perfil.")
                return
            }

            const user = data?.user || {}
            const updatedAt = user?.updated_at || new Date().toISOString()
            persistirPerfil(user, updatedAt)

            setOpenEditar(false)
            setAviso({ tipo: "ok", texto: "Perfil actualizado correctamente." })
        } catch {
            setEditError("No se pudo conectar con el backend.")
        } finally {
            setGuardandoPerfil(false)
        }
    }

    async function guardarAvatar() {
        setAvatarError("")
        setAviso({ tipo: "", texto: "" })

        const token = obtenerToken()
        if (!token) {
            setAvatarError("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        if (!avatarFile && !avatarSeleccionado) {
            setAvatarError("Selecciona una imagen o un avatar antes de guardar.")
            return
        }

        setGuardandoAvatar(true)
        try {
            let data = {}
            let ok = false

            if (avatarFile) {
                const formData = new FormData()
                formData.append("file", avatarFile)

                const uploadResp = await fetch(`${API_URL}/me/avatar`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                })

                data = await uploadResp.json().catch(function () {
                    return {}
                })
                ok = uploadResp.ok
            } else {
                const presetResp = await fetch(`${API_URL}/me/profile`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        avatar_url: avatarSeleccionado,
                    }),
                })

                data = await presetResp.json().catch(function () {
                    return {}
                })
                ok = presetResp.ok
            }

            if (!ok) {
                setAvatarError(data.detail || "No se pudo actualizar la imagen de perfil.")
                return
            }

            const user = data?.user || {
                ...perfil,
                avatar_url: data?.avatar_url || avatarSeleccionado || perfil.avatar_url,
            }
            const updatedAt = user?.updated_at || new Date().toISOString()
            persistirPerfil(user, updatedAt)

            cerrarModalAvatar()
            setAviso({ tipo: "ok", texto: "Imagen de perfil actualizada correctamente." })
        } catch {
            setAvatarError("No se pudo conectar con el backend.")
        } finally {
            setGuardandoAvatar(false)
        }
    }

    async function cambiarContrasena(ev) {
        ev.preventDefault()
        setErrorContrasena("")
        setAviso({ tipo: "", texto: "" })

        if (!actual || !nueva || !confirmar) {
            setErrorContrasena("Completa todos los campos.")
            return
        }

        if (!passwordMeetsPolicy(nueva)) {
            setErrorContrasena(passwordPolicyMessage("La nueva contrasena"))
            return
        }

        if (nueva !== confirmar) {
            setErrorContrasena("La confirmacion no coincide con la nueva contraseña.")
            return
        }

        if (actual === nueva) {
            setErrorContrasena("La nueva contraseña debe ser diferente a la actual.")
            return
        }

        const token = obtenerToken()
        if (!token) {
            setErrorContrasena("Sesion expirada. Inicia sesion nuevamente.")
            return
        }

        setGuardandoContrasena(true)
        try {
            const resp = await fetch(`${API_URL}/me/password`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: actual,
                    new_password: nueva,
                }),
            })

            const data = await resp.json().catch(function () {
                return {}
            })

            if (!resp.ok) {
                setErrorContrasena(data.detail || "No se pudo actualizar la contraseña.")
                return
            }

            const now = new Date().toISOString()
            localStorage.setItem("PASSWORD_UPDATED_AT", now)
            setUltimaContrasena(now)
            setOpenContrasena(false)
            setActual("")
            setNueva("")
            setConfirmar("")
            setAviso({ tipo: "ok", texto: "Contraseña actualizada correctamente." })
        } catch {
            setErrorContrasena("No se pudo conectar con el backend.")
        } finally {
            setGuardandoContrasena(false)
        }
    }

    const avatarActualSrc = useMemo(
        function () {
            return resolverAvatarSrc(perfil.avatar_url)
        },
        [perfil.avatar_url]
    )
    const roleValue = normalizeRoleValue(perfil.rol)
    const esRolAdminPanel = isAdminPanelRole(roleValue)

    return (
        <div className="bg-slate-100 text-slate-800 min-h-screen">
            {esRolAdminPanel ? <NavBarAdmin onLogout={logout} /> : <NavBarUser onLogout={logout} />}

            <main className="w-full px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
                <div className="mx-auto w-full max-w-[1200px] space-y-5">
                    {aviso.texto && (
                        <div
                            className={`rounded-xl border px-4 py-3 text-sm ${aviso.tipo === "ok"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                        >
                            {aviso.texto}
                        </div>
                    )}

                    {errorPerfil && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {errorPerfil}
                        </div>
                    )}

                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={function () {
                                navigate(esRolAdminPanel ? "/admin" : "/user")
                            }}
                        >
                            <span aria-hidden="true">←</span>
                            {esRolAdminPanel ? "Volver al dashboard" : "Volver a egresos"}
                        </button>
                    </div>

                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="relative">
                                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-blue-900/20 bg-white">
                                        <img
                                            src={avatarActualSrc}
                                            alt="Avatar usuario"
                                            className="h-14 w-14 rounded-full object-cover"
                                            onError={function (ev) {
                                                ev.currentTarget.src = "/img/user.jpg"
                                            }}
                                        />
                                    </span>
                                    <button
                                        type="button"
                                        onClick={abrirModalAvatar}
                                        aria-label="Cambiar imagen de perfil"
                                        className="absolute -right-1 -bottom-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-sm transition hover:bg-blue-50"
                                    >
                                        <img src="/img/icon1.png" alt="" className="h-3.5 w-3.5 object-contain" />
                                    </button>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-800">
                                            {perfil.name}
                                        </h1>
                                        <RoleBadge role={roleValue} />
                                    </div>
                                    <p className="truncate text-base text-slate-500">{perfil.email}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {cargandoPerfil ? "Cargando perfil..." : "Gestiona tus datos y seguridad de cuenta."}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left lg:text-right">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Ultima actualizacion
                                </p>
                                <p className="text-base font-bold text-slate-700">
                                    {ultimaActualizacion ? formatearFecha(ultimaActualizacion) : "-"}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Mi perfil</h2>
                            <button
                                type="button"
                                onClick={abrirEditar}
                                className="rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                Editar
                            </button>
                        </div>

                        <div className="grid gap-5 px-4 py-5 sm:grid-cols-2 sm:px-6">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</p>
                                <p className="mt-2 text-lg font-semibold text-slate-700 break-words">{perfil.name}</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                                <p className="mt-2 text-lg font-semibold text-slate-700 break-all">{perfil.email}</p>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Seguridad</h2>
                        </div>

                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Contraseña</p>
                                    <p className="text-sm text-slate-500">**************</p>
                                </div>

                                <div className="flex flex-col items-start gap-3 md:items-end">
                                    <p className="text-sm text-slate-500">
                                        Ultima modificacion: {ultimaContrasena ? formatearFecha(ultimaContrasena) : "-"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={abrirContrasena}
                                        className="rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                                    >
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {openEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0"
                        onClick={function () {
                            setOpenEditar(false)
                        }}
                    />

                    <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
                        <button
                            type="button"
                            aria-label="Cerrar"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                            onClick={function () {
                                setOpenEditar(false)
                            }}
                        >
                            X
                        </button>

                        <div className="space-y-1 pr-10">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Editar mi perfil</h2>
                            <p className="text-sm text-slate-500">
                                Ajusta tus datos personales para mantener tu cuenta al dia.
                            </p>
                        </div>

                        <form className="mt-6 space-y-4" onSubmit={guardarPerfil}>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Nombre</label>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={function (ev) {
                                        setEditNombre(ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={function (ev) {
                                        setEditEmail(ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={abrirModalAvatar}
                                className="rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                Cambiar imagen de perfil
                            </button>

                            {editError && (
                                <p className="text-sm font-medium text-rose-600">{editError}</p>
                            )}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                                    onClick={function () {
                                        setOpenEditar(false)
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardandoPerfil}
                                    className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {openAvatar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0"
                        onClick={cerrarModalAvatar}
                    />

                    <section className="relative z-10 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
                        <button
                            type="button"
                            aria-label="Cerrar"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                            onClick={cerrarModalAvatar}
                        >
                            X
                        </button>

                        <h2 className="pr-10 text-2xl font-extrabold tracking-tight text-slate-700">
                            Cambiar imagen de perfil
                        </h2>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="hidden h-56 rounded-xl bg-slate-100 sm:block" />
                            <div className="flex h-56 items-center justify-center rounded-xl bg-slate-100 p-4">
                                <img
                                    src={avatarPreview || avatarActualSrc}
                                    alt="Vista previa avatar"
                                    className="h-48 w-48 rounded-full object-cover"
                                    onError={function (ev) {
                                        ev.currentTarget.src = "/img/user.jpg"
                                    }}
                                />
                            </div>
                            <div className="hidden h-56 rounded-xl bg-slate-100 sm:block" />
                        </div>

                        <p className="mt-6 text-center text-base text-slate-700">
                            O elige uno de nuestros avatares:
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                            {PRESET_AVATARS.map(function (avatar) {
                                const activo = avatarSeleccionado === avatar && !avatarFile
                                return (
                                    <button
                                        key={avatar}
                                        type="button"
                                        onClick={function () {
                                            limpiarPreviewTemporal()
                                            setAvatarFile(null)
                                            setAvatarError("")
                                            setAvatarSeleccionado(avatar)
                                            setAvatarPreview(avatar)
                                        }}
                                        className={`rounded-full border p-1 transition ${activo ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200 hover:border-sky-300"
                                            }`}
                                    >
                                        <img src={avatar} alt="Avatar predefinido" className="h-10 w-10 rounded-full object-cover" />
                                    </button>
                                )
                            })}
                        </div>

                        <input
                            ref={avatarInputRef}
                            type="file"
                            className="hidden"
                            accept={ACCEPTED_IMAGE_TYPES}
                            onChange={onAvatarInputChange}
                        />

                        {avatarError && (
                            <p className="mt-4 text-center text-sm font-medium text-rose-600">{avatarError}</p>
                        )}

                        <div className="mt-6 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                className="rounded-full border border-sky-500 px-8 py-2.5 text-lg font-semibold text-sky-600 transition hover:bg-sky-50"
                                onClick={function () {
                                    if (avatarInputRef.current) {
                                        avatarInputRef.current.click()
                                    }
                                }}
                            >
                                Agregar imagen
                            </button>
                            <button
                                type="button"
                                disabled={guardandoAvatar}
                                onClick={guardarAvatar}
                                className="rounded-full bg-emerald-500 px-8 py-2.5 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {guardandoAvatar ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {openContrasena && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0"
                        onClick={function () {
                            setOpenContrasena(false)
                        }}
                    />

                    <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
                        <button
                            type="button"
                            aria-label="Cerrar"
                            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                            onClick={function () {
                                setOpenContrasena(false)
                            }}
                        >
                            X
                        </button>

                        <div className="space-y-1 pr-10">
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Cambiar contraseña</h2>
                            <p className="text-sm text-slate-500">
                                Por seguridad, usa una contraseña nueva y fuerte para tu cuenta.
                            </p>
                        </div>

                        <form className="mt-6 space-y-4" onSubmit={cambiarContrasena}>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={actual}
                                    onChange={function (ev) {
                                        setActual(ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={nueva}
                                    onChange={function (ev) {
                                        setNueva(ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                                <p className="text-xs text-slate-500">
                                    Debe tener minimo 8 caracteres y al menos 1 simbolo.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={confirmar}
                                    onChange={function (ev) {
                                        setConfirmar(ev.target.value)
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={function () {
                                    setOpenContrasena(false)
                                    navigate("/restablecer")
                                }}
                                className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                            >
                                Olvidaste tu contraseña?
                            </button>

                            {errorContrasena && (
                                <p className="text-sm font-medium text-rose-600">{errorContrasena}</p>
                            )}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                                    onClick={function () {
                                        setOpenContrasena(false)
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardandoContrasena}
                                    className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {guardandoContrasena ? "Actualizando..." : "Cambiar contraseña"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    )
}

export default PerfilUsuarioPage
