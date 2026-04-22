import { prisma } from "../utils/prisma";
import { successResponse } from "../utils/response";

export async function GetDashboardData() {
    // 1. Dapatkan tanggal hari ini dalam zona waktu Jakarta (WIB)
    // Ini akan menghasilkan string "2026-04-22"
    const todayInJakarta = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
    const today = new Date().toLocaleDateString('en-CA');
    // 2. Buat objek Date untuk awal dan akhir hari berdasarkan zona Jakarta
    const start = new Date(`${todayInJakarta}T00:00:00.000+07:00`);
    const end = new Date(`${todayInJakarta}T23:59:59.999+07:00`);

    const [totalUser, totalArsip, arsipHariIni] = await Promise.all([
        prisma.user.count(),
        prisma.arsip.count(),
        prisma.arsip.count({
            where: {
                tanggal: {
                    // Mencari dari jam 00:00:00 sampai 23:59:59 hari ini
                    gte: new Date(`${today}T00:00:00.000Z`),
                    lte: new Date(`${today}T23:59:59.999Z`),
                },
            },
        }),
    ]);

    const data = {
        totalUser,
        totalArsip,
        arsipHariIni,
        debug: {
            todayString: todayInJakarta,
            filterStart: start.toISOString(),
            filterEnd: end.toISOString()
        }
    };

    return successResponse(data, "Data dashboard berhasil diambil", 200);
}