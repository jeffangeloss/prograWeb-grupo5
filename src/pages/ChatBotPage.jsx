import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

function ChatBotPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: "¡Hola! Soy tu asesor financiero. ¿En qué puedo ayudarte hoy?",
            timestamp: new Date(),
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = {
            role: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const model = "gemini-2.5-flash";
            const systemInstruction = "Eres un asesor financiero experto. Da consejos cortos y útiles en español.";

            const response = await genAI.models.generateContent({
                model,
                contents: [
                    ...messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.text }]
                    })),
                    { role: 'user', parts: [{ text: input }] }
                ],
                config: { systemInstruction },
            });

            setMessages(prev => [...prev, {
                role: 'model',
                text: response.text || "No pude procesar eso.",
                timestamp: new Date(),
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'model',
                text: "Error de conexión.",
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'sans-serif' }}>
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '15px',
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {/* Header */}
                    <div style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Asesor Financiero</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>×</button>
                    </div>

                    {/* Chat */}
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
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && <div style={{ fontSize: '12px', color: '#999' }}>Escribiendo...</div>}
                    </div>

                    {/* Input */}
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
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isOpen ? '↓' : '💬'}
            </button>
        </div>
    );
}

export default ChatBotPage
