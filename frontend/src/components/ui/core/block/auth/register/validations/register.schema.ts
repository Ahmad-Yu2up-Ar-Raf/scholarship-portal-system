import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string("Nama wajib diisi").trim().min(3, "Minimal 3 karakter").max(100),
    email: z
      .string("Email wajib diisi")
      .trim()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .max(255),
    password: z.string("Password wajib diisi").min(8, "Minimal 8 karakter").max(255),
    confirm: z.string("Konfirmasi password wajib diisi").min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Password tidak cocok",
    path: ["confirm"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
