import * as z from "zod";

/**
 * Project form validation schema
 */
export const projectSchema = z.object({
  tech_stack: z
    .array(z.string().min(1))
    .min(1, "At least one technology is required"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  github_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  github_backend_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  live_demo_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  main_image: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  images: z.array(z.string().url("Invalid URL")).default([]),
  is_published: z.boolean().default(false),
  translations: z
    .array(
      z.object({
        language: z.enum(["en", "ar"]),
        title: z.string().min(1, "Title is required"),
        summary: z.string().min(1, "Summary is required"),
        description: z.string().min(1, "Description is required"),
        architecture: z.string().optional(),
        features: z.array(z.string()).default([]),
      })
    )
    .min(1, "At least one translation is required"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
