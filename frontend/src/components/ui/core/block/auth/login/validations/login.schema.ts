import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string("Email wajib diisi")
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .max(255),
  password: z.string("Password wajib diisi").min(1, "Password wajib diisi").max(255),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
