import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import params from "../params"

export default function ConfirmarEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [token, setToken] = useState("")
  const [estado, setEstado] = useState("idle")
  const [error, setError] = useState("")

  useEffect(() => {
    const tokenFromUrl = (searchParams.get("token") || "").trim()
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  async function verificarCorreo(e) {
    e.preventDefault()
    setEstado("enviando")
    setError("")

    try {
      const res = await fetch(`${params.BACKEND_URL}/mailverif/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.detail || "Token inválido o expirado")
      }

      setEstado("ok")
    } catch (err) {
      setEstado("error")
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={verificarCorreo}
        className="
          w-full
          max-w-2xl
          rounded-2xl
          bg-white
          p-10
          shadow-xl
          border
          border-slate-100
          space-y-5
          text-center
        "
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Verificar correo
          </h1>
          <p className="text-slate-500">
            Ingresa el token que recibiste por correo para activar tu cuenta
          </p>
        </div>

        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token de verificación"
          required
          className="
            w-full
            rounded-md
            border
            border-slate-200
            px-4
            py-3
            text-slate-700
            placeholder:text-slate-400
            outline-none
            shadow-sm
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-200
          "
        />

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="
            w-full
            rounded-full
            bg-indigo-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-sm
            hover:bg-indigo-700
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-300
            transition
            disabled:opacity-70
          "
        >
          {estado === "enviando" ? "Verificando..." : "Verificar correo"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/registro")}
          className="w-full rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-600 hover:bg-slate-100"
        >
          Volver
        </button>

        {estado === "ok" && (
          <div className="space-y-3 pt-4">
            <p className="text-green-600 font-medium">
              Correo verificado correctamente
            </p>
            <button
              type="button"
              onClick={() => navigate("/sesion")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        {estado === "error" && (
          <p className="pt-4 text-red-500">{error}</p>
        )}
      </form>
    </div>
  )
}
