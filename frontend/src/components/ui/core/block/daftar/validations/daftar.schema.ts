import { z } from "zod";

export const beasiswaFormSchema = z.object({
  nama: z.string().trim().min(3, "Minimal 3 karakter").max(100),
  email: z.string().trim().email("Format email tidak valid").max(255),
  hp: z
    .string()
    .regex(/^[0-9]+$/, "Hanya angka")
    .min(10, "Minimal 10 digit")
    .max(15),
  semester: z
    .string()
    .min(1, "Pilih semester")
    .refine(
      (v) => ["1", "2", "3", "4", "5", "6", "7", "8"].includes(v),
      "Semester 1–8",
    ),
  ipk: z.number().min(0).max(4),
  beasiswa: z.string().min(1, "Pilih beasiswa"),
  scholarship_id: z.number().min(1, "Pilih beasiswa"),
  catatan: z
    .string()
    .trim()
    .min(20, "Ceritakan alasanmu (min 20 karakter)")
    .max(2000),
  asal_sekolah: z.string().trim().min(3, "Minimal 3 karakter").max(100),
  tanggal_lahir: z.string().trim().max(30),
  kota_domisili: z.string().trim().max(100),
  berkas: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "Upload berkas wajib")
    .max(1, "Maks 1 berkas"),
});

export type BeasiswaFormValues = z.infer<typeof beasiswaFormSchema>;
