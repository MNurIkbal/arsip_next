'use client'
import { Calendar, FileText, Loader2, Users } from "lucide-react";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import { useDashboardData } from "@/app/hooks/DashboardHooks";

export default function DashboardUI() {
    const { data, loading, error } = useDashboardData();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <span className="ml-3 text-gray-500">Memuat statistik...</span>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;
    }
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card Total Pengguna */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="text-center md:text-left">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Pengguna</h2>
                        <p className="text-3xl font-black text-gray-800 mt-1">{data?.totalUser || 0}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <Users className="text-indigo-600" size={28} />
                    </div>
                </div>

                {/* Card Total Pengarsipan */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="text-center md:text-left">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Pengarsipan</h2>
                        <p className="text-3xl font-black text-gray-800 mt-1">{data?.totalArsip || 0}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <FileText className="text-emerald-600" size={28} />
                    </div>
                </div>

                {/* Card Total Arsip Hari Ini */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="text-center md:text-left">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Arsip Hari Ini</h2>
                        <p className="text-3xl font-black text-gray-800 mt-1">{data?.arsipHariIni}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <Calendar className="text-amber-600" size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LineChart data={data?.arsipPerBulan || []} />
                </div>

                <div className="lg:col-span-1">
                    <DonutChart data={data?.kategoriStats || []} />
                </div>
            </div>
        </>
    );
}