import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import params from "../params"
import { getAuthToken } from "../utils/auth"

function ChatBotPage({ isOpen, setIsOpen }) {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: "\u00A1Hola! Soy tu asesor financiero. \u00BFEn qu\u00E9 puedo ayudarte hoy?",
            timestamp: new Date(),
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping, isOpen])

    const handleSendMessage = async (e) => {
        e?.preventDefault()
        if (!input.trim() || isTyping) return

        const token = getAuthToken()
        if (!token) {
            alert("No est\u00E1s autenticado")
            return
        }
        const userMessage = {
            role: 'user',
            text: input,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        try {
            const response = await fetch(`${params.API_URL}/chat/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input
                })
            })

            const raw = await response.text()
            let data = {}
            try {
                data = raw ? JSON.parse(raw) : {}
            } catch {
                data = {}
            }

            if (!response.ok) {
                const detail = Array.isArray(data?.detail)
                    ? data.detail.map((item) => item?.msg || "Error de validaci\u00F3n").join(" | ")
                    : (typeof data?.detail === "string"
                        ? data.detail
                        : `Error ${response.status} en chatbot`)
                throw new Error(detail)
            }

            setMessages(prev => [...prev, {
                role: 'model',
                text: data.text || "No pude procesar eso.",
                timestamp: new Date(),
            }])

        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'model',
                text: error?.message || "Error de conexi\u00F3n con el servidor.",
                timestamp: new Date(),
            }])
        } finally {
            setIsTyping(false)
        }
    }

    if (!isOpen) return null

    return (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000, fontFamily: 'sans-serif' }}>
            <div style={{
                width: '350px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #eee'
            }}>
                <div style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Asesor Financiero</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar chatbot"
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', lineHeight: 1, fontWeight: 700 }}
                    >
                        {'\u00D7'}
                    </button>
                </div>

                <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                            <div style={{
                                display: 'inline-block',
                                padding: '10px',
                                borderRadius: '10px',
                                maxWidth: '80%',
                                fontSize: '14px',
                                backgroundColor: msg.role === 'user' ? '#4f46e5' : 'white',
                                color: msg.role === 'user' ? 'white' : '#333',
                                border: msg.role === 'user' ? 'none' : '1px solid #eee'
                            }}>
                                {msg.role === 'user'
                                    ? msg.text
                                    : <ReactMarkdown>{msg.text}</ReactMarkdown>
                                }
                            </div>
                        </div>
                    ))}
                    {isTyping && <div style={{ fontSize: '12px', color: '#999' }}>Escribiendo...</div>}
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta algo..."
                        style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' }}
                    />
                    <button type="submit" disabled={isTyping} style={{ padding: '8px 15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatBotPage

