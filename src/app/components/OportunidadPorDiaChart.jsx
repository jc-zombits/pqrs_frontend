"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import Link from "next/link";

const meses = [
  { value: "all", label: "Todos los meses" },
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
  { value: "12", label: "Diciembre" }
];

const OportunidadPorDiaChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [resumen, setResumen] = useState(null);
  const [dataOriginal, setDataOriginal] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedYear !== "all") params.year = selectedYear;
      if (selectedMonth !== "all") params.month = selectedMonth;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/oportunidad-dia`,
        { params }
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Datos recibidos no son válidos");
      }

      const sortedData = response.data.sort((a, b) => 
        new Date(a.fecha) - new Date(b.fecha)
      );

      setDataOriginal(sortedData);

      const years = [...new Set(
        sortedData.map(item => new Date(item.fecha).getFullYear())
      )].sort((a, b) => a - b);
      
      setAvailableYears(years);

    } catch (error) {
      console.error("Error cargando los datos:", error);
      // Puedes agregar un estado para mostrar el error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (dataOriginal.length === 0) return;

    // Filtrar datos por año y mes seleccionados
    let dataFiltrada = dataOriginal;
    
    if (selectedYear !== "all") {
      dataFiltrada = dataFiltrada.filter(item => 
        new Date(item.fecha).getFullYear() === parseInt(selectedYear)
      );
    }
    
    if (selectedMonth !== "all") {
      dataFiltrada = dataFiltrada.filter(item => 
        new Date(item.fecha).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    // Agrupar por fecha para consolidar
    const groupedData = {};
    dataFiltrada.forEach(item => {
      const fecha = new Date(item.fecha).toISOString().split("T")[0];
      if (!groupedData[fecha]) {
        groupedData[fecha] = {
          fecha,
          oportuno: 0,
          no_oportuno: 0,
          a_tiempo: 0
        };
      }
      groupedData[fecha].oportuno += parseInt(item.oportuno) || 0;
      groupedData[fecha].no_oportuno += parseInt(item.no_oportuno) || 0;
      groupedData[fecha].a_tiempo += parseInt(item.a_tiempo) || 0;
    });

    const datosAgrupados = Object.values(groupedData);
    
    // Ordenar por fecha nuevamente
    datosAgrupados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const fechas = datosAgrupados.map(item => item.fecha);
    const oportunoData = datosAgrupados.map(item => item.oportuno);
    const noOportunoData = datosAgrupados.map(item => item.no_oportuno);
    const aTiempoData = datosAgrupados.map(item => item.a_tiempo);

    // Calcular resumen
    const resumenData = {
      oportuno: oportunoData.reduce((a, b) => a + b, 0),
      noOportuno: noOportunoData.reduce((a, b) => a + b, 0),
      aTiempo: aTiempoData.reduce((a, b) => a + b, 0),
    };
    setResumen(resumenData);

    // Configurar opciones del gráfico
    setChartOptions({
      title: { 
        text: `Oportunidades por Día${selectedYear !== "all" ? ` (${selectedYear})` : ""}${
          selectedMonth !== "all" ? ` - ${meses.find(m => m.value === selectedMonth)?.label}` : ""
        }`
      },
      xAxis: {
        categories: fechas,
        title: { text: "Fecha" },
        labels: {
          rotation: -45,
          style: { fontSize: "10px" },
          formatter: function() {
            return this.value.split("-").reverse().join("-"); // Formato DD-MM-YYYY
          }
        },
      },
      yAxis: {
        min: 0,
        title: { text: "Cantidad" },
        tickInterval: 5, // Ajusta este valor según tus necesidades
      },
      series: [
        {
          name: "Oportuno",
          data: oportunoData,
          color: "#2b908f",
        },
        {
          name: "No Oportuno",
          data: noOportunoData,
          color: "#f45b5b",
        },
        {
          name: "A Tiempo",
          data: aTiempoData,
          color: "#90ee7e",
        },
      ],
      chart: {
        type: "line",
        zoomType: "x",
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        formatter: function() {
          return `<b>${this.x}</b><br/>${
            this.points.map(point => 
              `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b>`
            ).join('<br/>')
          }`;
        }
      },
      plotOptions: {
        series: {
          marker: {
            radius: 3
          }
        }
      },
      credits: {
        enabled: false,
      },
    });
  }, [dataOriginal, selectedYear, selectedMonth]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl text-blue-400">
      <h2 className="text-lg font-semibold mb-4">Gráfico de Oportunidades por Día</h2>

      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1 text-blue-400">
                Filtrar por año:
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth("all"); // Resetear mes al cambiar año
                }}
                className="border p-2 rounded w-full"
              >
                <option value="all">Todos los años</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mes" className="block text-sm font-medium mb-1 text-blue-400">
                Filtrar por mes:
              </label>
              <select
                id="mes"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="all">Todos los meses</option>
                {meses.filter(m => m.value !== "all").map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {chartOptions.series ? (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          ) : (
            <p>Cargando gráfico...</p>
          )}

          {resumen && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Resumen Total</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Oportuno:</strong> {resumen.oportuno}
                </li>
                <li>
                  <strong>No Oportuno:</strong> {resumen.noOportuno}
                </li>
                <li>
                  <strong>A Tiempo:</strong> {resumen.aTiempo}
                </li>
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Link href="/graficas/estadisticas/grafica-oportunidades-dia">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition">
                Ver análisis completo →
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default OportunidadPorDiaChart;