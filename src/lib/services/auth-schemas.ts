import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
    email: z.string().email("Email non valida"),
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
