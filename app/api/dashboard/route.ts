import { Auth } from "@/app/lib/Auth";
import { GetDashboardData } from "@/app/services/DashboardService";
import { sendError } from "@/app/utils/response";
import { NextRequest } from "next/server";

export const GET = Auth(async (req: NextRequest, user: any) => {
    try {

        const result = await GetDashboardData();
        return result;
    } catch (error) {
        console.error("GET_USERS_ERROR:", error);
        return sendError("Gagal mengambil data user", 500, error);
    }
}, ["Admin", "Pegawai"]);
