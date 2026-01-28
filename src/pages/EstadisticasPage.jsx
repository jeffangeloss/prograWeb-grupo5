import NavBarAdmin from "../components/NavBarAdmin";

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

  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      data: [50, 80, 65, 120, 90, 140],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="bg-cover bg-center min-h-screen">
      <NavBarAdmin />
      <div className="px-5 py-5 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700 mb-3">
          Total de usuarios registrados
        </h1>
        <div className="bg-white/90 backdrop-blur border-2 border-black rounded-xl px-10 py-4 text-4xl  text-slate-700 font-bold mb-5">
          1,984
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-700 mb-4">Registros de usuarios por mes</h1>
        <div className="bg-white/90 backdrop-blur border-2 border-slate-700 rounded-xl p-6 w-full max-w-2xl">
          <Line data={data} />
        </div>

      </div>
    </div>
  );
}

export default EstadisticasPage
