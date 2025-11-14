import * as z from "zod";

/**
 * Project form validation schema
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must be less than 500 characters"),
  description: z.string().min(1, "Description is required"),
  tech_stack: z
    .array(z.string().min(1))
    .min(1, "At least one technology is required"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  responsibilities: z.array(z.string()).optional().default([]),
  architecture: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  challenges: z.array(z.string()).optional().default([]),
  solutions: z.array(z.string()).optional().default([]),
  lessons: z.array(z.string()).optional().default([]),
  github_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  github_backend_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  live_demo_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  video_demo_url: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  main_image: z
    .union([z.string().url("Invalid URL"), z.literal("")])
    .optional(),
  images: z.array(z.string().url("Invalid URL")).optional().default([]),
  is_published: z.boolean().optional().default(false),
  translations: z
    .array(
      z.object({
        language: z.enum(["en", "ar"]),
        title: z.string().min(1, "Title is required"),
        summary: z.string().min(1, "Summary is required"),
        description: z.string().min(1, "Description is required"),
        architecture: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
