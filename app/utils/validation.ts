import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password terlalu panjang"),
});

export const validateUser = (data: any, isEdit: boolean) => {
  const schema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(1, "Email  wajib diisi").email("Format email salah"),
    password: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(6, "Password minimal 6 karakter"),
    role: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(1, "Role wajib dipilih"),

    image: isEdit
      ? z.any().optional() 
      : z
          .instanceof(File, { message: "Foto wajib diunggah" })
          .refine((file) => file.size <= 5000000, "Ukuran maksimal 5MB")
          .refine(
            (file) =>
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            "Format harus JPG atau PNG",
          ),
  });

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      isValid: false,
      errors: Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0]]),
      ),
    };
  }

  return { isValid: true, errors: {} };
};

export enum KategoriArsip {
  UMUM = "Dokumen Umum",
  KHUSUS = "Dokumen Khusus",
  RAHASIA = "Dokumen Rahasia",
}

export const validateArsip = (data: any, isEdit: boolean) => {
  const schema = z.object({
    // 1. JUDUL & TANGGAL: Selalu Wajib (Create & Update)
    judul: z.string().min(1, "Judul wajib diisi"),
    tanggal: z.string().min(1, "Tanggal wajib diisi"),

    // 2. KATEGORI: Wajib saat Create, Optional saat Update
    kategori: isEdit
      ? z.nativeEnum(KategoriArsip).optional()
      : z.nativeEnum(KategoriArsip, {
          errorMap: () => ({ message: "Kategori wajib dipilih" }),
        }),
    id : isEdit ? z.number() : z.number().optional(),

    password_arsip: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => {
          if (data.kategori !== KategoriArsip.RAHASIA) return true;

          if (isEdit) {
            return !val || val.length >= 6;
          }

          // Jika Create: Wajib diisi dan minimal 6 karakter
          return !!val && val.length >= 6;
        },
        {
          message: "Password minimal 6 karakter wajib diisi untuk dokumen rahasia",
        }
      ),

    nama_dokumen: z
      .array(
        z.object({
          nama_dokumen: z.string().min(1, "Nama dokumen wajib diisi"),
          file: z.any()
            .refine((file) => {
              if (isEdit && (!file || typeof file === 'string')) return true;
              
              if (file instanceof File) return file.size <= 50 * 1024 * 1024;
              
              return !!file; // Wajib ada file jika create
            }, "File wajib diunggah dan maksimal 50MB")
            .refine((file) => {
              if (!file || typeof file === 'string') return true;
              if (file instanceof File) {
                return [
                  "application/pdf", "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "image/jpeg", "image/png", "image/jpg",
                ].includes(file.type);
              }
              return false;
            }, "Format harus PDF, Word, Excel, atau Gambar"),
        })
      )
      .min(isEdit ? 0 : 1, "Minimal harus ada 1 dokumen tambahan")
      .optional()
      .default([]),
  });

  const preparedData = {
    ...data,
    password_arsip: data.password_arsip || null,
  };

  const result = schema.safeParse(preparedData);

  if (!result.success) {
    const formattedErrors = result.error.format();
    return {
      isValid: false,
      errors: {
        judul: formattedErrors.judul?._errors[0],
        tanggal: formattedErrors.tanggal?._errors[0],
        kategori: formattedErrors.kategori?._errors[0],
        password_arsip: formattedErrors.password_arsip?._errors[0],
        attachments: formattedErrors.nama_dokumen,
      },
    };
  }

  return { isValid: true, errors: {}, data: result.data };
};