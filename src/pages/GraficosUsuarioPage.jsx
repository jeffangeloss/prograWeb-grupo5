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
    Title
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import NavBarUser from "../components/NavBarUser"
import { useNavigate } from "react-router-dom"
import { isAdminPanelRole, normalizeRoleValue } from "../utils/roles"
import PopUp_ToLogin from "../components/PopUp_ToLogin"
import params from "../params"

ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    ArcElement,
    Legend,
    Title
);



function GraficosUsuarioPage() {
    const navigate = useNavigate()
    const [statsCurrent, setStatsCurrent] = useState(null)
    const [statsPrevious, setStatsPrevious] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(-1)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [popUpMensaje, setPopUpMensaje] = useState("")

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

    const actualYear = new Date().getFullYear()

    const [selectedYear1, setSelectedYear1] = useState(actualYear)
    const [selectedYear2, setSelectedYear2] = useState(actualYear - 1)

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

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    useEffect(function () {
        async function statsHTTP() {
            const token = obtenerToken()
            if (!token) {
                setLoading(false)
                setPopUpMensaje("No hay sesion activa. Inicia sesion nuevamente.")
                setPopUpVisible(true)
                return
            }

            setLoading(true)
            setPopUpVisible(false)

            async function fetchYear(year) {
                let url = `${params.API_URL}/expenses/stats?year=${year}`

                if (selectedMonth !== -1) {
                    url += `&month=${selectedMonth}`
                }

                const resp = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (resp.status === 401) {
                    setPopUpMensaje("Tu sesión ha expirado. Inicia sesión nuevamente.")
                    setPopUpVisible(true)
                    setLoading(false)
                    return null
                }

                if (!resp.ok) {
                    throw new Error("Error al obtener estadísticas")
                }

                return await resp.json()
            }

            try {
                const currentData = await fetchYear(selectedYear1)

                if (!currentData) return

                const previousData = await fetchYear(selectedYear2)
                setStatsCurrent(currentData)
                setStatsPrevious(previousData)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        statsHTTP()
    }, [selectedMonth, selectedYear1, selectedYear2])

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
                label: `Egresos ${selectedYear1}`,
                data: monthlyCurrent,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
                yAxisID: "y",
                tension: 0.4,
            },
            {
                label: `Egresos ${selectedYear2}`,
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
                label: `Egresos ${selectedYear1}`,
                data: monthlyCurrent,
                backgroundColor: "rgba(99, 102, 241, 0.8)",
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
        maintainAspectRatio: false,
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
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Egresos por categoría - ${selectedYear1}`,
                font: {
                    size: 16,
                    weight: "bold"
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },

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
            
            title: {
            display: true,
            text: `Egresos por categoría - ${selectedYear1}`,
            font: {
                size: 16,
                weight: "bold"
            },
            padding: {
                bottom: 20
            }
        },
            
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

    return <div className="h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
        <NavBarUser onLogout={logout} />
        <PopUp_ToLogin
            onLogout={logout}
            mensaje={popUpMensaje}
            visible={popUpVisible}
        />

        <div className="my-6 max-w-7xl mx-auto px-4 space-y-4">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <button
                    type="button"
                    className="w-full md:w-auto px-6 py-2 rounded-full border border-slate-300 hover:bg-slate-100 transition"
                    onClick={function () { navigate("/user") }}>← Regresar
                </button>

                <h1 className="text-2xl font-bold text-slate-700 text-center md:text-left">Resumen de los egresos</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4">

                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm text-slate-500 mb-1">Mes</label>
                        <select
                            value={selectedMonth}
                            onChange={function (e) {
                                setSelectedMonth(Number(e.target.value))
                            }}
                            className="rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-200"
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

                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm text-slate-500 mb-1">Año principal</label>
                        <select
                            value={selectedYear1}
                            onChange={(e) => setSelectedYear1(Number(e.target.value))}
                            className="rounded-lg border border-slate-300 px-3 py-2"
                        >
                            {[...Array(6)].map((_, i) => {
                                const year = actualYear - i
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm text-slate-500 mb-1">Comparar con</label>
                        <select
                            value={selectedYear2}
                            onChange={(e) => setSelectedYear2(Number(e.target.value))}
                            className="rounded-lg border border-slate-300 px-3 py-2"
                        >
                            {[...Array(6)].map((_, i) => {
                                const year = actualYear - i
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            {!statsCurrent ?
                (
                    <div className="text-center bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                        No se tienen egresos registrados de este año
                    </div>
                ) :
                (
                    <>
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
                    </>
                )
            }


        </div>

    </div>

}

export default GraficosUsuarioPage
