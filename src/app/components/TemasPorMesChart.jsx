"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const meses = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const TemasPorMesChart = () => {
  const [data, setData] = useState({});
  const [mesSeleccionado, setMesSeleccionado] = useState("1");
  const [chartOptions, setChartOptions] = useState({});
  const [temaDetalle, setTemaDetalle] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/tema-mes`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }, []);

  useEffect(() => {
    if (!data[mesSeleccionado]) return;
  
    const temas = data[mesSeleccionado].map((item) => item.tema);
    const cantidades = data[mesSeleccionado].map((item) => item.cantidad);
  
    setChartOptions({
      chart: {
        type: "bar"
      },
      title: {
        text: `Temas más frecuentes en ${meses.find(m => m.value === mesSeleccionado).label}`
      },
      xAxis: {
        categories: temas,
        title: {
          text: "Temas"
        },
        labels: {
          style: {
            fontSize: "10px"
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: "Cantidad"
        }
      },
      series: [
        {
          name: "Cantidad",
          data: cantidades,
          point: {
            events: {
              click: function () {
                const temaSeleccionado = temas[this.index];
                const detalles = data[mesSeleccionado].find(item => item.tema === temaSeleccionado);
                setTemaDetalle({ ...detalles, mes: mesSeleccionado });
              }
            }
          }
        }
      ],
      tooltip: {
        pointFormat: "<b>{point.y}</b> casos"
      },
      credits: {
        enabled: false
      }
    });
  }, [data, mesSeleccionado]);
  

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white text-blue-600 font-bold">
      <h2 className="text-lg font-extrabold mb-4">Gráfico de Temas por Mes</h2>

      <div className="mb-4">
        <label htmlFor="mes" className="block text-sm font-medium mb-1">Seleccionar mes:</label>
        <select
          id="mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        >
          {meses.map((mes) => (
            <option key={mes.value} value={mes.value}>{mes.label}</option>
          ))}
        </select>
      </div>

      {chartOptions.series ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      ) : (
        <p>Cargando gráfico...</p>
      )}
      
      {/* Modal para resumen de datos*/}
      {temaDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-blue-800 relative transform opacity-0 pointer-events-auto animate-fadeInUp">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setTemaDetalle(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Detalle del Tema</h3>
            <p><strong>Mes:</strong> {meses.find(m => m.value === temaDetalle.mes).label}</p>
            <p><strong>Tema:</strong> {temaDetalle.tema}</p>
            <p><strong>Cantidad:</strong> {temaDetalle.cantidad}</p>
            <p className="text-gray-700">Acá agregamos la descripción de la barra y lo que representa.</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
              onClick={() => setTemaDetalle(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemasPorMesChart;
