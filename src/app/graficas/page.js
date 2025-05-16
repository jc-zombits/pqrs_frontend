import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EstadoMesChart from "../components/EstadoMesChart";
import OportunidadPorDiaChart from "../components/OportunidadPorDiaChart";
import TemasPorMesChart from "../components/TemasPorMesChart";
import TemaEstadoChart from "../components/TemaEstadoChart";
import IngresosTotalMes from "../components/IngresosTotalMes";
import Resumen from "../components/Resumen"; // Asegúrate que la importación es correcta

export default async function GraficasPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      {/* Encabezado dentro del área principal */}
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-gray-600">
          Bienvenid@, <span className="font-semibold">{session?.user?.name}</span>
        </p>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-700">Dashboard de Gráficas</h1>
        <p className="text-gray-700">Visualización de datos PQRS</p>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Añade el componente Resumen aquí */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
          <Resumen />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <EstadoMesChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <OportunidadPorDiaChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
          <TemasPorMesChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
          <TemaEstadoChart />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
          <IngresosTotalMes />
        </div>
      </div>
    </>
  );
}