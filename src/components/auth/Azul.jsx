function Azul() {
    {/* <!-- A partir de md size se considera un bloque (menos de eso y se oculta)--> */}
    return (
        <section
            className="h-20 md:h-[100svh] w-full"
            style={{
                backgroundImage: "url('/img/azul.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />
    )
}
export default Azul;