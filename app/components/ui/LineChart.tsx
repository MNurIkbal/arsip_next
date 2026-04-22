"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// 1. Definisikan tipe data untuk Props
interface LineChartProps {
  data: { bulan: string; total: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  // 2. Siapkan data untuk sumbu X (Label Bulan) dan sumbu Y (Total Arsip)
  const categories = data.map((item) => item.bulan);
  const seriesData = data.map((item) => item.total);

  const chartOptions: any = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    colors: ["#4f46e5"], 
    xaxis: {
      // Masukkan kategori bulan dari props di sini
      categories: categories,
      labels: { style: { colors: "#9ca3af" } }
    },
    yaxis: {
      labels: { style: { colors: "#9ca3af" } }
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    markers: {
      size: 4,
      colors: ["#4f46e5"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: { theme: "light" },
  };

  const chartSeries = [
    {
      name: "Total Arsip",
      // Masukkan angka total dari props di sini
      data: seriesData,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Statistik Pengarsipan Per Bulan</h2>
      {/* 3. Render Chart hanya jika data tersedia */}
      {data.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Tidak ada data statistik tersedia
        </div>
      )}
    </div>
  );
}