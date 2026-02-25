function Azul() {
    {/* <!-- A partir de md size se considera un bloque (menos de eso y se oculta)--> */}
    return (
        <section
            className="h-20 md:h-[100svh] w-full"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dmmyupwuu/image/upload/v1771998697/azul_kffdop.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        />
    )
}
export default Azul;