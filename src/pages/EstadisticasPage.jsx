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
    <div className="bg-[url('/img/azul.png')] bg-cover bg-center min-h-screen">
      <NavBarAdmin />
      <div className="px-6 py-6 flex flex-col items-center">
        <h1 className="text-3xl text-white font-semibold mb-6">
          Total de usuarios registrados
        </h1>
        <div className="bg-white/90 backdrop-blur border-2 border-black rounded-xl px-20 py-6 text-4xl font-bold mb-10">
          1,984
        </div>
        <h1 className="text-3xl text-white font-semibold mb-6">Registros de usuarios por mes</h1>
        <div className="bg-white/90 backdrop-blur border-2 border-black rounded-xl p-6 w-full max-w-3xl">
          <Line data={data} />
        </div>

      </div>
    </div>
  );
}

export default EstadisticasPage
