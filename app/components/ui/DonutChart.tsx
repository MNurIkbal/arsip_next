"use client";

import dynamic from "next/dynamic";
// PENTING: ssr harus false agar tidak error di Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  data: { kategori: string; total: number }[];
}

export default function DonutChart({ data }: DonutChartProps) {
  // 1. Ekstrak label dan nilai dari props data
  const chartLabels = data.map((item) => item.kategori);
  const chartSeries = data.map((item) => item.total);
  
  // 2. Hitung total keseluruhan untuk ditampilkan di tengah donut
  const totalArsip = chartSeries.reduce((acc, curr) => acc + curr, 0);

  const chartOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    // Masukkan label kategori dari database
    labels: chartLabels, 
    colors: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"], // Tambahkan warna cadangan
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              // Formatter agar angka di tengah Donut sesuai dengan total data
              formatter: () => totalArsip.toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Statistik Sebaran Kategori</h2>
      {data.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="donut" height={300} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400 italic">
          Data kategori belum tersedia
        </div>
      )}
    </div>
  );
}