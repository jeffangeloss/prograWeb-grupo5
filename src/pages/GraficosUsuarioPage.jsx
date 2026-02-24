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
    const [statsCurrent, setStatsCurrent] = useState(null)
    const [statsPrevious, setStatsPrevious] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(-1)

    const monthLabels = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ]

    function buildMonthlyData(stats) {
        const map = {}
        stats?.monthly?.forEach(item => {
            map[item.month] = item.total
        })

        return monthLabels.map((_, index) => {
            return map[index + 1] || 0
        })
    }

    const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1

    const monthlyCurrent = buildMonthlyData(statsCurrent)
    const monthlyPrevious = buildMonthlyData(statsPrevious)

    const categoryLabels = statsCurrent?.by_category?.map(c => c.category) || []
    const categoryValues = statsCurrent?.by_category?.map(c => c.total) || []

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

            const currentYear = new Date().getFullYear()
            const previousYear = currentYear - 1

            async function fetchYear(year) {
                let url = `http://127.0.0.1:8000/expenses/stats?year=${year}`

                if (selectedMonth !== -1) {
                    url += `&month=${selectedMonth}`
                }

                const resp = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                return resp.ok ? resp.json() : null
            }

            try {
                const [currentData, previousData] = await Promise.all([
                    fetchYear(currentYear),
                    fetchYear(previousYear)
                ])

                setStatsCurrent(currentData)
                setStatsPrevious(previousData)

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

    function buildStackedData(stats) {
        if (!stats?.monthly_by_category) return { labels: [], datasets: [] }

        const labels =
            selectedMonth === -1
                ? monthLabels
                : [monthLabels[selectedMonth - 1]]

        // Obtener categorías únicas
        const categories = [
            ...new Set(stats.monthly_by_category.map(item => item.category))
        ]

        const datasets = categories.map((category, index) => {

            const data = labels.map((_, monthIndex) => {
                const monthNumber =
                    selectedMonth === -1
                        ? monthIndex + 1
                        : selectedMonth

                const found = stats.monthly_by_category.find(
                    item =>
                        item.month === monthNumber &&
                        item.category === category
                )

                return found ? found.total : 0
            })

            const colors = [
                "rgba(99, 102, 241, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(249, 115, 22, 0.8)",
                "rgba(147, 51, 234, 0.8)",
                "rgba(59, 130, 246, 0.8)"
            ]

            return {
                label: category,
                data,
                backgroundColor: colors[index % colors.length],
            }
        })

        return { labels, datasets }
    }

    const dataStacked = buildStackedData(statsCurrent)

    const dataMultiAxis = {
        labels: monthLabels,
        datasets: [
            {
                label: `Egresos ${currentYear}`,
                data: monthlyCurrent,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                yAxisID: "y",
                tension: 0.4,
            },
            {
                label: `Egresos ${previousYear}`,
                data: monthlyPrevious,
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245,158,11,0.2)",
                yAxisID: "y1",
                tension: 0.4,
            }
        ]
    }
    const dataBar = {
        labels: monthLabels,
        datasets: [
            {
                label: `Egresos ${currentYear}`,
                data: monthlyCurrent,
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

    const multiAxisOptions = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                beginAtZero: true,
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    }

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

    const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" }
    },
    scales: {
        x: { stacked: true },
        y: {
            stacked: true,
            beginAtZero: true
        }
    }
}

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    return <div className="h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
        <NavBarUser onLogout={logout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="my-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-700">Resumen de los egresos</h1>
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
                    {statsCurrent && statsPrevious && (
                        <Line data={dataMultiAxis} options={multiAxisOptions} />
                    )}
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {statsCurrent && <Doughnut data={dataDoughnut} options={doughnutOptions} />}
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {statsCurrent && <Bar data={dataBar} options={barOptions} />}
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-min">
                    {statsCurrent && <Bar data={dataStacked} options={stackedOptions} />}
                </div>
            </div>

        </div>

    </div>

}

export default GraficosUsuarioPage
