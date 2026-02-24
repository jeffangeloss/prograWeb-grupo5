import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ConfirmarEmailPage() {
  const navigate = useNavigate()

  const [token, setToken] = useState("")
  const [estado, setEstado] = useState("idle")
  // idle | enviando | ok | error
  const [error, setError] = useState("")

  async function verificarCorreo(e) {
    e.preventDefault()
    setEstado("enviando")
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:8000/mailverif/confirm", {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <form
        onSubmit={verificarCorreo}
        style={{
          maxWidth: 400,
          width: "100%",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Verificar correo</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          Ingresa el token que recibiste por correo para activar tu cuenta.
        </p>

        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token de verificación"
          required
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 16
          }}
        />

        <button
          type="submit"
          disabled={estado === "enviando"}
          style={{
            width: "100%",
            padding: 12,
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            opacity: estado === "enviando" ? 0.7 : 1
          }}
        >
          {estado === "enviando" ? "Verificando..." : "Verificar correo"}
        </button>

        {estado === "ok" && (
          <div style={{ marginTop: 20, color: "green" }}>
            <p>✅ Correo verificado correctamente</p>
            <button
              type="button"
              onClick={() => navigate("/sesion")}
              style={{
                marginTop: 10,
                background: "transparent",
                border: "none",
                color: "#4f46e5",
                cursor: "pointer"
              }}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        {estado === "error" && (
          <p style={{ marginTop: 20, color: "red" }}>{error}</p>
        )}
      </form>
    </div>
  )
}