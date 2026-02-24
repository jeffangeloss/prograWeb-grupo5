import NavBarAdmin from "../components/NavBarAdmin";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

function EstadisticasPage() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  

  function getSesion() {
    try {
      const raw = localStorage.getItem("DATOS_LOGIN");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function getToken() {
    const tokenLegacy = localStorage.getItem("TOKEN");
    if (tokenLegacy) return tokenLegacy;
    return getSesion()?.token || "";
  }

  const URL = "http://127.0.0.1:8000/admin/user_stats";
  const token = getToken();
  console.log(token)

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await fetch(URL, {
          headers: {
            "x-token": token
          }
        });

        if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);

        const data = await resp.json();

        if (!data.users_by_month) return;

        setTotalUsers(data.total_users);

        const monthNames = [
          "Ene", "Feb", "Mar", "Abr",
          "May", "Jun", "Jul", "Ago",
          "Sep", "Oct", "Nov", "Dic"
        ];

        const labels = data.users_by_month.map(item => {
          const monthIndex = parseInt(item.month.split("-")[1], 10) - 1;
          return monthNames[monthIndex];
        });

        const values = data.users_by_month.map(item => item.count);

        setChartData({
          labels,
          datasets: [{
            label: "Usuarios nuevos mensuales",
            data: values,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            tension: 0.4,
            fill: true
          }]
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchStats();
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="bg-cover bg-center min-h-screen">
      <NavBarAdmin onLogout={logout} />
      <div className="px-5 py-5 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700 mb-3">
          Total de usuarios registrados
        </h1>
        <div className="bg-white/90 backdrop-blur border-2 border-black rounded-xl px-10 py-4 text-4xl  text-slate-700 font-bold mb-5">
          {totalUsers}
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700 mb-4">Registros de usuarios por mes</h1>
        <div className="bg-white/90 backdrop-blur border-2 border-slate-700 rounded-xl p-6 w-full max-w-2xl">
          <Line data={chartData} />
        </div>

      </div>
    </div>
  );
}

export default EstadisticasPage
