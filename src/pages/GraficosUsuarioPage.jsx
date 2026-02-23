import { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    ArcElement,
    Legend,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import NavBarUser from "../components/NavBarUser"
import { useNavigate } from "react-router-dom"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"


ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    ArcElement,
    Legend
);



function GraficosUsuarioPage() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(-1)

    const monthLabels = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ]

    const monthlyMap = {}
    stats?.monthly?.forEach(function (item) {
        monthlyMap[item.month] = item.total
    })

    const monthlyData = monthLabels.map(function (_, index) {
        return monthlyMap[index + 1] || 0
    })

    const categoryLabels = stats?.by_category?.map(c => c.category) || []
    const categoryValues = stats?.by_category?.map(c => c.total) || []

    function obtenerSesion() {
        try {
            const raw = localStorage.getItem("DATOS_LOGIN")
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function obtenerToken() {
        const sesion = obtenerSesion()
        return sesion?.token || ""
    }

    useEffect(function () {
        async function statsHTTP() {
            const raw = localStorage.getItem("DATOS_LOGIN")
            const sesion = raw ? JSON.parse(raw) : null
            const token = sesion?.token

            if (!token) return

            let url = "http://127.0.0.1:8000/expenses/stats"

            if (selectedMonth != -1) {
                url = url + "?month=" + selectedMonth
            }

            try {
                const resp = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await resp.json()
                if (resp.ok) {
                    setStats(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        statsHTTP()
    }, [selectedMonth])

    useEffect(function () {
        const sesion = obtenerSesion()
        const role = normalizeRoleValue(sesion?.rol || "user")

        if (isAdminPanelRole(role)) {
            navigate("/admin")
            return
        }

        if (role !== "user") {
            navigate("/sesion")
        }
    }, [navigate])

    const dataLine = {
        labels: monthLabels,
        datasets: [{
            label: "Egresos mensuales",
            data: monthlyData,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            tension: 0.4,
            fill: true
        }]
    }
    const dataBar = {
        labels: monthLabels,
        datasets: [
            {
                label: "Egresos mensuales",
                data: monthlyData,
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)",
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                    "rgba(249, 115, 22, 0.8)",
                    "rgba(147, 51, 234, 0.8)",
                    "rgba(59, 130, 246, 0.8)"
                ],
                borderWidth: 1,
            }
        ]
    };

    const dataDoughnut = {
        labels: categoryLabels,
        datasets: [
            {
                label: "Egresos por categoría",
                data: categoryValues,
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)",
                    "rgba(16, 185, 129, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                    "rgba(249, 115, 22, 0.8)",
                    "rgba(147, 51, 234, 0.8)"
                ],
                borderWidth: 0
            }
        ]
    };
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        cutout: "70%",
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    return <div className="h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
        <NavBarUser onLogout={logout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="my-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-700">Egresos del mes</h1>
                    <select
                        value={selectedMonth}
                        onChange={function (e) {
                            setSelectedMonth(Number(e.target.value))
                        }}
                        className="mb-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    >
                        <option value={-1}>Todos los meses</option>
                        <option value={1}>Enero</option>
                        <option value={2}>Febrero</option>
                        <option value={3}>Marzo</option>
                        <option value={4}>Abril</option>
                        <option value={5}>Mayo</option>
                        <option value={6}>Junio</option>
                        <option value={7}>Julio</option>
                        <option value={8}>Agosto</option>
                        <option value={9}>Septiembre</option>
                        <option value={10}>Octubre</option>
                        <option value={11}>Noviembre</option>
                        <option value={12}>Diciembre</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="w-min sm:w-auto px-6 py-2.5 rounded-full border border-blue-900/30 text-blue-900 hover:bg-blue-900/10 transition"
                    onClick={function () { navigate("/user") }}>Regresar
                </button>

            </div>


            <div className="grid grid-cols-1 justify-items-center lg:grid-cols-2 xl:grid-cols-3 gap-4 m-3 ">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {stats && <Line data={dataLine} />}
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {stats && <Doughnut data={dataDoughnut} options={doughnutOptions} />}
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {stats && <Bar data={dataBar} options={barOptions} />}
                </div>
            </div>

        </div>

    </div>

}

export default GraficosUsuarioPage
