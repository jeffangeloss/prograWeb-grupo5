import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Mensaje from "../components/Mensaje"
import LoginForm from "../components/LoginForm"
import Azul from "../components/auth/Azul"

function InicioSesionPage() {

    const [mensajeVisible, setMensajeVisible] = useState(false)
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    useEffect(function () {
        const datosLogin = localStorage.getItem("DATOS_LOGIN")
        if (datosLogin != null) {
            const login = JSON.parse(datosLogin)
            if (login.ingreso == true) {
                if (login.rol == "admin") {
                    navigate("/admin")
                } else {
                    navigate("/user")
                }
                return
            }
        }
    }, [])

    async function loginHTTP(correo, password) {
        const resp = await fetch("http://127.0.0.1:8000/login", {
            method: "post",
            body: JSON.stringify({
                correo: correo,
                password: password
            }),
            headers: {
                "content-type": "application/json"
            }
        })

        if (resp.status != 200) {
            // Error en el login
            const data = await resp.json()
            console.error("ERROR:", data)
            return {
                valido: false,
                error: data.detail || "Error en login"
            }
        }

        const data = await resp.json()
        if (data.msg == "Acceso concedido") {
            return {
                valido: true,
                rol: data.rol, // se obtiene admin o usuario
                token: data.access_token || data.token || "",
                nombre: data.name || "",
                correo: data.email || correo,
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
        
        if (resultadoLogin.valido) {
            setMensaje("")
            setMensajeVisible(false)

            const datosLogin = {
                ingreso: true,
                correo: resultadoLogin.correo || correo,
                nombre: resultadoLogin.nombre || "",
                rol: resultadoLogin.rol,
                token: resultadoLogin.token || "",
                cantidadIntentos: 0,
            }
            localStorage.setItem("DATOS_LOGIN", JSON.stringify(datosLogin))
            if (resultadoLogin.token) {
                localStorage.setItem("TOKEN", resultadoLogin.token)
            }

            if (resultadoLogin.rol == "admin") {
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
            <div className="py-8 px-16">
                {/* boton regresar */}
                <div className="justify-self-end flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-gray-700 text-sm sm:text-base">¿No tienes una cuenta?</span>
                    <a href="#/registro"
                        className="inline-flex items-center justify-center rounded-full border border-indigo-400 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        Registrarse
                    </a>
                </div>

                <div>
                    {/* header */}
                    <div className="my-10">
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-700">INICIAR SESIÓN</h1>
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
