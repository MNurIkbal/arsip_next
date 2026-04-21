import { updateArsip } from "@/app/services/ArsipService";
import { sendError, successResponse } from "@/app/utils/response";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  try {
    const { id } = await params;

    
    if (!id || isNaN(Number(id))) {
      return sendError("ID tidak valid atau tidak ditemukan.", 400);
    }

    const idData = id[0];

    const ids = parseInt(idData);

    if (isNaN(ids)) {
      return sendError("ID harus berupa angka valid", 400);
    }

    const update = updateArsip(ids, await req.formData());
    console.log(update);


    if (update) {
      return successResponse(null, "Data berhasil diperbarui", 200);
    }

    return sendError("Data tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message, error.message.includes("jangkauan") ? 400 : 500);
  }
}