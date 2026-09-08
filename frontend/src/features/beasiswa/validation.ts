import { z } from "zod"

export const beasiswaSchema = z.object({
  nama: z.string().trim().min(3, "Minimal 3 karakter").max(100, "Maksimal 100 karakter"),
  email: z.string().trim().email("Format email tidak valid").max(255),
  hp: z.string().regex(/^[0-9]+$/, "Hanya angka").min(10, "Minimal 10 digit").max(15, "Maksimal 15 digit"),
  semester: z.string().min(1, "Pilih semester").refine((v) => ["1","2","3","4","5","6","7","8"].includes(v), "Semester harus 1-8"),
  ipk: z.number().min(0).max(4),
  beasiswa: z.string().optional(),
  berkas: z.instanceof(File).nullable().optional(),
})

export type BeasiswaSchema = z.infer<typeof beasiswaSchema>
