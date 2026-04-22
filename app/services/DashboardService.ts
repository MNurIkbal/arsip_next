import { prisma } from "../utils/prisma";
import { sendError, successResponse } from "../utils/response";

export async function GetDashboardData() {
    try {
        const [totalUser, totalArsip] = await Promise.all([
            prisma.user.count(),
            prisma.arsip.count(),
        ]);

        const result: any = await prisma.$queryRaw`
            SELECT COUNT(*) as total FROM arsip WHERE DATE(tanggal) = CURDATE()
        `;

        const arsipHariIni = Number(result[0].total);

        const data = {
            totalUser,
            totalArsip,
            arsipHariIni
        };
        return successResponse(data, "Data dashboard berhasil diambil", 200);

    } catch (error) {
        console.error(error);
        return sendError("Gagal ambil data", 500);
    }
}