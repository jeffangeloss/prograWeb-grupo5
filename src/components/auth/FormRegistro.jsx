import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordMeetsPolicy, passwordPolicyMessage } from "../../utils/passwordPolicy";
import params from "../../params";

/* para corroborar correo; “Desde el inicio hasta el final del texto, debe haber algo sin espacios + @ + algo sin espacios + . + algo sin espacios (ej. x@y.z”*/ 
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
function FormRegistro() {
    const navigate = useNavigate();

    /* El form inicia vacio, var estado*/ 
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
        confirm: "",
    });
    /* Para el checkbox de términos y condiciones - falso hasta ser marcado*/ 
    const [acepta, setAcepta] = useState(false);
    /* Para los errores - inicia como array vacío */ 
    const [errores, setErrores] = useState([]);
    /* Para que los errores solo aparezcan cuando se intente enviar (no todo el tiempo)*/ 
    const [intentoEnviar, setIntentoEnviar] = useState(false);
    const [enviando, setEnviando] = useState(false);

    function validar(valores, aceptaTerminos) {
        const errs = [];

        const faltanCampos =
            !valores.nombre ||
            !valores.apellido ||
            !valores.correo ||
            !valores.password ||
            !valores.confirm;

        if (faltanCampos) {
            errs.push("Debe completar todos los campos para continuar");
        }
        if (valores.correo && !EMAIL_REGEX.test(valores.correo)) {
            errs.push("El correo ingresado es inválido");
            /* si el correo no tiene el formato declarado en EMAIL_REGEX */ 
        }
        if (valores.password) {
            if (!passwordMeetsPolicy(valores.password)) {
                errs.push(passwordPolicyMessage("La contraseña"));
            }
        }
        if (!aceptaTerminos) errs.push("Debe aceptar los términos y condiciones.");
        if (valores.password && valores.confirm && valores.password !== valores.confirm) {
            errs.push("Las contraseñas no coinciden");
        }
        return errs;
    }

    function onChange(e) {
        const { name, value } = e.target;

        const siguiente = { ...form, [name]: value };
        setForm(siguiente);

        // Si ya intentó enviar, revalidamos para que se actualicen mensajes al escribir
        if (intentoEnviar) {
            setErrores(validar(siguiente, acepta));
        }
    }

    function onChangeAcepta(e) {
        const checked = e.target.checked;
        setAcepta(checked);

        if (intentoEnviar) {
            setErrores(validar(form, checked));
        }
    }

    async function registrarHTTP(payload) {
        const respuesta = await fetch(`${params.BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        let data = null;
        try {
            data = await respuesta.json();
        } catch {
            data = null;
        }

        if (!respuesta.ok) {
            if (typeof data?.detail === "string") {
                return { ok: false, error: data.detail };
            }
            if (typeof data?.detail?.msg === "string") {
                return { ok: false, error: data.detail.msg };
            }
            return { ok: false, error: "No se pudo crear la cuenta" };
        }

        return { ok: true, data };
    }

    async function onSubmit(e) {
        e.preventDefault();
        setIntentoEnviar(true);

        const errs = validar(form, acepta);
        setErrores(errs);

        // si hay al menos 1 error, NO se crea cuenta ni se redirige
        if (errs.length > 0) return;

        const payload = {
            full_name: `${form.nombre.trim()} ${form.apellido.trim()}`.trim(),
            email: form.correo.trim().toLowerCase(),
            password: form.password,
        };

        setEnviando(true);
        const resultado = await registrarHTTP(payload);

        if (!resultado.ok) {
            setErrores([resultado.error]);
            setEnviando(false)
            return;
        }

        try {
            await fetch(`${params.BACKEND_URL}/mailverif/send`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({ email: payload.email })
            });
        } catch (error) {
            console.error("No se pudo enviar el correo: ", error)
        }

        setEnviando(false)

        navigate("/registro/verif")
    }


    return (
        <form className="space-y-5" onSubmit={onSubmit}> {/* <!-- como un margin automatico para cada seccion --> */}
            {/* <!-- GRID PRINCIPAL --> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <!-- NOMBRE --> */}
                <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium text-slate-700">Nombre</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                        value={form.nombre}
                        onChange={onChange}
                    />
                </div>

                {/* <!-- APELLIDO --> */}
                <div className="space-y-2">
                    <label htmlFor="apellido" className="text-sm font-medium text-slate-700">Apellido</label>
                    <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        placeholder="Apellido"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                        value={form.apellido}
                        onChange={onChange}
                    />
                </div>

                {/* <!-- CORREO (full width) --> */}
                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="correo" className="text-sm font-medium text-slate-700">Correo electrónico</label>
                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        placeholder="hello@reallygreatsite.com"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                        value={form.correo}
                        onChange={onChange}
                    />
                </div>

                {/* <!-- CONTRASEÑA --> */}
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                        value={form.password}
                        onChange={onChange}
                    />
                </div>

                {/* <!-- CONFIRMAR --> */}
                <div className="space-y-2">
                    <label htmlFor="confirm" className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
                    <input
                        id="confirm"
                        name="confirm"
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none shadow-sm focus:border-[#bb88ee] focus:ring-4 focus:ring-[#bb88ee] focus:ring-offset-2 focus:ring-offset-white"
                        value={form.confirm}
                        onChange={onChange}
                    />
                </div>
            </div>

            {/* <!-- CHECKBOX --> */}
            <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                    type="checkbox"
                    checked={acepta}
                    onChange={onChangeAcepta}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                />
                <span>Acepto los términos y condiciones.</span>
            </label>

            {/* <!-- BOTÓN --> */}
            <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 active:scale-[0.99] transition disabled:cursor-not-allowed disabled:opacity-70"
            >
                {enviando ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* <!-- ERRORES --> */}
            {errores.length > 0 && (
                <div className="pt-2 space-y-1 text-sm text-red-500">
                    {errores.map((msg) => (
                        <p key={msg}>{msg}</p>
                    ))}
                </div>
            )}
        </form>
    )
}
export default FormRegistro;
