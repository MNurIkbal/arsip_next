import { prisma } from "../utils/prisma";
import { sendError, successResponse } from "../utils/response";
export async function GetDashboardData() {
    try {
        const [totalUser, totalArsip] = await Promise.all([
            prisma.user.count({
                where: { deleted_at: null }
            }),
            prisma.arsip.count({
                where: { deleted_at: null }
            }),
        ]);

        const result: any = await prisma.$queryRaw`
            SELECT COUNT(*) as total 
            FROM arsip 
            WHERE tanggal = CURDATE() 
        `;
        const arsipHariIni = result[0]?.total ? Number(result[0].total) : 0;
        const kategoriStats = await prisma.arsip.groupBy({
            by: ['kategori'],
            where: {
                deleted_at: null,
                kategori: {
                    in: ['Dokumen Khusus', 'Dokumen Rahasia', 'Dokumen Umum']
                }
            },
            _count: {
                kategori: true
            }
        });

        const arsipPerBulan: any = await prisma.$queryRaw`
            SELECT 
                DATE_FORMAT(tanggal, '%M') as bulan, 
                COUNT(*) as total 
            FROM arsip 
            WHERE YEAR(tanggal) = YEAR(CURDATE()) 
            AND deleted_at IS NULL
            GROUP BY MONTH(tanggal), DATE_FORMAT(tanggal, '%M')
            ORDER BY MONTH(tanggal) ASC
        `;

        const data = {
            totalUser,
            totalArsip,
            arsipHariIni,
            kategoriStats: kategoriStats.map((item : any) => ({
                kategori: item.kategori,
                total: item._count.kategori
            })),
            arsipPerBulan: arsipPerBulan.map((item: any) => ({
                bulan: item.bulan,
                total: Number(item.total)
            }))
        };

        return successResponse(data, "Data dashboard berhasil diambil", 200);

    } catch (error) {
        console.error("Dashboard Error:", error);
        return sendError("Gagal ambil data dashboard", 500);
    }
}