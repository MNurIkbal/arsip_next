'use client';
import { useState, useEffect } from 'react';

// Definisikan interface sesuai dengan output API kita sebelumnya
interface DashboardData {
    totalUser: number;
    totalArsip: number;
    arsipHariIni: number;
    kategoriStats: { kategori: string; total: number }[];
    arsipPerBulan: { bulan: string; total: number }[];
}

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/dashboard'); // Sesuaikan endpoint API kamu
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || "Gagal mengambil data");
            }
        } catch (err) {
            setError("Terjadi kesalahan jaringan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Return fetchData juga supaya bisa "refresh" data manual (opsional)
    return { data, loading, error, refresh: fetchData };
};