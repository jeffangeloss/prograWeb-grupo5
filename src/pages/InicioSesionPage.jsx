import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Mensaje from "../components/Mensaje"
import LoginForm from "../components/LoginForm"
import Azul from "../components/auth/Azul"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import { getAuthSession, hasActiveSession } from "../utils/auth"
import params from "../params"
import ThemeToggleButton from "../components/ThemeToggleButton"

function InicioSesionPage() {

    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    function detectarNavegador() {
        if (typeof navigator === "undefined") {
            return "Desconocido"
        }

        const uaData = navigator.userAgentData
        if (uaData && Array.isArray(uaData.brands)) {
            const brands = uaData.brands
                .map(function (item) {
                    return (item?.brand || "").toLowerCase()
                })

            if (brands.some(function (brand) { return brand.includes("brave") })) return "Brave"
            if (brands.some(function (brand) { return brand.includes("edge") })) return "Edge"
            if (brands.some(function (brand) { return brand.includes("opera") })) return "Opera"
            if (brands.some(function (brand) { return brand.includes("firefox") })) return "Firefox"
            if (brands.some(function (brand) { return brand.includes("safari") })) return "Safari"
            if (brands.some(function (brand) { return brand.includes("chrom") })) return "Chrome"
        }

        const ua = (navigator.userAgent || "").toLowerCase()
        if (ua.includes("brave")) return "Brave"
        if (ua.includes("edg/")) return "Edge"
        if (ua.includes("opr/") || ua.includes("opera")) return "Opera"
        if (ua.includes("firefox")) return "Firefox"
        if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
        if (ua.includes("chrome")) return "Chrome"
        return "Desconocido"
    }

    useEffect(function () {
        if (!hasActiveSession()) {
            return
        }

        const login = getAuthSession()
        const role = normalizeRoleValue(login?.rol)
        if (isAdminPanelRole(role)) {
            navigate("/admin")
        } else {
            navigate("/user")
        }
    }, [])

    async function loginHTTP(correo, password) {
        const navegadorActual = detectarNavegador()
        const resp = await fetch(`${params.BACKEND_URL}/login`, {
            method: "post",
            body: JSON.stringify({
                correo: correo,
                password: password
            }),
            headers: {
                "content-type": "application/json",
                "x-browser-name": navegadorActual
            }
        })

        if (resp.status != 200) {
            // Error en el login
            const data = await resp.json()
            console.error("ERROR:", data)

            if (
                data?.detail &&
                data.detail.toLowerCase().includes("verificar")
            ) {
                return {
                    valido: false,
                    noVerificado: true,
                    error: data.detail
                }
            }

            return {
                valido: false,
                error: data.detail || "Error en login"
            }
        }

        const data = await resp.json()
        if (data.msg == "Acceso concedido") {
            const rolNormalizado = normalizeRoleValue(data.rol)
            return {
                valido: true,
                rol: rolNormalizado,
                token: data.access_token || data.token || "",
                nombre: data.name || "",
                correo: data.email || correo,
                id: data.id || "",
                avatar_url: data.avatar_url || "",
            }
        } else {
            console.error(data.detail)
            return {
                valido: false,
                error: data.detail || "Respuesta inesperada del servidor"
            }
        }
    }

    async function login(correo, password) {
        if (!correo || !password) {
            setMensaje("Debe completar todos los campos para continuar")
            setMensajeVisible(true)
            return
        }

        const resultadoLogin = await loginHTTP(correo, password)

        if (resultadoLogin.noVerificado) {
            setMensaje(resultadoLogin.error)
            setMensajeVisible(true)
            return
        }
        
        if (resultadoLogin.valido) {
            setMensaje("")
            setMensajeVisible(false)

            const datosLogin = {
                ingreso: true,
                correo: resultadoLogin.correo || correo,
                nombre: resultadoLogin.nombre || "",
                rol: resultadoLogin.rol,
                id: resultadoLogin.id || "",
                avatar_url: resultadoLogin.avatar_url || "",
                token: resultadoLogin.token || "",
                cantidadIntentos: 0,
            }
            localStorage.setItem("DATOS_LOGIN", JSON.stringify(datosLogin))
            if (resultadoLogin.token) {
                localStorage.setItem("TOKEN", resultadoLogin.token)
            }

            if (isAdminPanelRole(resultadoLogin.rol)) {
                navigate("/admin")
            } else {
                navigate("/user")
            }
            return
        }

        setMensaje("Correo y/o contraseña incorrectos")
        setMensajeVisible(true)

        const datosLogin = localStorage.getItem("DATOS_LOGIN")
        if (datosLogin == null) {
            localStorage.setItem("DATOS_LOGIN", JSON.stringify({ ingreso: false, cantidadIntentos: 1 }))
        } else {
            const login = JSON.parse(datosLogin)
            login.cantidadIntentos = (login.cantidadIntentos || 0) + 1
            localStorage.setItem("DATOS_LOGIN", JSON.stringify(login))
        }
    }

    return <div className="min-h-screen bg-white text-slate-800">
        <div className="md:min-h-screen grid grid-cols-1 md:grid-cols-[20%_80%]">
            {/*imagen izq*/}
            <Azul />

            {/* contenido derecha */}
            <div className="px-4 py-8 sm:px-8 lg:px-16">
                {/* boton regresar */}
                <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-600">
                    <ThemeToggleButton />
                    <span className="text-gray-700 text-sm sm:text-base">¿No tienes una cuenta?</span>
                    <a href="#/registro"
                        className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        Registrarse
                    </a>
                </div>

                <div>
                    {/* header */}
                    <div className="my-8 sm:my-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-700">INICIAR SESIÓN</h1>
                        <p className="mt-2 text-slate-500">Inicia sesión y empieza a gestionar tu dinero</p>
                    </div>

                    <LoginForm onLogin={login} />
                    {/* mensaje de error */}
                    <Mensaje
                        msg={mensaje}
                        visible={mensajeVisible}
                    />
                </div>
            </div>
        </div>
    </div>
}

export default InicioSesionPage
