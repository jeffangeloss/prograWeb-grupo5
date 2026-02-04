import { useNavigate } from "react-router-dom"
import NavBarUser from "../components/NavBarUser"

function ChatBotPage() {
    const navigate = useNavigate()

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            <NavBarUser onLogout={logout}/>

            <main className="p-4 flex justify-center">
                <div className="w-full max-w-3xl">

                    <div className="bg-white border border-slate-200 rounded-xl">

                        {/* HEADER */}
                        <div className="p-4 border-b border-slate-200">
                            <h1 className="text-lg font-bold">
                                Chatbot
                            </h1>
                            <p className="text-sm text-slate-500">
                                Asistente virtual
                            </p>
                        </div>

                        {/* MENSAJES (solo maqueta) */}
                        <div className="p-4 h-[60vh] overflow-y-auto space-y-2">

                            <div className="bg-slate-100 px-3 py-2 rounded-md text-sm max-w-xs">
                                Hola, ¿en qué puedo ayudarte?
                            </div>

                            <div className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm max-w-xs ml-auto">
                                Quiero ver mis egresos
                            </div>

                            <div className="bg-slate-100 px-3 py-2 rounded-md text-sm max-w-xs">
                                Puedes revisar tus egresos en el menú principal.
                            </div>

                        </div>

                        {/* INPUT (no funcional) */}
                        <div className="border-t border-slate-200 p-3 flex gap-2">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm"
                            />
                            <button
                                className="bg-indigo-500 text-white px-4 rounded-md text-sm"
                            >
                                Enviar
                            </button>
                        </div>

                    </div>

                </div>
            </main>
            <button type="button"
            className="fixed bottom-4 left-4 z-50 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700"
            onClick={function() {
                navigate("/user")
            }}>
                Regresar
            </button>
        </div>
    )
}

export default ChatBotPage
